/**
 * Security utilities for frontend protection
 * Provides input sanitization, validation, and security helpers
 */

export function sanitizeInput(input: string): string {
  if (!input) return ""
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim()
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (typeof value === "string") {
        sanitized[key] = sanitizeInput(value)
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value)
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "string" ? sanitizeInput(item) : typeof item === "object" ? sanitizeObject(item) : item,
        )
      } else {
        sanitized[key] = value
      }
    }
  }
  return sanitized as T
}

export function isValidEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

export function validatePassword(password: string): {
  isValid: boolean
  score: number
  errors: string[]
} {
  const errors: string[] = []
  let score = 0

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères")
  } else {
    score += 1
  }

  if (password.length >= 12) score += 1

  if (/[a-z]/.test(password)) score += 1
  else errors.push("Ajoutez des lettres minuscules")

  if (/[A-Z]/.test(password)) score += 1
  else errors.push("Ajoutez des lettres majuscules")

  if (/[0-9]/.test(password)) score += 1
  else errors.push("Ajoutez des chiffres")

  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else errors.push("Ajoutez des caractères spéciaux (!@#$%...)")

  // Check for common weak patterns
  const weakPatterns = [
    /^123456/,
    /password/i,
    /qwerty/i,
    /azerty/i,
    /^(.)\1+$/, // repeated characters
  ]
  if (weakPatterns.some((pattern) => pattern.test(password))) {
    errors.push("Ce mot de passe est trop commun")
    score = Math.max(0, score - 2)
  }

  return {
    isValid: errors.length === 0 && score >= 4,
    score: Math.min(score, 6),
    errors,
  }
}

export function isValidPhone(phone: string): boolean {
  // Supports formats: +XXX XXX XXX XXX, 00XXX XXX XXX XXX, XX XXX XX XX
  const phoneRegex = /^(\+|00)?[1-9]\d{0,2}[\s.-]?\d{2,3}[\s.-]?\d{2,3}[\s.-]?\d{2,4}$/
  const cleanPhone = phone.replace(/[\s.-]/g, "")
  return phoneRegex.test(phone) && cleanPhone.length >= 8 && cleanPhone.length <= 15
}

export function isValidSiret(siret: string): boolean {
  const cleanSiret = siret.replace(/\s/g, "")
  if (!/^\d{14}$/.test(cleanSiret)) return false

  // Luhn algorithm validation
  let sum = 0
  for (let i = 0; i < 14; i++) {
    let digit = Number.parseInt(cleanSiret[i], 10)
    if (i % 2 === 0) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  isAllowed(key: string, maxAttempts = 5, windowMs = 60000): boolean {
    const now = Date.now()
    const entry = this.attempts.get(key)

    if (!entry || now > entry.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (entry.count >= maxAttempts) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingTime(key: string): number {
    const entry = this.attempts.get(key)
    if (!entry) return 0
    return Math.max(0, entry.resetTime - Date.now())
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

let csrfToken: string | null = null

export function setCsrfToken(token: string): void {
  csrfToken = token
}

export function getCsrfToken(): string | null {
  return csrfToken
}

export function generateSecureId(length = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp ? payload.exp * 1000 < Date.now() : false
  } catch {
    return true
  }
}

export const secureStorage = {
  set(key: string, value: string, encrypt = false): void {
    try {
      const data = encrypt ? btoa(value) : value
      sessionStorage.setItem(key, data)
    } catch (e) {
      console.error("SecureStorage set error:", e)
    }
  },

  get(key: string, decrypt = false): string | null {
    try {
      const data = sessionStorage.getItem(key)
      if (!data) return null
      return decrypt ? atob(data) : data
    } catch (e) {
      console.error("SecureStorage get error:", e)
      return null
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(key)
  },

  clear(): void {
    sessionStorage.clear()
  },
}

export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {},
): { isValid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes, allowedExtensions } = options

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Le fichier dépasse la taille maximale de ${Math.round(maxSize / 1024 / 1024)}MB`,
    }
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(", ")}`,
    }
  }

  if (allowedExtensions) {
    const ext = file.name.split(".").pop()?.toLowerCase()
    if (!ext || !allowedExtensions.includes(ext)) {
      return {
        isValid: false,
        error: `Extension non autorisée. Extensions acceptées: ${allowedExtensions.join(", ")}`,
      }
    }
  }

  // Check for suspicious file names
  const suspiciousPatterns = [/\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.sh$/i, /\.php$/i, /\.js$/i]
  if (suspiciousPatterns.some((pattern) => pattern.test(file.name))) {
    return { isValid: false, error: "Ce type de fichier n'est pas autorisé pour des raisons de sécurité" }
  }

  return { isValid: true }
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ["http:", "https:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

export function isInIframe(): boolean {
  if (typeof window === "undefined") return false

  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

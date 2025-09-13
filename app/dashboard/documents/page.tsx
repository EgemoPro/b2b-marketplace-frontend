"use client"
import { motion } from "framer-motion"
import { FileText, Building, User, Shield, Receipt } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentUpload } from "@/components/documents/document-upload"
import { DocumentList } from "@/components/documents/document-list"
import { useGetCompanyDocumentsQuery, useGetPersonalDocumentsQuery } from "@/lib/api/documents"

export default function DocumentsPage() {
  const { data: companyDocuments = [], isLoading: isLoadingCompany } = useGetCompanyDocumentsQuery()
  const { data: personalDocuments = [], isLoading: isLoadingPersonal } = useGetPersonalDocumentsQuery()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Gestion des Documents
        </h1>
        <p className="text-gray-600">Téléchargez et gérez vos documents d'entreprise, personnels et de vérification</p>
      </motion.div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Vérification
          </TabsTrigger>
          <TabsTrigger value="transaction" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <DocumentUpload category="company" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <DocumentList
              documents={companyDocuments}
              title="Documents d'entreprise"
              description="Contrats, factures, certificats et présentations"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <DocumentUpload category="personal" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <DocumentList
              documents={personalDocuments}
              title="Documents personnels"
              description="CV, certifications, diplômes et portfolios"
              showPublicIndicator={true}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <DocumentUpload category="verification" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <DocumentList
              documents={personalDocuments.filter((doc) => doc.category === "verification")}
              title="Documents de vérification"
              description="KBIS, SIRET, pièces d'identité et licences"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="transaction" className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <DocumentUpload category="transaction_proof" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <DocumentList
              documents={companyDocuments.filter((doc) => doc.category === "transaction_proof")}
              title="Preuves de transaction"
              description="Preuves de livraison, de réalisation, factures et reçus"
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

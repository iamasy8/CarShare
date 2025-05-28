"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Plus, Eye, Trash, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { adminService, AdminDocument } from "@/lib/api/adminService"
import { toast } from "@/components/ui/use-toast"

export default function AdminDocumentsPage() {
  const { user, isAdmin, isSuperAdmin } = useAuth()
  const [documents, setDocuments] = useState<AdminDocument[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDoc, setSelectedDoc] = useState<AdminDocument | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState<boolean>(false)
  const [approvalStatus, setApprovalStatus] = useState<'approved' | 'rejected'>('approved')
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [processingAction, setProcessingAction] = useState<boolean>(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false)
  const [uploadData, setUploadData] = useState({
    type: '',
    file: null as File | null
  })
  
  // Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDocuments(1);
        setDocuments(response.documents);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load documents. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin || isSuperAdmin) {
      fetchDocuments();
    }
  }, [isAdmin, isSuperAdmin]);

  // Handle document approval/rejection
  const handleApproveDocument = async () => {
    if (!selectedDoc) return;
    
    try {
      setProcessingAction(true);
      await adminService.updateDocumentStatus(
        selectedDoc.id, 
        approvalStatus, 
        approvalStatus === 'rejected' ? rejectionReason : undefined
      );
      
      // Refresh documents list
      const response = await adminService.getDocuments(1);
      setDocuments(response.documents);
      
      toast({
        title: 'Success',
        description: `Document ${approvalStatus === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
      
      setShowApprovalDialog(false);
      setRejectionReason('');
    } catch (error) {
      console.error(`Failed to ${approvalStatus} document:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${approvalStatus} document. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle document upload
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.type || !uploadData.file) {
      toast({
        title: 'Missing information',
        description: 'Please select a document type and file.',
        variant: 'destructive',
      });
      return;
    }
    
    // This would normally connect to a real backend API
    toast({
      title: 'Upload functionality',
      description: 'Document upload would be implemented with a real backend API.',
    });
    
    setUploadDialogOpen(false);
  };

  // Handle document view
  const handleViewDocument = (doc: AdminDocument) => {
    setSelectedDoc(doc);
    // In a real implementation, you might open a modal or navigate to a document viewer
    toast({
      title: 'View Document',
      description: `Viewing ${doc.filename}`,
    });
  };

  // Handle document download
  const handleDownloadDocument = (doc: AdminDocument) => {
    // In a real implementation, you would initiate a download from the backend
    toast({
      title: 'Download Document',
      description: `Downloading ${doc.filename}`,
    });
  };

  // Get status badge for document
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setLoading(true);
              adminService.getDocuments(1).then(res => {
                setDocuments(res.documents);
                setLoading(false);
                toast({
                  title: 'Refreshed',
                  description: 'Documents updated successfully.',
                });
              }).catch(err => {
                console.error('Failed to refresh documents:', err);
                setLoading(false);
                toast({
                  title: 'Error',
                  description: 'Failed to refresh documents.',
                  variant: 'destructive',
                });
              });
            }} 
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button 
            className="flex items-center"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Document
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bibliothèque de Documents</CardTitle>
          <CardDescription>
            Gérez les documents officiels et ressources de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableCaption>Liste des documents de la plateforme</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'upload</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? documents.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        {doc.filename}
                      </div>
                    </TableCell>
                    <TableCell>{doc.userName}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>{format(new Date(doc.uploadedAt), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {doc.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setShowApprovalDialog(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucun document trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Document Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validation de document</DialogTitle>
            <DialogDescription>
              Veuillez approuver ou rejeter ce document : {selectedDoc?.filename}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Label>Statut</Label>
              <Select 
                value={approvalStatus} 
                onValueChange={(value: 'approved' | 'rejected') => setApprovalStatus(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choisir un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approuver</SelectItem>
                  <SelectItem value="rejected">Rejeter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {approvalStatus === 'rejected' && (
              <div className="space-y-2">
                <Label htmlFor="reason">Raison du rejet</Label>
                <Input
                  id="reason"
                  placeholder="Veuillez indiquer la raison du rejet"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApprovalDialog(false)}
              disabled={processingAction}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleApproveDocument}
              disabled={approvalStatus === 'rejected' && !rejectionReason.trim() || processingAction}
            >
              {processingAction ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : approvalStatus === 'approved' ? (
                <>Approuver</>
              ) : (
                <>Rejeter</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau document</DialogTitle>
            <DialogDescription>
              Chargez un nouveau document à la bibliothèque de la plateforme.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUploadDocument} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="docType">Type de document</Label>
              <Select 
                onValueChange={(value) => setUploadData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="docType" className="w-full">
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="legal">Document légal</SelectItem>
                  <SelectItem value="contract">Contrat</SelectItem>
                  <SelectItem value="guide">Guide utilisateur</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="docFile">Fichier</Label>
              <Input
                id="docFile"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setUploadData(prev => ({ ...prev, file }));
                }}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Télécharger
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

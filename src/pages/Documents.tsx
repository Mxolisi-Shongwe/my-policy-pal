import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Search, FolderOpen, Trash2, Download, Eye, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { auth, db } from '@/integrations/firebase/config';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

interface Document {
  id: string;
  name: string;
  type: 'personal' | 'policy' | 'investment' | 'tax' | 'statement' | 'other';
  category: string;
  uploadDate: string;
  size: string;
  relatedItemId?: string;
  fileData?: string;
  fileType?: string;
  expiryDate?: string;
}

const documentTypeLabels: Record<Document['type'], string> = {
  personal: 'Personal Document',
  policy: 'Policy Document',
  investment: 'Investment Document',
  tax: 'Tax Document',
  statement: 'Statement',
  other: 'Other',
};

const documentTypeColors: Record<Document['type'], string> = {
  personal: 'bg-purple-500/10 text-purple-400',
  policy: 'bg-primary/10 text-primary',
  investment: 'bg-success/10 text-success',
  tax: 'bg-warning/10 text-warning',
  statement: 'bg-blue-500/10 text-blue-400',
  other: 'bg-muted text-muted-foreground',
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<Document['type']>('personal');
  const [newDocCategory, setNewDocCategory] = useState('');
  const [newDocExpiryDate, setNewDocExpiryDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'documents'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document));
      setDocuments(docs);
    });

    return () => unsubscribe();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleUpload = async () => {
    if (!newDocName.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error('Not authenticated');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target?.result as string;
        
        await addDoc(collection(db, 'documents'), {
          name: newDocName,
          type: newDocType,
          category: newDocCategory || 'General',
          uploadDate: new Date().toISOString(),
          size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
          userId: user.uid,
          fileData,
          fileType: selectedFile.type,
          expiryDate: newDocExpiryDate || null,
        });

        setUploadDialogOpen(false);
        setNewDocName('');
        setNewDocType('personal');
        setNewDocCategory('');
        setNewDocExpiryDate('');
        setSelectedFile(null);
        toast.success('Document uploaded successfully');
        setUploading(false);
      };
      
      reader.onerror = () => {
        toast.error('Failed to read file');
        setUploading(false);
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.message || 'Failed to upload document');
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'documents', id));
      toast.success('Document deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleView = (doc: Document) => {
    if (doc.fileData) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<iframe src="${doc.fileData}" width="100%" height="100%" style="border:none;"></iframe>`);
      }
    } else {
      toast.info('No file data available');
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.name;
      link.click();
    } else {
      toast.info('No file data available');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">Store and manage all your financial documents</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>Add a new document to your collection</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Document Name</Label>
                <Input
                  placeholder="e.g., Policy Certificate 2024.pdf"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <Select value={newDocType} onValueChange={(v) => setNewDocType(v as Document['type'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Document</SelectItem>
                      <SelectItem value="policy">Policy Document</SelectItem>
                      <SelectItem value="investment">Investment Document</SelectItem>
                      <SelectItem value="tax">Tax Document</SelectItem>
                      <SelectItem value="statement">Statement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newDocCategory} onValueChange={setNewDocCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ID Document">ID Document</SelectItem>
                      <SelectItem value="Driver's License">Driver's License</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Life Insurance">Life Insurance</SelectItem>
                      <SelectItem value="Car Insurance">Car Insurance</SelectItem>
                      <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                      <SelectItem value="Medical Aid">Medical Aid</SelectItem>
                      <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                      <SelectItem value="Tax Return">Tax Return</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {newDocType === 'personal' && (
                <div className="space-y-2">
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={newDocExpiryDate}
                    onChange={(e) => setNewDocExpiryDate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    For documents like ID, License, Passport
                  </p>
                </div>
              )}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB
                  </p>
                </label>
              </div>
              <Button className="w-full" onClick={handleUpload} disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="personal">Personal Documents</SelectItem>
                <SelectItem value="policy">Policy Documents</SelectItem>
                <SelectItem value="investment">Investment Documents</SelectItem>
                <SelectItem value="tax">Tax Documents</SelectItem>
                <SelectItem value="statement">Statements</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first document to get started'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="glass-card hover:border-primary/30 transition-colors group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${documentTypeColors[doc.type]}`}>
                        {documentTypeLabels[doc.type]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded {format(new Date(doc.uploadDate), 'dd MMM yyyy')}
                    </p>
                    {doc.expiryDate && (
                      <p className="text-xs font-medium mt-1 text-warning">
                        Expires: {format(new Date(doc.expiryDate), 'dd MMM yyyy')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleView(doc)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{documents.length}</p>
            <p className="text-sm text-muted-foreground">Total Documents</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {documents.filter((d) => d.type === 'personal').length}
            </p>
            <p className="text-sm text-muted-foreground">Personal</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {documents.filter((d) => d.type === 'policy').length}
            </p>
            <p className="text-sm text-muted-foreground">Policies</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {documents.filter((d) => d.type === 'investment').length}
            </p>
            <p className="text-sm text-muted-foreground">Investments</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {documents.filter((d) => d.type === 'tax').length}
            </p>
            <p className="text-sm text-muted-foreground">Tax Documents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

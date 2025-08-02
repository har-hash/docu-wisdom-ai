import { useState } from 'react';
import { Brain, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { ChatInterface } from '@/components/ChatInterface';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
}

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFiles(prev => {
      const existingIndex = prev.findIndex(f => f.id === file.id);
      if (existingIndex >= 0) {
        const newFiles = [...prev];
        newFiles[existingIndex] = file;
        return newFiles;
      }
      return [...prev, file];
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const hasDocuments = uploadedFiles.some(file => file.status === 'ready');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-ai flex items-center justify-center shadow-glow">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DocuMind AI</h1>
                <p className="text-sm text-muted-foreground">Intelligent Document Q&A System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{uploadedFiles.length} documents</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>RAG Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {uploadedFiles.length === 0 ? (
          // Welcome & Upload State
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 rounded-2xl gradient-ai flex items-center justify-center shadow-glow mb-6 animate-pulse-glow">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Intelligent Document Analysis
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Upload any document and ask natural language questions. Our AI will analyze the content 
                using advanced RAG (Retrieval-Augmented Generation) to provide accurate, source-backed answers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 text-center shadow-card transition-smooth hover:shadow-ai">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Upload Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Support for PDF, DOCX, and TXT files with intelligent text extraction
                </p>
              </Card>
              
              <Card className="p-6 text-center shadow-card transition-smooth hover:shadow-ai">
                <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Ask Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Natural language queries with contextual understanding
                </p>
              </Card>
              
              <Card className="p-6 text-center shadow-card transition-smooth hover:shadow-ai">
                <div className="w-12 h-12 rounded-lg gradient-glow flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  RAG-powered responses with source citations and confidence scores
                </p>
              </Card>
            </div>

            <DocumentUpload
              onFileUploaded={handleFileUploaded}
              uploadedFiles={uploadedFiles}
              onRemoveFile={handleRemoveFile}
            />
          </div>
        ) : (
          // Main Application Interface
          <div className="h-[calc(100vh-140px)]">
            <Card className="h-full shadow-card">
              <ChatInterface
                hasDocuments={hasDocuments}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

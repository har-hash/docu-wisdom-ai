import { useState } from 'react';
import { FileText, Search, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface DocumentViewerProps {
  documents: Array<{
    id: string;
    name: string;
    content?: string;
    status: string;
  }>;
  highlightedText?: string;
}

export const DocumentViewer = ({ documents, highlightedText }: DocumentViewerProps) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const activeDocument = documents.find(doc => doc.id === selectedDocument) || documents[0];

  const highlightText = (text: string, searchTerm: string, highlightedText?: string) => {
    if (!text) return '';
    
    let result = text;
    
    // Highlight search term
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      result = result.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    }
    
    // Highlight AI-selected text
    if (highlightedText) {
      const regex = new RegExp(`(${highlightedText})`, 'gi');
      result = result.replace(regex, '<mark class="bg-primary/20 border border-primary/40">$1</mark>');
    }
    
    return result;
  };

  const getDocumentStats = (content?: string) => {
    if (!content) return { words: 0, pages: 0, chars: 0 };
    
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    const chars = content.length;
    const pages = Math.ceil(words / 250); // Approximate 250 words per page
    
    return { words, pages, chars };
  };

  if (documents.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center p-8 shadow-card">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Documents</h3>
          <p className="text-muted-foreground">Upload documents to view them here</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Document Tabs */}
      <div className="border-b bg-background/95 backdrop-blur p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Document Viewer</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {documents.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {documents.map((doc) => (
              <Button
                key={doc.id}
                variant={selectedDocument === doc.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDocument(doc.id)}
                className="whitespace-nowrap"
              >
                <FileText className="h-4 w-4 mr-2" />
                {doc.name}
                <Badge 
                  variant={doc.status === 'ready' ? 'default' : 'secondary'}
                  className="ml-2 text-xs"
                >
                  {doc.status}
                </Badge>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeDocument && activeDocument.content ? (
          <div className="space-y-4">
            {/* Document Info */}
            <Card className="p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-ai flex items-center justify-center shadow-glow">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{activeDocument.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{getDocumentStats(activeDocument.content).words} words</span>
                      <span>•</span>
                      <span>{getDocumentStats(activeDocument.content).pages} pages</span>
                      <span>•</span>
                      <span>{getDocumentStats(activeDocument.content).chars} characters</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Full Screen
                </Button>
              </div>
            </Card>

            {/* Document Text */}
            <Card className="p-6 shadow-card">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightText(activeDocument.content, searchTerm, highlightedText)
                }}
              />
            </Card>
          </div>
        ) : (
          <Card className="h-full flex items-center justify-center p-8 shadow-card">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Processing Document</h3>
              <p className="text-muted-foreground">Please wait while we process your document...</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
}

interface DocumentUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export const DocumentUpload = ({ onFileUploaded, uploadedFiles, onRemoveFile }: DocumentUploadProps) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const fileId = `${Date.now()}-${file.name}`;
      
      // Create initial file object
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      onFileUploaded(uploadedFile);

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Read file content
        const text = await readFileAsText(file);
        
        // Update file with content and mark as processing
        const processingFile = {
          ...uploadedFile,
          content: text,
          status: 'processing' as const,
          progress: 100
        };
        onFileUploaded(processingFile);

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mark as ready
        const readyFile = {
          ...processingFile,
          status: 'ready' as const
        };
        onFileUploaded(readyFile);

        toast({
          title: "Document uploaded successfully",
          description: `${file.name} is ready for questions`,
        });

      } catch (error) {
        console.error('Error processing file:', error);
        const errorFile = {
          ...uploadedFile,
          status: 'error' as const
        };
        onFileUploaded(errorFile);
        
        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        });
      }
    }
  }, [onFileUploaded, toast]);

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />;
      case 'ready':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'ready':
        return 'Ready for questions';
      case 'error':
        return 'Error occurred';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 border-2 border-dashed transition-smooth hover:border-primary/50 shadow-card">
        <div
          {...getRootProps()}
          className={`cursor-pointer text-center space-y-4 ${
            isDragActive ? 'opacity-80 scale-105' : ''
          } transition-bounce`}
        >
          <input {...getInputProps()} />
          <div className="mx-auto w-16 h-16 rounded-full gradient-ai flex items-center justify-center shadow-glow">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
            <p className="text-muted-foreground mb-4">
              Drag & drop your documents here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOCX, and TXT files
            </p>
          </div>
          <Button variant="ai" size="lg" className="mt-4">
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Documents</h3>
          {uploadedFiles.map((file) => (
            <Card key={file.id} className="p-4 shadow-card transition-smooth hover:shadow-ai">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(file.status)}
                        <span>{getStatusText(file.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFile(file.id)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {(file.status === 'uploading' || file.status === 'processing') && (
                <div className="mt-3">
                  <Progress 
                    value={uploadProgress[file.id] || file.progress} 
                    className="h-2"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
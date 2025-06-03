"use client";

import { useState, ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function DatasetUploader() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log("Selected file:", file.name);
      toast({
        title: "File Selected (Placeholder)",
        description: `${file.name} is ready for upload.`,
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
    toast({
        title: "File Removed",
        description: "The selected file has been removed.",
      });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 p-1">
      {uploadedFile ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="truncate">
              <p className="font-medium text-sm truncate">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={removeFile} aria-label="Remove file" className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileInput(); }}
          role="button"
          tabIndex={0}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring transition-colors"
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Click to select your image dataset
          </p>
          <p className="text-xs text-muted-foreground mt-1">(Images: .png, .jpg, .jpeg)</p>
        </div>
      )}
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        id="dataset-upload-input"
      />
      <Button 
        onClick={() => {
            if (uploadedFile) {
                toast({title: "Upload Started (Placeholder)", description: `Uploading ${uploadedFile.name}...`});
                // Actual upload logic would go here
            } else {
                toast({title: "No File Selected", description: "Please select a file to upload.", variant: "destructive"});
            }
        }} 
        disabled={!uploadedFile} 
        className="w-full sm:w-auto"
        variant="outline"
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        Upload Selected Dataset
      </Button>
    </div>
  );
}

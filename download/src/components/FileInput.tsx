
"use client";

import React, { useRef } from 'react';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { UploadCloud, FileVideo, XCircle, FileImage } from 'lucide-react';
import { CardDescription } from './ui/card';

interface FileInputProps {
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  icon?: React.ReactNode;
  accept?: string;
  description?: string;
}

const FileInput: React.FC<FileInputProps> = ({ id, label, file, onFileChange, icon, accept, description }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isVideo = file?.type.startsWith('video/');
  const isImage = file?.type.startsWith('image/');

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </Label>
      <div
        className={cn(
          'relative flex items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/80 transition-colors p-4',
          file ? 'border-primary' : 'border-border'
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          id={id}
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
          accept={accept}
        />
        {file ? (
          <div className="flex items-center gap-2 text-sm text-foreground">
            {isVideo && <FileVideo className="h-5 w-5 text-accent" />}
            {isImage && <FileImage className="h-5 w-5 text-accent" />}
            <span className="truncate max-w-[150px]">{file.name}</span>
            <button onClick={handleRemoveFile} className="z-10 text-muted-foreground hover:text-destructive">
              <XCircle size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
            <UploadCloud className="h-8 w-8" />
            <p className="text-sm">Click or drag file to upload</p>
          </div>
        )}
      </div>
      {description && <CardDescription className="text-xs pt-1">{description}</CardDescription>}
    </div>
  );
};

export default FileInput;

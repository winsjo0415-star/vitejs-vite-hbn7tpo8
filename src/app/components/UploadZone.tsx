// Drag and drop upload zone for game files

import { Upload, FileCode, FileJson, FileType } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Card } from './ui/card';
import { readFileAsText, generateId } from '../lib/storage';
import { GameFile } from '../lib/types';
import { toast } from 'sonner';

interface UploadZoneProps {
  onFilesUploaded: (files: GameFile[]) => void;
}

export function UploadZone({ onFilesUploaded }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(async (fileList: FileList) => {
    const files = Array.from(fileList);
    const validExtensions = ['.html', '.js', '.json'];
    
    const validFiles = files.filter(file => {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      return validExtensions.includes(ext);
    });

    if (validFiles.length === 0) {
      toast.error('Please upload HTML, JS, or JSON files only');
      return;
    }

    try {
      const uploadedFiles: GameFile[] = await Promise.all(
        validFiles.map(async (file) => {
          const content = await readFileAsText(file);
          const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.') + 1);
          
          return {
            id: generateId(),
            name: file.name,
            type: ext as 'html' | 'js' | 'json',
            content,
            size: file.size,
            uploadedAt: Date.now()
          };
        })
      );

      onFilesUploaded(uploadedFiles);
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error('Error uploading files');
      console.error(error);
    }
  }, [onFilesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  return (
    <Card
      className={`relative p-12 border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
          : 'border-muted-foreground/30 hover:border-muted-foreground/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        id="file-upload"
        multiple
        accept=".html,.js,.json"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center gap-4 cursor-pointer"
      >
        <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <Upload className="h-12 w-12 text-blue-500" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl">Drop your game files here</h3>
          <p className="text-sm text-muted-foreground">
            or click to browse
          </p>
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50">
            <FileType className="h-4 w-4 text-orange-500" />
            <span className="text-xs">HTML</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50">
            <FileCode className="h-4 w-4 text-yellow-500" />
            <span className="text-xs">JS</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50">
            <FileJson className="h-4 w-4 text-green-500" />
            <span className="text-xs">JSON</span>
          </div>
        </div>
      </label>
    </Card>
  );
}

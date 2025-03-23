"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

interface FileUploaderProps {
  onFilesUploadedAction: (files: File[]) => void; // Renamed the prop
  acceptedFileTypes?: string;
  maxFiles?: number;
}

export function FileUploader({
  onFilesUploadedAction,
  acceptedFileTypes = ".pdf,.doc,.docx,.txt,.rtf",
  maxFiles = 10,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const acceptedExtensions = acceptedFileTypes.split(",").map((type) => type.trim().toLowerCase());

      const validFiles = filesArray.filter((file) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase();
        return acceptedExtensions.includes(extension);
      });

      if (validFiles.length > 0) {
        onFilesUploadedAction(validFiles.slice(0, maxFiles)); // Updated function name
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesUploadedAction(filesArray.slice(0, maxFiles)); // Updated function name

      // Reset the input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes}
        multiple
        className="hidden"
      />

      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />

      <h3 className="mt-2 text-lg font-semibold">Drag and drop your resumes here</h3>

      <p className="mt-1 text-sm text-muted-foreground">Or click the button below to browse files</p>

      <Button onClick={handleButtonClick} variant="outline" className="mt-4">
        Select Files
      </Button>

      <p className="mt-2 text-xs text-muted-foreground">
        Accepted file types: {acceptedFileTypes.split(",").join(", ")} (max {maxFiles} files)
      </p>
    </div>
  );
}

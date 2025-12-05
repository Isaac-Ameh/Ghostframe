'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (file: File) => Promise<void>;
  acceptedTypes: string[];
  maxSize: number;
  isLoading?: boolean;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileUpload,
  acceptedTypes,
  maxSize,
  isLoading = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `👻 File type not supported. Please upload: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxSize) {
      return `💀 File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }
    return null;
  };

  const processFile = async (file: File) => {
    const validation = validateFile(file);
    if (validation) {
      const errorFile: UploadedFile = {
        file,
        status: 'error',
        progress: 0,
        error: validation,
      };
      setUploadedFiles(prev => [...prev, errorFile]);
      return;
    }

    const uploadFile: UploadedFile = {
      file,
      status: 'uploading',
      progress: 0,
    };

    setUploadedFiles(prev => [...prev, uploadFile]);

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadedFiles(prev =>
          prev.map(f =>
            f.file === file ? { ...f, progress } : f
          )
        );
      }

      await onFileUpload(file);

      setUploadedFiles(prev =>
        prev.map(f =>
          f.file === file ? { ...f, status: 'success', progress: 100 } : f
        )
      );
    } catch (error) {
      setUploadedFiles(prev =>
        prev.map(f =>
          f.file === file
            ? { ...f, status: 'error', error: 'Upload failed. Please try again.' }
            : f
        )
      );
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        await processFile(file);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      for (const file of files) {
        await processFile(file);
      }
      // Reset input
      e.target.value = '';
    },
    [onFileUpload]
  );

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Zone */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-haunted-orange bg-haunted-orange/10'
            : 'border-eerie-purple/50 bg-phantom-gray/30'
        } ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-haunted-orange hover:bg-haunted-orange/5'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        <motion.div
          animate={{ y: isDragOver ? -5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className="h-12 w-12 text-haunted-orange mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-ghost-white mb-2">
            {isDragOver ? '👻 Drop your files here!' : 'Upload Learning Materials'}
          </h3>
          <p className="text-gray-400 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <div className="text-sm text-gray-500">
            <p>Supported formats: {acceptedTypes.join(', ')}</p>
            <p>Maximum size: {(maxSize / 1024 / 1024).toFixed(1)}MB per file</p>
          </div>
        </motion.div>

        {/* 🎃 KIRO INTEGRATION POINT: Future hooks will auto-process uploads */}
        {isLoading && (
          <div className="absolute inset-0 bg-phantom-gray/80 rounded-xl flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-haunted-orange"
            >
              <Upload className="h-8 w-8" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 space-y-3"
          >
            <h4 className="text-lg font-semibold text-ghost-white">Uploaded Files</h4>
            {uploadedFiles.map((uploadedFile, index) => (
              <motion.div
                key={`${uploadedFile.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="ghost-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <File className="h-5 w-5 text-eerie-purple" />
                    <div className="flex-1 min-w-0">
                      <p className="text-ghost-white font-medium truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status Icon */}
                    {uploadedFile.status === 'uploading' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="text-haunted-orange"
                      >
                        <Upload className="h-5 w-5" />
                      </motion.div>
                    )}
                    {uploadedFile.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-spectral-green" />
                    )}
                    {uploadedFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-blood-red" />
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(uploadedFile.file)}
                      className="text-gray-400 hover:text-blood-red transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {uploadedFile.status === 'uploading' && (
                  <div className="mt-3">
                    <div className="bg-phantom-gray rounded-full h-2">
                      <motion.div
                        className="bg-haunted-orange h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadedFile.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {uploadedFile.progress}% uploaded
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {uploadedFile.status === 'error' && uploadedFile.error && (
                  <div className="mt-2 text-blood-red text-sm">
                    {uploadedFile.error}
                  </div>
                )}

                {/* Success Message */}
                {uploadedFile.status === 'success' && (
                  <div className="mt-2 text-spectral-green text-sm">
                    ✨ File processed successfully! Ready for AI generation.
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
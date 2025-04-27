"use client"

import { useState, useRef, ChangeEvent } from "react"
import { X, Upload, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface FileUploadProps {
  onChange: (files: File[]) => void
  value?: File[]
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: string
  className?: string
  disabled?: boolean
  onError?: (message: string) => void
}

export function FileUpload({
  onChange,
  value = [],
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/*",
  className,
  disabled = false,
  onError,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(value)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles)
    // Reset input value so selecting the same file again will trigger an event
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleFiles = (selectedFiles: File[]) => {
    if (!multiple && selectedFiles.length > 1) {
      const errorMsg = "Vous ne pouvez télécharger qu'un seul fichier"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    if (multiple && files.length + selectedFiles.length > maxFiles) {
      const errorMsg = `Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    // Validate file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      const maxSizeMB = maxSize / (1024 * 1024)
      const errorMsg = `Certains fichiers dépassent la taille maximale de ${maxSizeMB} MB`
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    // Simulate upload
    setError(null)
    if (selectedFiles.length > 0) {
      simulateUpload(selectedFiles)
    }
  }

  const simulateUpload = (selectedFiles: File[]) => {
    setUploading(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          
          // Update files state and call onChange
          const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles
          setFiles(newFiles)
          onChange(newFiles)
          
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled) return
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    onChange(newFiles)
  }

  const triggerFileSelect = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={disabled ? undefined : triggerFileSelect}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium mb-1">
            Glissez-déposez vos fichiers ou cliquez pour parcourir
          </p>
          <p className="text-xs text-gray-500">
            {multiple
              ? `Jusqu'à ${maxFiles} fichiers, maximum ${maxSize / (1024 * 1024)} MB chacun`
              : `Maximum ${maxSize / (1024 * 1024)} MB`}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Téléchargement en cours...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md text-sm"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="truncate">{file.name}</span>
                <span className="text-gray-500 text-xs">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                disabled={disabled}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 
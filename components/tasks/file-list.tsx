'use client'

import { useState } from 'react'
import { Download, Trash2, File, Loader2 } from 'lucide-react'

interface FileRecord {
  id: string
  name: string
  url: string
  size: number
  type: string
  createdAt: string
  uploadedBy: {
    name: string
    email: string
  }
}

interface FileListProps {
  files: FileRecord[]
  onFileDeleted: (fileId: string) => void
}

export default function FileList({ files, onFileDeleted }: FileListProps) {
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎥'
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('document')) return '📝'
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊'
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️'
    if (type.includes('zip') || type.includes('archive')) return '📦'
    return '📎'
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return
    }

    setDeletingFileId(fileId)
    try {
      const response = await fetch(`/api/upload?fileId=${fileId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onFileDeleted(fileId)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete file')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the file')
    } finally {
      setDeletingFileId(null)
    }
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No files attached yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <span className="text-xl">{getFileIcon(file.type)}</span>
            
            <div className="flex-1 min-w-0">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-800 hover:text-blue-600 truncate block"
                title={file.name}
              >
                {file.name}
              </a>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatFileSize(file.size)}</span>
                <span>Uploaded by {file.uploadedBy.name}</span>
                <span>{formatDate(file.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={file.url}
              download={file.name}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            
            <button
              onClick={() => handleDelete(file.id)}
              disabled={deletingFileId === file.id}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete"
            >
              {deletingFileId === file.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
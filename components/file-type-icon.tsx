import { FileText, FileIcon as FileWord, FileCode, File } from "lucide-react"

interface FileTypeIconProps {
  filename: string
  className?: string
  size?: number
}

export function FileTypeIcon({ filename, className = "", size = 16 }: FileTypeIconProps) {
  const extension = filename.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
      return <FileText className={className} size={size} />
    case "doc":
    case "docx":
      return <FileWord className={className} size={size} />
    case "txt":
      return <FileCode className={className} size={size} />
    default:
      return <File className={className} size={size} />
  }
}


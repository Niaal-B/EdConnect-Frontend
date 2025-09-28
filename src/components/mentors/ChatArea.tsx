import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Wifi, 
  WifiOff, 
  Download, 
  FileText, 
  Image, 
  File, 
  AlertCircle,
  Video,
  Music,
  Archive,
  Eye,
  Loader2,
  Paperclip,
  X,
  Upload,
  Clock

} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_username: string;
  timestamp: string;
  chat_room_id?: string;
  file_type?: string | null;
  file?: string | null;
}

interface ChatAreaProps {
  selectedStudentName: string;
  messages: Message[];
  isConnected: boolean;
  isLoadingHistory: boolean;
  connectionError: string;
  currentUserId: number;
  onSendMessage: (content: string) => void;
}

// File type utilities
const getFileIcon = (fileType: string | null, fileName: string) => {
  if (!fileType) {
    // Try to determine from filename if file_type is null
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext) {
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
      const videoExts = ['mp4', 'webm', 'avi', 'mov', 'wmv', 'flv'];
      const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
      const archiveExts = ['zip', 'rar', 'tar', '7z', 'gz'];
      const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
      
      if (imageExts.includes(ext)) {
        return <Image className="w-5 h-5 text-blue-500" />;
      } else if (videoExts.includes(ext)) {
        return <Video className="w-5 h-5 text-purple-500" />;
      } else if (audioExts.includes(ext)) {
        return <Music className="w-5 h-5 text-green-500" />;
      } else if (ext === 'pdf') {
        return <FileText className="w-5 h-5 text-red-500" />;
      } else if (archiveExts.includes(ext) || ext === 'enc') {
        return <Archive className="w-5 h-5 text-orange-500" />;
      } else if (docExts.includes(ext)) {
        return <FileText className="w-5 h-5 text-blue-600" />;
      }
    }
    return <File className="w-5 h-5 text-gray-500" />;
  }

  if (fileType.startsWith('image/')) {
    return <Image className="w-5 h-5 text-blue-500" />;
  } else if (fileType.startsWith('video/')) {
    return <Video className="w-5 h-5 text-purple-500" />;
  } else if (fileType.startsWith('audio/')) {
    return <Music className="w-5 h-5 text-green-500" />;
  } else if (fileType === 'application/pdf') {
    return <FileText className="w-5 h-5 text-red-500" />;
  } else if (
    fileType.includes('zip') || 
    fileType.includes('rar') || 
    fileType.includes('tar')
  ) {
    return <Archive className="w-5 h-5 text-orange-500" />;
  } else if (
    fileType.includes('document') || 
    fileType.includes('text') ||
    fileType.includes('word') ||
    fileType.includes('excel') ||
    fileType.includes('powerpoint')
  ) {
    return <FileText className="w-5 h-5 text-blue-600" />;
  }
  
  return <File className="w-5 h-5 text-gray-500" />;
};

const getFileTypeLabel = (fileType: string | null, fileName: string) => {
  if (!fileType) {
    // Try to determine from filename
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext) {
      const extMap: { [key: string]: string } = {
        'pdf': 'PDF Document',
        'jpg': 'JPEG Image',
        'jpeg': 'JPEG Image',
        'png': 'PNG Image',
        'gif': 'GIF Image',
        'webp': 'WebP Image',
        'mp4': 'MP4 Video',
        'webm': 'WebM Video',
        'mp3': 'MP3 Audio',
        'wav': 'WAV Audio',
        'doc': 'Word Document',
        'docx': 'Word Document',
        'xls': 'Excel Spreadsheet',
        'xlsx': 'Excel Spreadsheet',
        'zip': 'ZIP Archive',
        'rar': 'RAR Archive',
        'enc': 'Encrypted File',
        'txt': 'Text File'
      };
      return extMap[ext] || `${ext.toUpperCase()} File`;
    }
    return 'File Attachment';
  }

  const typeMap: { [key: string]: string } = {
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/webp': 'WebP Image',
    'application/pdf': 'PDF Document',
    'video/mp4': 'MP4 Video',
    'video/webm': 'WebM Video',
    'audio/mp3': 'MP3 Audio',
    'audio/wav': 'WAV Audio',
    'application/zip': 'ZIP Archive'
  };

  return typeMap[fileType] || fileType;
};

const canPreviewFile = (fileType: string | null, fileName: string) => {
  if (fileType) {
    return fileType.startsWith('image/') || fileType === 'application/pdf';
  }
  
  // Check by filename extension
  const ext = fileName.split('.').pop()?.toLowerCase();
  const previewableExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'];
  return ext ? previewableExts.includes(ext) : false;
};

const formatFileSize = (url: string) => {
  // In a real app, you'd get file size from the server
  // For now, return a placeholder
  return 'Unknown size';
};

// Check if a message content looks like a filename
const isFileName = (content: string) => {
  // Check if content has file extension and doesn't contain spaces at the beginning/end (typical of filenames)
  const hasExtension = /\.[a-zA-Z0-9]{1,10}$/.test(content);
  const isReasonableLength = content.length > 3 && content.length < 200;
  const noLineBreaks = !content.includes('\n') && !content.includes('\r');
  
  return hasExtension && isReasonableLength && noLineBreaks;
};

export function ChatArea({
  selectedStudentName,
  messages,
  isConnected,
  isLoadingHistory,
  connectionError,
  currentUserId,
  onSendMessage
}: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const [downloadStatus, setDownloadStatus] = useState<{ [key: number]: 'downloading' | 'success' | 'error' }>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [selectedStudentName]);

const handleSend = async () => {
  if (!isConnected || (!inputValue.trim() && !selectedFile)) return;

  setIsUploading(true);

  let fileData = null;

  if (selectedFile) {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await api.post("/upload-file/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fileData = {
        file: res.data.file_url,
        file_type: selectedFile.type,
        content: selectedFile.name,
      };
    } catch (err) {
      console.error("File upload failed", err);
      setIsUploading(false);
      return;
    }
  }

  onSendMessage({
    content: inputValue,
    ...fileData,
  });

  setInputValue('');
  setSelectedFile(null);
  setIsUploading(false);
};


  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const removeSelectedFile = () => setSelectedFile(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDownload = async (messageId: number, fileUrl: string, fileName: string) => {
    setDownloadStatus(prev => ({ ...prev, [messageId]: 'downloading' }));
    
    try {
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadStatus(prev => ({ ...prev, [messageId]: 'success' }));
      
      // Clear success status after 2 seconds
      setTimeout(() => {
        setDownloadStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[messageId];
          return newStatus;
        });
      }, 2000);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus(prev => ({ ...prev, [messageId]: 'error' }));
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[messageId];
          return newStatus;
        });
      }, 3000);
    }
  };

  const handlePreview = (fileUrl: string) => {
    setPreviewUrl(fileUrl);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustTextareaHeight(e.target);
  };

  // File attachment component - updated to handle real-time files
  const FileAttachment = ({ message }: { message: Message }) => {
    const fileName = message.content;
    const fileType = message.file_type;
    const fileUrl = message.file;
    const messageId = message.id;
    const status = downloadStatus[messageId];
    
    // Check if this looks like a file attachment
    const looksLikeFile = isFileName(fileName);
    const hasFileUrl = fileUrl && fileUrl.length > 0;
    const isFileProcessing = looksLikeFile && !hasFileUrl;

    // Don't show file attachment component if this doesn't look like a file
    if (!looksLikeFile && !fileType && !fileUrl) {
      return null;
    }

    return (
      <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getFileIcon(fileType, fileName)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate">
              {fileName}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getFileTypeLabel(fileType, fileName)}
            </div>
            <div className="text-xs text-gray-400">
              {hasFileUrl ? formatFileSize(fileUrl) : 'Processing...'}
            </div>
            
            {/* Show processing status if file is being processed */}
            {isFileProcessing && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3 animate-pulse" />
                  File processing...
                </div>
              </div>
            )}
            
            {/* Show download/preview buttons only when file URL is available */}
            {hasFileUrl && (
              <div className="flex items-center gap-2 mt-2">
                {/* Download Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(messageId, fileUrl, fileName)}
                  disabled={status === 'downloading'}
                  className="flex items-center gap-1 text-xs h-7"
                  title="Download file"
                >
                  {status === 'downloading' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  {status === 'downloading' ? 'Downloading...' : 'Download'}
                </Button>

                {/* Preview Button for supported file types */}
                {canPreviewFile(fileType, fileName) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(fileUrl)}
                    className="flex items-center gap-1 text-xs h-7"
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </Button>
                )}
              </div>
            )}

            {/* Status Messages */}
            {status === 'success' && (
              <div className="text-xs text-green-600 mt-1">
                Downloaded successfully!
              </div>
            )}
            {status === 'error' && (
              <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Download failed. Try again.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!selectedStudentName) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <MessageCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a student to start chatting</h3>
          <p className="text-sm text-gray-500">Your conversations will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Chat with {selectedStudentName}
            </h2>
            {isLoadingHistory && (
              <p className="text-sm text-gray-500">Loading history...</p>
            )}
          </div>
          <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </div>

      {/* Error Display */}
      {connectionError && (
        <Alert className="m-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {connectionError}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-white">
        {messages.length === 0 && !isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = message.sender_id === currentUserId;
              const looksLikeFile = isFileName(message.content);
              const hasFileAttachment = message.file || message.file_type || looksLikeFile;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-xs md:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className={`h-8 w-8 ${isOwn ? 'ml-2' : 'mr-2'}`}>
                      <AvatarFallback className={`text-xs ${isOwn ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                        {isOwn ? 'Y' : message.sender_username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {isOwn ? 'You' : message.sender_username}
                      </div>
                      <div
                        className={`px-4 py-2 rounded-lg text-sm break-words ${
                          isOwn
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {/* Show message content only if it's not a file attachment */}
                        {!hasFileAttachment && message.content}
                        
                        {/* File attachment - now shows immediately for real-time messages */}
                        {hasFileAttachment && <FileAttachment message={message} />}
                        
                        <div className={`text-right text-xs mt-1 opacity-70`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">File Preview</h3>
              <Button
                variant="ghost"
                onClick={() => setPreviewUrl(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              {previewUrl.includes('.pdf') ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-96"
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Image Preview"
                  className="max-w-full max-h-96 mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Input Area */}
      <div 
        className={`mt-4 bg-white p-4 rounded-lg shadow-md m-4 ${dragOver ? 'border-2 border-dashed border-blue-400 bg-blue-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* File attachment preview */}
        {selectedFile && (
          <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile.type, selectedFile.name)}
                <div>
                  <div className="font-medium text-sm text-gray-900 truncate max-w-[200px]">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getFileTypeLabel(selectedFile.type, selectedFile.name)} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeSelectedFile}
                className="text-gray-400 hover:text-red-500 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-75 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-600 font-medium">Drop file here to attach</p>
            </div>
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* File attachment button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected || isUploading}
            className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 p-2"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,video/mp4,video/webm,audio/mp3,audio/wav"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={selectedFile ? "Add a message (optional)..." : "Type your message..."}
            disabled={!isConnected || isUploading}
            className="flex-1 resize-none min-h-[44px] max-h-[120px] overflow-y-auto"
          />
          
          <Button
            onClick={handleSend}
            disabled={!isConnected || (!inputValue.trim() && !selectedFile) || isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition transform hover:scale-105 self-end disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : selectedFile ? (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Send File
              </>
            ) : (
              'Send'
            )}
          </Button>
        </div>

        {/* File size and type hints */}
        <div className="mt-2 text-xs text-gray-400">
          Supported: Images, PDFs, Documents, Videos, Audio • Max size: 10MB
        </div>
      </div>
    </div>
  );
}
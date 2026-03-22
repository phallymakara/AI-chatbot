import { useRef, useState } from "react";
import { FiUploadCloud, FiPlus, FiLoader, FiAlertCircle, FiLink, FiCheck, FiX } from "react-icons/fi";
import { useAdmin } from "@/hooks/useAdmin";

export function UploadZone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileUpload, isUploading, adminError, addLink } = useAdmin();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkName, setLinkName] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddLink = () => {
    if (linkUrl && linkName) {
      addLink(linkName, linkUrl);
      setLinkUrl("");
      setLinkName("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload File Section */}
        <div 
          className="border border-solid border-border/60 rounded-xl p-4 flex items-center justify-between bg-card/30 hover:bg-primary/5 hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              {isUploading ? 
                <FiLoader className="w-5 h-5 text-primary animate-spin" /> : 
                <FiUploadCloud className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              }
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">Upload Document</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-tight">PDF, DOCX, TXT</p>
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            className="hidden" 
            accept=".pdf,.docx,.txt"
          />

          <button 
            onClick={handleButtonClick}
            disabled={isUploading}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isUploading ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiPlus className="w-3.5 h-3.5" />}
            File
          </button>
        </div>

        {/* Add Link Section */}
        <div 
          className="border border-solid border-border/60 rounded-xl p-4 flex items-center justify-between bg-card/30 hover:bg-primary/5 hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <FiLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">Add Website Link</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-tight">URL, Blogs, Docs</p>
            </div>
          </div>

          <button 
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 shadow-sm transition-all active:scale-95"
          >
            {showLinkInput ? <FiX className="w-3.5 h-3.5" /> : <FiPlus className="w-3.5 h-3.5" />}
            Link
          </button>
        </div>
      </div>

      {showLinkInput && (
        <div className="p-4 bg-muted/30 border border-border/60 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Display Name</label>
              <input 
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="e.g. Documentation"
                className="w-full h-9 text-xs bg-background border border-border rounded-lg px-3 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Website URL</label>
              <input 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full h-9 text-xs bg-background border border-border rounded-lg px-3 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowLinkInput(false)}
              className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddLink}
              disabled={!linkName || !linkUrl}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 disabled:opacity-50"
            >
              <FiCheck className="w-3.5 h-3.5" />
              Save Link
            </button>
          </div>
        </div>
      )}

      {adminError && (
        <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 animate-in fade-in slide-in-from-top-1">
          <FiAlertCircle className="w-3.5 h-3.5" />
          <p className="text-[10px] font-medium">{adminError}</p>
        </div>
      )}
    </div>
  );
}

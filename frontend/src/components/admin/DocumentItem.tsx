import { useState } from "react";
import { FiFile, FiCheck, FiX, FiEdit2, FiTrash2, FiLoader, FiLink, FiExternalLink } from "react-icons/fi";
import { useAdminStore } from "@/lib/adminStore";
import type { AdminDocument } from "@/lib/adminStore";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";

interface DocumentItemProps {
  document: AdminDocument;
}

export function DocumentItem({ document: doc }: DocumentItemProps) {
  const { renameDocument, updateLink } = useAdminStore();
  const { handleDeleteDocument, isDeleting } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(doc.name);
  const [editUrl, setEditUrl] = useState(doc.url || "");

  const deletingThis = isDeleting === doc.id;
  const isLink = doc.type === "link";

  const handleSave = () => {
    if (isLink) {
      if (editName.trim() && editUrl.trim()) {
        updateLink(doc.id, editName.trim(), editUrl.trim());
        setIsEditing(false);
      }
    } else {
      if (editName.trim() && editName !== doc.name) {
        renameDocument(doc.id, editName.trim());
      }
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(doc.name);
    setEditUrl(doc.url || "");
    setIsEditing(false);
  };

  const onDelete = async () => {
    if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      await handleDeleteDocument(doc.id, doc.name);
    }
  };

  return (
    <div className="px-4 py-2 grid grid-cols-[1fr_200px_100px_150px_100px] gap-3 items-center hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
          {isLink ? <FiLink className="w-4.5 h-4.5" /> : <FiFile className="w-4.5 h-4.5" />}
        </div>
        
        {isEditing ? (
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full h-8 text-sm bg-background border border-primary/30 rounded px-2 focus:outline-none focus:ring-1 focus:ring-primary/20"
              autoFocus
              placeholder="Name"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            {isLink && (
              <input
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full h-8 text-xs bg-background border border-primary/30 rounded px-2 focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="URL"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            )}
            <div className="flex items-center gap-2">
              <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">
                <FiCheck className="w-3.5 h-3.5" /> Save
              </button>
              <button onClick={handleCancel} className="flex items-center gap-1 px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80">
                <FiX className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate text-foreground">{doc.name}</p>
              {isLink && doc.url && (
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <FiExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
              {doc.type}
            </p>
          </div>
        )}
      </div>

      <div className="text-[10px] text-muted-foreground truncate font-medium">
        {isLink ? doc.url : doc.size}
      </div>

      <div className="flex justify-center">
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
          doc.status === "indexed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
        )}>
          {doc.status}
        </span>
      </div>

      <div className="text-[10px] text-muted-foreground text-center font-medium">
        {new Date(doc.uploadedAt).toLocaleDateString()}
      </div>
      
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-4">
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
              title="Edit">
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              disabled={deletingThis}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-rose-500/10 rounded disabled:opacity-50"
              title="Delete">
              {deletingThis ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiTrash2 className="w-3.5 h-3.5" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

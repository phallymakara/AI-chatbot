import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DocumentItem } from "@/components/admin/DocumentItem";
import { UploadZone } from "@/components/admin/UploadZone";
import { useAdminStore } from "@/lib/adminStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiSearch, FiFilter } from "react-icons/fi";

export function Documents() {
  const { documents } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(query) ||
      (doc.url && doc.url.toLowerCase().includes(query)) ||
      doc.type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full bg-background/50">
      <AdminHeader title="Document Vault" subtitle="Manage organization knowledge sources" />
      
      <ScrollArea className="flex-1 h-full min-h-0">
        <div className="p-4 max-w-[1400px] mx-auto space-y-4">
          {/* Upload Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold px-1">Upload New Knowledge</h2>
            <UploadZone />
          </div>

          {/* List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold">Ingested Documents ({filteredDocuments.length})</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input 
                    placeholder="Search by name, URL, or type..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-9 pr-4 bg-card border border-border/50 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-80 sm:w-[500px] transition-all focus:w-96 sm:focus:w-[650px]"
                  />
                </div>
                <button className="h-8 w-8 flex items-center justify-center bg-card border border-border/50 rounded-lg text-muted-foreground hover:text-foreground">
                  <FiFilter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              {/* Table Header */}
              {filteredDocuments.length > 0 && (
                <div className="grid grid-cols-[1fr_200px_100px_150px_100px] gap-4 px-4 py-2.5 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 shrink-0">
                  <div className="pl-12">Document Name</div>
                  <div>Details</div>
                  <div className="text-center">Status</div>
                  <div className="text-center">Uploaded Date</div>
                  <div className="text-right pr-4">Actions</div>
                </div>
              )}
              
              <div className="overflow-y-auto max-h-[600px] divide-y divide-border/50">
                {filteredDocuments.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <p className="text-sm text-muted-foreground italic">
                      {searchQuery ? `No documents matching "${searchQuery}"` : "No documents found."}
                    </p>
                    <p className="text-xs text-muted-foreground/50">
                      {searchQuery ? "Try a different search term" : "Upload documents to start training the AI."}
                    </p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => (
                    <DocumentItem key={doc.id} document={doc} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

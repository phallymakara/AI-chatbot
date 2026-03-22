import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminDocument {
  id: string;
  name: string;
  type: string;
  url?: string;
  size: string;
  status: "indexed" | "indexing" | "error";
  uploadedAt: number;
}

export interface AdminMetrics {
  totalQueries: number;
  activeUsers: number;
  totalDocuments: number;
  totalTokens: number;
  totalPrice: number;
  systemHealth: "healthy" | "degraded" | "down";
}

interface AdminState {
  documents: AdminDocument[];
  metrics: AdminMetrics;
  isLoading: boolean;
  activeSection: "dashboard" | "documents" | "users" | "settings";
  isUploading: boolean;
  isDeleting: string | null;
  uploadError: string | null;
  
  // Actions
  setActiveSection: (section: AdminState["activeSection"]) => void;
  addDocument: (doc: Omit<AdminDocument, "id" | "uploadedAt">) => void;
  addLink: (name: string, url: string) => void;
  deleteDocument: (id: string) => void;
  renameDocument: (id: string, newName: string) => void;
  updateLink: (id: string, name: string, url: string) => void;
  updateMetrics: (metrics: Partial<AdminMetrics>) => void;
  setUploading: (isUploading: boolean) => void;
  setDeleting: (id: string | null) => void;
  setUploadError: (error: string | null) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      documents: [
        { id: "1", name: "Employee Attendance Policy.pdf", type: "pdf", size: "1.2 MB", status: "indexed", uploadedAt: Date.now() - 86400000 },
        { id: "2", name: "uniform policy.pdf", type: "pdf", size: "850 KB", status: "indexed", uploadedAt: Date.now() - 172800000 },
        { id: "3", name: "Company Rules.docx", type: "docx", size: "2.1 MB", status: "indexed", uploadedAt: Date.now() - 259200000 },
      ],
      metrics: {
        totalQueries: 1254,
        activeUsers: 45,
        totalDocuments: 3,
        totalTokens: 850420,
        totalPrice: 12.45,
        systemHealth: "healthy",
      },
      isLoading: false,
      activeSection: "dashboard",
      isUploading: false,
      isDeleting: null,
      uploadError: null,

      setActiveSection: (section) => set({ activeSection: section }),
      
      addDocument: (doc) => set((state) => ({
        documents: [
          ...state.documents,
          { ...doc, id: Math.random().toString(36).substring(7), uploadedAt: Date.now() }
        ]
      })),

      addLink: (name, url) => set((state) => ({
        documents: [
          ...state.documents,
          { 
            id: Math.random().toString(36).substring(7), 
            name, 
            url, 
            type: "link", 
            size: "N/A", 
            status: "indexed", 
            uploadedAt: Date.now() 
          }
        ]
      })),

      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter((d) => d.id !== id)
      })),

      renameDocument: (id, newName) => set((state) => ({
        documents: state.documents.map((d) => d.id === id ? { ...d, name: newName } : d)
      })),

      updateLink: (id, name, url) => set((state) => ({
        documents: state.documents.map((d) => d.id === id ? { ...d, name, url } : d)
      })),

      updateMetrics: (metrics) => set((state) => ({
        metrics: { ...state.metrics, ...metrics }
      })),

      setUploading: (isUploading) => set({ isUploading }),
      setDeleting: (id) => set({ isDeleting: id }),
      setUploadError: (error) => set({ uploadError: error }),
    }),
    {
      name: "admin-storage",
    }
  )
);

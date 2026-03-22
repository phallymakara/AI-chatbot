import { AdminHeader } from "@/components/admin/AdminHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { FiMessageCircle, FiUsers, FiFileText, FiActivity, FiArrowUpRight, FiCpu, FiDollarSign } from "react-icons/fi";
import { useAdminStore } from "@/lib/adminStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Dashboard() {
  const { metrics, documents } = useAdminStore();

  return (
    <div className="flex flex-col h-full bg-background/50">
      <AdminHeader title="Dashboard Overview" subtitle="Real-time system analytics and status" />
      
      <ScrollArea className="flex-1 h-full min-h-0">
        <div className="p-4 space-y-5">
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard 
              title="Total Queries" 
              value={metrics.totalQueries} 
              icon={FiMessageCircle}
              change="+12.5%"
              trend="up"
              description="Queries handled by AI"
            />
            <MetricCard 
              title="Active Users" 
              value={metrics.activeUsers} 
              icon={FiUsers}
              change="+4"
              trend="up"
              description="Users currently online"
            />
            <MetricCard 
              title="Knowledge Base" 
              value={metrics.totalDocuments} 
              icon={FiFileText}
              description="Documents ingested"
            />
            <MetricCard 
              title="System Health" 
              value="100%" 
              icon={FiActivity}
              trend="up"
              description="Average uptime"
            />
          </div>

          {/* Usage Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MetricCard 
              title="Total Token" 
              value={(metrics.totalTokens || 0).toLocaleString()} 
              icon={FiCpu}
              change="+15.2%"
              trend="up"
              description="Total LLM tokens consumed"
            />
            <MetricCard 
              title="Total Price" 
              value={`$${(metrics.totalPrice || 0).toFixed(2)}`} 
              icon={FiDollarSign}
              change="+$1.20"
              trend="up"
              description="Estimated API expenditure"
            />
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Recent Documents</h2>
                <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                  View all <FiArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-border/50">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="p-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                        <FiFileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px] md:max-w-md">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-4 space-y-4">
              <h2 className="text-sm font-semibold">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full p-2.5 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 text-left transition-all group">
                  <p className="text-xs font-semibold group-hover:text-primary transition-colors">Upload Document</p>
                  <p className="text-[10px] text-muted-foreground">Add to organization knowledge</p>
                </button>
                <button className="w-full p-2.5 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 text-left transition-all group">
                  <p className="text-xs font-semibold group-hover:text-primary transition-colors">Clear Cache</p>
                  <p className="text-[10px] text-muted-foreground">Force rebuild of document index</p>
                </button>
                <button className="w-full p-2.5 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 text-left transition-all group">
                  <p className="text-xs font-semibold group-hover:text-primary transition-colors">System Report</p>
                  <p className="text-[10px] text-muted-foreground">Download monthly usage logs</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

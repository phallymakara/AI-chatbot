import { AdminHeader } from "@/components/admin/AdminHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiCpu, FiShield, FiBriefcase, FiImage, FiClock, FiGlobe } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Settings() {
  return (
    <div className="flex flex-col h-full bg-background/50">
      <AdminHeader title="System Settings" subtitle="Configure AI behavior and organization rules" />
      
      <ScrollArea className="flex-1 h-full min-h-0">
        <div className="p-6 max-w-3xl mx-auto space-y-8 pb-12">
          {/* Organization & Branding */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <FiBriefcase className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Organization & Branding</h2>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-5">
              {/* Organization Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Organization Name</label>
                <div className="flex items-center gap-2 max-w-md">
                  <Input defaultValue="Proseth Solutions" className="flex-1" />
                  <Button size="sm" className="h-9 px-4">Save</Button>
                </div>
                <p className="text-[11px] text-muted-foreground">The display name used across the system</p>
              </div>

              {/* Logo / Branding */}
              <div className="border-t border-border/30 pt-5 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center border border-border group overflow-hidden relative">
                  <FiImage className="w-6 h-6 text-muted-foreground" />
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Organization Logo</p>
                  <button className="text-[11px] font-semibold text-primary hover:underline mt-2">Change Logo</button>
                </div>
              </div>

              {/* Timezone & Language */}
              <div className="border-t border-border/30 pt-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-3.5 h-3.5 text-muted-foreground" />
                      <label className="text-sm font-medium">Timezone</label>
                    </div>
                    <select className="w-full bg-background border border-border/50 rounded-md h-9 px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                      <option value="Asia/Phnom_Penh">Asia/Phnom Penh (GMT+7)</option>
                      <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                      <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FiGlobe className="w-3.5 h-3.5 text-muted-foreground" />
                      <label className="text-sm font-medium">Default Language</label>
                    </div>
                    <select className="w-full bg-background border border-border/50 rounded-md h-9 px-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                      <option value="en">English (US)</option>
                      <option value="kh">Khmer</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end border-t border-border/30 pt-4">
                   <Button size="sm">Save Regional Settings</Button>
                </div>
              </div>
            </div>
          </section>

          {/* AI Configuration */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <FiCpu className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">AI Model Configuration</h2>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Creativity Level (Temperature)</p>
                  <p className="text-xs text-muted-foreground">Controls how random the answers are</p>
                </div>
                <input type="range" className="w-32 accent-primary" />
              </div>
              <div className="flex items-center justify-between border-t border-border/30 pt-4">
                <div>
                  <p className="text-sm font-medium">Response Length</p>
                  <p className="text-xs text-muted-foreground">Limit the maximum length of AI answers</p>
                </div>
                <select className="bg-background border border-border/50 rounded px-2 py-1 text-xs">
                  <option>Short & Concise</option>
                  <option selected>Balanced</option>
                  <option>Detailed</option>
                </select>
              </div>
            </div>
          </section>

          {/* Security & Access */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <FiShield className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Security & Access</h2>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Domain Restriction</p>
                  <p className="text-xs text-muted-foreground">Only allow users from specific email domains</p>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">@proseth.com</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}

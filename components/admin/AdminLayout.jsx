"use client";

import { useIsMobile } from "../../hooks/useIsMobile";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { BarChart3, FileText, Users, Settings, Search } from "lucide-react";

// Sidebar items
const menuItems = [
  { title: "Dashboard", icon: BarChart3, id: "dashboard" },
  { title: "All Articles", icon: FileText, id: "articles" },
  { title: "Categories", icon: Users, id: "categories" },
  { title: "Settings", icon: Settings, id: "settings" },
];

function AppSidebar({ activeSection, onSectionChange }) {
  return (
    <Sidebar className="border-r flex-shrink-0 border-[#b51c1c]/20">
      <SidebarHeader className="border-b border-[#b51c1c]/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 bg-gradient-to-r md:hidden from-[#b51c1c] to-[#052461] rounded-lg flex items-center justify-center">
              <SidebarTrigger className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-lg md:text-[#111827] text-[#fff] truncate">
                FaaFiye
              </h1>
              <p className="text-sm text-muted-foreground md:text-[#111827] text-[#fff] hidden sm:block">
                Content Management
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="md:text-[#111827] text-[#fff] font-semibold mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full justify-start gap-3 hover:bg-[#b51c1c] hover:text-white transition-colors ${
                      activeSection === item.id
                        ? "bg-[#b51c1c] text-white"
                        : "text-white md:text-black bg-[#111827] md:bg-transparent"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium truncate">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#b51c1c]/20 p-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 FaaFiye</p>
          <p className="text-[#b51c1c]">v1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AdminLayout({ children, activeSection, onSectionChange }) {
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        <main className="flex-1 flex flex-col max-w-screen overflow-hidden">
          <header className="bg-white border-b border-[#b51c1c]/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <SidebarTrigger className="text-[#111827] hover:bg-[#b51c1c]/10 flex-shrink-0 md:hidden" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl lg:text-2xl font-bold text-[#111827] capitalize truncate">
                    {activeSection === "articles"
                      ? "All Articles"
                      : activeSection}
                  </h2>
                  <p className="text-muted-foreground text-sm hidden sm:block">
                    Manage your news content efficiently
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isMobile && (
                  <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search articles..."
                      className="pl-10 w-64 border-[#b51c1c]/20 focus:border-[#b51c1c]"
                    />
                  </div>
                )}
                <Button
                  className="bg-[#b51c1c] hover:bg-[#b51c1c]/90 text-white"
                  size={isMobile ? "sm" : "default"}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>

            {isMobile && (
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 w-full border-[#b51c1c]/20 focus:border-[#b51c1c]"
                />
              </div>
            )}
          </header>

          <div className="p-4 lg:p-6 flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}

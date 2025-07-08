import React from "react";
import { Bell, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  contentFeed?: React.ReactNode;
  communityCards?: React.ReactNode;
}

const DashboardLayout = ({
  children,
  sidebar,
  contentFeed,
  communityCards,
}: DashboardLayoutProps = {}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: 1, content: "New reply to your post in Tech Community", read: false },
    { id: 2, content: "You were mentioned in Design Community", read: false },
    { id: 3, content: "New announcement in Gaming Community", read: true },
  ]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Communities</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="py-4">{sidebar}</div>
              </SheetContent>
            </Sheet>

            <div className="text-xl font-bold text-[#3498db]">ForumHub</div>
          </div>

          <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search communities, topics, or users..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.some((n) => !n.read) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-[#e74c3c] rounded-full"></span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem>My Communities</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:block w-[280px] shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {sidebar}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Community Cards Grid */}
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Discover Communities</h2>
            {communityCards}
          </section>

          {/* Content Feed */}
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {contentFeed}
          </section>

          {/* Additional Content */}
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2023 ForumHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;

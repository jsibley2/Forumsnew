import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Search, User, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CommunitySidebar from "./sidebar/CommunitySidebar";
import ContentFeed from "./content/ContentFeed";
import CommunityCardGrid from "./communities/CommunityCardGrid";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("feed");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-[#3498db]">
              Community Forum
            </h1>
          </div>

          <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search communities, topics, or users..."
              className="pl-10 bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-[#e74c3c] rounded-full"></span>
            </Button>

            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="md:hidden container mx-auto px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 bg-gray-50" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 container mx-auto">
        {/* Sidebar */}
        <div
          className={`${isSidebarOpen ? "block" : "hidden"} md:block w-full md:w-72 lg:w-80 shrink-0 border-r border-gray-200 bg-white`}
        >
          <CommunitySidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4">
          <Tabs
            defaultValue="feed"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
                <TabsTrigger value="subscribed">My Communities</TabsTrigger>
              </TabsList>

              <Button className="bg-[#3498db] hover:bg-[#2980b9]">
                New Topic
              </Button>
            </div>

            <TabsContent value="feed" className="mt-0">
              <ContentFeed />
            </TabsContent>

            <TabsContent value="discover" className="mt-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">
                  Discover Communities
                </h2>
                <p className="text-gray-600 mb-6">
                  Find and join communities that match your interests
                </p>
                <CommunityCardGrid />
              </div>
            </TabsContent>

            <TabsContent value="subscribed" className="mt-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">My Communities</h2>
                <p className="text-gray-600 mb-6">Communities you've joined</p>
                <CommunityCardGrid />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2023 Community Forum Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

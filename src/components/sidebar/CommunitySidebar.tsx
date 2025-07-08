import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Plus, Star, Bell, Lock } from "lucide-react";

interface Community {
  id: string;
  name: string;
  hasNewActivity: boolean;
  subscriptionType: "free" | "paid" | "introductory";
  unreadCount?: number;
}

interface CommunitySidebarProps {
  communities?: Community[];
  activeCommunityId?: string;
  onSelectCommunity?: (communityId: string) => void;
  onAddCommunity?: () => void;
}

const CommunitySidebar = ({
  communities = defaultCommunities,
  activeCommunityId,
  onSelectCommunity = () => {},
  onAddCommunity = () => {},
}: CommunitySidebarProps) => {
  return (
    <div className="h-full w-[280px] border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">My Communities</h2>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onAddCommunity}
        >
          <Plus className="mr-2 h-4 w-4" />
          Join New Community
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-1">
            {communities.map((community) => (
              <Button
                key={community.id}
                variant={
                  activeCommunityId === community.id ? "secondary" : "ghost"
                }
                className="w-full justify-start h-auto py-2 px-3"
                onClick={() => onSelectCommunity(community.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {getSubscriptionIcon(community.subscriptionType)}
                    <span className="ml-2 truncate">{community.name}</span>
                  </div>
                  <div className="flex items-center">
                    {community.hasNewActivity && (
                      <Badge variant="secondary" className="mr-1 h-5 px-1">
                        {community.unreadCount || ""}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-start h-8"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full">
          Community Settings
        </Button>
      </div>
    </div>
  );
};

const getSubscriptionIcon = (type: "free" | "paid" | "introductory") => {
  switch (type) {
    case "free":
      return <Bell className="h-4 w-4 text-green-500" />;
    case "paid":
      return <Star className="h-4 w-4 text-amber-500" />;
    case "introductory":
      return <Lock className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const defaultCommunities: Community[] = [
  {
    id: "1",
    name: "Web Development",
    hasNewActivity: true,
    subscriptionType: "free",
    unreadCount: 3,
  },
  {
    id: "2",
    name: "UI/UX Design",
    hasNewActivity: false,
    subscriptionType: "paid",
  },
  {
    id: "3",
    name: "Mobile App Development",
    hasNewActivity: true,
    subscriptionType: "free",
    unreadCount: 12,
  },
  {
    id: "4",
    name: "Data Science",
    hasNewActivity: false,
    subscriptionType: "introductory",
  },
  {
    id: "5",
    name: "DevOps & Cloud",
    hasNewActivity: true,
    subscriptionType: "paid",
    unreadCount: 5,
  },
  {
    id: "6",
    name: "Blockchain Technology",
    hasNewActivity: false,
    subscriptionType: "introductory",
  },
  {
    id: "7",
    name: "Artificial Intelligence",
    hasNewActivity: true,
    subscriptionType: "paid",
    unreadCount: 8,
  },
];

const categories = [
  "All Communities",
  "Free Communities",
  "Paid Subscriptions",
  "Recently Active",
  "Favorites",
];

export default CommunitySidebar;

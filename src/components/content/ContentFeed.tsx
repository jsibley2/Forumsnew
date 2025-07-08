import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Topic } from "@/types/supabase";

interface TopicDisplay {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  community: string;
  subCommunity: string;
  timestamp: string;
  likes: number;
  comments: number;
  isFeatured?: boolean;
  isNew?: boolean;
}

interface ContentFeedProps {
  featuredTopics?: TopicDisplay[];
  recentDiscussions?: TopicDisplay[];
  announcements?: TopicDisplay[];
}

const ContentFeed: React.FC<ContentFeedProps> = () => {
  const [featuredTopics, setFeaturedTopics] = useState<TopicDisplay[]>([]);
  const [recentDiscussions, setRecentDiscussions] = useState<TopicDisplay[]>(
    [],
  );
  const [announcements, setAnnouncements] = useState<TopicDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform Supabase topic to display format
  const transformTopic = (topic: Topic): TopicDisplay => {
    const now = new Date();
    const createdAt = new Date(topic.created_at);
    const diffInHours = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60),
    );

    let timestamp: string;
    if (diffInHours < 1) {
      timestamp = "Just now";
    } else if (diffInHours < 24) {
      timestamp = `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      timestamp = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    return {
      id: topic.id,
      title: topic.title,
      content: topic.content,
      author: {
        name: topic.author_name,
        avatar: topic.author_avatar,
      },
      community: topic.community,
      subCommunity: topic.sub_community,
      timestamp,
      likes: topic.likes,
      comments: topic.comments,
      isFeatured: topic.is_featured,
      isNew: topic.is_new,
    };
  };

  // Fetch topics from Supabase
  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("topics")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      if (data) {
        const transformedTopics = data.map(transformTopic);

        // Separate topics by type
        setFeaturedTopics(
          transformedTopics.filter((topic) => topic.isFeatured),
        );
        setRecentDiscussions(
          transformedTopics.filter((topic) => !topic.isFeatured && topic.isNew),
        );
        setAnnouncements(
          transformedTopics.filter(
            (topic) => !topic.isFeatured && !topic.isNew,
          ),
        );
      }
    } catch (err) {
      console.error("Error fetching topics:", err);
      setError("Failed to load topics. Please try again later.");

      // Fallback to default data if Supabase fails
      setFeaturedTopics(defaultFeaturedTopics);
      setRecentDiscussions(defaultRecentDiscussions);
      setAnnouncements(defaultAnnouncements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);
  if (loading) {
    return (
      <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#3498db]" />
          <span className="ml-2 text-gray-600">Loading topics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchTopics} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Community Forum
        </h1>
        <p className="text-gray-600">
          Discover discussions and connect with community members
        </p>
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="h-4 w-4" /> Featured ({featuredTopics.length})
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Recent ({recentDiscussions.length})
          </TabsTrigger>
          <TabsTrigger
            value="announcements"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" /> Announcements (
            {announcements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          {featuredTopics.length > 0 ? (
            featuredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No featured topics available
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentDiscussions.length > 0 ? (
            recentDiscussions.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent discussions available
            </div>
          )}
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No announcements available
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TopicCardProps {
  topic: TopicDisplay;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
              <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{topic.author.name}</p>
              <p className="text-xs text-gray-500">{topic.timestamp}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {topic.isFeatured && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 hover:bg-amber-200"
              >
                Featured
              </Badge>
            )}
            {topic.isNew && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200"
              >
                New
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {topic.community} / {topic.subCommunity}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{topic.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {topic.content}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {/* Content preview would go here if needed */}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-[#3498db]"
          >
            <Heart className="h-4 w-4 mr-1" />
            <span>{topic.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-[#3498db]"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{topic.comments}</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Default fallback data
const defaultFeaturedTopics: TopicDisplay[] = [
  {
    id: "1",
    title: "Welcome to our new forum platform!",
    content:
      "We are excited to launch our new community forum platform. Join the discussion and connect with other members.",
    author: {
      name: "Admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
    community: "General",
    subCommunity: "Announcements",
    timestamp: "2 days ago",
    likes: 42,
    comments: 15,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Tips for getting the most out of the community",
    content:
      "Here are some tips to help you get the most out of your community experience and connect with other members.",
    author: {
      name: "Moderator",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moderator",
    },
    community: "Help",
    subCommunity: "Getting Started",
    timestamp: "3 days ago",
    likes: 38,
    comments: 22,
    isFeatured: true,
  },
];

const defaultRecentDiscussions: TopicDisplay[] = [
  {
    id: "3",
    title: "What is your favorite feature so far?",
    content:
      "I am curious to hear what features everyone is enjoying the most on our new platform!",
    author: {
      name: "Sarah",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    community: "General",
    subCommunity: "Discussions",
    timestamp: "5 hours ago",
    likes: 12,
    comments: 8,
    isNew: true,
  },
  {
    id: "4",
    title: "Introducing myself to the community",
    content:
      "Hello everyone! I am new here and wanted to introduce myself. I am excited to be part of this community.",
    author: {
      name: "NewMember",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=newmember",
    },
    community: "General",
    subCommunity: "Introductions",
    timestamp: "1 day ago",
    likes: 24,
    comments: 18,
  },
];

const defaultAnnouncements: TopicDisplay[] = [
  {
    id: "6",
    title: "Upcoming maintenance window",
    content:
      "We will be performing scheduled maintenance this weekend. The platform may be unavailable for a short period.",
    author: {
      name: "System",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system",
    },
    community: "General",
    subCommunity: "Announcements",
    timestamp: "1 day ago",
    likes: 5,
    comments: 3,
  },
];

export default ContentFeed;

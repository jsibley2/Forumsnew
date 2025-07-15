import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Pin,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Topic {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
  isNew?: boolean;
}

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  topicCount: number;
  activityLevel: "high" | "medium" | "low";
  type: "free" | "paid" | "introductory";
  price?: number;
  coverImage?: string;
  isJoined?: boolean;
}

const CommunityPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("topics");

  useEffect(() => {
    if (communityId) {
      fetchCommunityData(communityId);
    }
  }, [communityId]);

  const fetchCommunityData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase first
      const { data: communityData, error: communityError } = await supabase
        .from("communities")
        .select("*")
        .eq("id", id)
        .single();

      const { data: topicsData, error: topicsError } = await supabase
        .from("topics")
        .select("*")
        .eq("community_id", id)
        .order("created_at", { ascending: false });

      if (communityError || topicsError) {
        throw new Error("Failed to fetch community data");
      }

      if (communityData) {
        setCommunity({
          id: communityData.id,
          name: communityData.name,
          description: communityData.description,
          memberCount: communityData.member_count,
          topicCount: communityData.topic_count,
          activityLevel: communityData.activity_level,
          type: communityData.type,
          price: communityData.price,
          coverImage: communityData.cover_image,
          isJoined: communityData.is_joined,
        });
      }

      if (topicsData) {
        const transformedTopics = topicsData.map((topic: any) => ({
          id: topic.id,
          title: topic.title,
          content: topic.content,
          author: {
            name: topic.author_name,
            avatar: topic.author_avatar,
          },
          timestamp: formatTimestamp(topic.created_at),
          likes: topic.likes,
          comments: topic.comments,
          isPinned: topic.is_pinned,
          isNew: topic.is_new,
        }));
        setTopics(transformedTopics);
      }
    } catch (err) {
      console.error("Error fetching community data:", err);
      setError("Failed to load community data. Using default data.");

      // Fallback to default data
      const defaultCommunity = getDefaultCommunity(id || "1");
      setCommunity(defaultCommunity);
      setTopics(getDefaultTopics());
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  const handleJoinCommunity = () => {
    if (community) {
      setCommunity({ ...community, isJoined: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#3498db]" />
          <span className="text-gray-600">Loading community...</span>
        </div>
      </div>
    );
  }

  if (error && !community) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Community not found</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Communities
              </Button>
            </Link>
          </div>

          {community.coverImage && (
            <div className="h-48 w-full rounded-lg overflow-hidden mb-6">
              <img
                src={community.coverImage}
                alt={`${community.name} cover`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{community.name}</h1>
                <Badge
                  variant={community.type === "free" ? "secondary" : "default"}
                  className={community.type === "paid" ? "bg-[#e74c3c]" : ""}
                >
                  {community.type === "free"
                    ? "Free"
                    : community.type === "paid"
                      ? `$${community.price}/mo`
                      : "Trial"}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{community.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span>{community.topicCount} topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span className="capitalize">
                    {community.activityLevel} activity
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!community.isJoined ? (
                <Button
                  onClick={handleJoinCommunity}
                  className="bg-[#3498db] hover:bg-[#3498db]/90"
                >
                  Join Community
                </Button>
              ) : (
                <Button variant="outline">Joined</Button>
              )}
              <Button className="bg-[#3498db] hover:bg-[#3498db]/90">
                <Plus className="mr-2 h-4 w-4" />
                New Topic
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="topics">Topics ({topics.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="space-y-4">
            {topics.length > 0 ? (
              topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No topics yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Be the first to start a discussion in this community!
                </p>
                <Button className="bg-[#3498db] hover:bg-[#3498db]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Topic
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {community.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{community.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#3498db]">
                      {community.memberCount}
                    </div>
                    <div className="text-sm text-gray-500">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#3498db]">
                      {community.topicCount}
                    </div>
                    <div className="text-sm text-gray-500">Topics</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#3498db] capitalize">
                      {community.activityLevel}
                    </div>
                    <div className="text-sm text-gray-500">Activity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#3498db]">
                      {community.type === "free"
                        ? "Free"
                        : `$${community.price}`}
                    </div>
                    <div className="text-sm text-gray-500">Price</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Community Members</CardTitle>
                <CardDescription>
                  {community.memberCount} members in this community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Member list feature coming soon!
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface TopicCardProps {
  topic: Topic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
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
            {topic.isPinned && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
            {topic.isNew && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                New
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{topic.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {topic.content}
        </CardDescription>
      </CardHeader>
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

// Default data functions
const getDefaultCommunity = (id: string): Community => {
  const communities = {
    "1": {
      id: "1",
      name: "Web Development",
      description:
        "A community for web developers to share knowledge and discuss the latest trends in web development.",
      memberCount: 1250,
      topicCount: 342,
      activityLevel: "high" as const,
      type: "free" as const,
      coverImage:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
      isJoined: false,
    },
    "2": {
      id: "2",
      name: "UX/UI Design",
      description:
        "For designers focused on creating beautiful and functional user experiences.",
      memberCount: 875,
      topicCount: 218,
      activityLevel: "high" as const,
      type: "paid" as const,
      price: 9.99,
      coverImage:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      isJoined: false,
    },
  };

  return communities[id as keyof typeof communities] || communities["1"];
};

const getDefaultTopics = (): Topic[] => [
  {
    id: "1",
    title: "Welcome to the community!",
    content:
      "This is a pinned welcome message for new members. Feel free to introduce yourself and ask any questions.",
    author: {
      name: "Moderator",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moderator",
    },
    timestamp: "2 days ago",
    likes: 45,
    comments: 23,
    isPinned: true,
  },
  {
    id: "2",
    title: "Best practices for modern web development",
    content:
      "Let's discuss the current best practices and trends in web development. What are your thoughts on the latest frameworks?",
    author: {
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    timestamp: "5 hours ago",
    likes: 12,
    comments: 8,
    isNew: true,
  },
  {
    id: "3",
    title: "Help with React hooks",
    content:
      "I'm having trouble understanding useEffect. Can someone explain the dependency array?",
    author: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    timestamp: "1 day ago",
    likes: 8,
    comments: 15,
  },
];

export default CommunityPage;

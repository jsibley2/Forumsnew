import React from "react";
import { Link } from "react-router-dom";
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
import { Users, MessageSquare, TrendingUp, Lock } from "lucide-react";

interface CommunityMember {
  id: string;
  name: string;
  avatar?: string;
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
  featuredMembers: CommunityMember[];
  coverImage?: string;
}

interface CommunityCardGridProps {
  communities?: Community[];
  onJoin?: (communityId: string) => void;
  onSubscribe?: (communityId: string) => void;
}

const CommunityCardGrid: React.FC<CommunityCardGridProps> = ({
  communities = defaultCommunities,
  onJoin = () => {},
  onSubscribe = () => {},
}) => {
  return (
    <div className="bg-background w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Discover Communities</h2>
        <p className="text-muted-foreground">
          Join communities that match your interests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <Card
            key={community.id}
            className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200"
          >
            {community.coverImage && (
              <Link to={`/community/${community.id}`}>
                <div className="h-32 w-full overflow-hidden cursor-pointer">
                  <img
                    src={community.coverImage}
                    alt={`${community.name} cover`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>
            )}

            <CardHeader>
              <div className="flex justify-between items-start">
                <Link
                  to={`/community/${community.id}`}
                  className="hover:text-[#3498db] transition-colors"
                >
                  <CardTitle className="cursor-pointer">
                    {community.name}
                  </CardTitle>
                </Link>
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
              <CardDescription>{community.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  <span className="text-sm">{community.memberCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-muted-foreground" />
                  <span className="text-sm">{community.topicCount} topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-muted-foreground" />
                  <span className="text-sm capitalize">
                    {community.activityLevel}
                  </span>
                </div>
              </div>

              {community.featuredMembers.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Featured members
                  </p>
                  <div className="flex -space-x-2">
                    {community.featuredMembers.map((member) => (
                      <Avatar key={member.id}>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {community.memberCount >
                      community.featuredMembers.length && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-xs font-medium">
                        +
                        {community.memberCount -
                          community.featuredMembers.length}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4">
              {community.type === "free" ? (
                <Button
                  onClick={() => onJoin(community.id)}
                  className="w-full bg-[#3498db] hover:bg-[#3498db]/90"
                >
                  Join Community
                </Button>
              ) : (
                <Button
                  onClick={() => onSubscribe(community.id)}
                  className="w-full bg-[#e74c3c] hover:bg-[#e74c3c]/90"
                >
                  <Lock size={16} className="mr-2" />
                  Subscribe
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Default mock data
const defaultCommunities: Community[] = [
  {
    id: "1",
    name: "Web Development",
    description:
      "A community for web developers to share knowledge and discuss the latest trends.",
    memberCount: 1250,
    topicCount: 342,
    activityLevel: "high",
    type: "free",
    featuredMembers: [
      {
        id: "u1",
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      {
        id: "u2",
        name: "Maria Garcia",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      {
        id: "u3",
        name: "David Kim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  },
  {
    id: "2",
    name: "UX/UI Design",
    description:
      "For designers focused on creating beautiful and functional user experiences.",
    memberCount: 875,
    topicCount: 218,
    activityLevel: "high",
    type: "paid",
    price: 9.99,
    featuredMembers: [
      {
        id: "u4",
        name: "Emma Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      },
      {
        id: "u5",
        name: "James Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  },
  {
    id: "3",
    name: "Data Science",
    description:
      "Explore data analysis, machine learning, and AI with fellow data enthusiasts.",
    memberCount: 620,
    topicCount: 175,
    activityLevel: "medium",
    type: "introductory",
    featuredMembers: [
      {
        id: "u6",
        name: "Sophia Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      },
      {
        id: "u7",
        name: "Michael Brown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      {
        id: "u8",
        name: "Olivia Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
      },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: "4",
    name: "Mobile Development",
    description: "For iOS, Android, and cross-platform mobile app developers.",
    memberCount: 945,
    topicCount: 287,
    activityLevel: "high",
    type: "free",
    featuredMembers: [
      {
        id: "u9",
        name: "Daniel Park",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
      },
      {
        id: "u10",
        name: "Isabella Lopez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
      },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=800&q=80",
  },
  {
    id: "5",
    name: "DevOps & Cloud",
    description:
      "Discuss cloud platforms, CI/CD, containerization, and infrastructure as code.",
    memberCount: 530,
    topicCount: 142,
    activityLevel: "medium",
    type: "paid",
    price: 12.99,
    featuredMembers: [
      {
        id: "u11",
        name: "Noah Taylor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
      },
      {
        id: "u12",
        name: "Ava Martinez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
      },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
  {
    id: "6",
    name: "Game Development",
    description:
      "For game developers working with engines like Unity, Unreal, and more.",
    memberCount: 780,
    topicCount: 210,
    activityLevel: "high",
    type: "introductory",
    featuredMembers: [
      {
        id: "u13",
        name: "Liam Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
      },
      {
        id: "u14",
        name: "Charlotte Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte",
      },
      {
        id: "u15",
        name: "Ethan Rodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
      },
    ],
    coverImage:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
  },
];

export default CommunityCardGrid;

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('free', 'paid', 'introductory')) DEFAULT 'free',
  price DECIMAL(10,2),
  cover_image TEXT,
  member_count INTEGER DEFAULT 0,
  topic_count INTEGER DEFAULT 0,
  activity_level TEXT CHECK (activity_level IN ('high', 'medium', 'low')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_memberships table
CREATE TABLE IF NOT EXISTS public.community_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  subscription_type TEXT CHECK (subscription_type IN ('free', 'paid', 'introductory')) DEFAULT 'free',
  has_new_activity BOOLEAN DEFAULT FALSE,
  unread_count INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

-- Create topics table
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  community TEXT NOT NULL,
  sub_community TEXT NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table for paid communities
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')) DEFAULT 'active',
  price DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topics_community_id ON public.topics(community_id);
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON public.topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_is_featured ON public.topics(is_featured);
CREATE INDEX IF NOT EXISTS idx_topics_is_new ON public.topics(is_new);
CREATE INDEX IF NOT EXISTS idx_comments_topic_id ON public.comments(topic_id);
CREATE INDEX IF NOT EXISTS idx_community_memberships_user_id ON public.community_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table communities;
alter publication supabase_realtime add table community_memberships;
alter publication supabase_realtime add table topics;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table subscriptions;

-- Insert sample data

-- Sample users (first insert into auth.users, then into public.users)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{}', '{}', false, 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'moderator@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{}', '{}', false, 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', 'sarah@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{}', '{}', false, 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', 'newmember@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{}', '{}', false, 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', 'system@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{}', '{}', false, 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Now insert into public.users table
INSERT INTO public.users (id, name, avatar) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'),
  ('00000000-0000-0000-0000-000000000002', 'Moderator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderator'),
  ('00000000-0000-0000-0000-000000000003', 'Sarah', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'),
  ('00000000-0000-0000-0000-000000000004', 'NewMember', 'https://api.dicebear.com/7.x/avataaars/svg?seed=newmember'),
  ('00000000-0000-0000-0000-000000000005', 'System', 'https://api.dicebear.com/7.x/avataaars/svg?seed=system')
ON CONFLICT (id) DO NOTHING;

-- Sample communities
INSERT INTO public.communities (id, name, description, type, price, cover_image, member_count, topic_count, activity_level) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Web Development', 'A community for web developers to share knowledge and discuss the latest trends.', 'free', NULL, 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80', 1250, 342, 'high'),
  ('22222222-2222-2222-2222-222222222222', 'UX/UI Design', 'For designers focused on creating beautiful and functional user experiences.', 'paid', 9.99, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', 875, 218, 'high'),
  ('33333333-3333-3333-3333-333333333333', 'Data Science', 'Explore data analysis, machine learning, and AI with fellow data enthusiasts.', 'introductory', NULL, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 620, 175, 'medium'),
  ('44444444-4444-4444-4444-444444444444', 'Mobile Development', 'For iOS, Android, and cross-platform mobile app developers.', 'free', NULL, 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=800&q=80', 945, 287, 'high'),
  ('55555555-5555-5555-5555-555555555555', 'DevOps & Cloud', 'Discuss cloud platforms, CI/CD, containerization, and infrastructure as code.', 'paid', 12.99, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', 530, 142, 'medium'),
  ('66666666-6666-6666-6666-666666666666', 'Game Development', 'For game developers working with engines like Unity, Unreal, and more.', 'introductory', NULL, 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80', 780, 210, 'high')
ON CONFLICT (id) DO NOTHING;

-- Sample topics
INSERT INTO public.topics (id, title, content, author_id, author_name, author_avatar, community, sub_community, community_id, likes, comments, is_featured, is_new) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Welcome to our new forum platform!', 'We are excited to launch our new community forum platform. Join the discussion and connect with other members.', '00000000-0000-0000-0000-000000000001', 'Admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'General', 'Announcements', '11111111-1111-1111-1111-111111111111', 42, 15, TRUE, FALSE),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tips for getting the most out of the community', 'Here are some tips to help you get the most out of your community experience and connect with other members.', '00000000-0000-0000-0000-000000000002', 'Moderator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderator', 'Help', 'Getting Started', '11111111-1111-1111-1111-111111111111', 38, 22, TRUE, FALSE),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'What is your favorite feature so far?', 'I am curious to hear what features everyone is enjoying the most on our new platform!', '00000000-0000-0000-0000-000000000003', 'Sarah', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', 'General', 'Discussions', '11111111-1111-1111-1111-111111111111', 12, 8, FALSE, TRUE),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Introducing myself to the community', 'Hello everyone! I am new here and wanted to introduce myself. I am excited to be part of this community.', '00000000-0000-0000-0000-000000000004', 'NewMember', 'https://api.dicebear.com/7.x/avataaars/svg?seed=newmember', 'General', 'Introductions', '11111111-1111-1111-1111-111111111111', 24, 18, FALSE, FALSE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Upcoming maintenance window', 'We will be performing scheduled maintenance this weekend. The platform may be unavailable for a short period.', '00000000-0000-0000-0000-000000000005', 'System', 'https://api.dicebear.com/7.x/avataaars/svg?seed=system', 'General', 'Announcements', '11111111-1111-1111-1111-111111111111', 5, 3, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Sample community memberships
INSERT INTO public.community_memberships (user_id, community_id, subscription_type, has_new_activity, unread_count) VALUES 
  ('00000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'free', TRUE, 3),
  ('00000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'paid', FALSE, 0),
  ('00000000-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'free', TRUE, 12),
  ('00000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'introductory', FALSE, 0),
  ('00000000-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555', 'paid', TRUE, 5),
  ('00000000-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666666', 'introductory', FALSE, 0)
ON CONFLICT (user_id, community_id) DO NOTHING;
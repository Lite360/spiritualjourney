-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- CATEGORIES
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- POSTS
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  reading_time INTEGER,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- TAGS
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- POST_TAGS
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- PROGRAMS
CREATE TABLE programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  featured_image TEXT,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  venue TEXT,
  address TEXT,
  speaker TEXT,
  registration_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- AUDIO
CREATE TABLE audio (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  audio_url TEXT,
  duration INTEGER,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- VIDEOS
CREATE TABLE videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail TEXT,
  video_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RESOURCES
CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  resource_type TEXT,
  resource_url TEXT,
  purchase_url TEXT,
  price DECIMAL(10,2),
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- DAILY_REFLECTIONS
CREATE TABLE daily_reflections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  scripture TEXT NOT NULL,
  reference TEXT NOT NULL,
  reflection TEXT NOT NULL,
  image TEXT,
  status TEXT DEFAULT 'draft',
  publish_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- CONTACT_MESSAGES
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- NEWSLETTER_SUBSCRIBERS
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- SITE_SETTINGS
CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name TEXT DEFAULT 'Spiritual Journey',
  site_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  founder_name TEXT DEFAULT 'Ife Dayo',
  founder_bio TEXT,
  founder_image TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,
  x_url TEXT,
  contact_email TEXT,
  newsletter_email TEXT,
  footer_copyright TEXT,
  seo_defaults JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- MEDIA (For keeping track of files in storage)
CREATE TABLE media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create an admin check function
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Admins can read all, individuals can read/update their own
CREATE POLICY "Admins can do everything on profiles" ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Public Read Policies
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read published posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Anyone can read post_tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can read published programs" ON programs FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can read published audio" ON audio FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can read published videos" ON videos FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can read published resources" ON resources FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can read published reflections" ON daily_reflections FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert newsletter subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Admin All-Access Policies
CREATE POLICY "Admins can do everything on categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on posts" ON posts FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on tags" ON tags FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on post_tags" ON post_tags FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on programs" ON programs FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on audio" ON audio FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on videos" ON videos FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on resources" ON resources FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on daily_reflections" ON daily_reflections FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on contact_messages" ON contact_messages FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on site_settings" ON site_settings FOR ALL USING (is_admin());
CREATE POLICY "Admins can do everything on media" ON media FOR ALL USING (is_admin());

-- Run this entire script in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists admin_users (
  id text primary key, email text unique not null, password_hash text not null, name text not null,
  created_at timestamptz not null default now(), last_login_at timestamptz
);
create table if not exists profile (
  id text primary key default 'singleton', name text not null default '', title text not null default '',
  summary text not null default '', about_body text not null default '', research_interests text not null default '',
  career_interests text not null default '', key_strengths text not null default '', profile_image_url text,
  email text, phone text, location text, linkedin text, github text, other_link_label text, other_link_url text,
  cv_document_id text, updated_at timestamptz not null default now()
);
create table if not exists education (
 id text primary key, degree text not null, institution text not null, city text, country text,
 start_date text not null, end_date text not null, field_of_study text, details text, sort_order integer not null default 0,
 created_at timestamptz not null default now()
);
create table if not exists experience (
 id text primary key, position text not null, organization text not null, location text, start_date text not null,
 end_date text not null, responsibilities text not null default '', skills_used text not null default '',
 sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists skills (id text primary key, name text not null, category text not null, sort_order integer not null default 0);
create table if not exists projects (
 id text primary key, title text not null, description text not null default '', role text, methods text not null default '',
 date text, external_url text, document_id text, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists certifications (
 id text primary key, title text not null, issuer text not null default '', date text, verification_url text,
 document_id text, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists documents (
 id text primary key, title text not null, description text, category text not null default 'Other', file_url text,
 external_url text, file_name text, file_type text, file_size integer, is_public boolean not null default true,
 uploaded_at timestamptz not null default now()
);
create table if not exists contact_messages (
 id text primary key, name text not null, email text not null, subject text not null, message text not null,
 is_read boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists gallery_items (
 id text primary key, title text not null default '', image_url text not null, caption text,
 sort_order integer not null default 0, is_public boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists navigation_items (
 id text primary key, label text not null, href text not null, sort_order integer not null default 0,
 is_visible boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists site_settings (
 id text primary key default 'singleton', site_title text not null default 'Portfolio',
 meta_description text not null default '', og_image_url text, primary_color_note text not null default ''
);

insert into profile (id) values ('singleton') on conflict (id) do nothing;
insert into site_settings (id) values ('singleton') on conflict (id) do nothing;

insert into navigation_items (id,label,href,sort_order,is_visible) values
('nav-about','About','/#about',0,true),('nav-education','Education','/#education',1,true),
('nav-experience','Experience','/#experience',2,true),('nav-research','Research','/#research',3,true),
('nav-skills','Skills','/#skills',4,true),('nav-certifications','Certifications','/#certifications',5,true),
('nav-projects','Projects','/#projects',6,true),('nav-gallery','Gallery','/#gallery',7,true),
('nav-documents','Documents','/#documents',8,true),('nav-contact','Contact','/#contact',9,true)
on conflict (id) do nothing;

-- Public reads are intentionally enabled because the portfolio is public.
-- Admin mutations are performed server-side with SUPABASE_SERVICE_ROLE_KEY.
alter table profile enable row level security;
alter table education enable row level security;
alter table experience enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table certifications enable row level security;
alter table documents enable row level security;
alter table gallery_items enable row level security;
alter table navigation_items enable row level security;
alter table site_settings enable row level security;
alter table contact_messages enable row level security;
alter table admin_users enable row level security;

drop policy if exists "public read profile" on profile;
create policy "public read profile" on profile for select using (true);
drop policy if exists "public read education" on education;
create policy "public read education" on education for select using (true);
drop policy if exists "public read experience" on experience;
create policy "public read experience" on experience for select using (true);
drop policy if exists "public read skills" on skills;
create policy "public read skills" on skills for select using (true);
drop policy if exists "public read projects" on projects;
create policy "public read projects" on projects for select using (true);
drop policy if exists "public read certifications" on certifications;
create policy "public read certifications" on certifications for select using (true);
drop policy if exists "public read documents" on documents;
create policy "public read documents" on documents for select using (is_public = true);
drop policy if exists "public read gallery" on gallery_items;
create policy "public read gallery" on gallery_items for select using (is_public = true);
drop policy if exists "public read navigation" on navigation_items;
create policy "public read navigation" on navigation_items for select using (is_visible = true);
drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);

-- Contact form needs public insert.
drop policy if exists "public insert contact" on contact_messages;
create policy "public insert contact" on contact_messages for insert with check (true);

-- Create the Storage bucket used by the admin upload API.
insert into storage.buckets (id, name, public) values ('uploads','uploads',true)
on conflict (id) do update set public = true;
drop policy if exists "public read uploads" on storage.objects;
create policy "public read uploads" on storage.objects for select using (bucket_id = 'uploads');

-- Editable, public-facing site settings (single row). Lets the admin change
-- profile info from the studio instead of editing code.
create table if not exists site_settings (
  id int primary key default 1,
  artist_name text not null default 'Vartika',
  about_text text,
  contact_email text,
  instagram_url text,
  youtube_url text,
  artist_photo text,
  birthday_name text,
  birthday_message text,
  birthday_always_on boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

alter table site_settings enable row level security;

create policy "site settings are publicly readable"
  on site_settings for select using (true);
create policy "admins manage site settings"
  on site_settings for all using (is_admin()) with check (is_admin());

-- seed the single row with the current values
insert into site_settings (
  id, artist_name, about_text, contact_email, instagram_url, youtube_url,
  artist_photo, birthday_name, birthday_message, birthday_always_on
) values (
  1,
  'Vartika',
  E'Vartika makes things with her hands — clay figures shaped one coil at a time, poster-colour and watercolour paintings, sketches pulled straight out of a photograph, crochet stitched loop by loop, and photography that catches the moment before you knew you wanted it. Most of it starts as a video on her YouTube channel, because half the fun is watching it come together.\n\nThis little corner of the internet exists to keep it all in one place — browse the gallery, take a finished piece home, or ask her to make something just for you.',
  'vartika2571@gmail.com',
  'https://instagram.com/_que.pictures_',
  'https://youtube.com/@kiddoart-f1',
  'https://cbsdnaeroopayopohpra.supabase.co/storage/v1/object/public/artwork-images/site/vartika-portrait.png',
  'Guddu',
  E'Happy birthday! Every single thing on this site exists because you keep making beautiful things out of clay, colour, thread, and light — I just wanted to give it a home of its own. I love you. Here''s to everything you make next.',
  true
) on conflict (id) do nothing;

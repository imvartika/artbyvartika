-- Lets a commission/buy request include a link to reference material
-- (a Google Drive/Dropbox/Pinterest link, etc.) instead of a direct upload.
alter table order_requests add column if not exists reference_url text;

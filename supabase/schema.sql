-- ============================================================================
-- Portfolio backend schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- ============================================================================

-- Required extensions (Supabase enables pgcrypto by default)
create extension if not exists pgcrypto;
create extension if not exists btree_gist;

-- ----------------------------------------------------------------------------
-- contacts: every submission from the homepage contact form
-- ----------------------------------------------------------------------------
create table if not exists contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  subject     text,
  message     text        not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists contacts_created_at_idx on contacts (created_at desc);

-- ----------------------------------------------------------------------------
-- meetings: scheduled calls. status: pending | confirmed | cancelled
-- Conflict prevention via EXCLUDE constraint on the [start, end) range.
-- ----------------------------------------------------------------------------
create table if not exists meetings (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  purpose     text,
  slot_start  timestamptz not null,
  slot_end    timestamptz not null,
  timezone    text        not null default 'UTC',
  status      text        not null default 'pending'
              check (status in ('pending', 'confirmed', 'cancelled')),
  created_at  timestamptz not null default now(),

  constraint meetings_slot_valid check (slot_end > slot_start),

  -- Reject any new row that overlaps an active (non-cancelled) meeting.
  constraint meetings_no_overlap exclude using gist (
    tstzrange(slot_start, slot_end, '[)') with &&
  ) where (status <> 'cancelled')
);

create index if not exists meetings_slot_start_idx on meetings (slot_start);
create index if not exists meetings_status_idx     on meetings (status);

-- ----------------------------------------------------------------------------
-- visits: lightweight analytics row per page view (privacy-first; no IP stored)
-- ----------------------------------------------------------------------------
create table if not exists visits (
  id          uuid primary key default gen_random_uuid(),
  path        text        not null,
  referrer    text,
  user_agent  text,
  country     text,
  ip_hash     text, -- sha-256 of (ip + daily salt) — used only for unique-visitor counts
  session_id  text,
  created_at  timestamptz not null default now()
);

create index if not exists visits_created_at_idx on visits (created_at desc);
create index if not exists visits_path_idx       on visits (path);

-- ----------------------------------------------------------------------------
-- Row-Level Security
-- All tables: deny by default. The server uses the service-role key (bypasses RLS).
-- Anon key from the browser cannot read or write these tables.
-- ----------------------------------------------------------------------------
alter table contacts enable row level security;
alter table meetings enable row level security;
alter table visits   enable row level security;

-- (intentionally no policies — anon access is fully denied;
--  every read/write goes through the server with the service-role key)

create table if not exists users(id serial primary key,phone text unique not null,name text not null,pass_hash text not null,role text default 'user',coins int default 0,earned int default 0,created_at timestamptz default now());
create table if not exists videos(id serial primary key,user_id int references users(id),url text not null,caption text default '',likes int default 0,views int default 0,created_at timestamptz default now());
create table if not exists likes(user_id int,video_id int,primary key(user_id,video_id));
create table if not exists comments(id serial primary key,video_id int,user_id int,text text,created_at timestamptz default now());
create table if not exists follows(follower_id int,following_id int,primary key(follower_id,following_id));
create table if not exists gifts(id serial primary key,from_id int,to_id int,video_id int,gift text,coins int,created_at timestamptz default now());
create table if not exists coin_orders(id serial primary key,user_id int,coins int,ref text,status text default 'pending',created_at timestamptz default now());
create table if not exists withdrawals(id serial primary key,user_id int,birr int,method text,account text,status text default 'pending',created_at timestamptz default now());

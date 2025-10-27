CREATE SCHEMA "zipft";
--> statement-breakpoint
CREATE TYPE "zipft"."communication_purpose" AS ENUM('verification', 'recovery', 'transfer/verification', 'transfer/recipient', 'deletion');--> statement-breakpoint
CREATE TYPE "zipft"."communication_type" AS ENUM('email');--> statement-breakpoint
CREATE TYPE "zipft"."object_buckets" AS ENUM('zipft-cdn', 'zipft-cdn-public');--> statement-breakpoint
CREATE TYPE "zipft"."transfer_type" AS ENUM('mail', 'link');--> statement-breakpoint
CREATE TYPE "zipft"."user_roles" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "zipft"."communications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text,
	"type" "zipft"."communication_type" NOT NULL,
	"purpose" "zipft"."communication_purpose" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zipft"."deletion_challenges" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 minutes' NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "zipft"."objects" (
	"id" text PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"md5" text NOT NULL,
	"s3_bucket" "zipft"."object_buckets" NOT NULL,
	"s3_key" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zipft"."recovery_challenges" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '10 minutes' NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "zipft"."requests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "zipft"."requests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"session_id" text,
	"path" text NOT NULL,
	"method" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"is_mobile" boolean,
	"browser" text,
	"platform" text,
	"made_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zipft"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_verified_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zipft"."transfer_challenges" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '10 minutes' NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "zipft"."transfer_verification_challenges" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"transferToken" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 minutes' NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "zipft"."transfers" (
	"token" text PRIMARY KEY NOT NULL,
	"transfer_type" "zipft"."transfer_type" NOT NULL,
	"user_id" uuid,
	"anonymous" boolean DEFAULT false,
	"from" text,
	"fromVerified" boolean DEFAULT false,
	"to" text[],
	"objectId" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"beacon" boolean DEFAULT false,
	"download_limit" integer,
	"duration_start" timestamp,
	"duration_end" timestamp,
	"title" text,
	"message" text
);
--> statement-breakpoint
CREATE TABLE "zipft"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"avatar" text,
	"avatar_url" text,
	"role" "zipft"."user_roles" DEFAULT 'user' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"onboarded" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "zipft"."verification_challenges" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 minutes' NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "zipft"."deletion_challenges" ADD CONSTRAINT "deletion_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."recovery_challenges" ADD CONSTRAINT "recovery_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."requests" ADD CONSTRAINT "requests_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "zipft"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."transfer_challenges" ADD CONSTRAINT "transfer_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."transfer_verification_challenges" ADD CONSTRAINT "transfer_verification_challenges_transferToken_transfers_token_fk" FOREIGN KEY ("transferToken") REFERENCES "zipft"."transfers"("token") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."transfers" ADD CONSTRAINT "transfers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."transfers" ADD CONSTRAINT "transfers_objectId_objects_id_fk" FOREIGN KEY ("objectId") REFERENCES "zipft"."objects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."users" ADD CONSTRAINT "users_avatar_objects_id_fk" FOREIGN KEY ("avatar") REFERENCES "zipft"."objects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."verification_challenges" ADD CONSTRAINT "verification_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."users"("id") ON DELETE cascade ON UPDATE no action;
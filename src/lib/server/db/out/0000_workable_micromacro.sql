CREATE SCHEMA "zipft";
--> statement-breakpoint
CREATE TYPE "zipft"."communication_purpose" AS ENUM('verification', 'password_reset');--> statement-breakpoint
CREATE TYPE "zipft"."communication_type" AS ENUM('email');--> statement-breakpoint
CREATE TABLE "zipft"."communication" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"type" "zipft"."communication_type" NOT NULL,
	"purpose" "zipft"."communication_purpose" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zipft"."password_resets" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 minutes' NOT NULL,
	"used_at" timestamp,
	"used" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zipft"."session" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"ip_addr" text,
	"user_agent" text,
	"fingerprint" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 month' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zipft"."user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "zipft"."verification_challenges" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 minutes' NOT NULL,
	"used_at" timestamp,
	"defeated" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "zipft"."communication" ADD CONSTRAINT "communication_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."password_resets" ADD CONSTRAINT "password_resets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."verification_challenges" ADD CONSTRAINT "verification_challenges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."user"("id") ON DELETE no action ON UPDATE no action;
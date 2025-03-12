ALTER TABLE "zipft"."communication" DROP CONSTRAINT "communication_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "zipft"."password_resets" DROP CONSTRAINT "password_resets_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "zipft"."session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "zipft"."verification_challenges" DROP CONSTRAINT "verification_challenges_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "zipft"."communication" ADD CONSTRAINT "communication_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."password_resets" ADD CONSTRAINT "password_resets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zipft"."verification_challenges" ADD CONSTRAINT "verification_challenges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "zipft"."user"("id") ON DELETE cascade ON UPDATE no action;
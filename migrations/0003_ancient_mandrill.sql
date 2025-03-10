ALTER TABLE "boards" DROP CONSTRAINT "boards_workspace_id_workspaces_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'boards'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "boards" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "boards" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_id_workspaces_id_fk" FOREIGN KEY ("id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boards" DROP COLUMN "workspace_id";
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_id_unique";--> statement-breakpoint
ALTER TABLE "boards" DROP CONSTRAINT "boards_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "cards" DROP CONSTRAINT "cards_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "boards" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "boards" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "cards" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "workspace_id" varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "board_id" varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
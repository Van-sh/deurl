import { user } from "~db/schema";
import { createTable } from "~db/utils/table";
import { timestamps } from "~db/utils/timestamp.schema";

export const link = createTable("link", (t) => ({
   id: t.integer().primaryKey(),
   code: t.text().unique().notNull(),
   originalUrl: t.text("original_url").notNull(),
   userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
   clickCount: t.integer("click_count").notNull().default(0),
   ...timestamps,
}));

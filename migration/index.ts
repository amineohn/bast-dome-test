import { Kysely, sql } from "kysely"

type DBPerson = {
  id: number
  first_name: string
  last_name: string
  gender: string
  serial: string
  created_at: Date
}

export async function up(db: Kysely<DBPerson>): Promise<void> {
  await db.schema
    .createTable("person")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("first_name", "varchar", (col) => col.notNull())
    .addColumn("last_name", "varchar")
    .addColumn("gender", "varchar(50)", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()
}
export async function down(db: Kysely<DBPerson>): Promise<void> {
  await db.schema.dropTable("person").execute()
}

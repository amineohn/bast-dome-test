import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import Cursor from "pg-cursor"

type Database = {
  pool: Pool
  dialect: PostgresDialect
}
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: "localhost",
      database: "kysely_test",
    }),
    cursor: Cursor,
  }),
})

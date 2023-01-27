import { promises as fs } from "fs"
import * as path from "path"
import { FileMigrationProvider, Migrator } from "kysely"

import { db } from "@/lib/kysely"

async function onMigrate() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: "../migrations",
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  if (results === undefined) throw new Error("Failed to get results.")

  results?.forEach((migration) => {
    if (migration.status === "Success") {
      console.log(
        `migration "${migration.migrationName}" was executed successfully. Status: (${migration.status})`
      )
    } else if (migration.status === "Error") {
      console.error(`failed to execute migration "${migration.migrationName}"`)
    }
  })

  if (error) {
    console.error("failed to migrate")
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

onMigrate()

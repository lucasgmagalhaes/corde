import { createConnection, Connection } from "typeorm";
import * as conn from "./config";

/**
 * Responsable for all database functions
 */
export let dbConnection: Connection;

/**
 * Creates connection to database
 */
export async function connect(): Promise<void> {
  let log = true;

  // Only enable log if is development environment
  if (process.env.NODE_ENV !== "DEV") {
    log = false;
  }

  /**
   * synchronize indicates if database schema should be auto created on every application launch.
   * Be careful with this option and don’t use this in production, otherwise you can lose production data.
   * This option is useful during debug and development.
   */

  console.log(conn.dbConfig.username);
  try {
    const connection = await createConnection({
      type: "postgres",
      host: conn.dbConfig.host,
      port: Number.parseInt(conn.dbConfig.port),
      username: conn.dbConfig.username,
      password: conn.dbConfig.password,
      database: conn.dbConfig.database,
      synchronize: false,
      migrationsRun: true,
      logging: log,
      maxQueryExecutionTime: 20000,
      logger: "advanced-console",
      entities: ["./build/src/entity/**/*.js"],
      migrations: ["./build/src/migration/**/*.js"],
      subscribers: ["./build/src/subscriber/**/*.js"],
      cli: {
        migrationsDir: "./src/migration",
      },
    });
    dbConnection = connection;
    console.log("> Connected to " + connection.options.database);
    console.log("Running migrations...");
    try {
      const migrations = await connection.runMigrations();
      if (migrations) {
        const failMigrations = migrations
          .filter((migration) => migration.id === undefined)
          .map((migration_1) => migration_1.name);

        if (failMigrations && failMigrations.length > 0) {
          console.error("\n Migrations errors: " + failMigrations);
          return Promise.reject();
        }

        console.log("Finished migrations");

        if (migrations.length > 0) {
          console.log(migrations.map((migration_2) => migration_2.name));
        }

        return Promise.resolve();
      }

      console.log("Finished migrations");
      return await Promise.resolve();
    } catch (e) {
      return await Promise.reject();
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
    return await Promise.reject();
  }
}

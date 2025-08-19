import postgres from "postgres";
import {config} from 'dotenv';
import {drizzle} from "drizzle-orm/postgres-js";
import {migrate} from "drizzle-orm/postgres-js/migrator";

config({path: '.env.local'});

const migrationClient = postgres(process.env.DATABASE_URL as string);

const main = async () => {

    await migrate(drizzle(migrationClient), {migrationsFolder: "./src/database/migrations"})

    await migrationClient.end();
}

main();

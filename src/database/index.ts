import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {config} from 'dotenv';
import * as schema from "./schema";

config({path: '.env.local'}); // or .env.local

const queryClient = postgres(process.env.DATABASE_URL as string);
const database = drizzle(queryClient, {schema});

export default database;
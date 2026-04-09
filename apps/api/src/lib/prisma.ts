import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client.js";

config({ path: "../../.env" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
	connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

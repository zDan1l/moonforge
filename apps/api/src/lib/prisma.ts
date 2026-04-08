// Load env vars as early as possible
import { config } from "dotenv";
config({ path: "../../.env" });

import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  ((): PrismaClient => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }

    // Parse connection string to extract connection details
    // Format: postgresql://username:password@host:port/database
    const match = connectionString.match(
      /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/,
    );

    if (!match) {
      throw new Error("Invalid DATABASE_URL format");
    }

    const [, user, password, host, port, database] = match;

    const pool = new Pool({
      host,
      port: Number.parseInt(port, 10),
      database,
      user,
      password,
    });

    const adapter = new PrismaPg(pool);

    return new PrismaClient(
      {
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      },
    );
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

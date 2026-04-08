import { PrismaClient } from "@/generated/prisma";

/**
 * Prisma Client singleton instance
 *
 * In development, reuse the instance to avoid exhausting database connections
 * In production, create a new instance per request lifecycle
 */
const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
	globalThis.prismaGlobal = prisma;
}

export default prisma;

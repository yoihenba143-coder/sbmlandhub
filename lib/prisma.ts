import dotenv from "dotenv";
dotenv.config({ override: true });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
    connectionString,
});

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    connectionString: string | undefined;
};

if (globalForPrisma.connectionString !== connectionString) {
    globalForPrisma.prisma = undefined;
    globalForPrisma.connectionString = connectionString;
}

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

// Refreshed for updated Prisma client schema
export default prisma;

import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import { main } from "../prisma/seed.js";

main(prisma)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

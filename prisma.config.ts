// prisma.config.ts
import 'dotenv/config'  // This loads .env file
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  db: {
    providers: {
      postgresql: {
        url: process.env.DATABASE_URL,  // Now this will work
      },
    },
  },
})
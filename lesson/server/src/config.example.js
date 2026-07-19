// Copy this to config.js and paste your Neon connection string in.
// config.js is gitignored, so the string never gets committed.
//
// Use the POOLED string from the Neon dashboard: it ends in -pooler.

const config = {
  databaseUrl: "postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/neondb?sslmode=require",
};

export default config;

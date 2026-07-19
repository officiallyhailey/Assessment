// Copy this file to config.js and paste your own Neon connection string in.
//
//   cp src/config.example.js src/config.js
//
// config.js is gitignored, in both server/.gitignore and the root .gitignore,
// because that string is a password. This example file is the only one that
// ever gets committed.
//
// The string comes from the Neon dashboard. Use the POOLED one: it ends in
// -pooler and it is what keeps a serverless database happy with a connection
// pool sitting in front of it.

const config = {
  databaseUrl:
    "postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
};

export default config;

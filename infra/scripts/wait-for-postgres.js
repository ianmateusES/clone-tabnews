require("dotenv").config();

const { exec } = require("node:child_process");
const { Client } = require("pg");

function checkPostgresDocker() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgresDocker();
      return;
    }

    console.log("\n🟢 Postgres está pronto e aceitando conexões!\n");
  }
}

async function checkPostgresClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    await client.connect();
  } catch (err) {
    process.stdout.write(".");
    checkPostgresClient();
  } finally {
    await client.end();
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");

if (process.env.POSTGRES_HOST !== "localhost") {
  checkPostgresClient();
} else {
  checkPostgresDocker();
}

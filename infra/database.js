import { Client } from "pg";

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "development" ? false : true;
}

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
    throw Error("Error connecting to the database");
  }

  try {
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw Error("Error querying the database");
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
    throw Error("Error connecting to the database");
  }

  try {
    return client.query(queryObject);
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

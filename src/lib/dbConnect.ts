import {
  MongoClient,
  ServerApiVersion,
  type Collection,
  type Document,
} from "mongodb";

const uri = process.env.MONGODB_URI;
const dbname = process.env.BDNAME || process.env.DBNAME;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env");
}

if (!dbname) {
  throw new Error("Please add BDNAME or DBNAME to .env");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 15_000,
  connectTimeoutMS: 15_000,
  socketTimeoutMS: 45_000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const MAX_CONNECT_ATTEMPTS = 4;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function collectErrorText(error: unknown) {
  const parts: string[] = [];

  let current: unknown = error;
  let depth = 0;

  while (current instanceof Error && depth < 5) {
    parts.push(current.message);
    current = current.cause;
    depth += 1;
  }

  return parts.join(" ").toLowerCase();
}

function isRetryableMongoError(error: unknown) {
  const text = collectErrorText(error);

  return (
    text.includes("enotfound") ||
    text.includes("eai_again") ||
    text.includes("mongoserverselectionerror") ||
    text.includes("mongonetworkerror") ||
    text.includes("topology is closed")
  );
}

function isConnectionAlive(client: MongoClient) {
  const topology = (client as MongoClient & { topology?: { isConnected?: () => boolean } })
    .topology;

  if (topology && typeof topology.isConnected === "function") {
    return topology.isConnected();
  }

  return true;
}

async function resetMongoClient() {
  if (global._mongoClient) {
    await global._mongoClient.close().catch(() => {});
  }

  global._mongoClient = undefined;
  global._mongoClientPromise = undefined;
}

async function createMongoClient() {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
    const client = new MongoClient(uri!, options);

    try {
      await client.connect();
      await client.db(dbname).command({ ping: 1 });
      global._mongoClient = client;
      return client;
    } catch (error) {
      lastError = error;
      await client.close().catch(() => {});

      if (!isRetryableMongoError(error) || attempt === MAX_CONNECT_ATTEMPTS) {
        throw error;
      }

      await sleep(attempt * 1000);
    }
  }

  throw lastError;
}

async function getMongoClient(): Promise<MongoClient> {
  if (global._mongoClient && isConnectionAlive(global._mongoClient)) {
    try {
      await global._mongoClient.db(dbname).command({ ping: 1 });
      return global._mongoClient;
    } catch {
      await resetMongoClient();
    }
  }

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createMongoClient().catch(async (error) => {
      await resetMongoClient();
      throw error;
    });
  }

  return global._mongoClientPromise;
}

export async function dbConnect<T extends Document = Document>(
  collectionName: string
): Promise<Collection<T>> {
  const client = await getMongoClient();
  return client.db(dbname).collection<T>(collectionName);
}

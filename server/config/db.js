import mongoose from 'mongoose';

let mongoMemoryServerInstance = null;

async function startMemoryMongo() {
  console.log('Starting in-memory MongoDB server...');
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  mongoMemoryServerInstance = await MongoMemoryServer.create({
    instance: { launchTimeout: 60000 },
  });
  const uri = mongoMemoryServerInstance.getUri();
  console.log(`In-memory MongoDB started at: ${uri}`);
  await mongoose.connect(uri);
  console.log(`MongoDB connected (in-memory): ${mongoose.connection.host}`);
}

export async function connectDB() {
  let uri = process.env.MONGODB_URI;
  mongoose.set('strictQuery', true);
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

  if (!uri || uri.includes('<username>') || uri.includes('<cluster>') || uri === 'memory') {
    await startMemoryMongo();
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`External MongoDB connection failed (${err.message}). Falling back to in-memory database...`);
    await startMemoryMongo();
  }
}


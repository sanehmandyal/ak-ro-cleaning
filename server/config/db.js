import mongoose from 'mongoose';

let mongoMemoryServerInstance = null;

export async function connectDB() {
  let uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('<cluster>') || uri === 'memory') {
    console.log('No external MongoDB URI specified. Starting in-memory MongoDB server...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServerInstance = await MongoMemoryServer.create({
      instance: { launchTimeout: 60000 },
    });
    uri = mongoMemoryServerInstance.getUri();
    console.log(`In-memory MongoDB started at: ${uri}`);
  }
  mongoose.set('strictQuery', true);
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}


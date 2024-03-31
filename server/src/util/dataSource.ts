import { DataSource } from 'typeorm';
import { Album } from '../album/album.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Album],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
});

export const connectToDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to the Postgres database');
  } catch (error: unknown) {
    console.log('Error', error);
    console.log('Failed to connect to the database');
    return process.exit(1);
  }

  return null;
};

import { DataSource } from 'typeorm';
import { Album } from '../entity/album.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5555,
  username: 'username',
  password: 'password',
  database: 'dbname',
  entities: [Album],
  synchronize: true,
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

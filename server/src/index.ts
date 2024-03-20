import app from './app';
//import { connectToDatabase } from './util/dataSource';

const PORT = 3000;

const start = async () => {
  //await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

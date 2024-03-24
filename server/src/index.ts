import app from './app';
//import { connectToDatabase } from './util/dataSource';

const PORT = process.env.PORT || 3000;

const start = async () => {
  //await connectToDatabase();

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} with env ${process.env.NODE_ENV}`,
    );
  });
};

start();

import express from 'express';
import cors from 'cors';
import { mongoDbConnect } from './config/mongoose.js';
import productRoutes from './routes/route.js'
import {seedDeliveryOptions} from "./config/defaultDeliveryOption.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/api', productRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


async function startServer() {
  await mongoDbConnect();
  await seedDeliveryOptions();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
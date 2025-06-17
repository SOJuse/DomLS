import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Настройка CORS
const corsOptions = {
  origin: '*', // Временно разрешаем все домены для тестирования
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DomLS API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

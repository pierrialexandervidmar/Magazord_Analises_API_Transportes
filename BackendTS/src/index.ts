import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import * as routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

routes.default(app); // Altere esta linha para usar a exportação padrão de routes

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

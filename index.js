import express from 'express';
import dotenv from 'dotenv/config';  
import userRoutes from './routes/user.routes.js';

const app = express();

// Middlewares que permiten a la app recibir y enviar datos en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la app
app.use('/api/v1/users',userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


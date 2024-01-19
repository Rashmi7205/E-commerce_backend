import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import testRouter from './routes/test.route.js';
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';

import errorMiddleware from './middlewares/error.middleware.js';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use('/api/home', testRouter);
// Authentication Routes
app.use('/api/auth', authRouter);
//product routes
app.use('/api/products',productRouter);
//cart routes
app.use('/api/cart',cartRoutes);
//order routes
app.use('/api/orders',orderRoutes);
//review Routes
app.use('/api/review',reviewRoutes);
//Admin routes
app.use('/api/admin',adminRoutes);

// for all the route except the the above routes
app.all('*', (req, res) => {
  return res.status(404).send('OOPS!! PAGE NOT FOUND');
});

app.use(errorMiddleware);

export default app;
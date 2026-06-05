const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const auditRoutes = require('./routes/auditRoutes');
const publicRoutes = require('./routes/publicRoutes');
const globalErrorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/AppError');


const app = express();

app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/public', publicRoutes); 

app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use (globalErrorHandler);

module.exports = app;
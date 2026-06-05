const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

mongoose.connect(config.mongoUri)
    .then(() => { 
        logger.info('DB connection successful!');
    })
    .catch(err => {
        logger.error('DB Connection Error:', err);
    });

const port = config.port;
app.listen(port, () => {
    logger.info(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});
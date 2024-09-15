require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 mins
        max: 100,
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

app.get('/', (req, res) => {
    res.send('<h1> Jobs API </h1> <a href="/api-docs">Documentation </a> ');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);

        app.listen(port, () => console.log(`Server is running on port ${port}... ➡️`));
    } catch (error) {
        console.log(error);
    }
};

start();

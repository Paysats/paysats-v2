import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { RateLimitMiddleware } from "./middlewares/rateLimit.middleware"
// routes
import healthRoutes from "./routes/health.routes"
import paymentRoutes from "./routes/payment.routes"
import rateRoutes from "./routes/rate.routes"

import { connectDatabase } from "./config/database"
import cookieParser from "cookie-parser"
import { handleControllerError, responseHandler } from "./utils/responseHandler"
import logger from "@/utils/logger"
import { config } from "./config/config"

const app = express()
const PORT = config.app.PORT

// cors
app.use(cors({
    origin: [config.app.FRONTEND_URL, "http://localhost:3000"], 
    optionsSuccessStatus: 200,
    credentials: true,
}))

// rate limiter
// app.use("/api/v1/", RateLimitMiddleware.generalLimiter)


// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()); // Parse cookies

// API routes
app.get("/health", healthRoutes)

// connect db
connectDatabase().catch((error) => {
    logger.error("Error connecting to database:", error)
});

// payment route
app.use("/api/v1/payments", paymentRoutes);

// rate conversion routes
app.use("/api/v1/rates", rateRoutes);


// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        message: 'Aboutly API Server',
        version: '1.0.0',
        documentation: '/api/docs',
    });
});


// 404 handler
app.use((_req, res) => {
    console.log("request ==>", _req)
    return responseHandler.notFound(
        res,
        "The requested resource was not found."
    )
})

// global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    return handleControllerError(err, res);
})


// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Server started at: http://localhost:${PORT}`);
  });
}

// // start server
// const startServer = async () => {
//     try {
//         await connectDatabase()
//         app.listen(PORT, () => {
//             loggers.server.started(Number(PORT), config.NODE_ENVIRONMENT);
//         })
//     } catch (error) {
//         console.error("Error starting server:", error)
//     }
// }

// startServer()

export default app
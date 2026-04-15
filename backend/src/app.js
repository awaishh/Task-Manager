import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()

//Basic configuration for express app
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Cors configuration for express app
app.use(cors({
    origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN?.split(","),
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
}))

//import the routes
import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import projectRouter from "./routes/project.routes.js"
import taskRouter from "./routes/task.routes.js"
import noteRouter from "./routes/note.routes.js"
import chatRouter from "./routes/chat.routes.js"

app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/notes", noteRouter)
app.use("/api/v1/chat", chatRouter)

app.get('/',(req,res)=>{
    res.send("Prose & Process API — v1.0.0")
})

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        statusCode,
        message,
        success: false,
        errors: err.errors || []
    })
})


export default app
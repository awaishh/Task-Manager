import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app.js";
import connectDb from "./db/index.js";
import { initSocketServer } from "./socket/index.js";

dotenv.config({
    path: "./.env"
});

const port = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initSocketServer(httpServer);

// Make io accessible to routes if needed (optional)
app.set("io", io);

connectDb()
    .then(() => {
        httpServer.listen(port, () => {
            console.log(`App is listening on port http://localhost:${port}`);
            console.log(`Socket.IO server initialized`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error", err);
        process.exit(1);
    });





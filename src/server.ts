import { createServer } from "http"; 
import { Server } from "socket.io";   
import { initMinio } from "./utils/minio.util.js";
import app from './app.js';

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" } 
});

app.set("io", io);

async function startServer() {
  try {
    await initMinio(); 
    
    httpServer.listen(PORT, () => {
      console.log(`✅ Server & Socket running on http://localhost:${PORT}`);
      console.log(`📖 Swagger API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start:", error);
  }
}

startServer();
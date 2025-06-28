import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

const app=express();
const server=http.createServer(app);

//Socket.io
export const io = new Server(server, {
    cors:{origin: "*"}
}); 

export const userSocketMap= {}; //storing online users: {userid-> scoketid}

//connection handler for socket.io
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; //get userId from query params
    console.log(`User connected: ${userId}`);  
    
    if(userId) {
        userSocketMap[userId] = socket.id; //store the socket id for the user
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //emit online users to all clients

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        delete userSocketMap[userId]; //remove the user from the map
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); //emit updated online users to all clients
    }) 
})

//Middlewares
app.use(express.json({limit: '4mb'}));
app.use(cors());

//Routes
app.use('/api/status',(req,res)=> res.send('Server is running'));
app.use('/api/auth',userRouter);
app.use('/api/messages',messageRouter);


//MONGODB Connection
await connectDB();

if(process.env.NODE_ENV !== "production") {
const PORT=process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server is running on ${PORT}`));
}

export default server; //export the server for vercel
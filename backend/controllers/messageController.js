import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";

//Get all users that are not logged in
export const getUsersForSidebar=async (req,res) => {
    try {
        const userId=req.user._id;
        const filteredUsers=await User.find({_id: {$ne: userId}}).select("-password");

        //Number on unseen messages
        const unseenMessages={};
        const promises=filteredUsers.map(async (user) => {
            const messages=await Message.find({senderId: user._id, receiverId: userId, seen: false});
            if(messages.length > 0) {
                unseenMessages[user._id]=messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages});
    } catch (err) {
        console.log(err.message);
        res.json({success: false, message: err.message});
    }
}

//Get all messages between two users
export const getMessages=async (req,res) => {
    try {
        const {id: selectedUserId} = req.params;
        const myId=req.user._id;
        //finding
        const messages= await Message.find({
            $or:[
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true}); //marking as seen
        res.json({success: true, messages});
    } catch (err) {
        console.log(err.message);
        res.json({success: false, message: err.message});
    }
}

//to mark mssg as seen using msgId
export const markMessageAsSeen=async (req,res) => {
    try {
        const {id}=req.params.id;
        await Message.findByIdAndUpdate(id, {seen: true});
        res.json({success: true});
    } catch (err) {
        console.log(err.message);
        res.json({success: false, message: err.message});
    }
}

//to send a message
export const sendMessage=async (req,res) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        //emitting the message to the receiver
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.json({success: true, newMessage});
    } catch (err) {
         console.log(err.message);
        res.json({success: false, message: err.message});
    }
}
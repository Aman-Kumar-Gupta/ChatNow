import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

export const ChatContext=createContext();

export const ChatProvider=({children})=>{
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser]=useState(null);
    const [unseenMessages, setUnseenMessages]=useState({});

    const { socket,axios } = useContext(AuthContext);

    //All Users for sidebar
    const getUsers= async ()=>{
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //To get Messages of curr user
    const getMessages= async (userId)=>{
        try {
            const {data}=await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //To send message to selected user
    const sendMessage= async (messageData) => {
        try {
            const {data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //func to subsc to msgs for selected user
    const subscribetoMessages=async () => {
        if(!socket) return;
        socket.on("newMessage",(newMessage)=>{
            if(selectedUser && newMessage.senderId===selectedUser._id){
                newMessage.seen=true;
                setMessages((prevMessages)=>[...prevMessages,newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages)=> ({
                    ...prevUnseenMessages,[newMessage.senderId] 
                    : prevUnseenMessages[newMessage.senderId] ? (prevUnseenMessages[newMessage.senderId] + 1 ): 1
                }))
            }
        })
    }
    //func to unsubsc to msgs 
    const unsubscribeFromMessages=()=>{
        if(socket) socket.off("newMessage");
    }
    useEffect(()=>{
        subscribetoMessages();
        return ()=> unsubscribeFromMessages();
    },[socket,selectedUser]);
    
    const value={
        messages,users,selectedUser,getUsers,getMessages,sendMessage,setSelectedUser,unseenMessages,setUnseenMessages
    }

    return (<ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>)
}
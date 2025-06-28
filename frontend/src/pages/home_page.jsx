import React, { useContext} from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/chat_container";
import RightSideBar from "../components/right_sidebar";
import { ChatContext } from "../../context/chat_context";

const HomePage = () => {
  const {selectedUser} =useContext(ChatContext); 
  return (
    <div className="w-full h-screen p-4 sm:p-6 lg:p-8">
      <div className={`glass rounded-3xl overflow-hidden h-full grid grid-cols-1 relative shadow-2xl ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <Sidebar />
        <ChatContainer />
        <RightSideBar/>
      </div> 
    </div>
  );
};

export default HomePage;

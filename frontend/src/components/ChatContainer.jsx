import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { Download } from 'lucide-react';

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subsribeToMessages,
        unsubscribeFromMessages,
        fileName,
        fileSize
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id);

        subsribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subsribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }


    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                            ? authUser.profilePic || "/avatar.png"
                                            : selectedUser.profilePic || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col justify-center items-center">
                            {/* Image Preview with File Name and Size */}
                            {message.image?.url && (
                                <div className="w-auto h-auto bg-gray-100 p-3 rounded-md border border-gray-300 flex flex-col items-center justify-center">
                                    <img
                                        src={message.image.url}
                                        alt="Attachment"
                                        className="max-w-[150px] max-h-[150px] rounded-md"
                                    />
                                    <div className="flex flex-col justify-center">

                                        <div className="text-xs text-gray-500 m-auto py-1"> {`${message.image.fileName.slice(0, 20)}${message.image.fileName.length > 20 ? "..." : ""}`}
                                        </div>

                                        {/* Download Button */}
                                        <div className="bold m-auto py-1">
                                            <a
                                                href={message.image.url}
                                                download
                                                className="btn btn-xs bg-green-500 text-white hover:bg-green-600"
                                            >
                                                <Download size={14} /> {`${message.image.fileSize}`}
                                            </a>
                                        </div>
                                    </div>
                                    {/* File Name and Size */}

                                </div>
                            )}

                            {/* Video Preview with File Name and Size */}
                            {message.vedio && (
                                <div className="w-auto h-auto bg-gray-200 p-3 rounded-md border border-gray-300 flex flex-col items-center justify-center">
                                    <video
                                        src={message.vedio.url}
                                        controls
                                        className="h-auto w-auto rounded-md"
                                    />

                                    {/* File Name and Size */}
                                    <div className="flex flex-col justify-center">

                                        <div className="text-xs text-gray-500 m-auto py-1"> {`${message.vedio.fileName.slice(0, 20)}${message.vedio.fileName.length > 20 ? "..." : ""}`}
                                        </div>

                                        {/* Download Button */}
                                        <div className="bold m-auto py-1">
                                            <a
                                                href={message.vedio.url}
                                                download
                                                className="btn btn-xs bg-green-500 text-white hover:bg-green-600"
                                            >
                                                <Download size={14} /> {`${message.vedio.fileSize}`}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {message.docs && (
                                <div className="w-auto h-auto bg-gray-100 p-3 rounded-md border border-gray-300 flex flex-col items-center justify-center">
                                    <div className='min-w-32 min-h-32 max-w-40 max-h-40'><div className="text-md text-gray-700 m-auto p-auto text-center">
                                        {message.docs.fileName}
                                    </div>
                                    </div>

                                    {/* File Name Display at the Bottom */}
                                    <div className="flex flex-col items-center justify-center">


                                        {/* Preview and Download Buttons */}

                                        <div className=" flex gap-2">
                                            <a
                                                href={message.docs.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-xs bg-blue-500 text-white hover:bg-blue-600"
                                            >
                                                Preview
                                            </a>
                                            <a
                                                href={message.docs.url}
                                                download
                                                className="btn btn-xs bg-green-500 text-white hover:bg-green-600"
                                            >
                                                <Download size={14} /> {`${message.docs.fileSize}`}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    );
}

export default ChatContainer
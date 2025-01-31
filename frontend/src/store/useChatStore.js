import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    fileName: "",
    fileSize: "",
    isMessagessending: false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const { messages } = get();
            const res = await axiosInstance.get(`/messages/${userId}`);
            // set({ messages: res.data.size() ? res.data : [] });
            set({ messages: Array.isArray(res.data.messages) ? res.data.messages : [] });
            // console.log("after last refresh", res)
            // set({ messages: res.data });
        } catch (error) {
            console.log(error)
            toast.error(error.response);
        } finally {
            set({ isMessagesLoading: false });
        }

    },
    setSelectedUser: (selectedUser) => {
        const { authUser } = useAuthStore.getState();
        // if (selectedUser.userId === authUser.userId) {
        //     toast.error("You cannot chat with yourself");
        //     return;
        // }
        set({ selectedUser });
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        // Ensure a user is selected
        if (!selectedUser) {
            toast.error('No user selected');
            return;
        }

        try {
            // isMessagessending = true;
            set({ isMessagessending: true });
            // console.log("selected user:", selectedUser._id);
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

            console.log('New message sent:', res.data);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            // isMessagessending = false;
            set({ isMessagessending: false });
        }
    },
    subsribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            })
        });
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage",)
    },
    setFileName: (name) => {
        const { fileName } = get();
        set({ fileName: name });
    },
    setFileSize: (size) => {
        const { fileSize } = get();
        set({ fileSize: size });
    }



}))
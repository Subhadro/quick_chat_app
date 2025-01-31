import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const getUsersFroSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filtredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        res.status(200).json(filtredUsers);
    } catch (error) {

        console.log("error in getUsersFroSidebar", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json({ messages: messages })
    } catch (error) {
        console.log("error in getMessage", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const sendMessage = async (req, res) => {
    try {
        const { text, image, vedio, docs } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl, vedioUrl, docsUrl;
        console.log("here inner of controller ")
        // Upload image if present
        if (image?.url) {
            console.log("image ", image);
            const uploadresponse = await cloudinary.uploader.upload(image.url);
            imageUrl = uploadresponse.secure_url;
            console.log("image url ", imageUrl);
        }

        // Upload video if present
        if (vedio?.url) {
            if (vedio.url != null) {

                console.log(vedio)
                const uploadresponse = await cloudinary.uploader.upload(vedio.url, {
                    resource_type: "video",
                });
                vedioUrl = uploadresponse.secure_url;
            }
        }

        // Upload document if present
        if (docs?.url) {
            console.log(docs)
            try {
                // c.onsole.log(docs);
                const uploadresponse = await cloudinary.uploader.upload(docs.url, {
                    resource_type: "raw",
                });
                docsUrl = uploadresponse.secure_url;
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                return res.status(500).json({ error: "Failed to upload document" });
            }

        }

        // Ensure at least one field is provided
        if (!text && !imageUrl && !vedioUrl && !docsUrl) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || "",
            image: imageUrl ? { url: imageUrl, fileName: image.fileName, fileSize: image.fileSize } : null,
            vedio: vedioUrl ? { url: vedioUrl, fileName: vedio.fileName, fileSize: vedio.fileSize } : null,
            docs: docsUrl ? { url: docsUrl, fileName: docs.fileName, fileSize: docs.fileSize } : null,
        });

        console.log("before newmessage");
        console.log(newMessage);

        // Save the message to the database
        console.log("before newmessage save");
        await newMessage.save();

        // Real-time functionality using socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        console.log("before res json");

        // Respond with the new message
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Plus, Loader, LoaderCircle, CloudCog, Diameter } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const { setFileName, setFileSize, fileName, fileSize, isMessagessending } = useChatStore();
    const [filePreview, setFilePreview] = useState({ image: null, video: null, document: null });
    const [fileTypeMenuOpen, setFileTypeMenuOpen] = useState(false);

    // Refs for file inputs
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const docInputRef = useRef(null);

    const { sendMessage } = useChatStore();

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} Bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const MAX_FILE_SIZE_MB = 10;

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        setFileName(file.name);
        setFileSize(formatFileSize(file.size));
        if (!file) {
            setFileName("");
            setFileSize("");
            return;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast.error("File size exceeds 10MB");
            setFileName("");
            setFileSize("");
            return;
        }

        if (type === "image" && !file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            setFileName("");
            setFileSize("");
            return;
        }
        if (type === "video" && !file.type.startsWith("video/")) {
            toast.error("Please select a video file");
            setFileName("");
            setFileSize("");
            return;
        }
        if (
            type === "document" &&
            !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)
        ) {
            toast.error("Please select a valid document file");
            setFileName("");
            setFileSize("");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview((prev) => ({
                ...prev,
                [type]: reader.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !filePreview.image && !filePreview.video && !filePreview.document) {
            toast.error("Please add text or upload a file before sending.");
            return;
        }

        try {
            await sendMessage({
                text: text.trim(),
                image: { url: filePreview.image, fileName, fileSize },
                vedio: { url: filePreview.video, fileName, fileSize },
                docs: { url: filePreview.document, fileName, fileSize },
            });
            setText("");
            setFilePreview({ image: null, video: null, document: null });
        } catch (error) {
            toast.error("Failed to send message.");
        }
    };

    const removeFile = (type) => {
        setFilePreview((prev) => ({ ...prev, [type]: null }));
        if (type === "image") {
            fileInputRef.current.value = "";
        } else if (type === "video") {
            videoInputRef.current.value = "";
        } else if (type === "document") {
            docInputRef.current.value = "";
        }
    };

    // Check if any file is selected
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        // Dynamically set the disable state based on the file inputs' states
        const isAnyFileSelected =
            fileInputRef.current.files.length > 0 || videoInputRef.current.files.length > 0 || docInputRef.current.files.length > 0;
        setDisable(isAnyFileSelected);
    }, [filePreview]);

    return (
        <div className="p-4 w-full">
            <div className="mb-3 flex gap-2">
                {filePreview.image && (
                    <div className="relative " >
                        <img
                            src={filePreview.image}
                            alt="Image Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={() => removeFile("image")}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                {filePreview.video && (
                    <div className="relative ">
                        <video
                            src={filePreview.video}
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                            controls
                        />
                        <button
                            onClick={() => removeFile("video")}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                {filePreview.document && (
                    <div className="relative ">
                        <div className="w-20 h-20 flex items-center justify-center bg-zinc-200 rounded-lg border border-zinc-700">
                            <span className="text-sm text-zinc-900">Doc</span>
                        </div>
                        <button
                            onClick={() => removeFile("document")}
                            className="cursor-pointer absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <button
                        type="button"
                        className="btn btn-circle btn-sm sm:btn-md"
                        onClick={() => setFileTypeMenuOpen((prev) => !prev)}
                        disabled={disable}  // Disable the button if a file is selected
                    >
                        {(fileTypeMenuOpen && !disable) ? <X size={20} /> : <Plus size={20} />}
                    </button>
                    {fileTypeMenuOpen && !disable && (
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-base-100 border border-zinc-300 rounded-lg shadow-lg p-2 flex flex-col gap-2">
                            <button
                                type="button"
                                className="btn btn-sm w-full"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload Image
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm w-full"
                                onClick={() => videoInputRef.current?.click()}
                            >
                                Upload Video
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm w-full"
                                onClick={() => docInputRef.current?.click()}
                            >
                                Upload Document
                            </button>
                        </div>
                    )}
                </div>
                {isMessagessending && <LoaderCircle className="animate-spin max-w-32" />}
                {!isMessagessending && (
                    <button
                        type="submit"
                        className="btn btn-sm btn-circle"
                        disabled={!text.trim() && !filePreview.image && !filePreview.video && !filePreview.document}
                        onClick={() => { setFileTypeMenuOpen(false); fileInputRef.current.value = ""; docInputRef.current.value = ""; videoInputRef.current.value = "" }}
                    >
                        <Send size={22} />
                    </button>
                )}
            </form>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, "image")}
            />
            <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={videoInputRef}
                onChange={(e) => handleFileChange(e, "video")}
            />
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                ref={docInputRef}
                onChange={(e) => handleFileChange(e, "document")}
            />
        </div>
    );
};

export default MessageInput;

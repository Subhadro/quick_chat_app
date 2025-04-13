
#Project Title

  QuickChat 🚀 – Fast, Secure & Stylish Messaging

#Project Description
 
    QuickChat is a modern and feature-rich real-time chat application built with the MERN stack. It offers a seamless login and signup experience, 32 unique themes, and a fully responsive UI for a smooth chatting experience on any device. Powered by Socket.io, it ensures instant message delivery and real-time interactions. With stunning color combinations and great features, QuickChat is designed to make communication fast, engaging, and visually appealing.


## Installation
Install this fullstack application with the help of following commands:-

```bash
  git clone "https://github.com/Subhadro/quick_chat_app.git"
  cd quick_chat_app

#Install frontend dependencies
  cd frontend
  npm install

#Start frontend
  npm run dev

#Install backend dependencies
  cd ../backend
  npm install

#Start backend
  npm run dev

```

 ## Deployment 🚀  
QuickChat is live! You can access the application here:  

🔗 **[QuickChat Live](https://quick-chat-ap.onrender.com)**  

Simply visit the link and start chatting in real-time! 💬🔥  

## Screenshots

Here is the entry page of this website :-

![App Screenshot](https://github.com/Subhadro/quick_chat_app/blob/495b31f260b481914685254697d23467d26ee248/quicktalk1.png)

This is an example of chatting with amazing UI :-

![App Screenshot](https://github.com/Subhadro/quick_chat_app/blob/495b31f260b481914685254697d23467d26ee248/chatting.png)


## Tech Stack

**Client:** React, Zustand, DaisyUI, TailwindCSS, lucide-react

**Server:** Node.js, Express, Socket.io, JWT, Bcrypt, Multer, Cloudinary


## Features

- Full-stack MERN application with backend and frontend integration
- Global state management using **Zustand** for efficient variable sharing
- Beautiful UI designed with **DaisyUI** and **TailwindCSS** for responsiveness
- Send and receive text messages, images, documents, and videos
- Real-time messaging powered by **Socket.io**
- Secure authentication with **JWT** tokens and password hashing via **Bcrypt**
- Efficient API requests using **Axios** with global error handling
- Protected routes ensuring access control for authenticated users
- Switch between 32 different themes to personalize the interface
- Update your profile with an option to upload an image
- Sort users by online status for easy communication
- Real-time highlighting of user logouts via **Socket.io** to notify all active users
- User-friendly components added using **lucide-react** for convenient UI elements

## Lessons Learned 🎯  

#### 🔹 Managing Backend and Frontend  
Handling both backend and frontend in a MERN application taught me how to structure a full-stack project efficiently. Separating concerns, managing API calls, and ensuring smooth communication between both layers were key takeaways.  

#### 🔹 Using Zustand for Global State Management  
Instead of using complex state management solutions like Redux, I used **Zustand** to manage global state easily and efficiently. It helped in sharing variables across components without unnecessary re-renders.  

#### 🔹 Using DaisyUI for Styling  
DaisyUI, built on **TailwindCSS**, made UI development faster and more aesthetic with pre-designed components. It improved the responsiveness and design consistency of the app.  

#### 🔹 Sending Text, Uploading Photos, Docs, and Vedios  
Implemented a feature that allows users to send messages, images, documents, and vedios seamlessly. Used **Multer** for file uploads and optimized handling of media files for a better user experience.  

#### 🔹 Implementing Socket.io in Real-Life Apps  
Integrated **Socket.io** for real-time messaging, ensuring instant communication between users. Learning how to manage real-time events, rooms, and broadcasting helped in building an interactive chat system.  

#### 🔹 Authentication with JWT and Bcrypt  
Implemented secure user authentication using **JWT tokens** for authorization and **Bcrypt** for password hashing. This ensured that user data remained secure while maintaining a smooth login/signup experience.  

#### 🔹 Using Axios and Creating an Axios Instance  
Used **Axios** to handle API requests efficiently. Created a global Axios instance with predefined configurations to manage authentication headers and error handling globally.  

#### 🔹 Creating a Protected Route  
Implemented a **Protected Route** mechanism to restrict access to authenticated users only. This ensured that only logged-in users could access chat functionalities, enhancing app security.  

Each of these lessons strengthened my understanding of **full-stack development**, making the application more robust, scalable, and user-friendly! 🚀

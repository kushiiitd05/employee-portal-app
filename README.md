# At@Employee - Full-Stack Employee Portal 🚀

Welcome to **At@Employee**, a modern, full-stack web application designed to serve as a comprehensive internal portal for employees. This application is built with a focus on real-time communication, featuring a complete text chat and a peer-to-peer video calling system.

![Application Screenshot](https://i.imgur.com/lJ4jO8X.jpeg) ---

## ✨ Features

This portal is packed with features designed to enhance internal communication and management:

* **Secure Authentication:** Employees can sign up and log in securely, with sessions managed by JSON Web Tokens (JWT).
* **Central Dashboard:** A clean and modern dashboard that provides at-a-glance information, including live updates for attendance and unread messages.
* **Attendance System:** A simple one-click system for employees to mark their daily attendance.
* **Real-Time Text Chat:**
    * **One-on-One Messaging:** Instantly send and receive text messages with other employees.
    * **Live Online Status:** A green dot indicates which users are currently online, with status updated in real-time as users log in, log out, or close the application.
    * **Unread Message Counter:** The dashboard displays a live count of unread messages, which decrements as you read them.
* **Full-Featured Video Chat:**
    * **Peer-to-Peer (P2P) Connection:** Utilizes **WebRTC** for direct, low-latency video and audio streaming between users, ensuring privacy and efficiency.
    * **Complete Call Flow:** Initiate calls, receive incoming call notifications with **Accept** and **Decline** options, and end calls gracefully.
    * **In-Call Controls:** A full suite of controls including **Mute/Unmute Mic**, **Turn Camera On/Off**, and **Hang Up**.
* **Profile Management:** Users can view their profile information and change their password.
* **Modern, Full-Screen UI:** A sleek, responsive, and elegant user interface built with TailwindCSS that provides a consistent experience across the entire application.

---

## 🛠️ Technology Stack

This project is built with a modern MERN-like stack, focusing on performance and real-time capabilities.

### **Frontend**
* **React.js:** A powerful JavaScript library for building user interfaces.
* **Vite:** A next-generation frontend build tool for a blazing-fast development experience.
* **Redux Toolkit:** For robust and predictable state management across the application.
* **Socket.IO Client:** The client-side library for enabling real-time, bidirectional communication.
* **Axios:** For making promise-based HTTP requests to the backend API.
* **TailwindCSS:** A utility-first CSS framework for creating modern and responsive designs.
* **Lucide React:** A beautiful and consistent icon library.

### **Backend**
* **Node.js:** A JavaScript runtime for building fast and scalable server-side applications.
* **Express.js:** A minimal and flexible Node.js web application framework.
* **Socket.IO:** The server-side library for managing real-time connections and events.
* **MySQL2:** A fast and feature-rich MySQL client for Node.js.
* **JSON Web Token (JWT):** For implementing secure user authentication.
* **bcrypt:** A library for hashing passwords to store them securely.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

* You must have **Node.js** installed on your machine (which includes `npm`).
* You must have a **MySQL** server running.

### **Installation & Setup**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/kushiiitd05/employee-portal-app.git](https://github.com/kushiiitd05/employee-portal-app.git)
    cd employee-portal-app
    ```

2.  **Setup the Backend (`server`):**
    * Navigate to the server directory: `cd server`
    * Install NPM packages: `npm install`
    * **Database Setup:**
        * Create a new MySQL database named `employee_db`.
        * Update the database credentials in all backend files (e.g., `index.js`, `socketManager.js`, `routes/chat.js`) with your MySQL username and password.
    * **Important Note on Passwords:**
        * For security, all user passwords are **hashed** using `bcrypt` before being stored in the database. This means you **cannot** copy a hashed password from a tool like MySQL Workbench and use it to log in. All users must be created through the application's **Sign Up** form to ensure their passwords are correctly processed.
    * Start the server: `node index.js`
    * The backend will be running on `http://localhost:5001`.

3.  **Setup the Frontend (`client`):**
    * Open a new terminal and navigate to the client directory: `cd client`
    * Install NPM packages: `npm install`
    * Start the client: `npm run dev`
    * Open your browser and navigate to `http://localhost:5173`.

You can now sign up with two different accounts in two separate browser windows (e.g., one normal, one incognito) to test the full chat and video call functionality.

---

## 📂 Project Structure

The project is organized into two main folders: `client` and `server`.

```
/employee-portal-app
├── /client         # Contains all the Frontend React code
│   ├── /src
│   │   ├── /components
│   │   ├── /pages
│   │   ├── /redux
│   │   └── ...
└── /server         # Contains all the Backend Node.js code
    ├── /routes
    ├── index.js
    └── socketManager.js
```

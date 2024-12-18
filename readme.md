# English Testing System

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Speaking Agent Setup](#speaking-agent-setup)
- [Configuration](#configuration)
  - [Backend Configuration](#backend-configuration)
  - [Frontend Configuration](#frontend-configuration)
  - [Speaking Agent Configuration](#speaking-agent-configuration)
  - [Local Development SSL Setup](#local-development-ssl-setup)
- [Running the Application](#running-the-application)
  - [Starting the Backend Server](#starting-the-backend-server)
  - [Starting the Frontend Application](#starting-the-frontend-application)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Introduction

The **English Testing System** is a comprehensive platform designed to facilitate English language testing through interactive lessons, rigorous assessments, and detailed progress tracking. The system integrates advanced technologies such as AI-driven speech assessment, real-time communication using Livekit, and a responsive frontend built with React.js.

## Features

- **User Management:** Supports roles for students, teachers, and administrators with secure authentication.
- **Question Management:** Create, edit, and manage questions with various modules and resources.
- **Test Creation and Management:** Build tests with multiple question types including multiple-choice, writing, speaking, and listening.
- **Automated Grading:** Auto-grade objective questions and provide AI-assisted feedback for subjective responses.
- **Voice Assistant:** Integrated voice assistant for speaking tests, utilizing Livekit and AI-driven speech recognition.
- **Progress Tracking:** Monitor user progress with detailed analytics and visualizations.
- **Real-time Communication:** Facilitate real-time interactions between users and the system.
- **Responsive Frontend:** User-friendly interface optimized for both desktop and mobile devices.

## Technologies Used

### Backend

- **Node.js** with **Express.js**: Server-side framework for handling API requests.
- **Python**: Utilized for the Voice Assistant component.
- **MongoDB**: NoSQL database for storing user data, courses, tests, and results.
- **Livekit**: Real-time communication and voice assistant integration.
- **OpenAI API**: AI-driven assessments and feedback generation.
- **Deepgram**: Speech-to-text transcription.
- **Google Text-to-Speech**: Text-to-speech conversion.
- **Mongoose**: ODM for MongoDB.
- **Other Libraries:** bcryptjs, dotenv, jsonwebtoken, etc.

### Frontend

- **React.js**: JavaScript library for building user interfaces.
- **Vite**: Fast frontend build tool.
- **Redux Toolkit**: State management.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Livekit Components**: Real-time communication components.
- **Other Libraries:** axios, react-hook-form, react-router-dom, etc.

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v19 or later)
- **npm** or **yarn**
- **Python** (v3.9 or later)
- **MongoDB** (local instance or cloud-based like MongoDB Atlas)
- **Git** (for version control)

## Installation

### Backend Setup

1. **Navigate to the Backend Directory:**

   ```bash
   cd Backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   - Rename `.env.example` to `.env` if available, or create a `.env` file in the `Backend` directory.
   - Populate the `.env` file with the necessary configurations. Refer to the [Backend Configuration](#backend-configuration) section for required variables.

### Frontend Setup

1. **Navigate to the Frontend Directory:**

   ```bash
   cd FrontEnd
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the `FrontEnd` directory.
   - Add necessary environment variables as required by the frontend application.

### Speaking Agent Setup

1. **Navigate to the SpeakingAgent Directory:**

   ```bash
   cd SpeakingAgent
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**

   ```bash
   source venv/bin/activate
   ```

4. **Install the required packages:**

   ```bash
   pip install -r requirements.txt
   ```

## Local Development SSL Setup

> ⚠️ **Important**: This section is only for local development and using Speaking Agent in mobile devices. 
1. Install mkcert:

   ```bash
   # Windows (with chocolatey)
   choco install mkcert

   # macOS (with homebrew)
   brew install mkcert
   ```

2. Generate local certificates:

   ```bash
   mkcert -install
   mkcert localhost 127.0.0.1 ::1
   ```

3. Change the path for the certificates in the `server.js` file in the `Backend` directory to the path of the certificates you generated.
4. Change the path for the certificates in the `vite.config.js` file in the `FrontEnd` directory to the path of the certificates you generated.

## Configuration

### Backend Configuration

Create a `.env` file in the `Backend` directory with the following variables:

> ⚠️ **Important**: Keep these environment variables secure and never commit them to version control.

    ```env
    NODE_ENV=production
    PORT=3000
    DEV_DB_MONGO_URI=your_development_mongo_uri
    PROD_DB_MONGO_URI=your_production_mongo_uri
    DB_MONGO_URI=your_mongodb_uri
    LIVEKIT_URL=wss://your-livekit-url
    LIVEKIT_API_KEY=your_livekit_api_key
    LIVEKIT_API_SECRET=your_livekit_api_secret
    DEEPGRAM_API_KEY=your_deepgram_api_key
    OPENAI_API_KEY=your_openai_api_key
    GOOGLE_API_KEY=your_google_api_key
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES=30d
    JWT_COOKIE_EXPIRES=30
    GOOGLE_CREDENTIALS='your_google_credentials_json'
    ```

## Running the Application

### Starting the Backend Server

1. **Navigate to the Backend Directory:**

   ```bash
   cd Backend
   ```

2. **Start the Server:**

   ```bash
   npm run start
   ```

3. **Access the Backend API:**
   - The server runs on `https://localhost:3000` by default.

### Starting the Frontend Application

1. **Navigate to the Frontend Directory:**

   ```bash
   cd FrontEnd
   ```

2. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   - The frontend will be accessible at `http://localhost:5173`.

3. **Build for Production:**
   ```bash
   npm run build
   ```
   - The production-ready files will be in the `dist` directory.

### Running the Speaking Agent

1. **Navigate to the SpeakingAgent Directory:**

   ```bash
   cd SpeakingAgent
   ```

2. **Run the speaking agent:**

   ```bash
   python main.py start
   ```

## Deployment

1. **Backend Deployment:**

   - Host the backend on platforms like **Heroku**, **AWS**, **DigitalOcean**, or any server that supports Node.js.
   - Ensure environment variables are set securely on the hosting platform.
   - Use HTTPS for secure communication.

2. **Frontend Deployment:**

   - Deploy the frontend on platforms like **Vercel**, **Netlify**, **GitHub Pages**, or any static site hosting service.
   - Ensure the frontend is configured to communicate with the deployed backend API.

3. **Database:**
   - Use a managed database service like **MongoDB Atlas** for scalability and reliability.
   - Ensure proper backup and security measures are in place.

## Usage

1. **User Registration and Login:**

   - Access the frontend application at `http://localhost:5173`.
   - Register as a student, teacher, or admin based on your role.

2. **Creating and Managing Tests:**

   - Teachers can create questions, and manage test materials.

3. **Taking Tests:**

   - Students can take various types of tests including speaking assessments with real-time voice interaction.

4. **Viewing Results:**
   - After completing tests, results and feedback are available on the dashboard.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch:**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Livekit](https://livekit.io/) for real-time communication infrastructure.
- [OpenAI](https://openai.com/) for providing AI-driven assessment tools.
- [Deepgram](https://deepgram.com/) for speech-to-text transcription services.
- [Google Cloud](https://cloud.google.com/) for their Text-to-Speech and other cloud services.

---

# Kết luận

The **English Testing System** offers a robust solution for administering English language tests with features that enhance both the teaching and learning experience. With its integration of real-time communication, AI-driven assessments, and comprehensive progress tracking, the system stands out as a versatile platform catering to various educational needs.

<h1 align="center"><strong>🚇 MRT WEB - Backend</strong></h1>

The backend API server for the MRT Web project — a fare and travel tracking simulation system for MRT platforms. This backend handles authentication, fare logic, card and station data, and MongoDB integration.
> 💻 Built as part of my internship training projects.

## 🔧 Features

- 🔐 **User Authentication**  
  Secure login system using JWT tokens and hashed passwords (bcrypt).

- 🪪 **Card Management API**  
  Create, update, delete, and view commuter cards with balance tracking.

- 💰 **Fare Calculation**  
  Calculates fare based on the number of stations traveled.

- 🚉 **Tap In / Tap Out API**  
  Simulates MRT entry/exit and stores trip history per card.

- 🏙️ **Station Management**  
  Admin routes for adding, updating, or deleting MRT stations.

- 🛠️ **Admin Dashboard API**  
  Exposes routes for station configuration, fare settings, and card summaries.

- 🧾 **Trip History Logging** (Only available on mobile app at the moment)<br>
  Keeps a record of each tap transaction and fare deducted.

- 🔎 **Protected Routes with Middleware**  
  Uses role-based access control to guard sensitive endpoints.
  

## 🚀 How to run

**1. Install backend dependencies**

    npm install

**2. Start the development server**

    npm run dev

Server will run at:<br>
🌐 `http://localhost:8080`

**3. Proceed to Frontend**<br>

Once the backend server is running, clone and run the frontend repository:<br>
👉 [MoriiSan/MRT WEB (Frontend Repo)](https://github.com/MoriiSan/mrt-web) <br>

Follow the instructions there to start the web interface and connect it to this backend.

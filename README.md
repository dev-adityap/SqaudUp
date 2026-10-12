# ⚡ SquadUp

<img width="1917" height="973" alt="image" src="https://github.com/user-attachments/assets/7d2959ac-542d-4c7b-96ca-933394a08ace" />


**Live Demo:** [https://sqaud-up-s4at.vercel.app](https://sqaud-up-s4at.vercel.app)

SquadUp is a full-stack spatial matchmaking platform engineered to eliminate the friction of organizing local pickup sports. By leveraging dynamic map routing and real-time game creation, the application connects athletes based on location, sport type, and skill level to ensure you never play short-handed again.

## 🏗️ Architecture & Tech Stack

**Frontend (Client)**
* **Core:** React.js, Vite
* **Styling:** Tailwind CSS (Custom Dark Theme UI)
* **Authentication:** Firebase Auth
* **Mapping & Search:** Leaflet.js, Mapbox, `leaflet-geosearch`
* **Deployment:** Vercel

**Backend (Server)**
* **Environment:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Security:** JWT, Custom CORS Policy routing
* **Deployment:** Render

## ✨ Core Features

* **Interactive Dark-Mode Map:** Integrated Leaflet and Mapbox with custom CSS overrides for a seamless, premium UI experience.
* **Spatial Game Discovery:** Users can search for specific cities or drop pins to locate nearby active matches across football, basketball, cricket, and tennis.
* **Secure Matchmaking:** Authenticated users can host squads, define player limits, and manage match visibility.
* **Dynamic Environment Routing:** Automated CORS pipeline that securely bridges dynamic Vercel preview environments with the production Render API cluster.

## 🧠 Engineering Highlights

As a primary portfolio piece targeting Web Development and Solutions Engineering roles, this project focuses heavily on scalable system design and solving real-world integration challenges:

1. **Strict Dependency & Build Management:** Overcame strict peer dependency conflicts (`ERESOLVE`) during Vercel CI/CD pipelines by isolating legacy module resolution without compromising production stability.
2. **Dynamic CORS Security Configuration:** Engineered a custom backend CORS middleware array to automatically accept requests from `localhost` and dynamic `*.vercel.app` branches, eliminating cross-origin blocks during rapid iterative deployment.
3. **Mapbox UI Injection:** Resolved third-party iframe CSS bleeding by injecting custom style overrides to force `leaflet-geosearch` elements to inherit the application's native dark mode and orange-accent hover states.

## 🚀 Local Installation

Clone the repository and run it locally:

```bash
# 1. Clone the repo
git clone [https://github.com/dev-adityap/SqaudUp.git](https://github.com/dev-adityap/SqaudUp.git)
cd SqaudUp

# 2. Install Backend Dependencies
cd server
npm install

# 3. Setup Backend Environment Variables (.env)
# MONGO_URI=your_mongodb_connection_string
# CLIENT_URL=http://localhost:5173

# 4. Start the Backend Server
npm run dev

# 5. Open a new terminal, install Frontend Dependencies
cd client
npm install

# 6. Setup Frontend Environment Variables (.env)
# VITE_API_URL=http://localhost:5000
# VITE_MAPBOX_TOKEN=your_mapbox_token
# VITE_FIREBASE_API_KEY=your_firebase_key

# 7. Start the Vite Development Server
npm run dev


👨‍💻 Author
Aditya Panna

LinkedIn: www.linkedin.com/in/aditya-panna-0861662a3

GitHub: @dev-adityap

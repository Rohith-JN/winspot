# Winspot

A lightweight, always-on-screen Spotify mini-player designed for seamless music control while working. It allows users to manage playback, skip tracks, shuffle playlist, repeat tracks, without switching tabs, making it perfect for coding or other tasks.

![Screenshot (457)](https://github.com/user-attachments/assets/e2f01050-d95e-494d-b3da-8ae4a5bcda23)

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Rohith-JN/winspot.git
cd winspot
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Create a Spotify App
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click **Create an App**.
3. Note down your **Client ID** and **Client Secret**.
4. Specify a **Redirect URI** (e.g., `http://localhost:3000/callback`).
5. Save your changes.

### 4️⃣ Create a `.env` File
1. Copy the `.env.example` file and rename it to `.env`.
2. Fill in the required fields:
   ```env
   SPOTIFY_CLIENT_ID=your-client-id
   SPOTIFY_CLIENT_SECRET=your-client-secret
   SPOTIFY_REDIRECT_URI=your-redirect-uri
   SPOTIFY_REFRESH_TOKEN=
   URL=absolute-path-to-index.html
   ```
3. The `URL` field should point to the location of `index.html` on your machine.

### 5️⃣ Authenticate with Spotify
1. Run the authentication script:
   ```sh
   node auth.js
   ```
2. Open a browser and visit:
   ```
   http://localhost:3000/login
   ```
3. Log in to Spotify and grant permissions.
4. After authorization, you’ll be redirected to your **Redirect URI**.
5. Copy the `code` from the URL and call this endpoint:
   ```
   http://localhost:3000/callback?code=your-code-here
   ```
6. The page will return a **refresh token**.
7. Copy the **refresh token** and add it to your `.env` file:
   ```env
   SPOTIFY_REFRESH_TOKEN=your-refresh-token
   ```

### 6️⃣ Run the Server and Frontend
1. Open **two terminals**:
   - **First Terminal:** Start the backend server:
     ```sh
     node index.js
     ```
   - **Second Terminal:** Start the frontend:
     ```sh
     npm start
     ```

### 7️⃣ Start Using the App 🎵

---

## ⚠️ Important Notes
- This app **requires a Spotify Premium account** to work properly.
- Make sure your **Redirect URI** in the Spotify Developer Dashboard **exactly** matches what’s in your `.env` file.
- If you encounter authentication issues, double-check your **Client ID, Client Secret, and Redirect URI**.

---

## 🤝 Contributing
If you have suggestions or improvements, feel free to submit a pull request!



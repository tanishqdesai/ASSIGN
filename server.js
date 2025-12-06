// server.js - BASIC VERSION (Start here)

const express = require("express");
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.static("public")); // Serve images

// Test route - Make sure server works
app.get("/", (req, res) => {
    res.send("Server is running! Go to /index.html");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
    console.log(` Images served from: /public folder`);
});

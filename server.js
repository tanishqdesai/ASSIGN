// server.js - ADD GET IMAGE ROUTE

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// Route 1: Home page
app.get("/", (req, res) => {
    res.send(`
        <h1>Image Management System</h1>
        <p>Available endpoints:</p>
        <ul>
            <li><a href="/api/getImage?name=tom">/api/getImage?name=tom</a></li>
            <li><a href="/api/getImage?name=jerry">/api/getImage?name=jerry</a></li>
            <li><a href="/api/getImage?name=dog">/api/getImage?name=dog</a></li>
        </ul>
        <p>Go to <a href="/index.html">index.html</a> for full interface</p>
    `);
});

// Route 2: GET image based on name
app.get("/api/getImage", (req, res) => {
    console.log(" GET request received for:", req.query.name);
    
    // Check if name parameter exists
    if (!req.query.name) {
        return res.json({ 
            error: "Please provide a name parameter",
            url: "/default.jpg" 
        });
    }
    
    const name = req.query.name.toLowerCase();
    let image = "default.jpg";

    // Simple if-else logic to determine image
    if (name.includes("tom")) {
        image = "tom.jpg";
        console.log("   → Returning: tom.jpg");
    } else if (name.includes("jerry")) {
        image = "jerry.jpg";
        console.log("   → Returning: jerry.jpg");
    } else if (name.includes("dog")) {
        image = "dog.jpg";
        console.log("   → Returning: dog.jpg");
    } else {
        console.log("   → No match, returning: default.jpg");
    }

    res.json({ 
        url: "/" + image,
        character: name 
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
    console.log(` Images served from: /public folder`);
    console.log(` Test GET: http://localhost:${PORT}/api/getImage?name=tom`);
});

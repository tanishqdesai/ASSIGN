// server.js - ADD FILE UPLOAD FUNCTIONALITY

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// MULTER CONFIGURATION
// Configure where and how to store uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/'); // Save to public folder
    },
    filename: function (req, file, cb) {
        // Get character name from query parameter
        const characterName = req.query.name ? req.query.name.toLowerCase() : 'unknown';
        
        console.log(` Upload request for character: ${characterName}`);
        console.log(`   File original name: ${file.originalname}`);
        console.log(`   File type: ${file.mimetype}`);
        
        // Determine which file to overwrite
        let filename;
        if (characterName.includes('tom')) {
            filename = 'tom.jpg';
        } else if (characterName.includes('jerry')) {
            filename = 'jerry.jpg';
        } else if (characterName.includes('dog')) {
            filename = 'dog.jpg';
        } else {
            // For unknown characters, keep original extension
            const ext = path.extname(file.originalname);
            filename = characterName + ext;
        }
        
        console.log(`   Saving as: ${filename}`);
        cb(null, filename);
    }
});

// Create multer instance with configuration
const upload = multer({ 
    storage: storage,
    // File filter - only accept images
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (JPEG, PNG, GIF)'), false);
        }
    },
    // File size limit: 5MB
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ========== ROUTES ==========

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET image route
app.get("/api/getImage", (req, res) => {
    if (!req.query.name) {
        return res.json({ error: "Please provide a name parameter", url: "/default.jpg" });
    }
    
    const name = req.query.name.toLowerCase();
    let image = "default.jpg";

    if (name.includes("tom")) image = "tom.jpg";
    else if (name.includes("jerry")) image = "jerry.jpg";
    else if (name.includes("dog")) image = "dog.jpg";

    res.json({ url: "/" + image, character: name });
});

// ========== NEW UPLOAD ROUTE ==========
app.post("/api/upload", upload.single('image'), (req, res) => {
    try {
        console.log(" Upload successful!");
        console.log("   Saved file:", req.file.filename);
        console.log("   File size:", req.file.size, "bytes");
        console.log("   Character:", req.query.name);
        
        res.json({
            success: true,
            message: `Image uploaded successfully for ${req.query.name}!`,
            filename: req.file.filename,
            url: "/" + req.file.filename,
            size: req.file.size
        });
        
    } catch (error) {
        console.error(" Upload error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Error handling for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: "File is too large. Maximum size is 5MB."
            });
        }
    }
    res.status(400).json({ success: false, message: error.message });
});

// ========== SERVER START ==========
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(` SERVER STARTED SUCCESSFULLY`);
    console.log(`========================================`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Images folder: /public`);
    console.log(` Test GET:  http://localhost:${PORT}/api/getImage?name=tom`);
    console.log(`  Test POST: http://localhost:${PORT}/api/upload?name=tom`);
    console.log(`========================================`);
});

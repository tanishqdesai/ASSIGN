// script.js - Complete Vanilla JavaScript Frontend

// DOM Elements
const elements = {
    // Search elements
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    characterImage: document.getElementById('characterImage'),
    currentCharacter: document.getElementById('currentCharacter'),
    imageUrl: document.getElementById('imageUrl'),
    imageName: document.getElementById('imageName'),
    imageSize: document.getElementById('imageSize'),
    
// Upload elements
    characterName: document.getElementById('characterName'),
    fileInput: document.getElementById('fileInput'),
    browseBtn: document.getElementById('browseBtn'),
    dropZone: document.getElementById('dropZone'),
    fileInfo: document.getElementById('fileInfo'),
    uploadBtn: document.getElementById('uploadBtn'),
    uploadProgress: document.getElementById('uploadProgress'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),

// Message container
    messageContainer: document.getElementById('messageContainer'),
    
    // Server status
    serverStatus: document.getElementById('serverStatus'),
    
    // Quick tags
    tags: document.querySelectorAll('.tag')
};

// State variables
let state = {
    selectedFile: null,
    isUploading: false,
    serverOnline: false
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log(' Frontend initialized');
    

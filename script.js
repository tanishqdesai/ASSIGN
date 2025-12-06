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
    // Initialize server check
    checkServerStatus();
    
    // Load default image
    searchImage('tom');
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup drag and drop
    setupDragAndDrop();
});

// SERVER CHECK
async function checkServerStatus() {
    try {
        const response = await fetch('/api/getImage?name=test');
        if (response.ok) {
            state.serverOnline = true;
            elements.serverStatus.textContent = 'Online';
            elements.serverStatus.style.color = '#28a745';
            elements.serverStatus.previousElementSibling.style.background = '#28a745';
            showMessage('Server connected successfully', 'success');
        }
    } catch (error) {
        state.serverOnline = false;
        elements.serverStatus.textContent = 'Offline';
        elements.serverStatus.style.color = '#dc3545';
        elements.serverStatus.previousElementSibling.style.background = '#dc3545';
        showMessage('Cannot connect to server. Please start the backend server.', 'error');
    }
}

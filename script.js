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

function setupEventListeners() {
    // Search button click
    elements.searchBtn.addEventListener('click', handleSearch);
    
    // Enter key in search input
    elements.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

// Quick tag clicks
    elements.tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            elements.searchInput.value = name;
            searchImage(name);
        });
    });

// Browse button click
    elements.browseBtn.addEventListener('click', function() {
        elements.fileInput.click();
    });
    
    // File input change
    elements.fileInput.addEventListener('change', handleFileSelect);

    // Character name input
    elements.characterName.addEventListener('input', updateUploadButton);
    
    // Upload button click
    elements.uploadBtn.addEventListener('click', handleUpload);

    // Footer links
    document.getElementById('viewApi').addEventListener('click', function(e) {
        e.preventDefault();
        window.open('/api/getImage?name=tom', '_blank');
    });

document.getElementById('viewFolder').addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Public folder contains uploaded images', 'info');
    });
    
    document.getElementById('resetImages').addEventListener('click', function(e) {
        e.preventDefault();
        resetImages();
    });
}

//Drag and Drop

function setupDragAndDrop() {
    // Drag over event
    elements.dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    // Drag leave event
    elements.dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    // Drop event
    elements.dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFileSelect({ target: { files: e.dataTransfer.files } });
        }
    });
}


    //Searching

function handleSearch() {
    const name = elements.searchInput.value.trim();
    if (name) {
        searchImage(name);
    } else {
        showMessage('Please enter a character name to search', 'error');
    }
}

async function searchImage(name) {
    try {
        // Update UI
        elements.currentCharacter.textContent = name;
        elements.characterImage.src = '/loading.gif'; // You can add a loading.gif
        
        // Make API call
        const response = await fetch(`/api/getImage?name=${encodeURIComponent(name)}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // Update image with cache busting
        const timestamp = new Date().getTime();
        const imageUrl = `${data.url}?t=${timestamp}`;
        elements.characterImage.src = imageUrl;
        elements.imageUrl.textContent = data.url;
        elements.imageName.textContent = data.url.split('/').pop();

        // Get image size
        getImageSize(data.url);
        
        // Update search input
        elements.searchInput.value = name;
        
        showMessage(`Showing image for: ${name}`, 'success');
        
    } catch (error) {
        console.error('Search error:', error);
        elements.characterImage.src = '/default.jpg';
        showMessage(`Error: ${error.message}`, 'error');
    }
}

async function getImageSize(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const sizeKB = (blob.size / 1024).toFixed(2);
        elements.imageSize.textContent = `${sizeKB} KB`;
    } catch (error) {
        elements.imageSize.textContent = 'Unknown';
    }
}


//SEC TION OF FILEHANDLING

function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file (JPG, PNG, GIF)', 'error');
        resetFileInput();
        return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showMessage('File too large. Maximum size is 5MB', 'error');
        resetFileInput();
        return;
    }
    
    // Update state
    state.selectedFile = file;
    
    // Update UI
    const fileSize = (file.size / 1024).toFixed(2);
    elements.fileInfo.innerHTML = `
        <strong>✓ File Selected:</strong><br>
        <span style="color: #28a745;">${file.name}</span><br>
        Size: ${fileSize} KB | Type: ${file.type}
    `;
    
    // Update upload button
    updateUploadButton();
    
    showMessage(`File ready: ${file.name}`, 'success');
}

function updateUploadButton() {
    const hasFile = state.selectedFile !== null;
    const hasName = elements.characterName.value.trim() !== '';
    const canUpload = hasFile && hasName && !state.isUploading && state.serverOnline;
    
    elements.uploadBtn.disabled = !canUpload;
}

function resetFileInput() {
    elements.fileInput.value = '';
    state.selectedFile = null;
    elements.fileInfo.textContent = 'No file selected';
    updateUploadButton();
}

async function handleUpload() {
    if (!state.selectedFile || state.isUploading || !state.serverOnline) {
        return;
    }
    
    const character = elements.characterName.value.trim();
    if (!character) {
        showMessage('Please enter a character name', 'error');
        return;
    }
    
    state.isUploading = true;
    updateUploadButton();
    
    // Show progress bar
    elements.uploadProgress.style.display = 'block';
    elements.progressFill.style.width = '0%';
    elements.progressText.textContent = 'Preparing upload...';

// Create form data
    const formData = new FormData();
    formData.append('image', state.selectedFile);
    
    try {
        // Create XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();
        
        // Progress event
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                elements.progressFill.style.width = `${percentComplete}%`;
                elements.progressText.textContent = `Uploading: ${Math.round(percentComplete)}%`;
            }
        });

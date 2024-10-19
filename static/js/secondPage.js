const canvas = document.getElementById('neuron-background');
const ctx = canvas.getContext('2d');

// Canvas resize function
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// Neurons setup
const neurons = [];
const numNeurons = 100;
const connectionDistance = 200;

class Neuron {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3
        };
    }

    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;

        if (this.x < 0 || this.x > canvas.width) this.speed.x *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speed.y *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
    }
}

for (let i = 0; i < numNeurons; i++) {
    neurons.push(new Neuron());
}

function drawConnections() {
    for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
            const dx = neurons[i].x - neurons[j].x;
            const dy = neurons[i].y - neurons[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(neurons[i].x, neurons[i].y);
                ctx.lineTo(neurons[j].x, neurons[j].y);
                ctx.strokeStyle = `rgba(0, 255, 0, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 0.2;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    neurons.forEach((neuron) => {
        neuron.update();
        neuron.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', resizeCanvas);

// Handle file upload
document.getElementById('file-upload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

// Speech recognition setup
const searchInput = document.getElementById('search-input');
const speakButton = document.querySelector('.mic-icon');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
};

speakButton.addEventListener('click', () => {
    recognition.start();
});

// Sidebar functionality
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const newChatBtn = document.getElementById('new-chat-btn');
const chatList = document.getElementById('chat-list');
let chatCounter = 1;

function createNewChat() {
    // Clear the search input
    searchInput.value = '';

    // Add a new chat to the list
    const newChatItem = document.createElement('li');
    newChatItem.textContent = `Chat ${chatCounter}`;
    newChatItem.addEventListener('click', () => {
        // Handle chat selection (you can add more functionality here)
        alert(`Selected ${newChatItem.textContent}`);
    });
    chatList.appendChild(newChatItem);
    chatCounter++;

    // Focus on the search input
    searchInput.focus();

    // If the sidebar is not visible on mobile, hide it after creating a new chat
    if (window.innerWidth <= 768) {
        sidebar.style.left = '-250px';
    }
}

sidebarToggle.addEventListener('click', () => {
    // Check current position and toggle
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px'; // Hide the sidebar
    } else {
        sidebar.style.left = '0px'; // Show the sidebar
    }
});

newChatBtn.addEventListener('click', createNewChat);

// Add functionality to go to new chat when sidebar icon is clicked
sidebarToggle.addEventListener('click', () => {
    if (sidebar.style.left === '-250px') {
        // If the sidebar is currently hidden, show it and create a new chat
        sidebar.style.left = '0px';
        createNewChat();
    } else {
        // If the sidebar is visible, just hide it
        sidebar.style.left = '-250px';
    }
});

// Initialize with a new chat
createNewChat();

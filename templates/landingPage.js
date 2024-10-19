const canvas = document.getElementById('neuron-background');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

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
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            console.log(content); // Handle the file content
        }
        reader.readAsText(file);
    }
});
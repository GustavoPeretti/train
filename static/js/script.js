let canvas = document.querySelector('#digit-recognizer canvas');
let context = canvas.getContext('2d');

let pixelMap = Array(28).fill().map(() => Array(28).fill(false));

let mouseIsDown;

canvas.addEventListener('mousedown', () => {
    pixelMap = Array(28).fill().map(() => Array(28).fill(false));
    canvas.width = canvas.width;

    mouseIsDown = true;
});

canvas.addEventListener('mouseup', () => {
    mouseIsDown = false;
});

canvas.addEventListener('mouseleave', () => {
    mouseIsDown = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (mouseIsDown) {
        let canvasRect = canvas.getBoundingClientRect();
        context.fillStyle = "#FFFFFF";

        let i = Math.floor((e.clientX - canvasRect.left) / 10);
        let j = Math.floor((e.clientY - canvasRect.top) / 10);

        if (i < 0 || i > 27 || j < 0 || j > 27) {
            return;
        }

        let x = i * 10;
        let y = j * 10;

        pixelMap[j][i] = true;

        context.rect(x, y, 10, 10);
        context.fill();
    }
});

async function updateTable() {
    let data;

    try {
        let response = await fetch('http://' + window.location.hostname + '/count');

        if (!(response.ok)) {
            alert('Error');
        }

        data = await response.json();

    } catch (error) {
        alert('Erro: ' + error);
    }
    
    for (let i = 0; i <= 9; i++) {
        document.querySelector(`.table${i}`).textContent = data[i];
    }
}

async function insertData() { 
    let data;
    
    try {
        let response = await fetch('http://' + window.location.hostname + '/save-json', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: pixelMap.flat(),
                output: parseInt(document.querySelector('.result').value)
            })
        });

        if (!(response.ok)) {
            alert('Error');
        }

        data = await response.json();

        if (!(data)) {
            alert('Erro: ' + data);
        }

    } catch (error) {
        alert('Erro: ' + error);
    }
}

document.querySelector('button').addEventListener('click', async () => {
    if (!(document.querySelector('.result').value)) {
        alert('Insira um valor no campo.');
        return;
    }

    pixelMap = Array(28).fill().map(() => Array(28).fill(false));
    canvas.width = canvas.width;

    insertData();
});

window.onload = updateTable;
setInterval(updateTable, 5000);

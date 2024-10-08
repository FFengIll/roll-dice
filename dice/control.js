let diceSize = 50; // Initial size in pixels


document.addEventListener("DOMContentLoaded", function () {
    const diceConfig = diceForQWIXX()

    const diceContainer = document.getElementById('dice-container');

    diceConfig.dice.forEach(row => {
        // Create a row container
        const rowDiv = document.createElement('div');
        rowDiv.className = 'dice-container';

        row.forEach(dice => {
            // Create dice div
            const diceDiv = document.createElement('div');
            diceDiv.className = 'dice';
            diceDiv.id = dice.id;
            diceDiv.innerText = dice.value; // You might want to adjust how dice values are displayed
            rowDiv.appendChild(diceDiv);
        });

        diceContainer.appendChild(rowDiv);
    });
});

function rollDice() {
    // Function to simulate the shaking effect
    function shakeDice() {
        for (let i = 1; i <= 6; i++) {
            const dice = document.getElementById(`dice${i}`);
            dice.textContent = '';
            dice.classList.add('shaking');
        }
    }

    // Function to stop the shaking effect and show the final result
    function stopShake() {
        setTimeout(() => {
            for (let i = 1; i <= 6; i++) {
                const dice = document.getElementById(`dice${i}`);
                const result = Math.floor(Math.random() * 6) + 1;
                dice.textContent = result;
                dice.classList.remove('shaking');
            }
        }, 1000); // Duration of the shaking effect
    }

    shakeDice();
    stopShake();
}

function changeSize(amount) {
    diceSize = Math.max(20, diceSize + amount); // Prevent size from going below 20px
    const diceElements = document.querySelectorAll('.dice');
    diceElements.forEach(dice => {
        dice.style.width = `${diceSize}px`;
        dice.style.height = `${diceSize}px`;
        dice.style.lineHeight = `${diceSize}px`;
        dice.style.fontSize = `${diceSize * 0.5}px`; // Adjust font size proportionally
    });
}

function diceForQWIXX() {
    return {
        "dice": [
            [
                {"id": "dice1", "value": 1},
                {"id": "dice2", "value": 2},
                {"id": "dice3", "value": 3},
                {"id": "dice4", "value": 4},
            ],
            [
                {"id": "dice5", "value": 5},
                {"id": "dice6", "value": 6}
            ]
        ]
    }
}

function addDice() {
    const diceContainer = document.getElementById('dice-container');
    const newDie = document.createElement('div');
    newDie.className = 'die';
    newDie.textContent = 1; // Initial value
    newDie.style.fontSize = '50px'; // Default size
    diceContainer.appendChild(newDie);
    diceCount++;
}

function removeDice() {
    const diceContainer = document.getElementById('dice-container');
    if (diceCount > 0) {
        diceContainer.removeChild(diceContainer.lastChild);
        diceCount--;
    }
}
let diceSize = 50; // Initial size in pixels

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
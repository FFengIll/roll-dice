function rollDice() {
    for (let i = 1; i <= 6; i++) {
        const dice = document.getElementById(`dice${i}`);
        const result = Math.floor(Math.random() * 6) + 1;
        dice.textContent = result;
    }
}

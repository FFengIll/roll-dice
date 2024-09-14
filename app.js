const initialDiceConfig = {
    dice: [
        [{ id: 'dice1', value: 1 },
        { id: 'dice2', value: 2 },
        { id: 'dice3', value: 3 },
        { id: 'dice4', value: 4 }],
        [{ id: 'dice5', value: 5 },
        { id: 'dice6', value: 6 }],
        [],
    ],
};

const App = () => {
    const [diceConfig, setDiceConfig] = React.useState(initialDiceConfig);
    const [diceSize, setDiceSize] = React.useState(50);

    const rollDice = () => {
        const shakeDice = () => {
            setDiceConfig(prevConfig => ({
                dice: prevConfig.dice.map(row => row.map(dice => ({
                    ...dice,
                    value: '' // Clear value to simulate shaking
                })))
            }));
        };

        const stopShake = () => {
            setTimeout(() => {
                setDiceConfig(prevConfig => ({
                    dice: prevConfig.dice.map(row => row.map(dice => ({
                        ...dice,
                        value: Math.floor(Math.random() * 6) + 1 // Set new value
                    })))
                }));
            }, 1000);
        };

        shakeDice();
        stopShake();
    };

    const changeSize = (amount) => {
        setDiceSize(prevSize => Math.max(20, prevSize + amount));
    };

    const addDice = () => {
        setDiceConfig(prevConfig => {
            const newId = `dice${prevConfig.dice.flat().length + 1}`;
            const newDice = { id: newId, value: 1 };

            // Add the new dice to the last group
            const newDiceConfig = prevConfig.dice.slice(0, -1);
            const lastGroup = [...prevConfig.dice[prevConfig.dice.length - 1], newDice];
            newDiceConfig.push(lastGroup);

            return {
                dice: newDiceConfig
            };
        });
    };

    const removeDice = () => {
        setDiceConfig(prevConfig => {
            const lastGroup = prevConfig.dice[prevConfig.dice.length - 1];
            if (lastGroup.length === 0) return prevConfig; // No dice to remove in the last group

            // Remove the last dice from the last group
            const newLastGroup = lastGroup.slice(0, -1);
            const newDiceConfig = prevConfig.dice.slice(0, -1);
            newDiceConfig.push(newLastGroup);

            return {
                dice: newDiceConfig
            };
        });
    };

    return (
        <div className="container">
            <div className="controls">
                <button className="control-btn" onClick={() => changeSize(-10)}><i className="fas fa-search-minus"></i></button>
                <button className="control-btn" onClick={() => changeSize(10)}><i className="fas fa-search-plus"></i></button>
                <button className="modifier-btn" onClick={addDice}>+ Dice</button>
                <button className="modifier-btn" onClick={removeDice}>- Dice</button>
            </div>
            <div id="dice-container">
                {diceConfig.dice.slice(0, -1).map((row, rowIndex) => (
                    <div key={rowIndex} className="dice-container">
                        {row.map(dice => (
                            <div key={dice.id} id={dice.id} className={`dice ${dice.value === '' ? 'shaking' : 'dice'}`}>
                                {dice.value}
                            </div>
                        ))}
                    </div>
                ))}
                <div className="extra-dice-container">
                    {diceConfig.dice[diceConfig.dice.length - 1].map((dice, diceIndex) => (
                        <div key={dice.id} id={dice.id} className={`dice ${dice.value === '' ? 'shaking' : 'dice'}`}>
                            {dice.value}
                        </div>
                    ))}
                </div>
            </div>
            <div className="button-container">
                <button onClick={rollDice}>ROLL</button>
            </div>
        </div>
    );
};

// 渲染React组件到DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
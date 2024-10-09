const initialDiceConfig = {
    dice: [
        [
            { id: 'dice1', value: 1 },
            { id: 'dice2', value: 2 },
            { id: 'dice3', value: 3 },
            { id: 'dice4', value: 4 }
        ],
        [
            { id: 'dice5', value: 5 },
            { id: 'dice6', value: 6 }
        ],
        [],
    ],
};

const Dice = ({ id, value, size, style, isSelected, onClick, onDragStart, onDragOver, onDrop }) => {
    return (
        <div
            id={id}
            className={`dice ${value === '' ? 'shaking' : 'dice'} ${isSelected ? 'selected' : ''}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.5,
                ...style
            }}
            onClick={onClick}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {value}
        </div>
    );
};

const DiceRoll = () => {
    const [diceConfig, setDiceConfig] = React.useState(initialDiceConfig);
    const [diceSize, setDiceSize] = React.useState(50);
    const [selectedDiceId, setSelectedDiceId] = React.useState(null);
    const [draggedDice, setDraggedDice] = React.useState(null);

    const handleDiceClick = (id) => {
        setSelectedDiceId(id === selectedDiceId ? null : id); // Toggle selection
    };

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

    const handleDragStart = (e, dice) => {
        setDraggedDice(dice);
    };

    const handleDrop = (e, targetRowIndex) => {
        e.preventDefault();
        if (!draggedDice) return;

        setDiceConfig(prevConfig => {
            const newDiceConfig = prevConfig.dice.map(row => row.filter(dice => dice.id !== draggedDice.id));
            newDiceConfig[targetRowIndex].push(draggedDice);
            return { dice: newDiceConfig };
        });

        setDraggedDice(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
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
                {diceConfig.dice.map((row, rowIndex) => (
                    <div key={rowIndex} className="dice-container" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, rowIndex)}>
                        {row.map(dice => (
                            <Dice
                                key={dice.id}
                                id={dice.id}
                                value={dice.value}
                                size={diceSize}
                                style={{ /* 你可以在这里传递额外的样式，如果需要的话 */ }}
                                isSelected={dice.id === selectedDiceId}
                                onClick={() => handleDiceClick(dice.id)}
                                onDragStart={(e) => handleDragStart(e, dice)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button onClick={rollDice}>ROLL</button>
            </div>
        </div>
    );
};

// 渲染React组件到DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DiceRoll />);
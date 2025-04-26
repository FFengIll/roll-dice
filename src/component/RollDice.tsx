import { faMinus, faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { CustomDice } from './Dice';
import './RollDice.css';


const initialDiceConfig = {
    dice: [
        [
            { id: 'dice-red', value: 1, type: 6 },
            { id: 'dice-yellow', value: 2, type: 6 },
            { id: 'dice-blue', value: 3, type: 6 },
            { id: 'dice-green', value: 4, type: 6 }
        ],
        [
            { id: 'dice-gray', value: 5, type: 6 },
            { id: 'dice-extra', value: 6, type: 6 }
        ],
        [],
    ],
};

const RollDice = () => {
    const [diceConfig, setDiceConfig] = useState(initialDiceConfig);
    const [diceSize, setDiceSize] = useState(50);
    const [selectedDiceId, setSelectedDiceId] = useState(null);

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
                    dice: prevConfig.dice.map(row => row.map((dice: CustomDice) => ({
                        ...dice,
                        value: Math.floor(Math.random() * dice.type) + 1 // Set new value
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

    const addDice = (type: number) => {
        setDiceConfig(prevConfig => {
            const newId = `dice${prevConfig.dice.flat().length + 1}`;
            const newDice = { id: newId, value: 1, type };

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

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // If there's no destination (dragged outside droppable), do nothing
        if (!destination) return;

        // Don't do anything if the item is dropped in the same location
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        setDiceConfig(prevConfig => {
            const newDiceConfig = [...prevConfig.dice];

            // Get the dragged dice
            const [movedDice] = newDiceConfig[source.droppableId].splice(source.index, 1);

            // Insert it at the destination
            newDiceConfig[destination.droppableId].splice(destination.index, 0, movedDice);

            return { dice: newDiceConfig };
        });
    };


    return (
        <div className="container">
            <div className="controls">
                <button className="control-btn" onClick={() => changeSize(-10)}>
                    <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                <button className="control-btn" onClick={() => changeSize(10)}>
                    <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button className="control-btn" onClick={() => addDice(6)}>
                    Add D6
                </button>
                <button className="control-btn" onClick={() => addDice(10)}>
                    Add D10
                </button>
                <button className="control-btn" onClick={() => addDice(20)}>
                    Add D20
                </button>
                <button className="control-btn" onClick={removeDice}>
                    <FontAwesomeIcon icon={faMinus} />
                </button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div id="dice-container">
                    {diceConfig.dice.map((row, rowIndex) => (
                        <Droppable key={rowIndex} droppableId={`${rowIndex}`}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="dice-container"
                                >
                                    {row.map((dice, index) => (
                                        <Draggable key={dice.id} draggableId={dice.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <CustomDice
                                                        id={dice.id}
                                                        type={dice.type || 6}
                                                        value={dice.value}
                                                        size={diceSize}
                                                        style={{}}
                                                        isSelected={dice.id === selectedDiceId}
                                                        onClick={() => handleDiceClick(dice.id)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
            <div className="button-container">
                <button onClick={rollDice}>ROLL</button>
            </div>
        </div>
    );
};

export default RollDice;
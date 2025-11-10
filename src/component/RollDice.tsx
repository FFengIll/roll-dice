import { faMinus, faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback, memo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    DragCancelEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CustomDice } from './Dice';
import './RollDice.css';

// Sortable wrapper for dice with memo for performance
const SortableDice = memo(({ dice, diceSize, isSelected, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: dice.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none', // Important for mobile touch handling
        cursor: isDragging ? 'grabbing' : 'grab'
    };

    // Memoize the click handler to prevent unnecessary re-renders
    const handleClick = useCallback(() => {
        onClick(dice.id);
    }, [dice.id, onClick]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`sortable-dice ${isDragging ? 'dragging' : ''}`}
        >
            <CustomDice
                id={dice.id}
                type={dice.type || 6}
                value={dice.value}
                size={diceSize}
                style={{}}
                isSelected={isSelected}
                onClick={handleClick}
            />
        </div>
    );
});

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
    const [activeId, setActiveId] = useState(null);

    // Setup sensors for different input types with mobile optimization
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement before drag starts
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200, // 200ms delay for touch
                tolerance: 8, // 8px tolerance
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDiceClick = useCallback((id) => {
        setSelectedDiceId(prevId => prevId === id ? null : id); // Toggle selection
    }, []);

    const rollDice = useCallback(() => {
        const shakeDice = () => {
            setDiceConfig(prevConfig => ({
                dice: prevConfig.dice.map(row => row.map(dice => ({
                    ...dice,
                    value: 0 // Clear value to simulate shaking
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
    }, []);

    const changeSize = useCallback((amount) => {
        setDiceSize(prevSize => Math.max(20, prevSize + amount));
    }, []);

    const addDice = useCallback((type: number) => {
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
    }, []);

    const removeDice = useCallback(() => {
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
    }, []);

    // Find dice by ID across all rows
    const findDice = useCallback((id) => {
        for (let rowIndex = 0; rowIndex < diceConfig.dice.length; rowIndex++) {
            const diceIndex = diceConfig.dice[rowIndex].findIndex(dice => dice.id === id);
            if (diceIndex !== -1) {
                return { rowIndex, diceIndex, dice: diceConfig.dice[rowIndex][diceIndex] };
            }
        }
        return null;
    }, [diceConfig.dice]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeData = findDice(active.id as string);
        const overData = findDice(over.id as string);

        if (activeData && overData && activeData.dice.id !== overData.dice.id) {
            setDiceConfig(prevConfig => {
                const newDiceConfig = prevConfig.dice.map(row => [...row]);

                // Remove from original position
                const [movedDice] = newDiceConfig[activeData.rowIndex].splice(activeData.diceIndex, 1);

                // Add to new position
                newDiceConfig[overData.rowIndex].splice(overData.diceIndex, 0, movedDice);

                return { dice: newDiceConfig };
            });
        }

        setActiveId(null);
    }, [findDice]);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
    }, []);


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
                <button className="control-btn" onClick={() => addDice(8)}>
                    Add D8
                </button>
                <button className="control-btn" onClick={() => addDice(10)}>
                    Add D10
                </button>
                <button className="control-btn" onClick={() => addDice(12)}>
                    Add D12
                </button>
                <button className="control-btn" onClick={() => addDice(20)}>
                    Add D20
                </button>
                <button className="control-btn" onClick={removeDice}>
                    <FontAwesomeIcon icon={faMinus} />
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div id="dice-container">
                    {diceConfig.dice.map((row, rowIndex) => (
                        <SortableContext
                            key={rowIndex}
                            items={row.map(dice => dice.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="dice-container">
                                {row.map((dice) => (
                                    <SortableDice
                                        key={dice.id}
                                        dice={dice}
                                        diceSize={diceSize}
                                        isSelected={dice.id === selectedDiceId}
                                        onClick={() => handleDiceClick(dice.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <CustomDice
                            id={activeId}
                            type={findDice(activeId)?.dice.type || 6}
                            value={findDice(activeId)?.dice.value}
                            size={diceSize}
                            style={{}}
                            isSelected={false}
                            onClick={() => {}}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <div className="button-container">
                <button onClick={rollDice}>ROLL</button>
            </div>
        </div>
    );
};

export default RollDice;
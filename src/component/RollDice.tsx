import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faDice, faMinus, faRedo, faSearchMinus, faSearchPlus, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CustomDice } from './Dice';
import './RollDice.css';

type DiceConfig = {
    dice: Array<Array<{ id: string; value: number; type: number }>>;
};

// Custom hook for long press detection
const useLongPress = (
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void,
    onClick: (event: React.MouseEvent | React.TouchEvent) => void,
    delay = 500
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const targetRef = useRef<EventTarget | null>(null);

    const start = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        targetRef.current = event.target;

        timeoutRef.current = window.setTimeout(() => {
            onLongPress(event);
            setLongPressTriggered(true);
        }, delay);
    }, [onLongPress, delay]);

    const clear = useCallback((event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (shouldTriggerClick && !longPressTriggered && targetRef.current === event.target) {
            onClick(event);
        }

        setLongPressTriggered(false);
        targetRef.current = null;
    }, [onClick, longPressTriggered]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        onMouseDown: start,
        onTouchStart: start,
        onMouseUp: clear,
        onTouchEnd: clear,
        onMouseLeave: clear,
    };
};

// Sortable wrapper for dice with memo for performance
interface SortableDiceProps {
    dice: { id: string; value: number; type: number };
    diceSize: number;
    isSelected: boolean;
    onClick: (id: string) => void;
    onDelete: (id: string) => void;
    showDeleteButton: boolean;
    onLongPress: (id: string) => void;
}

const SortableDice = memo<SortableDiceProps>(({
    dice,
    diceSize,
    isSelected,
    onClick,
    onDelete,
    showDeleteButton,
    onLongPress
}) => {
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

    // Memoize the long press handler
    const handleLongPress = useCallback(() => {
        onLongPress(dice.id);
    }, [dice.id, onLongPress]);

    const longPressProps = useLongPress(handleLongPress, handleClick, 500);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`sortable-dice ${isDragging ? 'dragging' : ''} ${showDeleteButton ? 'show-delete' : ''}`}
            {...longPressProps}
        >
            <div className="dice-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                <CustomDice
                    id={dice.id}
                    type={dice.type || 6}
                    value={dice.value}
                    size={diceSize}
                    style={{}}
                    isSelected={isSelected}
                    onClick={handleClick}
                />
                {showDeleteButton && (
                    <button
                        className="delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(dice.id);
                        }}
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'red',
                            color: 'white',
                            border: '2px solid white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            zIndex: 1001,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            touchAction: 'none'
                        }}
                    >
                        ×
                    </button>
                )}
            </div>
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
    // Ensure proper initialization with defensive checks
    const safeInitialConfig = useMemo(() =>
        initialDiceConfig && initialDiceConfig.dice
            ? initialDiceConfig
            : { dice: [[], [], []] }
        , []);

    const [diceConfig, setDiceConfig] = useState<DiceConfig>(safeInitialConfig);
    const [diceSize, setDiceSize] = useState(50);
    const [selectedDiceId, setSelectedDiceId] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showDeleteButtons, setShowDeleteButtons] = useState(false);
    const [enableSingleReroll, setEnableSingleReroll] = useState(false);
    const [history, setHistory] = useState<DiceConfig[]>([safeInitialConfig]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [showUndoFeedback, setShowUndoFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

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

    // History management - defined first to avoid circular dependencies
    const addToHistory = useCallback((newConfig: DiceConfig) => {
        // Guard against undefined config
        if (!newConfig || !newConfig.dice) {
            console.error('Invalid config passed to addToHistory:', newConfig);
            return;
        }

        setHistory(prevHistory => {
            // Ensure we always have at least one item (initial state)
            if (prevHistory.length === 0) {
                console.warn('History was empty, adding initial state');
                setHistoryIndex(0);
                return [safeInitialConfig, newConfig];
            }

            const newHistory = prevHistory.slice(0, historyIndex + 1);
            newHistory.push(newConfig);

            // Limit history to 50 items to prevent memory issues
            if (newHistory.length > 50) {
                newHistory.shift();
                // Update history index when we remove an item
                setHistoryIndex(prev => Math.max(0, prev - 1));
                return newHistory;
            }

            // Normal case: increment history index
            setHistoryIndex(prev => prev + 1);
            return newHistory;
        });
    }, [historyIndex, safeInitialConfig]);

    const showFeedback = useCallback((message: string) => {
        setFeedbackMessage(message);
        setShowUndoFeedback(true);
        setTimeout(() => setShowUndoFeedback(false), 1000);
    }, []);

    const handleDiceClick = useCallback((id: string) => {
        if (enableSingleReroll) {
            // Single dice re-roll logic - simplified and more reliable
            setDiceConfig(prevConfig => {
                if (!prevConfig || !prevConfig.dice) {
                    console.error('Invalid prevConfig in handleDiceClick');
                    return prevConfig;
                }

                // Create shake state
                const shakeConfig = {
                    dice: prevConfig.dice.map(row =>
                        row.map(dice => {
                            if (dice && dice.id === id) {
                                return { ...dice, value: 0 }; // Clear value to simulate shaking
                            }
                            return dice;
                        })
                    )
                };

                // Add shake state to history
                addToHistory(shakeConfig);

                // Schedule the final roll
                setTimeout(() => {
                    // Generate the final config directly
                    const finalConfig = {
                        dice: shakeConfig.dice.map(row =>
                            row.map(dice => {
                                if (dice && dice.id === id) {
                                    return { ...dice, value: Math.floor(Math.random() * dice.type) + 1 };
                                }
                                return dice;
                            })
                        )
                    };

                    // Add final result to history and set it as current config
                    addToHistory(finalConfig);
                    setDiceConfig(finalConfig);
                }, 300);

                return shakeConfig;
            });
        } else {
            // Normal selection logic
            setSelectedDiceId(prevId => prevId === id ? null : id); // Toggle selection
        }
    }, [enableSingleReroll, addToHistory]);

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
                setDiceConfig(prevConfig => {
                    const newConfig = {
                        dice: prevConfig.dice.map(row => row.map((dice) => ({
                            ...dice,
                            value: Math.floor(Math.random() * dice.type) + 1 // Set new value
                        })))
                    };
                    addToHistory(newConfig);
                    return newConfig;
                });
            }, 1000);
        };

        shakeDice();
        stopShake();
    }, [addToHistory]);

    const changeSize = useCallback((amount: number) => {
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

            const newConfig = { dice: newDiceConfig };
            addToHistory(newConfig);
            return newConfig;
        });
    }, [addToHistory]);

    const removeDice = useCallback(() => {
        setDiceConfig(prevConfig => {
            const lastGroup = prevConfig.dice[prevConfig.dice.length - 1];
            if (lastGroup.length === 0) return prevConfig; // No dice to remove in the last group

            // Remove the last dice from the last group
            const newLastGroup = lastGroup.slice(0, -1);
            const newDiceConfig = prevConfig.dice.slice(0, -1);
            newDiceConfig.push(newLastGroup);

            const newConfig = { dice: newDiceConfig };
            addToHistory(newConfig);
            return newConfig;
        });
    }, [addToHistory]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setDiceConfig(history[newIndex]);
            showFeedback('Undo');
        }
    }, [historyIndex, history, showFeedback]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setDiceConfig(history[newIndex]);
            showFeedback('Redo');
        }
    }, [historyIndex, history, showFeedback]);

    // Check if undo/redo is available
    const canUndo = historyIndex > 0;
    const canRedo = (historyIndex < history.length - 1) && history.length > 0;

    // Find dice by ID across all rows
    const findDice = useCallback((id: string) => {
        // Guard against undefined diceConfig
        if (!diceConfig || !diceConfig.dice) {
            return null;
        }

        for (let rowIndex = 0; rowIndex < diceConfig.dice.length; rowIndex++) {
            const row = diceConfig.dice[rowIndex];
            if (!row) continue;

            const diceIndex = row.findIndex(dice => dice && dice.id === id);
            if (diceIndex !== -1) {
                return { rowIndex, diceIndex, dice: row[diceIndex] };
            }
        }
        return null;
    }, [diceConfig]);

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

                const newConfig = { dice: newDiceConfig };
                addToHistory(newConfig);
                return newConfig;
            });
        }

        setActiveId(null);
    }, [findDice, addToHistory]);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
    }, []);

    // Long press handler to show delete buttons
    const handleLongPress = useCallback(() => {
        setShowDeleteButtons(true);
    }, []);

    // Delete individual dice
    const handleDeleteDice = useCallback((diceId: string) => {
        setDiceConfig(prevConfig => {
            const newDiceConfig = prevConfig.dice.map(row => {
                return row.filter(dice => dice.id !== diceId);
            }).filter(row => row.length > 0); // Remove empty rows

            // Ensure we always have at least one row
            if (newDiceConfig.length === 0) {
                const newConfig = { dice: [[]] };
                addToHistory(newConfig);
                return newConfig;
            }

            const newConfig = { dice: newDiceConfig };
            addToHistory(newConfig);
            return newConfig;
        });

        // Hide delete buttons after deletion
        setShowDeleteButtons(false);
    }, [addToHistory]);

    // Hide delete buttons when clicking outside
    const hideDeleteButtons = useCallback(() => {
        setShowDeleteButtons(false);
    }, []);


    return (
        <div className="container" onClick={hideDeleteButtons}>
            <div className="controls" onClick={(e) => e.stopPropagation()}>
                <button className="control-btn" onClick={() => changeSize(-10)}>
                    <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                <button className="control-btn" onClick={() => changeSize(10)}>
                    <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button className="control-btn" onClick={() => addDice(6)}>
                    D6
                </button>
                <button className="control-btn" onClick={() => addDice(8)}>
                    D8
                </button>
                <button className="control-btn" onClick={() => addDice(10)}>
                    D10
                </button>
                <button className="control-btn" onClick={() => addDice(12)}>
                    D12
                </button>
                <button className="control-btn" onClick={() => addDice(20)}>
                    D20
                </button>
                <button className="control-btn" onClick={removeDice}>
                    <FontAwesomeIcon icon={faMinus} />
                </button>
                <button
                    className={`control-btn ${enableSingleReroll ? 'active' : ''}`}
                    onClick={() => setEnableSingleReroll(!enableSingleReroll)}
                    title={enableSingleReroll ? "Disable single dice re-roll" : "Enable single dice re-roll"}
                >
                    <FontAwesomeIcon icon={faDice} />
                </button>
                <button
                    className="control-btn"
                    onClick={undo}
                    disabled={!canUndo}
                    title="Undo"
                >
                    <FontAwesomeIcon icon={faUndo} />
                </button>
                <button
                    className="control-btn"
                    onClick={redo}
                    disabled={!canRedo}
                    title="Redo"
                >
                    <FontAwesomeIcon icon={faRedo} />
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div id="dice-container" onClick={(e) => e.stopPropagation()}>
                    {diceConfig && diceConfig.dice ? (
                        <div>
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
                                                onClick={handleDiceClick}
                                                onDelete={handleDeleteDice}
                                                showDeleteButton={showDeleteButtons}
                                                onLongPress={handleLongPress}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            ))}
                        </div>
                    ) : null}

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
                            onClick={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <div className="button-container">
                <button onClick={rollDice}>ROLL</button>
            </div>

            {showUndoFeedback && (
                <div className="undo-feedback">
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
};

export default RollDice;
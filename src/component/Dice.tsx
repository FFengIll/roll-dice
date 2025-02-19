import React from 'react';
import './RollDice.css';

const Dice = ({id, value = '', size = 50, style = {}, isSelected = false, onClick}) => {
    return (
        <div
            id={id}
            className={`dice ${value === '' ? 'shaking' : 'dice'} ${isSelected ? 'selected' : ''}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...style
            }}
            onClick={onClick}
        >
            {value}
        </div>
    );
};

export default Dice;
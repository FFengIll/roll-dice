import { Button, Stack, TextField, Box } from '@mui/material';
import React, { useState } from 'react';
import styles from './RoleStatus.module.css';

interface RoleStatusProps {
    label: string;
    defaultColor: string;
    defaultValue?: number;
}

const RoleStatus: React.FC<RoleStatusProps> = ({ label, defaultColor, defaultValue = 0 }) => {
    const storageKey = `RoleStatus.${label}`;
    const initialValue = localStorage.getItem(storageKey)
        ? Number(localStorage.getItem(storageKey))
        : defaultValue;

    const [value, setValue] = useState(initialValue);
    const [color, setColor] = useState(defaultColor);

    React.useEffect(() => {
        localStorage.setItem(storageKey, value.toString());
    }, [value, storageKey]);

    const handleIncrease = () => {
        setValue(prev => prev + 1);
    };

    const handleDecrease = () => {
        setValue(prev => Math.max(0, prev - 1));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value) || 0;
        setValue(newValue);
    };

    return (
        <Box className={styles.roleStatus} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box className={styles.label}>{label}</Box>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                        width: '40px',
                        height: '40px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                />
                <Button
                    className={styles.controlButton}
                    onClick={handleDecrease}
                    variant="outlined"
                    size="small"
                >
                    -
                </Button>
                <TextField
                    className={styles.numberInput}
                    value={value}
                    onChange={handleInputChange}
                    type="number"
                    size="small"
                    sx={{
                        width: '80px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: color,
                                borderWidth: 2,
                            },
                            '&:hover fieldset': {
                                borderColor: color,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: color,
                            },
                        },
                    }}
                />
                <Button
                    className={styles.controlButton}
                    onClick={handleIncrease}
                    variant="outlined"
                    size="small"
                >
                    +
                </Button>
            </Stack>
        </Box>
    );
};

export default RoleStatus;

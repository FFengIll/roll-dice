import { Button, Box, TextField, Divider, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";

const RandomNum: React.FC = () => {
    const [digitCount, setDigitCount] = useState<number>(8);
    const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

    const generateRandomNumbers = () => {
        const numbers = Array.from({ length: digitCount }, () =>
            Math.floor(Math.random() * 10)
        );
        setRandomNumbers(numbers);
    };

    const handleDigitCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setDigitCount(value);
        }
    };

    useEffect(() => {
        generateRandomNumbers();
    }, []);

    return (
        <Box sx={{ padding: "24px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Random Number Generator
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {randomNumbers.map((num, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid black",
                            borderRadius: "4px",
                        }}
                    >
                        <Typography variant="h6">{num}</Typography>
                    </Box>
                ))}
            </Box>
            <Divider sx={{ width: '100%', mb: 2 }}></Divider>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <TextField
                    type="number"
                    value={digitCount}
                    onChange={(e) => handleDigitCountChange(e as React.ChangeEvent<HTMLInputElement>)}
                    sx={{ mr: 1, width: "200px" }}
                    placeholder="Number of Digits"
                    size="small"
                />
                <Button onClick={() => setDigitCount((prev) => prev + 1)} variant="outlined">+</Button>
                <Button onClick={() => setDigitCount((prev) => Math.max(1, prev - 1))} variant="outlined">-</Button>
            </Stack>
            <Divider sx={{ width: '100%', mb: 3 }}></Divider>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={generateRandomNumbers}>
                    Generate
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        const numberString = randomNumbers.join('');
                        navigator.clipboard.writeText(numberString).then(() => {
                            console.log("Copied to clipboard:", numberString);
                        });
                    }}
                >
                    Copy
                </Button>
            </Stack>
        </Box>
    );
};

export default RandomNum;

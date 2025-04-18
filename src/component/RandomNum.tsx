import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const RandomNum: React.FC = () => {
    const [digitCount, setDigitCount] = useState<number>(8); // 默认值设置为 8
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

    // 在组件挂载时生成默认的 8 位随机数
    useEffect(() => {
        generateRandomNumbers();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Random Number Generator
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, mt: 2 }}>
                {randomNumbers.map((num, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 50,
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid black",
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h6">{num}</Typography>
                    </Box>
                ))}
            </Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center", textAlign: "center" }}>
                <TextField
                    label="Number of Digits"
                    type="number"
                    value={digitCount}
                    onChange={handleDigitCountChange}
                    inputProps={{ min: 1 }}
                    sx={{ mr: 2 }}
                />
            </Box>
            <Box>
                <Button variant="contained" onClick={generateRandomNumbers}>
                    Generate
                </Button>
            </Box>

        </Box>
    );
};

export default RandomNum;

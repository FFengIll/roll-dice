import { Button, Divider, Flex, Input, Space, Typography } from "antd";
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
        <div style={{ padding: "24px", alignItems: "center", }}>
            <Typography.Title level={3} style={{ marginBottom: "16px" }}>
                Random Number Generator
            </Typography.Title>
            <Flex wrap gap="small">
                {randomNumbers.map((num, index) => (
                    <div
                        key={index}
                        style={{
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid black",
                            borderRadius: "4px",
                        }}
                    >
                        <Typography.Text strong>{num}</Typography.Text>
                    </div>
                ))}
            </Flex>
            <Divider></Divider>
            <Space direction="horizontal" size="small" >
                <Input
                    type="number"
                    value={digitCount}
                    onChange={(e) => handleDigitCountChange(e as React.ChangeEvent<HTMLInputElement>)}
                    style={{ marginRight: "8px", width: "200px" }}
                    placeholder="Number of Digits"
                />
                <Button onClick={() => setDigitCount((prev) => prev + 1)}>+</Button>
                <Button onClick={() => setDigitCount((prev) => Math.max(1, prev - 1))}>-</Button>
            </Space>
            <Divider></Divider>
            <Space direction="horizontal" size="large" >
                <Button type="primary" onClick={generateRandomNumbers}>
                    Generate
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        const numberString = randomNumbers.join('');
                        navigator.clipboard.writeText(numberString).then(() => {
                            console.log("Copied to clipboard:", numberString);
                        });
                    }}
                >
                    Copy
                </Button>
            </Space>
        </div>
    );
};

export default RandomNum;

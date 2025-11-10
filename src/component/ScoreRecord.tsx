import {
    Button,
    Col,
    Input,
    List,
    Row,
    Space,
    Typography
} from 'antd';
import { useEffect, useState } from 'react';
import './ScoreRecord.css';

const ScoreRecord = () => {
    const key = "ScoreRecord"
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem(key);
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [prevItems, setPrevItems] = useState([]);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(items));
    }, [items]);

    const addItem = () => {
        const number = parseFloat(inputValue);
        if (!isNaN(number)) {
            setPrevItems(items);
            setItems([...items, number]);
            setInputValue('');
        }
    };

    const clearItems = () => {
        setPrevItems(items);
        setItems([]);
        setInputValue('');
    };

    const revokeItems = () => {
        setItems(prevItems);
        setPrevItems([]);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addItem();
        }
    };

    const sumItems = items.reduce((acc, item) => acc + item, 0);
    const uniqueSortedItems = [...new Set(items)].sort((a, b) => a - b);

    return (
        <div style={{ padding: '16px' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Title level={4}>Score Record</Typography.Title>
                </Col>

                <Col span={24}>
                    <Typography.Title level={5}>Total: {sumItems}</Typography.Title>
                </Col>

                <Col span={24}>
                    <Row justify="center" gutter={[8, 8]}>
                        {uniqueSortedItems.map((item, index) => (
                            <Col key={index}>
                                <Button>
                                    <Typography onClick={() => setInputValue(item.toString())}>
                                        {item}
                                    </Typography>
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col span={24}>
                    <Row justify="center" align="middle" gutter={[8, 8]}>
                        <Col>
                            <Space>
                                <Input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Enter a score"
                                    suffix={
                                        <Button type="primary" onClick={addItem}>
                                            Add
                                        </Button>
                                    }
                                />
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Button
                                    style={{
                                        borderColor: 'red',
                                        color: 'red',
                                    }}
                                    onClick={clearItems}
                                >
                                    Clear
                                </Button>
                                <Button
                                    style={{
                                        borderColor: 'blue',
                                        color: 'blue',
                                    }}
                                    disabled={prevItems.length === 0}
                                    onClick={revokeItems}
                                >
                                    Revoke
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Row justify="center">
                        <List
                            style={{
                                maxHeight: '400px',
                                minWidth: '200px',
                                overflow: 'auto',
                            }}
                            dataSource={[...items].reverse()}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <Typography.Text>{`${items.length - index})`}</Typography.Text>
                                    <Typography.Text style={{ marginLeft: '8px' }}>{item}</Typography.Text>
                                </List.Item>
                            )}
                        />
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default ScoreRecord;
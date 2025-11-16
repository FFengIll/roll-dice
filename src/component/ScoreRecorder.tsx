import { ClearOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Input,
    List,
    message,
    Popconfirm,
    Row,
    Space,
    Tooltip,
    Typography
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './ScoreRecorder.css';

interface ScoreItem {
    id: string;
    value: number;
    timestamp: number;
}

interface HistoryState {
    items: ScoreItem[];
    timestamp: number;
}

const ScoreRecorder = () => {
    const STORAGE_KEY = "ScoreRecord";
    const MAX_HISTORY = 10;

    const [items, setItems] = useState<ScoreItem[]>(() => {
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY);
            return savedItems ? JSON.parse(savedItems) : [];
        } catch (error) {
            console.error('Error loading saved items:', error);
            return [];
        }
    });

    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState<HistoryState[]>([]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving items:', error);
            message.error('Failed to save data');
        }
    }, [items]);

    const addItem = useCallback(() => {
        const number = parseFloat(inputValue);
        if (!isNaN(number)) {
            const newItem: ScoreItem = {
                id: Date.now().toString(),
                value: number,
                timestamp: Date.now()
            };

            // Save current state to history before making changes
            setHistory(prev => [
                { items: [...items], timestamp: Date.now() },
                ...prev.slice(0, MAX_HISTORY - 1)
            ]);

            setItems(prev => [...prev, newItem]);
            setInputValue('');
        } else {
            message.warning('Please enter a valid number');
        }
    }, [inputValue, items]);

    const removeItem = useCallback((id: string) => {
        setHistory(prev => [
            { items: [...items], timestamp: Date.now() },
            ...prev.slice(0, MAX_HISTORY - 1)
        ]);
        setItems(prev => prev.filter(item => item.id !== id));
    }, [items]);

    const clearItems = useCallback(() => {
        if (items.length > 0) {
            setHistory(prev => [
                { items: [...items], timestamp: Date.now() },
                ...prev.slice(0, MAX_HISTORY - 1)
            ]);
            setItems([]);
            setInputValue('');
        }
    }, [items]);

    const undo = useCallback(() => {
        if (history.length > 0) {
            const [lastState, ...restHistory] = history;
            setItems(lastState.items);
            setHistory(restHistory);
        }
    }, [history]);

    const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            addItem();
        }
    }, [addItem]);

    const formatTimestamp = useCallback((timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    }, []);

    const sumItems = useMemo(() =>
        items.reduce((acc, item) => acc + item.value, 0),
        [items]
    );

    const uniqueSortedValues = useMemo(() => {
        const values = items.map(item => item.value);
        return [...new Set(values)].sort((a, b) => a - b);
    }, [items]);

    const averageValue = useMemo(() =>
        items.length > 0 ? sumItems / items.length : 0,
        [sumItems, items.length]
    );

    return (
        <div className="score-record-container" style={{ padding: '16px' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Score Record
                            </Typography.Title>
                        </Col>
                        <Col>
                            <Space>
                                <Typography.Text type="secondary">
                                    Count: {items.length}
                                </Typography.Text>
                                {history.length > 0 && (
                                    <Tooltip title={`Undo (${history.length} available)`}>
                                        <Button
                                            icon={<UndoOutlined />}
                                            onClick={undo}
                                            type="text"
                                        />
                                    </Tooltip>
                                )}
                            </Space>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <div className="score-summary-card">
                        <Row gutter={[16, 8]}>
                            <Col xs={12} sm={8}>
                                <div className="stat-item">
                                    <Typography.Text type="secondary">Total</Typography.Text>
                                    <div className="stat-value">
                                        <Typography.Title level={3} style={{ margin: 0 }}>
                                            {sumItems}
                                        </Typography.Title>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} sm={8}>
                                <div className="stat-item">
                                    <Typography.Text type="secondary">Average</Typography.Text>
                                    <div>
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            {averageValue.toFixed(2)}
                                        </Typography.Title>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={8}>
                                <div className="stat-item">
                                    <Typography.Text type="secondary">Latest</Typography.Text>
                                    <div>
                                        <Typography.Title level={5} style={{ margin: 0, color: '#52c41a' }}>
                                            {items.length > 0 ? items[items.length - 1].value : '-'}
                                        </Typography.Title>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>

                {uniqueSortedValues.length > 0 && (
                    <Col span={24}>
                        <div className="quick-add-section">
                            <Typography.Text type="secondary" style={{ marginBottom: '8px', display: 'block' }}>
                                Quick Add:
                            </Typography.Text>
                            <Row justify="center" gutter={[8, 8]}>
                                {uniqueSortedValues.slice(0, 12).map((value, index) => (
                                    <Col key={index}>
                                        <Button
                                            size="small"
                                            onClick={() => setInputValue(value.toString())}
                                            style={{ minWidth: '40px' }}
                                        >
                                            {value}
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Col>
                )}

                <Col span={24}>
                    <div className="input-section">
                        <Row justify="center" align="middle" gutter={[8, 8]}>
                            <Col xs={24} sm={16}>
                                <Input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Enter a score"
                                    size="large"
                                    addonAfter={
                                        <Button type="primary" onClick={addItem} size="middle">
                                            Add
                                        </Button>
                                    }
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Row justify="center" gutter={[8, 8]}>
                                    <Col>
                                        <Popconfirm
                                            title="Clear all scores?"
                                            description="This will remove all recorded scores."
                                            onConfirm={clearItems}
                                            okText="Yes"
                                            cancelText="No"
                                            disabled={items.length === 0}
                                        >
                                            <Button
                                                icon={<ClearOutlined />}
                                                danger
                                                disabled={items.length === 0}
                                            >
                                                Clear
                                            </Button>
                                        </Popconfirm>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col span={24}>
                    <List
                        className="list-container"
                        style={{
                            maxHeight: '400px',
                            overflow: 'auto',
                        }}
                        dataSource={[...items].reverse()}
                        renderItem={(item, index) => (
                            <List.Item
                                className="score-item"
                                actions={[
                                    <Tooltip title={`Added at ${formatTimestamp(item.timestamp)}`}>
                                        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                                            {formatTimestamp(item.timestamp)}
                                        </Typography.Text>
                                    </Tooltip>,
                                    <Popconfirm
                                        title="Delete this score?"
                                        onConfirm={() => removeItem(item.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            danger
                                            size="small"
                                            className="delete-button"
                                        />
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Typography.Text>
                                            <Typography.Text type="secondary">
                                                #{items.length - index}
                                            </Typography.Text>
                                            {' '}
                                            <Typography.Text strong style={{ fontSize: '16px' }}>
                                                {item.value}
                                            </Typography.Text>
                                        </Typography.Text>
                                    }
                                />
                            </List.Item>
                        )}
                        locale={{
                            emptyText: (
                                <div className="empty-state">
                                    <Typography.Text type="secondary">
                                        No scores recorded yet. Add your first score above!
                                    </Typography.Text>
                                </div>
                            )
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ScoreRecorder;
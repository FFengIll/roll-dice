import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, ColorPicker, Input, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import React, { useState } from 'react';
import styles from './RoleStatus.module.css';

interface RoleStatusProps {
    label: string;
    defaultColor: string;
    defaultValue?: number;
}

const RoleStatus: React.FC<RoleStatusProps> = ({ label, defaultColor, defaultValue = 0 }) => {
    // Load initial value from localStorage if exists
    const storageKey = `RoleStatus.${label}`;
    const initialValue = localStorage.getItem(storageKey)
        ? Number(localStorage.getItem(storageKey))
        : defaultValue;

    const [value, setValue] = useState(initialValue);
    const [color, setColor] = useState<Color>(defaultColor);

    // Save value to localStorage whenever it changes
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
        <div className={styles.roleStatus}>
            <Space size="middle">
                <span className={styles.label}>{label}</span>
                <ColorPicker
                    className={styles.colorPicker}
                    value={color}
                    onChange={setColor}
                />
                <Button
                    className={styles.controlButton}
                    icon={<MinusOutlined />}
                    onClick={handleDecrease}
                />
                <Input
                    className={styles.numberInput}
                    value={value}
                    onChange={handleInputChange}
                    type="number"
                    style={{
                        borderColor: typeof color === 'string' ? color : color.toHexString(),
                        borderWidth: 2,
                        textAlign: 'center',
                    }}
                />
                <Button
                    className={styles.controlButton}
                    icon={<PlusOutlined />}
                    onClick={handleIncrease}
                />
                {/* <Button
                    className={styles.controlButton}
                    onClick={() => setValue(0)}
                >
                    <ReloadOutlined />
                </Button> */}
            </Space>
        </div>
    );
};

export default RoleStatus;

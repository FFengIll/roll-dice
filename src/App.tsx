import { faHome, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Flex, FloatButton, Typography } from "antd";
import React, { useState } from 'react';

import './App.css';
import RandomNum from './component/RandomNum';
import RoleStatus from './component/RoleStatus';
import RollDice from './component/RollDice';
import ScoreRecorder from './component/ScoreRecorder';

const RoleStatusPanel: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Card title="角色状态" style={{ width: 400 }}>
                <RoleStatus label="HP" defaultColor="#ff4d4f" />
                <RoleStatus label="MP" defaultColor="#1677ff" />
                <RoleStatus label="Money" defaultColor="#faad14" />
                <RoleStatus label="Exp" defaultColor="#52c41a" />
            </Card>
        </div>
    );
};


function App() {
    const [activeView, setActiveView] = useState<string | null>(null);

    const homeButton = () => {
        return (
            <FloatButton
                onClick={() => setActiveView(null)}
                // className="controll-button"
                type="primary"
                style={{
                    width: '48px',
                    height: '48px',
                    insetInlineEnd: 96
                }}
                icon={<FontAwesomeIcon icon={faHome} />}
            >
            </FloatButton>
        )
    }

    const resetButton = () => {
        return (
            <FloatButton
                onClick={() => {
                    // Remove all localStorage items with specific prefixes
                    // Object.keys(localStorage).forEach(key => {
                    //     if (activeView && key.startsWith(activeView)) {
                    //         console.log('Removing:', key);
                    //         localStorage.removeItem(key);
                    //     }
                    // });
                    // setActiveView(activeView)
                }}
                type="primary"
                // className="controll-button"
                style={{
                    width: '48px',
                    height: '48px',
                    insetInlineEnd: 24
                }}
                icon={<FontAwesomeIcon icon={faRefresh} />}
            >
            </FloatButton>
        )
    }

    const views = new Map([
        ['Roll Dice', <RollDice />],
        ['Score Record', <ScoreRecorder />],
        ['Number Gen', <RandomNum />],
        ['Role Status', <RoleStatusPanel />]
    ]);

    if (activeView) {
        return (
            <div>

                {homeButton()}
                {resetButton()}
                {views.get(activeView)}
            </div>
        );
    }

    return (
        <>

            {homeButton()}
            {resetButton()}


            <Flex wrap gap="small">
                {
                    Array.from(views.keys()).map((name) => (
                        <Card
                            title={
                                <Typography.Title level={3}>
                                    {name}
                                </Typography.Title>
                            }
                            onClick={() => setActiveView(name)}
                            style={{ cursor: 'pointer', width: '250px', textAlign: 'center' }}
                        >
                        </Card >
                    ))
                }
            </Flex >
        </>
    );
}

export default App;

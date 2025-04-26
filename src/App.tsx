import { useState } from "react";
import './App.css';

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Flex, Typography } from "antd";
import RandomNum from './component/RandomNum';
import RollDice from './component/RollDice';
import ScoreRecord from './component/ScoreRecord';


function App() {
    const [activeView, setActiveView] = useState<string | null>(null);


    const homeButton = () => {
        return (
            <button
                onClick={() => setActiveView(null)}
                className="controll-button"
                style={{
                    position: 'fixed',
                    top: '16px',
                    left: '16px',
                    zIndex: 1000,
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <FontAwesomeIcon icon={faHome} />
            </button>
        )
    }

    const views = new Map([
        ['Roll Dice', <RollDice />],
        ['Score Record', <ScoreRecord />],
        ['Number Gen', <RandomNum />],
    ]);

    if (activeView) {
        return (
            <div>
                {homeButton()}
                {views.get(activeView)}
            </div>
        );
    }

    return (
        <>
            {homeButton()}

            <Flex wrap gap="small">
                {Array.from(views.keys()).map((name) => (
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

import { faHome, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import React, { useState } from 'react';

import './App.css';
import RandomNum from './component/RandomNum';
import RoleStatus from './component/RoleStatus';
import RollDice from './component/RollDice';
import ScoreRecorder from './component/ScoreRecorder';

import { useEffect } from 'react';
import ReactGA from "react-ga4";
import { useLocation } from 'react-router-dom';
import { initAnalytics } from './analytics';

const RoleStatusPanel: React.FC = () => {
    return (
        <Box sx={{ padding: '24px' }}>
            <Card title="角色状态" sx={{ width: 400 }}>
                <CardContent>
                    <RoleStatus label="HP" defaultColor="#ff4d4f" />
                    <RoleStatus label="MP" defaultColor="#1677ff" />
                    <RoleStatus label="Money" defaultColor="#faad14" />
                    <RoleStatus label="Exp" defaultColor="#52c41a" />
                </CardContent>
            </Card>
        </Box>
    );
};

function GS4() {
    const location = useLocation();

    useEffect(() => {
        initAnalytics();
    }, []);

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);

    return (<div></div>)
}


function App() {
    const [activeView, setActiveView] = useState<string | null>(null);

    const homeButton = () => {
        return (
            <Box
                onClick={() => setActiveView(null)}
                sx={{
                    position: 'fixed',
                    bottom: 96,
                    right: 24,
                    width: '48px',
                    height: '48px',
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1000,
                    '&:hover': {
                        bgcolor: 'primary.dark',
                    }
                }}
            >
                <FontAwesomeIcon icon={faHome} color="white" />
            </Box>
        )
    }

    const resetButton = () => {
        return (
            <Box
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
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    width: '48px',
                    height: '48px',
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1000,
                    '&:hover': {
                        bgcolor: 'primary.dark',
                    }
                }}
            >
                <FontAwesomeIcon icon={faRefresh} color="white" />
            </Box>
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
            <GS4></GS4>
            {homeButton()}
            {resetButton()}

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'center',
                    padding: 2
                }}
            >
                {
                    Array.from(views.keys()).map((name) => (
                        <Card
                            key={name}
                            sx={{ width: '250px', textAlign: 'center' }}
                        >
                            <CardActionArea onClick={() => setActiveView(name)}>
                                <CardContent>
                                    <Typography variant="h6" component="h3">
                                        {name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                }
            </Box>
        </>
    );
}

export default App;

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
                    flexDirection: 'column',
                    gap: 3,
                    justifyContent: 'center',
                    padding: 2,
                    maxWidth: '600px',
                    margin: '0 auto'
                }}
            >
                {
                    Array.from(views.keys()).map((name, index) => {
                        const indicatorColors = [
                            '#1890ff', // Roll Dice - Blue
                            '#52c41a', // Score Record - Green
                            '#faad14', // Number Gen - Orange
                            '#722ed1'  // Role Status - Purple
                        ];
                        return (
                            <Card
                                key={name}
                                sx={{
                                    width: '100%',
                                    height: '100px',
                                    position: 'relative',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid #f0f0f0',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                <CardActionArea onClick={() => setActiveView(name)} sx={{ height: '100%' }}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '6px',
                                            backgroundColor: indicatorColors[index],
                                            borderRadius: '8px 0 0 8px'
                                        }}
                                    />
                                    <CardContent sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        paddingLeft: 4,
                                        paddingRight: 2,
                                        '&:last-child': { paddingBottom: 2 }
                                    }}>
                                        <Typography variant="h5" component="h3" sx={{ fontWeight: 500 }}>
                                            {name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        );
                    })
                }
            </Box>
        </>
    );
}

export default App;

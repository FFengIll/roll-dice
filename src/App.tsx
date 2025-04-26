import { Card, CardContent, Grid2 as Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import './App.css';

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        ['Dice', <RollDice />],
        ['Score', <ScoreRecord />],
        ['Number', <RandomNum />],
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

            <Grid container spacing={2}>
                {Array.from(views.keys()).map((name) => (
                    <Grid key={name}>
                        <Card onClick={() => setActiveView(name)} style={{ cursor: 'pointer' }}>
                            <CardContent className="card-content">
                                <Typography variant="h6" component="div">
                                    {name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default App;

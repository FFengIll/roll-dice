import React, {useState} from 'react'
import './App.css'
import Typography from "@mui/material/Typography"
import {Card, CardContent, Grid2 as Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";


function ChoiceGrid() {
    const choices = new Map([
        ['Dice', './view/roll-dice'],
        ['Score', './view/score-record'],
    ]);
    const navigate = useNavigate();

    return (
        <Grid container spacing={2}>
            {Array.from(choices.entries()).map(([name, url]) => (
                <Grid>
                    <Card onClick={() => navigate({pathname: url,})} style={{cursor: 'pointer'}}>
                        <CardContent className="card-content">
                            <Typography variant="h6" component="div">
                                {name}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}


function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <ChoiceGrid></ChoiceGrid>
        </>
    )
}

export default App

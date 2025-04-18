import { Card, CardContent, Grid2 as Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import './App.css';


function ChoiceGrid() {
    const choices = new Map([
        ['Dice', './view/roll-dice'],
        ['Score', './view/score-record'],
        ['Number', './view/random-num'],
    ]);
    const navigate = useNavigate();

    return (
        <Grid container spacing={2}>
            {Array.from(choices.entries()).map(([name, url]) => (
                <Grid>
                    <Card onClick={() => navigate({ pathname: url, })} style={{ cursor: 'pointer' }}>
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
    return (
        <>
            <ChoiceGrid></ChoiceGrid>
        </>
    )
}

export default App

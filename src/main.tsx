import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.tsx';
import RandomNum from './component/RandomNum.tsx';
import RollDice from "./component/RollDice.tsx";
import ScoreRecorder from "./component/ScoreRecorder.tsx";
import './index.css';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: (
                <App />
            ),
        },
        {
            path: "/view/roll-dice",
            element: (
                <RollDice />
            ),
        },
        {
            path: "/view/score-record",
            element: (
                <ScoreRecorder />
            ),
        },
        {
            path: "/view/random-num",
            element: (
                <RandomNum />
            ),
        },
    ],
    {
        basename: "/roll-dice/dist",
    }
);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
    </StrictMode>,
)

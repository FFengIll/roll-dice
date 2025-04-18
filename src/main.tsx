import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.tsx';
import RandomNum from './component/RandomNum.tsx';
import RollDice from "./component/RollDice.tsx";
import ScoreRecord from "./component/ScoreRecord.tsx";
import './index.css';


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
                <ScoreRecord />
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
        <RouterProvider router={router}></RouterProvider>
    </StrictMode>,
)

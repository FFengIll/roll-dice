import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RollDice from "./component/RollDice.tsx";
import ScoreRecord from "./component/ScoreRecord.tsx";


const router = createBrowserRouter(
    [
        {
            path: "/",
            element: (
                <App/>
            ),
        },
        {
            path: "/view/roll-dice",
            element: (
                <RollDice/>
            ),
        },
        {
            path: "/view/score-record",
            element: (
                <ScoreRecord/>
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

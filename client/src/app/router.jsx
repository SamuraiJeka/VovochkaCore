import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage/MainPage";
import RandomAnecdote from "../pages/RandomAnecdote/RandomAnecdote";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
        // errorElement: <ErrorPage/>
    },
    {
        path: "/RandomAnecdote",
        element: <RandomAnecdote/>
    }   
])
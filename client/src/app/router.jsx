import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage/MainPage";
import RzhevskyPage from "../pages/RzhevskyPage/RzhevskyPage";
import JewPage from "../pages/JewPage/JewPage";
import VovaPage from "../pages/VovaPage/VovaPage";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
        // errorElement: <ErrorPage/>
    },
    {
        path: "/rzhevsky",
        element: <RzhevskyPage/>
    },
    {
        path: "/jew",
        element: <JewPage/>
    },
    {
        path: "/vovochka",
        element: <VovaPage/>
    }
      
])
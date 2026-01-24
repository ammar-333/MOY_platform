import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/app-layout";
import Home from "../pages/home/home";
import NotFound from "../pages/not-found";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;

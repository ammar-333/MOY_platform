import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/app-layout";
import Home from "../pages/home/home";
import NotFound from "../pages/not-found";
import LoginPage from "@/pages/auth/login-page";
import ConfirmationMessage from "@/pages/confirmation-message";
import ServicesPage from "@/pages/service/services";
import ServiceRequestsPage from "@/pages/service/service-requests";
import SignupPage from "@/pages/auth/signup-page";
import SportComplexPage from "@/pages/reservation/sportComplex-page";
import YouthHousePage from "@/pages/reservation/youthHouse-page";
import ProtectedLayout from "@/layouts/protected-layout";
import { protectedLoader } from "./protected-route";

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
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },

  {
    path: "/user",
    element: <ProtectedLayout />,
    loader: protectedLoader,
    children: [
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "youthHouse",
        element: <YouthHousePage />,
      },
      {
        path: "sportComplex",
        element: <SportComplexPage />,
      },
      {
        path: "confirmation-message",
        element: <ConfirmationMessage />,
      },
      {
        path: "Service-Requests",
        element: <ServiceRequestsPage />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;

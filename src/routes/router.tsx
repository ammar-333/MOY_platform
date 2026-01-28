import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/app-layout";
import Home from "../pages/home/home";
import NotFound from "../pages/not-found";
import LoginPage from "@/pages/auth/login-page";
import PersonProfile from "@/pages/profile/person-profile";
import OrganizationProfile from "@/pages/profile/organization-profile";
import ReservationPage from "@/pages/reservation/reservation";
import ConfirmationMessage from "@/pages/confirmation-message";
import ServicesPage from "@/pages/service/services";
import ServiceRequestsPage from "@/pages/service/service-requests";

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
    path: "/person-profile",
    element: <PersonProfile />,
  },
  {
    path: "/organization-profile",
    element: <OrganizationProfile />,
  },
  {
    path: "/reservation",
    element: <ReservationPage />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/Service-Requests",
    element: <ServiceRequestsPage />,
  },
  {
    path: "/confirmation-message",
    element: <ConfirmationMessage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;

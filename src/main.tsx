import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/router";
import { ThemeProvider } from "@/components/theme-provider";
import DirectionWrapper from "./components/features/DirectionWrapper";
import "./i18n/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <DirectionWrapper>
        <RouterProvider router={routes} />
      </DirectionWrapper>
    </ThemeProvider>
  </StrictMode>,
);

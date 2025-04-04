import React from "react";
import { RouteObject } from "react-router-dom";
import App from "./App";
import { HomePage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { ErrorPage } from "./pages/Error";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
];

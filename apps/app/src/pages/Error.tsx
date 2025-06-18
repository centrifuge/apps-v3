import React from "react";
import { useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="error-page">
      <h2>Oops!</h2>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.statusText || error?.message || "Unknown error"}</i>
      </p>
    </div>
  );
}

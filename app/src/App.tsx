import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Centrifuge App</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;

import React, { useState } from 'react'

export function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className="home-page">
      <h2>Home Page</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/pages/Home.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

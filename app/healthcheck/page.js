"use client";

import { useState, useEffect } from "react";
import { fetchData } from "../utils/api";

export default function Home() {
  const [health, setHealth] = useState("");

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const result = await fetchData("/health");
        setHealth(result);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };
    loadHealth();
  }, []);

  return (
    <div>
      <h1>Payment Gateway</h1>
      {health ? (
        <p>Health Status: {health.status}</p>
      ) : (
        <p>Loading health status...</p>
      )}
    </div>
  );
}

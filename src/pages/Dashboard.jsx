import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchHistory } from "../utils/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchHistory(currentUser.uid).then(setHistory);
    }
  }, [currentUser]);

  const data = history.map((item, idx) => ({
    name: new Date(item.timestamp).toLocaleDateString(),
    count: idx + 1
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Statistics Dashboard</h1>
      {data.length === 0 ? (
        <p>No history records yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563EB" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
); }

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Sun, Cloud } from "lucide-react"; // install: npm install lucide-react
import "./App.css";

function App() {
  const [brightness, setBrightness] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.76.103:5000/api/data");
        const json = await res.json();

        const now = new Date().toLocaleTimeString();
        setBrightness((prev) => {
          const updated = [...prev, { time: now, data: json.data }];
          return updated.slice(-20);
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const latest = brightness.length > 0 ? brightness[brightness.length - 1].data : 0;
  const opacity = Math.min(latest / 100, 1);

  return (
    <div
      className="app-container"
      style={{
        background: `linear-gradient(to top, rgba(20,20,40,1), rgba(${200 - latest}, ${200 - latest / 2}, ${255 - latest}, 1))`,
      }}
    >
      <div className="card">
        <h1 className="title">🌡 Brightness Monitor</h1>
        <div
          className="icon-container"
          style={{
            opacity,
            transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
            transform: `scale(${0.8 + opacity * 0.4})`,
          }}
        >
          {latest > 50 ? (
            <Sun size={120} color="#ffcc00" />
          ) : (
            <Cloud size={120} color="#4f83ff" />
          )}
        </div>
        <p className="value">Current Brightness: {latest}</p>
      </div>

      <div className="chart-section">
        <h2>📈 History</h2>
        <p>
                <LineChart width={600} height={300} data={brightness}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis domain={['auto', 'auto']} label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="data" stroke="#007bff" dot={true} />
      </LineChart>
        </p>
      </div>
    </div>
  );
}

export default App;

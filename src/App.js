import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [user, setUser] = useState(null);
  const [hours, setHours] = useState("");
  const [logs, setLogs] = useState(() =>
    JSON.parse(localStorage.getItem("logs")) || []
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const addLog = () => {
    if (!hours) return;
    const today = new Date().toLocaleDateString();
    setLogs([...logs, { date: today, hours }]);
    setHours("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📘 Study Tracker</h1>

      {!user ? (
        <button onClick={login}>Login with Google</button>
      ) : (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>

          <hr />

          <h3>Daily Study Log</h3>
          <input
            type="number"
            placeholder="Study hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <button onClick={addLog}>Add</button>

          <ul>
            {logs.map((l, i) => (
              <li key={i}>
                {l.date} — {l.hours} hours
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
  }

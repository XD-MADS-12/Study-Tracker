// =============================== // FULL STUDY TRACKER – FINAL VERSION // Vercel + Supabase + Charts + Checklist // ===============================

import React, { useEffect, useState } from "react"; import { createClient } from "@supabase/supabase-js"; import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ---------- Supabase ---------- const supabase = createClient( process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY );

export default function App() { // ---------- AUTH ---------- const [user, setUser] = useState(null);

// ---------- STATE ---------- const [hours, setHours] = useState(""); const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem("logs")) || [] );

const [lectures, setLectures] = useState(() => JSON.parse(localStorage.getItem("lectures")) || [ { subject: "Physics", title: "Lecture 1", done: false }, { subject: "Chemistry", title: "Lecture 1", done: false }, { subject: "Math", title: "Lecture 1", done: false }, { subject: "Biology", title: "Lecture 1", done: false }, { subject: "ICT", title: "Lecture 1", done: false } ] );

// ---------- EFFECTS ---------- useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

useEffect(() => { localStorage.setItem("logs", JSON.stringify(logs)); }, [logs]);

useEffect(() => { localStorage.setItem("lectures", JSON.stringify(lectures)); }, [lectures]);

// ---------- FUNCTIONS ---------- const login = async () => { await supabase.auth.signInWithOAuth({ provider: "google" }); };

const logout = async () => { await supabase.auth.signOut(); setUser(null); };

const addLog = () => { if (!hours) return; const today = new Date().toLocaleDateString(); setLogs([...logs, { date: today, hours: Number(hours) }]); setHours(""); };

const toggleLecture = (i) => { setLectures(prev => prev.map((l, idx) => (idx === i ? { ...l, done: !l.done } : l)) ); };

const completedCount = lectures.filter(l => l.done).length;

// ---------- UI ---------- return ( <div style={styles.app}> <h1 style={styles.title}>📘 Study Tracker Pro</h1>

{!user ? (
    <button style={styles.loginBtn} onClick={login}>Login with Google</button>
  ) : (
    <>
      <p>👤 {user.email}</p>
      <button style={styles.logoutBtn} onClick={logout}>Logout</button>

      {/* DAILY LOG */}
      <section style={styles.card}>
        <h3>⏱ Daily Study Log</h3>
        <input
          type="number"
          placeholder="Study hours"
          value={hours}
          onChange={e => setHours(e.target.value)}
        />
        <button onClick={addLog}>Add</button>
        <ul>
          {logs.map((l, i) => (
            <li key={i}>{l.date} — {l.hours} hours</li>
          ))}
        </ul>
      </section>

      {/* CHART */}
      <section style={styles.card}>
        <h3>📊 Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={logs}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* CHECKLIST */}
      <section style={styles.card}>
        <h3>📚 Lecture Checklist</h3>
        <p>Completed: {completedCount}/{lectures.length}</p>
        {lectures.map((l, i) => (
          <label key={i} style={styles.checkbox}>
            <input
              type="checkbox"
              checked={l.done}
              onChange={() => toggleLecture(i)}
            />
            {l.subject} – {l.title}
          </label>
        ))}
      </section>
    </>
  )}
</div>

); }

// ---------- STYLES ---------- const styles = { app: { padding: 20, fontFamily: "Arial", maxWidth: 600, margin: "auto" }, title: { textAlign: "center" }, card: { background: "#f9f9f9", padding: 15, marginTop: 15, borderRadius: 10 }, checkbox: { display: "block", marginTop: 6 }, loginBtn: { padding: 10, width: "100%" }, logoutBtn: { marginBottom: 10 } };

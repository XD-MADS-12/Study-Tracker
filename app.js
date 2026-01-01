import React, { useState, useEffect } from "react"; import { createClient } from "@supabase/supabase-js"; import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// -------- Supabase Config -------- const supabaseUrl = "https://oiafwpfupgtafvmtrxkz.supabase.co"; const supabaseKey = "sb_publishable_P2MjSyQvletluokDDloWYw_KpeQ8Epy"; const supabase = createClient(supabaseUrl, supabaseKey);

export default function StudyTracker() { // -------- Auth -------- const [user, setUser] = useState(null);

// -------- Study Data -------- const [lectures, setLectures] = useState(() => JSON.parse(localStorage.getItem("lectures")) || [ { subject: "Physics", title: "Lecture 1", done: false }, { subject: "Chemistry", title: "Lecture 1", done: false }, { subject: "Math", title: "Lecture 1", done: false } ] );

const [dailyLog, setDailyLog] = useState(() => JSON.parse(localStorage.getItem("dailyLog")) || [] );

const [hours, setHours] = useState(0);

// -------- Effects -------- useEffect(() => { localStorage.setItem("lectures", JSON.stringify(lectures)); }, [lectures]);

useEffect(() => { localStorage.setItem("dailyLog", JSON.stringify(dailyLog)); }, [dailyLog]);

useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

// -------- Functions -------- const toggleLecture = (index) => { setLectures(prev => prev.map((l, i) => (i === index ? { ...l, done: !l.done } : l)) ); };

const addDailyLog = () => { const today = new Date().toISOString().split("T")[0]; setDailyLog(prev => [...prev, { date: today, hours: Number(hours) }]); setHours(0); };

const login = async () => { await supabase.auth.signInWithOAuth({ provider: "google" }); };

const logout = async () => { await supabase.auth.signOut(); setUser(null); };

// -------- UI -------- return ( <div className="min-h-screen bg-gray-100 p-4"> <h1 className="text-2xl font-bold mb-4">Study Tracker Pro</h1>

{!user ? (
    <button onClick={login} className="bg-black text-white px-4 py-2 rounded-xl">
      Login with Google
    </button>
  ) : (
    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-xl">
      Logout
    </button>
  )}

  {/* Lecture Checklist */}
  <div className="bg-white p-4 rounded-2xl shadow mt-4">
    <h2 className="font-semibold mb-2">Lecture Checklist</h2>
    {lectures.map((l, i) => (
      <label key={i} className="flex gap-2 items-center">
        <input type="checkbox" checked={l.done} onChange={() => toggleLecture(i)} />
        {l.subject} – {l.title}
      </label>
    ))}
  </div>

  {/* Daily Study Log */}
  <div className="bg-white p-4 rounded-2xl shadow mt-4">
    <h2 className="font-semibold mb-2">Daily Study Log</h2>
    <input
      type="number"
      value={hours}
      onChange={(e) => setHours(e.target.value)}
      placeholder="Hours studied"
      className="border p-2 rounded w-full"
    />
    <button onClick={addDailyLog} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-xl">
      Add Today
    </button>
  </div>

  {/* Charts */}
  <div className="bg-white p-4 rounded-2xl shadow mt-4">
    <h2 className="font-semibold mb-2">Weekly Progress</h2>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={dailyLog}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="hours" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

); }


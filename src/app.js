import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./index.css";

/**
 * Supabase configuration:
 * - Recommended: set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your environment.
 * - Fallbacks use the values that were present in the repository for convenience/testing.
 */
const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://oiafwpfupgtafvmtrxkz.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "sb_publishable_P2MjSyQvletluokDDloWYw_KpeQ8Epy";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  // Auth
  const [user, setUser] = useState(null);

  // Lecture checklist
  const [lectures, setLectures] = useState(() => {
    try {
      const raw = localStorage.getItem("lectures");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Could not parse lectures from localStorage", e);
    }
    return [
      { subject: "Physics", title: "Lecture 1", done: false },
      { subject: "Mathematics", title: "Lecture 1", done: false },
      { subject: "Chemistry", title: "Lecture 1", done: false },
    ];
  });

  // Daily log: [{ date: "YYYY-MM-DD", hours: 2 }]
  const [dailyLog, setDailyLog] = useState(() => {
    try {
      const raw = localStorage.getItem("dailyLog");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Could not parse dailyLog from localStorage", e);
    }
    return [];
  });

  // Input for today's hours (empty string or number)
  const [hours, setHours] = useState("");

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("lectures", JSON.stringify(lectures));
  }, [lectures]);

  useEffect(() => {
    localStorage.setItem("dailyLog", JSON.stringify(dailyLog));
  }, [dailyLog]);

  // Supabase auth state
  useEffect(() => {
    let authListener = null;

    // Get user on load
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    // Listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    authListener = subscription;

    return () => {
      if (authListener && typeof authListener.unsubscribe === "function") {
        authListener.unsubscribe();
      }
    };
  }, []);

  const toggleLecture = (index) => {
    setLectures((prev) =>
      prev.map((l, i) => (i === index ? { ...l, done: !l.done } : l))
    );
  };

  const addDailyLog = () => {
    const parsedHours = Number(hours);
    if (!parsedHours || parsedHours <= 0) {
      alert("Please enter a positive number of hours.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    setDailyLog((prev) => {
      const exists = prev.find((d) => d.date === today);
      if (exists) {
        // If today's entry exists, add to it
        return prev.map((d) =>
          d.date === today ? { ...d, hours: d.hours + parsedHours } : d
        );
      }
      return [...prev, { date: today, hours: parsedHours }];
    });
    setHours("");
  };

  const login = async () => {
    // Opens provider login (Google). You can add redirectTo if needed.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Login error:", error);
      alert("Login failed. See console for details.");
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
      alert("Sign out failed. See console for details.");
      return;
    }
    setUser(null);
  };

  // Chart expects an array sorted by date
  const chartData = [...dailyLog].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Study Tracker Pro</h1>
          {!user ? (
            <button
              onClick={login}
              className="bg-black text-white px-4 py-2 rounded-xl"
            >
              Login with Google
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Hi, {user.email}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Lecture Checklist */}
        <section className="bg-white p-4 rounded-2xl shadow mb-4">
          <h2 className="font-semibold mb-3">Lecture Checklist</h2>
          <div className="flex flex-col gap-2">
            {lectures.map((l, i) => (
              <label key={i} className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  checked={l.done}
                  onChange={() => toggleLecture(i)}
                  className="w-4 h-4"
                />
                <span className={l.done ? "line-through text-gray-500" : ""}>
                  {l.subject} – {l.title}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Daily Study Log */}
        <section className="bg-white p-4 rounded-2xl shadow mb-4">
          <h2 className="font-semibold mb-3">Daily Study Log</h2>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min="0"
              step="0.5"
              value={hours}
              onChange={(e) =>
                setHours(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Hours studied"
              className="border p-2 rounded w-40"
            />
            <button
              onClick={addDailyLog}
              className="mt-0 bg-green-500 text-white px-4 py-2 rounded-xl"
            >
              Add Today
            </button>
          </div>

          {/* Recent logs */}
          {dailyLog.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recent entries</h3>
              <ul className="text-sm">
                {[...dailyLog]
                  .slice()
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((d) => (
                    <li key={d.date}>
                      {d.date}: {d.hours} hour{d.hours !== 1 ? "s" : ""}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </section>

        {/* Charts */}
        <section className="bg-white p-4 rounded-2xl shadow mb-8">
          <h2 className="font-semibold mb-3">Weekly Progress</h2>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
                        }

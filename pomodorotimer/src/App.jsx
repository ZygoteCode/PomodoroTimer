import { useState, useEffect } from "react";
import Button from "./components/Button";
import { Pause, Play, Square, Sun, Moon, GithubIcon } from "lucide-react";

export default function App() {
  const notificationSound = new Audio("/notification.mp3");
  const [darkMode, setDarkMode] = useState(true);

  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [scale, setScale] = useState(1);

  const sessions = [
    { type: "Work", duration: 25 * 60 },
    { type: "Short Break", duration: 5 * 60 },
    { type: "Long Break", duration: 15 * 60 }
  ];
  const [currentSession, setCurrentSession] = useState(0);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  useEffect(() => {
    if (!isTimerStarted) return;

    const interval = setInterval(() => {
      if (!isTimerPaused) {
        setSeconds(prev => {
          if (prev <= 0) {
            notificationSound.play().catch((e) => console.log(e));
            const nextSession = (currentSession + 1) % sessions.length;
            setCurrentSession(nextSession);
            return sessions[nextSession].duration;
          }
          return prev - 1;
        });

        setScale(1.03);
        setTimeout(() => setScale(1), 600);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerStarted, isTimerPaused, currentSession]);

  // Suono al resume
  useEffect(() => {
    if (isTimerStarted && !isTimerPaused) {
      notificationSound.play().catch((e) => console.log(e));
    }
  }, [isTimerPaused]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 from-gray-100 via-gray-200 to-gray-100 transition-colors duration-500">
        
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl shadow-2xl px-16 py-16 text-center flex flex-col items-center gap-8 relative">
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 dark:bg-black/30 transition-colors hover:bg-white/30 dark:hover:bg-black/50"
          >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-400"/> : <Moon className="w-6 h-6 text-white"/>}
          </button>

          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 via-pink-500 to-fuchsia-600 animate-gradient selection:bg-fuchsia-500/30">
            Pomodoro Timer
          </h1>

          <h3 className="text-xl font-semibold text-black dark:text-white/70">{sessions[currentSession].type}</h3>

          <h2
            className="text-[140px] font-extrabold text-white drop-shadow-2xl drop-shadow-gray-500 transition-transform duration-700 ease-in-out"
            style={{ transform: `scale(${scale})` }}
          >
            {formatTime(seconds)}
          </h2>

          <div className="flex flex-row gap-4 items-center justify-center mt-7">
            <Button text="Start timer" Icon={Play} disabled={isTimerStarted} onClick={() => {
              setIsTimerStarted(true);
              notificationSound.play().catch((e) => console.log(e));
            }} />
            <Button text={`${isTimerPaused ? "Resume" : "Pause"} timer`} Icon={isTimerPaused ? Play : Pause} disabled={!isTimerStarted} onClick={() => setIsTimerPaused(!isTimerPaused)} />
            <Button text="Stop timer" Icon={Square} disabled={!isTimerStarted} onClick={() => {
              setIsTimerPaused(false);
              setIsTimerStarted(false);
              setCurrentSession(0);
              setSeconds(sessions[0].duration);
              setScale(1);
            }} />
          </div>

          <div className="flex flex-row gap-4 items-center justify-center mt-5">
            <GithubIcon className="w-6 h-6 text-white" />
            <a className="text-sky-500 hover:text-sky-300" href="https://github.com/ZygoteCode/PomodoroTimer/" target="_blank">Support the project on GitHub!</a>
          </div>
        </div>
      </div>
    </div>
  );
}
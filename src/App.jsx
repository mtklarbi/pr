import React, { useEffect, useState } from 'react'

function App() {
      const [breakLength, setBreakLength] = React.useState(5);
      const [sessionLength, setSessionLength] = React.useState(25);
      const [timeLeft, setTimeLeft] = React.useState(25 * 60);
      const [isSession, setIsSession] = React.useState(true);
      const [isRunning, setIsRunning] = React.useState(false);
      const intervalRef = React.useRef(null);
      const audioRef = React.useRef(null);

      const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      };
      const handleReset = () => {
        setIsRunning(false);
        setBreakLength(5);
        clearInterval(intervalRef.current);
        setSessionLength(25);
        setTimeLeft(25 * 60);
        setIsSession(true);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

      }; 
       
      const handleIncrement = (type) =>  {
      if (type === 'break') {
        if (breakLength < 60) {
          setBreakLength(breakLength + 1);
          setTimeLeft((breakLength + 1) * 60);

        }
      } else {
        if (sessionLength < 60) {
          setSessionLength(sessionLength + 1);
          setTimeLeft((sessionLength + 1) * 60);
        }
      }
    };

      const handleDecrement = (type) => {
      if (type === 'break') {
        if (breakLength > 1) {
          setBreakLength(breakLength - 1);
          setTimeLeft((breakLength - 1) *60 );
        }
      } else {
        if (sessionLength > 1) {
          setSessionLength(sessionLength - 1);
          setTimeLeft((sessionLength - 1) * 60);
        }
      }
    };
    useEffect(() => {
      if (isRunning) {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime === 0) {
              audioRef.current.play();
              if (isSession) {
                setIsSession(false);
                return breakLength * 60;
              } else {
                setIsSession(true);
                return sessionLength * 60;
              }
            } else {
              return prevTime - 1;
            }
          });
        }, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
      return () => clearInterval(intervalRef.current);
    }, [breakLength, sessionLength, timeLeft, isSession, isRunning]);

 
    const handleStartStop = () => {
      setIsRunning(!isRunning);
    };


  return (
    <>
     <div className="flex flex-col items-center justify-center min-h-screen bg-orange-400">
      <h1 className="text-4xl font-hold mb-8">25 + 5 Clock</h1>
      <div className='flex flex-col items-center mb-8'>
        <div className='text-xl font-semibold mb-2' id="break-label">Break Length</div>
          <div className='flex items-center space-x-4'>
            <button className='px-4 py-2 bg-red-500 text-white  rounded' id="break-decrement" onClick={() => handleDecrement('break')}>Decrement</button>
            <div className='text-2xl' id="break-length">{breakLength}</div>
            <button className='px-4 py-2 bg-green-500 text-white rounded' id="break-increment" onClick={() => handleIncrement('break')}>Increment</button>
          </div>
      </div>
      
      <div className='flex flex-col items-center mb-8'>
        <div className='text-xl font-semibold mb-2' id="session-label">Session Length</div>
        <div className='flex items-center space-x-4'>
            <button className='px-4 py-2 bg-red-500 text-white rounded ' id="session-decrement"onClick={() => handleDecrement('session')}>Decrement</button>
            <div className='text-2xl' id="session-length">{sessionLength}</div>
            <button className='px-4 py-2 bg-green-500 text-white rounded' id="session-increment" onClick={() => handleIncrement('session')}>Increment</button>
        </div>
      </div>
      <div className="border p-4 rounded-lg bg-white shadow-md mb-8" >
        <div id="timer-label" className='text-xl font-semibold mb-2'>{isSession? 'Session' : 'Break'} </div>
        <div id="time-left" className='text-4xl'>{formatTime(timeLeft)}</div>
      </div>
      <div className='flex space-x-4'>
        <button id="start_stop" className='px-4 bg-blue-500 text-white rounded' onClick={handleStartStop}>{isRunning ? 'Pause' : 'Start'}</button>
        <button id="reset" onClick={handleReset} className='px-4 py-2 bg-yellow-400 text-white rounded'>Reset</button>
      </div>
      <audio 
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" 
      />

     </div>
    </>
  )
}

export default App

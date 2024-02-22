// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load saved state from localStorage on initial load
    const savedState = JSON.parse(localStorage.getItem('audioPlayerState'));
    if (savedState) {
      setAudioFiles(savedState.audioFiles || []);
      setCurrentTrackIndex(savedState.currentTrackIndex || 0);
    }
  }, []);

  useEffect(() => {
    // Save current state to localStorage
    localStorage.setItem('audioPlayerState', JSON.stringify({
      audioFiles,
      currentTrackIndex,
    }));
  }, [audioFiles, currentTrackIndex]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setAudioFiles([...audioFiles, selectedFile]);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % audioFiles.length);
  };

  const handleTimeUpdate = () => {
    // Update current time in localStorage for playback continuation on reload
    localStorage.setItem('audioPlayerState', JSON.stringify({
      audioFiles,
      currentTrackIndex,
      currentTime: audioRef.currentTime,
    }));
  };

  useEffect(() => {
    // Load last playing audio file and continue from last position
    if (audioFiles.length > 0) {
      const savedState = JSON.parse(localStorage.getItem('audioPlayerState'));
      if (savedState && savedState.currentTime !== undefined) {
        setCurrentTrackIndex(savedState.currentTrackIndex);
        audioRef.currentTime = savedState.currentTime;
      }
      audioRef.src = URL.createObjectURL(audioFiles[currentTrackIndex]);
      audioRef.play();
      setIsPlaying(true);
    }
  }, [audioFiles, audioRef, currentTrackIndex]);

  return (
    <div className="App">
      <h1 className='title'>Audio Player</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button className="button1" onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button className="button2" onClick={handleNextTrack}>Next Track</button>

      <div>
        <h2>Playlist</h2>
        <ul>
          {audioFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Now Playing</h2>
        <p>{audioFiles[currentTrackIndex]?.name}</p>
        <audio
          ref={setAudioRef}
          controls
          onEnded={handleNextTrack}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    </div>
  );
};

export default App;

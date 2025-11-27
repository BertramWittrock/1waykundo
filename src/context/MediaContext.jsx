import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MediaContext = createContext();

export function MediaProvider({ children }) {
  const [activeMedia, setActiveMedia] = useState({
    audio: new Map(),
    video: new Map(),
  });
  
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Percentage: 0-100
  const [currentTime, setCurrentTime] = useState(0); // Seconds
  const [duration, setDuration] = useState(0); // Seconds
  const [allSongs, setAllSongs] = useState([]);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const autoPlayTimeoutRef = useRef(null);

  // Auto-play first song - called externally
  const autoPlayFirstSong = (songList, delayMs = 2000) => {
    /*
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    autoPlayTimeoutRef.current = setTimeout(() => {
      if (songList && songList.length > 0 && !currentSong) {
        playSong(songList[0]);
      }
    }, delayMs);
    */
  };

  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const loadAndPlay = async () => {
        try {
          if (audioRef.current.src) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          audioRef.current.src = currentSong.url;
          audioRef.current.load();
          audioRef.current.volume = 0.8;
          // Reset progress and time for new song
          setProgress(0);
          setCurrentTime(0);
          setDuration(0);

          const playPromise = audioRef.current.play();
          if (playPromise) {
            await playPromise;
            setIsPlaying(true);
          }
        } catch (error) {
          console.error('Error playing song:', error);
          setIsPlaying(false);
        }
      };
      loadAndPlay();
    }
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise) {
          playPromise.catch(error => {
            console.error('Playback failed:', error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const updateMediaState = (type, id, playing) => {
    setActiveMedia(prev => {
      const newMedia = {
        ...prev,
        [type]: new Map(prev[type])
      };
      if (playing) {
        newMedia[type].set(id, true);
      } else {
        newMedia[type].delete(id);
      }
      return newMedia;
    });
  };

  const isMediaPlaying = (type, id) => {
    return activeMedia[type].has(id);
  };
  
  const playSong = async (song) => {
    if (!song) return;
    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    setCurrentSong(song);
    setIsPlaying(true);
    updateMediaState('audio', song.url, true);
    if (!allSongs.some(s => s.id === song.id)) {
      setAllSongs(prev => [...prev, song]);
    }
  };
  
  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    setIsPlaying(!isPlaying);
    updateMediaState('audio', currentSong.url, !isPlaying);
  };
  
  const previousTrack = (musicFiles) => {
    if (!currentSong) return;
    const songList = currentSong.isUnreleased 
      ? allSongs.filter(song => song.isUnreleased) 
      : (musicFiles?.length ? musicFiles : allSongs.filter(song => !song.isUnreleased));
    if (!songList.length) return;
    const currentIndex = songList.findIndex(song => song.id === currentSong.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : songList.length - 1;
    playSong(songList[previousIndex]);
  };
  
  const nextTrack = (musicFiles) => {
    if (!currentSong) return;
    const songList = currentSong.isUnreleased 
      ? allSongs.filter(song => song.isUnreleased) 
      : (musicFiles?.length ? musicFiles : allSongs.filter(song => !song.isUnreleased));
    if (!songList.length) return;
    const currentIndex = songList.findIndex(song => song.id === currentSong.id);
    const nextIndex = currentIndex < songList.length - 1 ? currentIndex + 1 : 0;
    playSong(songList[nextIndex]);
  };
  
  // Renamed from updateProgress to seek, takes time in seconds
  const seek = (timeInSeconds) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = Math.max(0, Math.min(timeInSeconds, audioRef.current.duration));
      audioRef.current.currentTime = newTime;
      // The timeupdate event will naturally update progress, currentTime, and duration states
    }
  };

  useEffect(() => {
    const audioEl = audioRef.current;
    const handleTimeUpdate = () => {
      if (audioEl) {
        const newCurrentTime = audioEl.currentTime;
        const newDuration = audioEl.duration;
        setCurrentTime(newCurrentTime);
        if (newDuration && !isNaN(newDuration)) {
          setDuration(newDuration);
          setProgress((newCurrentTime / newDuration) * 100);
        } else {
          // Reset if duration is not valid (e.g., no src)
          setDuration(0);
          setProgress(0);
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (audioEl && audioEl.duration && !isNaN(audioEl.duration)) {
        setDuration(audioEl.duration);
      } else {
        setDuration(0);
      }
    };

    if (audioEl) {
      audioEl.addEventListener('timeupdate', handleTimeUpdate);
      audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
      // When src changes, duration might be 0 or NaN initially
      audioEl.addEventListener('durationchange', handleLoadedMetadata);
    }

    return () => {
      if (audioEl) {
        audioEl.removeEventListener('timeupdate', handleTimeUpdate);
        audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioEl.removeEventListener('durationchange', handleLoadedMetadata);
      }
    };
  }, []);

  return (
    <MediaContext.Provider value={{ 
      updateMediaState, 
      isMediaPlaying,
      currentSong,
      setCurrentSong,
      isPlaying,
      setIsPlaying,
      progress, // Percentage 0-100
      currentTime, // Seconds
      duration, // Seconds
      audioRef,
      playSong,
      togglePlay,
      previousTrack,
      nextTrack,
      seek, // New seek function
      allSongs,
      autoPlayFirstSong
    }}>
      <audio ref={audioRef} preload="auto" />
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
} 
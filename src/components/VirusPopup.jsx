import React, { useEffect, useState, useRef } from 'react';
import Window98 from './Window98';
import { fakePopupContent } from '../data/windowsData';

const VirusPopup = ({ isVirusActive, setIsVirusActive }) => {
  const [virusPopups, setVirusPopups] = useState([]);
  const errorSoundRef = useRef(new Audio('/windows-error.mp3'));
  const popupIntervalRef = useRef(null);

  const playErrorSound = () => {
    // Clone the audio to allow multiple overlapping sounds
    const sound = errorSoundRef.current.cloneNode();
    sound.volume = 0.3;
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  useEffect(() => {
    if (isVirusActive) {
      // Clear any existing interval
      if (popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
      }

      setVirusPopups([]); // Reset any existing popups

      // Create random popups for 6 seconds
      const startTime = Date.now();
      popupIntervalRef.current = setInterval(() => {
        if (Date.now() - startTime > 6000) {
          clearInterval(popupIntervalRef.current);
          // Just clean up popups without showing a final message
          setTimeout(() => {
            setVirusPopups([]);
            // Animation is complete, notify parent
            setIsVirusActive(false);
          }, 500);
          return;
        }

        // Add a new random popup, but limit the total number
        setVirusPopups(prev => {
          // Limit to maximum 15 popups at a time
          if (prev.length >= 15) return prev;
          
          // Pick a random popup content from the predefined array
          const randomPopupContent = fakePopupContent[Math.floor(Math.random() * fakePopupContent.length)];
          
          const newPopup = {
            id: Date.now(),
            title: randomPopupContent.title,
            content: randomPopupContent.content,
            type: randomPopupContent.type,
            x: Math.random() * (window.innerWidth - 300),
            y: Math.random() * (window.innerHeight - 200)
          };
          playErrorSound();
          return [...prev, newPopup];
        });
      }, 100); // Make popups appear even faster for a more chaotic effect
    } else {
      // Clean up when not active
      if (popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
      }
      setVirusPopups([]);
    }

    // Cleanup interval on component unmount
    return () => {
      if (popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
      }
    };
  }, [isVirusActive, setIsVirusActive]);

  const handleClosePopup = (popupId) => {
    setVirusPopups(prev => prev.filter(popup => popup.id !== popupId));
  };

  return (
    <>
      {virusPopups.map((popup) => (
        <Window98
          key={popup.id}
          title={popup.title}
          onClose={() => handleClosePopup(popup.id)}
          isActive={true}
          position={{ x: popup.x, y: popup.y }}
          size={{ width: 350, height: 150 }}
        >
          <div className="flex items-center gap-4 h-full p-4">
            <img 
              src={popup.type === 'warning' ? '/warning.png' : '/error.png'} 
              alt={popup.type} 
              className="w-10 h-10" 
            />
            <div className="text-sm">{popup.content}</div>
          </div>
        </Window98>
      ))}
    </>
  );
};

export default VirusPopup; 
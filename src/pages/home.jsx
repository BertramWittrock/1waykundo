import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useMedia } from "../context/MediaContext";
import { useAdmin } from "../context/AdminContext";
import MatrixWindow from "../components/MatrixWindow";
import RetroWalkman from "../components/RetroWalkman";
import MatrixPongWindow from "../components/MatrixPongWindow";
import TVOverlay from "../components/TVOverlay";
import MatrixMusicPlayer from "../components/MatrixMusicPlayer";
import MatrixVideoPlayer from "../components/MatrixVideoPlayer";
import MatrixImagePlayer from "../components/MatrixImagePlayer";
import MatrixAudioPlayer from "../components/MatrixAudioPlayer";
import ShopifyShop from "../components/ShopifyShop";
import ShopifyButtonDesktop from "../components/ShopifyButtonDesktop";

const DESKTOP_ICONS = [
  { id: "dvd", label: "DVD", icon: "/icons/home_icons/ikon_dvd.gif" },
  { id: "1way", label: "1WAY", icon: "/icons/home_icons/ikon_kundo.gif" },
  {
    id: "pingpong",
    label: "Ping Pong",
    icon: "/icons/home_icons/ikon_ping-pong.gif",
  },
  { id: "cd", label: "CD", icon: "/icons/home_icons/ikon_cd.gif" },
  { id: "folder", label: "Folder", icon: "/icons/home_icons/ikon_folder.gif" },
  { id: "shop", label: "Shop", icon: "/icons/home_icons/ikon_shop.gif" },
];

// FOLDER_CONTENTS is now managed via AdminContext

// Sample video list - you should replace these with your actual videos
const VIDEO_LIST = [
  {
    title: "KUNDO FINAL",
    url: "https://kundo-1way.bertramvwsteam.workers.dev?fileKey=KundoContent/dvd/KUNDO_FINAL_COMPRESSED_H264.mp4",
  },
  {
    title: "FLOW MASTER 16:9",
    url: "https://kundo-1way.bertramvwsteam.workers.dev?fileKey=KundoContent/dvd/220512_FLOW_MASTER_16-9.mp4",
  },
  {
    title: "Frihed Feed Post",
    url: "https://kundo-1way.bertramvwsteam.workers.dev?fileKey=KundoContent/dvd/Frihed Feed Post.mp4",
  },
  {
    title: "MIN PROMO",
    url: "https://kundo-1way.bertramvwsteam.workers.dev?fileKey=KundoContent/min_promo2.mp4",
  },
  {
    title: "NorthFace",
    url: "https://kundo-1way.bertramvwsteam.workers.dev?fileKey=KundoContent/northface2.mp4",
  },
];

const BASE_Z_INDEX = 10;

export default function Home() {
  const [activeIcon, setActiveIcon] = useState(null);
  const [openWindows, setOpenWindows] = useState([]);
  const [showTVOverlay, setShowTVOverlay] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: null, title: null });
  const [activeImage, setActiveImage] = useState({ url: null, title: null });
  const [activeAudio, setActiveAudio] = useState({ url: null, title: null });
  const popupTimerRef = useRef(null);
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user, isLoaded, isSignedIn } = useUser();
  
  // Get folder contents, icon settings, and music files from AdminContext
  const { folderContents, iconSettings, musicFiles } = useAdmin();

  const [zIndices, setZIndices] = useState({});
  const [nextZCounter, setNextZCounter] = useState(BASE_Z_INDEX);

  const {
    currentSong,
    isPlaying,
    audioRef,
    playSong,
    togglePlay,
    previousTrack,
    nextTrack,
    autoPlayFirstSong,
  } = useMedia();

  // Add state to track if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/");
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    autoPlayFirstSong(musicFiles, 500);

    const handleFirstInteraction = () => {
      if (!currentSong) {
        playSong(musicFiles[0]);
      }
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [currentSong, playSong, autoPlayFirstSong, musicFiles]);

  const bringToFront = (windowId) => {
    setZIndices((prevZIndices) => ({
      ...prevZIndices,
      [windowId]: nextZCounter,
    }));
    setNextZCounter((prev) => prev + 1);
  };

  const addWindow = (windowConfig) => {
    // Generate a new unique instance key for the window
    const newInstanceKey = Date.now().toString() + Math.random().toString();

    setOpenWindows((prev) => {
      const existingWindow = prev.find(
        (w) => w.id === (windowConfig.id || newInstanceKey)
      );
      if (existingWindow) {
        // If window exists (e.g. fixed ID music player), just update its instanceKey to trigger rerender
        return prev.map((w) =>
          w.id === windowConfig.id
            ? {
                ...w,
                instanceKey: newInstanceKey,
              }
            : w
        );
      } else {
        // If new window, add it
        return [
          ...prev,
          {
            ...windowConfig,
            id: windowConfig.id || newInstanceKey,
            instanceKey: newInstanceKey,
          },
        ];
      }
    });
    bringToFront(windowConfig.id || newInstanceKey);
  };

  const handleIconClick = (iconId) => {
    setActiveIcon(iconId);

    if (iconId === "folder") {
      addWindow({ type: "folder", title: "System Explorer" });
    } else if (iconId === "pingpong") {
      addWindow({ type: "game", title: "Matrix Pong" });
    } else if (iconId === "dvd") {
      setShowTVOverlay(true);
      const icons = document.querySelectorAll(".desktop-icons, .retro-walkman");
      icons.forEach((icon) => {
        icon.style.visibility = "hidden";
      });
      if (isPlaying) {
        togglePlay();
      }
    } else if (iconId === "cd") {
      addWindow({
        type: "musicPlayer",
        title: "System Audio Interface",
        id: "matrixMusicPlayerGlobal", // Fixed ID for single instance music player
      });
    } else if (iconId === "shop") {
      addWindow({
        type: "shopWindow",
        title: "Shop",
        id: "shopWindow" + Date.now(), // Unique ID for shop window
      });
    }
  };

  const handleCloseWindow = (windowId) => {
    setOpenWindows((prev) => prev.filter((window) => window.id !== windowId));
  };

  const handlePlayVideo = (videoUrl, videoTitle) => {
    const windowConfig = {
      id: "activeVideoPlayer", // Fixed ID
      type: "videoPlayer",
      title: videoTitle,
      videoUrl: videoUrl,
    };

    // Let getInitialWindowPosition handle all positioning
    addWindow(windowConfig);
  };
  const handleCloseVideoPlayer = () => {
    setActiveVideo({ url: null, title: null });
  };

  const handlePlayImage = (imageUrl, imageTitle) => {
    const windowConfig = {
      id: "activeImagePlayer", // Fixed ID
      type: "imagePlayer",
      title: imageTitle,
      imageUrl: imageUrl,
    };

    // Let getInitialWindowPosition handle all positioning
    addWindow(windowConfig);
  };
  const handleCloseImagePlayer = () => {
    setActiveImage({ url: null, title: null });
  };

  const handlePlayAudio = (audioUrl, audioTitle) => {
    const windowConfig = {
      id: `audioPlayer_${Date.now()}`, // Unique ID for potentially multiple audio files from folders
      type: "audioPlayer",
      title: audioTitle,
      audioUrl: audioUrl,
    };

    // Let getInitialWindowPosition handle all positioning
    addWindow(windowConfig);
  };
  const handleCloseAudioPlayer = () => {
    setActiveAudio({ url: null, title: null });
  };

  const scheduleNextPopup = (delay) => {
    clearTimeout(popupTimerRef.current);
    // Only schedule popup if enabled in settings
    if (iconSettings?.ticketEnabled !== false) {
      popupTimerRef.current = setTimeout(() => {
        addWindow({
          type: "ticket",
          title: "TICKETS",
          id: "ticketPopup",
        });
      }, delay);
    }
  };

  const handleCloseTicketPopup = () => {
    handleCloseWindow("ticketPopup");
    scheduleNextPopup(180000);
  };

  useEffect(() => {
    // Only show popup if enabled in settings
    if (iconSettings?.ticketEnabled !== false) {
      scheduleNextPopup(20000);
    }
    return () => clearTimeout(popupTimerRef.current);
  }, [iconSettings?.ticketEnabled]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden font-['Courier_Prime'] select-none">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="matrix-rain" />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 p-4 sm:p-8 desktop-icons mb-32 sm:mb-0">
          {DESKTOP_ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleIconClick(icon.id)}
              className={`
                flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg
                transition-all duration-200 transform hover:scale-105
                ${
                  activeIcon === icon.id
                    ? "text-[#00ff00]"
                    : "hover:text-[#00ff00]"
                }
              `}
            >
              <div className="h-12 sm:h-16 flex items-center justify-center mb-1 sm:mb-2">
                <img
                  src={icon.icon}
                  alt={icon.label}
                  className="h-full w-auto opacity-90"
                />
              </div>
              <span className="text-[#00ff00] text-xs sm:text-sm font-medium">
                {icon.label}
              </span>
            </button>
          ))}
        </div>

        {openWindows.map((win) => {
          const currentZIndex = zIndices[win.id] || BASE_Z_INDEX;
          const commonProps = {
            id: win.id,
            title: win.title,
            instanceKey: win.instanceKey,
            onClose: () => handleCloseWindow(win.id),
            zIndex: currentZIndex,
            onBringToFront: () => bringToFront(win.id),
            ...(win.videoUrl && { videoUrl: win.videoUrl }),
            ...(win.imageUrl && { imageUrl: win.imageUrl }),
            ...(win.audioUrl && { audioUrl: win.audioUrl }),
          };

          if (win.type === "folder") {
            return (
              <MatrixWindow key={win.id} id={win.id} {...commonProps}>
                <FolderContents
                  contents={folderContents}
                  path=""
                  onPlayVideo={handlePlayVideo}
                  onPlayImage={handlePlayImage}
                  onPlayAudio={handlePlayAudio}
                />
              </MatrixWindow>
            );
          }
          if (win.type === "game") {
            return (
              <MatrixPongWindow key={win.id} id={win.id} {...commonProps} />
            );
          }
          if (win.type === "musicPlayer") {
            return (
              <MatrixMusicPlayer key={win.id} id={win.id} {...commonProps} />
            );
          }
          if (win.type === "videoPlayer") {
            return (
              <MatrixVideoPlayer key={win.id} id={win.id} {...commonProps} />
            );
          }
          if (win.type === "imagePlayer") {
            return (
              <MatrixImagePlayer key={win.id} id={win.id} {...commonProps} />
            );
          }
          if (win.type === "audioPlayer") {
            return (
              <MatrixAudioPlayer key={win.id} id={win.id} {...commonProps} />
            );
          }
          if (win.type === "ticket") {
            return (
              <MatrixWindow key={win.id} id={win.id} {...commonProps}>
                <a href={iconSettings?.ticketLink || "https://tix.to/Kundopresale"} target="_blank" rel="noopener noreferrer">
                  <div className="flex justify-center items-center h-full">
                    <img
                      src={iconSettings?.ticketImage || "/icons/home_icons/tickets.gif"}
                      alt="Tickets"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </a>
              </MatrixWindow>
            );
          }
          if (win.type === "shopWindow") {
            return (
              <MatrixWindow key={win.id} id={win.id} {...commonProps}>
                <div className="flex flex-col justify-center items-center h-full text-[#00ff00] text-xl font-bold">
                  {isMobile ? <ShopifyShop /> : <ShopifyButtonDesktop />}
                </div>
              </MatrixWindow>
            );
          }
          if (win.type === "settingsWindow") {
            return (
              <MatrixWindow key={win.id} id={win.id} {...commonProps}>
                <div className="flex flex-col justify-center items-center h-full text-[#00ff00] space-y-4 p-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 border border-[#00ff00] hover:bg-[#00ff00]/20 transition-colors duration-200 text-[#00ff00]"
                  >
                    Log Out
                  </button>
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      window.UC_UI.showSecondLayer();
                    }}
                    className="w-full py-2 px-4 border border-[#00ff00] hover:bg-[#00ff00]/20 transition-colors duration-200 text-[#00ff00] text-center"
                  >
                    Privacy Settings
                  </a>
                </div>
              </MatrixWindow>
            );
          }
          return null;
        })}

        <div className="retro-walkman">
          <RetroWalkman />
        </div>

        <button
          onClick={() => {
            addWindow({
              type: "settingsWindow",
              title: "Settings",
              id: "settingsWindow" + Date.now(),
            });
          }}
          className="fixed top-4 right-4 h-12 p-1 transition-all duration-200 hover:scale-105 rounded-lg hover:border-2 hover:border-[#00ff00]/30"
          title="Settings"
        >
          <img
            src="/icons/1way.png"
            alt="1WAY Logo"
            className="h-full w-auto filter invert opacity-90"
          />
        </button>

        <TVOverlay
          isVisible={showTVOverlay}
          onClose={() => {
            setShowTVOverlay(false);
            const icons = document.querySelectorAll(
              ".desktop-icons, .retro-walkman"
            );
            icons.forEach((icon) => {
              icon.style.visibility = "visible";
            });
          }}
          videoList={VIDEO_LIST}
        />
      </div>

      <style>{`
        .matrix-rain {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, 
            rgba(0,255,0,0.1) 0%,
            rgba(0,255,0,0.03) 50%,
            rgba(0,0,0,0) 100%
          );
          animation: rain 10s linear infinite;
        }

        @keyframes rain {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100%);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 255, 0, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 0, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 0, 0.5);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 255, 0, 0.3) rgba(0, 255, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

const FolderContents = ({
  contents,
  path,
  onPlayVideo,
  onPlayImage,
  onPlayAudio,
}) => {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderPath) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const handleFileClick = async (fileItem) => {
    if (fileItem.type === "directory") {
      toggleFolder(path ? `${path}/${fileItem.name}` : fileItem.name);
      return;
    }

    if (!fileItem.r2Key) {
      console.error("File is missing r2Key:", fileItem.name);
      alert("Cannot open file: R2 key is missing.");
      return;
    }

    try {
      const workerUrl = `https://kundo-1way.bertramvwsteam.workers.dev?fileKey=${encodeURIComponent(
        fileItem.r2Key
      )}`;

      if (fileItem.type === "video" && onPlayVideo) {
        onPlayVideo(workerUrl, fileItem.name);
      } else if (fileItem.type === "image" && onPlayImage) {
        onPlayImage(workerUrl, fileItem.name);
      } else if (fileItem.type === "audio" && onPlayAudio) {
        onPlayAudio(workerUrl, fileItem.name);
      } else {
        window.open(workerUrl, "_blank");
      }
    } catch (error) {
      console.error("Error accessing file:", error);
      alert(`Could not open file: ${error.message}`);
    }
  };

  return (
    <div className="space-y-1">
      {contents.map((item, index) => {
        const currentPath = path ? `${path}/${item.name}` : item.name;
        return (
          <div key={index} className="ml-4">
            <div
              className="flex items-center space-x-2 p-2 hover:bg-[#00ff00]/10 rounded cursor-pointer"
              onClick={() => handleFileClick(item)}
            >
              <span className="text-[#00ff00]/70">
                [
                {item.type === "directory" ? "dir" : item.name.split(".").pop()}
                ]
              </span>
              <span className="text-[#00ff00]">{item.name}</span>
            </div>
            {item.type === "directory" &&
              expandedFolders[currentPath] &&
              item.children && (
                <FolderContents
                  contents={item.children}
                  path={currentPath}
                  onPlayVideo={onPlayVideo}
                  onPlayImage={onPlayImage}
                  onPlayAudio={onPlayAudio}
                />
              )}
          </div>
        );
      })}
    </div>
  );
};

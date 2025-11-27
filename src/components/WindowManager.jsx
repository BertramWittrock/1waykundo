import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Window98 from './Window98';
import PingPong from './PingPong';
import RetroVideoPlayer from './RetroVideoPlayer';
import { deletedContent, unreleasedFiles, wallpapers, getCoverImage, contentFiles } from '../data/windowsData';
import { useMedia } from '../context/MediaContext';

const WindowManager = ({ 
  openWindows, 
  setOpenWindows,
  activeWindowId, 
  windowPositions,
  setActiveWindowId,
  closeWindow,
  handleWindowDrag,
  openVideoPlayer,
  currentSong,
  isPlaying,
  audioRef,
  togglePlay,
  previousTrack,
  nextTrack,
  musicFiles,
  updateProgress,
  playSong,
  setCurrentWallpaper,
  currentWallpaper,
  handleUnreleasedFileClick,
  progress
}) => {
  const { user } = useUser();
  const { playSong: playUnreleasedSong } = useMedia();

  // Add error popup state
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [showEncryptedMessage, setShowEncryptedMessage] = React.useState(false);

  // Helper function to get contents of current folder
  const getCurrentFolderContents = (path) => {
    if (!path) {
      return contentFiles.children;
    }

    const pathParts = path.split('\\');
    let currentFolder = contentFiles;

    for (const part of pathParts) {
      const found = currentFolder.children.find(item => item.name === part);
      if (!found || found.type !== 'folder') {
        return [];
      }
      currentFolder = found;
    }

    return currentFolder.children;
  };

  // Helper function to handle folder navigation
  const handleFolderNavigation = (windowId, newPath) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, currentPath: newPath } : w
    ));
  };

  const getWindowTitle = (type) => {
    switch(type) {
      case 'computer': return 'My Computer';
      case 'trash': return 'Recycle Bin';
      case 'game': return 'Ping Pong';
      case 'content': return 'Content';
      case 'music': return 'My Music';
      case 'profile': return 'My Profile';
      case 'video': return 'Video Player';
      case 'wallpaper': return 'Wallpaper';
      case 'shop': return 'Shop';
      case 'unreleased': return 'UNRELEASED';
      default: return 'Window';
    }
  };

  const getWindowIcon = (type) => {
    switch(type) {
      case 'computer': return '/icons/computer.png';
      case 'trash': return '/icons/trash.png';
      case 'game': return '/icons/pingpong.png';
      case 'content': return '/icons/video.png';
      case 'music': return '/icons/music.png';
      case 'profile': return '/profile.png';
      case 'wallpaper': return '/icons/wallpaper.jpg';
      case 'shop': return '/icons/shop.png';
      case 'unreleased': return '/icons/folder.png';
      default: return null;
    }
  };

  const handleWindowClick = (windowId) => {
    setActiveWindowId(windowId);
  };

  const handleSongClick = (song) => {
    playSong(song);
  };

  const handleProgressBarClick = (e) => {
    if (!audioRef.current || !currentSong) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    
    updateProgress(percentage);
  };

  // Calculate window dimensions based on screen size and type
  const getWindowDimensions = (type) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = viewportWidth <= 768 ? 16 : 40; // Smaller padding on mobile
    
    const maxWidth = viewportWidth - (padding * 2);
    const maxHeight = viewportHeight - (padding * 2) - 70; // 70px for taskbar

    switch(type) {
      case 'profile':
        return {
          width: Math.min(360, maxWidth),
          height: Math.min(450, maxHeight)
        };
      case 'music':
        return {
          width: Math.min(600, maxWidth),
          height: Math.min(500, maxHeight)
        };
      case 'game':
        if (viewportWidth <= 768) {
          // For mobile, make the window taller but narrower
          return {
            width: Math.min(320, maxWidth),
            height: Math.min(500, maxHeight)
          };
        }
        return {
          width: Math.min(600, maxWidth),
          height: Math.min(480, maxHeight)
        };
      case 'folder':
        return {
          width: Math.min(400, maxWidth),
          height: Math.min(450, maxHeight)
        };
      case 'videoPlayer':
        return {
          width: Math.min(560, maxWidth),
          height: Math.min(450, maxHeight)
        };
      case 'imagePlayer':
        return {
          width: Math.min(500, maxWidth),
          height: Math.min(450, maxHeight)
        };
      case 'audioPlayer':
        return {
          width: Math.min(360, maxWidth),
          height: Math.min(200, maxHeight)
        };
      default:
        return {
          width: Math.min(500, maxWidth),
          height: Math.min(400, maxHeight)
        };
    }
  };

  const getWindowContent = (type, window) => {
    switch(type) {
      case 'computer':
        return <div className="text-base">My Computer Content</div>;
      case 'trash':
        return (
          <div className="flex flex-col h-full">
            {/* Toolbar with warning */}
            <div className="bg-[#ffffe1] border-b border-[#919191] p-2 flex items-center gap-3">
              <img src="/warning.png" alt="Warning" className="w-8 h-8" />
              <span className="text-sm text-black">Some items in the Recycle Bin cannot be recovered</span>
            </div>
            
            {/* Address Bar */}
            <div className="h-[40px] bg-[#c3c3c3] border-b-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] flex items-center px-2">
              <span className="mr-2">Location:</span>
              <div className="flex-1 h-[32px] bg-white border border-[#808080] shadow-[inset_1px_1px_#0a0a0a] px-2 py-1">
                Recycle Bin
              </div>
            </div>

            {/* File List */}
            <div className="flex-1 bg-white p-1 overflow-auto">
              <div className="border border-[#c0c0c0] bg-white">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#c3c3c3] text-left">
                      <th className="px-3 py-1 border-r border-[#808080]">Name</th>
                      <th className="px-3 py-1">Size</th>
                      <th className="px-3 py-1 border-r border-[#808080] hidden md:table-cell">Date Deleted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedContent.map((item) => (
                      <tr 
                        key={item.id}
                        className="hover:bg-[#000080] hover:text-white cursor-pointer text-black"
                      >
                        <td className="px-3 py-1 border-r border-[#e0e0e0] flex items-center gap-2">
                          <img 
                            src={`/${item.type === 'folder' ? 'folder' : item.type === 'archive' ? 'archive' : item.type + '_deleted'}.png`}
                            alt={item.type}
                            className="w-4 h-4 opacity-50 object-contain"
                          />
                          <span className={`truncate max-w-[140px] md:max-w-none ${item.recoverable ? '' : 'line-through opacity-50'}`}>
                            {item.name}
                          </span>
                        </td>
                        <td className="px-3 py-1">{item.size}</td>
                        <td className="px-3 py-1 hidden md:table-cell">{item.deleted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Bar */}
            <div className="h-[24px] bg-[#c3c3c3] border-t-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] px-2 flex items-center md:justify-between">
              <span className="text-sm md:text-xs">{deletedContent.length} deleted item(s)</span>
              <span className="hidden md:inline text-xs">{deletedContent.filter(item => item.recoverable).length} recoverable</span>
            </div>
          </div>
        );
      case 'game':
        return <PingPong />;
      case 'content':
        return (
          <div className="flex flex-col h-full">
            {/* Address Bar */}
            <div className="h-[40px] bg-[#c3c3c3] border-b-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] flex items-center px-2">
              <span className="mr-2">Address:</span>
              <div className="flex-1 h-[32px] bg-white border border-[#808080] shadow-[inset_1px_1px_#0a0a0a] px-2 py-1">
                C:\Content{window.currentPath ? '\\' + window.currentPath : ''}
              </div>
            </div>

            {/* File List */}
            <div className="flex-1 bg-white p-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#c3c3c3] text-left">
                    <th className="px-3 py-1 border-r border-[#808080]">Name</th>
                    <th className="px-3 py-1 border-r border-[#808080]">Type</th>
                    <th className="px-3 py-1">Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {window.currentPath && (
                    <tr 
                      className="hover:bg-[#000080] hover:text-white cursor-pointer text-black"
                      onClick={() => {
                        const newPath = window.currentPath.split('\\').slice(0, -1).join('\\');
                        handleFolderNavigation(window.id, newPath);
                      }}
                    >
                      <td className="px-3 py-1 border-r border-[#e0e0e0] flex items-center gap-2">
                        <img src="/folder.png" alt="Up" className="w-4 h-4 object-contain" />
                        ..
                      </td>
                      <td className="px-3 py-1 border-r border-[#e0e0e0]">File Folder</td>
                      <td className="px-3 py-1">-</td>
                    </tr>
                  )}
                  {getCurrentFolderContents(window.currentPath).map((item) => (
                    <tr 
                      key={item.id || item.name}
                      className="hover:bg-[#000080] hover:text-white cursor-pointer text-black"
                      onClick={() => {
                        if (item.type === 'folder') {
                          const newPath = window.currentPath 
                            ? `${window.currentPath}\\${item.name}`
                            : item.name;
                          handleFolderNavigation(window.id, newPath);
                        } else if (item.type === 'video') {
                          openVideoPlayer(item);
                        }
                      }}
                    >
                      <td className="px-3 py-1 border-r border-[#e0e0e0] flex items-center gap-2">
                        <img 
                          src={item.type === 'folder' ? '/folder.png' : '/icons/video.png'} 
                          alt={item.type} 
                          className="w-4 h-4 object-contain"
                        />
                        <span className="truncate max-w-[180px] md:max-w-none">
                          {item.name}
                          {currentSong && currentSong.isUnreleased && currentSong.title === item.name.replace('.mp3', '') && isPlaying && (
                            <span className="text-xs ml-2">▶</span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-1 border-r border-[#e0e0e0]">
                        {item.type === 'folder' ? 'File Folder' : 'Video File'}
                      </td>
                      <td className="px-3 py-1">{item.date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status Bar */}
            <div className="h-[24px] bg-[#c3c3c3] border-t-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] px-2 flex items-center text-sm">
              {getCurrentFolderContents(window.currentPath).length} object(s)
            </div>
          </div>
        );
      case 'music':
        return (
          <div className="flex flex-col h-full">
            <div className="flex flex-col md:flex-row flex-1 min-h-0">
              {/* Left Panel - Album Art and Info */}
              <div className="w-full md:w-64 bg-[#c3c3c3] border-b-2 md:border-b-0 md:border-r-2 border-[#ffffff] shadow-[inset_-1px_0_#0a0a0a] p-4 flex flex-col items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] p-2 mb-4">
                  <img 
                    src={getCoverImage(currentSong?.url, currentSong)} 
                    alt="Album Art" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/signaler_cover.png';
                    }}
                  />
                </div>
                <div className="w-full bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] p-3 mb-4">
                  <div className="text-sm font-bold mb-1">Now Playing:</div>
                  <div className="text-xs mb-2 truncate">{currentSong ? currentSong.title : 'Select a track to play'}</div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>00:00</span>
                    <span>{currentSong ? currentSong.duration : '00:00'}</span>
                  </div>
                  <div 
                    className="h-4 bg-white border border-[#808080] shadow-[inset_1px_1px_#0a0a0a] mt-1 cursor-pointer relative"
                    onClick={handleProgressBarClick}
                  >
                    <div className="h-full bg-[#000080]" style={{ width: `${progress || 0}%` }} />
                  </div>
                </div>
                {/* Control Buttons */}
                <div className="w-full flex justify-center gap-2 mb-4 md:mb-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); previousTrack(musicFiles); }}
                    className="w-7 h-7 bg-[#c3c3c3] border-[1px] border-[#808080] rounded-none shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
                  >
                    <span className="text-[12px] leading-none flex items-center justify-center h-full">⏮</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="w-7 h-7 bg-[#c3c3c3] border-[1px] border-[#808080] rounded-none shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
                  >
                    <span className="text-[12px] leading-none flex items-center justify-center h-full">{isPlaying ? "⏸" : "▶"}</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextTrack(musicFiles); }}
                    className="w-7 h-7 bg-[#c3c3c3] border-[1px] border-[#808080] rounded-none shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
                  >
                    <span className="text-[12px] leading-none flex items-center justify-center h-full">⏭</span>
                  </button>
                </div>
              </div>

              {/* Right Panel - Track List */}
              <div className="flex-1 bg-white overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#c3c3c3] sticky top-0">
                      <th className="px-2 md:px-3 py-1 border-r border-[#808080] text-left w-8 hidden md:table-cell">#</th>
                      <th className="px-2 md:px-3 py-1 border-r border-[#808080] text-left">Title</th>
                      <th className="px-2 md:px-3 py-1 border-r border-[#808080] text-left hidden md:table-cell">Artist</th>
                      <th className="px-2 md:px-3 py-1 text-left w-16 md:w-20">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {musicFiles.map((song, index) => (
                      <tr 
                        key={song.id}
                        className={`hover:bg-[#000080] hover:text-white cursor-pointer text-black ${
                          currentSong?.id === song.id ? 'bg-[#000080] text-white' : ''
                        }`}
                        onClick={() => handleSongClick(song)}
                      >
                        <td className="px-2 md:px-3 py-2 border-r border-[#e0e0e0] text-center hidden md:table-cell">
                          {index + 1}
                        </td>
                        <td className="px-2 md:px-3 py-2 border-r border-[#e0e0e0] flex items-center gap-2">
                          {/* <img src="/music.png" alt="Music" className="w-4 h-4 object-contain" /> */}
                          <span className="truncate">{song.title}</span>
                        </td>
                        <td className="px-2 md:px-3 py-2 border-r border-[#e0e0e0] hidden md:table-cell">
                          {song.artist}
                        </td>
                        <td className="px-2 md:px-3 py-2 text-right">
                          {song.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Bar */}
            <div className="h-[24px] bg-[#c3c3c3] border-t-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] px-2 flex items-center justify-between text-xs md:text-sm">
              <span>{musicFiles.length} tracks</span>
              <span className="hidden md:inline">Total Duration: 24:05</span>
            </div>
          </div>
        );
      case 'wallpaper':
        return (
          <div className="p-4">
            <div className="text-base mb-4">Choose your wallpaper:</div>
            <div className="grid grid-cols-2 gap-4">
              {wallpapers.map((wallpaper) => (
                <div 
                  key={wallpaper.id}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setCurrentWallpaper(wallpaper.src)}
                >
                  <div 
                    className={`w-full h-32 border-2 ${
                      (currentWallpaper === wallpaper.src) 
                        ? 'border-[#000080]' 
                        : 'border-[#ffffff]'
                    } shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf]`}
                  >
                    {wallpaper.src ? (
                      <img 
                        src={wallpaper.src} 
                        alt={wallpaper.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#008080]" />
                    )}
                  </div>
                  <div className="text-sm mt-2">{wallpaper.name}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'shop':
        return (
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <img src="/icons/shop.png" alt="Shop" className="w-32 h-32 mb-4" />
            <div className="text-xl font-bold mb-2">Merch dropping soon</div>
            <div className="text-sm text-gray-600">Stay tuned for updates!</div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col h-full">
            {/* Profile Header */}
            <div className="h-[40px] bg-[#c3c3c3] border-b-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] flex items-center px-2">
              <span className="mr-2">User Profile</span>
            </div>

            {/* Profile Content */}
            <div className="flex-1 bg-white p-4 overflow-auto">
              <div className="flex flex-col items-center space-y-4">
                {/* Profile Picture */}
                <div className="w-32 h-32 border-2 border-[#c3c3c3] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] overflow-hidden">
                  <img 
                    src={user?.imageUrl || "/profile_photo1.png"}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="w-full space-y-4">
                  <div className="border border-[#c3c3c3] p-3 shadow-[inset_1px_1px_#0a0a0a]">
                    <h3 className="font-bold mb-2 text-[#000080]">User Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-bold">Phone:</span>
                        <span className="text-sm ml-2">{user?.primaryPhoneNumber?.phoneNumber || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold">Created:</span>
                        <span className="text-sm ml-2">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-bold">Last Sign In:</span>
                        <span className="text-sm ml-2">
                          {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="border border-[#c3c3c3] p-3 shadow-[inset_1px_1px_#0a0a0a]">
                    <h3 className="font-bold mb-2 text-[#000080]">Account Status</h3>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${user?.id ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm">{user?.id ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="h-[24px] bg-[#c3c3c3] border-t-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] px-2 flex items-center text-sm">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        );
      case 'video':
        return <RetroVideoPlayer videoData={window.videoData} />;
      case 'unreleased':
        return (
          <div className="flex flex-col h-full">
            {/* Address Bar */}
            <div className="h-[40px] bg-[#c3c3c3] border-b-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] flex items-center px-2">
              <span className="mr-2">Address:</span>
              <div className="flex-1 h-[32px] bg-white border border-[#808080] shadow-[inset_1px_1px_#0a0a0a] px-2 py-1">
                C:\UNRELEASED
              </div>
            </div>

            {/* Now Playing Bar (only shown when playing unreleased audio) */}
            {currentSong && currentSong.isUnreleased && (
              <div className="h-auto min-h-[60px] bg-[#c3c3c3] border-b-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] px-2 md:px-4 py-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-0">
                    <img src="/icons/music.png" alt="Music" className="w-5 h-5 md:w-6 md:h-6" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{currentSong.title}</div>
                      <div className="text-xs text-gray-600">Now Playing</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="min-w-[28px] min-h-[28px] w-7 h-7 bg-[#c3c3c3] border-[1px] border-[#808080] rounded-none shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
                    >
                      <span className="text-[12px] leading-none flex items-center justify-center h-full">
                        {isPlaying ? "⏸" : "▶"}
                      </span>
                    </button>
                    <div className="w-20 md:w-32 h-2 bg-white border border-[#808080] shadow-[inset_1px_1px_#0a0a0a] relative cursor-pointer" 
                      onClick={(e) => {
                        if (audioRef.current && currentSong) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const percentage = (clickX / rect.width) * 100;
                          updateProgress(percentage);
                        }
                      }}>
                      <div className="absolute inset-0 -top-3 -bottom-3" /> {/* Larger touch target */}
                      <div 
                        className="h-full bg-[#000080]" 
                        style={{ width: `${progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* File List */}
            <div className="flex-1 bg-white p-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#c3c3c3] text-left">
                    <th className="px-3 py-1 border-r border-[#808080]">Name</th>
                    <th className="px-3 py-1">Size</th>
                    <th className="px-3 py-1 border-r border-[#808080] hidden md:table-cell">Type</th>
                    <th className="px-3 py-1 hidden md:table-cell">Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {unreleasedFiles.map((file) => (
                    <tr 
                      key={file.id}
                      className={`hover:bg-[#000080] hover:text-white cursor-pointer text-black ${
                        currentSong && currentSong.isUnreleased && currentSong.title === file.name.replace('.mp3', '') 
                        ? 'bg-[#000080] text-white' : ''
                      }`}
                      onClick={() => handleUnreleasedItemClick(file)}
                    >
                      <td className="px-3 py-1 border-r border-[#e0e0e0] flex items-center gap-2">
                        <img 
                          src={file.icon}
                          alt={file.type}
                          className="w-4 h-4 object-contain"
                        />
                        <span className="truncate max-w-[180px] md:max-w-none">
                          {file.name}
                          {currentSong && currentSong.isUnreleased && currentSong.title === file.name.replace('.mp3', '') && isPlaying && (
                            <span className="text-xs ml-2">▶</span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-1">{file.size}</td>
                      <td className="px-3 py-1 border-r border-[#e0e0e0] hidden md:table-cell">
                        {file.type === 'encrypted_folder' ? 'File Folder (Encrypted)' : 
                         file.type === 'locked' ? 'File Folder (Locked)' : 
                         file.type === 'audio' ? 'Audio File' :
                         file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                      </td>
                      <td className="px-3 py-1 hidden md:table-cell">{file.modified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status Bar */}
            <div className="h-[24px] bg-[#c3c3c3] border-t-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] px-2 flex items-center justify-between text-xs md:text-sm">
              <span>{unreleasedFiles.length} object(s)</span>
              {currentSong && currentSong.isUnreleased && (
                <span className="truncate max-w-[120px] md:max-w-none">Playing: {currentSong.title}</span>
              )}
            </div>

            {/* Error Popup */}
            {showError && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] p-4 max-w-md">
                <div className="flex items-start gap-3">
                  <img src="/error.png" alt="Error" className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold mb-2">Error</h3>
                    <p>{errorMessage}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => setShowError(false)}
                    className="px-4 py-1 bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf]"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Empty Window</div>;
    }
  };

  // Handle file/folder click in unreleased section
  const handleUnreleasedItemClick = (item) => {
    if (item.type === 'locked') {
      setErrorMessage(item.error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } else if (item.type === 'encrypted_folder' && item.triggerVirus) {
      // Call the prop function to trigger virus animation
      handleUnreleasedFileClick();
      
      // Show the encrypted message after animation completes (about 6.5 seconds)
      setTimeout(() => {
        setShowEncryptedMessage(true);
        // Keep the message visible longer
        setTimeout(() => setShowEncryptedMessage(false), 10000);
      }, 6500);
    } else if (item.type === 'audio') {
      // Convert unreleased file to song format with the same structure as regular songs
      const song = {
        id: `unreleased-${item.id}`, // Ensure unique ID across all songs
        title: item.name.replace(/(-kopi\.wav|-kopi\.mp3|\.wav|\.mp3)$/i, ''), // Remove file extension for display
        artist: 'Kundo',
        duration: '3:30',
        url: `/music/${item.name}`, // Use the /music directory path
        isUnreleased: true, // Flag to identify it as unreleased
        noImage: true // Flag to indicate no cover image
      };
      
      // Use the shared playSong function from context for consistency
      playSong(song);
    }
  };

  return (
    <>
      {openWindows.map((window) => (
        <Window98
          key={window.id}
          title={window.title || getWindowTitle(window.type)}
          icon={window.icon || getWindowIcon(window.type)}
          onClose={() => closeWindow(window.id)}
          onClick={() => handleWindowClick(window.id)}
          isActive={activeWindowId === window.id}
          position={windowPositions[window.id]}
          onDrag={(position) => handleWindowDrag(window.id, position)}
          size={getWindowDimensions(window.type)}
        >
          {getWindowContent(window.type, window)}
        </Window98>
      ))}

      {/* Encrypted Folder Message */}
      {showEncryptedMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4">
              <img src="/warning.png" alt="Warning" className="w-12 h-12" />
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ FOLDER ENCRYPTED ⚠️</h2>
                <p className="mb-4 text-base">This folder's files have been hacked and encrypted.</p>
                <p className="mb-6 text-base">To listen to the songs, call this number:</p>
                <p className="text-xl font-mono font-bold text-center mb-6">+45 xx xx xx xx</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowEncryptedMessage(false)}
                className="px-6 py-2 bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WindowManager; 
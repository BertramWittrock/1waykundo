import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminContext = createContext(null);

// API base URL - change this to your production URL when deploying
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Default folder contents (fallback if API is unavailable)
const DEFAULT_FOLDER_CONTENTS = [
  {
    name: "BTS",
    type: "directory",
    children: [
      { name: "TIPSY.mov", type: "video", r2Key: "KundoContent/Content/BTS/TIPSY.mov" },
      { name: "bag_energien.mov", type: "video", r2Key: "KundoContent/Content/BTS/bag_energien.MOV" },
      { name: "l3-kopi.mov", type: "video", r2Key: "KundoContent/Content/BTS/l3-kopi.mov" },
      { name: "l33-kopi.mov", type: "video", r2Key: "KundoContent/Content/BTS/l33-kopi.mov" },
    ],
  },
  {
    name: "GRAPHICS",
    type: "directory",
    children: [
      { name: "popup.mp4", type: "video", r2Key: "KundoContent/graphics/230115_7100_MASTER_H265_1-kopi.MP4" },
      { name: "NorthFaceKundo.png", type: "image", r2Key: "KundoContent/graphics/Billede 2-13-25, 08.05.27.jpg" },
      { name: "AstridAndersen.png", type: "image", r2Key: "KundoContent/graphics/AstridAndersen.png" },
      { name: "Billede 2-13-25, 08.05.27 (2).jpg", type: "image", r2Key: "KundoContent/Content/GRAPHICS/Billede 2-13-25, 08.05.27 (2).jpg" },
      { name: "v2.png", type: "image", r2Key: "KundoContent/graphics/v2.mp4" },
    ],
  },
  {
    name: "KONCERTER",
    type: "directory",
    children: [
      { name: "Kundo - Event - Story Nyny.mp4", type: "video", r2Key: "KundoContent/Content/KONCERTER/Kundo - Event - Story Nyny.mp4" },
      { name: "VillagexKundo_2024_v2.mp4", type: "video", r2Key: "KundoContent/Content/KONCERTER/VillagexKundo_2024_v2.mp4" },
    ],
  },
  {
    name: "Unreleased",
    type: "directory",
    children: [
      { name: "Kundoi.FistOp.demo2-kopi.mp3", type: "audio", r2Key: "KundoContent/unreleased/Kundoi.FistOp.demo2-kopi.mp3" },
      { name: "Kundo - Fritfald.mp3", type: "audio", r2Key: "KundoContent/unreleased/Kundo - Fritfald.mp3" },
      { name: "vv minder mig om succes-kopi.wav", type: "audio", r2Key: "KundoContent/unreleased/vv minder mig om succes-kopi.wav" },
    ],
  },
];

// Default icon settings
const DEFAULT_ICON_SETTINGS = {
  ticketLink: "https://tix.to/Kundopresale",
  ticketImage: "/icons/home_icons/tickets.gif",
  ticketEnabled: true,
};

// Default music files (CD player songs)
const DEFAULT_MUSIC_FILES = [
  { id: 1, title: "1WAY (Intro)", artist: "Kundo", duration: "0:32", url: "/music/24/1WAY (Intro).mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 2, title: "Tomrum", artist: "Kundo", duration: "2:36", url: "/music/24/Tomrum.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 3, title: "24", artist: "Kundo", duration: "2:52", url: "/music/24/24.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 4, title: "Skandaløst", artist: "Kundo", duration: "2:37", url: "/music/24/Skandaløst.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 5, title: "Hvem Har Stedet", artist: "Kundo", duration: "3:15", url: "/music/24/Hvem Har Stedet - Kundo.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 6, title: "Gollum", artist: "Kundo", duration: "2:58", url: "/music/24/Gollum.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 7, title: "Kan Ik Mærke Mig Selv (Interlude)", artist: "Kundo", duration: "0:48", url: "/music/24/Kan Ik Mærke Mig Selv (Interlude).mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 8, title: "Hold Min Hånd", artist: "Kundo", duration: "3:22", url: "/music/24/Hold Min Hånd.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 9, title: "02:34", artist: "Kundo", duration: "2:58", url: "/music/24/02_34.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 10, title: "Decimaler", artist: "Kundo", duration: "2:31", url: "/music/24/Decimaler.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 11, title: "Nye Problemer", artist: "Kundo", duration: "3:02", url: "/music/24/Nye Problemer.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 12, title: "Går Den Så Går Den", artist: "Kundo", duration: "2:35", url: "/music/24/Går Den Så Går Den.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 13, title: "Keem", artist: "Kundo", duration: "3:15", url: "/music/24/Keem.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 14, title: "Alt Igen", artist: "Kundo", duration: "3:52", url: "/music/24/Alt Igen.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 15, title: "Op & Ned", artist: "Kundo", duration: "2:46", url: "/music/24/Op & Ned.mp3", coverR2Key: "KundoContent/24.jpg" },
];

// Token storage key
const TOKEN_STORAGE_KEY = 'admin_auth_token';

export const AdminProvider = ({ children }) => {
  const [folderContents, setFolderContents] = useState(DEFAULT_FOLDER_CONTENTS);
  const [iconSettings, setIconSettings] = useState(DEFAULT_ICON_SETTINGS);
  const [musicFiles, setMusicFiles] = useState(DEFAULT_MUSIC_FILES);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Helper function for API calls
  const apiCall = useCallback(async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return { success: true, data };
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      return { success: false, error: error.message };
    }
  }, [authToken]);

  // Load public config on mount
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        const result = await apiCall('/api/config');
        
        if (result.success) {
          setFolderContents(result.data.folderContents || DEFAULT_FOLDER_CONTENTS);
          setIconSettings(result.data.iconSettings || DEFAULT_ICON_SETTINGS);
          setMusicFiles(result.data.musicFiles || DEFAULT_MUSIC_FILES);
        } else {
          // API unavailable, use defaults
          console.warn('API unavailable, using default config');
          setApiError('Could not connect to server');
        }
      } catch (error) {
        console.error('Error loading config:', error);
        setApiError('Could not connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Check for existing auth token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setAuthToken(storedToken);
      // Verify token is still valid
      verifyToken(storedToken);
    }
  }, []);

  // Verify token with server
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAdminAuthenticated(true);
        setAuthToken(token);
      } else {
        // Token invalid, clear it
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthToken(null);
        setIsAdminAuthenticated(false);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // Keep token if server is unreachable (might just be offline)
    }
  };

  // Verify admin password and get token
  const verifyAdminPassword = async (password) => {
    const result = await apiCall('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (result.success && result.data.token) {
      const token = result.data.token;
      setAuthToken(token);
      setIsAdminAuthenticated(true);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      return true;
    }

    return false;
  };

  // Change admin password
  const changeAdminPassword = async (currentPassword, newPassword) => {
    const result = await apiCall('/api/admin/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (result.success) {
      return { success: true, message: 'Password changed successfully' };
    }

    return { success: false, message: result.error || 'Failed to change password' };
  };

  // Logout admin
  const logoutAdmin = async () => {
    if (authToken) {
      await apiCall('/api/admin/logout', { method: 'POST' });
    }
    
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setIsAdminAuthenticated(false);
  };

  // Save folder contents to server
  const saveFolderContents = async (newContents) => {
    // Optimistically update local state
    setFolderContents(newContents);

    const result = await apiCall('/api/admin/folders', {
      method: 'PUT',
      body: JSON.stringify({ folderContents: newContents }),
    });

    if (!result.success) {
      // Revert on failure
      console.error('Failed to save folder contents:', result.error);
      return false;
    }

    return true;
  };

  // Save icon settings to server
  const saveIconSettings = async (newSettings) => {
    // Optimistically update local state
    setIconSettings(newSettings);

    const result = await apiCall('/api/admin/icon-settings', {
      method: 'PUT',
      body: JSON.stringify({ iconSettings: newSettings }),
    });

    if (!result.success) {
      console.error('Failed to save icon settings:', result.error);
      return false;
    }

    return true;
  };

  // Save music files to server
  const saveMusicFiles = async (newMusicFiles) => {
    // Optimistically update local state
    setMusicFiles(newMusicFiles);

    const result = await apiCall('/api/admin/music-files', {
      method: 'PUT',
      body: JSON.stringify({ musicFiles: newMusicFiles }),
    });

    if (!result.success) {
      console.error('Failed to save music files:', result.error);
      return false;
    }

    return true;
  };

  // Add a new song
  const addSong = async (song) => {
    const newId = Math.max(...musicFiles.map(file => file.id), 0) + 1;
    const newSong = { ...song, id: newId };
    const newMusicFiles = [...musicFiles, newSong];
    return await saveMusicFiles(newMusicFiles);
  };

  // Update a song
  const updateSong = async (songId, updatedSong) => {
    const newMusicFiles = musicFiles.map(song => 
      song.id === songId ? { ...song, ...updatedSong } : song
    );
    return await saveMusicFiles(newMusicFiles);
  };

  // Remove a song
  const removeSong = async (songId) => {
    const newMusicFiles = musicFiles.filter(song => song.id !== songId);
    return await saveMusicFiles(newMusicFiles);
  };

  // Reorder songs
  const reorderSongs = async (newOrder) => {
    return await saveMusicFiles(newOrder);
  };

  // Add a new folder
  const addFolder = async (folderName) => {
    const newFolder = {
      name: folderName,
      type: "directory",
      children: [],
    };
    const newContents = [...folderContents, newFolder];
    return await saveFolderContents(newContents);
  };

  // Add a file to a folder
  const addFileToFolder = async (folderName, file) => {
    const newContents = folderContents.map(folder => {
      if (folder.name === folderName && folder.type === "directory") {
        return {
          ...folder,
          children: [...folder.children, file],
        };
      }
      return folder;
    });
    return await saveFolderContents(newContents);
  };

  // Remove a file from a folder
  const removeFileFromFolder = async (folderName, fileName) => {
    const newContents = folderContents.map(folder => {
      if (folder.name === folderName && folder.type === "directory") {
        return {
          ...folder,
          children: folder.children.filter(child => child.name !== fileName),
        };
      }
      return folder;
    });
    return await saveFolderContents(newContents);
  };

  // Remove a folder
  const removeFolder = async (folderName) => {
    const newContents = folderContents.filter(folder => folder.name !== folderName);
    return await saveFolderContents(newContents);
  };

  // Rename a folder
  const renameFolder = async (oldName, newName) => {
    const newContents = folderContents.map(folder => {
      if (folder.name === oldName) {
        return { ...folder, name: newName };
      }
      return folder;
    });
    return await saveFolderContents(newContents);
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    const result = await apiCall('/api/admin/reset', {
      method: 'POST',
    });

    if (result.success) {
      setFolderContents(result.data.folderContents);
      setIconSettings(result.data.iconSettings);
      setMusicFiles(result.data.musicFiles);
      return true;
    }

    return false;
  };

  // Refresh config from server
  const refreshConfig = async () => {
    const result = await apiCall('/api/config');
    
    if (result.success) {
      setFolderContents(result.data.folderContents || DEFAULT_FOLDER_CONTENTS);
      setIconSettings(result.data.iconSettings || DEFAULT_ICON_SETTINGS);
      setMusicFiles(result.data.musicFiles || DEFAULT_MUSIC_FILES);
      return true;
    }

    return false;
  };

  const value = {
    // State
    folderContents,
    iconSettings,
    musicFiles,
    isAdminAuthenticated,
    isLoading,
    apiError,
    
    // Actions
    saveFolderContents,
    saveIconSettings,
    saveMusicFiles,
    addSong,
    updateSong,
    removeSong,
    reorderSongs,
    verifyAdminPassword,
    changeAdminPassword,
    logoutAdmin,
    addFolder,
    addFileToFolder,
    removeFileFromFolder,
    removeFolder,
    renameFolder,
    resetToDefaults,
    refreshConfig,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;

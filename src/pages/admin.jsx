import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    folderContents,
    iconSettings,
    musicFiles,
    dvdVideos,
    isAdminAuthenticated,
    isLoading,
    apiError,
    verifyAdminPassword,
    changeAdminPassword,
    logoutAdmin,
    addFolder,
    addFileToFolder,
    removeFileFromFolder,
    removeFolder,
    saveIconSettings,
    addSong,
    removeSong,
    saveMusicFiles,
    saveDvdVideos,
    resetToDefaults,
    refreshConfig,
  } = useAdmin();

  // Local state
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("folders");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("video");
  const [newFileR2Key, setNewFileR2Key] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [ticketImage, setTicketImage] = useState("");
  const [ticketEnabled, setTicketEnabled] = useState(true);
  const [topIconLink, setTopIconLink] = useState("");

  // DVD Video form states
  const [newDvdTitle, setNewDvdTitle] = useState("");
  const [newDvdUrl, setNewDvdUrl] = useState("");

  // Song form states
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("Kundo");
  const [newSongDuration, setNewSongDuration] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");
  const [newSongCoverR2Key, setNewSongCoverR2Key] = useState("");
  const [editingSong, setEditingSong] = useState(null);

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Initialize icon settings
  useEffect(() => {
    if (iconSettings) {
      setTicketLink(iconSettings.ticketLink || "");
      setTicketImage(iconSettings.ticketImage || "");
      setTicketEnabled(iconSettings.ticketEnabled ?? true);
      setTopIconLink(iconSettings.topIconLink || "");
    }
  }, [iconSettings]);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle login
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const success = await verifyAdminPassword(password);
      if (success) {
        setPassword("");
      } else {
        setLoginError("Invalid password");
      }
    } catch (error) {
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/");
  };

  // Handle add folder
  const handleAddFolder = async (event) => {
    event.preventDefault();
    if (!newFolderName.trim()) {
      showNotification("Please enter a folder name", "error");
      return;
    }
    
    const exists = folderContents.some(folder => folder.name.toLowerCase() === newFolderName.toLowerCase());
    if (exists) {
      showNotification("A folder with this name already exists", "error");
      return;
    }
    
    setSaving(true);
    const success = await addFolder(newFolderName.trim());
    setSaving(false);

    if (success) {
      setNewFolderName("");
      showNotification(`Folder "${newFolderName}" created successfully`);
    } else {
      showNotification("Failed to create folder", "error");
    }
  };

  // Handle remove folder
  const handleRemoveFolder = async (folderName) => {
    if (window.confirm(`Are you sure you want to delete the folder "${folderName}" and all its contents?`)) {
      setSaving(true);
      const success = await removeFolder(folderName);
      setSaving(false);

      if (success) {
        if (selectedFolder === folderName) {
          setSelectedFolder(null);
        }
        showNotification(`Folder "${folderName}" deleted`);
      } else {
        showNotification("Failed to delete folder", "error");
      }
    }
  };

  // Handle add file
  const handleAddFile = async (event) => {
    event.preventDefault();
    if (!selectedFolder) {
      showNotification("Please select a folder first", "error");
      return;
    }
    if (!newFileName.trim() || !newFileR2Key.trim()) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    const newFile = {
      name: newFileName.trim(),
      type: newFileType,
      r2Key: newFileR2Key.trim(),
    };

    setSaving(true);
    const success = await addFileToFolder(selectedFolder, newFile);
    setSaving(false);

    if (success) {
      setNewFileName("");
      setNewFileR2Key("");
      showNotification(`File "${newFileName}" added to "${selectedFolder}"`);
    } else {
      showNotification("Failed to add file", "error");
    }
  };

  // Handle remove file
  const handleRemoveFile = async (folderName, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      setSaving(true);
      const success = await removeFileFromFolder(folderName, fileName);
      setSaving(false);

      if (success) {
        showNotification(`File "${fileName}" deleted`);
      } else {
        showNotification("Failed to delete file", "error");
      }
    }
  };

  // Handle save icon settings
  const handleSaveIconSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    
    const success = await saveIconSettings({
      ticketLink: ticketLink.trim(),
      ticketImage: ticketImage.trim(),
      ticketEnabled,
      topIconLink: topIconLink.trim(),
    });
    
    setSaving(false);

    if (success) {
      showNotification("Icon settings saved successfully");
    } else {
      showNotification("Failed to save settings", "error");
    }
  };

  // Handle password change
  const handlePasswordChange = async (event) => {
    event.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showNotification("New passwords don't match", "error");
      return;
    }
    
    if (newPassword.length < 6) {
      showNotification("Password must be at least 6 characters", "error");
      return;
    }

    setSaving(true);
    const result = await changeAdminPassword(currentPassword, newPassword);
    setSaving(false);

    if (result.success) {
      showNotification(result.message);
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      showNotification(result.message, "error");
    }
  };

  // Handle reset to defaults
  const handleResetToDefaults = async () => {
    if (window.confirm("Are you sure you want to reset all settings to defaults? This cannot be undone.")) {
      setSaving(true);
      const success = await resetToDefaults();
      setSaving(false);

      if (success) {
        setSelectedFolder(null);
        showNotification("Settings reset to defaults");
      } else {
        showNotification("Failed to reset settings", "error");
      }
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setSaving(true);
    const success = await refreshConfig();
    setSaving(false);

    if (success) {
      showNotification("Config refreshed from server");
    } else {
      showNotification("Failed to refresh config", "error");
    }
  };

  // Handle add song
  const handleAddSong = async (event) => {
    event.preventDefault();
    if (!newSongTitle.trim() || !newSongUrl.trim()) {
      showNotification("Please fill in title and URL", "error");
      return;
    }

    const newSong = {
      title: newSongTitle.trim(),
      artist: newSongArtist.trim() || "Kundo",
      duration: newSongDuration.trim() || "0:00",
      url: newSongUrl.trim(),
      coverR2Key: newSongCoverR2Key.trim() || "KundoContent/24.jpg",
    };

    setSaving(true);
    const success = await addSong(newSong);
    setSaving(false);

    if (success) {
      setNewSongTitle("");
      setNewSongArtist("Kundo");
      setNewSongDuration("");
      setNewSongUrl("");
      setNewSongCoverR2Key("");
      showNotification(`Song "${newSong.title}" added successfully`);
    } else {
      showNotification("Failed to add song", "error");
    }
  };

  // Handle remove song
  const handleRemoveSong = async (songId, songTitle) => {
    if (window.confirm(`Are you sure you want to delete "${songTitle}"?`)) {
      setSaving(true);
      const success = await removeSong(songId);
      setSaving(false);

      if (success) {
        showNotification(`Song "${songTitle}" deleted`);
      } else {
        showNotification("Failed to delete song", "error");
      }
    }
  };

  // Handle move song up/down
  const handleMoveSong = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= musicFiles.length) return;

    const newMusicFiles = [...musicFiles];
    const temp = newMusicFiles[index];
    newMusicFiles[index] = newMusicFiles[newIndex];
    newMusicFiles[newIndex] = temp;

    setSaving(true);
    const success = await saveMusicFiles(newMusicFiles);
    setSaving(false);

    if (!success) {
      showNotification("Failed to reorder songs", "error");
    }
  };

  // Handle add DVD video
  const handleAddDvdVideo = async (event) => {
    event.preventDefault();
    if (!newDvdTitle.trim() || !newDvdUrl.trim()) {
      showNotification("Please fill in title and R2 key", "error");
      return;
    }

    // Construct full URL from R2 key
    const r2Key = newDvdUrl.trim();
    const fullUrl = `https://kundo-1way.bertramvwsteam.workers.dev?fileKey=${r2Key}`;

    const newVideo = {
      title: newDvdTitle.trim(),
      url: fullUrl,
    };

    const newDvdVideos = [...(dvdVideos || []), newVideo];

    setSaving(true);
    const success = await saveDvdVideos(newDvdVideos);
    setSaving(false);

    if (success) {
      setNewDvdTitle("");
      setNewDvdUrl("");
      showNotification(`DVD Video "${newVideo.title}" added successfully`);
    } else {
      showNotification("Failed to add DVD video", "error");
    }
  };

  // Handle remove DVD video
  const handleRemoveDvdVideo = async (index, videoTitle) => {
    if (window.confirm(`Are you sure you want to delete "${videoTitle}"?`)) {
      const newDvdVideos = [...dvdVideos];
      newDvdVideos.splice(index, 1);

      setSaving(true);
      const success = await saveDvdVideos(newDvdVideos);
      setSaving(false);

      if (success) {
        showNotification(`DVD Video "${videoTitle}" deleted`);
      } else {
        showNotification("Failed to delete DVD video", "error");
      }
    }
  };

  // Handle move DVD video
  const handleMoveDvdVideo = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= dvdVideos.length) return;

    const newDvdVideos = [...dvdVideos];
    const temp = newDvdVideos[index];
    newDvdVideos[index] = newDvdVideos[newIndex];
    newDvdVideos[newIndex] = temp;

    setSaving(true);
    const success = await saveDvdVideos(newDvdVideos);
    setSaving(false);

    if (!success) {
      showNotification("Failed to reorder DVD videos", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-['Courier_Prime']">
        <div className="text-[#00ff00] text-xl">Loading...</div>
      </div>
    );
  }

  // Login screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-['Courier_Prime']">
        <div className="w-full max-w-md p-8 bg-black/80 border border-[#00ff00]/30 rounded-lg">
          <h1 className="text-2xl text-[#00ff00] font-bold text-center mb-8">
            ADMIN ACCESS
          </h1>

          {apiError && (
            <div className="text-yellow-500 text-sm text-center bg-yellow-500/10 py-2 rounded mb-4">
              ⚠️ {apiError} - Some features may be limited
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
                {loginError}
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-[#00ff00] text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/50 focus:border-[#00ff00] focus:outline-none rounded"
                placeholder="Enter admin password"
                autoFocus
                disabled={loginLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 text-[#00ff00] rounded transition-colors disabled:opacity-50"
            >
              {loginLoading ? "Logging in..." : "Access Dashboard"}
            </button>
          </form>
          
          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 py-2 text-[#00ff00]/50 hover:text-[#00ff00] transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-black font-['Courier_Prime'] text-[#00ff00]">
      {/* Saving overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-[#00ff00] text-xl">Saving...</div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg border ${
            notification.type === "error" 
              ? "bg-red-900/90 border-red-500 text-red-200" 
              : "bg-green-900/90 border-green-500 text-green-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#00ff00]/30 bg-black/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">ADMIN DASHBOARD</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="px-3 py-1 text-sm border border-[#00ff00]/30 hover:bg-[#00ff00]/10 rounded transition-colors"
              title="Refresh config from server"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-3 py-1 text-sm border border-[#00ff00]/30 hover:bg-[#00ff00]/10 rounded transition-colors"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 text-red-300 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* API Error Banner */}
        {apiError && (
          <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg text-yellow-300">
            ⚠️ Server connection issue: {apiError}. Changes may not persist.
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-[#00ff00]/30">
          <button
            onClick={() => setActiveTab("folders")}
            className={`px-6 py-3 transition-colors ${
              activeTab === "folders"
                ? "text-[#00ff00] border-b-2 border-[#00ff00]"
                : "text-[#00ff00]/50 hover:text-[#00ff00]"
            }`}
          >
            📁 Folder Contents
          </button>
          <button
            onClick={() => setActiveTab("music")}
            className={`px-6 py-3 transition-colors ${
              activeTab === "music"
                ? "text-[#00ff00] border-b-2 border-[#00ff00]"
                : "text-[#00ff00]/50 hover:text-[#00ff00]"
            }`}
          >
            💿 CD Songs
          </button>
          <button
            onClick={() => setActiveTab("dvd")}
            className={`px-6 py-3 transition-colors ${
              activeTab === "dvd"
                ? "text-[#00ff00] border-b-2 border-[#00ff00]"
                : "text-[#00ff00]/50 hover:text-[#00ff00]"
            }`}
          >
            📀 DVD Videos
          </button>
          <button
            onClick={() => setActiveTab("icon")}
            className={`px-6 py-3 transition-colors ${
              activeTab === "icon"
                ? "text-[#00ff00] border-b-2 border-[#00ff00]"
                : "text-[#00ff00]/50 hover:text-[#00ff00]"
            }`}
          >
            🎫 Ticket Icon Settings
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 transition-colors ${
              activeTab === "settings"
                ? "text-[#00ff00] border-b-2 border-[#00ff00]"
                : "text-[#00ff00]/50 hover:text-[#00ff00]"
            }`}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Folders Tab */}
        {activeTab === "folders" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Folders List */}
            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Folders</h2>
              
              {/* Add Folder Form */}
              <form onSubmit={handleAddFolder} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(event) => setNewFolderName(event.target.value)}
                  className="flex-1 px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                  placeholder="New folder name"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </form>

              {/* Folders */}
              <div className="space-y-2">
                {folderContents.map((folder) => (
                  <div
                    key={folder.name}
                    className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${
                      selectedFolder === folder.name
                        ? "border-[#00ff00] bg-[#00ff00]/10"
                        : "border-[#00ff00]/20 hover:border-[#00ff00]/50"
                    }`}
                    onClick={() => setSelectedFolder(folder.name)}
                  >
                    <div className="flex items-center gap-2">
                      <span>📁</span>
                      <span>{folder.name}</span>
                      <span className="text-[#00ff00]/50 text-sm">
                        ({folder.children?.length || 0} files)
                      </span>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveFolder(folder.name);
                      }}
                      className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Files in Selected Folder */}
            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">
                {selectedFolder ? `Files in "${selectedFolder}"` : "Select a folder"}
              </h2>

              {selectedFolder && (
                <>
                  {/* Add File Form */}
                  <form onSubmit={handleAddFile} className="space-y-3 mb-6 p-4 border border-[#00ff00]/20 rounded">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(event) => setNewFileName(event.target.value)}
                      className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                      placeholder="File name (e.g., video.mp4)"
                    />
                    <select
                      value={newFileType}
                      onChange={(event) => setNewFileType(event.target.value)}
                      className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] focus:outline-none rounded"
                    >
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                      <option value="audio">Audio</option>
                    </select>
                    <input
                      type="text"
                      value={newFileR2Key}
                      onChange={(event) => setNewFileR2Key(event.target.value)}
                      className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                      placeholder="R2 Key (e.g., KundoContent/videos/file.mp4)"
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-2 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-colors disabled:opacity-50"
                    >
                      Add File
                    </button>
                  </form>

                  {/* Files List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {folderContents
                      .find(folder => folder.name === selectedFolder)
                      ?.children?.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between p-3 border border-[#00ff00]/20 rounded"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span>
                                {file.type === "video" ? "🎬" : file.type === "image" ? "🖼️" : "🎵"}
                              </span>
                              <span className="truncate">{file.name}</span>
                            </div>
                            <div className="text-[#00ff00]/40 text-xs truncate mt-1">
                              {file.r2Key}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(selectedFolder, file.name)}
                            className="ml-2 px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    
                    {folderContents.find(folder => folder.name === selectedFolder)?.children?.length === 0 && (
                      <div className="text-[#00ff00]/50 text-center py-8">
                        No files in this folder
                      </div>
                    )}
                  </div>
                </>
              )}

              {!selectedFolder && (
                <div className="text-[#00ff00]/50 text-center py-8">
                  Select a folder from the left to manage its files
                </div>
              )}
            </div>
          </div>
        )}

        {/* CD Songs Tab */}
        {activeTab === "music" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Song Form */}
            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Add New Song</h2>
              
              <form onSubmit={handleAddSong} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Title *</label>
                  <input
                    type="text"
                    value={newSongTitle}
                    onChange={(event) => setNewSongTitle(event.target.value)}
                    className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                    placeholder="Song title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Artist</label>
                  <input
                    type="text"
                    value={newSongArtist}
                    onChange={(event) => setNewSongArtist(event.target.value)}
                    className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                    placeholder="Artist name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Duration</label>
                  <input
                    type="text"
                    value={newSongDuration}
                    onChange={(event) => setNewSongDuration(event.target.value)}
                    className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                    placeholder="e.g., 3:45"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">URL / File Path *</label>
                  <input
                    type="text"
                    value={newSongUrl}
                    onChange={(event) => setNewSongUrl(event.target.value)}
                    className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                    placeholder="/music/24/song.mp3"
                  />
                  <p className="text-[#00ff00]/40 text-xs mt-1">
                    Path relative to public folder, or full URL
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Cover Image R2 Key</label>
                  <input
                    type="text"
                    value={newSongCoverR2Key}
                    onChange={(event) => setNewSongCoverR2Key(event.target.value)}
                    className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                    placeholder="KundoContent/24.jpg"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-colors disabled:opacity-50"
                >
                  Add Song
                </button>
              </form>
            </div>

            {/* Songs List */}
            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">
                Current Songs ({musicFiles?.length || 0})
              </h2>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {musicFiles?.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-3 border border-[#00ff00]/20 rounded hover:border-[#00ff00]/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[#00ff00]/50 text-sm w-6">{index + 1}.</span>
                        <span className="font-medium truncate">{song.title}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[#00ff00]/50 text-xs mt-1 ml-8">
                        <span>{song.artist}</span>
                        <span>{song.duration}</span>
                      </div>
                      <div className="text-[#00ff00]/30 text-xs truncate mt-1 ml-8">
                        {song.url}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveSong(index, "up")}
                        disabled={index === 0 || saving}
                        className="px-2 py-1 text-[#00ff00]/50 hover:text-[#00ff00] hover:bg-[#00ff00]/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ↑
                      </button>
                      
                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveSong(index, "down")}
                        disabled={index === musicFiles.length - 1 || saving}
                        className="px-2 py-1 text-[#00ff00]/50 hover:text-[#00ff00] hover:bg-[#00ff00]/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ↓
                      </button>
                      
                      {/* Delete */}
                      <button
                        onClick={() => handleRemoveSong(song.id, song.title)}
                        disabled={saving}
                        className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!musicFiles || musicFiles.length === 0) && (
                  <div className="text-[#00ff00]/50 text-center py-8">
                    No songs added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DVD Videos Tab */}
        {activeTab === "dvd" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add DVD Video Form */}
            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Add New DVD Video</h2>
              
              <form onSubmit={handleAddDvdVideo} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Title *</label>
                  <input
                    type="text"
                    value={newDvdTitle}
                    onChange={(event) => setNewDvdTitle(event.target.value)}
                    className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                    placeholder="Video title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Video R2 Key *</label>
                  <input
                    type="text"
                    value={newDvdUrl}
                    onChange={(event) => setNewDvdUrl(event.target.value)}
                    className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                    placeholder="e.g., KundoContent/dvd/video.mp4"
                  />
                  <p className="text-[#00ff00]/40 text-xs mt-1">
                    Enter the R2 key (path) for the video file
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-colors disabled:opacity-50"
                >
                  Add Video
                </button>
              </form>
            </div>

            {/* DVD Videos List */}
            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">
                Current DVD Videos ({dvdVideos?.length || 0})
              </h2>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {dvdVideos?.map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-[#00ff00]/20 rounded hover:border-[#00ff00]/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[#00ff00]/50 text-sm w-6">{index + 1}.</span>
                        <span className="font-medium truncate">{video.title}</span>
                      </div>
                      <div className="text-[#00ff00]/30 text-xs truncate mt-1 ml-8">
                        {video.url}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      {/* Move Up */}
                      <button
                        onClick={() => handleMoveDvdVideo(index, "up")}
                        disabled={index === 0 || saving}
                        className="px-2 py-1 text-[#00ff00]/50 hover:text-[#00ff00] hover:bg-[#00ff00]/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ↑
                      </button>
                      
                      {/* Move Down */}
                      <button
                        onClick={() => handleMoveDvdVideo(index, "down")}
                        disabled={index === (dvdVideos?.length || 0) - 1 || saving}
                        className="px-2 py-1 text-[#00ff00]/50 hover:text-[#00ff00] hover:bg-[#00ff00]/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ↓
                      </button>
                      
                      {/* Delete */}
                      <button
                        onClick={() => handleRemoveDvdVideo(index, video.title)}
                        disabled={saving}
                        className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!dvdVideos || dvdVideos.length === 0) && (
                  <div className="text-[#00ff00]/50 text-center py-8">
                    No videos added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Icon Settings Tab */}
        {activeTab === "icon" && (
          <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6 max-w-2xl">
            <h2 className="text-lg font-bold mb-4">Ticket Icon & Top Link Settings</h2>
            
            <form onSubmit={handleSaveIconSettings} className="space-y-6">
              {/* Top Middle Icon Link */}
              <div className="p-4 border border-[#00ff00]/20 rounded bg-[#00ff00]/5">
                <h3 className="text-[#00ff00] font-bold mb-3">Top Middle Icon (1WAY)</h3>
                <div>
                  <label className="block text-sm mb-1">External Link</label>
                  <input
                    type="text"
                    value={topIconLink}
                    onChange={(event) => setTopIconLink(event.target.value)}
                    className="w-full px-3 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                    placeholder="https://example.com (Leave empty for no link)"
                  />
                  <p className="text-[#00ff00]/40 text-xs mt-1">
                    When set, clicking the "1WAY" icon will open this link in a new tab.
                  </p>
                </div>
              </div>

              {/* Ticket Settings */}
              <div className="p-4 border border-[#00ff00]/20 rounded">
                <h3 className="text-[#00ff00] font-bold mb-3">Ticket Popup / Icon</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ticketEnabled}
                        onChange={(event) => setTicketEnabled(event.target.checked)}
                        className="w-4 h-4 accent-[#00ff00] bg-black border-gray-300 rounded focus:ring-[#00ff00]"
                      />
                      <span className="text-sm">Enable Automated Ticket Popup</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Ticket Link URL</label>
                    <input
                      type="url"
                      value={ticketLink}
                      onChange={(event) => setTicketLink(event.target.value)}
                      className="w-full px-4 py-3 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                      placeholder="https://example.com/tickets"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Ticket Image Path</label>
                    <input
                      type="text"
                      value={ticketImage}
                      onChange={(event) => setTicketImage(event.target.value)}
                      className="w-full px-4 py-3 bg-black border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30 focus:outline-none rounded"
                      placeholder="/icons/home_icons/tickets.gif"
                    />
                  </div>

                  {/* Preview */}
                  <div className="p-4 border border-[#00ff00]/20 rounded">
                    <h3 className="text-sm font-bold mb-3">Preview</h3>
                    <div className="flex items-center gap-4">
                      {ticketImage && (
                        <img 
                          src={ticketImage} 
                          alt="Ticket preview" 
                          className="h-16 w-auto object-contain"
                          onError={(event) => {
                            event.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="text-sm">
                        <div>Status: {ticketEnabled ? "✓ Enabled" : "✗ Disabled"}</div>
                        <div className="text-[#00ff00]/60 truncate max-w-md">
                          Link: {ticketLink || "(not set)"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Server Info</h2>
              <div className="text-sm text-[#00ff00]/70 space-y-2">
                <div>API URL: <code className="text-[#00ff00]">{import.meta.env.VITE_API_URL || 'http://localhost:3001'}</code></div>
                <div>Status: {apiError ? <span className="text-yellow-400">⚠️ Connection issues</span> : <span className="text-green-400">✓ Connected</span>}</div>
              </div>
            </div>

            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Data Management</h2>
              <p className="text-[#00ff00]/60 text-sm mb-6">
                Reset all folder contents and icon settings to their default values.
              </p>
              <button
                onClick={handleResetToDefaults}
                disabled={saving}
                className="px-6 py-3 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 text-red-300 rounded transition-colors disabled:opacity-50"
              >
                Reset to Defaults
              </button>
            </div>

            <div className="bg-black/50 border border-[#00ff00]/30 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Current Configuration</h2>
              <div className="bg-black border border-[#00ff00]/20 rounded p-4 max-h-96 overflow-auto">
                <pre className="text-xs text-[#00ff00]/70 whitespace-pre-wrap">
                  {JSON.stringify({ folderContents, iconSettings }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-[#00ff00]/30 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-6">Change Password</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] focus:outline-none rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] focus:outline-none rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#00ff00]/30 text-[#00ff00] focus:outline-none rounded"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="flex-1 py-2 border border-[#00ff00]/30 hover:bg-[#00ff00]/10 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 rounded transition-colors disabled:opacity-50"
                >
                  {saving ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

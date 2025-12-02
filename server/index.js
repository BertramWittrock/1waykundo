import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'config.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default configuration
const DEFAULT_CONFIG = {
  folderContents: [
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
  ],
  iconSettings: {
    ticketLink: "https://tix.to/Kundopresale",
    ticketImage: "/icons/home_icons/tickets.gif",
    ticketEnabled: true,
  },
  musicFiles: [
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
  ],
  adminPasswordHash: null, // Will be set on first run
};

// Hash password using SHA-256
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Load config from file
const loadConfig = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  
  // Initialize with default config and default password
  const initialConfig = {
    ...DEFAULT_CONFIG,
    adminPasswordHash: hashPassword('kundo2024'), // Default password
  };
  saveConfig(initialConfig);
  return initialConfig;
};

// Save config to file
const saveConfig = (config) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
};

// Simple token storage (in production, use JWT or sessions)
const validTokens = new Map();

// Generate a simple auth token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Auth middleware
const authMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!validTokens.has(token)) {
    return response.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // Check token expiration (24 hours)
  const tokenData = validTokens.get(token);
  if (Date.now() - tokenData.createdAt > 24 * 60 * 60 * 1000) {
    validTokens.delete(token);
    return response.status(401).json({ error: 'Token expired' });
  }
  
  next();
};

// ============ PUBLIC ROUTES ============

// Get public config (folder contents, icon settings, and music files)
app.get('/api/config', (request, response) => {
  const config = loadConfig();
  response.json({
    folderContents: config.folderContents,
    iconSettings: config.iconSettings,
    musicFiles: config.musicFiles,
  });
});

// ============ AUTH ROUTES ============

// Admin login
app.post('/api/admin/login', (request, response) => {
  const { password } = request.body;
  
  if (!password) {
    return response.status(400).json({ error: 'Password is required' });
  }
  
  const config = loadConfig();
  const passwordHash = hashPassword(password);
  
  if (passwordHash !== config.adminPasswordHash) {
    return response.status(401).json({ error: 'Invalid password' });
  }
  
  // Generate token
  const token = generateToken();
  validTokens.set(token, { createdAt: Date.now() });
  
  response.json({ token, message: 'Login successful' });
});

// Admin logout
app.post('/api/admin/logout', authMiddleware, (request, response) => {
  const token = request.headers.authorization.split(' ')[1];
  validTokens.delete(token);
  response.json({ message: 'Logged out successfully' });
});

// Verify token is still valid
app.get('/api/admin/verify', authMiddleware, (request, response) => {
  response.json({ valid: true });
});

// ============ PROTECTED ADMIN ROUTES ============

// Get full config (including that it's authenticated)
app.get('/api/admin/config', authMiddleware, (request, response) => {
  const config = loadConfig();
  response.json({
    folderContents: config.folderContents,
    iconSettings: config.iconSettings,
    musicFiles: config.musicFiles,
  });
});

// Update folder contents
app.put('/api/admin/folders', authMiddleware, (request, response) => {
  const { folderContents } = request.body;
  
  if (!folderContents || !Array.isArray(folderContents)) {
    return response.status(400).json({ error: 'Invalid folder contents' });
  }
  
  const config = loadConfig();
  config.folderContents = folderContents;
  
  if (saveConfig(config)) {
    response.json({ message: 'Folder contents updated', folderContents });
  } else {
    response.status(500).json({ error: 'Failed to save config' });
  }
});

// Update icon settings
app.put('/api/admin/icon-settings', authMiddleware, (request, response) => {
  const { iconSettings } = request.body;
  
  if (!iconSettings) {
    return response.status(400).json({ error: 'Invalid icon settings' });
  }
  
  const config = loadConfig();
  config.iconSettings = { ...config.iconSettings, ...iconSettings };
  
  if (saveConfig(config)) {
    response.json({ message: 'Icon settings updated', iconSettings: config.iconSettings });
  } else {
    response.status(500).json({ error: 'Failed to save config' });
  }
});

// Update music files (CD player songs)
app.put('/api/admin/music-files', authMiddleware, (request, response) => {
  const { musicFiles } = request.body;
  
  if (!musicFiles || !Array.isArray(musicFiles)) {
    return response.status(400).json({ error: 'Invalid music files' });
  }
  
  const config = loadConfig();
  config.musicFiles = musicFiles;
  
  if (saveConfig(config)) {
    response.json({ message: 'Music files updated', musicFiles });
  } else {
    response.status(500).json({ error: 'Failed to save config' });
  }
});

// Change admin password
app.put('/api/admin/password', authMiddleware, (request, response) => {
  const { currentPassword, newPassword } = request.body;
  
  if (!currentPassword || !newPassword) {
    return response.status(400).json({ error: 'Both current and new password are required' });
  }
  
  if (newPassword.length < 6) {
    return response.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  
  const config = loadConfig();
  const currentHash = hashPassword(currentPassword);
  
  if (currentHash !== config.adminPasswordHash) {
    return response.status(401).json({ error: 'Current password is incorrect' });
  }
  
  config.adminPasswordHash = hashPassword(newPassword);
  
  if (saveConfig(config)) {
    response.json({ message: 'Password changed successfully' });
  } else {
    response.status(500).json({ error: 'Failed to save config' });
  }
});

// Reset to defaults
app.post('/api/admin/reset', authMiddleware, (request, response) => {
  const config = loadConfig();
  const resetConfig = {
    ...DEFAULT_CONFIG,
    adminPasswordHash: config.adminPasswordHash, // Keep current password
  };
  
  if (saveConfig(resetConfig)) {
    response.json({ 
      message: 'Config reset to defaults',
      folderContents: resetConfig.folderContents,
      iconSettings: resetConfig.iconSettings,
      musicFiles: resetConfig.musicFiles,
    });
  } else {
    response.status(500).json({ error: 'Failed to reset config' });
  }
});

// Health check
app.get('/api/health', (request, response) => {
  response.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Admin API server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Public config: http://localhost:${PORT}/api/config`);
});


// Music data
export const musicFiles = [
  { id: 1, title: "1WAY (Intro)", artist: "Kundo", duration: "0:32", url: "/music/24/1WAY (Intro).mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 2, title: "Tomrum", artist: "Kundo", duration: "2:36", url: "/music/24/Tomrum.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 3, title: "24", artist: "Kundo", duration: "2:52", url: "/music/24/24.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 4, title: "Skandaløst", artist: "Kundo", duration: "2:37", url: "/music/24/Skandaløst.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 5, title: "Hvem Har Stedet", artist: "Kundo", duration: "3:15", url: "/music/24/Hvem Har Stedet - Kundo.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 8, title: "Gollum", artist: "Kundo", duration: "2:58", url: "/music/24/Gollum.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 12, title: "Kan Ik Mærke Mig Selv (Interlude)", artist: "Kundo", duration: "0:48", url: "/music/24/Kan Ik Mærke Mig Selv (Interlude).mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 10, title: "Hold Min Hånd", artist: "Kundo", duration: "3:22", url: "/music/24/Hold Min Hånd.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 11, title: "02:34", artist: "Kundo", duration: "2:58", url: "/music/24/02_34.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 7, title: "Decimaler", artist: "Kundo", duration: "2:31", url: "/music/24/Decimaler.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 14, title: "Nye Problemer", artist: "Kundo", duration: "3:02", url: "/music/24/Nye Problemer.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 9, title: "Går Den Så Går Den", artist: "Kundo", duration: "2:35", url: "/music/24/Går Den Så Går Den.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 13, title: "Keem", artist: "Kundo", duration: "3:15", url: "/music/24/Keem.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 6, title: "Alt Igen", artist: "Kundo", duration: "3:52", url: "/music/24/Alt Igen.mp3", coverR2Key: "KundoContent/24.jpg" },
  { id: 15, title: "Op & Ned", artist: "Kundo", duration: "2:46", url: "/music/24/Op & Ned.mp3", coverR2Key: "KundoContent/24.jpg" },
];

// Base URL for R2 public bucket
export const R2_BASE_URL = 'YOUR_R2_PUBLIC_URL'; // Replace with your actual R2 public URL

// Video data with folder structure
export const contentFiles = {
  name: 'Content',
  type: 'root',
  children: [
    {
      name: 'Music Videos',
      type: 'folder',
      children: [
        { id: 1, name: "KUNDO FINAL H264 UHD", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/music_videos/KUNDO_FINAL_H264_UHD-kopi.mov` },
        { id: 2, name: "Kundo Frihed", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/music_videos/230404_Kundo_Frihed.mov` },
        { id: 3, name: "KUNDO NNV FINAL", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/music_videos/KUNDO NNV FINAL VIDEO MASTER.mov` },
        { id: 4, name: "MIN 1 MIN PROMO", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/music_videos/KUNDO_MIN_1_MIN_PROMO 2.mp4` },
        { id: 5, name: "Frihed Feed Post", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/music_videos/Frihed Feed Post.mp4` },
        { id: 6, name: "FLOW MASTER", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/music_videos/220512_FLOW_MASTER_16-9.mp4` },
        { id: 7, name: "KARMAHJUL LIVESESSION", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/music_videos/KUNDO_KARMAHJUL_LIVESESSION_01.mp4` }
      ]
    },
    {
      name: 'Concerts',
      type: 'folder',
      children: [
        { id: 8, name: "Village x Kundo 2024", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/koncerter/VillagexKundo_2024_v2.mp4` },
        { id: 9, name: "ROSKILDE KUNDO", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/koncerter/ROSKILDE_KUNDO.mp4` },
        { id: 10, name: "LiveCamp Kundo", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/koncerter/LiveCamp 0801 - 06 Kundo.mp4` },
        { id: 11, name: "IDEAL BAR", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/koncerter/IDEAL BAR.MP4` },
        { id: 12, name: "Event Story Nyny", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/koncerter/Kundo - Event - Story Nyny.mp4` }
      ]
    },
    {
      name: 'Graphics',
      type: 'folder',
      children: [
        { id: 13, name: "Kundo hovede", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/Kundo hovede.png` },
        { id: 14, name: "Ice", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/ice.png` },
        { id: 15, name: "North Face 2", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/northface2.jpg` },
        { id: 16, name: "Barendrøm", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/barendrøm.jpg` },
        { id: 17, name: "AA Kundo 2", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/AAKundo2.png` },
        { id: 18, name: "Photos", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/Photos.jpg` },
        { id: 19, name: "AA Kundo 1", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/AAKundo1.png` },
        { id: 20, name: "North Face", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/northface.jpg` },
        { id: 21, name: "Glow", type: 'image', date: "2024-04-06", url: `${R2_BASE_URL}/graphics/glow.jpg` }
      ]
    },
    {
      name: 'Behind The Scenes',
      type: 'folder',
      children: [
        { id: 22, name: "TIPSY", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/bts/TIPSY.mov` },
        { id: 23, name: "L33", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/bts/l33-kopi.mov` },
        { id: 24, name: "L3", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/bts/l3-kopi.mov` },
        { id: 25, name: "Bag Energien", type: 'video', date: "2024-04-06", url: `${R2_BASE_URL}/bts/bag_energien.MOV` }
      ]
    }
  ]
};

// Unreleased files data
export const unreleasedFiles = [
  { id: 1, name: 'detroit v2-kopi.wav', type: 'audio', size: '4.2 MB', modified: '2024-03-15', icon: '/icons/music.png' },
  { id: 2, name: 'vers til fortvilse-kopi.wav', type: 'audio', size: '3.8 MB', modified: '2024-03-14', icon: '/icons/music.png' },
  { id: 3, name: 'vv minder mig om succes-kopi.wav', type: 'audio', size: '4.1 MB', modified: '2024-03-13', icon: '/icons/music.png' },
  { id: 4, name: 'album_cover', type: 'locked', size: '15.4 MB', modified: '2024-03-12', icon: '/icons/folder.png', error: 'Access Denied: This file is encrypted and cannot be accessed.' },
  { id: 5, name: 'FULL_ALBUM', type: 'encrypted_folder', size: '156.8 MB', modified: '2024-03-11', icon: '/icons/folder.png', triggerVirus: true }
];

// Deleted content
export const deletedContent = [
  { id: 1, name: 'scrapped_album_2023.zip', type: 'archive', size: '156.4 MB', deleted: '2023-12-15', recoverable: false },
  { id: 2, name: 'old_beats', type: 'folder', size: '89.2 MB', deleted: '2023-11-20', recoverable: true },
  { id: 3, name: 'first_draft_mv.mp4', type: 'video', size: '234.8 MB', deleted: '2023-10-05', recoverable: false },
  { id: 4, name: 'unused_vocals.wav', type: 'audio', size: '45.6 MB', deleted: '2024-01-30', recoverable: true },
  { id: 5, name: 'alternative_artwork', type: 'folder', size: '128.3 MB', deleted: '2024-02-15', recoverable: true },
  { id: 6, name: 'experimental_track.mp3', type: 'audio', size: '8.2 MB', deleted: '2024-03-01', recoverable: true },
  { id: 7, name: 'collab_project_cancelled.zip', type: 'archive', size: '345.1 MB', deleted: '2023-09-15', recoverable: false },
];

// Wallpaper options
export const wallpapers = [
  { id: 1, name: 'Vibes', src: '/wallpaper1.png' },
  { id: 2, name: 'Roskilde', src: '/wallpaper2.png' },
  { id: 3, name: '7100', src: '/wallpaper4.png' },
  { id: 4, name: 'Classic Teal', src: null },
];

// Popup content for virus effect
export const fakePopupContent = [
  { title: "WARNING!", content: "Your computer has a virus!", type: "error" },
  { title: "System Alert", content: "Memory corruption detected!", type: "warning" },
  { title: "Critical Error", content: "Hard drive failure imminent!", type: "error" },
  { title: "Security Alert", content: "Firewall breach detected!", type: "warning" },
  { title: "System Message", content: "RAM overload! System unstable!", type: "error" },
  { title: "Network Alert", content: "Unauthorized access detected!", type: "warning" },
];

// Font face style
export const fontFaceStyle = `
  @font-face {
    font-family: 'PixelTimesNewRoman';
    src: url('/PixelTimesNewRoman.ttf') format('truetype');
  }
`;

// Helper functions
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getCoverImage = (songUrl, song) => {
  // If the song has the noImage flag or there's no URL, return default
  if (!songUrl || (song && song.noImage)) return '/album_cover.png';

  // If it's an unreleased song (based on file path or extension)
  if (songUrl.includes('-kopi.wav') || songUrl.includes('v2-kopi.wav')) {
    return '/album_cover.png';
  }

  // Parse the song title from the URL
  const songName = songUrl.split('/').pop().split(' - ')[0].toLowerCase();

  // Map song names to corresponding image files
  const imageMap = {
    'signaler': '/music/signaler.jpeg',
    'hvem har stedet': '/music/hvemharstedet.jpeg',
    'energien': '/music/energien.jpeg',
    'småting': '/music/småting.jpeg',
    'noget si\'r mig': '/music/nogetsirmig.jpeg',
    'brutalt': '/music/brutalt.jpeg',
    'north face': '/music/northface.jpeg',
    'bellingham freestyle': '/music/bellingham.jpeg',
    '7100': '/music/7100.jpg',
    'min': '/music/min.jpg'
  };

  // Return the matching image or default
  return imageMap[songName] || '/album_cover.png';
}; 
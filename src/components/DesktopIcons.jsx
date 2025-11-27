import React from 'react';

const DesktopIcons = ({ openWindow }) => {
  return (
    <div className="p-4 grid pl-8 grid-cols-2 sm:grid-cols-3 md:flex gap-4 md:gap-8">
      {/* First Group */}
      <div className="flex flex-col gap-8">
        {/* Trash Icon */}
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => openWindow('trash')}>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/trash.png" alt="Trash" className="max-w-full max-h-full object-contain w-12" />
          </div>
          <span className="text-white text-center text-sm mt-2 px-1 group-hover:bg-[#000080] group-hover:text-white">
            Recycle Bin
          </span>
        </div>

 {/* Game Icon */}
 <div className="flex flex-col items-center group cursor-pointer" onClick={() => openWindow('game')}>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/icons/pingpong.png" alt="Ping Pong" className="max-w-full max-h-full object-contain w-12" />
          </div>
          <span className="text-white text-center text-sm mt-2 px-1 group-hover:bg-[#000080] group-hover:text-white">
            Ping Pong
          </span>
        </div>
       
        {/* My Computer Icon */}
        {/*} <div className="flex flex-col items-center group cursor-pointer" onClick={() => openWindow('computer')}>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/computer.png" alt="My Computer" className="max-w-full max-h-full object-contain w-12" />
          </div>
          <span className="text-white text-center text-sm mt-2 px-1 group-hover:bg-[#000080] group-hover:text-white">
            My Computer
          </span>
        </div> */}

        {/* Music Icon */}
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => openWindow('music')}>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/icons/music.png" alt="1 Way" className="max-w-full max-h-full object-contain w-12" />
          </div>
          <span className="text-white text-center text-sm mt-2 px-1 group-hover:bg-[#000080] group-hover:text-white">
            My Music
          </span>
        </div>
      </div>

      {/* Second Group */}
      <div className="flex flex-col gap-8">


        {/* UNRELEASED Icon */}
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => openWindow('unreleased')}>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/icons/folder.png" alt="UNRELEASED" className="max-w-full max-h-full object-contain w-12" />
          </div>
          <span className="text-white text-center text-sm mt-2 px-1 group-hover:bg-[#000080] group-hover:text-white">
            UNRELEASED
          </span>
        </div>

         {/* Content Icon */}
         <div className="flex flex-col items-center group cursor-pointer" onClick={() => openWindow('content')}>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/icons/video.png" alt="1 Way" className="max-w-full max-h-full object-contain w-12" />
          </div>
          <span className="text-white text-center text-sm mt-2 px-1 group-hover:bg-[#000080] group-hover:text-white">
            Content
          </span>
        </div>

       
      </div>

      {/* Commented out third group
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center group cursor-pointer" onClick={() => openWindow('wallpaper')}>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/icons/wallpaper.jpg" alt="Wallpaper" className="max-w-full max-h-full object-contain w-12" />
          </div>
          <span className="text-white text-center text-sm mt-2 px-1 group-hover:bg-[#000080]">
            Wallpaper
          </span>
        </div>

        <div className="flex flex-col items-center group cursor-pointer" onClick={() => openWindow('shop')}>
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/icons/shop.png" alt="Shop" className="max-w-full max-h-full object-contain w-12" />
          </div>
          <span className="text-white text-center text-sm mt-2 px-1 group-hover:bg-[#000080]">
            Shop
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default DesktopIcons; 
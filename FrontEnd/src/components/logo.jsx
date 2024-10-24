import React from "react";

const logo = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-16 h-16 mr-3">
        <svg
          className="w-full h-full text-indigo-700"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21.17 2.06L12.71 6.79C12.26 7.04 11.75 7.04 11.3 6.79L2.83 2.06C2.32 1.77 1.69 1.77 1.18 2.06C0.67 2.35 0.34 2.88 0.34 3.45V17.45C0.34 18.37 0.94 19.18 1.83 19.45L11.3 23.39C11.75 23.64 12.26 23.64 12.71 23.39L22.18 19.45C23.07 19.18 23.67 18.37 23.67 17.45V3.45C23.67 2.88 23.34 2.35 22.83 2.06C22.32 1.77 21.68 1.77 21.17 2.06Z" />
        </svg>
        <svg
          className="absolute bottom-0 right-0 w-8 h-8 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12,8C12.55,8 13,8.45 13,9C13,9.55 12.55,10 12,10C11.45,10 11,9.55 11,9C11,8.45 11.45,8 12,8M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M12,4C7.58,4 4,7.58 4,12C4,16.42 7.58,20 12,20C16.42,20 20,16.42 20,12C20,7.58 16.42,4 12,4M17,12C17,14.76 14.76,17 12,17C9.24,17 7,14.76 7,12C7,9.24 9.24,7 12,7C14.76,7 17,9.24 17,12Z" />
        </svg>
      </div>
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-gray-800">Lingo</span>
          <span className="text-indigo-700">Leap</span>
        </h1>
        <p className="text-sm text-gray-600 italic">
          Challenge Yourself, Ace the Tests
        </p>
      </div>
    </div>
  );
};

export default logo;

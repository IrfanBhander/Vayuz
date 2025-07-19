import React from 'react';

interface CloudyIconProps {
  size?: number;
  className?: string;
}

const CloudyIcon: React.FC<CloudyIconProps> = ({ size = 56, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main cloud */}
      <path
        d="M25 65C15 65 7 57 7 47C7 37 15 29 25 29C27 19 36 11 47 11C58 11 67 19 69 29C79 29 87 37 87 47C87 57 79 65 69 65H25Z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Secondary cloud */}
      <path
        d="M35 75C27 75 21 69 21 61C21 53 27 47 35 47C36 39 43 33 51 33C59 33 66 39 67 47C73 47 78 52 78 58C78 64 73 69 67 69H35C35 71 35 73 35 75Z"
        fill="currentColor"
        opacity="0.7"
      />
      
      {/* Small accent cloud */}
      <path
        d="M60 80C55 80 51 76 51 71C51 66 55 62 60 62C61 57 65 53 70 53C75 53 79 57 80 62C84 62 87 65 87 69C87 73 84 76 80 76H60C60 77 60 78 60 80Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
};

export default CloudyIcon;
import React from 'react';

interface NovaHestiaLogoProps {
  className?: string;
  color?: string;
}

const NovaHestiaLogo: React.FC<NovaHestiaLogoProps> = ({ 
  className = "h-8 w-8", 
  color = "currentColor" 
}) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 831 892" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nova Hestia Logo"
    >
      <path 
        d="m772.71,374.03v-27.1L418.71,73.93,60.71,348.19v18.74l87-1,266-204,218,171h-293v44h36v215l-136-214h-79v319.73h-32.87v43.27h565.68v-47h-35.81v-211h-61v211h-34v-230h128v-41h-215v39h27.44v232h-61.19v-319.9h331.75ZM224.71,694.93v-223l141,223h-141Z" 
        fill={color}
      />
    </svg>
  );
};

export default NovaHestiaLogo;
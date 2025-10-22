import React from "react";

export const Loader = ({ 
  variant = "forest", 
  size = 40, 
  color 
}: { 
  variant?: "forest" | "white", 
  size?: number, 
  color?: string 
}) => {
  const computedColor = color || (variant === "white" ? "white" : "forest");

  return (
    <div className="flex flex-col items-center justify-center mt-2">
      <svg
        className="animate-spin"
        style={{ height: `${size}px`, width: `${size}px` }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={computedColor}
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill={computedColor}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="mt-2" style={{ color: computedColor }}></p>
    </div>
  );
};
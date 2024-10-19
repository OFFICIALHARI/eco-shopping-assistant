// ProgressBar.tsx
import React from "react";
import "./ProgressBar.css";

interface ProgressBarProps {
  progress: number; // Progress value between 1 and 10
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
}: ProgressBarProps) => {
  // Calculate width percentage based on progress value between 1 and 10
  const widthPercentage = progress * 10;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

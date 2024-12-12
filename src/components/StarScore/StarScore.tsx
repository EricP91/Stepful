import React, { useState } from "react";
import "./star-score.scss";

interface IStarScoreProps {
  maxStars?: number;
  initialScore?: number;
  disabled?: boolean;
  onScoreChange?: (score: number) => void;
}

const StarScore: React.FC<IStarScoreProps> = ({
  maxStars = 5,
  initialScore = 0,
  disabled = false,
  onScoreChange,
}) => {
  const [score, setScore] = useState(initialScore);

  const handleStarClick = (starIndex: number) => {
    if (disabled) return;
    const newScore = starIndex + 1;
    setScore(newScore);
    if (onScoreChange) {
      onScoreChange(newScore);
    }
  };

  return (
    <div className="container">
      {[...Array(maxStars)].map((_, index) => (
        <Star
          key={index}
          filled={index < score}
          onClick={() => handleStarClick(index)}
        />
      ))}
    </div>
  );
};

const Star: React.FC<{ filled: boolean; onClick: () => void }> = ({
  filled,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className="star"
      style={{
        color: filled ? "#FFD700" : "#ccc",
        cursor: "pointer",
      }}
    >
      ★
    </span>
  );
};

export default StarScore;

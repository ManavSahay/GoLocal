// src/components/Common/StarRating.tsx

import React from 'react';
import './StarRating.css'; // You'll need to create this CSS file

interface StarRatingProps {
  rating: number;
  onRatingChange: (newRating: number) => void;
  maxStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, maxStars = 5 }) => {
  const stars = [...Array(maxStars)].map((_, index) => {
    const starValue = index + 1;
    return (
      <span
        key={index}
        className={starValue <= rating ? 'star-filled' : 'star-empty'}
        onClick={() => onRatingChange(starValue)}
        // Added accessibility attributes
        role="button"
        aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onRatingChange(starValue);
          }
        }}
        style={{ cursor: 'pointer', fontSize: '24px', color: starValue <= rating ? 'gold' : 'gray' }}
      >
        &#9733; {/* Unicode star character */}
      </span>
    );
  });

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
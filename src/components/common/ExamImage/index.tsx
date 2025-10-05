import React, { useState } from 'react';

interface ExamImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackText?: string;
}

const ExamImage: React.FC<ExamImageProps> = ({ 
  src, 
  alt = "Exam content", 
  className = "",
  fallbackText = "Image not available"
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Convert relative URLs to absolute URLs
  const getImageUrl = (imageSrc?: string) => {
    if (!imageSrc) return '';
    
    // If it's already an absolute URL, return as is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }
    
    // If it's a relative path, prepend the API base URL
    if (imageSrc.startsWith('/media/')) {
      return `https://sujanadh.pythonanywhere.com${imageSrc}`;
    }
    
    // If it starts with 'media/', add the base URL
    if (imageSrc.startsWith('media/')) {
      return `https://sujanadh.pythonanywhere.com/${imageSrc}`;
    }
    
    // Default case - assume it's a relative path
    return `https://sujanadh.pythonanywhere.com/media/${imageSrc}`;
  };

  const imageUrl = getImageUrl(src);

  if (!src || imageError) {
    return (
      <div className={`naxatw-flex naxatw-justify-center naxatw-items-center naxatw-my-4 ${className}`}>
        <div className="naxatw-text-gray-400 naxatw-italic naxatw-text-center naxatw-py-4 naxatw-bg-gray-50 naxatw-border naxatw-border-gray-200 naxatw-rounded-lg naxatw-px-4">
          {fallbackText}
        </div>
      </div>
    );
  }

  return (
    <div className={`naxatw-flex naxatw-justify-center naxatw-items-center naxatw-my-4 ${className}`}>
      {!imageLoaded && (
        <div className="naxatw-text-gray-400 naxatw-italic naxatw-text-center naxatw-py-4 naxatw-bg-gray-50 naxatw-border naxatw-border-gray-200 naxatw-rounded-lg naxatw-px-4">
          Loading image...
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`naxatw-max-w-full naxatw-h-auto naxatw-rounded-lg naxatw-shadow-sm naxatw-border naxatw-border-gray-200 ${!imageLoaded ? 'naxatw-hidden' : ''}`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default ExamImage;

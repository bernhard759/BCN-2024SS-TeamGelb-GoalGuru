import React, { useEffect, useRef } from 'react';
import { MdOutlineSportsSoccer } from 'react-icons/md';
import './SoccerIcon.css';

const SoccerIcon = () => {

  // Icon Ref
  const iconRef = useRef(null);

  // Effect
  useEffect(() => {
    const handleScroll = () => {
      // Get the current scroll position
      const scrollPosition = document.documentElement.scrollTop;
      // Get the icon
      const iconElement = iconRef.current;
      // Calculate page height
      const pageHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (iconElement) {
        // Calculate the new top position for the icon container
        const newTop = 80 + (scrollPosition / pageHeight) * (window.innerHeight - 250);
        // Calculate the new left position for the icon container
        const newLeft = 40 + (scrollPosition / pageHeight) * (window.innerWidth - 250);

        // Update the top and left styles of the icon container
        iconElement.style.top = `${newTop}px`;
        iconElement.style.left = `${newLeft}px`;

        // Calculate the rotation angle based on the scroll position
        const rotation = (scrollPosition / pageHeight) * 360;
        // Update the transform style of the icon container to rotate the icon
        iconElement.style.transform = `rotate(${rotation}deg)`;
      }
    };

    // Add the scroll event listener to the window
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Markup
  return (
    <div className="soccer-icon" ref={iconRef}>
      <MdOutlineSportsSoccer />
    </div>
  );
};

export default SoccerIcon;

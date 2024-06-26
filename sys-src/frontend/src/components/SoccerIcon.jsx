import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineSportsSoccer } from 'react-icons/md';
import './SoccerIcon.css';

const SoccerIcon = () => {
  // Icon Ref
  const iconRef = useRef(null);
  
  // State to store footer height
  const [footerHeight, setFooterHeight] = useState(0);

  // Assume the ball has a fixed size (adjust this value as needed)
  const BALL_SIZE = 100; // in pixels

  // Effect
  useEffect(() => {
    // Function to get footer height
    const getFooterHeight = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        setFooterHeight(footer.offsetHeight);
      }
    };

    // Get initial footer height
    getFooterHeight();

    // Recalculate footer height on window resize
    window.addEventListener('resize', getFooterHeight);

    const handleScroll = () => {
      // Get the current scroll position
      const scrollPosition = document.documentElement.scrollTop;
      // Get the icon
      const iconElement = iconRef.current;
      // Calculate page height
      const pageHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (iconElement) {
        // Calculate the new top position for the icon container
        // Subtract footer height, ball size, and add a small buffer (e.g., 10px)
        const maxTop = window.innerHeight - footerHeight - BALL_SIZE - 10;
        const newTop = Math.min(
          100 + (scrollPosition / pageHeight) * (maxTop - 100),
          maxTop
        );
        
        // Calculate the new left position for the icon container
        const newLeft = 50 + (scrollPosition / pageHeight) * (window.innerWidth - 250);

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', getFooterHeight);
    };
  }, [footerHeight]);

  // Markup
  return (
    <div className="soccer-icon" ref={iconRef} style={{ width: BALL_SIZE, height: BALL_SIZE }}>
      <MdOutlineSportsSoccer data-testid="soccericon" style={{ width: '100%', height: '100%' }}/>
    </div>
  );
};

export default SoccerIcon;

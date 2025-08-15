// Simple swipe navigation for posts on mobile
(function() {
  'use strict';
  
  // Only enable on post pages and mobile devices
  if (!document.body.classList.contains('post-page') || window.innerWidth > 768) {
    return;
  }
  
  let startX = 0;
  let startY = 0;
  let threshold = 50; // minimum swipe distance
  
  // Get navigation links
  const prevLink = document.querySelector('.post-nav-prev a');
  const nextLink = document.querySelector('.post-nav-next a');
  
  if (!prevLink && !nextLink) return;
  
  document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchend', function(e) {
    if (!startX || !startY) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0 && nextLink) {
        // Swipe left = next post
        window.location.href = nextLink.href;
      } else if (diffX < 0 && prevLink) {
        // Swipe right = previous post
        window.location.href = prevLink.href;
      }
    }
    
    startX = 0;
    startY = 0;
  }, { passive: true });
})();
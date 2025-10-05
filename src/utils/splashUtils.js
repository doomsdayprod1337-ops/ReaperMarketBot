// Utility functions for splash screen management

export const splashUtils = {
  // Reset splash screen (for testing purposes)
  resetSplash: () => {
    localStorage.removeItem('has_seen_splash');
    console.log('Splash screen reset - will show on next visit');
  },

  // Check if splash has been seen
  hasSeenSplash: () => {
    return localStorage.getItem('has_seen_splash') === 'true';
  },

  // Mark splash as seen
  markSplashSeen: () => {
    localStorage.setItem('has_seen_splash', 'true');
  },

  // Force show splash screen (for demo purposes)
  forceShowSplash: () => {
    localStorage.removeItem('has_seen_splash');
    window.location.href = '/splash';
  },

  // Skip splash screen (for testing)
  skipSplash: () => {
    localStorage.setItem('has_seen_splash', 'true');
    console.log('Splash screen skipped');
  }
};

// Add to window for easy access in console
if (typeof window !== 'undefined') {
  window.splashUtils = splashUtils;
}

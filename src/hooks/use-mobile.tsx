import * as React from "react";

// Mobile Breakpoint threshold: Any screen width under this value (in pixels) is considered "Mobile".
// 768px is typically the point where tablet screens begin.
const MOBILE_BREAKPOINT = 768;

/**
 * Custom React Hook: useIsMobile
 * 
 * This hook checks if the user's screen width is currently in "mobile" size.
 * It listens for window resize events and automatically updates, allowing your 
 * React components to adapt their UI instantly when resizing from Desktop to Mobile.
 * 
 * @returns {boolean} - true if the screen is mobile-sized, false otherwise.
 */
export function useIsMobile() {
  // State to store whether we are on mobile or not.
  // Initialized to undefined so it doesn't wrongly assume desktop or mobile during initial server/client render setups.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // We create a MediaQueryList object to evaluate if the screen is exactly at or below our target mobile width (767px).
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // The callback function that runs whenever the window crosses the breakpoint.
    const onChange = () => {
      // Updates the state based on the current window inner width.
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Attach our listener to react immediately to resize events passing our media query threshold.
    mql.addEventListener("change", onChange);

    // Call it once manually to ensure we have the correct starting state on component mount.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup function: This is VERY important. It removes the event listener 
    // when the component unmounts to prevent memory leaks and performance issues.
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return true or false. '!!' converts undefined into false initially.
  return !!isMobile;
}

// 1. IMPORTS
// We import React Hooks:
// useState (for data that changes), useRef (for direct access to HTML elements), and useEffect (for running side-effects).
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react'; // An 'X' icon for the close button

// 2. INTERFACES
// This component expects two functions to be passed down from its parent component
interface OtpPopupProps {
  onVerified: () => void; // What happens when the user types the correct code
  onClose: () => void; // What happens when the user clicks the X button
}

// 3. MAIN COMPONENT
const OtpPopup = ({ onVerified, onClose }: OtpPopupProps) => {
  
  // STATE: We store the 4-digit OTP as an array of 4 empty strings initially
  const [otp, setOtp] = useState(['', '', '', '']);
  
  // STATE: Controls whether we show the "flying owl" animation (true) or the actual input boxes (false)
  const [showOwl, setShowOwl] = useState(true);
  
  // REF: We use useRef to keep an array of references to the actual <input> HTML elements.
  // This allows us to forcefully move the user's cursor to the next box automatically!
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // EFFECT: Runs exactly ONCE when the popup first appears
  useEffect(() => {
    // We set a timer for 2.5 seconds (the owl animation)
    const t = setTimeout(() => setShowOwl(false), 2500);
    // Cleanup function: If the component is destroyed before 2.5s, cancel the timer
    return () => clearTimeout(t);
  }, []); // Empty array [] means "only run this on mount"

  // LOGIC: Handles what happens when a user types a number into a box
  const handleChange = (idx: number, val: string) => {
    // Regular Expression (Regex): Ensure the value is ONLY digits (\d). Reject letters.
    if (!/^\d*$/.test(val)) return;
    
    // Copy the existing array so we don't mute React state directly
    const next = [...otp];
    // We only want the very last character typed (in case they somehow typed multiple)
    next[idx] = val.slice(-1);
    
    // Update our React state with the new array
    setOtp(next);
    
    // Auto-advance to the next input box! 
    // If they typed something (val is truthy) AND we aren't on the last box (idx < 3)
    if (val && idx < 3) {
      inputsRef.current[idx + 1]?.focus(); // Force the cursor into the next box
    }
  };

  // LOGIC: Check if the OTP is fully filled out
  const handleSubmit = () => {
    // .every() checks if ALL 4 strings in the array are NOT empty
    if (otp.every(d => d !== '')) {
      onVerified(); // Tell the parent component we succeeded!
    }
  };

  return (
    // The dark blurred background overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      
      {/* The main popup window */}
      <div className="relative max-w-sm w-full rounded-2xl border border-primary/50 bg-card p-6 text-center animate-fade-in glow-gold">
        
        {/* Close button in top right corner */}
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {/* CONDITIONAL RENDERING */}
        {/* If showOwl is true, render the owl animation. When false, render the inputs. */}
        {showOwl ? (
          <div className="py-8 animate-fade-in">
            <span className="text-6xl block mb-4 animate-float">🦉</span>
            <p className="font-medieval text-lg text-primary text-glow">
              YOUR OWL IS ON THE WAY WITH OTP
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-body">Please wait...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h3 className="font-display text-lg font-bold text-foreground mb-1">Enter OTP</h3>
            <p className="text-xs text-muted-foreground font-body mb-6">The owl has delivered your code 🦉</p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3 mb-6">
              {/* Loop through our 4-item 'otp' array and create an <input> for each one */}
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  // We store the physical HTML element in our inputsRef array so we can access it later
                  ref={el => { inputsRef.current[idx] = el; }}
                  type="text"
                  inputMode="numeric" // Shows numpad on mobile phones
                  value={digit}
                  // e.target.value is whatever the user just typed into the box
                  onChange={e => handleChange(idx, e.target.value)}
                  maxLength={1} // Only 1 digit per box
                  className="w-12 h-14 text-center text-xl font-display font-bold rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleSubmit}
              // The button is disabled if ANY (some) of the boxes are still empty
              disabled={otp.some(d => d === '')}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all disabled:opacity-50"
            >
              Verify ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpPopup;

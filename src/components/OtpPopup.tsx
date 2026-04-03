import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface OtpPopupProps {
  onVerified: () => void;
  onClose: () => void;
}

const OtpPopup = ({ onVerified, onClose }: OtpPopupProps) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOwl, setShowOwl] = useState(true);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setShowOwl(false), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 3) inputsRef.current[idx + 1]?.focus();
  };

  const handleSubmit = () => {
    if (otp.every(d => d !== '')) {
      onVerified();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative max-w-sm w-full rounded-2xl border border-primary/50 bg-card p-6 text-center animate-fade-in glow-gold">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

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

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputsRef.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  maxLength={1}
                  className="w-12 h-14 text-center text-xl font-display font-bold rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
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

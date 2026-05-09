import { useState, useCallback } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import platformImg from '@/assets/hogwart-exp-9-trim2.png';
import blackBg from '@/assets/black.webp';
import harryGif from '@/assets/harry.gif';

const PlatformPage = () => {
  const [revealed, setRevealed] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const alreadyUsed = sessionStorage.getItem('platform-used') === 'true';

  const handleRunThrough = useCallback(() => {
    if (alreadyUsed || isBreaking) return;
    setIsBreaking(true);

    setTimeout(() => {
      const pct = Math.floor(Math.random() * 40) + 1;
      setDiscount(pct);
      setCode(`MAGIC${pct}`);
      setRevealed(true);
      setIsBreaking(false);
      sessionStorage.setItem('platform-used', 'true');
      // Store the coupon in localStorage so CartPage can validate it
      localStorage.setItem('platform-coupon-code', `MAGIC${pct}`);
      localStorage.setItem('platform-coupon-discount', String(pct));
    }, 2000);
  }, [alreadyUsed, isBreaking]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Discount code copied! ✨');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen">
      {/* Main content container */}
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-2">
            🚂 Platform 9¾
          </h1>
          <p className="font-medieval text-muted-foreground italic">
            Only true witches and wizards find this platform...
          </p>
        </div>

        <div className="relative flex justify-center mb-8">
          <div
            className={`relative transition-all duration-1000 ${
              isBreaking ? 'animate-wall-break' : ''
            } ${revealed ? 'opacity-30 scale-95' : ''}`}
          >
            <img
              src={platformImg}
              alt="Platform 9¾ Wall"
              className="h-48 w-auto object-contain"
            />

            {/* Brick overlay for break effect */}
            {isBreaking && (
              <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-1 animate-bricks-scatter">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-4 bg-amber-800 rounded-sm opacity-80"
                    style={{
                      transform: `rotate(${Math.random() * 40 - 20}deg) translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px)`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Steam effects */}
          {(isBreaking || revealed) && (
            <>
              <div className="absolute -top-4 left-1/4 w-16 h-16 bg-foreground/5 rounded-full blur-xl animate-float" />
              <div
                className="absolute -top-2 right-1/3 w-12 h-12 bg-foreground/5 rounded-full blur-xl animate-float"
                style={{ animationDelay: '1s' }}
              />
            </>
          )}
        </div>

        {!revealed && !alreadyUsed && (
          <div className="text-center">
            <button
              onClick={handleRunThrough}
              disabled={isBreaking}
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg hover:glow-gold-intense active:scale-95 transition-all disabled:opacity-50"
            >
              {isBreaking ? 'Running through...' : 'Run Through the Wall 🧱'}
            </button>
          </div>
        )}

        {alreadyUsed && !revealed && (
          <div className="text-center rounded-xl border border-border bg-card p-8">
            <p className="font-medieval text-lg text-muted-foreground">
              You've already passed through the wall this session! 🚂
            </p>
          </div>
        )}

        {/* On mobile breakpoint, always show posters below the wall button area (before reveal). */}
        {!revealed && (
          <div className="mt-6 hidden items-center justify-center gap-4 [@media(max-width:1550px)_and_(max-height:577px)]:flex">
            <img
              src={harryGif}
              alt="Undesirable No. 1 poster"
              className="h-32 w-auto object-contain"
            />
            <img
              src={blackBg}
              alt="Hogwarts Express night sky"
              className="h-32 w-auto object-contain"
            />
          </div>
        )}

        {revealed && (
          <div className="rounded-xl border border-primary/50 bg-card p-8 text-center animate-fade-in glow-gold-intense">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4 animate-sparkle" />
            <h2 className="font-display text-4xl font-bold text-primary text-glow mb-2">
              {discount}% OFF!
            </h2>
            <p className="font-medieval text-lg text-foreground mb-4">
              You've found the Hogwarts Express! 🚂
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-muted border border-border mb-4">
              <span className="font-display text-xl font-bold text-primary tracking-wider">{code}</span>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right-side decorative image aligned with the section */}
      <img
        src={blackBg}
        alt="Hogwarts Express night sky"
        className="hidden md:block absolute right-[20.5rem] top-1/2 -translate-y-[150%] h-56 w-auto object-contain [@media(max-width:1550px)_and_(max-height:577px)]:hidden"
      />

      {/* Left-side decorative GIF aligned with the section */}
      <img
        src={harryGif}
        alt="Undesirable No. 1 poster"
        className="hidden md:block absolute left-[20.5rem] top-1/2 -translate-y-[150%] h-56 w-auto object-contain [@media(max-width:1550px)_and_(max-height:577px)]:hidden"
      />
    </div>
  );
};

export default PlatformPage;

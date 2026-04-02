import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import gateImg from '@/assets/hogwarts-gate.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOpening, setIsOpening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('The spell failed. Try again.');
      return;
    }

    // Simulate login success
    setIsOpening(true);
    setTimeout(() => {
      localStorage.setItem('diagonally-user', username);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Stone texture background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      
      {/* Candle flicker effects */}
      <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-primary animate-flicker opacity-60" />
      <div className="absolute top-32 right-16 w-1.5 h-1.5 rounded-full bg-primary animate-flicker opacity-40" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 left-1/4 w-2 h-2 rounded-full bg-primary animate-flicker opacity-50" style={{ animationDelay: '1s' }} />

      <div className={`relative z-10 w-full max-w-sm transition-all duration-1000 ${isOpening ? 'scale-110 opacity-0' : ''}`}>
        {/* Gate image */}
        <div className="flex justify-center mb-6">
          <img
            src={gateImg}
            alt="Hogwarts Gate"
            className={`h-40 w-auto object-contain drop-shadow-2xl ${isOpening ? 'animate-gate-open' : ''}`}
          />
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground text-glow text-center mb-1">
          🔐 Alohomora
        </h1>
        <p className="font-medieval text-sm text-muted-foreground text-center mb-6">
          Unlock the gates to the magical marketplace
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
            <p className="text-sm text-destructive font-body">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 glow-gold">
          <div>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">
              <User className="inline h-3 w-3 mr-1" />
              Your Wizarding Name
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Harry Potter"
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">
              <Lock className="inline h-3 w-3 mr-1" />
              Secret Spell
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isOpening}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg hover:glow-gold-intense active:scale-95 transition-all disabled:opacity-50"
          >
            Alohomora 🔓
          </button>

          <div className="flex items-center justify-between text-xs font-body">
            <button type="button" className="text-muted-foreground hover:text-primary transition-colors">
              Forgot your spell?
            </button>
            <button type="button" className="text-primary hover:text-primary/80 transition-colors font-semibold">
              New to Hogwarts? Enroll Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

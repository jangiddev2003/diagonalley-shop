import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// COMMENTED OUT — Old OTP popup import (was part of fake auth flow):
// import OtpPopup from '@/components/OtpPopup';

const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin', 'No Preference'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // CHANGED: Added password field for real authentication
  const [form, setForm] = useState({ name: '', email: '', password: '', mobile: '', house: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);

  // COMMENTED OUT — Old fake OTP state (was part of dummy auth):
  // const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // --- REAL BACKEND REGISTRATION (replaces fake OTP flow) ---
    // COMMENTED OUT — Old fake registration logic:
    // if (!form.name || !form.email || !form.mobile) return;
    // setShowOtp(true);

    // COMMENTED OUT — Old fake verified handler:
    // const handleVerified = () => {
    //   setShowOtp(false);
    //   setVerified(true);
    //   setTimeout(() => navigate('/'), 2000);
    // };

    setIsSubmitting(true);

    // Call the real backend register API via AuthContext
    const result = await register({
      username: form.name,
      email: form.email,
      password: form.password,
    });

    if (result.success) {
      // Show the success screen (same animation as before)
      setVerified(true);
      setTimeout(() => navigate('/'), 2000);
    } else {
      // Show the backend error message
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 animate-fade-in">
        <span className="text-6xl">🎉</span>
        <h1 className="font-display text-2xl font-bold text-primary text-glow">Welcome to Hogwarts!</h1>
        <p className="font-body text-muted-foreground">Your enrollment is complete. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <span className="text-5xl block mb-3">🏰</span>
          <h1 className="font-display text-2xl font-bold text-foreground text-glow mb-1">
            New to Hogwarts? Enroll Here
          </h1>
          <p className="font-medieval text-sm text-muted-foreground">Begin your magical journey</p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
            <p className="text-sm text-destructive font-body">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 glow-gold animate-fade-in">
          <div>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">
              <UserPlus className="inline h-3 w-3 mr-1" /> Full Name
            </label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Harry Potter" required
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="harry@hogwarts.edu" required
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* NEW: Password field for real authentication */}
          <div>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">
              <Lock className="inline h-3 w-3 mr-1" /> Secret Spell (Password)
            </label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Min 6 characters" required
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">Mobile Number (Optional)</label>
            <input
              type="tel" name="mobile" value={form.mobile} onChange={handleChange}
              placeholder="+44 7700 900000"
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">House Preference (Optional)</label>
            <select
              name="house" value={form.house} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="">Select a house...</option>
              {houses.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg hover:glow-gold-intense active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enrolling...
              </>
            ) : (
              'Enroll Now 🏰'
            )}
          </button>
        </form>
      </div>

      {/* COMMENTED OUT — Old fake OTP popup (no real verification):
      {showOtp && <OtpPopup onVerified={handleVerified} onClose={() => setShowOtp(false)} />}
      */}
    </div>
  );
};

export default RegisterPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import OtpPopup from '@/components/OtpPopup';

const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin', 'No Preference'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', house: '' });
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile) return;
    setShowOtp(true);
  };

  const handleVerified = () => {
    setShowOtp(false);
    setVerified(true);
    setTimeout(() => navigate('/'), 2000);
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

          <div>
            <label className="block font-display text-xs font-semibold text-foreground mb-1">Mobile Number</label>
            <input
              type="tel" name="mobile" value={form.mobile} onChange={handleChange}
              placeholder="+44 7700 900000" required
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
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg hover:glow-gold-intense active:scale-95 transition-all"
          >
            Enroll Now 🏰
          </button>
        </form>
      </div>

      {showOtp && <OtpPopup onVerified={handleVerified} onClose={() => setShowOtp(false)} />}
    </div>
  );
};

export default RegisterPage;

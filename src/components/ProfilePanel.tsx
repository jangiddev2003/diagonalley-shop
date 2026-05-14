// ============================================
// PROFILE PANEL — Magical slide-in profile dashboard
// ============================================
// Shown when the user clicks the profile avatar in the Navbar.
// Displays user info and lets them switch house avatars.

import { useState } from 'react';
import { X, LogOut, Wand2, Star, Clock, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// ── Avatar images (house icons) ─────────────────────────────────
const HOUSE_AVATARS: Record<string, { icon: string; label: string; colors: string; border: string; glow: string }> = {
  gryffindor: {
    icon:   '/icons8-gryffindor-50.ico',
    label:  'Gryffindor',
    colors: 'from-red-800 to-yellow-700',
    border: 'border-red-500',
    glow:   'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
  },
  hufflepuff: {
    icon:   '/icons8-hufflepuff-50.ico',
    label:  'Hufflepuff',
    colors: 'from-yellow-700 to-yellow-900',
    border: 'border-yellow-400',
    glow:   'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
  },
  ravenclaw: {
    icon:   '/icons8-ravenclaw-50.ico',
    label:  'Ravenclaw',
    colors: 'from-blue-800 to-indigo-900',
    border: 'border-blue-400',
    glow:   'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  },
  slytherin: {
    icon:   '/icons8-slytherin-50.ico',
    label:  'Slytherin',
    colors: 'from-green-800 to-emerald-900',
    border: 'border-green-500',
    glow:   'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
  },
};

const HOUSE_TEXT: Record<string, string> = {
  Gryffindor: 'text-yellow-300',
  Hufflepuff:  'text-yellow-200',
  Ravenclaw:   'text-blue-300',
  Slytherin:   'text-green-300',
};

// Format ISO date string to readable text
const fmt = (iso: string | null) => {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

interface Props {
  onClose: () => void;
  onLogout: () => void;
}

const ProfilePanel = ({ onClose, onLogout }: Props) => {
  const { user, updateAvatar } = useAuth();
  const [savingAvatar, setSavingAvatar] = useState(false);

  if (!user) return null;

  const currentAvatar = HOUSE_AVATARS[user.avatar] ?? HOUSE_AVATARS['gryffindor'];
  const houseTextColor = user.hogwartsHouse ? HOUSE_TEXT[user.hogwartsHouse] ?? 'text-primary' : 'text-muted-foreground';

  const handleAvatarChange = async (key: string) => {
    if (key === user.avatar) return;
    setSavingAvatar(true);
    const res = await updateAvatar(key);
    setSavingAvatar(false);
    if (res.success) {
      toast.success('✨ Avatar updated!');
    } else {
      toast.error(res.message);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      onClick={onClose}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <aside
        className="relative z-10 w-full max-w-sm h-full bg-card border-l border-border overflow-y-auto shadow-2xl glow-gold animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-lg font-bold text-foreground text-glow">
            🧙 Wizard Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* ── Avatar + Name ─────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={`w-24 h-24 rounded-full border-2 ${currentAvatar.border} ${currentAvatar.glow}
                bg-gradient-to-br ${currentAvatar.colors} flex items-center justify-center
                transition-all duration-500 overflow-hidden p-1`}
              style={{ imageRendering: 'crisp-edges' }}
            >
              <img
                src={currentAvatar.icon}
                alt={currentAvatar.label}
                width={88}
                height={88}
                className="w-full h-full object-contain select-none"
                style={{
                  imageRendering: 'crisp-edges',
                  filter: 'contrast(1.12) brightness(1.08) saturate(1.1) drop-shadow(0 2px 6px rgba(0,0,0,0.55))',
                  transform: 'scale(1.0)',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                draggable={false}
              />
            </div>

            <div>
              <p className="font-display text-xl font-bold text-foreground">{user.username}</p>
              <p className="font-body text-sm text-muted-foreground">{user.email}</p>
              {user.hogwartsHouse && (
                <p className={`font-medieval text-sm font-semibold ${houseTextColor} mt-1`}>
                  🏰 House {user.hogwartsHouse}
                </p>
              )}
            </div>
          </div>

          {/* ── Avatar Selector ───────────────────────────────────── */}
          <div>
            <p className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Choose Your Avatar
            </p>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(HOUSE_AVATARS).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => handleAvatarChange(key)}
                  disabled={savingAvatar}
                  title={meta.label}
                  className={`relative aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center
                    bg-gradient-to-br ${meta.colors} overflow-hidden p-1.5
                    ${user.avatar === key ? `${meta.border} ${meta.glow} scale-105` : 'border-border opacity-60 hover:opacity-90 hover:scale-105'}
                    disabled:cursor-wait`}
                >
                  <img
                    src={meta.icon}
                    alt={meta.label}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain select-none"
                    style={{
                      imageRendering: 'crisp-edges',
                      filter: 'contrast(1.1) brightness(1.06) saturate(1.08) drop-shadow(0 1px 4px rgba(0,0,0,0.5))',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                    draggable={false}
                  />
                  {user.avatar === key && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-primary-foreground fill-current" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="font-body text-xs text-muted-foreground mt-2 text-center">
              Your house avatar is set by default. Switch anytime!
            </p>
          </div>

          {/* ── Info Cards ────────────────────────────────────────── */}
          <div className="space-y-2">
            <InfoRow icon={<Shield className="h-3.5 w-3.5" />}  label="Account ID"  value={`#${user.id.slice(-8).toUpperCase()}`} />
            <InfoRow icon={<Wand2 className="h-3.5 w-3.5" />}   label="Role"        value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
            <InfoRow icon={<Clock className="h-3.5 w-3.5" />}   label="Member Since" value={fmt(user.createdAt)} />
            <InfoRow icon={<Clock className="h-3.5 w-3.5" />}   label="Last Login"  value={fmt(user.lastLogin)} />
          </div>

          {/* ── Activity Log ──────────────────────────────────────── */}
          {user.activityLog && user.activityLog.length > 0 && (
            <div>
              <p className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Recent Activity
              </p>
              <div className="space-y-1 max-h-36 overflow-y-auto rounded-lg bg-muted/50 p-3">
                {[...user.activityLog].reverse().map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-body">
                    <span className="text-foreground">✦ {entry.action}</span>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(entry.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Logout ────────────────────────────────────────────── */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-destructive/50
              text-destructive font-display font-semibold text-sm hover:bg-destructive/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

// ── Small helper sub-component ───────────────────────────────────────
const InfoRow = ({
  icon, label, value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/60">
    <span className="flex items-center gap-1.5 font-display text-xs text-muted-foreground">
      {icon}
      {label}
    </span>
    <span className="font-body text-xs text-foreground font-semibold">{value}</span>
  </div>
);

export default ProfilePanel;

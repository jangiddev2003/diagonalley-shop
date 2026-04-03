import galleonImg from '@/assets/galleon.png';
import sickleImg from '@/assets/sickle.png';
import knutImg from '@/assets/knut.png';

export { galleonImg, sickleImg, knutImg };

// 1 Galleon = 17 Sickles = 493 Knuts
// 1 Galleon ≈ £5 ≈ $6.25
const SICKLES_PER_GALLEON = 17;
const KNUTS_PER_SICKLE = 29;
const GBP_PER_GALLEON = 5;
const USD_PER_GBP = 1.25;

export interface WizardCurrency {
  galleons: number;
  sickles: number;
  knuts: number;
}

export const galleonsToBreakdown = (totalGalleons: number): WizardCurrency => {
  const galleons = Math.floor(totalGalleons);
  const remainingSickles = Math.round((totalGalleons - galleons) * SICKLES_PER_GALLEON);
  return { galleons, sickles: remainingSickles, knuts: 0 };
};

export const galleonsToUSD = (galleons: number): string => {
  return (galleons * GBP_PER_GALLEON * USD_PER_GBP).toFixed(2);
};

export const galleonsToGBP = (galleons: number): string => {
  return (galleons * GBP_PER_GALLEON).toFixed(2);
};

export const formatWizardPrice = (galleons: number): string => {
  if (galleons >= 1) {
    const g = Math.floor(galleons);
    const remainder = galleons - g;
    const s = Math.floor(remainder * SICKLES_PER_GALLEON);
    if (s > 0) return `${g}G ${s}S`;
    return `${g} Galleons`;
  }
  const totalSickles = Math.round(galleons * SICKLES_PER_GALLEON);
  return `${totalSickles} Sickles`;
};

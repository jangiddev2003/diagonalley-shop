import galleonImg from '@/assets/galleon.png';
import sickleImg from '@/assets/sickle.png';
import knutImg from '@/assets/knut.png';
import { galleonsToUSD } from '@/lib/currency';

interface CurrencyDisplayProps {
  galleons: number;
  showUSD?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const CurrencyDisplay = ({ galleons, showUSD = false, size = 'md', className = '' }: CurrencyDisplayProps) => {
  const iconSize = sizes[size];

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="font-display font-bold text-primary">
        {galleons}
      </span>
      <img src={galleonImg} alt="Galleons" className={`${iconSize} object-contain`} />
      {showUSD && (
        <span className="text-muted-foreground text-xs ml-1">
          (${galleonsToUSD(galleons)})
        </span>
      )}
    </span>
  );
};

export default CurrencyDisplay;

export const CurrencyInfo = () => (
  <div className="flex flex-wrap justify-center gap-8 font-body text-sm text-muted-foreground">
    <div className="text-center">
      <img src={galleonImg} alt="Galleon" className="h-12 w-12 mx-auto mb-2 object-contain" />
      <span className="font-display text-primary font-bold block">1 Galleon</span>
      <span className="block text-xs">= 17 Sickles ≈ £5</span>
    </div>
    <div className="text-center">
      <img src={sickleImg} alt="Sickle" className="h-12 w-12 mx-auto mb-2 object-contain" />
      <span className="font-display text-foreground font-bold block">1 Sickle</span>
      <span className="block text-xs">= 29 Knuts</span>
    </div>
    <div className="text-center">
      <img src={knutImg} alt="Knut" className="h-12 w-12 mx-auto mb-2 object-contain" />
      <span className="font-display text-muted-foreground font-bold block">1 Knut</span>
      <span className="block text-xs">Smallest unit</span>
    </div>
  </div>
);

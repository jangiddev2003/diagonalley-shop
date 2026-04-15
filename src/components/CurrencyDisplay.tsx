// 1. IMPORTS
// We import our coin images
import galleonImg from '@/assets/galleon.png';
import sickleImg from '@/assets/sickle.png';
import knutImg from '@/assets/knut.png';
// We import a helper function that multiplies Galleons by an exchange rate to get Muggle USD
import { galleonsToUSD } from '@/lib/currency';

// 2. INTERFACES
// This defines the "settings" (props) we can pass to the CurrencyDisplay component.
interface CurrencyDisplayProps {
  galleons: number; // The amount of money to show
  showUSD?: boolean; // Optional: Should we convert it to USD in brackets? (Default: false)
  size?: 'sm' | 'md' | 'lg'; // Optional: How big should the icon be? (Default: 'md')
  className?: string; // Optional: Any extra CSS classes to add?
}

// 3. HELPER DATA
// A dictionary that maps the human-readable 'size' prop to actual TailwindCSS height/width classes
const sizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

// 4. FIRST COMPONENT: CurrencyDisplay
// This component shows a number next to a small gold Galleon icon. Wait, that's what we use for prices!
// Note that we set default values for some props like: showUSD = false
const CurrencyDisplay = ({ galleons, showUSD = false, size = 'md', className = '' }: CurrencyDisplayProps) => {
  // Look up the correct Tailwind classes from our dictionary based on the 'size' prop
  const iconSize = sizes[size];

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {/* The number itself */}
      <span className="font-display font-bold text-primary">
        {galleons}
      </span>
      {/* The Galleon Icon */}
      <img src={galleonImg} alt="Galleons" className={`${iconSize} object-contain`} />
      
      {/* CONDITIONAL RENDERING */}
      {/* Both statements must be true to render. If 'showUSD' is true, it renders the HTML after '&&' */}
      {showUSD && (
        <span className="text-muted-foreground text-xs ml-1">
          {/* Call our helper function to convert the price */}
          (${galleonsToUSD(galleons)})
        </span>
      )}
    </span>
  );
};

// 'export default' means this is the primary thing this file exports.
export default CurrencyDisplay;

// 5. SECOND COMPONENT: CurrencyInfo
// Wait, we can put two components in one file?! Yes we can!
// This is a simple informational UI element that explains the wizarding exchange rates.
// We export this normally (without 'default'), so anyone who wants it must import it by exact name: { CurrencyInfo }
export const CurrencyInfo = () => (
  // We use flexbox (flex-wrap, justify-center) to line these three items up in a row.
  <div className="flex flex-wrap justify-center gap-8 font-body text-sm text-muted-foreground">
    
    {/* Galleon Panel */}
    <div className="text-center">
      <img src={galleonImg} alt="Galleon" className="h-12 w-12 mx-auto mb-2 object-contain" />
      <span className="font-display text-primary font-bold block">1 Galleon</span>
      <span className="block text-xs">= 17 Sickles ≈ £5</span>
    </div>
    
    {/* Sickle Panel */}
    <div className="text-center">
      <img src={sickleImg} alt="Sickle" className="h-12 w-12 mx-auto mb-2 object-contain" />
      <span className="font-display text-foreground font-bold block">1 Sickle</span>
      <span className="block text-xs">= 29 Knuts</span>
    </div>
    
    {/* Knut Panel */}
    <div className="text-center">
      <img src={knutImg} alt="Knut" className="h-12 w-12 mx-auto mb-2 object-contain" />
      <span className="font-display text-muted-foreground font-bold block">1 Knut</span>
      <span className="block text-xs">Smallest unit</span>
    </div>
    
  </div>
);

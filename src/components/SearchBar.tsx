// 1. IMPORTS
import { Search, X } from 'lucide-react'; // Magnifying glass and close symbols

// 2. INTERFACES
// The 'props' that control this component from the outside
interface SearchBarProps {
  value: string; // The current text in the search bar
  onChange: (value: string) => void; // A function to call when the user types something new
  placeholder?: string; // Optional text to show when the bar is empty
}

// 3. MAIN COMPONENT
const SearchBar = ({ value, onChange, placeholder = 'Search the magical marketplace...' }: SearchBarProps) => (
  // The outer div uses 'relative' so we can absolutely position the icons inside it
  <div className="relative max-w-md mx-auto">
    
    {/* The Magnifying Glass Icon (Left side) */}
    {/* 'absolute left-3 top-1/2 -translate-y-1/2' mathematically centers it vertically on the left side! */}
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    
    {/* The actual HTML Text Input */}
    <input
      type="text"
      value={value}
      // Every time a key is pressed, we send the new value up to the parent component
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      // 'pl-10' adds padding to the left so the text doesn't overlap the magnifying glass
      // 'pr-10' adds padding to the right so it doesn't overlap the clear button
      className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
    />
    
    {/* CONDITIONAL RENDERING: The Clear Button (Right side) */}
    {/* We ONLY show this closing 'X' button if there is text in the search bar (value is true) */}
    {value && (
      // Clicking it sends an empty string ('') back up to the parent to erase the search
      <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);

export default SearchBar;

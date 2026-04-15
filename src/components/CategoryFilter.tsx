// This imports the Category type and categoryLabels from our products data file.
// Types help TypeScript understand what kind of data we're working with.
import { Category, categoryLabels } from '@/data/products';

// This interface defines the "props" (properties) that this component accepts.
// Think of props like arguments passed to a function.
interface CategoryFilterProps {
  // 'selected' holds the currently chosen category, or 'all' if none are selected.
  selected: Category | 'all';
  // 'onChange' is a function that we'll call whenever a different category is clicked.
  onChange: (cat: Category | 'all') => void;
}

// This is our functional React component. It receives the 'selected' and 'onChange' props.
const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => (
  // The outer div uses Tailwind CSS classes for layout: 'flex' makes it flexible, 
  // 'justify-center' centers the children, and 'gap-2' adds space between them.
  <div className="flex flex-wrap justify-center gap-2">
    
    {/* This is the first button specifically for showing "All" categories */}
    <button
      // When this button is clicked, we call the onChange function and pass 'all' to it.
      onClick={() => onChange('all')}
      // This className block uses string interpolation (the backticks ``) to conditionally apply styles.
      // If selected === 'all', it applies "primary" (active) colors, otherwise it uses "muted" (inactive) colors.
      className={`px-4 py-2 rounded-full text-sm font-medieval transition-all ${
        selected === 'all' ? 'bg-primary text-primary-foreground glow-gold' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      }`}
    >
      ✨ All
    </button>

    {/* 
        Next, we dynamically generate the rest of the buttons based on the categories available.
        Object.entries turns our categoryLabels object into a list of [key, label] pairs.
        We then map over each pair to render a <button> element.
    */}
    {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
      <button
        // React requires a unique "key" when rendering lists to keep track of elements.
        key={key}
        // When clicked, we call onChange with this specific category's key (like 'wands' or 'potions').
        onClick={() => onChange(key)}
        // Just like the "All" button, we apply active or inactive styling based on the 'selected' prop.
        className={`px-4 py-2 rounded-full text-sm font-medieval transition-all ${
          selected === key ? 'bg-primary text-primary-foreground glow-gold' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
        }`}
      >
        {/* We display the human-readable label text inside the button */}
        {label}
      </button>
    ))}
  </div>
);

// We export the component so it can be imported and used in other parts of our app!
export default CategoryFilter;

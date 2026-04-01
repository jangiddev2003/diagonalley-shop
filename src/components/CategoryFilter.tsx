import { Category, categoryLabels } from '@/data/products';

interface CategoryFilterProps {
  selected: Category | 'all';
  onChange: (cat: Category | 'all') => void;
}

const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => (
  <div className="flex flex-wrap justify-center gap-2">
    <button
      onClick={() => onChange('all')}
      className={`px-4 py-2 rounded-full text-sm font-medieval transition-all ${
        selected === 'all' ? 'bg-primary text-primary-foreground glow-gold' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
      }`}
    >
      ✨ All
    </button>
    {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`px-4 py-2 rounded-full text-sm font-medieval transition-all ${
          selected === key ? 'bg-primary text-primary-foreground glow-gold' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default CategoryFilter;

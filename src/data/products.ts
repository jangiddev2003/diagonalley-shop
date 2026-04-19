// 1. TYPES AND INTERFACES
// 'type' is a TypeScript feature that lets us define a specific set of allowed values.
// Here, we restrict 'Category' so it can ONLY be one of these exact string values.
export type Category = 'wands' | 'brooms' | 'books' | 'potions' | 'robes';

// 'interface' defines the shape of an object. It tells TypeScript exactly what properties a 'Product' must have.
export interface Product {
  id: string; // A unique identifier
  name: string; // The name of the product
  description: string; // A short description
  price: number; // The cost in galleons
  category: Category; // Must match one of the categories defined above
  image: string; // The URL or path to the product's image
  // The '?' means this property is optional. A product doesn't HAVE to have a rarity or details.
  rarity?: 'common' | 'rare' | 'legendary'; 
  // 'Record<string, string>' means this is an object where both the keys and values are strings.
  // For example: { color: "red", size: "large" }
  details?: Record<string, string>;
}

// 2. IMAGE IMPORTS
// We import images directly from our assets folder. Vite will turn these into correct URLs when building the app.
// Wand images
import harryWand from '@/assets/wands/harry-potter-wand.jpg';
import hermioneWand from '@/assets/wands/hermione-wand.jpg';
import elderWand from '@/assets/wands/elder-wand.jpg';
import voldemortWand from '@/assets/wands/voldemort-wand.jpg';
import ronWand from '@/assets/wands/ron-wand.jpg';

// Broom images
import nimbus2000Img from '@/assets/brooms/nimbus-2000.jpg';
import fireboltImg from '@/assets/brooms/firebolt.jpg';

// Book images
import advancedPotionsImg from '@/assets/books/advanced-potions.jpg';
import darkArtsImg from '@/assets/books/dark-arts.jpg';
// MODIFIED: Imported newly generated dark arts image
import newDarkArtsImg from '@/assets/books/dark_arts_new.png';
import standardSpellsImg from '@/assets/books/standard_spells.png';
import defensiveTheoryImg from '@/assets/books/defensive_theory.png';
import fantasticBeastsImg from '@/assets/books/fantastic_beasts.png';

// Potion images
import felixImg from '@/assets/potions/felix-felicis.jpg';
import polyjuiceImg from '@/assets/potions/polyjuice.jpg';

// Robe images
import gryffindorImg from '@/assets/robes/gryffindor.jpg';
import invisibilityImg from '@/assets/robes/invisibility-cloak.jpg';

// 3. CATEGORY ICONS
// We export these icons so other files (like the Navbar) can import them directly from here.
export { default as wandIcon } from '@/assets/wand-icon.png';
export { default as broomIcon } from '@/assets/broom-icon.png';
export { default as bookIcon } from '@/assets/book-icon.png';
export { default as potionIcon } from '@/assets/potion-icon.png';
export { default as robesIcon } from '@/assets/robes-icon.png';

export const categoryIcons: Record<Category, string> = {
  wands: '',
  brooms: '',
  books: '',
  potions: '',
  robes: '',
};

// 4. PRODUCT DATA ARRAYS
// We create an array of Product objects for each category.
// Placing ': Product[]' ensures that every item in the array exactly matches the Product interface rules.
export const wands: Product[] = [
  { id: 'w-harry', name: "Harry Potter's Wand", description: 'Holly wood with a phoenix feather core. The brother wand to Voldemort\'s — chose Harry in Ollivander\'s shop.', price: 20, category: 'wands', image: harryWand, rarity: 'legendary', details: { core: 'Phoenix Feather', wood: 'Holly', length: '11"', owner: 'Harry Potter' } },
  { id: 'w-hermione', name: "Hermione Granger's Wand", description: 'Vine wood with a dragon heartstring core. Perfect for a witch of exceptional brilliance.', price: 18, category: 'wands', image: hermioneWand, rarity: 'legendary', details: { core: 'Dragon Heartstring', wood: 'Vine', length: '10¾"', owner: 'Hermione Granger' } },
  { id: 'w-ron', name: "Ron Weasley's Wand", description: 'Willow wood with a unicorn hair core. A loyal wand for a loyal friend.', price: 14, category: 'wands', image: ronWand, rarity: 'rare', details: { core: 'Unicorn Hair', wood: 'Willow', length: '14"', owner: 'Ron Weasley' } },
  { id: 'w-elder', name: 'The Elder Wand', description: 'Elder wood with a thestral tail hair core. The most powerful wand in existence — one of the Deathly Hallows.', price: 50, category: 'wands', image: elderWand, rarity: 'legendary', details: { core: 'Thestral Tail Hair', wood: 'Elder', length: '15"', owner: 'Albus Dumbledore' } },
  { id: 'w-voldemort', name: "Voldemort's Wand", description: 'Yew wood with a phoenix feather core. The twin core to Harry Potter\'s wand.', price: 25, category: 'wands', image: voldemortWand, rarity: 'legendary', details: { core: 'Phoenix Feather', wood: 'Yew', length: '13½"', owner: 'Tom Riddle' } },
  // MODIFIED: Removed the 5 generic wands (Unicorn/Dragon/Phoenix Core & Sycamore/Laurel/Alder Wood) as requested.
  { id: 'w11', name: 'Phoenix Core & Poplar Wood', description: 'An exceptionally rare pairing of great moral integrity.', price: 15, category: 'wands', image: harryWand, rarity: 'rare', details: { core: 'Phoenix Feather', wood: 'Poplar', length: '13½"' } },
  // MODIFIED: Removed 'Dragon Core & Poplar Wood' wand as requested.
];

export const brooms: Product[] = [
  { id: 'b1', name: 'Nimbus 2000', description: 'The fastest broom of its time, featuring a sleek mahogany handle and perfectly aligned tail twigs.', price: 35, category: 'brooms', image: nimbus2000Img, rarity: 'rare', details: { speed: '100 mph', make: 'Nimbus Racing Broom Company', year: '1991' } },
  { id: 'b2', name: 'Firebolt', description: 'The supreme racing broom. Streamline ash handle with diamond-hard polish and aerodynamic birch twigs.', price: 75, category: 'brooms', image: fireboltImg, rarity: 'legendary', details: { speed: '150 mph', make: 'Randolph Spudmore', year: '1993' } },
  { id: 'b3', name: 'Comet 260', description: 'A reliable broom known for sharp cornering and steady acceleration. Perfect for young flyers.', price: 18, category: 'brooms', image: '', details: { speed: '70 mph', make: 'Comet Trading Company', year: '1989' } },
  { id: 'b4', name: 'Cleansweep Eleven', description: 'Smooth handling and decent speed for recreational and amateur Quidditch use.', price: 22, category: 'brooms', image: '', details: { speed: '80 mph', make: 'Cleansweep Broom Company', year: '1995' } },
  { id: 'b5', name: 'Nimbus 2001', description: 'Faster acceleration and sleeker design than the Nimbus 2000. A broom fit for champions.', price: 45, category: 'brooms', image: '', rarity: 'rare', details: { speed: '120 mph', make: 'Nimbus Racing Broom Company', year: '1992' } },
];

export const books: Product[] = [
  // MODIFIED: Reordered the book section to showcase 'Fantastic Beasts' and 'Dark Arts' first.
  { id: 'bk5', name: 'Fantastic Beasts & Where to Find Them', description: 'An indispensable guide to magical creatures from Acromantulas to Thestrals.', price: 4, category: 'books', image: fantasticBeastsImg, details: { type: 'Creatures', author: 'Newt Scamander' } }, // MODIFIED: Updated image
  // MODIFIED: Updated image for 'Secrets of the Darkest Art' to the newly generated one.
  { id: 'bk4', name: 'Secrets of the Darkest Art', description: 'A forbidden tome containing knowledge of the most terrible dark magic, including Horcruxes.', price: 25, category: 'books', image: newDarkArtsImg, rarity: 'legendary', details: { type: 'Dark Arts', author: 'Owle Bullock' } },
  { id: 'bk2', name: 'The Standard Book of Spells', description: 'The definitive reference for all basic charms and enchantments.', price: 3, category: 'books', image: standardSpellsImg, details: { type: 'Charms', author: 'Miranda Goshawk' } }, // MODIFIED: Updated image
  { id: 'bk3', name: 'Defensive Magical Theory', description: 'A comprehensive guide to the principles of magical self-defence.', price: 4, category: 'books', image: defensiveTheoryImg, details: { type: 'Defense', author: 'Wilbert Slinkhard' } }, // MODIFIED: Updated image
  { id: 'bk1', name: 'Advanced Potion Making', description: 'Contains sophisticated potion recipes and the secret annotations of the Half-Blood Prince.', price: 5, category: 'books', image: advancedPotionsImg, details: { type: 'Potions', author: 'Libatius Borage' } },
];

export const potions: Product[] = [
  { id: 'p1', name: 'Polyjuice Potion', description: 'Transforms the drinker into the physical form of another person for exactly one hour.', price: 12, category: 'potions', image: polyjuiceImg, rarity: 'rare', details: { effect: 'Transformation', duration: '1 hour' } },
  { id: 'p2', name: 'Felix Felicis', description: 'Also known as "Liquid Luck." Grants extraordinary good fortune for a period of time.', price: 30, category: 'potions', image: felixImg, rarity: 'legendary', details: { effect: 'Luck Enhancement', duration: '12 hours' } },
  { id: 'p3', name: 'Healing Potion', description: 'A restorative draught that mends minor wounds and alleviates pain.', price: 3, category: 'potions', image: '', details: { effect: 'Healing', duration: 'Instant' } },
  { id: 'p4', name: 'Amortentia', description: 'The most powerful love potion in existence. Smells differently to each person.', price: 20, category: 'potions', image: '', rarity: 'rare', details: { effect: 'Infatuation', duration: '24 hours' } },
  { id: 'p5', name: 'Draught of Living Death', description: 'An extremely powerful sleeping draught that sends the drinker into a death-like slumber.', price: 15, category: 'potions', image: '', rarity: 'rare', details: { effect: 'Deep Sleep', duration: 'Indefinite' } },
  { id: 'p6', name: 'Wolfsbane Potion', description: 'Allows a werewolf to retain their human mind during transformation.', price: 18, category: 'potions', image: '', rarity: 'rare', details: { effect: 'Werewolf Control', duration: '1 full moon' } },
];

export const robes: Product[] = [
  { id: 'r1', name: 'Gryffindor House Robes', description: 'Fine black robes with the Gryffindor lion crest in scarlet and gold. Warming charms woven in.', price: 10, category: 'robes', image: gryffindorImg, details: { house: 'Gryffindor', fabric: 'Enchanted Cotton', colors: 'Scarlet & Gold' } },
  { id: 'r2', name: 'Slytherin House Robes', description: 'Elegant dark robes bearing the silver serpent. Resistant to most minor hexes.', price: 10, category: 'robes', image: '', details: { house: 'Slytherin', fabric: 'Hex-Resistant Silk', colors: 'Emerald & Silver' } },
  { id: 'r3', name: 'Ravenclaw House Robes', description: 'Distinguished blue-trimmed robes with focus charm to aid concentration.', price: 10, category: 'robes', image: '', details: { house: 'Ravenclaw', fabric: 'Focus-Enchanted Wool', colors: 'Blue & Bronze' } },
  { id: 'r4', name: 'Hufflepuff House Robes', description: 'Warm and comfortable robes known for durability during long days of Herbology.', price: 10, category: 'robes', image: '', details: { house: 'Hufflepuff', fabric: 'Comfort-Charmed Linen', colors: 'Yellow & Black' } },
  { id: 'r5', name: 'Invisibility Cloak', description: 'An extraordinarily rare cloak that renders the wearer completely invisible. A Deathly Hallow.', price: 100, category: 'robes', image: invisibilityImg, rarity: 'legendary', details: { type: 'Cloak', fabric: 'Demiguise Hair', special: 'True Invisibility' } },
  { id: 'r6', name: 'Dress Robes (Formal)', description: 'Elegant formal wizarding attire for the Yule Ball. Midnight blue velvet with silver stars.', price: 15, category: 'robes', image: '', details: { type: 'Formal', fabric: 'Enchanted Velvet', colors: 'Midnight Blue & Silver' } },
];

// 5. HELPER COLLECTIONS
// We use the spread operator (...) to combine all our individual product arrays into one giant shopping catalog!
export const allProducts: Product[] = [...wands, ...brooms, ...books, ...potions, ...robes];

// This object maps the programmatic category keys to human-readable labels for the UI
export const categoryLabels: Record<Category, string> = {
  wands: 'Wands',
  brooms: 'Brooms',
  books: 'Spell Books',
  potions: 'Potions',
  robes: 'Robes',
};

// This object provides titles and subtitles for each category's shop page
export const categoryTitles: Record<Category, { title: string; subtitle: string }> = {
  wands: { title: "Ollivander's Wand Shop", subtitle: 'The wand chooses the wizard, Mr. Potter' },
  brooms: { title: 'Broomsticks Emporium', subtitle: 'Quality racing brooms for every witch and wizard' },
  books: { title: 'Ancient Spell Books', subtitle: 'Knowledge is the most powerful magic of all' },
  potions: { title: 'Potion Supplies & Elixirs', subtitle: 'Carefully brewed for the discerning witch or wizard' },
  robes: { title: 'Wizarding Robes & Attire', subtitle: 'Dress for the magical occasion' },
};

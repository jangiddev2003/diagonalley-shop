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
import monsterBookImg from '@/assets/books/monster_book.png';
import aHistoryOfMagicImg from '@/assets/books/a_history_of_magic.png';
import talesOfBeedleTheBardImg from '@/assets/books/tales_of_beedle_the_bard.png';

// Potion images
import polyjuiceImg from '@/assets/potions/polyjuice_potion.png';
import felixImg from '@/assets/potions/felix_felicis.png';
import healingPotionImg from '@/assets/potions/healing_potion.png';
import amortentiaImg from '@/assets/potions/amortentia.png';
import livingDeathImg from '@/assets/potions/draught_of_living_death.png';
import wolfsbaneImg from '@/assets/potions/wolfsbane_potion.png';

// Robe images
import gryffindorImg from '@/assets/robes/gryffindor_robes.png';
import slytherinImg from '@/assets/robes/slytherin_robes.png';
import ravenclawImg from '@/assets/robes/ravenclaw_robes.png';
import hufflepuffImg from '@/assets/robes/hufflepuff_robes.png';
import invisibilityImg from '@/assets/robes/invisibility-cloak.jpg';
import dressRobesImg from '@/assets/robes/dress_robes.png';
import dementorImg from '@/assets/robes/dementors_cloak_1.png';

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
  { id: 'bk8', name: 'The Tales of Beedle the Bard', description: 'A collection of popular fairy tales written for young wizards and witches, including the tale of the Deathly Hallows.', price: 30, category: 'books', image: talesOfBeedleTheBardImg, rarity: 'rare', details: { type: 'Fairy Tales', author: 'Beedle the Bard' } },
  { id: 'bk7', name: 'A History of Magic', description: 'A comprehensive history of the magical world, covering the most significant events from ancient times to the late 19th century.', price: 25, category: 'books', image: aHistoryOfMagicImg, rarity: 'rare', details: { type: 'History', author: 'Bathilda Bagshot' } },
  { id: 'bk6', name: 'The Monster Book of Monsters', description: 'A particularly vicious textbook that requires a specialized stroke down its spine to open without being bitten.', price: 30, category: 'books', image: monsterBookImg, rarity: 'rare', details: { type: 'Care of Magical Creatures', author: 'Edwardus Lima' } },
  { id: 'bk5', name: 'Fantastic Beasts & Where to Find Them', description: 'An indispensable guide to magical creatures from Acromantulas to Thestrals.', price: 20, category: 'books', image: fantasticBeastsImg, details: { type: 'Creatures', author: 'Newt Scamander' } }, // MODIFIED: Updated image
  // MODIFIED: Updated image for 'Secrets of the Darkest Art' to the newly generated one.
  { id: 'bk4', name: 'Secrets of the Darkest Art', description: 'A forbidden tome containing knowledge of the most terrible dark magic, including Horcruxes.', price: 40, category: 'books', image: newDarkArtsImg, rarity: 'legendary', details: { type: 'Dark Arts', author: 'Owle Bullock' } },
  { id: 'bk2', name: 'The Standard Book of Spells', description: 'The definitive reference for all basic charms and enchantments.', price: 28, category: 'books', image: standardSpellsImg, details: { type: 'Charms', author: 'Miranda Goshawk' } }, // MODIFIED: Updated image
  { id: 'bk3', name: 'Defensive Magical Theory', description: 'A comprehensive guide to the principles of magical self-defence.', price: 25, category: 'books', image: defensiveTheoryImg, details: { type: 'Defense', author: 'Wilbert Slinkhard' } }, // MODIFIED: Updated image
  { id: 'bk1', name: 'Advanced Potion Making', description: 'Contains sophisticated potion recipes and the secret annotations of the Half-Blood Prince.', price: 20, category: 'books', image: advancedPotionsImg, details: { type: 'Potions', author: 'Libatius Borage' } },
];

export const potions: Product[] = [
  { id: 'p1', name: 'Polyjuice Potion', description: 'Polyjuice Potion: A complex, time-consuming concoction that allows the drinker to assume the physical appearance of another person.', price: 50, category: 'potions', image: polyjuiceImg, rarity: 'rare', details: { effect: 'Transformation', duration: '1 hour' } },
  { id: 'p2', name: 'Felix Felicis', description: 'Felix Felicis: Commonly known as Liquid Luck, this exceptionally difficult potion makes the drinker lucky for a period of time.', price: 100, category: 'potions', image: felixImg, rarity: 'legendary', details: { effect: 'Luck Enhancement', duration: '12 hours' } },
  { id: 'p4', name: 'Amortentia', description: "Amortentia: The world's most powerful love potion. It causes powerful infatuation or obsession, and its aroma is unique to every individual.", price: 80, category: 'potions', image: amortentiaImg, rarity: 'rare', details: { effect: 'Infatuation', duration: '24 hours' } },
  { id: 'p5', name: 'Draught of Living Death', description: 'Draught of Living Death: An extremely powerful sleeping draught that sends the drinker into a death-like slumber, requiring immense skill to brew.', price: 60, category: 'potions', image: livingDeathImg, rarity: 'rare', details: { effect: 'Deep Sleep', duration: 'Indefinite' } },
  { id: 'p6', name: 'Wolfsbane Potion', description: 'Wolfsbane Potion: A complex and toxic potion that relieves the symptoms of lycanthropy, allowing a werewolf to retain their human mind.', price: 70, category: 'potions', image: wolfsbaneImg, rarity: 'rare', details: { effect: 'Werewolf Control', duration: '1 full moon' } },
  { id: 'p3', name: 'Healing Potion', description: 'Healing Potion: A vital restorative draught used across the wizarding world to instantly mend minor wounds and stop bleeding.', price: 40, category: 'potions', image: healingPotionImg, rarity: 'rare', details: { effect: 'Healing', duration: 'Instant' } },
];

export const robes: Product[] = [
  { id: 'r1', name: 'Gryffindor House Robes', description: 'Gryffindor House Robes: Fine dark robes adorned with the proud lion crest in scarlet and gold. Protective warming charms are woven directly into the fabric.', price: 45, category: 'robes', image: gryffindorImg, rarity: 'rare', details: { house: 'Gryffindor', fabric: 'Enchanted Cotton', colors: 'Scarlet & Gold' } },
  { id: 'r2', name: 'Slytherin House Robes', description: 'Slytherin House Robes: Elegant, smart-cut dark robes bearing the silver serpent. Forged with an emerald lining that is highly resistant to minor jinxes and hexes.', price: 50, category: 'robes', image: slytherinImg, rarity: 'rare', details: { house: 'Slytherin', fabric: 'Hex-Resistant Silk', colors: 'Emerald & Silver' } },
  { id: 'r3', name: 'Ravenclaw House Robes', description: 'Ravenclaw House Robes: Distinguished dark robes sporting the bronze eagle crest. Includes a subtle focus charm woven into the deep blue trim to aid concentration.', price: 45, category: 'robes', image: ravenclawImg, rarity: 'rare', details: { house: 'Ravenclaw', fabric: 'Focus-Enchanted Wool', colors: 'Blue & Bronze' } },
  { id: 'r4', name: 'Hufflepuff House Robes', description: 'Hufflepuff House Robes: Warm and famously comfortable dark robes bearing the loyal badger crest. Renowned for their immense durability and stain resistance.', price: 40, category: 'robes', image: hufflepuffImg, rarity: 'rare', details: { house: 'Hufflepuff', fabric: 'Comfort-Charmed Linen', colors: 'Yellow & Black' } },
  { id: 'r5', name: 'Invisibility Cloak', description: 'Invisibility Cloak: The legendary Deathly Hallow. A flawlessly spun cloak made of pure Demiguise hair that renders the wearer perfectly and permanently invisible.', price: 100, category: 'robes', image: invisibilityImg, rarity: 'legendary', details: { type: 'Cloak', fabric: 'Demiguise Hair', special: 'True Invisibility' } },
  { id: 'r6', name: "Dementor's Cloak", description: "Dementor's Cloak: A terrifyingly authentic, distressed dark cloak inspired by the guards of Azkaban. Enchanted to billow ominously and radiate a subtle aura of chilling cold.", price: 65, category: 'robes', image: dementorImg, rarity: 'rare', details: { type: 'Cloak', fabric: 'Cursed Silk', special: 'Chilling Aura' } },
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

export type Category = 'wands' | 'brooms' | 'books' | 'potions' | 'robes';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rarity?: 'common' | 'rare' | 'legendary';
  details?: Record<string, string>;
}

// Wand products
import harryWand from '@/assets/wands/harry-potter-wand.jpg';
import hermioneWand from '@/assets/wands/hermione-wand.jpg';
import elderWand from '@/assets/wands/elder-wand.jpg';
import voldemortWand from '@/assets/wands/voldemort-wand.jpg';
import ronWand from '@/assets/wands/ron-wand.jpg';

// Wand products — iconic Harry Potter wands first, then generic combinations
export const wands: Product[] = [
  { id: 'w-harry', name: "Harry Potter's Wand", description: 'Holly wood with a phoenix feather core. The brother wand to Voldemort\'s — chose Harry in Ollivander\'s shop and served him faithfully through every battle.', price: 20, category: 'wands', image: harryWand, rarity: 'legendary', details: { core: 'Phoenix Feather', wood: 'Holly', length: '11"', owner: 'Harry Potter' } },
  { id: 'w-hermione', name: "Hermione Granger's Wand", description: 'Vine wood with a dragon heartstring core. Perfect for a witch of exceptional brilliance — excels at precise, complex spellwork.', price: 18, category: 'wands', image: hermioneWand, rarity: 'legendary', details: { core: 'Dragon Heartstring', wood: 'Vine', length: '10¾"', owner: 'Hermione Granger' } },
  { id: 'w-ron', name: "Ron Weasley's Wand", description: 'Willow wood with a unicorn hair core. A loyal wand for a loyal friend — performs best when its owner shows true courage.', price: 14, category: 'wands', image: ronWand, rarity: 'rare', details: { core: 'Unicorn Hair', wood: 'Willow', length: '14"', owner: 'Ron Weasley' } },
  { id: 'w-elder', name: 'The Elder Wand', description: 'Elder wood with a thestral tail hair core. The most powerful wand in existence — one of the three Deathly Hallows. Its allegiance must be won.', price: 50, category: 'wands', image: elderWand, rarity: 'legendary', details: { core: 'Thestral Tail Hair', wood: 'Elder', length: '15"', owner: 'Albus Dumbledore' } },
  { id: 'w-voldemort', name: "Voldemort's Wand", description: 'Yew wood with a phoenix feather core. A wand of terrible power — the twin core to Harry Potter\'s wand, forged for dark ambition.', price: 25, category: 'wands', image: voldemortWand, rarity: 'legendary', details: { core: 'Phoenix Feather', wood: 'Yew', length: '13½"', owner: 'Tom Riddle' } },
  { id: 'w1', name: 'Unicorn Core & Sycamore Wood', description: 'A wand of great versatility, favoured by those who seek adventure. The sycamore wood craves stimulation and new experiences.', price: 7, category: 'wands', image: '', rarity: 'common', details: { core: 'Unicorn Hair', wood: 'Sycamore', length: '11¾"' } },
  { id: 'w2', name: 'Unicorn Core & Laurel Wood', description: 'A wand that cannot tolerate laziness in its owner. Laurel wands are said to issue a spontaneous lightning bolt if another witch or wizard attempts to steal it.', price: 7, category: 'wands', image: '', rarity: 'common', details: { core: 'Unicorn Hair', wood: 'Laurel', length: '12"' } },
  { id: 'w3', name: 'Dragon Core & Sycamore Wood', description: 'A powerful combination producing flashy spells. The dragon heartstring core gives this wand a fiery temperament.', price: 8, category: 'wands', image: '', rarity: 'common', details: { core: 'Dragon Heartstring', wood: 'Sycamore', length: '10¾"' } },
  { id: 'w4', name: 'Phoenix Core & Sycamore Wood', description: 'A wand of great range and loyalty. Phoenix feather cores are the rarest and most capable of the greatest range of magic.', price: 9, category: 'wands', image: '', rarity: 'common', details: { core: 'Phoenix Feather', wood: 'Sycamore', length: '13"' } },
  { id: 'w5', name: 'Unicorn Core & Alder Wood', description: 'An unyielding wand best suited for non-verbal spell work. Alder is an excellent wood for protective magic.', price: 7, category: 'wands', image: '', rarity: 'common', details: { core: 'Unicorn Hair', wood: 'Alder', length: '11"' } },
  { id: 'w6', name: 'Unicorn Core & Vine Wood', description: 'A wand drawn to witches and wizards who seek a greater purpose. Vine wands emit magical effects upon first meeting their match.', price: 8, category: 'wands', image: '', rarity: 'common', details: { core: 'Unicorn Hair', wood: 'Vine', length: '10½"' } },
  { id: 'w7', name: 'Phoenix Core & Laurel Wood', description: 'A magnificent wand capable of powerful defensive magic. This rare pairing creates wands of extraordinary loyalty.', price: 10, category: 'wands', image: '', rarity: 'common', details: { core: 'Phoenix Feather', wood: 'Laurel', length: '12¼"' } },
  { id: 'w8', name: 'Dragon Core & Laurel Wood', description: 'A fierce wand that excels at combative magic. The dragon core amplifies the laurel wood\'s natural affinity for glory.', price: 9, category: 'wands', image: '', rarity: 'common', details: { core: 'Dragon Heartstring', wood: 'Laurel', length: '11½"' } },
  { id: 'w9', name: 'Unicorn Core & Redwood', description: 'A wand said to bring good fortune to its owner. Redwood is prized for its beauty and reputation for lucky casting.', price: 8, category: 'wands', image: '', rarity: 'common', details: { core: 'Unicorn Hair', wood: 'Redwood', length: '12½"' } },
  { id: 'w10', name: 'Unicorn Core & Hazel Wood', description: 'A sensitive wand that reflects the emotional state of its owner. Hazel wands are so devoted they may wilt at the end of their master\'s life.', price: 7, category: 'wands', image: '', rarity: 'common', details: { core: 'Unicorn Hair', wood: 'Hazel', length: '11¼"' } },
  { id: 'w11', name: 'Phoenix Core & Poplar Wood', description: 'An exceptionally rare pairing. Poplar wands choose wizards of great moral integrity, and the phoenix core ensures incredible power.', price: 15, category: 'wands', image: '', rarity: 'rare', details: { core: 'Phoenix Feather', wood: 'Poplar', length: '13½"' } },
  { id: 'w12', name: 'Dragon Core & Poplar Wood', description: 'A volatile and powerful rare wand. The dragon heartstring paired with poplar creates a wand of immense raw magical force.', price: 14, category: 'wands', image: '', rarity: 'rare', details: { core: 'Dragon Heartstring', wood: 'Poplar', length: '12¾"' } },
  { id: 'w13', name: 'Unicorn Core & Poplar Wood', description: 'A rare and reliable wand known for consistent performance. The unicorn core tempers the poplar\'s rigidity with flexibility.', price: 12, category: 'wands', image: '', rarity: 'rare', details: { core: 'Unicorn Hair', wood: 'Poplar', length: '11¾"' } },
];

export const brooms: Product[] = [
  { id: 'b1', name: 'Nimbus 2000', description: 'The fastest broom of its time, featuring a sleek mahogany handle and perfectly aligned tail twigs. A favourite among professional Quidditch players.', price: 35, category: 'brooms', image: '', details: { speed: '100 mph', make: 'Nimbus Racing Broom Company', year: '1991' } },
  { id: 'b2', name: 'Firebolt', description: 'The supreme racing broom. Streamline, superfine handle of ash treated with diamond-hard polish. Each individually selected birch twig honed to aerodynamic perfection.', price: 75, category: 'brooms', image: '', rarity: 'legendary', details: { speed: '150 mph', make: 'Randolph Spudmore', year: '1993' } },
  { id: 'b3', name: 'Comet 260', description: 'A reliable broom from the Comet Trading Company. Known for its sharp cornering and steady acceleration. Perfect for young flyers.', price: 18, category: 'brooms', image: '', details: { speed: '70 mph', make: 'Comet Trading Company', year: '1989' } },
  { id: 'b4', name: 'Cleansweep Eleven', description: 'The latest model from the Cleansweep Broom Company. Offers smooth handling and decent speed for recreational and amateur Quidditch use.', price: 22, category: 'brooms', image: '', details: { speed: '80 mph', make: 'Cleansweep Broom Company', year: '1995' } },
  { id: 'b5', name: 'Nimbus 2001', description: 'The successor to the legendary Nimbus 2000, boasting faster acceleration and a sleeker design. A broom fit for champions.', price: 45, category: 'brooms', image: '', rarity: 'rare', details: { speed: '120 mph', make: 'Nimbus Racing Broom Company', year: '1992' } },
];

export const books: Product[] = [
  { id: 'bk1', name: 'Advanced Potion Making', description: 'Contains sophisticated potion recipes and the secret annotations of the Half-Blood Prince. A treasure trove of brewing knowledge.', price: 5, category: 'books', image: '', details: { type: 'Potions', author: 'Libatius Borage' } },
  { id: 'bk2', name: 'The Standard Book of Spells', description: 'The definitive reference for all basic charms and enchantments. Required reading for every Hogwarts student from first year onward.', price: 3, category: 'books', image: '', details: { type: 'Charms', author: 'Miranda Goshawk' } },
  { id: 'bk3', name: 'Defensive Magical Theory', description: 'A comprehensive guide to the principles of magical self-defence. Covers shield charms, counter-jinxes, and protective enchantments.', price: 4, category: 'books', image: '', details: { type: 'Defense', author: 'Wilbert Slinkhard' } },
  { id: 'bk4', name: 'Secrets of the Darkest Art', description: 'A forbidden tome containing knowledge of the most terrible dark magic, including the creation of Horcruxes. Handle with extreme caution.', price: 25, category: 'books', image: '', rarity: 'legendary', details: { type: 'Dark Arts', author: 'Owle Bullock' } },
  { id: 'bk5', name: 'Fantastic Beasts & Where to Find Them', description: 'An indispensable guide to magical creatures. From Acromantulas to Thestrals, discover the wizarding world\'s most fascinating beasts.', price: 4, category: 'books', image: '', details: { type: 'Creatures', author: 'Newt Scamander' } },
];

export const potions: Product[] = [
  { id: 'p1', name: 'Polyjuice Potion', description: 'Transforms the drinker into the physical form of another person for exactly one hour. Requires a piece of the target person.', price: 12, category: 'potions', image: '', rarity: 'rare', details: { effect: 'Transformation', duration: '1 hour' } },
  { id: 'p2', name: 'Felix Felicis', description: 'Also known as "Liquid Luck." Grants the drinker extraordinary good fortune for a period of time. Highly toxic in large doses.', price: 30, category: 'potions', image: '', rarity: 'legendary', details: { effect: 'Luck Enhancement', duration: '12 hours' } },
  { id: 'p3', name: 'Healing Potion', description: 'A restorative draught that mends minor wounds and alleviates pain. A staple of every witch and wizard\'s medicine cabinet.', price: 3, category: 'potions', image: '', details: { effect: 'Healing', duration: 'Instant' } },
  { id: 'p4', name: 'Amortentia', description: 'The most powerful love potion in existence. Creates a powerful infatuation or obsession. Smells differently to each person.', price: 20, category: 'potions', image: '', rarity: 'rare', details: { effect: 'Infatuation', duration: '24 hours' } },
  { id: 'p5', name: 'Draught of Living Death', description: 'An extremely powerful sleeping draught that sends the drinker into a death-like slumber. Only the most skilled brewers should attempt it.', price: 15, category: 'potions', image: '', rarity: 'rare', details: { effect: 'Deep Sleep', duration: 'Indefinite' } },
  { id: 'p6', name: 'Wolfsbane Potion', description: 'Allows a werewolf to retain their human mind during transformation. Must be taken each day in the week preceding the full moon.', price: 18, category: 'potions', image: '', rarity: 'rare', details: { effect: 'Werewolf Control', duration: '1 full moon' } },
];

export const robes: Product[] = [
  { id: 'r1', name: 'Gryffindor House Robes', description: 'Fine black robes emblazoned with the Gryffindor lion crest in scarlet and gold. Made from the finest enchanted cotton with warming charms woven in.', price: 10, category: 'robes', image: '', details: { house: 'Gryffindor', fabric: 'Enchanted Cotton', colors: 'Scarlet & Gold' } },
  { id: 'r2', name: 'Slytherin House Robes', description: 'Elegant dark robes bearing the silver serpent of Slytherin house. The fabric has a subtle sheen and is resistant to most minor hexes.', price: 10, category: 'robes', image: '', details: { house: 'Slytherin', fabric: 'Hex-Resistant Silk', colors: 'Emerald & Silver' } },
  { id: 'r3', name: 'Ravenclaw House Robes', description: 'Distinguished blue-trimmed robes with the eagle crest of Ravenclaw. Enchanted with a mild focus charm to aid in concentration during study.', price: 10, category: 'robes', image: '', details: { house: 'Ravenclaw', fabric: 'Focus-Enchanted Wool', colors: 'Blue & Bronze' } },
  { id: 'r4', name: 'Hufflepuff House Robes', description: 'Warm and comfortable robes with the Hufflepuff badger crest. Known for their durability and comfort during long days of Herbology.', price: 10, category: 'robes', image: '', details: { house: 'Hufflepuff', fabric: 'Comfort-Charmed Linen', colors: 'Yellow & Black' } },
  { id: 'r5', name: 'Invisibility Cloak', description: 'An extraordinarily rare cloak that renders the wearer completely invisible. One of the three legendary Deathly Hallows.', price: 100, category: 'robes', image: '', rarity: 'legendary', details: { type: 'Cloak', fabric: 'Demiguise Hair', special: 'True Invisibility' } },
  { id: 'r6', name: 'Dress Robes (Formal)', description: 'Elegant formal wizarding attire suitable for the Yule Ball and other grand occasions. Features midnight blue velvet with silver star embroidery.', price: 15, category: 'robes', image: '', details: { type: 'Formal', fabric: 'Enchanted Velvet', colors: 'Midnight Blue & Silver' } },
];

export const allProducts: Product[] = [...wands, ...brooms, ...books, ...potions, ...robes];

export const categoryLabels: Record<Category, string> = {
  wands: '🪄 Wands',
  brooms: '🧹 Brooms',
  books: '📚 Spell Books',
  potions: '🧪 Potions',
  robes: '🧙 Robes',
};

export const categoryTitles: Record<Category, { title: string; subtitle: string }> = {
  wands: { title: "Ollivander's Wand Shop", subtitle: 'The wand chooses the wizard, Mr. Potter' },
  brooms: { title: 'Broomsticks Emporium', subtitle: 'Quality racing brooms for every witch and wizard' },
  books: { title: 'Ancient Spell Books', subtitle: 'Knowledge is the most powerful magic of all' },
  potions: { title: 'Potion Supplies & Elixirs', subtitle: 'Carefully brewed for the discerning witch or wizard' },
  robes: { title: 'Wizarding Robes & Attire', subtitle: 'Dress for the magical occasion' },
};

// 1. IMPORTS
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner'; // A library for showing the little notification pop-ups
import { Sparkles, X } from 'lucide-react';

// 2. INTERFACES
interface SpellQuizProps {
  spellName: string; // The specific spell we want to quiz the user about right now
  onClose: () => void; // A function to run when closing the modal
}

// 3. STATIC DATA DICTIONARY
// This is an object where the "Keys" are spell names, and the "Values" are the questions & answers
// Using a Record<string, Object> pattern is much faster than searching through a giant Array!
const quizData: Record<string, { question: string; options: string[]; correct: number }> = {
  'Expelliarmus': { question: 'What does Expelliarmus do?', options: ['Disarms opponent', 'Creates fire', 'Unlocks doors', 'Summons objects'], correct: 0 },
  'Wingardium Leviosa': { question: 'What does Wingardium Leviosa do?', options: ['Teleports objects', 'Makes objects levitate', 'Creates light', 'Stuns target'], correct: 1 },
  'Accio': { question: 'What is Accio used for?', options: ['Repelling enemies', 'Healing wounds', 'Summoning objects', 'Creating shields'], correct: 2 },
  'Lumos': { question: 'What does Lumos produce?', options: ['Fire', 'Water', 'Light from wand tip', 'A patronus'], correct: 2 },
  'Nox': { question: 'What does Nox do?', options: ['Creates darkness everywhere', 'Extinguishes wand light', 'Makes you invisible', 'Puts target to sleep'], correct: 1 },
  'Expecto Patronum': { question: 'What does Expecto Patronum conjure?', options: ['A shield', 'A spirit guardian', 'A ball of fire', 'An illusion'], correct: 1 },
  'Alohomora': { question: 'What does Alohomora do?', options: ['Locks doors', 'Creates barriers', 'Opens locked doors', 'Reveals hidden objects'], correct: 2 },
  'Riddikulus': { question: 'Riddikulus is used against which creature?', options: ['Dementors', 'Boggarts', 'Dragons', 'Werewolves'], correct: 1 },
  'Stupefy': { question: 'What effect does Stupefy have?', options: ['Kills the target', 'Stuns the target unconscious', 'Confuses the target', 'Freezes the target'], correct: 1 },
  'Protego': { question: 'What does Protego create?', options: ['An attack spell', 'A magical barrier', 'A potion', 'An illusion'], correct: 1 },
  'Obliviate': { question: 'What does Obliviate erase?', options: ['Magic power', 'Memories', 'Physical wounds', 'Enchantments'], correct: 1 },
  'Petrificus Totalus': { question: 'What does Petrificus Totalus cause?', options: ['Turns target to stone', 'Full body paralysis', 'Explosive force', 'Memory loss'], correct: 1 },
};

// 4. MAIN COMPONENT
const SpellQuiz = ({ spellName, onClose }: SpellQuizProps) => {
  // STATE: Keeps track of which specific button index (0, 1, 2, or 3) they clicked
  const [selected, setSelected] = useState<number | null>(null);
  
  // STATE: A boolean to freeze the quiz so they can't click twice
  const [answered, setAnswered] = useState(false);

  // LOGIC: Look up the quiz question data randomly based on the incoming prop!
  const quiz = quizData[spellName];
  if (!quiz) return null; // Safe fallback: If no quiz matches, just render nothing and exit.

  // LOGIC: Triggers the moment a user clicks an answer button
  const handleAnswer = (idx: number) => {
    // If they already answered, ignore all further clicks
    if (answered) return;
    
    // Save their choice to state and permanently lock the Quiz
    setSelected(idx);
    setAnswered(true);

    // Did they click the right button index?
    if (idx === quiz.correct) {
      // WIN LOGIC!
      // Grab whatever discount they had previously saved (defaults to '0')
      const existing = Number(sessionStorage.getItem('spell-discount') || '0');
      // Update their browser's sessionStorage with +2% more discount
      sessionStorage.setItem('spell-discount', String(existing + 2));
      
      // Fire a green success toast notification
      toast.success('Correct! +2% discount added to your cart! 🎉');
    } else {
      // LOSE LOGIC :(
      // Fire a red error toast notification
      toast.error('Wrong answer! The correct spell knowledge eludes you... 🔮');
    }
  };

  return (
    // fixed screen overlay that blurs whatever page holds the quiz
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative max-w-md w-full rounded-2xl border border-primary/50 bg-card p-6 animate-fade-in glow-gold">
        
        {/* The Close X Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">Spell Quiz</h3>
        </div>

        <p className="font-medieval text-sm text-muted-foreground mb-1">Answer correctly for +2% discount!</p>
        
        {/* Render the specific question loaded from our Dictionary */}
        <p className="font-display text-sm font-semibold text-foreground mb-4">{quiz.question}</p>

        {/* Render out the 4 possible options using a .map loop */}
        <div className="space-y-2">
          {quiz.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)} // Pass the ID up!
              disabled={answered} // Lock the button if ANY answer was already given
              // DYNAMIC CSS CLASSES based on quiz state:
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-body transition-all ${
                // Condition A: Quiz is over AND this specific button is the correct answer. Pains it GREEN.
                answered && idx === quiz.correct
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                // Condition B: Quiz is over AND user clicked THIS button, but it was wrong. Paints it RED.
                  : answered && idx === selected && idx !== quiz.correct
                  ? 'border-destructive bg-destructive/10 text-destructive'
                // Condition C: Default resting state before click!
                  : 'border-border hover:border-primary/50 text-foreground hover:bg-muted'
              } disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Only show the "Continue" button AFTER they've made a guess */}
        {answered && (
          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all"
          >
            Continue ✨
          </button>
        )}
      </div>
    </div>
  );
};

export default SpellQuiz;

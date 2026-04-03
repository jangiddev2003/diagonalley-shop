import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { Sparkles, X } from 'lucide-react';

interface SpellQuizProps {
  spellName: string;
  onClose: () => void;
}

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

const SpellQuiz = ({ spellName, onClose }: SpellQuizProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const quiz = quizData[spellName];
  if (!quiz) return null;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);

    if (idx === quiz.correct) {
      // Store discount
      const existing = Number(sessionStorage.getItem('spell-discount') || '0');
      sessionStorage.setItem('spell-discount', String(existing + 2));
      toast.success('Correct! +2% discount added to your cart! 🎉');
    } else {
      toast.error('Wrong answer! The correct spell knowledge eludes you... 🔮');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative max-w-md w-full rounded-2xl border border-primary/50 bg-card p-6 animate-fade-in glow-gold">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">Spell Quiz</h3>
        </div>

        <p className="font-medieval text-sm text-muted-foreground mb-1">Answer correctly for +2% discount!</p>
        <p className="font-display text-sm font-semibold text-foreground mb-4">{quiz.question}</p>

        <div className="space-y-2">
          {quiz.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-body transition-all ${
                answered && idx === quiz.correct
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : answered && idx === selected && idx !== quiz.correct
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-border hover:border-primary/50 text-foreground hover:bg-muted'
              } disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          ))}
        </div>

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

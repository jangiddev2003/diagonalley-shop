import { useState } from 'react';
import { Star, Sparkles } from 'lucide-react';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/30 bg-card p-8 text-center animate-fade-in">
        <div className="flex justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
          <span className="text-4xl">🦉</span>
          <Sparkles className="h-8 w-8 text-primary animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>
        <h3 className="font-display text-xl font-bold text-primary text-glow mb-2">
          Thank You for Your Feedback!
        </h3>
        <p className="font-body text-sm text-muted-foreground">
          Your review has been sent via Owl Post to our team. We appreciate your magical experience! ✨
        </p>
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-primary text-primary" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <h3 className="font-display text-lg font-bold text-foreground mb-1 text-center">
        ⭐ Rate Your Experience
      </h3>
      <p className="text-xs text-muted-foreground text-center mb-4 font-body">
        How was your magical shopping experience?
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-125 active:scale-95"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoveredStar || rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground/30'
                }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-xs text-primary font-display">
            {rating === 1 && 'Muggle-level experience 😐'}
            {rating === 2 && 'Could use more magic ✨'}
            {rating === 3 && 'A decent wizarding experience 🧙'}
            {rating === 4 && 'Truly magical! 🪄'}
            {rating === 5 && 'Outstanding! Worthy of Dumbledore! 🏆'}
          </p>
        )}

        {/* Review Text */}
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Share your thoughts about the magical marketplace..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
        />

        <button
          type="submit"
          disabled={rating === 0}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold hover:glow-gold-intense active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Review ✨
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;

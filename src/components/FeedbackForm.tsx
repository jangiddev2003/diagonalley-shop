// 1. IMPORTS
import { useState } from 'react';
import { Star, Sparkles } from 'lucide-react';

// 2. MAIN COMPONENT
const FeedbackForm = () => {
  // STATE DEFINITIONS
  const [rating, setRating] = useState(0); // The final rating clicked by the user (1-5)
  const [hoveredStar, setHoveredStar] = useState(0); // The star currently hovered by the mouse (used for visual preview)
  const [review, setReview] = useState(''); // What the user typed in the text box
  const [submitted, setSubmitted] = useState(false); // Controls if we show the form or the success message

  // LOGIC: Triggered when the submit button is clicked
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop page refresh
    if (rating === 0) return; // Prevent submission if no stars are clicked
    
    // Normally we would send the 'rating' and 'review' variables to a server here!
    setSubmitted(true); // Flip the layout to show the success message
  };

  // CONDITIONAL VIEW: If it's already submitted, we return a completely different HTML block!
  // This completely replaces the form below it.
  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/30 bg-card p-8 text-center animate-fade-in">
        <div className="flex justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
          <span className="text-4xl">🦉</span>
          {/* We stagger the sparkles animation with an inline style delay */}
          <Sparkles className="h-8 w-8 text-primary animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>
        <h3 className="font-display text-xl font-bold text-primary text-glow mb-2">
          Thank You for Your Feedback!
        </h3>
        <p className="font-body text-sm text-muted-foreground">
          Your review has been sent via Owl Post to our team. We appreciate your magical experience! ✨
        </p>
        
        {/* Render a row of static stars matching exactly the rating they gave! */}
        {/* Array.from creates a blank array with a length matching the user's rating (e.g. length of 4) */}
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-primary text-primary" />
          ))}
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: The actual form
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <h3 className="font-display text-lg font-bold text-foreground mb-1 text-center">
        ⭐ Rate Your Experience
      </h3>
      <p className="text-xs text-muted-foreground text-center mb-4 font-body">
        How was your magical shopping experience?
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* FIVE STAR RATING COMPONENT */}
        <div className="flex justify-center gap-2">
          {/* We map over a fixed array [1, 2, 3, 4, 5] to render 5 exact buttons */}
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button" // Important so it doesn't accidentally trigger form submission
              onClick={() => setRating(star)}            // Locks in the rating!
              onMouseEnter={() => setHoveredStar(star)} // Triggers hover preview up to this star
              onMouseLeave={() => setHoveredStar(0)}   // Clears the hover preview
              className="transition-transform hover:scale-125 active:scale-95"
            >
              <Star
                // Magic logic: Fill in the star if its number (star) is less than OR equal to
                // either the hoveredStar value OR the permanently clicked rating value!
                className={`h-8 w-8 transition-colors ${
                  star <= (hoveredStar || rating)
                    ? 'fill-primary text-primary'  // Colored star
                    : 'text-muted-foreground/30'   // Gray empty star
                }`}
              />
            </button>
          ))}
        </div>

        {/* Dynamic text changing based on which star you hovered/clicked! */}
        {rating > 0 && (
          <p className="text-center text-xs text-primary font-display">
            {rating === 1 && 'Muggle-level experience 😐'}
            {rating === 2 && 'Could use more magic ✨'}
            {rating === 3 && 'A decent wizarding experience 🧙'}
            {rating === 4 && 'Truly magical! 🪄'}
            {rating === 5 && 'Outstanding! Worthy of Dumbledore! 🏆'}
          </p>
        )}

        {/* Review Text Input */}
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Share your thoughts about the magical marketplace..."
          rows={3} // Minimum 3 lines high
          // 'resize-none' prevents the user from manually dragging the corner to resize it
          className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          // Disable the button entirely if they haven't picked a star rating yet
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

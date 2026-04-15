// 1. IMPORTS
import { Sparkles } from 'lucide-react';

// 2. MAIN COMPONENT
// This is a completely "stateless" or "dumb" component.
// It has no internal state (useState), runs no side-effects (useEffect), and doesn't load props.
// It simply returns pure HTML (JSX) structure. This makes it incredibly fast for React to render.
const Footer = () => (
  // The 'mt-16' gives it margin-top to separate it from the page content visually.
  <footer className="border-t border-border bg-background/80 py-8 mt-16">
    <div className="container mx-auto px-4 text-center space-y-4">
      
      {/* Title with icon nested inside */}
      <p className="font-medieval text-xl text-primary text-glow">
        Mischief Managed <Sparkles className="inline h-4 w-4" />
      </p>
      
      {/* Flex container to perfectly space the 3 navigational links horizontally */}
      <div className="flex justify-center gap-6 text-muted-foreground">
        <a href="#" className="hover:text-primary transition-colors text-sm font-body">Twitter</a>
        <a href="#" className="hover:text-primary transition-colors text-sm font-body">Instagram</a>
        <a href="#" className="hover:text-primary transition-colors text-sm font-body">Owl Post</a>
      </div>
      
      {/* Copyright text at the very bottom */}
      <p className="text-xs text-muted-foreground font-body">
        © 2026 Diagonally.com — A magical marketplace for witches & wizards
      </p>
      
    </div>
  </footer>
);

export default Footer;

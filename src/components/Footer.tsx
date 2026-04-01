import { Sparkles } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-background/80 py-8 mt-16">
    <div className="container mx-auto px-4 text-center space-y-4">
      <p className="font-medieval text-xl text-primary text-glow">
        Mischief Managed <Sparkles className="inline h-4 w-4" />
      </p>
      <div className="flex justify-center gap-6 text-muted-foreground">
        <a href="#" className="hover:text-primary transition-colors text-sm font-body">Twitter</a>
        <a href="#" className="hover:text-primary transition-colors text-sm font-body">Instagram</a>
        <a href="#" className="hover:text-primary transition-colors text-sm font-body">Owl Post</a>
      </div>
      <p className="text-xs text-muted-foreground font-body">
        © 2026 Diagonally.com — A magical marketplace for witches & wizards
      </p>
    </div>
  </footer>
);

export default Footer;

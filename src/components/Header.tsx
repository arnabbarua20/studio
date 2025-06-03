import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-headline font-semibold text-foreground">
            ImaginAIry Canvas
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 rounded-md text-sm font-medium shadow">
          <span>Team 4 Demo</span>
          <span className="opacity-75">|</span>
          <span>Text to Image</span>
        </div>
      </div>
    </header>
  );
}

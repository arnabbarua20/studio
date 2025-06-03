import { Header } from '@/components/Header';
import { ImageGenerator } from '@/components/ImageGenerator';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <ImageGenerator />
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground border-t">
        Team 4 Demo &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

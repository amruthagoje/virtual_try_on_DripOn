import { HandMetal } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HandMetal className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">
            DripON
          </h1>
        </div>
      </div>
    </header>
  );
}

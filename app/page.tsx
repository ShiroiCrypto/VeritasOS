import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="dossier-card max-w-2xl w-full text-center">
        <h1 className="glitch-text text-4xl md:text-6xl font-bold mb-4 text-glow">
          VERITAS<span className="text-terror-accent">OS</span>
        </h1>
        <p className="text-terror-text-secondary mb-8 text-lg">
          Ordo Realitas Management Suite
        </p>
        <p className="text-terror-text-secondary mb-12 italic">
          &quot;A verdade tem um preço. O medo é o juro.&quot;
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/master"
            className="terminal-border px-6 py-3 text-terror-text hover:bg-terror-accent/20 transition-colors"
          >
            Acesso do Mestre
          </Link>
          <Link
            href="/login"
            className="terminal-border px-6 py-3 text-terror-text hover:bg-terror-accent/20 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}


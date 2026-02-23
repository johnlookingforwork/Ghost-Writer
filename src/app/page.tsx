import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="font-serif text-4xl tracking-tight">Ghost-Writer</h1>
        <p className="text-muted text-lg leading-relaxed">
          Brain dump your thoughts. Receive three poetic letters from anonymous
          authors. Choose the voice that resonates.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-accent hover:bg-accent-dim transition-colors text-white font-medium px-8 py-3 rounded-full"
        >
          Start Writing
        </Link>
      </div>
    </div>
  );
}

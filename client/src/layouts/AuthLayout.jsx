export default function AuthLayout({ eyebrow, title, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-stamp">{eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl text-ink">{title}</h1>
        </div>

        <div className="rounded-card border border-line bg-paper-card p-8 shadow-sm">
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}
      </div>
    </div>
  );
}

import { AlertTriangle } from "lucide-react";

export function DemoBanner() {
  return (
    <div
      role="status"
      className="border-b border-gold/30 bg-night/80 px-4 py-2 text-center text-xs text-muted-foreground backdrop-blur-sm sm:text-sm"
    >
      <span className="inline-flex items-center justify-center gap-2">
        <AlertTriangle className="size-3.5 shrink-0 text-gold" aria-hidden />
        <span>
          Mode démo — inscriptions, RSVP et réglages sont stockés dans{" "}
          <strong className="font-medium text-foreground">ce navigateur</strong>{" "}
          uniquement (pas de synchronisation entre appareils).
        </span>
      </span>
    </div>
  );
}

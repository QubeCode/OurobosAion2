"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/config";
import { useGuildStore } from "@/context/guild-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { settings } = useGuildStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-night-deep/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 rounded-md"
        >
          <span
            className="flex size-9 items-center justify-center rounded-full border border-gold/50 text-gold glow-gold"
            aria-hidden
          >
            ∞
          </span>
          <span className="font-display text-lg tracking-wide text-gold sm:text-xl">
            {settings.guildName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60",
                  active
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Button
            nativeButton={false}
            render={<Link href="/inscription" />}
            className="ml-2 bg-gold text-gold-foreground hover:bg-gold/90"
            size="sm"
          >
            Rejoindre
          </Button>
        </nav>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-border/50 px-4 py-3 md:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2.5 text-sm",
                      active ? "bg-secondary text-gold" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/inscription"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-md bg-gold px-3 py-2.5 text-center text-sm font-medium text-gold-foreground"
              >
                Rejoindre la guilde
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

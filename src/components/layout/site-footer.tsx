"use client";

import Link from "next/link";
import { useGuildStore } from "@/context/guild-store";
import { SITE_META } from "@/lib/config";

export function SiteFooter() {
  const { settings } = useGuildStore();

  return (
    <footer className="mt-auto border-t border-border/50 bg-night-deep/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-gold">{settings.guildName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Guilde francophone · {SITE_META.game} · GS min. {settings.minGs}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <a
            href={settings.discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 rounded"
          >
            Discord
          </a>
          <Link
            href="/admin"
            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 rounded"
          >
            Admin
          </Link>
        </div>
      </div>
      <p className="border-t border-border/30 px-4 py-3 text-center text-xs text-muted-foreground/80">
        Site communautaire indépendant — non affilié à NCSoft / AION 2.
      </p>
    </footer>
  );
}

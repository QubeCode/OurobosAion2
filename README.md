# Ouroboros — Site guilde AION 2

Site francophone de la guilde **Ouroboros** (AION 2) : accueil, inscription, calendrier d’événements, timer Abysses et admin locale.

Stack : **Next.js** · **TypeScript** · **Tailwind CSS** · **shadcn/ui**

## Prérequis

- Node.js 20+
- npm

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre [http://127.0.0.1:43127](http://127.0.0.1:43127) (port configuré dans `package.json`).

Autres scripts :

```bash
npm run build
npm run start   # production, port 43127
npm run lint
```

## Configuration

Réglages par défaut : `src/lib/config.ts`  
Modifiables aussi via **Admin** (`/admin`) — stockés dans `localStorage` (clé `ouroboros-aion2-guild-v1`) :

| Clé / champ | Rôle |
| --- | --- |
| `discordInviteUrl` | Invitation Discord (défaut `https://discord.gg/2tkzumnv3`) |
| `timezone` | Fuseau (défaut `Europe/Paris`) |
| `minGs` | GS minimum (1400) |
| `calendar.referenceLocal` | Point de départ récurrence |
| `calendar.intervalDays` / `hour` / `minute` | Récurrence |
| `abyssesLocalOverride` | Horaire spécial timer Abysses |

## Données démo

Inscriptions, RSVP et événements spéciaux sont **locaux au navigateur** — pas de sync multi-appareils sans base de données. Les candidatures restent privées (pas d’annuaire public).

Le code est structuré pour brancher plus tard Supabase/Firebase via `src/lib/storage.ts` (`GuildDataAdapter`).

## Images

Placeholders dans `public/images/` — remplacer localement, sans assets officiels AION 2.

## Pages

- `/` — Accueil
- `/inscription` — Candidature
- `/evenements` — Calendrier + RSVP + CRUD spéciaux
- `/abysses` — Compte à rebours
- `/admin` — Réglages (lien non listé ≠ authentification)

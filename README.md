# Plomberie Rodriguez Diego — Site web

Site vitrine + prise de RDV + formulaire de devis pour Plomberie Rodriguez Diego (Port-de-Bouc, 13110).

Domaine de production : **https://plomberie-diego-rodriguez.fr**

---

front cloudflare
back fly.io

## 🏗️ Infrastructure & Services

### Frontend (`client/`)

- **Stack** : React 18 + Vite + Tailwind CSS + shadcn/ui + React Router
- **Hébergement** : =====> **Cloudflare Pages** <=======
  - URL de preview : `https://plomberiediegorodriguez.pages.dev`
  - Domaine custom : `https://plomberie-diego-rodriguez.fr`
  - Déploiement : auto à chaque `git push` sur la branche `main`
- **Générateur d'origine** : Base44 (no-code exporté en React, désormais custom-codé)

### Backend (`server/`)

- **Stack** : Node.js (ESM) + Express 4 + Multer + Nodemailer + googleapis
- **Hébergement** :  =====> **Fly.io** <=======
  - App : `rodriguez-backend`
  - URL : `https://rodriguez-backend.fly.dev`
  - Région : `cdg` (Paris)
  - Ressources : 1 vCPU / 256 MB RAM, auto-stop après inactivité
- **Déploiement** : `fly deploy` depuis `server/`

### Endpoints backend

| Route | Méthode | Rôle |
|---|---|---|
| `/healthz` | GET | Statut + configuration visible (calendar_target, notif_target, service_account) |
| `/api/test-email` | GET | Envoi d'un email de test pour debug SMTP |
| `/api/availability?date=YYYY-MM-DD` | GET | Créneaux RDV disponibles (interroge Google Calendar) |
| `/api/book-appointment` | POST | Créer un RDV dans Google Calendar |
| `/api/quote-request` | POST | Formulaire devis (multipart avec 3 photos) → email |

---

## 📧 Emailing — 2 pipelines distincts

Le projet utilise **DEUX bibliothèques d'emailing différentes**, chacune pour un usage précis.

### 1. EmailJS (frontend — usage historique)

- **Où** : `client/src/lib/emailService.js`
- **Rôle** : Envoie les demandes du formulaire Contact classique (sans photos)
- **Fonctionnement** : envoi depuis le navigateur du visiteur, via l'API EmailJS. Aucun serveur en cause.
- **Config** : dans `client/src/lib/emailService.js` (Service ID, Template ID, Public Key hardcodés)
- **Dashboard** : https://dashboard.emailjs.com
- **Limite** : ne supporte pas bien les pièces jointes lourdes → c'est pour ça qu'on a monté un 2e pipeline pour le devis avec photos.

### 2. Nodemailer + Gmail SMTP (backend — pour les devis avec photos)

- **Où** : `server/routes/quote.js`
- **Rôle** : Reçoit le formulaire de devis avec 3 photos uploadées, les attache et envoie l'email au destinataire configuré
- **Fonctionnement** : depuis le backend Fly, via Gmail SMTP (`service: "gmail"`)
- **Compte expéditeur** : `plomberie.diego.rodriguez@gmail.com`
- **Authentification** : App Password Gmail (2FA obligatoire sur le compte)
- **Nom d'expéditeur affiché** : `"Devis — Site Plomberie Rodriguez"`
- **Destinataire** : configurable via la secret Fly `NOTIF_EMAIL`
- **`replyTo`** : email du client renseigné dans le formulaire (répondre = répondre au client directement)

---

## 🔐 Variables d'environnement (secrets Fly)

Toutes gérées via `fly secrets set ... -a rodriguez-backend`. Aucune de ces valeurs n'est stockée dans le repo.

| Secret | Rôle |
|---|---|
| `GOOGLE_CALENDAR_ID` | ID du calendar où les RDV sont créés (ex: `diego.rodriguez131100@gmail.com`) |
| `GOOGLE_CLIENT_EMAIL` | Email du service account Google Cloud (`test-rodriguez@rodriguez-test.iam.gserviceaccount.com`) |
| `GOOGLE_PRIVATE_KEY` | Clé privée JSON du service account |
| `SMTP_USER` | Compte Gmail expéditeur (`plomberie.diego.rodriguez@gmail.com`) |
| `SMTP_PASS` | App Password Gmail (16 caractères, généré depuis myaccount.google.com) |
| `NOTIF_EMAIL` | Adresse qui reçoit les devis (aujourd'hui `diego.rodriguez131100@gmail.com`) |

Vérification rapide de l'état : `curl https://rodriguez-backend.fly.dev/healthz` — retourne un JSON avec statut + config visible (sans exposer les valeurs sensibles).

---

## 🗓️ Google Calendar — Prise de RDV

- **API utilisée** : Google Calendar v3 via `googleapis` (service account authentication)
- **Calendrier cible** : celui de Diego (`diego.rodriguez131100@gmail.com`)
- **Prérequis** : le calendrier de Diego doit avoir partagé l'accès au service account (`GOOGLE_CLIENT_EMAIL`) avec la permission "Apporter des modifications aux événements"
- **Créneau unique** : 11h30 → 12h30 (60 min)
- **Jours autorisés** : lundi → jeudi uniquement (backend + frontend appliquent le filtre)

---

## 🚀 Développement local

### Frontend

```bash
cd client
npm install
npm run dev
```

Ouvre `http://localhost:5173`. Note : le formulaire de devis (`/contact`) appelle le backend Fly de production, pas un backend local.

### Backend

```bash
cd server
npm install

# Créer un .env local (ne pas commiter)
cat > .env <<EOF
GOOGLE_CALENDAR_ID=...
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
SMTP_USER=...
SMTP_PASS=...
NOTIF_EMAIL=...
PORT=8080
EOF

npm start
```

### Déploiement

```bash
# Frontend : push GitHub, Cloudflare Pages auto-déploie
git push

# Backend
cd server
fly deploy
```

---

## 📁 Structure

```
PlomberieDiegoRodriguez/
├── client/                          # Frontend React (Cloudflare Pages)
│   ├── public/
│   │   ├── logo.png                 # Favicon source
│   │   ├── favicon-32.png / -192 / -512.png / .ico
│   │   ├── apple-touch-icon.png
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── images/realisations/     # Photos chantiers Diego + illustrations métiers
│   └── src/
│       ├── pages/                   # Home, Services, Realisations, Contact, Rendez-vous, etc.
│       ├── components/
│       │   ├── shared/              # BeforeAfterSlider, ServicesShowcase, ScrollManager, etc.
│       │   ├── realisations/        # FeaturedRealization, RealizationsFeed
│       │   ├── contact/             # PhotoUploadField, PhotoExampleIllustration
│       │   └── layout/              # Navbar, Footer, Layout
│       ├── hooks/                   # useScrollReveal
│       └── lib/
│           ├── business.js          # Données du business (services, zones, avis, realizations)
│           ├── emailService.js      # Wrapper EmailJS
│           └── utils.js             # slug(), cn(), etc.
└── server/                          # Backend Node/Express (Fly.io)
    ├── index.js                     # Express app + healthz + test-email
    ├── routes/
    │   ├── calendar.js              # /api/availability + /api/book-appointment
    │   └── quote.js                 # /api/quote-request (multer + nodemailer)
    ├── package.json
    ├── Dockerfile
    └── fly.toml
```


---

## 🚀 Mise en ligne (procédure de push)

Le site est hébergé à partir de GitHub (branche `main`) — front sur Cloudflare.
Pour publier une modification :

1. (facultatif) Tester en local :
   ```
   cd client && npm install && npm run dev
   ```

2. Enregistrer les modifications :
   ```
   git add .
   git commit -m "description de la modification"
   ```

3. Envoyer sur GitHub :
   ```
   git push origin main
   ```

4. Déploiement :
   - Si l'hébergement (Cloudflare Pages) est branché sur le repo, le déploiement part **automatiquement** à chaque push sur `main` — vérifie le statut (vert) dans le dashboard Cloudflare Pages.
   - Si tu passes par Base44 : ouvre Base44.com et clique **Publish**.

> Le build (`npm run build`) est réalisé par l'hébergeur : inutile de le faire en local.

Repo : https://github.com/PierrePignon/PlomberieDiegoRodriguez · branche `main`

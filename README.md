# CUNY Compass

CityTech TTP 2026 Summer capstone — Full Stack Development domain.

> **TODO:** replace this line with a short description of what CUNY Compass
> does and the problem it solves.

```text
├── api/     # Express + Prisma + PostgreSQL server (TypeScript)
├── client/  # Ionic React app (React Hook Form + TanStack Query)
├── data/    # database dump (dump.sql) to share between teammates
└── README.md
```

## Team

| Member      | What they did |
| ----------- | ------------- |
| Hamza R.    | _TODO_        |
| Nicholas C. | _TODO_        |
| Justice K.  | _TODO_        |
| Muhammad U.    | _TODO_        |

## Prerequisites

- **Node 22+** and **Yarn 4** (via Corepack: `corepack enable`)
- **PostgreSQL** running locally
- **ngrok** (only needed to share the API across machines)

### Node version (nvm)

Make sure you're on Node 22 or newer before installing anything:

```bash
node --version        # check your current version
nvm install 22        # install Node 22 (if you don't have it)
nvm use 22            # use it in this shell
nvm alias default 22  # optional: make Node 22 your default
```

### Yarn 4 (Corepack)

Both `api/` and `client/` pin Yarn 4 through the `packageManager` field. Enable
Corepack once and `yarn` will pick up the right version automatically:

```bash
corepack enable
```

## 1. API (backend)

```bash
cd api
yarn install
cp .env.example .env      # then edit .env (see below)
yarn prisma:migrate       # create tables + generate the Prisma client
yarn dev                  # http://localhost:3000  (GET /health -> { "ok": true })
```

**Edit `.env`** and set `DATABASE_URL` to your local PostgreSQL connection
before running `yarn prisma:migrate`.

More detail (scripts, Prisma 7 workflow) is in [`api/README.md`](api/README.md).

## 2. Client (frontend)

```bash
cd client
yarn install
cp .env.example .env      # then edit .env (see below)
yarn dev                  # open the Ionic app in your browser (or: ionic serve)
```

**Edit `.env`** and set `VITE_API_URL` to point at the API (defaults to
`http://localhost:3000`; use your ngrok URL when sharing across machines).

## 3. Sharing the database

`data/dump.sql` holds a dump of the database so everyone starts from the same
tables and data. After changing the schema or seeding new data:

```bash
pg_dump "$DATABASE_URL" > data/dump.sql
```

Teammates restore it with:

```bash
psql "$DATABASE_URL" < data/dump.sql
```

Commit the updated dump so the team stays in sync.

## 4. Sharing the API across machines

Expose the API with ngrok and share the public URL; each teammate sets their
client's `VITE_API_URL` to it:

```bash
ngrok http 3000
```

Expose the **API**, never the database directly.

## AI disclosure

We used AI tools during this project. Specifically:

- **Claude Code** was used to restructure the repository into the
  `api/` / `client/` / `data/` layout, scaffold the Express + Prisma backend,
  and draft this README.

> **TODO:** add any further AI use as the project goes on — which tool, what it
> was used for, and how the output was reviewed. Every team member should be
> able to explain any line we ship, regardless of who or what wrote it first.

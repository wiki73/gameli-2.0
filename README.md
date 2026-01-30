# Gameli

### Development

1. Clone the repository

```bash
git clone https://github.com/wiki73/gameli-2.0.git
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file

```bash
cp .env.example .env
```

4. Start database

#### TO RUN ON WINDOWS:

1.  Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
2.  Install Docker Desktop or Podman Deskop

- Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
- Podman Desktop - https://podman.io/getting-started/installation

3.  Open WSL - `wsl`
4.  Make script executable

```bash
chmod +x start-database.sh
```

5.  Run this script

```bash
./start-database.sh
```

#### On Linux and macOS you can run this script directly - `./start-database.sh`

5. Start the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Stack

- Next.js
- Prisma
- Tailwind CSS
- Radix UI
- Vercel

### Features

- User authentication
- User profile
- Tasks management
- Categories management
- Leaderboard
- Statistics
- User habits

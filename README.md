# ⚡ PaySats: The Bitcoin Cash Utility Rails

[![Stack: MERN](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square)](https://mongodb.com)


**PaySats** is a high-fidelity, peer-to-peer technical instrument designed to bridge the gap between Bitcoin Cash (BCH) and real-world everyday utility. It allows users to settle essential bills—Airtime, Data, Electricity, and Cable TV—directly with BCH, instantly and securely.

---

## 🏛 Stateless. Secure.
PaySats operates on a "No Registration Required" philosophy. It is designed as a stateless spending layer that empowers users to use their Bitcoin Cash for practical life expenses without the friction of centralized accounts or custodial risks.

### 🌍 Regional Expansion Mission
Currently live in **Nigeria**, with infrastructure for **Ghana** and **Kenya** actively being scaled. Our mission is to make BCH the most usable currency across the continent.

---

## 🏗 Project Structure (Monorepo)

The repository is organized as a high-performance monorepo using NPM Workspaces:

```
paysats-v2/
├── apps/
│   ├── marketing/    # Premium landing page & visual storytelling
│   ├── platform/     # Stateless PWA for service payments
│   └── dash/         # Secure "Dash Vault" for admin monitoring
├── packages/
│   └── shared/       # Shared UI components, hooks, and types
└── server/           # TypeScript/Node API & fulfillment engine
```

---

## 🛠️ Technology Stack

### Frontend Ecosystem
- **React (Vite 6)**: For blazing-fast, low-latency interfaces.
- **Tailwind CSS**: Modern design system with custom utility tokens.
- **Framer Motion**: High-fidelity staggered animations and "Regional Expansion" visuals.
- **Lucide & React-Icons**: Crisp, minimalist technical iconography.

### Backend Infrastructure
- **Node.js & Express**: Scalable API architecture driven by TypeScript.
- **MongoDB**: Flexible data storage for transaction logs and service configurations.
- **Prompt.cash**: Non-custodial, P2P payment gateway for Bitcoin Cash.
- **Payscribe & VTpass**: Deeply integrated utility fulfillment providers.
- **Socket.io**: Real-time on-chain transaction verification feedback.

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- NPM

### Installation & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/paysats/paysats-v2.git
   cd paysats-v2
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Run the entire ecosystem**
   ```bash
   # Starts Server, Marketing, Platform and Dash concurrently
   npm run dev
   ```

---

## ⚙️ Configuration
The server requires several environment variables for full fulfillment. Copy `server/.env.example` to `server/.env`:

| Key | Description |
|-----|-------------|
| `PORT` | API Port (default 8000) |
| `PROMPT_CASH_SECRET_TOKEN` | Core payment gateway secret |
| `PAYSCRIBE_API_KEY` | Utility fulfillment key |
| `MONGODB_URI` | Database connection string |

---

## 🗺️ Roadmap
- [x] **Phase 1**: Regional Expansion Animation & Premium Landing
- [x] **Phase 2**: Stateless "Pay-and-Go" PWA launch
- [ ] **Phase 3**: Multi-regional expansion (Ghana, Kenya rollout)
- [ ] **Phase 4**: Enterprise Merchant API for direct BCH settlements

---

## 📄 License


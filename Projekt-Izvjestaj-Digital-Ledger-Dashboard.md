# Izvještaj o projektu: Digital Ledger Dashboard

## Uvod

Ovaj izvještaj detaljno opisuje razvoj, arhitekturu i funkcionalnosti web-aplikacije **Digital Ledger Dashboard**. Aplikacija je razvijena kao projekt za kolegij Informacijski sustavi s ciljem demonstracije znanja iz područja modernih web tehnologija, autentikacije, real-time komunikacije i integracije s cloud servisima. 

Aplikacija omogućuje korisnicima vođenje portfelja kriptovaluta, praćenje transakcija, kategorizaciju rizika i praćenje cijena u stvarnom vremenu putem WebSocketa. Poseban naglasak stavljen je na sigurnost, višekorisnički rad i modularnost sustava.

---

## Kratki opis aplikacije

**Digital Ledger Dashboard** je web-aplikacija koja omogućuje:
- **Registraciju i prijavu korisnika** putem Supabase Auth servisa
- **Kreiranje i upravljanje portfeljima** (portfolio) za praćenje ulaganja
- **Evidenciju transakcija** (kupnja/prodaja kriptovaluta)
- **Kategorizaciju rizika** (risk types) s mogućnošću definiranja boje
- **Praćenje cijena kriptovaluta uživo** (WebSocket integracija s Edge Functionom)
- **Prikaz statistika i analiza portfelja** (ukupni P/L, najbolji/najgori tradeovi, grafovi)
- **Višekorisnički rad** – svaki korisnik vidi i upravlja isključivo svojim podacima

Aplikacija je podijeljena na frontend (React + TypeScript) i backend (Node.js + Express + TypeScript), a za bazu podataka i autentikaciju koristi Supabase (PostgreSQL + Auth).

---

## Funkcionalnosti

### 1. Registracija i prijava

- **Registracija**: Korisnik unosi email i lozinku, backend koristi Supabase Auth za kreiranje korisničkog računa. Nakon registracije, korisnik može odmah pristupiti aplikaciji (ovisno o postavkama email potvrde).
- **Prijava**: Korisnik unosi email i lozinku, backend validira podatke i vraća JWT token koji se koristi za autorizaciju svih daljnjih zahtjeva.
- **Autorizacija**: Svi API pozivi za portfelje, transakcije i risk types zahtijevaju JWT token (Bearer) koji backend validira prije obrade zahtjeva.

**Isječak koda (backend, Express controller):**
```ts
// backend/src/controllers/authController.ts
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ user: data.user });
};
```

**Sigurnost:**
- Lozinke se nikada ne spremaju u aplikaciji, već isključivo u Supabase Auth.
- JWT token se sprema u localStorage na frontendu i automatski šalje u Authorization headeru za svaki API poziv.

---

### 2. Portfelji, transakcije i risk types

- **Portfelji**: Svaki korisnik može kreirati više portfelja, svaki portfelj ima naziv, strategiju i datum kreiranja. Portfelji su vezani uz korisnika putem `user_id` polja.
- **Transakcije**: Svaka transakcija vezana je uz portfelj, kriptovalutu, tip transakcije (LONG/SHORT), količinu, cijenu, datum i tip rizika. Transakcije su također vezane uz korisnika.
- **Risk types**: Korisnik može definirati vlastite kategorije rizika (naziv, opis, boja u hex formatu). Boja se koristi za vizualno označavanje transakcija i portfelja.

**ER dijagram:**
*(U izvještaju umetni sliku ER dijagrama iz Supabase-a)*

- **Korisnik** (Supabase Auth) ←→ **Portfelji** ←→ **Transakcije** ←→ **Risk Types**
- **Transakcije** su povezane i s **Cryptocurrency** entitetom (koji sadrži podatke o kriptovalutama i njihovim cijenama)

---

### 3. Praćenje cijena uživo (WebSocket)

- **LivePriceTracker** komponenta koristi WebSocket vezu prema Supabase Edge Function (npr. Binance price updater).
- Cijene se automatski ažuriraju svakih 15 sekundi, a promjene se prikazuju u UI-u u realnom vremenu.
- WebSocket veza je otporna na prekide (reconnect logika).

**Isječak koda (frontend, React hook):**
```ts
// frontend/src/hooks/useLivePrices.ts
useEffect(() => {
  let ws: WebSocket | null = null;
  const connect = () => {
    ws = new WebSocket('wss://...supabase.co/functions/v1/binance-price-updater');
    ws.onmessage = (event) => {
      const update: PriceUpdate = JSON.parse(event.data);
      setPrices(prev => ({ ...prev, [update.symbol]: update }));
    };
    ws.onclose = () => { connect(); };
  };
  connect();
  return () => { ws?.close(); };
}, []);
```

**Prednosti:**
- Prikaz cijena i promjena u realnom vremenu bez potrebe za ručnim refreshom
- Efikasna komunikacija (nema polling-a)
- Skalabilnost (više korisnika može istovremeno pratiti cijene)

---

### 4. Prikaz i upravljanje podacima

- **Dashboard**: Tabbed sučelje (Portfolios, Transactions, Risk Types, Statistics) omogućuje brz pristup svim funkcionalnostima.
- **CRUD operacije**: Dodavanje, uređivanje i brisanje portfelja, transakcija i risk types kroz intuitivno sučelje.
- **Statistika**: Prikaz ukupnog ulaganja, P/L, najboljih i najgorih tradeova, grafikon po kriptovaluti, vizualizacija rizika.
- **Validacija**: Svi unosi (npr. boja u risk types) validiraju se na frontendu i backendu.

---

## Arhitektura

### **Tehnologije**

- **Frontend**: React + TypeScript, Vite, TailwindCSS, React Query, WebSocket
- **Backend**: Node.js, Express, TypeScript
- **Baza**: Supabase (PostgreSQL + Auth)
- **Real-time**: Supabase Edge Functions (WebSocket)
- **Autentikacija**: JWT (Supabase Auth)
- **CI/CD**: npm scripts, Vite, tsc

### **Arhitektura sustava**

- **Frontend** šalje API zahtjeve backendu (Express), šalje JWT token u Authorization headeru.
- **Backend** validira token, dohvaća podatke iz Supabase baze, vraća podatke korisniku.
- **WebSocket** koristi se za live cijene (Edge Function na Supabase-u).

**Shema arhitekture:**
```
Korisnik <-> React (frontend) <-> Express (backend) <-> Supabase (PostgreSQL + Auth)
                                            |
                                            +-> WebSocket (Edge Function za cijene)
```

---

## Entiteti

### **Korisnik**
- id (UUID, Supabase Auth)
- email

### **Portfolio**
- id (UUID)
- naziv
- strategija
- datum_kreiranja
- user_id (FK na korisnika)

### **Transaction**
- id (UUID)
- portfolio_id (FK)
- cryptocurrency_id (FK)
- tip_transakcije (LONG/SHORT)
- kolicina
- cijena
- datum
- risk_type_id (FK)
- user_id (FK na korisnika)

### **RiskType**
- id (UUID)
- name
- description
- color (hex)
- user_id (FK na korisnika)

### **Cryptocurrency**
- id (UUID)
- symbol
- name
- current_price
- price_change_24h
- last_updated

---

## Primjeri koda

### **API client na frontendu**
```ts
// frontend/src/lib/api.ts
export const api = {
  portfolios: {
    getAll: async () => {
      const response = await fetchWithAuth('/api/portfolios');
      return response.json();
    },
    create: async (data) => {
      const response = await fetchWithAuth('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    // ...
  },
  // ...
};
```

### **WebSocket za live cijene**
```ts
// frontend/src/hooks/useLivePrices.ts
const ws = new WebSocket('wss://...supabase.co/functions/v1/binance-price-updater');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // update state...
};
```

### **Primjer backend route**
```ts
// backend/src/routes/portfolioRoutes.ts
router.get('/', authenticate, getPortfolios);
router.post('/', authenticate, createPortfolio);
```

### **Primjer backend controllera**
```ts
// backend/src/controllers/portfolioController.ts
export const getPortfolios = async (req, res) => {
  const userId = req.user?.id;
  const portfolios = await portfolioRepository.findAllByUser(userId);
  res.json(portfolios);
};
```

### **Primjer repositorya**
```ts
// backend/src/repositories/portfolioRepository.ts
async findAllByUser(userId: string) {
  const { data } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId);
  return data;
}
```

### **Primjer modela**
```ts
// backend/src/models/Portfolio.ts
export interface Portfolio {
  id: string;
  naziv: string;
  strategija: string | null;
  datum_kreiranja: string;
  user_id: string;
}
```

---

## Dodatne funkcionalnosti i UX

- **Validacija boje**: Prilikom unosa boje za risk type, aplikacija validira hex kod i prikazuje badge s kontrastnim tekstom.
- **Automatski logout**: Ako JWT token istekne ili je neispravan, korisnik se automatski odjavljuje.
- **Prikaz loading i error stanja**: Sve CRUD operacije prikazuju loading indikatore i error poruke.
- **Responsive dizajn**: Sučelje je prilagođeno za rad na desktopu i mobilnim uređajima.

---

## Zaključak

Aplikacija **Digital Ledger Dashboard** demonstrira:
- Višekorisnički rad i sigurnu autentikaciju (Supabase Auth, JWT)
- CRUD operacije nad portfeljima, transakcijama i kategorijama rizika
- Real-time praćenje cijena kriptovaluta (WebSocket)
- Modularnu arhitekturu (frontend-backend-DB)
- Korištenje modernih web tehnologija i cloud servisa

Projekt je skalabilan, lako proširiv i spreman za produkcijsku upotrebu uz minimalne dorade (npr. email notifikacije, naprednija analitika, mobilna podrška).

---

**(Za završni izvještaj dodaj slike ekrana, ER dijagram, i proširi sekcije po potrebi za 8-10 stranica!)**

Ako trebaš još primjera koda, dijagrama ili detaljnije opise pojedinih dijelova, slobodno javi! 
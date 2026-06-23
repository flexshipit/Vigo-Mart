# VigoRap — ভিগোরাপ ক্যাপসুল

Next.js 16 landing page + admin dashboard। কাস্টমার অর্ডার করলে MongoDB-তে সেভ হয়, Thank You পেজে redirect হয় এবং MiMSMS দিয়ে confirmation SMS যায়।

**Repository:** https://github.com/rayhan309/vigor_max

---

## প্রোডাক্ট তথ্য

| আইটেম | মূল্য |
|--------|--------|
| ভিগোরাপ — 10 পিস ক্যাপসুল | 600৳ |
| ডেলিভারি চার্জ (সারা বাংলাদেশ) | 130৳ |
| **মোট (COD)** | **730৳** |

---

## ফিচার

- বাংলা landing page (Hero, উপকারিতা, অর্ডার ফর্ম, রিভিউ, নীতিমালা)
- Cash on Delivery অর্ডার ফ্লো
- MongoDB order storage
- MiMSMS confirmation SMS
- Meta Pixel + Conversions API (optional)
- Admin dashboard — orders, stats, charts
- Courier integration — **Steadfast**, **Pathao**
- Rate limit — একই ফোন/IP থেকে 7 দিনে 1 অর্ডার

---

## দ্রুত শুরু

### 1. Install

```bash
npm install
```

### 2. `.env` সেটআপ

প্রজেক্ট রুটে `.env` ফাইল তৈরি করুন (`.env.example` দেখুন বা নিচের টেমপ্লেট ব্যবহার করুন)।

### 3. Dev server

```bash
npm run dev
```

- Landing: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 4. Production build

```bash
npm run build
npm run start
```

---

## সেটআপ গাইড

### MongoDB Atlas

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) থেকে cluster তৈরি করুন
2. Database user + password সেট করুন
3. Network Access-এ IP whitelist করুন (dev-এ `0.0.0.0/0` দিলেও চলে)
4. Connection string `MONGODB_URI`-তে দিন
5. `BDNAME=vigor_max_capsul` রাখুন

### MiMSMS (SMS confirmation)

1. [MiMSMS](https://mimsms.com) account খুলুন
2. Panel থেকে **Username**, **API Key**, **Sender Name** নিন
3. Account-এ SMS balance রাখুন
4. Test order দিয়ে ফোনে SMS আসছে কিনা চেক করুন

### Admin login

- URL: `/admin/login`
- Production-এ `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SECRET` অবশ্যই strong value দিন

---

## অর্ডার ফ্লো

1. Customer `#order` ফর্ম submit করে
2. `POST /api/orders` → MongoDB `orders` collection-এ save (`status: confirmed`)
3. `/thank-you/[orderId]` পেজে redirect
4. Thank You পেজ থেকে `POST /api/orders/[orderId]/sms` → confirmation SMS
5. SMS সফল হলে `smsSent: true` mark

**Rate limit:** একই ফোন নম্বর বা IP থেকে 7 দিন (168 ঘণ্টা)-এর মধ্যে আবার অর্ডার করা যাবে না।

---

## Admin Courier Integration

Admin flow (`/admin/orders` → Manage):

1. Order status update
2. Courier select → Save
3. **Send to Courier** → API call
4. **Track Shipment** → live status sync

Supported couriers: **Steadfast**, **Pathao**

---

## `.env` variables

### Required

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?...
BDNAME=vigor_max_capsul

# MiMSMS — SMS confirmation
MIMSMS_USERNAME=your_username
MIMSMS_API_KEY=your_api_key
MIMSMS_SENDER_NAME=your_sender_name

# Admin dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_password
ADMIN_SECRET=change_this_secret_key
```

### Optional

```env
MIMSMS_BRAND_NAME=VigoRap
MIMSMS_API_URL=https://api.mimsms.com/api/SmsSending/SMS
MIMSMS_TRANSACTION_TYPE=T
NODE_ENV=development

# Meta Pixel (browser)
NEXT_PUBLIC_META_PIXEL_ID=

# Meta Conversions API (server)
META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
META_CAPI_TEST_EVENT_CODE=
META_CAPI_API_VERSION=v21.0

# Steadfast
STEADFAST_API_KEY=
STEADFAST_SECRET_KEY=
STEADFAST_BASE_URL=https://portal.packzy.com/api/v1

# Pathao
PATHAO_CLIENT_ID=
PATHAO_CLIENT_SECRET=
PATHAO_USERNAME=
PATHAO_PASSWORD=
PATHAO_STORE_ID=
PATHAO_BASE_URL=https://api-hermes.pathao.com
PATHAO_SANDBOX=false
```

> **সতর্কতা:** `.env` ফাইল কখনো Git-এ commit করবেন না।

---

## SMS message format (example)

```
VigoRap: Rahim, apnar order confirm! ভিগোরাপ — 10 পিস ক্যাপসুল, Total 730Tk. Cash on delivery. 2-4 din e delivery. Order ID: A1B2C3
```

`MIMSMS_BRAND_NAME` দিয়ে brand name বদলানো যায়।

---

## Tech stack

| কাজ | Technology |
|-----|------------|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS 4, Framer Motion |
| Database | MongoDB |
| SMS | MiMSMS REST API (`src/lib/mimsms.ts`) |
| Forms | react-hook-form + TanStack Query |
| Charts | Recharts (admin) |
| Analytics | Meta Pixel + CAPI (optional) |

---

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # production server
npm run lint     # eslint
```

---

## Project structure

```
src/
  app/
    page.tsx                    # Landing page
    thank-you/[orderId]/        # Order confirmation
    api/orders/                 # Public order API
    admin/                      # Admin dashboard
  components/
    landing/                    # Hero, Benefits, OrderForm, etc.
    admin/                      # Dashboard UI
    thank-you/                  # Thank you page
  lib/
    products.ts                 # Product & pricing
    mimsms.ts                   # SMS service
    dbConnect.ts                # MongoDB
    courier/                    # Steadfast & Pathao adapters
    meta/                       # Meta Pixel & CAPI
public/
  images/                       # Product images
```

---

## Brand colors

| Token | Hex |
|-------|-----|
| Primary | `#0D7C66` |
| Secondary | `#16A085` |
| Gold | `#F4B400` |
| Dark | `#0F172A` |
| Background | `#F8FAFC` |

প্রোডাক্ট/pricing বদলাতে `src/lib/products.ts` এডিট করুন।

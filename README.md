# EZ Shop Mystery Box

Next.js 16 e-commerce landing page + admin dashboard। অর্ডার দিলে MongoDB-তে সেভ হয় এবং BulkSMSBD দিয়ে confirmation SMS যায়। OTP বা verify page নেই।

---

## আপনার কী কী করতে হবে

### 1. Dependencies install

```bash
npm install
```

### 2. `.env` ফাইল সেটআপ

প্রজেক্ট রুটে `.env` ফাইল তৈরি/আপডেট করুন (নিচের টেমপ্লেট দেখুন)।

### 3. MongoDB Atlas

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) থেকে cluster তৈরি করুন
- Database user + password সেট করুন
- Network Access-এ IP whitelist করুন (dev-এ `0.0.0.0/0` দিলেও চলে)
- Connection string কপি করে `MONGODB_URI`-তে দিন
- `BDNAME=vigor_max_capsul` রাখুন

### 4. BulkSMSBD (SMS confirmation)

- [bulksmsbd.net](https://bulksmsbd.net) এ account খুলুন
- Panel থেকে **API Key** নিন → `BULKSMSBD_API_KEY`
- **Sender ID** approve করান → `BULKSMSBD_SENDER_ID`
- Account-এ SMS balance রাখুন
- Test order দিয়ে ফোনে SMS আসছে কিনা চেক করুন

### 5. Admin credentials

- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SECRET` পরিবর্তন করুন (production-এ অবশ্যই strong password দিন)
- Admin login: `/admin/login`

### 6. Dev server চালু

```bash
npm run dev
```

- Landing page: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 7. Production deploy (Vercel / VPS)

- `.env`-এর সব variable hosting panel-এ add করুন
- `npm run build` && `npm run start` (বা Vercel auto deploy)
- Deploy-এর পর live site-এ test order দিন

---

## SMS confirmation — কোন package ব্যবহার হয়েছে?

**SMS-এর জন্য কোনো আলাদা npm package ব্যবহার করা হয়নি।**

SMS পাঠানো হয় **BulkSMSBD REST API** দিয়ে, native `fetch()` দিয়ে — কোড: `src/lib/bulkSmsBd.ts`

| কাজ | Package / Technology |
|-----|----------------------|
| Database (order save) | `mongodb` |
| Order API | Next.js API Route (`/api/orders`) |
| SMS পাঠানো | **BulkSMSBD API** (external service, npm package নয়) |
| Success toast | `react-hot-toast` |
| Form submit | `react-hook-form` + `@tanstack/react-query` |

---

## অর্ডার ফ্লো

1. Customer order form submit করে
2. `POST /api/orders` → MongoDB `orders` collection-এ save (`status: confirmed`)
3. Thank You page (`/thank-you/[orderId]`)-এ redirect
4. Thank You page থেকে `POST /api/orders/[orderId]/sms` → confirmation SMS
5. SMS সফল → `smsSent: true` mark

**Rate limit:** একই ফোন নম্বর বা IP থেকে ৭ দিন (১৬৮ ঘণ্টা)-এর মধ্যে আবার অর্ডার করা যাবে না।

---

## Admin Courier Integration

Static couriers: **Steadfast**, **Pathao**

Admin flow (`/admin/orders` → Manage):
1. Order status update
2. Courier select → Save
3. **Send to Courier** → real API call
4. **Track Shipment** → live status sync

### Courier `.env` (optional — যেটা use করবেন সেটা দিন)

```env
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

---

## `.env` variables

### Required (অবশ্যই লাগবে)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?...
BDNAME=vigor_max_capsul

# BulkSMSBD — SMS confirmation
BULKSMSBD_API_KEY=your_api_key_from_bulksmsbd_panel
BULKSMSBD_SENDER_ID=your_approved_sender_id

# Admin dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_password
ADMIN_SECRET=change_this_secret_key
```

### Optional (না দিলেও default কাজ করবে)

```env
BULKSMSBD_BRAND_NAME=EZ Shop
BULKSMSBD_API_URL=http://bulksmsbd.net/api/smsapi
NODE_ENV=development
```

### আর লাগবে না (মুছে দিন)

```env
OTP_EXPIRY_MINUTES=10   # পুরনো OTP flow — এখন ব্যবহার হয় না
```

---

## SMS message format (example)

```
EZ Shop: Rahim, apnar order confirm! ৮ প্যাকেট বক্স, Total 595Tk. Cash on delivery. 2-4 din e delivery. Order ID: A1B2C3
```

`BULKSMSBD_BRAND_NAME` দিয়ে brand name বদলানো যায়।

---

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # production server
npm run lint     # eslint
```

---

## Project structure (main)

```
src/
  app/
    page.tsx                 # Landing page
    api/orders/route.ts      # Order + SMS confirmation
    admin/                   # Admin dashboard
  components/landing/        # OrderForm, Hero, etc.
  lib/
    bulkSmsBd.ts             # BulkSMSBD SMS service
    dbConnect.ts             # MongoDB connection
    products.ts              # Package prices
```

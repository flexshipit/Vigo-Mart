export type Product = {
  packageId: string;
  name: string;
  packets: number;
  price: number;
  badge?: string;
};

export const DELIVERY_CHARGE = 130;

export const PRODUCTS: Product[] = [
  {
    packageId: "vigomax-10",
    name: "10 পিস",
    packets: 10,
    price: 600,
    badge: "অরিজিনাল প্রোডাক্ট",
  },
  {
    packageId: "vigomax-15",
    name: "15 পিস",
    packets: 15,
    price: 900,
    badge: "জনপ্রিয়",
  },
  {
    packageId: "vigomax-20",
    name: "20 পিস",
    packets: 20,
    price: 1100,
    badge: "সেরা ভ্যালু",
  },
];

export function getProductPricingSummary(): string {
  return PRODUCTS.map((product) => `${product.packets} পিস — ${product.price}৳`).join(
    " | "
  );
}

export const BENEFITS = [
  "ইহা ব্যবহারে 35-40 মিনিট স্ত্রী মিলন করতে পারবেন।",
  "এটা শেষ ভরসা, কারণ এটা কাজ না করলে কোন অসুধ কাজ করবে না।",
  "বীর্য গাঢ় করে এবং দেহের মধ্যে বীর্য তৈরি করে।",
  "টানা 3/4 বার করে মিলন করতে পারবেন।",
  "হারানো যৌন শক্তি ফিরে পাবেন।",
  "আপনার গোপনাঙ্গের ভেতর থেকে লম্বা মোটা শক্ত ও রগ সতেজ করে তুলবে।",
  "গোপনাঙ্গ নিস্তেজ শিথিল ভাব দূর করবে।",
  "গোপনাঙ্গকে মোটা 3-2 ইঞ্চি লম্বা করে তুলবে।",
  "প্রস্রাবে ধাতু ক্ষয় দূর করবে। বিশেষ সময়ে তৃপ্তির জন্য এটির কোন বিকল্প নেই।",
];

export const SATISFACTION_GUARANTEE =
  "যদি নির্দিষ্ট সময়ের মধ্যে আমরা আমাদের প্রতিশ্রুতি অনুযায়ী কাজ বা ফলাফল বুঝিয়ে দিতে না পারি, তবে কোনো প্রশ্ন ছাড়াই আপনার দেওয়া টাকা সম্পূর্ণ ফেরত (Refund) দেওয়া হবে।";

export const DOSAGE_GUIDELINES = [
  {
    label: "মাত্রা",
    text: "দৈনিক 1টি ক্যাপসুল।",
  },
  {
    label: "সময়",
    text: "সাধারণত রাতে ঘুমানোর আগে অথবা চিকিৎসকের পরামর্শ অনুযায়ী দিনে 1 থেকে 2 বার।",
  },
  {
    label: "সহায়ক উপাদান",
    text: "এটি হালকা গরম দুধ অথবা কুসুম গরম পানির সাথে সেবন করলে সবচেয়ে ভালো কাজ করে।",
  },
  {
    label: "খাবারের নিয়ম",
    text: "অবশ্যই ভরা পেটে (রাতের বা দুপুরের খাবারের পর) সেবন করতে হবে। খালি পেটে খাওয়া উচিত নয়।",
  },
] as const;

export function getProductByPackageId(packageId: string): Product | undefined {
  const legacyIds: Record<string, string> = {
    "vigorap-10": "vigomax-10",
    "vigorap-15": "vigomax-15",
    "vigorap-20": "vigomax-20",
  };

  const resolvedId = legacyIds[packageId] ?? packageId;
  return PRODUCTS.find((product) => product.packageId === resolvedId);
}

export const REVIEWS = [
  {
    name: "রফিকুল ইসলাম",
    text: "10 পিস ক্যাপসুল অর্ডার করেছিলাম, ফলাফল দেখে সত্যিই সন্তুষ্ট।",
    rating: 5,
  },
  {
    name: "কামরুল হাসান",
    text: "অরিজিনাল প্রোডাক্ট পেয়েছি। দ্রুত ডেলিভারি এবং ভালো ফলাফল।",
    rating: 5,
  },
  {
    name: "আরমান",
    text: "আগে অনেক কিছু ট্রাই করেছি, VigoMax-ই কাজ করেছে।",
    rating: 5,
  },
  {
    name: "সাথী আক্তার",
    text: "প্যাকেজিং ভালো, প্রোডাক্ট অরিজিনাল। আবার অর্ডার করব।",
    rating: 5,
  },
  {
    name: "মোঃ রাকিব",
    text: "খুব ভালো ফলাফল পেয়েছি। সবাই নিতে পারেন।",
    rating: 5,
  },
  {
    name: "ইমরান",
    text: "600 টাকায় এমন কোয়ালিটি প্রোডাক্ট পাবো ভাবিনি। ধন্যবাদ!",
    rating: 5,
  },
];

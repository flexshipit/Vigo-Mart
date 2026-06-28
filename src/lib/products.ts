export const PRODUCT_NAME = "American Chocolate";
export const PRODUCT_NAME_BN = "আমেরিকান চকলেট";
export const PRODUCT_TAGLINE = "অরিজিনাল হারবাল ফর্মুলা";
export const PRODUCT_DESCRIPTION =
  "অরিজিনাল American Chocolate (আমেরিকান চকলেট) — প্রাকৃতিক হারবাল উপাদানে তৈরি।";

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
    packageId: "vigomax-8",
    name: "8 পিস",
    packets: 8,
    price: 400,
    badge: "অরিজিনাল প্রোডাক্ট",
  },
  {
    packageId: "vigomax-15",
    name: "15 পিস",
    packets: 15,
    price: 750,
    badge: "জনপ্রিয়",
  },
  {
    packageId: "vigomax-20",
    name: "20 পিস",
    packets: 20,
    price: 1000,
    badge: "সেরা ভ্যালু",
  },
];

export function getProductPricingSummary(): string {
  return PRODUCTS.map((product) => `${product.packets} পিস — ${product.price}৳`).join(
    " | "
  );
}

export const BENEFITS = [
  "একবারেই নিস্তেজ লিঙ্গ ভিতর থেকে শক্ত করে, মোটা করে, আগা গোড়া সমান ও লম্বা করে।",
  "আপনি আপনার ইচ্ছে মত সময় নিয়ে সহবাস করতে পারবেন।",
  "যাদের কোন প্রকার ঔষধে কাজ করে না, ডায়বেটিস আছে তারা এটা 100% কাজ পাবেন।",
  "ইহা ব্যবহারে 35-40 মিনিট স্ত্রী মিলন করতে পারবেন।",
  "বীর্য গাঢ় করে এবং দেহের মধ্যে বীর্য তৈরি করে।",
  "টানা 3/4 বার করে মিলন করতে পারবেন।",
  "ঘন ঘন প্রস্রাবের সমস্যা দূর হবে।",
  "প্রস্রাবে জ্বালাপোড়া বন্ধ হবে।",
  "প্রস্রাবের রাস্তায় ইনফেকশন দূর হবে।",
  "লাল ও হলুদ রঙের প্রস্রাব থেকে মুক্তি পাবেন।",
  "দুর্গন্ধযুক্ত প্রস্রাব ভালো হবে।",
  "মূত্রনালীর ক্ষত ভালো হবে।",
  "অস্বস্তি এবং বিরক্তিকর ভাব দূর হবে।",
  "ফোঁটা ফোঁটা প্রস্রাব থেকে সুস্থতা লাভ করবেন।",
];

export const INGREDIENTS_TITLE = "আমেরিকান চকলেট উপাদান:";

export const INGREDIENTS = [
  "মরিন্ডা অফিসিনালিস",
  "হরিণ শিং",
  "জিনসেং",
  "মৌমাছির বিষ",
  "কর্ডিসেপস",
  "Vitamin E (ভিটামিন- ই)",
];

export const SATISFACTION_GUARANTEE =
  "যদি নির্দিষ্ট সময়ের মধ্যে আমরা আমাদের প্রতিশ্রুতি অনুযায়ী কাজ বা ফলাফল বুঝিয়ে দিতে না পারি, তবে কোনো প্রশ্ন ছাড়াই আপনার দেওয়া টাকা সম্পূর্ণ ফেরত (Refund) দেওয়া হবে।";

export const DOSAGE_GUIDELINES = [
  {
    label: "মাত্রা",
    text: "দৈনিক 1টি চকলেট।",
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

export const PRODUCT_DISCLAIMERS = [
  "এটি একটি প্রাকৃতিক ভেষজ/আয়ুর্বেদিক সাপ্লিমেন্ট। এর কার্যকারিতা ব্যক্তিভেদে ভিন্ন হতে পারে। কোনো প্রকার গুরুতর শারীরিক অসুস্থতা বা হার্টের সমস্যা থাকলে চিকিৎসকের পরামর্শ ছাড়া এটি সেবন করা অনুচিত। এটি কোনো প্রচলিত অ্যালোপ্যাথিক ওষুধের বিকল্প নয়।",
  "এই পণ্যগুলো শুধুমাত্র প্রাপ্তবয়স্কদের সাধারণ শারীরিক শক্তি ও পুষ্টির সাপোর্টের জন্য। আপনার যদি গুরুতর কোনো রোগ বা হার্টের সমস্যা থাকে, তবে যেকোনো ওষুধ সেবনের পূর্বে অবশ্যই একজন রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।",
] as const;

export function getProductByPackageId(packageId: string): Product | undefined {
  const legacyIds: Record<string, string> = {
    "vigorap-10": "vigomax-8",
    "vigorap-15": "vigomax-15",
    "vigorap-20": "vigomax-20",
    "vigomax-10": "vigomax-8",
  };

  const resolvedId = legacyIds[packageId] ?? packageId;
  return PRODUCTS.find((product) => product.packageId === resolvedId);
}

export const REVIEWS = [
  {
    name: "রফিকুল ইসলাম",
    text: "8 পিস অর্ডার করেছিলাম, ফলাফল দেখে সত্যিই সন্তুষ্ট।",
    rating: 5,
  },
  {
    name: "কামরুল হাসান",
    text: "অরিজিনাল American Chocolate পেয়েছি। দ্রুত ডেলিভারি এবং ভালো ফলাফল।",
    rating: 5,
  },
  {
    name: "আরমান",
    text: "আগে অনেক কিছু ট্রাই করেছি, American Chocolate-ই কাজ করেছে।",
    rating: 5,
  },
  {
    name: "সাথী আক্তার",
    text: "প্যাকেজিং ভালো, প্রোডাক্ট অরিজিনাল। আবার অর্ডার করব।",
    rating: 5,
  },
  {
    name: "মোঃ রাকিব",
    text: "15 পিস নিয়েছিলাম, খুব ভালো ফলাফল পেয়েছি।",
    rating: 5,
  },
  {
    name: "ইমরান",
    text: "400 টাকায় এমন কোয়ালিটি প্রোডাক্ট পাবো ভাবিনি। ধন্যবাদ!",
    rating: 5,
  },
];

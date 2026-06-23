type SendSmsResult = {
  success: boolean;
  message: string;
};

type MiMSmsResponse = {
  statusCode?: string | number;
  status?: string;
  trxnId?: string;
  responseResult?: string;
};

const DEFAULT_SMS_ERROR =
  "Confirmation SMS পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।";

const SMS_ERROR_BY_CODE: Record<string, string> = {
  "401": "SMS পাঠানো যায়নি। Username বা API key সঠিক নয়।",
  "205": "SMS পাঠানো যায়নি। মেসেজ কনটেন্ট সঠিক নয়।",
  "206": "SMS পাঠানো যায়নি। সঠিক 11 ডিজিটের ফোন নম্বর দিন।",
  "207": "SMS পাঠানো যায়নি। Transaction type সঠিক নয়।",
  "208": "SMS পাঠানো যায়নি। Sender ID অনুমোদিত নয়।",
  "209": "SMS পাঠানো যায়নি। মেসেজ খুব বড়।",
  "210": "SMS পাঠানো যায়নি। Campaign ID সঠিক নয়।",
  "213": "SMS পাঠানো যায়নি। API parameter সমস্যা।",
  "216": "SMS পাঠানো যায়নি। SMS ব্যালেন্স শেষ। MiMSMS panel থেকে recharge করুন।",
  "221": "SMS পাঠানো যায়নি। MiMSMS gateway error।",
  "500": "SMS সার্ভিসে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।",
};

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("880") && digits.length === 13) {
    return digits;
  }

  if (digits.startsWith("01") && digits.length === 11) {
    return `88${digits}`;
  }

  return digits;
}

function getMeaningfulSmsError(data: MiMSmsResponse): string {
  const code = String(data.statusCode ?? "");
  if (code && SMS_ERROR_BY_CODE[code]) {
    return SMS_ERROR_BY_CODE[code];
  }

  const apiError = String(data.responseResult ?? data.status ?? "").toLowerCase();

  if (apiError.includes("invalid username") || apiError.includes("unauthorized")) {
    return "SMS পাঠানো যায়নি। Username বা API key সঠিক নয়।";
  }

  if (apiError.includes("sender")) {
    return "SMS পাঠানো যায়নি। Sender ID অনুমোদিত নয়।";
  }

  if (apiError.includes("balance") || apiError.includes("insufficient")) {
    return "SMS পাঠানো যায়নি। SMS ব্যালেন্স শেষ। MiMSMS panel থেকে recharge করুন।";
  }

  if (apiError.includes("mobile") || apiError.includes("number")) {
    return "SMS পাঠানো যায়নি। সঠিক 11 ডিজিটের ফোন নম্বর দিন।";
  }

  if (data.responseResult) {
    return DEFAULT_SMS_ERROR;
  }

  return DEFAULT_SMS_ERROR;
}

function isSmsSuccess(data: MiMSmsResponse, responseOk: boolean): boolean {
  const code = String(data.statusCode ?? "");
  const status = String(data.status ?? "").toLowerCase();

  return (
    responseOk &&
    (code === "200" || status === "success" || status === "ok")
  );
}

async function sendSms(phone: string, message: string): Promise<SendSmsResult> {
  const username = process.env.MIMSMS_USERNAME;
  const apiKey = process.env.MIMSMS_API_KEY;
  const senderName = process.env.MIMSMS_SENDER_NAME;
  const transactionType = process.env.MIMSMS_TRANSACTION_TYPE || "T";

  if (!username || !apiKey || !senderName) {
    return {
      success: false,
      message:
        "SMS সার্ভিস সেটআপ সম্পূর্ণ হয়নি। সাইট অ্যাডমিনের সাথে যোগাযোগ করুন।",
    };
  }

  if (
    username.includes("your_") ||
    apiKey.includes("your_") ||
    senderName.includes("your_")
  ) {
    return {
      success: false,
      message:
        "SMS সার্ভিস সেটআপ সম্পূর্ণ হয়নি। MiMSMS credentials সঠিকভাবে সেট করুন।",
    };
  }

  const mobileNumber = formatPhoneNumber(phone);
  const apiUrl =
    process.env.MIMSMS_API_URL ||
    "https://api.mimsms.com/api/SmsSending/SMS";

  const payload: Record<string, string> = {
    UserName: username,
    Apikey: apiKey,
    MobileNumber: mobileNumber,
    SenderName: senderName,
    TransactionType: transactionType,
    Message: message,
  };

  const campaignId = process.env.MIMSMS_CAMPAIGN_ID;
  if (transactionType === "P" && campaignId) {
    payload.CampaignId = campaignId;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text) as MiMSmsResponse;

      if (isSmsSuccess(data, response.ok)) {
        return { success: true, message: "SMS sent successfully" };
      }

      return {
        success: false,
        message: getMeaningfulSmsError(data),
      };
    } catch {
      return {
        success: false,
        message: DEFAULT_SMS_ERROR,
      };
    }
  } catch {
    return {
      success: false,
      message:
        "SMS সার্ভিসে সংযোগ সমস্যা হয়েছে। ইন্টারনেট চেক করে আবার চেষ্টা করুন।",
    };
  }
}

export async function sendOrderConfirmationSms(
  phone: string,
  payload: {
    fullName: string;
    packageName: string;
    total: number;
    orderId: string;
  }
): Promise<SendSmsResult> {
  const brandName = process.env.MIMSMS_BRAND_NAME || "VigoRap";
  const firstName = payload.fullName.trim().split(" ")[0];

  const message = `${brandName}: ${firstName}, apnar order confirm! ${payload.packageName}, Total ${payload.total}Tk. Cash on delivery. 2-4 din e delivery. Order ID: ${payload.orderId.slice(-6).toUpperCase()}`;

  return sendSms(phone, message);
}

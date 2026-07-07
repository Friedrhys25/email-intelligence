import type { EmailDTO } from "../gmail/email.dto.js";
import type {
  EmailAnalysis,
  EmailCategory,
  EmailProcessorConfig,
  EmailPriority
} from "./priority.types.js";

const defaultImportantContacts = ["github.com", "google.com", "render.com"];

export const defaultEmailProcessorConfig: EmailProcessorConfig = {
  ignoreNewsletters: true,
  importantContacts: defaultImportantContacts
};

const lowValueRules: { category: EmailCategory; patterns: RegExp[] }[] = [
  {
    category: "otp",
    patterns: [/\b(otp|one[- ]time password|verification code|security code|2fa|two-factor)\b/iu]
  },
  {
    category: "promotion",
    patterns: [/\b(sale|discount|promo|promotion|limited time|deal|offer|coupon|% off)\b/iu]
  },
  {
    category: "receipt",
    patterns: [/\b(receipt|invoice|payment received|order confirmation|transaction)\b/iu]
  },
  {
    category: "newsletter",
    patterns: [/\b(newsletter|unsubscribe|weekly digest|monthly digest|roundup)\b/iu]
  },
  {
    category: "spam",
    patterns: [/\b(winner|claim now|free money|lottery|urgent prize|act now)\b/iu]
  }
];

const actionPatterns = [
  /\b(action required|required action|please review|please respond|needs your attention)\b/iu,
  /\b(approve|review|respond|reply|complete|submit|sign|fix|resolve)\b/iu
];

const deadlinePatterns = [
  /\b(?:by|before|due|deadline)\s+(?<deadline>(?:today|tomorrow|[A-Z][a-z]+day|[A-Z][a-z]+\s+\d{1,2}|\d{1,2}\/\d{1,2}\/\d{2,4}))/iu,
  /\b(?<deadline>today|tomorrow)\b/iu
];

export const analyzeEmail = (
  email: EmailDTO,
  config: EmailProcessorConfig = defaultEmailProcessorConfig
): EmailAnalysis => {
  const text = buildSearchText(email);
  const lowValueCategory = detectLowValueCategory(text);

  if (lowValueCategory && (lowValueCategory !== "newsletter" || config.ignoreNewsletters)) {
    return {
      category: lowValueCategory,
      actionRequired: false,
      importantContact: false,
      score: 0,
      reasonIncluded: `Ignored as ${lowValueCategory}`,
      ignored: true
    };
  }

  const actionRequired = actionPatterns.some((pattern) => pattern.test(text));
  const deadline = detectDeadline(text);
  const importantContact = isImportantContact(email.sender, config.importantContacts);
  const score = calculateScore({ actionRequired, deadline, importantContact });
  const category = determineCategory({ actionRequired, deadline, importantContact });

  return {
    category,
    actionRequired,
    deadline,
    importantContact,
    score,
    reasonIncluded: determineReasonIncluded({ actionRequired, deadline, importantContact }),
    ignored: false
  };
};

export const classifyPriority = (score: number): EmailPriority => {
  if (score >= 5) {
    return "high";
  }

  if (score >= 2) {
    return "medium";
  }

  return "low";
};

const buildSearchText = (email: EmailDTO): string =>
  [email.sender, email.subject, email.snippet, email.body, email.labels.join(" ")].join(" ");

const detectLowValueCategory = (text: string): EmailCategory | undefined => {
  const matchingRule = lowValueRules.find((rule) =>
    rule.patterns.some((pattern) => pattern.test(text))
  );
  return matchingRule?.category;
};

const detectDeadline = (text: string): string | undefined => {
  for (const pattern of deadlinePatterns) {
    const match = pattern.exec(text);

    if (match?.groups?.deadline) {
      return match.groups.deadline;
    }
  }

  return undefined;
};

const isImportantContact = (sender: string, importantContacts: string[]): boolean => {
  const normalizedSender = sender.toLowerCase();
  return importantContacts.some((contact) => normalizedSender.includes(contact.toLowerCase()));
};

const calculateScore = ({
  actionRequired,
  deadline,
  importantContact
}: {
  actionRequired: boolean;
  deadline?: string;
  importantContact: boolean;
}): number => {
  let score = 1;

  if (importantContact) {
    score += 2;
  }

  if (actionRequired) {
    score += 3;
  }

  if (deadline) {
    score += 2;
  }

  return score;
};

const determineCategory = ({
  actionRequired,
  deadline,
  importantContact
}: {
  actionRequired: boolean;
  deadline?: string;
  importantContact: boolean;
}): EmailCategory => {
  if (deadline) {
    return "deadline";
  }

  if (actionRequired) {
    return "action";
  }

  if (importantContact) {
    return "important-contact";
  }

  return "normal";
};

const determineReasonIncluded = ({
  actionRequired,
  deadline,
  importantContact
}: {
  actionRequired: boolean;
  deadline?: string;
  importantContact: boolean;
}): string => {
  const reasons: string[] = [];

  if (importantContact) {
    reasons.push("important contact");
  }

  if (actionRequired) {
    reasons.push("action required");
  }

  if (deadline) {
    reasons.push(`deadline detected: ${deadline}`);
  }

  return reasons.length > 0 ? reasons.join(", ") : "included for low-priority awareness";
};

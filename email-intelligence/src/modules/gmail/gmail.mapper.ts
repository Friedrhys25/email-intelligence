import type { EmailDTO, GmailHeader, GmailMessage, GmailMessagePart } from "./email.dto.js";

export const mapGmailMessageToEmailDTO = (message: GmailMessage): EmailDTO => {
  const headers = message.payload?.headers ?? [];

  return {
    id: message.id ?? "",
    threadId: message.threadId ?? "",
    sender: getHeaderValue(headers, "from"),
    subject: getHeaderValue(headers, "subject"),
    date: normalizeDate(getHeaderValue(headers, "date")),
    snippet: message.snippet ?? "",
    body: extractPlainTextBody(message.payload ?? undefined) ?? message.snippet ?? "",
    labels: message.labelIds ?? []
  };
};

const getHeaderValue = (headers: GmailHeader[], headerName: string): string => {
  const header = headers.find((candidate) => candidate.name?.toLowerCase() === headerName);
  return header?.value ?? "";
};

const normalizeDate = (rawDate: string): string => {
  if (!rawDate) {
    return "";
  }

  const parsedDate = new Date(rawDate);
  return Number.isNaN(parsedDate.getTime()) ? rawDate : parsedDate.toISOString();
};

const extractPlainTextBody = (part: GmailMessagePart | undefined): string | undefined => {
  if (!part) {
    return undefined;
  }

  if (part.mimeType === "text/plain" && part.body?.data) {
    return decodeBase64Url(part.body.data);
  }

  if (part.body?.data && !part.parts?.length) {
    return decodeBase64Url(part.body.data);
  }

  for (const childPart of part.parts ?? []) {
    const body = extractPlainTextBody(childPart);

    if (body) {
      return body;
    }
  }

  return undefined;
};

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  const padded = `${normalized}${"=".repeat(paddingLength)}`;

  return Buffer.from(padded, "base64").toString("utf8");
};

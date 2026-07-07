export interface EmailDTO {
  id: string;
  threadId: string;
  sender: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  labels: string[];
}

export interface GmailHeader {
  name?: string | null;
  value?: string | null;
}

export interface GmailMessagePartBody {
  data?: string | null;
}

export interface GmailMessagePart {
  mimeType?: string | null;
  body?: GmailMessagePartBody | null;
  parts?: GmailMessagePart[] | null;
}

export interface GmailMessage {
  id?: string | null;
  threadId?: string | null;
  labelIds?: string[] | null;
  snippet?: string | null;
  payload?: (GmailMessagePart & { headers?: GmailHeader[] | null }) | null;
}

export interface GmailMessageReference {
  id?: string | null;
  threadId?: string | null;
}

export interface GmailMessageList {
  messages?: GmailMessageReference[] | null;
}

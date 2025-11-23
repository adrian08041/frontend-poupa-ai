export interface WhatsAppLinkData {
  phoneNumber: string;
  linkCode?: string;
  isLinked: boolean;
  linkedAt?: string;
}

export interface GenerateLinkCodeResponse {
  linkCode: string;
  expiresAt: string;
  whatsappUrl: string;
}

export interface LinkWhatsAppRequest {
  phoneNumber: string;
  linkCode: string;
}

export interface UnlinkWhatsAppResponse {
  success: boolean;
  message: string;
}

export type WhatsAppStatus = "not_linked" | "pending" | "linked";

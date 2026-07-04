export interface CreateUrlRequest {
  originalUrl: string;
  expirationMinutes?: number;
  customAlias?: string;
}

export interface UrlResponse {
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  clickCount: number;
  createdAt: string;
  expiresAt: string | null;
}

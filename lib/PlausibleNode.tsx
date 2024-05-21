import { headers } from "next/headers";

type EventOptions = {
  domain?: string;
  url?: string;
}
export class Plausible {
  baseApiUrl: string;

  constructor(baseApiUrl: string) {
    this.baseApiUrl = baseApiUrl || "https://plausible.io";
  }

  async event(name: string, options: EventOptions = {}) {
    const head = headers()
    await fetch(`${this.baseApiUrl}/api/event`, {
      method: "POST",
      headers: {
        "User-Agent": head.get("user-agent"),
        "X-Forwarded-For": head.get("x-forwarded-for"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        domain: options.domain || head.get("host"),
        url: options.url || head.get("referer"),
      }),
    })
  }
}

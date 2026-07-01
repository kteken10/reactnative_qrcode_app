// Constructeurs de payloads QR — fonctions pures (testables).

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';
export type QrTypeKey =
  | 'link'
  | 'text'
  | 'wifi'
  | 'contact'
  | 'email'
  | 'phone';

// Échappe les caractères spéciaux du format WIFI: \ ; , : "
export function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

export function normalizeUrl(url: string): string {
  const u = url.trim();
  if (!u) return '';
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(u)) return u;
  return `https://${u}`;
}

export function buildWifi({
  ssid,
  password,
  security = 'WPA',
}: {
  ssid: string;
  password?: string;
  security?: WifiSecurity;
}): string {
  const s = escapeWifi(ssid.trim());
  if (!s) return '';
  if (security === 'nopass') return `WIFI:T:nopass;S:${s};;`;
  const p = escapeWifi((password ?? '').trim());
  return `WIFI:T:${security};S:${s};P:${p};H:false;;`;
}

export function buildVCard({
  name,
  phone,
  email,
}: {
  name?: string;
  phone?: string;
  email?: string;
}): string {
  const parts: string[] = [];
  if (name?.trim()) parts.push(`N:${name.trim()}`);
  if (phone?.trim()) parts.push(`TEL:${phone.trim()}`);
  if (email?.trim()) parts.push(`EMAIL:${email.trim()}`);
  if (!parts.length) return '';
  return `MECARD:${parts.join(';')};;`;
}

export function buildMailto({
  email,
  subject,
  body,
}: {
  email: string;
  subject?: string;
  body?: string;
}): string {
  const to = email.trim();
  if (!to) return '';
  const q: string[] = [];
  if (subject?.trim()) q.push(`subject=${encodeURIComponent(subject.trim())}`);
  if (body?.trim()) q.push(`body=${encodeURIComponent(body.trim())}`);
  return `mailto:${to}${q.length ? `?${q.join('&')}` : ''}`;
}

export function buildTel(phone: string): string {
  const p = phone.trim();
  return p ? `tel:${p}` : '';
}

// Dispatcher : construit le payload à partir du type + des champs saisis.
export function buildPayload(
  type: QrTypeKey,
  f: Record<string, string>
): string {
  switch (type) {
    case 'link':
      return normalizeUrl(f.url ?? '');
    case 'text':
      return (f.text ?? '').trim();
    case 'wifi':
      return buildWifi({
        ssid: f.ssid ?? '',
        password: f.password,
        security: (f.security as WifiSecurity) || 'WPA',
      });
    case 'contact':
      return buildVCard({ name: f.name, phone: f.phone, email: f.email });
    case 'email':
      return buildMailto({
        email: f.email ?? '',
        subject: f.subject,
        body: f.body,
      });
    case 'phone':
      return buildTel(f.phone ?? '');
    default:
      return (f.text ?? '').trim();
  }
}

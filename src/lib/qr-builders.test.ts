import {
  buildMailto,
  buildPayload,
  buildTel,
  buildVCard,
  buildWifi,
  escapeWifi,
  normalizeUrl,
} from './qr-builders';

describe('qr-builders', () => {
  describe('normalizeUrl', () => {
    it('préfixe https:// si le schéma manque', () => {
      expect(normalizeUrl('exemple.com')).toBe('https://exemple.com');
    });
    it('laisse un schéma existant intact', () => {
      expect(normalizeUrl('http://a.com')).toBe('http://a.com');
      expect(normalizeUrl('https://a.com')).toBe('https://a.com');
    });
    it('renvoie une chaîne vide pour une entrée vide', () => {
      expect(normalizeUrl('   ')).toBe('');
    });
  });

  describe('buildWifi', () => {
    it('construit un payload WPA', () => {
      expect(buildWifi({ ssid: 'Net', password: 'pw', security: 'WPA' })).toBe(
        'WIFI:T:WPA;S:Net;P:pw;H:false;;'
      );
    });
    it('gère les réseaux ouverts (nopass)', () => {
      expect(buildWifi({ ssid: 'Open', security: 'nopass' })).toBe(
        'WIFI:T:nopass;S:Open;;'
      );
    });
    it('échappe les caractères spéciaux', () => {
      expect(escapeWifi('a;b:c')).toBe('a\\;b\\:c');
    });
    it('renvoie vide sans SSID', () => {
      expect(buildWifi({ ssid: '' })).toBe('');
    });
  });

  describe('buildVCard', () => {
    it('construit un MECARD partiel', () => {
      expect(buildVCard({ name: 'Mika', phone: '+33600000000' })).toBe(
        'MECARD:N:Mika;TEL:+33600000000;;'
      );
    });
    it('renvoie vide si tout est vide', () => {
      expect(buildVCard({})).toBe('');
    });
  });

  describe('buildMailto', () => {
    it('encode sujet et corps', () => {
      expect(buildMailto({ email: 'a@b.com', subject: 'Salut à toi' })).toBe(
        'mailto:a@b.com?subject=Salut%20%C3%A0%20toi'
      );
    });
  });

  describe('buildTel', () => {
    it('préfixe tel:', () => {
      expect(buildTel('+33600000000')).toBe('tel:+33600000000');
    });
  });

  describe('buildPayload', () => {
    it('dispatche selon le type', () => {
      expect(buildPayload('link', { url: 'a.com' })).toBe('https://a.com');
      expect(buildPayload('text', { text: '  hi  ' })).toBe('hi');
      expect(buildPayload('phone', { phone: '123' })).toBe('tel:123');
    });
  });
});

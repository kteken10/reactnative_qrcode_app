import {
  Call,
  Link21,
  Message,
  Profile2User,
  Sms,
  Wifi,
} from 'iconsax-react-native';
import type { ComponentType } from 'react';
import type { BorderRadius, MultiValue } from 'react-native-qrcode-styled';

import type { QrTypeKey } from '@/lib/qr-builders';

// ─── Types de QR + champs contextuels ───────────────────────────────────────
export type QrField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'chips';
  secure?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'url' | 'email-address' | 'phone-pad';
  options?: { key: string; label: string }[];
};

export type QrType = {
  key: QrTypeKey;
  label: string;
  Icon: ComponentType<any>;
  fields: QrField[];
};

export const QR_TYPES: QrType[] = [
  {
    key: 'link',
    label: 'Lien',
    Icon: Link21,
    fields: [
      {
        key: 'url',
        label: 'Lien',
        placeholder: 'exemple.com',
        keyboardType: 'url',
      },
    ],
  },
  {
    key: 'text',
    label: 'Texte',
    Icon: Message,
    fields: [
      {
        key: 'text',
        label: 'Texte',
        placeholder: 'Votre texte…',
        multiline: true,
      },
    ],
  },
  {
    key: 'wifi',
    label: 'Wi-Fi',
    Icon: Wifi,
    fields: [
      { key: 'ssid', label: 'Nom du réseau', placeholder: 'Mon réseau' },
      {
        key: 'password',
        label: 'Mot de passe',
        placeholder: '••••••••',
        secure: true,
      },
      {
        key: 'security',
        label: 'Sécurité',
        type: 'chips',
        options: [
          { key: 'WPA', label: 'WPA/WPA2' },
          { key: 'WEP', label: 'WEP' },
          { key: 'nopass', label: 'Aucune' },
        ],
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    Icon: Profile2User,
    fields: [
      { key: 'name', label: 'Nom complet', placeholder: 'Prénom Nom' },
      {
        key: 'phone',
        label: 'Téléphone',
        placeholder: '+33 6 00 00 00 00',
        keyboardType: 'phone-pad',
      },
      {
        key: 'email',
        label: 'E-mail',
        placeholder: 'nom@mail.com',
        keyboardType: 'email-address',
      },
    ],
  },
  {
    key: 'email',
    label: 'E-mail',
    Icon: Sms,
    fields: [
      {
        key: 'email',
        label: 'Destinataire',
        placeholder: 'nom@mail.com',
        keyboardType: 'email-address',
      },
      { key: 'subject', label: 'Sujet', placeholder: 'Sujet du message' },
      {
        key: 'body',
        label: 'Message',
        placeholder: 'Votre message…',
        multiline: true,
      },
    ],
  },
  {
    key: 'phone',
    label: 'Téléphone',
    Icon: Call,
    fields: [
      {
        key: 'phone',
        label: 'Numéro',
        placeholder: '+33 6 00 00 00 00',
        keyboardType: 'phone-pad',
      },
    ],
  },
];

// ─── Palette restreinte (couleurs du logo / charte) ─────────────────────────
export type QrColor = { name: string; value: string };
export const QR_COLORS: QrColor[] = [
  { name: 'Encre', value: '#090D12' },
  { name: 'Amber', value: '#FF8933' },
  { name: 'Teal', value: '#00D2B3' },
];

// ─── Formes du QR (mappées sur les props react-native-qrcode-styled) ────────
export type QrShape = {
  key: string;
  label: string;
  pieceBorderRadius: BorderRadius;
  eyeRadius: BorderRadius;
  isPiecesGlued?: boolean;
  pieceLiquidRadius?: MultiValue;
};
export const QR_SHAPES: QrShape[] = [
  { key: 'square', label: 'Classique', pieceBorderRadius: 0, eyeRadius: 0 },
  { key: 'soft', label: 'Doux', pieceBorderRadius: '25%', eyeRadius: '20%' },
  { key: 'dots', label: 'Points', pieceBorderRadius: '50%', eyeRadius: '35%' },
  {
    key: 'fluid',
    label: 'Fluide',
    pieceBorderRadius: '50%',
    eyeRadius: '40%',
    isPiecesGlued: true,
    pieceLiquidRadius: '50%',
  },
];

export function shapeByKey(key?: string): QrShape {
  return QR_SHAPES.find((s) => s.key === key) ?? QR_SHAPES[0];
}

// ─── Formats de codes-barres ─────────────────────────────────────────────────
export type BarcodeFormat = { key: string; label: string; hint: string };
export const BARCODE_FORMATS: BarcodeFormat[] = [
  { key: 'CODE128', label: 'Code 128', hint: 'Texte et chiffres' },
  { key: 'EAN13', label: 'EAN-13', hint: '12 à 13 chiffres' },
  { key: 'UPC', label: 'UPC-A', hint: '11 à 12 chiffres' },
  { key: 'CODE39', label: 'Code 39', hint: 'A–Z, 0–9' },
];

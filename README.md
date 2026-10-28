# QR Studio

<p align="center"><img src="docs/banner.png" alt="QR Studio: QR code and barcode studio built with React Native" width="100%"></p>

![React Native](https://img.shields.io/badge/React%20Native-0.81-20232A?logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-0A2540)

A mobile studio to create styled QR codes and barcodes, keep them in a library and follow their scans.

## Screens

<p align="center"><img src="docs/tour.gif" width="260" alt="Tour of the app: home, studio, generated QR code, analytics, library"></p>

| Home | Studio | Your QR code |
|:---:|:---:|:---:|
| <img src="docs/screens/home.png" width="160" alt="Home screen"> | <img src="docs/screens/studio.png" width="160" alt="Studio screen"> | <img src="docs/screens/your-qr-code.png" width="160" alt="Generated QR code"> |

| Analytics | Library | Onboarding |
|:---:|:---:|:---:|
| <img src="docs/screens/analytics.png" width="160" alt="Analytics screen"> | <img src="docs/screens/library.png" width="160" alt="Library screen"> | <img src="docs/screens/onboarding.png" width="160" alt="Onboarding screen"> |

## Features

- **Studio**: QR codes for a link, a text, a Wi-Fi network, a contact, an e-mail or a phone number, with a live preview, three colours and four module shapes.
- **Barcodes**: Code 128, EAN-13, UPC-A and Code 39.
- **Share**: the generated code opens in a card to copy its content or share it.
- **Home**: statistics, recent activity and folders in a carousel, and quick creation by type.
- **Library**: search, folder and status filters, favourites, sorting.
- **Analytics**: weekly scan volume, main device segment, conversion and reports.
- **Scanner**: decoding with the camera.
- **Onboarding** and sign-in, with a guest mode to explore the demo.

## Tech stack

- React Native 0.81, Expo 54 (New Architecture), Expo Router, TypeScript
- NativeWind, Reanimated, Gesture Handler
- [react-native-qrcode-styled](https://github.com/tokkozhin/react-native-qrcode-styled), react-native-barcode-svg, expo-camera, expo-clipboard
- Jest: QR payload builders (Wi-Fi, contact, e-mail…) are covered by tests

```
src/
├── app/            screens (Expo Router): onboarding, auth, dashboard,
│                   generator, scanner, library, analytics, settings
├── components/     premium UI kit and shared primitives
├── data/           QR types, barcode formats, demo data
└── lib/            QR payload builders, demo state, theme
```

## Getting started

```bash
pnpm install
pnpm start          # Metro, in development-client mode
pnpm android        # local Android build
pnpm test
```

The app runs on demo data: no account or backend is needed.

## Author

**Dissang Kevin** · Mobile AI Engineer
[Portfolio](https://dissangkevin.work) · [GitHub](https://github.com/kteken10)

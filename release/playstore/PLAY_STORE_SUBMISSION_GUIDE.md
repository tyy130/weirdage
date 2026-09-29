# GOOGLE PLAY STORE SUBMISSION GUIDE // WEIRDAGE
**Package ID:** `com.slughouse.weirdage`  
**Version:** `1.0.0` (`versionCode 1`)  
**Production Bundle:** `release/weirdage-v1.0.0.aab`  
**Direct Test APK:** `release/weirdage-v1.0.0.apk`

---

## 1. Google Play Console Listing Details

### App Name (Max 30 chars)
```text
WeirdAge: Days, Not Years
```

### Short Description (Max 80 chars)
```text
Stop counting birthdays. Count days. Visceral chronological intelligence.
```

### Full Description (Max 4000 chars)
```text
You're older than you think.

People normally describe their age as "30 years old."
WeirdAge translates that into visceral, surprising, and aesthetically arresting measurements:

• 10,957 DAYS ALIVE
• 262,977 HOURS ELAPSED
• 15.8 MILLION MINUTES
• 946.7 MILLION SECONDS
• 1,566 SUNDAYS SURVIVED
• 30 TRIPS AROUND THE SUN

PUT THAT IN PERSPECTIVE:
• 10,957 sunsets witnessed aboard Earth.
• 28.2 Billion kilometers flown hitched to Earth's orbital velocity (~107,226 km/h).
• 1.18 Billion continuous cardiac contractions without a reboot.
• 10 years spent in deep restorative sleep.
• 126 complete cellular red blood cell regenerations.

THE SHARE CARD STUDIO:
Turn your personal chronometry into a publication-grade 1080×1920 portrait card formatted for Instagram Stories, TikTok, Snapchat, and Messages. Choose from 4 industrial themes:
• Editorial — Warm cream Swiss paper layout, high-kerning typography, terracotta accent.
• Dark — Deep obsidian base, Slughouse MTX metadata stack, scanline texture.
• Electric — High-voltage Acid Neon Lime (#D4FF00) and Cyber Cyan.
• Weird — Surreal monochromatic horizontal split, inverted telemetry, ASCII crosshairs.

100% PRIVATE & ZERO-KNOWLEDGE:
• Zero accounts. Zero cloud servers.
• Zero tracking, cookies, or ad networks.
• All calculations run directly on your device.

ONE-TIME $0.49 PRO PASS:
No recurring subscriptions. Unlock all 4 themes, remove all branding watermarks from exported cards, and access deep cosmic telemetry.
```

---

## 2. Store Assets Checklist

| Asset | Specifications | File Location |
| :--- | :--- | :--- |
| **App Icon** | 512 × 512 PNG, 32-bit color, no transparency | `release/playstore/icon_512x512.png` |
| **Feature Graphic** | 1024 × 500 PNG/JPEG, no transparency | `release/playstore/feature_graphic_1024x500.png` |
| **Screenshot 1** | 1080 × 1920 (9:16) Portrait | `release/playstore/screenshots/01_input_screen.png` |
| **Screenshot 2** | 1080 × 1920 (9:16) Portrait | `release/playstore/screenshots/02_results_screen.png` |
| **Screenshot 3** | 1080 × 1920 (9:16) Portrait | `release/playstore/screenshots/03_interactive_calendar.png` |
| **Screenshot 4** | 1080 × 1920 (9:16) Portrait | `release/playstore/screenshots/04_share_dark.png` |
| **Screenshot 5** | 1080 × 1920 (9:16) Portrait | `release/playstore/screenshots/05_pro_modal.png` |
| **Screenshot 6** | 1080 × 1920 (9:16) Portrait | `release/playstore/screenshots/06_card_editorial.png` |
| **Screenshot 7** | 1080 × 1920 (9:16) Portrait | `release/playstore/screenshots/07_card_dark.png` |
| **Screenshot 8** | 1080 × 1920 (9:16) Portrait | `release/playstore/screenshots/08_card_electric.png` |

---

## 3. Play Console Setup Steps

1. Log into [Google Play Console](https://play.google.com/console).
2. Click **Create app**:
   - App name: `WeirdAge: Days, Not Years`
   - Default language: `English (United States)`
   - App or game: `App`
   - Free or paid: `Free`
3. In **Dashboard > Set up your app**:
   - **Privacy Policy:** `https://tyy130.github.io/weirdage/#privacy`
   - **App access:** All functionality is available without special access.
   - **Ads:** No, my app does not contain ads.
   - **Content rating:** Complete questionnaire (utility, no violence, no user interaction, no data sharing → result: `PEGI 3 / Everyone`).
   - **Target audience:** 13+ (or Everyone).
   - **News apps:** No.
   - **Data safety:**
     - Does your app collect or share user data? **No**.
     - (All data is processed locally on device).
   - **Category:** `Tools` or `Lifestyle`. Tags: `Age calculator`, `Lifestyle`, `Tools`.
4. In **Store presence > Main store listing**:
   - Paste Title, Short Description, and Full Description above.
   - Upload `release/playstore/icon_512x512.png`.
   - Upload `release/playstore/feature_graphic_1024x500.png`.
   - Upload the 8 screenshots from `release/playstore/screenshots/`.
5. In **Monetize > Products > In-app products**:
   - Click **Create product**:
     - Product ID: `com.slughouse.weirdage.pro_unlock_049`
     - Name: `WeirdAge Pro Pass`
     - Description: `Unlock all 4 share themes, unbranded 1080x1920 card export, and cosmic telemetry.`
     - Status: `Active`
     - Price: `$0.49 USD`
6. In **Release > Production (or Closed testing)**:
   - Click **Create new release**.
   - Upload `release/weirdage-v1.0.0.aab`.
   - Release name: `1.0.0`.
   - Release notes:
     ```text
     Initial release of WeirdAge.
     - Translate your birthday into days, hours, minutes, seconds, and Sundays
     - Live chronometer mode
     - 1080x1920 high-resolution portrait share card studio
     - Zero tracking, 100% offline
     ```
   - Click **Save > Review release > Start rollout to Production**!

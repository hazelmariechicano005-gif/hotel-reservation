# DIVAA HOTEL - Web Reservation System 🏨✨

Isang kumpleto at modernong **Hotel Reservation System** na binuo gamit ang **React.js**, **Bootstrap 5**, **Service Worker**, at **Web App Manifest (PWA)**, batay sa eleganteng inspirasyon ng boutique hotel (Bergen Harbour aesthetic).

---

## 🌟 Mga Tampok (Features)

1. **Eleganteng Disenyo (Bergen Harbour Inspo)**
   - Custom boxed logo: **DIVAA HOTEL**
   - Warm cream at ochre gold theme palette (`#b88737`)
   - Makinis na hover effects at animated underline transitions sa navbar links
   - Hero section na may 5-star rating (`4.4 Google reviews`), headline, CTA buttons, at 3 highlight stats (`100 m`, `100+`, `1 min`)

2. **Lahat ng Navbar Buttons ay Gumagana**
   - **Home**: Dadalhin ka sa Hero section at pangkalahatang overview.
   - **The hotel**: Impormasyon tungkol sa amenities, concierge, at arkitektura ng DIVAA HOTEL.
   - **Our rooms**: Listahan ng mga kuwarto (Deluxe King, Executive Suite, Ocean View Balcony, Grand Penthouse) na may filter tabs at direct "Book" buttons.
   - **Food and drink**: Mga restaurant, rooftop bar, at breakfast buffet ng hotel.
   - **Contact**: May gumaganang contact form na nagpapakita ng success notification kapag nag-submit.
   - **Booking**: Nagbubukas ng interactive booking modal na may live calculation ng gabi at kabuuang presyo, nagse-save sa `localStorage`, at nagpapakita ng resibo/kumpirmasyon.
   - **GB EN / PH TL Switcher**: Pwedeng magpalit ng wika mula English patungong Filipino/Tagalog!

3. **Service Worker at Manifest.json (PWA)**
   - `manifest.json`: Handa para sa installation bilang desktop o mobile app.
   - `sw.js`: May offline caching para gumana kahit mabagal o walang internet.

---

## 💻 Paano Buksan at Patakbuhin sa Visual Studio Code (VS Code)

Dahil nakalagay na ang lahat ng files sa iyong folder:
`c:\Users\hazel\OneDrive\Documents\Hotel Reservation system`

### Hakbang 1: Buksan sa VS Code
1. Buksan ang **Visual Studio Code**.
2. I-click ang **File** > **Open Folder...**
3. Piliin ang folder na: `c:\Users\hazel\OneDrive\Documents\Hotel Reservation system`
4. I-click ang **Select Folder**.

### Hakbang 2: Buksan ang Terminal sa VS Code
Pindutin ang `` Ctrl + ` `` (o pumunta sa **Terminal** > **New Terminal** sa menu sa itaas).

### Hakbang 3: Patakbuhin ang Proyekto
Sa terminal, i-type lamang:
```bash
npm run dev
```
*(Kung sakaling may restriction sa PowerShell, gamitin ang `npm.cmd run dev`)*

May lalabas na link:
👉 `http://localhost:5173/` o `http://localhost:5174/`  
I-click ito o buksan sa browser para makita ang tumatakbong website!

---

## 📁 Istraktura ng Proyekto (Project Structure)

```text
Hotel Reservation system/
├── public/
│   ├── favicon.svg          # DIVAA HOTEL icon
│   ├── icon-192.png         # PWA App Icon 192x192
│   ├── icon-512.png         # PWA App Icon 512x512
│   ├── manifest.json        # PWA Manifest configuration
│   └── sw.js                # Service Worker (Offline caching)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Header, Logo Box, Links with hover underlines, Booking Button
│   │   ├── Hero.jsx         # Hero Banner, Ratings, Stats
│   │   ├── HotelInfo.jsx    # The Hotel section & amenities
│   │   ├── RoomSection.jsx  # Rooms catalog, filter pills, book buttons
│   │   ├── DiningSection.jsx# Food & Drink venues
│   │   ├── ContactSection.jsx# Contact form & hotel details
│   │   ├── BookingModal.jsx # Functional reservation modal & receipt
│   │   └── Footer.jsx       # Footer with PWA install option
│   ├── data/
│   │   └── rooms.js         # Room data, dining info, translations
│   ├── App.jsx              # Main application logic & navigation state
│   ├── index.css            # Custom CSS, transitions, hover states & fonts
│   └── main.jsx             # Entry file & Service Worker registration
├── index.html               # Main HTML entry
├── package.json             # Dependencies
└── vite.config.js           # Vite config
```

---

## 🛠️ Pag-build para sa Production
Kapag handa ka nang i-deploy o i-upload:
```bash
npm run build
```
Lilikha ito ng `dist/` folder na handang i-host sa anumang web server o hosting provider (Vercel, Netlify, GitHub Pages, atbp.).

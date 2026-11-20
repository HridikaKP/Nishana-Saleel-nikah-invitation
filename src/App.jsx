import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "./index.css";

const MAP_LINK = "https://maps.app.goo.gl/pCWr5x6pk6CHmEDR6";
const WEDDING_DATE = new Date("2026-12-12T10:00:00+05:30").getTime();

export default function App() {
  const [lang, setLang] = useState("en"); // 'en' or 'ml'
  const [opened, setOpened] = useState(false);
  const [gateHidden, setGateHidden] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  // Form states
  const [duaData, setDuaData] = useState({ name: "", message: "" });
  const [duaSubmitted, setDuaSubmitted] = useState(false);

  const audioRef = useRef(null);

  // Countdown timer
  const calculateTime = () => {
    const diff = WEDDING_DATE - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => setTime(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Language switch
  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ml" : "en"));
  };

  // Music controls
  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.volume = 0.4;
      await audio.play();
      setMusicPlaying(true);
    } catch {
      setMusicPlaying(false);
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await startMusic();
    } else {
      audio.pause();
      setMusicPlaying(false);
    }
  };

  // Open Invitation Envelope (Template: 3.jpeg)
  const handleOpenInvitation = () => {
    setOpened(true);

    // Confetti celebration
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.45 },
        colors: ["#b8964f", "#dfbe6f", "#fae7be", "#8b1524", "#fdfdfb"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 120,
          origin: { y: 0.35 },
          colors: ["#dfbe6f", "#fae7be", "#7a1522", "#c5a059"],
        });
      }, 350);
    } catch (e) {
      console.warn("Confetti effect failed:", e);
    }

    // Play music
    startMusic();

    // Scroll to 2nd template after envelope unseals
    setTimeout(() => {
      setGateHidden(true);
      document.getElementById("main-card")?.scrollIntoView({ behavior: "smooth" });
    }, 1150);
  };

  // Re-open / Return to Envelope
  const handleBackToEnvelope = () => {
    setOpened(false);
    setGateHidden(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll to continuation
  const scrollToContinuation = () => {
    document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" });
  };

  // Add to Calendar (.ics download)
  const handleAddToCalendar = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nikah Invitation//EN",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@saleel-nishana-nikah",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      "DTSTART:20261212T043000Z", // 10:00 AM IST is 04:30 UTC
      "DTEND:20261212T083000Z",   // 2:00 PM IST is 08:30 UTC
      "SUMMARY:Nikah Ceremony of Nishana Sherin & Adv. Saleel Nelliyali",
      "DESCRIPTION:Nikah ceremony and reception at Taj Convention Center, Chemmad.",
      "LOCATION:Taj Convention Center, Chemmad",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Nishana-Saleel-Nikah.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // WhatsApp share link
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `You're invited! 🌙 Join us for the Nikah Ceremony of Nishana Sherin & Adv. Saleel Nelliyali on Saturday, 12th December 2026, 10:00 AM at Taj Convention Center, Chemmad.\n\n${window.location.origin || window.location.href}`
  )}`;

  return (
    <div className={`wedding-app ${lang === "ml" ? "lang-ml" : ""}`}>
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/music/wedding-musicmpeg_8fCSWSPl.wav"
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />

      {/* ========================================================
         TOP UTILITY BAR (Fixed: Language & Music Toggles)
         ======================================================== */}
      <header className="top-bar">
        <button
          className="util-btn lang-btn"
          onClick={toggleLanguage}
          aria-label="Switch language between English and Malayalam"
        >
          <span className="util-icon">🌐</span>
          <span>{lang === "en" ? "മലയാളം" : "English"}</span>
        </button>

        <button
          className="util-btn music-btn"
          onClick={toggleMusic}
          aria-label="Play or pause background music"
        >
          <span className="util-icon">{musicPlaying ? "⏸" : "🎵"}</span>
          <span>
            {musicPlaying
              ? lang === "en" ? "Pause" : "നിര്‍ത്തുക"
              : lang === "en" ? "Play" : "പ്ലേ"}
          </span>
        </button>
      </header>

      {/* ========================================================
         OPENING ENVELOPE COVER (Template: public/3.jpeg)
         Ivory Pearl Marble with Ruby Florals & Interactive Open Button
         ======================================================== */}
      {!gateHidden && (
        <div id="envelope-cover" className={`envelope-screen ${opened ? "envelope-opened" : ""}`}>
          <div className="envelope-card-outer">
            {/* Monogram emblem */}
            <div className="envelope-monogram-wrap">
              <img
                src="/n and s monogram.png"
                alt="N & S Monogram"
                className="envelope-monogram"
              />
            </div>

            {/* Ruby Calligraphy Bismillah */}
            <div className="envelope-bismillah-wrap">
              <img
                src="/bismillah-ruby.png"
                alt="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                className="envelope-bismillah-img"
              />
            </div>

            <div className="envelope-titles">
              <p className="envelope-subtitle">
                {lang === "en" ? "NIKAH INVITATION" : "നികാഹ് ക്ഷണക്കത്ത്"}
              </p>
              <h1 className="envelope-couple-names">
                Nishana <span>&</span> Saleel
              </h1>
              <p className="envelope-date">
                {lang === "en" ? "12 · 12 · 2026" : "12 · 12 · 2026"}
              </p>
            </div>

            {/* Royal Open Invitation Button */}
            <button className="envelope-open-button" onClick={handleOpenInvitation}>
              <span className="btn-icon">✉</span>
              <span>{lang === "en" ? "OPEN INVITATION" : "ക്ഷണക്കത്ത് തുറക്കുക"}</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
         MAIN INVITATION WRAPPER
         ======================================================== */}
      <main className="main-content">
        {/* ========================================================
           PAGE 1: 2ND TEMPLATE (public/2.jpeg)
           Rendered and written like 1.jpeg with gold/beige elegance
           ======================================================== */}
        <section id="main-card" className="card-page-2">
          <div className="card-page-2-content">
            {/* 1. Clean Gold Bismillah Calligraphy */}
            <div className="card-bismillah-wrap">
              <img
                src="/bismillah-clean.png"
                alt="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                className="card-bismillah-img"
              />
            </div>

            {/* 2. Quran 30:21 quote */}
            <div className="card-quran-box">
              <p className="card-quran-text">
                {lang === "en" ? (
                  <>
                    AND WE CREATED YOU IN PAIRS<br />
                    THAT YOU MAY FIND TRANQUILITY<br />
                    IN ONE ANOTHER.
                  </>
                ) : (
                  <>
                    നിങ്ങൾക്ക് സമാധാനം കണ്ടെത്താൻ<br />
                    നിങ്ങളിൽ നിന്ന് തന്നെ നിങ്ങൾക്ക്<br />
                    ഇണകളെ സൃഷ്ടിച്ചു.
                  </>
                )}
              </p>
              <p className="card-quran-ref">— QURAN 30:21 —</p>
            </div>

            {/* 3. Ornamental Divider */}
            <div className="card-ornament" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-gem">❖</span>
              <span className="ornament-line" />
            </div>

            {/* 4. Overhead text */}
            <p className="card-overhead">
              {lang === "en"
                ? "TOGETHER WITH THEIR FAMILIES"
                : "കുടുംബാംഗങ്ങളോടൊപ്പം സ്നേഹപൂർവ്വം"}
            </p>

            {/* 5. Couple Names in Rustic Roadway */}
            <div className="card-couple-block">
              <h1 className="card-name bride-name">Nishana Sherin</h1>
              <span className="card-ampersand">&</span>
              <h1 className="card-name groom-name">Adv. Saleel Nelliyali</h1>
            </div>

            {/* 6. Action Invitation Text */}
            <p className="card-action-text">
              {lang === "en" ? (
                <>
                  JOYFULLY INVITE YOU TO CELEBRATE<br />
                  THEIR NIKAH
                </>
              ) : (
                <>
                  നികാഹ് മംഗള ചടങ്ങിലേക്ക്<br />
                  താങ്കളെ ഹൃദ്യമായി ക്ഷണിക്കുന്നു
                </>
              )}
            </p>

            {/* 7. Ornamental Divider */}
            <div className="card-ornament" aria-hidden="true">
              <span className="ornament-line" />
              <span className="ornament-gem">❖</span>
              <span className="ornament-line" />
            </div>

            {/* 8. Event Date */}
            <div className="card-quick-details">
              <p className="card-date-line">
                {lang === "en"
                  ? "SATURDAY, 12 DECEMBER 2026"
                  : "ശനിയാഴ്ച, 12 ഡിസംബർ 2026"}
              </p>
            </div>

            {/* Smooth Scroll indicator to continuation */}
            <button
              className="scroll-indicator"
              onClick={scrollToContinuation}
              aria-label="Scroll to detailed pages"
            >
              <span className="scroll-label">
                {lang === "en" ? "Explore Details" : "വിശദാംശങ്ങൾ കാണുക"}
              </span>
              <span className="scroll-arrow">↓</span>
            </button>
          </div>
        </section>

        {/* ========================================================
           ALTERNATING CONTINUATION SECTIONS:
           Alternating between public/3.jpeg (Ivory Pearl) & public/5.jpeg (Velvet Wine)
           ======================================================== */}

        {/* 1. A LETTER TO YOU (Template: public/3.jpeg - Ivory Pearl Marble) */}
        <section id="welcome" className="section letter-section theme-ivory-3">
          <h2 className="section-title">
            {lang === "en" ? "A Letter To You" : "താങ്കള്‍ക്കൊരു കത്ത്"}
          </h2>
          <p className="section-sub">
            {lang === "en" ? "Open with care" : "സ്നേഹത്തോടെ തുറക്കുക"}
          </p>

          <div className="letter-wrapper">
            {!letterOpen ? (
              <div
                className="envelope-card"
                role="button"
                tabIndex={0}
                onClick={() => setLetterOpen(true)}
                onKeyDown={(e) => e.key === "Enter" && setLetterOpen(true)}
                aria-label="Open welcome letter"
              >
                <div className="envelope-seal">💌</div>
                <p className="envelope-prompt">
                  {lang === "en"
                    ? "Tap to open our welcome letter"
                    : "ഞങ്ങളുടെ സ്വാഗത കത്ത് തുറക്കാന്‍ ടാപ്പ് ചെയ്യുക"}
                </p>
                <span className="envelope-sub">✉ Open Envelope</span>
              </div>
            ) : (
              <div className="letter-content-box unfold-animation">
                <p className="letter-greeting">
                  {lang === "en"
                    ? "Dear Family & Friends,"
                    : "പ്രിയപ്പെട്ട കുടുംബാംഗങ്ങളും സുഹൃത്തുക്കളും,"}
                </p>
                <p className="letter-body">
                  {lang === "en" ? (
                    <>
                      By the grace of Allah, <strong>Nishana Sherin</strong> and{" "}
                      <strong>Adv. Saleel Nelliyali</strong> begin a new chapter of their
                      lives together. This day means everything to our families,
                      and it would mean even more with you by our side.
                      <br />
                      <br />
                      Your love, presence, and prayers have always been a source
                      of strength, and we hope you will join us as we celebrate
                      this sacred bond with joy, gratitude, and prayer.
                    </>
                  ) : (
                    <>
                      അള്ളാഹുവിന്റെ അനുഗ്രഹത്താല്‍ <strong>നിഷാന ഷെറിനും</strong>{" "}
                      <strong>അഡ്വ. സലീൽ നെല്ലിയാളി</strong>യും ജീവിതത്തിലെ പുതിയൊരു അധ്യായം
                      ഒരുമിച്ച് ആരംഭിക്കുകയാണ്. ഈ ദിവസം ഞങ്ങളുടെ കുടുംബങ്ങള്‍ക്ക്
                      ഏറെ പ്രധാനപ്പെട്ടതാണ്, താങ്കളുടെ സാന്നിധ്യം കൊണ്ട് അത് കൂടുതല്‍
                      അര്‍ത്ഥവത്താകും.
                      <br />
                      <br />
                      ഈ പുണ്യ ബന്ധത്തിന്റെ സന്തോഷത്തിലും പ്രാര്‍ത്ഥനയിലും
                      ഞങ്ങളോടൊപ്പം ചേരണമെന്ന് സ്നേഹപൂര്‍വ്വം അഭ്യര്‍ത്ഥിക്കുന്നു.
                    </>
                  )}
                </p>
                <div className="letter-signature">
                  <span>
                    {lang === "en" ? "With love and gratitude," : "സ്നേഹത്തോടെ,"}
                  </span>
                  <h4>The Families</h4>
                </div>

                <button
                  className="close-letter-btn"
                  onClick={() => setLetterOpen(false)}
                >
                  {lang === "en" ? "Close Letter ↑" : "കത്ത് മടക്കുക ↑"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 2. THE BRIDE & GROOM DETAILS (Template: public/5.jpeg - Deep Wine Damask) */}
        <section id="families" className="section families-section theme-wine-5">
          <div className="section-header-ornate">
            <span className="ornate-sub-badge">
              {lang === "en" ? "WITH THE BLESSINGS OF ALLAH" : "അള്ളാഹുവിന്റെ അനുഗ്രഹത്തോടെ"}
            </span>
            <h2 className="section-title">
              {lang === "en" ? "The Bride & Groom" : "വധൂവരന്മാരും കുടുംബങ്ങളും"}
            </h2>
            <div className="section-title-divider" aria-hidden="true">
              <span className="gold-div-line" />
              <span className="gold-div-gem">❖</span>
              <span className="gold-div-line" />
            </div>
          </div>

          <div className="families-flow">
            {/* 1. BRIDE & HER PARENTS (First) */}
            <div className="person-family-block bride-block">
              <span className="role-tag">
                {lang === "en" ? "THE BRIDE" : "വധു"}
              </span>
              <h3 className="person-script-name">Nishana Sherin</h3>
              <div className="parents-line-wrap">
                <span className="relation-label">
                  {lang === "en" ? "Daughter of" : "മകൾ"}
                </span>
                <h4 className="parents-display-name">
                  Abdul Majeed C &amp; Suhara P
                </h4>
              </div>
            </div>

            {/* Elegant Celestial Connector */}
            <div className="couple-connector" aria-hidden="true">
              <span className="connector-line" />
              <span className="connector-ampersand">&amp;</span>
              <span className="connector-line" />
            </div>

            {/* 2. GROOM & HIS PARENTS (Then Groom) */}
            <div className="person-family-block groom-block">
              <span className="role-tag">
                {lang === "en" ? "THE GROOM" : "വരൻ"}
              </span>
              <h3 className="person-script-name">Adv. Saleel Nelliyali</h3>
              <div className="parents-line-wrap">
                <span className="relation-label">
                  {lang === "en" ? "Son of" : "മകൻ"}
                </span>
                <h4 className="parents-display-name">
                  Abdul Majeed &amp; Safiya
                </h4>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SAVE THE DATE & LIVE COUNTDOWN (Template: public/3.jpeg - Ivory Pearl Marble) */}
        <section id="event" className="section save-date-section theme-ivory-3">
          <div className="section-header-ornate">
            <span className="ornate-sub-badge">
              {lang === "en" ? "SAVE THE DATE" : "ദിവസം കുറിച്ചു വെക്കൂ"}
            </span>
            <h2 className="section-title">
              {lang === "en" ? "Date of Nikah" : "നികാഹ് തീയതി"}
            </h2>
            <div className="section-title-divider" aria-hidden="true">
              <span className="gold-div-line" />
              <span className="gold-div-gem">❖</span>
              <span className="gold-div-line" />
            </div>
          </div>

          {/* Highlighted Nikkah Date Plaque */}
          <div className="nikkah-highlight-card">
            <div className="nikkah-badge-strip">
              <span className="nh-star">✦</span>
              <span className="nh-title">
                {lang === "en" ? "THE SACRED NIKAH" : "വിശുദ്ധ നികാഹ്"}
              </span>
              <span className="nh-star">✦</span>
            </div>

            <h3 className="nikkah-main-date">
              {lang === "en" ? "Saturday, 12th December 2026" : "ശനിയാഴ്ച, 12 ഡിസംബർ 2026"}
            </h3>

            <p className="nikkah-arabic-verse">بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا</p>

            <div className="nikkah-time-badge">
              <span className="nt-icon">⏰</span>
              <span className="nt-text">
                {lang === "en" ? "Nikah Time: 10:00 AM" : "നികാഹ് സമയം: രാവിലെ 10:00"}
              </span>
            </div>
          </div>

          <p className="countdown-lead">
            {lang === "en"
              ? "Live countdown to the blessed moment"
              : "ശുഭ മുഹൂർത്തത്തിലേക്കുള്ള ലൈവ് കൗണ്ട്ഡൗൺ"}
          </p>

          <div className="countdown-grid">
            <div className="cd-box">
              <span className="cd-num">{String(time.days).padStart(2, "0")}</span>
              <span className="cd-label">{lang === "en" ? "Days" : "ദിവസം"}</span>
            </div>
            <div className="cd-box">
              <span className="cd-num">{String(time.hours).padStart(2, "0")}</span>
              <span className="cd-label">{lang === "en" ? "Hours" : "മണിക്കൂര്‍"}</span>
            </div>
            <div className="cd-box">
              <span className="cd-num">{String(time.minutes).padStart(2, "0")}</span>
              <span className="cd-label">{lang === "en" ? "Mins" : "മിനിറ്റ്"}</span>
            </div>
            <div className="cd-box">
              <span className="cd-num">{String(time.seconds).padStart(2, "0")}</span>
              <span className="cd-label">{lang === "en" ? "Secs" : "സെക്കന്‍ഡ്"}</span>
            </div>
          </div>
        </section>

        {/* 4. EVENT LOCATION & INTERACTIVE ACTIONS (Template: public/5.jpeg - Deep Wine Damask) */}
        <section id="venue" className="section location-section theme-wine-5">
          <div className="section-header-ornate">
            <span className="ornate-sub-badge">
              {lang === "en" ? "WHERE TO CELEBRATE" : "നികാഹ് വേദി"}
            </span>
            <h2 className="section-title">
              {lang === "en" ? "Event Location" : "വേദിയും വിവരങ്ങളും"}
            </h2>
            <div className="section-title-divider" aria-hidden="true">
              <span className="gold-div-line" />
              <span className="gold-div-gem">❖</span>
              <span className="gold-div-line" />
            </div>
          </div>

          {/* Grand Eye-Catching Venue Showcase Plaque */}
          <div className="venue-grand-showcase">
            <div className="venue-royal-emblem">
              <span className="venue-crown-icon">🏛</span>
            </div>

            <span className="venue-tag-pill">
              {lang === "en" ? "OFFICIAL NIKAH VENUE" : "നികാഹ് വേദി"}
            </span>

            <h3 className="venue-grand-name">
              TAJ CONVENTION CENTER
            </h3>

            <p className="venue-grand-address">
              Chemmad, Malappuram, Kerala
            </p>

            <div className="venue-program-strip">
              <div className="program-item">
                <span className="prog-icon">💍</span>
                <span className="prog-label">{lang === "en" ? "Nikah Ceremony" : "നികാഹ് ചടങ്ങ്"}</span>
                <span className="prog-time">10:00 AM</span>
              </div>
              <div className="program-divider" />
              <div className="program-item">
                <span className="prog-icon">🍽</span>
                <span className="prog-label">{lang === "en" ? "Reception Begins" : "വിരുന്ന് ആരംഭം"}</span>
                <span className="prog-time">11:00 AM</span>
              </div>
            </div>

            {/* Eye-Catching Attractive Action Buttons */}
            <div className="venue-cta-grid">
              <button
                className="eye-catching-btn btn-calendar"
                onClick={handleAddToCalendar}
                aria-label="Add to Calendar"
              >
                <div className="cta-icon-box">
                  <span className="cta-emoji">📆</span>
                </div>
                <div className="cta-text-box">
                  <span className="cta-sub">
                    {lang === "en" ? "SAVE TO DEVICE" : "ഓർമ്മക്കുറിപ്പ്"}
                  </span>
                  <span className="cta-main">
                    {lang === "en" ? "Add to Calendar" : "കലണ്ടറില്‍ ചേര്‍ക്കുക"}
                  </span>
                </div>
              </button>

              <a
                className="eye-catching-btn btn-location"
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get Directions on Google Maps"
              >
                <div className="cta-icon-box">
                  <span className="cta-emoji">📍</span>
                </div>
                <div className="cta-text-box">
                  <span className="cta-sub">
                    {lang === "en" ? "GOOGLE MAPS NAV" : "ഗൂഗിൾ മാപ്പ്"}
                  </span>
                  <span className="cta-main">
                    {lang === "en" ? "Get Location" : "വഴി കാണിക്കുക"}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* 5. EVENT SCHEDULE (Template: public/3.jpeg - Ivory Pearl Marble - Timeline Layout) */}
        <section id="schedule" className="section schedule-section theme-ivory-3">
          <div className="timeline-header">
            <h2 className="timeline-main-title">
              {lang === "en" ? "Event Schedule" : "നികാഹ് ദിന പരിപാടികൾ"}
            </h2>
            <p className="timeline-main-sub">
              {lang === "en"
                ? "SATURDAY, 12TH DECEMBER 2026"
                : "ശനിയാഴ്ച, 12 ഡിസംബർ 2026"}
            </p>
          </div>

          <div className="timeline-container">
            <div className="timeline-list">
              {/* 1. Guest Arrival */}
              <div className="timeline-item">
                <div className="timeline-node" aria-hidden="true">
                  <span className="timeline-node-inner" />
                </div>
                <div className="timeline-content">
                  <span className="timeline-time">9:30 AM</span>
                  <h3 className="timeline-title">
                    {lang === "en" ? "Guest Arrival" : "അതിഥികൾ എത്തിച്ചേരൽ"}
                  </h3>
                  <p className="timeline-desc">
                    {lang === "en"
                      ? "Welcome and seating at Taj Convention Center"
                      : "താജ് കൺവെൻഷൻ സെന്ററിലേക്ക് സ്വാഗതവും ഇരിപ്പിടവും"}
                  </p>
                </div>
              </div>

              {/* 2. Nikah Ceremony */}
              <div className="timeline-item">
                <div className="timeline-node" aria-hidden="true">
                  <span className="timeline-node-inner" />
                </div>
                <div className="timeline-content">
                  <span className="timeline-time">10:00 AM</span>
                  <h3 className="timeline-title">
                    {lang === "en" ? "Nikah Ceremony" : "നികാഹ് ചടങ്ങ്"}
                  </h3>
                  <p className="timeline-desc">
                    {lang === "en"
                      ? "The blessed solemnization"
                      : "അനുഗ്രഹീതമായ നികാഹ് കർമ്മങ്ങൾ"}
                  </p>
                </div>
              </div>

              {/* 3. Reception Begins */}
              <div className="timeline-item">
                <div className="timeline-node" aria-hidden="true">
                  <span className="timeline-node-inner" />
                </div>
                <div className="timeline-content">
                  <span className="timeline-time">11:00 AM</span>
                  <h3 className="timeline-title">
                    {lang === "en" ? "Reception Begins" : "വിരുന്ന് ആരംഭം"}
                  </h3>
                  <p className="timeline-desc">
                    {lang === "en"
                      ? "Refreshments and celebration with family and friends"
                      : "കുടുംബത്തോടും സുഹൃത്തുക്കളോടുമൊപ്പം സൽക്കാരവും സന്തോഷവും"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. DUA REQUEST (Template: public/5.jpeg - Deep Wine Damask) */}
        <section id="dua" className="section form-section theme-wine-5">
          <h2 className="section-title">
            {lang === "en" ? "Dua Request" : "ദുആ അഭ്യര്‍ത്ഥന"}
          </h2>
          <p className="section-sub">
            {lang === "en"
              ? "Remember us in your prayers"
              : "നിങ്ങളുടെ പ്രാര്‍ത്ഥനയില്‍ ഞങ്ങളെ ഓര്‍ക്കുക"}
          </p>

          <div className="form-card">
            {duaSubmitted ? (
              <div className="form-success-note">
                <span className="success-icon">🤲</span>
                <p>
                  {lang === "en"
                    ? "Ameen. Thank you for your heartfelt prayers!"
                    : "ആമീന്‍. നിങ്ങളുടെ പ്രാര്‍ത്ഥനക്ക് നന്ദി."}
                </p>
                <button
                  className="reset-form-btn"
                  onClick={() => setDuaSubmitted(false)}
                >
                  {lang === "en" ? "Send Another Dua" : "മറ്റൊരു പ്രാര്‍ത്ഥന അയക്കുക"}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDuaSubmitted(true);
                }}
              >
                <div className="form-group">
                  <label htmlFor="duaName">
                    {lang === "en" ? "Your Name (Optional)" : "നിങ്ങളുടെ പേര്"}
                  </label>
                  <input
                    type="text"
                    id="duaName"
                    placeholder={lang === "en" ? "Name" : "പേര്"}
                    value={duaData.name}
                    onChange={(e) =>
                      setDuaData({ ...duaData, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duaMsg">
                    {lang === "en"
                      ? "Your Dua / Blessing for the couple"
                      : "ദമ്പതികള്‍ക്കായുള്ള ദുആ / ആശംസ"}
                  </label>
                  <textarea
                    id="duaMsg"
                    required
                    placeholder={
                      lang === "en"
                        ? "May Allah bless your union..."
                        : "അള്ളാഹു അനുഗ്രഹിക്കട്ടെ..."
                    }
                    value={duaData.message}
                    onChange={(e) =>
                      setDuaData({ ...duaData, message: e.target.value })
                    }
                  />
                </div>

                <button type="submit" className="submit-btn">
                  {lang === "en" ? "Send Dua 🤲" : "ദുആ അയക്കുക 🤲"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 7. SHARE THE JOY (Template: public/3.jpeg - Ivory Pearl Marble) */}
        <section id="share" className="section share-section theme-ivory-3">
          <h2 className="section-title">
            {lang === "en" ? "Share the Joy" : "സന്തോഷം പങ്കിടൂ"}
          </h2>
          <p className="section-sub">
            {lang === "en"
              ? "Invite family & friends to celebrate with us"
              : "മറ്റുള്ളവരെയും ക്ഷണിക്കൂ"}
          </p>

          <a
            href={waShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-share-btn"
          >
            <span className="wa-icon">💬</span>
            <span>
              {lang === "en"
                ? "Share via WhatsApp"
                : "വാട്സ്ആപ്പില്‍ പങ്കിടുക"}
            </span>
          </a>
        </section>

        {/* 8. ROYAL FOOTER (Template: public/5.jpeg - Deep Wine Damask) */}
        <footer className="footer-section theme-wine-5">
          <h3 className="footer-couple-name">
            Nishana Sherin <span>&</span> Adv. Saleel Nelliyali
          </h3>
          <p className="footer-details">
            {lang === "en"
              ? "12th December 2026 · Taj Convention Center, Chemmad"
              : "12 ഡിസംബര്‍ 2026 · താജ് കൺവെൻഷൻ സെന്റർ, ചെമ്മാട്"}
          </p>
          <p className="footer-arabic">جَزَاكُمُ اللَّهُ خَيْرًا</p>

          <button className="back-to-envelope-btn" onClick={handleBackToEnvelope}>
            ↑ {lang === "en" ? "Back to Envelope" : "ക്ഷണക്കത്തിലേക്ക് മടങ്ങുക"}
          </button>
        </footer>
      </main>
    </div>
  );
}

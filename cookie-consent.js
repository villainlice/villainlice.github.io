(() => {
  const STORAGE_KEY = 'gtv_consent_v1';
  const GA_ID = 'G-7M6QVQJSMQ';
  const CLARITY_ID = 'yd10dxj0cc';

  const messages = {
    tr: {
      title: 'Çerez tercihleri',
      text: 'Site deneyimini ve ziyaretçi istatistiklerini geliştirmek için Google Analytics ve Microsoft Clarity kullanıyoruz. Kabul etmezseniz bu isteğe bağlı ölçüm araçları yüklenmez.',
      accept: 'Kabul et',
      reject: 'Reddet',
      settings: 'Çerez ayarları'
    },
    en: {
      title: 'Cookie preferences',
      text: 'We use Google Analytics and Microsoft Clarity to improve the website and understand visitor activity. If you reject, these optional analytics tools will not be loaded.',
      accept: 'Accept',
      reject: 'Reject',
      settings: 'Cookie settings'
    },
    de: {
      title: 'Cookie-Einstellungen',
      text: 'Wir verwenden Google Analytics und Microsoft Clarity, um die Website zu verbessern und die Nutzung zu verstehen. Bei Ablehnung werden diese optionalen Analysetools nicht geladen.',
      accept: 'Akzeptieren',
      reject: 'Ablehnen',
      settings: 'Cookie-Einstellungen'
    },
    ru: {
      title: 'Настройки файлов cookie',
      text: 'Мы используем Google Analytics и Microsoft Clarity для улучшения сайта и анализа посещений. Если вы откажетесь, эти необязательные инструменты аналитики не будут загружены.',
      accept: 'Принять',
      reject: 'Отклонить',
      settings: 'Настройки cookie'
    },
    uk: {
      title: 'Налаштування cookie',
      text: 'Ми використовуємо Google Analytics і Microsoft Clarity для покращення сайту та аналізу відвідувань. Якщо ви відмовитеся, ці необов’язкові інструменти аналітики не завантажуватимуться.',
      accept: 'Прийняти',
      reject: 'Відхилити',
      settings: 'Налаштування cookie'
    },
    ar: {
      title: 'تفضيلات ملفات تعريف الارتباط',
      text: 'نستخدم Google Analytics وMicrosoft Clarity لتحسين الموقع وفهم نشاط الزوار. إذا رفضت، فلن يتم تحميل أدوات التحليلات الاختيارية هذه.',
      accept: 'قبول',
      reject: 'رفض',
      settings: 'إعدادات ملفات الارتباط'
    }
  };

  const privacy = {
    tr: ['/gizlilik/', 'Gizlilik ve Çerez Politikası'],
    en: ['/en/privacy/', 'Privacy & Cookie Policy'],
    de: ['/de/datenschutz/', 'Datenschutz & Cookies'],
    ru: ['/ru/privacy/', 'Политика конфиденциальности и cookie'],
    uk: ['/uk/privacy/', 'Політика конфіденційності та cookie'],
    ar: ['/ar/privacy/', 'سياسة الخصوصية وملفات الارتباط']
  };

  function getLang() {
    const raw = (document.documentElement.lang || 'en').toLowerCase();
    if (raw.startsWith('tr')) return 'tr';
    if (raw.startsWith('de')) return 'de';
    if (raw.startsWith('ru')) return 'ru';
    if (raw.startsWith('uk')) return 'uk';
    if (raw.startsWith('ar')) return 'ar';
    return 'en';
  }

  let trackingLoaded = false;

  function loadTracking() {
    if (trackingLoaded) return;
    trackingLoaded = true;

    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    gtag('config', GA_ID);

    const ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(ga);

    // Microsoft Clarity
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, 'clarity', 'script', CLARITY_ID);

    applyConsentState(true);
  }

  // Tells Clarity (required for EEA/UK/CH visitors) and GA about the visitor's decision.
  function applyConsentState(granted) {
    try {
      if (typeof window.clarity === 'function') {
        window.clarity('consentv2', {
          ad_Storage: 'denied',
          analytics_Storage: granted ? 'granted' : 'denied'
        });
      }
    } catch (e) {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
    window['ga-disable-' + GA_ID] = !granted;
    if (!granted) clearAnalyticsCookies();
  }

  function clearAnalyticsCookies() {
    try {
      const host = location.hostname;
      const apex = host.replace(/^www\./, '');
      const domains = [host, '.' + host, apex, '.' + apex];
      document.cookie.split(';').forEach((c) => {
        const name = c.split('=')[0].trim();
        if (/^_ga/.test(name) || name === '_gid' || name === '_gat' || name === '_clck' || name === '_clsk') {
          domains.forEach((d) => {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
          });
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
      });
    } catch (e) {}
  }

  function setConsent(value) {
    const wasTrackingLoaded = trackingLoaded;
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    hideBanner();
    if (value === 'accepted') {
      if (trackingLoaded) applyConsentState(true); else loadTracking();
    } else {
      if (trackingLoaded) applyConsentState(false);
      else clearAnalyticsCookies();
      // Injected analytics scripts cannot reliably be unloaded from the page.
      // After withdrawal, reload with stored rejection so neither service loads.
      if (wasTrackingLoaded) {
        window.location.reload();
        return;
      }
    }
    showSettingsButton();
  }

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function hideBanner() {
    const el = document.getElementById('gtv-cookie-banner');
    if (el) el.remove();
    document.body.classList.remove('gtv-banner-open');
    document.body.style.removeProperty('--gtv-banner-h');
  }

  function showSettingsButton() {
    if (document.getElementById('gtv-cookie-settings')) return;
    const lang = getLang();
    const b = document.createElement('button');
    b.id = 'gtv-cookie-settings';
    b.type = 'button';
    b.className = 'gtv-cookie-settings';
    b.setAttribute('aria-label', messages[lang].settings);
    b.textContent = messages[lang].settings;
    b.addEventListener('click', () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      b.remove();
      showBanner();
    });
    document.body.appendChild(b);
  }

  function showBanner() {
    if (document.getElementById('gtv-cookie-banner')) return;
    const lang = getLang();
    const m = messages[lang];
    const isRTL = lang === 'ar';

    const wrap = document.createElement('div');
    wrap.id = 'gtv-cookie-banner';
    wrap.className = 'gtv-cookie-banner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', m.title);
    wrap.setAttribute('aria-live', 'polite');
    if (isRTL) wrap.setAttribute('dir', 'rtl');

    wrap.innerHTML = `
      <div class="gtv-cookie-inner">
        <div class="gtv-cookie-copy">
          <strong>${m.title}</strong>
          <p>${m.text} <a href="${privacy[lang][0]}">${privacy[lang][1]}</a></p>
        </div>
        <div class="gtv-cookie-actions">
          <button type="button" class="gtv-cookie-reject">${m.reject}</button>
          <button type="button" class="gtv-cookie-accept">${m.accept}</button>
        </div>
      </div>
    `;

    wrap.querySelector('.gtv-cookie-accept').addEventListener('click', () => setConsent('accepted'));
    wrap.querySelector('.gtv-cookie-reject').addEventListener('click', () => setConsent('rejected'));

    document.body.appendChild(wrap);

    // Keep the floating WhatsApp button clear of the banner.
    const setOffset = () => {
      if (!document.body.contains(wrap)) return;
      const bottom = window.innerWidth <= 720 ? 10 : 18;
      document.body.style.setProperty('--gtv-banner-h', (wrap.offsetHeight + bottom) + 'px');
    };
    document.body.classList.add('gtv-banner-open');
    setOffset();
    window.addEventListener('resize', setOffset);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const consent = getConsent();
    if (consent === 'accepted') {
      loadTracking();
      showSettingsButton();
    } else if (consent === 'rejected') {
      showSettingsButton();
    } else {
      showBanner();
    }
  });
})();

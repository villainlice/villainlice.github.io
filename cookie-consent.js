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
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    hideBanner();
    if (value === 'accepted') loadTracking();
    showSettingsButton();
  }

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function hideBanner() {
    const el = document.getElementById('gtv-cookie-banner');
    if (el) el.remove();
  }

  function showSettingsButton() {
    if (document.getElementById('gtv-cookie-settings')) return;
    const lang = getLang();
    const b = document.createElement('button');
    b.id = 'gtv-cookie-settings';
    b.type = 'button';
    b.className = 'gtv-cookie-settings';
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
    wrap.setAttribute('aria-live', 'polite');
    if (isRTL) wrap.setAttribute('dir', 'rtl');

    wrap.innerHTML = `
      <div class="gtv-cookie-inner">
        <div class="gtv-cookie-copy">
          <strong>${m.title}</strong>
          <p>${m.text}</p>
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

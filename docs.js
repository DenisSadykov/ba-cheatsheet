// Общая документация BA Toolkit — кнопка "?" + модалка-аккордеон.
// Подключается на каждой странице: <script src="docs.js"></script><script>initDocs('requirements')</script>

const BA_DOCS_SECTIONS = [
  {
    id: 'home',
    title: 'Обзор инструментов',
    html: `
      <p>BA Toolkit — набор веб-инструментов для бизнес-аналитика, которые работают
      прямо в браузере, без установки и без сервера.</p>
      <ul>
        <li><b>Сбор требований</b> — пошаговое заполнение требований к задаче с готовым summary.</li>
        <li><b>Формулировка проблемы</b> — структурирует постановку проблемы перед началом работы.</li>
        <li><b>Груминг</b> — подготовка задачи к обсуждению с командой.</li>
        <li><b>Произвольный конспект</b> — гибкий шаблон для заметок в свободной форме.</li>
      </ul>
      <p>Все данные хранятся локально в браузере (localStorage). Готовый результат
      можно отправить прямо в Jira или Confluence.</p>
    `
  },
  {
    id: 'requirements',
    title: 'Сбор требований',
    html: `
      <p>Инструмент ведёт по шагам: контекст, цели, ограничения, критерии готовности
      и т.д. На каждом шаге заполняются поля — справа собирается итоговый конспект.</p>
      <ul>
        <li>Прогресс сохраняется автоматически — можно закрыть вкладку и продолжить позже.</li>
        <li>Кнопки «В Jira» / «В Confluence» отправляют готовый конспект в задачу или страницу
        (нужно подключение, см. раздел «Jira и Confluence»).</li>
      </ul>
    `
  },
  {
    id: 'problem',
    title: 'Формулировка проблемы',
    html: `
      <p>Помогает оформить проблему до того, как переходить к решению: что наблюдается,
      почему это проблема, для кого, какие есть гипотезы причин.</p>
      <p>Результат можно использовать как вход для инструмента «Сбор требований»
      или отправить как описание задачи в Jira.</p>
    `
  },
  {
    id: 'grooming',
    title: 'Груминг задач',
    html: `
      <p>Шаблон для подготовки задачи к груминг-сессии: формулировка, вопросы команде,
      риски, оценка сложности.</p>
      <p>Итоговый текст можно скопировать в комментарий к задаче или создать
      новую задачу в Jira кнопкой «В Jira».</p>
    `
  },
  {
    id: 'custom',
    title: 'Произвольный конспект',
    html: `
      <p>Свободный шаблон без жёсткой структуры — для заметок, которые не подходят
      под другие инструменты. Поддерживает те же кнопки экспорта в Jira/Confluence.</p>
    `
  },
  {
    id: 'jira-confluence',
    title: 'Подключение к Jira и Confluence',
    html: `
      <p>Открывается значками <b>J</b> и <b>C</b> в верхней панели. Понадобятся:</p>
      <ul>
        <li>адрес вашего Atlassian-сайта (например <code>your-company.atlassian.net</code>)</li>
        <li>email и API-токен (создаётся на
          <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener">id.atlassian.com</a>)</li>
        <li>для Jira — код проекта; для Confluence — Space ID пространства</li>
        <li>адрес CORS-прокси — браузер не может обращаться к Atlassian напрямую</li>
      </ul>
      <p>Свой бесплатный прокси разворачивается за 2 минуты по инструкции:
      <a href="https://github.com/DenisSadykov/jira-cors-proxy-for-bsa-toolkit" target="_blank" rel="noopener">jira-cors-proxy-for-bsa-toolkit</a>.</p>
      <p>Токены хранятся только в localStorage вашего браузера и никуда, кроме
      самого Atlassian, не отправляются.</p>
    `
  }
];

function initDocs(currentPageId) {
  const style = document.createElement('style');
  style.textContent = `
    .docs-fab {
      position: fixed; bottom: 24px; right: 24px; width: 48px; height: 48px;
      border-radius: 50%; border: none; cursor: pointer; z-index: 250;
      background: linear-gradient(135deg, #818CF8, #6366F1);
      color: #fff; font-size: 20px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 20px rgba(99,102,241,0.35);
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .docs-fab:hover { transform: scale(1.07); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
    .docs-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 260;
      display: none; opacity: 0; transition: opacity .2s;
    }
    .docs-overlay.show { display: block; opacity: 1; }
    .docs-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) scale(0.96);
      width: 92%; max-width: 560px; max-height: 82vh; overflow-y: auto;
      background: rgba(255,255,255,0.92); border: 1px solid rgba(255,255,255,0.9);
      border-radius: 16px; box-shadow: 0 16px 40px rgba(80,80,160,0.18);
      backdrop-filter: blur(28px) saturate(180%); -webkit-backdrop-filter: blur(28px) saturate(180%);
      z-index: 261; display: none; opacity: 0;
      transition: opacity .2s ease, transform .2s cubic-bezier(.34,1.4,.64,1);
      font-family: 'Inter', system-ui, sans-serif; color: #18181B;
    }
    body.dark .docs-modal { background: rgba(30,30,45,0.92); color: #F1F1F8; border-color: rgba(255,255,255,0.12); }
    .docs-modal.show { display: block; opacity: 1; transform: translate(-50%,-50%) scale(1); }
    .docs-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 18px; font-weight: 700; font-size: 14px;
      border-bottom: 1px solid rgba(0,0,0,0.08); position: sticky; top: 0;
      background: inherit; backdrop-filter: inherit;
    }
    body.dark .docs-modal-header { border-bottom-color: rgba(255,255,255,0.1); }
    .docs-modal-body { padding: 8px 18px 18px; }
    .docs-close { width: 28px; height: 28px; border-radius: 8px; border: none; background: transparent; color: #5A5A78; font-size: 18px; cursor: pointer; }
    .docs-close:hover { color: #18181B; }
    body.dark .docs-close { color: #B0B0C8; }
    body.dark .docs-close:hover { color: #F1F1F8; }
    .docs-item { border-bottom: 1px solid rgba(0,0,0,0.06); }
    body.dark .docs-item { border-bottom-color: rgba(255,255,255,0.08); }
    .docs-item:last-child { border-bottom: none; }
    .docs-item-head {
      width: 100%; text-align: left; background: none; border: none; cursor: pointer;
      padding: 12px 4px; font-size: 13.5px; font-weight: 700; color: inherit;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    .docs-item-arrow { transition: transform .15s; flex-shrink: 0; font-size: 11px; color: #9999b3; }
    .docs-item.open .docs-item-arrow { transform: rotate(90deg); }
    .docs-item-content { display: none; padding: 0 4px 14px; font-size: 13px; line-height: 1.65; color: #4B4B6A; }
    body.dark .docs-item-content { color: #C4C4D8; }
    .docs-item.open .docs-item-content { display: block; }
    .docs-item-content ul { margin: 6px 0 6px 18px; }
    .docs-item-content p { margin: 6px 0; }
    .docs-item-content code { background: rgba(99,102,241,0.12); padding: 1px 5px; border-radius: 4px; font-size: 12px; }
    .docs-item-content a { color: #6366F1; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'docs-overlay';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.className = 'docs-modal';
  modal.innerHTML = `
    <div class="docs-modal-header">
      <span>Документация</span>
      <button class="docs-close" title="Закрыть">×</button>
    </div>
    <div class="docs-modal-body"></div>
  `;
  document.body.appendChild(modal);

  const body = modal.querySelector('.docs-modal-body');
  BA_DOCS_SECTIONS.forEach(section => {
    const item = document.createElement('div');
    item.className = 'docs-item';
    if (section.id === currentPageId) item.classList.add('open');
    item.innerHTML = `
      <button class="docs-item-head">
        <span>${section.title}</span>
        <span class="docs-item-arrow"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
      </button>
      <div class="docs-item-content">${section.html}</div>
    `;
    item.querySelector('.docs-item-head').addEventListener('click', () => {
      item.classList.toggle('open');
    });
    body.appendChild(item);
  });

  const fab = document.createElement('button');
  fab.className = 'docs-fab';
  fab.title = 'Документация';
  fab.textContent = '?';
  document.body.appendChild(fab);

  function open() {
    overlay.classList.add('show');
    modal.classList.add('show');
  }
  function close() {
    overlay.classList.remove('show');
    modal.classList.remove('show');
  }
  fab.addEventListener('click', open);
  overlay.addEventListener('click', close);
  modal.querySelector('.docs-close').addEventListener('click', close);
}

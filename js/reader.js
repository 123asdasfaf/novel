// 获取 URL 查询参数
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// HTML 转义，防止 XSS
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, function (match) {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match];
  });
}

// 默认从第1章开始
let currentChapter = parseInt(getQueryParam('chapter') || 1);
let chapterTitles = [];

// 加载章节标题文件
function loadChapterTitles() {
  const titlesFile = 'chapters/title_name.txt';

  fetch(titlesFile)
    .then(res => res.text())
    .then(text => {
      chapterTitles = text.split('\n');  // 将每行分成一个数组项
      loadChapter(currentChapter); // 加载当前章节
    })
    .catch(() => {
      console.error('章节标题加载失败');
    });
}

// 加载章节内容
function loadChapter(chapterNumber) {
  const file = `chapters/${chapterNumber}.txt`;

  fetch(file)
    .then(res => res.text())
    .then(rawText => {
      const escapedText = escapeHTML(rawText);

      // 根据当前章节号获取标题
      const chapterTitle = chapterTitles[chapterNumber - 1] || `第${chapterNumber}章 未命名`;

      // 更新页面标题
      document.getElementById('chapter-title').innerText = `第${chapterNumber}章 ${chapterTitle}`;

      // 使用正则分割文本，按空行分割
      const paragraphs = escapedText.split(/\n\s*\n/);

      // 每段用 <p> 包裹，并保留换行符
      const html = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

      // 将解析后的文本加载到页面中
      document.getElementById('content').innerHTML = html;

      // 重置滚动容器的滚动位置到顶部
      const contentContainer = document.getElementById('content-container');
      contentContainer.scrollTop = 0; // 重置滚动位置
    })
    .catch(() => {
      document.getElementById('content').innerText = '章节加载失败或不存在';
    });
}

// 翻页控制按钮事件
document.getElementById('next-btn').addEventListener('click', () => {
  currentChapter++;
  loadChapter(currentChapter);
  window.history.pushState({}, '', `reader.html?chapter=${currentChapter}`);
});

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentChapter > 1) {
    currentChapter--;
    loadChapter(currentChapter);
    window.history.pushState({}, '', `reader.html?chapter=${currentChapter}`);
  }
});

// 确保加载章节标题文件
loadChapterTitles();
const PAGE_SIZE = 15;
let currentPage = 1;
let chapters = [];

function renderChapters(page) {
  const toc = document.getElementById('toc');
  toc.innerHTML = '';
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visibleChapters = chapters.slice(start, end);

  visibleChapters.forEach((title, i) => {
    const li = document.createElement('li');
    const chapterNum = start + i + 1;
    li.innerHTML = `<a href="reader.html?chapter=${chapterNum}">第${chapterNum}章：${title}</a>`;
    toc.appendChild(li);
  });

  document.getElementById('pageInput').value = page;
  document.getElementById('totalPages').textContent = `/ ${Math.ceil(chapters.length / PAGE_SIZE)}`;
}

function goToPage(page) {
  const totalPages = Math.ceil(chapters.length / PAGE_SIZE);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderChapters(currentPage);
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) goToPage(currentPage - 1);
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(chapters.length / PAGE_SIZE);
  if (currentPage < totalPages) goToPage(currentPage + 1);
});

document.getElementById('pageInput').addEventListener('change', (e) => {
  const targetPage = parseInt(e.target.value);
  if (!isNaN(targetPage)) goToPage(targetPage);
});

// 初始化加载章节
fetch('chapters/title_name.txt')
  .then(res => res.text())
  .then(text => {
    chapters = text.trim().split('\n').map(line => line.trim());
    goToPage(1);
  })
  .catch(err => {
    console.error('读取章节失败', err);
    document.getElementById('toc').innerHTML = '<li>⚠️ 加载章节失败</li>';
  });

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

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

let currentChapter = parseInt(getQueryParam('chapter') || 1); // 默认从第1章开始
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

// 初始化加载章节标题文件
loadChapterTitles();

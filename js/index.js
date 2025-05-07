fetch('chapters/title_name.txt')
  .then(response => response.text())
  .then(text => {
    const titles = text.trim().split('\n');
    const toc = document.getElementById('toc');
    toc.innerHTML = ''; // 清空原本内容

    const pageSize = 10;
    let currentPage = 1;
    let totalPages = Math.ceil(titles.length / pageSize);

    function renderPage(page) {
      toc.innerHTML = '';
      const start = (page - 1) * pageSize;
      const end = Math.min(start + pageSize, titles.length);
      for (let i = start; i < end; i++) {
        const li = document.createElement('li');
        const chapterNum = `第${i + 1}章`;
        li.innerHTML = `<a href="reader.html?chapter=${i + 1}">${chapterNum}：${titles[i]}</a>`;
        toc.appendChild(li);
      }
      document.getElementById('pageInput').value = page;
      document.getElementById('totalPages').innerText = `/ ${totalPages}`;
    }

    // 初始化分页
    renderPage(currentPage);

    document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
      }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
      }
    });

    document.getElementById('pageInput').addEventListener('change', (e) => {
      const val = parseInt(e.target.value);
      if (val >= 1 && val <= totalPages) {
        currentPage = val;
        renderPage(currentPage);
      }
    });
    document.getElementById("openfly").addEventListener("click", function () {
      // 跳转到游戏页面（game.html）
      window.location.href = "fly.html";
    });
  })
  .catch(error => {
    console.error('无法加载章节标题:', error);
    const toc = document.getElementById('toc');
    toc.innerHTML = '<li>⚠️ 无法加载章节，请检查文件路径</li>';
  });


    const openBtn = document.getElementById('openBtn');
    const modal = document.getElementById('popupModal');
    const closeBtn = document.getElementById('closeBtn');
    const iframe = document.getElementById('qrIframe');

    openBtn.addEventListener('click', () => {
      modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });

    // 接收 iframe 高度（需同源）
    window.addEventListener("message", (event) => {
      if (event.data.type === "setHeight") {
        iframe.style.height = event.data.height + "px";
      }
    });

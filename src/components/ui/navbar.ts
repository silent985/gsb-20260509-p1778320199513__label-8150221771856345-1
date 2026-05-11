export function Navbar(title: string, showBack: boolean = false): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm';
  
  const left = document.createElement('div');
  left.className = 'flex items-center gap-2';
  
  if (showBack) {
    const backBtn = document.createElement('button');
    backBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-600">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    `;
    backBtn.className = 'p-2 -ml-2 rounded-full hover:bg-gray-100 hover:cursor-pointer active:bg-gray-200 transition-colors';
    backBtn.onclick = () => window.history.back();
    left.appendChild(backBtn);
  }

  const titleEl = document.createElement('h1');
  titleEl.className = 'text-lg font-semibold text-gray-800';
  titleEl.textContent = title;
  left.appendChild(titleEl);

  nav.appendChild(left);
  
  // Right side actions (optional)
  const right = document.createElement('div');
  right.className = 'flex gap-2';
  
  // Link to History
  if (window.location.pathname.indexOf('history') === -1) {
    const historyLink = document.createElement('a');
    historyLink.href = '/src/pages/history/index.html'; // Vite dev path, normalized in build
    historyLink.className = 'p-2 rounded-full hover:bg-gray-100 text-gray-600';
    historyLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `;
    right.appendChild(historyLink);
  }
  
  nav.appendChild(right);

  return nav;
}

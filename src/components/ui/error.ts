export function ErrorAlert(message: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow-sm border border-red-100 flex items-center gap-2 text-sm animate-fade-in-down';
  container.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
    <span>${message}</span>
  `;
  
  // Auto remove
  setTimeout(() => {
    container.remove();
  }, 3000);

  return container;
}

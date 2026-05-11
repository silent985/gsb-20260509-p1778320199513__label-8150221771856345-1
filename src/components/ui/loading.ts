export function LoadingIndicator(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex items-center gap-2 p-4 text-gray-500 text-sm';
  container.innerHTML = `
    <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
    <span>AI 正在思考...</span>
  `;
  return container;
}

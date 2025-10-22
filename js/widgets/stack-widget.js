class StackWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  update(cpu) {
    let html = '<div class="widget-title">Stack</div>';
    html += '<div class="stack-info">SP: ' + cpu.stackPointer + '</div>';
    html += '<div class="stack-grid">';

    for (let i = cpu.stack.length - 1; i >= 0; i--) {
      const value = cpu.stack[i];
      const isCurrent = i === cpu.stackPointer - 1;
      const isEmpty = i >= cpu.stackPointer;

      let className = 'stack-item';
      if (isCurrent) className += ' current';
      if (isEmpty) className += ' empty';

      html += `
        <div class="${className}">
          <span class="stack-index">${i}</span>
          <span class="stack-value">0x${value.toString(16).toUpperCase().padStart(3, '0')}</span>
        </div>
      `;
    }

    html += '</div>';
    this.container.innerHTML = html;
  }
}

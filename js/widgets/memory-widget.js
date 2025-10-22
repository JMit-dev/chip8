class MemoryWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.startAddress = 0x200;
    this.bytesPerRow = 16;
    this.rowsToDisplay = 16;
  }

  update(cpu) {
    let html = '<div class="widget-title">Memory Viewer</div>';

    html += `
      <div class="memory-controls">
        <label>Address: 0x<input type="text" id="memory-address" value="${this.startAddress.toString(16).toUpperCase().padStart(3, '0')}" maxlength="3"></label>
        <button id="memory-goto">Go</button>
        <button id="memory-program">Program Start</button>
        <button id="memory-fonts">Fonts</button>
      </div>
    `;

    html += '<div class="memory-grid">';
    html += '<div class="memory-header">';
    html += '<span class="memory-addr-label">Addr</span>';
    for (let i = 0; i < this.bytesPerRow; i++) {
      html += `<span class="memory-offset">+${i.toString(16).toUpperCase()}</span>`;
    }
    html += '</div>';

    for (let row = 0; row < this.rowsToDisplay; row++) {
      const address = this.startAddress + (row * this.bytesPerRow);
      if (address >= 4096) break;

      html += '<div class="memory-row">';
      html += `<span class="memory-address">0x${address.toString(16).toUpperCase().padStart(3, '0')}</span>`;

      for (let col = 0; col < this.bytesPerRow; col++) {
        const byteAddress = address + col;
        if (byteAddress >= 4096) {
          html += '<span class="memory-byte"></span>';
        } else {
          const byte = cpu.memory[byteAddress];
          const isProgramCounter = byteAddress === cpu.programCounter || byteAddress === cpu.programCounter + 1;
          const isIndexRegister = byteAddress >= cpu.indexRegister && byteAddress < cpu.indexRegister + 16;

          let className = 'memory-byte';
          if (isProgramCounter) className += ' pc-highlight';
          if (isIndexRegister) className += ' index-highlight';

          html += `<span class="${className}">${byte.toString(16).toUpperCase().padStart(2, '0')}</span>`;
        }
      }

      html += '</div>';
    }

    html += '</div>';
    this.container.innerHTML = html;

    this.attachEventListeners(cpu);
  }

  attachEventListeners(cpu) {
    const gotoBtn = document.getElementById('memory-goto');
    const programBtn = document.getElementById('memory-program');
    const fontsBtn = document.getElementById('memory-fonts');
    const addressInput = document.getElementById('memory-address');

    if (gotoBtn) {
      gotoBtn.addEventListener('click', () => {
        const value = parseInt(addressInput.value, 16);
        if (!isNaN(value) && value >= 0 && value < 4096) {
          this.startAddress = value;
          this.update(cpu);
        }
      });
    }

    if (programBtn) {
      programBtn.addEventListener('click', () => {
        this.startAddress = 0x200;
        addressInput.value = '200';
        this.update(cpu);
      });
    }

    if (fontsBtn) {
      fontsBtn.addEventListener('click', () => {
        this.startAddress = 0x50;
        addressInput.value = '050';
        this.update(cpu);
      });
    }
  }
}

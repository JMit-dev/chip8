class RegistersWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  update(cpu) {
    let html = '<div class="widget-title">Registers</div>';
    html += '<div class="registers-grid">';

    // V0-VF registers
    for (let i = 0; i < 16; i++) {
      const registerName = `V${i.toString(16).toUpperCase()}`;
      const value = cpu.registers[i];
      const hex = value.toString(16).toUpperCase().padStart(2, '0');
      const bin = value.toString(2).padStart(8, '0');

      html += `
        <div class="register-item ${i === 0xF ? 'flag-register' : ''}">
          <span class="register-name">${registerName}</span>
          <span class="register-value">0x${hex}</span>
          <span class="register-binary">${bin}</span>
        </div>
      `;
    }

    html += '</div>';

    // Special registers
    html += '<div class="special-registers">';
    html += `
      <div class="register-item">
        <span class="register-name">I</span>
        <span class="register-value">0x${cpu.indexRegister.toString(16).toUpperCase().padStart(3, '0')}</span>
      </div>
      <div class="register-item">
        <span class="register-name">PC</span>
        <span class="register-value">0x${cpu.programCounter.toString(16).toUpperCase().padStart(3, '0')}</span>
      </div>
      <div class="register-item">
        <span class="register-name">SP</span>
        <span class="register-value">${cpu.stackPointer}</span>
      </div>
    `;
    html += '</div>';

    this.container.innerHTML = html;
  }
}

class StatusWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  update(cpu, keyboard) {
    let html = '<div class="widget-title">Status</div>';

    html += '<div class="status-section">';
    html += '<h4>Timers</h4>';
    html += `
      <div class="timer-item">
        <span class="timer-label">Delay Timer:</span>
        <span class="timer-value">${cpu.delayTimer}</span>
        <div class="timer-bar">
          <div class="timer-fill" style="width: ${(cpu.delayTimer / 255) * 100}%"></div>
        </div>
      </div>
      <div class="timer-item">
        <span class="timer-label">Sound Timer:</span>
        <span class="timer-value">${cpu.soundTimer}</span>
        <div class="timer-bar">
          <div class="timer-fill" style="width: ${(cpu.soundTimer / 255) * 100}%"></div>
        </div>
      </div>
    `;
    html += '</div>';

    html += '<div class="status-section">';
    html += '<h4>Keyboard</h4>';
    html += '<div class="keyboard-layout">';

    const keyLayout = [
      ['1', '2', '3', 'C'],
      ['4', '5', '6', 'D'],
      ['7', '8', '9', 'E'],
      ['A', '0', 'B', 'F']
    ];

    const keyMapping = {
      '1': '1', '2': '2', '3': '3', 'C': '4',
      '4': 'Q', '5': 'W', '6': 'E', 'D': 'R',
      '7': 'A', '8': 'S', '9': 'D', 'E': 'F',
      'A': 'Z', '0': 'X', 'B': 'C', 'F': 'V'
    };

    const pressedKeys = keyboard.getKeysPressed();

    keyLayout.forEach(row => {
      html += '<div class="keyboard-row">';
      row.forEach(key => {
        const keyValue = parseInt(key, 16);
        const isPressed = pressedKeys.includes(keyValue);
        const qwertyKey = keyMapping[key];

        html += `
          <div class="key ${isPressed ? 'key-pressed' : ''}">
            <span class="key-hex">${key}</span>
            <span class="key-map">${qwertyKey}</span>
          </div>
        `;
      });
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';

    html += '<div class="status-section">';
    html += '<h4>CPU State</h4>';
    html += `<div class="cpu-state">${cpu.paused ? 'PAUSED' : 'RUNNING'}</div>`;
    html += `<div class="cpu-speed">Speed: ${cpu.speed} ops/frame</div>`;
    html += '</div>';

    this.container.innerHTML = html;
  }
}

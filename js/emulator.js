class Emulator {
  constructor() {
    this.cpu = new CPU();
    this.renderer = new Renderer(10);
    this.keyboard = new Keyboard();
    this.sound = new Sound();

    this.cpu.renderer = this.renderer;
    this.cpu.keyboard = this.keyboard;
    this.cpu.sound = this.sound;

    this.registersWidget = new RegistersWidget('registers-container');
    this.memoryWidget = new MemoryWidget('memory-container');
    this.stackWidget = new StackWidget('stack-container');
    this.statusWidget = new StatusWidget('status-container');

    this.fpsInterval = 1000 / 60;
    this.then = Date.now();
    this.running = false;

    this.setupControls();
  }

  setupControls() {
    document.getElementById('play-btn').addEventListener('click', () => this.start());
    document.getElementById('pause-btn').addEventListener('click', () => this.pause());
    document.getElementById('step-btn').addEventListener('click', () => this.step());
    document.getElementById('reset-btn').addEventListener('click', () => this.reset());

    document.getElementById('rom-select').addEventListener('change', (e) => this.loadROMFromSelect(e));
    document.getElementById('rom-input').addEventListener('change', (e) => this.loadROMFromFile(e));

    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    speedSlider.addEventListener('input', (e) => {
      this.cpu.speed = parseInt(e.target.value);
      speedValue.textContent = e.target.value;
    });

    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    volumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value) / 100;
      this.sound.setVolume(volume);
      volumeValue.textContent = e.target.value;
    });

    const frequencySlider = document.getElementById('frequency-slider');
    const frequencyValue = document.getElementById('frequency-value');
    frequencySlider.addEventListener('input', (e) => {
      this.sound.setFrequency(parseInt(e.target.value));
      frequencyValue.textContent = e.target.value;
    });
  }

  async loadROMFromSelect(event) {
    const romName = event.target.value;
    if (!romName) return;

    try {
      const response = await fetch(`roms/${romName}`);
      if (!response.ok) {
        throw new Error(`Failed to load ROM: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const program = new Uint8Array(buffer);

      if (program.length === 0) {
        alert('Error: ROM file is empty');
        return;
      }

      if (program.length > 4096 - 0x200) {
        alert(`Error: ROM too large (${program.length} bytes). Maximum is ${4096 - 0x200} bytes.`);
        return;
      }

      this.reset();
      this.cpu.loadProgram(program);
      this.updateWidgets();

      console.log(`ROM loaded successfully: ${romName} (${program.length} bytes)`);
    } catch (error) {
      alert(`Error loading ROM: ${error.message}`);
      console.error('ROM loading error:', error);
    }
  }

  loadROMFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const program = new Uint8Array(buffer);

        if (program.length === 0) {
          alert('Error: File is empty');
          return;
        }

        if (program.length > 4096 - 0x200) {
          alert(`Error: ROM too large (${program.length} bytes). Maximum is ${4096 - 0x200} bytes.`);
          return;
        }

        this.reset();
        this.cpu.loadProgram(program);
        this.updateWidgets();

        console.log(`ROM loaded successfully: ${file.name} (${program.length} bytes)`);
      } catch (error) {
        alert(`Error loading ROM: ${error.message}`);
        console.error('ROM loading error:', error);
      }
    };

    reader.onerror = () => {
      alert('Error reading file');
      console.error('File reader error:', reader.error);
    };

    reader.readAsArrayBuffer(file);
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.loop();
    }
  }

  pause() {
    this.running = false;
  }

  step() {
    this.cpu.cycle();
    this.renderer.render();
    this.updateWidgets();
  }

  reset() {
    this.running = false;
    this.sound.stop();
    this.cpu = new CPU();
    this.cpu.renderer = this.renderer;
    this.cpu.keyboard = this.keyboard;
    this.cpu.sound = this.sound;
    this.renderer.clear();
    this.renderer.render();
    this.updateWidgets();
  }

  loop() {
    if (!this.running) return;

    requestAnimationFrame(() => this.loop());

    const now = Date.now();
    const elapsed = now - this.then;

    if (elapsed > this.fpsInterval) {
      this.then = now - (elapsed % this.fpsInterval);

      this.cpu.cycle();
      this.renderer.render();
      this.updateWidgets();
    }
  }

  updateWidgets() {
    this.registersWidget.update(this.cpu);
    this.memoryWidget.update(this.cpu);
    this.stackWidget.update(this.cpu);
    this.statusWidget.update(this.cpu, this.keyboard);
  }
}

let emulator;
window.addEventListener('DOMContentLoaded', () => {
  emulator = new Emulator();
  emulator.updateWidgets();
});

class Sound {
  constructor() {
    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.frequency = 440; // A4 note (440 Hz)
    this.volume = 0.1; // 10% volume
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.volume;
    }
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  setFrequency(frequency) {
    this.frequency = frequency;
    if (this.oscillator && this.isPlaying) {
      this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    }
  }

  play() {
    if (this.isPlaying) return;

    this.init();

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'square'; // Square wave for classic beep sound
    this.oscillator.frequency.setValueAtTime(this.frequency, this.audioContext.currentTime);
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();

    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.oscillator) return;

    this.oscillator.stop();
    this.oscillator.disconnect();
    this.oscillator = null;

    this.isPlaying = false;
  }
}

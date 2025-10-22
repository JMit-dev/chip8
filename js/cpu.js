class CPU {
  constructor() {
    this.memory = new Uint8Array(4096);
    this.registers = new Uint8Array(16); // V0-VF
    this.indexRegister = 0; // I register (12-bit)
    this.programCounter = 0x200; // Programs start at 0x200
    this.stack = new Uint16Array(16);
    this.stackPointer = 0;
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.paused = false;
    this.speed = 10; // Instructions per frame

    this.loadFontSet();
  }

  loadFontSet() {
    const fonts = [
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
      0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
      0x90, 0x90, 0xF0, 0x10, 0x10, // 4
      0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
      0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
      0xF0, 0x10, 0x20, 0x40, 0x40, // 7
      0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
      0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
      0xF0, 0x90, 0xF0, 0x90, 0x90, // A
      0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
      0xF0, 0x80, 0x80, 0x80, 0xF0, // C
      0xE0, 0x90, 0x90, 0x90, 0xE0, // D
      0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
      0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];

    this.memory.set(fonts, 0x50); // Fonts loaded at 0x50
  }

  loadProgram(program) {
    for (let i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = program[i];
    }
  }

  cycle() {
    for (let i = 0; i < this.speed; i++) {
      if (!this.paused) {
        const opcode = (this.memory[this.programCounter] << 8) | this.memory[this.programCounter + 1];
        this.executeInstruction(opcode);
      }
    }

    if (!this.paused) {
      this.updateTimers();
    }

    this.playSound();
  }

  updateTimers() {
    if (this.delayTimer > 0) {
      this.delayTimer--;
    }

    if (this.soundTimer > 0) {
      this.soundTimer--;
    }
  }

  playSound() {
    // Sound implementation handled externally
  }

  executeInstruction(opcode) {
    this.programCounter += 2;

    const x = (opcode & 0x0F00) >> 8;
    const y = (opcode & 0x00F0) >> 4;
    const n = opcode & 0x000F;
    const nn = opcode & 0x00FF;
    const nnn = opcode & 0x0FFF;

    switch (opcode & 0xF000) {
      case 0x0000:
        if (opcode === 0x00E0) {
          // 00E0: Clear screen
          this.renderer.clear();
        } else if (opcode === 0x00EE) {
          // 00EE: Return from subroutine
          this.stackPointer--;
          this.programCounter = this.stack[this.stackPointer];
        }
        break;

      case 0x1000:
        // 1NNN: Jump to address NNN
        this.programCounter = nnn;
        break;

      case 0x2000:
        // 2NNN: Call subroutine at NNN
        this.stack[this.stackPointer] = this.programCounter;
        this.stackPointer++;
        this.programCounter = nnn;
        break;

      case 0x3000:
        // 3XNN: Skip next instruction if VX equals NN
        if (this.registers[x] === nn) {
          this.programCounter += 2;
        }
        break;

      case 0x4000:
        // 4XNN: Skip next instruction if VX does not equal NN
        if (this.registers[x] !== nn) {
          this.programCounter += 2;
        }
        break;

      case 0x5000:
        // 5XY0: Skip next instruction if VX equals VY
        if (this.registers[x] === this.registers[y]) {
          this.programCounter += 2;
        }
        break;

      case 0x6000:
        // 6XNN: Set VX to NN
        this.registers[x] = nn;
        break;

      case 0x7000:
        // 7XNN: Add NN to VX (no carry flag)
        this.registers[x] = (this.registers[x] + nn) & 0xFF;
        break;

      case 0x8000:
        switch (n) {
          case 0x0:
            // 8XY0: Set VX to VY
            this.registers[x] = this.registers[y];
            break;
          case 0x1:
            // 8XY1: Set VX to VX OR VY
            this.registers[x] |= this.registers[y];
            break;
          case 0x2:
            // 8XY2: Set VX to VX AND VY
            this.registers[x] &= this.registers[y];
            break;
          case 0x3:
            // 8XY3: Set VX to VX XOR VY
            this.registers[x] ^= this.registers[y];
            break;
          case 0x4:
            // 8XY4: Add VY to VX, set VF to carry
            const sum = this.registers[x] + this.registers[y];
            this.registers[0xF] = sum > 0xFF ? 1 : 0;
            this.registers[x] = sum & 0xFF;
            break;
          case 0x5:
            // 8XY5: Subtract VY from VX, set VF to NOT borrow
            this.registers[0xF] = this.registers[x] > this.registers[y] ? 1 : 0;
            this.registers[x] = (this.registers[x] - this.registers[y]) & 0xFF;
            break;
          case 0x6:
            // 8XY6: Shift VX right by 1, VF = least significant bit
            this.registers[0xF] = this.registers[x] & 0x1;
            this.registers[x] >>= 1;
            break;
          case 0x7:
            // 8XY7: Set VX to VY minus VX, set VF to NOT borrow
            this.registers[0xF] = this.registers[y] > this.registers[x] ? 1 : 0;
            this.registers[x] = (this.registers[y] - this.registers[x]) & 0xFF;
            break;
          case 0xE:
            // 8XYE: Shift VX left by 1, VF = most significant bit
            this.registers[0xF] = (this.registers[x] & 0x80) >> 7;
            this.registers[x] = (this.registers[x] << 1) & 0xFF;
            break;
        }
        break;

      case 0x9000:
        // 9XY0: Skip next instruction if VX does not equal VY
        if (this.registers[x] !== this.registers[y]) {
          this.programCounter += 2;
        }
        break;

      case 0xA000:
        // ANNN: Set I to address NNN
        this.indexRegister = nnn;
        break;

      case 0xB000:
        // BNNN: Jump to address NNN + V0
        this.programCounter = nnn + this.registers[0];
        break;

      case 0xC000:
        // CXNN: Set VX to random byte AND NN
        this.registers[x] = Math.floor(Math.random() * 0xFF) & nn;
        break;

      case 0xD000:
        // DXYN: Draw sprite at (VX, VY) with N bytes of sprite data starting at I
        const width = 8;
        const height = n;
        this.registers[0xF] = 0;

        for (let row = 0; row < height; row++) {
          let sprite = this.memory[this.indexRegister + row];

          for (let col = 0; col < width; col++) {
            if ((sprite & 0x80) > 0) {
              if (this.renderer.setPixel(this.registers[x] + col, this.registers[y] + row)) {
                this.registers[0xF] = 1;
              }
            }
            sprite <<= 1;
          }
        }
        break;

      case 0xE000:
        if (nn === 0x9E) {
          // EX9E: Skip next instruction if key in VX is pressed
          if (this.keyboard.isKeyPressed(this.registers[x])) {
            this.programCounter += 2;
          }
        } else if (nn === 0xA1) {
          // EXA1: Skip next instruction if key in VX is not pressed
          if (!this.keyboard.isKeyPressed(this.registers[x])) {
            this.programCounter += 2;
          }
        }
        break;

      case 0xF000:
        switch (nn) {
          case 0x07:
            // FX07: Set VX to delay timer
            this.registers[x] = this.delayTimer;
            break;
          case 0x0A:
            // FX0A: Wait for key press, store key in VX
            this.paused = true;
            this.keyboard.onNextKeyPress = (key) => {
              this.registers[x] = key;
              this.paused = false;
            };
            break;
          case 0x15:
            // FX15: Set delay timer to VX
            this.delayTimer = this.registers[x];
            break;
          case 0x18:
            // FX18: Set sound timer to VX
            this.soundTimer = this.registers[x];
            break;
          case 0x1E:
            // FX1E: Add VX to I
            this.indexRegister = (this.indexRegister + this.registers[x]) & 0xFFF;
            break;
          case 0x29:
            // FX29: Set I to location of sprite for digit VX
            this.indexRegister = 0x50 + (this.registers[x] * 5);
            break;
          case 0x33:
            // FX33: Store BCD representation of VX in memory locations I, I+1, I+2
            this.memory[this.indexRegister] = Math.floor(this.registers[x] / 100);
            this.memory[this.indexRegister + 1] = Math.floor((this.registers[x] % 100) / 10);
            this.memory[this.indexRegister + 2] = this.registers[x] % 10;
            break;
          case 0x55:
            // FX55: Store registers V0 through VX in memory starting at I
            for (let i = 0; i <= x; i++) {
              this.memory[this.indexRegister + i] = this.registers[i];
            }
            break;
          case 0x65:
            // FX65: Read registers V0 through VX from memory starting at I
            for (let i = 0; i <= x; i++) {
              this.registers[i] = this.memory[this.indexRegister + i];
            }
            break;
        }
        break;
    }
  }
}

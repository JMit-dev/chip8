# CHIP-8 Emulator

An educational CHIP-8 emulator built with JavaScript that visualizes all internal components to help you understand how emulators work.

## What is CHIP-8?

CHIP-8 is an interpreted programming language developed in the 1970s for early microcomputers. It's perfect for learning emulator development because:
- Simple instruction set (35 opcodes)
- Straightforward memory model (4KB RAM)
- Basic display system (64x32 monochrome)
- Easy to understand architecture

## Features

### Educational Visualizations

This emulator exposes all internal components in real-time:

- **Display Widget**: 64x32 monochrome canvas showing game graphics
- **Registers Widget**: All 16 general-purpose registers (V0-VF) plus special registers (I, PC, SP)
- **Memory Viewer**: Interactive hex viewer showing 4KB memory with highlighting for PC and I register
- **Stack Viewer**: Visualization of the call stack with current position
- **Status Widget**: Real-time display of:
  - Delay and Sound timers with progress bars
  - Keyboard state with hex keypad layout
  - CPU execution state (running/paused)

### Controls

- **Play**: Start continuous execution
- **Pause**: Pause execution
- **Step**: Execute one instruction (for debugging)
- **Reset**: Reset CPU and memory
- **Load ROM**: Load a CHIP-8 program file
- **Speed Control**: Adjust instructions per frame (1-30)

## Getting Started

### Prerequisites

No build tools required! This is pure vanilla JavaScript.

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chip8
```

2. Open [index.html](index.html) in a web browser

That's it! The emulator runs entirely in the browser.

### Loading ROMs

Sample ROMs are included in the [roms/](roms/) directory. To run a game:

1. Click "Load ROM" button
2. Navigate to the `roms/` folder
3. Select a ROM file (e.g., `PONG`, `TETRIS`, `INVADERS`)
4. Click "Play" to start

**ROM Credits**: Public domain ROMs courtesy of [Zophar's Domain](https://www.zophar.net/)

## Keyboard Controls

CHIP-8 uses a 16-key hexadecimal keyboard (0-F). The keys are mapped to your QWERTY keyboard:

```
CHIP-8 Keypad       QWERTY Keyboard
┌───┬───┬───┬───┐   ┌───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ C │   │ 1 │ 2 │ 3 │ 4 │
├───┼───┼───┼───┤   ├───┼───┼───┼───┤
│ 4 │ 5 │ 6 │ D │   │ Q │ W │ E │ R │
├───┼───┼───┼───┤   ├───┼───┼───┼───┤
│ 7 │ 8 │ 9 │ E │   │ A │ S │ D │ F │
├───┼───┼───┼───┤   ├───┼───┼───┼───┤
│ A │ 0 │ B │ F │   │ Z │ X │ C │ V │
└───┴───┴───┴───┘   └───┴───┴───┴───┘
```

## Architecture

### CHIP-8 Specifications

#### Memory
- **Size**: 4096 bytes (0x000 - 0xFFF)
- **0x000-0x1FF**: Reserved for interpreter and font data
- **0x200-0xFFF**: Program space and free RAM
- **Font set**: Built-in sprites for hex digits 0-F (5 bytes each)

#### Registers
- **V0-VF**: 16 general-purpose 8-bit registers
  - VF is used as a flag register (carry, borrow, collision)
- **I**: 12-bit address register for memory operations
- **PC**: Program counter (starts at 0x200)
- **SP**: Stack pointer

#### Display
- **Resolution**: 64x32 pixels
- **Color**: Monochrome (on/off)
- **Drawing**: XOR mode (enables collision detection)
- **Sprites**: 8 pixels wide, 1-15 pixels tall

#### Timers
- **Delay Timer**: General-purpose countdown timer (60Hz)
- **Sound Timer**: Beeps when non-zero (60Hz)

#### Stack
- 16 levels of nesting
- Used only for subroutine calls (stores return addresses)

#### Instruction Set
35 opcodes, all 2 bytes long, stored big-endian:
- `0NNN`: Machine code routine (not implemented)
- `00E0`: Clear screen
- `00EE`: Return from subroutine
- `1NNN`: Jump to address NNN
- `2NNN`: Call subroutine at NNN
- `3XNN`: Skip if VX == NN
- `4XNN`: Skip if VX != NN
- `5XY0`: Skip if VX == VY
- `6XNN`: Set VX = NN
- `7XNN`: Add NN to VX
- `8XY0-8XYE`: Arithmetic and logic operations
- `9XY0`: Skip if VX != VY
- `ANNN`: Set I = NNN
- `BNNN`: Jump to NNN + V0
- `CXNN`: Set VX = random & NN
- `DXYN`: Draw sprite at (VX, VY)
- `EX9E/EXA1`: Skip if key pressed/not pressed
- `FX07-FX65`: Timer, memory, and BCD operations

## Learning Resources

### Understanding the Code

The code is designed to be self-documenting with clear structure:

1. **Start with [cpu.js](js/cpu.js)**: See how the CPU initializes and loads programs
2. **Study `executeInstruction()`**: Each opcode is implemented with comments
3. **Explore [renderer.js](js/renderer.js)**: Understand XOR-based pixel drawing
4. **Check [emulator.js](js/emulator.js)**: See how components work together

### Debugging Tips

Use the **Step** button to execute one instruction at a time while watching:
- PC advancing through memory
- Registers changing values
- Stack growing/shrinking during calls
- Pixels toggling on the display
- Timers counting down

This makes it easy to understand exactly what each instruction does.

## Credits

- **ROMs**: Public domain games from [Zophar's Domain](https://www.zophar.net/pdroms/chip8/chip-8-games-pack.html)
- **CHIP-8 Specification**: [Wikipedia](https://en.wikipedia.org/wiki/CHIP-8)

## License

GPL 3.0 License

---

**Happy emulating! 🎮**

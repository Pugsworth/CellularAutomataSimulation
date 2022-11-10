# CellularAutomataSimulation
This is a Typescript Nodejs program to execute various Cellular Automaton algorithms.

---

## ⚠ Current Status ⚠
The program is currently in a very early stage of development. Some or most of the planned features might not be implemented yet.
Currently, the program is undergoing a major refactoring to make it more modular and easier to extend.
Some of the planned features that were the cause for the refactoring are:

- Interfaces for the base data structures (Grid, Cell,  etc.)

- A Rule class that can be extended to implement different rules
  - Data oriented rules

- A Simulation class to manage the simulation process

- A Renderer class to customize how the underlying data is rendered.  
    The planned types of rendering are:
    - Image (Pixel art)
    - Web (HTML5 Canvas)
    - Maybe ASCII...

- Tests!!! 
This program is getting big enough that testing will be necessary to ensure every part works as intended instead of just testing the final result.

---

## Goals
The goal of this repository is to not only be my impementation of various Cellular Automaton algorithms, but also to be a place where I can experiment with various design patterns and technologies.
Eventually, I would like to have a web interface that allows the user to select a Cellular Automaton algorithm  and properties and then see the results of that algorithm.
This is inspired by my small computer project (private for now) in which I will be converting typescript code to C/C++ and running on a microcontroller with a small OLED display.

---

## Current algorithms implemented

🛈 Legend
- \* = Working on/Not fully implemented
- x = Completed

Algorithms:
- [ ] Conway's Game of Life
- [*] Sprator https://github.com/yurkth/sprator
- [ ] Langton's Ant
- [ ] Wireworld
- [ ] Wolfram's Elementary Cellular Automaton

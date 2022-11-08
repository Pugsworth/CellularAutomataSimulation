import { Cell, NeighborShape, Grid } from "./grid";

/**
 * @brief A cell whose data is a boolean value
 */
export class OneBitCell extends Cell {
    constructor(
        grid: Grid,
        data: boolean,
        x: number = 0,
        y: number = 0
    ) {
        super(grid, data, x, y);
    }
}

/**
 * @brief Represents which axis to mirror across
 */
export enum MirrorAxis {
    X, // Mirror vertically
    Y, // Mirror horizontally
    XY // Mirror both vertically and horizontally
}


/**
 * @brief A recreation of the Sprator Cellular Automata algorithm
 * @see https://github.com/yurkth/sprator
 */
export class Sprator
{
    private m_seed: number;

    constructor(
        private m_canvasWidth: number,
        private m_canvasHeight: number,
        private m_spriteWidth: number,
        private m_spriteHeight: number
    ) {
        // Setup default rng seed between 0 and INT_MAX
        this.m_seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }

    public set seed(seed: number) {
        this.m_seed = seed;
    }

    /**
     * @brief Set the canvas size to fit the number of sprites.
     * @param spriteCount Amount of total sprites to generate
     */
    setSpriteCount(spriteCount: number)
    {
        this.m_canvasWidth = Math.ceil(Math.sqrt(spriteCount)) * this.m_spriteWidth;
        this.m_canvasHeight = Math.ceil(Math.sqrt(spriteCount)) * this.m_spriteHeight;
    }

    /**
     * @brief Generates white noise into the provided grid.
     * @param grid The grid to generate white noise into
     * @param density The density of the white noise. 0.0 is empty, 1.0 is full.
     */
    generateWhiteNoise(grid: Grid, density: number = 0.5)
    {
        for (const cell of grid) {
            cell.data = Math.random() < density;
        }
    }

    /**
     * @brief Steps the grid and returns a new copy.
     * @param grid 
     * @returns 
     */
    step(grid: Grid): Grid
    {
        const newGrid = new Grid(grid.width, grid.height);

        for (const cell of grid) {
            const neighbors = cell.neighbors(1, NeighborShape.Square);
            let aliveNeighbors = 0;
            let data = cell.data;

            for (const neighbor of neighbors) {
                if (neighbor.position.equals(cell.position)) {
                    continue;
                }

                if (neighbor.data == true) {
                    aliveNeighbors++;
                }
            }

            if (cell.data == true) {
                // two or three neighbors
                if (aliveNeighbors == 2 || aliveNeighbors == 3) {
                    // Survives
                    // cell.data = true;
                    data = true;
                } else {
                    // Dies
                    // cell.data = false;
                    data = false;
                }
            } else {
                // one or less
                if (aliveNeighbors <= 1) {
                    // Birth
                    // cell.data = true;
                    data = true;
                }
            }

            newGrid.setCell(cell.x, cell.y, data);
        }

        return newGrid;
    }

    /**
     * @brief Steps the grid by mutating it.
     * @param grid 
     */
    stepMut(grid: Grid)
    {
        for (const cell of grid) {
            const neighbors = cell.neighbors(1, NeighborShape.Square);
            let aliveNeighbors = 0;
            let data = cell.data;

            for (const neighbor of neighbors) {
                if (neighbor.position.equals(cell.position)) {
                    continue;
                }

                if (neighbor.data == true) {
                    aliveNeighbors++;
                }
            }

            if (cell.data == true) {
                // two or three neighbors
                if (aliveNeighbors == 2 || aliveNeighbors == 3) {
                    // Survives
                    // cell.data = true;
                    data = true;
                } else {
                    // Dies
                    // cell.data = false;
                    data = false;
                }
            } else {
                // one or less
                if (aliveNeighbors <= 1) {
                    // Birth
                    // cell.data = true;
                    data = true;
                }
            }

            grid.setCell(cell.x, cell.y, data);
        }
    }

    /**
     * @brief Mirrors the grid along the specified axis.
     * @param grid 
     * @param axis 
     * @returns Grid New mirrored grid
     * TODO: This function should actually just mirror the grid instead of mirroring and merging.
     */
    mirror(grid: Grid, axis: MirrorAxis = MirrorAxis.Y): Grid
    {
        const newGrid = new Grid(this.m_spriteWidth, this.m_spriteHeight);
        const halfWidth = Math.floor(this.m_spriteWidth / 2) - 1;

        // 1. Copy all cells with an x value less than half the width
        // 2. Flip the grid horizontally
        // 3. Copy to the right side of the grid

        for (const cell of newGrid) {
            if (cell.x <= halfWidth) {
                const data = grid.getCell(cell.x, cell.y).data;
                newGrid.setCell(cell.x, cell.y, data);
            } else {
            // if (cell.x > halfWidth) {
                const mirrorCell = grid.getCell(this.m_spriteWidth - cell.x - 1, cell.y);
                newGrid.setCell(cell.x, cell.y, mirrorCell.data);
            }
        }
        return newGrid;
    }

    /**
     * Add a border to a grid. This will create a new grid.
     * @param grid 
     * @param width 
     * @returns Grid
     */
    border(grid: Grid, width: number = 1): Grid
    {
        return grid;
    }

    /**
     * @brief Generates a sprite sheet from the provided grid.
     * @param sprites List of sprites to copy to the sprite sheet
     * @returns Grid The sprite sheet
     */
    generateSpriteSheet(sprites: Grid[]): Grid
    {
        let twidth = 0;
        let theight = 0;

        for (const sprite of sprites) {
            twidth += sprite.width;
            theight += sprite.height;
        }

        const spriteSheet = new Grid(twidth, theight);

        let x = 0;
        let y = 0;

        for (const sprite of sprites) {
            for (const cell of sprite) {
                spriteSheet.setCell(x + cell.x, y + cell.y, cell.data);
            }

            x += sprite.width;

            if (x >= spriteSheet.width) {
                x = 0;
                y += sprite.height;
            }
        }

        return spriteSheet;
    }

    /**
     * Generate all sprites for the current canvas size.
     * @param iterations 
     * @returns Array of sprite grids
     */
    generateSprites(iterations: number): Grid[]
    {
        /*
            1. Determine the total amount of sprites that can fit on the canvas.
            2. Generate N sprites, where N is the total amount of sprites that can fit on the canvas.
        */
        const spriteCount = Math.floor(this.m_canvasWidth / this.m_spriteWidth) * Math.floor(this.m_canvasHeight / this.m_spriteHeight);

        const sprites: Grid[] = [];

        for (let i = 0; i < spriteCount; i++) {
            const sprite = this.generateSprite(iterations);
            sprites.push(sprite);
        }

        return sprites;
    }

    /**
     * @brief Generates a single sprite.
     * @param iterations Number of iterations to run the simulation
     * @returns Grid The generated sprite
     */
    generateSprite(iterations: number): Grid
    {
        /*
            1. Use a grid of w/2, h
            2. Generate white noise
            3. Use the following rules:
                a. Any live cell with two or three neighbors survives.
                b. Any dead cell with one or less live neighbors becomes a live cell.
                c. All other live cells die. All other dead cells stay dead.
            4. Repeat N iterations
            5. Fill the other half with a mirrored version of the first half
            6. Add borders
        */
        let grid = new Grid(this.m_spriteWidth, this.m_spriteHeight);
        this.generateWhiteNoise(grid);

        for (let i = 0; i < Math.floor(iterations); i++) {
            this.step(grid);
        }

        grid = this.mirror(grid);

        return grid;
    }


    /**
     * @brief Yields each step of the simulation.
     * @param iterations Number of iterations to run the simulation
     * @yields Grid The sprite at each step
     */
    *generateSpriteSteps(iterations: number): IterableIterator<Grid>
    {
        let grid = new Grid(this.m_spriteWidth, this.m_spriteHeight);
        grid.id = "initial";
        this.generateWhiteNoise(grid);

        for (let i = 0; i < Math.floor(iterations-1); i++) {
            yield grid;
            this.stepMut(grid);
        }

        grid = this.mirror(grid);

        yield grid;
    }
}
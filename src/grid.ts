const EPSILON = 1e-6;

/**
 * @brief A Point in 2D space
 */
export class Point
{
    constructor(
        readonly x: number,
        readonly y: number
    ){}

    /**
     * @brief Returns if the difference is less than EPSILON
     * @param other Other point objecet
     * @returns boolean True if the points are equal
     */
    equals(other: Point): boolean {
        return Math.abs(this.x - other.x) < EPSILON && Math.abs(this.y - other.y) < EPSILON;
    }
}

/**
 * @brief An object that information about bounds.
 */
export class Bounds
{
    private m_x: number = 0;
    private m_y: number = 0;
    private m_width: number = 0;
    private m_height: number = 0;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.m_x = x;
        this.m_y = y;
        this.m_width = width;
        this.m_height = height;
    }

    get x(): number { return this.m_x; }
    get y(): number { return this.m_y; }
    get width(): number { return this.m_width; }
    get height(): number { return this.m_height; }
}

/**
 * @brief Represents a region of cells within a grid
 */
export class GridRegion
{
    private m_cells: Cell[] = [];
    private m_bounds: Bounds;


    /**
     * @brief Creates a new grid region from a position and a size
     * @param x Top left x position
     * @param y Top left y position
     * @param width Width of the region
     * @param height Height of the region
     */
    constructor(x: number, y: number, width: number, height: number)
    {
        this.m_bounds = new Bounds(x, y, width, height);
    }

    /**
     * @brief Factory method to create a grid region from position and size
     * @param x top left x
     * @param y top left y
     * @param width width of region
     * @param height height of region
     * @returns GridRegion
     */
    static fromXYWH(x: number, y: number, width: number, height: number): GridRegion
    {
        return new GridRegion(x, y, width, height);
    }

    /**
     * @brief Factory method to create a grid region from a bounds object.
     * @param bounds 
     * @returns GridRegion
     */
    static fromBounds(bounds: Bounds): GridRegion
    {
        return new GridRegion(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    /**
     * @brief Factory method to create a grid region from x1, y1, x2, y2 bounds
     * @param x1 Upper left x coordinate
     * @param y1 Upper left y coordinate
     * @param x2 Lower right x coordinate
     * @param y2 Lower right y coordinate
     * @returns GridRegion 
     */
    static fromXYXY(x1: number, y1: number, x2: number, y2: number): GridRegion
    {
        const x = Math.min(x1, x2);
        const y = Math.min(y1, y2);
        const width = Math.abs(x1 - x2);
        const height = Math.abs(y1 - y2);

        return new GridRegion(x, y, width, height);
    }
}

/**
 * @brief Represents the shape to search around a cell
 */
export enum NeighborShape
{
    Square, // A.k.a. Moore neighborhood
    // VonNeumann, // A.k.a. Cardinal neighborhood TODO: Implement
    Circle // Radius around the cell TODO: Implement circle algorithm
}


/**
 * @brief A cell in a grid that can contain any data
 */
export class Cell
{
    constructor(
        private _grid: Grid,
        private _data: any,
        private _x: number = 0,
        private _y: number = 0
    ) { }

    /**
     * @brief Gets the data this cell contains
     * @returns {any} The data this cell contains
     */
    get data(): any { return this._data; }

    /**
     * @brief Sets the data this cell contains
     */
    set data(value: any) { this._data = value; }

    /** @brief Get the x coordinate of this cell. */
    get x(): number { return this._x; }

    /** @brief Get the y coordinate of this cell. */
    get y(): number { return this._y; }

    /**
     * @brief Origin of this cell as a Point object
     */
    get position(): Point {
        return new Point(this._x, this._y);
    }

    /**
     * @returns {string} String representation of this cell
     */
    toString(): string {
        return this._data.toString();
    }

    /**
     * @brief Is this cell empty?
     * @returns {boolean} Boolean indicating if this is a "Null" cell
     */
    isNull(): boolean {
        return this._data === null;
    }

    /**
     * 
     * @param distance How many cells away to look
     * @param shape What shape to look in
     * @returns List of cells
     */
    neighbors(distance: number, shape: NeighborShape): Cell[] {
        return this._grid.neighbors(this, distance, shape);
    }
}

/**
 * A Grid is an abstraction of a 2D grid of cells. These cells can contain any type of data.
  
The grid should have these functionalities:
    - Get a cell by its coordinates
    - Get the neighbors of a cell
    - Set the data of a cell by its coordinates
    - Iterate over all cells
    - Iterate over all cells in a given range
    - Copy one grid into another
    - Copy a region of a grid into another region of another grid
    - Transform a grid:
        - Rotate
        - Flip
        - Mirror
        - Scale
    - Transform a region of a grid:
        - Rotate (How to rotate a region and deal with overlapping?)
        - Flip
        - Mirror
    - Resize a grid
  
 */
export class Grid implements Iterable<Cell>
{
    private m_grid: Cell[];
    private m_width: number;
    private m_height: number;
    private m_id = "";

    // * @brief Get the number of rows in the grid.
    public get width() : number { return this.m_width; }
    public get cols(): number { return this.m_width; }

    public get height() : number { return this.m_height; }
    public get rows(): number { return this.m_height; }

    public set id(value: string) { this.m_id = value; }
    
    /**
     * @brief Grid
     * @param width 
     * @param height 
     */
    constructor(width: number, height: number)
    {
        // Create a 1D array of cells. The grid is stored in row-major order.
        this.m_grid = Array<Cell>(width * height);
        this.m_width = width;
        this.m_height = height;
        // Fill the grid with null cells
        for (let i = 0; i < this.m_grid.length; i++) {
            const x = i % this.width;
            const y = Math.floor(i / this.width);
            this.m_grid[i] = new Cell(this, null, x, y);
        }
    }

    /**
     * @brief Return a string of the grid's information.
     * @returns String
     */
    toString(): string
    {
        let str = "";
        // Data to return:
        // - Width, Height
        // - Canvas size

        str += `Grid[${this.m_id}]: ${this.width}x${this.height}\n`;

        return str;
    }

    /**
     * @brief Copy the contents of another grid into this one.
     * @param other Other grid to copy from
     */
    copyFrom(other: Grid): void
    {
        // Take the smaller of the two grids to copy
        const width = Math.min(this.width, other.width);
        const height = Math.min(this.height, other.height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.setCell(x, y, other.getCell(x, y));
            }
        }
    }

    /**
     * @brief Resize the grid to the given dimensions.
     * @param width New width of the grid
     * @param height New height of the grid
     */
    public resize(width: number, height: number)
    {
        this.m_grid = Array<Cell>(width * height);
        this.m_width = width;
        this.m_height = height;
    }

    /**
     * @brief Returns the cell at the given coordinates.
     * @param {number} x X coordinate
     * @param {number} y Y coordinate
     * @returns {Cell} Cell at the given coordinates
     */
    public getCell(x: number, y: number): Cell
    {
        // Fetch cell from grid with row-major order
        return this.m_grid[y * this.width + x];
    }

    /**
     * @breif Sets the value of the cell at the given coordinates.
     * @param x 
     * @param y 
     * @param data 
     */
    public setCell(x: number, y: number, data: any)
    {
        // Set cell in grid with row-major order
        this.m_grid[y * this.width + x] = new Cell(this, data, x, y);
    }

    /**
     * @brief Returns an iterator over the cells in the grid.
     * @yields Iterator over the cells in the grid
     */
    public *[Symbol.iterator](): IterableIterator<Cell>
    {
        for (let i = 0; i < this.m_grid.length; i++) {
            const cell = this.m_grid[i];
            if (cell) {
                yield cell;
            } else {
                yield new Cell(this, null, i % this.width, Math.floor(i / this.width));
            }
        }
    }

    /**
     * @param origin Which cell is the origin of the neighbor search.
     * @param distance How many cells away from the origin to search.
     * @param shape Which shape to search in.
     * @returns List of cells neighboring the origin cell.
     */
    public neighbors(origin: Cell, distance: number, shape: NeighborShape): Cell[]
    {
        const cells: Cell[] = [];

        switch (shape) {
            case NeighborShape.Square:
                for (let x = origin.x - distance; x <= origin.x + distance; x++) {
                    for (let y = origin.y - distance; y <= origin.y + distance; y++) {
                        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                            cells.push(this.getCell(x, y));
                        }
                    }
                }

                break;

            case NeighborShape.Circle:
                for (let x = origin.x - distance; x <= origin.x + distance; x++) {
                    for (let y = origin.y - distance; y <= origin.y + distance; y++) {
                        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                            if (Math.abs(x - origin.x) + Math.abs(y - origin.y) <= distance) {
                                cells.push(this.getCell(x, y));
                            }
                        }
                    }
                }

                break;

            default:
                throw new Error("Invalid neighbor shape");
        }

        return cells;
    }
}


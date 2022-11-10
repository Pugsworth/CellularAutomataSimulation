import { IGridContainer } from "lib/interface/igridcontainer";
import { IGridCompare } from "lib/interface/igridcompare";
import { Bounds } from "lib/bounds";
import { IComparable, CompareLooseEquals } from "lib/interface/icomparefunction";
import { Point } from "lib/point";
import { Cell } from "lib/cell";
import { INeighborSearch, NeighborShape } from "lib/interface/ineighborsearch";
import { IIdentifiable } from "lib/interface/iidentifiable";

/**
 * @brief Represents a region of cells within a grid
 * 
 
    A Grid Region is a region of cells within a grid. Itself is also a grid, but it is a subset of another grid.
    
    I'm stuck on two possible implementations of this.
        1. Essentially a wrapper around a grid that only exposes the cells within the region.
            This object then would store a reference to the parent grid and perform all operations on that parent grid.
            e.g. set(x, y, data) {
                const x = this.x + x;
                const y = this.y + y;
                this.m_parent.set(x, y, data);
            }
        2. A lightweight container that only stores the coordinates of the cells within the parent grid.
            When there is any access or modification to the region, the region will copy the data to the parent grid.
            e.g. set(grid, x, y, data) { // will set the data on the grid at (x + this.x, y + this.y)
                const x = this.x + x;
                const y = this.y + y;
                grid.set(x, y, data);
            }

        One requires holding a reference, the other is a light wrapper around the same methods as a grid with an offset and size.
 */
export class GridRegion implements IGridContainer, IGridCompare
{
    // A reference to the grid that this region is a part of.
    private m_parent: IGridContainer;
    // The bounds of this region. x and y represents an offset
    private m_bounds: Bounds;


    /**
     * @brief Creates a new grid region from a position and a size
     * @param parent The parent grid that this region is a part of.
     * @param x Top left x position
     * @param y Top left y position
     * @param width Width of the region
     * @param height Height of the region
     */
    // The parent grid, where in that grid this region is located.
    constructor(parent: IGridContainer, x: number, y: number, width: number, height: number)
    {
        this.m_parent = parent;
        this.m_bounds = new Bounds(x, y, width, height);
    }

    /**
     * @brief Get the coordinates of the parent IGridContainer relative to this region's coordinates.
     * @param x X coordinate
     * @param y Y coordinate
     * @returns Point The coordinates of the cell in the parent grid.
     */
    private getParentCellCoordinates(x: number, y: number): Point {
        return new Point(this.m_bounds.x + x, this.m_bounds.y + y);
    }

    /**
     * @brief Checks if a grid or region matches this region exactly.
     * @param other The other grid or region to compare to.
     * @param compareFunc The function to use to compare the data in the cells. Defaults to '=='.
     * @returns boolean True if the grids match.
     */
    equals(other: IGridContainer, compareFunc: IComparable = CompareLooseEquals): boolean
    {
        return this.matches(other, new Point(0, 0), new Point(0, 0), compareFunc);
    }

    /**
     * 
     * @param other The other grid or region to compare to.
     * @param alignment
     * @param offset Offset to apply to this region in relation to the alignment of the other IGridContainer.
     * @param compareFunc The function to use to compare the data in the cells. Defaults to '=='. 
     * @returns 
     */
    matches(other: IGridContainer, alignment: Point, offset: Point, compareFunc: IComparable = CompareLooseEquals): boolean
    {
        for (let i = 0; i < this.m_bounds.width; i++)
        {
            for (let j = 0; j < this.m_bounds.height; j++)
            {
                const thisCell = this.get(i, j);
                const otherCell = other.get(i + alignment.x + offset.x, j + alignment.y + offset.y);

                if (!compareFunc(thisCell, otherCell)) {
                    return false;
                }
            }
        }

        return true;
    }


    /**
     * @brief Gets the data at the given coordinates on the parent grid.
     * @param x X coordinate relative to the region's slice of the parent grid.
     * @param y Y coordinate relative to the region's slice of the parent grid.
     * @returns Cell The cell at the given coordinates.
     */
    get(x: number, y: number): Cell
    {
        const i = x + this.m_bounds.x;
        const j = y + this.m_bounds.y;
        return this.m_parent.get(i, j);
    }
    getCell(x: number, y: number): Cell { return this.get(x, y); }

    /**
     * @brief Sets the data at the given coordinates on the parent grid.
     * @param x X coordinate relative to the region's slice of the parent grid.
     * @param y Y coordinate relative to the region's slice of the parent grid.
     * @param data The data to set at the given coordinates on the parent grid.
     */
    set(x: number, y: number, data: any): void
    {
        const i = x + this.m_bounds.x;
        const j = y + this.m_bounds.y;
        this.m_parent.set(i, j, data);
    }
    setCell(x: number, y: number, data: any): void { this.set(x, y, data); }

    get width(): number { return this.m_bounds.width; }
    get cols(): number { return this.m_bounds.width; }
    get height(): number { return this.m_bounds.height; }
    get rows(): number { return this.m_bounds.height; }


    clone(): IGridContainer
    {
        const clone = new GridRegion(this.m_parent, this.m_bounds.x, this.m_bounds.y, this.m_bounds.width, this.m_bounds.height);
        return clone;
    }

    copyFrom(grid: IGridContainer): IGridContainer
    {
        for (let i = 0; i < this.m_bounds.width; i++)
        {
            for (let j = 0; j < this.m_bounds.height; j++)
            {
                const parentCoords = this.getParentCellCoordinates(i, j);
                const cell = grid.get(parentCoords.x, parentCoords.y);
                this.set(i, j, cell);
            }
        }

        return this;
    }

    resize(width: number, height: number): IGridContainer
    {
        // This is essentially a quick way to create a new region.
        // Sets the new bounds
        this.m_bounds = new Bounds(this.m_bounds.x, this.m_bounds.y, width, height);

        return this;
    }

    neighbors(origin: Cell, shape: NeighborShape, distance: number): IGridContainer
    {
        throw new Error("Method not implemented.");
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
    - Match a grid to another grid with the ability to specify offset
 */
export class Grid implements Iterable<Cell>, IGridCompare, IGridContainer, INeighborSearch, IIdentifiable<string>
{
    private m_grid: Cell[];
    private m_width: number;
    private m_height: number;
    private m_id = "";

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
        const str = `Grid[${this.m_id}]: ${this.width}x${this.height}\n`;
        return str;
    }


    /**
     * IIdentifiable implementation
     */

    set id(value: string) { this.m_id = value; }


    /**
     * IGridContainer implementations
     */

    get(x: number, y: number): Cell
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }

        const i = x + y * this.width;
        return this.m_grid[i];
    }


    /**
     * @brief Returns the cell at the given coordinates.
     * @param {number} x X coordinate
     * @param {number} y Y coordinate
     * @returns {Cell} Cell at the given coordinates
     * @deprecated Use get(x, y) instead
     */
    getCell(x: number, y: number): Cell {
        return this.get(x, y);
    }

    set(x: number, y: number, data: any): void
    {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }

        const i = x + y * this.width;
        this.m_grid[i].data = data;
    }


    /**
     * @breif Sets the value of the cell at the given coordinates.
     * @param x 
     * @param y 
     * @param data 
     * @deprecated Use set(x, y, data) instead
     */
    setCell(x: number, y: number, data: any) {
        this.set(x, y, data);
    }


    // * @brief Get the number of rows in the grid.
    get width() : number { return this.m_width; }
    get cols(): number { return this.m_width; }

    get height() : number { return this.m_height; }
    get rows(): number { return this.m_height; }


    clone(): IGridContainer
    {
        const grid = new Grid(this.width, this.height);

        for (const cell of this) {
            grid.set(cell.x, cell.y, cell.data);
        }

        return grid as IGridContainer;
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


    static copyFrom(other: Grid): Grid
    {
        const grid = new Grid(other.width, other.height);
        grid.copyFrom(other);
        return grid;
    }


    resize(width: number, height: number): IGridContainer
    {
        this.m_grid = Array<Cell>(width * height);
        this.m_width = width;
        this.m_height = height;

        return this as IGridContainer;
    }

    

    /**
     * IGridCompare implementations
     */

    equals(other: IGridContainer, compareFunc:IComparable=CompareLooseEquals): boolean
    {
        if (this.width !== other.width || this.height !== other.height) {
            return false;
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.get(x, y);
                const otherCell = other.get(x, y);
                if (!compareFunc(cell.data, otherCell.data)) {
                    return false;
                }
            }
        }
    }


    matches(other: IGridContainer, alignment: Point, offset: Point, compareFunc: IComparable): boolean
    {
        throw new Error("Method not implemented.");
        return false;
    }


    /**
     * Iterable implementation
     */

    /**
     * @brief Returns an iterator over the cells in the grid.
     * @yields Iterator over the cells in the grid
     */
    *[Symbol.iterator](): IterableIterator<Cell>
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
     * INeighborSearch implementations
     */

    /**
     * @param origin Which cell is the origin of the neighbor search.
     * @param distance How many cells away from the origin to search.
     * @param shape Which shape to search in.
     * @returns List of cells neighboring the origin cell.
     * TODO: This should return a grid region instead of a list of cells.
     */
    public neighbors(origin: Cell, shape: NeighborShape, distance: number): IGridContainer
    {
        // TODO: The size of the IGridContainer depends on the shape and distance.
        // TODO: This means Shapes should be abstracted with the ability to get the AABB of the shape.
        const cells: Cell[] = [];
        let minX = origin.x;
        let minY = origin.y;
        let maxX = origin.x;
        let maxY = origin.y;

        switch (shape) {
            case NeighborShape.Square:
                for (let x = origin.x - distance; x <= origin.x + distance; x++) {
                    for (let y = origin.y - distance; y <= origin.y + distance; y++) {
                        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x);
                            maxY = Math.max(maxY, y);
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
                                minX = Math.min(minX, x);
                                minY = Math.min(minY, y);
                                maxX = Math.max(maxX, x);
                                maxY = Math.max(maxY, y);
                                cells.push(this.getCell(x, y));
                            }
                        }
                    }
                }

                break;

            case NeighborShape.VonNeumann:
                for (let x = origin.x - distance; x <= origin.x + distance; x++) {
                    for (let y = origin.y - distance; y <= origin.y + distance; y++) {
                        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                            if (Math.abs(x - origin.x) + Math.abs(y - origin.y) <= distance) {
                                if (x == origin.x || y == origin.y) {
                                    minX = Math.min(minX, x);
                                    minY = Math.min(minY, y);
                                    maxX = Math.max(maxX, x);
                                    maxY = Math.max(maxY, y);
                                    cells.push(this.getCell(x, y));
                                }
                            }
                        }
                    }
                }

                break;

            default:
                throw new Error("Invalid neighbor shape");
        }

        // Construct a gridregion from the cells
        return new GridRegion(this, minX, minY, maxX, maxY, cells);
    }
}

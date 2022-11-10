import { Cell } from "lib/cell";
import { NeighborShape } from "lib/interface/ineighborsearch";


/**
 * @brief An object that is a grid-like container.
 * Coordinates start at 0,0 in the top left corner.
 */
export interface IGridContainer {
    /**
     * @brief Get the Cell at the given coordinates.
     * @param x X coordinate
     * @param y Y coordinate
     * @returns Cell The cell at the given coordinates
     */
    get(x: number, y: number): Cell;
    
    /**
     * @brief Get the Cell at the given coordinates.
     * @param x X coordinate
     * @param y Y coordinate
     * @returns Cell The cell at the given coordinates
     * 
     * @deprecated use get(x, y) instead.
     */
    getCell(x: number, y: number): Cell;

    /**
     * @brief Sets the data at the given coordinates.
     * @param x X coordinate
     * @param y Y coordinate
     * @param data Data to set on the cell at the given coordinates.
     */
    set(x: number, y: number, data: any): void;

    /**
     * @brief Sets the data at the given coordinates.
     * @param x X coordinate
     * @param y Y coordinate
     * @param data Data to set on the cell at the given coordinates.
     * 
     * @deprecated use set(x, y, cell) instead.
     */
    setCell(x: number, y: number, data: any): void;

    /**
     * @brief Get the width of the grid.
     */
    get width(): number;
    /**
     * @brief Get the number of columns in the grid (width).
     */
    get cols(): number;

    /**
     * @brief Get the height of the grid.
     */
    get height(): number;
    /**
     * @brief Get the number of rows in the grid (height).
     */
    get rows(): number;

    /**
     * @brief Clone this IGridContainer
     * @returns IGridContainer A clone of this IGridContainer
     */
    clone(): IGridContainer;

    /**
     * @brief Copy the contents of another IGridContainer into this one. Copies the minimum of the two widths and heights.
     * @param grid The grid copy into this grid.
     * @returns IGridContainer This grid.
     */
    copyFrom(grid: IGridContainer): IGridContainer;

    /**
     * @brief Resizes this IGridContainer to the given width and height.
     * @param width
     * @param height 
     * @returns IGridContainer This grid after resizing.
     */
    resize(width: number, height: number): IGridContainer;
}

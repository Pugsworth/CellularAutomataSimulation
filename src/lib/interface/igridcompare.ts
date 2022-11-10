import { IGridContainer } from "lib/interface/igridcontainer";
import { IComparable } from "lib/interface/icomparefunction";
import { Point } from "lib/point";
/**
 * @brief Interface to compare grids in various ways.
 */
export interface IGridCompare {
    /**
     * @brief Do the two IGridCompare objects match? Implies that the objects are the same size and have the same state.
     * @param other The other IGridContainer object to compare to.
     * @param compareFunction The function to use to compare the data in the cells.
     * @returns boolean True if the two grids match.
     */
    equals(other: IGridContainer, compareFunc: IComparable): boolean;

    /**
     * @brief Checks if a grid or region matches this region exactly. Allows for offset and alignment.
     * @param other The other IGridContainer object to compare to.
     * @param alignment Which cell within this region should be aligned with the other grid or region
     * @param offset The offset to apply to the other grid or region in relation to the alignment of this grid.
     * @returns boolean True if the grids match
     * 
     * @example
     * // This example shows how to check if a grid matches a region
     * const grid = new Grid(4, 4);
     * // Assuming the grid is filled as so:
     * // | 1 | 0 | 0 | 0 |
     * // | 0 | 1 | 0 | 0 |
     * // | 0 | 0 | 1 | 0 |
     * // | 0 | 0 | 0 | 1 |
     * 
     * const region = new GridRegion(grid, 0, 0, 2, 2);
     * // The region references the following cells from the grid:
     * // | 1 | 0 |
     * // | 0 | 1 |
     * 
     * // This will check region against the bottom right corner of the grid
     * grid.matches(region, new Point(2, 2)); // = true
     */
    matches(other: IGridContainer, alignment: Point, offset: Point, compareFunc: IComparable): boolean;
}
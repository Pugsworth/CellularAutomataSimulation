import { IGridContainer } from "lib/interface/igridcontainer";
import { Point } from "lib/point";
import { INeighborSearch, NeighborShape } from "lib/interface/ineighborsearch";
/**
 * @brief A cell in a grid that can contain any data
 */
export class Cell implements INeighborSearch
{
    constructor(
        private m_grid: IGridContainer,
        private m_data: any,
        private m_x: number = 0,
        private m_y: number = 0
    ) { }

    /**
     * @brief Gets the data this cell contains
     * @returns {any} The data this cell contains
     */
    get data(): any { return this.m_data; }

    /**
     * @brief Sets the data this cell contains
     */
    set data(value: any) { this.m_data = value; }

    /** @brief Get the x coordinate of this cell. */
    get x(): number { return this.m_x; }

    /** @brief Get the y coordinate of this cell. */
    get y(): number { return this.m_y; }

    /**
     * @brief Origin of this cell as a Point object
     */
    get position(): Point {
        return new Point(this.m_x, this.m_y);
    }

    /**
     * @returns {string} String representation of this cell
     */
    toString(): string {
        return this.m_data.toString();
    }

    /**
     * @brief Is this cell empty?
     * @returns {boolean} Boolean indicating if this is a "Null" cell
     */
    isNull(): boolean {
        return this.m_data === null;
    }

    /**
     * 
     * @param distance How many cells away to look
     * @param cell The cell to look around
     * @param distance How many cells away to look
     * @param shape What shape to look in
     * @returns List of cells
     */
    neighbors(cell: Cell=this, distance: number, shape: NeighborShape): IGridContainer {
        const ns = this.m_grid as INeighborSearch
        return ns.neighbors(cell, shape, distance);
    }
}

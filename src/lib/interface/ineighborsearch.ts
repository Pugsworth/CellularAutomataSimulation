import { Cell } from "lib/cell";
import { IGridContainer } from "lib/interface/igridcontainer";

/**
 * @brief Represents the shape to search around a cell
 */
export enum NeighborShape
{
    Square, // A.k.a. Moore neighborhood
    VonNeumann, // A.k.a. Cardinal neighborhood TODO: Implement
    Circle // Radius around the cell TODO: Implement circle algorithm
}

/**
 * @brief Provides a way to search for neighbors of a cell
 */
export interface INeighborSearch {
    neighbors(cell: Cell, shape: NeighborShape, distance: number): IGridContainer;
}
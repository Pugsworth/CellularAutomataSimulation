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
     * @param other Other point object
     * @param eps Epsilon value
     * @returns boolean True if the points are equal
     */
    equals(other: Point, eps: number=1e-6): boolean {
        return Math.abs(this.x - other.x) < eps && Math.abs(this.y - other.y) < eps;
    }
}
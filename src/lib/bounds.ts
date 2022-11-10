import { Point } from "lib/point";
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

    get left(): number { return this.m_x; }
    get right(): number { return this.m_x + this.m_width; }
    get top(): number { return this.m_y; }
    get bottom(): number { return this.m_y + this.m_height; }

    get center(): Point {
        return new Point(this.m_x + this.m_width / 2, this.m_y + this.m_height / 2);
    }

    get topLeft(): Point {
        return new Point(this.m_x, this.m_y);
    }

    get topRight(): Point {
        return new Point(this.m_x + this.m_width, this.m_y);
    }

    get bottomLeft(): Point {
        return new Point(this.m_x, this.m_y + this.m_height);
    }

    get bottomRight(): Point {
        return new Point(this.m_x + this.m_width, this.m_y + this.m_height);
    }
}
import { Grid, GridRegion } from "lib/grid";
import * as assert from "node:assert";
import test, { describe } from "node:test";


test("Grid Region Tests", (t) =>
{
    describe("GridRegion", (t) =>
    {
        const test_grid = new Grid(4, 4);
        const grid_region = new GridRegion(test_grid, 0, 0, 2, 2);


        // Fill test_grid with 1 at 0, 0, 1, 1, 2, 2, 3, 3
        for (let i = 0; i < test_grid.width; i++) {
            test_grid.set(i, i, 1);
        }

        // Check that the grid region matches
        const match_data = [
            [1, 0],
            [0, 1]
        ];

        for (let i = 0; i < grid_region.width; i++) {
            for (let j = 0; j < grid_region.height; j++) {
                assert.equal(
                    grid_region.get(i, j).data,
                    match_data[i][j],
                    `GridRegion[${i}, ${j}] does not match expected value of ${match_data[i][j]}`
                );
            }
        }
    });
});



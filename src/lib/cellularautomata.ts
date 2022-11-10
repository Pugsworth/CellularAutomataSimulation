

/**
 * @brief A rule for a cellular automata.
 */
export class Rule
{
    private m_name: string;
    private m_ruleData: object;
    // private m_ruleGrid: Grid;
    // private m_neighborShape: NeighborShape;
    // private m_neighborDistance: number;

    constructor(
        private m_ruleGrid: Grid,
        private m_neighborShape: NeighborShape,
        private m_neighborDistance: number
    ) {}

    public get name(): string { return this.m_name; }
    public set name(name: string) { this.m_name = name; }

    public get shape(): NeighborShape { return this.m_neighborShape; }

    public set ruleGrid(grid: Grid) {
        this.m_ruleGrid = Grid.copyFrom(grid);
    }


    /**
     * @brief Compile the rule data to a representation that can be checked faster.
     */
    public compile() {
        return;
    }


    /**
     * @brief How should the rule be applied to the grid?
     * @param cell The cell to apply the rule to
     * @param neighbors The neighbors of the cell
     * @returns Whether the cell passes the rule
     */
    public apply(cell: Cell, neighbors: Grid): boolean {
        return false;
    }
}

export class Rule30 extends Rule
{
    constructor() {
        super(
            new Grid(3, 2),
            NeighborShape.Square,
            1
        );
    }
    
    public apply(cell: Cell, neighbors: Grid): boolean {
        const left = neighbors.getCell(0, 0);
        const center = neighbors.getCell(1, 0);
        const right = neighbors.getCell(2, 0);
        const down = neighbors.getCell(1, 1);
        return false;
    }
}

/*

    TODO: Create data-driven rules

    Here's some examples of data-driven rules:

    const ConwaysGoLRules = {
        ruleType: "Count",        // Matches a number of neighbors instead of a specific pattern
        distance: 1,              // How far to look for neighbors
        shape: "Square",          // What shape to look for neighbors
        rules: [                  // an array of counts and the resulting state of the origin cell
            false, // 0
            false, // 1
            true,  // 2 
            true,  // 3 
            false, // 4 
            false, // 5 
            false, // 6 
            false, // 7 
            false, // 8 
        ],
    };

    const Rule30 = {
        ruleType: "Pattern",
        origin: { x: 1, y: 1 },
        legend: {
            "0": false,
            "1": true,
            " ": "ignore"
        },
        rules: [
            {
                state: [
                    "111",
                    " 0 "
                ],
                result: "0"
            },
            {
                state: [
                    "110",
                    " 0 "
                ],
                result: "0"
            },
            {
                state: [
                    "101",
                    " 0 "
                ],
                result: "0"
            },
            {
                state: [
                    "100",
                    " 1 "
                ],
                result: "1"
            },
            {
                state: [
                    "011",
                    " 1 "
                ],
                result: "1"
            },
            {
                state: [
                    "010",
                    " 1 "
                ],
                result: "1"
            },
            {
                state: [
                    "000",
                    " 0 "
                ],
                result: "0"
            }
        ]
    };


    const Rule90 = {
        ruleType: "Pattern",
        origin: { x: 1, y: 1 }, // Which part of the pattern is origin cell?
        legend: {               // Which characters represent which values within the state?
            "0": false,
            "1": true,
            " ": "ignore"
        },
        result_states: [ // Each entry is the resulting state the origin cell will become if the pattern matches.
            {
                result: "0"
                rules: [
                    { state: [ // State is an array of strings. Each string is a row of the pattern grid.
                        "111",
                        " 0 "
                    ] },
                    { state: [
                        "101",
                        " 0 "
                    ] },
                    { state: [
                        "010",
                        " 0 "
                    ] },
                    { state: [
                        "000",
                        " 0 "
                    ] },
                ]
            },
            {
                result: "1"
                rules: [
                    { state: [
                        "110",
                        " 1 "
                    ] }
                    { state: [
                        "100",
                        " 1 "
                    ] },
                    { state: [
                        "011",
                        " 1 "
                    ] },
                    { state: [
                        "001",
                        " 1 "
                    ] },
                ]
            }
        ]
    };

*/
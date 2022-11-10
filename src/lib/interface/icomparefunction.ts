export interface IComparable {
    (a: any, b: any): boolean;
}

/**
 * @brief Compare function for loose equality
 * @param a 
 * @param b 
 * @returns boolean True if the values are equal
 */
export const CompareLooseEquals: IComparable = function(a: any, b: any): boolean {
    return a == b;
};

/**
 * @brief Compare function for strict equality
 * @param a 
 * @param b 
 * @returns boolean True if the values are equal
 */
export const CompareStrictEquals: IComparable = function(a: any, b: any): boolean {
    return a === b;
};
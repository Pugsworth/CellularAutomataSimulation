
/**
 * @brief An object that can identify itself.
 */
export interface IIdentifiable<T> {
    get id(): T;
}
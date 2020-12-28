/**
 * Objects which are serializable to the REST API implement this class
 */
export abstract class Serializable {
    /**
     *  Transform the current object into a raw object for sending to the back-end, stripping any unnecessary fields
     * @abstract
     * @returns {*} the raw object to send
     */
    public abstract serialize(): any;
    /**
     * Parse the object from the record returned from the back-end
     * @abstract
     * @param {*} rep the raw object to parse
     */
    public abstract deserialize(rep: any);
}
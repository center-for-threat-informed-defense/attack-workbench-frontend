import { ValidatorFn, AbstractControl } from '@angular/forms';

export class VersionNumber {
    private version = [];

    /**
     * Construct a new version number object
     * @param version version number as string, e.g "6.0.1". Must be a set of numbers separated by .s
     */
    constructor(version: string) {
        // TODO check string against regex
        this.version = version.split(".");
    }

    /**
     * Get the version number as a string
     */
    public toString(): string {
        return this.version.join(".");
    }

    /**
     * Get the level of granularity of the version. 
     * E.g 10.12.4 would have a granularity of 3, 
     * and 6.2 would have a granularity of 2
     * @returns {number} the level of granularity
     */
    public get granularity(): number {
        return this.version.length;
    }

    /**
     * Get the sub-version of the version number
     * @param index the index to get. E.g index of 2 with version 1.2.3.4 would return "3"
     */
    public getSubVersion(index: number) {
        if (index > this.granularity || index < 0) throw "cannot fetch sub-version, index out of bounds";
        return this.version[index];
    }

    /**
     * Compare this version number to another version number.
     * Note: higher granularity versions are considered by this implementation to be greater versions,
     * so 1.0.0.0 is greater than 1.0. 
     * @param {VersionNumber} that the version to compare to
     * @returns {number} 0 if the same, + if this is greater, - if that is greater
     */
    public compareTo(that: VersionNumber): number {
        //TODO test this
        for (let i = 0; i < Math.max(this.granularity, that.granularity); i++) {
            if (this.granularity == that.granularity && this.granularity < i) return 0; //same version
            if (this.granularity < i) return -1;
            if (that.granularity < i) return 1;
            if (this.getSubVersion(i) == that.getSubVersion(i)) continue;
            return this.getSubVersion(i) - that.getSubVersion(i);
        }
    }
}

/**
 * form field validator checking if the version number is formatted correctly
 */
export function versionNumberFormatValidator(): ValidatorFn {
    const pattern = /^(\d+\.)*\d+$/;
    return (control: AbstractControl): {[key:string]: any} | null => {
        const valid = pattern.test(control.value);
        return !valid ? { "invalidVersionFormat": { value: control.value }} : null;
    }
}
/**
 * form field validator checking if the version has been incremented
 * @param previousVersion the version the object was previously, for comparison
 */
export function versionNumberIncrementValidator(previousVersion: VersionNumber): ValidatorFn {
    return (control: AbstractControl): {[key:string]: any} | null => {
        const valid = new VersionNumber(control.value).compareTo(previousVersion) > 0;
        return !valid ? { "versionNotIncremented": { value: control.value }} : null;
    }
}
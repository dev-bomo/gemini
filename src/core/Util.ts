import _ from "lodash";

export function areEqual(sf: any[], sf2: any[]): boolean {
    let areEqual = true;
    sf.forEach((sf: any) => {
        let idx = sf2.indexOf(sf);
        if (idx === -1) {
            areEqual = false;
        } else {
            let localAreEqual: boolean = _.isEqual(sf, sf2[idx]);
            if (!localAreEqual) areEqual = false;
        }
    });

    return areEqual;
}
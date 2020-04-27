import { FilterOp } from "./ApiOptions";

export const getStringFromFilterOperator: (op: FilterOp) => string = (op: FilterOp) => {
    switch (op) {
        case FilterOp.Gte:
            return '_gte';
        case FilterOp.Lte:
            return '_lte';
        case FilterOp.Ne:
            return '_ne';
        case FilterOp.Like:
            return '_like';
        default:
            return '';
    }
}

export function getResponse<T>(response: Response): Promise<any> {
    if (response.status < 200 || response.status >= 300) {
        throw Error('Error HTTP' + response.status + 'on executing the call');
    }

    return response.json();
}
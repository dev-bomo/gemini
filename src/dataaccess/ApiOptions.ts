export interface ApiOptions {
    pagination?: ApiPagination;
    filters?: ApiFilter[];
    sort?: ApiSort[];
}

export interface ApiFilter {
    propName: string;
    value: string;
    operator: FilterOp
}

export enum FilterOp {
    Gte,
    Lte,
    Ne,
    Like
}

export interface ApiSort {
    propName: string;
    isAsc: boolean;
}

export interface ApiPagination {
    page: number;
    limit: number;
}
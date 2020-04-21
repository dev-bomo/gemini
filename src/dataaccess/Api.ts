import { Login } from "../model/Login";
import { ChangeSet } from "../model/ChangeSet";
import { ApiOptions, ApiPagination, ApiSort, ApiFilter, FilterOp } from "./ApiOptions";

export default class Api {
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    public async login(user: string, password: string): Promise<Login[]> {
        return fetch(this.url + `interview/logins?login=${user}&password=${password}`).then((data: Response) => {
            return data.json();
        });
    }


    public async getData(token: string, options: ApiOptions): Promise<ChangeSet[]> {
        let url = `${this.url}interview/${token}?`;
        if (options.pagination) {
            let { page, limit }: ApiPagination = options.pagination;
            url += `_page=${page}&_limit=${limit}&`;
        }

        if (options.sort) {
            let propNames: string = '';
            let orders: string = '';
            options.sort.forEach((sort: ApiSort) => {
                propNames += `${sort.propName},`;
                orders += `${sort.isAsc ? 'asc' : 'desc'},`;
            });


            url += `_sort=${propNames}&_order=${orders}&`;
        }

        if (options.filters) {
            options.filters.forEach((filter: ApiFilter) => {
                url += `${filter.propName}${this.getStringFromFilterOperator(filter.operator)}=${filter.value}&`;
            })
        }

        return fetch(url).then((data: Response) => {
            // should check that the response is >=200 <300
            return data.json();
        })
    }

    private getStringFromFilterOperator(op: FilterOp): string {
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
}
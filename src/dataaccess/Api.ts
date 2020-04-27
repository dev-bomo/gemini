import { Login } from "../model/Login";
import { ChangeSet } from "../model/ChangeSet";
import { ApiOptions, ApiPagination, ApiSort, ApiFilter } from "./ApiOptions";
import { getResponse, getStringFromFilterOperator } from "./Util";

export default class Api {
    private readonly url: string;

    private readonly onError: (e: Error) => void;

    private token: string = '';

    constructor(url: string, onError: (e: Error) => void) {
        this.url = url;
        this.onError = onError;
    }

    public async login(user: string, password: string): Promise<void> {
        return fetch(this.url + `interview/logins?login=${user}&password=${password}`).then((data: Response) =>
            getResponse<Login[]>(data).then((logins: Login[]) => {
                if (logins && logins.length === 1) {
                    this.token = logins[0].token;
                } else {
                    throw Error('Invalid credentials');
                }
            }));
    }


    public async getData(options: ApiOptions): Promise<ChangeSet[]> {
        if (!this.token) {
            this.onError(new Error('user not logged in'));
            Promise.reject();
        }

        let url = `${this.url}interview/${this.token}?`;
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
                url += `${filter.propName}${getStringFromFilterOperator(filter.operator)}=${filter.value}&`;
            })
        }

        return fetch(url).then((data: Response) => {
            return getResponse<ChangeSet[]>(data);
        })
    }
}
import React from "react";
import Api from "../dataaccess/Api";
import { Login } from "../model/Login";
import { ChangeSet } from "../model/ChangeSet";
import { Table, Button, Dropdown, FormControl } from 'react-bootstrap';
import styles from './View.module.scss';
import { ApiSort } from "../dataaccess/ApiOptions";
import { nameof } from "../model/Util";

interface ViewState {
    login: Login | null;
    changeSets: ChangeSet[] | null;
    page: number;
    limit: number;
    sortFields: ApiSort[];

}

interface ViewProps {
    api: Api;
}

export default class View extends React.Component<ViewProps, ViewState> {

    constructor(props: ViewProps) {
        super(props);
        this.areEqual = this.areEqual.bind(this);
        this.state = {
            login: null,
            changeSets: null,
            page: 1,
            limit: 10,
            sortFields: []
        };
    }

    async componentDidMount() {
        let { api }: ViewProps = this.props;
        let ret: Login[] = await api.login('UsernameFull', 'full');

        if (ret.length > 0) {
            this.setState({ login: ret[0] });
            let cs: ChangeSet[] = await api.getData(ret[0].token, {
                pagination: { page: this.state.page, limit: this.state.limit },
                sort: [{ propName: nameof<ChangeSet>('entityName'), isAsc: true }]
            });

            if (cs.length > 0) {
                this.setState({ changeSets: cs });
            } else {

            }
        } else {
            // some error handling
        }
    }

    private areEqual(sf: ApiSort[], sf2: ApiSort[]): boolean {
        let areEqual = true;
        sf.forEach((sf: ApiSort) => {
            if (sf2.indexOf(sf) === -1) {
                areEqual = false;
            }
        })

        return areEqual;
    }

    async componentDidUpdate(prevProps: ViewProps, prevState: ViewState) {
        let { page, login, limit, sortFields }: ViewState = this.state;
        if ((prevState.page !== page || prevState.limit !== limit || this.areEqual(sortFields, prevState.sortFields) === false) && login) {
            let cs: ChangeSet[] = await this.props.api.getData(login.token, {
                pagination: { page: page, limit: limit },
                sort: sortFields
            });

            if (cs.length > 0) {
                this.setState({ changeSets: cs });
            } else {

            }
        }
    }

    render(): JSX.Element {
        let { login, changeSets, page, limit, sortFields }: ViewState = this.state;
        return (<div>
            {changeSets && changeSets.length > 0 &&
                <div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th><Button onClick={() => {
                                    let sfi: number = sortFields.findIndex((sf: ApiSort) => sf.propName === nameof<ChangeSet>('entityName'));
                                    if (sfi === -1) {
                                        let sfl: ApiSort[] = [...sortFields];
                                        sfl.push({ propName: nameof<ChangeSet>('entityName'), isAsc: true });
                                        this.setState({ sortFields: sfl });
                                    } else {
                                        let sfl: ApiSort[] = [...sortFields];
                                        sfl[sfi].isAsc = !sfl[sfi].isAsc;
                                        this.setState({ sortFields: sfl });
                                    }
                                }} variant='link'>Name</Button></th>
                                <th>IsDeleted</th>
                                <th>Form</th>
                            </tr>
                        </thead>
                        <tbody>
                            {changeSets.map((changeSet: ChangeSet, index: number) =>
                                <tr key={'cs' + (page * limit + index)}>
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    <td>{changeSet.name}</td>
                                    <td>{changeSet.isDeleted}</td>
                                    <td>{changeSet.forms && changeSet.forms.length > 0 && changeSet.forms[0].name}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className={styles.inline}>
                        <Dropdown className={styles.left}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {limit} items per page
                        </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => { this.setState({ limit: 10 }) }}>10</Dropdown.Item>
                                <Dropdown.Item onClick={() => { this.setState({ limit: 20 }) }}>20</Dropdown.Item>
                                <Dropdown.Item onClick={() => { this.setState({ limit: 50 }) }}>50</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <div className={styles.container}>
                            <Button disabled={page < 2} variant='link' onClick={() => { this.setState({ page: page - 1 }) }}>{'<'}</Button>
                            <span>Page {page}</span>
                            <Button disabled={changeSets.length !== limit} variant='link' onClick={() => { this.setState({ page: page + 1 }) }}>{'>'}</Button>
                        </div>
                    </div>
                </div>
            }
        </div>);
    }
}
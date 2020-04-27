import React from "react";
import Api from "../../dataaccess/Api";
import { ChangeSet } from "../../model/ChangeSet";
import { Table, Button, Dropdown, Form } from 'react-bootstrap';
import styles from './View.module.scss';
import { ApiSort } from "../../dataaccess/ApiOptions";
import { nameof } from "../../model/Util";
import _ from 'lodash';
import { areEqual } from "../../core/Util";

interface ViewState {
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
        this.state = {
            changeSets: null,
            page: 1,
            limit: 10,
            sortFields: []
        };
    }

    async componentDidMount() {
        let { api }: ViewProps = this.props;

        let cs: ChangeSet[] = await api.getData({
            pagination: { page: this.state.page, limit: this.state.limit },
            sort: [{ propName: nameof<ChangeSet>('name'), isAsc: true }]
        });

        if (cs.length > 0) {
            this.setState({ changeSets: cs });
        } else {
            // error handling
        }
    }

    private onSort(fieldName: string): void {
        let { sortFields }: ViewState = this.state
        let sfIndex: number = sortFields.findIndex((sf: ApiSort) => sf.propName === fieldName);
        if (sfIndex === -1) {
            let sfl: ApiSort[] = [...sortFields];
            sfl.push({ propName: fieldName, isAsc: false });
            this.setState({ sortFields: sfl });
        } else {
            let sfl: ApiSort[] = _.cloneDeep(sortFields);
            sfl[sfIndex].isAsc = !sfl[sfIndex].isAsc;
            this.setState({ sortFields: sfl });
        }
    }

    async componentDidUpdate(prevProps: ViewProps, prevState: ViewState) {
        let { page, limit, sortFields }: ViewState = this.state;
        if ((prevState.page !== page || prevState.limit !== limit || areEqual(sortFields, prevState.sortFields) === false)) {
            let cs: ChangeSet[] = await this.props.api.getData({
                pagination: { page, limit },
                sort: sortFields
            });

            if (cs.length > 0) {
                this.setState({ changeSets: cs });
            } else {

            }
        }
    }

    render(): JSX.Element {
        let { changeSets, page, limit }: ViewState = this.state;
        return (<div>
            {changeSets && changeSets.length > 0 &&
                <div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th><Button onClick={() => { this.onSort(nameof<ChangeSet>('name')); }} variant='link'>Name</Button></th>
                                <th style={{ width: '80px' }}><Button onClick={() => { this.onSort(nameof<ChangeSet>('isDeleted')); }} variant='link'>IsDeleted</Button></th>
                                <th><Button onClick={() => { this.onSort(nameof<ChangeSet>('forms')); }} variant='link'>Form</Button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {changeSets.map((changeSet: ChangeSet, index: number) =>
                                <tr key={'cs' + (page * limit + index)}>
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    <td>{changeSet.name}</td>
                                    <td><Form.Check readOnly type='checkbox' checked={changeSet.isDeleted}></Form.Check></td>
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
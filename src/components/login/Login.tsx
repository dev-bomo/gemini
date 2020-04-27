import React, { ChangeEvent } from "react";
import styles from './Login.module.scss';
import Api from "../../dataaccess/Api";

interface LoginState {
    username: string;
    password: string;
    errorMessage: string | null;
}

interface LoginProps {
    api: Api;
    onLogin: () => void;
}

export default class Login extends React.Component<LoginProps, LoginState> {

    constructor(props: LoginProps) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.state = {
            username: 'UsernameFull',
            password: 'full',
            errorMessage: null
        }
    }

    render(): JSX.Element {
        let { username, password, errorMessage }: LoginState = this.state;
        return (
            <div className={styles.authWrapper}>
                <div className={styles.authInner}>
                    <div>
                        <h3>Sign In</h3>

                        <div>
                            <label>Username</label>
                            <input type="email" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                this.setState({ username: e.target.value })
                            } className="form-control" placeholder="Enter user name" />
                        </div>

                        <div>
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                this.setState({ password: e.target.value })
                            } className="form-control" placeholder="Enter password" />
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                            </div>
                        </div>

                        <button type="submit" onClick={this.onLogin} className="btn btn-primary btn-block">Submit</button>
                        {errorMessage &&
                            <div style={{ color: 'red' }}>{errorMessage}</div>}
                    </div>
                </div>
            </div>);
    }

    private async onLogin(): Promise<void> {
        let { username: email, password }: LoginState = this.state;
        this.props.api.login(email, password).then(() => {
            this.props.onLogin();
        }).catch((e: Error) => {
            this.setState({ errorMessage: e.message });
        });
    }
}
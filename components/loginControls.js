'use strict';

class LoginControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (this.props.user){
            const username = this.props.user.data.login;

            return React.createElement(
                'div',
                {
                    className: ''
                },
                [
                    /*React.createElement(
                        'div',
                        {
                            id: 'UserName',
                            className: '',
                        },
                        'Logged in as: ' + username
                    ),*/
                    React.createElement(
                        'button',
                        {
                            id: 'LogoutButton',
                            className: 'button is-link',
                            onClick: this.props.logout
                        },
                        [
                            `Logout from ${username}`,
                            React.createElement('i', {className:'fab fa-github fa-lg'}, '')
                        ]
                    )
                ]
            );

        }else{
            return React.createElement(
                'button',
                {
                    id: 'LoginButton',
                    className: 'button is-link',
                    onClick: this.props.login
                },
                [
                    'Login',
                    React.createElement('i', {className:'fab fa-github fa-lg'}, '')
                ]
            );
        }
    }
}

export default LoginControls;

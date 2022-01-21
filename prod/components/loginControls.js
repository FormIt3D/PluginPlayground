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
                React.createElement(
                    'button',
                    {
                        id: 'LogoutButton',
                        className: 'button is-link',
                        onClick: this.props.logout
                    },
                    [
                        React.createElement(
                            'span',
                            {
                                key: 'LogoutSpan'
                            },
                            `Logout from ${username}`
                        ),
                        React.createElement('i', {key: 'LogoutIcon', className:'fab fa-github fa-lg'}, '')
                    ]
                )
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
                    React.createElement(
                        'span',
                        {
                            key: 'LoginSpan'
                        },
                        `Login`
                    ),
                    React.createElement('i', {key: 'LoginIcon', className:'fab fa-github fa-lg'}, '')
                ]
            );
        }
    }
}

export default LoginControls;

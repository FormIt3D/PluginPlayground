'use strict';

class MainControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const playButton = React.createElement('a',
            {
                onClick: () => {
                    this.props.run();
                }
            },
            React.createElement('i', {className:'material-icons'}, 'play_arrow')
        );

        const editButton = React.createElement('a',
            {
                onClick: () => {
                    this.props.editRepository();
                }
            },
            React.createElement('i', {className:'material-icons'}, 'mode_edit')
        );

        const controls = React.createElement(
            'div',
            {
                className: ''
            },
            [
                editButton,
                playButton,
            ]
        );

        return React.createElement(
            'div',
            {
                className: ''
            },
            [
                controls
            ]
        );
    }
}

export default MainControls;

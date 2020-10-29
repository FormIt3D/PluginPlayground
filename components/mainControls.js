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
                },
                title:'Play'
            },
            React.createElement('i', {className:'material-icons'}, 'play_arrow')
        );

        const editButton = React.createElement('a',
            {
                onClick: () => {
                    this.props.editRepository();
                },
                title:'Edit'
            },
            React.createElement('i', {className:'material-icons'}, 'mode_edit')
        );

        const saveButton = React.createElement('a',
            {
                onClick: () => {
                    this.props.saveToRepository();
                },
                title:'Save'
            },
            React.createElement('i', {className:'material-icons'}, 'save')
        );

        const controls = React.createElement(
            'div',
            {
                className: ''
            },
            [
                editButton,
                playButton,
                this.props.isRepoLoaded ? saveButton : null
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

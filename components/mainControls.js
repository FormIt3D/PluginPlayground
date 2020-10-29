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
            React.createElement('i', {className:'fas fa-play'}, '')
        );

        const editButton = React.createElement('a',
            {
                onClick: () => {
                    this.props.editRepository();
                },
                title:'Edit'
            },
            React.createElement('i', {className:'fas fa-edit'}, '')
        );

        const saveButton = React.createElement('a',
            {
                onClick: () => {
                    this.props.saveToRepository();
                },
                title:'Save'
            },
            React.createElement('i', {className:'fas fa-save'}, '')
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

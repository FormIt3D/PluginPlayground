'use strict';

import RepositoryOption from "./repositoryOption.js";

class GithubControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentlyLoadedRepo: '',
            newProjectName: ''
        };
    }

    render() {

        const allRepoOptions = this.props.repos.map((repoData) => {
            return React.createElement(RepositoryOption, {
                repoData,
                loadRepository: (repoData, forceRefresh) => {
                    this.setState({
                        currentlyLoadedRepo: repoData.name
                    });

                    this.props.loadRepository(repoData, forceRefresh);
                },
                saveToRepository: this.props.saveToRepository,
                run: this.props.run,
                isCurrentlyLoaded: this.state.currentlyLoadedRepo === repoData.name,
            }, null);
        });

        const input =  React.createElement('input', {
            className: 'input',
            type: 'text',
            placeholder: 'New project name',
            value: this.state.newProjectName,
            onChange: (e) => {
                const value = e.target.value;

                console.log(value);

                this.setState({newProjectName: value})
            }
        });

        const createRepo = React.createElement('div',
            {
                id:'CreateControls'
            },
            [
                input,
                React.createElement('a',
                    {
                        onClick: () => {
                            if (this.state.newProjectName){
                                this.props.createNewRepository(this.state.newProjectName);
                            }
                        }
                    },
                    React.createElement('i', {className:'material-icons'}, 'add')
                ),
            ]
        );

        const dropdown =  React.createElement(
            'div',
            {
                id: 'ProjectDD',
                className: 'dropdown is-hoverable'
            },
            [
                React.createElement(
                    'div',
                    {
                        className: 'dropdown-trigger'
                    },
                    React.createElement(
                        'button',
                        {
                            className: 'button'
                        },
                        [
                            React.createElement(
                                'span',
                                {
                                },
                                this.state.currentlyLoadedRepo || 'Open existing project'
                            ),
                            React.createElement(
                                'span',
                                {
                                    className: 'icon is-small'
                                },
                                React.createElement('i', {className:'material-icons'}, 'expand_more')
                            ),
                        ]
                    )
                ),
                React.createElement(
                    'div',
                    {
                        className: 'dropdown-menu'
                    },
                    React.createElement(
                        'div',
                        {
                            className: 'dropdown-content'
                        },
                        allRepoOptions
                    )
                ),
            ]
        );

        const refreshButton = React.createElement('a',
            {
                onClick: () => {
                    this.props.refreshRepository();
                },
                title:'Refresh'
            },
            React.createElement('i', {className:'material-icons'}, 'refresh')
        );

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

        const githubButton = React.createElement('a',
            {
                onClick: () => {
                    this.props.openGithub();
                },
                title:'Visit github project'
            },
            React.createElement('i', {className:'material-icons'}, 'cloud')
        );

        const controls = React.createElement(
            'div',
            {
                id:'RepoControls',
                className: ''
            },
            [
                //editButton,
                saveButton,
                refreshButton,
                //playButton,
                githubButton
            ]
        );

        return React.createElement(
            'div',
            {
                className: '',
                id: 'GitHucContent'
            },
            [
                createRepo,
                dropdown,
                controls,
            ]
        );
    }
}

export default GithubControls;

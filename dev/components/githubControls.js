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

        const allRepoOptions = this.props.repos.length ?
            this.props.repos.map((repoData, i) => {
                return React.createElement(RepositoryOption, {
                    key: `Option-${i}`,
                    repoData,
                    loadRepository: (repoData, forceRefresh) => {
                        this.setState({
                            currentlyLoadedRepo: repoData
                        });

                        this.props.loadRepository(repoData, forceRefresh);
                    },
                    saveToRepository: this.props.saveToRepository,
                    run: this.props.run,
                    isCurrentlyLoaded: this.state.currentlyLoadedRepo.name === repoData.name,
                    openGithub: this.props.openGithub,
                    publishToPages: this.props.publishToPages,
                    installPlugin: this.props.installPlugin
                }, null);
            })
            : React.createElement('div', 
                    {
                        className:'noProjects'
                    },
                    'No projects found. Please create a first project.'
                );

        const input =  React.createElement('input', {
            key: 'NewProjectInput',
            className: 'input',
            type: 'text',
            placeholder: 'New project name',
            value: this.state.newProjectName,
            onChange: (e) => {
                const value = e.target.value;

                //console.log(value);

                this.setState({newProjectName: value})
            }
        });

        const createRepo = React.createElement('div',
            {
                id:'CreateControls',
                key: 'CreateControls',
            },
            [
                input,
                React.createElement('a',
                    {
                        key: 'AddNewProject',
                        onClick: async () => {
                            if (this.state.newProjectName){
                                this.setState({
                                    isCreatingNewRepo: true,
                                    newProjectName: ''
                                });

                                await this.props.createNewRepository(this.state.newProjectName);
                                this.setState({
                                    isCreatingNewRepo: false
                                });
                            }
                        },
                        title:'Create'
                    },
                    React.createElement('i', {key: 'CreateControlsAddIcon', className:'fas fa-plus-circle'}, '')
                ),
            ]
        );

        const loader = React.createElement(
            'div',
            {
                className: 'control is-loading'
            },
            null
        );

        const refreshReposButton = React.createElement('a',
            {
                id: 'RefreshReposButton',
                key: 'RefreshReposButton',
                onClick: this.props.refreshReposList,
                title:'Refresh project list'
            },
            React.createElement('i', {className:'fas fa-sync-alt'}, '')
        );

        const dropdown = React.createElement(
            'div',
            {
                id: 'ProjectDD',
                key: 'ProjectDD',
                className: 'dropdown is-hoverable'
            },
            [
                React.createElement(
                    'div',
                    {
                        key: 'DropdownTrigger',
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
                                    key: 'ProjectSelection',
                                },
                                this.state.currentlyLoadedRepo && this.state.currentlyLoadedRepo.name || 'Open a project',

                            ),
                            React.createElement(
                                'span',
                                {
                                    key: 'ProjectSelectionIcon',
                                    className: 'icon is-small'
                                },
                                React.createElement('i', {className:'fas fa-caret-down'}, '')
                            ),
                            refreshReposButton
                        ]
                    )
                ),
                React.createElement(
                    'div',
                    {
                        key: 'DropdownMenu',
                        className: 'dropdown-menu'
                    },
                    React.createElement(
                        'div',
                        {
                            key: 'DropdownContent',
                            className: 'dropdown-content'
                        },
                        allRepoOptions
                    )
                ),
            ]
        );

        return React.createElement(
            'div',
            {
                className: '',
                id: 'GitHubContent'
            },
            [
                createRepo,
                this.state.isCreatingNewRepo ? loader : dropdown
            ]
        );
    }
}

export default GithubControls;

'use strict';

import Repository from "./repository.js";

class RepositoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentlyLoadedRepo: localStorage.getItem('currentRepoLoaded') || '',
            newProjectName: ''
        };
    }

    render() {

        const allRepoComponents = this.props.repos.map((repoData) => {
            return React.createElement(Repository, {
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
            type: 'text',
            placeholder: 'New project name',
            value: this.state.newProjectName,
            onChange: (e) => {
                const value = e.target.value;

                console.log(value);

                this.setState({newProjectName: value})
            }
        });

        const createRepo = React.createElement('li',
            {key: 'createNew'},
            [
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
                input
            ]
        );

        return React.createElement(
            'ul', //component
            {}, //props
            allRepoComponents.concat(createRepo) //children
        );
    }
}

export default RepositoryList;

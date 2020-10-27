'use strict';

//repoData structure example:
/*archive_url: "https://api.github.com/repos/mattributes/mattOctokitTest/{archive_format}{/ref}"
archived: false
assignees_url: "https://api.github.com/repos/mattributes/mattOctokitTest/assignees{/user}"
blobs_url: "https://api.github.com/repos/mattributes/mattOctokitTest/git/blobs{/sha}"
branches_url: "https://api.github.com/repos/mattributes/mattOctokitTest/branches{/branch}"
clone_url: "https://github.com/mattributes/mattOctokitTest.git"
collaborators_url: "https://api.github.com/repos/mattributes/mattOctokitTest/collaborators{/collaborator}"
comments_url: "https://api.github.com/repos/mattributes/mattOctokitTest/comments{/number}"
commits_url: "https://api.github.com/repos/mattributes/mattOctokitTest/commits{/sha}"
compare_url: "https://api.github.com/repos/mattributes/mattOctokitTest/compare/{base}...{head}"
contents_url: "https://api.github.com/repos/mattributes/mattOctokitTest/contents/{+path}"
contributors_url: "https://api.github.com/repos/mattributes/mattOctokitTest/contributors"
created_at: "2020-10-16T21:36:15Z"
default_branch: "main"
deployments_url: "https://api.github.com/repos/mattributes/mattOctokitTest/deployments"
description: "testing!!!!!!!!!!!"
disabled: false
downloads_url: "https://api.github.com/repos/mattributes/mattOctokitTest/downloads"
events_url: "https://api.github.com/repos/mattributes/mattOctokitTest/events"
fork: false
forks: 0
forks_count: 0
forks_url: "https://api.github.com/repos/mattributes/mattOctokitTest/forks"
full_name: "mattributes/mattOctokitTest"
git_commits_url: "https://api.github.com/repos/mattributes/mattOctokitTest/git/commits{/sha}"
git_refs_url: "https://api.github.com/repos/mattributes/mattOctokitTest/git/refs{/sha}"
git_tags_url: "https://api.github.com/repos/mattributes/mattOctokitTest/git/tags{/sha}"
git_url: "git://github.com/mattributes/mattOctokitTest.git"
has_downloads: true
has_issues: true
has_pages: false
has_projects: true
has_wiki: true
homepage: ""
hooks_url: "https://api.github.com/repos/mattributes/mattOctokitTest/hooks"
html_url: "https://github.com/mattributes/mattOctokitTest"
id: 123xxxxxxx
issue_comment_url: "https://api.github.com/repos/mattributes/mattOctokitTest/issues/comments{/number}"
issue_events_url: "https://api.github.com/repos/mattributes/mattOctokitTest/issues/events{/number}"
issues_url: "https://api.github.com/repos/mattributes/mattOctokitTest/issues{/number}"
keys_url: "https://api.github.com/repos/mattributes/mattOctokitTest/keys{/key_id}"
labels_url: "https://api.github.com/repos/mattributes/mattOctokitTest/labels{/name}"
language: "HTML"
languages_url: "https://api.github.com/repos/mattributes/mattOctokitTest/languages"
license: null
merges_url: "https://api.github.com/repos/mattributes/mattOctokitTest/merges"
milestones_url: "https://api.github.com/repos/mattributes/mattOctokitTest/milestones{/number}"
mirror_url: null
name: "mattOctokitTest"
node_id: "xxxxxxxx="
notifications_url: "https://api.github.com/repos/mattributes/mattOctokitTest/notifications{?since,all,participating}"
open_issues: 0
open_issues_count: 0
owner: {login: "mattributes", id: xxxxx, node_id: "xxxx=", avatar_url: "https://avatars3.githubusercontent.com/u/1610069?v=4", gravatar_id: "", …}
permissions: {admin: true, push: true, pull: true}
private: false
pulls_url: "https://api.github.com/repos/mattributes/mattOctokitTest/pulls{/number}"
pushed_at: "2020-10-19T20:42:47Z"
releases_url: "https://api.github.com/repos/mattributes/mattOctokitTest/releases{/id}"
size: 1
ssh_url: "git@github.com:mattributes/mattOctokitTest.git"
stargazers_count: 0
stargazers_url: "https://api.github.com/repos/mattributes/mattOctokitTest/stargazers"
statuses_url: "https://api.github.com/repos/mattributes/mattOctokitTest/statuses/{sha}"
subscribers_url: "https://api.github.com/repos/mattributes/mattOctokitTest/subscribers"
subscription_url: "https://api.github.com/repos/mattributes/mattOctokitTest/subscription"
svn_url: "https://github.com/mattributes/mattOctokitTest"
tags_url: "https://api.github.com/repos/mattributes/mattOctokitTest/tags"
teams_url: "https://api.github.com/repos/mattributes/mattOctokitTest/teams"
topics: ["formit-plugin"]
trees_url: "https://api.github.com/repos/mattributes/mattOctokitTest/git/trees{/sha}"
updated_at: "2020-10-20T17:41:58Z"
url: "https://api.github.com/repos/mattributes/mattOctokitTest"
watchers: 0
watchers_count: 0*/

class Repository extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        /*if (this.state.open) {
            return 'You liked this.';
        }*/

        const refreshButton = React.createElement('a',
            {
                key: this.props.repoData.name + 'refresh',
                onClick: () => {
                    this.props.loadRepository(this.props.repoData, true /*force refresh*/);
                    this.setState({/*TODO*/});
                }
            },
            React.createElement('i', {className:'material-icons'}, 'refresh')
        );

        const playButton = React.createElement('a',
            {
                key: this.props.repoData.name + 'play',
                onClick: () => {
                    this.props.run();
                    this.setState({});
                }
            },
            React.createElement('i', {className:'material-icons'}, 'play_arrow')
        );

        return (
            React.createElement('li',
                {key: this.props.repoData.name + 'li'},
                [
                    React.createElement('a',
                        {
                            key: this.props.repoData.name + 'edit',
                            onClick: () => {
                                this.props.loadRepository(this.props.repoData);
                                this.setState({/*TODO*/});
                            }
                        },
                        React.createElement('i', {className:'material-icons'}, 'mode_edit')
                    ),
                    React.createElement('a',
                        {
                            key: this.props.repoData.name + 'save',
                            onClick: () => {
                                this.props.saveToRepository(this.props.repoData);
                                this.setState({/*TODO*/});
                            }
                        },
                        React.createElement('i', {className:'material-icons'}, 'save')
                    ),
                    React.createElement('a',
                    {
                        key: this.props.repoData.name + 'cloud',
                        onClick: () => {
                            window.open(this.props.repoData.html_url);
                        }
                    },
                    React.createElement('i', {className:'material-icons'}, 'cloud')
                ),
                    this.props.isCurrentlyLoaded ? playButton : null,
                    this.props.isCurrentlyLoaded ? refreshButton : null,
                    this.props.repoData.name
                ]
            )
        )
    }
}

export default Repository;

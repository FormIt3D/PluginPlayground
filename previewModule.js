import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import GithubControls from "./components/githubControls.js";
import MainControls from "./components/mainControls.js";
import LoginControls from "./components/loginControls.js";
import defaultRepoValues from "./defaultValues.js";

class PreviewModule{
    constructor(){
        this.loginCheck();
        this.addIntervals();
        this.addEventListeners();

        this.currentlyLoadedRepoData = undefined;

        this.renderMainControls();

        this.currentUsername;
    }

    compileAndRun(){
        const htmlContent = localStorage.getItem('currentHTMLValue') || defaultRepoValues.html;
        const cssContent = localStorage.getItem('currentCSSValue') || defaultRepoValues.css;
        const scriptContent = localStorage.getItem('currentJSValue') || defaultRepoValues.script;

        const resultContainer = document.getElementById("Result");

        while (resultContainer.hasChildNodes()) {
            resultContainer.removeChild(resultContainer.lastChild);
        }

        resultContainer.innerHTML = htmlContent;

        var style = document.createElement("style");
        style.appendChild(document.createTextNode(cssContent));
        resultContainer.appendChild(style);

        var script = document.createElement("script");
        script.innerHTML = `(async function() { ${scriptContent } })()`;
        resultContainer.appendChild(script);
    }

    clearRun(){
        const resultContainer = document.getElementById("Result");

        while (resultContainer.hasChildNodes()) {
            resultContainer.removeChild(resultContainer.lastChild);
        }

        resultContainer.innerHTML = `<div class='pluginMessage'>Plugin goes here. Press play<i class='material-icons'>play_arrow</i>!</div>`
    }

    addIntervals(){
        /*setInterval(() => {
            const shouldRun = localStorage.getItem('Run') === 'true';

            if (shouldRun){
                localStorage.setItem('Run', 'false');

                this.compileAndRun();
            }
        },1000)*/
    }

    loginCheck(){
        let token = localStorage.getItem('token');
        let tokenParams = new URLSearchParams(token);
        let access_token;

        if (tokenParams.has("access_token")){
            access_token = tokenParams.get("access_token");
            this.updateLoginState(access_token);
        }else{
            const tokenInterval = setInterval(() => {
                token = localStorage.getItem('token');
                tokenParams = new URLSearchParams(token);

                if (tokenParams.has("access_token")){
                    access_token = tokenParams.get("access_token");
                }

                if (access_token){
                    clearInterval(tokenInterval);
                    this.updateLoginState(access_token);
                }
            },1000)

            this.updateLoginState();
        }
    }

    async updateLoginState(access_token){
        let user = '';

        if (access_token){
            document.getElementById('GithubRoot').style.display = "block";
            user = await this.getUserData(access_token);

            this.currentUsername = user.data.login;
            this.discoverRepos(user);
        }else{
            document.getElementById('GithubRoot').style.display = "none";
        }

        const domContainer = document.getElementById('LoginControls');
        const loginControls = React.createElement(LoginControls, {
            user,
            login: this.login.bind(this),
            logout: this.logout.bind(this)
        }, null);

        ReactDOM.render(loginControls, domContainer);
    }

    login(){
        let clientId;
        
        if (window.location.host.indexOf("localhost") > -1){
            clientId = '87e4a10e937d695d312d'; //local
        }else{
            clientId = '9fcdf9d7f7dacbb41a97';
        }

        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;

        if (window.location.href.indexOf("?Web")  > -1){
            const loginWindow = window.open(url, 'Login to GitHub', "height=650,width=360");
        }else{
            window.location.href = url;
        }
    }

    logout(){
        localStorage.setItem('token', '');
        this.loginCheck();
    }

    addEventListeners(){
        /*document.getElementById("EditCode").addEventListener("click", () => {
            FormItInterface.CallMethod("PluginPlayground.ShowDialog");
        });

        document.getElementById("Login").addEventListener("click", () => {
            alert('here')

            const clientId = '697e57494c9b5227b28c';
            const url = `https://github.com/login/oauth/authorize?client_id=${clientId}`;

            const loginWindow = window.open(url, "Github login for Formit");

            console.log(window.open);

            //TODO windows only.
            window.location.href = url;
        });*/
    }

    renderMainControls(){
        const domContainer = document.getElementById('MainControls');
        const mainControls = React.createElement(MainControls, {
            editRepository: this.editRepository.bind(this),
            run: this.compileAndRun.bind(this),
            isRepoLoaded: this.currentlyLoadedRepoData,
            saveToRepository: this.compileAndRun.bind(this),
        }, null);

        ReactDOM.render(mainControls, domContainer);
    }

    renderRepos(repoList){
        const domContainer = document.getElementById('GithubRoot');
        const githubControls = React.createElement(GithubControls, {
            repos: repoList,
            editRepository: this.editRepository.bind(this),
            loadRepository: this.loadRepository.bind(this),
            saveToRepository: this.saveToRepository.bind(this),
            refreshRepository: this.refreshRepository.bind(this),
            refreshReposList: this.discoverRepos.bind(this),
            publishToPages: this.publishToPages.bind(this),
            installPlugin: this.installPlugin.bind(this),
            openGithub: this.openGithub.bind(this),
            run: this.compileAndRun.bind(this),
            createNewRepository: this.createNewRepository.bind(this)
        }, null);

        ReactDOM.render(githubControls, domContainer);
    }

    installPlugin(){
        const repoData = this.currentlyLoadedRepoData;

        //alert('will install')

        //this.currentlyLoadedRepo.pagesHtmlUrl
        FormItInterface.CallMethod("FormIt.UninstallPlugin", repoData.pagesHtmlUrl);
        FormItInterface.CallMethod("FormIt.LoadPlugin", repoData.pagesHtmlUrl);
    }

    openGithub(repoData){
        //const repoData = this.currentlyLoadedRepoData;

        //TODO probably need to add condition here for windows.
        window.open(repoData.html_url);
    }

    refreshRepository(){
        const repoData = this.currentlyLoadedRepoData;
        this.loadRepository(repoData);
    }

    async publishToPages(repoData){
        //const repoData = this.currentlyLoadedRepoData;

        const result = await this.octokit.repos.createPagesSite({
            owner: repoData.owner.login,
            repo: repoData.name,
            source: {
                branch: "main"
            } //"main", //source,
            //"source.branch": "main" //source.branch
        });

        return result;
    }

    async saveToRepository(){
        const repoData = this.currentlyLoadedRepoData;

        const htmlContent = localStorage.getItem('currentHTMLValue');
        const cssContent = localStorage.getItem('currentCSSValue');
        const scriptContent = localStorage.getItem('currentJSValue');

        const htmlSha = localStorage.getItem('currentHTMLsha');
        const cssSha = localStorage.getItem('currentCSSsha');
        const scriptSha = localStorage.getItem('currentScriptsha');

        const encodedHtml = btoa(htmlContent);
        const encodedCss = btoa(cssContent);
        const encodedScript = btoa(scriptContent);

        const htmlresult = await this.octokit.repos.createOrUpdateFileContents({
            owner: repoData.owner.login,
            repo: repoData.name,
            message: "Update from plugin",
            path: 'plugin.html',
            content:encodedHtml,
            sha: htmlSha
        });

        localStorage.setItem('currentHTMLsha', htmlresult.data.content.sha);

        console.log("schaefm html result", htmlresult);

        const cssresult = await this.octokit.repos.createOrUpdateFileContents({
            owner: repoData.owner.login,
            repo: repoData.name,
            message: "Update from plugin",
            path: 'plugin.css',
            content:encodedCss,
            sha: cssSha
        });

        localStorage.setItem('currentCSSsha', cssresult.data.content.sha);

        const scriptresult = await this.octokit.repos.createOrUpdateFileContents({
            owner: repoData.owner.login,
            repo: repoData.name,
            message: "Update from plugin",
            path: 'plugin.js',
            content:encodedScript,
            sha: scriptSha
        });

        localStorage.setItem('currentScriptsha', scriptresult.data.content.sha);
    }

    editRepository(){
        FormItInterface.CallMethod("PluginPlayground.ShowDialog");
    }

    async loadRepository(repoData){
        this.clearRun();
        this.currentlyLoadedRepoData = repoData;

        console.log("will load content for this repo: ", repoData);

        let htmlContentPath;
        let cssContentPath;
        let scriptContentPath;

        let htmlSha;
        let cssSha;
        let scriptSha;

        const allFiles = await this.octokit.repos.getContent({
            owner: repoData.owner.login,
            repo: repoData.name
        });
        console.log(allFiles)

        allFiles.data.forEach((file) => {
            switch (file.name){
                case "plugin.html":
                    htmlContentPath = file.download_url;
                    htmlSha = file.sha;
                    break;
                case "plugin.css":
                    cssContentPath = file.download_url;
                    cssSha = file.sha;
                    break;
                case "plugin.js":
                    scriptContentPath = file.download_url;
                    scriptSha = file.sha;
                    break;
            }
        });

        localStorage.setItem('currentHTMLsha', htmlSha);
        localStorage.setItem('currentCSSsha', cssSha);
        localStorage.setItem('currentScriptsha', scriptSha);

        Promise.all([
            fetch(htmlContentPath),
            fetch(cssContentPath),
            fetch(scriptContentPath)
        ]).then(async (responses) =>{
            console.log(responses);

            //not yet 100% sure the order is guaranteed.
            const htmlContent = await responses[0].text();
            const cssContent = await responses[1].text();
            const scriptContent = await responses[2].text();

            localStorage.setItem('currentHTMLValue', htmlContent);
            localStorage.setItem('currentCSSValue', cssContent);
            localStorage.setItem('currentJSValue', scriptContent);

            this.renderMainControls();

            //FormItInterface.CallMethod("PluginPlayground.ShowDialog");
        });
    }

    async createNewRepository(newRepoName) {
        const user = await this.octokit.users.getAuthenticated();
        const owner = user.data.login;
        const repo = newRepoName;

        await this.octokit.repos.createForAuthenticatedUser({
            name: repo,
            description: "Created from FormIt Plugin Playground",
            auto_init: true
        });

        await this.octokit.repos.replaceAllTopics({
            owner,
            repo,
            names: ["formit-plugin"]
        });

        const encodedHtml = btoa(defaultRepoValues.html);
        const encodedCss = btoa(defaultRepoValues.css);
        const encodedScript = btoa(defaultRepoValues.script);
        const encodedManifest = btoa(defaultRepoValues.manifest);

        const htmlRes = await this.octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            message: "Adding an html",
            path: 'plugin.html',
            content:encodedHtml,
        });

        const cssRes = await this.octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            message: "Adding css",
            path: 'plugin.css',
            content:encodedCss,
        });

        const scriptRes = await this.octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            message: "Adding js",
            path: 'plugin.js',
            content:encodedScript,
        });

        const manifestRes = await this.octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            message: "Adding manifest",
            path: 'manifest.json',
            content:encodedManifest,
        });

        const imageRes = await this.octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            message: "Adding image",
            path: 'plugin.png',
            content:defaultRepoValues.png,
        });

        this.discoverRepos();
    }

    async getUserData(token){
        try{
            this.octokit = new Octokit({
                auth: token,
                log: console,
                previews: ["mercy-preview"],
            });

            return await this.octokit.users.getAuthenticated();
        }catch(e){
            console.log(e);
        }
    }

    //TODO error handling.
    async discoverRepos(){

        try{
            const repoListResult = await this.octokit.repos.listForUser({
                username: this.currentUsername,
            });

            console.log(repoListResult);

            const formitPluginRepos = repoListResult.data.filter((repo) => {
                return repo.topics.indexOf('formit-plugin') > -1
            });

            console.log(formitPluginRepos);

            const reposPromises = formitPluginRepos.map(async (repo) => {
                try{
                    const pagesResult = await this.octokit.repos.getPages({
                        owner: repo.owner.login,
                        repo: repo.name,
                    });

                    if (pagesResult.data){
                        repo.pagesHtmlUrl = pagesResult.data.html_url;
                    }
                }catch(e){
                    //TODO?
                }

                return repo;
            });

            Promise.all(reposPromises).then((repos) => {
                this.renderRepos(repos);
            }); 

        }catch(e){
            console.log(e);
        }

        //TODO
        //*** search
        /*const result = await octokit.search.repos({
            q: 'topic:formit-plugin',
        });

            console.log(result);*/
    }
}

new PreviewModule();

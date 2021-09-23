import defaultRepoValues from "./defaultValues.js";

export default class EditorModule{
    constructor(){
        this.setupEditors();
        this.addEventListeners();
    }

    async setupEditors(){
        this.HTMLEditor = monaco.editor.create(document.getElementById('HTMLEditor'), {
            theme: 'vs-dark',
            language: 'html',
            automaticLayout: true
        });
        this.CSSEditor = monaco.editor.create(document.getElementById('CSSEditor'), {
            theme: 'vs-dark',
            language: 'css',
            automaticLayout: true
        });
        this.JSEditor = monaco.editor.create(document.getElementById('JSEditor'), {
            theme: 'vs-dark',
            language: 'FormItWSM',
            automaticLayout: true
        });

        const htmlContent = localStorage.getItem('currentHTMLValue') || defaultRepoValues.html;
        const cssContent = localStorage.getItem('currentCSSValue') || defaultRepoValues.css;
        const scriptContent = localStorage.getItem('currentJSValue') || defaultRepoValues.script;

        this.HTMLEditor.setValue(htmlContent);
        this.CSSEditor.setValue(cssContent);
        this.JSEditor.setValue(scriptContent);

        monaco.languages.register({ id: 'FormItWSM' });

        //27, javascript
        const javascriptLoader = await monaco.languages.getLanguages()[27].loader();

        monaco.languages.setMonarchTokensProvider('FormItWSM', javascriptLoader.language);

        try {
            const autocompleteURL = "https://formit3d.github.io/FormItExamplePlugins/docs/autocomplete.json",
                response = await fetch(autocompleteURL),
                autocompleteJSON = await response.json()

            // Set suggestions
            monaco.languages.registerCompletionItemProvider('FormItWSM', {
                provideCompletionItems() {
                    return {
                        suggestions: autocompleteJSON
                    }
                },
                triggerCharacters: [' ', '.'] //  Write the character that triggers the prompt , There can be multiple 
            });
        } catch(e) {
            console.error("Error fetching autocomplete suggestions!", e);
        }
    }

    addEventListeners(){
        const hideShowEditor = (editor) => {
            editor.getContainerDomNode().parentNode.style.display = editor.getContainerDomNode().parentNode.style.display === 'none'
                ? 'block' : 'none';
        }

        document.getElementById("HTMLButton").addEventListener("click", (e) => {
            e.target.classList.toggle("is-active");
            hideShowEditor(this.HTMLEditor);
        });

        document.getElementById("JSButton").addEventListener("click", (e) => {
            e.target.classList.toggle("is-active");
            hideShowEditor(this.JSEditor);
        });

        document.getElementById("CSSButton").addEventListener("click", (e) => {
            e.target.classList.toggle("is-active");
            hideShowEditor(this.CSSEditor);
        });

        /*document.getElementById("Run").addEventListener("click", () => {
            const htmlContent = this.HTMLEditor.getValue();
            const scriptContent = this.JSEditor.getValue();
            const cssContent = this.CSSEditor.getValue();

            localStorage.setItem('currentHTMLValue', htmlContent);
            localStorage.setItem('currentCSSValue', cssContent);
            localStorage.setItem('currentJSValue', scriptContent);

            localStorage.setItem('Run', 'true');
        });*/

        const startButton = document.getElementById("Start");
        const stopButton = document.getElementById("Stop");

        stopButton.style.display = "none";

        startButton.addEventListener("click", () => {
            startButton.style.display = "none";
            stopButton.style.display = "inline";

            FormItInterface.CallMethod("PluginPlayground.StartJournaling");
        });

        stopButton.addEventListener("click", () => {
            stopButton.style.display = "none";
            startButton.style.display = "inline";

            FormItInterface.CallMethod("PluginPlayground.StopJournaling", "", (res) => {
                this.cleanJournal(res);
            });
        });

        this.HTMLEditor.getModel().onDidChangeContent(() => {
            const content = this.HTMLEditor.getValue();
            localStorage.setItem('currentHTMLValue', content);
        });

        this.CSSEditor.getModel().onDidChangeContent(() => {
            const content = this.CSSEditor.getValue();
            localStorage.setItem('currentCSSValue', content);
        });

        this.JSEditor.getModel().onDidChangeContent(() => {
            const content = this.JSEditor.getValue();
            localStorage.setItem('currentJSValue', content);
        });
    }

    cleanJournal(journalRaw){
        //console.log(journalRaw);

        let encodedJournal = encodeURIComponent(journalRaw);

        encodedJournal = encodedJournal.replace('WSM.APILoadFromFile(mainHistID%2C%20%5C%22%2Ftmp%2Fjournal.dat%5C%22)%3B', '');
        encodedJournal = encodedJournal.replaceAll('FormIt.SectionPlanes.GetInstances()%3B%5Cn%20%20%20%20', '');
        encodedJournal = encodedJournal.replaceAll('FormIt.SectionPlanes.GetPlanes()%3B%5Cn%20%20%20%20', '');
        //encodedJournal = encodedJournal.replaceAll('WSM.APIUndoHistory(mainHistID%2C%20false%2C%20WSM.INVALID_ID)%3B%5Cn%20%20%20%20', '');
        //encodedJournal = encodedJournal.replaceAll('WSM.APIRedoHistory(mainHistID%2C%20WSM.INVALID_ID)%3B%5Cn%20%20%20%20', '');
        //console.log(encodedJournal)

        let journal = decodeURIComponent(encodedJournal);
        //console.log(journal);

        journal = journal.replaceAll('"','');
        journal =journal.replace('var result = true;', '');
        journal =journal.replace('return result;', '');
        journal =journal.replace('WSM.APIGetActiveHistory();', '0;');
        journal = journal.replace(/\\n/g, '\r\n');
        journal = journal.replace('function runtest', 'async function runJournal');
        journal = journal.replace(/(^[ \t]*\n)/gm, '');
        journal = journal.replaceAll('WSM.', 'await WSM.');
        journal = journal.replaceAll('FormIt.', 'await FormIt.');

        journal += '\r\n\r\nrunJournal();'

        if (window.confirm("Do you want to replace script with journal?")) { 
            this.JSEditor.setValue(journal, 1);
        }
    }
}

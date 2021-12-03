import defaultRepoValues from "./defaultValues.js";

function replaceAll(originalString, find, replace) {
    return originalString.replace(new RegExp(find, 'g'), replace);
};

class EditorModule{
    constructor(){
        this.setupEditors();
        this.addEventListeners();
    }

    setupEditors(){
        this.HTMLEditor = ace.edit("HTMLEditor");
        this.CSSEditor = ace.edit("CSSEditor");
        this.JSEditor = ace.edit("JSEditor");

        this.HTMLEditor.setTheme("ace/theme/monokai");
        this.CSSEditor.setTheme("ace/theme/monokai");
        this.JSEditor.setTheme("ace/theme/monokai");

        this.HTMLEditor.session.setMode("ace/mode/html");
        this.CSSEditor.session.setMode("ace/mode/css");
        this.JSEditor.session.setMode("ace/mode/javascript");

        this.HTMLEditor.session.setUseWorker(false);
        this.CSSEditor.session.setUseWorker(false);
        this.JSEditor.session.setUseWorker(false);

        const htmlContent = localStorage.getItem('currentHTMLValue') || defaultRepoValues.html;
        const cssContent = localStorage.getItem('currentCSSValue') || defaultRepoValues.css;
        const scriptContent = localStorage.getItem('currentJSValue') || defaultRepoValues.script;

        this.HTMLEditor.setValue(htmlContent, 1);
        this.CSSEditor.setValue(cssContent, 1);
        this.JSEditor.setValue(scriptContent, 1);

        const langTools = ace.require("ace/ext/language_tools");

        const testCompleter ={
            getCompletions: function(editor, session, pos, prefix, callback) {
                var completions = [];
                ["API1", "API2"].forEach(function(apiWord) {

                    completions.push({
                        value: apiWord,
                        meta: "this is a test tip",

                    });
                });
                callback(null, completions);
            }
        }

        langTools.addCompleter(testCompleter);

        this.JSEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
    }

    addEventListeners(){
        const hideShowEditor = (editor) => {
            console.log(editor.container.parentElement);
            editor.container.parentElement.style.display = editor.container.parentElement.style.display === 'none'
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

        this.HTMLEditor.session.on('change', () => {
            const content = this.HTMLEditor.getValue();
            localStorage.setItem('currentHTMLValue', content);
        });

        this.CSSEditor.session.on('change', () => {
            const content = this.CSSEditor.getValue();
            localStorage.setItem('currentCSSValue', content);
        });

        this.JSEditor.session.on('change', () => {
            const content = this.JSEditor.getValue();
            localStorage.setItem('currentJSValue', content);
        });
    }

    cleanJournal(journalRaw){
        let encodedJournal = encodeURIComponent(journalRaw);

        encodedJournal = encodedJournal.replace('WSM.APILoadFromFile(mainHistID%2C%20%5C%22.dat%5C%22)%3B', '');
        encodedJournal = replaceAll(encodedJournal, 'FormIt.SectionPlanes.GetInstances()%3B%5Cn%20%20%20%20', '');
        encodedJournal = replaceAll(encodedJournal, 'FormIt.SectionPlanes.GetPlanes()%3B%5Cn%20%20%20%20', '');
        //encodedJournal = encodedJournal.replaceAll('WSM.APIUndoHistory(mainHistID%2C%20false%2C%20WSM.INVALID_ID)%3B%5Cn%20%20%20%20', '');
        //encodedJournal = encodedJournal.replaceAll('WSM.APIRedoHistory(mainHistID%2C%20WSM.INVALID_ID)%3B%5Cn%20%20%20%20', '');

        let journal = decodeURIComponent(encodedJournal);

        journal = replaceAll(journal, '"','');
        journal = journal.replace('var result = true;', '');
        journal = journal.replace('return result;', '');
        journal = journal.replace('WSM.APIGetActiveHistory();', '0;');
        journal = journal.replace(/\\n/g, '\r\n');
        journal = journal.replace('function runtest', 'async function runJournal');
        journal = journal.replace(/(^[ \t]*\n)/gm, '');
        journal = replaceAll(journal, 'WSM.', 'await WSM.');
        journal = replaceAll(journal, 'FormIt.', 'await FormIt.');

        journal += '\r\n\r\nrunJournal();'

        if (window.confirm("Do you want to replace script with journal?")) { 
            this.JSEditor.setValue(journal, 1);
        }
    }
}

new EditorModule();
















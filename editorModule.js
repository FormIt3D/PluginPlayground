import defaultRepoValues from "./defaultValues.js";

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
            editor.container.hidden = !editor.container.hidden;
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
}

new EditorModule();
















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
            language: 'javascript',
            automaticLayout: true,
            parameterHints: true
        });

        let jsEditorModelID = this.JSEditor.getModel().id;

        const htmlContent = localStorage.getItem('currentHTMLValue') || defaultRepoValues.html;
        const cssContent = localStorage.getItem('currentCSSValue') || defaultRepoValues.css;
        const scriptContent = localStorage.getItem('currentJSValue') || defaultRepoValues.script;

        this.HTMLEditor.setValue(htmlContent);
        this.CSSEditor.setValue(cssContent);
        this.JSEditor.setValue(scriptContent);

        // Try to get the autocomplete docs from the remote doxygen host
        let autocompleteJSON = []
        try {
            const autocompleteURL = "https://formit3d.github.io/FormItExamplePlugins/docs/autocomplete.json",
                response = await fetch(autocompleteURL);
            autocompleteJSON = await response.json();
        } catch(e) {
            console.error("Error fetching autocomplete suggestions!", e);
        }

        async function showAutocompletion(obj) { 
            // Disable default autocompletion for javascript
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
            monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
          
            // Helper function to return the monaco completion item type of a thing
            function getType(typeName, isMember) {
                isMember =  (isMember == undefined) ? (typeof isMember == "boolean") ? isMember : false : false; // Give isMember a default value of false

                switch (typeName) { 
                    case "object": 
                        return monaco.languages.CompletionItemKind.Class;

                    case "function": 
                        return (isMember) ? monaco.languages.CompletionItemKind.Method : monaco.languages.CompletionItemKind.Function;

                    default: 
                        return (isMember) ? monaco.languages.CompletionItemKind.Property : monaco.languages.CompletionItemKind.Variable;
                }
            }


            // Library function to get all the property names of an object and its prototypes
            function getObjectPropNames(obj) {
                var propertyNames = [];
                do {
                    propertyNames.push.apply(propertyNames, Object.getOwnPropertyNames(obj));
                    obj = Object.getPrototypeOf(obj);
                } while (obj);

                // get unique property names
                obj = {};
                for(var i = 0, len = propertyNames.length; i < len; i++) {
                    obj[propertyNames[i]] = 1;
                }

                return Object.keys(obj).sort();
            }

            function getActiveWord(model, position) {
                // Split everything the user has typed on the current line up at each space, and only look at the last word
                let last_chars = model.getValueInRange({startLineNumber: position.lineNumber, startColumn: 0, endLineNumber: position.lineNumber, endColumn: position.column});
                // Clean up any white space
                while(last_chars.indexOf("  ") >= 0 || last_chars.indexOf("\t") >= 0) {
                    last_chars = last_chars.replace(/\t/g, " ").replace(/\s\s/g, " ");
                }
                // What the user is currently typing (everything after the last space)
                let words = last_chars.split(";");
                return words[words.length - 1].trim();
            }

            // Register object that will return autocomplete items 
            monaco.languages.registerCompletionItemProvider('javascript', {
                // Run this function when the period or space is typed in addition to any alphanumeric character
                triggerCharacters: ['.'],

                // Function to generate autocompletion results
                provideCompletionItems: function(model, position, token) {

                    // Return if this is not the javascript editor
                    if(model.id != jsEditorModelID) {
                        return;
                    }

                    // Get current word being typed
                    let active_typing = getActiveWord(model, position),
                        // If the last character typed is a period then we need to look at member objects of obj
                        is_member = active_typing.indexOf('.') >= 0,
                        // Array of autocompletion results
                        result = [],
                        // Existing value
                        curValue = model.getValue(),
                        // Used for generic handling between member and non-member objects
                        last_token = obj,
                        // Used when building the method name
                        prefix = '',
                        // Split the current word in order to get the object reference
                        parents = active_typing.split("."),
                        // Get the last word or current word the user is typing
                        last_word = parents[parents.length - 1],
                        // Get the last word search regex
                        wordRegEx = new RegExp(last_word, 'i');

                    // Get the preceding parents of the current word
                    parents = parents.splice(0, parents.length - 1);

                    // Get the object reference to be used to list all its methods
                    if(parents.length) {
                        last_token = obj[parents[0]];
                        prefix = parents[0]; 
                    }

                    // Loop through all the parents the current one will have (to generate prefix)
                    for (let i = 1; i < parents.length; i++) { 
                        if (last_token.hasOwnProperty(parents[i])) { 
                            prefix += '.' + parents[i]; 
                            last_token = last_token[parents[i]];
                        } else { 
                            // Not valid
                            return result;
                        }
                    }

                    // Append a . if we are inside the object
                    if(prefix) {
                        prefix += '.';
                    }

                    // Return no results if object reference is undefined
                    if(last_token === undefined) {
                        return;
                    }

                    // Get all the keys of the object
                    let all_token_names = getObjectPropNames(last_token);

                    // Get all the child properties of the last token
                    for (let prop_index in all_token_names) { 
                        // Get the value of the property
                        let prop = all_token_names[prop_index]
                        // Do not show properites that begin with "__"
                        if (!prop.startsWith("__") && 
                            wordRegEx.test(prop)) {

                            // Get the detail type (try-catch) incase object does not have prototype 
                            let details = ''; 
                            try { 
                                details = last_token[prop].__proto__.constructor.name; 
                            } catch (e) { 
                                // Some properties like arguments will throw error on typeof
                                try {
                                    details = typeof last_token[prop]; 
                                } catch(e2) {
                                    details = "Object";
                                }
                            }

                            // Filter existing completion items by this property
                            let filtComp = autocompleteJSON.filter(function(itemComp) {
                                return itemComp.label == prefix + prop;
                            });

                            // If existing JS API docs were found
                            if(filtComp.length) {
                                for(let compIndex in filtComp) {
                                    // Clone the next JS API docs object
                                    let nextComp = JSON.parse(JSON.stringify(filtComp[compIndex]));
                                    // Set the property type/kind
                                    nextComp.kind = getType(details.toLowerCase(), is_member);
                                    // Set the characters that will complete this lookup
                                    nextComp.commitCharacters = ['.'];
                                    // Add the "(" character to complete the lookup if this is a function
                                    if (details.toLowerCase() == 'function') { 
                                        nextComp.commitCharacters.push("(");
                                    }
                                    // Set the insert text
                                    nextComp.insertText = prop;
                                    // Assign the property name as the parameter label
                                    nextComp.label = prop;
                                    // Push the object to the result array
                                    result.push(nextComp);
                                }
                            } else {

                                // Create a standard/NON-JS-API completion object
                                let to_push = {
                                    label: prop,
                                    kind: getType(details.toLowerCase(), is_member), 
                                    detail: details,     
                                    insertText: prop,
                                    commitCharacters: ['.']
                                };

                                // Change insertText and documentation for functions
                                if (details.toLowerCase() == 'function') {
                                    // Allow the "(" to complete this lookup
                                    to_push.commitCharacters.push("(");
                                    // Show function prototype in the documentation popup
                                    to_push.documentation = (last_token[prop].toString()).split("{")[0];
                                }

                                // Add to final results
                                result.push(to_push);
                            }
                        }
                    }

                    return {
                        // Attach the result object
                        suggestions: result,
                        // This is an extra parameter to tell Monaco to add more results if any
                        incomplete: true
                    };
                }
            });

            monaco.languages.registerSignatureHelpProvider('javascript', {

                signatureHelpTriggerCharacters: ['(', ',', ' '],
            
                provideSignatureHelp: function(model, position) {

                    // Get current word being typed
                    let active_typing = getActiveWord(model, position),
                        // Get function name with library prefix (if any)
                        funcNames = [...active_typing.matchAll(/([\w_\.]*?)\s*?\(/ig)],
                        // Lookup how many argument closures ")" in order to calculate which parameter position the user is at
                        parenClose = [...active_typing.matchAll(/\)/g)].length,
                        // Use the number of argument closures to get the correct function name being looked up
                        funcName = funcNames.length ? funcNames[funcNames.length - 1 - (parenClose)][1] : false,
                        // Get just the function name (not the prefix libraries)
                        justFunc = funcName ? funcName.split('.') : funcName;

                    // Return false if no method was found
                    if (funcName === false) {
                        return false;
                    }

                    // Get just the function/method name
                    justFunc = justFunc.pop();

                    // Get delimiters
                    let delimRaw = active_typing;

                    // Remove all function names from the raw string
                    for (let funcIndex in funcNames) {
                        delimRaw = delimRaw.replace(new RegExp(funcNames[funcIndex][1], "g"), '');
                    }

                    // Clean out any word characters and the () function calls
                    let delimiters = delimRaw.replace(/\(\)/g, '').replace(/[\w\s]/g, '');

                    // Get parameter position
                    let paramPosition = delimiters.substr(delimiters.lastIndexOf('(')).length

                    // Return false if no parameter position can be matched
                    if(paramPosition === 0) {
                        return false;
                    }

                    // Get the JS API docs object for this function parameter helper
                    let doc = autocompleteJSON.filter(function(itemComp) {
                        return itemComp.label == funcName;
                    });

                    // If a JS API docs object is found, generate the output
                    if (doc.length && doc[0].params) {
                        // Get a clone of the autocomplete object
                        doc = JSON.parse(JSON.stringify(doc[0]));
                        // Remove redundant parameter display from method description
                        if (doc.documentation && doc.documentation.value) {
                            doc.documentation.value = doc.documentation.value.split("## Parameters")[0].trim();
                        }
                        // The dispose() method is called after the parameter helper is cancelled/closed
                        return {
                            value: {
                                signatures: [{
                                    label: justFunc + "(" + doc.params.join(', ') + ")",
                                    parameters: doc.params.map(param => { return {label: param} }),
                                    documentation: doc.documentation || "",
                                    activeParameter: paramPosition - 1
                                }],
                                activeSignature: 0
                            },
                            dispose() {}
                        };
                    }

                    // Return false if nothing is found (this closes the suggestion dialog)
                    return false;
                }
            });
        }
        
        // Use autocompletion for the entire window context, not just the FormIt/WSM libraries
        showAutocompletion(window);
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
        let encodedJournal = encodeURIComponent(journalRaw);

        encodedJournal = encodedJournal.replace('WSM.APILoadFromFile(mainHistID%2C%20%5C%22%2Ftmp%2Fjournal.dat%5C%22)%3B', '');
        encodedJournal = encodedJournal.replaceAll('FormIt.SectionPlanes.GetInstances()%3B%5Cn%20%20%20%20', '');
        encodedJournal = encodedJournal.replaceAll('FormIt.SectionPlanes.GetPlanes()%3B%5Cn%20%20%20%20', '');
        let journal = decodeURIComponent(encodedJournal);

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
            this.JSEditor.setValue(journal);
        }
    }
}

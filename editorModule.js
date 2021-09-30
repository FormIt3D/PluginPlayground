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

        const htmlContent = localStorage.getItem('currentHTMLValue') || defaultRepoValues.html;
        const cssContent = localStorage.getItem('currentCSSValue') || defaultRepoValues.css;
        const scriptContent = localStorage.getItem('currentJSValue') || defaultRepoValues.script;

        this.HTMLEditor.setValue(htmlContent);
        this.CSSEditor.setValue(cssContent);
        this.JSEditor.setValue(scriptContent);

        // Try to get the autocomplete docs from the remote doxygen host
        var autocompleteJSON = []
        try {
            const autocompleteURL = "https://formit3d.github.io/FormItExamplePlugins/docs/autocomplete.json",
                response = await fetch(autocompleteURL)
            autocompleteJSON = await response.json()
        } catch(e) {
            console.error("Error fetching autocomplete suggestions!", e);
        }

        async function ShowAutocompletion(obj) { 
            // Disable default autocompletion for javascript
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true  });
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

            function getActiveWord(model, position) {
                // Split everything the user has typed on the current line up at each space, and only look at the last word
                var last_chars = model.getValueInRange({startLineNumber: position.lineNumber, startColumn: 0, endLineNumber: position.lineNumber, endColumn: position.column});
                // Clean up any white space
                while(last_chars.indexOf("  ") >= 0 || last_chars.indexOf("\t") >= 0) {
                    last_chars = last_chars.replace(/\t/g, " ").replace(/\s\s/g, " ")
                }
                // What the user is currently typing (everything after the last space)
                var words = last_chars.split(";");
                return words[words.length - 1].trim();
            }

            // Register object that will return autocomplete items 
            monaco.languages.registerCompletionItemProvider('*', {
                // Run this function when the period or space is typed
                triggerCharacters: ['.', ' '],

                // Function to generate autocompletion results
                provideCompletionItems: function(model, position, token) {

                    // Return if this is not the javascript editor
                    if(model.id != '$model3') {
                        return
                    }

                    // Get current word being typed
                    var active_typing = getActiveWord(model, position);

                    // If the last character typed is a period then we need to look at member objects of obj
                    var is_member = active_typing.indexOf('.') >= 0

                    // Array of autocompletion results
                    var result = [];

                    // Existing value
                    var curValue = model.getValue();

                    // Used for generic handling between member and non-member objects
                    var last_token = obj; 
                    var prefix = ''; 

                    // Get a list of all members, and the prefix
                    var parents = active_typing.split("."),
                        last_word = parents[parents.length - 1]
                        parents = parents.splice(0, parents.length - 1);

                    if(parents.length) {
                        last_token = obj[parents[0]];
                        prefix = parents[0]; 
                    }

                    // Loop through all the parents the current one will have (to generate prefix)
                    for (var i = 1; i < parents.length; i++) { 
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
                    var all_token_names = Object.getPropertyNames(last_token);

                    // Get all the child properties of the last token
                    for (var prop_index in all_token_names) { 
                        var prop = all_token_names[prop_index],
                            propRegEx = new RegExp(prop + '\\W')
                        // Do not show properites that begin with "__"
                        if (!prop.startsWith("__") && 
                            // and the property contains the word user is typing in
                            (last_word == "" || prop.indexOf(last_word) >= 0) && 
                            // and the property was not found in Monaco's built-in word suggestion
                            !propRegEx.test(curValue)) {

                            // Get the detail type (try-catch) incase object does not have prototype 
                            var details = ''; 
                            try { 
                                details = last_token[prop].__proto__.constructor.name; 
                            } catch (e) { 
                                // Some properties like arguments will throw error on typeof
                                try {
                                    details = typeof last_token[prop]; 
                                } catch(e2) {
                                    details = "Object"
                                }
                            }

                            // Filter existing completion items by this property
                            var filtComp = autocompleteJSON.filter(function(itemComp) {
                                return itemComp.label == prefix + prop;
                            });

                            // If existing JS API docs were found
                            if(filtComp.length) {
                                for(var compIndex in filtComp) {
                                    // Clone the next JS API docs object
                                    var nextComp = JSON.parse(JSON.stringify(filtComp[compIndex]));
                                    // Set the property type/kind
                                    nextComp.kind = getType(details.toLowerCase(), is_member);
                                    // Set the characters that will complete this lookup
                                    nextComp.commitCharacters = ['.'];
                                    // Add the "(" character to complete the lookup if this is a function
                                    if (details.toLowerCase() == 'function') { 
                                        nextComp.commitCharacters.push("(");
                                    }
                                    // Set the insert text and label to the property name
                                    nextComp.insertText = prop;
                                    nextComp.label = prop;
                                    // Push the object to the result array
                                    result.push(nextComp);
                                }
                            } else {

                                // Create a standard/NON-JS-API completion object
                                var to_push = {
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
                    var active_typing = getActiveWord(model, position);

                    // Get function name with library prefix (if any)
                    var funcNames = [...active_typing.matchAll(/([\w_\.]*?)\s*?\(/ig)],
                        parenClose = [...active_typing.matchAll(/\)/g)].length,
                        funcName = funcNames.length ? funcNames[funcNames.length - 1 - (parenClose)][1] : false,
                        justFunc = funcName ? funcName.split('.') : funcName

                    // Return false if no method was found
                    if (funcName === false) {
                        return false;
                    }

                    // Get just the function/method name
                    justFunc = justFunc.pop();

                    // Get delimiters
                    var delimRaw = active_typing;

                    // Remove all function names from the raw string
                    for (var funcIndex in funcNames) {
                        delimRaw = delimRaw.replace(new RegExp(funcNames[funcIndex][1], "g"), '');
                    }

                    // Clean out any word characters and the () function calls
                    var delimiters = delimRaw.replace(/\(\)/g, '').replace(/[\w\s]/g, '');

                    // Get parameter position
                    var paramPosition = delimiters.substr(delimiters.lastIndexOf('(')).length

                    // Return false if no parameter position can be matched
                    if(paramPosition === 0) {
                        return false;
                    }

                    // Get the JS API docs object for this function parameter helper
                    var doc = autocompleteJSON.filter(function(itemComp) {
                        return itemComp.label == funcName;
                    });

                    // If a JS API docs object is found, generate the output
                    if (doc.length && doc[0].params) {
                        // Get a clone of the autocomplete object
                        doc = JSON.parse(JSON.stringify(doc[0]))
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
        ShowAutocompletion(window);
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

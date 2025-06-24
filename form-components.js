class Form extends HTMLElement {
    #formData;

    constructor() {
        super();
        this.#formData = '';
    }

    get data() {
        return this.#formData;
    }
    set data(value) {
        if (!JSON.parse(JSON.stringify(value))) {
            console.warn("Passed form data is either not a JSON object or is malformed.");
            return;
        }
        this.#formData = structuredClone(value);
        this.render();
    }

    render() {
        const data = this.#formData;
        this.innerHTML = `
        <form action="${data.action}">
            <header>
                <h1>${data.title}</h1>
                <p>${data.description}</p>
            </header>
            <main>
                <validaton-errors class="sr-only">
                    <!-- For AT, focus here so the user can jump to the incorrect fields -->
                    <!-- If validation messages are shown next to inputs, this isn't required for non-AT-using folks -->
                    <!-- Might still be good to scroll non-AT users to first incorrect field tho -->
                    <h2>There were problems with your submission</h2>
                    <ul>
                        <li><a href="#email">Please enter an email address like example@example.com</a></li>
                        <li><a href="#password">Password must be at least 8 characters long</a></li>
                    </ul>
                </validaton-errors>

                <form-page>
                    <section>
                        <hgroup role="group" aria-roledescription="Heading group">
                            <h2>Page 1</h2>
                            <p aria-roledescription="subtitle">This is the first page</p>
                        </hgroup>
                        
                        <form-field required>
                            <label for="email">Enter your email address</label>
                            <input type="text" id="email">
                            <p class="hint hidden" id="emailHint">Please enter a valid email address</p>
                        </form-field>

                        <form-field>
                            <label for="email">Enter your email address</label>
                            <input type="text" id="email">
                            <p class="hint hidden" id="emailHint">Please enter a valid email address</p>
                        </form-field>

                        <nav>
                            <button>Next</button>
                        </nav>

                    </section
                </form-page>

                <form-page>

                </form-page>
            </main>
            <nav>
                <button>Back</button>
                <button>Next</button>
            </nav>
        </form>
        `;
    }

    renderFormElements(formElements) {
        let html = '';
        formElements.forEach(formEl => {
            html += '<input></input>';
        });
        return html;
    }

    connectedCallback() {
        // this.render()
    }

    disconnectedCallback() { }

    attributeChangedCallback(attrName, oldVal, newVal) { this.render() }

    // Fires when an element is moved to a new document
    adoptedCallback() { }
}

// Registers custom element
window.customElements.define('r-form', Form);
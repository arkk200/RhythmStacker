import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('input-element')
export class InputTemplate extends LitElement {
    @property() labelContent = ""
    @property() labelFor = ""
    @property() placeholder = ""
    @property() inputClass = ""
    @property() buttonValue = ""
    @property() buttonClass = ""

    render() {
        return html`
            <div>
                <label for=${this.labelFor}>${this.labelContent}</label>
                <input type="text" id=${this.labelFor} class=${this.inputClass} placeholder=${this.placeholder} />
                ${
                    this.buttonValue && html`
                    <input type="button" class=${this.buttonClass} value=${this.buttonValue} />
                    `
                }
            </div>
        `
    }
    createRenderRoot() {
        return this; // remove #shadow root
    }
}
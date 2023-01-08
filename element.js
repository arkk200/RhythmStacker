import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('input-element')
export class InputTemplate extends LitElement {
    render() {
        return html`
            <div>
                <label></label>
                <input type="text" />
            </div>
        `
    }
}
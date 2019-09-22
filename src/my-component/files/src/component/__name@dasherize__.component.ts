import {
  Component,
  OnInit,
  Input,
  HostBinding,
  SimpleChanges
} from "@angular/core";
import { css } from "emotion";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Component({
  <% if (componentType === 'Atoms') { %>selector: "a-<%= name %>",<% } %>
  <% if (componentType === 'Molecules') { %>selector: "m-<%= name %>",<% } %>
  <% if (componentType === 'Organisms') { %>selector: "o-<%= name %>",<% } %>
  <% if (componentType === 'Util') { %>selector: "ui-<%= name %>",<% } %>
  template: `
    <ng-content></ng-content>
  `
})
export class <%= classify(name) %>Component implements OnInit {
  @HostBinding("class") className;
  @Input() customStyle: string;
  @Input() variant: string;
  @Input() small: boolean;
  @Input() disable: boolean;
  defaultInputs = new BehaviorSubject<any>({
    small: false,
    disable: false,
    variant: "green"
  });

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const inputs = Object.keys(changes).reduce(function(result, item) {
      result[item] = changes[item].currentValue;
      return result;
    }, {});
    this.defaultInputs.next({ ...this.defaultInputs.getValue(), ...inputs });
    this.className = `${this.getDynamicStyle(this.defaultInputs.getValue())}`;
  }

  getDynamicStyle(inputs) {
    return css`
      ${inputs.variant === "variantName" &&
        css`
        `}
    `;
  }

  ngOnInit() {
    const { customStyle, ...others } = this;
    this.defaultInputs.next({ ...this.defaultInputs.getValue(), ...others });
    this.className = `${this.getDynamicStyle(this.defaultInputs.getValue())}`;
  }

}

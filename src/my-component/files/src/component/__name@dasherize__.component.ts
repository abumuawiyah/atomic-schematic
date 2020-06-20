import {
  Component,
  OnInit
} from "@angular/core";


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
  
  constructor() {}

  ngOnInit() {
   
  }

}

import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

let nextFieldId = 0;

/**
 * FormField molecule.
 * - the label is associated with the control (for / id)
 * - hint and error are BOTH referenced from aria-describedby (space separated)
 * - an invalid control gets aria-invalid="true", not just a red border
 * - ids are generated so two fields on a page cannot collide
 * - a required field says "(required)" in the label text
 *
 * The control is projected through a template so this component never reaches
 * into it: the context hands back { id, describedBy, invalid }.
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./FormField.style.css'],
  template: `
    <!-- Your code here. -->
    <div class="field">
      <label [attr.for]="id">{{ label }}</label>
      <ng-container *ngTemplateOutlet="control; context: { $implicit: { id: id } }"></ng-container>
    </div>
  `,
})
export default class FormFieldComponent {
  @Input() label = '';
  @Input() hint?: string;
  @Input() error?: string;
  @Input() required = false;
  @ContentChild(TemplateRef) control!: TemplateRef<unknown>;

  readonly id = `field-${nextFieldId++}`;
}

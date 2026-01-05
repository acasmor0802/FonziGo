import { CanDeactivateFn } from '@angular/router';
import { FormGroup } from '@angular/forms';

export interface FormComponent {
  form: FormGroup;
}

export const pendingChangesGuard: CanDeactivateFn<FormComponent> = (component) => {
  if (component.form?.dirty) {
    return confirm('Hay cambios sin guardar. ¿Seguro que quieres salir?');
  }
  return true;
};

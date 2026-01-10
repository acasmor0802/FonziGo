import { CanDeactivateFn } from '@angular/router';
import { FormGroup } from '@angular/forms';

// Interfaz flexible para componentes con formulario
export interface FormComponent {
  form?: FormGroup;
  hasUnsavedChanges?: () => boolean;
}

export const pendingChangesGuard: CanDeactivateFn<FormComponent> = (component) => {
  // Primero verifica si tiene método personalizado
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return confirm('Hay cambios sin guardar. ¿Seguro que quieres salir?');
  }
  // Después verifica FormGroup dirty
  if (component.form?.dirty) {
    return confirm('Hay cambios sin guardar. ¿Seguro que quieres salir?');
  }
  return true;
};

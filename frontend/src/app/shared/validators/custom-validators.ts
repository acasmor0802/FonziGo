import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

// ===== VALIDADORES DE CAMPO INDIVIDUAL =====

/**
 * Valida la fortaleza de una contraseña
 * Requisitos: mayúscula, minúscula, número, símbolo, mínimo 8 caracteres
 */
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null; // No validar si está vacío (usar required por separado)
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    const errors: any = {};
    
    if (!hasUpperCase) errors.noUpperCase = true;
    if (!hasLowerCase) errors.noLowerCase = true;
    if (!hasNumber) errors.noNumber = true;
    if (!hasSymbol) errors.noSymbol = true;
    if (!hasMinLength) errors.tooShort = true;

    return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
  };
}

/**
 * Valida que dos campos coincidan (ej: password y confirmPassword)
 * Debe usarse a nivel de FormGroup
 */
export function passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get(passwordField);
    const confirmPassword = formGroup.get(confirmPasswordField);

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMatch: true };
    }

    return null;
  };
}

/**
 * Valida formato de NIF español (8 dígitos + letra)
 */
export function nifValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    // Formato: 8 dígitos + 1 letra
    const nifRegex = /^[0-9]{8}[A-Z]$/;
    
    if (!nifRegex.test(value)) {
      return { nif: { message: 'Formato inválido (debe ser 12345678A)' } };
    }

    // Validar letra correcta
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const number = parseInt(value.substring(0, 8), 10);
    const expectedLetter = letters.charAt(number % 23);
    const providedLetter = value.charAt(8);

    if (expectedLetter !== providedLetter) {
      return { nif: { message: 'Letra del NIF incorrecta' } };
    }

    return null;
  };
}

/**
 * Valida formato de teléfono español
 */
export function telefonoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    // Permitir formatos: 612345678, +34612345678, 912345678
    const telefonoRegex = /^(\+34)?[6-9][0-9]{8}$/;
    
    if (!telefonoRegex.test(value.replace(/\s/g, ''))) {
      return { telefono: { message: 'Formato de teléfono inválido' } };
    }

    return null;
  };
}

/**
 * Valida formato de código postal español (5 dígitos)
 */
export function codigoPostalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    const cpRegex = /^[0-5][0-9]{4}$/;
    
    if (!cpRegex.test(value)) {
      return { codigoPostal: { message: 'Código postal debe tener 5 dígitos (01000-52999)' } };
    }

    return null;
  };
}

// ===== VALIDADORES CROSS-FIELD (A NIVEL DE FORMULARIO) =====

/**
 * Valida que el total de un conjunto de campos numéricos supere un mínimo
 */
export function totalMinimo(min: number, ...fieldNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    
    let total = 0;
    for (const fieldName of fieldNames) {
      const field = formGroup.get(fieldName);
      if (field && field.value) {
        total += parseFloat(field.value) || 0;
      }
    }

    if (total < min) {
      return { 
        totalMinimo: { 
          required: min, 
          actual: total,
          message: `El total debe ser al menos ${min}` 
        } 
      };
    }

    return null;
  };
}

/**
 * Valida que una persona sea mayor de cierta edad
 */
export function edadMayor(fechaNacimientoField: string, edadMinima: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const fechaNacimiento = formGroup.get(fechaNacimientoField);

    if (!fechaNacimiento || !fechaNacimiento.value) {
      return null;
    }

    const birthDate = new Date(fechaNacimiento.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < edadMinima) {
      return { 
        edadMayor: { 
          required: edadMinima, 
          actual: age,
          message: `Debe ser mayor de ${edadMinima} años` 
        } 
      };
    }

    return null;
  };
}

/**
 * Valida que al menos uno de los campos especificados tenga valor
 */
export function atLeastOneRequired(...fieldNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    
    const hasValue = fieldNames.some(fieldName => {
      const field = formGroup.get(fieldName);
      return field && field.value && field.value.toString().trim() !== '';
    });

    if (!hasValue) {
      return { 
        atLeastOneRequired: { 
          fields: fieldNames,
          message: `Al menos uno de estos campos es requerido: ${fieldNames.join(', ')}` 
        } 
      };
    }

    return null;
  };
}

/**
 * Validador personalizado para rango de fechas
 */
export function dateRangeValidator(startDateField: string, endDateField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const startDate = formGroup.get(startDateField);
    const endDate = formGroup.get(endDateField);

    if (!startDate || !endDate || !startDate.value || !endDate.value) {
      return null;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (start >= end) {
      return { 
        dateRange: { 
          message: 'La fecha de inicio debe ser anterior a la fecha de fin' 
        } 
      };
    }

    return null;
  };
}

/**
 * Validador de tarjeta de crédito (algoritmo de Luhn)
 */
export function creditCardValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    // Eliminar espacios y guiones
    const cleaned = value.replace(/[\s-]/g, '');
    
    // Debe ser solo números y tener entre 13 y 19 dígitos
    if (!/^[0-9]{13,19}$/.test(cleaned)) {
      return { creditCard: { message: 'Número de tarjeta inválido' } };
    }

    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return { creditCard: { message: 'Número de tarjeta inválido' } };
    }

    return null;
  };
}

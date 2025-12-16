import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormTextarea } from './form-textarea';

describe('FormTextarea', () => {
  let component: FormTextarea;
  let fixture: ComponentFixture<FormTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTextarea]
    }).compileComponents();

    fixture = TestBed.createComponent(FormTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label correctly', () => {
    component.label = 'Descripción';
    component.id = 'description';
    fixture.detectChanges();
    
    const label = fixture.nativeElement.querySelector('.form-textarea__label');
    expect(label.textContent).toContain('Descripción');
  });

  it('should show required indicator when required is true', () => {
    component.required = true;
    fixture.detectChanges();
    
    const required = fixture.nativeElement.querySelector('.form-textarea__required');
    expect(required).toBeTruthy();
  });

  it('should show error message when errorText is provided', () => {
    component.errorText = 'Este campo es obligatorio';
    fixture.detectChanges();
    
    const error = fixture.nativeElement.querySelector('.form-textarea__error');
    expect(error.textContent).toContain('Este campo es obligatorio');
  });

  it('should show character counter when maxLength is set', () => {
    component.maxLength = 100;
    component.value = 'Hello';
    fixture.detectChanges();
    
    const counter = fixture.nativeElement.querySelector('.form-textarea__counter');
    expect(counter.textContent).toContain('5/100');
  });
});

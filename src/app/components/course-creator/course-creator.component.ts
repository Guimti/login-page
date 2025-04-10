import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  name: string;
}

interface Level {
  id: number;
  name: string;
}

@Component({
  selector: 'app-course-creator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './course-creator.component.html',
  styleUrls: ['./course-creator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CourseCreatorComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  courseForm: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  categories: Category[] = [
    { id: 1, name: 'Programação' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Negócios' },
    { id: 5, name: 'Música' }
  ];
  levels: Level[] = [
    { id: 1, name: 'Iniciante' },
    { id: 2, name: 'Intermediário' },
    { id: 3, name: 'Avançado' }
  ];
  tags: string[] = [];
  selectedImage: string | null = null;
  maxTitleLength = 100;
  maxDescriptionLength = 500;

  constructor(
    private fb: FormBuilder
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(this.maxTitleLength)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(this.maxDescriptionLength)]],
      level: ['', Validators.required],
      isPublic: [false]
    });
  }

  ngOnInit(): void {}

  closeCard(): void {
    this.close.emit();
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    const controls = {
      1: ['title', 'category', 'description'],
      2: ['level'],
      3: []
    };

    const currentControls = controls[this.currentStep as keyof typeof controls];
    if (!currentControls) return true;

    let isValid = true;
    for (const controlName of currentControls) {
      const control = this.courseForm.get(controlName);
      if (control?.invalid) {
        control.markAsTouched();
        isValid = false;
      }
    }
    return isValid;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addTag(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const tag = input.value.trim();
    
    if (event.key === 'Enter' && tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const courseData = {
        ...this.courseForm.value,
        tags: this.tags,
        image: this.selectedImage
      };
      
      // TODO: Implement API call to save course
      console.log('Course data:', courseData);
      
      // Close the modal after successful submission
      this.close.emit();
    } else {
      this.markFormGroupTouched(this.courseForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.close.emit();
  }
} 
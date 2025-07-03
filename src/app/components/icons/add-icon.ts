import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.class]="className"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4v16m8-8H4"
      />
    </svg>
  `,
})
export class AddIconComponent {
  @Input() className = 'w-6 h-6';
}

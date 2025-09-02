import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './delete-confirmation-modal.html',
  styleUrl: './delete-confirmation-modal.css',
})
export class DeleteConfirmationModal {
  @Input() show!: boolean;
  @Output() cancelEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  cancel() {
    this.cancelEvent.emit();
  }

  confirm() {
    this.confirmEvent.emit();
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document, DocumentTemplate } from '../../interfaces/documentation.interface';
import { DocumentSectionComponent } from '../document-section/document-section.component';

@Component({
  selector: 'app-document-view',
  imports: [CommonModule, DocumentSectionComponent],
  templateUrl: './document-view.component.html',
  styleUrl: './document-view.component.scss'
})
export class DocumentViewComponent {
  @Input() document: Document | null = null;
  @Input() template: DocumentTemplate | null = null;

  @Output() edit = new EventEmitter<void>();
  @Output() export = new EventEmitter<Document>();
  @Output() publish = new EventEmitter<Document>();

  getStatusLabel(status: Document['status']): string {
    const labels: Record<Document['status'], string> = {
      draft: 'Черновик',
      published: 'Опубликован',
      archived: 'Архив'
    };
    return labels[status];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onEdit() {
    this.edit.emit();
  }

  onExport() {
    if (this.document) {
      this.export.emit(this.document);
    }
  }

  onPublish() {
    if (this.document) {
      this.publish.emit(this.document);
    }
  }
}

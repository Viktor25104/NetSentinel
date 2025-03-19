import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Document, DocumentSection, DocumentTemplate } from '../../interfaces/documentation.interface';

@Component({
  selector: 'app-document-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss'
})
export class DocumentEditorComponent {
  @Input() document: Document | null = null;
  @Input() template: DocumentTemplate | null = null;

  @Output() save = new EventEmitter<Document>();
  @Output() publish = new EventEmitter<Document>();
  @Output() preview = new EventEmitter<Document>();
  @Output() export = new EventEmitter<{document: Document, format?: string}>();
  @Output() cancel = new EventEmitter<void>();

  getStatusLabel(status: Document['status']): string {
    const labels: Record<Document['status'], string> = {
      draft: 'Черновик',
      published: 'Опубликован',
      archived: 'Архив'
    };
    return labels[status];
  }

  onSave() {
    if (this.document) {
      this.save.emit(this.document);
    }
  }

  onPublish() {
    if (this.document) {
      this.publish.emit(this.document);
    }
  }

  onExport() {
    if (this.document) {
      this.export.emit({ document: this.document });
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  // Table methods
  getTableColumns(sectionId: string): number[] {
    if (!this.document || !this.document.sections[sectionId]) {
      this.initializeTableSection(sectionId);
    }

    const headers = this.document?.sections[sectionId]?.headers || [];
    return Array.from({ length: headers.length }, (_, i) => i);
  }

  getTableRows(sectionId: string): number[] {
    if (!this.document || !this.document.sections[sectionId]) {
      this.initializeTableSection(sectionId);
    }

    const rows = this.document?.sections[sectionId]?.rows || [];
    return Array.from({ length: rows.length }, (_, i) => i);
  }

  initializeTableSection(sectionId: string) {
    if (this.document && !this.document.sections[sectionId]) {
      this.document.sections[sectionId] = {
        headers: ['Заголовок 1', 'Заголовок 2', 'Заголовок 3'],
        rows: [
          ['', '', ''],
          ['', '', '']
        ]
      };
    }
  }

  addTableRow(sectionId: string) {
    if (this.document && this.document.sections[sectionId]) {
      const columnCount = this.document.sections[sectionId].headers.length;
      const newRow = Array(columnCount).fill('');
      this.document.sections[sectionId].rows.push(newRow);
    }
  }

  removeTableRow(sectionId: string, rowIndex: number) {
    if (this.document && this.document.sections[sectionId]) {
      this.document.sections[sectionId].rows.splice(rowIndex, 1);
    }
  }

  addTableColumn(sectionId: string) {
    if (this.document && this.document.sections[sectionId]) {
      this.document.sections[sectionId].headers.push('');
      this.document.sections[sectionId].rows.forEach((row: any[]) => row.push(''));
    }
  }

  removeTableColumn(sectionId: string, colIndex: number) {
    if (this.document && this.document.sections[sectionId]) {
      this.document.sections[sectionId].headers.splice(colIndex, 1);
      this.document.sections[sectionId].rows.forEach((row: any[]) => row.splice(colIndex, 1));
    }
  }

  // List methods
  getListItems(sectionId: string): number[] {
    if (!this.document || !this.document.sections[sectionId]) {
      this.initializeListSection(sectionId);
    }

    const items = this.document?.sections[sectionId] || [];
    return Array.from({ length: items.length }, (_, i) => i);
  }

  initializeListSection(sectionId: string) {
    if (this.document && !this.document.sections[sectionId]) {
      this.document.sections[sectionId] = [''];
    }
  }

  addListItem(sectionId: string) {
    if (this.document && this.document.sections[sectionId]) {
      this.document.sections[sectionId].push('');
    }
  }

  removeListItem(sectionId: string, itemIndex: number) {
    if (this.document && this.document.sections[sectionId]) {
      this.document.sections[sectionId].splice(itemIndex, 1);
    }
  }

  // Code methods
  initializeCodeSection(sectionId: string) {
    if (this.document && !this.document.sections[sectionId]) {
      this.document.sections[sectionId] = {
        language: 'javascript',
        code: ''
      };
    }
  }

  // Image methods
  initializeImageSection(sectionId: string) {
    if (this.document && !this.document.sections[sectionId]) {
      this.document.sections[sectionId] = {
        url: '',
        caption: ''
      };
    }
  }
}

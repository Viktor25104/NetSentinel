import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Document, DocumentFilter } from '../../interfaces/documentation.interface';

@Component({
  selector: 'app-document-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss'
})
export class DocumentListComponent {
  @Input() documents: Document[] = [];
  @Output() selectDocument = new EventEmitter<Document>();
  @Output() editDocument = new EventEmitter<Document>();
  @Output() exportDocument = new EventEmitter<Document>();
  @Output() deleteDocument = new EventEmitter<Document>();
  @Output() createDocument = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<DocumentFilter>();

  searchQuery = '';
  filter: DocumentFilter = {};

  get filteredDocuments(): Document[] {
    let filtered = this.documents;

    if (this.filter.status) {
      filtered = filtered.filter(doc => doc.status === this.filter.status);
    }

    if (this.filter.category) {
      // This would require knowing the template category for each document
      // For now, we'll just simulate this filter
      filtered = filtered.filter(doc => doc.templateId.includes(this.filter.category || ''));
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (this.filter.dateFrom) {
      const fromDate = new Date(this.filter.dateFrom);
      filtered = filtered.filter(doc => new Date(doc.updatedAt) >= fromDate);
    }

    if (this.filter.dateTo) {
      const toDate = new Date(this.filter.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(doc => new Date(doc.updatedAt) <= toDate);
    }

    return filtered;
  }

  get hasActiveFilters(): boolean {
    return !!(this.filter.status || this.filter.category || this.filter.dateFrom ||
      this.filter.dateTo || this.searchQuery);
  }

  onSearchChange() {
    this.filter.search = this.searchQuery;
    this.filterChange.emit(this.filter);
  }

  onFilterChange() {
    this.filterChange.emit(this.filter);
  }

  resetFilters() {
    this.filter = {};
    this.searchQuery = '';
    this.filterChange.emit(this.filter);
  }

  getStatusLabel(status: Document['status']): string {
    const labels: Record<Document['status'], string> = {
      draft: 'Черновик',
      published: 'Опубликован',
      archived: 'Архив'
    };
    return labels[status];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  onSelectDocument(document: Document) {
    this.selectDocument.emit(document);
  }

  onEditDocument(document: Document) {
    this.editDocument.emit(document);
  }

  onExportDocument(document: Document) {
    this.exportDocument.emit(document);
  }

  onDeleteDocument(document: Document) {
    this.deleteDocument.emit(document);
  }

  onCreateDocument() {
    this.createDocument.emit();
  }
}

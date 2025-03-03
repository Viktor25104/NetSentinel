import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentTemplate, DocumentCategory } from '../../interfaces/documentation.interface';

@Component({
  selector: 'app-document-templates',
  imports: [CommonModule],
  templateUrl: './document-templates.component.html',
  styleUrl: './document-templates.component.scss'
})
export class DocumentTemplatesComponent {
  @Input() templates: DocumentTemplate[] = [];
  @Output() selectTemplate = new EventEmitter<DocumentTemplate>();
  @Output() createTemplate = new EventEmitter<void>();

  selectedCategory: DocumentCategory | null = null;

  categories = [
    { value: 'infrastructure' as DocumentCategory, label: 'Инфраструктура' },
    { value: 'network' as DocumentCategory, label: 'Сеть' },
    { value: 'security' as DocumentCategory, label: 'Безопасность' },
    { value: 'compliance' as DocumentCategory, label: 'Соответствие' },
    { value: 'operations' as DocumentCategory, label: 'Операции' },
    { value: 'incident' as DocumentCategory, label: 'Инциденты' }
  ];

  get filteredTemplates(): DocumentTemplate[] {
    if (!this.selectedCategory) {
      return this.templates;
    }
    return this.templates.filter(template => template.category === this.selectedCategory);
  }

  selectCategory(category: DocumentCategory | null) {
    this.selectedCategory = category;
  }

  getCategoryLabel(category: DocumentCategory): string {
    const found = this.categories.find(c => c.value === category);
    return found ? found.label : category;
  }

  onSelectTemplate(template: DocumentTemplate) {
    this.selectTemplate.emit(template);
  }

  onCreateTemplate() {
    this.createTemplate.emit();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentTemplatesComponent } from './components/document-templates/document-templates.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { ReportGeneratorComponent } from './components/report-generator/report-generator.component';
import { DocumentEditorComponent } from './components/document-editor/document-editor.component';
import { Document, DocumentFilter, DocumentTemplate, ReportData } from './interfaces/documentation.interface';
import { DocumentViewComponent } from './components/document-view/document-view.component';
import { DocumentSectionComponent } from './components/document-section/document-section.component';

@Component({
  selector: 'app-documentation',
  imports: [
    CommonModule,
    DocumentTemplatesComponent,
    DocumentListComponent,
    ReportGeneratorComponent,
    DocumentEditorComponent,
    DocumentViewComponent,
    DocumentSectionComponent
  ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss'
})
export class DocumentationComponent implements OnInit {
  activeView = 'documents';
  editingDocument = false;

  // Templates
  documentTemplates: DocumentTemplate[] = [];
  selectedTemplate: DocumentTemplate | null = null;

  // Documents
  documents: Document[] = [];
  currentDocument: Document | null = null;

  // Reports
  reportTemplates: ReportData[] = [];
  scheduledReports: ReportData[] = [];
  reportHistory: ReportData[] = [];

  ngOnInit() {
    // Load mock data
    this.loadMockData();
  }

  loadMockData() {
    // Document templates
    this.documentTemplates = [
      {
        id: 'infra-overview',
        name: 'Обзор инфраструктуры',
        description: 'Шаблон для документирования серверной инфраструктуры',
        category: 'infrastructure',
        icon: '🖥️',
        sections: [
          {
            id: 'overview',
            title: 'Общий обзор',
            type: 'text',
            placeholder: 'Опишите общую структуру инфраструктуры...',
            required: true
          },
          {
            id: 'servers',
            title: 'Серверы',
            type: 'table',
            required: true
          },
          {
            id: 'network',
            title: 'Сетевая инфраструктура',
            type: 'text',
            placeholder: 'Опишите сетевую инфраструктуру...'
          },
          {
            id: 'diagram',
            title: 'Диаграмма инфраструктуры',
            type: 'image'
          }
        ]
      },
      {
        id: 'security-policy',
        name: 'Политика безопасности',
        description: 'Шаблон для документирования политик безопасности',
        category: 'security',
        icon: '🛡️',
        sections: [
          {
            id: 'intro',
            title: 'Введение',
            type: 'text',
            placeholder: 'Опишите цели и область применения политики безопасности...',
            required: true
          },
          {
            id: 'policies',
            title: 'Политики',
            type: 'list',
            required: true
          },
          {
            id: 'procedures',
            title: 'Процедуры',
            type: 'text',
            placeholder: 'Опишите процедуры обеспечения безопасности...'
          },
          {
            id: 'compliance',
            title: 'Соответствие стандартам',
            type: 'text',
            placeholder: 'Укажите стандарты, которым соответствует политика...'
          }
        ]
      },
      {
        id: 'network-config',
        name: 'Конфигурация сети',
        description: 'Шаблон для документирования сетевой конфигурации',
        category: 'network',
        icon: '🌐',
        sections: [
          {
            id: 'topology',
            title: 'Топология сети',
            type: 'text',
            placeholder: 'Опишите топологию сети...',
            required: true
          },
          {
            id: 'ip-plan',
            title: 'IP-план',
            type: 'table',
            required: true
          },
          {
            id: 'vlans',
            title: 'VLAN-ы',
            type: 'table'
          },
          {
            id: 'routing',
            title: 'Маршрутизация',
            type: 'text',
            placeholder: 'Опишите схему маршрутизации...'
          },
          {
            id: 'config-snippets',
            title: 'Примеры конфигурации',
            type: 'code'
          }
        ]
      }
    ];

    // Documents
    this.documents = [
      {
        id: 'doc1',
        name: 'Инфраструктура ЦОД',
        templateId: 'infra-overview',
        createdAt: '2024-05-10T10:00:00Z',
        updatedAt: '2024-05-15T14:30:00Z',
        createdBy: 'Александр Иванов',
        status: 'published',
        sections: {
          'overview': 'Инфраструктура ЦОД состоит из 3 стоек с серверами и сетевым оборудованием...',
          'servers': {
            headers: ['Имя', 'IP', 'ОС', 'Роль'],
            rows: [
              ['srv-app-01', '10.0.1.10', 'Ubuntu 22.04', 'Приложение'],
              ['srv-db-01', '10.0.1.20', 'Ubuntu 22.04', 'База данных'],
              ['srv-mon-01', '10.0.1.30', 'Ubuntu 22.04', 'Мониторинг']
            ]
          },
          'network': 'Сетевая инфраструктура включает в себя маршрутизаторы Cisco и коммутаторы...',
          'diagram': {
            url: 'https://via.placeholder.com/800x400',
            caption: 'Диаграмма инфраструктуры ЦОД'
          }
        },
        tags: ['инфраструктура', 'цод', 'серверы']
      },
      {
        id: 'doc2',
        name: 'Политика информационной безопасности',
        templateId: 'security-policy',
        createdAt: '2024-04-20T09:15:00Z',
        updatedAt: '2024-05-12T11:45:00Z',
        createdBy: 'Елена Петрова',
        status: 'draft',
        sections: {
          'intro': 'Данная политика определяет основные принципы обеспечения информационной безопасности...',
          'policies': [
            'Политика управления доступом',
            'Политика защиты от вредоносного ПО',
            'Политика резервного копирования',
            'Политика реагирования на инциденты'
          ],
          'procedures': 'Процедуры включают регулярные проверки безопасности, аудит доступа...',
          'compliance': 'Политика соответствует требованиям ISO 27001, GDPR и ФЗ-152...'
        },
        tags: ['безопасность', 'политика', 'iso27001']
      }
    ];

    // Report templates
    this.reportTemplates = [
      {
        id: 'server-health',
        name: 'Отчет о состоянии серверов',
        type: 'server',
        period: 'daily',
        format: 'pdf',
        config: {
          sections: ['overview', 'performance', 'alerts'],
          filters: { status: 'all' }
        }
      },
      {
        id: 'network-traffic',
        name: 'Отчет о сетевом трафике',
        type: 'network',
        period: 'weekly',
        format: 'html',
        config: {
          sections: ['summary', 'bandwidth', 'anomalies'],
          filters: { period: '7d' }
        }
      },
      {
        id: 'security-incidents',
        name: 'Отчет по инцидентам безопасности',
        type: 'security',
        period: 'monthly',
        format: 'pdf',
        config: {
          sections: ['summary', 'incidents', 'recommendations'],
          filters: { severity: 'all' }
        }
      }
    ];

    // Scheduled reports
    this.scheduledReports = [
      {
        id: 'sched1',
        name: 'Еженедельный отчет о производительности',
        type: 'server',
        period: 'weekly',
        format: 'pdf',
        schedule: {
          enabled: true,
          frequency: 'weekly',
          day: 1, // Понедельник
          time: '08:00',
          recipients: ['admin@example.com', 'manager@example.com']
        },
        lastGenerated: '2024-05-13T08:00:00Z',
        config: {
          sections: ['overview', 'performance', 'recommendations'],
          filters: { status: 'all' }
        }
      }
    ];

    // Report history
    this.reportHistory = [
      {
        id: 'hist1',
        name: 'Отчет о состоянии серверов',
        type: 'server',
        period: 'daily',
        format: 'pdf',
        lastGenerated: '2024-05-15T08:00:00Z',
        config: {
          sections: ['overview', 'performance', 'alerts'],
          filters: { status: 'all' }
        }
      },
      {
        id: 'hist2',
        name: 'Отчет о сетевом трафике',
        type: 'network',
        period: 'weekly',
        format: 'html',
        lastGenerated: '2024-05-14T09:30:00Z',
        config: {
          sections: ['summary', 'bandwidth', 'anomalies'],
          filters: { period: '7d' }
        }
      }
    ];
  }

  setActiveView(view: string) {
    this.activeView = view;
  }

  // Document template methods
  onSelectTemplate(template: DocumentTemplate) {
    this.selectedTemplate = template;
    this.currentDocument = this.createEmptyDocument(template);
    this.editingDocument = true;
  }

  onCreateTemplate() {
    // Logic for creating a new template
    console.log('Create new template');
  }

  // Document methods
  onSelectDocument(document: Document) {
    // Find the template for this document
    const template = this.documentTemplates.find(t => t.id === document.templateId);
    if (template) {
      this.selectedTemplate = template;
      this.currentDocument = { ...document };
      this.editingDocument = true;
    }
  }

  onEditDocument(document: Document) {
    this.onSelectDocument(document);
  }

  onExportDocument(document: Document) {
    console.log('Export document', document);
  }

  onExportDocumentWithFormat(data: {document: Document, format?: string}) {
    console.log('Export document with format', data);
  }

  onDeleteDocument(document: Document) {
    this.documents = this.documents.filter(d => d.id !== document.id);
  }

  onCreateDocument() {
    // Show templates to select one
    console.log('Create new document');
  }

  onDocumentFilterChange(filter: DocumentFilter) {
    console.log('Filter changed', filter);
    // Apply filters to documents
  }

  onSaveDocument(document: Document) {
    const index = this.documents.findIndex(d => d.id === document.id);
    if (index >= 0) {
      this.documents[index] = {
        ...document,
        updatedAt: new Date().toISOString()
      };
    } else {
      this.documents.push({
        ...document,
        updatedAt: new Date().toISOString()
      });
    }
    this.editingDocument = false;
  }

  onPublishDocument(document: Document) {
    document.status = 'published';
    this.onSaveDocument(document);
  }

  onPreviewDocument(document: Document) {
    console.log('Preview document', document);
  }

  onCancelEdit() {
    this.editingDocument = false;
    this.currentDocument = null;
    this.selectedTemplate = null;
  }

  // Report methods
  onSelectReportTemplate(template: ReportData) {
    console.log('Select report template', template);
  }

  onCreateReport() {
    console.log('Create new report');
  }

  onEditReport(report: ReportData) {
    console.log('Edit report', report);
  }

  onGenerateReport(report: ReportData) {
    console.log('Generate report', report);

    // Add to history
    const historyReport = {
      ...report,
      id: `hist-${Date.now()}`,
      lastGenerated: new Date().toISOString()
    };
    this.reportHistory = [historyReport, ...this.reportHistory];
  }

  onDeleteReport(report: ReportData) {
    this.scheduledReports = this.scheduledReports.filter(r => r.id !== report.id);
  }

  onViewReport(report: ReportData) {
    console.log('View report', report);
  }

  onDownloadReport(report: ReportData) {
    console.log('Download report', report);
  }

  onRegenerateReport(report: ReportData) {
    console.log('Regenerate report', report);

    // Update history
    const index = this.reportHistory.findIndex(r => r.id === report.id);
    if (index >= 0) {
      this.reportHistory[index] = {
        ...report,
        lastGenerated: new Date().toISOString()
      };
    }
  }

  // Helper methods
  createEmptyDocument(template: DocumentTemplate): Document {
    return {
      id: `doc-${Date.now()}`,
      name: 'Новый документ',
      templateId: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Текущий пользователь',
      status: 'draft',
      sections: {},
      tags: []
    };
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportData } from '../../interfaces/documentation.interface';

@Component({
  selector: 'app-report-generator',
  imports: [CommonModule, FormsModule],
  templateUrl: './report-generator.component.html',
  styleUrl: './report-generator.component.scss'
})
export class ReportGeneratorComponent {
  @Input() reportTemplates: ReportData[] = [];
  @Input() scheduledReports: ReportData[] = [];
  @Input() reportHistory: ReportData[] = [];

  @Output() selectReportTemplate = new EventEmitter<ReportData>();
  @Output() createReport = new EventEmitter<void>();
  @Output() editReport = new EventEmitter<ReportData>();
  @Output() generateReport = new EventEmitter<ReportData>();
  @Output() deleteReport = new EventEmitter<ReportData>();
  @Output() viewReport = new EventEmitter<ReportData>();
  @Output() downloadReport = new EventEmitter<ReportData>();
  @Output() regenerateReport = new EventEmitter<ReportData>();

  activeTab = 'templates';
  showReportForm = false;
  editingReport = false;

  // Form fields
  currentReport: ReportData = this.getEmptyReport();
  scheduleEnabled = false;
  scheduleFrequency = 'daily';
  scheduleDay = 1;
  scheduleTime = '08:00';
  scheduleRecipients: string[] = [];
  newRecipient = '';

  monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  availableSections = [
    // Server sections
    { id: 'overview', name: 'Общий обзор', type: 'server' },
    { id: 'performance', name: 'Производительность', type: 'server' },
    { id: 'alerts', name: 'Оповещения', type: 'server' },
    { id: 'recommendations', name: 'Рекомендации', type: 'server' },

    // Network sections
    { id: 'summary', name: 'Сводка', type: 'network' },
    { id: 'bandwidth', name: 'Пропускная способность', type: 'network' },
    { id: 'anomalies', name: 'Аномалии', type: 'network' },
    { id: 'devices', name: 'Устройства', type: 'network' },

    // Security sections
    { id: 'incidents', name: 'Инциденты', type: 'security' },
    { id: 'vulnerabilities', name: 'Уязвимости', type: 'security' },
    { id: 'compliance', name: 'Соответствие', type: 'security' },

    // User sections
    { id: 'activity', name: 'Активность', type: 'user' },
    { id: 'permissions', name: 'Разрешения', type: 'user' },
    { id: 'logins', name: 'Входы в систему', type: 'user' }
  ];

  getReportTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      server: '🖥️',
      network: '🌐',
      security: '🛡️',
      user: '👥',
      custom: '📊'
    };
    return icons[type] || '📄';
  }

  getReportTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      server: 'Серверы',
      network: 'Сеть',
      security: 'Безопасность',
      user: 'Пользователи',
      custom: 'Пользовательский'
    };
    return labels[type] || type;
  }

  getPeriodLabel(period: string): string {
    const labels: { [key: string]: string } = {
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
      custom: 'Пользовательский'
    };
    return labels[period] || period;
  }

  getScheduleLabel(schedule?: any): string {
    if (!schedule || !schedule.enabled) {
      return 'Не запланирован';
    }

    let label = '';

    switch (schedule.frequency) {
      case 'daily':
        label = 'Ежедневно';
        break;
      case 'weekly':
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        label = `Еженедельно (${days[schedule.day]})`;
        break;
      case 'monthly':
        label = `Ежемесячно (${schedule.day} число)`;
        break;
    }

    return `${label} в ${schedule.time}`;
  }

  getRecipientsList(report: ReportData): string {
    if (!report.schedule || !report.schedule.recipients || report.schedule.recipients.length === 0) {
      return 'Нет получателей';
    }
    return report.schedule.recipients.join(', ');
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Никогда';

    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onCreateReport() {
    this.editingReport = false;
    this.currentReport = this.getEmptyReport();
    this.initFormFromReport(this.currentReport);
    this.showReportForm = true;
  }

  onSelectReportTemplate(template: ReportData) {
    this.selectReportTemplate.emit(template);
  }

  onScheduleReport(template: ReportData) {
    this.editingReport = false;
    this.currentReport = { ...template, id: `sched-${Date.now()}` };
    this.scheduleEnabled = true;
    this.initFormFromReport(this.currentReport);
    this.showReportForm = true;
  }

  onEditReport(report: ReportData) {
    this.editingReport = true;
    this.currentReport = { ...report };
    this.initFormFromReport(this.currentReport);
    this.showReportForm = true;
  }

  onGenerateReport(report: ReportData) {
    this.generateReport.emit(report);
  }

  onDeleteReport(report: ReportData) {
    this.deleteReport.emit(report);
  }

  onViewReport(report: ReportData) {
    this.viewReport.emit(report);
  }

  onDownloadReport(report: ReportData) {
    this.downloadReport.emit(report);
  }

  onRegenerateReport(report: ReportData) {
    this.regenerateReport.emit(report);
  }

  closeReportForm() {
    this.showReportForm = false;
  }

  saveReport() {
    // Update report with form values
    if (this.scheduleEnabled) {
      this.currentReport.schedule = {
        enabled: true,
        frequency: this.scheduleFrequency as any,
        day: this.scheduleDay,
        time: this.scheduleTime,
        recipients: [...this.scheduleRecipients]
      };
    } else {
      if (this.currentReport.schedule) {
        this.currentReport.schedule.enabled = false;
      }
    }

    if (this.editingReport) {
      this.editReport.emit(this.currentReport);
    } else {
      if (this.scheduleEnabled) {
        // Add to scheduled reports
        this.scheduledReports.push(this.currentReport);
      } else {
        // Generate immediately
        this.generateReport.emit(this.currentReport);
      }
    }

    this.closeReportForm();
  }

  addRecipient() {
    if (this.newRecipient && this.isValidEmail(this.newRecipient)) {
      if (!this.scheduleRecipients.includes(this.newRecipient)) {
        this.scheduleRecipients.push(this.newRecipient);
      }
      this.newRecipient = '';
    }
  }

  removeRecipient(index: number) {
    this.scheduleRecipients.splice(index, 1);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isSelectedSection(sectionId: string): boolean {
    return this.currentReport.config.sections.includes(sectionId);
  }

  toggleSection(sectionId: string) {
    const index = this.currentReport.config.sections.indexOf(sectionId);
    if (index >= 0) {
      this.currentReport.config.sections.splice(index, 1);
    } else {
      this.currentReport.config.sections.push(sectionId);
    }
  }

  getEmptyReport(): ReportData {
    return {
      id: `report-${Date.now()}`,
      name: 'Новый отчет',
      type: 'server',
      period: 'daily',
      format: 'pdf',
      config: {
        sections: ['overview', 'performance'],
        filters: { status: 'all' }
      }
    };
  }

  initFormFromReport(report: ReportData) {
    // Initialize form fields from report
    if (report.schedule) {
      this.scheduleEnabled = report.schedule.enabled;
      this.scheduleFrequency = report.schedule.frequency;
      this.scheduleDay = report.schedule.day || 1;
      this.scheduleTime = report.schedule.time;
      this.scheduleRecipients = [...(report.schedule.recipients || [])];
    } else {
      this.scheduleEnabled = false;
      this.scheduleFrequency = 'daily';
      this.scheduleDay = 1;
      this.scheduleTime = '08:00';
      this.scheduleRecipients = [];
    }
  }
}

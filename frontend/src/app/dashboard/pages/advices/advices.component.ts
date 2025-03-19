import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'security' | 'performance' | 'network' | 'infrastructure' | 'cost';
  actions: string[];
  impact: string;
  timeToFix: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'completed' | 'ignored';
}

type PriorityFilter = AIRecommendation['priority'] | null;
type TypeFilter = AIRecommendation['type'] | null;

@Component({
  selector: 'app-advices',
  imports: [ CommonModule ],
  templateUrl: './advices.component.html',
  styleUrl: './advices.component.scss'
})
export class AdvicesComponent {

  priorityFilter: PriorityFilter = null;
  typeFilter: TypeFilter = null;

  recommendations: AIRecommendation[] = [
    {
      id: '1',
      title: 'Критическая уязвимость в системе безопасности',
      description: 'Обнаружена критическая уязвимость CVE-2024-1234 в основном файрволе. Требуется немедленное обновление для предотвращения потенциальных атак.',
      priority: 'critical',
      type: 'security',
      actions: [
        'Обновить программное обеспечение файрвола до последней версии',
        'Проверить логи на наличие подозрительной активности',
        'Провести полное сканирование системы'
      ],
      impact: 'Критическое влияние на безопасность всей сети',
      timeToFix: '1-2 часа',
      createdAt: '10 минут назад',
      status: 'new'
    },
    {
      id: '2',
      title: 'Оптимизация производительности серверов',
      description: 'Анализ показывает возможность увеличения производительности на 25% путем оптимизации конфигурации и балансировки нагрузки.',
      priority: 'high',
      type: 'performance',
      actions: [
        'Настроить балансировку нагрузки между серверами',
        'Оптимизировать кэширование',
        'Обновить конфигурацию веб-сервера'
      ],
      impact: 'Увеличение производительности на 25%',
      timeToFix: '4-6 часов',
      createdAt: '2 часа назад',
      status: 'in_progress'
    },
    {
      id: '3',
      title: 'Рекомендации по энергоэффективности',
      description: 'Выявлены возможности оптимизации энергопотребления в серверной инфраструктуре без влияния на производительность.',
      priority: 'medium',
      type: 'infrastructure',
      actions: [
        'Настроить автоматическое отключение неиспользуемых ресурсов',
        'Оптимизировать расписание бэкапов',
        'Обновить политики управления питанием'
      ],
      impact: 'Снижение энергопотребления на 15%',
      timeToFix: '1-2 дня',
      createdAt: '1 день назад',
      status: 'new'
    },
    {
      id: '4',
      title: 'Оптимизация сетевых маршрутов',
      description: 'Обнаружена возможность оптимизации сетевых маршрутов для уменьшения задержек и улучшения стабильности соединения.',
      priority: 'low',
      type: 'network',
      actions: [
        'Перенастроить маршрутизацию',
        'Обновить конфигурацию DNS',
        'Оптимизировать QoS политики'
      ],
      impact: 'Уменьшение задержек на 20%',
      timeToFix: '3-4 часа',
      createdAt: '3 дня назад',
      status: 'completed'
    }
  ];

  get filteredRecommendations(): AIRecommendation[] {
    return this.recommendations.filter(rec => {
      const matchesPriority = !this.priorityFilter || rec.priority === this.priorityFilter;
      const matchesType = !this.typeFilter || rec.type === this.typeFilter;
      return matchesPriority && matchesType;
    });
  }

  get hasActiveFilters(): boolean {
    return this.priorityFilter !== null || this.typeFilter !== null;
  }

  togglePriorityFilter(priority: AIRecommendation['priority']) {
    this.priorityFilter = this.priorityFilter === priority ? null : priority;
  }

  toggleTypeFilter(type: AIRecommendation['type']) {
    this.typeFilter = this.typeFilter === type ? null : type;
  }

  clearFilters() {
    this.priorityFilter = null;
    this.typeFilter = null;
  }

  getCriticalCount(): number {
    return this.recommendations.filter(r => r.priority === 'critical').length;
  }

  getHighCount(): number {
    return this.recommendations.filter(r => r.priority === 'high').length;
  }

  getMediumCount(): number {
    return this.recommendations.filter(r => r.priority === 'medium').length;
  }

  getLowCount(): number {
    return this.recommendations.filter(r => r.priority === 'low').length;
  }

  getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      critical: '⚠️',
      high: '❗',
      medium: '⚡',
      low: 'ℹ️'
    };
    return icons[priority] || '❓';
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      critical: 'Критический',
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий'
    };
    return labels[priority] || priority;
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      security: '🛡️',
      performance: '⚡',
      network: '🌐',
      infrastructure: '🏗️',
      cost: '💰'
    };
    return icons[type] || '❓';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      security: 'Безопасность',
      performance: 'Производительность',
      network: 'Сеть',
      infrastructure: 'Инфраструктура',
      cost: 'Стоимость'
    };
    return labels[type] || type;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      new: 'Новая',
      in_progress: 'В работе',
      completed: 'Выполнено',
      ignored: 'Игнорировано'
    };
    return labels[status] || status;
  }

}

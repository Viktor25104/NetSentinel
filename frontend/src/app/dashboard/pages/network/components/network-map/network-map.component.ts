import { Component, ElementRef, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { NetworkMap, NetworkDevice } from '../../interfaces/network.interface';
@Component({
  selector: 'app-network-map',
  imports: [CommonModule],
  templateUrl: './network-map.component.html',
  styleUrl: './network-map.component.scss'
})
export class NetworkMapComponent {
  @Input() networkMap!: NetworkMap;
  @Input() isFullscreen = false;
  @Output() nodeSelect = new EventEmitter<NetworkDevice>();

  @ViewChild('svg', { static: true }) svgElement!: ElementRef;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private svg: any;
  private width = 0;
  private height = 0;
  private simulation: any;

  private readonly nodeColors: { [key: string]: string } = {
    router: '#4CAF50',
    switch: '#2196F3',
    firewall: '#F44336',
    endpoint: '#9C27B0',
    iot: '#FF9800',
    server: '#607D8B'
  };

  ngOnInit() {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['networkMap'] || changes['isFullscreen']) {
      this.updateMap();
    }
  }

  private initializeMap() {
    const container = this.mapContainer.nativeElement;
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.svg = d3.select(this.svgElement.nativeElement)
      .attr('width', this.width)
      .attr('height', this.height);

    // Создаем группы для линий и узлов
    this.svg.append('g').attr('class', 'links');
    this.svg.append('g').attr('class', 'nodes');

    // Инициализируем симуляцию
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(50));

    this.updateMap();
  }

  private updateMap() {
    if (!this.networkMap) return;

    const container = this.mapContainer.nativeElement;
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.svg
      .attr('width', this.width)
      .attr('height', this.height);

    // Обновляем силу центрирования
    this.simulation.force('center')
      .x(this.width / 2)
      .y(this.height / 2);

    // Обновляем связи
    const links = this.svg.select('.links')
      .selectAll('.link')
      .data(this.networkMap.edges, (d: any) => d.id);

    links.exit().remove();

    const linksEnter = links.enter()
      .append('line')
      .attr('class', (d: any) => `link ${d.type} ${d.status}`);

    const linksUpdate = links.merge(linksEnter);

    // Обновляем узлы
    const nodes = this.svg.select('.nodes')
      .selectAll('.node')
      .data(this.networkMap.nodes, (d: any) => d.id);

    nodes.exit().remove();

    const nodesEnter = nodes.enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', this.dragstarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragended.bind(this)));

    nodesEnter.append('circle')
      .attr('r', 20)
      .style('fill', (d: any) => this.nodeColors[d.type]);

    nodesEnter.append('text')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.label);

    const nodesUpdate = nodes.merge(nodesEnter);

    // Обновляем симуляцию
    this.simulation
      .nodes(this.networkMap.nodes)
      .force('link').links(this.networkMap.edges);

    // Обновляем позиции при каждом тике
    this.simulation.on('tick', () => {
      linksUpdate
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodesUpdate
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Добавляем обработчик клика
    nodesUpdate.on('click', (event: any, d: any) => {
      this.nodeSelect.emit(d);
    });

    // Перезапускаем симуляцию
    this.simulation.alpha(1).restart();
  }

  private dragstarted(event: any) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  private dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  private dragended(event: any) {
    if (!event.active) this.simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
}

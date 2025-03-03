import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentSection } from '../../interfaces/documentation.interface';

@Component({
  selector: 'app-document-section',
  imports: [CommonModule],
  templateUrl: './document-section.component.html',
  styleUrl: './document-section.component.scss'
})
export class DocumentSectionComponent {
  @Input() section!: DocumentSection;
  @Input() content: any;
}

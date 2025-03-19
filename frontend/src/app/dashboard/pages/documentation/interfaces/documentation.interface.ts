export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  icon: string;
  sections: DocumentSection[];
}

export interface DocumentSection {
  id: string;
  title: string;
  type: 'text' | 'table' | 'list' | 'code' | 'image';
  content?: string;
  placeholder?: string;
  required?: boolean;
  options?: any[];
}

export interface Document {
  id: string;
  name: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
  sections: {
    [sectionId: string]: any;
  };
  tags: string[];
}

export type DocumentCategory = 
  | 'infrastructure' 
  | 'network' 
  | 'security' 
  | 'compliance' 
  | 'operations' 
  | 'incident';

export interface DocumentFilter {
  category?: DocumentCategory;
  status?: Document['status'];
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface ReportData {
  id: string;
  name: string;
  type: 'server' | 'network' | 'security' | 'user' | 'custom';
  period: 'daily' | 'weekly' | 'monthly' | 'custom';
  format: 'pdf' | 'html' | 'csv' | 'json';
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    day?: number;
    time: string;
    recipients: string[];
  };
  lastGenerated?: string;
  config: {
    sections: string[];
    filters: any;
    customFields?: any[];
  };
}

export type LeadStatus = 'New Lead' | 'Hot' | 'Follow-up' | 'Negotiation' | 'Closed' | 'Viewing' | 'Warm Prospect';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  profession: string;
  city: string;
  location: string;
  status: LeadStatus;
  avatar: string;
  projectName?: string;
  propertyType?: string;
  budgetRange?: string;
  notes?: string;
  followUpDate?: string;
  followUpType?: 'Call' | 'Meeting' | 'Visit';
  followUpTime?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export enum View {
  DASHBOARD = 'dashboard',
  CLIENTS = 'clients',
  OVERVIEW = 'overview',
  ASSISTANT = 'assistant',
  SETTINGS = 'settings',
  ADD_CLIENT = 'add_client',
  EDIT_CLIENT = 'edit_client'
}

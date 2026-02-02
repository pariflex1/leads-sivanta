
import { Client } from './types';

export const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
export const N8N_WEBHOOK_URL = 'https://n8n.jhansiproperty.com/webhook/e875f655-c535-462b-ac03-7a0eca4bd5ea/chat';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Robert Fox',
    phone: '+1 234 567 890',
    email: 'robert@fox.com',
    profession: 'Engineer',
    city: 'New York',
    location: 'New York',
    status: 'Hot',
    avatar: 'https://picsum.photos/seed/robert/200',
    notes: 'Looking for a high-end condo.'
  },
  {
    id: '2',
    name: 'Jane Cooper',
    phone: '+1 987 654 321',
    email: 'jane@cooper.com',
    profession: 'Designer',
    city: 'Los Angeles',
    location: 'Los Angeles',
    status: 'Viewing',
    avatar: 'https://picsum.photos/seed/jane/200',
    followUpDate: '2023-10-24',
    followUpTime: '10:00 AM',
    followUpType: 'Visit'
  },
  {
    id: '3',
    name: 'Cody Fisher',
    phone: '+1 555 012 345',
    email: 'cody@fisher.com',
    profession: 'Manager',
    city: 'Chicago',
    location: 'Chicago',
    status: 'Closed',
    avatar: 'https://picsum.photos/seed/cody/200'
  },
  {
    id: '4',
    name: 'Esther Howard',
    phone: '+1 333 444 555',
    email: 'esther@howard.com',
    profession: 'Nurse',
    city: 'Miami',
    location: 'Miami',
    status: 'New Lead',
    avatar: 'https://picsum.photos/seed/esther/200'
  }
];

export const FOLLOW_UPS: Client[] = [
  {
    id: '5',
    name: 'John Doe',
    phone: '+1 111 222 333',
    email: 'john@doe.com',
    profession: 'Software Architect',
    city: 'Austin',
    location: 'Austin, TX',
    status: 'Warm Prospect',
    avatar: 'https://picsum.photos/seed/john/200',
    followUpTime: '10:30 AM',
    followUpType: 'Call',
    notes: 'Looking for a 3-bedroom modern farmhouse.'
  },
  {
    id: '6',
    name: 'Sarah Smith',
    phone: '+1 444 555 666',
    email: 'sarah@smith.com',
    profession: 'Attorney',
    city: 'San Francisco',
    location: 'San Francisco, CA',
    status: 'Viewing',
    avatar: 'https://picsum.photos/seed/sarah/200',
    followUpTime: '2:00 PM',
    followUpType: 'Meeting'
  }
];

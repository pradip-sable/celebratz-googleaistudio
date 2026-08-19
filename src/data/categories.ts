import { CategorySpec, CategoryId, PuneLocality, EventType } from '../types';

export const CATEGORIES: CategorySpec[] = [
  {
    id: 'venues',
    name: 'Venues',
    shortDescription: 'Banquet halls, lawns, resorts & farmhouses',
    iconName: 'Building2',
    defaultPricingUnit: 'per_day',
    unitLabel: 'per day',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'photography',
    name: 'Photography & Cinema',
    shortDescription: 'Candid wedding, pre-wedding & drone coverage',
    iconName: 'Camera',
    defaultPricingUnit: 'per_day',
    unitLabel: 'per day',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    id: 'catering',
    name: 'Catering Services',
    shortDescription: 'Authentic Maharashtrian, North Indian & Grand Buffets',
    iconName: 'Utensils',
    defaultPricingUnit: 'per_plate',
    unitLabel: 'per plate',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'decoration',
    name: 'Decoration & Themes',
    shortDescription: 'Floral mandaps, balloon styling & event themes',
    iconName: 'Sparkles',
    defaultPricingUnit: 'per_event',
    unitLabel: 'per event',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'music_dj',
    name: 'DJ, Music & Dhol Tasha',
    shortDescription: 'Sound systems, live bands & Bollywood DJs',
    iconName: 'Music',
    defaultPricingUnit: 'per_event',
    unitLabel: 'per event',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'pandit_priest',
    name: 'Pandits & Priests',
    shortDescription: 'Vedic ceremonies, Vivah, Griha Pravesh & rituals',
    iconName: 'Flame',
    defaultPricingUnit: 'per_event',
    unitLabel: 'per ceremony',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200'
  }
];

export const PUNE_LOCALITIES: PuneLocality[] = [
  'Baner',
  'Koregaon Park',
  'Kothrud',
  'Wakad',
  'Kalyani Nagar',
  'Hadapsar',
  'Viman Nagar',
  'Sinhagad Road',
  'Aundh',
  'Hinjewadi'
];

export const EVENT_TYPES: EventType[] = [
  'Wedding',
  'Birthday',
  'Engagement',
  'Naming Ceremony',
  'Corporate'
];

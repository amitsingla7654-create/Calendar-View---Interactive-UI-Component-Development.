import type { CalendarEvent } from '@/utils/event.utils';

export interface CalendarViewProps {
  events: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (id: string, event: CalendarEvent) => void;
  onEventDelete?: (id: string) => void;
  initialView?: 'month' | 'week';
  initialDate?: Date;
}

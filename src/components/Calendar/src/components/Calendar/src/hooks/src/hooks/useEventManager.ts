import { useState } from 'react';
import type { CalendarEvent } from '@/utils/event.utils';

export const useEventManager = (initialEvents: CalendarEvent[]) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const add = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const update = (id: string, updated: CalendarEvent) => {
    setEvents(prev => prev.map(ev => (ev.id === id ? updated : ev)));
  };

  const remove = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  return {
    events,
    add,
    update,
    remove
  };
};

import React from 'react';
import { CalendarView } from './CalendarView';
import type { CalendarEvent } from '@/utils/event.utils';

const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    startDate: new Date(),
    endDate: new Date(),
    color: '#3b82f6'
  }
];

export default {
  title: 'Calendar/CalendarView',
  component: CalendarView
};

export const Default = () => (
  <div className="p-4">
    <CalendarView
      events={sampleEvents}
      onEventAdd={() => {}}
      onEventUpdate={() => {}}
      onEventDelete={() => {}}
    />
  </div>
);

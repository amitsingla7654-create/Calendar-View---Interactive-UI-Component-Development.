import React from 'react';
import type { CalendarEvent } from '@/utils/event.utils';

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onDayClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ date, events, onDayClick, onEventClick }) => {
  return (
    <div>
      <p>Month view for {date.toDateString()}</p>
      {/* TODO: Render calendar grid and events */}
    </div>
  );
};

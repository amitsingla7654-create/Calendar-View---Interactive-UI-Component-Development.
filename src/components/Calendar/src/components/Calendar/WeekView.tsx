import React from 'react';
import type { CalendarEvent } from '@/utils/event.utils';

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
}

export const WeekView: React.FC<WeekViewProps> = ({ date, events }) => {
  return (
    <div>
      <p>Week view for {date.toDateString()}</p>
      {/* TODO: Render week layout and events */}
    </div>
  );
};

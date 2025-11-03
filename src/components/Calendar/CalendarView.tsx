import React, { useState } from 'react';
import type { CalendarViewProps } from './CalendarView.types';
import { useCalendar } from '@/hooks/useCalendar';
import { useEventManager } from '@/hooks/useEventManager';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events: initialEvents,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate
}) => {
  const { currentDate, view, setView, goToNextMonth, goToPreviousMonth, goToToday } = useCalendar(initialDate || new Date());
  const { events, add, update, remove } = useEventManager(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const handleDayClick = (d: Date) => {
    setEditing({ startDate: d, endDate: d });
    setModalOpen(true);
  };

  const handleEventClick = (ev: any) => {
    setEditing(ev);
    setModalOpen(true);
  };

  const handleSave = (ev: any) => {
    if (editing?.id) {
      update(editing.id, ev);
      onEventUpdate?.(editing.id, ev);
    } else {
      add(ev);
      onEventAdd?.(ev);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    remove(id);
    onEventDelete?.(id);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={goToPreviousMonth}>Prev</button>
          <button onClick={goToToday}>Today</button>
          <button onClick={goToNextMonth}>Next</button>
        </div>
        <div>
          <select value={view} onChange={e => setView(e.target.value as any)}>
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
      </div>
      {view === 'month' ? (
        <MonthView date={currentDate} events={events} onDayClick={handleDayClick} onEventClick={handleEventClick} />
      ) : (
        <WeekView date={currentDate} events={events} />
      )}
      <EventModal
        open={modalOpen}
        initial={editing}
        onCancel={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

// Repository scaffold for Calendar View Component (concatenated files)

// package.json
{
  "name": "calendar-view-[yourname]",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "date-fns": "^2.30.0",
    "clsx": "^1.2.1"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "storybook": "^7.0.0",
    "@storybook/react": "^7.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "ES2020"],
    "jsx": "react-jsx",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {50: '#f0f9ff',100: '#e0f2fe',500: '#0ea5e9',600: '#0284c7',700: '#0369a1'},
        neutral: {50: '#fafafa',100: '#f4f4f5',200: '#e4e4e7',300: '#d4d4d8',700: '#3f3f46',900: '#18181b'}
      },
      spacing: {18: '4.5rem', 88: '22rem'},
      borderRadius: {xl: '0.75rem'}
    }
  },
  plugins: []
}

// .storybook/main.ts
import { defineConfig } from 'ts-node';
export default {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react'
}

// .storybook/preview.ts
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

// src/styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }

/* focus-visible replacement */
:focus-visible { outline: 3px solid rgba(14,165,233,0.6); outline-offset: 2px; }

// src/utils/date.utils.ts
export const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

export const getCalendarGrid = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDay);
  const grid: Date[] = [];
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return grid;
}

// src/utils/event.utils.ts
import { isSameDay } from './date.utils';
export interface CalendarEvent { id: string; title: string; description?: string; startDate: Date; endDate: Date; color?: string; category?: string }
export const eventsForDay = (events: CalendarEvent[], day: Date) => events.filter(e => isSameDay(e.startDate, day));

// src/hooks/useCalendar.ts
import { useCallback, useState } from 'react';
export const useCalendar = (initialDate = new Date()) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [view, setView] = useState<'month'|'week'>('month');
  const goToNextMonth = useCallback(() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)), []);
  const goToPreviousMonth = useCallback(() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)), []);
  const goToToday = useCallback(() => setCurrentDate(new Date()), []);
  return { currentDate, view, setView, goToNextMonth, goToPreviousMonth, goToToday, setCurrentDate };
}

// src/hooks/useEventManager.ts
import { useCallback, useState } from 'react';
import type { CalendarEvent } from '@/utils/event.utils';
export const useEventManager = (initial: CalendarEvent[] = []) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initial);
  const add = useCallback((e: CalendarEvent) => setEvents(prev => [...prev, e]), []);
  const update = useCallback((id: string, updates: Partial<CalendarEvent>) => setEvents(prev => prev.map(ev => ev.id === id ? {...ev, ...updates} : ev)), []);
  const remove = useCallback((id: string) => setEvents(prev => prev.filter(ev => ev.id !== id)), []);
  return { events, add, update, remove };
}

// src/components/primitives/Button.tsx
import React from 'react';
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button {...props} className={`px-3 py-1 rounded-xl bg-primary-500 text-white hover:opacity-90 focus-visible:outline-none ${props.className || ''}`}>{children}</button>
);

// src/components/Calendar/CalendarView.types.ts
import type { CalendarEvent } from '@/utils/event.utils';
export interface CalendarViewProps { events: CalendarEvent[]; onEventAdd: (event: CalendarEvent) => void; onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void; onEventDelete: (id: string) => void; initialView?: 'month'|'week'; initialDate?: Date }

// src/components/Calendar/CalendarCell.tsx
import React from 'react';
import { isSameDay } from '@/utils/date.utils';
import type { CalendarEvent } from '@/utils/event.utils';
interface Props { date: Date; events: CalendarEvent[]; isToday: boolean; isOtherMonth: boolean; onClick: (date: Date)=>void; onEventClick: (ev: CalendarEvent)=>void }
export const CalendarCell: React.FC<Props> = React.memo(({ date, events, isToday, isOtherMonth, onClick, onEventClick }) => {
  return (
    <div role="button" tabIndex={0} aria-label={`Calendar cell ${date.toDateString()}, ${events.length} events`} onClick={()=>onClick(date)} onKeyDown={(e)=>{if(e.key==='Enter') onClick(date)}} className={`border border-neutral-200 h-32 p-2 hover:bg-neutral-50 transition-colors cursor-pointer ${isOtherMonth? 'text-neutral-400':''}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-medium">{date.getDate()}</span>
        {isToday && <span className="w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center">{date.getDate()}</span>}
      </div>
      <div className="space-y-1 overflow-hidden">
        {events.slice(0,3).map(ev=> (
          <div key={ev.id} className="text-xs px-2 py-1 rounded truncate" style={{backgroundColor: ev.color}} onClick={(e)=>{e.stopPropagation(); onEventClick(ev)}}>{ev.title}</div>
        ))}
        {events.length>3 && <button className="text-xs text-primary-600 hover:underline">+{events.length-3} more</button>}
      </div>
    </div>
  )
});

// src/components/Calendar/MonthView.tsx
import React from 'react';
import { getCalendarGrid, isSameDay } from '@/utils/date.utils';
import { eventsForDay } from '@/utils/event.utils';
import type { CalendarEvent } from '@/utils/event.utils';
import { CalendarCell } from './CalendarCell';
interface Props { date: Date; events: CalendarEvent[]; onDayClick: (d: Date)=>void; onEventClick: (e: CalendarEvent)=>void }
export const MonthView: React.FC<Props> = ({ date, events, onDayClick, onEventClick }) => {
  const grid = getCalendarGrid(date);
  const month = date.getMonth();
  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=> <div key={d} className="text-center py-2 font-medium">{d}</div>)}
      {grid.map((d,i)=> (
        <CalendarCell key={i} date={d} events={eventsForDay(events, d)} isToday={isSameDay(d, new Date())} isOtherMonth={d.getMonth()!==month} onClick={onDayClick} onEventClick={onEventClick} />
      ))}
    </div>
  )
}

// src/components/Calendar/WeekView.tsx
import React from 'react';
import type { CalendarEvent } from '@/utils/event.utils';
interface Props { date: Date; events: CalendarEvent[] }
export const WeekView: React.FC<Props> = ({ date, events }) => {
  // Minimal stub — implement time slots & positioning later
  return (
    <div className="border p-4">Week view (stub) — implement timeslots and event positioning.</div>
  )
}

// src/components/Calendar/EventModal.tsx
import React, { useState } from 'react';
import type { CalendarEvent } from '@/utils/event.utils';
interface Props { open: boolean; initial?: Partial<CalendarEvent>; onCancel: ()=>void; onSave: (ev: CalendarEvent)=>void; onDelete?: (id: string)=>void }
export const EventModal: React.FC<Props> = ({ open, onCancel, initial, onSave, onDelete }) => {
  const [title, setTitle] = useState(initial?.title||'');
  const [start, setStart] = useState(initial?.startDate ? initial.startDate.toISOString().slice(0,16): new Date().toISOString().slice(0,16));
  const [end, setEnd] = useState(initial?.endDate ? initial.endDate.toISOString().slice(0,16): new Date().toISOString().slice(0,16));
  if(!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-modal w-full max-w-lg">
        <h2 id="modal-title" className="text-lg font-semibold mb-2">{initial? 'Edit Event':'Add Event'}</h2>
        <label className="block">Title (required)</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 border rounded mb-2" maxLength={100} />
        <label>Start</label>
        <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <label>End</label>
        <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <div className="flex justify-end space-x-2">
          {initial?.id && <button className="px-3 py-1 rounded text-red-600" onClick={()=>onDelete && onDelete(initial.id)}>Delete</button>}
          <button className="px-3 py-1 rounded border" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1 rounded bg-primary-500 text-white" onClick={()=>onSave({ id: initial?.id||String(Date.now()), title, startDate: new Date(start), endDate: new Date(end) } as CalendarEvent)}>Save</button>
        </div>
      </div>
    </div>
  )
}

// src/components/Calendar/CalendarView.tsx
import React, { useState } from 'react';
import type { CalendarViewProps } from './CalendarView.types';
import { useCalendar } from '@/hooks/useCalendar';
import { useEventManager } from '@/hooks/useEventManager';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
export const CalendarView: React.FC<CalendarViewProps> = ({ events: initialEvents, onEventAdd, onEventUpdate, onEventDelete, initialView='month', initialDate }) => {
  const { currentDate, view, setView, goToNextMonth, goToPreviousMonth, goToToday } = useCalendar(initialDate||new Date());
  const { events, add, update, remove } = useEventManager(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const handleDayClick = (d: Date) => { setEditing({ startDate: d, endDate: d }); setModalOpen(true); }
  const handleEventClick = (ev: any) => { setEditing(ev); setModalOpen(true); }
  const handleSave = (ev: any) => { if(editing?.id){ update(editing.id, ev); onEventUpdate?.(editing.id, ev); } else { add(ev); onEventAdd?.(ev); } setModalOpen(false); }
  const handleDelete = (id: string) => { remove(id); onEventDelete?.(id); setModalOpen(false); }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={goToPreviousMonth} aria-label="Previous">Prev</button>
          <button onClick={goToToday} aria-label="Today">Today</button>
          <button onClick={goToNextMonth} aria-label="Next">Next</button>
        </div>
        <div>
          <select value={view} onChange={e=>setView(e.target.value as any)}>
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
      </div>
      {view==='month' ? <MonthView date={currentDate} events={events} onDayClick={handleDayClick} onEventClick={handleEventClick} /> : <WeekView date={currentDate} events={events} />}
      <EventModal open={modalOpen} initial={editing} onCancel={()=>setModalOpen(false)} onSave={handleSave} onDelete={handleDelete} />
    </div>
  )
}

// src/components/Calendar/CalendarView.stories.tsx
import React from 'react';
import { CalendarView } from './CalendarView';
import type { CalendarEvent } from '@/utils/event.utils';
const sampleEvents: CalendarEvent[] = [ { id: 'evt-1', title: 'Team Standup', startDate: new Date(), endDate: new Date(), color: '#3b82f6' } ];
export default { title: 'Calendar/CalendarView', component: CalendarView };
export const Default = () => <div className="p-4"><CalendarView events={sampleEvents} onEventAdd={()=>{}} onEventUpdate={()=>{}} onEventDelete={()=>{}} /></div>;

// src/main.tsx (app entry - minimal)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarView } from './components/Calendar/CalendarView';
import './styles/globals.css';
const root = createRoot(document.getElementById('root')!);
root.render(<div className="p-8"><CalendarView events={[]} onEventAdd={()=>{}} onEventUpdate={()=>{}} onEventDelete={()=>{}} /></div>);

// README.md (short)
# Calendar View Component

This scaffold contains a starting implementation for the Calendar View assignment. Files included:
- src/components/Calendar/* core components
- src/hooks/* custom hooks
- src/utils/* utilities

How to run locally:
1. npm install
2. npm run dev
3. npm run storybook

Notes: WeekView and full interactions (drag-to-create, overlapping event layout, virtualization) are scaffolded but marked as TODO. Implement those next for full compliance.


// End of scaffold

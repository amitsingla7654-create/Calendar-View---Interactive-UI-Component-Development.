import React from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarView } from './components/Calendar/CalendarView';
import './styles/globals.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <div className="p-8">
    <CalendarView events={[]} onEventAdd={()=>{}} onEventUpdate={()=>{}} onEventDelete={()=>{}} />
  </div>
);

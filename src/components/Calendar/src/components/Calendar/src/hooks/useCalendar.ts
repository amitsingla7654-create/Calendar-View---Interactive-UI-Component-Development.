import { useState } from 'react';

export const useCalendar = (initialDate: Date) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<'month' | 'week'>('month');

  const goToNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(next);
  };

  const goToPreviousMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prev);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    view,
    setView,
    goToNextMonth,
    goToPreviousMonth,
    goToToday
  };
};

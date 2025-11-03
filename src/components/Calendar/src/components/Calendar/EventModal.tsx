import React from 'react';
import type { CalendarEvent } from '@/utils/event.utils';

interface EventModalProps {
  open: boolean;
  initial?: CalendarEvent | null;
  onCancel: () => void;
  onSave: (event: CalendarEvent) =>

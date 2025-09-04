import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const EmployeeCalendar = () => {
  const events = [
    { title: 'Team Meeting', date: '2023-06-15' },
    { title: 'Project Deadline', date: '2023-06-20' },
    { title: '1:1 with Manager', date: '2023-06-22' },
  ];

  return (
    <div className="employee-calendar">
      <h1>My Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
      />
    </div>
  );
};

export default EmployeeCalendar;
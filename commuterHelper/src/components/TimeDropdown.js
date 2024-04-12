import React from 'react';
import { Form, Dropdown } from 'react-bootstrap';

const TimeDropdown = ({ selectedTime, onTimeChange }) => {
  const timeOptions = [
    '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM',
    '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM'
  ];

  return (
    <Dropdown onSelect={(eventKey) => onTimeChange(eventKey)}>
      <Dropdown.Toggle variant="info" className="btn-lg">
        {selectedTime || 'Select Time'}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ maxHeight: '150px', overflowY: 'auto' }}>
        {timeOptions.map((time, index) => (
          <Dropdown.Item key={index} eventKey={time}>
            {time}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TimeDropdown;
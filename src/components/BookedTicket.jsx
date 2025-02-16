import React, { useEffect, useState } from 'react'
import EventTicket from './EventTicket';

const BookedTicket = () => {
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    // Get ticket details first
    const details = JSON.parse(localStorage.getItem('ticketDetails') || '{}');
    const existingTickets = JSON.parse(localStorage.getItem('myTickets') || '[]');
    
    if (Object.keys(details).length > 0) {
      setTicketDetails(details);

      // add new ticket details to storage
      const updatedTickets = [...existingTickets, details];
      localStorage.setItem('myTickets', JSON.stringify(updatedTickets));

      setTimeout(() => {
        localStorage.removeItem('ticketDetails');
      }, 0);
    } else if (existingTickets.length > 0) {
      // If no ticket details, show the most recent ticket
      setTicketDetails(existingTickets[existingTickets.length - 1]);
    }
  }, []);

  return <div className='max-w-72 sm:max-w-sm mx-auto'>
    <EventTicket isStep={true} ticketDetails={ticketDetails} />
  </div>

}

export default BookedTicket;
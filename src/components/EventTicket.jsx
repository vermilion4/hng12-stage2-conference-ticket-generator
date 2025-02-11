import Image from 'next/image';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { eventDetails } from '@/constants/eventDetails';

const EventTicket = ({ ticketDetails }) => {

  if (!ticketDetails) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex scale-100 origin-top">
      <div className="relative flex bg-bordertwo rounded-l-[16.96px] rounded-r-[5.96px] border-[4.84px] border-[#D9D9D9] overflow-hidden">
        {/* Main Ticket Content */}
        <div className="flex-grow p-6 relative">
          <div className="flex flex-wrap gap-4 sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 mb-4">
            {/* QR Code and image Section */}
            <div className="bg-white w-32 h-32 sm:w-40 sm:h-40 p-2 rounded-lg relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <QRCodeSVG
                  value={`${ticketDetails.name}-${ticketDetails.email}-${ticketDetails.ticketType}`}
                  size="100%"
                  className="w-full h-full p-2"
                />
              </div>
              <div className="relative w-full h-full">
                <Image
                  src={ticketDetails.photo}
                  alt="Profile Photo"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  style={{ mixBlendMode: 'multiply' }}
                  priority
                />
              </div>
            </div>

            {/* Event Details Section */}
            <div className="flex-grow text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-3 font-roadrage break-words text-start">{eventDetails.title}</h2>
              <div className="space-y-1 sm:space-y-2">
                {/* email */}
                <p className="flex items-center text-white text-xs sm:text-sm lg:text-base break-words">📧 {ticketDetails.email}</p>
                {/* location */}
                <p className="flex items-center text-white text-xs sm:text-sm lg:text-base break-words">
                  📍 {eventDetails.location}
                </p>
                {/* date and time */}
                <p className="flex items-center text-white text-xs sm:text-sm lg:text-base">
                  📅 {eventDetails.date} | {eventDetails.time}
                </p>
              </div>
            </div>

            {/* ticket type */}
            <div className="bg-gradient-to-r from-[#F9DBAF] via-[#938167] to-[#F9DBAF] p-2 -rotate-[35deg] w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 flex items-center justify-center text-[#052930]">
              <div className="rotate-[55deg] text-xl sm:text-2xl lg:text-3xl font-roadrage uppercase">{ticketDetails.ticketType.slice(0, 3)}</div>
            </div>
          </div>
          
          {/* Bottom Text */}
          <div className="pl-4 py-1 sm:pl-10 text-bordertwo font-black font-roboto bg-[#567D83] text-start text-xs sm:text-sm absolute bottom-0 left-0 w-full">
            Ticket for {ticketDetails.numberOfTickets} {ticketDetails.numberOfTickets === 1 ? 'entry' : 'entries'} only
          </div>
        </div>
      </div>
      {/* bars */}
      <div className='w-2 sm:w-3 bg-[#D9D9D9] flex flex-col justify-between gap-[2.42px] rounded-lg overflow-hidden'>
        {[...Array(25)].map((_, i) => (
          <div 
            key={i}
            className='h-1 sm:h-1.5 w-2 sm:w-3 rounded-full bg-[#052930]'
          />
        ))}
      </div>

      {/* Ticket end details */}
      <div className="w-12 sm:w-16 lg:w-24 bg-bordertwo flex flex-col items-center justify-between p-2 border-[4.84px] border-[#D9D9D9] rounded-l-[5.96px] rounded-r-[16.96px]">
        <div className="text-white rotate-90 whitespace-nowrap transform origin-center translate-y-6 sm:translate-y-8 lg:translate-y-12">
          <p className="font-roadrage leading-5 text-lg sm:text-xl lg:text-2xl">Techember Test '25</p>
          <p className="text-[8px] sm:text-[10px] lg:text-xs mt-1 font-roboto"><span className='font-semibold'>User Name:</span> {ticketDetails.name}</p>
        </div>
        <div className="bg-gradient-to-r from-[#F9DBAF] via-[#938167] to-[#F9DBAF] p-1 sm:p-1.5 lg:p-2 rotate-45 w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 flex items-center justify-center text-[#052930]">
          <div className="-rotate-45 uppercase text-xs sm:text-sm lg:text-base font-roadrage">{ticketDetails.ticketType.slice(0, 3)}</div>
        </div>
      </div>
    </div>
  );
};

export default EventTicket;
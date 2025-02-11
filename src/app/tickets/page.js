'use client'
import React, { useEffect, useState, useRef } from 'react'
import EventTicket from '@/components/EventTicket'
import { toPng } from 'html-to-image'

const TicketsPage = () => {
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadingTickets, setDownloadingTickets] = useState({})
  const [searchQuery, setSearchQuery] = useState({ name: '', email: '' })
  const ticketRefs = useRef({})

  // Load tickets from local storage and reverse them
  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true)
      const savedTickets = JSON.parse(localStorage.getItem('myTickets') || '[]').reverse()
      setTickets(savedTickets)
      setFilteredTickets(savedTickets)
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsLoading(false)
    }
    loadTickets()
  }, [])

  // Tickets Search and Filter
  useEffect(() => {
    const filtered = tickets.filter(ticket => {
      const nameMatch = ticket.name.toLowerCase().includes(searchQuery.name.toLowerCase())
      const emailMatch = ticket.email.toLowerCase().includes(searchQuery.email.toLowerCase())
      return nameMatch && emailMatch
    })
    setFilteredTickets(filtered)
  }, [searchQuery, tickets])

  // Download ticket
  const downloadTicket = async (index) => {
    try {
      setDownloadingTickets(prev => ({ ...prev, [index]: true }))
      const element = ticketRefs.current[index]
      if (!element) {
        throw new Error('Ticket element not found')
      }

      // Remove hover effects temporarily
      const originalTransform = element.style.transform
      element.style.transform = 'none'
      
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        skipAutoScale: true,
        style: {
          transform: 'none',
          transition: 'none'
        }
      })

      // Restore hover effects
      element.style.transform = originalTransform

      // Create download link
      const link = document.createElement('a')
      link.download = `ticket-${tickets[index].eventName || 'event'}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error downloading ticket:', err.message || err)
      // You might want to add error handling UI here
    } finally {
      setDownloadingTickets(prev => ({ ...prev, [index]: false }))
    }
  }

  // Ticket Skeleton Loader
  const TicketSkeleton = () => (
    <div className="animate-pulse">
      <div className="w-full max-w-3xl mx-auto flex">
        <div className="flex-grow bg-gray-300 h-[200px] rounded-l-[16.96px] rounded-r-[5.96px]"></div>
        <div className="w-2 sm:w-3 bg-gray-200 flex flex-col justify-between gap-[2.42px] rounded-lg"></div>
        <div className="w-12 sm:w-16 lg:w-24 bg-gray-300 rounded-l-[5.96px] rounded-r-[16.96px]"></div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="bg-gray-300 h-10 w-36 rounded-lg"></div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative z-20">
      <h1 className="text-4xl md:text-5xl font-roadrage text-center mb-12">My Tickets</h1>

      {/* Search Area */}
      <div className="mb-8 p-6 bg-greenfour rounded-[32px] border border-greenthree">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery.name}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-greentwo border border-greenthree focus:border-greenone focus:outline-none text-darkgrey placeholder-lightgrey transition-colors"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery.email}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-greentwo border border-greenthree focus:border-greenone focus:outline-none text-darkgrey placeholder-lightgrey transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Tickets Loading and Display (fall back for no tickets) */}
      {isLoading ? (
        <div className="space-y-16">
          {[...Array(2)].map((_, i) => (
            <TicketSkeleton key={i} />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center font-roboto text-lightgrey">
          <p className="text-xl">No tickets found</p>
          <p className="mt-2">Book some tickets to see them here!</p>
        </div>
      ) : (
        <div className="space-y-16">
          {filteredTickets.map((ticket, index) => (
            <div key={index} className="space-y-4">
              <div 
                ref={el => {
                  if (el) ticketRefs.current[index] = el
                }}
                data-ticket={index}
                className="transform hover:scale-[1.02] transition-transform duration-300"
              >
                <EventTicket ticketDetails={ticket} />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => downloadTicket(index)}
                  disabled={downloadingTickets[index]}
                  className="bg-borderone hover:bg-bordertwo text-white font-roboto py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingTickets[index] ? 'Downloading...' : 'Download Ticket'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TicketsPage
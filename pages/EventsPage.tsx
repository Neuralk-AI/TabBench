
import React from 'react';

const EventsPage: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10">
      <header className="pb-1 md:pb-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Meetups & Events</h1>
        <p className="text-s sm:text-md text-gray-600 mt-1">
          Stay updated on TabBench related meetups, workshops, and events.
        </p>
      </header>
      <section className="p-4 sm:p-6 bg-slate-50 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Upcoming Events
        </h2>
        <p className="text-gray-600 mb-4">
          There are currently no upcoming events scheduled. Please check back soon!
        </p>
        
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 mt-6">
          Past Events
        </h2>
        <p className="text-gray-600 mb-4">
            Details of past workshops, presentations, or community meetups related to TabBench will be listed here.
        </p>
        {/* Example of a past event entry (to be populated dynamically later)
        <div className="mb-4 p-3 border border-gray-200 rounded-md">
            <h3 className="font-semibold text-gray-700">TabBench Introduction Webinar</h3>
            <p className="text-sm text-gray-500">Date: January 15, 2024</p>
            <p className="text-sm text-gray-600 mt-1">An overview of the TabBench project, its goals, and initial findings.</p>
        </div>
        */}
         <p className="text-gray-600">
            We plan to organize and participate in events to share updates, gather feedback, and engage with the broader machine learning community.
            If you are interested in hosting an event or having TabBench presented, please contact us.
        </p>
      </section>
    </div>
  );
};

export default EventsPage;
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  List,
  MapPin,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import "../styles/myShifts.css";

const weekDays = [
  { day: "Mon", date: "23 Jun", shift: null },
  {
    day: "Tue",
    date: "24 Jun",
    shift: {
      time: "9:00 am – 1:00 pm",
      client: "Aisha Foster",
    },
  },
  {
    day: "Wed",
    date: "25 Jun",
    shift: {
      time: "10:00 am – 2:00 pm",
      client: "Brian Lewis",
    },
  },
  { day: "Thu", date: "26 Jun", shift: null },
  {
    day: "Fri",
    date: "27 Jun",
    shift: {
      time: "9:00 am – 5:00 pm",
      client: "Claire Campbell",
    },
  },
  { day: "Sat", date: "28 Jun", shift: null },
  { day: "Sun", date: "29 Jun", shift: null },
];

const upcomingShifts = [
  {
    day: "TUE",
    date: "24 Jun",
    client: "Aisha Foster",
    service: "Personal care",
    location: "Carlton, VIC 3053",
    time: "9:00 am – 1:00 pm (4 hours)",
    status: "Confirmed",
  },
  {
    day: "WED",
    date: "25 Jun",
    client: "Brian Lewis",
    service: "Medication support",
    location: "Richmond, VIC 3121",
    time: "10:00 am – 2:00 pm (4 hours)",
    status: "In progress",
  },
  {
    day: "FRI",
    date: "27 Jun",
    client: "Claire Campbell",
    service: "Respite care",
    location: "St Kilda, VIC 3182",
    time: "9:00 am – 5:00 pm (8 hours)",
    status: "Confirmed",
  },
  {
    day: "TUE",
    date: "1 Jul",
    client: "Margaret Lewis",
    service: "Personal care",
    location: "Elwood, VIC 3184",
    time: "2:00 pm – 6:00 pm (4 hours)",
    status: "Completed",
  },
];

function MyShifts() {
  return (
    <AppLayout>
      <main className="carer-page shifts-page">
        <section className="shifts-heading">
          <div>
            <h1>My shifts</h1>
            <p>
              View your upcoming shifts and manage your availability.
            </p>
          </div>

          <button className="set-availability-button" type="button">
            <CalendarDays size={17} />
            Set availability
          </button>
        </section>

        <section className="shift-view-controls">
          <div className="view-switch">
            <button className="active" type="button">
              <CalendarDays size={17} />
              Calendar
            </button>

            <button type="button">
              <List size={17} />
              List
            </button>
          </div>

          <div className="shift-summary-controls">
            <button className="upcoming-filter" type="button">
              <Filter size={17} />
              Upcoming
            </button>

            <div className="weekly-hours">
              <strong>32</strong>
              <span>hours this week</span>
            </div>
          </div>
        </section>

        <section className="weekly-calendar">
          <header className="week-navigation">
            <button type="button" aria-label="Previous week">
              <ChevronLeft size={18} />
            </button>

            <h2>23 – 29 June 2025</h2>

            <button type="button" aria-label="Next week">
              <ChevronRight size={18} />
            </button>
          </header>

          <div className="week-grid">
            {weekDays.map((item) => (
              <article className="week-day" key={item.date}>
                <header>
                  <strong>{item.day}</strong>
                  <span>{item.date}</span>
                </header>

                <div className="week-day-content">
                  {item.shift ? (
                    <div className="mini-shift">
                      <strong>{item.shift.time}</strong>
                      <span>{item.shift.client}</span>
                    </div>
                  ) : (
                    <span className="no-shift">–</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="upcoming-shifts-section">
          <h2>Upcoming shifts</h2>

          <div className="upcoming-shift-list">
            {upcomingShifts.map((shift) => (
              <article
                className={`upcoming-shift-item ${
                  shift.status === "In progress"
                    ? "upcoming-shift-item--progress"
                    : ""
                }`}
                key={`${shift.date}-${shift.client}`}
              >
                <div className="shift-list-date">
                  <strong>{shift.day}</strong>
                  <span>{shift.date}</span>
                </div>

                <div className="shift-list-client">
                  <strong>{shift.client}</strong>
                  <span>{shift.service}</span>
                </div>

                <div className="shift-list-information">
                  <span>
                    <MapPin size={14} />
                    {shift.location}
                  </span>

                  <span>
                    <Clock3 size={14} />
                    {shift.time}
                  </span>
                </div>

                <span
                  className={`shift-list-status shift-list-status--${shift.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {shift.status}
                </span>

                <ChevronRight size={18} />
              </article>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

export default MyShifts;
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import '../styles/roster.css';

interface Shift {
  worker: string;
  time: string;
  location: string;
  type: "green" | "blue" | "orange" | "red" | "purple";
  top: number;
}

interface RosterDay {
  day: string;
  date: string;
  today?: boolean;
  shifts: Shift[];
}

const rosterDays: RosterDay[] = [
  {
    day: "Mon",
    date: "23 Jun",
    shifts: [
      {
        worker: "James Carter",
        time: "08:00 – 12:00",
        location: "Riverside Court",
        type: "green",
        top: 15,
      },
      {
        worker: "Robert Wilson",
        time: "12:00 – 16:00",
        location: "Oakview Care",
        type: "blue",
        top: 120,
      },
      {
        worker: "Alan Hughes",
        time: "16:00 – 20:00",
        location: "Willow Court",
        type: "purple",
        top: 225,
      },
    ],
  },
  {
    day: "Tue",
    date: "24 Jun",
    today: true,
    shifts: [
      {
        worker: "Eleanor Brooks",
        time: "09:00 – 13:00",
        location: "Maple House",
        type: "green",
        top: 42,
      },
      {
        worker: "Unassigned",
        time: "14:00 – 18:00",
        location: "Linden House",
        type: "red",
        top: 150,
      },
    ],
  },
  {
    day: "Wed",
    date: "25 Jun",
    shifts: [
      {
        worker: "Margaret Lewis",
        time: "08:00 – 12:00",
        location: "Linden House",
        type: "green",
        top: 15,
      },
      {
        worker: "Priya Sharma",
        time: "13:00 – 17:00",
        location: "Riverside Court",
        type: "orange",
        top: 135,
      },
    ],
  },
  {
    day: "Thu",
    date: "26 Jun",
    shifts: [
      {
        worker: "Daniel Kim",
        time: "09:00 – 13:00",
        location: "Oakview Care",
        type: "blue",
        top: 42,
      },
      {
        worker: "Aisha Khan",
        time: "16:00 – 20:00",
        location: "Maple House",
        type: "green",
        top: 210,
      },
    ],
  },
  {
    day: "Fri",
    date: "27 Jun",
    shifts: [
      {
        worker: "Unassigned",
        time: "08:00 – 12:00",
        location: "Willow Court",
        type: "red",
        top: 15,
      },
      {
        worker: "Chris Taylor",
        time: "12:00 – 16:00",
        location: "Riverside Court",
        type: "green",
        top: 120,
      },
    ],
  },
  {
    day: "Sat",
    date: "28 Jun",
    shifts: [
      {
        worker: "Fatima Ali",
        time: "09:00 – 13:00",
        location: "Linden House",
        type: "green",
        top: 42,
      },
      {
        worker: "Mohammed Zain",
        time: "16:00 – 20:00",
        location: "Maple House",
        type: "blue",
        top: 210,
      },
    ],
  },
  {
    day: "Sun",
    date: "29 Jun",
    shifts: [
      {
        worker: "Unassigned",
        time: "10:00 – 14:00",
        location: "Oakview Care",
        type: "orange",
        top: 75,
      },
    ],
  },
];

const unassignedShifts = [
  {
    date: "Tue, 24 Jun",
    time: "14:00 – 18:00",
    location: "Linden House",
    client: "Mrs. Margaret Lewis",
    skills: ["Personal care", "Medication"],
  },
  {
    date: "Fri, 27 Jun",
    time: "08:00 – 12:00",
    location: "Willow Court",
    client: "Mr. Alan Hughes",
    skills: ["Mental health", "Experience 1+ yr"],
  },
  {
    date: "Sun, 29 Jun",
    time: "10:00 – 14:00",
    location: "Oakview Care",
    client: "Mrs. Patricia Green",
    skills: ["Personal care", "Mobility support"],
  },
];

const timeLabels = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
];

function Roster() {
  return (
    <AppLayout>
      <main className="page-content roster-page">
        <section className="roster-page-header">
          <div>
            <h1>Roster</h1>
            <p>View and manage your team’s shifts.</p>
          </div>

          <div className="roster-controls">
            <button className="outline-button" type="button">
              Today
            </button>

            <div className="date-arrows">
              <button type="button" aria-label="Previous week">
                <ChevronLeft size={17} />
              </button>

              <button type="button" aria-label="Next week">
                <ChevronRight size={17} />
              </button>
            </div>

            <button className="date-button" type="button">
              Mon, 23 Jun – Sun, 29 Jun 2025
            </button>

            <select defaultValue="week" aria-label="Roster view">
              <option value="week">Week</option>
              <option value="day">Day</option>
              <option value="month">Month</option>
            </select>

            <button className="outline-button" type="button">
              <Filter size={17} />
              Filter
            </button>

            <button className="green-button" type="button">
              <Plus size={17} />
              Create shift
            </button>
          </div>
        </section>

        <section className="calendar-card">
          <div className="calendar-grid">
            <div className="time-column">
              <div className="calendar-corner">–</div>

              <div className="time-labels">
                {timeLabels.map((time) => (
                  <span key={time}>{time}</span>
                ))}
              </div>
            </div>

            {rosterDays.map((day) => (
              <div className="calendar-day" key={day.date}>
                <header className={day.today ? "today" : ""}>
                  <strong>{day.day}</strong>
                  <span>{day.date}</span>
                </header>

                <div className="day-body">
                  {day.shifts.map((shift) => (
                    <article
                      className={`calendar-shift calendar-shift--${shift.type}`}
                      style={{ top: `${shift.top}px` }}
                      key={`${day.date}-${shift.worker}-${shift.time}`}
                    >
                      <strong>{shift.worker}</strong>
                      <span>{shift.time}</span>
                      <span>{shift.location}</span>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-card unassigned-card">
          <header className="card-header">
            <div>
              <h2>Unassigned shifts (3)</h2>
              <p>These shifts need to be filled.</p>
            </div>

            <button className="link-button" type="button">
              View all
            </button>
          </header>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Client</th>
                  <th>Skills required</th>
                  <th aria-label="Action" />
                </tr>
              </thead>

              <tbody>
                {unassignedShifts.map((shift) => (
                  <tr key={`${shift.date}-${shift.time}`}>
                    <td>{shift.date}</td>
                    <td>{shift.time}</td>
                    <td>{shift.location}</td>
                    <td>{shift.client}</td>

                    <td>
                      <div className="skill-list">
                        {shift.skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <button className="assign-button" type="button">
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

export default Roster;
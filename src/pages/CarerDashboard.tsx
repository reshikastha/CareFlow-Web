import {
  CalendarDays,
  CheckSquare,
  ChevronRight,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Megaphone,
  Play,
} from "lucide-react";
import AppLayout from "../components/AppLayout";

import "../styles/carerDashboard.css";

const upcomingShifts = [
  {
    day: "TUE",
    date: "24 JUN",
    client: "Aisha Foster",
    service: "Personal care",
    time: "9:00 am – 1:00 pm",
    duration: "4 hours",
  },
  {
    day: "WED",
    date: "25 JUN",
    client: "Brian Lewis",
    service: "Medication support",
    time: "10:00 am – 2:00 pm",
    duration: "4 hours",
  },
  {
    day: "FRI",
    date: "27 JUN",
    client: "Claire Campbell",
    service: "Respite care",
    time: "9:00 am – 5:00 pm",
    duration: "8 hours",
  },
];

function CarerDashboard() {
  return (
    <AppLayout>
      <main className="carer-page carer-dashboard">
        <section className="carer-dashboard-heading">
          <h1>Good morning, Reshika</h1>

          <p>
            Here’s what’s happening with your care work today.
          </p>
        </section>

        <section className="carer-stat-grid">
          <article className="carer-stat carer-stat--green">
            <CalendarDays size={24} />

            <div>
              <span>Next shift</span>
              <strong>Today, 2:00 pm</strong>
              <small>with Margaret Lewis</small>
            </div>
          </article>

          <article className="carer-stat carer-stat--blue">
            <Clock3 size={24} />

            <div>
              <span>Hours this week</span>
              <strong>32</strong>
              <small>of your scheduled hours</small>
            </div>
          </article>

          <article className="carer-stat carer-stat--orange">
            <CheckSquare size={24} />

            <div>
              <span>Tasks due</span>
              <strong>3</strong>
              <small>today</small>
            </div>
          </article>

          <article className="carer-stat carer-stat--red">
            <Mail size={24} />

            <div>
              <span>Unread messages</span>
              <strong>2</strong>
              <small>new messages</small>
            </div>
          </article>
        </section>

        <section className="carer-dashboard-grid">
          <article className="carer-card next-shift-card">
            <header>
              <h2>Your next shift</h2>
              <span>Today</span>
            </header>

            <div className="next-shift-person">
              <div className="client-avatar">ML</div>

              <div>
                <h3>Margaret Lewis</h3>
                <p>Personal care and companionship</p>

                <span>
                  <MapPin size={15} />
                  Elwood, VIC 3184
                </span>

                <span>
                  <CalendarDays size={15} />
                  Today, 2:00 pm – 6:00 pm (4 hours)
                </span>
              </div>
            </div>

            <footer>
              <button className="secondary-carer-button" type="button">
                View details
              </button>

              <button className="primary-carer-button" type="button">
                <Play size={16} fill="currentColor" />
                Check in
              </button>
            </footer>
          </article>

          <article className="carer-card tasks-card">
            <header>
              <h2>Today’s tasks</h2>
              <button type="button">View all</button>
            </header>

            <label className="task-row">
              <input type="checkbox" />

              <span>
                Complete care notes for David Green
                <small>Due today</small>
              </span>
            </label>

            <label className="task-row">
              <input type="checkbox" />

              <span>
                Follow up incident with Aisha Khan
                <small>Due today</small>
              </span>
            </label>

            <label className="task-row">
              <input type="checkbox" />

              <span>
                Submit medication log for Margaret Lewis
                <small>Due today</small>
              </span>
            </label>
          </article>

          <article className="carer-card upcoming-dashboard-card">
            <header>
              <h2>Upcoming shifts</h2>
              <button type="button">View all</button>
            </header>

            {upcomingShifts.map((shift) => (
              <div
                className="dashboard-shift-row"
                key={`${shift.date}-${shift.client}`}
              >
                <div className="shift-date-box">
                  <strong>{shift.day}</strong>
                  <span>{shift.date}</span>
                </div>

                <div className="dashboard-shift-client">
                  <strong>{shift.client}</strong>
                  <span>{shift.service}</span>
                </div>

                <div className="dashboard-shift-time">
                  <strong>{shift.time}</strong>
                  <span>{shift.duration}</span>
                </div>

                <ChevronRight size={17} />
              </div>
            ))}
          </article>

          <article className="carer-card announcements-card">
            <header>
              <h2>Announcements</h2>
              <button type="button">View all</button>
            </header>

            <div className="announcement-row">
              <div className="announcement-icon">
                <Megaphone size={20} />
              </div>

              <div>
                <strong>Flu vaccination reminder</strong>

                <p>
                  Annual flu vaccinations are now available.
                  Please book through your GP.
                </p>

                <small>20 Jun 2025</small>
              </div>
            </div>

            <div className="announcement-row">
              <div className="announcement-icon">
                <FileText size={20} />
              </div>

              <div>
                <strong>Updated care plan templates</strong>

                <p>
                  New templates are now available in the Resources
                  section.
                </p>

                <small>18 Jun 2025</small>
              </div>
            </div>
          </article>
        </section>
      </main>
    </AppLayout>
  );
}

export default CarerDashboard;
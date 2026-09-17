import {
  CalendarDays,
  Clock3,
  Plus,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import '../styles/dashboard.css';

const statistics = [
  {
    title: "Today's shifts",
    value: "12",
    description: "+2 from yesterday",
    icon: CalendarDays,
    color: "green",
  },
  {
    title: "Active workers",
    value: "28",
    description: "87% of total",
    icon: UsersRound,
    color: "blue",
  },
  {
    title: "Open shifts",
    value: "3",
    description: "Needs coverage",
    icon: Clock3,
    color: "orange",
  },
  {
    title: "Incidents",
    value: "1",
    description: "Requires follow up",
    icon: TriangleAlert,
    color: "red",
  },
];

const roster = [
  {
    time: "08:00 – 12:00",
    client: "Mr. James Carter",
    location: "Riverside Court",
    worker: "Aisha Khan",
    status: "In progress",
  },
  {
    time: "09:00 – 13:00",
    client: "Ms. Eleanor Brooks",
    location: "Maple House",
    worker: "Daniel Kim",
    status: "In progress",
  },
  {
    time: "12:00 – 16:00",
    client: "Mr. Robert Wilson",
    location: "Oakview Care",
    worker: "Priya Sharma",
    status: "Upcoming",
  },
  {
    time: "14:00 – 18:00",
    client: "Mrs. Margaret Lewis",
    location: "Linden House",
    worker: "Chris Taylor",
    status: "Upcoming",
  },
  {
    time: "16:00 – 20:00",
    client: "Mr. Alan Hughes",
    location: "Willow Court",
    worker: "Fatima Ali",
    status: "Open",
  },
];

const weeklyCoverage = [
  { day: "Mon", filled: 26, open: 7 },
  { day: "Tue", filled: 18, open: 10 },
  { day: "Wed", filled: 24, open: 6 },
  { day: "Thu", filled: 21, open: 9 },
  { day: "Fri", filled: 26, open: 6 },
  { day: "Sat", filled: 25, open: 8 },
  { day: "Sun", filled: 18, open: 5 },
];

function Dashboard() {
  return (
    <AppLayout>
      <main className="page-content">
        <section className="page-heading dashboard-heading">
          <div>
            <h1>Good morning, Reshika</h1>
            <p>Here’s what’s happening with your workforce today.</p>
          </div>

          <time>Tue, 24 Jun 2025</time>
        </section>

        <section className="stat-grid">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <article
                className={`stat-card stat-card--${item.color}`}
                key={item.title}
              >
                <div className="stat-icon">
                  <Icon size={26} />
                </div>

                <div>
                  <h2>{item.title}</h2>
                  <strong>{item.value}</strong>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="dashboard-grid">
          <article className="content-card roster-card">
            <header className="card-header">
              <h2>Today’s roster</h2>

              <div className="card-header-actions">
                <button className="link-button" type="button">
                  View all
                </button>

                <button className="green-button" type="button">
                  <Plus size={17} />
                  Create shift
                </button>
              </div>
            </header>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Client</th>
                    <th>Location</th>
                    <th>Worker</th>
                    <th>Status</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>

                <tbody>
                  {roster.map((item) => (
                    <tr key={`${item.time}-${item.client}`}>
                      <td>{item.time}</td>
                      <td>{item.client}</td>
                      <td>{item.location}</td>
                      <td>{item.worker}</td>

                      <td>
                        <span
                          className={`status status--${item.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <button className="more-button" type="button">
                          •••
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="content-card coverage-card">
            <header className="card-header">
              <h2>Weekly coverage</h2>

              <select defaultValue="week" aria-label="Coverage period">
                <option value="week">This week</option>
                <option value="lastWeek">Last week</option>
              </select>
            </header>

            <div className="chart-area">
              <div className="chart-lines">
                <span>40</span>
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>

              <div className="bar-chart">
                {weeklyCoverage.map((item) => (
                  <div className="bar-column" key={item.day}>
                    <div className="bar-values">
                      <div
                        className="bar-open"
                        style={{ height: `${item.open * 3}px` }}
                      />

                      <div
                        className="bar-filled"
                        style={{ height: `${item.filled * 3}px` }}
                      />
                    </div>

                    <span>{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-legend">
              <span>
                <i className="legend-filled" />
                Filled shifts
              </span>

              <span>
                <i className="legend-open" />
                Open shifts
              </span>
            </div>

            <div className="coverage-message">
              <div>✓</div>

              <p>
                <strong>Great progress!</strong>
                <span>90% of shifts are covered this week.</span>
              </p>
            </div>
          </article>
        </section>
      </main>
    </AppLayout>
  );
}

export default Dashboard;
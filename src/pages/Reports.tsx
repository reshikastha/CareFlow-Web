import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileWarning,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import "../styles/reports.css";

interface CareHour {
  day: string;
  date: string;
  hours: number;
}

interface WorkerReport {
  initials: string;
  name: string;
  role: string;
  shifts: number;
  hours: number;
  attendance: string;
}

const careHours: CareHour[] = [
  { date: "9 Jun", day: "Mon", hours: 142 },
  { date: "10 Jun", day: "Tue", hours: 168 },
  { date: "11 Jun", day: "Wed", hours: 176 },
  { date: "12 Jun", day: "Thu", hours: 190 },
  { date: "13 Jun", day: "Fri", hours: 165 },
  { date: "14 Jun", day: "Sat", hours: 120 },
  { date: "15 Jun", day: "Sun", hours: 98 },
  { date: "16 Jun", day: "Mon", hours: 156 },
  { date: "17 Jun", day: "Tue", hours: 182 },
  { date: "18 Jun", day: "Wed", hours: 201 },
  { date: "19 Jun", day: "Thu", hours: 187 },
  { date: "20 Jun", day: "Fri", hours: 170 },
  { date: "21 Jun", day: "Sat", hours: 132 },
  { date: "22 Jun", day: "Sun", hours: 118 },
];

const workers: WorkerReport[] = [
  {
    initials: "AK",
    name: "Aisha Khan",
    role: "Support Worker",
    shifts: 28,
    hours: 212,
    attendance: "96%",
  },
  {
    initials: "BL",
    name: "Ben Lee",
    role: "Registered Nurse",
    shifts: 24,
    hours: 198,
    attendance: "100%",
  },
  {
    initials: "CT",
    name: "Chris Taylor",
    role: "Support Worker",
    shifts: 22,
    hours: 176,
    attendance: "91%",
  },
  {
    initials: "DK",
    name: "Daniel Kim",
    role: "Support Worker",
    shifts: 20,
    hours: 160,
    attendance: "90%",
  },
  {
    initials: "EM",
    name: "Eleanor Mills",
    role: "Enrolled Nurse",
    shifts: 18,
    hours: 142,
    attendance: "100%",
  },
];

function Reports() {
  function handleExport(): void {
    alert("Connect this button to your report export function.");
  }

  return (
    <AppLayout>
      <main className="page-content reports-page">
        <section className="reports-heading">
          <div>
            <h1>Reports &amp; analytics</h1>

            <p>
              Gain insights into your care operations, workforce and
              compliance.
            </p>
          </div>
        </section>

        <section className="report-controls">
          <button className="report-select-button" type="button">
            <CalendarDays size={19} />

            <span>Mon, 9 Jun 2025 – Sun, 22 Jun 2025</span>

            <ChevronDown size={17} />
          </button>

          <button className="report-select-button" type="button">
            <span className="report-chart-icon">
              <i />
              <i />
              <i />
            </span>

            <span>All report types</span>

            <ChevronDown size={17} />
          </button>

          <button
            className="export-report-button"
            type="button"
            onClick={handleExport}
          >
            <Download size={19} />
            Export report
          </button>
        </section>

        <section className="report-stat-grid">
          <article className="report-stat report-stat--green">
            <div className="report-stat-icon">
              <Check size={25} />
            </div>

            <div>
              <h2>Completed shifts</h2>
              <strong>186</strong>
              <p>+12% from previous period</p>
            </div>
          </article>

          <article className="report-stat report-stat--blue">
            <div className="report-stat-icon">
              <Clock3 size={25} />
            </div>

            <div>
              <h2>Care hours</h2>
              <strong>1,428</strong>
              <p>+8% from previous period</p>
            </div>
          </article>

          <article className="report-stat report-stat--green">
            <div className="report-stat-icon">
              <UsersRound size={26} />
            </div>

            <div>
              <h2>Attendance rate</h2>
              <strong>94%</strong>
              <p>+2% from previous period</p>
            </div>
          </article>

          <article className="report-stat report-stat--orange">
            <div className="report-stat-icon">
              <TriangleAlert size={26} />
            </div>

            <div>
              <h2>Open incidents</h2>
              <strong>6</strong>
              <p>-40% from previous period</p>
            </div>
          </article>
        </section>

        <section className="report-chart-grid">
          <article className="report-card weekly-chart-card">
            <h2>Weekly care hours</h2>

            <div className="care-chart">
              <div className="chart-number-column">
                <span>250</span>
                <span>200</span>
                <span>150</span>
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>

              <div className="care-bars">
                {careHours.map((item) => (
                  <div
                    className="care-bar-column"
                    key={`${item.date}-${item.day}`}
                  >
                    <div className="care-bar-space">
                      <span
                        className="care-bar"
                        style={{
                          height: `${(item.hours / 250) * 100}%`,
                        }}
                      >
                        <strong>{item.hours}</strong>
                      </span>
                    </div>

                    <div className="care-bar-label">
                      <span>{item.date}</span>
                      <small>{item.day}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="report-card shift-status-card">
            <h2>Shift status</h2>

            <div className="shift-status-content">
              <div className="donut-chart">
                <div className="donut-centre">
                  <strong>186</strong>
                  <span>Total shifts</span>
                </div>
              </div>

              <div className="donut-legend">
                <div>
                  <i className="legend-completed" />

                  <p>
                    <strong>Completed</strong>
                    <span>72% (134)</span>
                  </p>
                </div>

                <div>
                  <i className="legend-on-shift" />

                  <p>
                    <strong>On shift</strong>
                    <span>14% (26)</span>
                  </p>
                </div>

                <div>
                  <i className="legend-unavailable" />

                  <p>
                    <strong>Unavailable</strong>
                    <span>6% (12)</span>
                  </p>
                </div>

                <div>
                  <i className="legend-cancelled" />

                  <p>
                    <strong>Cancelled</strong>
                    <span>4% (8)</span>
                  </p>
                </div>

                <div>
                  <i className="legend-no-show" />

                  <p>
                    <strong>No show</strong>
                    <span>4% (6)</span>
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="reports-bottom-grid">
          <article className="report-card worker-breakdown-card">
            <h2>Worker hours breakdown</h2>

            <div className="table-wrapper">
              <table className="report-worker-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Completed shifts</th>
                    <th>Care hours</th>
                    <th>Attendance rate</th>
                  </tr>
                </thead>

                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker.name}>
                      <td>
                        <div className="report-worker-name">
                          <span>{worker.initials}</span>
                          {worker.name}
                        </div>
                      </td>

                      <td>{worker.role}</td>
                      <td>{worker.shifts}</td>
                      <td>{worker.hours}</td>

                      <td>
                        <strong className="attendance-value">
                          {worker.attendance}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="report-table-footer">
              <p>Showing 1–5 of 28 workers</p>

              <div className="report-pagination">
                <button type="button" aria-label="Previous page">
                  <ChevronLeft size={17} />
                </button>

                <button className="active" type="button">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button">4</button>
                <button type="button">5</button>

                <button type="button" aria-label="Next page">
                  <ChevronRight size={17} />
                </button>
              </div>
            </footer>
          </article>

          <article className="report-card compliance-card">
            <header>
              <h2>Compliance alerts</h2>
              <button type="button">View all</button>
            </header>

            <div className="compliance-list">
              <button className="compliance-item" type="button">
                <span className="compliance-icon compliance-icon--warning">
                  <FileWarning size={18} />
                </span>

                <span className="compliance-text">
                  <strong>3 certificates expiring</strong>
                  <small>Due within the next 30 days</small>
                </span>

                <ChevronRight size={17} />
              </button>

              <button className="compliance-item" type="button">
                <span className="compliance-icon compliance-icon--warning">
                  <FileWarning size={18} />
                </span>

                <span className="compliance-text">
                  <strong>2 workers missing documents</strong>
                  <small>Police check or WWCC</small>
                </span>

                <ChevronRight size={17} />
              </button>

              <button className="compliance-item" type="button">
                <span className="compliance-icon compliance-icon--danger">
                  <TriangleAlert size={18} />
                </span>

                <span className="compliance-text">
                  <strong>1 worker overdue training</strong>
                  <small>Manual handling (overdue by 5 days)</small>
                </span>

                <ChevronRight size={17} />
              </button>

              <button className="compliance-item" type="button">
                <span className="compliance-icon compliance-icon--success">
                  <CheckCircle2 size={18} />
                </span>

                <span className="compliance-text">
                  <strong>All required vaccines up to date</strong>
                </span>

                <ChevronRight size={17} />
              </button>
            </div>
          </article>
        </section>
      </main>
    </AppLayout>
  );
}

export default Reports;
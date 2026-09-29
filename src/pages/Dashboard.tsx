// import {
//   CalendarDays,
//   Clock3,
//   Plus,
//   TriangleAlert,
//   UsersRound,
// } from "lucide-react";

// import AppLayout from "../components/AppLayout";
// import '../styles/dashboard.css';

// const statistics = [
//   {
//     title: "Today's shifts",
//     value: "12",
//     description: "+2 from yesterday",
//     icon: CalendarDays,
//     color: "green",
//   },
//   {
//     title: "Active workers",
//     value: "28",
//     description: "87% of total",
//     icon: UsersRound,
//     color: "blue",
//   },
//   {
//     title: "Open shifts",
//     value: "3",
//     description: "Needs coverage",
//     icon: Clock3,
//     color: "orange",
//   },
//   {
//     title: "Incidents",
//     value: "1",
//     description: "Requires follow up",
//     icon: TriangleAlert,
//     color: "red",
//   },
// ];

// const roster = [
//   {
//     time: "08:00 – 12:00",
//     client: "Mr. James Carter",
//     location: "Riverside Court",
//     worker: "Aisha Khan",
//     status: "In progress",
//   },
//   {
//     time: "09:00 – 13:00",
//     client: "Ms. Eleanor Brooks",
//     location: "Maple House",
//     worker: "Daniel Kim",
//     status: "In progress",
//   },
//   {
//     time: "12:00 – 16:00",
//     client: "Mr. Robert Wilson",
//     location: "Oakview Care",
//     worker: "Priya Sharma",
//     status: "Upcoming",
//   },
//   {
//     time: "14:00 – 18:00",
//     client: "Mrs. Margaret Lewis",
//     location: "Linden House",
//     worker: "Chris Taylor",
//     status: "Upcoming",
//   },
//   {
//     time: "16:00 – 20:00",
//     client: "Mr. Alan Hughes",
//     location: "Willow Court",
//     worker: "Fatima Ali",
//     status: "Open",
//   },
// ];

// const weeklyCoverage = [
//   { day: "Mon", filled: 26, open: 7 },
//   { day: "Tue", filled: 18, open: 10 },
//   { day: "Wed", filled: 24, open: 6 },
//   { day: "Thu", filled: 21, open: 9 },
//   { day: "Fri", filled: 26, open: 6 },
//   { day: "Sat", filled: 25, open: 8 },
//   { day: "Sun", filled: 18, open: 5 },
// ];

// function Dashboard() {
//   return (
//     <AppLayout>
//       <main className="page-content">
//         <section className="page-heading dashboard-heading">
//           <div>
//             <h1>Good morning, Reshika</h1>
//             <p>Here’s what’s happening with your workforce today.</p>
//           </div>

//           <time>Tue, 24 Jun 2025</time>
//         </section>

//         <section className="stat-grid">
//           {statistics.map((item) => {
//             const Icon = item.icon;

//             return (
//               <article
//                 className={`stat-card stat-card--${item.color}`}
//                 key={item.title}
//               >
//                 <div className="stat-icon">
//                   <Icon size={26} />
//                 </div>

//                 <div>
//                   <h2>{item.title}</h2>
//                   <strong>{item.value}</strong>
//                   <p>{item.description}</p>
//                 </div>
//               </article>
//             );
//           })}
//         </section>

//         <section className="dashboard-grid">
//           <article className="content-card roster-card">
//             <header className="card-header">
//               <h2>Today’s roster</h2>

//               <div className="card-header-actions">
//                 <button className="link-button" type="button">
//                   View all
//                 </button>

//                 <button className="green-button" type="button">
//                   <Plus size={17} />
//                   Create shift
//                 </button>
//               </div>
//             </header>

//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Time</th>
//                     <th>Client</th>
//                     <th>Location</th>
//                     <th>Worker</th>
//                     <th>Status</th>
//                     <th aria-label="Actions" />
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {roster.map((item) => (
//                     <tr key={`${item.time}-${item.client}`}>
//                       <td>{item.time}</td>
//                       <td>{item.client}</td>
//                       <td>{item.location}</td>
//                       <td>{item.worker}</td>

//                       <td>
//                         <span
//                           className={`status status--${item.status
//                             .toLowerCase()
//                             .replace(" ", "-")}`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>

//                       <td>
//                         <button className="more-button" type="button">
//                           •••
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </article>

//           <article className="content-card coverage-card">
//             <header className="card-header">
//               <h2>Weekly coverage</h2>

//               <select defaultValue="week" aria-label="Coverage period">
//                 <option value="week">This week</option>
//                 <option value="lastWeek">Last week</option>
//               </select>
//             </header>

//             <div className="chart-area">
//               <div className="chart-lines">
//                 <span>40</span>
//                 <span>30</span>
//                 <span>20</span>
//                 <span>10</span>
//                 <span>0</span>
//               </div>

//               <div className="bar-chart">
//                 {weeklyCoverage.map((item) => (
//                   <div className="bar-column" key={item.day}>
//                     <div className="bar-values">
//                       <div
//                         className="bar-open"
//                         style={{ height: `${item.open * 3}px` }}
//                       />

//                       <div
//                         className="bar-filled"
//                         style={{ height: `${item.filled * 3}px` }}
//                       />
//                     </div>

//                     <span>{item.day}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="chart-legend">
//               <span>
//                 <i className="legend-filled" />
//                 Filled shifts
//               </span>

//               <span>
//                 <i className="legend-open" />
//                 Open shifts
//               </span>
//             </div>

//             <div className="coverage-message">
//               <div>✓</div>

//               <p>
//                 <strong>Great progress!</strong>
//                 <span>90% of shifts are covered this week.</span>
//               </p>
//             </div>
//           </article>
//         </section>
//       </main>
//     </AppLayout>
//   );
// }

// export default Dashboard;



import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Plus,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import "../styles/dashboard.css";

type Shift = {
  id: number;
  shift_start: string;
  shift_end: string;
  status: string;
  notes?: string | null;
  client_name?: string | null;
  client_address?: string | null;
  location?: string | null;
  care_worker_id?: number | null;
  care_worker_name?: string | null;
};

type Worker = {
  id: number;
  status?: string | null;
  employment_status?: string | null;
  is_active?: boolean;
};

type Incident = {
  id: number;
  status?: string | null;
};

type CoverageDay = {
  day: string;
  filled: number;
  open: number;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const adelaideDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Australia/Adelaide",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const adelaideTime = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Adelaide",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function dateKey(value: Date | string): string {
  const parts = adelaideDate.formatToParts(new Date(value));
  const part = (name: string) =>
    parts.find((item) => item.type === name)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function addDays(key: string, days: number): string {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function mondayOf(key: string): string {
  const day = new Date(`${key}T12:00:00Z`).getUTCDay();
  return addDays(key, -((day + 6) % 7));
}

function isOpenShift(shift: Shift): boolean {
  const status = shift.status?.toUpperCase() ?? "";
  return status === "OPEN" || (!shift.care_worker_id && !shift.care_worker_name);
}

function isCancelled(shift: Shift): boolean {
  return shift.status?.toUpperCase() === "CANCELLED";
}

function displayStatus(shift: Shift, now: Date): string {
  if (isCancelled(shift)) return "Cancelled";
  if (isOpenShift(shift)) return "Open";

  const start = new Date(shift.shift_start);
  const end = new Date(shift.shift_end);

  if (now >= end) return "Completed";
  if (now >= start) return "In progress";
  return "Upcoming";
}

function isActiveWorker(worker: Worker): boolean {
  if (typeof worker.is_active === "boolean") return worker.is_active;

  const status = worker.status?.toUpperCase();
  return status !== "INACTIVE" && status !== "DISABLED";
}

function needsFollowUp(incident: Incident): boolean {
  const status = incident.status?.toUpperCase() ?? "";
  return !["CLOSED", "RESOLVED", "COMPLETED"].includes(status);
}

async function getApi<T>(path: string, key: string): Promise<T[]> {
  // Change "token" here if your login stores the JWT under another key.
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load ${key} (${response.status}).`);
  }

  const result = await response.json();

  // Supports both { roster: [...] } and { data: [...] } response formats.
  const records = Array.isArray(result)
    ? result
    : result[key] ?? result.data?.[key] ?? result.data;

  if (!Array.isArray(records)) {
    throw new Error(`The ${key} API did not return a list.`);
  }

  return records as T[];
}

function Dashboard() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<"week" | "lastWeek">("week");
  const [now, setNow] = useState(() => new Date());

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [rosterData, workerData, incidentData] = await Promise.all([
        getApi<Shift>("/api/roster", "roster"),
        getApi<Worker>("/api/workers", "workers"),
        getApi<Incident>("/api/incidents", "incidents"),
      ]);

      setShifts(rosterData);
      setWorkers(workerData);
      setIncidents(incidentData);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();

    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, [loadDashboard]);

  const today = dateKey(now);
  const yesterday = addDays(today, -1);

  const todayShifts = shifts
    .filter((shift) => !isCancelled(shift) && dateKey(shift.shift_start) === today)
    .sort(
      (a, b) =>
        new Date(a.shift_start).getTime() -
        new Date(b.shift_start).getTime(),
    );

  const yesterdayCount = shifts.filter(
    (shift) =>
      !isCancelled(shift) && dateKey(shift.shift_start) === yesterday,
  ).length;

  const shiftDifference = todayShifts.length - yesterdayCount;
  const openToday = todayShifts.filter(isOpenShift).length;
  const activeWorkers = workers.filter(isActiveWorker).length;
  const followUps = incidents.filter(needsFollowUp).length;

  const statistics = [
    {
      title: "Today's shifts",
      value: todayShifts.length,
      description:
        shiftDifference === 0
          ? "Same as yesterday"
          : `${shiftDifference > 0 ? "+" : ""}${shiftDifference} from yesterday`,
      icon: CalendarDays,
      color: "green",
    },
    {
      title: "Active workers",
      value: activeWorkers,
      description: `${workers.length} workers in total`,
      icon: UsersRound,
      color: "blue",
    },
    {
      title: "Open shifts",
      value: openToday,
      description: "Need coverage today",
      icon: Clock3,
      color: "orange",
    },
    {
      title: "Incidents",
      value: followUps,
      description: "Require follow up",
      icon: TriangleAlert,
      color: "red",
    },
  ];

  const thisMonday = mondayOf(today);
  const selectedMonday =
    period === "lastWeek" ? addDays(thisMonday, -7) : thisMonday;

  const weeklyCoverage: CoverageDay[] = Array.from(
    { length: 7 },
    (_, index) => {
      const dayKey = addDays(selectedMonday, index);
      const dayShifts = shifts.filter(
        (shift) =>
          !isCancelled(shift) && dateKey(shift.shift_start) === dayKey,
      );

      return {
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
        filled: dayShifts.filter((shift) => !isOpenShift(shift)).length,
        open: dayShifts.filter(isOpenShift).length,
      };
    },
  );

  const totalFilled = weeklyCoverage.reduce(
    (sum, day) => sum + day.filled,
    0,
  );
  const totalOpen = weeklyCoverage.reduce((sum, day) => sum + day.open, 0);
  const totalWeekShifts = totalFilled + totalOpen;
  const coveragePercent = totalWeekShifts
    ? Math.round((totalFilled / totalWeekShifts) * 100)
    : 0;

  const chartMaximum = Math.max(
    10,
    Math.ceil(
      Math.max(...weeklyCoverage.map((day) => day.filled + day.open)) / 10,
    ) * 10,
  );
  const barHeight = (value: number) =>
    `${(value / chartMaximum) * 120}px`;

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Australia/Adelaide",
      hour: "numeric",
      hourCycle: "h23",
    }).format(now),
  );
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppLayout>
      <main className="page-content">
        <section className="page-heading dashboard-heading">
          <div>
            <h1>{greeting}, Reshika</h1>
            <p>Here’s what’s happening with your workforce today.</p>
          </div>
          <time>
            {new Intl.DateTimeFormat("en-AU", {
              timeZone: "Australia/Adelaide",
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(now)}
          </time>
        </section>

        {error && (
          <div role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => void loadDashboard()}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
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
                    <button
                      className="link-button"
                      type="button"
                      onClick={() => navigate("/roster")}
                    >
                      View all
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
                      {todayShifts.length === 0 ? (
                        <tr>
                          <td colSpan={6}>No shifts scheduled today.</td>
                        </tr>
                      ) : (
                        todayShifts.map((shift) => {
                          const status = displayStatus(shift, now);

                          return (
                            <tr key={shift.id}>
                              <td>
                                {adelaideTime.format(new Date(shift.shift_start))}
                                {" – "}
                                {adelaideTime.format(new Date(shift.shift_end))}
                              </td>
                              <td>{shift.client_name ?? "—"}</td>
                              <td>
                                {shift.location ??
                                  shift.client_address ??
                                  "—"}
                              </td>
                              <td>{shift.care_worker_name ?? "Unassigned"}</td>
                              <td>
                                <span
                                  className={`status status--${status
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}`}
                                >
                                  {status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="more-button"
                                  type="button"
                                  aria-label={`View shift for ${shift.client_name ?? "client"}`}
                                  onClick={() => navigate("/roster")}
                                >
                                  •••
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="content-card coverage-card">
                <header className="card-header">
                  <h2>Weekly coverage</h2>
                  <select
                    value={period}
                    aria-label="Coverage period"
                    onChange={(event) =>
                      setPeriod(event.target.value as "week" | "lastWeek")
                    }
                  >
                    <option value="week">This week</option>
                    <option value="lastWeek">Last week</option>
                  </select>
                </header>

                <div className="chart-area">
                  <div className="chart-lines">
                    {[4, 3, 2, 1, 0].map((step) => (
                      <span key={step}>
                        {Math.round((chartMaximum * step) / 4)}
                      </span>
                    ))}
                  </div>
                  <div className="bar-chart">
                    {weeklyCoverage.map((item) => (
                      <div className="bar-column" key={item.day}>
                        <div className="bar-values">
                          <div
                            className="bar-open"
                            style={{ height: barHeight(item.open) }}
                            title={`${item.open} open shifts`}
                          />
                          <div
                            className="bar-filled"
                            style={{ height: barHeight(item.filled) }}
                            title={`${item.filled} filled shifts`}
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
                    <strong>
                      {totalWeekShifts
                        ? `${coveragePercent}% coverage`
                        : "No shifts scheduled"}
                    </strong>
                    <span>
                      {totalFilled} filled and {totalOpen} open shifts{" "}
                      {period === "week" ? "this week" : "last week"}.
                    </span>
                  </p>
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </AppLayout>
  );
}

export default Dashboard;
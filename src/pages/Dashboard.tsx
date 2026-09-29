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
import { getRoster, type RosterShift } from "../services/rosterApi";
import { getWorkers, type Worker } from "../services/workerApi";
import { getIncidents, type Incident } from "../services/incidentApi";
import { getProfile, type UserProfile } from "../services/profileApi";

import "../styles/dashboard.css";

const TIME_ZONE = "Australia/Adelaide";
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type CoverageDay = {
  day: string;
  filled: number;
  open: number;
};

function dateKey(value: string | Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

function addDays(date: string, amount: number): string {
  const result = new Date(`${date}T12:00:00Z`);
  result.setUTCDate(result.getUTCDate() + amount);
  return result.toISOString().slice(0, 10);
}

function startOfWeek(date: string): string {
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  return addDays(date, -((weekday + 6) % 7));
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function isOpen(shift: RosterShift): boolean {
  return shift.careWorkerId == null && shift.status !== "CANCELLED";
}

function getDisplayStatus(
  shift: RosterShift,
  now: Date,
): string {
  if (shift.status === "CANCELLED") return "Cancelled";
  if (shift.status === "COMPLETED") return "Completed";
  if (isOpen(shift)) return "Open";

  const start = new Date(shift.shiftStart);
  const end = new Date(shift.shiftEnd);

  if (now >= end) return "Completed";
  if (now >= start || shift.status === "IN_PROGRESS") {
    return "In progress";
  }

  return "Upcoming";
}

function Dashboard() {
  const navigate = useNavigate();

  const [roster, setRoster] = useState<RosterShift[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [period, setPeriod] = useState<"week" | "lastWeek">("week");
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [rosterData, workerData, incidentData, profileData] =
        await Promise.all([
          getRoster(),
          getWorkers(),
          getIncidents(),
          getProfile()
        ]);

      setRoster(rosterData);
      setWorkers(workerData);
      setIncidents(incidentData.incidents);
      setProfile(profileData)
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

    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [loadDashboard]);

  const today = dateKey(now);
  const yesterday = addDays(today, -1);

  const todaysRoster = roster
    .filter(
      (shift) =>
        shift.status !== "CANCELLED" &&
        dateKey(shift.shiftStart) === today,
    )
    .sort(
      (a, b) =>
        new Date(a.shiftStart).getTime() -
        new Date(b.shiftStart).getTime(),
    );

  const yesterdayCount = roster.filter(
    (shift) =>
      shift.status !== "CANCELLED" &&
      dateKey(shift.shiftStart) === yesterday,
  ).length;

  const difference = todaysRoster.length - yesterdayCount;

  const activeWorkers = workers.filter(
    (worker) => worker.isActive,
  ).length;

  const openShifts = todaysRoster.filter(isOpen).length;

  const incidentsToFollowUp = incidents.filter(
    (incident) => incident.status !== "CLOSED",
  ).length;

  const statistics = [
    {
      title: "Today's shifts",
      value: todaysRoster.length,
      description:
        difference === 0
          ? "Same as yesterday"
          : `${difference > 0 ? "+" : ""}${difference} from yesterday`,
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
      value: openShifts,
      description: "Need coverage today",
      icon: Clock3,
      color: "orange",
    },
    {
      title: "Incidents",
      value: incidentsToFollowUp,
      description: "Require follow up",
      icon: TriangleAlert,
      color: "red",
    },
  ];

  const monday =
    period === "week"
      ? startOfWeek(today)
      : addDays(startOfWeek(today), -7);

  const weeklyCoverage: CoverageDay[] = dayNames.map(
    (day, index) => {
      const currentDate = addDays(monday, index);

      const shiftsOnDay = roster.filter(
        (shift) =>
          shift.status !== "CANCELLED" &&
          dateKey(shift.shiftStart) === currentDate,
      );

      return {
        day,
        filled: shiftsOnDay.filter(
          (shift) => !isOpen(shift),
        ).length,
        open: shiftsOnDay.filter(isOpen).length,
      };
    },
  );

  const filledTotal = weeklyCoverage.reduce(
    (total, day) => total + day.filled,
    0,
  );

  const openTotal = weeklyCoverage.reduce(
    (total, day) => total + day.open,
    0,
  );

  const weekTotal = filledTotal + openTotal;
  const coveragePercent = weekTotal
    ? Math.round((filledTotal / weekTotal) * 100)
    : 0;

  const chartMaximum = Math.max(
    10,
    Math.ceil(
      Math.max(
        ...weeklyCoverage.map(
          (day) => day.filled + day.open,
        ),
      ) / 10,
    ) * 10,
  );

  const barHeight = (count: number) =>
    `${(count / chartMaximum) * 120}px`;

  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      hour: "numeric",
      hourCycle: "h23",
    }).format(now),
  );

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <AppLayout>
      <main className="page-content">
        <section className="page-heading dashboard-heading">
          <div>
            <h1>{greeting}, {profile?.fullName}</h1>
            <p>
              Here’s what’s happening with your workforce today.
            </p>
          </div>

          <time>
            {new Intl.DateTimeFormat("en-AU", {
              timeZone: TIME_ZONE,
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
            <button
              type="button"
              onClick={() => void loadDashboard()}
            >
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
                      {todaysRoster.length === 0 ? (
                        <tr>
                          <td colSpan={6}>
                            No shifts scheduled today.
                          </td>
                        </tr>
                      ) : (
                        todaysRoster.map((shift) => {
                          const status = getDisplayStatus(
                            shift,
                            now,
                          );

                          return (
                            <tr key={shift.id}>
                              <td>
                                {formatTime(shift.shiftStart)}
                                {" – "}
                                {formatTime(shift.shiftEnd)}
                              </td>
                              <td>{shift.clientName}</td>
                              <td>
                                {shift.location ??
                                  "No location"}
                              </td>
                              <td>
                                {shift.careWorkerName ??
                                  "Unassigned"}
                              </td>
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
                                  aria-label={`View ${shift.clientName}'s shift`}
                                  onClick={() =>
                                    navigate("/roster")
                                  }
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
                      setPeriod(
                        event.target.value as
                          | "week"
                          | "lastWeek",
                      )
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
                        {Math.round(
                          (chartMaximum * step) / 4,
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="bar-chart">
                    {weeklyCoverage.map((item) => (
                      <div
                        className="bar-column"
                        key={item.day}
                      >
                        <div className="bar-values">
                          <div
                            className="bar-open"
                            style={{
                              height: barHeight(item.open),
                            }}
                            title={`${item.open} open shifts`}
                          />
                          <div
                            className="bar-filled"
                            style={{
                              height: barHeight(item.filled),
                            }}
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
                      {weekTotal
                        ? `${coveragePercent}% coverage`
                        : "No shifts scheduled"}
                    </strong>
                    <span>
                      {filledTotal} filled and {openTotal} open
                      shifts{" "}
                      {period === "week"
                        ? "this week"
                        : "last week"}
                      .
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
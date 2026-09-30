import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  List,
  MapPin,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "../components/AppLayout";
import { getRoster, type RosterShift } from "../services/rosterApi";
import "../styles/myShifts.css";
import { useNavigate } from "react-router-dom";

type ViewType = "CALENDAR" | "LIST";
type FilterType = "UPCOMING" | "ALL" | "COMPLETED" | "CANCELLED";

// Return Monday of the selected week.
function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);
  result.setHours(0, 0, 0, 0);

  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function getShiftHours(shift: RosterShift): number {
  return Math.max(
    0,
    (new Date(shift.shiftEnd).getTime() -
      new Date(shift.shiftStart).getTime()) /
      3_600_000,
  );
}

function getShiftTime(shift: RosterShift): string {
  const start = new Date(shift.shiftStart);
  const end = new Date(shift.shiftEnd);

  const endDate = isSameDay(start, end)
    ? ""
    : ` (${formatDate(end)})`;

  return `${formatTime(shift.shiftStart)} – ${formatTime(
    shift.shiftEnd,
  )}${endDate}`;
}

function getStatusLabel(status: RosterShift["status"]): string {
  switch (status) {
    case "SCHEDULED":
      return "Confirmed";
    case "IN_PROGRESS":
      return "In progress";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

function getStatusClass(status: RosterShift["status"]): string {
  switch (status) {
    case "SCHEDULED":
      return "confirmed";
    case "IN_PROGRESS":
      return "in-progress";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "unknown";
  }
}

function MyShifts() {
  const [shifts, setShifts] = useState<RosterShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [view, setView] = useState<ViewType>("CALENDAR");
  const [filter, setFilter] = useState<FilterType>("UPCOMING");

  const [weekStart, setWeekStart] = useState<Date>(() =>
    getWeekStart(new Date()),
  );

  const [now, setNow] = useState(() => Date.now());

  // Update the Upcoming filter while the page stays open.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  // Load shifts using your existing roster API.
  useEffect(() => {
    let active = true;

    async function loadShifts() {
      try {
        setLoading(true);
        setError("");

        const result = await getRoster();

        const invalidDates = result.some((shift) => {
          const start = new Date(shift.shiftStart).getTime();
          const end = new Date(shift.shiftEnd).getTime();

          return (
            !Number.isFinite(start) ||
            !Number.isFinite(end) ||
            end <= start
          );
        });

        if (invalidDates) {
          throw new Error("The roster contains invalid shift dates.");
        }

        if (active) {
          setShifts(
            [...result].sort(
              (first, second) =>
                new Date(first.shiftStart).getTime() -
                new Date(second.shiftStart).getTime(),
            ),
          );
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load your shifts.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadShifts();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const weekEnd = addDays(weekStart, 6);

  // Calculate hours within the selected week.
  // Cancelled shifts are excluded.
  const weeklyHours = useMemo(() => {
    const weekStartTime = weekStart.getTime();
    const weekEndTime = addDays(weekStart, 7).getTime();

    return shifts.reduce((total, shift) => {
      if (shift.status === "CANCELLED") {
        return total;
      }

      const overlapStart = Math.max(
        weekStartTime,
        new Date(shift.shiftStart).getTime(),
      );

      const overlapEnd = Math.min(
        weekEndTime,
        new Date(shift.shiftEnd).getTime(),
      );

      return (
        total +
        Math.max(0, overlapEnd - overlapStart) / 3_600_000
      );
    }, 0);
  }, [shifts, weekStart]);

  // The calendar shows all shifts in the selected week.
  // The dropdown filters the list below it.
  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        const dayEnd = addDays(date, 1);

        return {
          date,
          // Include overnight shifts on each day they overlap.
          shifts: shifts.filter(
            (shift) =>
              new Date(shift.shiftStart).getTime() <
                dayEnd.getTime() &&
              new Date(shift.shiftEnd).getTime() >
                date.getTime(),
          ),
        };
      }),
    [weekStart, shifts],
  );

  const filteredShifts = useMemo(
    () =>
      shifts.filter((shift) => {
        switch (filter) {
          case "UPCOMING":
            return (
              shift.status !== "CANCELLED" &&
              shift.status !== "COMPLETED" &&
              new Date(shift.shiftEnd).getTime() > now
            );

          case "COMPLETED":
            return shift.status === "COMPLETED";

          case "CANCELLED":
            return shift.status === "CANCELLED";

          default:
            return true;
        }
      }),
    [shifts, filter, now],
  );

  const listTitles: Record<FilterType, string> = {
    UPCOMING: "Upcoming shifts",
    ALL: "All shifts",
    COMPLETED: "Completed shifts",
    CANCELLED: "Cancelled shifts",
  };

  function previousWeek() {
    setWeekStart((current) => addDays(current, -7));
  }

  function nextWeek() {
    setWeekStart((current) => addDays(current, 7));
  }

  function currentWeek() {
    setWeekStart(getWeekStart(new Date()));
  }
    const navigate = useNavigate()

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

          {/* Enable once your availability form is connected. */}
          <button
            className="set-availability-button"
            type="button"
            onClick={()=> navigate('/carer/availability')}
            title="Availability form is not connected yet"
          >
            <CalendarDays size={17} />
            Set availability
          </button>
        </section>

        <section className="shift-view-controls">
          <div className="view-switch">
            <button
              className={view === "CALENDAR" ? "active" : ""}
              type="button"
              aria-pressed={view === "CALENDAR"}
              onClick={() => setView("CALENDAR")}
            >
              <CalendarDays size={17} />
              Calendar
            </button>

            <button
              className={view === "LIST" ? "active" : ""}
              type="button"
              aria-pressed={view === "LIST"}
              onClick={() => setView("LIST")}
            >
              <List size={17} />
              List
            </button>
          </div>

          <div className="shift-summary-controls">
            <label className="upcoming-filter">
              <Filter size={17} />

              <select
                aria-label="Filter shift list"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as FilterType)
                }
                style={{
                  background: "transparent",
                  border: 0,
                  color: "inherit",
                  font: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="ALL">All shifts</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>

            <div className="weekly-hours">
              <strong>
                {loading || error
                  ? "–"
                  : Number(weeklyHours.toFixed(1))}
              </strong>
              <span>hours in selected week</span>
            </div>
          </div>
        </section>

        {loading && <p role="status">Loading your shifts...</p>}

        {error && (
          <div role="alert">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {/* Calendar stays visible even when no shifts exist. */}
        {view === "CALENDAR" && (
          <section className="weekly-calendar">
            <header className="week-navigation">
              <button
                type="button"
                aria-label="Previous week"
                onClick={previousWeek}
              >
                <ChevronLeft size={18} />
              </button>

              <h2>
                {formatDate(weekStart)} {weekStart.getFullYear()}
                {" – "}
                {formatDate(weekEnd)} {weekEnd.getFullYear()}
              </h2>

              <button
                type="button"
                aria-label="Next week"
                onClick={nextWeek}
              >
                <ChevronRight size={18} />
              </button>
            </header>

            {/* <div style={{ padding: "0 16px 12px" }}>
              <button type="button" onClick={currentWeek}>
                This week
              </button>
            </div> */}

            <div className="week-grid">
              {weekDays.map((item) => (
                <article
                  className="week-day"
                  key={item.date.getTime()}
                >
                  <header>
                    <strong>
                      {item.date.toLocaleDateString("en-AU", {
                        weekday: "short",
                      })}
                    </strong>

                    <span>{formatDate(item.date)}</span>
                  </header>

                  <div className="week-day-content">
                    {loading ? (
                      <span className="no-shift">Loading...</span>
                    ) : error ? (
                      <span className="no-shift">Unavailable</span>
                    ) : item.shifts.length === 0 ? (
                      <span className="no-shift">No shift</span>
                    ) : (
                      item.shifts.map((shift) => (
                        <div
                          className="mini-shift"
                          key={shift.id}
                        >
                          <strong>{getShiftTime(shift)}</strong>
                          <span>{shift.clientName}</span>

                          <small>
                            {getStatusLabel(shift.status)}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="upcoming-shifts-section">
          <h2>{listTitles[filter]}</h2>

          {!loading && !error && (
            filteredShifts.length === 0 ? (
              <div
                className="no-shifts-message"
                style={{
                  padding: "28px",
                  textAlign: "center",
                }}
              >
                <CalendarDays size={32} />

                <h3>
                  {shifts.length === 0
                    ? "No shifts assigned"
                    : `No ${filter === "ALL" ? "" : filter.toLowerCase() + " "}shifts`}
                </h3>

                <p>
                  {shifts.length === 0
                    ? "Your shifts will appear here when they are assigned."
                    : "No shifts match the selected filter."}
                </p>
              </div>
            ) : (
              <div className="upcoming-shift-list">
                {filteredShifts.map((shift) => {
                  const start = new Date(shift.shiftStart);

                  return (
                    <article
                      className={`upcoming-shift-item ${
                        shift.status === "IN_PROGRESS"
                          ? "upcoming-shift-item--progress"
                          : ""
                      }`}
                      key={shift.id}
                    >
                      <div className="shift-list-date">
                        <strong>
                          {start
                            .toLocaleDateString("en-AU", {
                              weekday: "short",
                            })
                            .toUpperCase()}
                        </strong>

                        <span>{formatDate(start)}</span>
                      </div>

                      <div className="shift-list-client">
                        <strong>{shift.clientName}</strong>
                        <span>{shift.notes || "Care shift"}</span>
                      </div>

                      <div className="shift-list-information">
                        <span>
                          <MapPin size={14} />
                          {shift.location || "No location"}
                        </span>

                        <span>
                          <Clock3 size={14} />
                          {getShiftTime(shift)}
                          {" · "}
                          {Number(getShiftHours(shift).toFixed(2))}
                          {" hours"}
                        </span>
                      </div>

                      <span
                        className={`shift-list-status shift-list-status--${getStatusClass(
                          shift.status,
                        )}`}
                      >
                        {getStatusLabel(shift.status)}
                      </span>
                    </article>
                  );
                })}
              </div>
            )
          )}
        </section>
      </main>
    </AppLayout>
  );
}

export default MyShifts;
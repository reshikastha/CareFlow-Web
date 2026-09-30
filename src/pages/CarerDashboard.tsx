import {
  CalendarDays,
  CheckSquare,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Play,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "../components/AppLayout";
import {
  getRoster,
  updateShiftStatus,
  type RosterShift,
} from "../services/rosterApi";

import "../styles/carerDashboard.css";

// Adjust this to match your MyShifts route.
const MY_SHIFTS_PATH = "/carer/shifts";

function getWeekStart(date: Date): Date {
  const result = new Date(date);

  result.setDate(
    result.getDate() - ((result.getDay() + 6) % 7),
  );
  result.setHours(0, 0, 0, 0);

  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function sameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function dateLabel(value: string, now: number): string {
  const date = new Date(value);
  const today = new Date(now);

  if (sameDay(date, today)) {
    return "Today";
  }

  if (sameDay(date, addDays(today, 1))) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shiftHours(shift: RosterShift): number {
  return Math.max(
    0,
    (new Date(shift.shiftEnd).getTime() -
      new Date(shift.shiftStart).getTime()) /
      3_600_000,
  );
}

function shiftTime(shift: RosterShift): string {
  const start = new Date(shift.shiftStart);
  const end = new Date(shift.shiftEnd);

  const endDate = sameDay(start, end)
    ? ""
    : ` (${end.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
      })})`;

  return `${formatTime(shift.shiftStart)} – ${formatTime(
    shift.shiftEnd,
  )}${endDate}`;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function greeting(now: number): string {
  const hour = new Date(now).getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
}

function validateShifts(shifts: RosterShift[]): RosterShift[] {
  const invalid = shifts.some((shift) => {
    const start = new Date(shift.shiftStart).getTime();
    const end = new Date(shift.shiftEnd).getTime();

    return (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      end <= start
    );
  });

  if (invalid) {
    throw new Error("The roster contains invalid shift dates.");
  }

  return [...shifts].sort(
    (first, second) =>
      new Date(first.shiftStart).getTime() -
      new Date(second.shiftStart).getTime(),
  );
}

type CarerDashboardProps = {
  // Pass the authenticated user's name from your auth context.
  userName?: string;
};

function CarerDashboard({
  userName = "Care worker",
}: CarerDashboardProps) {
  const [shifts, setShifts] = useState<RosterShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [checkingIn, setCheckingIn] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const result = validateShifts(await getRoster());

        if (active) {
          setShifts(result);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load your dashboard.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const activeShifts = useMemo(
    () =>
      shifts.filter(
        (shift) =>
          (shift.status === "SCHEDULED" ||
            shift.status === "IN_PROGRESS") &&
          new Date(shift.shiftEnd).getTime() > now,
      ),
    [shifts, now],
  );

  // Prefer an ongoing shift, otherwise show the next scheduled one.
  const nextShift =
    activeShifts.find(
      (shift) =>
        shift.status === "IN_PROGRESS" ||
        new Date(shift.shiftStart).getTime() <= now,
    ) ??
    activeShifts[0] ??
    null;

  const upcomingShifts = activeShifts.slice(0, 3);

  const weeklyHours = useMemo(() => {
    const start = getWeekStart(new Date(now));
    const end = addDays(start, 7);

    return shifts.reduce((total, shift) => {
      if (shift.status === "CANCELLED") {
        return total;
      }

      const overlapStart = Math.max(
        start.getTime(),
        new Date(shift.shiftStart).getTime(),
      );

      const overlapEnd = Math.min(
        end.getTime(),
        new Date(shift.shiftEnd).getTime(),
      );

      return (
        total +
        Math.max(0, overlapEnd - overlapStart) / 3_600_000
      );
    }, 0);
  }, [shifts, now]);

  const canCheckIn =
    !loading &&
    !error &&
    nextShift !== null &&
    nextShift.status === "SCHEDULED" &&
    new Date(nextShift.shiftStart).getTime() <= now &&
    new Date(nextShift.shiftEnd).getTime() > now;

  async function handleCheckIn() {
    if (!nextShift || !canCheckIn || checkingIn) {
      return;
    }

    setCheckingIn(true);
    setActionError("");
    setActionMessage("");

    try {
      // Uses your existing PATCH /roster/:id/status endpoint.
      await updateShiftStatus(nextShift.id, "IN_PROGRESS");

      setShifts((current) =>
        current.map((shift) =>
          shift.id === nextShift.id
            ? { ...shift, status: "IN_PROGRESS" }
            : shift,
        ),
      );

      setActionMessage("Your shift is now in progress.");
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to start your shift.",
      );
    } finally {
      setCheckingIn(false);
    }
  }

  const firstName = userName.trim().split(/\s+/)[0] || "Care worker";
  const unavailable = loading || Boolean(error);

  return (
    <AppLayout>
      <main className="carer-page carer-dashboard">
        <section className="carer-dashboard-heading">
          <h1>
            {greeting(now)}, {firstName}
          </h1>

          <p>Here’s what’s happening with your care work today.</p>
        </section>

        {loading && (
          <p role="status">Loading your dashboard...</p>
        )}

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

        <section className="carer-stat-grid">
          <article className="carer-stat carer-stat--green">
            <CalendarDays size={24} />

            <div>
              <span>
                {nextShift?.status === "IN_PROGRESS"
                  ? "Current shift"
                  : "Next shift"}
              </span>

              <strong>
                {unavailable
                  ? "–"
                  : nextShift
                    ? `${dateLabel(nextShift.shiftStart, now)}, ${formatTime(
                        nextShift.shiftStart,
                      )}`
                    : "No shift"}
              </strong>

              <small>
                {unavailable
                  ? "Waiting for roster data"
                  : nextShift
                    ? `with ${nextShift.clientName}`
                    : "No upcoming shifts assigned"}
              </small>
            </div>
          </article>

          <article className="carer-stat carer-stat--blue">
            <Clock3 size={24} />

            <div>
              <span>Hours this week</span>
              <strong>
                {unavailable
                  ? "–"
                  : Number(weeklyHours.toFixed(1))}
              </strong>
              <small>scheduled roster hours</small>
            </div>
          </article>

          <article className="carer-stat carer-stat--orange">
            <CheckSquare size={24} />

            <div>
              <span>Tasks due</span>
              <strong>–</strong>
              <small>Task API not connected</small>
            </div>
          </article>

          <article className="carer-stat carer-stat--red">
            <Mail size={24} />

            <div>
              <span>Unread messages</span>
              <strong>–</strong>
              <small>Message API not connected</small>
            </div>
          </article>
        </section>

        <section className="carer-dashboard-grid">
          <article className="carer-card next-shift-card">
            <header>
              <h2>
                {nextShift?.status === "IN_PROGRESS"
                  ? "Your current shift"
                  : "Your next shift"}
              </h2>

              {!unavailable && nextShift && (
                <span>{dateLabel(nextShift.shiftStart, now)}</span>
              )}
            </header>

            {unavailable ? (
              <p>
                {loading ? "Loading shift..." : "Shift unavailable."}
              </p>
            ) : nextShift ? (
              <>
                <div className="next-shift-person">
                  <div className="client-avatar">
                    {initials(nextShift.clientName)}
                  </div>

                  <div>
                    <h3>{nextShift.clientName}</h3>
                    <p>{nextShift.notes || "Care shift"}</p>

                    <span>
                      <MapPin size={15} />
                      {nextShift.location || "No location"}
                    </span>

                    <span>
                      <CalendarDays size={15} />
                      {dateLabel(nextShift.shiftStart, now)}
                      {", "}
                      {shiftTime(nextShift)}
                      {" · "}
                      {Number(shiftHours(nextShift).toFixed(2))}
                      {" hours"}
                    </span>
                  </div>
                </div>

                <footer>
                  <a
                    className="secondary-carer-button"
                    href={MY_SHIFTS_PATH}
                  >
                    View shifts
                  </a>

                  <button
                    className="primary-carer-button"
                    type="button"
                    onClick={() => void handleCheckIn()}
                    disabled={!canCheckIn || checkingIn}
                    title={
                      nextShift.status === "IN_PROGRESS"
                        ? "This shift is already in progress"
                        : "Check in is available during the scheduled shift"
                    }
                  >
                    <Play size={16} fill="currentColor" />

                    {checkingIn
                      ? "Checking in..."
                      : nextShift.status === "IN_PROGRESS"
                        ? "In progress"
                        : "Check in"}
                  </button>
                </footer>
              </>
            ) : (
              <div className="dashboard-empty-state">
                <p>No shifts assigned.</p>
                <small>
                  Your next shift will appear here when scheduled.
                </small>
              </div>
            )}

            {actionError && <p role="alert">{actionError}</p>}
            {actionMessage && <p role="status">{actionMessage}</p>}
          </article>

          <article className="carer-card tasks-card">
            <header>
              <h2>Today’s tasks</h2>
            </header>

            <div className="dashboard-empty-state">
              <p>Tasks are not connected yet.</p>
              <small>
                Connect a task API to display and complete care tasks.
              </small>
            </div>
          </article>

          <article className="carer-card upcoming-dashboard-card">
            <header>
              <h2>Upcoming shifts</h2>

              <a href={MY_SHIFTS_PATH}>View all</a>
            </header>

            {unavailable ? (
              <p>
                {loading
                  ? "Loading shifts..."
                  : "Shifts unavailable."}
              </p>
            ) : upcomingShifts.length === 0 ? (
              <div className="dashboard-empty-state">
                <p>No upcoming shifts.</p>
              </div>
            ) : (
              upcomingShifts.map((shift) => {
                const start = new Date(shift.shiftStart);

                return (
                  <div
                    className="dashboard-shift-row"
                    key={shift.id}
                  >
                    <div className="shift-date-box">
                      <strong>
                        {start
                          .toLocaleDateString("en-AU", {
                            weekday: "short",
                          })
                          .toUpperCase()}
                      </strong>

                      <span>
                        {start
                          .toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "short",
                          })
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="dashboard-shift-client">
                      <strong>{shift.clientName}</strong>
                      <span>{shift.notes || "Care shift"}</span>
                    </div>

                    <div className="dashboard-shift-time">
                      <strong>{shiftTime(shift)}</strong>
                      <span>
                        {Number(shiftHours(shift).toFixed(2))}
                        {" hours"}
                      </span>
                    </div>

                    <a
                      href={MY_SHIFTS_PATH}
                      aria-label={`View shifts for ${shift.clientName}`}
                    >
                      <ChevronRight size={17} />
                    </a>
                  </div>
                );
              })
            )}
          </article>

          <article className="carer-card announcements-card">
            <header>
              <h2>Announcements</h2>
            </header>

            <div className="dashboard-empty-state">
              <p>Announcements are not connected yet.</p>
              <small>
                Connect an announcement API to display staff updates.
              </small>
            </div>
          </article>
        </section>
      </main>
    </AppLayout>
  );
}

export default CarerDashboard;
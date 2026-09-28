import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AppLayout from "../components/AppLayout";

import {
  createRosterShift,
  getRoster,
  updateShiftStatus,
  type CreateRosterShiftData,
  type RosterShift,
  type ShiftStatus,
} from "../services/rosterApi";

import "../styles/roster.css";

interface CalendarShift {
  id: number;
  worker: string;
  client: string;
  time: string;
  location: string;
  status: ShiftStatus;
  type: "green" | "blue" | "orange" | "red" | "purple";
  top: number;
}

interface RosterDay {
  day: string;
  date: string;
  dateKey: string;
  today: boolean;
  shifts: CalendarShift[];
}

/*
 * The backend currently returns snake_case property names.
 * This interface lets the component support that response.
 */
interface RawRosterShift {
  id?: number;

  shiftStart?: string;
  shift_start?: string;

  shiftEnd?: string;
  shift_end?: string;

  clientId?: number;
  client_id?: number;

  clientName?: string;
  client_name?: string;

  careWorkerId?: number | null;
  care_worker_id?: number | null;

  careWorkerName?: string | null;
  care_worker_name?: string | null;

  location?: string | null;
  client_address?: string | null;

  status?: ShiftStatus;
  notes?: string | null;
}

const timeLabels = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
];

const emptyShiftForm: CreateRosterShiftData = {
  clientId: 0,
  careWorkerId: 0,
  shiftStart: "",
  shiftEnd: "",
  notes: "",
};

/*
 * Converts snake_case API data into the camelCase format
 * used by this component.
 */
function normaliseShift(
  shift: RawRosterShift,
): RosterShift {
  return {
    id: Number(shift.id),

    shiftStart:
      shift.shiftStart ??
      shift.shift_start ??
      "",

    shiftEnd:
      shift.shiftEnd ??
      shift.shift_end ??
      "",

    clientId:
      shift.clientId ??
      shift.client_id ??
      0,

    clientName:
      shift.clientName ??
      shift.client_name ??
      "Unknown client",

    careWorkerId:
      shift.careWorkerId ??
      shift.care_worker_id ??
      null,

    careWorkerName:
      shift.careWorkerName ??
      shift.care_worker_name ??
      null,

    location:
      shift.location ??
      shift.client_address ??
      null,

    status: shift.status ?? "SCHEDULED",
    notes: shift.notes ?? null,
  };
}

// Return Monday for the selected date's week.
function getStartOfWeek(date: Date): Date {
  const weekStart = new Date(date);
  const day = weekStart.getDay();

  // Sunday is 0, so move back six days.
  const difference = day === 0 ? -6 : 1 - day;

  weekStart.setDate(
    weekStart.getDate() + difference,
  );

  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
}

// Convert a date into YYYY-MM-DD using local time.
function getDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(date.getDate()).padStart(
    2,
    "0",
  );

  return `${year}-${month}-${day}`;
}

// Format time, for example 09:00.
function formatTime(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

// Calculate where the shift appears vertically.
function calculateShiftTop(
  dateValue: string,
): number {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 15;
  }

  const calendarStartHour = 8;
  const pixelsPerHour = 32;

  const hourDifference =
    date.getHours() +
    date.getMinutes() / 60 -
    calendarStartHour;

  return Math.max(
    15,
    hourDifference * pixelsPerHour + 15,
  );
}

// Select a colour based on the shift status.
function getShiftColour(
  status: ShiftStatus,
  careWorkerId: number | null,
): CalendarShift["type"] {
  if (!careWorkerId) {
    return "orange";
  }

  switch (status) {
    case "IN_PROGRESS":
      return "blue";

    case "COMPLETED":
      return "purple";

    case "CANCELLED":
      return "red";

    case "SCHEDULED":
    default:
      return "green";
  }
}

function Roster() {
  const [shifts, setShifts] = useState<
    RosterShift[]
  >([]);

  const [weekStart, setWeekStart] =
    useState<Date>(() =>
      getStartOfWeek(new Date()),
    );

  const [newShift, setNewShift] =
    useState<CreateRosterShiftData>(
      emptyShiftForm,
    );

  const [statusFilter, setStatusFilter] =
    useState<ShiftStatus | "ALL">("ALL");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [showFilter, setShowFilter] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [updatingShiftId, setUpdatingShiftId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /*
   * Prevent the calendar from returning to the first
   * shift's week every time the roster reloads.
   */
  const initialWeekSelected = useRef(false);

  // Retrieve roster shifts from the backend.
  const loadRoster =
    useCallback(async (): Promise<void> => {
      try {
        setError("");
        setIsLoading(true);

        const rosterResponse = await getRoster();

        /*
         * This supports both raw snake_case responses and
         * already-normalised camelCase responses.
         */
        const rosterData = (
          rosterResponse as unknown as RawRosterShift[]
        )
          .map(normaliseShift)
          .filter((shift) => {
            const startDate = new Date(
              shift.shiftStart,
            );

            return (
              shift.id > 0 &&
              !Number.isNaN(startDate.getTime())
            );
          });

        console.log(
          "Normalised roster:",
          rosterData,
        );

        setShifts(rosterData);

        /*
         * On the first load, show the week containing the
         * shift closest to today's date.
         */
        if (
          !initialWeekSelected.current &&
          rosterData.length > 0
        ) {
          const currentTime =
            new Date().getTime();

          const closestShift =
            rosterData.reduce(
              (closest, current) => {
                const closestDifference =
                  Math.abs(
                    new Date(
                      closest.shiftStart,
                    ).getTime() - currentTime,
                  );

                const currentDifference =
                  Math.abs(
                    new Date(
                      current.shiftStart,
                    ).getTime() - currentTime,
                  );

                return currentDifference <
                  closestDifference
                  ? current
                  : closest;
              },
            );

          setWeekStart(
            getStartOfWeek(
              new Date(
                closestShift.shiftStart,
              ),
            ),
          );

          initialWeekSelected.current = true;
        }
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to retrieve the roster.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  // Load shifts when the page opens.
  useEffect(() => {
    void loadRoster();
  }, [loadRoster]);

  // Apply the selected status filter.
  const filteredShifts = useMemo(() => {
    if (statusFilter === "ALL") {
      return shifts;
    }

    return shifts.filter(
      (shift) =>
        shift.status === statusFilter,
    );
  }, [shifts, statusFilter]);

  // Create seven calendar days for the selected week.
  const rosterDays = useMemo<
    RosterDay[]
  >(() => {
    return Array.from(
      { length: 7 },
      (_, index) => {
        const currentDate = new Date(
          weekStart,
        );

        currentDate.setDate(
          weekStart.getDate() + index,
        );

        const dateKey =
          getDateKey(currentDate);

        const dayShifts = filteredShifts
          .filter((shift) => {
            const shiftDate = new Date(
              shift.shiftStart,
            );

            return (
              !Number.isNaN(
                shiftDate.getTime(),
              ) &&
              getDateKey(shiftDate) ===
                dateKey
            );
          })
          .map<CalendarShift>((shift) => ({
            id: shift.id,

            worker:
              shift.careWorkerName?.trim() ||
              "Unassigned",

            client:
              shift.clientName ||
              "Unknown client",

            time: `${formatTime(
              shift.shiftStart,
            )} – ${formatTime(
              shift.shiftEnd,
            )}`,

            location:
              shift.location ||
              "No location",

            status: shift.status,

            type: getShiftColour(
              shift.status,
              shift.careWorkerId,
            ),

            top: calculateShiftTop(
              shift.shiftStart,
            ),
          }));

        return {
          day: currentDate.toLocaleDateString(
            "en-AU",
            {
              weekday: "short",
            },
          ),

          date:
            currentDate.toLocaleDateString(
              "en-AU",
              {
                day: "2-digit",
                month: "short",
              },
            ),

          dateKey,

          today:
            dateKey ===
            getDateKey(new Date()),

          shifts: dayShifts,
        };
      },
    );
  }, [weekStart, filteredShifts]);

  // Find shifts without an assigned worker.
  const unassignedShifts = useMemo(() => {
    return shifts.filter(
      (shift) =>
        shift.careWorkerId === null,
    );
  }, [shifts]);

  // Display the current calendar range.
  const weekRange = useMemo(() => {
    const weekEnd = new Date(weekStart);

    weekEnd.setDate(
      weekStart.getDate() + 6,
    );

    const startText =
      weekStart.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });

    const endText =
      weekEnd.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    return `${startText} – ${endText}`;
  }, [weekStart]);

  function showPreviousWeek(): void {
    setWeekStart((current) => {
      const previousWeek = new Date(
        current,
      );

      previousWeek.setDate(
        current.getDate() - 7,
      );

      return previousWeek;
    });
  }

  function showNextWeek(): void {
    setWeekStart((current) => {
      const nextWeek = new Date(current);

      nextWeek.setDate(
        current.getDate() + 7,
      );

      return nextWeek;
    });
  }

  function showCurrentWeek(): void {
    setWeekStart(
      getStartOfWeek(new Date()),
    );
  }

  function closeCreateForm(): void {
    setShowCreateForm(false);
    setNewShift(emptyShiftForm);
    setError("");
  }

  // Create a new roster shift.
  async function handleCreateShift(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (
      !newShift.clientId ||
      !newShift.careWorkerId ||
      !newShift.shiftStart ||
      !newShift.shiftEnd
    ) {
      setError(
        "Please complete all required shift fields.",
      );

      return;
    }

    const startDate = new Date(
      newShift.shiftStart,
    );

    const endDate = new Date(
      newShift.shiftEnd,
    );

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      setError(
        "Please enter valid shift dates.",
      );

      return;
    }

    if (endDate <= startDate) {
      setError(
        "Shift end time must be after start time.",
      );

      return;
    }

    try {
      setError("");
      setMessage("");
      setIsSaving(true);

      await createRosterShift({
        clientId: newShift.clientId,
        careWorkerId:
          newShift.careWorkerId,

        shiftStart:
          startDate.toISOString(),

        shiftEnd:
          endDate.toISOString(),

        notes:
          newShift.notes?.trim() ||
          undefined,
      });

      setMessage(
        "Shift created successfully.",
      );

      setShowCreateForm(false);
      setNewShift(emptyShiftForm);

      /*
       * Display the week containing the newly
       * created shift.
       */
      setWeekStart(
        getStartOfWeek(startDate),
      );

      await loadRoster();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create the shift.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  // Update an existing shift's status.
  async function handleStatusChange(
    shiftId: number,
    status: ShiftStatus,
  ): Promise<void> {
    try {
      setError("");
      setMessage("");
      setUpdatingShiftId(shiftId);

      const response =
        await updateShiftStatus(
          shiftId,
          status,
        );

      const updatedShift =
        normaliseShift(
          response as unknown as RawRosterShift,
        );

      setShifts((currentShifts) =>
        currentShifts.map((shift) =>
          shift.id === shiftId
            ? {
                ...shift,
                ...updatedShift,
                status,
              }
            : shift,
        ),
      );

      setMessage(
        "Shift status updated successfully.",
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update shift status.",
      );
    } finally {
      setUpdatingShiftId(null);
    }
  }

  return (
    <AppLayout>
      <main className="page-content roster-page">
        <section className="roster-page-header">
          <div>
            <h1>Roster</h1>

            <p>
              View and manage your team’s
              shifts.
            </p>
          </div>

          <div className="roster-controls">
            <button
              className="outline-button"
              type="button"
              onClick={showCurrentWeek}
            >
              Today
            </button>

            <div className="date-arrows">
              <button
                type="button"
                aria-label="Previous week"
                onClick={showPreviousWeek}
              >
                <ChevronLeft size={17} />
              </button>

              <button
                type="button"
                aria-label="Next week"
                onClick={showNextWeek}
              >
                <ChevronRight size={17} />
              </button>
            </div>

            <button
              className="date-button"
              type="button"
            >
              {weekRange}
            </button>

            <select
              defaultValue="week"
              aria-label="Roster view"
            >
              <option value="week">
                Week
              </option>

              <option value="day">
                Day
              </option>

              <option value="month">
                Month
              </option>
            </select>

            <button
              className="outline-button"
              type="button"
              onClick={() => {
                setShowFilter(true);
                setShowCreateForm(false);
              }}
            >
              <Filter size={17} />
              Filter
            </button>

            <button
              className="green-button"
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                setShowFilter(false);
                setShowCreateForm(true);
              }}
            >
              <Plus size={17} />
              Create shift
            </button>
          </div>
        </section>

        {error && (
          <p
            className="error-message"
            role="alert"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            className="success-message"
            role="status"
          >
            {message}
          </p>
        )}

        {/* Floating filter modal */}
        {showFilter && (
          <div
            className="roster-modal-overlay"
            role="presentation"
            onMouseDown={() =>
              setShowFilter(false)
            }
          >
            <section
              className="content-card roster-filter-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-title"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <header className="card-header">
                <div>
                  <h2 id="filter-title">
                    Filter roster
                  </h2>

                  <p>
                    Select which shifts should
                    be displayed.
                  </p>
                </div>

                <button
                  className="close-shift-button"
                  type="button"
                  aria-label="Close filter"
                  onClick={() =>
                    setShowFilter(false)
                  }
                >
                  <X size={20} />
                </button>
              </header>

              <div className="filter-form">
                <label className="filter-field">
                  Shift status

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target
                          .value as
                          | ShiftStatus
                          | "ALL",
                      )
                    }
                  >
                    <option value="ALL">
                      All statuses
                    </option>

                    <option value="SCHEDULED">
                      Scheduled
                    </option>

                    <option value="IN_PROGRESS">
                      In progress
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>
                  </select>
                </label>

                <div className="filter-card-actions">
                  <button
                    className="clear-filter-button"
                    type="button"
                    onClick={() => {
                      setStatusFilter("ALL");
                      setShowFilter(false);
                    }}
                  >
                    Clear filter
                  </button>

                  <button
                    className="green-button"
                    type="button"
                    onClick={() =>
                      setShowFilter(false)
                    }
                  >
                    Apply filter
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Floating create-shift modal */}
        {showCreateForm && (
          <div
            className="roster-modal-overlay"
            role="presentation"
            onMouseDown={closeCreateForm}
          >
            <section
              className="content-card create-shift-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-shift-title"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <header className="card-header">
                <div>
                  <h2 id="create-shift-title">
                    Create shift
                  </h2>

                  <p>
                    Assign a client and care
                    worker to a new shift.
                  </p>
                </div>

                <button
                  className="close-shift-button"
                  type="button"
                  aria-label="Close create shift form"
                  onClick={closeCreateForm}
                >
                  <X size={20} />
                </button>
              </header>

              <form
                className="create-shift-form"
                onSubmit={
                  handleCreateShift
                }
              >
                <label>
                  Client ID <b>*</b>

                  <input
                    name="clientId"
                    type="number"
                    min="1"
                    placeholder="Enter client ID"
                    value={
                      newShift.clientId || ""
                    }
                    onChange={(event) =>
                      setNewShift(
                        (current) => ({
                          ...current,

                          clientId: Number(
                            event.target.value,
                          ),
                        }),
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Care worker ID <b>*</b>

                  <input
                    name="careWorkerId"
                    type="number"
                    min="1"
                    placeholder="Enter care worker ID"
                    value={
                      newShift.careWorkerId ||
                      ""
                    }
                    onChange={(event) =>
                      setNewShift(
                        (current) => ({
                          ...current,

                          careWorkerId:
                            Number(
                              event.target
                                .value,
                            ),
                        }),
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Shift start <b>*</b>

                  <input
                    name="shiftStart"
                    type="datetime-local"
                    value={
                      newShift.shiftStart
                    }
                    onChange={(event) =>
                      setNewShift(
                        (current) => ({
                          ...current,

                          shiftStart:
                            event.target
                              .value,
                        }),
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Shift end <b>*</b>

                  <input
                    name="shiftEnd"
                    type="datetime-local"
                    min={
                      newShift.shiftStart ||
                      undefined
                    }
                    value={newShift.shiftEnd}
                    onChange={(event) =>
                      setNewShift(
                        (current) => ({
                          ...current,

                          shiftEnd:
                            event.target
                              .value,
                        }),
                      )
                    }
                    required
                  />
                </label>

                <label className="full-width-field">
                  Notes

                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="Enter care instructions or shift notes"
                    value={
                      newShift.notes ?? ""
                    }
                    onChange={(event) =>
                      setNewShift(
                        (current) => ({
                          ...current,

                          notes:
                            event.target
                              .value,
                        }),
                      )
                    }
                  />
                </label>

                <div className="create-shift-information">
                  The client must already be
                  assigned to the selected care
                  worker before creating this
                  shift.
                </div>

                <div className="create-shift-actions">
                  <button
                    className="outline-button"
                    type="button"
                    disabled={isSaving}
                    onClick={closeCreateForm}
                  >
                    Cancel
                  </button>

                  <button
                    className="green-button"
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Creating..."
                      : "Create shift"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        <section className="calendar-card">
          {isLoading ? (
            <p className="roster-loading">
              Loading roster...
            </p>
          ) : (
            <div className="calendar-grid">
              <div className="time-column">
                <div className="calendar-corner">
                  –
                </div>

                <div className="time-labels">
                  {timeLabels.map((time) => (
                    <span key={time}>
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {rosterDays.map((day) => (
                <div
                  className="calendar-day"
                  key={day.dateKey}
                >
                  <header
                    className={
                      day.today
                        ? "today"
                        : ""
                    }
                  >
                    <strong>
                      {day.day}
                    </strong>

                    <span>{day.date}</span>
                  </header>

                  <div className="day-body">
                    {day.shifts.map(
                      (shift) => (
                        <article
                          className={`calendar-shift calendar-shift--${shift.type}`}
                          style={{
                            top: `${shift.top}px`,
                          }}
                          key={shift.id}
                        >
                          <strong>
                            {shift.worker}
                          </strong>

                          <span>
                            {shift.time}
                          </span>

                          <span>
                            {shift.location}
                          </span>

                          <small>
                            {shift.client}
                          </small>

                          <select
                            className="shift-status-select"
                            value={
                              shift.status
                            }
                            disabled={
                              updatingShiftId ===
                              shift.id
                            }
                            aria-label={`Status for shift ${shift.id}`}
                            onChange={(
                              event,
                            ) =>
                              void handleStatusChange(
                                shift.id,

                                event.target
                                  .value as ShiftStatus,
                              )
                            }
                          >
                            <option value="SCHEDULED">
                              Scheduled
                            </option>

                            <option value="IN_PROGRESS">
                              In progress
                            </option>

                            <option value="COMPLETED">
                              Completed
                            </option>

                            <option value="CANCELLED">
                              Cancelled
                            </option>
                          </select>
                        </article>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="content-card unassigned-card">
          <header className="card-header">
            <div>
              <h2>
                Unassigned shifts (
                {unassignedShifts.length})
              </h2>

              <p>
                These shifts need to be
                filled.
              </p>
            </div>

            <button
              className="link-button"
              type="button"
              onClick={() =>
                setStatusFilter("ALL")
              }
            >
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
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {unassignedShifts.length ===
                0 ? (
                  <tr>
                    <td colSpan={6}>
                      There are currently no
                      unassigned shifts.
                    </td>
                  </tr>
                ) : (
                  unassignedShifts.map(
                    (shift) => (
                      <tr key={shift.id}>
                        <td>
                          {new Date(
                            shift.shiftStart,
                          ).toLocaleDateString(
                            "en-AU",
                            {
                              weekday:
                                "short",

                              day: "2-digit",

                              month:
                                "short",
                            },
                          )}
                        </td>

                        <td>
                          {formatTime(
                            shift.shiftStart,
                          )}{" "}
                          –{" "}
                          {formatTime(
                            shift.shiftEnd,
                          )}
                        </td>

                        <td>
                          {shift.location ??
                            "No location"}
                        </td>

                        <td>
                          {shift.clientName}
                        </td>

                        <td>
                          {shift.notes ??
                            "No notes"}
                        </td>

                        <td>
                          <select
                            value={
                              shift.status
                            }
                            disabled={
                              updatingShiftId ===
                              shift.id
                            }
                            onChange={(
                              event,
                            ) =>
                              void handleStatusChange(
                                shift.id,

                                event.target
                                  .value as ShiftStatus,
                              )
                            }
                          >
                            <option value="SCHEDULED">
                              Scheduled
                            </option>

                            <option value="IN_PROGRESS">
                              In progress
                            </option>

                            <option value="COMPLETED">
                              Completed
                            </option>

                            <option value="CANCELLED">
                              Cancelled
                            </option>
                          </select>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

export default Roster;
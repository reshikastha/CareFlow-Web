import { useCallback, useEffect, useState } from "react";
import { Info, MoreHorizontal, Plus } from "lucide-react";

import AppLayout from "../components/AppLayout";
import "../styles/availability.css";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type ShiftLength =
  | "UNDER_4_HOURS"
  | "4_TO_8_HOURS"
  | "OVER_8_HOURS";

type ExceptionType = "UNAVAILABLE" | "CUSTOM_HOURS";

interface AvailabilityDay {
  dayOfWeek: number;
  day: string;
  available: boolean;
  start: string;
  end: string;
}

interface DateException {
  id: number;
  date: string;
  type: ExceptionType;
  startTime: string;
  endTime: string;
  reason: string;
}

interface ExceptionForm {
  date: string;
  type: ExceptionType;
  startTime: string;
  endTime: string;
  reason: string;
}

interface AvailabilityResponse {
  success: boolean;
  weekly: {
    day_of_week: number;
    is_available: boolean;
    start_time: string | null;
    end_time: string | null;
  }[];
  preferences: {
    maximum_weekly_hours: number | string;
    preferred_shift_length: ShiftLength;
  } | null;
  exceptions: {
    id: number;
    exception_date: string;
    type: ExceptionType;
    start_time: string | null;
    end_time: string | null;
    reason: string | null;
  }[];
}

const emptyWeekly: AvailabilityDay[] = dayNames.map(
  (day, dayOfWeek) => ({
    dayOfWeek,
    day,
    available: false,
    start: "",
    end: "",
  }),
);

const emptyExceptionForm: ExceptionForm = {
  date: "",
  type: "UNAVAILABLE",
  startTime: "09:00",
  endTime: "17:00",
  reason: "",
};

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("careflow_token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? `Request failed (${response.status}).`,
    );
  }

  return data as T;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date.slice(0, 10)}T12:00:00Z`));
}

function Availability() {
  const [availability, setAvailability] =
    useState<AvailabilityDay[]>(emptyWeekly);

  const [savedAvailability, setSavedAvailability] =
    useState<AvailabilityDay[]>(emptyWeekly);

  const [maximumWeeklyHours, setMaximumWeeklyHours] =
    useState(32);

  const [savedMaximumWeeklyHours, setSavedMaximumWeeklyHours] =
    useState(32);

  const [preferredShiftLength, setPreferredShiftLength] =
    useState<ShiftLength>("4_TO_8_HOURS");

  const [savedPreferredShiftLength, setSavedPreferredShiftLength] =
    useState<ShiftLength>("4_TO_8_HOURS");

  const [exceptions, setExceptions] =
    useState<DateException[]>([]);

  const [showExceptionForm, setShowExceptionForm] =
    useState(false);

  const [editingExceptionId, setEditingExceptionId] =
    useState<number | null>(null);

  const [openMenuId, setOpenMenuId] =
    useState<number | null>(null);

  const [exceptionForm, setExceptionForm] =
    useState<ExceptionForm>(emptyExceptionForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAvailability = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest<AvailabilityResponse>(
        "/me/availability",
      );

      const weekly: AvailabilityDay[] = dayNames.map(
        (day, dayOfWeek) => {
          const saved = data.weekly.find(
            (item) => Number(item.day_of_week) === dayOfWeek,
          );

          return {
            dayOfWeek,
            day,
            available: saved?.is_available ?? false,
            start: saved?.start_time?.slice(0, 5) ?? "",
            end: saved?.end_time?.slice(0, 5) ?? "",
          };
        },
      );

      const hours = Number(
        data.preferences?.maximum_weekly_hours ?? 32,
      );

      const shiftLength =
        data.preferences?.preferred_shift_length ??
        "4_TO_8_HOURS";

      setAvailability(weekly);
      setSavedAvailability(weekly);
      setMaximumWeeklyHours(hours);
      setSavedMaximumWeeklyHours(hours);
      setPreferredShiftLength(shiftLength);
      setSavedPreferredShiftLength(shiftLength);

      setExceptions(
        data.exceptions.map((item) => ({
          id: item.id,
          date: item.exception_date.slice(0, 10),
          type: item.type,
          startTime: item.start_time?.slice(0, 5) ?? "",
          endTime: item.end_time?.slice(0, 5) ?? "",
          reason: item.reason ?? "",
        })),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load availability.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  function updateDay(
    dayOfWeek: number,
    changes: Partial<AvailabilityDay>,
  ) {
    setAvailability((current) =>
      current.map((item) =>
        item.dayOfWeek === dayOfWeek
          ? { ...item, ...changes }
          : item,
      ),
    );

    setMessage("");
  }

  function toggleDay(dayOfWeek: number) {
    setAvailability((current) =>
      current.map((item) => {
        if (item.dayOfWeek !== dayOfWeek) return item;

        const available = !item.available;

        return {
          ...item,
          available,
          start: available ? "09:00" : "",
          end: available ? "17:00" : "",
        };
      }),
    );

    setMessage("");
  }

  async function saveAvailability() {
    setError("");
    setMessage("");

    if (
      availability.some(
        (item) =>
          item.available &&
          (!item.start ||
            !item.end ||
            item.start >= item.end),
      )
    ) {
      setError(
        "Each available day needs a start time earlier than its end time.",
      );
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/me/availability", {
        method: "PUT",
        body: JSON.stringify({
          weekly: availability.map((item) => ({
            dayOfWeek: item.dayOfWeek,
            isAvailable: item.available,
            startTime: item.available ? item.start : null,
            endTime: item.available ? item.end : null,
          })),
          maximumWeeklyHours,
          preferredShiftLength,
        }),
      });

      setSavedAvailability(
        availability.map((item) => ({ ...item })),
      );
      setSavedMaximumWeeklyHours(maximumWeeklyHours);
      setSavedPreferredShiftLength(preferredShiftLength);
      setMessage("Availability saved successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save availability.",
      );
    } finally {
      setSaving(false);
    }
  }

  function cancelAvailabilityChanges() {
    setAvailability(
      savedAvailability.map((item) => ({ ...item })),
    );
    setMaximumWeeklyHours(savedMaximumWeeklyHours);
    setPreferredShiftLength(savedPreferredShiftLength);
    setError("");
    setMessage("");
  }

  function openAddException() {
    setEditingExceptionId(null);
    setExceptionForm({ ...emptyExceptionForm });
    setShowExceptionForm(true);
    setOpenMenuId(null);
    setError("");
    setMessage("");
  }

  function openEditException(item: DateException) {
    setEditingExceptionId(item.id);
    setExceptionForm({
      date: item.date,
      type: item.type,
      startTime: item.startTime || "09:00",
      endTime: item.endTime || "17:00",
      reason: item.reason,
    });
    setShowExceptionForm(true);
    setOpenMenuId(null);
    setError("");
    setMessage("");
  }

  async function saveException(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (
      exceptionForm.type === "CUSTOM_HOURS" &&
      exceptionForm.startTime >= exceptionForm.endTime
    ) {
      setError(
        "The exception start time must be earlier than its end time.",
      );
      return;
    }

    const path =
      editingExceptionId === null
        ? "/me/availability/exceptions"
        : `/me/availability/exceptions/${editingExceptionId}`;

    try {
      setSaving(true);

      await apiRequest(path, {
        method:
          editingExceptionId === null ? "POST" : "PATCH",
        body: JSON.stringify({
          date: exceptionForm.date,
          type: exceptionForm.type,
          startTime:
            exceptionForm.type === "CUSTOM_HOURS"
              ? exceptionForm.startTime
              : null,
          endTime:
            exceptionForm.type === "CUSTOM_HOURS"
              ? exceptionForm.endTime
              : null,
          reason: exceptionForm.reason,
        }),
      });

      setShowExceptionForm(false);
      setEditingExceptionId(null);
      await loadAvailability();
      setMessage("Date exception saved successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save the exception.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteException(id: number) {
    setOpenMenuId(null);
    setError("");
    setMessage("");

    try {
      await apiRequest(
        `/me/availability/exceptions/${id}`,
        { method: "DELETE" },
      );

      setExceptions((current) =>
        current.filter((item) => item.id !== id),
      );
      setMessage("Date exception removed.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to remove the exception.",
      );
    }
  }

  return (
    <AppLayout>
      <main className="carer-page availability-page">
        <section className="availability-heading">
          <h1>My availability</h1>
          <p>
            Set your regular weekly availability so we can
            match you with suitable shifts.
          </p>
        </section>

        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}

        {loading ? (
          <p>Loading availability...</p>
        ) : (
          <section className="availability-layout">
            <div>
              <article className="availability-card">
                <header>
                  <h2>Weekly availability</h2>
                  <p>
                    This is a repeating weekly schedule.
                    You can also add date exceptions below.
                  </p>
                </header>

                <div className="availability-table">
                  <div className="availability-row availability-labels">
                    <span>Day</span>
                    <span>Availability</span>
                    <span>Start time</span>
                    <span>End time</span>
                  </div>

                  {availability.map((item) => (
                    <div
                      className="availability-row"
                      key={item.dayOfWeek}
                    >
                      <strong>{item.day}</strong>

                      <label className="availability-toggle">
                        <input
                          type="checkbox"
                          checked={item.available}
                          onChange={() =>
                            toggleDay(item.dayOfWeek)
                          }
                        />
                        <span className="toggle-switch" />
                        <em>
                          {item.available
                            ? "Available"
                            : "Unavailable"}
                        </em>
                      </label>

                      <input
                        className="time-select"
                        type="time"
                        aria-label={`${item.day} start time`}
                        value={item.start}
                        disabled={!item.available}
                        onChange={(event) =>
                          updateDay(item.dayOfWeek, {
                            start: event.target.value,
                          })
                        }
                      />

                      <input
                        className="time-select"
                        type="time"
                        aria-label={`${item.day} end time`}
                        value={item.end}
                        disabled={!item.available}
                        onChange={(event) =>
                          updateDay(item.dayOfWeek, {
                            end: event.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </article>

              <article className="availability-card exceptions-card">
                <header>
                  <div>
                    <h2>Date exceptions // Unavailable</h2>
                    <p>
                      Add dates when you’re unavailable or
                      have different availability.
                    </p>
                  </div>

                  <button
                    className="add-exception-button"
                    type="button"
                    onClick={openAddException}
                  >
                    <Plus size={17} />
                    Add exception
                  </button>
                </header>

                {showExceptionForm && (
                  <form
                    className="exception-form"
                    onSubmit={(event) =>
                      void saveException(event)
                    }
                  >
                    <h3>
                      {editingExceptionId === null
                        ? "Add date exception"
                        : "Edit date exception"}
                    </h3>

                    <label>
                      Date
                      <input
                        type="date"
                        required
                        value={exceptionForm.date}
                        onChange={(event) =>
                          setExceptionForm((current) => ({
                            ...current,
                            date: event.target.value,
                          }))
                        }
                      />
                    </label>

                    <label>
                      Type
                      <select
                        value={exceptionForm.type}
                        onChange={(event) =>
                          setExceptionForm((current) => ({
                            ...current,
                            type: event.target
                              .value as ExceptionType,
                          }))
                        }
                      >
                        <option value="UNAVAILABLE">
                          Unavailable
                        </option>
                        <option value="CUSTOM_HOURS">
                          Different hours
                        </option>
                      </select>
                    </label>

                    {exceptionForm.type ===
                      "CUSTOM_HOURS" && (
                      <>
                        <label>
                          Start time
                          <input
                            type="time"
                            required
                            value={exceptionForm.startTime}
                            onChange={(event) =>
                              setExceptionForm(
                                (current) => ({
                                  ...current,
                                  startTime:
                                    event.target.value,
                                }),
                              )
                            }
                          />
                        </label>

                        <label>
                          End time
                          <input
                            type="time"
                            required
                            value={exceptionForm.endTime}
                            onChange={(event) =>
                              setExceptionForm(
                                (current) => ({
                                  ...current,
                                  endTime:
                                    event.target.value,
                                }),
                              )
                            }
                          />
                        </label>
                      </>
                    )}

                    <label>
                      Reason
                      <input
                        type="text"
                        value={exceptionForm.reason}
                        onChange={(event) =>
                          setExceptionForm((current) => ({
                            ...current,
                            reason: event.target.value,
                          }))
                        }
                      />
                    </label>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setShowExceptionForm(false)
                        }
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                      >
                        {saving
                          ? "Saving..."
                          : "Save exception"}
                      </button>
                    </div>
                  </form>
                )}

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {exceptions.length === 0 ? (
                        <tr>
                          <td colSpan={4}>
                            No date exceptions added.
                          </td>
                        </tr>
                      ) : (
                        exceptions.map((item) => (
                          <tr key={item.id}>
                            <td>{formatDate(item.date)}</td>
                            <td>
                              <span
                                className={
                                  item.type === "UNAVAILABLE"
                                    ? "unavailable-label"
                                    : ""
                                }
                              >
                                {item.type === "UNAVAILABLE"
                                  ? "Unavailable"
                                  : `${item.startTime}–${item.endTime}`}
                              </span>
                            </td>
                            <td>{item.reason || "—"}</td>
                            <td>
                              <button
                                type="button"
                                aria-label={`Actions for ${formatDate(item.date)}`}
                                aria-expanded={
                                  openMenuId === item.id
                                }
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === item.id
                                      ? null
                                      : item.id,
                                  )
                                }
                              >
                                <MoreHorizontal size={17} />
                              </button>

                              {openMenuId === item.id && (
                                <div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditException(item)
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void deleteException(
                                        item.id,
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>

            <aside className="preferred-hours-card">
              <header>
                <h2>Preferred hours</h2>
                <p>
                  Help us find shifts that suit your
                  preferences.
                </p>
              </header>

              <label>
                Maximum weekly hours
                <div className="hours-input">
                  <input
                    type="number"
                    min={1}
                    max={168}
                    step="0.5"
                    value={maximumWeeklyHours}
                    onChange={(event) =>
                      setMaximumWeeklyHours(
                        Number(event.target.value),
                      )
                    }
                  />
                  <span>hours</span>
                </div>
              </label>

              <label>
                Preferred shift length
                <select
                  value={preferredShiftLength}
                  onChange={(event) =>
                    setPreferredShiftLength(
                      event.target
                        .value as ShiftLength,
                    )
                  }
                >
                  <option value="UNDER_4_HOURS">
                    Under 4 hours
                  </option>
                  <option value="4_TO_8_HOURS">
                    4 – 8 hours
                  </option>
                  <option value="OVER_8_HOURS">
                    Over 8 hours
                  </option>
                </select>
              </label>

              <section className="availability-info">
                <Info size={20} />
                <p>
                  <strong>Your availability</strong>
                  <span>
                    We’ll use this information to suggest
                    shifts that match your availability.
                    You can update it at any time.
                  </span>
                </p>
              </section>

              <footer>
                <button
                  type="button"
                  onClick={cancelAvailabilityChanges}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void saveAvailability()
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save availability"}
                </button>
              </footer>
            </aside>
          </section>
        )}
      </main>
    </AppLayout>
  );
}

export default Availability;
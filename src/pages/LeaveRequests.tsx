import {
  CalendarDays,
  Check,
  Clock3,
  Paperclip,
  Plus,
} from "lucide-react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AppLayout from "../components/AppLayout";
import "../styles/leaveRequests.css";

import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type LeaveType = "ANNUAL" | "PERSONAL" | "SICK";

type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "DECLINED"
  | "CANCELLED";

interface LeaveRequest {
  id: number;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  partial_day: boolean;
  partial_hours: string | number | null;
  requested_days: string | number;
  reason: string;
  status: LeaveStatus;
  attachment_name: string | null;
  created_at: string;
  reviewed_at: string | null;
}

interface LeaveResponse {
  success: boolean;
  availableBalance: number;
  pendingRequests: number;
  approvedDaysThisYear: number;
  requests: LeaveRequest[];
}

interface LeaveForm {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  partialDay: boolean;
  partialOption: "HALF_DAY" | "CUSTOM_HOURS";
  partialHours: string;
  reason: string;
  attachment: File | null;
}

const initialForm: LeaveForm = {
  leaveType: "ANNUAL",
  startDate: "",
  endDate: "",
  partialDay: false,
  partialOption: "HALF_DAY",
  partialHours: "",
  reason: "",
  attachment: null,
};

function getToken(): string {
  const token = localStorage.getItem("careflow_token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return token;
}

async function readResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? `Request failed (${response.status}).`,
    );
  }

  return data;
}

function formatDate(value: string): string {
  const datePart = value.slice(0, 10);

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${datePart}T12:00:00Z`));
}

function formatDateRange(start: string, end: string): string {
  if (start.slice(0, 10) === end.slice(0, 10)) {
    return formatDate(start);
  }

  return `${formatDate(start)} – ${formatDate(end)}`;
}

function leaveTypeLabel(type: LeaveType): string {
  return {
    ANNUAL: "Annual leave",
    PERSONAL: "Personal leave",
    SICK: "Sick leave",
  }[type];
}

function LeaveRequests() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<LeaveForm>(initialForm);
  const [leaveData, setLeaveData] =
    useState<LeaveResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] =
    useState<number | null>(null);

  const [showAll, setShowAll] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const loadLeave = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/me/leave`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = (await readResponse(
        response,
      )) as LeaveResponse;

      setLeaveData(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load leave requests.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeave();
  }, [loadLeave]);

  function resetForm() {
    setForm({ ...initialForm });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setForm((current) => ({
        ...current,
        attachment: null,
      }));
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError(
        "Choose a PDF, JPG or PNG file smaller than 5 MB.",
      );
      event.target.value = "";
      setForm((current) => ({
        ...current,
        attachment: null,
      }));
      return;
    }

    setError("");
    setForm((current) => ({
      ...current,
      attachment: file,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (form.endDate < form.startDate) {
      setError("End date must be on or after start date.");
      return;
    }

    if (
      form.partialDay &&
      form.startDate !== form.endDate
    ) {
      setError(
        "A partial day must have the same start and end date.",
      );
      return;
    }

    if (
      form.partialDay &&
      form.partialOption === "CUSTOM_HOURS" &&
      (
        !Number.isFinite(Number(form.partialHours)) ||
        Number(form.partialHours) <= 0 ||
        Number(form.partialHours) > 8
      )
    ) {
      setError("Enter between 0 and 8 partial hours.");
      return;
    }

    const body = new FormData();
    body.append("leaveType", form.leaveType);
    body.append("startDate", form.startDate);
    body.append("endDate", form.endDate);
    body.append("partialDay", String(form.partialDay));
    body.append("reason", form.reason.trim());

    if (
      form.partialDay &&
      form.partialOption === "CUSTOM_HOURS"
    ) {
      body.append("partialHours", form.partialHours);
    }

    if (form.attachment) {
      body.append("attachment", form.attachment);
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/me/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body,
        },
      );

      await readResponse(response);

      resetForm();
      await loadLeave();
      setMessage("Your leave request has been submitted.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit your leave request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelRequest(id: number) {
    setError("");
    setMessage("");

    try {
      setCancellingId(id);

      const response = await fetch(
        `${API_URL}/me/leave/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      await readResponse(response);
      await loadLeave();
      setMessage("Leave request cancelled.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to cancel the request.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  async function downloadAttachment(
    request: LeaveRequest,
  ) {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/me/leave/${request.id}/attachment`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (!response.ok) {
        await readResponse(response);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download =
        request.attachment_name ?? "leave-attachment";

      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to download the attachment.",
      );
    }
  }

  const requests = leaveData?.requests ?? [];
  const visibleRequests = showAll
    ? requests
    : requests.slice(0, 5);

  return (
    <AppLayout>
      <main className="carer-page leave-page">
        <section className="leave-heading">
          <div>
            <h1>Leave requests</h1>
            <p>
              Manage your leave and view your leave balance.
            </p>
          </div>

         
        </section>

        {error && <p role="alert">{error}</p>}
        {message && (
          <p className="leave-success-message" role="status">
            {message}
          </p>
        )}

        {loading && !leaveData ? (
          <p>Loading leave requests...</p>
        ) : (
          <>
            <section className="leave-stat-grid">
              <article className="leave-stat leave-stat--green">
                <CalendarDays size={26} />
                <div>
                  <strong>
                    {leaveData?.availableBalance ?? 0}{" "}
                    <small>days</small>
                  </strong>
                  <span>Available balance</span>
                </div>
              </article>

              <article className="leave-stat leave-stat--orange">
                <Clock3 size={26} />
                <div>
                  <strong>
                    {leaveData?.pendingRequests ?? 0}{" "}
                    <small>requests</small>
                  </strong>
                  <span>Pending requests</span>
                </div>
              </article>

              <article className="leave-stat leave-stat--green">
                <Check size={26} />
                <div>
                  <strong>
                    {leaveData?.approvedDaysThisYear ?? 0}{" "}
                    <small>days</small>
                  </strong>
                  <span>Approved leave (this year)</span>
                </div>
              </article>
            </section>

            <section className="leave-layout">
              <form
                ref={formRef}
                className="leave-form-card"
                onSubmit={(event) =>
                  void handleSubmit(event)
                }
              >
                <h2>New leave request</h2>

                <label>
                  Leave type
                  <select
                    value={form.leaveType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        leaveType: event.target
                          .value as LeaveType,
                      }))
                    }
                  >
                    <option value="ANNUAL">
                      Annual leave
                    </option>
                    <option value="PERSONAL">
                      Personal leave
                    </option>
                    <option value="SICK">Sick leave</option>
                  </select>
                </label>

                <div className="leave-date-grid">
                  <label>
                    Start date
                    <input
                      type="date"
                      required
                      value={form.startDate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          startDate: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    End date
                    <input
                      type="date"
                      required
                      min={form.startDate || undefined}
                      value={form.endDate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          endDate: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <label className="partial-day">
                  <input
                    type="checkbox"
                    checked={form.partialDay}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        partialDay: event.target.checked,
                      }))
                    }
                  />
                  Partial day (half day or custom hours)
                </label>

                {form.partialDay && (
                  <>
                    <label>
                      Partial day type
                      <select
                        value={form.partialOption}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            partialOption: event.target
                              .value as
                              | "HALF_DAY"
                              | "CUSTOM_HOURS",
                          }))
                        }
                      >
                        <option value="HALF_DAY">
                          Half day
                        </option>
                        <option value="CUSTOM_HOURS">
                          Custom hours
                        </option>
                      </select>
                    </label>

                    {form.partialOption ===
                      "CUSTOM_HOURS" && (
                      <label>
                        Number of hours
                        <input
                          type="number"
                          min="0.5"
                          max="8"
                          step="0.5"
                          required
                          value={form.partialHours}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              partialHours:
                                event.target.value,
                            }))
                          }
                        />
                      </label>
                    )}
                  </>
                )}

                <label>
                  Reason
                  <textarea
                    required
                    value={form.reason}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        reason: event.target.value,
                      }))
                    }
                    placeholder="Enter your reason"
                  />
                </label>

                <div>
                  <span className="file-label">
                    Attach a file (optional)
                  </span>

                  <label className="file-upload">
                    <Paperclip size={22} />
                    <span>
                      <strong>
                        {form.attachment
                          ? form.attachment.name
                          : "Choose a file"}
                      </strong>
                      <small>
                        PDF, JPG or PNG (max 5 MB)
                      </small>
                    </span>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      hidden
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <footer>
                  <button
                    type="button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit request"}
                  </button>
                </footer>
              </form>

              <article className="leave-history-card">
                <header>
                  <h2>Request history</h2>
                  {requests.length > 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAll((current) => !current)
                      }
                    >
                      {showAll ? "Show less" : "View all"}
                    </button>
                  )}
                </header>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Dates</th>
                        <th>Type</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleRequests.length === 0 ? (
                        <tr>
                          <td colSpan={5}>
                            No leave requests yet.
                          </td>
                        </tr>
                      ) : (
                        visibleRequests.map((leave) => (
                          <tr key={leave.id}>
                            <td>
                              {formatDateRange(
                                leave.start_date,
                                leave.end_date,
                              )}
                            </td>

                            <td>
                              <span
                                className={`leave-type leave-type--${leaveTypeLabel(
                                  leave.leave_type,
                                )
                                  .toLowerCase()
                                  .replace(" ", "-")}`}
                              >
                                {leaveTypeLabel(
                                  leave.leave_type,
                                )}
                              </span>
                            </td>

                            <td>
                              {formatDate(
                                leave.created_at,
                              )}
                            </td>

                            <td>
                              <span
                                className={`leave-status leave-status--${leave.status.toLowerCase()}`}
                              >
                                {leave.status
                                  .charAt(0)
                                  .toUpperCase() +
                                  leave.status
                                    .slice(1)
                                    .toLowerCase()}
                              </span>
                            </td>

                            <td>
                              {leave.attachment_name && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void downloadAttachment(
                                      leave,
                                    )
                                  }
                                >
                                  Attachment
                                </button>
                              )}

                              {leave.status ===
                                "PENDING" && (
                                <button
                                  type="button"
                                  disabled={
                                    cancellingId ===
                                    leave.id
                                  }
                                  onClick={() =>
                                    void cancelRequest(
                                      leave.id,
                                    )
                                  }
                                >
                                  {cancellingId ===
                                  leave.id
                                    ? "Cancelling..."
                                    : "Cancel"}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </AppLayout>
  );
}

export default LeaveRequests;
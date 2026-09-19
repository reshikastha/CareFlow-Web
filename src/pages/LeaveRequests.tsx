import {
  CalendarDays,
  Check,
  Clock3,
  Paperclip,
  Plus,
} from "lucide-react";

import { type FormEvent, useState } from "react";
import AppLayout from "../components/AppLayout";
import "../styles/leaveRequests.css";

const leaveHistory = [
  {
    dates: "14 – 18 Jul 2025",
    type: "Annual leave",
    submitted: "20 Jun 2025",
    status: "Pending",
  },
  {
    dates: "3 – 4 Jun 2025",
    type: "Personal leave",
    submitted: "28 May 2025",
    status: "Approved",
  },
  {
    dates: "12 – 12 May 2025",
    type: "Sick leave",
    submitted: "10 May 2025",
    status: "Approved",
  },
  {
    dates: "18 – 20 Apr 2025",
    type: "Annual leave",
    submitted: "1 Apr 2025",
    status: "Declined",
  },
  {
    dates: "10 – 10 Mar 2025",
    type: "Personal leave",
    submitted: "5 Mar 2025",
    status: "Approved",
  },
];

function LeaveRequests() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setMessage("Your leave request has been submitted.");
  }

  return (
    <AppLayout>
      <main className="carer-page leave-page">
        <section className="leave-heading">
          <div>
            <h1>Leave requests</h1>
            <p>Manage your leave and view your leave balance.</p>
          </div>

          <button type="button">
            <Plus size={18} />
            Request leave
          </button>
        </section>

        <section className="leave-stat-grid">
          <article className="leave-stat leave-stat--green">
            <CalendarDays size={26} />

            <div>
              <strong>18 <small>days</small></strong>
              <span>Available balance</span>
            </div>
          </article>

          <article className="leave-stat leave-stat--orange">
            <Clock3 size={26} />

            <div>
              <strong>2 <small>requests</small></strong>
              <span>Pending requests</span>
            </div>
          </article>

          <article className="leave-stat leave-stat--green">
            <Check size={26} />

            <div>
              <strong>6 <small>days</small></strong>
              <span>Approved leave (this year)</span>
            </div>
          </article>
        </section>

        <section className="leave-layout">
          <form className="leave-form-card" onSubmit={handleSubmit}>
            <h2>New leave request</h2>

            <label>
              Leave type

              <select defaultValue="annual">
                <option value="annual">Annual leave</option>
                <option value="personal">Personal leave</option>
                <option value="sick">Sick leave</option>
              </select>
            </label>

            <div className="leave-date-grid">
              <label>
                Start date
                <input type="date" defaultValue="2025-07-14" />
              </label>

              <label>
                End date
                <input type="date" defaultValue="2025-07-18" />
              </label>
            </div>

            <label className="partial-day">
              <input type="checkbox" />
              Partial day (half day or custom hours)
            </label>

            <label>
              Reason

              <textarea
                defaultValue="Family holiday"
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
                  <strong>Choose a file or drag and drop</strong>
                  <small>PDF, JPG or PNG (max 5 MB)</small>
                </span>

                <input type="file" hidden />
              </label>
            </div>

            {message && (
              <p className="leave-success-message">{message}</p>
            )}

            <footer>
              <button type="button">Cancel</button>
              <button type="submit">Submit request</button>
            </footer>
          </form>

          <article className="leave-history-card">
            <header>
              <h2>Request history</h2>
              <button type="button">View all</button>
            </header>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Dates</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaveHistory.map((leave) => (
                    <tr key={`${leave.dates}-${leave.type}`}>
                      <td>{leave.dates}</td>

                      <td>
                        <span
                          className={`leave-type leave-type--${leave.type
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {leave.type}
                        </span>
                      </td>

                      <td>{leave.submitted}</td>

                      <td>
                        <span
                          className={`leave-status leave-status--${leave.status.toLowerCase()}`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </AppLayout>
  );
}

export default LeaveRequests;
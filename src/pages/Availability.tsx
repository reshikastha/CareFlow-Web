import {
  ChevronDown,
  Info,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import "../styles/availability.css";

interface AvailabilityDay {
  day: string;
  available: boolean;
  start: string;
  end: string;
}

const initialAvailability: AvailabilityDay[] = [
  { day: "Monday", available: true, start: "9:00 am", end: "5:00 pm" },
  { day: "Tuesday", available: true, start: "9:00 am", end: "5:00 pm" },
  { day: "Wednesday", available: true, start: "9:00 am", end: "5:00 pm" },
  { day: "Thursday", available: true, start: "9:00 am", end: "5:00 pm" },
  { day: "Friday", available: true, start: "9:00 am", end: "5:00 pm" },
  { day: "Saturday", available: false, start: "—", end: "—" },
  { day: "Sunday", available: false, start: "—", end: "—" },
];

function Availability() {
  const [availability, setAvailability] =
    useState(initialAvailability);

  function toggleDay(dayName: string): void {
    setAvailability((current) =>
      current.map((item) =>
        item.day === dayName
          ? {
              ...item,
              available: !item.available,
              start: !item.available ? "9:00 am" : "—",
              end: !item.available ? "5:00 pm" : "—",
            }
          : item
      )
    );
  }

  return (
    <AppLayout>
      <main className="carer-page availability-page">
        <section className="availability-heading">
          <h1>My availability</h1>
          <p>
            Set your regular weekly availability so we can match you
            with suitable shifts.
          </p>
        </section>

        <section className="availability-layout">
          <div>
            <article className="availability-card">
              <header>
                <h2>Weekly availability</h2>
                <p>
                  This is a repeating weekly schedule. You can also
                  add date exceptions below.
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
                  <div className="availability-row" key={item.day}>
                    <strong>{item.day}</strong>

                    <label className="availability-toggle">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => toggleDay(item.day)}
                      />

                      <span className="toggle-switch" />

                      <em>
                        {item.available
                          ? "Available"
                          : "Unavailable"}
                      </em>
                    </label>

                    <button
                      className="time-select"
                      type="button"
                      disabled={!item.available}
                    >
                      {item.start}
                      <ChevronDown size={15} />
                    </button>

                    <button
                      className="time-select"
                      type="button"
                      disabled={!item.available}
                    >
                      {item.end}
                      <ChevronDown size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </article>

            <article className="availability-card exceptions-card">
              <header>
                <div>
                  <h2>Date exceptions</h2>
                  <p>
                    Add dates when you’re unavailable or have
                    different availability.
                  </p>
                </div>

                <button className="add-exception-button" type="button">
                  <Plus size={17} />
                  Add exception
                </button>
              </header>

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
                    <tr>
                      <td>Fri, 4 Jul 2025</td>
                      <td>
                        <span className="unavailable-label">
                          Unavailable
                        </span>
                      </td>
                      <td>Family event</td>
                      <td>
                        <MoreHorizontal size={17} />
                      </td>
                    </tr>

                    <tr>
                      <td>Mon, 15 Jul 2025</td>
                      <td>
                        <span className="unavailable-label">
                          Unavailable
                        </span>
                      </td>
                      <td>Medical appointment</td>
                      <td>
                        <MoreHorizontal size={17} />
                      </td>
                    </tr>

                    <tr>
                      <td>Sat, 26 Jul 2025</td>
                      <td>
                        <span className="unavailable-label">
                          Unavailable
                        </span>
                      </td>
                      <td>Holiday</td>
                      <td>
                        <MoreHorizontal size={17} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          <aside className="preferred-hours-card">
            <header>
              <h2>Preferred hours</h2>
              <p>
                Help us find shifts that suit your preferences.
              </p>
            </header>

            <label>
              Maximum weekly hours

              <div className="hours-input">
                <input type="number" defaultValue={32} />
                <span>hours</span>
              </div>
            </label>

            <label>
              Preferred shift length

              <select defaultValue="4-8">
                <option value="4-8">4 – 8 hours</option>
                <option value="2-4">2 – 4 hours</option>
                <option value="8-12">8 – 12 hours</option>
              </select>
            </label>

            <section className="availability-info">
              <Info size={20} />

              <p>
                <strong>Your availability</strong>

                <span>
                  We’ll use this information to suggest shifts that
                  match your availability. You can update it at any
                  time.
                </span>
              </p>
            </section>

            <footer>
              <button type="button">Cancel</button>
              <button type="button">Save availability</button>
            </footer>
          </aside>
        </section>
      </main>
    </AppLayout>
  );
}

export default Availability;
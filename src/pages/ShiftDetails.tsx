import {
  CalendarDays,
  Check,
  Clock3,
  Flag,
  Hourglass,
  LockKeyhole,
  MapPin,
  Navigation,
  Phone,
  UsersRound,
} from "lucide-react";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import "../styles/shiftDetails.css";

interface ShiftTask {
  id: number;
  title: string;
  completed: boolean;
  time?: string;
}

function ShiftDetails() {
  const [notes, setNotes] = useState("");

  const [tasks, setTasks] = useState<ShiftTask[]>([
    {
      id: 1,
      title: "Arrive and check in with client",
      completed: true,
      time: "9:02 am",
    },
    {
      id: 2,
      title: "Support community activity",
      completed: true,
      time: "10:15 am",
    },
    {
      id: 3,
      title: "Support with appointment",
      completed: false,
    },
    {
      id: 4,
      title: "Wrap up and check out",
      completed: false,
    },
  ]);

  function toggleTask(taskId: number): void {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  return (
    <AppLayout>
      <main className="carer-page shift-details-page">
        <div className="shift-breadcrumb">
          <span>My shifts</span>
          <span>/</span>
          <strong>Shift details</strong>
        </div>

        <section className="shift-details-heading">
          <div>
            <h1>Community access</h1>
            <p>
              Support with community access, appointments and social
              participation.
            </p>
          </div>

          <span className="progress-status">
            <Clock3 size={14} />
            In progress
          </span>
        </section>

        <section className="shift-client-card">
          <div className="shift-client-primary">
            <div className="shift-client-avatar">JD</div>

            <div>
              <h2>Jordan Davis</h2>
              <p>Community participation</p>

              <span>
                <MapPin size={16} />
                Carlton, VIC 3053
              </span>
            </div>
          </div>

          <div className="shift-contact">
            <Phone size={20} />

            <div>
              <strong>0401 234 567</strong>
              <span>Primary contact</span>
            </div>
          </div>

          <div className="shift-action-buttons">
            <button className="direction-button" type="button">
              <Navigation size={17} />
              Get directions
            </button>

            <button className="checkout-button" type="button">
              <Flag size={17} />
              Check out
            </button>
          </div>

          <div className="shift-information">
            <span>
              <CalendarDays size={17} />
              Tue, 24 Jun 2025
            </span>

            <span>
              <Clock3 size={17} />
              9:00 am – 1:00 pm
            </span>

            <span>
              <Hourglass size={17} />
              4 hours
            </span>

            <span>
              <MapPin size={17} />
              Carlton, VIC 3053
            </span>
          </div>
        </section>

        <section className="privacy-message">
          <LockKeyhole size={23} />

          <p>
            <strong>
              For your privacy: You can only see information needed
              for this shift.
            </strong>

            <span>
              Client details, support plans and notes are limited to
              what’s relevant for today’s visit.
            </span>
          </p>
        </section>

        <section className="shift-details-grid">
          <article className="shift-detail-card support-plan-card">
            <header>
              <h2>Support plan summary</h2>
              <button type="button">View full plan</button>
            </header>

            <section className="plan-section">
              <UsersRound size={21} />

              <div>
                <h3>Goals for today</h3>

                <ul>
                  <li>
                    Support community access and social participation
                  </li>
                  <li>Encourage independence and choice</li>
                </ul>
              </div>
            </section>

            <section className="plan-section">
              <Check size={21} />

              <div>
                <h3>Key support needs</h3>

                <ul>
                  <li>
                    Support with transport and navigating the community
                  </li>
                  <li>Assistance with appointments as required</li>
                </ul>
              </div>
            </section>

            <section className="plan-section">
              <Navigation size={21} />

              <div>
                <h3>Important notes</h3>

                <ul>
                  <li>Prefers public transport where possible</li>
                  <li>Enjoys local cafés and community activities</li>
                </ul>
              </div>
            </section>
          </article>

          <div className="shift-right-column">
            <article className="shift-detail-card shift-tasks-card">
              <header>
                <h2>Shift tasks</h2>

                <span>
                  {tasks.filter((task) => task.completed).length} of{" "}
                  {tasks.length} completed
                </span>
              </header>

              {tasks.map((task) => (
                <label className="shift-task" key={task.id}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />

                  <span>{task.title}</span>
                  <time>{task.time ?? "—"}</time>
                </label>
              ))}
            </article>

            <article className="shift-detail-card shift-notes-card">
              <h2>Shift notes</h2>

              <div className="notes-input">
                <textarea
                  value={notes}
                  maxLength={1000}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add notes about today's shift (optional)..."
                />

                <span>{notes.length}/1000</span>
              </div>

              <button type="button">Save notes</button>
            </article>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

export default ShiftDetails;
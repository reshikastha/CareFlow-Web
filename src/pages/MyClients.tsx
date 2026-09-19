import {
  CalendarDays,
  Clock3,
  FileText,
  Info,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import "../styles/myClients.css";

interface CarerClient {
  initials: string;
  name: string;
  support: string;
  address: string;
  date: string;
  time: string;
  status: "In progress" | "Scheduled";
}

const clients: CarerClient[] = [
  {
    initials: "JD",
    name: "Jordan Davis",
    support: "Community participation",
    address: "Carlton, VIC 3053",
    date: "Tue, 24 Jun",
    time: "9:00 am",
    status: "In progress",
  },
  {
    initials: "ML",
    name: "Margaret Lewis",
    support: "Personal care",
    address: "Elwood, VIC 3184",
    date: "Tue, 1 Jul",
    time: "2:00 pm",
    status: "Scheduled",
  },
  {
    initials: "BC",
    name: "Brian Chen",
    support: "Daily living support",
    address: "Richmond, VIC 3121",
    date: "Wed, 25 Jun",
    time: "10:00 am",
    status: "Scheduled",
  },
  {
    initials: "CC",
    name: "Claire Campbell",
    support: "Community access",
    address: "St Kilda, VIC 3182",
    date: "Fri, 27 Jun",
    time: "9:00 am",
    status: "Scheduled",
  },
  {
    initials: "AT",
    name: "Aisha Taylor",
    support: "Respite care",
    address: "Brunswick, VIC 3056",
    date: "Mon, 30 Jun",
    time: "1:00 pm",
    status: "Scheduled",
  },
];

function MyClients() {
  const [selectedClient, setSelectedClient] =
    useState<CarerClient>(clients[0]);

  return (
    <AppLayout>
      <main className="carer-page my-clients-page">
        <section className="my-clients-heading">
          <h1>My clients</h1>
          <p>View information about the clients you support.</p>
        </section>

        <section className="my-clients-layout">
          <article className="client-list-card">
            <h2>My clients (5)</h2>

            {clients.map((client) => (
              <button
                className={
                  selectedClient.name === client.name
                    ? "carer-client-row selected"
                    : "carer-client-row"
                }
                type="button"
                key={client.name}
                onClick={() => setSelectedClient(client)}
              >
                <span className="carer-client-avatar">
                  {client.initials}
                </span>

                <span className="carer-client-name">
                  <strong>{client.name}</strong>
                  <span>{client.support}</span>

                  <small>
                    <MapPin size={13} />
                    {client.address}
                  </small>
                </span>

                <span className="client-next-shift">
                  <small>Next shift</small>
                  <strong>{client.date}</strong>
                  <span>{client.time}</span>

                  <em
                    className={`carer-client-status ${
                      client.status === "In progress"
                        ? "in-progress"
                        : "scheduled"
                    }`}
                  >
                    {client.status}
                  </em>
                </span>
              </button>
            ))}
          </article>

          <article className="client-overview-card">
            <header className="client-overview-header">
              <div className="overview-client-avatar">
                {selectedClient.initials}
              </div>

              <div>
                <h2>{selectedClient.name}</h2>
                <p>{selectedClient.support}</p>

                <span>
                  <MapPin size={15} />
                  {selectedClient.address}
                </span>
              </div>

              <em
                className={`carer-client-status ${
                  selectedClient.status === "In progress"
                    ? "in-progress"
                    : "scheduled"
                }`}
              >
                {selectedClient.status}
              </em>
            </header>

            <nav className="overview-tabs">
              <button className="active" type="button">Overview</button>
              <button type="button">Support plan</button>
              <button type="button">Visit history</button>
            </nav>

            <section className="overview-section">
              <h3>About</h3>

              <p>
                Jordan enjoys community activities, appointments and
                social opportunities. Support focuses on building
                independence and confidence in the community.
              </p>
            </section>

            <section className="client-contact-grid">
              <div>
                <UserRound size={20} />

                <p>
                  <strong>Primary contact</strong>
                  <span>Alex Davis (Family)</span>
                </p>
              </div>

              <div>
                <Phone size={20} />

                <p>
                  <strong>0401 234 567</strong>
                </p>
              </div>

              <div>
                <MapPin size={20} />

                <p>
                  <strong>Address</strong>
                  <span>{selectedClient.address}</span>
                </p>
              </div>
            </section>

            <section className="upcoming-visit">
              <h3>Upcoming visit</h3>

              <div>
                <span>
                  <CalendarDays size={17} />
                  Tue, 1 Jul 2025
                </span>

                <span>
                  <Clock3 size={17} />
                  9:00 am – 1:00 pm (4 hours)
                </span>
              </div>
            </section>

            <button className="view-support-plan" type="button">
              <FileText size={18} />
              View support plan
            </button>

            <section className="client-access-message">
              <Info size={20} />

              <p>
                <strong>Information you can access</strong>

                <span>
                  You can only view information for clients assigned
                  to you. Client details, support plans and notes are
                  limited to what’s relevant for your care work.
                </span>
              </p>
            </section>
          </article>
        </section>
      </main>
    </AppLayout>
  );
}

export default MyClients;
import {
  Baby,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  MapPin,
  MoreHorizontal,
  Plus,
  UserRound,
  X,
} from "lucide-react";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import "../styles/clients.css";

interface Client {
  initials: string;
  name: string;
  suburb: string;
  supportType: string;
  worker: string;
  nextVisit: string;
  status: "Active" | "Inactive";
}

const clients: Client[] = [
  {
    initials: "AF",
    name: "Aisha Foster",
    suburb: "Maple House",
    supportType: "Home care",
    worker: "Aisha Khan",
    nextVisit: "Tue, 24 Jun",
    status: "Active",
  },
  {
    initials: "BL",
    name: "Brian Lewis",
    suburb: "Riverside",
    supportType: "NDIS",
    worker: "Daniel Kim",
    nextVisit: "Tue, 24 Jun",
    status: "Active",
  },
  {
    initials: "CC",
    name: "Claire Campbell",
    suburb: "Linden House",
    supportType: "Home care",
    worker: "Priya Sharma",
    nextVisit: "Wed, 25 Jun",
    status: "Active",
  },
  {
    initials: "DG",
    name: "David Green",
    suburb: "Oakview",
    supportType: "Respite",
    worker: "Margaret Lewis",
    nextVisit: "Wed, 25 Jun",
    status: "Active",
  },
  {
    initials: "EH",
    name: "Emma Hughes",
    suburb: "Willow Court",
    supportType: "Home care",
    worker: "Ben Lee",
    nextVisit: "Thu, 26 Jun",
    status: "Active",
  },
  {
    initials: "FZ",
    name: "Fatima Zain",
    suburb: "Maple House",
    supportType: "NDIS",
    worker: "Aisha Khan",
    nextVisit: "Thu, 26 Jun",
    status: "Active",
  },
  {
    initials: "JL",
    name: "Jack Lee",
    suburb: "Riverside",
    supportType: "Home care",
    worker: "Chris Taylor",
    nextVisit: "Fri, 27 Jun",
    status: "Inactive",
  },
  {
    initials: "MG",
    name: "Maria Gomez",
    suburb: "Linden House",
    supportType: "Home care",
    worker: "Eleanor Mills",
    nextVisit: "Fri, 27 Jun",
    status: "Active",
  },
];

function Clients() {
  const [selectedClient, setSelectedClient] =
    useState<Client>(clients[0]);

  return (
    <AppLayout>
      <main className="page-content clients-page">
        <section className="clients-heading">
          <div>
            <h1>Clients</h1>
            <p>
              View and manage your clients and their care support.
            </p>
          </div>

          <button className="green-button" type="button">
            <Plus size={18} />
            Add client
          </button>
        </section>

        <section className="clients-layout">
          <div className="clients-list-section">
            <div className="client-tabs">
              <button className="active" type="button">
                All clients (24)
              </button>

              <button type="button">Home care (16)</button>
              <button type="button">NDIS (5)</button>
              <button type="button">Respite (3)</button>
            </div>

            <div className="clients-table-card">
              <div className="table-wrapper">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Suburb</th>
                      <th>Support type</th>
                      <th>Assigned worker</th>
                      <th>Next visit</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.name}
                        className={
                          selectedClient.name === client.name
                            ? "selected-client-row"
                            : ""
                        }
                        onClick={() => setSelectedClient(client)}
                      >
                        <td>
                          <div className="client-name">
                            <span>{client.initials}</span>
                            <strong>{client.name}</strong>
                          </div>
                        </td>

                        <td>{client.suburb}</td>
                        <td>{client.supportType}</td>
                        <td>{client.worker}</td>
                        <td>{client.nextVisit}</td>

                        <td>
                          <span
                            className={`client-status client-status--${client.status.toLowerCase()}`}
                          >
                            {client.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="client-menu-button"
                            type="button"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreHorizontal size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <footer className="table-footer">
                <p>Showing 1–8 of 24 clients</p>

                <div className="pagination">
                  <button type="button">
                    <ChevronLeft size={17} />
                  </button>
                  <button className="active" type="button">1</button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button">
                    <ChevronRight size={17} />
                  </button>
                </div>
              </footer>
            </div>
          </div>

          <aside className="client-details">
            <header className="client-profile-header">
              <div className="client-large-avatar">
                {selectedClient.initials}
              </div>

              <div>
                <h2>{selectedClient.name}</h2>
                <span className="client-status client-status--active">
                  Active
                </span>
              </div>

              <button type="button" aria-label="Close details">
                <X size={19} />
              </button>
            </header>

            <nav className="client-detail-tabs">
              <button className="active" type="button">Overview</button>
              <button type="button">Care plan</button>
              <button type="button">Notes</button>
              <button type="button">Documents</button>
            </nav>

            <div className="client-information">
              <div className="information-row">
                <MapPin size={19} />
                <p>Maple House, Melbourne VIC</p>
              </div>

              <div className="information-row">
                <Baby size={19} />
                <p>
                  <span>Date of birth</span>
                  14 Mar 1965 (60 years)
                </p>
              </div>

              <div className="information-row">
                <Heart size={19} />
                <p>
                  <span>Support type</span>
                  {selectedClient.supportType}
                </p>
              </div>

              <div className="information-row">
                <CalendarDays size={19} />
                <p>
                  <span>Next visit</span>
                  Tue, 24 Jun 2025
                  <br />
                  10:00 – 12:00
                </p>
              </div>

              <div className="information-row">
                <UserRound size={19} />
                <p>
                  <span>Assigned worker</span>
                  <u>{selectedClient.worker}</u>
                </p>
              </div>
            </div>

            <section className="client-summary-section">
              <div className="summary-heading">
                <UserRound size={20} />
                <div>
                  <h3>Emergency contact</h3>
                  <p>
                    Sonia Foster (Daughter)
                    <br />
                    0412 345 678
                  </p>
                </div>
              </div>
            </section>

            <section className="client-summary-section">
              <div className="summary-heading">
                <FileText size={20} />
                <div>
                  <h3>Support plan summary</h3>
                  <p>
                    Assistance with daily living, personal care and
                    community access.
                  </p>
                </div>
              </div>
            </section>

            <button className="client-details-button" type="button">
              View full details
            </button>
          </aside>
        </section>
      </main>
    </AppLayout>
  );
}

export default Clients;
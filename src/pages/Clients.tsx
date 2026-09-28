import {
  Baby,
  CalendarDays,
  FileText,
  Heart,
  MapPin,
  MoreHorizontal,
  Plus,
  UserRound,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AppLayout from "../components/AppLayout";

import {
  assignClient,
  createClient,
  deleteClient,
  getClients,
  updateClient,
  type Client,
  type ClientFormData,
  type SupportType,
} from "../services/clientApi";

import {
  getWorkers,
  type Worker,
} from "../services/workerApi";

import "../styles/clients.css";

type ClientFilter =
  | "ALL"
  | "Home care"
  | "NDIS"
  | "Respite";

const emptyClientForm: ClientFormData = {
  fullName: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  suburb: "",
  supportType: "Home care",
  supportPlan: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  isActive: true,
};

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");
}

function getAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) {
    return null;
  }

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() - birthDate.getFullYear();

  const monthDifference =
    today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

function formatDate(dateValue: string | null): string {
  if (!dateValue) {
    return "Not scheduled";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateValue: string | null): string {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);

  const [clientForm, setClientForm] =
    useState<ClientFormData>(emptyClientForm);

  const [selectedWorkerId, setSelectedWorkerId] =
    useState<number>(0);

  const [activeFilter, setActiveFilter] =
    useState<ClientFilter>("ALL");

  const [actionMenuId, setActionMenuId] =
    useState<number | null>(null);

  const [editingClientId, setEditingClientId] =
    useState<number | null>(null);

  const [showClientForm, setShowClientForm] =
    useState(false);

  const [showAssignForm, setShowAssignForm] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isEditing = editingClientId !== null;

  const loadClients =
    useCallback(async (): Promise<void> => {
      try {
        setError("");
        setIsLoading(true);

        const clientData = await getClients();

        setClients(clientData);

        setSelectedClient((currentClient) => {
          if (!clientData.length) {
            return null;
          }

          if (!currentClient) {
            return clientData[0];
          }

          return (
            clientData.find(
              (client) =>
                client.id === currentClient.id,
            ) ?? clientData[0]
          );
        });
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to retrieve clients.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  const loadWorkers =
    useCallback(async (): Promise<void> => {
      try {
        const workerData = await getWorkers();
        setWorkers(workerData);
      } catch (caughtError) {
        console.error("Unable to retrieve workers:", caughtError);
      }
    }, []);

  useEffect(() => {
    void loadClients();
    void loadWorkers();
  }, [loadClients, loadWorkers]);

  const homeCareCount = useMemo(
    () =>
      clients.filter(
        (client) =>
          client.supportType === "Home care",
      ).length,
    [clients],
  );

  const ndisCount = useMemo(
    () =>
      clients.filter(
        (client) =>
          client.supportType === "NDIS",
      ).length,
    [clients],
  );

  const respiteCount = useMemo(
    () =>
      clients.filter(
        (client) =>
          client.supportType === "Respite",
      ).length,
    [clients],
  );

  const filteredClients = useMemo(() => {
    if (activeFilter === "ALL") {
      return clients;
    }

    return clients.filter(
      (client) =>
        client.supportType === activeFilter,
    );
  }, [clients, activeFilter]);

  function openAddClientForm(): void {
    setEditingClientId(null);
    setClientForm(emptyClientForm);
    setShowClientForm(true);
    setActionMenuId(null);
    setError("");
    setMessage("");
  }

  function openEditClientForm(client: Client): void {
    setEditingClientId(client.id);

    setClientForm({
      fullName: client.fullName,
      phone: client.phone ?? "",

      dateOfBirth:
        client.dateOfBirth?.split("T")[0] ?? "",

      address: client.address ?? "",
      suburb: client.suburb ?? "",
      supportType: client.supportType,
      supportPlan: client.supportPlan ?? "",

      emergencyContactName:
        client.emergencyContactName ?? "",

      emergencyContactRelationship:
        client.emergencyContactRelationship ?? "",

      emergencyContactPhone:
        client.emergencyContactPhone ?? "",

      isActive: client.isActive,
    });

    setShowClientForm(true);
    setActionMenuId(null);
    setError("");
  }

  function closeClientForm(): void {
    setShowClientForm(false);
    setEditingClientId(null);
    setClientForm(emptyClientForm);
  }

  function openAssignForm(client: Client): void {
    setSelectedClient(client);
    setSelectedWorkerId(
      client.assignedWorkerId ?? 0,
    );

    setShowAssignForm(true);
    setActionMenuId(null);
    setError("");
  }

  async function handleClientSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (
      !clientForm.fullName.trim() ||
      !clientForm.supportType
    ) {
      setError(
        "Client name and support type are required.",
      );

      return;
    }

    try {
      setError("");
      setMessage("");
      setIsSaving(true);

      if (isEditing && editingClientId) {
        await updateClient(
          editingClientId,
          clientForm,
        );

        setMessage(
          "Client updated successfully.",
        );
      } else {
        await createClient(clientForm);

        setMessage(
          "Client created successfully.",
        );
      }

      closeClientForm();
      await loadClients();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save the client.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAssignWorker(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!selectedClient || !selectedWorkerId) {
      setError("Please select a care worker.");
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsSaving(true);

      await assignClient(
        selectedClient.id,
        selectedWorkerId,
      );

      setMessage(
        "Client assigned successfully.",
      );

      setShowAssignForm(false);
      setSelectedWorkerId(0);

      await loadClients();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to assign the client.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteClient(
    client: Client,
  ): Promise<void> {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${client.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteClient(client.id);

      setMessage(
        "Client deleted successfully.",
      );

      setActionMenuId(null);
      setSelectedClient(null);

      await loadClients();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to delete the client.",
      );
    }
  }

  return (
    <AppLayout>
      <main className="page-content clients-page">
        <section className="clients-heading">
          <div>
            <h1>Clients</h1>

            <p>
              View and manage your clients and their care
              support.
            </p>
          </div>

          <button
            className="green-button"
            type="button"
            onClick={openAddClientForm}
          >
            <Plus size={18} />
            Add client
          </button>
        </section>

        {error && (
          <p className="error-message" role="alert">
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

        <section className="clients-layout">
          <div className="clients-list-section">
            <div className="client-tabs">
              <button
                className={
                  activeFilter === "ALL"
                    ? "active"
                    : ""
                }
                type="button"
                onClick={() =>
                  setActiveFilter("ALL")
                }
              >
                All clients ({clients.length})
              </button>

              <button
                className={
                  activeFilter === "Home care"
                    ? "active"
                    : ""
                }
                type="button"
                onClick={() =>
                  setActiveFilter("Home care")
                }
              >
                Home care ({homeCareCount})
              </button>

              <button
                className={
                  activeFilter === "NDIS"
                    ? "active"
                    : ""
                }
                type="button"
                onClick={() =>
                  setActiveFilter("NDIS")
                }
              >
                NDIS ({ndisCount})
              </button>

              <button
                className={
                  activeFilter === "Respite"
                    ? "active"
                    : ""
                }
                type="button"
                onClick={() =>
                  setActiveFilter("Respite")
                }
              >
                Respite ({respiteCount})
              </button>
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
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7}>
                          Loading clients...
                        </td>
                      </tr>
                    ) : filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          No clients found.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr
                          key={client.id}
                          className={
                            selectedClient?.id === client.id
                              ? "selected-client-row"
                              : ""
                          }
                          onClick={() =>
                            setSelectedClient(client)
                          }
                        >
                          <td>
                            <div className="client-name">
                              <span>
                                {getInitials(
                                  client.fullName,
                                )}
                              </span>

                              <strong>
                                {client.fullName}
                              </strong>
                            </div>
                          </td>

                          <td>
                            {client.suburb ??
                              client.address ??
                              "Not provided"}
                          </td>

                          <td>
                            {client.supportType}
                          </td>

                          <td>
                            {client.assignedWorkerName ??
                              "Unassigned"}
                          </td>

                          <td>
                            {formatDate(
                              client.nextVisitStart,
                            )}
                          </td>

                          <td>
                            <span
                              className={`client-status client-status--${client.status.toLowerCase()}`}
                            >
                              {client.status}
                            </span>
                          </td>

                          <td className="client-actions-cell">
                            <button
                              className="client-menu-button"
                              type="button"
                              aria-label={`Actions for ${client.fullName}`}
                              onClick={(event) => {
                                event.stopPropagation();

                                setActionMenuId(
                                  actionMenuId === client.id
                                    ? null
                                    : client.id,
                                );
                              }}
                            >
                              <MoreHorizontal size={17} />
                            </button>

                            {actionMenuId === client.id && (
                              <div
                                className="client-action-menu"
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditClientForm(
                                      client,
                                    )
                                  }
                                >
                                  Edit client
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openAssignForm(client)
                                  }
                                >
                                  Assign worker
                                </button>

                                <button
                                  className="delete-action"
                                  type="button"
                                  onClick={() =>
                                    void handleDeleteClient(
                                      client,
                                    )
                                  }
                                >
                                  Delete client
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

              <footer className="table-footer">
                <p>
                  Showing {filteredClients.length} of{" "}
                  {clients.length} clients
                </p>
              </footer>
            </div>
          </div>

          {selectedClient && (
            <aside className="client-details">
              <header className="client-profile-header">
                <div className="client-large-avatar">
                  {getInitials(
                    selectedClient.fullName,
                  )}
                </div>

                <div>
                  <h2>{selectedClient.fullName}</h2>

                  <span
                    className={`client-status client-status--${selectedClient.status.toLowerCase()}`}
                  >
                    {selectedClient.status}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Close details"
                  onClick={() =>
                    setSelectedClient(null)
                  }
                >
                  <X size={19} />
                </button>
              </header>

              <nav className="client-detail-tabs">
                <button
                  className="active"
                  type="button"
                >
                  Overview
                </button>

                <button type="button">
                  Care plan
                </button>

                <button type="button">
                  Notes
                </button>

                <button type="button">
                  Documents
                </button>
              </nav>

              <div className="client-information">
                <div className="information-row">
                  <MapPin size={19} />

                  <p>
                    {[
                      selectedClient.address,
                      selectedClient.suburb,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </p>
                </div>

                <div className="information-row">
                  <Baby size={19} />

                  <p>
                    <span>Date of birth</span>

                    {selectedClient.dateOfBirth
                      ? `${formatDate(
                          selectedClient.dateOfBirth,
                        )} (${
                          getAge(
                            selectedClient.dateOfBirth,
                          ) ?? "Unknown"
                        } years)`
                      : "Not provided"}
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

                    {formatDate(
                      selectedClient.nextVisitStart,
                    )}

                    {selectedClient.nextVisitStart && (
                      <>
                        <br />

                        {formatTime(
                          selectedClient.nextVisitStart,
                        )}

                        {selectedClient.nextVisitEnd &&
                          ` – ${formatTime(
                            selectedClient.nextVisitEnd,
                          )}`}
                      </>
                    )}
                  </p>
                </div>

                <div className="information-row">
                  <UserRound size={19} />

                  <p>
                    <span>Assigned worker</span>

                    <u>
                      {selectedClient.assignedWorkerName ??
                        "Unassigned"}
                    </u>
                  </p>
                </div>
              </div>

              <section className="client-summary-section">
                <div className="summary-heading">
                  <UserRound size={20} />

                  <div>
                    <h3>Emergency contact</h3>

                    <p>
                      {selectedClient.emergencyContactName ??
                        "Not provided"}

                      {selectedClient.emergencyContactRelationship &&
                        ` (${selectedClient.emergencyContactRelationship})`}

                      <br />

                      {selectedClient.emergencyContactPhone ??
                        "No phone provided"}
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
                      {selectedClient.supportPlan ??
                        "No support plan has been added."}
                    </p>
                  </div>
                </div>
              </section>

              <div className="client-detail-actions">
                <button
                  className="outline-button"
                  type="button"
                  onClick={() =>
                    openAssignForm(selectedClient)
                  }
                >
                  Assign worker
                </button>

                <button
                  className="client-details-button"
                  type="button"
                  onClick={() =>
                    openEditClientForm(selectedClient)
                  }
                >
                  Edit details
                </button>
              </div>
            </aside>
          )}
        </section>

        {/* Add or edit client modal */}
        {showClientForm && (
          <div
            className="client-modal-overlay"
            role="presentation"
            onMouseDown={closeClientForm}
          >
            <section
              className="client-form-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="client-form-title"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <header className="client-form-header">
                <div>
                  <h2 id="client-form-title">
                    {isEditing
                      ? "Edit client"
                      : "Add client"}
                  </h2>

                  <p>
                    Enter the client’s personal and care
                    information.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close client form"
                  onClick={closeClientForm}
                >
                  <X size={20} />
                </button>
              </header>

              <form
                className="client-form"
                onSubmit={handleClientSubmit}
              >
                <label>
                  Full name <b>*</b>

                  <input
                    type="text"
                    value={clientForm.fullName}
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label>
                  Phone

                  <input
                    type="tel"
                    value={clientForm.phone}
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Date of birth

                  <input
                    type="date"
                    value={clientForm.dateOfBirth}
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,
                        dateOfBirth:
                          event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Support type <b>*</b>

                  <select
                    value={clientForm.supportType}
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,

                        supportType:
                          event.target
                            .value as SupportType,
                      }))
                    }
                  >
                    <option value="Home care">
                      Home care
                    </option>

                    <option value="NDIS">
                      NDIS
                    </option>

                    <option value="Respite">
                      Respite
                    </option>
                  </select>
                </label>

                <label>
                  Suburb

                  <input
                    type="text"
                    value={clientForm.suburb}
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,
                        suburb: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Emergency contact name

                  <input
                    type="text"
                    value={
                      clientForm.emergencyContactName
                    }
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,

                        emergencyContactName:
                          event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Emergency relationship

                  <input
                    type="text"
                    value={
                      clientForm.emergencyContactRelationship
                    }
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,

                        emergencyContactRelationship:
                          event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Emergency phone

                  <input
                    type="tel"
                    value={
                      clientForm.emergencyContactPhone
                    }
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,

                        emergencyContactPhone:
                          event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="full-width-field">
                  Address

                  <textarea
                    rows={2}
                    value={clientForm.address}
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="full-width-field">
                  Support plan summary

                  <textarea
                    rows={4}
                    value={clientForm.supportPlan}
                    onChange={(event) =>
                      setClientForm((current) => ({
                        ...current,
                        supportPlan:
                          event.target.value,
                      }))
                    }
                  />
                </label>

                {isEditing && (
                  <label className="client-active-field">
                    <input
                      type="checkbox"
                      checked={
                        clientForm.isActive ?? true
                      }
                      onChange={(event) =>
                        setClientForm((current) => ({
                          ...current,
                          isActive:
                            event.target.checked,
                        }))
                      }
                    />

                    Client is active
                  </label>
                )}

                <div className="client-form-actions">
                  <button
                    className="outline-button"
                    type="button"
                    disabled={isSaving}
                    onClick={closeClientForm}
                  >
                    Cancel
                  </button>

                  <button
                    className="green-button"
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Saving..."
                      : isEditing
                        ? "Save changes"
                        : "Add client"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* Assign client to worker modal */}
        {showAssignForm && selectedClient && (
          <div
            className="client-modal-overlay"
            role="presentation"
            onMouseDown={() =>
              setShowAssignForm(false)
            }
          >
            <section
              className="assign-worker-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="assign-worker-title"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <header className="client-form-header">
                <div>
                  <h2 id="assign-worker-title">
                    Assign worker
                  </h2>

                  <p>
                    Assign a care worker to{" "}
                    {selectedClient.fullName}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAssignForm(false)
                  }
                >
                  <X size={20} />
                </button>
              </header>

              <form onSubmit={handleAssignWorker}>
                <label>
                  Care worker

                  <select
                    value={selectedWorkerId || ""}
                    onChange={(event) =>
                      setSelectedWorkerId(
                        Number(event.target.value),
                      )
                    }
                    required
                  >
                    <option value="">
                      Select a worker
                    </option>

                    {workers
                      .filter(
                        (worker) => worker.isActive,
                      )
                      .map((worker) => (
                        <option
                          value={worker.id}
                          key={worker.id}
                        >
                          {worker.fullName}
                        </option>
                      ))}
                  </select>
                </label>

                <div className="client-form-actions">
                  <button
                    className="outline-button"
                    type="button"
                    onClick={() =>
                      setShowAssignForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="green-button"
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Assigning..."
                      : "Assign worker"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>
    </AppLayout>
  );
}

export default Clients;
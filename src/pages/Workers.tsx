import {
  BadgeCheck,
  CircleAlert,
  FileWarning,
  Filter,
  MoreHorizontal,
  Plus,
  UserCheck,
  UsersRound,
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
  createWorker,
  getWorker,
  getWorkers,
  updateWorker,
  type Availability,
  type Compliance,
  type CreateWorkerData,
  type EmploymentStatus,
  type Worker,
} from "../services/workerApi";

import "../styles/workers.css";

type WorkerFilter =
  | "ALL"
  | "Available"
  | "On shift"
  | "Unavailable";

interface WorkerForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  employmentStatus: EmploymentStatus;
  joinedDate: string;
  isActive: boolean;
  availability: Availability;
}

const emptyWorkerForm: WorkerForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  address: "",
  employmentStatus: "CASUAL",
  joinedDate: new Date().toISOString().split("T")[0],
  isActive: true,
  availability: "Available",
};

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");
}

function displayRole(role: string): string {
  if (role === "CARE_WORKER") {
    return "Care Worker";
  }

  if (role === "ADMIN") {
    return "Administrator";
  }

  return role
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayEmploymentStatus(
  status: EmploymentStatus | null,
): string {
  switch (status) {
    case "FULL_TIME":
      return "Full-time";

    case "PART_TIME":
      return "Part-time";

    case "CASUAL":
      return "Casual";

    default:
      return "Not provided";
  }
}

function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workerForm, setWorkerForm] =
    useState<WorkerForm>(emptyWorkerForm);

  const [selectedWorkerId, setSelectedWorkerId] =
    useState<number | null>(null);

  const [activeFilter, setActiveFilter] =
    useState<WorkerFilter>("ALL");

  const [showWorkerForm, setShowWorkerForm] =
    useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isEditing = selectedWorkerId !== null;

  const loadWorkers =
    useCallback(async (): Promise<void> => {
      try {
        setError("");
        setIsLoading(true);

        const workerData = await getWorkers();

        setWorkers(workerData);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to retrieve workers.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadWorkers();
  }, [loadWorkers]);

  const availableCount = useMemo(
    () =>
      workers.filter(
        (worker) =>
          worker.availability === "Available",
      ).length,
    [workers],
  );

  const onShiftCount = useMemo(
    () =>
      workers.filter(
        (worker) =>
          worker.availability === "On shift",
      ).length,
    [workers],
  );

  const unavailableCount = useMemo(
    () =>
      workers.filter(
        (worker) =>
          worker.availability === "Unavailable",
      ).length,
    [workers],
  );

  const expiringCount = useMemo(
    () =>
      workers.filter(
        (worker) =>
          worker.compliance === "Expiring soon",
      ).length,
    [workers],
  );

  const filteredWorkers = useMemo(() => {
    if (activeFilter === "ALL") {
      return workers;
    }

    return workers.filter(
      (worker) =>
        worker.availability === activeFilter,
    );
  }, [workers, activeFilter]);

  function openAddWorkerForm(): void {
    setSelectedWorkerId(null);
    setWorkerForm(emptyWorkerForm);
    setError("");
    setMessage("");
    setShowWorkerForm(true);
  }

  async function openEditWorkerForm(
    workerId: number,
  ): Promise<void> {
    try {
      setError("");
      setMessage("");

      // GET /api/workers/:workerId
      const worker = await getWorker(workerId);

      setSelectedWorkerId(worker.id);

      setWorkerForm({
        fullName: worker.fullName,
        email: worker.email,
        password: "",
        confirmPassword: "",
        phone: worker.phone ?? "",
        address: worker.address ?? "",

        employmentStatus:
          worker.employmentStatus ?? "CASUAL",

        joinedDate:
          worker.joinedDate?.split("T")[0] ??
          new Date().toISOString().split("T")[0],

        isActive: worker.isActive,
        availability: worker.availability,
      });

      setShowWorkerForm(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to retrieve the worker.",
      );
    }
  }

  function closeWorkerForm(): void {
    setShowWorkerForm(false);
    setSelectedWorkerId(null);
    setWorkerForm(emptyWorkerForm);
  }

  async function handleWorkerSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (
      !workerForm.fullName.trim() ||
      !workerForm.email.trim() ||
      !workerForm.phone.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      !isEditing &&
      workerForm.password.length < 8
    ) {
      setError(
        "The temporary password must contain at least 8 characters.",
      );

      return;
    }

    if (
      !isEditing &&
      workerForm.password !==
        workerForm.confirmPassword
    ) {
      setError("The passwords do not match.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setMessage("");

      if (isEditing && selectedWorkerId) {
        // PATCH /api/workers/:workerId
        await updateWorker(selectedWorkerId, {
          fullName: workerForm.fullName.trim(),
          phone: workerForm.phone.trim(),
          address: workerForm.address.trim(),

          employmentStatus:
            workerForm.employmentStatus,

          joinedDate: workerForm.joinedDate,
          isActive: workerForm.isActive,
          availability: workerForm.availability,
        });

        setMessage(
          "Worker updated successfully.",
        );
      } else {
        const newWorker: CreateWorkerData = {
          fullName: workerForm.fullName.trim(),
          email: workerForm.email
            .trim()
            .toLowerCase(),

          password: workerForm.password,

          confirmPassword:
            workerForm.confirmPassword,

          phone: workerForm.phone.trim(),
          address: workerForm.address.trim(),

          employmentStatus:
            workerForm.employmentStatus,

          joinedDate: workerForm.joinedDate,
        };

        // POST /api/workers
        await createWorker(newWorker);

        setMessage(
          "Worker added successfully.",
        );
      }

      closeWorkerForm();
      await loadWorkers();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save the worker.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppLayout>
      <main className="page-content workers-page">
        <section className="workers-heading">
          <div>
            <h1>Workers</h1>

            <p>
              Manage your care team, availability
              and compliance.
            </p>
          </div>

          <button
            className="green-button"
            type="button"
            onClick={openAddWorkerForm}
          >
            <Plus size={18} />
            Add worker
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

        <section className="worker-stat-grid">
          <article className="worker-stat worker-stat--green">
            <div className="worker-stat__icon">
              <UsersRound size={26} />
            </div>

            <div>
              <h2>Total workers</h2>
              <strong>{workers.length}</strong>
              <p>Active care team</p>
            </div>
          </article>

          <article className="worker-stat worker-stat--blue">
            <div className="worker-stat__icon">
              <UserCheck size={26} />
            </div>

            <div>
              <h2>Available today</h2>
              <strong>{availableCount}</strong>

              <p>
                {workers.length
                  ? Math.round(
                      (availableCount /
                        workers.length) *
                        100,
                    )
                  : 0}
                % of team
              </p>
            </div>
          </article>

          <article className="worker-stat worker-stat--orange">
            <div className="worker-stat__icon">
              <FileWarning size={26} />
            </div>

            <div>
              <h2>Certificates expiring</h2>
              <strong>{expiringCount}</strong>
              <p>In the next 30 days</p>
            </div>
          </article>
        </section>

        <section className="worker-table-card">
          <div className="worker-filters">
            <div className="worker-tabs">
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
                All workers ({workers.length})
              </button>

              <button
                className={
                  activeFilter === "Available"
                    ? "active"
                    : ""
                }
                type="button"
                onClick={() =>
                  setActiveFilter("Available")
                }
              >
                Available ({availableCount})
              </button>

              <button
                className={
                  activeFilter === "On shift"
                    ? "active"
                    : ""
                }
                type="button"
                onClick={() =>
                  setActiveFilter("On shift")
                }
              >
                On shift ({onShiftCount})
              </button>

              <button
                className={
                  activeFilter === "Unavailable"
                    ? "active"
                    : ""
                }
                type="button"
                onClick={() =>
                  setActiveFilter("Unavailable")
                }
              >
                Unavailable ({unavailableCount})
              </button>
            </div>

            <button
              className="worker-filter-button"
              type="button"
              onClick={() =>
                setShowFilter((current) => !current)
              }
            >
              <Filter size={18} />
              Filter
            </button>
          </div>

          {showFilter && (
            <div className="worker-filter-panel">
              <label>
                Availability

                <select
                  value={activeFilter}
                  onChange={(event) =>
                    setActiveFilter(
                      event.target
                        .value as WorkerFilter,
                    )
                  }
                >
                  <option value="ALL">
                    All workers
                  </option>

                  <option value="Available">
                    Available
                  </option>

                  <option value="On shift">
                    On shift
                  </option>

                  <option value="Unavailable">
                    Unavailable
                  </option>
                </select>
              </label>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter("ALL");
                  setShowFilter(false);
                }}
              >
                Clear filter
              </button>
            </div>
          )}

          <div className="table-wrapper">
            <table className="workers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Availability</th>
                  <th>Employment</th>
                  <th>Hours this week</th>
                  <th>Compliance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7}>
                      Loading workers...
                    </td>
                  </tr>
                ) : filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      No workers found.
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((worker) => (
                    <tr key={worker.id}>
                      <td>
                        <div className="worker-name">
                          {worker.profileImage ? (
                            <img
                              className="worker-avatar"
                              src={worker.profileImage}
                              alt={worker.fullName}
                            />
                          ) : (
                            <span className="worker-avatar">
                              {getInitials(
                                worker.fullName,
                              )}
                            </span>
                          )}

                          <div>
                            <strong>
                              {worker.fullName}
                            </strong>

                            <small>
                              {worker.email}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        {displayRole(worker.role)}
                      </td>

                      <td>
                        <span
                          className={`availability availability--${worker.availability
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {worker.availability}
                        </span>
                      </td>

                      <td>
                        {displayEmploymentStatus(
                          worker.employmentStatus,
                        )}
                      </td>

                      <td>
                        {worker.hoursThisWeek}h
                      </td>

                      <td>
                        <span
                          className={`compliance compliance--${worker.compliance
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {worker.compliance ===
                          "Compliant" ? (
                            <BadgeCheck size={16} />
                          ) : (
                            <CircleAlert size={16} />
                          )}

                          {worker.compliance}
                        </span>
                      </td>

                      <td>
                        <button
                          className="table-menu-button"
                          type="button"
                          aria-label={`Edit ${worker.fullName}`}
                          onClick={() =>
                            void openEditWorkerForm(
                              worker.id,
                            )
                          }
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <p>
              Showing {filteredWorkers.length} of{" "}
              {workers.length} workers
            </p>
          </footer>
        </section>

        {showWorkerForm && (
          <div
            className="worker-modal-overlay"
            role="presentation"
            onMouseDown={closeWorkerForm}
          >
            <section
              className="add-worker-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="worker-form-title"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              <header className="add-worker-header">
                <div>
                  <h2 id="worker-form-title">
                    {isEditing
                      ? "Edit worker"
                      : "Add worker"}
                  </h2>

                  <p>
                    {isEditing
                      ? "Update the worker’s information."
                      : "Create a new care worker account."}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close worker form"
                  onClick={closeWorkerForm}
                >
                  <X size={20} />
                </button>
              </header>

              <form
                className="add-worker-form"
                onSubmit={handleWorkerSubmit}
              >
                <label>
                  Full name <b>*</b>

                  <input
                    type="text"
                    value={workerForm.fullName}
                    onChange={(event) =>
                      setWorkerForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label>
                  Email <b>*</b>

                  <input
                    type="email"
                    value={workerForm.email}
                    disabled={isEditing}
                    onChange={(event) =>
                      setWorkerForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                {!isEditing && (
                  <>
                    <label>
                      Temporary password <b>*</b>

                      <input
                        type="password"
                        minLength={8}
                        value={workerForm.password}
                        onChange={(event) =>
                          setWorkerForm(
                            (current) => ({
                              ...current,
                              password:
                                event.target.value,
                            }),
                          )
                        }
                        required
                      />
                    </label>

                    <label>
                      Confirm password <b>*</b>

                      <input
                        type="password"
                        minLength={8}
                        value={
                          workerForm.confirmPassword
                        }
                        onChange={(event) =>
                          setWorkerForm(
                            (current) => ({
                              ...current,
                              confirmPassword:
                                event.target.value,
                            }),
                          )
                        }
                        required
                      />
                    </label>
                  </>
                )}

                <label>
                  Phone <b>*</b>

                  <input
                    type="tel"
                    value={workerForm.phone}
                    onChange={(event) =>
                      setWorkerForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label>
                  Employment status

                  <select
                    value={
                      workerForm.employmentStatus
                    }
                    onChange={(event) =>
                      setWorkerForm((current) => ({
                        ...current,

                        employmentStatus:
                          event.target
                            .value as EmploymentStatus,
                      }))
                    }
                  >
                    <option value="CASUAL">
                      Casual
                    </option>

                    <option value="PART_TIME">
                      Part-time
                    </option>

                    <option value="FULL_TIME">
                      Full-time
                    </option>
                  </select>
                </label>

                <label>
                  Joined date

                  <input
                    type="date"
                    value={workerForm.joinedDate}
                    onChange={(event) =>
                      setWorkerForm((current) => ({
                        ...current,
                        joinedDate:
                          event.target.value,
                      }))
                    }
                  />
                </label>

                {isEditing && (
                  <label>
                    Availability

                    <select
                      value={
                        workerForm.availability
                      }
                      onChange={(event) =>
                        setWorkerForm(
                          (current) => ({
                            ...current,

                            availability:
                              event.target
                                .value as Availability,
                          }),
                        )
                      }
                    >
                      <option value="Available">
                        Available
                      </option>

                      <option value="On shift">
                        On shift
                      </option>

                      <option value="Unavailable">
                        Unavailable
                      </option>
                    </select>
                  </label>
                )}

                <label className="full-width-field">
                  Address

                  <textarea
                    rows={3}
                    value={workerForm.address}
                    onChange={(event) =>
                      setWorkerForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                  />
                </label>

                {error && (
                  <p className="worker-form-error">
                    {error}
                  </p>
                )}

                <div className="add-worker-actions">
                  <button
                    className="outline-button"
                    type="button"
                    disabled={isSaving}
                    onClick={closeWorkerForm}
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
                        : "Add worker"}
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

export default Workers;

"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Task, tasksApi } from "@/lib/tasks";
import Link from "next/link";

const emptyForm = {
  title: "",
  description: "",
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      setError("");
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load tasks."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Please enter a task title.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        title,
        description: form.description.trim() || null,
      };

      if (editingId !== null) {
        const updated = await tasksApi.update(editingId, payload);

        setTasks((current) =>
          current.map((task) =>
            task.id === editingId ? updated : task
          )
        );
      } else {
        const created = await tasksApi.create({
          ...payload,
          completed: false,
        });

        setTasks((current) => [created, ...current]);
      }

      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save task."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleCompleted(task: Task) {
    setError("");

    try {
      const updated = await tasksApi.update(task.id, {
        completed: !task.completed,
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id ? updated : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update task."
      );
    }
  }

  async function deleteTask(task: Task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    setError("");

    try {
      await tasksApi.delete(task.id);
      setTasks((current) =>
        current.filter((item) => item.id !== task.id)
      );

      if (editingId === task.id) resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete task."
      );
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="container py-5" style={{ maxWidth: 850 }}>
      <header className="mb-4">
        <span className="badge text-bg-primary mb-2">
          IQT-FSD-2026
        </span>
        <h1 className="fw-bold">Task Manager</h1>
        <p className="text-secondary">
          Organize your work, track progress, and get things done.
        </p>
        <Link href="/github" className="btn btn-success btn-sm mt-2">Explore GitHub Repositories →</Link>
      </header>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            type="button"
            className="btn-close float-end"
            aria-label="Dismiss error"
            onClick={() => setError("")}
          />
        </div>
      )}

      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="h5 mb-3">
            {editingId !== null ? "Edit task" : "Add a new task"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Task title
              </label>
              <input
                id="title"
                className="form-control"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                maxLength={255}
                required
                placeholder="What needs to be done?"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description (optional)
              </label>
              <textarea
                id="description"
                className="form-control"
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description: event.target.value,
                  })
                }
                placeholder="Add some details..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Save changes"
                  : "Add task"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Your tasks</h2>
          <span className="text-secondary small">
            {completedCount} of {tasks.length} completed
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center border rounded-3 p-5">
            <h3 className="h6">No tasks yet</h3>
            <p className="text-secondary mb-0">
              Add your first task using the form above.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="card border-0 shadow-sm"
              >
                <div className="card-body d-flex gap-3 align-items-start">
                  <input
                    type="checkbox"
                    className="form-check-input mt-1"
                    checked={task.completed}
                    onChange={() => void toggleCompleted(task)}
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? "incomplete" : "complete"
                    }`}
                  />

                  <div className="flex-grow-1 min-width-0">
                    <h3
                      className={`h6 mb-1 ${
                        task.completed
                          ? "text-decoration-line-through text-secondary"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-secondary small mb-2">
                        {task.description}
                      </p>
                    )}

                    <span
                      className={`badge ${
                        task.completed
                          ? "text-bg-success"
                          : "text-bg-secondary"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEditing(task)}
                      aria-label={`Edit ${task.title}`}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => void deleteTask(task)}
                      aria-label={`Delete ${task.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export default function GithubPage() {
  const [username, setUsername] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = username.trim();

    if (!user) return;

    setLoading(true);
    setError("");
    setSearched(false);
    setRepositories([]);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=6`,
        {
          headers: { Accept: "application/vnd.github+json" },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("GitHub user not found. Check the username.");
        }

        if (response.status === 403 || response.status === 429) {
          throw new Error(
            "GitHub API rate limit reached. Please try again later."
          );
        }

        throw new Error("Unable to fetch repositories. Please try again.");
      }

      const data: Repository[] = await response.json();
      setRepositories(data);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: 1000 }}>
      <div className="mb-4">
        <Link href="/" className="btn btn-outline-secondary btn-sm mb-4">
          ← Back to Task Manager
        </Link>

        <div>
          <span className="badge text-bg-dark mb-2">
            IQT-FSD-2026
          </span>
          <h1 className="fw-bold">GitHub Repository Explorer</h1>
          <p className="text-secondary">
            Search GitHub users and explore their public repositories.
          </p>
        </div>
      </div>

      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="h5 mb-3">Search repositories</h2>

          <form
            onSubmit={handleSearch}
            className="d-flex flex-column flex-sm-row gap-2"
          >
            <input
              type="text"
              className="form-control"
              placeholder="Enter a GitHub username"
              aria-label="GitHub username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />

            <button
              type="submit"
              className="btn btn-dark flex-shrink-0"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </section>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary mt-2">Fetching repositories...</p>
        </div>
      )}

      {searched && !loading && (
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">Public repositories</h2>
            <span className="text-secondary small">
              {repositories.length} results
            </span>
          </div>

          {repositories.length === 0 ? (
            <div className="border rounded-3 p-5 text-center">
              <p className="mb-0">
                No public repositories found for this user.
              </p>
            </div>
          ) : (
            <div className="row g-3">
              {repositories.map((repo) => (
                <div className="col-12 col-md-6 col-lg-4" key={repo.id}>
                  <article className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <h3 className="h6">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          {repo.name}
                        </a>
                      </h3>

                      <p className="text-secondary small flex-grow-1">
                        {repo.description || "No description provided."}
                      </p>

                      <div className="d-flex flex-wrap gap-3 small text-secondary">
                        <span>
                          {repo.language || "Language not specified"}
                        </span>
                        <span>★ {repo.stargazers_count}</span>
                        <span>Forks: {repo.forks_count}</span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {!searched && !loading && !error && (
        <div className="text-center border rounded-3 p-5">
          <h2 className="h6">Explore public repositories</h2>
          <p className="text-secondary mb-0">
            Enter a GitHub username above to get started.
          </p>
        </div>
      )}

      <footer className="text-center text-secondary small mt-5">
        Powered by the GitHub REST API
      </footer>
    </main>
  );
}

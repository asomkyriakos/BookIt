import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers, type User } from "./userApi";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    let ignore = false;
    fetchUsers()
      .then((result) => {
        if (!ignore) setUsers(result);
      })
      .catch(() => {
        if (!ignore) setError("Could not load users.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => { ignore = true; };
  }, []);

  const visibleUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter, users]);

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Users</h1>
          <p>{isLoading ? "Loading registered users..." : `${users.length} registered users`}</p>
        </div>
      </header>
      {isLoading ? <p className="page-message">Loading users...</p> : null}
      {error ? <p className="page-message page-message--error" role="alert">{error}</p> : null}
      {!isLoading && !error && users.length === 0 ? <p className="page-message">No users found.</p> : null}
      {!isLoading && !error && users.length > 0 ? (
        <>
          <section className="user-filters" aria-label="User filters">
            <div className="form-field">
              <label htmlFor="user-search">Search</label>
              <input
                id="user-search"
                type="search"
                placeholder="Name or email"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="role-filter">Role</label>
              <select id="role-filter" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                <option value="ALL">All roles</option>
                <option value="USER">Attendee</option>
                <option value="ORGANIZER">Organizer</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="status-filter">Status</label>
              <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="ALL">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </section>

          {visibleUsers.length === 0 ? (
            <p className="page-message">No users match these filters.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table users-table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => {

                    return (
                      <tr key={user.id}>
                        <th scope="row"><Link to={`/users/${user.id}`}>{user.firstName} {user.lastName}</Link></th>
                        <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                        <td>{user.role}</td>
                        <td>{user.status}</td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </main>
  );
}

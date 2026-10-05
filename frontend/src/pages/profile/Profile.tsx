import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { CurrentUser } from "../../Auth/Authentication";
import { useAuth } from "../../Auth/useAuth";
import Button from "../../components/Button";
import {updateProfile} from "../profile/profileApi";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="page page--narrow">
        <p className="page-message">Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page page--narrow">
        <p className="page-message page-message--error">
          Profile unavailable.
        </p>
      </main>
    );
  }

  return <ProfileContent user={user} />;
}

function ProfileContent({ user }: { user: CurrentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    address: user.address,
  });

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const primaryAction =
    user.role === "ADMIN"
      ? { to: "/users", label: "Manage users" }
      : user.role === "ORGANIZER"
        ? { to: "/createEvent", label: "Create event" }
        : { to: "/myBookings", label: "My bookings" };

  function startEditing() {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });

    setSaveMessage("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });

    setIsEditing(false);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    setSaveMessage("");

    const updatedUser = await updateProfile({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim(),
    });

    setFormData({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
    });

    setIsEditing(false);
    setSaveMessage("Profile updated successfully.");
  } catch (error) {
    console.error(error);
    setSaveMessage("Could not update profile.");
  }
}

  return (
    <main className="page page--narrow">
      <header className="page-header">
        <div>
          <h1>{fullName}</h1>
          <p>{user.role}</p>
        </div>
      </header>

      <section className="panel">
        <h2>Account details</h2>

        {isEditing ? (
          <form className="form" onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="profile-first-name">First name</label>
                <input
                  id="profile-first-name"
                  required
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      firstName: event.target.value,
                    })
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-last-name">Last name</label>
                <input
                  id="profile-last-name"
                  required
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      lastName: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
              />
            </div>

            <div className="form-field">
              <label htmlFor="profile-phone">Phone number</label>
              <input
                id="profile-phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    phoneNumber: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="profile-address">Address</label>
              <input
                id="profile-address"
                value={formData.address}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    address: event.target.value,
                  })
                }
              />
            </div>

            <div className="page-actions">
              <Button type="submit">Save details</Button>
              <Button variant="secondary" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <dl className="details-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt>Phone</dt>
                <dd>
                  {user.phoneNumber || "Not provided"}
                </dd>
              </div>

              <div>
                <dt>Address</dt>
                <dd>
                  {user.address || "Not provided"}
                </dd>
              </div>
            </dl>

            <div className="page-actions">
              <Button onClick={startEditing}>
                Edit details
              </Button>

              <Link
                className="button button--secondary"
                to={primaryAction.to}
              >
                {primaryAction.label}
              </Link>

              <Link
                className="button button--secondary"
                to="/events"
              >
                Browse events
              </Link>
            </div>
          </>
        )}

        {saveMessage && (
          <p role="status">{saveMessage}</p>
        )}
      </section>
    </main>
  );
}
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
import SearchPage from "./Search";
import { exportXml, exportJson } from "./exportApi"

export default function EventPage() {
  const { user } = useAuth();
  const canCreateEvent = user?.role === "ORGANIZER" || user?.role === "ADMIN";

  async function handleXmlExport() {
    try {
      await exportXml();
    } catch (error) {
      console.error(error);
      alert("Could not export XML");
    }
  }

  async function handleJsonExport() {
    try {
      await exportJson();
    } catch (error) {
      console.error(error);
      alert("Could not export JSON");
    }
  }


  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Events</h1>
          <p>Search for an event and view its available tickets.</p>
        </div>
        {canCreateEvent ? (
          <Link className="button" to="/createEvent">Publish event</Link>
        ) : null}
        {user?.role == "ADMIN" && (<div>
          <button onClick={handleXmlExport}>
            Export XML
          </button>

          <button onClick={handleJsonExport}>
            Export JSON
          </button>
        </div>)
        }

      </header>
      <SearchPage />
    </main>
  );
}

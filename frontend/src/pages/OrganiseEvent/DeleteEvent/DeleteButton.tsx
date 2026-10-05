import { useState } from 'react';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';

export default function DeleteButton({ eventId }: { eventId: string }) {

    const navigate = useNavigate();

    // Χρησιμοποιούμε state μόνο για να δείξουμε ότι "φορτώνει"
    const [isDeleting, setIsDeleting] = useState(false);

    // Δεν χρειαζόμαστε πια (event), είναι μια απλή συνάρτηση
    const handleDelete = async () => {
        // 1. Ζητάμε επιβεβαίωση (Πολύ σημαντικό όταν έχουμε σκέτο κουμπί!)
        const isConfirmed = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");

        // Αν πατήσει "Ακύρωση", σταματάμε εδώ
        if (!isConfirmed) return;

        setIsDeleting(true); // Αλλάζουμε το κουμπί σε "Διαγραφή..."

        try {
            // 2. Κάνουμε το DELETE request στο σωστό URL
            const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                method: 'DELETE',
                credentials:"include"
            });

            if (response.ok) {
                alert('Event deleted successfully!');
                navigate("/events")
            } else {
                alert('Failed to delete event. Please try agains.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while connecting to the server.');
        } finally {
            setIsDeleting(false); // Επαναφέρουμε το κουμπί στην αρχική του κατάσταση
        }
    };

    return (
        <Button
            onClick={handleDelete}
            disabled={isDeleting} // Απενεργοποιούμε το κουμπί όσο περιμένουμε
            variant='danger'
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
    );
}
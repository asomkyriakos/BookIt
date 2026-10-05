import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthProvider.tsx';
import { PrivateRoute } from './components/PrivateRoute.tsx';

import Layout from './Layout.tsx';
import BookingPage from './pages/BookingPage/BookingPage.tsx';
import EventDetailsPage from './pages/EventDetailsPage/EventDetails.tsx';
import EventPage from './pages/EventPage/EventPage.tsx';
import { Home } from './pages/HomePage/Home.tsx';
import Login from "./pages/LoginPage/Login.tsx";
import Messaging from './pages/Messaging/Messaging.tsx';
import GetBookings from './pages/myBookings/myBookings.tsx';
import OrganiserBookings from './pages/myBookings/organiserBookings.tsx';
import CreateEvent from './pages/OrganiseEvent/CreateEvent/CreateEvent.tsx';
import EditEvent from './pages/OrganiseEvent/EditEvent/EditEvent.tsx';
import Profile from './pages/profile/Profile.tsx';
import Registration from "./pages/registerPage/registerPage.tsx";
import UserDetailsPage from './pages/UserDetailsPage/UserDetailsPage.tsx';
import UsersPage from './pages/UsersPage/UsersPage.tsx';
import Welcome from './pages/WelcomePage/Welcome.tsx';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/events/:eventId" element={<EventDetailsPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/booking/:eventId" element={<BookingPage />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:userId" element={<UserDetailsPage />} />
              <Route path="/createEvent" element={<CreateEvent />} />
              <Route path="/editEvent/:eventId" element={<EditEvent />} />
              <Route path="/myBookings" element={<GetBookings />} />
              <Route path="/organiserBookings" element={<OrganiserBookings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

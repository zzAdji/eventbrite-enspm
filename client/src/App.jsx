import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CreateEvent from './pages/CreateEvent';

// Placeholders for other pages
const HomePage = () => <div>Home Page (P0)</div>;
const EventCatalog = () => <div>Event Catalog (P0)</div>;
const EventDetail = () => <div>Event Detail (P0)</div>;
const TicketSuccess = () => <div>Ticket Success (P0)</div>;
const Dashboard = () => <div>Dashboard (P1)</div>;
const MyTickets = () => <div>My Tickets (P1)</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventCatalog />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="create" element={<CreateEvent />} />
        <Route path="ticket/:code" element={<TicketSuccess />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="mytickets" element={<MyTickets />} />
      </Route>
    </Routes>
  );
}

export default App;

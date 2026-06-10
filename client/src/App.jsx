import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CreateEvent from './pages/CreateEvent';
import HomePage from './pages/HomePage';
import EventCatalog from './pages/EventCatalog';
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import TicketSuccess from './pages/TicketSuccess';
import MyTickets from './pages/MyTickets';

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

import { Routes, Route, Navigate } from "react-router-dom";
import { GalleryProvider } from "./store";
import Layout from "./Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Characters from "./pages/Characters";
import Events from "./pages/Events";
import Talks from "./pages/Talks";
import Collectors from "./pages/Collectors";
import Contacts from "./pages/Contacts";
import Work from "./pages/Work";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ScrollToTop from "./ScrollToTop";

export default function App() {
  return (
    <GalleryProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="characters" element={<Characters />} />
          <Route path="events" element={<Events />} />
          <Route path="talks" element={<Talks />} />
          <Route path="collectors" element={<Collectors />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="works" element={<Navigate to="/collectors" replace />} />
          <Route path="works/:slug" element={<Work />} />
          <Route path="workshops" element={<Navigate to="/events" replace />} />
          <Route path="payment" element={<Navigate to="/about" replace />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GalleryProvider>
  );
}

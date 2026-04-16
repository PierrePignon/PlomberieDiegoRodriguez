import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Realisations from './pages/Realisations';
import Zones from './pages/Zones';
import Avis from './pages/Avis';
import Contact from './pages/Contact';
import RendezVous from './pages/Rendez-vous';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/realisations" element={<Realisations />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/avis" element={<Avis />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rendez-vous" element={<RendezVous />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-2xl font-bold">Page introuvable</h1></div>} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App

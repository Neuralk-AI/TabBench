
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import IndustrialDatasetsPage from './pages/IndustrialDatasetsPage';
import AcademicDatasetsPage from './pages/AcademicDatasetsPage';
import NotFoundPage from './pages/NotFoundPage';
import ContributePage from './pages/ContributePage';
import DiscussionsPage from './pages/DiscussionsPage';
import EventsPage from './pages/EventsPage';
import AboutUsPage from './pages/AboutUsPage';
import TermsAndCitationPage from './pages/TermsAndCitationPage';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/industrial" element={<Navigate to="/industrial/product-categorization" replace />} />
        <Route path="/industrial/:useCaseSlug" element={<IndustrialDatasetsPage />} /> 
        <Route path="/academic" element={<AcademicDatasetsPage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/terms-citation" element={<TermsAndCitationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
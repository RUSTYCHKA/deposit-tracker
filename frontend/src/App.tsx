import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DepositDetailsPage } from '@/pages/deposit-details/DepositDetailsPage';
import { HomePage } from '@/pages/home/HomePage';

function App() {
  return (
    <BrowserRouter basename="/deposit-tracker">
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/deposit/:id"
          element={<DepositDetailsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
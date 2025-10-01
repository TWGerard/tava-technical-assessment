import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import PersonList from "./pages/PersonList";
import NotFound from "./pages/NotFound";
import PersonEdit from "./pages/PersonEdit";
import PersonCreate from "./pages/PersonCreate";
import Header from "./components/Header";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/employees/" replace />} />
          <Route path="/people/" element={<PersonList />} />
          <Route path="/people/new/" element={<PersonCreate />} />
          <Route path="/people/:personId/" element={<PersonEdit />} />
          <Route path="/employees/" element={<PersonList type="Employees" />} />
          <Route path="/users/" element={<PersonList type="Users" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

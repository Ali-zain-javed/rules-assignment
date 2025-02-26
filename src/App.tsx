import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RulesPage from "./pages/RulesPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route path="/rules" element={<RulesPage />} />
          </Routes>
        </Router>
      </DndProvider>
    </Provider>
  );
}

export default App;

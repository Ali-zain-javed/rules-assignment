import React, { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const RulesPage = lazy(() => import("./pages/RulesPage"));

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/rules" replace />} />
            <Route
              path="/rules"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <RulesPage />
                </Suspense>
              }
            />
          </Routes>
        </Router>
      </DndProvider>
    </Provider>
  );
}

export default App;

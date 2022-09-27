import React from "react";

import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import routes from "routes";

interface IMainLayout {}

const MainLayout = (props: IMainLayout) => {
  return (
    <Router>
      <Routes>
        {routes.map((e) => (
          <Route
            key={e.path}
            path={e.path}
            element={React.createElement(e.component)}
          />
        ))}
        <Route path="*" element={<Navigate to="/main" />} />
      </Routes>
    </Router>
  );
};

export default MainLayout;

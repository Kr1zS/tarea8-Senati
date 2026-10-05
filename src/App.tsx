import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Inicio from "./pages/Inicio";
import Acceso from "./pages/Acceso";
import Empleado from "./pages/Empleado";
import Administrador from "./pages/Administrador";
import RegistroVisita from "./pages/RegistroVisita";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />

        <Route
          path="/acceso/:rol"
          element={<Acceso />}
        />

        <Route
          path="/empleado"
          element={<Empleado />}
        />

        <Route
          path="/administrador"
          element={<Administrador />}
        />

        <Route
          path="/registro-visita"
          element={<RegistroVisita />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
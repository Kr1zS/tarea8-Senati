import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

type Empleado = {
  codigo: string;
  nombre: string;

  estado:
    | "Activo"
    | "Descanso"
    | "Despedido";

  ultimoAcceso: string;
};

const empleadosIniciales: Empleado[] = [
  {
    codigo: "EMP001",
    nombre: "Carlos Rodríguez López",
    estado: "Activo",
    ultimoAcceso: "",
  },

  {
    codigo: "EMP002",
    nombre: "María Torres Vega",
    estado: "Activo",
    ultimoAcceso: "",
  },

  {
    codigo: "EMP003",
    nombre: "Diego Mendoza Ruiz",
    estado: "Activo",
    ultimoAcceso: "",
  },
];

function Acceso() {
  const navigate = useNavigate();

  const { rol } = useParams();

  const [codigo, setCodigo] =
    useState("");

  const [error, setError] =
    useState("");

  const [
    mostrarCodigo,
    setMostrarCodigo,
  ] = useState(false);

  const esAdmin =
    rol === "administrador";

  const obtenerEmpleados = () => {
    const guardados =
      localStorage.getItem(
        "empleados"
      );

    if (guardados) {
      try {
        return JSON.parse(
          guardados
        ) as Empleado[];
      } catch {
        // continúa abajo
      }
    }

    localStorage.setItem(
      "empleados",
      JSON.stringify(
        empleadosIniciales
      )
    );

    return empleadosIniciales;
  };

  const validarCodigo = () => {
    const codigoIngresado =
      codigo.trim().toUpperCase();

    /*
     * ADMINISTRADOR
     */
    if (esAdmin) {
      if (
        codigoIngresado ===
        "ADMIN2026"
      ) {
        setError("");

        localStorage.setItem(
          "sesionAdmin",
          JSON.stringify({
            acceso:
              new Date().toISOString(),
          })
        );

        navigate(
          "/administrador"
        );

        return;
      }

      setError(
        "Código de administrador incorrecto."
      );

      return;
    }

    /*
     * EMPLEADO
     */
    const empleados =
      obtenerEmpleados();

    const empleado =
      empleados.find(
        (item) =>
          item.codigo ===
          codigoIngresado
      );

    if (!empleado) {
      setError(
        "Código de empleado incorrecto."
      );

      return;
    }

    if (
      empleado.estado ===
      "Despedido"
    ) {
      setError(
        "Este empleado ya no tiene acceso al sistema."
      );

      return;
    }

    if (
      empleado.estado ===
      "Descanso"
    ) {
      setError(
        "Este empleado se encuentra en descanso."
      );

      return;
    }

    const ahora =
      new Date().toISOString();

    const actualizados =
      empleados.map(
        (item) =>
          item.codigo ===
          empleado.codigo
            ? {
                ...item,
                ultimoAcceso:
                  ahora,
              }
            : item
      );

    localStorage.setItem(
      "empleados",
      JSON.stringify(
        actualizados
      )
    );

    localStorage.setItem(
      "empleadoSesion",
      JSON.stringify({
        codigo:
          empleado.codigo,

        nombre:
          empleado.nombre,

        acceso:
          ahora,
      })
    );

    setError("");

    navigate("/empleado");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-violet-100 flex items-center justify-center px-4">

      <div className="w-full max-w-[430px] bg-white/90 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl border border-white">

        <button
          onClick={() =>
            navigate("/")
          }
          className="text-slate-500 hover:text-blue-600 cursor-pointer"
        >
          ← Volver
        </button>

        <div className="text-center mt-7">

          <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center text-4xl mb-5">
            {esAdmin
              ? "👑"
              : "👤"}
          </div>

          <p className="text-blue-500 text-xs uppercase tracking-[0.3em]">
            Acceso al sistema
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-2 capitalize">
            {esAdmin
              ? "Administrador"
              : "Empleado"}
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Ingresa tu código para continuar
          </p>

        </div>

        <div className="mt-8">

          <label className="text-slate-600 text-sm font-semibold">
            Código de acceso
          </label>

          <div className="relative mt-2">

            <input
              type={
                mostrarCodigo
                  ? "text"
                  : "password"
              }
              value={codigo}
              onChange={(e) => {
                setCodigo(
                  e.target.value
                );

                setError("");
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  validarCodigo();
                }
              }}
              placeholder={
                esAdmin
                  ? "ADMIN2026"
                  : "Ej. EMP001"
              }
              className="w-full bg-slate-50 border border-slate-200 px-5 pr-14 py-4 rounded-2xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() =>
                setMostrarCodigo(
                  !mostrarCodigo
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {mostrarCodigo
                ? "🙈"
                : "👁️"}
            </button>

          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={
              validarCodigo
            }
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold hover:opacity-90 cursor-pointer"
          >
            Ingresar
          </button>

        </div>

      </div>

    </div>
  );
}

export default Acceso;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Visita = {
  codigo: string;
  dni: string;
  celular: string;
  visitante: string;
  nombres: string;
  apellidos: string;

  asunto:
    | "Matrícula"
    | "Pagos"
    | "Tutoría"
    | "Otros";

  carrera: string;
  consulta: string;
  respuesta: string;

  prioridad:
    | "Alta"
    | "Media"
    | "Baja";

  estado:
    | "Completada"
    | "En Proceso"
    | "Pendiente";

  fecha: string;

  empleadoCodigo: string;
  empleadoNombre: string;
};

type SesionEmpleado = {
  codigo: string;
  nombre: string;
  acceso: string;
};

function RegistroVisita() {
  const navigate = useNavigate();

  const [dni, setDni] = useState("");
  const [celular, setCelular] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");

  const [asunto, setAsunto] = useState<
    "Matrícula" | "Pagos" | "Tutoría" | "Otros" | ""
  >("");

  const [carrera, setCarrera] = useState("");
  const [mensaje, setMensaje] = useState("");

  // EMPLEADO QUE ESTÁ LOGUEADO
  const sesionEmpleado: SesionEmpleado | null = JSON.parse(
    localStorage.getItem("empleadoSesion") || "null"
  );

  const registrarVisita = () => {
    // VALIDAR DNI
    if (dni.length !== 8) {
      alert("Ingresa un DNI válido de 8 dígitos.");
      return;
    }

    // VALIDAR CAMPOS
    if (
      nombres.trim() === "" ||
      apellidos.trim() === "" ||
      asunto === "" ||
      carrera === "" ||
      mensaje.trim().length < 5
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    // OBTENER VISITAS ANTERIORES
    const guardadas = localStorage.getItem("visitas");

    const visitasAnteriores: Visita[] = guardadas
      ? JSON.parse(guardadas)
      : [];

    // GENERAR CÓDIGO
    const numero = visitasAnteriores.length + 1;

    const codigo = `VIS-${String(numero).padStart(4, "0")}`;

    // NUEVA VISITA
    const nuevaVisita: Visita = {
      codigo,

      dni,
      celular,

      visitante: `${nombres.trim()} ${apellidos.trim()}`,

      nombres: nombres.trim(),
      apellidos: apellidos.trim(),

      asunto,
      carrera,

      consulta: mensaje.trim(),

      respuesta: "",

      prioridad: "Media",

      estado: "Pendiente",

      fecha: new Date()
        .toISOString()
        .split("T")[0],

      // AQUÍ GUARDAMOS EL EMPLEADO
      empleadoCodigo:
        sesionEmpleado?.codigo || "SIN-ASIGNAR",

      empleadoNombre:
        sesionEmpleado?.nombre || "Sin asignar",
    };

    // AGREGAR VISITA
    const nuevasVisitas = [
      nuevaVisita,
      ...visitasAnteriores,
    ];

    // GUARDAR EN LOCALSTORAGE
    localStorage.setItem(
      "visitas",
      JSON.stringify(nuevasVisitas)
    );

    alert("✅ Visita registrada correctamente");

    // VOLVER AL DASHBOARD
    navigate("/empleado");
  };

  const fechaActual =
    new Date().toLocaleString("es-PE");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#ede9fe]">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-violet-600 text-white shadow-md">

        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center font-bold shadow">
              S
            </div>

            <div>
              <p className="font-bold">
                Sistema de Visitas
              </p>

              <p className="text-white/60 text-xs">
                Registro y atención
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            {sesionEmpleado && (
              <div className="hidden md:block text-right">

                <p className="text-xs text-white/60">
                  Registrando como
                </p>

                <p className="text-sm font-semibold">
                  {sesionEmpleado.nombre}
                </p>

              </div>
            )}

            <button
              onClick={() =>
                navigate("/empleado")
              }
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition cursor-pointer"
            >
              👤 Panel Empleado
            </button>

          </div>

        </div>

      </header>

      {/* CONTENIDO */}
      <main className="flex justify-center px-4 py-10">

        <div className="w-full max-w-3xl bg-white rounded-[32px] p-6 md:p-8 shadow-[0_25px_70px_rgba(30,64,175,0.15)] border border-white">

          {/* TITULO */}
          <div className="text-center mb-8">

            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mb-5 shadow-sm">
              📝
            </div>

            <p className="text-blue-500 text-xs uppercase tracking-[0.3em]">
              Nuevo ingreso
            </p>

            <h1 className="text-slate-800 text-3xl font-bold mt-2">
              Registro de Visita
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              Complete sus datos para generar su ingreso
            </p>

          </div>

          {/* EMPLEADO */}
          {sesionEmpleado && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-2xl p-4">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                  👤
                </div>

                <div>

                  <p className="text-slate-400 text-xs">
                    Empleado responsable
                  </p>

                  <p className="text-slate-800 font-semibold">
                    {sesionEmpleado.nombre}
                  </p>

                  <p className="text-blue-600 text-xs">
                    {sesionEmpleado.codigo}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* DATOS PERSONALES */}
          <div className="grid md:grid-cols-2 gap-4">

            <Campo
              titulo="DNI *"
              placeholder="Ej. 75447166"
              value={dni}
              onChange={(valor) =>
                setDni(
                  valor
                    .replace(/\D/g, "")
                    .slice(0, 8)
                )
              }
            />

            <Campo
              titulo="Celular"
              placeholder="Ej. 921444222"
              value={celular}
              onChange={(valor) =>
                setCelular(
                  valor
                    .replace(/\D/g, "")
                    .slice(0, 9)
                )
              }
            />

            <Campo
              titulo="Nombres *"
              placeholder="Ej. Adriano"
              value={nombres}
              onChange={setNombres}
            />

            <Campo
              titulo="Apellidos *"
              placeholder="Ej. Pacheco"
              value={apellidos}
              onChange={setApellidos}
            />

          </div>

          {/* ASUNTO */}
          <div className="mt-6">

            <label className="text-slate-600 text-sm font-semibold">
              Tipo de Asunto *
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">

              <Opcion
                icono="📚"
                titulo="Matrícula"
                descripcion="Inscripción, cursos y horarios"
                activo={asunto === "Matrícula"}
                onClick={() =>
                  setAsunto("Matrícula")
                }
              />

              <Opcion
                icono="💰"
                titulo="Pagos"
                descripcion="Pensiones, cuotas y recibos"
                activo={asunto === "Pagos"}
                onClick={() =>
                  setAsunto("Pagos")
                }
              />

              <Opcion
                icono="👨‍🏫"
                titulo="Tutoría"
                descripcion="Orientación académica"
                activo={asunto === "Tutoría"}
                onClick={() =>
                  setAsunto("Tutoría")
                }
              />

              <Opcion
                icono="📄"
                titulo="Otros"
                descripcion="Trámites y otras consultas"
                activo={asunto === "Otros"}
                onClick={() =>
                  setAsunto("Otros")
                }
              />

            </div>

          </div>

          {/* CARRERA */}
          <div className="mt-6">

            <label className="text-slate-600 text-sm font-semibold">
              Carrera *
            </label>

            <select
              value={carrera}
              onChange={(e) =>
                setCarrera(e.target.value)
              }
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >

              <option value="">
                -- Seleccionar Carrera --
              </option>

              <option value="Ingeniería de Software con IA">
                💻 Ingeniería de Software con IA
              </option>

              <option value="Ingeniería de Ciberseguridad">
                🔒 Ingeniería de Ciberseguridad
              </option>

              <option value="Redes y Seguridad Informática">
                🌐 Redes y Seguridad Informática
              </option>

              <option value="Ingeniería de Soporte de TI">
                🖥️ Ingeniería de Soporte de TI
              </option>

              <option value="Desarrollo de Software">
                ⚙️ Desarrollo de Software
              </option>

              <option value="IA y Ciencia de Datos">
                🧠 IA y Ciencia de Datos
              </option>

              <option value="Diseño y Desarrollo de Videojuegos">
                🎮 Diseño y Desarrollo de Videojuegos
              </option>

            </select>

          </div>

          {/* CONSULTA */}
          <div className="mt-6">

            <label className="text-slate-600 text-sm font-semibold">
              Mensaje / Consulta *
            </label>

            <textarea
              value={mensaje}
              onChange={(e) =>
                setMensaje(e.target.value)
              }
              rows={5}
              placeholder="Describa detalladamente su consulta o motivo de visita..."
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none resize-none placeholder-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* FECHA */}
          <div className="mt-5 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-2xl px-5 py-4 flex flex-col sm:flex-row justify-between gap-2">

            <span className="text-slate-600 text-sm">
              📅 Fecha y hora de ingreso
            </span>

            <span className="text-blue-600 text-sm font-semibold">
              {fechaActual}
            </span>

          </div>

          {/* BOTÓN */}
          <button
            onClick={registrarVisita}
            className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-2xl hover:opacity-90 active:scale-[0.99] transition shadow-md cursor-pointer"
          >
            📝 REGISTRAR VISITA
          </button>

        </div>

      </main>

    </div>
  );
}

function Campo({
  titulo,
  placeholder,
  value,
  onChange,
}: {
  titulo: string;
  placeholder: string;
  value: string;
  onChange: (valor: string) => void;
}) {
  return (
    <div>

      <label className="text-slate-600 text-sm font-semibold">
        {titulo}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none placeholder-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
      />

    </div>
  );
}

function Opcion({
  icono,
  titulo,
  descripcion,
  activo,
  onClick,
}: {
  icono: string;
  titulo: string;
  descripcion: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl p-4 border text-center transition-all cursor-pointer ${
        activo
          ? "bg-blue-100 border-blue-400 shadow-md scale-[1.02]"
          : "bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-200"
      }`}
    >

      <div className="text-3xl">
        {icono}
      </div>

      <p className="font-bold mt-2 text-slate-800">
        {titulo}
      </p>

      <p className="text-slate-400 text-[11px] mt-1">
        {descripcion}
      </p>

    </button>
  );
}

export default RegistroVisita;
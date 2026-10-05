import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

type EstadoVisita =
  | "Pendiente"
  | "Activo"
  | "Rechazado"
  | "Completada";

type Visita = {
  codigo: string;

  dni?: string;
  celular?: string;

  visitante: string;

  asunto:
    | "Matrícula"
    | "Pagos"
    | "Tutoría"
    | "Otros";

  carrera?: string;

  consulta: string;
  respuesta?: string;

  prioridad:
    | "Alta"
    | "Media"
    | "Baja";

  estado: EstadoVisita;

  fecha: string;

  empleadoCodigo?: string;
  empleadoNombre?: string;

  rechazadaPor?: string[];
};

type SesionEmpleado = {
  codigo: string;
  nombre: string;
  acceso?: string;
};

function Empleado() {
  const navigate = useNavigate();

  const [visitas, setVisitas] =
    useState<Visita[]>([]);

  const [pestana, setPestana] =
    useState<
      "asignadas" | "disponibles"
    >("asignadas");

  const [busqueda, setBusqueda] =
    useState("");

  const [
    estadoFiltro,
    setEstadoFiltro,
  ] = useState("Todos");

  const [
    visitaSeleccionada,
    setVisitaSeleccionada,
  ] =
    useState<Visita | null>(
      null
    );

  const [
    respuesta,
    setRespuesta,
  ] = useState("");

  let sesion: SesionEmpleado | null =
    null;

  try {
    sesion =
      JSON.parse(
        localStorage.getItem(
          "empleadoSesion"
        ) || "null"
      );
  } catch {
    sesion = null;
  }

  useEffect(() => {
    if (!sesion) {
      navigate(
        "/acceso/empleado"
      );

      return;
    }

    const datos =
      localStorage.getItem(
        "visitas"
      );

    if (!datos) {
      setVisitas([]);
      return;
    }

    try {
      setVisitas(
        JSON.parse(datos)
      );
    } catch {
      setVisitas([]);
    }
  }, []);

  const guardarVisitas = (
    nuevas: Visita[]
  ) => {
    setVisitas(nuevas);

    localStorage.setItem(
      "visitas",
      JSON.stringify(
        nuevas
      )
    );
  };

  /*
   * VISITAS ASIGNADAS A ESTE EMPLEADO
   */
  const misVisitas =
    useMemo(() => {
      return visitas.filter(
        (visita) =>
          visita.empleadoCodigo ===
          sesion?.codigo
      );
    }, [
      visitas,
      sesion?.codigo,
    ]);

  /*
   * VISITAS DISPONIBLES
   *
   * No asignadas.
   * Además, si este empleado
   * ya la rechazó, no vuelve
   * a verla.
   */
  const disponibles =
    useMemo(() => {
      return visitas.filter(
        (visita) => {
          const sinAsignar =
            !visita.empleadoCodigo ||
            visita.empleadoCodigo ===
              "SIN-ASIGNAR";

          const rechazadaPorEmpleado =
            visita.rechazadaPor?.includes(
              sesion?.codigo || ""
            ) || false;

          return (
            sinAsignar &&
            !rechazadaPorEmpleado
          );
        }
      );
    }, [
      visitas,
      sesion?.codigo,
    ]);

  const actuales =
    pestana === "asignadas"
      ? misVisitas
      : disponibles;

  const filtradas =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return actuales.filter(
        (visita) => {
          const coincideTexto =
            texto === "" ||
            visita.codigo
              .toLowerCase()
              .includes(texto) ||
            visita.visitante
              .toLowerCase()
              .includes(texto) ||
            visita.asunto
              .toLowerCase()
              .includes(texto) ||
            visita.consulta
              .toLowerCase()
              .includes(texto);

          const coincideEstado =
            estadoFiltro ===
              "Todos" ||
            visita.estado ===
              estadoFiltro;

          return (
            coincideTexto &&
            coincideEstado
          );
        }
      );
    }, [
      actuales,
      busqueda,
      estadoFiltro,
    ]);

  const activas =
    misVisitas.filter(
      (v) =>
        v.estado === "Activo"
    ).length;

  const pendientes =
    misVisitas.filter(
      (v) =>
        v.estado ===
        "Pendiente"
    ).length;

  const completadas =
    misVisitas.filter(
      (v) =>
        v.estado ===
        "Completada"
    ).length;

  const rechazadas =
    misVisitas.filter(
      (v) =>
        v.estado ===
        "Rechazado"
    ).length;

  /*
   * ACEPTAR VISITA
   */
  const aceptarVisita = (
    codigo: string
  ) => {
    if (!sesion) return;

    const nuevas =
      visitas.map(
        (visita) =>
          visita.codigo ===
          codigo
            ? {
                ...visita,

                empleadoCodigo:
                  sesion!.codigo,

                empleadoNombre:
                  sesion!.nombre,

                estado:
                  "Activo" as EstadoVisita,
              }
            : visita
      );

    guardarVisitas(
      nuevas
    );

    setPestana(
      "asignadas"
    );
  };

  /*
   * RECHAZAR UNA VISITA DISPONIBLE
   *
   * No la elimina.
   * Solo desaparece para
   * este empleado.
   */
  const rechazarDisponible = (
    codigo: string
  ) => {
    if (!sesion) return;

    const nuevas =
      visitas.map(
        (visita) => {
          if (
            visita.codigo !==
            codigo
          ) {
            return visita;
          }

          const anteriores =
            visita.rechazadaPor ||
            [];

          if (
            anteriores.includes(
              sesion!.codigo
            )
          ) {
            return visita;
          }

          return {
            ...visita,

            rechazadaPor: [
              ...anteriores,
              sesion!.codigo,
            ],
          };
        }
      );

    guardarVisitas(
      nuevas
    );
  };

  /*
   * CAMBIAR ESTADO DE
   * UNA VISITA ASIGNADA
   */
  const cambiarEstado = (
    codigo: string,
    estado: EstadoVisita
  ) => {
    const nuevas =
      visitas.map(
        (visita) =>
          visita.codigo ===
          codigo
            ? {
                ...visita,
                estado,
              }
            : visita
      );

    guardarVisitas(
      nuevas
    );
  };

  const abrirRespuesta = (
    visita: Visita
  ) => {
    setVisitaSeleccionada(
      visita
    );

    setRespuesta(
      visita.respuesta || ""
    );
  };

  const guardarRespuesta =
    () => {
      if (
        !visitaSeleccionada
      ) {
        return;
      }

      if (
        respuesta.trim() ===
        ""
      ) {
        alert(
          "Escribe una respuesta."
        );

        return;
      }

      const nuevas =
        visitas.map(
          (visita) =>
            visita.codigo ===
            visitaSeleccionada.codigo
              ? {
                  ...visita,

                  respuesta:
                    respuesta.trim(),

                  estado:
                    visita.estado ===
                    "Pendiente"
                      ? "Activo"
                      : visita.estado,
                }
              : visita
        );

      guardarVisitas(
        nuevas
      );

      setVisitaSeleccionada(
        null
      );

      setRespuesta("");
    };

  /*
   * ADMIN SIEMPRE PIDE CÓDIGO
   */
  const irAdmin = () => {
    localStorage.removeItem(
      "sesionAdmin"
    );

    navigate(
      "/acceso/administrador"
    );
  };

  const cerrarSesion =
    () => {
      localStorage.removeItem(
        "empleadoSesion"
      );

      navigate("/");
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50">

      {/* HEADER */}

      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-violet-600 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              👤
            </div>

            <div>

              <p className="text-blue-100 text-xs uppercase tracking-[0.25em]">
                Panel Empleado
              </p>

              <h1 className="text-xl font-bold">
                {sesion?.nombre ||
                  "Empleado"}
              </h1>

              <p className="text-white/60 text-xs">
                {sesion?.codigo}
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={
                irAdmin
              }
              className="bg-violet-500 hover:bg-violet-400 px-5 py-3 rounded-xl font-semibold cursor-pointer"
            >
              👑 Modo Admin
            </button>

            <button
              onClick={() =>
                navigate(
                  "/registro-visita"
                )
              }
              className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-xl font-semibold cursor-pointer"
            >
              📝 Registrar Visita
            </button>

            <button
              onClick={
                cerrarSesion
              }
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl cursor-pointer"
            >
              🚪 Salir
            </button>

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-7">

          <p className="text-slate-400 text-sm">
            Gestión de atención
          </p>

          <h2 className="text-3xl font-bold text-slate-800">
            Mis Atenciones
          </h2>

        </div>

        {/* CARDS */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-7">

          <Card
            titulo="Asignadas"
            valor={
              misVisitas.length
            }
            icono="📋"
            fondo="bg-blue-100"
          />

          <Card
            titulo="Activas"
            valor={
              activas
            }
            icono="🔵"
            fondo="bg-cyan-100"
          />

          <Card
            titulo="Pendientes"
            valor={
              pendientes
            }
            icono="🟠"
            fondo="bg-orange-100"
          />

          <Card
            titulo="Completadas"
            valor={
              completadas
            }
            icono="✅"
            fondo="bg-green-100"
          />

          <Card
            titulo="Rechazadas"
            valor={
              rechazadas
            }
            icono="🚫"
            fondo="bg-red-100"
          />

        </div>

        {/* FILTROS */}

        <section className="bg-white rounded-[26px] shadow-sm border border-slate-100 p-6 mb-6">

          <h3 className="font-bold text-slate-800 mb-4">
            🔎 Filtros
          </h3>

          <div className="grid md:grid-cols-3 gap-3">

            <input
              value={
                busqueda
              }
              onChange={(e) =>
                setBusqueda(
                  e.target
                    .value
                )
              }
              placeholder="Buscar código, visitante o asunto..."
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
            />

            <select
              value={
                estadoFiltro
              }
              onChange={(e) =>
                setEstadoFiltro(
                  e.target
                    .value
                )
              }
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
            >
              <option>
                Todos
              </option>

              <option>
                Pendiente
              </option>

              <option>
                Activo
              </option>

              <option>
                Completada
              </option>

              <option>
                Rechazado
              </option>
            </select>

            <button
              onClick={() => {
                setBusqueda("");
                setEstadoFiltro(
                  "Todos"
                );
              }}
              className="bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              🧹 Limpiar
            </button>

          </div>

        </section>

        {/* PESTAÑAS */}

        <div className="flex flex-wrap gap-3 mb-4">

          <button
            onClick={() =>
              setPestana(
                "asignadas"
              )
            }
            className={`px-5 py-3 rounded-xl font-semibold cursor-pointer ${
              pestana ===
              "asignadas"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            📋 Mis Visitas ({misVisitas.length})
          </button>

          <button
            onClick={() =>
              setPestana(
                "disponibles"
              )
            }
            className={`px-5 py-3 rounded-xl font-semibold cursor-pointer ${
              pestana ===
              "disponibles"
                ? "bg-violet-600 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            📌 Visitas Disponibles ({disponibles.length})
          </button>

        </div>

        {/* TABLA */}

        <section className="bg-white rounded-[28px] shadow-md border border-slate-100 overflow-hidden">

          <div className="p-6 border-b">

            <h3 className="text-xl font-bold text-slate-800">

              {pestana ===
              "asignadas"
                ? "Mis Visitas Asignadas"
                : "Visitas Disponibles"}

            </h3>

            <p className="text-slate-400 text-sm mt-1">

              {pestana ===
              "disponibles"
                ? "Acepta una visita para comenzar a atenderla."
                : "Responde las consultas y actualiza su estado."}

            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1250px]">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs uppercase text-slate-500">

                  <th className="p-5">
                    Código
                  </th>

                  <th className="p-5">
                    Visitante
                  </th>

                  <th className="p-5">
                    Asunto
                  </th>

                  <th className="p-5">
                    Carrera
                  </th>

                  <th className="p-5">
                    Consulta
                  </th>

                  <th className="p-5">
                    Respuesta
                  </th>

                  <th className="p-5">
                    Prioridad
                  </th>

                  <th className="p-5">
                    Estado
                  </th>

                  <th className="p-5">
                    Fecha
                  </th>

                  <th className="p-5">
                    Acción
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtradas.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan={
                        10
                      }
                      className="py-20 text-center"
                    >

                      <div className="text-5xl mb-4">
                        📭
                      </div>

                      <p className="text-slate-600 font-semibold">

                        {pestana ===
                        "disponibles"
                          ? "No hay visitas disponibles"
                          : "No tienes visitas asignadas"}

                      </p>

                    </td>

                  </tr>

                ) : (

                  filtradas.map(
                    (
                      visita
                    ) => (

                      <tr
                        key={
                          visita.codigo
                        }
                        className="border-t hover:bg-blue-50/40"
                      >

                        <td className="p-5 font-bold text-blue-600">
                          {
                            visita.codigo
                          }
                        </td>

                        <td className="p-5 font-semibold">
                          {
                            visita.visitante
                          }
                        </td>

                        <td className="p-5">
                          {
                            visita.asunto
                          }
                        </td>

                        <td className="p-5">
                          {visita.carrera ||
                            "-"}
                        </td>

                        <td className="p-5 max-w-[250px]">
                          {
                            visita.consulta
                          }
                        </td>

                        <td className="p-5 max-w-[220px]">

                          {visita.respuesta ||
                            "Sin respuesta"}

                        </td>

                        <td className="p-5">
                          {
                            visita.prioridad
                          }
                        </td>

                        <td className="p-5">
                          <Estado
                            estado={
                              visita.estado
                            }
                          />
                        </td>

                        <td className="p-5">
                          {
                            visita.fecha
                          }
                        </td>

                        <td className="p-5">

                          {pestana ===
                          "disponibles" ? (

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  aceptarVisita(
                                    visita.codigo
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold cursor-pointer"
                              >
                                ✅ Aceptar
                              </button>

                              <button
                                onClick={() =>
                                  rechazarDisponible(
                                    visita.codigo
                                  )
                                }
                                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl font-semibold cursor-pointer"
                              >
                                🚫 Rechazar
                              </button>

                            </div>

                          ) : (

                            <div className="flex flex-wrap gap-2">

                              <button
                                onClick={() =>
                                  abrirRespuesta(
                                    visita
                                  )
                                }
                                title="Responder"
                                className="bg-violet-100 text-violet-700 px-3 py-2 rounded-lg cursor-pointer"
                              >
                                💬
                              </button>

                              <button
                                onClick={() =>
                                  cambiarEstado(
                                    visita.codigo,
                                    "Pendiente"
                                  )
                                }
                                title="Pendiente"
                                className="bg-orange-100 px-3 py-2 rounded-lg cursor-pointer"
                              >
                                🟠
                              </button>

                              <button
                                onClick={() =>
                                  cambiarEstado(
                                    visita.codigo,
                                    "Activo"
                                  )
                                }
                                title="Activo"
                                className="bg-blue-100 px-3 py-2 rounded-lg cursor-pointer"
                              >
                                🔵
                              </button>

                              <button
                                onClick={() =>
                                  cambiarEstado(
                                    visita.codigo,
                                    "Completada"
                                  )
                                }
                                title="Completada"
                                className="bg-green-100 px-3 py-2 rounded-lg cursor-pointer"
                              >
                                ✅
                              </button>

                              <button
                                onClick={() =>
                                  cambiarEstado(
                                    visita.codigo,
                                    "Rechazado"
                                  )
                                }
                                title="Rechazado"
                                className="bg-red-100 px-3 py-2 rounded-lg cursor-pointer"
                              >
                                🚫
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* MODAL RESPUESTA */}

      {visitaSeleccionada && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-[28px] shadow-2xl">

            <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-6 rounded-t-[28px] flex justify-between">

              <div>

                <p className="text-white/60 text-xs">
                  Responder visita
                </p>

                <h2 className="text-xl font-bold">
                  {
                    visitaSeleccionada.codigo
                  }
                </h2>

              </div>

              <button
                onClick={() =>
                  setVisitaSeleccionada(
                    null
                  )
                }
                className="cursor-pointer"
              >
                ✕
              </button>

            </div>

            <div className="p-6">

              <div className="bg-blue-50 rounded-xl p-4 mb-4">

                <p className="font-bold">
                  {
                    visitaSeleccionada.visitante
                  }
                </p>

                <p className="text-slate-500 mt-2">
                  {
                    visitaSeleccionada.consulta
                  }
                </p>

              </div>

              <label className="font-semibold text-slate-600 text-sm">
                Respuesta
              </label>

              <textarea
                value={
                  respuesta
                }
                onChange={(e) =>
                  setRespuesta(
                    e.target
                      .value
                  )
                }
                rows={5}
                placeholder="Escribe la respuesta..."
                className="w-full mt-2 border border-slate-200 rounded-xl p-4 outline-none"
              />

              <button
                onClick={
                  guardarRespuesta
                }
                className="w-full mt-4 bg-blue-600 text-white py-4 rounded-xl font-bold cursor-pointer"
              >
                💾 Guardar Respuesta
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function Card({
  titulo,
  valor,
  icono,
  fondo,
}: {
  titulo: string;
  valor: number;
  icono: string;
  fondo: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">

      <div className="flex justify-between">

        <div>

          <p className="text-slate-400 text-xs">
            {titulo}
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-1">
            {valor}
          </p>

        </div>

        <div
          className={`w-11 h-11 ${fondo} rounded-xl flex items-center justify-center`}
        >
          {icono}
        </div>

      </div>

    </div>
  );
}

function Estado({
  estado,
}: {
  estado:
    EstadoVisita;
}) {
  const estilos = {
    Pendiente:
      "bg-orange-100 text-orange-700",

    Activo:
      "bg-blue-100 text-blue-700",

    Completada:
      "bg-green-100 text-green-700",

    Rechazado:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}

export default Empleado;
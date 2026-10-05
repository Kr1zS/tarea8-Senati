import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Visita = {
  codigo: string;
  visitante: string;
  asunto: "Matrícula" | "Pagos" | "Tutoría" | "Otros";
  carrera?: string;
  consulta: string;
  respuesta: string;
  prioridad: "Alta" | "Media" | "Baja";
  estado: "Completada" | "En Proceso" | "Pendiente";
  fecha: string;
  empleadoCodigo?: string;
  empleadoNombre?: string;
};

function Empleado() {
  const navigate = useNavigate();

  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const sesion = JSON.parse(
    localStorage.getItem("empleadoSesion") || "null"
  );

  useEffect(() => {
    if (!sesion) {
      navigate("/acceso/empleado");
      return;
    }

    const datos = localStorage.getItem("visitas");

    if (datos) {
      setVisitas(JSON.parse(datos));
    }
  }, []);

  const misVisitas = useMemo(() => {
    return visitas.filter((visita) => {
      const pertenece =
        visita.empleadoCodigo === sesion?.codigo;

      const coincideBusqueda =
        visita.visitante
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        visita.codigo
          .toLowerCase()
          .includes(busqueda.toLowerCase());

      const coincideEstado =
        estadoFiltro === "Todos" ||
        visita.estado === estadoFiltro;

      return (
        pertenece &&
        coincideBusqueda &&
        coincideEstado
      );
    });
  }, [visitas, busqueda, estadoFiltro]);

  const completadas = misVisitas.filter(
    (v) => v.estado === "Completada"
  ).length;

  const proceso = misVisitas.filter(
    (v) => v.estado === "En Proceso"
  ).length;

  const pendientes = misVisitas.filter(
    (v) => v.estado === "Pendiente"
  ).length;

  const cambiarEstado = (
    codigo: string,
    estado: Visita["estado"]
  ) => {
    const nuevas = visitas.map((visita) =>
      visita.codigo === codigo
        ? {
            ...visita,
            estado,
          }
        : visita
    );

    setVisitas(nuevas);

    localStorage.setItem(
      "visitas",
      JSON.stringify(nuevas)
    );
  };

  const cerrarSesion = () => {
    localStorage.removeItem("empleadoSesion");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-violet-50">

      <header className="bg-gradient-to-r from-blue-700 to-violet-600 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              👤
            </div>

            <div>
              <p className="text-blue-100 text-xs uppercase tracking-widest">
                Panel Empleado
              </p>

              <h1 className="text-xl font-bold">
                {sesion?.nombre}
              </h1>

              <p className="text-white/60 text-xs">
                {sesion?.codigo}
              </p>
            </div>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                navigate("/registro-visita")
              }
              className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-xl font-bold cursor-pointer"
            >
              📝 Registrar Visita
            </button>

            <button
              onClick={cerrarSesion}
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl cursor-pointer"
            >
              Salir
            </button>

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto p-6">

        <div className="mb-7">

          <p className="text-slate-400 text-sm">
            Resumen personal
          </p>

          <h2 className="text-3xl font-bold text-slate-800">
            Mis Atenciones
          </h2>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">

          <Card
            titulo="Total"
            valor={misVisitas.length}
            icono="📋"
            fondo="bg-blue-100"
          />

          <Card
            titulo="Completadas"
            valor={completadas}
            icono="✅"
            fondo="bg-green-100"
          />

          <Card
            titulo="En proceso"
            valor={proceso}
            icono="⏳"
            fondo="bg-violet-100"
          />

          <Card
            titulo="Pendientes"
            valor={pendientes}
            icono="🔔"
            fondo="bg-orange-100"
          />

        </div>

        <section className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 mb-6">

          <h3 className="font-bold text-slate-800 mb-4">
            🔎 Buscar mis visitas
          </h3>

          <div className="grid md:grid-cols-3 gap-3">

            <input
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Código o visitante..."
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
            />

            <select
              value={estadoFiltro}
              onChange={(e) =>
                setEstadoFiltro(e.target.value)
              }
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
            >
              <option>Todos</option>
              <option>Pendiente</option>
              <option>En Proceso</option>
              <option>Completada</option>
            </select>

            <button
              onClick={() => {
                setBusqueda("");
                setEstadoFiltro("Todos");
              }}
              className="bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              🧹 Limpiar filtros
            </button>

          </div>

        </section>

        <section className="bg-white rounded-3xl overflow-hidden shadow-md">

          <div className="p-6 border-b border-slate-100">

            <h3 className="text-xl font-bold text-slate-800">
              📋 Mis Visitas Asignadas
            </h3>

            <p className="text-slate-400 text-sm">
              {misVisitas.length} registros
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead className="bg-slate-50">

                <tr className="text-left text-xs text-slate-500 uppercase">
                  <th className="p-5">Código</th>
                  <th className="p-5">Visitante</th>
                  <th className="p-5">Asunto</th>
                  <th className="p-5">Consulta</th>
                  <th className="p-5">Prioridad</th>
                  <th className="p-5">Estado</th>
                  <th className="p-5">Fecha</th>
                  <th className="p-5">Acciones</th>
                </tr>

              </thead>

              <tbody>

                {misVisitas.length === 0 ? (

                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center"
                    >
                      <div className="text-5xl mb-4">
                        📭
                      </div>

                      <p className="font-semibold text-slate-600">
                        No tienes visitas registradas
                      </p>
                    </td>
                  </tr>

                ) : (

                  misVisitas.map((visita) => (

                    <tr
                      key={visita.codigo}
                      className="border-t border-slate-100 hover:bg-blue-50/40"
                    >

                      <td className="p-5 font-bold text-blue-600">
                        {visita.codigo}
                      </td>

                      <td className="p-5">
                        {visita.visitante}
                      </td>

                      <td className="p-5">
                        {visita.asunto}
                      </td>

                      <td className="p-5">
                        {visita.consulta}
                      </td>

                      <td className="p-5">
                        {visita.prioridad}
                      </td>

                      <td className="p-5">
                        {visita.estado}
                      </td>

                      <td className="p-5">
                        {visita.fecha}
                      </td>

                      <td className="p-5">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              cambiarEstado(
                                visita.codigo,
                                "Completada"
                              )
                            }
                            className="bg-green-100 text-green-700 w-9 h-9 rounded-lg cursor-pointer"
                          >
                            ✓
                          </button>

                          <button
                            onClick={() =>
                              cambiarEstado(
                                visita.codigo,
                                "En Proceso"
                              )
                            }
                            className="bg-blue-100 text-blue-700 w-9 h-9 rounded-lg cursor-pointer"
                          >
                            ⏳
                          </button>

                          <button
                            onClick={() =>
                              cambiarEstado(
                                visita.codigo,
                                "Pendiente"
                              )
                            }
                            className="bg-orange-100 text-orange-700 w-9 h-9 rounded-lg cursor-pointer"
                          >
                            !
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

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
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">

      <div className="flex justify-between">

        <div>
          <p className="text-slate-400 text-xs">
            {titulo}
          </p>

          <p className="text-2xl font-bold text-slate-800 mt-2">
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

export default Empleado;
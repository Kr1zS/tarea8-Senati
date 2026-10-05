import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

type EstadoVisita =
  | "Pendiente"
  | "Activo"
  | "Completada"
  | "Rechazado";

type Empleado = {
  codigo: string;
  nombre: string;

  estado:
    | "Activo"
    | "Descanso"
    | "Despedido";

  ultimoAcceso: string;
};

type Visita = {
  codigo: string;

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

  estado:
    EstadoVisita;

  fecha: string;

  empleadoCodigo?: string;
  empleadoNombre?: string;
};

const empleadosIniciales: Empleado[] =
  [
    {
      codigo:
        "EMP001",

      nombre:
        "Carlos Rodríguez López",

      estado:
        "Activo",

      ultimoAcceso:
        "",
    },

    {
      codigo:
        "EMP002",

      nombre:
        "María Torres Vega",

      estado:
        "Activo",

      ultimoAcceso:
        "",
    },

    {
      codigo:
        "EMP003",

      nombre:
        "Diego Mendoza Ruiz",

      estado:
        "Activo",

      ultimoAcceso:
        "",
    },
  ];

function Administrador() {
  const navigate =
    useNavigate();

  const [
    empleados,
    setEmpleados,
  ] =
    useState<
      Empleado[]
    >([]);

  const [
    visitas,
    setVisitas,
  ] =
    useState<
      Visita[]
    >([]);

  const [
    seccion,
    setSeccion,
  ] = useState<
    | "resumen"
    | "empleados"
    | "visitas"
    | "disponibles"
  >("resumen");

  const [
    empleadoAsignacion,
    setEmpleadoAsignacion,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});

  useEffect(() => {
    /*
     * PROTEGER ADMIN
     */
    const sesionAdmin =
      localStorage.getItem(
        "sesionAdmin"
      );

    if (!sesionAdmin) {
      navigate(
        "/acceso/administrador"
      );

      return;
    }

    /*
     * EMPLEADOS
     */
    const guardados =
      localStorage.getItem(
        "empleados"
      );

    if (guardados) {
      try {
        setEmpleados(
          JSON.parse(
            guardados
          )
        );
      } catch {
        setEmpleados(
          empleadosIniciales
        );
      }
    } else {
      setEmpleados(
        empleadosIniciales
      );

      localStorage.setItem(
        "empleados",
        JSON.stringify(
          empleadosIniciales
        )
      );
    }

    /*
     * VISITAS
     */
    const visitasGuardadas =
      localStorage.getItem(
        "visitas"
      );

    if (
      visitasGuardadas
    ) {
      try {
        setVisitas(
          JSON.parse(
            visitasGuardadas
          )
        );
      } catch {
        setVisitas([]);
      }
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

  const disponibles =
    visitas.filter(
      (visita) =>
        !visita.empleadoCodigo ||
        visita.empleadoCodigo ===
          "SIN-ASIGNAR"
    );

  const completadas =
    visitas.filter(
      (v) =>
        v.estado ===
        "Completada"
    ).length;

  const activas =
    visitas.filter(
      (v) =>
        v.estado ===
        "Activo"
    ).length;

  const pendientes =
    visitas.filter(
      (v) =>
        v.estado ===
        "Pendiente"
    ).length;

  const rechazadas =
    visitas.filter(
      (v) =>
        v.estado ===
        "Rechazado"
    ).length;

  const empleadosActivos =
    empleados.filter(
      (e) =>
        e.estado ===
        "Activo"
    ).length;

  const efectividad =
    visitas.length === 0
      ? 0
      : Math.round(
          (completadas /
            visitas.length) *
            100
        );

  const registrosEmpleado = (
    codigo: string
  ) =>
    visitas.filter(
      (v) =>
        v.empleadoCodigo ===
        codigo
    ).length;

  const datosEmpleados =
    empleados.map(
      (empleado) => ({
        nombre:
          empleado.nombre.split(
            " "
          )[0],

        registros:
          registrosEmpleado(
            empleado.codigo
          ),
      })
    );

  const datosEstados = [
    {
      name:
        "Completadas",
      value:
        completadas,
    },

    {
      name:
        "Activas",
      value:
        activas,
    },

    {
      name:
        "Pendientes",
      value:
        pendientes,
    },

    {
      name:
        "Rechazadas",
      value:
        rechazadas,
    },
  ];

  const colores = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
  ];

  const datosSemana =
    useMemo(() => {
      const dias = [
        {
          nombre:
            "Lun",
          visitas: 0,
        },
        {
          nombre:
            "Mar",
          visitas: 0,
        },
        {
          nombre:
            "Mié",
          visitas: 0,
        },
        {
          nombre:
            "Jue",
          visitas: 0,
        },
        {
          nombre:
            "Vie",
          visitas: 0,
        },
        {
          nombre:
            "Sáb",
          visitas: 0,
        },
        {
          nombre:
            "Dom",
          visitas: 0,
        },
      ];

      visitas.forEach(
        (visita) => {
          if (
            !visita.fecha
          ) {
            return;
          }

          const fecha =
            new Date(
              `${visita.fecha}T00:00:00`
            );

          if (
            Number.isNaN(
              fecha.getTime()
            )
          ) {
            return;
          }

          const dia =
            fecha.getDay();

          const indice =
            dia === 0
              ? 6
              : dia - 1;

          if (
            dias[indice]
          ) {
            dias[
              indice
            ].visitas++;
          }
        }
      );

      return dias;
    }, [visitas]);

  const cambiarEmpleado = (
    codigo: string,
    estado: Empleado["estado"]
  ) => {
    const nuevos =
      empleados.map(
        (empleado) =>
          empleado.codigo ===
          codigo
            ? {
                ...empleado,
                estado,
              }
            : empleado
      );

    setEmpleados(
      nuevos
    );

    localStorage.setItem(
      "empleados",
      JSON.stringify(
        nuevos
      )
    );
  };

  const asignarVisita = (
    visitaCodigo: string
  ) => {
    const codigoEmpleado =
      empleadoAsignacion[
        visitaCodigo
      ];

    if (
      !codigoEmpleado
    ) {
      alert(
        "Selecciona un empleado."
      );

      return;
    }

    const empleado =
      empleados.find(
        (e) =>
          e.codigo ===
          codigoEmpleado
      );

    if (!empleado) {
      return;
    }

    if (
      empleado.estado !==
      "Activo"
    ) {
      alert(
        "Solo puedes asignar visitas a empleados activos."
      );

      return;
    }

    const nuevas =
      visitas.map(
        (visita) =>
          visita.codigo ===
          visitaCodigo
            ? {
                ...visita,

                empleadoCodigo:
                  empleado.codigo,

                empleadoNombre:
                  empleado.nombre,

                estado:
                  "Activo" as EstadoVisita,
              }
            : visita
      );

    guardarVisitas(
      nuevas
    );

    alert(
      `Visita asignada a ${empleado.nombre}`
    );
  };

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

  const cerrarAdmin =
    () => {
      localStorage.removeItem(
        "sesionAdmin"
      );

      navigate("/");
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50">

      <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-violet-700 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col lg:flex-row justify-between gap-4">

          <div className="flex gap-4 items-center">

            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
              👑
            </div>

            <div>

              <p className="text-blue-100 text-xs uppercase tracking-widest">
                Administración
              </p>

              <h1 className="text-2xl font-bold">
                Panel Administrador
              </h1>

            </div>

          </div>

          <div className="flex gap-3 flex-wrap">

            <button
              onClick={() =>
                navigate(
                  "/registro-visita"
                )
              }
              className="bg-emerald-500 px-4 py-3 rounded-xl font-semibold cursor-pointer"
            >
              📝 Registrar Visita
            </button>

            <button
              onClick={
                cerrarAdmin
              }
              className="bg-red-500 px-4 py-3 rounded-xl cursor-pointer"
            >
              🚪 Salir
            </button>

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto p-6">

        <div className="flex flex-wrap gap-3 mb-7">

          <Menu
            activo={
              seccion ===
              "resumen"
            }
            onClick={() =>
              setSeccion(
                "resumen"
              )
            }
          >
            📊 Resumen
          </Menu>

          <Menu
            activo={
              seccion ===
              "empleados"
            }
            onClick={() =>
              setSeccion(
                "empleados"
              )
            }
          >
            👥 Empleados
          </Menu>

          <Menu
            activo={
              seccion ===
              "visitas"
            }
            onClick={() =>
              setSeccion(
                "visitas"
              )
            }
          >
            📋 Todas las Visitas
          </Menu>

          <Menu
            activo={
              seccion ===
              "disponibles"
            }
            onClick={() =>
              setSeccion(
                "disponibles"
              )
            }
          >
            📌 Visitas Disponibles ({disponibles.length})
          </Menu>

        </div>

        {seccion ===
          "resumen" && (
          <>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-7">

              <CardAdmin
                titulo="Visitas"
                valor={
                  visitas.length
                }
                icono="📋"
              />

              <CardAdmin
                titulo="Activas"
                valor={
                  activas
                }
                icono="🔵"
              />

              <CardAdmin
                titulo="Completadas"
                valor={
                  completadas
                }
                icono="✅"
              />

              <CardAdmin
                titulo="Disponibles"
                valor={
                  disponibles.length
                }
                icono="📌"
              />

              <CardAdmin
                titulo="Efectividad"
                valor={`${efectividad}%`}
                icono="📈"
              />

              <CardAdmin
                titulo="Empleados Activos"
                valor={
                  empleadosActivos
                }
                icono="👥"
              />

            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">

              <Grafico
                titulo="Visitas de la Semana"
              >
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <BarChart
                    data={
                      datosSemana
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="nombre"
                    />

                    <YAxis
                      allowDecimals={
                        false
                      }
                    />

                    <Tooltip />

                    <Bar
                      dataKey="visitas"
                      fill="#3b82f6"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              </Grafico>

              <Grafico
                titulo="Estado de Visitas"
              >
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <PieChart>

                    <Pie
                      data={
                        visitas.length ===
                        0
                          ? [
                              {
                                name:
                                  "Sin datos",
                                value:
                                  1,
                              },
                            ]
                          : datosEstados
                      }
                      innerRadius={
                        65
                      }
                      outerRadius={
                        100
                      }
                      dataKey="value"
                    >

                      {visitas.length ===
                      0 ? (

                        <Cell
                          fill="#e2e8f0"
                        />

                      ) : (

                        datosEstados.map(
                          (
                            _,
                            index
                          ) => (
                            <Cell
                              key={
                                index
                              }
                              fill={
                                colores[
                                  index
                                ]
                              }
                            />
                          )
                        )

                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>
                </ResponsiveContainer>
              </Grafico>

            </div>

            <Grafico
              titulo="Registros por Empleado"
            >
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart
                  data={
                    datosEmpleados
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="nombre"
                  />

                  <YAxis
                    allowDecimals={
                      false
                    }
                  />

                  <Tooltip />

                  <Bar
                    dataKey="registros"
                    fill="#8b5cf6"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  />

                </BarChart>
              </ResponsiveContainer>
            </Grafico>

          </>
        )}

        {seccion ===
          "empleados" && (
          <TablaEmpleados
            empleados={
              empleados
            }
            visitas={
              visitas
            }
            cambiarEmpleado={
              cambiarEmpleado
            }
          />
        )}

        {seccion ===
          "visitas" && (
          <TablaVisitas
            visitas={
              visitas
            }
            cambiarEstado={
              cambiarEstado
            }
          />
        )}

        {seccion ===
          "disponibles" && (
          <section className="bg-white rounded-3xl shadow-md overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-2xl font-bold text-slate-800">
                📌 Visitas Disponibles
              </h2>

              <p className="text-slate-400 text-sm">
                Asigna las solicitudes pendientes a un empleado.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

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
                      Consulta
                    </th>

                    <th className="p-5">
                      Estado
                    </th>

                    <th className="p-5">
                      Asignar a
                    </th>

                    <th className="p-5">
                      Acción
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {disponibles.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan={
                          7
                        }
                        className="py-20 text-center text-slate-400"
                      >
                        📭 No hay visitas disponibles
                      </td>

                    </tr>

                  ) : (

                    disponibles.map(
                      (
                        visita
                      ) => (

                        <tr
                          key={
                            visita.codigo
                          }
                          className="border-t hover:bg-violet-50/40"
                        >

                          <td className="p-5 font-bold text-blue-600">
                            {
                              visita.codigo
                            }
                          </td>

                          <td className="p-5">
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
                            {
                              visita.consulta
                            }
                          </td>

                          <td className="p-5">

                            <EstadoAdmin
                              estado={
                                visita.estado
                              }
                            />

                          </td>

                          <td className="p-5">

                            <select
                              value={
                                empleadoAsignacion[
                                  visita.codigo
                                ] ||
                                ""
                              }
                              onChange={(e) =>
                                setEmpleadoAsignacion(
                                  {
                                    ...empleadoAsignacion,

                                    [visita.codigo]:
                                      e.target
                                        .value,
                                  }
                                )
                              }
                              className="border border-slate-200 rounded-xl px-3 py-2"
                            >

                              <option value="">
                                Seleccionar empleado
                              </option>

                              {empleados
                                .filter(
                                  (e) =>
                                    e.estado ===
                                    "Activo"
                                )
                                .map(
                                  (
                                    empleado
                                  ) => (

                                    <option
                                      key={
                                        empleado.codigo
                                      }
                                      value={
                                        empleado.codigo
                                      }
                                    >
                                      {
                                        empleado.nombre
                                      }{" "}
                                      (
                                      {
                                        empleado.codigo
                                      }
                                      )
                                    </option>

                                  )
                                )}

                            </select>

                          </td>

                          <td className="p-5">

                            <button
                              onClick={() =>
                                asignarVisita(
                                  visita.codigo
                                )
                              }
                              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl cursor-pointer"
                            >
                              👤 Asignar
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

function TablaEmpleados({
  empleados,
  visitas,
  cambiarEmpleado,
}: {
  empleados:
    Empleado[];

  visitas:
    Visita[];

  cambiarEmpleado: (
    codigo: string,
    estado:
      Empleado["estado"]
  ) => void;
}) {
  return (
    <section className="bg-white rounded-3xl shadow-md overflow-hidden">

      <div className="p-6 border-b">

        <h2 className="text-2xl font-bold text-slate-800">
          👥 Gestión de Empleados
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[950px]">

          <thead className="bg-slate-50">

            <tr className="text-left text-xs uppercase text-slate-500">

              <th className="p-5">
                Código
              </th>

              <th className="p-5">
                Nombre
              </th>

              <th className="p-5">
                Registros
              </th>

              <th className="p-5">
                Último acceso
              </th>

              <th className="p-5">
                Estado
              </th>

              <th className="p-5">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {empleados.map(
              (empleado) => {

                const registros =
                  visitas.filter(
                    (v) =>
                      v.empleadoCodigo ===
                      empleado.codigo
                  ).length;

                return (
                  <tr
                    key={
                      empleado.codigo
                    }
                    className="border-t"
                  >

                    <td className="p-5 font-bold text-blue-600">
                      {
                        empleado.codigo
                      }
                    </td>

                    <td className="p-5">
                      {
                        empleado.nombre
                      }
                    </td>

                    <td className="p-5">
                      {registros}
                    </td>

                    <td className="p-5">

                      {empleado.ultimoAcceso
                        ? new Date(
                            empleado.ultimoAcceso
                          ).toLocaleString(
                            "es-PE"
                          )
                        : "Nunca"}

                    </td>

                    <td className="p-5">
                      {
                        empleado.estado
                      }
                    </td>

                    <td className="p-5">

                      <div className="flex gap-2 flex-wrap">

                        <button
                          onClick={() =>
                            cambiarEmpleado(
                              empleado.codigo,
                              "Activo"
                            )
                          }
                          className="bg-green-100 text-green-700 px-3 py-2 rounded-lg cursor-pointer"
                        >
                          ✅ Activar
                        </button>

                        <button
                          onClick={() =>
                            cambiarEmpleado(
                              empleado.codigo,
                              "Descanso"
                            )
                          }
                          className="bg-orange-100 text-orange-700 px-3 py-2 rounded-lg cursor-pointer"
                        >
                          💤 Descanso
                        </button>

                        <button
                          onClick={() =>
                            cambiarEmpleado(
                              empleado.codigo,
                              "Despedido"
                            )
                          }
                          className="bg-red-100 text-red-700 px-3 py-2 rounded-lg cursor-pointer"
                        >
                          🚫 Despedir
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

function TablaVisitas({
  visitas,
  cambiarEstado,
}: {
  visitas:
    Visita[];

  cambiarEstado: (
    codigo: string,
    estado:
      EstadoVisita
  ) => void;
}) {
  return (
    <section className="bg-white rounded-3xl shadow-md overflow-hidden">

      <div className="p-6 border-b">

        <h2 className="text-2xl font-bold text-slate-800">
          📋 Todas las Visitas
        </h2>

        <p className="text-slate-400">
          {visitas.length} registros
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1100px]">

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
                Empleado
              </th>

              <th className="p-5">
                Estado
              </th>

              <th className="p-5">
                Fecha
              </th>

              <th className="p-5">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {visitas.map(
              (visita) => (

                <tr
                  key={
                    visita.codigo
                  }
                  className="border-t"
                >

                  <td className="p-5 font-bold text-blue-600">
                    {
                      visita.codigo
                    }
                  </td>

                  <td className="p-5">
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

                    {visita.empleadoNombre ||
                      "Sin asignar"}

                  </td>

                  <td className="p-5">

                    <EstadoAdmin
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

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          cambiarEstado(
                            visita.codigo,
                            "Pendiente"
                          )
                        }
                        className="bg-orange-100 px-2 py-2 rounded-lg cursor-pointer"
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
                        className="bg-blue-100 px-2 py-2 rounded-lg cursor-pointer"
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
                        className="bg-green-100 px-2 py-2 rounded-lg cursor-pointer"
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
                        className="bg-red-100 px-2 py-2 rounded-lg cursor-pointer"
                      >
                        🚫
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

function CardAdmin({
  titulo,
  valor,
  icono,
}: {
  titulo: string;
  valor:
    string | number;
  icono: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">

      <p className="text-slate-400 text-xs">
        {titulo}
      </p>

      <div className="flex justify-between items-center mt-2">

        <p className="text-2xl font-bold">
          {valor}
        </p>

        <span className="text-xl">
          {icono}
        </span>

      </div>

    </div>
  );
}

function Grafico({
  titulo,
  children,
}: {
  titulo: string;
  children:
    ReactNode;
}) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-md">

      <h3 className="text-xl font-bold mb-5">
        {titulo}
      </h3>

      {children}

    </section>
  );
}

function Menu({
  activo,
  onClick,
  children,
}: {
  activo:
    boolean;

  onClick:
    () => void;

  children:
    ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-xl font-semibold cursor-pointer ${
        activo
          ? "bg-blue-600 text-white"
          : "bg-white border border-slate-200 text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

function EstadoAdmin({
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

export default Administrador;
import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import { useNavigate } from "react-router-dom";
  
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
  } from "recharts";
  
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
    consulta: string;
    prioridad:
      | "Alta"
      | "Media"
      | "Baja";
    estado:
      | "Completada"
      | "En Proceso"
      | "Pendiente";
    fecha: string;
    empleadoCodigo?: string;
    empleadoNombre?: string;
  };
  
  function Administrador() {
    const navigate = useNavigate();
  
    const [empleados, setEmpleados] =
      useState<Empleado[]>([]);
  
    const [visitas, setVisitas] =
      useState<Visita[]>([]);
  
    const [seccion, setSeccion] =
      useState<"resumen" | "empleados" | "visitas">(
        "resumen"
      );
  
    useEffect(() => {
      const empleadosGuardados =
        localStorage.getItem("empleados");
  
      if (empleadosGuardados) {
        setEmpleados(
          JSON.parse(empleadosGuardados)
        );
      }
  
      const visitasGuardadas =
        localStorage.getItem("visitas");
  
      if (visitasGuardadas) {
        setVisitas(
          JSON.parse(visitasGuardadas)
        );
      }
    }, []);
  
    const completadas = visitas.filter(
      (v) => v.estado === "Completada"
    ).length;
  
    const proceso = visitas.filter(
      (v) => v.estado === "En Proceso"
    ).length;
  
    const pendientes = visitas.filter(
      (v) => v.estado === "Pendiente"
    ).length;
  
    const activos = empleados.filter(
      (e) => e.estado === "Activo"
    ).length;
  
    const cambiarEstadoEmpleado = (
      codigo: string,
      estado: Empleado["estado"]
    ) => {
      const actualizados =
        empleados.map((empleado) =>
          empleado.codigo === codigo
            ? {
                ...empleado,
                estado,
              }
            : empleado
        );
  
      setEmpleados(actualizados);
  
      localStorage.setItem(
        "empleados",
        JSON.stringify(actualizados)
      );
    };
  
    const registrosEmpleado = (
      codigo: string
    ) => {
      return visitas.filter(
        (visita) =>
          visita.empleadoCodigo === codigo
      ).length;
    };
  
    const datosEmpleados = empleados.map(
      (empleado) => ({
        nombre:
          empleado.nombre.split(" ")[0],
        registros:
          registrosEmpleado(
            empleado.codigo
          ),
      })
    );
  
    const datosEstados = [
      {
        name: "Completadas",
        value: completadas,
      },
      {
        name: "En Proceso",
        value: proceso,
      },
      {
        name: "Pendientes",
        value: pendientes,
      },
    ];
  
    const colores = [
      "#22c55e",
      "#3b82f6",
      "#f59e0b",
    ];
  
    const visitasSemana =
      useMemo(() => {
        const dias = [
          {
            nombre: "Lun",
            visitas: 0,
          },
          {
            nombre: "Mar",
            visitas: 0,
          },
          {
            nombre: "Mié",
            visitas: 0,
          },
          {
            nombre: "Jue",
            visitas: 0,
          },
          {
            nombre: "Vie",
            visitas: 0,
          },
          {
            nombre: "Sáb",
            visitas: 0,
          },
          {
            nombre: "Dom",
            visitas: 0,
          },
        ];
  
        visitas.forEach(
          (visita) => {
            const fecha =
              new Date(
                `${visita.fecha}T00:00:00`
              );
  
            const dia =
              fecha.getDay();
  
            const indice =
              dia === 0
                ? 6
                : dia - 1;
  
            dias[indice].visitas++;
          }
        );
  
        return dias;
      }, [visitas]);
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-violet-50">
  
        {/* HEADER */}
        <header className="bg-gradient-to-r from-[#1e3a8a] via-blue-700 to-violet-700 text-white shadow-lg">
  
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col lg:flex-row justify-between gap-4">
  
            <div className="flex gap-4 items-center">
  
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
                👑
              </div>
  
              <div>
                <p className="text-blue-100 text-xs tracking-widest uppercase">
                  Administración
                </p>
  
                <h1 className="text-2xl font-bold">
                  Panel Administrador
                </h1>
              </div>
  
            </div>
  
            <div className="flex gap-3">
  
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
                onClick={() =>
                  navigate("/")
                }
                className="bg-red-500 px-4 py-3 rounded-xl cursor-pointer"
              >
                Salir
              </button>
  
            </div>
  
          </div>
  
        </header>
  
        <main className="max-w-7xl mx-auto p-6">
  
          {/* MENU */}
          <div className="flex flex-wrap gap-3 mb-7">
  
            <MenuButton
              activo={
                seccion === "resumen"
              }
              onClick={() =>
                setSeccion("resumen")
              }
            >
              📊 Resumen
            </MenuButton>
  
            <MenuButton
              activo={
                seccion === "empleados"
              }
              onClick={() =>
                setSeccion("empleados")
              }
            >
              👥 Empleados
            </MenuButton>
  
            <MenuButton
              activo={
                seccion === "visitas"
              }
              onClick={() =>
                setSeccion("visitas")
              }
            >
              📋 Visitas
            </MenuButton>
  
          </div>
  
          {seccion === "resumen" && (
            <>
  
              {/* CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-7">
  
                <Card
                  titulo="Visitas"
                  valor={
                    visitas.length
                  }
                  icono="📋"
                />
  
                <Card
                  titulo="Completadas"
                  valor={
                    completadas
                  }
                  icono="✅"
                />
  
                <Card
                  titulo="En Proceso"
                  valor={
                    proceso
                  }
                  icono="⏳"
                />
  
                <Card
                  titulo="Empleados"
                  valor={
                    empleados.length
                  }
                  icono="👥"
                />
  
                <Card
                  titulo="Activos"
                  valor={
                    activos
                  }
                  icono="🟢"
                />
  
              </div>
  
              {/* GRAFICOS */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
  
                <GraficoCard
                  titulo="Visitas por Semana"
                >
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <BarChart
                      data={
                        visitasSemana
                      }
                    >
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
                </GraficoCard>
  
                <GraficoCard
                  titulo="Estado de las Visitas"
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
                </GraficoCard>
  
              </div>
  
              {/* EMPLEADOS REGISTROS */}
              <GraficoCard
                titulo="Registros realizados por empleado"
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
              </GraficoCard>
  
            </>
          )}
  
          {seccion ===
            "empleados" && (
            <section className="bg-white rounded-3xl shadow-md overflow-hidden">
  
              <div className="p-6 border-b">
  
                <p className="text-blue-500 text-xs tracking-widest uppercase">
                  Personal
                </p>
  
                <h2 className="text-2xl font-bold text-slate-800">
                  Gestión de Empleados
                </h2>
  
              </div>
  
              <div className="overflow-x-auto">
  
                <table className="w-full min-w-[900px]">
  
                  <thead className="bg-slate-50">
  
                    <tr className="text-left text-slate-500 text-xs uppercase">
                      <th className="p-5">
                        Código
                      </th>
                      <th className="p-5">
                        Empleado
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
                      (empleado) => (
  
                        <tr
                          key={
                            empleado.codigo
                          }
                          className="border-t hover:bg-blue-50/40"
                        >
  
                          <td className="p-5 font-bold text-blue-600">
                            {
                              empleado.codigo
                            }
                          </td>
  
                          <td className="p-5 font-semibold text-slate-700">
                            {
                              empleado.nombre
                            }
                          </td>
  
                          <td className="p-5">
                            {
                              registrosEmpleado(
                                empleado.codigo
                              )
                            }
                          </td>
  
                          <td className="p-5 text-slate-500">
  
                            {empleado.ultimoAcceso
                              ? new Date(
                                  empleado.ultimoAcceso
                                ).toLocaleString(
                                  "es-PE"
                                )
                              : "Nunca"}
  
                          </td>
  
                          <td className="p-5">
  
                            <EstadoEmpleado
                              estado={
                                empleado.estado
                              }
                            />
  
                          </td>
  
                          <td className="p-5">
  
                            <div className="flex flex-wrap gap-2">
  
                              <button
                                onClick={() =>
                                  cambiarEstadoEmpleado(
                                    empleado.codigo,
                                    "Activo"
                                  )
                                }
                                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg cursor-pointer"
                              >
                                ✓ Activar
                              </button>
  
                              <button
                                onClick={() =>
                                  cambiarEstadoEmpleado(
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
                                  cambiarEstadoEmpleado(
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
  
                      )
                    )}
  
                  </tbody>
  
                </table>
  
              </div>
  
            </section>
          )}
  
          {seccion === "visitas" && (
            <section className="bg-white rounded-3xl shadow-md overflow-hidden">
  
              <div className="p-6 border-b">
  
                <h2 className="text-2xl font-bold text-slate-800">
                  📋 Todas las Visitas
                </h2>
  
                <p className="text-slate-400 text-sm">
                  {visitas.length} registros
                </p>
  
              </div>
  
              <div className="overflow-x-auto">
  
                <table className="w-full min-w-[950px]">
  
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs text-slate-500 uppercase">
  
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
  
                    </tr>
                  </thead>
  
                  <tbody>
  
                    {visitas.length ===
                    0 ? (
  
                      <tr>
                        <td
                          colSpan={
                            6
                          }
                          className="py-20 text-center text-slate-400"
                        >
                          No existen registros todavía.
                        </td>
                      </tr>
  
                    ) : (
  
                      visitas.map(
                        (visita) => (
  
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
                              {
                                visita.estado
                              }
                            </td>
  
                            <td className="p-5">
                              {
                                visita.fecha
                              }
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
  
  function Card({
    titulo,
    valor,
    icono,
  }: {
    titulo: string;
    valor: number;
    icono: string;
  }) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
  
        <div className="flex justify-between">
  
          <div>
            <p className="text-slate-400 text-xs">
              {titulo}
            </p>
  
            <p className="text-2xl font-bold text-slate-800 mt-2">
              {valor}
            </p>
          </div>
  
          <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
            {icono}
          </div>
  
        </div>
  
      </div>
    );
  }
  
  function GraficoCard({
    titulo,
    children,
  }: {
    titulo: string;
    children: React.ReactNode;
  }) {
    return (
      <section className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
  
        <h3 className="text-xl font-bold text-slate-800 mb-5">
          {titulo}
        </h3>
  
        {children}
  
      </section>
    );
  }
  
  function MenuButton({
    activo,
    onClick,
    children,
  }: {
    activo: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        className={`px-5 py-3 rounded-xl font-semibold cursor-pointer transition ${
          activo
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50"
        }`}
      >
        {children}
      </button>
    );
  }
  
  function EstadoEmpleado({
    estado,
  }: {
    estado: Empleado["estado"];
  }) {
    const estilos = {
      Activo:
        "bg-green-100 text-green-700",
      Descanso:
        "bg-orange-100 text-orange-700",
      Despedido:
        "bg-red-100 text-red-700",
    };
  
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${estilos[estado]}`}
      >
        {estado}
      </span>
    );
  }
  
  export default Administrador;
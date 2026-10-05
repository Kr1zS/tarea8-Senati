import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

function Inicio() {
  const navigate = useNavigate();

  // Detecta automáticamente el dominio actual.
  // En InfinityFree quedará, por ejemplo:
  // https://tusitio.infinityfreeapp.com/registro-visita
  const urlRegistro =
    `${window.location.origin}/registro-visita`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-violet-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl">

        <div className="text-center mb-10">

          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg mb-5">
            🏢
          </div>

          <p className="text-blue-500 text-xs uppercase tracking-[0.35em] font-semibold">
            SENATI
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mt-3">
            Sistema de Visitas
          </h1>

          <p className="text-slate-500 mt-3">
            Registro y Gestión de Visitas
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-7">

          {/* QR */}

          <section className="bg-white rounded-[32px] shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
              📱
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              Registrar una Visita
            </h2>

            <p className="text-slate-500 text-center mt-2 max-w-sm">
              Escanea el código QR con tu celular para abrir directamente el formulario de registro.
            </p>

            <div className="bg-white p-6 rounded-3xl border-4 border-blue-100 shadow-lg mt-7">

              <QRCode
                value={urlRegistro}
                size={230}
                bgColor="#FFFFFF"
                fgColor="#111827"
                level="H"
              />

            </div>

            <div className="mt-5 text-center">

              <p className="text-sm text-slate-400">
                Destino del QR:
              </p>

              <p className="text-blue-600 text-sm font-semibold break-all mt-1">
                {urlRegistro}
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/registro-visita")
              }
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white py-4 rounded-2xl font-bold cursor-pointer transition"
            >
              📝 Registrar Visita
            </button>

          </section>

          {/* ACCESOS */}

          <section className="bg-white rounded-[32px] shadow-xl border border-slate-100 p-8">

            <div className="mb-7">

              <p className="text-violet-500 text-xs uppercase tracking-[0.25em]">
                Acceso interno
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                Panel del Sistema
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                Selecciona el tipo de acceso.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/acceso/empleado")
              }
              className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl p-5 mb-4 flex items-center gap-4 text-left cursor-pointer transition"
            >

              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                👤
              </div>

              <div className="flex-1">

                <p className="text-lg font-bold text-slate-800">
                  Empleado
                </p>

                <p className="text-sm text-slate-500">
                  Atender y responder visitas
                </p>

              </div>

              <span className="text-blue-600 text-xl">
                →
              </span>

            </button>

            <button
              onClick={() =>
                navigate("/acceso/administrador")
              }
              className="w-full bg-violet-50 hover:bg-violet-100 border border-violet-100 rounded-2xl p-5 flex items-center gap-4 text-left cursor-pointer transition"
            >

              <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                👑
              </div>

              <div className="flex-1">

                <p className="text-lg font-bold text-slate-800">
                  Administrador
                </p>

                <p className="text-sm text-slate-500">
                  Gestión general del sistema
                </p>

              </div>

              <span className="text-violet-600 text-xl">
                →
              </span>

            </button>

            <div className="mt-7 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">

              <p className="text-emerald-700 font-semibold text-sm">
                ✅ Flujo de visitantes
              </p>

              <p className="text-emerald-600/70 text-xs mt-2">
                El visitante escanea el QR, completa el formulario y su solicitud queda disponible para atención.
              </p>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}

export default Inicio;
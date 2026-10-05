import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef2ff] to-[#ede9fe] flex items-center justify-center px-4">

      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-blue-300/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] bg-violet-300/30 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-[410px] bg-white/80 backdrop-blur-xl border border-white rounded-[32px] px-8 py-9 shadow-[0_25px_70px_rgba(30,64,175,0.18)] text-center">

        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center text-4xl mb-5 shadow-lg">
          +
        </div>

        <h1 className="text-slate-800 text-3xl font-bold">
          Sistema de Visitas
        </h1>

        <p className="text-slate-500 text-sm mt-2 mb-8">
          Registro y Gestión de Visitas
        </p>

        <div className="mx-auto bg-white w-fit p-4 rounded-[24px] shadow-xl border border-slate-100">
          <QRCode
            value="REGISTRO-VISITA"
            size={200}
            bgColor="#ffffff"
            fgColor="#1e3a8a"
          />
        </div>

        <p className="text-slate-700 text-sm font-semibold mt-6">
          📱 Escanea para registrar tu visita
        </p>

        <p className="text-slate-400 text-xs mt-1">
          Acceso rápido al sistema
        </p>

        <div className="h-px bg-slate-200 my-7"></div>

        <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-4">
          Selecciona tu acceso
        </p>

        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={() =>
              navigate("/acceso/administrador")
            }
            className="group bg-blue-50 hover:bg-blue-600 border border-blue-100 rounded-2xl px-4 py-4 transition-all cursor-pointer"
          >
            <div className="text-2xl mb-1">
              👑
            </div>

            <span className="text-blue-700 group-hover:text-white font-semibold text-sm">
              Administrador
            </span>
          </button>

          <button
            onClick={() =>
              navigate("/acceso/empleado")
            }
            className="group bg-violet-50 hover:bg-violet-600 border border-violet-100 rounded-2xl px-4 py-4 transition-all cursor-pointer"
          >
            <div className="text-2xl mb-1">
              👤
            </div>

            <span className="text-violet-700 group-hover:text-white font-semibold text-sm">
              Empleado
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}

export default Inicio;
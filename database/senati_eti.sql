-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-10-2026 a las 15:48:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `senati_eti`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asuntos`
--

DROP TABLE IF EXISTS `asuntos`;
CREATE TABLE `asuntos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asuntos`
--

INSERT INTO `asuntos` (`id`, `nombre`) VALUES
(1, 'Matrícula'),
(2, 'Pagos/Tutoría/Otros');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

DROP TABLE IF EXISTS `configuracion`;
CREATE TABLE `configuracion` (
  `clave` varchar(50) NOT NULL,
  `valor` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`clave`, `valor`) VALUES
('tiempo_limite_espera', '15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

DROP TABLE IF EXISTS `empleados`;
CREATE TABLE `empleados` (
  `id` int(11) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('empleado','admin') DEFAULT 'empleado',
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id`, `codigo`, `nombre`, `password_hash`, `rol`, `activo`) VALUES
(1, 'ADM001', 'Administrador', 'CAMBIAR_HASH', 'admin', 1),
(2, 'EMP001', 'Carlos Rodríguez López', 'CAMBIAR_HASH', 'empleado', 1),
(3, 'EMP002', 'María Torres', 'CAMBIAR_HASH', 'empleado', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitas`
--

DROP TABLE IF EXISTS `visitas`;
CREATE TABLE `visitas` (
  `id` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `visitante_nombre` varchar(100) NOT NULL,
  `visitante_dni` varchar(15) DEFAULT NULL,
  `asunto_id` int(11) NOT NULL,
  `consulta` text NOT NULL,
  `respuesta` text DEFAULT NULL,
  `prioridad` enum('baja','media','alta') DEFAULT 'media',
  `estado` enum('pendiente','en_proceso','completada','no_resuelta','abandonada') DEFAULT 'pendiente',
  `empleado_id` int(11) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL,
  `fecha_asignacion` datetime DEFAULT NULL,
  `fecha_cierre` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `visitas`
--

INSERT INTO `visitas` (`id`, `codigo`, `visitante_nombre`, `visitante_dni`, `asunto_id`, `consulta`, `respuesta`, `prioridad`, `estado`, `empleado_id`, `fecha_registro`, `fecha_asignacion`, `fecha_cierre`) VALUES
(1, 'V-20261005-001', 'Juan Pérez', '70123456', 1, 'Consulta de matrícula', NULL, 'media', 'completada', 2, '2026-10-05 08:10:00', '2026-10-05 08:15:00', '2026-10-05 08:30:00'),
(2, 'V-20261005-002', 'Ana Díaz', '70234567', 2, 'Pago de cuota', NULL, 'alta', 'en_proceso', 3, '2026-10-05 09:00:00', '2026-10-05 09:05:00', NULL),
(3, 'V-20261005-003', 'Luis Rojas', '70345678', 1, 'Cambio de turno', NULL, 'baja', 'pendiente', NULL, '2026-10-05 09:30:00', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asuntos`
--
ALTER TABLE `asuntos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`clave`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `asunto_id` (`asunto_id`),
  ADD KEY `empleado_id` (`empleado_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asuntos`
--
ALTER TABLE `asuntos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `visitas`
--
ALTER TABLE `visitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD CONSTRAINT `visitas_ibfk_1` FOREIGN KEY (`asunto_id`) REFERENCES `asuntos` (`id`),
  ADD CONSTRAINT `visitas_ibfk_2` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-10-2025 a las 07:58:57
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
-- Base de datos: `pixtronic`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
  `id_direccion` bigint(20) NOT NULL,
  `codPostal` tinytext DEFAULT NULL,
  `colonia` tinytext DEFAULT NULL,
  `calle` tinytext DEFAULT NULL,
  `num_ext` tinyint(3) UNSIGNED DEFAULT NULL,
  `facturacion` tinyint(1) DEFAULT NULL,
  `fk_municipio` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccionusuario`
--

CREATE TABLE `direccionusuario` (
  `id_dir_usuario` bigint(20) NOT NULL,
  `fk_user` int(11) DEFAULT NULL,
  `fk_direccion` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipio`
--

CREATE TABLE `municipio` (
  `id_municipio` smallint(6) NOT NULL,
  `nombre` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` bigint(20) NOT NULL,
  `fk_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `nombre` tinytext DEFAULT NULL,
  `marca` tinytext DEFAULT NULL,
  `tipo` tinytext DEFAULT NULL,
  `precio` mediumint(9) DEFAULT 0,
  `vigente` tinyint(1) DEFAULT 1,
  `cantidad` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `marca`, `tipo`, `precio`, `vigente`, `cantidad`) VALUES
(1, 'RAM de Prueba', 'Corsair de Prueba', 'DDR4 de Prueba', 3000, 1, 127),
(2, 'RAM de Prueba 2', 'Adata de Prueba 2', 'DDR5 de Prueba', 2000, 1, 127),
(3, 'CPU de Prueba', 'Intel de Prueba', '11va Gen de Prueba', 4000, 1, 127),
(4, 'CPU de Prueba2', 'AMD de Prueba', 'Ryzen 3 de Prueba', 4000, 1, 127);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productopedido`
--

CREATE TABLE `productopedido` (
  `id_productoPedido` bigint(20) NOT NULL,
  `cant_prod` tinyint(4) DEFAULT NULL,
  `fk_producto` int(11) DEFAULT NULL,
  `fk_pedido` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_user` int(11) NOT NULL,
  `username` tinytext DEFAULT NULL,
  `lastname` tinytext DEFAULT NULL,
  `password` tinytext DEFAULT NULL,
  `llave_publica` text NOT NULL,
  `llave_privada_encriptada` text NOT NULL,
  `password_encriptada` text NOT NULL,
  `llave_aes_encriptada` text NOT NULL,
  `email` tinytext DEFAULT NULL,
  `birth_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_user`, `username`, `lastname`, `password`, `llave_publica`, `llave_privada_encriptada`, `password_encriptada`, `llave_aes_encriptada`, `email`, `birth_date`) VALUES
(1, 'Ian', 'Alvarez', 'pixtronic2025', '', '', '', '0', 'a22100206@ceti.mx', '2025-10-22'),
(2, 'juan', 'assad', NULL, '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', 'a22100178@ceti.mx', '2025-10-01'),
(3, 'Mequiero', 'Matar', NULL, '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', 'yamatenme@matenme.com', '2025-10-16');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `fk_municipio` (`fk_municipio`);

--
-- Indices de la tabla `direccionusuario`
--
ALTER TABLE `direccionusuario`
  ADD PRIMARY KEY (`id_dir_usuario`),
  ADD KEY `fk_user` (`fk_user`),
  ADD KEY `fk_direccion` (`fk_direccion`);

--
-- Indices de la tabla `municipio`
--
ALTER TABLE `municipio`
  ADD PRIMARY KEY (`id_municipio`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `fk_user` (`fk_user`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `productopedido`
--
ALTER TABLE `productopedido`
  ADD PRIMARY KEY (`id_productoPedido`),
  ADD KEY `fk_producto` (`fk_producto`),
  ADD KEY `fk_pedido` (`fk_pedido`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id_direccion` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `direccionusuario`
--
ALTER TABLE `direccionusuario`
  MODIFY `id_dir_usuario` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `municipio`
--
ALTER TABLE `municipio`
  MODIFY `id_municipio` smallint(6) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productopedido`
--
ALTER TABLE `productopedido`
  MODIFY `id_productoPedido` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`fk_municipio`) REFERENCES `municipio` (`id_municipio`);

--
-- Filtros para la tabla `direccionusuario`
--
ALTER TABLE `direccionusuario`
  ADD CONSTRAINT `direccionusuario_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `usuario` (`id_user`),
  ADD CONSTRAINT `direccionusuario_ibfk_2` FOREIGN KEY (`fk_direccion`) REFERENCES `direccion` (`id_direccion`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `usuario` (`id_user`);

--
-- Filtros para la tabla `productopedido`
--
ALTER TABLE `productopedido`
  ADD CONSTRAINT `productopedido_ibfk_1` FOREIGN KEY (`fk_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `productopedido_ibfk_2` FOREIGN KEY (`fk_pedido`) REFERENCES `pedido` (`id_pedido`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

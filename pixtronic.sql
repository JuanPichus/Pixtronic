-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2025 at 02:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pixtronic`
--

-- --------------------------------------------------------

--
-- Table structure for table `direccion`
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
-- Table structure for table `direccionusuario`
--

CREATE TABLE `direccionusuario` (
  `id_dir_usuario` bigint(20) NOT NULL,
  `fk_user` int(11) DEFAULT NULL,
  `fk_direccion` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `municipio`
--

CREATE TABLE `municipio` (
  `id_municipio` smallint(6) NOT NULL,
  `nombre` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` bigint(20) NOT NULL,
  `fk_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `producto`
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
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `marca`, `tipo`, `precio`, `vigente`, `cantidad`) VALUES
(1, 'Prueba', 'Prueba', 'Prueba', 3000, 1, 127),
(2, 'Prueba2', 'Prueba2', 'Prueba2', 2000, 1, 127),
(3, 'Prueba3', 'Prueba', 'Prueba3', 4000, 1, 127),
(4, 'Prueba4', 'Prueba', 'Prueba4', 4000, 1, 127);

-- --------------------------------------------------------

--
-- Table structure for table `productopedido`
--

CREATE TABLE `productopedido` (
  `id_productoPedido` bigint(20) NOT NULL,
  `cant_prod` tinyint(4) DEFAULT NULL,
  `fk_producto` int(11) DEFAULT NULL,
  `fk_pedido` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_user` int(11) NOT NULL,
  `username` tinytext DEFAULT NULL,
  `lastname` tinytext DEFAULT NULL,
  `password` tinytext DEFAULT NULL,
  `email` tinytext DEFAULT NULL,
  `birth_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `fk_municipio` (`fk_municipio`);

--
-- Indexes for table `direccionusuario`
--
ALTER TABLE `direccionusuario`
  ADD PRIMARY KEY (`id_dir_usuario`),
  ADD KEY `fk_user` (`fk_user`),
  ADD KEY `fk_direccion` (`fk_direccion`);

--
-- Indexes for table `municipio`
--
ALTER TABLE `municipio`
  ADD PRIMARY KEY (`id_municipio`);

--
-- Indexes for table `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `fk_user` (`fk_user`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indexes for table `productopedido`
--
ALTER TABLE `productopedido`
  ADD PRIMARY KEY (`id_productoPedido`),
  ADD KEY `fk_producto` (`fk_producto`),
  ADD KEY `fk_pedido` (`fk_pedido`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id_direccion` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `direccionusuario`
--
ALTER TABLE `direccionusuario`
  MODIFY `id_dir_usuario` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `municipio`
--
ALTER TABLE `municipio`
  MODIFY `id_municipio` smallint(6) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `productopedido`
--
ALTER TABLE `productopedido`
  MODIFY `id_productoPedido` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `direccion`
--
ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`fk_municipio`) REFERENCES `municipio` (`id_municipio`);

--
-- Constraints for table `direccionusuario`
--
ALTER TABLE `direccionusuario`
  ADD CONSTRAINT `direccionusuario_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `usuario` (`id_user`),
  ADD CONSTRAINT `direccionusuario_ibfk_2` FOREIGN KEY (`fk_direccion`) REFERENCES `direccion` (`id_direccion`);

--
-- Constraints for table `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `usuario` (`id_user`);

--
-- Constraints for table `productopedido`
--
ALTER TABLE `productopedido`
  ADD CONSTRAINT `productopedido_ibfk_1` FOREIGN KEY (`fk_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `productopedido_ibfk_2` FOREIGN KEY (`fk_pedido`) REFERENCES `pedido` (`id_pedido`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

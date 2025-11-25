-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 08:29 AM
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
(5, 'Core i5-13600K', 'Intel', 'CPU', 32000, 1, 15),
(6, 'Core i7-13700K', 'Intel', 'CPU', 45000, 1, 8),
(7, 'Core i9-13900K', 'Intel', 'CPU', 68000, 1, 5),
(8, 'Ryzen 5 7600X', 'AMD', 'CPU', 28000, 1, 12),
(9, 'Ryzen 7 7700X', 'AMD', 'CPU', 38000, 1, 10),
(10, 'Ryzen 9 7900X', 'AMD', 'CPU', 52000, 1, 6),
(11, 'Core i3-12100F', 'Intel', 'CPU', 15000, 1, 20),
(12, 'Ryzen 5 5600X', 'AMD', 'CPU', 22000, 1, 18),
(13, 'RTX 4060 Ti 8GB', 'NVIDIA', 'GPU', 52000, 1, 7),
(14, 'RTX 4070 12GB', 'NVIDIA', 'GPU', 75000, 1, 5),
(15, 'RTX 4080 16GB', 'NVIDIA', 'GPU', 125000, 1, 3),
(16, 'RTX 4090 24GB', 'NVIDIA', 'GPU', 185000, 1, 2),
(17, 'RX 7600 8GB', 'AMD', 'GPU', 38000, 1, 8),
(18, 'RX 7700 XT 12GB', 'AMD', 'GPU', 58000, 1, 6),
(19, 'RX 7800 XT 16GB', 'AMD', 'GPU', 82000, 1, 4),
(20, 'RX 7900 XTX 24GB', 'AMD', 'GPU', 135000, 1, 3),
(21, 'Arc A750 8GB', 'Intel', 'GPU', 29000, 1, 10),
(22, 'Vengeance LPX 16GB DDR4 3200MHz', 'Corsair', 'RAM', 12000, 1, 25),
(23, 'Vengeance RGB 32GB DDR4 3600MHz', 'Corsair', 'RAM', 18000, 1, 18),
(24, 'Dominator Platinum 64GB DDR5 5600MHz', 'Corsair', 'RAM', 45000, 1, 8),
(25, 'Trident Z5 32GB DDR5 6000MHz', 'G.Skill', 'RAM', 22000, 1, 15),
(26, 'Ripjaws V 16GB DDR4 3200MHz', 'G.Skill', 'RAM', 11000, 1, 22),
(27, 'Ballistix 16GB DDR4 3200MHz', 'Crucial', 'RAM', 10000, 1, 30),
(28, 'HyperX Fury 32GB DDR4 3200MHz', 'Kingston', 'RAM', 15000, 1, 20);

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
  `password_plain` varchar(255) DEFAULT NULL,
  `email` tinytext DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `admin` tinyint(1) DEFAULT 0,
  `local_direction` tinytext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_user`, `username`, `lastname`, `password`, `password_plain`, `email`, `birth_date`, `admin`, `local_direction`) VALUES
(2, 'Juan Pablo', 'Rivera Assad', '29bd54d8d1e9bec6aaaaf7f987478bf8ce693b2b', 'contra123', 'a22100178@ceti.mx', '2025-11-12', 1, '{\"direccion_completa\":\"Este es mi domicilio 123\",\"fecha_registro\":\"2025-11-13T02:04:04.450Z\"}');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `productopedido`
--
ALTER TABLE `productopedido`
  MODIFY `id_productoPedido` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

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

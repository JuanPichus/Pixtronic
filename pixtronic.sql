-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2025 at 03:12 AM
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
(2, 'Juan Pablo', 'Rivera Assad', '29bd54d8d1e9bec6aaaaf7f987478bf8ce693b2b', 'contra123', 'a22100178@ceti.mx', '2025-11-12', 0, '{\"direccion_completa\":\"Este es mi domicilio 123\",\"fecha_registro\":\"2025-11-13T02:04:04.450Z\"}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

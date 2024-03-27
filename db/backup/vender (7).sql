-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2023 at 09:21 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vender`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking_details`
--

CREATE TABLE `booking_details` (
  `id` int(11) NOT NULL,
  `locationId` int(11) NOT NULL,
  `employeeId` int(11) NOT NULL,
  `serviceTypeId` int(11) NOT NULL,
  `bookingDate` date NOT NULL,
  `bookingStartTime` time NOT NULL,
  `bookingEndTime` time NOT NULL,
  `bookingStatus` int(11) NOT NULL DEFAULT 0 COMMENT '0:pending 1:success 3:reject',
  `promocode` varchar(25) DEFAULT NULL,
  `paymentStatus` int(11) NOT NULL DEFAULT 0 COMMENT '0:pending 1:success 3:fails',
  `tax` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_details`
--

INSERT INTO `booking_details` (`id`, `locationId`, `employeeId`, `serviceTypeId`, `bookingDate`, `bookingStartTime`, `bookingEndTime`, `bookingStatus`, `promocode`, `paymentStatus`, `tax`, `created_at`, `updated_at`) VALUES
(2, 1, 1, 1, '2023-04-08', '11:00:00', '12:00:00', 0, '245454', 0, 12, '2023-04-12 00:33:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_location`
--

CREATE TABLE `booking_location` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `lattitude` varchar(250) NOT NULL,
  `longitude` varchar(250) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_location`
--

INSERT INTO `booking_location` (`id`, `userId`, `lattitude`, `longitude`, `created_at`, `updated_at`) VALUES
(1, 1, '26.8467', '80.9462', '2023-04-11 18:42:34', '2023-04-12 00:12:34');

-- --------------------------------------------------------

--
-- Table structure for table `canclled`
--

CREATE TABLE `canclled` (
  `id` int(11) NOT NULL,
  `bookingId` int(11) NOT NULL,
  `serviceTypeId` int(11) NOT NULL,
  `oldBookingDate` date NOT NULL,
  `oldBookingStartTime` time NOT NULL,
  `oldBookingEndTime` time NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `canclled`
--

INSERT INTO `canclled` (`id`, `bookingId`, `serviceTypeId`, `oldBookingDate`, `oldBookingStartTime`, `oldBookingEndTime`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2023-04-08', '12:00:00', '12:00:00', '2023-04-12 00:47:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employ`
--

CREATE TABLE `employ` (
  `id` int(11) NOT NULL,
  `employName` varchar(50) NOT NULL,
  `employNo` varchar(50) DEFAULT NULL,
  `registerId` int(11) NOT NULL,
  `password` varchar(250) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `pPassword` varchar(20) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0:deactive,1:active',
  `created_by` varchar(250) NOT NULL,
  `updated_by` varchar(250) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employ`
--

INSERT INTO `employ` (`id`, `employName`, `employNo`, `registerId`, `password`, `mobile`, `pPassword`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'test2', 'EMP-1', 2, '$2a$10$3j2j', '8114075448', '123456', 0, 'vender', NULL, '2023-04-06 17:39:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `imageName` varchar(250) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `imageName`, `created_at`, `updated_at`) VALUES
(1, 'image-1680625839597.png', '2023-04-04 16:30:39', '0000-00-00 00:00:00'),
(2, 'image-1680625857698.png', '2023-04-04 16:30:57', '0000-00-00 00:00:00'),
(3, 'image-1680626796780.png', '2023-04-04 16:46:36', '0000-00-00 00:00:00'),
(4, 'image-1680806808058.png', '2023-04-06 18:46:48', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `markers`
--

CREATE TABLE `markers` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `address` varchar(80) NOT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `markers`
--

INSERT INTO `markers` (`id`, `name`, `address`, `lat`, `lng`) VALUES
(1, 'Frankie Johnnie & Luigo Too', '939 W El Camino Real, Mountain View, CA', 37.386337, -122.085823),
(2, 'Amici\'s East Coast Pizzeria', '790 Castro St, Mountain View, CA', 37.387138, -122.083237),
(3, 'Kapp\'s Pizza Bar & Grill', '191 Castro St, Mountain View, CA', 37.393887, -122.078918),
(4, 'Round Table Pizza: Mountain View', '570 N Shoreline Blvd, Mountain View, CA', 37.402653, -122.079353),
(5, 'Tony & Alba\'s Pizza & Pasta', '619 Escuela Ave, Mountain View, CA', 37.394012, -122.095528),
(6, 'Oregano\'s Wood-Fired Pizza', '4546 El Camino Real, Los Altos, CA', 37.401726, -122.114647);

-- --------------------------------------------------------

--
-- Table structure for table `memberships`
--

CREATE TABLE `memberships` (
  `id` int(11) NOT NULL,
  `membershipName` varchar(200) NOT NULL,
  `packageId` varchar(200) NOT NULL,
  `userId` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` float(11,2) NOT NULL,
  `serviceTypeId` int(11) NOT NULL,
  `offer` int(11) NOT NULL,
  `details` text NOT NULL,
  `termAndcondition` text NOT NULL,
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `memberships`
--

INSERT INTO `memberships` (`id`, `membershipName`, `packageId`, `userId`, `startDate`, `endDate`, `price`, `serviceTypeId`, `offer`, `details`, `termAndcondition`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 'testPackager demo', '1', 1, '2023-12-01', '2023-12-31', 7000.00, 1, 0, 'hjkghh', 'vgnfhdg', 'vender', '', '2023-04-11 18:14:09', NULL),
(3, 'testPackager3 demo', '1', 1, '2023-12-01', '2023-12-31', 7000.00, 2, 30, 'hjkghh', 'vgnfhdg', 'vender', '', '2023-04-11 18:16:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `membership_details`
--

CREATE TABLE `membership_details` (
  `id` int(11) NOT NULL,
  `offer` int(11) NOT NULL,
  `noOfTime` varchar(200) NOT NULL,
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `serviceTypeId` int(11) NOT NULL,
  `membershipId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `membership_details`
--

INSERT INTO `membership_details` (`id`, `offer`, `noOfTime`, `created_by`, `updated_by`, `created_at`, `updated_at`, `serviceTypeId`, `membershipId`) VALUES
(3, 25, '5', 'vender', '', '2023-04-11 18:19:28', NULL, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `packageName` varchar(200) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` float(11,2) NOT NULL,
  `details` text NOT NULL,
  `termAndcondition` text NOT NULL,
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `userId`, `packageName`, `startDate`, `endDate`, `price`, `details`, `termAndcondition`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'testPackager', '2023-12-01', '2023-12-31', 7000.00, 'hjkghh', 'vgnfhdg', 'vender', '', '2023-04-06 17:02:12', NULL),
(2, 1, 'package', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:34:03', NULL),
(3, 1, 'packag3e', '2023-12-01', '2023-12-31', 7000.00, 'x[vxkl dcvldkl', 'dkdl test', 'vender', '', '2023-04-10 16:40:47', NULL),
(4, 1, 'package4', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:41:18', NULL),
(5, 1, 'package5', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:42:07', NULL),
(6, 1, 'package6', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:42:52', NULL),
(7, 1, 'package7', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:43:47', NULL),
(8, 1, 'package8', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:51:48', NULL),
(9, 1, 'package10', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:53:13', NULL),
(10, 1, 'package11', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:54:31', NULL),
(11, 1, 'package12', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:54:50', NULL),
(12, 1, 'package13', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:55:56', NULL),
(13, 1, 'package14', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 16:59:26', NULL),
(14, 1, 'package15', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 17:00:36', NULL),
(15, 1, 'package16', '2023-12-01', '2023-12-31', 7000.00, '', '', 'vender', '', '2023-04-10 17:01:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `package_details`
--

CREATE TABLE `package_details` (
  `id` int(11) NOT NULL,
  `packageId` int(11) NOT NULL,
  `serviceTypeId` int(11) NOT NULL,
  `offer` int(11) NOT NULL,
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_details`
--

INSERT INTO `package_details` (`id`, `packageId`, `serviceTypeId`, `offer`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 3, 2, 25, 'vender', '', '2023-04-11 16:57:04', NULL),
(2, 3, 1, 25, 'vender', '', '2023-04-11 16:58:15', NULL),
(3, 3, 1, 25, 'vender', '', '2023-04-11 16:59:53', NULL),
(4, 4, 1, 25, 'vender', '', '2023-04-11 17:25:00', NULL),
(5, 4, 1, 25, 'vender', '', '2023-04-11 17:25:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `branchName` varchar(250) NOT NULL,
  `shopName` varchar(250) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `let` float(10,6) DEFAULT NULL,
  `lng` float(10,6) NOT NULL,
  `description` varchar(250) NOT NULL,
  `gstNo` varchar(30) NOT NULL,
  `pinNo` varchar(30) DEFAULT NULL,
  `panNo` varchar(30) NOT NULL,
  `aadhaar` varchar(30) NOT NULL,
  `address` varchar(250) NOT NULL,
  `pin` varchar(30) NOT NULL,
  `file` varchar(100) DEFAULT NULL,
  `country` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `status` varchar(11) NOT NULL DEFAULT '0',
  `token` text DEFAULT NULL,
  `created_by` varchar(30) NOT NULL,
  `updated_by` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrations`
--

INSERT INTO `registrations` (`id`, `branchName`, `shopName`, `mobile`, `let`, `lng`, `description`, `gstNo`, `pinNo`, `panNo`, `aadhaar`, `address`, `pin`, `file`, `country`, `state`, `city`, `status`, `token`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'newshop', 'newshop', '8114075844', 26.846701, 80.946198, 'dgklsdk dlfhkl kdlfkhl kdf', '18AABCU9603R1ZM', 'pinNo', 'ABCDE4758D', '697890694739', 'lucknow up', '254782', '1', '1', '3', '5', '0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjgxMTQwNzU4NDQsImlhdCI6MTY4MDgwMDU0Mn0.GxK0Ba3Ot3ii7tnkJ7p99zK-rOWQlTkZ0NmT1mZwc5Q', 'vender', NULL, '2023-04-04 15:50:12', NULL),
(3, 'newshop1', 'newshop1', '8114075444', 26.846701, 80.946198, 'dgklsdk dlfhkl kdlfkhl kdf', '18AABCU9603R1ZM', 'pinNo', 'ABCDE4758D', '697890694739', 'lucknow up', '254782', '3', '1', '3', '5', '0', NULL, 'vender', NULL, '2023-04-04 15:58:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reschdeuled`
--

CREATE TABLE `reschdeuled` (
  `id` int(11) NOT NULL,
  `bookingId` int(11) NOT NULL,
  `serviceTypeId` int(11) NOT NULL,
  `oldBookingDate` date NOT NULL,
  `oldBookingStartTime` time NOT NULL,
  `oldBookingEndTime` time NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reschdeuled`
--

INSERT INTO `reschdeuled` (`id`, `bookingId`, `serviceTypeId`, `oldBookingDate`, `oldBookingStartTime`, `oldBookingEndTime`, `created_at`, `updated_at`) VALUES
(2, 1, 1, '2023-04-08', '12:00:00', '12:00:00', '2023-04-12 00:40:38', NULL),
(3, 1, 1, '2023-04-08', '12:00:00', '12:00:00', '2023-04-12 00:46:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `rate` int(11) NOT NULL,
  `comment` text NOT NULL,
  `serviceId` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `rate`, `comment`, `serviceId`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 2, 'good', 1, 1, 0, '2023-04-04 18:45:36', NULL),
(2, 3, 'good', 1, 1, 0, '2023-04-04 18:54:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `serviceName` varchar(200) NOT NULL,
  `shopId` int(11) NOT NULL,
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `serviceName`, `shopId`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'screen4', 1, 'vender', '', '2023-03-30 16:53:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `servicetype`
--

CREATE TABLE `servicetype` (
  `id` int(11) NOT NULL,
  `serviceId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(250) NOT NULL,
  `price` float(11,2) NOT NULL,
  `timeTaken` float(11,2) NOT NULL,
  `offer` varchar(250) DEFAULT NULL,
  `details` varchar(250) NOT NULL,
  `persontype` int(11) NOT NULL COMMENT '1:men,2:women,3:kid',
  `termAndcondition` varchar(250) DEFAULT NULL,
  `file` int(11) DEFAULT NULL,
  `created_by` varchar(200) DEFAULT NULL,
  `updated_by` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicetype`
--

INSERT INTO `servicetype` (`id`, `serviceId`, `userId`, `type`, `price`, `timeTaken`, `offer`, `details`, `persontype`, `termAndcondition`, `file`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Test Service', 2.50, 2.10, '10', 'fgh', 0, 'dfg', 4, 'vender', NULL, '2023-04-06 18:47:40', NULL),
(2, 1, 1, 'Test Service', 2.50, 2.10, '50', 'abc', 0, 'ades', 4, 'vender', NULL, '2023-04-06 19:12:11', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

CREATE TABLE `slots` (
  `id` int(11) NOT NULL,
  `serviceTypeId` int(11) NOT NULL,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `employeeId` int(11) NOT NULL,
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supports`
--

CREATE TABLE `supports` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `message` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0:pending,1:reply',
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supports`
--

INSERT INTO `supports` (`id`, `name`, `message`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 'Amit Yadav', 'this is test message', 0, 'vender', NULL, '2023-03-31 17:55:23', NULL),
(3, 'Amit Yadav', 'this is test message', 0, 'vender', NULL, '2023-03-31 17:55:24', NULL),
(4, 'Amit Yadav', 'this is test message', 0, 'vender', NULL, '2023-03-31 17:55:26', NULL),
(5, 'tedst', 'this is terst update message', 0, 'vender', NULL, '2023-03-31 17:56:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_login`
--

CREATE TABLE `user_login` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `mobile` varchar(250) NOT NULL,
  `token` varchar(250) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_login`
--

INSERT INTO `user_login` (`id`, `name`, `mobile`, `token`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Amit Yadav', '8447569844', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjg0NDc1Njk4NDQsImlhdCI6MTY4MDQ0MTM0NX0.BRyCddNfx12trA53kXL87fJdZXMkuOHT3_nUqVFSYYY', 0, '2023-04-02 13:15:04', NULL),
(2, 'undefined', 'undefined', NULL, 0, '2023-04-07 17:23:28', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking_details`
--
ALTER TABLE `booking_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking_location`
--
ALTER TABLE `booking_location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `canclled`
--
ALTER TABLE `canclled`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employ`
--
ALTER TABLE `employ`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `markers`
--
ALTER TABLE `markers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `memberships`
--
ALTER TABLE `memberships`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `membership_details`
--
ALTER TABLE `membership_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `package_details`
--
ALTER TABLE `package_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reschdeuled`
--
ALTER TABLE `reschdeuled`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `servicetype`
--
ALTER TABLE `servicetype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `slots`
--
ALTER TABLE `slots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supports`
--
ALTER TABLE `supports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_login`
--
ALTER TABLE `user_login`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking_details`
--
ALTER TABLE `booking_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `booking_location`
--
ALTER TABLE `booking_location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `canclled`
--
ALTER TABLE `canclled`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employ`
--
ALTER TABLE `employ`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `markers`
--
ALTER TABLE `markers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `memberships`
--
ALTER TABLE `memberships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `membership_details`
--
ALTER TABLE `membership_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `package_details`
--
ALTER TABLE `package_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reschdeuled`
--
ALTER TABLE `reschdeuled`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `servicetype`
--
ALTER TABLE `servicetype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `slots`
--
ALTER TABLE `slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supports`
--
ALTER TABLE `supports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_login`
--
ALTER TABLE `user_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

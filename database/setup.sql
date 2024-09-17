--Delete Database before running

CREATE DATABASE alloy_info;
CREATE USER admin WITH PASSWORD 'pass';
GRANT ALL PRIVILEGES ON DATABASE alloy_info TO admin;

USE alloy_info;

CREATE TABLE alloy (
alloy_id INT PRIMARY KEY
);

CREATE TABLE query (
querid INT PRIMARY KEY,
alloy_id int,
request_type varchar(255)
);

CREATE TABLE stress_strain (
ssid INT PRIMARY KEY,
alloy_id int,
request_type varchar(255),
strain FLOAT,
stress FLOAT,
);

CREATE TABLE properties (
alloy_id INT,
density varchar(255),
elastic_modulus varchar(255),
hardness varchar(255),
poisson_ratio varchar(255),
fatigue_strength varchar(255),
yield_strength varchar(255),
ultimate_tensile_strength varchar(255),
metling_point varchar(255),
electrical_reistance varchar(255)
);
-- Delete Database before running

-- DROP DATABASE alloy_info;
-- CREATE DATABASE alloy_info;
-- GRANT ALL PRIVILEGES ON DATABASE alloy_info TO admin;

-- Create tables
CREATE TABLE alloy (
  alloy_id SERIAL PRIMARY KEY,
  alloy_name VARCHAR(255)
);

CREATE TABLE query (
  query_id SERIAL PRIMARY KEY,
  alloy_id INT,
  request_type VARCHAR(255),
  repeated BOOLEAN,
  FOREIGN KEY (alloy_id) REFERENCES alloy(alloy_id)
);

CREATE TABLE stress_strain (
  ssid SERIAL PRIMARY KEY,
  alloy_id INT,
  strain FLOAT,
  stress FLOAT,
  FOREIGN KEY (alloy_id) REFERENCES alloy(alloy_id)
);

CREATE TABLE properties (
  alloy_id INT,
  common_name VARCHAR(255),
  density VARCHAR(255),
  elastic_modulus VARCHAR(255),
  hardness VARCHAR(255),
  poisson_ratio VARCHAR(255),
  fatigue_strength VARCHAR(255),
  yield_strength VARCHAR(255),
  ultimate_tensile_strength VARCHAR(255),
  melting_point VARCHAR(255),
  electrical_resistance VARCHAR(255),
  FOREIGN KEY (alloy_id) REFERENCES alloy(alloy_id)
);


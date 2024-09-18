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

-- Insert dummy values into alloy table
INSERT INTO alloy (alloy_name) VALUES
  ('Aluminium Alloy'),
  ('Titanium Alloy'),
  ('Stainless Steel'),
  ('Copper Alloy'),
  ('Nickel Alloy');

-- Insert dummy values into query table
INSERT INTO query (alloy_id, request_type) VALUES
  (1, 'stress strain'),
  (2, 'properties'),
  (3, 'stress strain'),
  (4, 'properties'),
  (5, 'stress strain');

-- Insert dummy values into stress_strain table
INSERT INTO stress_strain (alloy_id, strain, stress) VALUES
  -- Alloy 1
  (1, 0.01, 400),
  (1, 0.02, 450),
  (1, 0.03, 500),
  (1, 0.04, 550),
  (1, 0.05, 600),

  -- Alloy 2
  (2, 0.01, 300),
  (2, 0.02, 350),
  (2, 0.03, 400),
  (2, 0.04, 450),
  (2, 0.05, 500),

  -- Alloy 3
  (3, 0.01, 250),
  (3, 0.02, 300),
  (3, 0.03, 350),
  (3, 0.04, 400),
  (3, 0.05, 450),

  -- Alloy 4
  (4, 0.01, 350),
  (4, 0.02, 400),
  (4, 0.03, 450),
  (4, 0.04, 500),
  (4, 0.05, 550),

  -- Alloy 5
  (5, 0.01, 200),
  (5, 0.02, 250),
  (5, 0.03, 300),
  (5, 0.04, 350),
  (5, 0.05, 400);

-- Insert dummy values into properties table
INSERT INTO properties (alloy_id, density, elastic_modulus, hardness, poisson_ratio, fatigue_strength, yield_strength, ultimate_tensile_strength, melting_point, electrical_resistance) VALUES
  (2, '2.70 g/cm³', '70 GPa', '150 HV', '0.33', '120 MPa', '200 MPa', '300 MPa', '660°C', '0.028 μΩ·m'),
  (4, '8.96 g/cm³', '110 GPa', '120 HV', '0.34', '150 MPa', '230 MPa', '340 MPa', '1085°C', '0.051 μΩ·m');

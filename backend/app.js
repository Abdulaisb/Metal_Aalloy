const express = require('express');
const app = express();
const port = 3000; 
const { Pool } = require('pg');
const dotenv = require("dotenv");
const OpenAI = require("openai");
const cors = require('cors');


//environment variables
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Start the server, listens from any ip
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on ${port}`);
});
//AI setup
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
//psql
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'alloy_info',
  password: 'pass',
  port: 5432, // Default PostgreSQL port
});
//////////////////////////////////////////////////////
// Test Route
app.get('/', (req, res) => {
  res.json('Your response data');
});
// Test AI
app.get('/testGPTConnection', async (req, res) => {
  const result = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Tell me a 4 sentence story about a fast fox" }],
    model: "gpt-4",
});
  res.json(result.choices[0].message.content);
});
// Test AI function
app.get('/testGPT', async (req, res) => {
  await res.json(gpt_properties('SS316'));
});
// Test Query
app.get('/testDB', async (req, res) => {
  const result = await pool.query('SELECT * FROM alloy;');
  res.json(result.rows);
});
////////////////////////////////////////////////////////////////

//Original User input
app.post('/userRequest', async (req, res) => {
  const {alloyName, type} = req.body;
  //check if valid alloy
  const good = await good_alloy(alloyName);
  if (!good) {res.json("bad"); return;}
  //if alloy exists get id
  let alloyID = await alloy_id_from_name(alloyName);
  //if doesn't exist insert into table
  if (alloyID === null) {
    await pool.query('INSERT INTO alloy (alloy_name) VALUES ($1)', [alloyName]);
    alloyID = await alloy_id_from_name(alloyName);
  }
  //See if this request for this alloy has been made
  const rep = await db_repitition(alloyID,type);
  //track request
  track_query(alloyID,type,rep);
  //If not made, use gpt to populate database
  if (!rep) {
    console.log('unique query');
    if (type === 'stress strain') {
      const info = await gpt_stress_strain(alloyName);
      //insert into database
      let sending = "insert into stress_strain (alloy_id, strain, stress) values ";
      for (let i = 0; i < info.strain.length; i++) {
        sending += `(${alloyID},${info.strain[i]},${info.stress[i]}),`;
      }
      sending = sending.slice(0,-1) + ";";
      await pool.query(sending);
    }
    else if (type === 'properties') {
      const info = await gpt_properties(alloyName);
      //insert into database
      let sending = `INSERT INTO properties (alloy_id, common_name, density, elastic_modulus, hardness, poisson_ratio, 
      fatigue_strength, yield_strength, ultimate_tensile_strength, melting_point, electrical_resistance) VALUES (`;    
      sending += `${alloyID}, '${info.common_name}', '${info.density}', '${info.elastic_modulus}', '${info.hardness}', '${info.poisson_ratio}', 
      '${info.fatigue_strength}', '${info.yield_strength}', '${info.ultimate_tensile_strength}', '${info.melting_point}', '${info.electrical_resistance}'`;
      sending += `);`;
      await pool.query(sending);
    }
  }
  //get values from database and return to frontend
  if (type === 'stress strain') {
    //make query and format as two lists
    const result = await pool.query('SELECT strain, stress FROM stress_strain WHERE alloy_id = $1', [alloyID]);
    // Extract strain and stress values into separate arrays
    const strainValues = result.rows.map(row => row.strain);
    const stressValues = result.rows.map(row => row.stress);
    // Return the values in a structured format
    const ret = {
      strain: strainValues,
      stress: stressValues
    };
    console.log(ret);
    res.json(ret);
  }
  else if (type === 'properties') {
    //make query and get
    const result = await pool.query('SELECT common_name, density, elastic_modulus, hardness, poisson_ratio, fatigue_strength, yield_strength, ultimate_tensile_strength, melting_point, electrical_resistance FROM properties WHERE alloy_id = $1', [alloyID]);
    // Assuming we expect a single row for a given alloy_id
    const info = result.rows[0];
    // Return the values
    const ret = {
      common_name: info.common_name,
      density: info.density,
      elastic_modulus: info.elastic_modulus,
      hardness: info.hardness,
      poisson_ratio: info.poisson_ratio,
      fatigue_strength: info.fatigue_strength,
      yield_strength: info.yield_strength,
      ultimate_tensile_strength: info.ultimate_tensile_strength,
      melting_point: info.melting_point,
      electrical_resistance: info.electrical_resistance
    };
    res.json(ret);
  }
});

//function to return alloy id if in database
async function alloy_id_from_name (name) {
  const result = await pool.query('select alloy_id from alloy where alloy_name = $1;', [name]);
  if (result.rows.length > 0) {
    return result.rows[0].alloy_id;
  }
  else {
    return null;
  }
}
//function that sees if request is repeated
async function db_repitition(alloy_id,type) {
  const result = await pool.query('SELECT * FROM query WHERE alloy_id = $1 AND request_type = $2;', [alloy_id, type]);
  return result.rows.length > 0;
}
//function to track query
async function track_query(alloy_id,type,rep) {
  await pool.query('INSERT INTO query (alloy_id, request_type, repeated) VALUES ($1, $2, $3);', [alloy_id, type, rep])
}

//Function that checks for can't-do attitude
function disclaimer(text) {
  const lowerCaseText = text.toLowerCase();
  if (
    lowerCaseText.includes("as an ai") || 
    lowerCaseText.includes("i don't have the ability") ||
    lowerCaseText.includes("i can't assist with that") ||
    lowerCaseText.includes("i am unable to")
  ) {
    return true;
  }
  return false;
}
async function good_alloy(alloyName) {
  let request = "Is the alloy " + alloyName + " a real alloy that GPT-4 could find properties for and stress-strain values at room temperature?";
  request += "Return lowercase true if so and lowercase false if not";
  request += "There should be no other text in the response"
  const result = await openai.chat.completions.create({
    messages: [{ role: "user", content: request}],
    model: "gpt-4",
  });
  const good = result.choices[0].message.content.trim() === 'true';
  return good;
}
//GPT to get alloy properties
async function gpt_properties (alloyName) {
  let request = 'Return the following properties about the alloy ' + alloyName + ' : common_name, density, elastic_modulus, hardness, poisson_ratio, fatigue_strength, yield_strength, ultimate_tensile_strength, melting_point, electrical_resistance';
  request += 'The values should be returned as a JSON object with no other text.';
  request += 'The common name attribute should be the colloquial way of describing the alloy such as stainless steel'
  const result = await openai.chat.completions.create({
    messages: [{ role: "user", content: request}],
    model: "gpt-4",
  });
  const properties = JSON.parse(result.choices[0].message.content);
  return properties;
}
//GPT to get alloy stress strain
async function gpt_stress_strain (alloyName) {
  let request = 'Return the room temperature stress strain curve of the alloy ' + alloyName + '.';
  request += 'The strain percentage values should have 10 values ranging from 0% to 70%.';
  request += 'The units of stress should be in MPa.';
  request += 'return a comma separated list surrounded by square brackets for both values.';
  request += 'The lists should be separated by a line';
  request += 'There should be no other text in the response besides the lists.'
  request += `Example Format: [0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70]
  [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]`
  bad_response = true;
  let responseContent = "";
  let tries = 0
  while (bad_response && tries < 10) {
    const result = await openai.chat.completions.create({
      messages: [{ role: "user", content: request}],
      model: "gpt-4",
    });
    responseContent = result.choices[0].message.content;
    bad_response = disclaimer(responseContent);
  }
  if (tries === 10) {
    throw new Error('Max retries reached for GPT-4 stress-strain data.');
  }
  const [strainList, stressList] = responseContent.split('\n');
  const strainValues = strainList.replace(/[\[\]]/g, '').split(',').map(Number);
  const stressValues = stressList.replace(/[\[\]]/g, '').split(',').map(Number);
  const curve = { strain: strainValues, stress: stressValues, };
  return curve;
}


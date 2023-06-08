const database = require('./database');
const pool = database.pool;

const getCities = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT c.city_id, c.city_name, p.prov_id, p.prov_name FROM cities AS c LEFT JOIN provinces AS p ON c.prov_id = p.prov_id', (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(results.rows);
      }
    })
  })
}

const createCity = (body) => {
  return new Promise(function(resolve, reject) {
    const { city_id, city_name, prov_id } = body
    pool.query('INSERT INTO cities (city_id, city_name, prov_id) VALUES ($1, $2, $3) RETURNING *', [city_id, city_name, prov_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`A new city has been added: ${JSON.stringify(results.rows[0])}`);
        // resolve(results.rows[0]);
      }
    })
  })
}

const deleteCity = (id) => {
  return new Promise(function(resolve, reject) {
    const city_id = parseInt(id)
    pool.query('DELETE FROM cities WHERE city_id = $1', [city_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`City deleted with ID: ${city_id}`);
      }
    })
  })
}

const updateCity = (id, body) => {
  return new Promise(function(resolve, reject) {
    const city_id = parseInt(id)
    const { city_name, prov_id } = body
    pool.query('UPDATE cities SET city_name = $1, prov_id = $2 WHERE city_id = $3 RETURNING *', [city_name, prov_id, city_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`A new city has been updated: ${JSON.stringify(results.rows[0])}`);
        // resolve(results.rows[0]);
      }
    })
  })
}

// In case needed
const getMaxCityId = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT MAX(city_id) FROM cities', (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(results.rows[0]);
      }
    })
  })
}

// In case needed
const getCityNameById = (id) => {
  return new Promise(function(resolve, reject) {
    const city_id = parseInt(id)
    pool.query('SELECT city_name FROM cities WHERE city_id = $1', [city_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(results.rows[0]);
      }
    })
  })
}


module.exports = {
  getCities,
  createCity,
  deleteCity,
  updateCity,
  getMaxCityId,
  getCityNameById,
}

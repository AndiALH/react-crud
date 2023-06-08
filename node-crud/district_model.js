const database = require('./database');
const pool = database.pool;

const getDistricts = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT d.dis_id, d.dis_name, c.city_id, c.city_name, p.prov_name FROM districts AS d LEFT JOIN cities AS c ON d.city_id = c.city_id LEFT JOIN provinces AS p ON c.prov_id = p.prov_id', (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(results.rows);
      }
    })
  })
}

const createDistrict = (body) => {
  return new Promise(function(resolve, reject) {
    const { dis_id, dis_name, city_id } = body
    pool.query('INSERT INTO districts (dis_id, dis_name, city_id) VALUES ($1, $2, $3) RETURNING *', [dis_id, dis_name, city_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`A new district has been added: ${JSON.stringify(results.rows[0])}`);
        // resolve(results.rows[0]);
      }
    })
  })
}

const deleteDistrict = (id) => {
  return new Promise(function(resolve, reject) {
    const dis_id = parseInt(id)
    pool.query('DELETE FROM districts WHERE dis_id = $1', [dis_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`District deleted with ID: ${dis_id}`);
      }
    })
  })
}

const updateDistrict = (id, body) => {
  return new Promise(function(resolve, reject) {
    const dis_id = parseInt(id)
    const { dis_name, city_id } = body
    pool.query('UPDATE districts SET dis_name = $1, city_id = $2 WHERE dis_id = $3 RETURNING *', [dis_name, city_id, dis_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`A new district has been updated: ${JSON.stringify(results.rows[0])}`);
        // resolve(results.rows[0]);
      }
    })
  })
}

// In case needed
const getMaxDistrictId = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT MAX(dis_id) FROM districts', (error, results) => {
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
const getDistrictNameById = (id) => {
  return new Promise(function(resolve, reject) {
    const dis_id = parseInt(id)
    pool.query('SELECT dis_name FROM districts WHERE dis_id = $1', [dis_id], (error, results) => {
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
  getDistricts,
  createDistrict,
  deleteDistrict,
  updateDistrict,
  getMaxDistrictId,
  getDistrictNameById,
}

// import React, {useState, useEffect} from 'react';

import styles from '../page.module.css'

import Navbar from '../components/Navbar';
import CityTable from "../components/CityTable";

function City() {

  return (
    <>
      <Navbar></Navbar>
      <main className={styles.main}>
        <CityTable></CityTable>
      </main>
    </>
  );
}

export default City;
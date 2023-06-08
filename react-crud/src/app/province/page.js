// import React, {useState, useEffect} from 'react';

import styles from '../page.module.css'

import Navbar from '../components/Navbar';
import ProvinceTable from "../components/ProvinceTable";

function Province() {

  return (
    <>
      <Navbar></Navbar>
      <main className={styles.main}>
        <ProvinceTable></ProvinceTable>
      </main>
    </>
  );
}

export default Province;
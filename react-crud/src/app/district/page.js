// import React, {useState, useEffect} from 'react';

import styles from '../page.module.css'

import Navbar from '../components/Navbar';
import DistrictTable from '../components/DistrictTable';

function District() {

  return (
    <>
      <Navbar></Navbar>
      <main className={styles.main}>
        <DistrictTable></DistrictTable>
      </main>
    </>
  );
}

export default District;
"use client";

import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link';

import Navbar from './components/Navbar';

import Stack from '@mui/material/Stack';

export default function Home() {

  return (
    <>
      <Navbar></Navbar>
      <main className={styles.main}>

        <div className={styles.center}>
          <Stack spacing={2}>
          <Image
            className={styles.logo}
            src="/logo_pancasila.svg"
            alt="Logo Pancasila"
            width={480}
            height={270}
            priority
          />
          <h1 style={{textAlign: 'center'}}>Database Indonesia</h1>
          </Stack>
        </div>

        <div className={styles.grid}>
          <Link
            href="/province"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2>
              Provinsi <span>-&gt;</span>
            </h2>
            <p>Lihat daftar provinsi di Indonesia</p>
          </Link>

          <Link
            href="/city"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2>
              Kabupaten <span>-&gt;</span>
            </h2>
            <p>Lihat daftar kabupaten di Indonesia</p>
          </Link>

          <Link
            href="/district"
            className={styles.card}
            rel="noopener noreferrer"
          >
            <h2>
              Kecamatan <span>-&gt;</span>
            </h2>
            <p>Lihat daftar kecamatan di Indonesia.</p>
          </Link>
        </div>
      </main>
    </>
  )
}

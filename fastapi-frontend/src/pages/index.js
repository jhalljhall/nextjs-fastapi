
import React, { useState, useEffect } from 'react'
import { useGlobalState } from '../context/GlobalState';
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';
import { jwtDecode } from "jwt-decode";
import styles from '../styles/home.module.css';
import Link from 'next/link';

import DataService from "@/services/data.service";

export default function Home() {
  const [localState, setLocalState] =  useState({});
  const [scan_msg_str, setScanStatusText] =  useState("Status: Ready");
  const [scan_time_str, setScanTimeText] =  useState("Last Scan: N/A");
  const [scan_img_url, setScanImageURL] =  useState("/images/default.png");
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    const getUserFromLocalStorage = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = jwtDecode(userData);
        console.log('User data:', user);
        dispatch({
          type: 'SET_USER',
          payload: user
        });
      }
    };
    getUserFromLocalStorage();
  }, []);

  const handleLogout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT_USER' });
    router.push('/');
  };

  async function handleRegister(e) {
    e.preventDefault();
    try {
        DataService
        .scanImage({
          data: "scan",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization":"Bearer " + globalState.user.user_id
          }
        })
        .then(async (resp) => {
            if(resp != undefined){
                setLocalState(resp)
                console.log(rep)
            }
        })
        .catch((error) => {
            // Handle the error here
            console.error('An error occurred:', error);
        })
        .finally(() => {
            // Code to run regardless of success or failure
            console.log('Scan object request completed');
            setScanStatusText("Scan object request completed.")
        });
    } catch (error) {
      console.error('Scan failed:', error);
    }
  }

  return (
    <>
      <main className={`${styles.main}`}>

        <div className={styles.grid}>
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <div className="row">
                            <div className="col">
                                <h4>Last Scan: {scan_time_str}</h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>{scan_msg_str}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <form className="mx-auto border-2 bg-mtgray" onSubmit={handleScan}>
                                    <input
                                        type="submit"
                                        value="Scan!"
                                        className={styles.button}
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="scan-img-container">
                            <img src={img_url} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </>
  )
}

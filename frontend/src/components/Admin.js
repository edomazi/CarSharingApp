import React, {useState, useEffect} from 'react';
import axios from "axios";
import {UIStore} from "../../store/store";

const Admin = () => {
  const isLoggedin = UIStore.useState(s => s.isLoggedin);

  useEffect( () => {
    if (!isLoggedin) {
      window.location.href = '/';
    } else {

      let MyHeaders = {
        'Authorization' : "Bearer " + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': '*'
      };
      axios.post('http://localhost:5000/admin', {}, {headers: MyHeaders})
        .then(response => {
          if (response.data.ok) {
            console.log(response.data.users);
          } else {
            console.log('something when wrong');
          }
        }).catch((e) => console.error(e));
    }
  }, [])


  return (
    <div className={'d-flex align-items-center vh-100 text-center'}>
      <h1>ADMIN PAGE</h1>
    </div>
  );
}

export default Admin

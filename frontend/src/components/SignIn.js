import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import './SignIn.css';
import axios from "axios";

const SignIn = () => {

  let [disableButton, setDisableButton] = useState(true);
  let [errorAtSignIn, setErrorAtSignIn] = useState('')
  let [signInFields, setSignInfields] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (signInFields.email.length && signInFields.password.length) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [signInFields])

  useEffect( () => {
    let params = new URLSearchParams(document.location.search.substring(1));
    const token = params.get('token');
    if (token) {
      let formData = new FormData();
      formData.append('token', token);
      axios.post('http://localhost:5000/validateToken', formData,)
        .then(response => {
          if (response.data.ok) {
            localStorage.setItem('token', response.data.token);
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 2000)
          } else {
            console.log('something when wrong');
          }
        }).catch((e) => console.error(e));
    }
  }, [])

  const updateField = (aField) => (e) => {
    e.preventDefault();
    setSignInfields({
      ...signInFields,
      [aField]: e.target.value,
    })
  }


  const performSignIn = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('email', signInFields.email);
    formData.append('password', signInFields.password);

    let MyHeaders = {
      'Access-Control-Allow-Origin': '*'
    };

    axios.post('http://localhost:5000/signin', formData, {headers: MyHeaders})
      .then(res => {
        if (res.data.ok) {
          localStorage.setItem('token', res.data.token);
          window.location.href = "/dashboard";
        } else {
          setErrorAtSignIn(res.data.message);
          setTimeout(() => {
            setErrorAtSignIn('');
          }, 7000)
        }
      }).catch((e) => console.error(e));
  }

  return (
    <div className={'d-flex align-items-center vh-100 size'}
         style={{ backgroundImage: 'url(' + process.env.PUBLIC_URL + '/pictures/figma2.svg)'}}>
      <div className={'container text-center col-auto'}>
        <div className={'card shadow-lg p-3'}>
          <Link to="/" className="navbar-brand mb-3">
            <span className={'h2 text-dark'}>Carrental</span>
          </Link>
          { errorAtSignIn.length ?
            <div className="alert alert-danger" role="alert">
              {errorAtSignIn}
            </div> : ''
          }
          <form onSubmit={performSignIn}>
            <div className="form-group">
              <label className={'float-left'} htmlFor="inputEmail1">Email address:</label>
              <input type="email" className="form-control" id="inputEmail1" aria-describedby="emailHelp"
                     placeholder="your@email.com"
                     onChange={ updateField('email') }/>
            </div>
            <div className="form-group">
              <label className={'float-left'} htmlFor="inputPassword1">Password</label>
              <input type="password" className="form-control" id="inputPassword1" placeholder="********"
                     onChange={ updateField('password') }/>
            </div>
            <button type="submit"
                    className='btn btn-outline-dark btn-block my-4 py-3'
                    disabled={disableButton}>
              Sign in
            </button>
          </form>
          <small>
            Don&apos;t have an account yet? <Link to="/signup" className="font-weight-bold text-underline"><u>Sign
            up</u></Link> for a FREE account now!
          </small>
          {/*TODO implement forgot password mechanism*/}
          {/*<small className={'mt-2'}>*/}
          {/*  Forgot your password?*/}
          {/*</small>*/}
          </div>
      </div>
    </div>
  );
}

export default SignIn

import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from 'axios';

const SignUp = () => {
  let [fieldsIncompleteFields, setIncompleteFields] = useState(true);
  let [errorAtSignUp, setErrorAtSignUp] = useState('')
  let [successAtSignUp, setSuccessAtSignUp] = useState('')
  let [signUpFields, setSignUpFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })


  useEffect(() => {
    if (signUpFields.firstName.length > 0 && signUpFields.lastName.length > 0
        && signUpFields.email.length > 0 && signUpFields.password.length > 8
        && signUpFields.confirmPassword.length > 8
        && signUpFields.password === signUpFields.confirmPassword) {
      setIncompleteFields(false);
    } else {
      setIncompleteFields(true);
    }
  }, [signUpFields])


  const performSignUp = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append('first_name', signUpFields.firstName);
    formData.append('last_name', signUpFields.lastName);
    formData.append('email', signUpFields.email);
    formData.append('password', signUpFields.password);

    let MyHeaders = {
      'Access-Control-Allow-Origin': '*'
    };

    axios.post('http://localhost:5000/signup', formData, {headers: MyHeaders})
      .then(res => {
        if (res.data.ok) {
          setSuccessAtSignUp(res.data.message);
        } else {
          setErrorAtSignUp(res.data.message);
        }
        setTimeout(() => {
          setSuccessAtSignUp('');
          setErrorAtSignUp('');
        }, 3000);
      }).catch(() => setErrorAtSignUp('Something went wrong!'));
  }
  const updateSignUpFields = (aCategory) => (e) => {
    e.preventDefault();
    setSignUpFields({
      ...signUpFields,
      [aCategory]: e.target.value,
    })
  }

  return(
    <div className={'d-flex align-items-center vh-100'}
         style={{ backgroundImage: 'url(' + process.env.PUBLIC_URL + '/pictures/figma2.svg)'}}>
      <div className={'container text-center col-auto'}>
        <div className={'card shadow-lg p-3'}>
          <Link to="/" className="navbar-brand mb-3">
            <span className={'h2 text-dark'}>Carrental</span>
          </Link>
          {errorAtSignUp.length ?
            <div className="alert alert-danger" role="alert">
              {errorAtSignUp}
            </div> : ''
          }
          {successAtSignUp.length ?
            <div className="alert alert-success" role="alert">
              {successAtSignUp}
            </div> : ''
          }
          <form onSubmit={performSignUp}>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label className={'float-left'} htmlFor="firstNameInput">First Name:</label>
                  <input type="text" className="form-control" id="firstNameInput"
                         placeholder="e.g. John" required onChange={ updateSignUpFields('firstName') }/>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label className={'float-left'} htmlFor="lastNameInput">Last Name:</label>
                  <input type="text" className="form-control" id="lastNameInput"
                         placeholder="e.g. Doe" required onChange={updateSignUpFields('lastName')}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className={'float-left'} htmlFor="inputEmail">Email address:</label>
              <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp"
                     placeholder="your@email.com" required onChange={updateSignUpFields('email')}/>
            </div>
            <div className="form-group">
              <label className={'float-left'} htmlFor="inputPassword">Password</label>
              <input type="password" className="form-control" id="inputPassword"
                     placeholder="********" required onChange={updateSignUpFields('password')}/>
            </div>
            <div className="form-group">
              <label className={'float-left'} htmlFor="confirmInputPassword">Confirm Password</label>
              <input type="password" className="form-control" id="confirmInputPassword"
                     placeholder="********" required onChange={updateSignUpFields('confirmPassword')}/>
              <small className='text-danger mt-3 mb-3'>
                { signUpFields.password.length > 1 && signUpFields.password.length < 8 && signUpFields.confirmPassword.length < 8
                 || signUpFields.password !== signUpFields.confirmPassword
                  ? "Passwords don't match and must have at least 8 characters and a letter" : '' }
              </small>
            </div>
            <button type="submit"
                    className='btn btn-outline-dark btn-block my-4 py-3'
                    disabled={fieldsIncompleteFields}>
              Sign up
            </button>
          </form>
          <p>
            <Link to="/signin"><u>I already have an account</u></Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp

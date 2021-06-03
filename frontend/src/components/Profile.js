import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import Modal from "./Modal";
import './Modal.css'
import Loading from "./Loading";
import ReactStars from "react-rating-stars-component";

const Profile = () => {

  let [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    age: '',
    city: '',
    country: '',
    phoneNumber: '',
    isDriver: '',
    driverLicenseNumber: '',
    stars: 0,
  });
  let [updatedUser, setUpdatedUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    age: '',
    city: '',
    country: '',
    phoneNumber: '',
    isDriver: '',
    driverLicenseNumber: '',
    stars: 0,
  });
  let [car, setCar] = useState({
    id: '',
    manufacturer: '',
    model: '',
    color: '',
    size: '',
  });
  let [originalCarInfo, setOriginalCarInfo] = useState({
    id: '',
    manufacturer: '',
    model: '',
    color: '',
    size: '',
  });
  let [newTrip, setNewTrip] = useState({
    from: '',
    to: '',
    date: '',
    seats: '',
    price: '',
    description: '',
  });
  let [showModal, setShowModal] = useState(false)
  let [loading, setLoading] = useState(false)
  let [test, setTest] = useState(true)
  let [disableAddNewTrip, setDisableAddNewTrip] = useState(true)
  let [showSuccessMessage, setShowSuccessMessage] = useState('')
  let [showErrorMessage, setShowErrorMessage] = useState('')

  const reactStarsConfig = {
    size: 20,
    edit: false,
    count: 5,
    isHalf: true,
    value: user.stars,
    color: "black",
    activeColor: user.stars > 3 ? 'lime' : 'red',
  };

  useEffect(() => {
    if (JSON.stringify(car) === JSON.stringify(originalCarInfo)) {
      setTest(true);
    } else {
      setTest(false);
    }
  }, [car])

  useEffect(() => {
    if (newTrip.from.length && newTrip.to.length && newTrip.date
        && newTrip.price.length && newTrip.seats.length && newTrip.description.length
        && user.age.length && user.driverLicenseNumber.length && user.phoneNumber.length
        && user.city.length && user.country.length && car.color.length && car.model.length
        && car.manufacturer.length) {
      setDisableAddNewTrip(false);
    } else {
      setDisableAddNewTrip(true);
    }
  }, [newTrip])

  useEffect(() => {
    setTimeout(() => {
      setShowErrorMessage('');
    }, 5000)
  }, [showErrorMessage])

  useEffect(() => {
    setTimeout(() => {
      setShowSuccessMessage('');
    }, 5000)
  }, [showSuccessMessage])

  useEffect( () => {
    if (!localStorage.getItem('token')) {
      window.location.href = "/signin";
    } else {
      setLoading(true);
      let MyHeaders = {
        'Authorization': "Bearer " + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': '*'
      };
      const form = new FormData();
      form.append('token', localStorage.getItem('token'));

      const getUserData = async () => {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/profile', form, {headers: MyHeaders});
        if (response.data.ok) {
          setUser(response.data.user);
          setUpdatedUser(response.data.user);
        }
      }
      const getCarInfo = async () => {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/getCarInfo', form, {headers: MyHeaders});
        if (response.data.ok) {
          setOriginalCarInfo(response.data.car);
          setCar(response.data.car);
        }
        setLoading(false);
      }
      getUserData();
      getCarInfo();
    }
  }, []);

  const performCloseButton = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
  }
  const performActionButton = (e) => {
    e.preventDefault();
    setUser({
      isDriver: 1
    })

    let MyHeaders = {
      'Authorization': "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };
    const form = new FormData();
    form.append('token', localStorage.getItem('token'));
    axios.post('http://localhost:5000/updateToDriver', form, {headers: MyHeaders})
      .then(response => {
        if (response.data.ok) {
          setShowSuccessMessage(response.data.message)
        } else {
          setShowErrorMessage(response.data.message)
        }
      }).catch((e) => console.error(e));

    setShowModal(!showModal);
  }
  const displayModal = (e) => {
    if (!user.isDriver) {
      e.preventDefault();
      setShowModal(!showModal);
    }
  }

  const updateCarInfo = (aParam) => (e) => {
    e.preventDefault();
    setCar({
      ...car,
      [aParam]: e.target.value,
    });
  }
  const resetCarFields = (e) => {
    e.preventDefault();
    setCar({...originalCarInfo});
  }
  function checkIfDifferent(aParam) {
    let classedToReturn = 'form-control';
    if (car[aParam] !== originalCarInfo[aParam]) {
      classedToReturn += ' rounded border-info-3';
    }
    return classedToReturn;
  }

  const saveCarInfo = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('id', car.id );
    formData.append('manufacturer', car.manufacturer);
    formData.append('model', car.model);
    formData.append('color', car.color);
    formData.append('size', car.size);

    let MyHeaders = {
      'Authorization' : "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };

    axios.post('http://localhost:5000/updateCarInfo', formData, {headers: MyHeaders})
      .then(res => {
        if (res.data.ok) {
          window.location.href = '/profile';
          setShowSuccessMessage(res.data.message);
        } else {
          setShowErrorMessage(res.data.message);
        }
      }).catch((e) => console.log('catch'));
  }

  function returnNowTime() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours < 10 && hours.toString().length < 2) {
      hours = '0' + hours;
    }
    if (minutes < 10 && minutes.toString().length < 2) {
      minutes = '0' + minutes;
    }
    if (month < 10 && month.toString().length < 2) {
      month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const updateTrip = (aParam) => (e) => {
    e.preventDefault();
    let value = e.target.value;
    if (aParam === 'date') {
      value = new Date(value).getTime();
    }
    setNewTrip({
      ...newTrip,
      [aParam]: value,
    });
  }
  const submitNewTrip = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('from', newTrip.from);
    formData.append('to', newTrip.to);
    formData.append('date', newTrip.date);
    formData.append('seats', newTrip.seats);
    formData.append('price', newTrip.price);
    formData.append('description', newTrip.description);

    let MyHeaders = {
      'Authorization' : "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };

    axios.post('http://localhost:5000/insertNewTrip', formData, {headers: MyHeaders})
      .then(response => {
        if (response.data.ok) {
          setShowSuccessMessage(response.data.message);
          setNewTrip({
            from: '',
            to: '',
            date: '',
            seats: '',
            price: '',
            description: '',
          })
        } else {
          setShowErrorMessage(response.data.message);
        }
      }).catch((e) => console.log('catch'));

  };

  const saveNewUserInfo = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('firstName', updatedUser.firstName);
    formData.append('lastName', updatedUser.lastName);
    formData.append('city', updatedUser.city);
    formData.append('country', updatedUser.country);
    formData.append('phoneNumber', updatedUser.phoneNumber);
    formData.append('age', updatedUser.age);
    formData.append('drivingLicense', updatedUser.driverLicenseNumber);

    let MyHeaders = {
      'Authorization' : "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };
    const updateUserInfo = async () => {
      axios.post('http://localhost:5000/updateUserInfo', formData, {headers: MyHeaders})
        .then(response => {
          if (response.data.ok) {
            window.location.href = '/profile';
            setShowSuccessMessage(response.data.message);
          } else {
            setShowErrorMessage(response.data.message);
          }
        }).catch((e) => console.log('catch'));
    }

    updateUserInfo();
  };

  const updateUserInfo = aParam => (e) => {
    e.preventDefault();
    setUpdatedUser({
      ...updatedUser,
      [aParam]: e.target.value,
    })
  }

  return(
    <div>
      <NavBar/>
      <div className="container">
        { loading ?
          <Loading />
          :
          <>
            <div className="row mt-5">
            <div className="col-12">
              <div className="shadow-sm p-4 border-bottom">
                <div>
                  <div className="card-title mb-4">
                    <div className="d-flex justify-content-start">
                      <div className="image-container">
                        <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                             id="imgProfile" width={'150px'} height={'150px'}
                             alt="profile avatar"
                             className="img-thumbnail"/>
                      </div>
                      <div className="ml-3">
                        <h2 className="d-block font-weight-bold">{user.fullName}</h2>
                        <button type="button" className="btn btn btn-link p-0 btn-sm" data-toggle="modal"
                                data-target="#EditProfileModal">
                           Edit Profile
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                               className="bi bi-pencil-square ml-1" viewBox="0 0 16 16">
                            <path
                              d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                          </svg>
                        </button>

                        <div className="modal fade" id="EditProfileModal" tabIndex="-1" role="dialog" aria-labelledby="EditProfileModalTitle" aria-hidden="true">
                          <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Complete and/or edit your profile informations</h5>
                              </div>
                              <div className="modal-body">

                                <div className='row'>
                                  <div className='col-6'>
                                    <div className="input-group input-group-sm mb-3">
                                      <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="firstNameEdit">First Name</label>
                                      </div>
                                      <input onChange={updateUserInfo('firstName')}
                                             type="text" className="form-control"
                                             value={updatedUser.firstName}
                                             aria-label="First name"
                                             id='firstNameEdit'/>
                                    </div>
                                  </div>
                                  <div className='col-6'>
                                    <div className="input-group input-group-sm mb-3">
                                      <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="lastNameEdit">Last Name</label>
                                      </div>
                                      <input onChange={updateUserInfo('lastName')}
                                             type="text" className="form-control"
                                             value={updatedUser.lastName}
                                             aria-label="Last name"
                                             id='lastNameEdit'/>
                                    </div>
                                  </div>
                                </div>

                                <div className="input-group input-group-sm mb-3">
                                  <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor='EmailEdit'>Email</label>
                                  </div>
                                  <input type="email" className="form-control" aria-label="Email"
                                         id='EmailEdit'
                                         value={updatedUser.email}
                                         disabled={true}/>
                                </div>

                                <div className="input-group input-group-sm mb-3">
                                  <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor='CityEdit'>City</label>
                                  </div>
                                  <input onChange={updateUserInfo('city')}
                                         type="text" className="form-control"
                                         value={updatedUser.city}
                                         aria-label="City"
                                         id='CityEdit'
                                  />
                                </div>

                                <div className="input-group input-group-sm mb-3">
                                  <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor='countryEdit'>Country</label>
                                  </div>
                                  <input onChange={updateUserInfo('country')}
                                         type="text" className="form-control"
                                         value={updatedUser.country}
                                         aria-label="Country"
                                         id='countryEdit'/>
                                </div>

                                <div className="input-group input-group-sm mb-3">
                                  <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor='phoneEdit'>Phone</label>
                                  </div>
                                  <input onChange={updateUserInfo('phoneNumber')}
                                         type="text" className="form-control"
                                         value={updatedUser.phoneNumber}
                                         aria-label="Phone"
                                         id='phoneEdit'/>
                                </div>

                                <div className="input-group input-group-sm mb-3">
                                  <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor='ageEdit'>Age</label>
                                  </div>
                                  <input onChange={updateUserInfo('age')}
                                         type="number" min='15' max='99' className="form-control"
                                         value={updatedUser.age}
                                         aria-label="Age"
                                         id='ageEdit'/>
                                </div>

                                <div className="input-group input-group-sm mb-3">
                                  <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor='driverLicenseEdit'>
                                      Driving License Number
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             className="bi bi-info-circle ml-1" viewBox="0 0 16 16">
                                        <title>The number on your driving license at 5.</title>
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path
                                          d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                      </svg>
                                    </label>
                                  </div>
                                  <input onChange={updateUserInfo('driverLicenseNumber')}
                                         type="text" className="form-control"
                                         value={updatedUser.driverLicenseNumber}
                                         aria-label="Driving License Number"
                                         id='driverLicenseEdit'/>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button onClick={saveNewUserInfo} data-dismiss="modal" type="button" className="btn btn-primary">Save changes</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {user.isDriver ?
                          <>
                            <h6 className="d-block mt-3">Your current rating: </h6>
                            <ReactStars {...reactStarsConfig} />
                          </> : ''
                        }
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-12'>
                      { showSuccessMessage.length ?
                        <div className="alert alert-success" role="alert">
                          {showSuccessMessage}
                        </div> : ''
                      }
                      { showErrorMessage.length ?
                        <div className="alert alert-success" role="alert">
                          {showErrorMessage}
                        </div> : ''
                      }
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                          <a className="nav-link active text-dark" id="info-tab" data-toggle="tab" href="#info" role="tab"
                             aria-controls="info" aria-selected="true">Profile Info</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link text-dark" id="driver-tab" data-toggle="tab" href="#driver" role="tab"
                             aria-controls="driver" aria-selected="false">
                            {!user.isDriver && 'Become a driver'}
                            {user.isDriver && 'Driver infos' || ''}
                          </a>
                        </li>
                        {user.isDriver ?
                          <li className="nav-item">
                          <a className="nav-link text-dark" id="trip-tab" data-toggle="tab" href="#trip" role="tab"
                             aria-controls="trip" aria-selected="false">Start a new trip</a>
                        </li>
                        : ''}
                      </ul>
                      <div className="tab-content ml-2 mt-3" id="myTabContent">
                        <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                          <div className="row">
                            <div className="col-sm-3 col-md-2 col-5">
                              <label className="font-weight-bold">Full Name</label>
                            </div>
                            <div className="col-md-8 col-6">
                              {user.fullName}
                            </div>
                          </div>
                          <hr/>

                          <div className="row">
                            <div className="col-sm-3 col-md-2 col-5">
                              <label className="font-weight-bold">Age</label>
                            </div>
                            <div className="col-md-8 col-6">
                              {user.age}
                            </div>
                          </div>
                          <hr/>


                          <div className="row">
                            <div className="col-sm-3 col-md-2 col-5">
                              <label className={"font-weight-bold"}>Email</label>
                            </div>
                            <div className="col-md-8 col-6">
                              {user.email}
                            </div>
                          </div>
                          <hr/>

                          <div className="row">
                            <div className="col-sm-3 col-md-2 col-5">
                              <label className={"font-weight-bold"}>City</label>
                            </div>
                            <div className="col-md-8 col-6">
                              {user.city}
                            </div>
                          </div>
                          <hr/>


                          <div className="row">
                            <div className="col-sm-3 col-md-2 col-5">
                              <label className={"font-weight-bold"}>Country</label>
                            </div>
                            <div className="col-md-8 col-6">
                              {user.country}
                            </div>
                          </div>
                          <hr/>

                          <div className="row">
                            <div className="col-sm-3 col-md-2 col-5">
                              <label className={"font-weight-bold"}>Driving license number</label>
                            </div>
                            <div className="col-md-8 col-6">
                              {user.driverLicenseNumber}
                            </div>
                          </div>

                        </div>
                        <div className="tab-pane fade" id="driver" role="tabpanel" aria-labelledby="driver-tab">
                          <div className="custom-control custom-switch">
                            <input onChange={displayModal}
                                   type="checkbox"
                                   checked={user.isDriver}
                                   className="custom-control-input"
                                   id="becomeDriverSwitch"
                                   disabled={user.isDriver}/>
                            <label className="custom-control-label" htmlFor="becomeDriverSwitch">
                              Become a driver
                            </label>
                          </div>
                          {showModal &&
                          <Modal title={'Confirmation becoming a driver'}
                                 description={"Are you sure you want to become a driver?"}
                                 closeButtonText={'Close'}
                                 actionButtonText={'Become driver!'}
                                 onClickClose={performCloseButton}
                                 onClickAction={performActionButton}
                          />
                          }
                          {user.isDriver &&
                          <>
                            <p className='mt-3'>Car informations:</p>
                            <form onSubmit={saveCarInfo}>
                              <div className="form-group row">
                                <label htmlFor="manufacturer" className="col-sm-2 col-form-label">
                                  Manufacturer: {car.manufacturer !== originalCarInfo.manufacturer &&
                                <span className='text-info'>*</span>}
                                </label>
                                <div className="col-lg-3 col-xs-12 col-sm-10">
                                  <input onChange={updateCarInfo('manufacturer')}
                                         type="text" className={checkIfDifferent('manufacturer')} id="manufacturer"
                                         value={car.manufacturer}/>
                                  {car.manufacturer !== originalCarInfo.manufacturer &&
                                  <small className='text-info font-weight-bold'>* changed from original
                                    value</small> || ''
                                  }
                                </div>
                              </div>
                              <div className="form-group row">
                                <label htmlFor="model" className="col-sm-2 col-form-label">
                                  Model: {car.model !== originalCarInfo.model && <span className='text-info'>*</span>}
                                </label>
                                <div className="col-lg-3 col-xs-12 col-sm-10">
                                  <input onChange={updateCarInfo('model')}
                                         type="text" className={checkIfDifferent('model')} id="model" value={car.model}/>
                                  {car.model !== originalCarInfo.model &&
                                  <small className='text-info font-weight-bold'>* changed from original
                                    value</small> || ''
                                  }
                                </div>
                              </div>
                              <div className="form-group row">
                                <label htmlFor="color" className="col-sm-2 col-form-label">
                                  Color: {car.color !== originalCarInfo.color &&
                                <span className='font-weight-bold text-info'>*</span>}
                                </label>
                                <div className="col-lg-3 col-xs-12 col-sm-10">
                                  <input onChange={updateCarInfo('color')}
                                         type="text" className={checkIfDifferent('color')} id="color" value={car.color}/>
                                  {car.color !== originalCarInfo.color &&
                                  <small className='text-info font-weight-bold'>* changed from original
                                    value</small> || ''
                                  }
                                </div>
                              </div>
                              <fieldset className="form-group">
                                <div className="row">
                                  <legend className="col-form-label col-sm-2">
                                    Size {car.size !== originalCarInfo.size && <span className='text-info'>*</span>}
                                  </legend>
                                  <div className="col-lg-3 col-xs-12 col-sm-10">
                                    <select onChange={updateCarInfo('size')}
                                            className={checkIfDifferent('size')}>
                                      <option defaultChecked={car.size === ''} disabled>Select one</option>
                                      <option value="small">Small</option>
                                      <option value="medium">Medium</option>
                                      <option value="large">Large</option>
                                    </select>
                                    {car.size !== originalCarInfo.size &&
                                    <small className='text-info font-weight-bold'>* changed from original
                                      value</small> || ''
                                    }
                                  </div>
                                </div>
                              </fieldset>
                              <div className="form-group row">
                                <div className="col-sm-10">
                                  <button onClick={resetCarFields} className="btn btn-secondary mr-2">Revert all changes
                                  </button>
                                  <button type="submit" className="btn btn-primary" disabled={test}>Save changes</button>
                                </div>
                              </div>
                            </form>
                          </> || ''
                          }
                        </div>
                        <div className="tab-pane fade mb-5" id="trip" role="tabpanel" aria-labelledby="contact-tab">
                          <p className='mb-4'>Fill out the following information to add a new trip!</p>
                          {!user.age || !user.country.length || !user.city.length || !user.phoneNumber.length
                            || !user.driverLicenseNumber.length || !car.manufacturer.length || !car.color.length || !car.model.length ?
                            <p className='text-danger'>
                              Please complete all the basic information for your profile and/or car info to be able to add a new trip.
                            </p> : ''
                          }
                          <form onSubmit={submitNewTrip}>
                            <div className='row'>
                              <div className="form-group mr-2 col-lg-3 col-xs-12 col-md-6 col-sm-12">
                                <label className='' htmlFor="from">From:</label>
                                <input onChange={updateTrip('from')} type="text" className="form-control" id="from"/>
                              </div>
                              <div className="form-group col-lg-3 col-xs-12 col-md-6 col-sm-12">
                                <label className='' htmlFor="to">To:</label>
                                <input onChange={updateTrip('to')} type="text" className="form-control" id="to"/>
                              </div>
                            </div>

                            <div className="form-group p-0 col-lg-3 col-xs-12 col-md-6 col-sm-12">
                              <label className='' htmlFor="date">When:</label>
                              <input onChange={updateTrip('date')}
                                     type="datetime-local"
                                     className='ml-2' id="date"
                                     name="date"
                                     min={returnNowTime()}/>
                            </div>
                            <div className="form-group p-0 col-lg-3 col-xs-12 col-md-6 col-sm-12">
                              <label className='' htmlFor="seats">Available seats:</label>
                              <input onChange={updateTrip('seats')} type="number" min='1' className="form-control" id="seats"/>
                            </div>
                            <div className="form-group p-0 col-lg-3 col-xs-12 col-md-6 col-sm-12">
                              <label className='' htmlFor="price">Price per seat(RON):</label>
                              <input onChange={updateTrip('price')} type="number" min='1' className="form-control" id="price"/>
                            </div>
                            <div className="form-group p-0 col-lg-4 col-xs-12 col-md-6 col-sm-12">
                              <label htmlFor="description">Description</label>
                              <textarea onChange={updateTrip('description')} className="form-control"
                                        placeholder='Insert detail about trips like meeting point'
                                        id="description" rows="4"/>
                            </div>
                            <button className='btn btn-primary' disabled={disableAddNewTrip}>
                              Add Trip
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
          </>
        }
      </div>
    </div>
  );
}

export default Profile

import React, {useEffect, useState} from "react";
import './Dashboard.css';
import NavBar from "./NavBar";
import {UIStore} from "../../store/store";
import ReactStars from "react-rating-stars-component";
import {Link} from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";
import Modal from "./Modal";


const Dashboard = () => {

  let [bookedTrips, setBookedTrips] = useState([]);
  let [totalTrips, setTotalTrips] = useState([]);
  let [driverTrips, setDriverTrips] = useState([]);
  let [numberTripsBooked, setNumberTripsBooked] = useState(0);
  let [numberTotalTrips, setNumberTotalTrips] = useState(0);
  let [loading, setLoading] = useState(false);
  let [paginationTotalRides, setPaginationTotalRides] = useState(0);
  let [paginationBookedRides, setPaginationBookedRides] = useState(0);
  let [tripBookedSuccessfully, setTripBookedSuccessfully] = useState(false);
  let [tripDeleted, setTripDeleted] = useState(false);
  let [showModal, setShowModal] = useState({
    booked: false,
    driverTrip: false,
    review: false,
  });
  let [toShowCard, setToShowCard] = useState({
    ridesBooked: true,
    totalRides: false,
  });
  let [userInfo, setUserInfo] = useState({
    id: '',
    firstName: '',
    lastName: '',
    isDriver: '',
    city: '',
    country: '',
  });
  let [reviewDetails, setReviewDetails] = useState({
    reviewText: '',
    stars: 0,
  })

  const reactStarsConfig = {
    size: 50,
    count: 5,
    isHalf: true,
    value: reviewDetails.stars,
    color: "black",
    activeColor: "yellow",
    onChange: (newValue) => {
      setReviewDetails({
        ...reviewDetails,
        stars: newValue,
      })
    }
  };
  const isLoggedin = UIStore.useState(s => s.isLoggedin);

  useEffect(() => {
    if (toShowCard.ridesBooked) {
      isCard('ridesBooked');
    } else {
      isCard('totalRides');
    }
  }, [toShowCard])

  useEffect(() => {
    if (!isLoggedin) {
      window.location.href = "/signin";
    } else {
      const MyHeaders = {
        'Authorization': "Bearer " + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': '*'
      };

      const getUserInfos = async () => {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/dashboardUserInfo', {}, {headers: MyHeaders});
        if (response.data.ok) {
          setNumberTripsBooked(response.data.booked_trips);
          setNumberTotalTrips(response.data.total_trips);
          setUserInfo(response.data.user);
        }
        setLoading(false);
      }
      getTripsInfos('booked');
      getUserInfos();

      if (localStorage.getItem('tripDeleted')) {
        setTripDeleted(true);
        setTimeout(() => {
          if (localStorage.getItem('tripDeleted')) {
            setTripDeleted(false);
            localStorage.removeItem('tripDeleted');
          }
        }, 8000);
      }

      if (localStorage.getItem('tripBookedSuccessfully')) {
        setTripBookedSuccessfully(true);
        setTimeout(() => {
          localStorage.removeItem('tripBookedSuccessfully');
          setTripBookedSuccessfully(false);
        }, 8000)
      }
    }
  }, []);

  const getTripsInfos = async (aParam) => {
    setLoading(true);

    const form = new FormData();
    form.append('trip_type', aParam)
    const MyHeaders = {
      'Authorization': "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };
    const response = await axios.post('http://localhost:5000/getDashboardTrips', form, {headers: MyHeaders});
    if (response.data.ok) {
      if (aParam === 'booked') {
        setBookedTrips(response.data.trips);
        setDriverTrips(response.data.dirverTrips);
      } else if (aParam === 'total') {
        setTotalTrips(response.data.trips);
      }
    }
    setLoading(false);
  }

  function formDate(msValue) {
    const date = new Date(msValue)
    const month = date.toLocaleString('default', { month: 'short' });
    const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    return `${date.getDate()} ${month} ${date.getFullYear()} ${hours}:${minutes}`
  }

  const buttonDeleteBooking = (aTripId) => (e) => {
    e.preventDefault();

    const MyHeaders = {
      'Authorization': "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };

    const form = new FormData();
    form.append('tripId', aTripId);

    const cancelTrip = async() => {
      const response = await axios.post('http://localhost:5000/cancelBooking', form, {headers: MyHeaders});

      if (response.data.ok) {
        setShowModal({ booked: false});
        localStorage.setItem('tripDeleted', 'true');
        window.location.href = '/dashboard';
      }
    }

    cancelTrip();
  }

  const buttonDeleteTrip = (aTripId) => (e) => {
    e.preventDefault();

    const MyHeaders = {
      'Authorization': "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };

    const form = new FormData();
    form.append('tripId', aTripId);

    const cancelTrip = async() => {
      const response = await axios.post('http://localhost:5000/cancelTrip', form, {headers: MyHeaders});

      if (response.data.ok) {
        setShowModal({ driverTrip: false});
        window.location.href = '/dashboard'
        console.log(response.data.message);
      }
    }

    cancelTrip();
  }

  const markTripAsDone = (aTripId) => (e) => {
    e.preventDefault();

    const MyHeaders = {
      'Authorization': "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };

    const form = new FormData();
    form.append('tripId', aTripId);

    const markAsDone = async() => {
      const response = await axios.post('http://localhost:5000/markAsDone', form, {headers: MyHeaders});

      if (response.data.ok) {
        window.location.href = '/dashboard'
        console.log(response.data.message);
      }
    }

    markAsDone();
  }

  const performCloseButton = (modalName) => (e) => {
    e.preventDefault();
    setShowModal({
      [modalName]: false,
    });
  }

  const activateBookedCard = (e) => {
    e.preventDefault();
    if (!toShowCard.ridesBooked) {
      setToShowCard({
        ridesBooked: true,
        totalRides: false,
      });
      getTripsInfos('booked');
    }
  }
    const activateTotalCard = (e) => {
      e.preventDefault();
      if (!toShowCard.totalRides) {
        setToShowCard({
          ridesBooked: false,
          totalRides: true,
        });
        getTripsInfos('total');
      }
    }

  function isCard(aParam) {
    if (toShowCard[aParam]) {
      return 'card ';
    }
    return '';
  }
  const updateReviewText = (e) => {
    e.preventDefault();
    setReviewDetails({
      ...reviewDetails,
      reviewText: e.target.value,
    })
  };

  const submitReview = (aTripId, driverId) => (e) => {
    e.preventDefault();

    const MyHeaders = {
      'Authorization': "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };

    const form = new FormData();
    form.append('tripId', aTripId);
    form.append('driverId', driverId);
    form.append('review', reviewDetails.reviewText);
    form.append('rating', reviewDetails.stars);

    const addReview = async() => {
      const response = await axios.post('http://localhost:5000/addReview', form, {headers: MyHeaders});

      if (response.data.ok) {
        window.location.href = '/dashboard'
      }
    }

    addReview();
  };
  const goHome = (e) => {
    localStorage.removeItem('tripDeleted');
    setTripDeleted(false);
  }

  return (
    <div>
      <NavBar/>
      {
        loading ? <Loading/> :
          <div>
            <section className="find-form mt-5">
              <div className="container">
                <div className="find-form-wrapper">
                  <div className="row p-3 wraping">
                    <div className='col-lg-4 col-md-12'>
                      <div className="mt-3">
                        <h4>{userInfo.firstName} {userInfo.lastName}</h4>
                        { userInfo.city && userInfo.country ?
                          <>
                            <p>{userInfo.city}, {userInfo.country}</p>
                            <Link to="/profile">View Profile</Link>
                          </>
                          : <Link to="/profile">Complete your profile</Link>
                        }
                      </div>
                    </div>
                    <div className='col-lg-8 col-md-12'>
                      <div className='row mt-4'>
                        <div onClick={activateBookedCard}
                             className={isCard('ridesBooked') + 'py-3 col-lg-4 col-md-12 border-right'}
                             style={{cursor: 'pointer'}}>
                          <div className='d-flex align-items-center justify-content-center'>
                            <h4>Incoming Rides:</h4>
                          </div>
                          <p className='d-flex align-items-center justify-content-center h5 mt-2'>{numberTripsBooked}</p>
                        </div>
                        <div onClick={activateTotalCard}
                             className={isCard('totalRides') + 'py-3 col-lg-4 col-md-12 border-right'}
                             style={{cursor: 'pointer'}}>
                          <div className='d-flex align-items-center justify-content-center'>
                            <h4>Total Rides:</h4>
                          </div>
                          <p className='d-flex align-items-center justify-content-center h5 mt-2'>{numberTotalTrips}</p>
                        </div>
                        <div className='col-lg-4 col-md-12 d-flex align-items-center justify-content-center'>
                          <div className=''>
                            {userInfo.isDriver ?
                              <h4>
                                <Link to='/profile#trip'>
                                  Add new trip
                                </Link>
                              </h4> :
                              <h4>
                                <Link to='/profile#driver'>
                                  Become a driver
                                </Link>
                              </h4>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="front-content ride-content">
              <div className="container">
                <h4>
                  { toShowCard.ridesBooked && driverTrips.length ? 'You drive' : toShowCard.ridesBooked && !driverTrips.length ? '': '' }
                  { toShowCard.totalRides && totalTrips.length ? 'List with all the trips' : toShowCard.totalRides ? 'No trips yet': '' }
                </h4>
                { tripBookedSuccessfully ?
                  <div className="alert alert-success text-center" role="alert">
                    Your tip has been successfully been booked!
                  </div> : ''
                }
                { tripDeleted ?
                  <div className="alert alert-success text-center" role="alert">
                    Your booked trip has been deleted! Book another one
                      <Link onClick={goHome} to="/">
                        &nbsp;here
                      </Link>
                  </div> : ''
                }
                <div className="row mt-3">
                  <div className="col-sm-7 col-md-8 col-lg-12 ride-list">
                    { toShowCard.ridesBooked && driverTrips.length ?
                      driverTrips.map((value, index) => {
                        return <div key={index} className="shadow-sm border p-3 rounded media ride-item mb-4">
                          <div className="media-body">
                            <div className="row">
                              <div className="col-md-6 left-content">
                                <p>
                                  <span className='h6'>
                                    From: <span className='h5 font-weight-bold'> {value.from} </span>
                                  </span>
                                </p>
                                <p>
                                  <span className='h6'>
                                    To: <span className='h5 font-weight-bold'> {value.to} </span>
                                  </span>
                                </p>
                                <p>
                                  <span className='h6'>
                                    Available seats:
                                    <span className={value.seatsAvailable > 0 ? 'text-success h4 font-weight-bold' : 'text-danger h4 font-weight-bold'}>
                                      {value.seatsAvailable}
                                    </span>
                                  </span>
                                </p>
                              </div>
                              <div className="col-md-6 right-content">
                                <h3 className="price-text">{formDate(value.date)}</h3>
                                <button onClick={() => setShowModal({driverTrip: true})} className='btn btn-outline-danger rounded'>
                                  Cancel Trip
                                </button>
                                <button onClick={markTripAsDone(value.id)}
                                        className='btn btn-outline-success rounded ml-1'
                                        disabled={new Date().getTime() < value.date}>
                                  Mark as done
                                </button>
                              </div>
                            </div>
                          </div>
                          {showModal.driverTrip ?
                            <Modal
                              closeButtonText={'Close'}
                              title={'Delete Trip'}
                              description={'<p>Are you sure you want to delete this trip?</p><p>An email will be sent to all the people that booked the trip to inform them</p>'}
                              actionButtonText={'Delete'}
                              classActionButton={'btn btn-danger'}
                              onClickClose={performCloseButton('driverTrip')}
                              onClickAction={buttonDeleteTrip(value.id)}/>
                            : ''
                          }
                        </div>
                      }) : ''
                    }
                    <h4 className='mb-3'>
                      { toShowCard.ridesBooked && bookedTrips.length ? 'Booked Trips' : toShowCard.ridesBooked ? 'No trips booked yet': '' }
                    </h4>
                    { toShowCard.ridesBooked && bookedTrips.length ?
                      bookedTrips.slice(paginationBookedRides * 5, paginationBookedRides * 5 + 5).map((value, index) => {
                        return <div key={index} className="shadow-sm border p-3 rounded media ride-item mb-4">
                          <div className="media-body">
                            <div className="row">
                              <div className="col-md-6 left-content">
                                <span>With:</span>
                                <h3 className="content-header">
                                  {value.driverName}
                                  {/*//TODO implement contact driver*/}
                                  <img src='https://img.icons8.com/nolan/344/email.png' width='35' className='mb-2 ml-2 cursor-pointer' alt='sendMail' title='Contact Driver'/>
                                </h3>
                                <p className="content-city">{value.from} - {value.to}</p>
                              </div>
                              <div className="col-md-6 right-content">
                                <h3 className="price-text">{formDate(value.date)}</h3>
                                <button onClick={() => setShowModal({booked: true})} className='btn btn-outline-danger rounded'>
                                  Cancel Booking
                                </button>
                                { !value.paid ?
                                  <button className='btn btn-primary rounded ml-1'>
                                    <Link to={{pathname: '/payment', state: {tripId: value.id, price: value.price}}}
                                          className='text-white'>Pay now!</Link>
                                  </button> : ''
                                }
                              </div>
                            </div>
                          </div>
                          {showModal.booked ?
                            <Modal
                              closeButtonText={'Close'}
                              title={'Cancel Booking'}
                              description={'Are you sure you want to delete this booking'}
                              actionButtonText={'Delete'}
                              classActionButton={'btn btn-danger'}
                              onClickClose={performCloseButton('booked')}
                              onClickAction={buttonDeleteBooking(value.id)}/>
                              : ''
                          }
                        </div>
                      }) : toShowCard.totalRides ?
                        totalTrips.slice(paginationTotalRides * 5, paginationTotalRides * 5 + 5).map((value, index) => {
                          return <div key={index} className="shadow-sm border p-3 rounded media ride-item mb-4">
                            <div className="media-body">
                              <div className="row">
                                <div className="col-md-6 left-content">
                                  {!value.driver ?
                                    <>
                                      <span>With</span>
                                      <h3 className="content-header">{value.driverName}</h3>
                                    </> :
                                    <>
                                      <h4>You drived on this trip</h4>
                                    </>
                                  }
                                  <p className="content-city">{value.from} - {value.to}</p>
                                </div>
                                <div className="col-md-6 right-content">
                                  <h3 className="price-text">{formDate(value.date)}</h3>
                                  {!value.driver ?
                                    <button className="btn btn-outline-primary rounded mt-1" type="button"
                                            data-toggle="collapse" data-target={`#collapse_${value.date}`} aria-expanded="true"
                                            aria-controls={`collapse_${value.date}`}>
                                      Add review
                                    </button> : '' }
                                </div>
                              </div>
                              {!value.driver ?
                                <div className="accordion mt-3"  id="accordionExample">
                                  <div id={`collapse_${value.date}`} className="collapse border rounded shadow-sm" aria-labelledby="headingOne"
                                       data-parent="#accordionExample">
                                    <div className="card-body">
                                      Please type a few words to tell everyone how the trip with <i className='font-weight-bold'>{value.driverName}</i> was
                                      or you can just leave a rating for the driver. Thanks!
                                      <div className='row mt-3'>
                                        <div className='col-auto'>
                                          <p>
                                            Trip review:
                                          </p>
                                          <textarea onChange={updateReviewText}
                                                    className='mt-2'
                                                    rows='4'
                                                    cols='50'
                                                    placeholder='type a review here'/>
                                        </div>
                                        <div className='col-auto ml-auto'>
                                          <label>
                                            Driver Rating
                                          </label>
                                          <ReactStars {...reactStarsConfig} />
                                          <small>You currently rated &quot;{value.driverName}&quot; with
                                            <span className='font-weight-bold'> {reviewDetails.stars}</span> stars</small>
                                        </div>
                                      </div>
                                      <div className='d-flex justify-content-end'>
                                        <button onClick={submitReview(value.tripId, value.driverId)}
                                                className='btn btn-primary'>
                                          Submit review
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div> : ''
                              }
                            </div>
                          </div>
                      }) : ''
                    }
                  </div>
                </div>
                {toShowCard.totalRides ?
                  <div className='d-flex justify-content-end'>
                    { paginationTotalRides > 0 ?
                      <button onClick={() => setPaginationTotalRides(paginationTotalRides - 1)} className='btn btn-outline-primary'>Previous</button> : ''
                    }
                    {
                      paginationTotalRides * 5 + 5 < totalTrips.length ?
                        <button onClick={() => setPaginationTotalRides(paginationTotalRides + 1)} className='btn btn-outline-primary ml-2'>Next</button> : ''
                    }
                  </div> : ''
                }
                {toShowCard.ridesBooked ?
                  <div className='d-flex justify-content-end'>
                    { paginationBookedRides > 0 ?
                      <button onClick={() => setPaginationBookedRides(paginationBookedRides - 1)} className='btn btn-outline-primary'>Previous</button> : ''
                    }
                    {
                      paginationBookedRides * 5 + 5 < bookedTrips.length ?
                        <button onClick={() => setPaginationBookedRides(paginationBookedRides + 1)} className='btn btn-outline-primary ml-2'>Next</button> : ''
                    }
                  </div> : ''
                }
              </div>
            </section>
          </div>
      }
    </div>
  )
}

export default Dashboard

import React, {useState} from 'react';
import NavBar from "./NavBar";
import axios from "axios";
import {UIStore} from "../../store/store";
import Loading from "./Loading";
import ReactStars from "react-rating-stars-component/dist/react-stars";


const Homepage = () => {
  const isLoggedin = UIStore.useState(s => s.isLoggedin);

  let [from, setFrom] = useState('');
  let [to, setTo] = useState('');
  let [date, setDate] = useState('');
  let [trips, setTrips] = useState([]);
  let [passangerNumber, setPassangerNumber] = useState(1);
  let [loading, setLoading] = useState(false);
  let [userDidSearch, setUserDidSearch] = useState(false);
  let [openModal, setOpenModal] = useState(false);
  let [pageNumber, setPageNumber] = useState(0);
  let [bookTripErrorMessage, setBookTripErrorMessage] = useState('');
  let [driverInfos, setDriverInfos] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    carManufacturer: '',
    carModel: '',
    carColor: '',
    carSize: '',
    stars: 0,
    reviews: [],
  });
  const reactStarsConfig = {
    size: 20,
    edit: false,
    count: 5,
    isHalf: true,
    value: driverInfos.stars,
    color: "black",
    activeColor: driverInfos.stars > 3 ? 'lime' : 'red',
  };

  const SearchTrips = (e) => {
    e.preventDefault();
    let formData = new FormData();


    // if searching date is today send new Date() to backend so the hrs aren't off
    const userDate = new Date(date);
    const nowDate = new Date();
    let dateToUse = new Date(date).getTime();
    if (userDate.getDate() === nowDate.getDate()
        && userDate.getFullYear() === nowDate.getFullYear()
        && userDate.getMonth() === nowDate.getMonth()) {
      dateToUse = nowDate.getTime();
    }

    formData.append('from', from);
    formData.append('to', to);
    formData.append('dateToday', dateToUse);

    const searchTrip = async () => {
      setUserDidSearch(true);
      setLoading(true);
      const response = await axios.post('http://localhost:5000/searchTrips', formData);
      if (response.data.ok) {
        setTrips(response.data.trips);
      }
      setLoading(false);
    }

    searchTrip();
  }
  const updateFrom = (e) => {
    setFrom(e.target.value);
  }
  const updateTo = (e) => {
    setTo(e.target.value);
  }
  const updateDate = (e) => {
    setDate(new Date(e.target.value));
  }
  function formDate(msValue) {
    const date = new Date(msValue)
    const month = date.toLocaleString('default', { month: 'short' });
    const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();

    return `${date.getDate()} ${month} ${date.getFullYear()} ${hours}:${minutes}`
  }
  function computeMinDate() {
    const date = new Date()
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  }
  const incrementSeats = availableSeats => e => {
    e.preventDefault();
    if (passangerNumber < availableSeats) {
      setPassangerNumber(passangerNumber+= 1);
    }
  }
  const decrementSeats = e => {
    e.preventDefault();
    if (passangerNumber > 1) {
      setPassangerNumber(passangerNumber -= 1);
    }
  }
  function bookTrip(tripId, tripPrice, driverId) {
    console.log(driverId);
    let formData = new FormData();

    document.getElementById(`BookTripModal_${tripId}`).classList.remove("show");
    let MyHeaders = {
      'Authorization': "Bearer " + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*'
    };
    const totalPrice = tripPrice * passangerNumber;
    formData.append('tripId', tripId);
    formData.append('bookedSeats', passangerNumber);
    formData.append('tripPrice', totalPrice);
    formData.append('driverId', driverId);

    axios.post('http://localhost:5000/bookTrip', formData, {headers: MyHeaders})
      .then(response => {
        if (response.data.ok) {
          localStorage.setItem('tripBookedSuccessfully', 'true');
          window.location.href = '/dashboard'
        } else {
          setBookTripErrorMessage(response.data.message);
        }
      }).catch((e) => console.error(e));

  }

  const displayDriverInfos = aId => e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('driverId', aId);

    const getDriverInfo = async() => {
      const response = await axios.post('http://localhost:5000/getDriverInfo', formData);
      if (response.data.ok) {
        setDriverInfos(response.data.driverInfos);
        setOpenModal(true);
      }
    }

    getDriverInfo();
  }

  const performCloseButton = (e) => {
    e.preventDefault();
    setOpenModal(false);
  }

  return(
    <div>
      <header>
        <NavBar/>
      </header>
      <section className="how-it-works homepage-hero">
        <div className="header">
          <div className="container">
            <div className="bg">
              <h1>It&apos;s a simple, quick, cheap and fun way to commute together.</h1>
              <p>Connecting people who need to travel with drivers who have empty seats has never been easier. Trusted carpooling.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="find-form">
        <div className="container">
          <div className="find-form-wrapper">
            <form onSubmit={SearchTrips} className="wraping">
              <div className="group-input">
                <input type="text" name="" className="field" placeholder="Leaving from.." onChange={ updateFrom }/>
                <span><img src={process.env.PUBLIC_URL + '/pictures/Icon-Location.png'}/></span>
              </div>
              <div className="group-input">
                <input type="text" name="" className="field" placeholder="Going to.." onChange={ updateTo }/>
                  <span><img src={process.env.PUBLIC_URL + '/pictures/Forma.png'}/></span>
              </div>
              <div className="group-input">
                <input type="date" min={computeMinDate()} className="field" placeholder="Select date" onChange={ updateDate }/>
                  <span><img src={process.env.PUBLIC_URL + '/pictures/Icon-Date.png'}/></span>
              </div>
              <div className="group-input">
                <button type="submit" className="field find-btn">find a ride</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="front-content ride-content">
        <div className="container">
          {bookTripErrorMessage.length ?
            <div className="alert alert-danger text-center" role="alert">
              {bookTripErrorMessage}
            </div> : ''
          }
          {loading ? <Loading/> :
            <div className="row">
              <div className="col-sm-7 col-md-8 col-lg-12 ride-list">
                { userDidSearch && trips.length > 0 ?
                  trips.slice(pageNumber * 5 ,pageNumber * 5 + 5).map((value, index) => {
                    return <div key={value.id}
                                className="shadow-sm border p-3 rounded media ride-item mb-4">
                      <div className="media-left">
                        <img className='ride-img'
                             src={process.env.PUBLIC_URL + 'pictures/user.png'}
                             alt="No Images Available"/>
                      </div>
                      <div className="media-body">
                        <div className="row">
                          <div className="col-md-6 left-content mt-3">
                            <button onClick={displayDriverInfos(value.driver_id)}
                                    data-toggle="modal"
                                    data-target={`#driverInfoModal_${value.id}`} className='btn btn-link p-0'>
                              <h3 className="content-header">
                                {value.driverFirstName} {value.driverLastName}
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                       className="bi bi-info-circle ml-1" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path
                                      d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                  </svg>
                              </h3>
                            </button>
                            <p className="content-city">{value.from} - {value.to}</p>
                            <p className="content-city">{formDate(value.date)}</p>
                          </div>
                          <div className="col-md-6 ml-auto">
                            <div className='row'>
                              <div className="col-8 right-content">
                                <h3 className="price-text">{value.price} RON</h3>
                                <p className="price-count">Per Passenger</p>
                                <p className="seats-avail">{value.seats} Seats Available</p>
                              </div>
                              <div className="col-4 d-flex align-items-center justify-content-center">
                                <button type="button" className="btn btn-outline-primary" data-toggle="modal"
                                        data-target={`#BookTripModal_${value.id}`}>
                                  Book now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {openModal ?
                        <div className="modal fade" id={`driverInfoModal_${value.id}`} tabIndex="-1" role="dialog"
                             aria-labelledby="driverInfoModal" aria-hidden="true">
                          <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Driver Informations</h5>
                              </div>
                              <div className="modal-body">
                                <p>Name: {driverInfos.fullName}</p>
                                <p>Email: {driverInfos.email}</p>
                                <div className='d-flex align-items-center mt-n2 mb-1'>
                                  Rating
                                    <span className='ml-2'>
                                      <ReactStars key={driverInfos.fullName}
                                                  size={20}
                                                  edit={false}
                                                  count={5}
                                                  isHalf={true}
                                                  value={driverInfos.stars}
                                                  color={"black"}
                                                  activeColor={driverInfos.stars > 3 ? 'lime' : 'red'}/>
                                    </span>
                                </div>
                                {driverInfos.reviews.length ?
                                  <div className='py-2'>
                                    <details style={{maxHeight: '300px', overflow: 'auto'}}>
                                      <summary>
                                        Reviews <span className='badge bg-dark text-white'>{driverInfos.reviews.length}</span>
                                      </summary>
                                      { driverInfos.reviews.map((item, index) => {
                                        return <>
                                          <p key={index} className='ml-3'> <span className='font-weight-bold'>&ldquo;{item.review}&rdquo;</span>
                                                  - <i>{item.review_by}</i></p>
                                                <hr/>
                                              </>
                                        })}
                                    </details>
                                  </div> : ''
                                }
                                <p>Car infos:</p>
                                <p className="ml-2">Manufacturer: {driverInfos.carManufacturer}</p>
                                <p className="ml-2">Model: {driverInfos.carModel}</p>
                                <p className="ml-2">Color: {driverInfos.carColor}</p>
                                <p className="ml-2">Size: {driverInfos.carSize}</p>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                              </div>
                            </div>
                          </div>
                        </div> : ''
                      }

                      <div className="modal fade" id={`BookTripModal_${value.id}`} tabIndex="-1" role="dialog"
                           aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalCenterTitle">
                                Trip details
                              </h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              {!isLoggedin &&
                              <>
                                <p className='text-danger font-weight-bold'>
                                  Please
                                  <button onClick={() => window.location.href = '/signin'}
                                          type="button"
                                          className="btn btn-link mb-1 px-1"
                                          data-dismiss="modal"> Log in </button>
                                  or
                                  <button onClick={() => window.location.href = '/signup'}
                                          type="button"
                                          className="btn btn-link mb-1 px-1"
                                          data-dismiss="modal"> Register </button>
                                  in order to Book this trip
                                </p>
                              </>
                              }
                              <p>
                                <span className='font-weight-bold'>From:</span> {value.from}
                              </p>
                              <p>
                                <span className='font-weight-bold'>To:</span> {value.to}
                              </p>
                              <p>
                                <span className='font-weight-bold'>When:</span> {formDate(value.date)}
                              </p>
                              <p className='mt-2'>
                                <span className='font-weight-bold'>Description:</span> {value.description}
                              </p>
                              <p>
                                <span className='font-weight-bold'> Number of passanger: </span>
                                <span>{passangerNumber}</span>
                                <button onClick={incrementSeats(value.seats)}
                                        className='btn btn-sm btn-outline-primary mr-1 ml-1'>+
                                </button>
                                <button onClick={decrementSeats} className='btn btn-sm btn-outline-secondary'>-</button>
                              </p>
                              {/*TODO maybe get number from backend*/}
                              {/*<p className='mt-5'>*/}
                              {/*  Contact driver via*/}
                              {/*  <a href="mailto:someone@yoursite.com"> mail </a>*/}
                              {/*  or*/}
                              {/*  <a href="tel:123-456-7890"> 123-456-7890 </a>*/}
                              {/*  for more informations.*/}
                              {/*</p>*/}
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary mr-1" data-dismiss="modal">Close
                              </button>
                              <button onClick={() => bookTrip(value.id, value.price, value.driver_id)}
                                      type="button"
                                      className="btn btn-primary"
                                      data-dismiss="modal"
                                      disabled={!isLoggedin}>
                                Book! ({value.price * passangerNumber} RON)
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }) : userDidSearch ?
                  <h4 className='text-center'>
                    No trips found for this combination of route/time
                  </h4> : ''
                }
                { userDidSearch && trips.length > 5 ?
                  <div className='d-flex justify-content-end'>
                    { pageNumber > 0 ?
                     <button onClick={() => setPageNumber(pageNumber - 1)} className='btn btn-outline-primary'>Previous</button> : ''
                    }
                    {
                      pageNumber * 5 + 5 < trips.length ?
                        <button onClick={() => setPageNumber(pageNumber + 1)} className='btn btn-outline-primary ml-2'>Next</button> : ''
                    }
                  </div> : ''
                }
              </div>
            </div>

          }
        </div>
      </section>
    </div>
  );
}

export default Homepage

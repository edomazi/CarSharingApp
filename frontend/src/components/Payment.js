import React from 'react';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import PropTypes from 'prop-types';
import axios from "axios";


export default class PaymentForm extends React.Component {
  state = {
    cvc: '',
    expiry: '',
    focus: '',
    name: '',
    number: '',
    tripId: this.props.location.state.tripId,
    price: this.props.location.state.price,
    message: '',
    validCardFrom: true,
  };

  handleInputFocus = (e) => {
    this.setState({ focus: e.target.name });
    this.checkFields();

  }
  makePayment = (e) => {
    e.preventDefault();
    if (this.state.name.length > 5 && this.state.number.length === 16
      && this.state.expiry.length === 4 && this.state.cvc.length === 3 ) {

      const MyHeaders = {
        'Authorization': "Bearer " + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': '*'
      };

      const form = new FormData();
      form.append('tripId', this.state.tripId);

      const makePayment = async() => {
        const response = await axios.post('http://localhost:5000/makePayment', form, {headers: MyHeaders});

        if (response.data.ok) {
          this.state.message = response.data.message;
          setTimeout(() => {
            this.state.message = '';
            window.location.href = '/dashboard';
          }, 3000)
        } else {
          this.state.message = response.data.message;
        }
      }
      makePayment()
    } else {
      this.setState({
        message: 'Fill all the fields'
      });
    }
  }

  checkFields = () => {
    if (this.state.name.length > 5 && this.state.number.length === 16
      && this.state.expiry.length === 4 && this.state.cvc.length === 3 ) {
      this.setState({
        validCardFrom: false,
      });
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.checkFields();
  }

  render() {
    return (
      <div className={'d-flex align-items-center vh-100 size'}>
        <div className={'container text-center col-auto'}>
          <div className={'card shadow-lg p-5'}>
            <div id="PaymentForm">
              <Cards
                cvc={this.state.cvc}
                expiry={this.state.expiry}
                focused={this.state.focus}
                name={this.state.name}
                number={this.state.number}
              />
              {
                this.state.message.length ?
                  <div className="alert alert-info text-center rounded mt-2" role="alert">
                    {this.state.message}
                  </div> : ''
              }
              <form onSubmit={this.makePayment} className='mt-4'>
                <div className="form-group">
                  <label htmlFor="CardNumber">Card Number</label>
                  <input
                    id='CardNumber'
                    className='ml-2 float-right'
                    type="tel"
                    name="number"
                    maxLength='16'
                    minLength='16'
                    placeholder="Card Number"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="CardHolder">Card holder name</label>
                  <input
                    id='CardHolder'
                    className='ml-2 float-right'
                    type="text"
                    name="name"
                    placeholder="Card Name"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="expireDate">Expire Date</label>
                  <input
                    id='expireDate'
                    className='ml-2 float-right'
                    type="tel"
                    name="expiry"
                    maxLength='4'
                    placeholder="expire"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="CCV">CCV</label>
                  <input
                    id='CCV'
                    className='ml-2 float-right'
                    type="tel"
                    name="cvc"
                    maxLength='3'
                    placeholder="ccv"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <button type="submit" className="btn btn-primary float-right">
                  Pay {this.state.price} RON!
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
PaymentForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      tripId: PropTypes.Number,
      price: PropTypes.Number,
    })
  }).isRequired,
};

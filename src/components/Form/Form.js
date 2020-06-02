import React, { PureComponent } from 'react';
import axios from 'axios';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';
import sanitazer from '../../util/sanitizer';

import './Form.scss';

export default class MyForm extends PureComponent {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      status: '',
      token: null,
    };
  }

  submitForm(ev) {
    ev.preventDefault();
    const form = ev.target;
    const data = new FormData(form);
    if (this.state.token) {
      axios({
        method: 'post',
        url: 'https://admin.site.it/wp-json/contact-form-7/v1/contact-forms/4/feedback',
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((res) => {
          form.reset();
          this.setState({ status: 'SUCCESS' });
        })
        .catch((err) => {
          this.setState({ status: 'ERROR' });
        });
    } else {
      this.setState({ status: 'ERROR' });
    }
  }

  render() {
    const { status } = this.state;
    return (
      <GoogleReCaptchaProvider reCaptchaKey="KEY">
        <form className="contactForm" onSubmit={this.submitForm}>
          <div className="contactForm__row">
            <label>{sanitazer('Nome:')}</label>
            <input type="text" name="your-name" />
          </div>
          <div className="contactForm__row">
            <label>{sanitazer('Email:')}</label>
            <input type="email" name="your-email" />
          </div>
          <div className="contactForm__row">
            <label>{sanitazer('Oggetto:')}</label>
            <input type="text" name=" your-subject" />
          </div>
          <div className="contactForm__row">
            <label>{sanitazer('Messaggio:')}</label>
            <textarea type="text" name="your-message" />
          </div>
          {status === 'SUCCESS' ? (
            <div className="contactForm__row">
              <span className="response">{sanitazer('Grazie !')}</span>
            </div>
          ) : (
            <div className="contactForm__row contactForm__row--submit">
              <button className="contactForm__submit">{sanitazer('Invia')}</button>
            </div>
          )}
          {status === 'ERROR' && (
            <div className="contactForm__row">
              <span className="response">{sanitazer("Ooops! C'è stato un errore.")}</span>
            </div>
          )}
          <GoogleReCaptcha onVerify={(resp) => this.setState({ token: resp })} />
        </form>
      </GoogleReCaptchaProvider>
    );
  }
}

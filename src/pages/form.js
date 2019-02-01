import React from 'react';
import isEmail from 'validator/lib/isEmail';
import posed, { PoseGroup } from 'react-pose';

const Message = posed.div({
  enter: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 500 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 500 },
  },
});


const hasContent = value => (value.length >= 3 ? true : false);

const validate = (value, type) =>
  (type === 'email' ? isEmail(value) : hasContent(value));


const encode = (data) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sent: false,
      error: false,
      inquiry: 'general',
      name: '',
      nameValid: null,
      email: '',
      emailValid: null,
      message: '',
      messageValid: null,
    };
  }

  /* Here’s the juicy bit for posting the form submission */

  handleSubmit = e => {
    if(
      this.state.nameValid &&
      this.state.emailValid &&
      this.state.messageValid 
    ) {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "gatsby-contact",
          name: this.state.name,
          email: this.state.email,
          message: this.state.message,
          inquiry: this.state.inquiry,
        })
       
      })
      .then(() => this.setState({
        sent: true,
        error: false,
        name: '',
        nameValid: null,
        email: '',
        emailValid: null,
        message: '',
        messageValid: null,
      }, () => setTimeout(() => this.setState({ sent: false }), 3500)))
      .catch(() => this.setState({
        sent: false,
        error: 'Ooops... Something went wrong, please try again.',
      }));
    } else {
      this.setState(prevState => ({
        sent: false,
        error: 'Please fill out all the fields.',
        name: prevState.name,
        nameValid: prevState.nameValid || false,
        email: prevState.email,
        emailValid: prevState.emailValid || false,
        message: prevState.message,
        messageValid: prevState.messageValid || false,
      }));
    }

    e.preventDefault();
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      [`${e.target.name}Valid`]: validate(e.target.value, e.target.type),
    });
  }

  handleInquiry = e => this.setState({ inquiry: e.target.value });

  render() {
    const {
      name, email, message, sent, error, inquiry
    } = this.state;
    return (
      <form
        name="gatsby-contact"
        data-netlify="true"
        netlify-honeypot="bot-field"
        method="POST"
        onSubmit={this.handleSubmit}
        action="/pages/success.js"
      >
        <input type="hidden" name="form-name" value="gatsby-contact" />
        <p>
          <label>
            general:
            <input type="radio" name="inquiry-type" value="general" onChange={this.handleInquiry} checked={inquiry === 'general'} />
          </label>
          <label>
            quote:
            <input type="radio" name="inquiry-type" value="quote" onChange={this.handleInquiry} checked={inquiry === 'quote'} />
          </label>
        </p>
        <p>
          <label>
            Your Name:
            <input type="text" name="name" value={name} onChange={this.handleChange} />
          </label>
        </p>
        <p>
          <label>
            Your Email:
            <input type="email" name="email" value={email} onChange={this.handleChange} />
          </label>
        </p>
        <p>
          <label>
            Message:
            <textarea name="message" value={message} onChange={this.handleChange} />
          </label>
        </p>
        <p>
        <PoseGroup flipMove={false}>
            {sent &&
              <Message key="message-sent">
                {'Thank you for contacting us, someone will get in touch soon!'}
              </Message>
            }
            {error &&
              <Message key="message-error">
                {error}
              </Message>
            }
          </PoseGroup>
        </p>
        <p>
          <button name="submit" type="submit">Send</button>
        </p>
      </form>
    );
  }
}
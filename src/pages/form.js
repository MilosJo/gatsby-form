import React from 'react';

const encode = (data) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", email: "", message: "" };
  }

  /* Here’s the juicy bit for posting the form submission */

  handleSubmit = e => {
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "gatsby-contact", ...this.state, })
     
    })
      .then(() => alert("Success!"))
      .catch(error => alert(error));

    e.preventDefault();
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { name, email, message } = this.state;
    return (
      <form
        name="gatsby-contact"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        method="POST"
        onSubmit={this.handleSubmit}
      >
        <input type="hidden" name="form-name" value="gatsby-contact" />
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
          <button name="submit" type="submit">Send</button>
        </p>
      </form>
    );
  }
}
import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  getUserName = event => {
    this.setState({username: event.target.value})
  }

  renderUserName = () => {
    const {username} = this.state

    return (
      <div className="input-container">
        <label htmlFor="username">USERNAME</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={this.getUserName}
        />
      </div>
    )
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  renderPassword = () => {
    const {password} = this.state

    return (
      <div className="input-container">
        <label htmlFor="password">PASSWORD</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={this.getPassword}
        />
      </div>
    )
  }

  submitLoginForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      this.successSubmit(data.jwt_token)
    } else {
      this.failureSubmit(data.error_msg)
    }
  }

  successSubmit = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})

    history.replace('/')
  }

  failureSubmit = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  render() {
    const {showSubmitError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitLoginForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />

          {this.renderUserName()}
          {this.renderPassword()}

          <button type="submit" className="login-button">
            Login
          </button>

          {showSubmitError && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login

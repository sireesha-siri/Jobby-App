import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProfileDetails extends Component {
  state = {status: apiStatus.initial, profileDetailsList: {}}

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({status: apiStatus.loading})

    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        status: apiStatus.success,
        profileDetailsList: formattedData,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  getProfileStatus = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.success:
        return this.getSuccessProfileView()
      case apiStatus.failure:
        return this.getFailureProfileView()
      case apiStatus.loading:
        return this.getLoadingProfileView()
      default:
        return null
    }
  }

  getSuccessProfileView = () => {
    const {profileDetailsList} = this.state

    const {name, profileImageUrl, shortBio} = profileDetailsList

    return (
      <div className="profile-details-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  getFailureProfileView = () => (
    <div className="profile-failure-container">
      <button className="retry-button" type="button" onClick={this.getProfile}>
        Retry
      </button>
    </div>
  )

  getLoadingProfileView = () => (
    <div className="loader-container-profile" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return <div>{this.getProfileStatus()}</div>
  }
}

export default ProfileDetails

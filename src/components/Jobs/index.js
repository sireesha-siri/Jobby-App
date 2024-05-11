import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'

import ProfileDetails from '../ProfileDetails'
import Filters from '../Filters'
import JobCard from '../JobCard'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Jobs extends Component {
  state = {
    status: apiStatus.initial,
    employmentTypeList: [],
    salaryRange: '',
    searchInput: '',
    jobsDataList: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({status: apiStatus.loading})

    const jwtToken = Cookies.get('jwt_token')

    const {employmentTypeList, salaryRange, searchInput} = this.state

    const employmentType = employmentTypeList.join(',')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      const formattedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({status: apiStatus.success, jobsDataList: formattedData})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  updateEmploymentType = id => {
    this.setState(prevState => {
      const isChecked = prevState.employmentTypeList.includes(id)
      if (isChecked) {
        return {
          employmentTypeList: prevState.employmentTypeList.filter(
            item => item !== id,
          ),
        }
      }
      return {
        employmentTypeList: [...prevState.employmentTypeList, id],
      }
    }, this.getJobs)
  }

  updateSalaryRange = id => {
    this.setState({salaryRange: id}, this.getJobs)
  }

  getSideProfileBar = () => (
    <div className="side-bar">
      {this.renderSearchBar('smallSearchBar')}
      <ProfileDetails />
      <Filters
        updateEmploymentType={this.updateEmploymentType}
        updateSalaryRange={this.updateSalaryRange}
      />
    </div>
  )

  getNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  getJobDetailsSuccessView = () => {
    const {jobsDataList} = this.state

    return (
      <>
        {jobsDataList.length > 0 ? (
          <ul className="jobs-list">
            {jobsDataList.map(each => (
              <JobCard key={each.id} jobDetails={each} />
            ))}
          </ul>
        ) : (
          this.getNoJobsView()
        )}
      </>
    )
  }

  getJobDetailsFailureView = () => (
    <div className="jobs-api-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-api-failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={() => this.getJobs()}
      >
        Retry
      </button>
    </div>
  )

  getJobDetailsLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobsDetailsStatus = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.success:
        return this.getJobDetailsSuccessView()
      case apiStatus.failure:
        return this.getJobDetailsFailureView()
      case apiStatus.loading:
        return this.getJobDetailsLoadingView()
      default:
        return null
    }
  }

  renderSearchBar = searchBarID => {
    const {searchInput} = this.state
    return (
      <div className="search-bar" id={searchBarID}>
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={e => this.setState({searchInput: e.target.value})}
        />
        <button
          className="search-button"
          type="button"
          data-testid="searchButton"
          aria-label="search"
          onClick={() => this.getJobs()}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="jobs-page-container">
        <Header />

        <div className="jobs-page">
          {this.getSideProfileBar()}
          <div className="jobs-container">
            {this.renderSearchBar('largeSearchBar')}
            {this.getJobsDetailsStatus()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs

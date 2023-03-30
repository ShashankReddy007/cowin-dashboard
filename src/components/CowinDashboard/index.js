// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiConstants = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}

class CowinDashboard extends Component {
  state = {apiStatus: apiConstants.initial, data: {}}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiConstants.inProgress})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachData => ({
            vaccineDate: eachData.vaccine_date,
            dose1: eachData.dose_1,
            dose2: eachData.dose_2,
          }),
        ),

        vaccinationByAge: fetchedData.vaccination_by_age.map(eachData => ({
          age: eachData.age,
          count: eachData.count,
        })),

        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          eachData => ({
            count: eachData.count,
            gender: eachData.gender,
          }),
        ),
      }

      this.setState({data: updatedData, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
      alt="not-found"
    />
  )

  renderVaccinationStats = () => {
    const {data} = this.state
    console.log(data)
    return (
      <>
        <VaccinationCoverage vaccineData={data.last7DaysVaccination} />
        <VaccinationByGender vaccineData={data.vaccinationByGender} />
        <VaccinationByAge vaccineData={data.vaccinationByAge} />
      </>
    )
  }

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return this.renderVaccinationStats()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    return (
      <div className="bg-container">
        <h1>CoWIN vaccination in India</h1>
        {this.renderViewsBasedOnAPIStatus()}
      </div>
    )
  }
}

export default CowinDashboard

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const Filters = props => {
  const {updateEmploymentType, updateSalaryRange} = props

  const getTypeOfEmployment = () => (
    <>
      <h1 className="filter-heading">Type of Employment</h1>

      <ul className="filters-list">
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId} className="filters-list-item">
            <input
              type="checkbox"
              className="checkbox-input"
              id={each.employmentTypeId}
              onChange={() => updateEmploymentType(each.employmentTypeId)}
            />

            <label htmlFor={each.employmentTypeId} className="filter-label">
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  )

  const getSalaryRange = () => (
    <>
      <h1 className="filter-heading">Salary Range</h1>

      <ul className="filters-list">
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId} className="filters-list-item">
            <input
              type="radio"
              className="checkbox-input"
              id={each.salaryRangeId}
              name="salary-range"
              onChange={() => updateSalaryRange(each.salaryRangeId)}
            />

            <label htmlFor={each.salaryRangeId} className="filter-label">
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <div className="filters-group-container">
      <hr className="separator" />

      {getTypeOfEmployment()}

      <hr className="separator" />

      {getSalaryRange()}
    </div>
  )
}

export default Filters

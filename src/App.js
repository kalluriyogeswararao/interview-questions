import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    apiStatus: apiStatusConstraints.initial,
    dataList: [],
  }

  componentDidMount() {
    this.onGetFetchData()
  }

  onGetFetchData = async () => {
    this.setState({apiStatus: apiStatusConstraints.inprogress})

    const url = `https://apis.ccbp.in/tg/packages`
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.packages.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        description: each.description,
        name: each.name,
      }))
      this.setState({
        dataList: updatedData,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  onRenderInprogress = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  onRenderTravelGuide = () => {
    const {dataList} = this.state

    return (
      <ul className="all-data">
        {dataList.map(item => (
          <li className="list" key={item.id}>
            <img src={item.imageUrl} alt={item.name} className="image" />
            <h1 className="name">{item.name}</h1>
            <p className="description">{item.description}</p>
          </li>
        ))}
      </ul>
    )
  }

  onRenderDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstraints.inprogress:
        return this.onRenderInprogress()
      case apiStatusConstraints.success:
        return this.onRenderTravelGuide()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <h1 className="main-heading">Travel Guide</h1>
        {this.onRenderDetails()}
      </div>
    )
  }
}

export default App

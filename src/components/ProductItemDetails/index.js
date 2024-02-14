// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {RiStarSFill} from 'react-icons/ri'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    products: {},
    similarProductData: [],
    cartCount: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(apiUrl, options)
    console.log(response)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormatData(data)
      const similarProducts = data.similar_products.map(each =>
        this.getFormatData(each),
      )
      this.setState({
        products: updatedData,
        similarProductData: similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getFormatData = storedData => ({
    availability: storedData.availability,
    brand: storedData.brand,
    description: storedData.description,
    id: storedData.id,
    imageUrl: storedData.image_url,
    price: storedData.price,
    rating: storedData.rating,
    style: storedData.style,
    title: storedData.title,
    reviews: storedData.total_reviews,
  })

  increment = () => {
    this.setState(prevState => ({cartCount: prevState.cartCount + 1}))
  }

  decrement = () => {
    const {cartCount} = this.state
    if (cartCount > 1) {
      this.setState(prevState => ({cartCount: prevState.cartCount - 1}))
    }
  }

  rendersuccessDetails = () => {
    const {similarProductData, products, cartCount} = this.state

    const {
      imageUrl,
      title,
      price,
      rating,
      reviews,
      description,
      brand,
      availability,
    } = products
    return (
      <div>
        <div className="success-con">
          <div>
            <img src={imageUrl} alt="product" className="main-img" />
          </div>
          <div className="text-con">
            <h1>{title}</h1>
            <p>RS{price}</p>
            <div className="rating-review">
              <div className="rating-con">
                <p>{rating}</p>
                <RiStarSFill />
              </div>
              <p>{reviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <hr />

            <div className="btn-container">
              <button
                id="decrementBtn"
                type="button"
                className="btn"
                aria-label="Decrease quantity"
                data-testid="minus"
                onClick={this.decrement}
              >
                <BsDashSquare className="btn-icons" />
              </button>
              <p className="number" id="quantity">
                {cartCount}
              </p>
              <button
                id="incrementBtn"
                type="button"
                className="btn"
                aria-label="Increase quantity"
                data-testid="plus"
                onClick={this.increment}
              >
                <BsPlusSquare className="btn-icons" />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div>
          <h1 className="si-heading">Similar Products</h1>
          <ul className="ul-similar">
            {similarProductData.map(eachProduct => (
              <SimilarProductItem
                itemDetails={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-img"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="add-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.rendersuccessDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />

        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails

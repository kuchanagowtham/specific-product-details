// Write your code here
import {RiStarSFill} from 'react-icons/ri'
import './index.css'

const SimilarProductItem = props => {
  const {itemDetails} = props
  const {imageUrl, title, brand, price, rating} = itemDetails
  return (
    <li className="li-container">
      <img src={imageUrl} className="similar-image" alt="similar product" />
      <h1 className="similar-heading">{title}</h1>
      <p className="brand">by {brand}</p>
      <div className="price-rating">
        <p>Rs {price}</p>
        <div className="rating-con">
          <p>{rating}</p>
          <RiStarSFill />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ViewDollar } from '../../../utils'
import { getImageByidService } from '../../../services/images.services'
import './CardProducto.css'
import { Link } from 'react-router-dom'
const CardProducto = ({ producto }) => {
  CardProducto.propTypes = {
    producto: PropTypes.object,
  }
  const [imagesBase64, setimagesBase64] = useState(null)

  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    if (producto.image_id) {
      console.log('SI')
      getImage()
    }
  }, [])
  console.log(producto.image_id)

  const getImage = async () => {
    try {
      setisLoading(true)
      const r = await getImageByidService(producto.image_id)
      console.log(r.data)
      setimagesBase64(r.data.image)
    } catch (error) {
      console.log(error)
    } finally {
      setisLoading(false)
    }
  }

  return (
    <div key={producto._id} className="col-md-4">
      <div className="card text-dark h-100">
        {producto.image_id && !isLoading && (
          <img
            className="card-img-top"
            style={{ height: '350px' }}
            src={`${imagesBase64}`}
            alt="Title"
          />
        )}
        <div className="card-body">
          <h4 className="card-title">{producto?.name}</h4>
          <p className="card-text">{ViewDollar(producto?.price)}</p>
          <Link to={`/eco/${producto._id}/producto`}>
            <button className="button-ecomerce">
              <i className="fa-solid fa-eye"></i>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CardProducto

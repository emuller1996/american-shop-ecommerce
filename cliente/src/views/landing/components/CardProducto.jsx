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

  const renderGender = () => {
    switch (producto?.gender) {
      case 'men':
        return {
          icon: <i className="fa-solid fa-mars me-2 fa-xl" style={{ color: '#2a95ff' }} />,
          text: 'Hombre',
        }
      case 'women':
        return {
          icon: <i className="fa-solid fa-venus me-2 fa-xl" style={{ color: '#ff2a8b' }} />,
          text: 'Mujer / Dama',
        }
      case 'kid':
        return {
          icon: <i className="fa-solid fa-children me-2 fa-xl" style={{ color: '#a869e4' }} />,
          text: 'Niño / Niña',
        }
      default:
        return { icon: null, text: '' }
    }
  }

  const genderInfo = renderGender()

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
    <div key={producto._id} className="col-6 col-sm-6 col-md-4 ">
      <div className="card text-dark h-100 card-product shadow-sm">
        <div
          className="product-image-container"
          style={{ height: '300px', overflow: 'hidden', position: 'relative' }}
        >
          {producto.image_id && !isLoading ? (
            <img
              className="card-img-top product-img-zoom"
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              src={`${imagesBase64}`}
              alt={producto?.name}
            />
          ) : (
            <div className="p-2 h-100 d-flex align-items-center justify-content-center">
              <img
                className="card-img-top"
                style={{ height: '200px', opacity: '0.2', objectFit: 'contain' }}
                src={`https://esmuller.cloud/assets/Logo-LBxHafXJ.png`}
                alt="No image available"
              />
            </div>
          )}
        </div>
        <div className="card-body d-flex flex-column justify-content-between mt-2">
          <div>
            <h4 className="card-title fs-5 text-truncate" title={producto?.name}>
              {producto?.name}
            </h4>
            <p className="card-text m-0 fs-5 fw-bold text-primary">{ViewDollar(producto?.price)}</p>
            <p className="card-text text-center m-0 text-muted small">
              {producto?.categoria?.name}
            </p>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="card-text text-muted small">{genderInfo.text}</span>
            <div className="gender-icon">{genderInfo.icon}</div>
          </div>

          <div className="text-center mt-3">
            <Link to={`/eco/${producto._id}/producto`}>
              <button className="button-ecomerce w-100">
                <i className="fa-solid fa-eye me-2"></i> Ver Detalle
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardProducto

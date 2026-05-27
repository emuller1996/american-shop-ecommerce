/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Card, Col, Row } from 'react-bootstrap'
import { ViewDollar } from '../../../../../utils'

const RelatedProductsComponent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`/productos/${id}/relacionados`)

        if (Array.isArray(response.data)) {
          const filtered = response.data.filter((product) => product._id !== id)
          setRelatedProducts(filtered)
        } else {
          console.error('Expected an array of related products, but received:', response.data)
        }
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchRelatedProducts()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="text-center my-4">
        <div className="spinner-border" role="status" style={{ color: '#5b64db' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="related-products-container mt-5 mb-5">
      <h4 className="text-center mb-4 fw-bold">Productos Relacionados</h4>
      <Row className="flex-nowrap overflow-auto pb-3" style={{ scrollSnapType: 'x mandatory' }}>
        {relatedProducts.map((product) => (
          <Col
            key={product._id}
            xs={6}
            md={3}
            lg={2}
            className="mb-4"
            style={{ scrollSnapAlign: 'start', minWidth: '160px' }}
          >
            <Card
              className="h-100 shadow-sm border-0 product-card-related"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div
                className="product-img-container"
                style={{ height: '200px', overflow: 'hidden', borderRadius: '8px' }}
              >
                <img
                  src={product.image || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <Card.Body className="text-center p-2">
                <Card.Title
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product.name}
                </Card.Title>
                <Card.Text className="fw-bold text-primary">{ViewDollar(product.price)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <style>{`
        .product-card-related:hover {
          transform: translateY(-5px);
        }
        .flex-nowrap {
          flex-wrap: nowrap !important;
        }
        .overflow-auto {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        .overflow-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

export default RelatedProductsComponent
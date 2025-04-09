/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  patchCreatePuntoVentaService,
  postCreatePuntoVentaService,
} from '../../../services/punto_venta.services'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import PropTypes from 'prop-types'
import L from 'leaflet'

// Definir el icono personalizado
const customIcon = new L.Icon({
  iconUrl: 'https://eventos.esmuller.cloud/favicon.png', // Cambia esto por la ruta de tu imagen
  iconSize: [42, 42], // Tamaño del icono
  iconAnchor: [16, 32], // Punto de anclaje
  popupAnchor: [0, -32], // Punto de anclaje del popup
})
function LocationPicker({ setCoordinates }) {
  LocationPicker.propTypes = {
    setCoordinates: PropTypes.func,
  }
  useMapEvents({
    click(e) {
      setCoordinates(e.latlng) // Obtiene las coordenadas donde el usuario haga clic
    },
  })

  return null
}
export default function FormPuntosVenta({ onHide, getAllPuntosVenta, puntoVenta }) {
  FormPuntosVenta.propTypes = {
    onHide: PropTypes.func,
    getAllPuntosVenta: PropTypes.func,
    puntoVenta: PropTypes.object,
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [coordinates, setCoordinates] = useState(puntoVenta ? puntoVenta.coordinates : null)
  const onSubmit = async (data) => {
    console.log(data)
    if (!coordinates) {
      return toast.error('Selecionar la Direccion en el Mapa')
    }
    data.coordinates = coordinates
    if (!puntoVenta) {
      try {
        const result = await postCreatePuntoVentaService(data)
        console.log(result.data)
        toast.success(result.data.message)
        onHide()
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const result = await patchCreatePuntoVentaService(puntoVenta._id, data)
        console.log(result.data)
        toast.success(result.data.message)
        onHide()
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-center border-bottom pb-2">Creando Punto Venta</p>
      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nombre Punto Venta</Form.Label>
            <Form.Control
              {...register('name', { required: true })}
              type="text"
              placeholder="Movistar Arena"
              defaultValue={puntoVenta?.name}
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Label>Tipo</Form.Label>
          <Form.Select
            {...register('type_sales_point', { required: true })}
            aria-label="Default select example"
            defaultValue={puntoVenta?.type_sales_point}
          >
            <option selected value="punto_venta">
              Punto de Venta
            </option>
            <option value="taquilla">Taquilla</option>
          </Form.Select>
        </div>
      </div>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Descripcion del Punto Venta</Form.Label>

        <Form.Control
          defaultValue={puntoVenta?.description}
          {...register('description')}
          as="textarea"
          rows={3}
        />
      </Form.Group>

      <p className="text-primary text-center border-bottom border-primary pb-2">Ubicacion</p>

      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Cuidad</Form.Label>
            <Form.Control
              {...register('city')}
              type="text"
              placeholder="Bogota"
              defaultValue={puntoVenta?.city}
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Direccion</Form.Label>
            <Form.Control
              {...register('address')}
              type="text"
              placeholder="Cra 43"
              defaultValue={puntoVenta?.address}
            />
          </Form.Group>
        </div>
        <div className="col-12 mb-3">
          <div style={{ height: '500px', width: '100%' }}>
            <MapContainer center={[4, -74]} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {coordinates && (
                <Marker icon={customIcon} position={[coordinates.lat, coordinates.lng]} />
              )}
              <LocationPicker setCoordinates={setCoordinates} />
            </MapContainer>
          </div>
          {coordinates?.lat}
          {coordinates?.lng}
        </div>
      </div>

      <div className="mt-5 d-flex gap-4 justify-content-center">
        <button type="button" onClick={onHide} className="btn btn-danger text-white">
          Cancelar
        </button>
        <Button type="submit" className="text-white" variant="success">
          Guardar Punto Venta.
        </Button>
      </div>
    </form>
  )
}

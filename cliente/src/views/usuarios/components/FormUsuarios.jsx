/* eslint-disable prettier/prettier */
import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { postCreatePuntoVentaService } from '../../../services/punto_venta.services'
import { postCreateUsuariosService } from '../../../services/usuarios.services'
import PropTypes from 'prop-types'

export default function FormUsuarios({ onHide }) {

  FormUsuarios.propTypes = {
    onHide: PropTypes.func,
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    console.log(data)
    postCreateUsuariosService
    try {
      const result = await postCreateUsuariosService(data)
      console.log(result.data);
      toast.success(result.data.message)
     onHide()
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-center border-bottom pb-2">Creando Usuario</p>
      <div className="row">
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              {...register('name', { required: true })}
              type="text"
              placeholder="Movistar Arena"
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Label htmlFor='type_sales_point'>Rol</Form.Label>
          <Form.Select
            {...register('role', { required: true })}
            aria-label="Default select example"
            id='type_sales_point'
          >
            <option selected value="Administrador">
              Administrador
            </option>
            <option value="Usuario">Usuario</option>
          </Form.Select>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              {...register('email', { required: true })}
              type="text"
              placeholder="jjose@corre.com"
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              {...register('password', { required: true })}
              type="password"
              placeholder=""
            />
          </Form.Group>
        </div>
      </div>


    

      <div className="mt-5 d-flex gap-4 justify-content-center">
        <button type="button" onClick={onHide} className="btn btn-danger text-white">
          Cancelar
        </button>
        <Button type="submit" className="text-white" variant="success">
          Guardar Usuario.
        </Button>
      </div>
    </form>
  )
}

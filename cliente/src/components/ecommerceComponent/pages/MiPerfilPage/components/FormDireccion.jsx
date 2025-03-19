/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import CurrencyInput from 'react-currency-input-field'
import Select from 'react-select'
import toast from 'react-hot-toast'
import { genderOptions, stylesSelect, themeSelect } from '../../../../../utils/optionsConfig'
import axios from 'axios'
import { useClientes } from '../../../../../hooks/useClientes'

export default function FormDireccion({ onHide, AllAddress }) {
  FormDireccion.propTypes = {
    onHide: PropTypes.func,
    AllAddress: PropTypes.func,
  }
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const { postClienteNewAddress } = useClientes()

  const [optionDepartament, setOptionDepartament] = useState(null)
  const [optionCities, setOptionCities] = useState(null)
  const [DepartamentSelect, setDepartamentSelect] = useState(null)

  useEffect(() => {
    getAllDepartementos()
  }, [])

  useEffect(() => {
    if (DepartamentSelect) {
      getAllCityByDepartementos(DepartamentSelect)
    }
  }, [DepartamentSelect])

  const onSubmit = async (data) => {
    console.log(data)
    try {
      await postClienteNewAddress(data)
      onHide()
      toast.success(`Direccion de Envio Creada Correctamente.`)
      AllAddress()
    } catch (error) {
      console.log(error)
    }
  }

  const getAllCityByDepartementos = async (id) => {
    try {
      const result = await axios.get(`https://api-colombia.com/api/v1/Department/${id}/cities`)
      console.log(result.data)
      setOptionCities(
        result.data.map((c) => {
          return {
            label: c.name,
            value: c.id,
            key: c.name,
          }
        }),
      )
    } catch (error) {
      console.log(error)
    }
  }

  const getAllDepartementos = async () => {
    try {
      const result = await axios.get('https://api-colombia.com/api/v1/Department')
      console.log(result.data)
      setOptionDepartament(
        result.data.map((c) => {
          return {
            label: c.name,
            value: c.id,
            key: c.name,
          }
        }),
      )
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-center border-bottom pb-2">Crear Nueva Direcciones de Envio</p>
      <div className="row g-3">
        <div className="col-md-12">
          <Form.Group className="" controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              {...register('name', { required: true })}
              type="text"
              placeholder="Mi Casa, Trabajo , Oficia"
            />
          </Form.Group>
        </div>

        <div className="col-md-12">
          <div>
            <Form.Label htmlFor="departament">Departamento</Form.Label>
            <Controller
              name="departament"
              rules={{ required: true }}
              control={control}
              render={({ field: { name, onChange, ref } }) => {
                return (
                  <Select
                    ref={ref}
                    id={name}
                    name={name}
                    placeholder=""
                    onChange={(e) => {
                      console.log(e)
                      onChange(e?.label)
                      setDepartamentSelect(e.value)
                    }}
                    styles={stylesSelect}
                    theme={themeSelect}
                    options={optionDepartament}
                  />
                )
              }}
            />
          </div>
        </div>
        <div className="col-md-12">
          <div>
            <Form.Label htmlFor="city">Cuidad</Form.Label>
            <Controller
              name="city"
              rules={{ required: true }}
              control={control}
              render={({ field: { name, onChange, ref } }) => {
                return (
                  <Select
                    ref={ref}
                    id={name}
                    name={name}
                    placeholder=""
                    onChange={(e) => {
                      console.log(e)
                      onChange(e?.label)
                    }}
                    styles={stylesSelect}
                    theme={themeSelect}
                    options={optionCities}
                  />
                )
              }}
            />
          </div>
        </div>
        <div className="col-md-12">
          <Form.Group className="" controlId="address">
            <Form.Label>Direccion</Form.Label>
            <Form.Control {...register('address', { required: true })} type="text" placeholder="" />
          </Form.Group>
        </div>
        <div className="col-md-12">
          <Form.Group className="" controlId="neighborhood">
            <Form.Label>Barrio</Form.Label>
            <Form.Control {...register('neighborhood')} type="text" placeholder="" />
          </Form.Group>
        </div>
        <div className="col-md-12">
          <Form.Group className="" controlId="reference">
            <Form.Label>Referencia</Form.Label>
            <Form.Control {...register('reference')} type="text" placeholder="" />
          </Form.Group>
        </div>
      </div>

      <div className="mt-5 d-flex gap-4 justify-content-center">
        <button type="button" onClick={onHide} className="btn btn-danger text-white">
          Cancelar
        </button>
        <Button type="submit" className="text-white" variant="success">
          Guardar Producto
        </Button>
      </div>
    </form>
  )
}

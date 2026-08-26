/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Form,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from 'react-bootstrap'
import Select from 'react-select'
import {
  StatusOrderOptions,
  stylesSelect,
  themeSelect,
  TransportistaOptions,
} from '../../../../utils/optionsConfig'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'

FormChangeStatus.propTypes = {
  changeStatusOrder: PropTypes.func,
  idOrder: PropTypes.string,
  order: PropTypes.object,
  refreshOrder: PropTypes.func,
}

export default function FormChangeStatus({ changeStatusOrder, idOrder, order, refreshOrder }) {
  const [modal, setModal] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    console.log({ ...data, status: 'En Camino' })
    try {
      await changeStatusOrder(idOrder, { ...data, status: 'En Camino' })
      toast.success(`Se ha cambiado de estado la Orden.`)
      await refreshOrder()
      setModal(false)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(errors)

  return (
    <>
      <Form.Label htmlFor="status">Cambiar de Estado</Form.Label>
      <Select
        name={'status'}
        id="status"
        placeholder=""
        defaultValue={StatusOrderOptions.find((sta) => sta.value === order?.status)}
        onChange={async (e) => {
          try {
            if (e.value === 'En Camino') {
              setModal(true)
              return false
            }
            await changeStatusOrder(idOrder, { status: e?.value })
            await refreshOrder()
            toast.success(`Se ha cambiado de estado la Orden.`)
          } catch (error) {
            console.log(error)
          }
        }}
        styles={stylesSelect}
        theme={themeSelect}
        options={StatusOrderOptions}
      />
      <Modal centered show={modal} onHide={() => setModal(false)}>
        <ModalHeader closeButton>Cambiar de estado la orden a en camino</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="mb-1" htmlFor="transportadora">
                Transportadora
              </label>
              <Controller
                name="transportadora"
                control={control}
                rules={{ required: 'Transportista es Obligatorio ' }}
                render={({ field }) => (
                  <Select
                    name={'transportadora'}
                    id="transportadora"
                    placeholder=""
                    onChange={(value) => {
                      field.onChange(value?.value || '')
                    }}
                    isClearable
                    inputId="transportadora"
                    options={TransportistaOptions}
                    styles={stylesSelect}
                    theme={themeSelect}
                  />
                )}
              />
              <span className="text-danger mt-1">{errors?.transportadora?.message}</span>
            </div>

            <div className="mb-3">
              <FormLabel htmlFor="numero_guia">Número de Guía</FormLabel>
              <FormControl
                isValid={!errors?.numero_guia}
                id="numero_guia"
                {...register('numero_guia', { required: true })}
              />
            </div>

            <div className="mb-3">
              <FormLabel htmlFor="fecha_envio">Fecha de Envio</FormLabel>
              <FormControl
                isValid={!errors?.fecha_envio}
                id="fecha_envio"
                type="date"
                {...register('fecha_envio', { required: true })}
              />
            </div>

            <div className="text-center">
              <Button disabled={isSubmitting} type="submit" variant="outline-primary">
                {isSubmitting ? (
                  <>
                    <Spinner size='sm' />
                  </>
                ) : (
                  'Cambiar de Estado'
                )}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  )
}

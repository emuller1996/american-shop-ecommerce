/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import { usePublicaciones } from '../../../hooks/usePublicaciones'

export default function FormPublicacion({ onHide, publicacion }) {
  FormPublicacion.propTypes = {
    onHide: PropTypes.func,
    publicacion: PropTypes.object,
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const { createPublicacion, updatePublicacion } = usePublicaciones()

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    if (!publicacion && !selectedFile) {
      return toast.error('Selecciona una imagen para la publicación.')
    }

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('subtitle', data.subtitle ?? '')
    formData.append('description', data.description ?? '')
    formData.append('posicion_imagen', data.posicion_imagen)
    formData.append('published', data.published ? 'true' : 'false')
    if (data.orden !== '' && data.orden !== undefined) formData.append('orden', data.orden)
    if (selectedFile) formData.append('image', selectedFile)

    try {
      if (!publicacion) {
        const result = await createPublicacion(formData)
        toast.success(result.data.message)
      } else {
        const result = await updatePublicacion(publicacion._id, formData)
        toast.success(result.data.message)
      }
      onHide()
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message ?? 'No se pudo guardar la publicación.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-center border-bottom pb-2">
        {publicacion ? 'Actualizando Publicación' : 'Creando Publicación'}
      </p>
      <div className="row g-3">
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Título</Form.Label>
            <Form.Control
              defaultValue={publicacion?.title}
              {...register('title', { required: true })}
              type="text"
              placeholder="AmericanShop Comercio Electrónico"
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group className="mb-3" controlId="subtitle">
            <Form.Label>Subtítulo</Form.Label>
            <Form.Control
              defaultValue={publicacion?.subtitle}
              {...register('subtitle')}
              type="text"
              placeholder="Te Viste Real y te Deja de Paker!!"
            />
          </Form.Group>
        </div>
        <div className="col-md-8">
          <Form.Label>Posición de la Imagen</Form.Label>
          <Form.Select
            {...register('posicion_imagen', { required: true })}
            defaultValue={publicacion?.posicion_imagen ?? 'derecha'}
          >
            <option value="derecha">Imagen Derecha / Texto Izquierda</option>
            <option value="izquierda">Imagen Izquierda / Texto Derecha</option>
          </Form.Select>
        </div>
        <div className="col-md-4">
          <Form.Group className="mb-3" controlId="orden">
            <Form.Label>Orden</Form.Label>
            <Form.Control
              defaultValue={publicacion?.orden}
              {...register('orden')}
              type="number"
              placeholder="1"
            />
          </Form.Group>
        </div>
      </div>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          defaultValue={publicacion?.description}
          {...register('description')}
          as="textarea"
          rows={3}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="published">
        <Form.Check
          type={'checkbox'}
          id={`published`}
          label={`¿Publicado?`}
          defaultChecked={publicacion ? publicacion?.published : true}
          {...register('published')}
        />
      </Form.Group>

      <div className="mb-4">
        <label htmlFor="image" className="form-label">
          Imagen de la Publicación
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="form-control"
          id="image"
        />

        {(previewUrl || publicacion?.image) && (
          <div className="d-flex justify-content-center my-4">
            <img
              src={previewUrl || publicacion?.image}
              alt="Preview"
              style={{ maxWidth: '500px', minWidth: '300px' }}
              className="img-fluid"
            />
          </div>
        )}
      </div>

      <div className="mt-4 d-flex gap-4 justify-content-center">
        <Button
          variant="contained"
          color="error"
          type="button"
          onClick={onHide}
          className="btn btn-danger text-white"
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          loading={isSubmitting}
          color="success"
          type="submit"
          className="text-white"
        >
          Guardar Publicación
        </Button>
      </div>
    </form>
  )
}

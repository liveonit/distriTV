import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { InstitutionT } from 'src/store/institution/institution.type'
import { Alert } from '@mui/material'

type IProps = {
  handleCloseEditModal: () => void
  institution: InstitutionT
  titulo: string
}

const arr = ['Montevideo', 'Paysandú']

export default function InstitutionCreateAndEditModal({ handleCloseEditModal, institution, titulo }: IProps) {

  const [error, setError] = useState(false)

  const institutionInitialState: InstitutionT = institution ? institution : { name: '', city: '', locality: '' }

  const [localInstitution, setLocalInstitution] = useState<InstitutionT>(institutionInitialState)

  function handleSaveInstitution() {
    if (localInstitution.city.length == 0 || localInstitution.name.length == 0 || localInstitution.city != undefined) {
      setError(true)
    }
    else {
      if (institution) { //si es distinto de nulo es editar
        console.log('EDITAR');
        console.log(localInstitution)
      } else {
        console.log('CREAR')
        console.log(localInstitution)

      }
      handleCloseEditModal()
    }
  }

  const handleInstitutionChange = (attribute: string, value: string) => setLocalInstitution({ ...localInstitution, [attribute]: value })

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={true} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h6' color='textPrimary'>
            {titulo}
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth id='txtName' name='txtName' label='Nombre'
                variant='outlined' value={localInstitution.name}
                error={!localInstitution.name} helperText={!localInstitution.name && 'El nombre de la institucion es requerido.'}
                onChange={e => handleInstitutionChange('name', e.target.value as string)} />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='demo-simple-select-outlined-label'>Departamento</InputLabel>
                <Select
                  fullWidth
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  label='Severity'
                  value={localInstitution.city}
                  onChange={e => handleInstitutionChange('city', e.target.value as string)}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>

                  {arr.map(dep => <MenuItem value={dep}>{dep}</MenuItem>)}

                </Select>
              </FormControl>
            </Grid>
          </Grid> <br />
          <Grid item xs={12}>
            <TextField fullWidth id='txtLocality' label='Localidad'
              name='txtLocality' variant='outlined' value={localInstitution.locality} onChange={e => handleInstitutionChange('locality', e.target.value as string)} />
          </Grid>
        </DialogContent>
        <DialogActions>
          {error ?
            <Alert severity="error">Error: uno o más campos no han sido completados</Alert> : ''}

          <Button
            onClick={() => { handleCloseEditModal(); setError(false); }} color='primary'>
            Cerrar
          </Button>
          <Button onClick={handleSaveInstitution}
            variant='contained' color='primary' size='small'>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

import React from 'react'
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

type IProps = {
  isOpen: boolean
  handleCloseEditModal: () => void
  institution: InstitutionT
  titulo: string
}

const arr = ['Montevideo','Paysandú']

const newInstitution: InstitutionT = {
  name: '',
  city: '',
  locality: '',

}



export default function InstitutionEditModal({ isOpen, handleCloseEditModal, institution, titulo }: IProps) {
  const [localInstitution] = React.useState(institution) // si es nulo es create

  const [tituloModal] = React.useState(titulo)
  function handleSaveInstitution() {
    //TODO: Save institution
    if(localInstitution){ //si es distinto de nulo es editar
  
    }else{
      console.log(newInstitution)
    }
    console.log();
  }

  const [departamento, setDepartamento] = React.useState('Artigas')

  const handleChange : (event: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
}>, child: React.ReactNode) => void = (e) => {
    console.log(e);
    setDepartamento(e.target.value as string);
  }
  
  
  

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h6' color='textPrimary'>
            {tituloModal}
            
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth id='name' label='Nombre' variant='outlined' />
            </Grid>
           
            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='demo-simple-select-outlined-label'>Departamento</InputLabel>
                <Select
                  fullWidth
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  label='Severity'
                  value={departamento}
                  onChange={handleChange}

                  
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem> 

                  {arr.map(dep => <MenuItem value={dep}>{dep}</MenuItem> )}
                 
                </Select>
              </FormControl>
            </Grid>
          </Grid> <br />
          <Grid item xs={12}>
              <TextField fullWidth id='localidad' label='Localidad' variant='outlined' />
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color='primary'>
            Cerrar
          </Button>
          <Button onClick={

            () => handleSaveInstitution()
            
          }
            variant='contained' color='primary' size='small'>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

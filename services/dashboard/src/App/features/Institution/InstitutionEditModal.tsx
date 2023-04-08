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

let nombreInstitution = ''
let cityInstitution = ''
let localityInstitution = ''





export default function InstitutionEditModal({ isOpen, handleCloseEditModal, institution, titulo }: IProps) {
  const [localInstitution] = React.useState(institution) // si es nulo es create

  function handleSaveInstitution() {
    //TODO: Save institution
    if(institution){ //si es distinto de nulo es editar
      console.log("EDITAR");
    }else{
      console.log("CREAR")

    }
    
  }

  const [departamento, setDepartamento] = React.useState('Artigas')


  const handleChange : (event: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
}>, child: React.ReactNode) => void = (e) => {
    
    setDepartamento(e.target.value as string);
  }


  const handleInput = (e: { target: { value: any; name: any } }) => {
    
   
    const { value, name } = e.target;
    console.log("test"+name)
    switch (name) {
      case "txtName":
        newInstitution.name=value;
        console.log(">>>>>>>>>>"+newInstitution.name)
        break;
      case "txtCity":
        newInstitution.city=value;
        console.log(">>>>>>>>>>"+newInstitution.city)
        break;
      case "txtLocality":
        newInstitution.locality=value;
        console.log(">>>>>>>>>>"+newInstitution.locality)
        break;
      default:
        break;
    }
  };
  
  function institutionFieldsValues(){
    if (institution) {
       nombreInstitution = institution.name
       cityInstitution = institution.city
       localityInstitution = institution.locality || ''
  } 

  }
  
  institutionFieldsValues()

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h6' color='textPrimary'>
            {titulo}
            
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth id='txtName' name = 'txtName' label='Nombre' variant='outlined' defaultValue={nombreInstitution} onChange={handleInput} />
            </Grid>
           
            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='demo-simple-select-outlined-label'>Departamento</InputLabel>
                <Select
                  fullWidth
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  label='Severity'
                  defaultValue={departamento}
                  onChange={handleChange}
                  name = 'txtCity'
                  
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
              <TextField fullWidth id='txtLocality' label='Localidad' name = 'txtLocality' variant='outlined' defaultValue={localityInstitution}/>
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

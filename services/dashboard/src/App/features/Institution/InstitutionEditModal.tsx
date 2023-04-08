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
  isOpen: boolean
  handleCloseEditModal: () => void
  institution: InstitutionT
  titulo: string
}

const arr = ['Montevideo','Paysandú']



let newInstitution: InstitutionT = {
  name: '',
  city: '',
  locality: '',

}





export default function InstitutionEditModal({ isOpen, handleCloseEditModal, institution, titulo }: IProps) {
  

  const [error, setError] = useState(false)

  function handleSaveInstitution() {


    if(newInstitution.city.length == 0 || newInstitution.name.length == 0 || newInstitution.city != undefined){
      setError(true)
    }
    else{

        if(institution){ //si es distinto de nulo es editar
          console.log("EDITAR");
          console.log(newInstitution)
          
        }else{
          console.log("CREAR")
          console.log(newInstitution)
          
        }
        handleCloseEditModal()
    }

    
    
  }



  const handleChange : (event: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
}>, child: React.ReactNode) => void = (e) => {
    
    
    newInstitution.city = e.target.value as string
    
  }


  



  const handleInput = (e: { target: { value: any; name: any } }) => {
    
   
    const { value, name } = e.target;
    
    switch (name) {
      case "txtName":
        newInstitution.name=value;
        
        break;
      case "txtLocality":
        newInstitution.locality=value;
 
        break;
      default:
        break;
    }
  };
  
  function institutionFieldsValues(){
    if (institution) {
      newInstitution.name = institution.name
      newInstitution.city = institution.city
      newInstitution.locality = institution.locality || ''
  } else {
      newInstitution.name = ''
      newInstitution.city = ''
      newInstitution.locality = ''
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
              <TextField fullWidth id='txtName' name = 'txtName' label='Nombre' 
               variant='outlined' defaultValue={newInstitution.name} onChange={handleInput} />
            </Grid>
           
            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='demo-simple-select-outlined-label'>Departamento</InputLabel>
                <Select
                  fullWidth
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  label='Severity'
                  defaultValue={newInstitution.city}
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
              <TextField fullWidth id='txtLocality' label='Localidad' 
              name = 'txtLocality' variant='outlined' defaultValue={newInstitution.locality} onChange={handleInput}/>
            </Grid>
        </DialogContent>
        <DialogActions>
          {error?
            <Alert severity="error">Error: uno o más campos no han sido completados</Alert>:""}
          
          <Button 
          onClick={() => {handleCloseEditModal(); setError(false);}} color='primary'>
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

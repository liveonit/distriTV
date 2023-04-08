import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

import Typography from '@material-ui/core/Typography'
import { InstitutionT } from 'src/store/institution/institution.type'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  institution: InstitutionT
}




let nombreInstitution = ''


export default function InstitutionDeleteModal({ isOpen, handleCloseDeleteModal, institution}: IProps) {
  
  function handleDeleteInstitution() {
    //TODO: Save institution
    console.log(institution)
      
    
  }

  function institutionFieldsValues(){
    if (institution) {
       nombreInstitution = institution.name
  } 
  
  }
  
  institutionFieldsValues()
  

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h6' color='textPrimary'>
            Está seguro que desea borrar la institución {nombreInstitution} ?
             
          </Typography>
          <br />
          
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            Cerrar
          </Button>
          <Button onClick={

            () => handleDeleteInstitution()
            
          }
            variant='contained' color='primary' size='small'>
            Borrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

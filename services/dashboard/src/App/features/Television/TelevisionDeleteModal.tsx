import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

import Typography from '@material-ui/core/Typography'
import { TelevisionT } from 'src/store/television/television.type'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  television: TelevisionT
}




let ipTelevision = ''


export default function InstitutionDeleteModal({ isOpen, handleCloseDeleteModal, television}: IProps) {
  
  function handleDeleteTelevision() {
    //TODO: Save institution
    console.log(television)
      
    
  }

  function institutionFieldsValues(){
    if (television) {
      ipTelevision = television.ip
  } 
  
  }
  
  institutionFieldsValues()
  

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            Está seguro que desea borrar la Televisión con ip:  {ipTelevision} ?
             
          </Typography>
          <br />
          
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            Cerrar
          </Button>
          <Button onClick={

            () => handleDeleteTelevision()
            
          }
            variant='contained' color='primary' size='small'>
            Borrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

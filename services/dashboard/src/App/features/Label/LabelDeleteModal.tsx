import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { LabelT } from 'src/store/label/label.type'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  label: LabelT
}




let nombreLabel = ''


export default function LabelDeleteModal({ isOpen, handleCloseDeleteModal, label}: IProps) {
  
  function handleDeleteLabel() {
    //TODO: Save label
    console.log(label)
      
    
  }

  function labelFieldsValues(){
    if (label) {
       nombreLabel = label.name
  } 
  
  }
  
  labelFieldsValues()
  

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            Está seguro que desea borrar la etiqueta {nombreLabel} ?
             
          </Typography>
          <br />
          
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            Cerrar
          </Button>
          <Button onClick={

            () => handleDeleteLabel()
            
          }
            variant='contained' color='primary' size='small'>
            Borrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

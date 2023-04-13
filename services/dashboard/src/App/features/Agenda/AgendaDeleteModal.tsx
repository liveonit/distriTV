import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

import Typography from '@material-ui/core/Typography'
import { AgendaT } from 'src/store/agenda/agenda.type'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  agenda: AgendaT
}




let nombreAgenda = 0


export default function AgendaDeleteModal({ isOpen, handleCloseDeleteModal, agenda}: IProps) {
  
  function handleDeleteAgenda() {
    //TODO: Save agenda
    console.log(agenda)
      
    
  }

  function agendaFieldsValues(){
    if (agenda) {
       nombreAgenda = agenda.contentId
  } 
  
  }
  
  agendaFieldsValues()
  

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            Está seguro que desea borrar la institución {nombreAgenda} ?
             
          </Typography>
          <br />
          
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            Cerrar
          </Button>
          <Button onClick={

            () => handleDeleteAgenda()
            
          }
            variant='contained' color='primary' size='small'>
            Borrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

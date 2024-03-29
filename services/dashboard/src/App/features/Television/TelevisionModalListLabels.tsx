import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { Trans } from 'react-i18next'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { TelevisionT } from 'src/store/television/television.type'

type IProps = {
  isOpen: boolean
  handleListLabelsModal: () => void
  tv: TelevisionT
}

const useStyles = makeStyles({
  table: {
    minWidth: 150,
  },
})

export default function TelevisionModalListLabels({ isOpen, handleListLabelsModal, tv}: IProps) {
  const classes = useStyles()

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>              
            <Trans>LABELS</Trans> - {tv.name} 
          </Typography>
          <br />
          
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>            
                </TableRow>
              </TableHead>
              <TableBody>
                {tv.labels?.map((label) => (
                  <TableRow key={label.id}>
                    <TableCell>{label.name}</TableCell>                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleListLabelsModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>        
        </DialogActions>
      </Dialog>
    </>
  )
}

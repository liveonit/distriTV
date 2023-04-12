import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress } from 'node_modules/@mui/material'
import Button from '@material-ui/core/Button'
import { listContents } from 'src/store/content/content.action'
import { contentIsLoadingSelector, contentSelector } from 'src/store/content/content.selector'
import AddIcon from '@material-ui/icons/Add'

import CreateContentModal from './CreateContentModal'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function ContentList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(listContents())
  }, [dispatch])

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const isLoading = useSelector(contentIsLoadingSelector)
  const contents = useSelector(contentSelector)

  function handleCloseEditContentModal() {
    setIsModalOpen(false)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid sm={8}>
          <h2>Content</h2>
        </Grid>
        <Grid sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            NUEVO
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content.id}>
                <TableCell component='th' scope='row'>
                  {content.name}
                </TableCell>
                <TableCell>{content.type}</TableCell>
                <TableCell>{content.url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateContentModal
        isOpen={isModalOpen}
        handleCloseEditModal={handleCloseEditContentModal}
      />
    </>
  )
}

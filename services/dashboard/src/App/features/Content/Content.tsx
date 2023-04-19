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
import { CircularProgress, IconButton } from 'node_modules/@mui/material'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { listContents } from 'src/store/content/content.action'
import { contentIsLoadingSelector, contentSelector } from 'src/store/content/content.selector'
import AddIcon from '@material-ui/icons/Add'
import { ContentT } from 'src/store/content/content.type'

import CreateAndEditContentModal from './CreateAndEditContentModal'
import ContentDeleteModal from './ContentDeleteModal'
import { Trans } from 'react-i18next/TransWithoutContext'

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
  const [contentToEdit, setContentToEdit] = React.useState<ContentT | null>(null)
  const [contentToDelete, setContentToDelete] = React.useState<ContentT | null>(null)

  function handleCloseEditContentModal() {
    setIsModalOpen(false)
  }
  function handleCloseDeleteContentModal() {
    setContentToDelete(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid item sm={8}>
          <h2><Trans>CONTENTS</Trans></h2>
        </Grid>
        <Grid item sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            <Trans>NEW</Trans>
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell><Trans>NAME</Trans></TableCell>
              <TableCell><Trans>TYPE</Trans></TableCell>
              <TableCell><Trans>URL</Trans></TableCell>
              <TableCell><Trans>ACTION</Trans></TableCell>
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
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setContentToEdit(content)
                    }}
                    color='primary'
                    aria-label='edit content'
                    component='span'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setContentToDelete(content)
                    }}
                    color='primary'
                    aria-label='delete content'
                    component='span'
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!!contentToEdit ||
        (isModalOpen && (
          <CreateAndEditContentModal
            isOpen={isModalOpen}
            handleCloseContentModal={handleCloseEditContentModal}
            content={contentToEdit!}
          />
        ))}
      {!!contentToDelete && (
        <ContentDeleteModal
          isOpen={!!contentToDelete}
          content={contentToDelete!}
          handleCloseDeleteModal={handleCloseDeleteContentModal}
        />
      )}
    </>
  )
}

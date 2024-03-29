import React from 'react'
import { useDispatch } from 'react-redux'
import { Box, Button, Container, Typography, Grid, useTheme, useMediaQuery, makeStyles } from '@material-ui/core'
// configs
import { logout } from 'src/store/auth/auth.action'
import { storage } from 'src/utils/general/Storage'
import { useGoogleLogout } from 'react-google-login'
import { GOOGLE_CONFIGS, PATH_NAME } from 'src/App/configs'
import { SessionT } from 'src/store/auth/auth.type'
// actions

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
  },
  heading: {
    fontSize: 150,
    lineHeight: '150px',
    fontWeight: 700,
    color: '#252932',
    textShadow:
      'rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px, rgba(61, 61, 61, 0.3) 3px 3px;fontSize: 150',
  },
  desc: {
    fontWeight: 'normal',
    marginTop: 30,
  },
}))

function DenyView() {
  const onGoogleLogoutFailure = () => {
    console.log('logout failed')
  }
  const onGoogleLogoutSuccess = () => {
    storage.set('session', null)
  }
  const { signOut } = useGoogleLogout({
    onFailure: onGoogleLogoutFailure,
    clientId: GOOGLE_CONFIGS.clientId,
    redirectUri: PATH_NAME.LOGIN,
    onLogoutSuccess: onGoogleLogoutSuccess,
  })

  const classes = useStyles()
  const theme = useTheme()
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useDispatch()

  const _handleLogout = () => {
    const session = storage.get<SessionT>('session')
    if (session?.session.type === 'local') {
      console.log('logout of local')
      dispatch(logout())
    }
    if (session?.session.type === 'google') {
      console.log('logout of google')
      signOut()
    }
  }

  return (
    <div className={classes.root}>
      <Container maxWidth='lg'>
        <Grid container>
          <Grid container item xs={12} justifyContent='center' direction='column'>
            <Typography
              align='center'
              variant={mobileDevice ? 'h4' : 'h1'}
              color='textPrimary'
              className={classes.heading}
            >
              403
            </Typography>
            <Typography align='center' variant='h3' className={classes.desc}>
              Sorry, access denied. Please contact admin to verify and update your role.
            </Typography>
            <Box mt={2} display='flex' justifyContent='center'>
              <Button color='primary' variant='contained' onClick={_handleLogout}>
                LOGOUT
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default DenyView

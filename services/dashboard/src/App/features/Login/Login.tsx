import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
// material core
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
// material icon
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
// actions
import { googleLogin, login } from 'src/store/auth/auth.action'
import { VisibilityOff, Visibility } from '@material-ui/icons'
import { InputAdornment, IconButton } from '@mui/material'
import { GoogleLoginResponse, GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login'
import { GOOGLE_CONFIGS } from 'src/App/configs'
import { useUser } from 'src/App/hooks/useUser'

import GoogleIcon from './GoogleIcon.png'

type State = {
  username: string
  password: string
  showPassword: boolean
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignIn() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [values, setValues] = useState<State>({
    username: '',
    password: '',
    showPassword: false,
  })
  const { username, password, showPassword } = values

  const user = useUser()

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  typeof handleChange('username')

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    })
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(login(username, password))
  }
  const onGoogleLoginSuccess: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void = (response) => {
    console.log(response)
    const res = response as GoogleLoginResponse
    dispatch(googleLogin(res.googleId, res.tokenId, res.accessToken))
  }
  const onGoogleLoginFailure: (error: any) => void = (err) => {
    console.log('failed:', err)
  }

  const { signIn } = useGoogleLogin({
    clientId: GOOGLE_CONFIGS.clientId,
    onFailure: onGoogleLoginFailure,
    onSuccess: onGoogleLoginSuccess,
    isSignedIn: !!user?.id,
    cookiePolicy: 'single_host_origin',
  })

  const googleIcon = <img width={'25px'} src={GoogleIcon}/>

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Login
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='username'
            label='User Name'
            name='username'
            autoComplete='username'
            autoFocus
            value={username}
            onChange={handleChange('username')}
          />
          <br />
          <br />
          <TextField
            id='outlined-adornment-password'
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Password'
            name='password'
            value={password}
            onChange={handleChange('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            Login
          </Button>
          <Button onClick={signIn} startIcon={googleIcon} fullWidth variant='contained' color='primary' className={classes.submit}>
            Login with google
          </Button>
        </form>
      </div>
    </Container>
  )
}

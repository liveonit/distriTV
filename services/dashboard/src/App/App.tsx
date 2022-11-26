import * as React from 'react'
import { HashRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SnackbarProvider } from 'notistack'
// material core
import { MuiThemeProvider } from '@material-ui/core/styles'

// context
import { GLOBAL_CONFIGS, THEMES } from './configs'
import themes from './themes'
import { useGlobalContext } from './context/GlobalContext'
// atomic
import Dialog from './components/molecules/Dialog'
import LinearProgress from './components/atoms/LinearProgress'
import SnackBarBase from './components/molecules/SnackBar'
import Routes from './routes/Routes'

function App() {
  // 0: light, 1: dark
  const { i18n } = useTranslation()
  const { modeTheme, language } = useGlobalContext()
  const type = modeTheme === THEMES.LIGHT ? 0 : 1

  React.useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <MuiThemeProvider theme={themes(type)}>
      <HashRouter>
          <SnackbarProvider
            autoHideDuration={GLOBAL_CONFIGS.REACT_APP_AUTO_HIDE_SNACKBAR}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            maxSnack={GLOBAL_CONFIGS.REACT_APP_MAX_SNACKBAR}
          >
            <LinearProgress />
            <Dialog />
            <Routes />
            <SnackBarBase />
          </SnackbarProvider>
      </HashRouter>
    </MuiThemeProvider>
  )
}

export default App

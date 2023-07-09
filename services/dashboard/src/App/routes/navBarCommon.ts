// material icon
import { Dashboard, Shop, Apartment, People, Label, Tv, Schedule, Announcement } from '@material-ui/icons'
// import AssessmentIcon from '@material-ui/icons/Assessment';
// configs
import { PATH_NAME, DRAWER_MENU_LABEL } from '@app/configs'


export const navBarCommon = [
  {
    subheader: 'Application',
    items: [
      {
        title: 'Report',
        href: PATH_NAME.DASHBOARD,
        icon: Dashboard,
        label: DRAWER_MENU_LABEL.DASHBOARD,
      },
    ],
  },
  {
    subheader: 'Dashboard',
    items: [
      {
        title: 'INSTITUTIONS',
        icon: Apartment,
        IconColor: 'primary',
        href: PATH_NAME.INSTITUTION,
        label: DRAWER_MENU_LABEL.INSTITUTIONS,
      },
      {
        title: 'CONTENTS',
        IconColor: 'primary',
        icon: Shop,
        href: PATH_NAME.CONTENT,
        label: DRAWER_MENU_LABEL.CONTENTS,
      },
      {
        title: 'TELEVISIONS',
        IconColor: 'primary',
        icon: Tv,
        href: PATH_NAME.TELEVISION,
        label: DRAWER_MENU_LABEL.TELEVISIONS,
      },
      {
        title: 'LABELS',
        IconColor: 'primary',
        icon: Label,
        href: PATH_NAME.LABEL,
        label: DRAWER_MENU_LABEL.TELEVISIONS,
      },
      {
        title: 'SCHEDULE',
        IconColor: 'primary',
        icon: Schedule,
        href: PATH_NAME.AGENDA,
        label: DRAWER_MENU_LABEL.AGENDAS,
      },
      {
        title: 'ALERTS',
        IconColor: 'primary',
        icon: Announcement,
        href: PATH_NAME.ALERT,
        label: DRAWER_MENU_LABEL.ALERTAS,
      },
    ],
  },
  {
    subheader: 'Users',
    items: [
      {
        title: 'USERS',
        icon: People,
        IconColor: 'primary',
        href: PATH_NAME.USERS,
        label: DRAWER_MENU_LABEL.USERS,
      },
    ],
  },
]

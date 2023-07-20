import { AbilityBuilder, Ability } from '@casl/ability'
// configs
import { DRAWER_MENU_LABEL } from '@app/configs'
import { RolesE } from 'src/store/user/user.type'
import { getUser } from 'src/store/auth/auth.state'

function defineAbilitiesFor(type: string) {
  const { can, cannot, build } = new AbilityBuilder(Ability)

  switch (type) {
    case RolesE.Admin:
      can(['create', 'update', 'view', 'delete'], 'all')
      break
    case RolesE.User:
      // menu
      can('view', DRAWER_MENU_LABEL.DASHBOARD)
      can('view', DRAWER_MENU_LABEL.INSTITUTIONS)
      can('view', DRAWER_MENU_LABEL.CONTENTS)
      can('view', DRAWER_MENU_LABEL.LABELS)
      // action
      break
    default:
      cannot(['create', 'update', 'view', 'delete'], 'all')
      break
  }
  return build()
}

const canAction = (action: string, resource: string) => {
  const user = getUser()
  const roles = user?.roleMappings.map((rm) => rm.role.name)
  if (!roles) return false
  return roles.reduce((prev, curr) => {
    const abilities = defineAbilitiesFor(curr)
    return prev || abilities.can(action, resource)
  }, false)
}

export default canAction

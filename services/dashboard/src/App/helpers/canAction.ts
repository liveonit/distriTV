import { AbilityBuilder, Ability } from '@casl/ability';
// configs
import { USER_ROLE, DRAWER_MENU_LABEL } from '@app/configs';
import store from '@store/index';

function defineAbilitiesFor(type: string) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  switch (type) {
    case USER_ROLE.ADMIN:
      can(['create', 'update', 'view', 'delete'], 'all');
      break;
    case USER_ROLE.LEAD:
      // menu
      can('view', DRAWER_MENU_LABEL.DASHBOARD);
      can('view', DRAWER_MENU_LABEL.INSTITUTIONS);
      can('view', DRAWER_MENU_LABEL.USERS);

      // action
      break;
    case USER_ROLE.GUEST:
      cannot(['create', 'update', 'view', 'delete'], 'all');
      break;
  }
  return build();
}

const canAction = (action: string, resource: string) => {
  const role = store.getState().auth.user?.role || USER_ROLE.ADMIN;
  if (!role) return false;

  const abilities = defineAbilitiesFor(role);
  return abilities.can(action, resource);
};

export default canAction;

import { ModulesType } from "../store/services/auth";

export const hasRouteRole = (
  modules: ModulesType,
  pathname: string,
  prefix: string = "/dashboard"
): boolean => {
  for (const moduleLinks of Object.values(modules)) {
    if (
      moduleLinks.some((link) => {
        return `${prefix}${link.route}` === pathname && link.expired !== 1;
      })
    ) {
      return true;
    }
  }
  return false;
};

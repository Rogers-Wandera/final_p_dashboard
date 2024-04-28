type defaultmodulestypes = {
  name: string;
  expired: number;
  linkname: string;
  route: string;
  accessroles: number[];
};

export const defaultmodules: defaultmodulestypes[] = [
  {
    name: "Modules",
    expired: 0,
    linkname: "Manage Modules",
    route: "/modules",
    accessroles: [1982, 5150],
  },
];

export const urlexcludes = ["/dashboard/users/manage"];

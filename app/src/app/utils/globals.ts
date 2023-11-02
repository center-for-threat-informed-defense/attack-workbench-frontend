import appPackageInfo from "package.json";

export const appVersion: string = appPackageInfo.version;
export const appName: string = appPackageInfo.name;

export const Theme = {
  LightMode: 'light',
  DarkMode: 'dark'
};

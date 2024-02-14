// Selectors
interface State {
  setting: {
    saveLocal: string;
    setting: {
      app_name: { value: string };
      theme_scheme: { value: string };
      theme_scheme_direction: { value: string };
      theme_style_appearance: { value: string[] };
      theme_color: string;
      theme_transition: { value: string };
      theme_font_size: { value: string };
      page_layout: { value: string };
      header_navbar: { value: string };
      card_style: { value: string };
      header_banner: { value: string };
      sidebar_color: { value: string };
      sidebar_type: { value: string[] };
      sidebar_show: { value: string };
      navbar_show: { value: string };
      sidebar_menu_style: { value: string };
      footer: { value: string };
      body_font_family: { value: string };
      heading_font_family: { value: string };
    };
  };
}
export const saveLocal = (state: State): String => state.setting.saveLocal;
export const app_name = (state: State): String =>
  state.setting.setting.app_name.value;
export const theme_scheme = (state: State): String =>
  state.setting.setting.theme_scheme.value;
export const theme_scheme_direction = (state: State): String =>
  state.setting.setting.theme_scheme_direction.value;
export const theme_style_appearance = (state: State): String[] =>
  state.setting.setting.theme_style_appearance.value;
export const theme_color = (state: State): String =>
  state.setting.setting.theme_color;
export const theme_transition = (state: State): String =>
  state.setting.setting.theme_transition.value;
export const theme_font_size = (state: State): String =>
  state.setting.setting.theme_font_size.value;
export const page_layout = (state: State): String =>
  state.setting.setting.page_layout.value;
export const header_navbar = (state: State): String =>
  state.setting.setting.header_navbar.value;
export const card_style = (state: State): String =>
  state.setting.setting.card_style.value;
export const header_banner = (state: State): String =>
  state.setting.setting.header_banner.value;
export const sidebar_color = (state: State): String =>
  state.setting.setting.sidebar_color.value;
export const sidebar_type = (state: State): String[] =>
  state.setting.setting.sidebar_type.value;
export const sidebar_show = (state: State): String =>
  state.setting.setting.sidebar_show.value;
export const navbar_show = (state: State): String =>
  state.setting.setting.navbar_show.value;
export const sidebar_menu_style = (state: State): String =>
  state.setting.setting.sidebar_menu_style.value;
export const footer = (state: State): String =>
  state.setting.setting.footer.value;
export const body_font_family = (state: State): String =>
  state.setting.setting.body_font_family.value;
export const heading_font_family = (state: State): String =>
  state.setting.setting.heading_font_family.value;

export const settingObj = (state: State): typeof state.setting => state.setting;

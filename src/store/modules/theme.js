import { getTheme } from "@/api/theme";

const state = {
  theme: null
};

const mutations = {
  SET_THEME: (state, data) => {
    state.theme = data;
    state.theme.systemName = state.theme.systemName === "" ? "KubeOperator" : state.theme.systemName;
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (data.icon !== '') {
      link.href = data.icon;
    } else {
      link.href = "<%= BASE_URL %>favicon.ico"
    }
    document.title = state.theme.systemName;
  }
};

const actions = {
  getThemeInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getTheme()
        .then(data => {
          commit("SET_THEME", data);
          resolve(data);
        })
        .catch(error => {
          commit("SET_THEME", {
            systemName: "KubeOperator",
            logo: "",
            logoWithText: "",
            loginImage: "",
            icon: "",
            logoAbout: ""
          });
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

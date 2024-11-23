import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

const isAuthenticated = () => !!localStorage.getItem("jwtToken");

const routes = constructRoutes(microfrontendLayout);

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    const currentPath = window.location.pathname;

    if (isAuthenticated() && currentPath !== "/expenses") {
      window.history.pushState(null, "", "/expenses");
      return System.import("@iulia-soa/mfe-expenses");
    }

    if (!isAuthenticated() && currentPath !== "/login") {
      window.history.pushState(null, "", "/login");
      return System.import("@iulia-soa/mfe-auth");
    }

    return System.import(name);
  },
});

const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();

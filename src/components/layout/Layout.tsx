import React from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import global_en from "../../translations/en/global.json";
import global_es from "../../translations/es/global.json";
import { store } from "../../redux/store";
import { LightTheme } from "../../util/LightTheme";
import { ROUTER } from "./Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "../toast/ToastProvider";
import { ToastListDisplay } from "../toast/ToastsListDisplay";

i18next.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      translation: global_en,
    },
    es: {
      translation: global_es,
    },
  },
  fallbackLng: "en",
});

const queryClient = new QueryClient();


export const Layout = () => {
  return (
    <QueryClientProvider client={queryClient} >
      <I18nextProvider i18n={i18next}>
        <Provider store={store}>
          <ThemeProvider theme={LightTheme}>
            <ToastProvider>
              <ToastListDisplay />
              <RouterProvider router={ROUTER} />
            </ToastProvider>
          </ThemeProvider>
        </Provider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

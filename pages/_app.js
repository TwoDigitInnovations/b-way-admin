import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
// import Layout from "@/components/Layout";
import Loader from "@/components/loader";
import toast, { Toaster } from "react-hot-toast";
import { PrimeReactProvider } from "primereact/api";
import "@/styles/globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "leaflet/dist/leaflet.css";
import { Provider } from "react-redux";
import { store } from "@/store";

export const userContext = createContext();
export const openCartContext = createContext();
export const cartContext = createContext();
export const favoriteProductContext = createContext();

function App({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (router.route === "/") {
      router.replace("/");
    }
    getUserdetail();
  }, [router]);

  const getUserdetail = () => {
    const user = localStorage.getItem("userDetail");
    if (user) {
      setUser(JSON.parse(user));
    }
  };

  // useEffect(() => {
  //   const defaultLanguage = "en";
  //   localStorage.setItem("LANGUAGE", defaultLanguage);
  //   i18n.changeLanguage(defaultLanguage);
  //   setgloballang(defaultLanguage);
  // }, []);

  return (
    <Provider store={store}>
      <PrimeReactProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <userContext.Provider value={[user, setUser]}>
          {open && <Loader open={open} />}
          <Component
            toaster={(t) => toast(t.message)}
            {...pageProps}
            loader={setOpen}
            user={user}
          />
        </userContext.Provider>
      </PrimeReactProvider>
    </Provider>
  );
}
export default App;

import { createContext, useState, useEffect } from "react";
import "@/styles/globals.css";
import { useRouter } from "next/router";
// import Layout from "@/components/Layout";
import Loader from "@/components/loader";
import toast, { Toaster } from "react-hot-toast";
import { PrimeReactProvider } from 'primereact/api';

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
  }, []);

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
    <PrimeReactProvider>
      <Toaster position="top-right" reverseOrder={false} />
        <userContext.Provider value={[user, setUser]}>
          {/* <openCartContext.Provider value={[openCart, setOpenCart]}>
            <cartContext.Provider value={[cartData, setCartData]}>
              <favoriteProductContext.Provider value={[Favorite, setFavorite]}> */}
                {/* <Layout loader={setOpen} constant={data} toaster={(t) => toast(t.message)}> */}
                {open && <Loader open={open} />}
                <Component
                  toaster={(t) => toast(t.message)}
                  {...pageProps}
                  loader={setOpen}
                  user={user}
                />
                {/* </Layout> */}
              {/* </favoriteProductContext.Provider>
            </cartContext.Provider>
          </openCartContext.Provider> */}
        </userContext.Provider>
    </PrimeReactProvider>
  );
}
export default App;

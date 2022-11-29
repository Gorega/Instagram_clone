import '../styles/globals.css'
import {store} from "../store";
import {Provider} from "react-redux"
import { SessionProvider } from "next-auth/react"
import AppProvider from '../contextApi';

function MyApp({ Component, pageProps:{session,...pageProps} }) {

  return <SessionProvider session={session}>
      <Provider store={store}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
      </Provider>
      </SessionProvider>
}

export default MyApp

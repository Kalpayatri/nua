import { Auth0Provider } from "@auth0/auth0-react"

export default function App({ Component, pageProps }) {
  return  (
    <Auth0Provider
    domain={process.env.AUTH0_DOMAIN}
    clientId={process.env.AUTH0_CLIENT_ID}
    authorizationParams={{ redirect_uri: process.env.AUTH0_REDIRECT_URI }}
    >
  <Component {...pageProps} />
  </Auth0Provider>
  )
}

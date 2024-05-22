import { Auth0Provider } from "@auth0/auth0-react"

export default function App({ Component, pageProps }) {
  return  (
    <Auth0Provider
    domain="dev-aeb2d5hyznx21v1u.us.auth0.com"
    clientId="tEup7V7xqSwWjAEJPXvlGLbhG7yr5jxi"
    authorizationParams={{ redirect_uri: "https://joyful-tiramisu-a0713b.netlify.app/callback" }}
    >
  <Component {...pageProps} />
  </Auth0Provider>
  )
}

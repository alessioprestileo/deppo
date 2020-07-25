import { navigate } from 'gatsby'
import { UserManager, WebStorageStateStore } from 'oidc-client'

export class AuthService {
  userManager: UserManager

  constructor(acrValues?: string) {
    this.userManager = new UserManager({
      authority: process.env.REACT_APP_IDENTITY_CONFIG_AUTHORITY,
      client_id: process.env.REACT_APP_IDENTITY_CONFIG_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_IDENTITY_CONFIG_REDIRECT_URI,
      response_type: process.env.REACT_APP_IDENTITY_CONFIG_RESPONSE_TYPE,
      post_logout_redirect_uri:
        process.env.REACT_APP_IDENTITY_CONFIG_POST_LOGOUT_REDIRECT_URI,
      acr_values: acrValues,
      userStore:
        window && new WebStorageStateStore({ store: window.sessionStorage }),
    })

    this.userManager.events.addUserLoaded(() => {
      window.top.dispatchEvent(new Event('LoginSuccess'))
    })
  }

  signinRedirect = (): void => {
    this.userManager.signinRedirect()
  }

  signinPopup = (): void => {
    this.userManager.signinPopup()
  }

  signinRedirectCallback = async (): Promise<void> => {
    try {
      await this.userManager.signinRedirectCallback()
    } catch (error) {
      // eslint-disable-next-line no-alert
      window.alert('Oops, something went wrong')
    }
    navigate('/protected')
  }

  logout = (): void => {
    this.userManager.signoutRedirect()
  }

  signoutRedirectCallback = async (): Promise<void> => {
    await this.userManager.signoutRedirectCallback()
    localStorage.clear()
    this.userManager.clearStaleState()
    navigate('/protected')
  }

  isAuthenticated = (): boolean => {
    const oidcStorageItem = sessionStorage.getItem(
      `oidc.user:${process.env.REACT_APP_IDENTITY_CONFIG_AUTHORITY}:${process.env.REACT_APP_IDENTITY_CONFIG_CLIENT_ID}`,
    )
    const oidcStorage = oidcStorageItem && JSON.parse(oidcStorageItem)

    return oidcStorage && !!oidcStorage.id_token
  }
}

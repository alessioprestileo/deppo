import { navigate } from 'gatsby'
import { UserManager, WebStorageStateStore } from 'oidc-client'

import { isClientSide, hasSessionStorage } from '../../shared/utils'

export class AuthService {
  userManager?: UserManager

  constructor(acrValues?: string) {
    if (isClientSide() && hasSessionStorage()) {
      this.userManager = new UserManager({
        authority: process.env.GATSBY_CRIIPTO_IDENTITY_CONFIG_AUTHORITY,
        client_id: process.env.GATSBY_CRIIPTO_IDENTITY_CONFIG_CLIENT_ID,
        redirect_uri: process.env.GATSBY_CRIIPTO_IDENTITY_CONFIG_REDIRECT_URI,
        post_logout_redirect_uri:
          process.env.GATSBY_CRIIPTO_IDENTITY_CONFIG_POST_LOGOUT_REDIRECT_URI,
        acr_values: acrValues,
        userStore: new WebStorageStateStore({ store: window.sessionStorage }),
      })

      this.userManager.events.addUserLoaded(() => {
        if (isClientSide()) {
          window.top.dispatchEvent(new Event('LoginSuccess'))
        }
      })
    }
  }

  signinRedirect = (): void => {
    if (this.userManager) {
      this.userManager.signinRedirect()
    }
  }

  signinPopup = (): void => {
    if (this.userManager) {
      this.userManager.signinPopup()
    }
  }

  signinRedirectCallback = async (): Promise<void> => {
    if (this.userManager) {
      try {
        await this.userManager.signinRedirectCallback()
      } catch (error) {
        if (isClientSide()) {
          // eslint-disable-next-line no-alert
          window.alert('Oops, something went wrong')
        }
      }
    }
    navigate('/protected')
  }

  logout = (): void => {
    if (this.userManager) {
      this.userManager.signoutRedirect()
    }
  }

  signoutRedirectCallback = async (): Promise<void> => {
    if (this.userManager) {
      await this.userManager.signoutRedirectCallback()
      localStorage.clear()
      this.userManager.clearStaleState()
    }
    navigate('/protected')
  }

  isAuthenticated = (): boolean => {
    const oidcStorageItem = hasSessionStorage()
      ? sessionStorage.getItem(
          `oidc.user:${process.env.GATSBY_CRIIPTO_IDENTITY_CONFIG_AUTHORITY}:${process.env.GATSBY_CRIIPTO_IDENTITY_CONFIG_CLIENT_ID}`,
        )
      : undefined
    const oidcStorage = oidcStorageItem && JSON.parse(oidcStorageItem)

    return oidcStorage && !!oidcStorage.id_token
  }
}

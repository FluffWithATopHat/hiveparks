window.PATCH = window.PATCH || {}
window.PATCH.__determineAuthChannel = function () {
  if (window.__PATCH_WP) {
    // return 'WORDPRESS'
    return null
  } else if (window.ShopifyAnalytics) {
    return 'SHOPIFY'
  }
  return null
}

window.PATCH.__getToken = function () {
  const _PATCH = this
  // Use a token from local storage rather than requesting new
  if (window.localStorage) {
    const tokenInStorage = window.localStorage.getItem('ppxl-token')
    if (tokenInStorage) {
      try {
        const tokenJson = JSON.parse(window.atob(tokenInStorage))
        if (tokenJson.exp > (Date.now() / 1000) + 3600 * 3) {
          _PATCH.token = tokenInStorage
        }
      } catch (e) {
        window.localStorage.setItem('ppxl-token', '')
      }
    }
  }
  if (_PATCH.token) {
    return new Promise(function (resolve) { resolve({ token: _PATCH.token }) })
  }
  // Request a new token
  _PATCH.authPromise = new Promise(function (resolve, reject) {
    let tokenUrl
    if (_PATCH.__determineAuthChannel() === 'SHOPIFY' && typeof _PATCH.__getShopifyCustomerId === 'function') {
      if (_PATCH.__getShopifyCustomerId()) {
        tokenUrl = '/apps/patch/contact_token?id=' + _PATCH.__getShopifyCustomerId() + '&account_id=' + _PATCH.account._id
      }
    } else if (_PATCH.__determineAuthChannel() === 'WORDPRESS' && _PATCH.__getWordpressUserId()) {
      tokenUrl = '/wp-json/patch-retention/v1/contact_token?_wpnonce=' + window.__PATCH_WP.nonce
    }

    // GET CG contact auth token using customer data
    if (tokenUrl) {
      window.fetch(
        tokenUrl
      ).then(function (data) {
        return data.json()
      }).then(function (data) {
        if (data.error) {
          reject(new Error(data.error))
        } else {
          _PATCH.token = data.token
          window.localStorage.setItem('ppxl-token', _PATCH.token)
          _PATCH.authPromise = null
          resolve(data)
        }
      }).catch(function (error) {
        reject(error)
      })
    } else {
      _PATCH.authPromise = null
      resolve(null)
    }
  })

  return _PATCH.authPromise
}


  window.PATCH.account = {"_id":682003,"display_name":"The Hive","name":"Hive Parks","status":"ACTIVE","settings":{"address":{"zip":"84660","city":"Spanish Fork","state":"UT","streetlines":"955 N. Main Street","country":"US"},"timezone":"America/Denver","style":{"button_background_color":"#FFF400","button_color":"#101010","background_color":"#FFFFFF","content_background_color":"#FFFFFF","color":"#101010","input_color":"#101010","link_color":"#00B8FF"},"logo":"682003_1749573268_979971_yelllllllllllllllllllllow.png","short_name":"Hive Parks","phone":"(801)-609-2440","website":"https://www.hiveparks.com/","business_days":["MO","TU","WE","TH","FR","SA"]},"custom":true};
// Webform triggering code goes here

window.PATCH._getCookie = (name) => {
  const string = document.cookie.replace(
    new RegExp('(?:(?:^|.*;\\s*)' + name + '\\s*\\=\\s*([^;]*).*$)|^.*$'),
    '$1'
  )
  return string ? JSON.parse(decodeURIComponent(string)) : null
}

// Modified from https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f
// Creates a RegExp, converting asterisks to .* expressions, and escaping all other characters
function wildcardToRegExp (s, flags) {
  return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$', flags)
}
// RegExp-escapes all characters
function regExpEscape (s) {
  return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

window.PATCH.__initForms = function (state, options) {
  const _PATCH = this
  if (!(_PATCH.account && _PATCH.account._id)) {
    console.error('Forms Init Failed: Account not found.')
    return
  }

  const forms = {
    initOptions: state,
    env: state.env,
    ui: {}
  }

  const generatePopupUI = function (config) {
    config = config || {}
    const ui = {}

    ui.container = document.createElement('div')
    ui.container.classList.add('pchf-container-popup')
    ui.container.setAttribute('id', 'pchf-container-popup-' + config.form_id)
    ui.container.addEventListener('click', function () {
      forms.close(config)
    })

    ui.loading = document.createElement('div')
    ui.loading.classList.add('pchf-loading')
    ui.loading.setAttribute('id', 'pchf-loading-' + config.form_id)
    // TODO: what img should we use here?
    ui.loading.innerHTML = '<img src="https://s.citygro.com/edn/public/2023-08-12-form-loading-150.gif" style="width: 50px;" />'
    ui.container.appendChild(ui.loading)

    ui.iframepopup = document.createElement('div')
    ui.iframepopup.classList.add('pchf-iframe-container-popup')
    ui.iframepopup.setAttribute('id', 'pchf-iframe-container-popup-' + config.form_id)
    ui.iframepopup.style.cssText += `width: ${+(config.form?.settings?.styles?.width || 600) + 24}px;`
    ui.container.appendChild(ui.iframepopup)

    ui.frame = document.createElement('iframe')
    ui.frame.classList.add('pchf-iframe-popup')
    ui.frame.setAttribute('id', 'pchf-iframe-popup-' + config.form_id)
    ui.frame.scrolling = 'auto'
    ui.frame.frameBorder = 0
    ui.frame.style = `
    display: block;
    height: 100%;
    width: 100%;
    overflow: auto;
    border: 1px #000 solid;
    background-color: #fff;
    border-radius: 5px;
    `
    ui.frame.src = (state.env === 'production' ? 'https://addons.patchretention.com' : 'http://localhost:3000') + `/form/${config.form_id}/${config.account_id || _PATCH.account._id}` + (state.env !== 'production' ? '?local=y&popup=y' : '?popup=y')
    ui.frame.allow = 'clipboard-write self ' + ui.frame.src
    ui.iframepopup.appendChild(ui.frame)

    return ui
  }

  forms.open = function (config) {
    config = config || {}
    if (!(config && config.form_id)) {
      console.warn('[PATCH]: form_id is required to open.')
    }

    if (window.PATCH._getCookie(`pchf_popup_${config.form_id}`)) {
      console.warn(`[PATCH]: Previous popup for form ${config.form_id} (will not show again this session)`)
      return
    }

    if (config.restrict_urls && Array.isArray(config.restrict_urls) && config.restrict_urls.length > 0 && config.restrict_urls[0]) {
      let allow = false
      for (let i = 0; i < config.restrict_urls.length; i++) {
        if (!config.restrict_urls[i]) {
          continue
        }
        const regex = wildcardToRegExp(config.restrict_urls[i], 'i') // ignore case
        if (regex.test(window.location.href)) {
          allow = true
          break
        }
      }
      if (!allow) {
        console.warn(`[PATCH]: Form ${config.form_id} popup skipped due to URL restrictions`)
        return
      }
    }

    forms.instances = forms.instances || {}

    // Ensure no other form popup is already open.  If so, don't open a new one
    const openFormInstance = Object.entries(forms.instances).find(function ([formId, inst]) {
      return inst.popup && inst.popup.container
    })
    if (openFormInstance) {
      if (openFormInstance[0] === config.form_id) {
        // At all costs prevent the same form to be open in multiple popups
        console.warn('[PATCH]: A popup is already open for form #' + config.form_id)
        return
      } else if (!config.multiple_popups) {
        console.warn('[PATCH]: A popup was already open when attempting to open form #' + config.form_id)
        return
      }
    }

    forms.instances[config.form_id] = forms.instances[config.form_id] || {}
    const instance = forms.instances[config.form_id]
    if (instance.popup && instance.popup.container && instance.popup.container.parentElement) {
      instance.popup.container.parentElement.removeChild(instance.popup.container)
    }
    instance.popup = generatePopupUI(config)
    document.body.appendChild(instance.popup.container)
    document.cookie = `pchf_popup_${config.form_id}=1;path=/`
    return true
  }

  forms.close = function (config) {
    if (!(config && config.form_id)) {
      throw new Error('[PATCH]: form_id is required to close.')
    }

    if (forms.instances && forms.instances[config.form_id] && forms.instances[config.form_id].popup && forms.instances[config.form_id].popup.container && forms.instances[config.form_id].popup.container.parentElement) {
      forms.instances[config.form_id].popup.container.parentElement.removeChild(forms.instances[config.form_id].popup.container)
      delete forms.instances[config.form_id].popup
    } else {
      console.warn('[PATCH]: No form UI found to close at path forms[' + config.form_id + '].popup.container')
    }
  }

  const generateElementUI = function (config) {
    config = config || {}
    const ui = {}

    ui.container = document.createElement('div')
    ui.container.classList.add('pchf-container-embed')
    ui.container.setAttribute('id', 'pchf-container-embed-' + config.form_id)

    ui.frame = document.createElement('iframe')
    ui.frame.classList.add('pchf-iframe-embed')
    ui.frame.setAttribute('id', 'pchf-iframe-embed-' + config.form_id)
    ui.frame.scrolling = 'auto'
    ui.frame.frameBorder = 0
    ui.frame.style = `
    `
    ui.frame.src = (state.env === 'production' ? 'https://addons.patchretention.com' : 'http://localhost:3000') + `/form/${config.form_id}/${config.account_id || _PATCH.account._id}` + (state.env !== 'production' ? '?local=y' : '')
    ui.frame.allow = 'clipboard-write self ' + ui.frame.src
    ui.container.appendChild(ui.frame)

    return ui
  }

  forms.inject = function (config) {
    if (!(config && config.form_id)) {
      console.warn('[PATCH]: form_id is required to inject.')
    }

    if (!(config && config.selector)) {
      console.warn('[PATCH]: selector is required to inject into.')
    }

    const targetElement = document.querySelector(config.selector)
    if (!targetElement) {
      console.warn('[PATCH]: ' + config.selector + ' was not found.')
    }
    forms.instances = forms.instances || {}
    forms.instances[config.form_id] = forms.instances[config.form_id] || {}
    const instance = forms.instances[config.form_id]
    if (instance.element && instance.element.container && instance.element.container.parentElement) {
      instance.element.container.parentElement.removeChild(instance.element.container)
    }
    instance.element = generateElementUI(config)

    targetElement.replaceChildren(instance.element.container)
  }

  forms.ui.style = document.createElement('style')
  const styles = `
  .pchf-loading {
    position: absolute;
    color: #fff;
  }
  .pchf-container-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999999;
    box-sizing: content-box;
  }
  .pchf-iframe-container-popup {
    visibility: hidden;
    box-sizing: content-box;
  }
  .pchf-container-embed {
    width: 100%;
    height: 100%;
    box-sizing: content-box;
  }
  .pchf-iframe-embed {
    display: block;
    height: 100%;
    width: 100%;
    overflow: auto;
    box-sizing: content-box;
  }

  @media screen and (max-width: 490px) {
    .pchf-iframe-container-popup {
      min-width: 95vw;
      max-height: 95vh;
    }
  }
  `
  forms.ui.style.innerHTML = styles
  document.body.appendChild(forms.ui.style)

  const triggerForm = function (config) {
    if (config.target === 'POPUP') {
      return forms.open(config)
    } else if (config.target === 'ELEMENT') {
      const targetElement = document.querySelector(config.selector)
      if (targetElement) {
        return forms.inject(config)
      }
    }
  }

  let exitIntentForms = [];

  ((state && state.formConfigs) || []).forEach(function (config) {
    // TODO: When conditions are supported, filter this list first by those conditions
    if (config.target === 'ELEMENT') {
      triggerForm(config)
    } else if (config.target === 'POPUP') {
      if (config.trigger === 'IMMEDIATELY') {
        triggerForm(config)
      } else if (config.trigger === 'DELAY') {
        setTimeout(function () {
          triggerForm(config)
        }, (config.delay || 3) * 1000)
      } else if (config.trigger === 'EXIT_INTENT') {
        exitIntentForms.push(config)
      }
    }
  })

  if (exitIntentForms.length) {
    // TODO: Initialize all of these in the background
    document.addEventListener('mouseout', function (e) {
      if (!e.toElement && !e.relatedTarget) {
        console.log('exit intent')
        // Remove all forms that are successfully triggered
        exitIntentForms = exitIntentForms.filter(function (config) {
          return !triggerForm(config)
        })
      }
    })
  }

  window.addEventListener('message', (event) => {
    const formHeight = event.data?.formHeight
    const formId = event.data?.formId || ''
    const popupContainer = document.querySelector('#pchf-container-popup-' + formId)
    if (event.data?.formClose && popupContainer) {
      forms.close({
        form_id: formId
      })
    }
    if (formHeight && formId) {
      const iframeEmbed = document.querySelector('#pchf-iframe-embed-' + formId)
      if (iframeEmbed) {
        const targetElement = iframeEmbed.parentElement.parentElement
        if (!targetElement.style.height && !targetElement.style.minHeight && !targetElement.style.maxHeight) {
          // target element doesn't have an explicit height, so set iframe to height of form
          iframeEmbed.style.cssText += `min-height: ${formHeight}px;`
          iframeEmbed.scrolling = 'no'
        } else {
          if (!targetElement.style.minHeight) {
            iframeEmbed.style.cssText += 'min-height: auto;'
          }
          if (formHeight <= targetElement.offsetHeight) {
            iframeEmbed.scrolling = 'no'
          }
        }
      }
      const loading = document.querySelector('#pchf-loading-' + formId)
      const iframeContainer = document.querySelector('#pchf-iframe-container-popup-' + formId)
      const iframePopup = document.querySelector('#pchf-iframe-popup-' + formId)
      if (popupContainer && iframeContainer && iframePopup) {
        const availableHeight = popupContainer.offsetHeight
        if (formHeight <= availableHeight) {
          iframeContainer.style.cssText += `height: ${formHeight}px;`
          iframePopup.scrolling = 'no'
        } else {
          iframeContainer.style.cssText += 'height: 95vh;'
          iframePopup.scrolling = 'auto'
        }
        loading.style.cssText += 'display: none;'
        iframeContainer.style.cssText += 'visibility: visible;'
      }
    }
  })

  return forms
}


try {
  if (!(window.PATCH && window.PATCH.forms) && !(window.location.search && window.location.search.includes('cg-disable-widgets'))) {
    const initForms = function () {
      window.PATCH.forms = window.PATCH.__initForms({"env":"production","apiUrl":"https://api.patchretention.com","formConfigs":[]})
    }
    if (document.body) {
      initForms()
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        initForms()
      }, false)
    }
  }
} catch (e) {
  console.error(e)
}

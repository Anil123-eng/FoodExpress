const API_URL = 'http://127.0.0.1:8000/api'

export async function getMenuItems() {
  const response = await fetch(`${API_URL}/menu-items/`)
  return response.json()
}

export async function placeOrder() {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/checkout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.json()
}

export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })

  return response.json()
}

export async function addToCart(menuItemId) {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/cart/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      menu_item: menuItemId,
    }),
  })

  return response.json()
}


export async function registerUser(username, email, password) {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  })

  return response.json()
}


export async function getCartItems() {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/cart/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.status === 401) {
    const data = await refreshAccessToken()

    if (data.access) {
      localStorage.setItem('accessToken', data.access)

      const retryResponse = await fetch(`${API_URL}/cart/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      })

      return retryResponse.json()
    }
  }

  return response.json()
}


export async function deleteCartItem(cartItemId) {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/cart/${cartItemId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response
}


export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
    return {}
  }

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  })

  return response.json()
}


export async function getValidAccessToken() {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    return null
  }

  const response = await fetch(`${API_URL}/cart/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.ok) {
    return accessToken
  }

  if (response.status === 401) {
    const data = await refreshAccessToken()

    if (data.access) {
      localStorage.setItem('accessToken', data.access)
      return data.access
    }
  }

  return null
}


export async function getCurrentUser() {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.json()
}


export async function deleteAccount() {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/delete-account/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.json()
}

export async function getOrders() {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/orders/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.json()
}

export async function updateProfile(email) {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/update-profile/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      email: email,
    }),
  })

  return response.json()
}


export async function changePassword(currentPassword, newPassword) {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(`${API_URL}/change-password/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  })

  return response.json()
}
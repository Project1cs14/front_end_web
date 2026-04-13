// Real authentication service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/web/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      confirm_password: userData.confirmPassword,
      adresse: userData.address,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}

export async function registerAssociation(associationData) {
  const formData = new FormData();
  // Add text fields
  Object.keys(associationData).forEach(key => {
    if (key !== 'documents') {
      formData.append(key, associationData[key]);
    }
  });
  // Add files
  if (associationData.documents) {
    formData.append('doc_statuts', associationData.documents.doc_statuts);
    formData.append('doc_certificat', associationData.documents.doc_certificat);
    formData.append('doc_membres', associationData.documents.doc_membres);
    formData.append('logo', associationData.documents.logo);
  }

  const response = await fetch(`${API_BASE_URL}/auth/register/association`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Association registration failed');
  }

  return data;
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_BASE_URL}/auth/web/forgotpassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send reset email');
  }

  return data;
}

export async function verifyOtp(email, otp) {
  const response = await fetch(`${API_BASE_URL}/auth/verifyotp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed');
  }

  return data;
}

export async function resetPassword(email, otp, newPassword) {
  const response = await fetch(`${API_BASE_URL}/auth/web/resetpassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Password reset failed');
  }

  return data;
}

export async function changePassword(oldPassword, newPassword) {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/auth/web/changepassword`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Password change failed');
  }

  return data;
}

export async function logout() {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.ok) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }

  return response.ok;
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  const response = await fetch(`${API_BASE_URL}/auth/refreshtoken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Token refresh failed');
  }

  // Update stored tokens
  const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
  storage.setItem('accessToken', data.accessToken);
  storage.setItem('refreshToken', data.refreshToken);

  return data;
}

export function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/auth/google`;
}
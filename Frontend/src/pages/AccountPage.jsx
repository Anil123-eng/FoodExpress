
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount
} from '../services/api'
import './AccountPage.css'


function Account({ onLogout }) {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationRef = useRef(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
      return
    }

    getCurrentUser().then(data => {
      setUser(data)
      setEmail(data.email || '')
    })
  }, [navigate])

  useEffect(() => {
  if (!notification) return

  const handleOutsideClick = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setNotification(null)
    }
  }

  document.addEventListener('pointerdown', handleOutsideClick)

  return () => {
    document.removeEventListener('pointerdown', handleOutsideClick)
  }
       }, [notification])

  const handleSaveProfile = () => {
    updateProfile(email).then(data => {
      console.log(
        'Update profile response:',
        JSON.stringify(data)
      )

      if (data.email) {
        setUser({
          ...user,
          email: data.email
        })

        setEmail(data.email)
        setIsEditing(false)
        showNotification('Profile updated successfully.')
      } else {
        showNotification('Failed to update profile.', 'error')
      }
    })
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification('Please fill in all password fields.', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match.', 'error')
      return
    }

    changePassword(currentPassword, newPassword).then(data => {
      console.log(
        'Change password response:',
        JSON.stringify(data)
      )

      if (data.message === 'Password changed successfully.') {
         showNotification('Password changed successfully.')
 
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setIsChangingPassword(false)
      } 
      else {
       const errorMessage =
        data.message ||
        data.detail ||
        data.current_password?.[0] ||
        data.new_password?.[0] ||
       'Failed to change password. Please check your details.'

        showNotification(errorMessage, 'error')
       }
    })
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account?'
    )

    if (!confirmed) {
      return
    }

    deleteAccount().then(data => {
      console.log(
        'Delete account response:',
        JSON.stringify(data)
      )

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('username')

      onLogout()
      navigate('/login')
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')

    onLogout()
    navigate('/login')
  }
      
      return (
    <section className="page-container account-page">
      {notification && (
         <div
             ref={notificationRef}
             className={`app-notification ${notification.type}`}
             role="status"
             aria-live="polite"
             onClick={() => setNotification(null)}
          >
          <span className="notification-icon">
            {notification.type === 'error' ? '✕' : '✓'}
          </span>

          <span className="notification-message">
            {notification.message}
          </span>

          <button
            type="button"
            className="notification-close"
            aria-label="Dismiss notification"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      <h2 className="account-title">My Account</h2>

      {user && (
        <>
          {!isEditing && !isChangingPassword ? (
            <>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>

              <div className="account-actions">
                <button onClick={() => navigate('/orders')}>
                  Order History
                </button>

                <button
                  className="edit-profile-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>

                <button
                  className="change-password-button"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>

                <button
                  className="delete-account-button"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>

                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : isEditing ? (
            <div className="edit-profile-form">
              <h3>Edit Profile</h3>

              <label>Username</label>
              <input
                type="text"
                value={user.username}
                disabled
              />

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />

              <div className="account-actions">
                <button onClick={handleSaveProfile}>
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setEmail(user.email)
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="edit-profile-form">
              <h3>Change Password</h3>

              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={event =>
                  setCurrentPassword(event.target.value)
                }
              />

              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={event =>
                  setNewPassword(event.target.value)
                }
              />

              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={event =>
                  setConfirmPassword(event.target.value)
                }
              />

              <div className="account-actions">
                <button onClick={handleChangePassword}>
                  Change Password
                </button>

                <button
                  onClick={() => {
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setIsChangingPassword(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Account

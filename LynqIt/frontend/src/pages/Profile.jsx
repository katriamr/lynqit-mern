import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import axios from 'axios'
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa'

function Profile() {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    email: userData?.email || '',
    mobile: userData?.mobile || ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdate = async () => {
    setLoading(true)
    setMessage('')
    try {
      const result = await axios.put(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
      dispatch(setUserData(result.data.user))
      setIsEditing(false)
      setMessage('Profile updated successfully!')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed')
    }
    setLoading(false)
  }

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) return

    setLoading(true)
    try {
      await axios.delete(`${serverUrl}/api/user/deactivate`, { withCredentials: true })
      dispatch(setUserData(null))
      navigate('/signin')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Deactivation failed')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
      navigate('/signin')
    } catch (error) {
      console.log(error)
    }
  }

  if (!userData) return null

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
          <div className='text-center mb-8'>
            <div className='w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold'>
              {userData.fullName.slice(0, 1).toUpperCase()}
            </div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Profile</h1>
            <p className='text-gray-600 capitalize'>{userData.role}</p>
          </div>

          <div className='space-y-6'>
            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
              <FaUser className='text-indigo-600 text-xl' />
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                {isEditing ? (
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 font-medium'>{userData.fullName}</p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
              <FaEnvelope className='text-indigo-600 text-xl' />
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                {isEditing ? (
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 font-medium'>{userData.email}</p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
              <FaPhone className='text-indigo-600 text-xl' />
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Mobile</label>
                {isEditing ? (
                  <input
                    type='tel'
                    name='mobile'
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900 font-medium'>{userData.mobile}</p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
              <FaMapMarkerAlt className='text-indigo-600 text-xl' />
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Location</label>
                <p className='text-gray-900 font-medium'>
                  Lat: {userData.location?.coordinates[1]?.toFixed(4) || 'N/A'}, Lon: {userData.location?.coordinates[0]?.toFixed(4) || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`mt-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <div className='mt-8 flex flex-col sm:flex-row gap-4'>
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className='flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className='flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors'
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className='flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2'
                >
                  <FaEdit /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className='flex-1 bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2'
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            )}
          </div>

          {!isEditing && (
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <button
                onClick={handleDeactivate}
                disabled={loading}
                className='w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
              >
                <FaTrash /> Deactivate Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

import PropTypes from 'prop-types'

function AccessibleAlert({ message, status = 'info' }) {
  const colorMap = {
    info: 'text-blue-600 dark:text-blue-300',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400'
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`text-sm font-medium ${colorMap[status] || colorMap.info}`}
    >
      {message}
    </div>
  )
}

AccessibleAlert.propTypes = {
  message: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['info', 'success', 'error'])
}

export default AccessibleAlert

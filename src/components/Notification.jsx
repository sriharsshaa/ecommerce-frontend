function Notification({ type = "success", message, onClose }) {
  if (!message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div className={`app-notification ${type}`}>
      <div className="notification-icon">
        {isSuccess ? "✓" : "!"}
      </div>

      <div className="notification-content">
        <strong>
          {isSuccess ? "Success" : "Notice"}
        </strong>

        <p>{message}</p>
      </div>

      <button
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Notification;
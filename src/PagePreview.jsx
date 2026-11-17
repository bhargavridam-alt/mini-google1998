export default function PagePreview({ page, onClose }) {
  return (
    <div className="page-preview-overlay" onClick={onClose}>
      <div className="page-preview" onClick={(e) => e.stopPropagation()}>
        <div className="page-preview-header">
          <h2>{page.url}</h2>
          <button className="page-preview-close" onClick={onClose}>
            ✕ Close
          </button>
        </div>
        <div className="page-preview-url">
          http://{page.url}
        </div>
        <div className="page-preview-content">{page.text}</div>
      </div>
    </div>
  );
}

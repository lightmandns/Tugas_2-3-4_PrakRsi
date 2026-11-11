export default function LoadingSpinner({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

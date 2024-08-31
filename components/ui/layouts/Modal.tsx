const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose, children } : any) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 relative">
          {children}
        </div>
      </div>
    );
  };
  
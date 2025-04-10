import React, { useState } from 'react';

import { X, Plus, Mail } from 'lucide-react';
import { Modal } from './Modal';

interface AddContributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: number;
}

export const AddContributorModal: React.FC<AddContributorModalProps> = ({
  isOpen,
  onClose,
  workspaceId
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    if (!currentEmail.trim()) return;
    
    if (!isValidEmail(currentEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (emails.includes(currentEmail)) {
      setError('This email has already been added');
      return;
    }

    setEmails([...emails, currentEmail]);
    setCurrentEmail('');
    setError('');
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSubmit = async () => {
    if (emails.length === 0) {
      setError('Please add at least one email');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/workspaces/workspace-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspaceId,
          emails
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add contributors');
      }

      setSuccess('Contributors added successfully!');
      setTimeout(() => {
        setSuccess('');
        setEmails([]);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Add Contributors"
      description="Invite team members to collaborate on this workspace"
    >
      <div className="space-y-4">
        {/* Email input */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter email address"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addEmail}
            className="absolute right-2 top-2 p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {/* Success message */}
        {success && (
          <div className="text-green-500 text-sm">{success}</div>
        )}

        {/* Email chips */}
        <div className="flex flex-wrap gap-2">
          {emails.map((email, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
            >
              <span>{email}</span>
              <button
                onClick={() => removeEmail(email)}
                className="ml-2 text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Adding...' : 'Add Contributors'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
import React from 'react';
import { SmartAddPerk } from './SmartAddPerk';

interface AddPerkProps {
  onSuccess: () => void;
}

export const AddPerk: React.FC<AddPerkProps> = ({ onSuccess }) => {
  return <SmartAddPerk onSuccess={onSuccess} />;
};
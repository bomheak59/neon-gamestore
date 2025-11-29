import { useState, useEffect } from 'react';
import { Mail, Phone, User } from 'lucide-react';

export default function SmartContactInput({ onValueChange }) {
  const [inputValue, setInputValue] = useState('');
  const [detectedType, setDetectedType] = useState(null);

  useEffect(() => {
    const phoneRegex = /^0[689]\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (phoneRegex.test(inputValue)) {
      setDetectedType('PHONE');
      onValueChange({ type: 'SMS', value: inputValue });
    } else if (emailRegex.test(inputValue)) {
      setDetectedType('EMAIL');
      onValueChange({ type: 'EMAIL', value: inputValue });
    } else {
      setDetectedType(null);
      onValueChange(null);
    }
  }, [inputValue]);

  return (
    <div className="w-full">
      <label className="text-gray-400 text-sm mb-2 block">ช่องทางรับของ (เบอร์/เมล)</label>
      <div className="relative">
        <input
          type="text"
          placeholder="081xxxxxxx หรือ email@test.com"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 pl-12"
        />
        <div className="absolute left-4 top-3.5 text-gray-400">
          {detectedType === 'PHONE' ? <Phone className="w-5 h-5 text-green-500" /> :
           detectedType === 'EMAIL' ? <Mail className="w-5 h-5 text-blue-500" /> :
           <User className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Property, PropertyValue } from '../types';

interface PropertyInputProps {
  property: Property;
  value: PropertyValue;
  error?: string | null;
  onChange: (value: PropertyValue) => void;
}

export default function PropertyInput({ property, value, error, onChange }: PropertyInputProps) {
  const renderInput = () => {
    switch (property.type) {
      case 'text':
        return property.multiline ? (
          <textarea
            id={property.id}
            value={value as string || ''}
            onChange={e => onChange(e.target.value)}
            className={`w-full rounded-md shadow-sm ${
              error ? 'border-red-300' : 'border-gray-300'
            } focus:border-indigo-500 focus:ring-indigo-500`}
            rows={4}
            required={property.required}
          />
        ) : (
          <input
            type="text"
            id={property.id}
            value={value as string || ''}
            onChange={e => onChange(e.target.value)}
            maxLength={property.maxLength}
            className={`w-full rounded-md shadow-sm ${
              error ? 'border-red-300' : 'border-gray-300'
            } focus:border-indigo-500 focus:ring-indigo-500`}
            required={property.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={property.id}
            value={value as number || ''}
            onChange={e => onChange(Number(e.target.value))}
            min={property.min}
            max={property.max}
            className={`w-full rounded-md shadow-sm ${
              error ? 'border-red-300' : 'border-gray-300'
            } focus:border-indigo-500 focus:ring-indigo-500`}
            required={property.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={property.id}
            value={value as string || ''}
            onChange={e => onChange(e.target.value)}
            className={`w-full rounded-md shadow-sm ${
              error ? 'border-red-300' : 'border-gray-300'
            } focus:border-indigo-500 focus:ring-indigo-500`}
            required={property.required}
          />
        );

      case 'tags':
        const tags = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = [...tags];
                      newTags.splice(index, 1);
                      onChange(newTags);
                    }}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tag..."
              onKeyDown={e => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  e.preventDefault();
                  const newTag = e.currentTarget.value.trim();
                  if (newTag && !tags.includes(newTag)) {
                    onChange([...tags, newTag]);
                    e.currentTarget.value = '';
                  }
                }
              }}
              className={`w-full rounded-md shadow-sm ${
                error ? 'border-red-300' : 'border-gray-300'
              } focus:border-indigo-500 focus:ring-indigo-500`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label htmlFor={property.id} className="block text-sm font-medium text-gray-700">
        {property.label}
        {property.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1">
        {renderInput()}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
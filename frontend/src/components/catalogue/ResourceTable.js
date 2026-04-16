import React from 'react';

const ResourceTable = ({ resources, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-100 text-emerald-700';
      case 'BUSY': return 'bg-amber-100 text-amber-700';
      case 'MAINTENANCE': return 'bg-blue-100 text-blue-700';
      case 'OUT_OF_ORDER': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (resources.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500 font-medium">No resources found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Resource</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Capacity</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50 transition duration-150">
                <td className="py-4 px-6">
                  <span className="font-semibold text-gray-800 block">{resource.name}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-600 font-medium">{resource.type.replace('_', ' ')}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-sm text-gray-600 font-mono">{resource.capacity || '-'}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-500">{resource.location}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight ${getStatusColor(resource.status)}`}>
                    {resource.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button
                    onClick={() => onEdit(resource)}
                    className="text-blue-500 hover:text-blue-700 font-medium text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(resource.id)}
                    className="text-rose-500 hover:text-rose-700 font-medium text-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;

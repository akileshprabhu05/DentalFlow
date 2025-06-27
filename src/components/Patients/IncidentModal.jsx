import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';

const IncidentModal = ({ patient, incident, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: undefined,
    treatment: '',
    status: 'Scheduled',
    nextAppointmentDate: '',
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (incident) {
      setFormData({
        title: incident.title,
        description: incident.description,
        comments: incident.comments,
        appointmentDate: incident.appointmentDate,
        cost: incident.cost,
        treatment: incident.treatment || '',
        status: incident.status,
        nextAppointmentDate: incident.nextAppointmentDate || '',
        files: incident.files || [],
      });
    }
  }, [incident]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const file = e.target.files[0];
      const base64 = await storage.saveFile(file);
      const newFile = {
        id: `f${Date.now()}`,
        name: file.name,
        url: base64,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      setFormData((prev) => ({ ...prev, files: [...(prev.files || []), newFile] }));
      setUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: (prev.files || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const allIncidents = storage.getIncidents();
    const now = new Date().toISOString();

    let newIncident;

    if (incident) {
      newIncident = {
        ...incident,
        ...formData,
        updatedAt: now,
      };
      const updated = allIncidents.map((i) => (i.id === incident.id ? newIncident : i));
      storage.saveIncidents(updated);
    } else {
      newIncident = {
        id: `i${Date.now()}`,
        patientId: patient.id,
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      storage.saveIncidents([...allIncidents, newIncident]);
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
        <h2 className="text-xl font-semibold mb-4">{incident ? 'Edit' : 'Add'} Incident</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea name="comments" value={formData.comments} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Appointment Date *</label>
            <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost</label>
            <input type="number" name="cost" value={formData.cost || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Treatment</label>
            <input type="text" name="treatment" value={formData.treatment} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Next Appointment Date</label>
            <input type="datetime-local" name="nextAppointmentDate" value={formData.nextAppointmentDate || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">File Uploads</label>
            <input type="file" onChange={handleFileChange} disabled={uploading} />
            {uploading && <span className="text-xs text-gray-500 ml-2">Uploading...</span>}
            <div className="flex flex-wrap mt-2">
              {(formData.files || []).map((file, idx) => (
                <div key={idx} className="flex items-center mr-2 mb-2 bg-gray-100 px-2 py-1 rounded">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs mr-2">{file.name}</a>
                  <button type="button" onClick={() => handleRemoveFile(idx)} className="text-red-500 text-xs">&times;</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentModal;
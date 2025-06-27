import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { storage } from '../../utils/storage';
import IncidentModal from './IncidentModal';

const IncidentList = ({ patient }) => {
  const [incidents, setIncidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const allIncidents = storage.getIncidents();
    setIncidents(allIncidents.filter((i) => i.patientId === patient.id));
  }, [patient.id]);

  const handleAdd = () => {
    setSelectedIncident(null);
    setShowModal(true);
  };

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    setShowModal(true);
  };

  const handleDelete = (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      const allIncidents = storage.getIncidents();
      const updated = allIncidents.filter((i) => i.id !== incidentId);
      storage.saveIncidents(updated);
      setIncidents(updated.filter((i) => i.patientId === patient.id));
    }
  };

  const handleSave = () => {
    const allIncidents = storage.getIncidents();
    setIncidents(allIncidents.filter((i) => i.patientId === patient.id));
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Appointments / Incidents</h2>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Incident
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {incidents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No incidents found for this patient.</div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="py-4 flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">{incident.title}</div>
                <div className="text-sm text-gray-600">
                  {new Date(incident.appointmentDate).toLocaleString()} - {incident.status}
                </div>
                <div className="text-xs text-gray-500">{incident.treatment}</div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(incident)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(incident.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {incident.files && incident.files.length > 0 && (
                  <FileText className="h-4 w-4 text-gray-400 ml-2" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <IncidentModal
          patient={patient}
          incident={selectedIncident}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default IncidentList;

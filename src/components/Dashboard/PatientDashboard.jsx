import React, { useEffect } from "react";
import {
  Calendar,
  Clock,
  FileText,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { setPatients } from "../../store/slices/patientsSlice";
import { setIncidents } from "../../store/slices/incidentsSlice";
import { storage } from "../../utils/storage";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { patients } = useSelector((state) => state.patients);
  const { incidents } = useSelector((state) => state.incidents);

  useEffect(() => {
    const loadedPatients = storage.getPatients();
    const loadedIncidents = storage.getIncidents();
    dispatch(setPatients(loadedPatients));
    dispatch(setIncidents(loadedIncidents));
  }, [dispatch]);

  const currentPatient = patients.find((p) => p.id === user?.patientId);
  const patientIncidents = incidents.filter(
    (i) => i.patientId === user?.patientId
  );

  const upcomingAppointments = patientIncidents
    .filter(
      (i) =>
        i.status === "Scheduled" && new Date(i.appointmentDate) > new Date()
    )
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const completedTreatments = patientIncidents.filter(
    (i) => i.status === "Completed"
  );
  const totalCost = completedTreatments.reduce(
    (sum, incident) => sum + (incident.cost || 0),
    0
  );

  if (!currentPatient) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          Patient profile not found. Please contact the administrator.
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <span className="text-blue-100 font-medium">{currentDate}</span>
              </div>
              <h1 className="text-4xl font-bold mb-2 leading-tight">
                Hello, {currentPatient.name}
                <span className="block text-3xl text-blue-100">
                  Welcome to your Dashboard
                </span>
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Here you can view your appointments, treatment history, and stay
                informed about your dental care journey.
              </p>

              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm">Account Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-200" />
                  <span className="text-blue-100 text-sm">
                    Personalized Insights
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {completedTreatments.length}
                  </div>
                  <div className="text-blue-100 text-sm">
                    Treatments Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Upcoming Appointments"
          value={upcomingAppointments.length}
          Icon={Calendar}
          bg="bg-blue-100"
          color="text-blue-600"
        />
        <StatCard
          label="Completed Treatments"
          value={completedTreatments.length}
          Icon={FileText}
          bg="bg-green-100"
          color="text-green-600"
        />
        <StatCard
          label="Total Spent"
          value={`$${totalCost}`}
          Icon={DollarSign}
          bg="bg-purple-100"
          color="text-purple-600"
        />
        <StatCard
          label="In Progress"
          value={
            patientIncidents.filter((i) => i.status === "In Progress").length
          }
          Icon={Clock}
          bg="bg-orange-100"
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
            <User className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <ProfileInfo
              icon={<User />}
              label="Full Name"
              value={currentPatient.name}
            />
            <ProfileInfo
              icon={<Calendar />}
              label="Date of Birth"
              value={format(new Date(currentPatient.dob), "MMM dd, yyyy")}
            />
            <ProfileInfo
              icon={<Phone />}
              label="Contact"
              value={currentPatient.contact}
            />
            {currentPatient.email && (
              <ProfileInfo
                icon={<Mail />}
                label="Email"
                value={currentPatient.email}
              />
            )}
            {currentPatient.address && (
              <ProfileInfo
                icon={<MapPin />}
                label="Address"
                value={currentPatient.address}
              />
            )}
            {currentPatient.emergencyContact && (
              <ProfileInfo
                icon={<AlertCircle />}
                label="Emergency Contact"
                value={currentPatient.emergencyContact}
              />
            )}
          </div>

          {currentPatient.healthInfo && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                Health Information
              </h3>
              <p className="text-sm text-blue-800">
                {currentPatient.healthInfo}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming Appointments
            </h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {incident.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {incident.description}
                      </p>
                      {incident.treatment && (
                        <p className="text-sm text-blue-600 mt-1">
                          Treatment: {incident.treatment}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(
                          new Date(incident.appointmentDate),
                          "MMM dd, yyyy"
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(new Date(incident.appointmentDate), "hh:mm a")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Treatment History
          </h2>
          <FileText className="h-5 w-5 text-gray-400" />
        </div>

        {completedTreatments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No treatment history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedTreatments.slice(0, 5).map((incident) => (
              <div
                key={incident.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {incident.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {incident.description}
                    </p>
                    {incident.treatment && (
                      <p className="text-sm text-blue-600 mt-1">
                        Treatment: {incident.treatment}
                      </p>
                    )}
                    {incident.comments && (
                      <p className="text-sm text-gray-500 mt-1">
                        Notes: {incident.comments}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-500 mb-1">
                      {format(
                        new Date(incident.appointmentDate),
                        "MMM dd, yyyy"
                      )}
                    </div>
                    {incident.cost && (
                      <div className="text-sm font-medium text-green-600">
                        ${incident.cost}
                      </div>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      {incident.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, Icon, bg, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 ${bg} rounded-lg`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

const ProfileInfo = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default PatientDashboard;

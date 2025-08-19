import React, { useRef, useState, useEffect } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit3,
  UserPlus,
  RotateCcw,
  Download,
  X,
  Search,
  Bell,
  ChevronDown,
  Trash,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Thermometer,
  Shield,
  TrendingUp,
  Activity,
  Archive,
  Upload
} from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import Layout from "@/components/layout";
import { Api } from "@/helper/service";

// Enhanced modal for comprehensive compliance reporting
function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    // Basic report info
    date: new Date(),
    reportPeriod: {
      startDate: new Date(),
      endDate: new Date()
    },
    regulationType: [],
    complianceCategories: [],
    
    // Audit data
    totalDeliveries: 0,
    audit: 0,
    violation: 0,
    violationType: "",
    status: "draft",
    
    // HIPAA compliance
    hipaaCompliance: {
      patientDataEncrypted: true,
      accessLogsComplete: true,
      unauthorizedAccessAttempts: 0,
      dataBreachIncidents: 0,
      businessAssociateAgreements: true,
      auditTrailComplete: true
    },
    
    // FDA compliance
    fdaCompliance: {
      drugPedigreeComplete: true,
      serialNumberVerification: true,
      temperatureMapping: true,
      qualificationDocuments: true,
      adverseEventReporting: true
    },
    
    // Cold chain compliance
    coldChainCompliance: {
      totalMonitoredDeliveries: 0,
      temperatureExcursions: 0,
      averageTemperature: 0,
      sensorCoveragePercentage: 100
    },
    
    // Chain of custody
    chainOfCustodyCompliance: {
      completeDocumentationRate: 100,
      signatureCompletionRate: 100,
      deliveryConfirmationRate: 100,
      gpsTrackingCoverage: 100
    }
  });

  const regulationOptions = [
    { label: 'HIPAA', value: 'HIPAA' },
    { label: 'FDA', value: 'FDA' },
    // { label: 'USP 797', value: 'USP_797' },
    // { label: 'USP 800', value: 'USP_800' },
    // { label: 'DEA', value: 'DEA' },
    // { label: 'DOT', value: 'DOT' },
    // { label: 'OSHA', value: 'OSHA' },
    // { label: 'State Pharmacy', value: 'STATE_PHARMACY' },
    // { label: 'GDPR', value: 'GDPR' }
  ];

  const complianceCategoryOptions = [
    { label: 'Patient Data Protection', value: 'patient_data_protection' },
    { label: 'Cold Chain', value: 'cold_chain' },
    { label: 'Chain of Custody', value: 'chain_of_custody' },
    { label: 'Controlled Substances', value: 'controlled_substances' },
    { label: 'Hazardous Materials', value: 'hazardous_materials' },
    { label: 'Delivery Validation', value: 'delivery_validation' }
  ];

  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Pending Review', value: 'pending_review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' }
  ];

  useEffect(() => {
    if (mode === "edit" && facility) {
      setFormData({
        ...facility,
        date: new Date(facility.date),
        reportPeriod: {
          startDate: new Date(facility.reportPeriod?.startDate),
          endDate: new Date(facility.reportPeriod?.endDate)
        }
      });
    } else {
      // Reset form for add mode
      setFormData({
        date: new Date(),
        reportPeriod: {
          startDate: new Date(),
          endDate: new Date()
        },
        regulationType: [],
        complianceCategories: [],
        totalDeliveries: 0,
        audit: 0,
        violation: 0,
        violationType: "",
        status: "draft",
        hipaaCompliance: {
          patientDataEncrypted: true,
          accessLogsComplete: true,
          unauthorizedAccessAttempts: 0,
          dataBreachIncidents: 0,
          businessAssociateAgreements: true,
          auditTrailComplete: true
        },
        fdaCompliance: {
          drugPedigreeComplete: true,
          serialNumberVerification: true,
          temperatureMapping: true,
          qualificationDocuments: true,
          adverseEventReporting: true
        },
        coldChainCompliance: {
          totalMonitoredDeliveries: 0,
          temperatureExcursions: 0,
          averageTemperature: 0,
          sensorCoveragePercentage: 100
        },
        chainOfCustodyCompliance: {
          completeDocumentationRate: 100,
          signatureCompletionRate: 100,
          deliveryConfirmationRate: 100,
          gpsTrackingCoverage: 100
        }
      });
    }
  }, [mode, facility, isOpen]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog
      visible={isOpen}
      onHide={onClose}
      style={{ width: '90vw', maxWidth: '1200px' }}
      header={mode === "add" ? "Create Compliance Report" : "Edit Compliance Report"}
      modal
      className="p-fluid"
    >
      <form onSubmit={handleSubmit}>
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
          {/* Basic Information Tab */}
          <TabPanel header="Basic Information" leftIcon="pi pi-info-circle">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Report Date</label>
                <Calendar
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.value)}
                  dateFormat="mm/dd/yy"
                  showIcon
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <Dropdown
                  value={formData.status}
                  options={statusOptions}
                  onChange={(e) => handleInputChange('status', e.value)}
                  placeholder="Select Status"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Report Period Start</label>
                <Calendar
                  value={formData.reportPeriod.startDate}
                  onChange={(e) => handleInputChange('reportPeriod.startDate', e.value)}
                  dateFormat="mm/dd/yy"
                  showIcon
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Report Period End</label>
                <Calendar
                  value={formData.reportPeriod.endDate}
                  onChange={(e) => handleInputChange('reportPeriod.endDate', e.value)}
                  dateFormat="mm/dd/yy"
                  showIcon
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Regulation Types</label>
                <MultiSelect
                  value={formData.regulationType}
                  options={regulationOptions}
                  onChange={(e) => handleInputChange('regulationType', e.value)}
                  placeholder="Select Regulations"
                  display="chip"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Compliance Categories</label>
                <MultiSelect
                  value={formData.complianceCategories}
                  options={complianceCategoryOptions}
                  onChange={(e) => handleInputChange('complianceCategories', e.value)}
                  placeholder="Select Categories"
                  display="chip"
                />
              </div>
            </div>
          </TabPanel>

          {/* Audit Data Tab */}
          <TabPanel header="Audit Data" leftIcon="pi pi-chart-line">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Total Deliveries</label>
                <input
                  type="number"
                  value={formData.totalDeliveries}
                  onChange={(e) => handleInputChange('totalDeliveries', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Audited Deliveries</label>
                <input
                  type="number"
                  value={formData.audit}
                  onChange={(e) => handleInputChange('audit', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Violations Detected</label>
                <input
                  type="number"
                  value={formData.violation}
                  onChange={(e) => handleInputChange('violation', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Violation Type</label>
                <input
                  type="text"
                  value={formData.violationType}
                  onChange={(e) => handleInputChange('violationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Temperature Excursion, Documentation Missing"
                />
              </div>

              {/* Compliance Rate Display */}
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Compliance Rate</h4>
                <div className="text-3xl font-bold text-blue-600">
                  {formData.audit > 0 ? (((formData.audit - formData.violation) / formData.audit) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-sm text-gray-600">
                  {formData.audit - formData.violation} compliant out of {formData.audit} audited deliveries
                </p>
              </div>
            </div>
          </TabPanel>

          {/* HIPAA Compliance Tab */}
          <TabPanel header="HIPAA Compliance" leftIcon="pi pi-shield">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.hipaaCompliance.patientDataEncrypted}
                    onChange={(e) => handleInputChange('hipaaCompliance.patientDataEncrypted', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Patient Data Encrypted</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.hipaaCompliance.accessLogsComplete}
                    onChange={(e) => handleInputChange('hipaaCompliance.accessLogsComplete', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Access Logs Complete</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.hipaaCompliance.businessAssociateAgreements}
                    onChange={(e) => handleInputChange('hipaaCompliance.businessAssociateAgreements', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Business Associate Agreements</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.hipaaCompliance.auditTrailComplete}
                    onChange={(e) => handleInputChange('hipaaCompliance.auditTrailComplete', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Audit Trail Complete</label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Unauthorized Access Attempts</label>
                  <input
                    type="number"
                    value={formData.hipaaCompliance.unauthorizedAccessAttempts}
                    onChange={(e) => handleInputChange('hipaaCompliance.unauthorizedAccessAttempts', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Data Breach Incidents</label>
                  <input
                    type="number"
                    value={formData.hipaaCompliance.dataBreachIncidents}
                    onChange={(e) => handleInputChange('hipaaCompliance.dataBreachIncidents', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          {/* FDA Compliance Tab */}
          <TabPanel header="FDA/USP Compliance" leftIcon="pi pi-verified">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fdaCompliance.drugPedigreeComplete}
                    onChange={(e) => handleInputChange('fdaCompliance.drugPedigreeComplete', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Drug Pedigree Complete</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fdaCompliance.serialNumberVerification}
                    onChange={(e) => handleInputChange('fdaCompliance.serialNumberVerification', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Serial Number Verification</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fdaCompliance.temperatureMapping}
                    onChange={(e) => handleInputChange('fdaCompliance.temperatureMapping', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Temperature Mapping</label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fdaCompliance.qualificationDocuments}
                    onChange={(e) => handleInputChange('fdaCompliance.qualificationDocuments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Qualification Documents</label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fdaCompliance.adverseEventReporting}
                    onChange={(e) => handleInputChange('fdaCompliance.adverseEventReporting', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Adverse Event Reporting</label>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Cold Chain Compliance Tab */}
          <TabPanel header="Cold Chain Monitoring" leftIcon="pi pi-cloud">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Total Monitored Deliveries</label>
                <input
                  type="number"
                  value={formData.coldChainCompliance.totalMonitoredDeliveries}
                  onChange={(e) => handleInputChange('coldChainCompliance.totalMonitoredDeliveries', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Temperature Excursions</label>
                <input
                  type="number"
                  value={formData.coldChainCompliance.temperatureExcursions}
                  onChange={(e) => handleInputChange('coldChainCompliance.temperatureExcursions', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Average Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.coldChainCompliance.averageTemperature}
                  onChange={(e) => handleInputChange('coldChainCompliance.averageTemperature', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sensor Coverage (%)</label>
                <input
                  type="number"
                  value={formData.coldChainCompliance.sensorCoveragePercentage}
                  onChange={(e) => handleInputChange('coldChainCompliance.sensorCoveragePercentage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </TabPanel>

          {/* Chain of Custody Tab */}
          <TabPanel header="Chain of Custody" leftIcon="pi pi-link">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Complete Documentation Rate (%)</label>
                <input
                  type="number"
                  value={formData.chainOfCustodyCompliance.completeDocumentationRate}
                  onChange={(e) => handleInputChange('chainOfCustodyCompliance.completeDocumentationRate', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Signature Completion Rate (%)</label>
                <input
                  type="number"
                  value={formData.chainOfCustodyCompliance.signatureCompletionRate}
                  onChange={(e) => handleInputChange('chainOfCustodyCompliance.signatureCompletionRate', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Delivery Confirmation Rate (%)</label>
                <input
                  type="number"
                  value={formData.chainOfCustodyCompliance.deliveryConfirmationRate}
                  onChange={(e) => handleInputChange('chainOfCustodyCompliance.deliveryConfirmationRate', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">GPS Tracking Coverage (%)</label>
                <input
                  type="number"
                  value={formData.chainOfCustodyCompliance.gpsTrackingCoverage}
                  onChange={(e) => handleInputChange('chainOfCustodyCompliance.gpsTrackingCoverage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={onClose}
          />
          <Button
            type="submit"
            label={mode === "add" ? "Create Report" : "Update Report"}
            icon="pi pi-check"
            className="p-button-primary"
          />
        </div>
      </form>
    </Dialog>
  );
}

// Compliance Dashboard Component
function ComplianceDashboard({ dashboardData }) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Compliance Overview'
      }
    }
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
    datasets: [
      {
        data: [
          dashboardData?.riskDistribution?.low || 0,
          dashboardData?.riskDistribution?.medium || 0,
          dashboardData?.riskDistribution?.high || 0,
          dashboardData?.riskDistribution?.critical || 0
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#DC2626'],
        borderColor: ['#059669', '#D97706', '#DC2626', '#B91C1C'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Compliance Rate</p>
            <p className="text-2xl font-bold text-blue-900">
              {dashboardData?.overview?.avgComplianceRate?.toFixed(1) || 0}%
            </p>
          </div>
          <CheckCircle className="h-8 w-8 text-blue-600" />
        </div>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">Total Violations</p>
            <p className="text-2xl font-bold text-red-900">
              {dashboardData?.overview?.totalViolations || 0}
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-600">Critical Issues</p>
            <p className="text-2xl font-bold text-yellow-900">
              {dashboardData?.overview?.criticalIssues || 0}
            </p>
          </div>
          <Activity className="h-8 w-8 text-yellow-600" />
        </div>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">Total Reports</p>
            <p className="text-2xl font-bold text-green-900">
              {dashboardData?.overview?.totalReports || 0}
            </p>
          </div>
          <FileText className="h-8 w-8 text-green-600" />
        </div>
      </Card>

      {dashboardData?.riskDistribution && (
        <div className="md:col-span-2 lg:col-span-4">
          <Card>
            <div className="h-64">
              <Chart type="doughnut" data={riskDistributionData} options={chartOptions} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Compliances({loader}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [complianceData, setComplianceData] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    regulationType: '',
    status: '',
    riskLevel: ''
  });

  // Load compliance reports
  const loadComplianceReports = async () => {
    try {
      loader(true);
      const response = await Api('get', '/compliance', filters);

      console.log('Compliance Reports Response:', response.data);

      if (response.data) {
        setComplianceData(response.data);
        setTotalRecords(response.data.totalReports);
      }
    } catch (error) {
      console.error('Error loading compliance reports:', error);
    } finally {
      loader(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const response = await Api('get', '/compliance/dashboard');
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadComplianceReports();
    loadDashboardData();
  }, [filters]);

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === "add") {
        const response = await Api('post', '/compliance', { reportData: formData });
        if (response.data.status) {
          loadComplianceReports();
          loadDashboardData();
        }
      } else if (modalMode === "edit" && selectedFacility) {
        const response = await Api('put', `/compliance/${selectedFacility._id}`, { updateData: formData });
        if (response.data.status) {
          loadComplianceReports();
          loadDashboardData();
        }
      }
    } catch (error) {
      console.error('Error saving compliance report:', error);
    }
  };

  const handleEdit = (facility) => {
    setModalMode("edit");
    setSelectedFacility(facility);
    setModalOpen(true);
    setActiveDropdown(null);
  };

  const handleAddNew = () => {
    setModalMode("add");
    setSelectedFacility(null);
    setModalOpen(true);
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this compliance report?')) {
      try {
        const response = await Api('delete', `/compliance/${reportId}`);
        if (response.data.status) {
          loadComplianceReports();
          loadDashboardData();
        }
      } catch (error) {
        console.error('Error deleting compliance report:', error);
      }
    }
  };

  const handleDownloadAudit = async (reportId) => {
    try {
      const response = await Api('get', `/compliance/${reportId}/audit-package`);
      if (response.data) {
        // Create and download JSON file
        const dataStr = JSON.stringify(response.data.auditPackage, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compliance-audit-${reportId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading audit package:', error);
    }
  };

  const getMenuItems = (row) => [
    {
      label: "View Details",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("View clicked", row);
      },
    },
    {
      label: "Edit",
      icon: <Edit3 className="w-5 h-5 text-gray-500" />,
      command: () => {
        handleEdit(row);
      },
    },
    {
      label: "Download Audit",
      icon: <Download className="w-5 h-5 text-gray-500" />,
      command: () => {
        handleDownloadAudit(row._id);
      },
    },
    {
      label: "Delete",
      icon: <Trash className="w-5 h-5 text-gray-500" />,
      command: () => {
        handleDelete(row._id);
      },
    },
  ];

  const getStatusStyle = (status) => {
    const statusStyles = {
      draft: "bg-gray-100 text-gray-800 border border-gray-200",
      pending_review: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      approved: "bg-green-100 text-green-800 border border-green-200",
      published: "bg-blue-100 text-blue-800 border border-blue-200",
      archived: "bg-purple-100 text-purple-800 border border-purple-200"
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getRiskBadge = (riskLevel) => {
    const riskStyles = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
          riskStyles[riskLevel] || "bg-gray-100 text-gray-800"
        }`}
      >
        {riskLevel?.toUpperCase()}
      </span>
    );
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Layout title="Compliance Reports">
      {/* Dashboard Overview */}
      {dashboardData && <ComplianceDashboard dashboardData={dashboardData} />}

      {/* Main Content */}
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        {/* Header with filters and actions */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">
              Compliance Reports
            </span>
            <button
              onClick={handleAddNew}
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Report</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.regulationType}
              onChange={(e) => setFilters(prev => ({ ...prev, regulationType: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
            >
              <option value="">All Regulations</option>
              <option value="HIPAA">HIPAA</option>
              <option value="FDA">FDA</option>
              <option value="USP_797">USP 797</option>
              <option value="DEA">DEA</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>

            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>

            <button
              onClick={() => setFilters({ page: 1, limit: 10, regulationType: '', status: '', riskLevel: '' })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <DataTable
          value={complianceData}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          rowClassName={() => "hover:bg-gray-50"}
          size="small"
          paginator
          rows={filters.limit}
          totalRecords={totalRecords}
          onPage={(e) => setFilters(prev => ({ ...prev, page: e.page + 1 }))}
          lazy
        >
          <Column
            field="no"
            header="No."
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px", width: "60px" }}
          />
          <Column
            field="_id"
            header="Report ID"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="date"
            header="Date"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          />
          <Column
            field="regulationType"
            header="Regulations"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="audit"
            header="Audited"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="violation"
            header="Violations"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="complianceRate"
            header="Compliance Rate"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => `${rowData.complianceRate?.toFixed(1) || 0}%`}
          />
          <Column
            field="riskLevel"
            header="Risk Level"
            body={(rowData) => getRiskBadge(rowData.riskLevel)}
          />
          <Column
            field="status"
            header="Status"
            body={(rowData) => getStatusStyle(rowData.status)}
          />
          <Column
            header="Action"
            bodyStyle={{
              verticalAlign: "middle",
              textAlign: "center",
              overflow: "visible",
              position: "relative",
            }}
            body={(rowData, options) => (
              <div className="relative flex justify-center">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedRowData(rowData);
                    menuRef.current.toggle(event);
                  }}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
          />
        </DataTable>
      </div>

      <Menu
        model={selectedRowData ? getMenuItems(selectedRowData) : []}
        popup
        ref={menuRef}
        id="popup_menu"
      />

      <AddEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        facility={selectedFacility}
        onSubmit={handleModalSubmit}
      />
    </Layout>
  );
}

export default Compliances;

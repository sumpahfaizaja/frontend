'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Program MBKM', link: '/dashboard/program-mbkm' }
];

const tabs = [
  { id: 'programs', title: 'Jenis Program' },
  { id: 'submission', title: 'Pengajuan Rencana' },
  { id: 'status', title: 'Status MBKM' },
  { id: 'scores', title: 'Hasil Nilai' },
  { id: 'mentor-info', title: 'Dosen Pembimbing' },
  { id: 'feedback', title: 'Form Penilaian' },
  { id: 'statement', title: 'Surat Pernyataan' }
];

export default function ProgramMBKMPage() {
  const [activeTab, setActiveTab] = useState('programs');
  const [programs, setPrograms] = useState([]);
  const [status, setStatus] = useState(null);
  const [scores, setScores] = useState([]);
  const [mentorInfo, setMentorInfo] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [statementUrl, setStatementUrl] = useState('');

  // Fetch data when tabs are activated
  useEffect(() => {
    if (activeTab === 'programs') fetchPrograms();
    if (activeTab === 'status') fetchStatus();
    if (activeTab === 'scores') fetchScores();
    if (activeTab === 'mentor-info') fetchMentorInfo();
    if (activeTab === 'statement') fetchStatementUrl();
  }, [activeTab]);

  // Fetch programs
  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/programs`);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  // Fetch status
  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans/{studentId}`);
      setStatus(response.data);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  // Fetch scores
  const fetchScores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/scores/{studentId}`);
      setScores(response.data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  // Fetch mentor info
  const fetchMentorInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mentors/{mentorNIP}`);
      setMentorInfo(response.data);
    } catch (error) {
      console.error('Error fetching mentor info:', error);
    }
  };

  // Fetch statement URL
  const fetchStatementUrl = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/statements/{studentId}`
      );
      setStatementUrl(response.data.url);
    } catch (error) {
      console.error('Error fetching statement URL:', error);
    }
  };

  // Handle form submission for program plans
  const handleSubmitPlan = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/plans`, {
        programId: selectedProgramId, // Replace with actual input value
        document: uploadedFile // Replace with actual file input
      });
      alert('Pengajuan berhasil!');
    } catch (error) {
      console.error('Error submitting plan:', error);
      alert('Pengajuan gagal.');
    }
  };

  // Handle form submission for feedback
  const handleSubmitFeedback = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/feedback`, { feedback });
      alert('Feedback berhasil dikirim!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'programs':
        return (
          <div>
            <h3 className="mb-4 text-xl font-semibold">Jenis Program</h3>
            <ul className="space-y-2">
              {programs.map((program) => (
                <li key={program.id} className="rounded border p-4">
                  <h4 className="font-bold">{program.name}</h4>
                  <p>Durasi: {program.duration}</p>
                  <p>Lokasi: {program.location}</p>
                  <p>Kuota: {program.quota}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'submission':
        return (
          <form onSubmit={handleSubmitPlan}>
            <h3 className="mb-4 text-xl font-semibold">
              Pengajuan Rencana MBKM
            </h3>
            <div>
              <label>Pilih Program:</label>
              <select>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Upload Dokumen:</label>
              <input type="file" />
            </div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Ajukan
            </button>
          </form>
        );
      case 'status':
        return (
          <div>
            <h3 className="mb-4 text-xl font-semibold">Status MBKM</h3>
            <p>Status: {status?.status || 'Loading...'}</p>
          </div>
        );
      case 'scores':
        return (
          <div>
            <h3 className="mb-4 text-xl font-semibold">Hasil Nilai MBKM</h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Komponen</th>
                  <th className="border p-2">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score.component}>
                    <td className="border p-2">{score.component}</td>
                    <td className="border p-2">{score.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'mentor-info':
        return (
          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Informasi Dosen Pembimbing
            </h3>
            <p>Nama: {mentorInfo?.name}</p>
            <p>NIP: {mentorInfo?.NIP}</p>
            <p>Email: {mentorInfo?.email}</p>
          </div>
        );
      case 'feedback':
        return (
          <form onSubmit={handleSubmitFeedback}>
            <h3 className="mb-4 text-xl font-semibold">Form Penilaian</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded border px-2 py-1"
            />
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Kirim
            </button>
          </form>
        );
      case 'statement':
        return (
          <div>
            <h3 className="mb-4 text-xl font-semibold">Surat Pernyataan</h3>
            <a
              href={statementUrl}
              download
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Unduh Surat
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="tabs flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="tab-content mt-4">{renderContent()}</div>
      </div>
    </PageContainer>
  );
}

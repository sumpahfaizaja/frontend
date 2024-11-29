'use client'; // Ensure this component is client-side

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation in App Router
import axios from 'axios';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

// API base URL
const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface Report {
  id: number;
  tanggal_laporan: string;
  jenis_laporan: string;
  status: string;
  file?: string;
  keterangan_prodi: string;
}

interface NewReport {
  nama_laporan: string;
  jenis_laporan: string;
  tanggal_laporan: string;
  log_aktivitas: string;
  file: File | null;
}

export default function LogbookPage() {
  const [programDetails, setProgramDetails] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]); // Store reports with specific type
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState<NewReport>({
    nama_laporan: '',
    jenis_laporan: '',
    tanggal_laporan: '',
    log_aktivitas: '',
    file: null
  });

  const router = useRouter();
  const programId = new URLSearchParams(window.location.search).get(
    'id_program_mbkm'
  ); // Get the ID from the query params

  useEffect(() => {
    if (programId) {
      fetchProgramDetails();
      fetchReports();
    }
  }, [programId]);

  // Fetch program details
  const fetchProgramDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/program-mbkm/${programId}`
      );
      setProgramDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching program details:', error);
      setLoading(false);
    }
  };

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/logbook?programId=${programId}`
      );
      setReports(response.data); // Set the reports data
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Handle modal input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewReport((prev) => ({
      ...prev,
      file: file
    }));
  };

  // Handle form submission to add new report
  const handleSubmitReport = async () => {
    try {
      const formData = new FormData();
      formData.append('nama_laporan', newReport.nama_laporan);
      formData.append('jenis_laporan', newReport.jenis_laporan);
      formData.append('tanggal_laporan', newReport.tanggal_laporan);
      formData.append('log_aktivitas', newReport.log_aktivitas);
      if (newReport.file) {
        formData.append('file', newReport.file);
      }

      await axios.post(`${API_BASE_URL}/logbook`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowModal(false); // Close modal after adding report
      fetchReports(); // Refresh the report list after adding a new one
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  // If loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-y-4">
        <Heading
          title={`Logbook`}
          description="Daftar logbook yang telah dikirim oleh tiap-tiap mahasiswa."
        />

        {/* Table for reports */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal Laporan, Upload</th>
                <th>Jenis Laporan</th>
                <th>Status</th>
                <th>File</th>
                <th>Keterangan Prodi</th>
              </tr>
            </thead>
            <tbody>
              {/* If no reports, show no rows and only the message */}
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    <i>No reports available. Please add a report.</i>
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr key={report.id}>
                    <td>{index + 1}</td>
                    <td>{report.tanggal_laporan}</td>
                    <td>{report.jenis_laporan}</td>
                    <td>{report.status}</td>
                    <td>{report.file ? 'File Uploaded' : 'No File'}</td>
                    <td>{report.keterangan_prodi}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add report button */}
        <Button onClick={toggleModal}>Tambah Laporan</Button>

        {/* Modal for adding new report */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg rounded-lg bg-white p-6">
              <h3 className="mb-4 text-xl">Set Nama Laporan</h3>
              <div>
                <label htmlFor="nama_laporan">Nama Laporan</label>
                <input
                  id="nama_laporan"
                  name="nama_laporan"
                  type="text"
                  className="mt-2 w-full"
                  value={newReport.nama_laporan}
                  onChange={handleInputChange}
                  placeholder="Masukkan Nama Laporan"
                />
              </div>

              <div>
                <label htmlFor="jenis_laporan">Jenis Laporan</label>
                <select
                  id="jenis_laporan"
                  name="jenis_laporan"
                  className="mt-2 w-full"
                  value={newReport.jenis_laporan}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Jenis Laporan</option>
                  <option value="laporan_harian">Laporan Harian</option>
                  <option value="laporan_mingguan">Laporan Mingguan</option>
                  <option value="laporan_bulanan">Laporan Bulanan</option>
                </select>
              </div>

              <div>
                <label htmlFor="tanggal_laporan">Tanggal Laporan</label>
                <input
                  id="tanggal_laporan"
                  name="tanggal_laporan"
                  type="date"
                  className="mt-2 w-full"
                  value={newReport.tanggal_laporan}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="log_aktivitas">Log Kegiatan</label>
                <textarea
                  id="log_aktivitas"
                  name="log_aktivitas"
                  className="mt-2 w-full"
                  value={newReport.log_aktivitas}
                  onChange={handleInputChange}
                  placeholder="Masukkan Deskripsi Kegiatan"
                />
              </div>

              <div>
                <label htmlFor="file">Berkas (Opsional)</label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  className="mt-2 w-full"
                  onChange={handleFileChange}
                />
              </div>

              <div className="mt-4">
                <Button onClick={handleSubmitReport}>Simpan</Button>
                <Button onClick={toggleModal} className="ml-2">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

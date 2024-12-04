'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Profile', link: '/dashboard/profile' }
];

export default function ProfilePage() {
  // State untuk menyimpan data mahasiswa dan gambar profil (dummy data sebagai contoh)
  const [profile, setProfile] = useState({
    nama: 'John Doe',
    email: 'johndoe@example.com',
    nim: '1234567890',
    semester: '5',
    profilePicture: '/images/default-profile.png' // Gambar default jika tidak ada gambar profil
  });

  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(false);

  // State untuk modal ubah kata sandi
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEditProfile = () => {
    setIsEditing(true); // Ubah ke mode edit
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Kembali ke mode tampilkan profil tanpa perubahan
  };

  const handleSaveProfile = () => {
    setIsEditing(false); // Simpan perubahan dan keluar dari mode edit
    alert('Profil telah disimpan!');
    // Tambahkan logika untuk menyimpan data ke backend jika diperlukan
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Make sure to cast the result to a string, since it's read as string | ArrayBuffer
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: reader.result as string // Cast to string
        }));
      };
      reader.readAsDataURL(file); // Mengubah file menjadi URL untuk ditampilkan
    }
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true); // Tampilkan modal untuk ubah kata sandi
  };

  const handleCloseModal = () => {
    setIsChangePasswordModalOpen(false); // Tutup modal
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Kata sandi baru dan konfirmasi tidak cocok!');
      return;
    }
    alert('Kata sandi berhasil diubah!');
    setIsChangePasswordModalOpen(false);
    // Tambahkan logika untuk menyimpan kata sandi baru ke backend jika diperlukan
  };

  return (
    <PageContainer scrollable={true}>
      {/* Breadcrumb */}
      <div className="flex flex-col gap-y-2">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Header */}
      <h2 className="my-4 text-2xl font-bold">Profil Mahasiswa</h2>

      {/* Informasi Profil */}
      <div className="rounded-md border bg-white p-6 shadow-md">
        <div className="mb-4">
          {/* Menampilkan gambar profil */}
          <div className="mb-4 flex justify-center">
            <img
              src={profile.profilePicture}
              alt="Profile Picture"
              className="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
            />
          </div>
          {/* Tombol untuk mengganti gambar profil */}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="block w-full text-sm text-gray-700"
            />
          )}
        </div>

        {/* Form untuk mengedit profil */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nama:
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profile.nama}
              onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {profile.nama}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          {isEditing ? (
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {profile.email}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            NIM:
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profile.nim}
              onChange={(e) => setProfile({ ...profile, nim: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">{profile.nim}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Semester:
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profile.semester}
              onChange={(e) =>
                setProfile({ ...profile, semester: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {profile.semester}
            </p>
          )}
        </div>

        {/* Tombol untuk ubah password */}
        {!isEditing && (
          <div className="flex justify-start">
            <button
              onClick={handleChangePassword}
              className="text-sm text-blue-500 hover:underline"
            >
              Ubah Kata Sandi
            </button>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="mt-6 flex flex-col gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveProfile}
                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Simpan Perubahan
              </button>
              <button
                onClick={handleCancelEdit}
                className="w-full rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Batalkan
              </button>
            </>
          ) : (
            <button
              onClick={handleEditProfile}
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Edit Profil
            </button>
          )}
        </div>
      </div>

      {/* Modal untuk ubah kata sandi */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="w-96 rounded-md bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">Ubah Kata Sandi</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Kata Sandi Saat Ini:
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Kata Sandi Baru:
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Konfirmasi Kata Sandi Baru:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleSavePassword}
                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Simpan
              </button>
              <button
                onClick={handleCloseModal}
                className="w-full rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

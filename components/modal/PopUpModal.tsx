import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Definisi tipe data untuk Mata Kuliah Konversi
interface MataKuliahKonversi {
  nama_matkul: string;
  kode_matkul: string;
  sks: number;
}

// Definisi tipe data untuk Props yang diterima oleh PopupModal
interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  nim: string | null;
}

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose, nim }) => {
  const [data, setData] = useState<MataKuliahKonversi | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && nim) {
      setLoading(true);
      fetch(
        `https://backend-si-mbkm.vercel.app/api/pendaftaran-mbkm/nim/${nim}`
      )
        .then((res) => res.json())
        .then((result: { mata_kuliah_konversi?: MataKuliahKonversi }) => {
          if (result.mata_kuliah_konversi) {
            setData(result.mata_kuliah_konversi);
          } else {
            setError('Data tidak ditemukan.');
          }
        })
        .catch(() => setError('Gagal mengambil data.'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, nim]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Mata Kuliah Konversi</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data ? (
          <div>
            <p>
              <strong>Nama Mata Kuliah:</strong> {data.nama_matkul}
            </p>
            <p>
              <strong>Kode Mata Kuliah:</strong> {data.kode_matkul}
            </p>
            <p>
              <strong>SKS:</strong> {data.sks}
            </p>
          </div>
        ) : (
          <p>Tidak ada data.</p>
        )}
        <Button onClick={onClose}>Tutup</Button>
      </DialogContent>
    </Dialog>
  );
};

export default PopupModal;

import { useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandInput
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { MataKuliahKonversi } from '@/app/dashboard/program/[id]/page';

interface MatkulSelectorProps {
  mataKuliahList: MataKuliahKonversi[];
  selectedMataKuliah: number[];
  setSelectedMataKuliah: (value: number[]) => void;
  programCategory: string;
}

export default function MatkulSelector({
  mataKuliahList,
  selectedMataKuliah,
  setSelectedMataKuliah,
  programCategory
}: MatkulSelectorProps) {
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const filteredMatkulList =
    programCategory === 'IISMA'
      ? mataKuliahList.filter((matkul) => matkul.jenis_matkul === 'wajib')
      : mataKuliahList.filter((matkul) => matkul.jenis_matkul !== 'wajib');

  const handleSelect = (id: number) => {
    if (selectedMataKuliah.includes(id)) {
      setSelectedMataKuliah(
        selectedMataKuliah.filter((matkul) => matkul !== id)
      );
    } else {
      setSelectedMataKuliah([...selectedMataKuliah, id]);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="mb-2 text-sm font-medium text-muted-foreground">
        Pilih Mata Kuliah Konversi
      </h4>

      {/* Searchable List */}
      <Command className="border">
        <CommandInput
          placeholder="Cari mata kuliah..."
          value={search}
          onValueChange={setSearch}
          ref={inputRef}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
        {open && (
          <CommandList>
            <CommandEmpty>Tidak ada hasil.</CommandEmpty>
            <CommandGroup>
              {filteredMatkulList
                .filter((matkul) =>
                  matkul.nama_matkul
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((matkul) => (
                  <CommandItem
                    key={matkul.id_matkul_knvrs}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => handleSelect(matkul.id_matkul_knvrs)}
                    className="flex cursor-pointer items-center justify-between"
                  >
                    {matkul.nama_matkul} ({matkul.sks} SKS)
                    {selectedMataKuliah.includes(matkul.id_matkul_knvrs) ? (
                      <Check className="h-4 w-4" />
                    ) : null}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>

      {/* Selected Items Display */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedMataKuliah.map((id) => {
          const matkul = mataKuliahList.find((m) => m.id_matkul_knvrs === id);
          return matkul ? (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {matkul.nama_matkul} ({matkul.sks} SKS)
              <button onClick={() => handleSelect(id)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );
}

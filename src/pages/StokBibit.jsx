import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

export default function StokBibit() {
  const [stok, setStok] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    tanggal: "",
    jumlah: "",
    harga_per_unit: "",
  });

  useEffect(() => {
    fetchStok();
  }, []);

  async function fetchStok() {
    setLoading(true);
    const { data, error } = await supabase
      .from("stok_bibit")
      .select("*")
      .order("tanggal", { ascending: false });

    if (error) {
      console.error("Gagal fetch stok bibit:", error);
    } else {
      setStok(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { id, tanggal, jumlah, harga_per_unit } = formData;
    const totalHarga = jumlah * harga_per_unit;

    if (!tanggal || !jumlah || !harga_per_unit) {
      alert("Mohon isi semua data");
      return;
    }

    if (id) {
      // Update
      const { error } = await supabase
        .from("stok_bibit")
        .update({ tanggal, jumlah, harga_per_unit, harga: totalHarga })
        .eq("id", id);
      if (error) {
        console.error("Update gagal:", error);
      }
    } else {
      // Insert
      const { error } = await supabase
        .from("stok_bibit")
        .insert([{ tanggal, jumlah, harga_per_unit, harga: totalHarga }]);
      if (error) {
        console.error("Insert gagal:", error);
      }
    }

    setFormData({ id: null, tanggal: "", jumlah: "", harga_per_unit: "" });
    fetchStok();
  }

  async function handleEdit(item) {
    setFormData({
      id: item.id,
      tanggal: item.tanggal,
      jumlah: item.jumlah,
      harga_per_unit: item.harga_per_unit,
    });
  }

  async function handleDelete(id) {
    if (window.confirm("Yakin mau hapus data ini?")) {
      const { error } = await supabase.from("stok_bibit").delete().eq("id", id);
      if (error) {
        console.error("Gagal hapus:", error);
      } else {
        fetchStok();
      }
    }
  }

  return (
    <div className="text-gray-900 dark:text-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">Stok Bibit</h2>

      {/* Form Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="date"
          value={formData.tanggal}
          onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
          className="p-2 border rounded dark:bg-gray-700"
          placeholder="Tanggal"
        />
        <input
          type="number"
          value={formData.jumlah}
          onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
          className="p-2 border rounded dark:bg-gray-700"
          placeholder="Jumlah"
        />
        <input
          type="number"
          value={formData.harga_per_unit}
          onChange={(e) =>
            setFormData({ ...formData, harga_per_unit: e.target.value })
          }
          className="p-2 border rounded dark:bg-gray-700"
          placeholder="Harga per Biji"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2"
        >
          {formData.id ? "Update" : "Tambah"}
        </button>
      </form>

      {/* Tabel Data */}
      {loading ? (
        <p>Memuat data...</p>
      ) : stok.length === 0 ? (
        <p>Tidak ada data stok bibit.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-300 dark:border-gray-600">
          <table className="w-full border-collapse table-auto text-left">
            <thead className="bg-indigo-200 dark:bg-indigo-700">
              <tr className="bg-indigo-600 text-white">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">No</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Tanggal</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Jumlah</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Harga per Biji</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Total Harga</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stok.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{item.tanggal}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{item.jumlah}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    Rp {parseFloat(item.harga_per_unit).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    Rp {parseFloat(item.harga || item.jumlah * item.harga_per_unit).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex  justify-center border-b space-x-2 ">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-1 rounded font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

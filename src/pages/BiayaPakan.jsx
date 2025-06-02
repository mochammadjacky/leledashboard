import React, { useState, useEffect } from "react";
import supabase from '../utils/supabaseClient';

const initialForm = {
  nama_pakan: "",
  harga: "",
  tanggal: "",
  catatan: "",
};

export default function BiayaPakan() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: pakanData, error } = await supabase
      .from("biaya_pakan")
      .select("*")
      .order('created_at', { ascending: false });

    if (error) {
      setError("Gagal mengambil data: " + error.message);
      setData([]);
    } else {
      setData(pakanData);
      setError(null);
    }
    setLoading(false);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validateForm() {
    if (!form.nama_pakan.trim()) {
      setError("Nama pakan wajib diisi.");
      return false;
    }
    if (!form.harga || isNaN(form.harga) || Number(form.harga) <= 0) {
      setError("Harga harus berupa angka positif.");
      return false;
    }
    if (!form.tanggal) {
      setError("Tanggal wajib diisi.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    if (editingId) {
      const { error } = await supabase
        .from("biaya_pakan")
        .update({
          nama_pakan: form.nama_pakan,
          harga: Number(form.harga),
          tanggal: form.tanggal,
          catatan: form.catatan,
        })
        .eq("id", editingId);

      if (error) {
        setError("Gagal update data: " + error.message);
      } else {
        setError(null);
        setEditingId(null);
        setForm(initialForm);
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("biaya_pakan")
        .insert([
          {
            nama_pakan: form.nama_pakan,
            harga: Number(form.harga),
            tanggal: form.tanggal,
            catatan: form.catatan,
          },
        ]);

      if (error) {
        setError("Gagal tambah data: " + error.message);
      } else {
        setError(null);
        setForm(initialForm);
        fetchData();
      }
    }
    setLoading(false);
  }

  function handleEdit(id) {
    const item = data.find((d) => d.id === id);
    if (item) {
      setForm({
        nama_pakan: item.nama_pakan,
        harga: item.harga,
        tanggal: item.tanggal,
        catatan: item.catatan || "",
      });
      setEditingId(id);
      setError(null);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      setLoading(true);
      const { error } = await supabase.from("biaya_pakan").delete().eq("id", id);
      if (error) {
        setError("Gagal hapus data: " + error.message);
      } else {
        setError(null);
        if (editingId === id) {
          setEditingId(null);
          setForm(initialForm);
        }
        fetchData();
      }
      setLoading(false);
    }
  }

  return (
    <div className="text-gray-900 dark:text-gray-100 p-4" data-aos="fade-up">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Data Biaya Pakan
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white dark:bg-gray-800 p-6 rounded shadow"
      >
        {error && (
          <div className="pmb-4 text-red-600 font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Nama Pakan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama_pakan"
              value={form.nama_pakan}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan nama pakan"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Harga <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="harga"
              value={form.harga}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan harga"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Catatan
          </label>
          <textarea
            name="catatan"
            value={form.catatan}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tambahkan catatan"
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-5 py-2 mt-6 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {editingId ? "Update" : "Tambah"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setEditingId(null);
                setError(null);
              }}
              className="px-5 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Table Data */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Belum ada data.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-300 dark:border-gray-600">
          <table className="w-full border-collapse table-auto text-left">
            <thead className="bg-indigo-200 dark:bg-indigo-700">
              <tr className="bg-indigo-600 text-white">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Nama Pakan</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Harga (Rp)</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Tanggal</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Catatan</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {data.map(({ id, nama_pakan, harga, tanggal, catatan }) => (
                <tr
                  key={id}
                  className="border-b dark:border-gray-700"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{nama_pakan}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {harga.toLocaleString("id-ID")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{tanggal}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{catatan || "-"}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-1 rounded font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
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

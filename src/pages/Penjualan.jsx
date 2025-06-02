import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

export default function Penjualan() {
  const [penjualans, setPenjualans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Form state untuk tambah/update
  const [form, setForm] = useState({
    tanggal: "",
    jumlah_kg: "",
    harga_per_kg: "",
    nama_pembeli: "",
    catatan: "",
  });

  // Edit mode id
  const [editId, setEditId] = useState(null);

  // Filter tanggal state
  const [filterTanggal, setFilterTanggal] = useState({
    dari: "",
    sampai: "",
  });

  useEffect(() => {
    fetchPenjualans();
  }, []);

  async function fetchPenjualans(dari = "", sampai = "") {
    setLoading(true);

    let query = supabase
      .from("penjualan")
      .select("*")
      .order("tanggal", { ascending: false });

    if (dari) query = query.gte("tanggal", dari);
    if (sampai) query = query.lte("tanggal", sampai);

    const { data, error } = await query;

    if (error) {
      setAlert({ type: "error", message: "Gagal fetch data: " + error.message });
      setPenjualans([]);
    } else {
      setPenjualans(data);
    }
    setLoading(false);
  }

  function resetForm() {
    setForm({
      tanggal: "",
      jumlah_kg: "",
      harga_per_kg: "",
      nama_pembeli: "",
      catatan: "",
    });
    setEditId(null);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.tanggal || !form.jumlah_kg || !form.harga_per_kg) {
      setAlert({ type: "error", message: "Tanggal, Jumlah KG dan Harga per KG wajib diisi." });
      return;
    }

    if (editId) {
      const { error } = await supabase
        .from("penjualan")
        .update({
          tanggal: form.tanggal,
          jumlah_kg: parseFloat(form.jumlah_kg),
          harga_per_kg: parseFloat(form.harga_per_kg),
          nama_pembeli: form.nama_pembeli || null,
          catatan: form.catatan || null,
        })
        .eq("id", editId);

      if (error) {
        setAlert({ type: "error", message: "Update gagal: " + error.message });
      } else {
        setAlert({ type: "success", message: "Data berhasil diupdate" });
        resetForm();
        fetchPenjualans(filterTanggal.dari, filterTanggal.sampai);
      }
    } else {
      const { error } = await supabase.from("penjualan").insert([
        {
          tanggal: form.tanggal,
          jumlah_kg: parseFloat(form.jumlah_kg),
          harga_per_kg: parseFloat(form.harga_per_kg),
          nama_pembeli: form.nama_pembeli || null,
          catatan: form.catatan || null,
        },
      ]);

      if (error) {
        setAlert({ type: "error", message: "Insert gagal: " + error.message });
      } else {
        setAlert({ type: "success", message: "Data berhasil ditambahkan" });
        resetForm();
        fetchPenjualans(filterTanggal.dari, filterTanggal.sampai);
      }
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    const { error } = await supabase.from("penjualan").delete().eq("id", id);
    if (error) {
      setAlert({ type: "error", message: "Delete gagal: " + error.message });
    } else {
      setAlert({ type: "success", message: "Data berhasil dihapus" });
      fetchPenjualans(filterTanggal.dari, filterTanggal.sampai);
    }
  }

  function handleEdit(p) {
    setForm({
      tanggal: p.tanggal,
      jumlah_kg: p.jumlah_kg.toString(),
      harga_per_kg: p.harga_per_kg.toString(),
      nama_pembeli: p.nama_pembeli || "",
      catatan: p.catatan || "",
    });
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilterTanggal((prev) => ({ ...prev, [name]: value }));
  }

  function applyFilter() {
    fetchPenjualans(filterTanggal.dari, filterTanggal.sampai);
  }

  function resetFilter() {
    setFilterTanggal({ dari: "", sampai: "" });
    fetchPenjualans();
  }

  return (
    <div className="text-gray-900 dark:text-gray-100" data-aos="fade-up">
      <h2 className="text-3xl font-bold mb-6">Penjualan</h2>

      {alert && (
        <div
          className={`mb-4 p-3 rounded ${
            alert.type === "error"
              ? "bg-red-300 text-red-900 shadow-md"
              : "bg-green-300 text-green-900 shadow-md"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Form Tambah/Edit */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded shadow-md"
      >
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Tanggal *</label>
          <input
            type="date"
            name="tanggal"
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            value={form.tanggal}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Jumlah (kg) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="jumlah_kg"
            placeholder="Jumlah kg"
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            value={form.jumlah_kg}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Harga per kg (Rp) *</label>
          <input
            type="number"
            min="0"
            step="1000"
            name="harga_per_kg"
            placeholder="Harga per kg"
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            value={form.harga_per_kg}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Nama Pembeli</label>
          <input
            type="text"
            name="nama_pembeli"
            placeholder="Nama pembeli"
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            value={form.nama_pembeli}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Catatan</label>
          <input
            type="text"
            name="catatan"
            placeholder="Catatan"
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            value={form.catatan}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <button
            type="submit"
            
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 ml-2 rounded w-full md:w-auto transition shadow-md"
          >
            {editId ? "Update" : "Tambah"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-2 w-full md:w-auto px-4 py-2 ml-2 rounded border border-red-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-200 dark:hover:bg-red-700"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Filter tanggal */}
      <div className="mb-4 flex flex-wrap gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded shadow-md">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Dari tanggal</label>
          <input
            type="date"
            name="dari"
            value={filterTanggal.dari}
            onChange={handleFilterChange}
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Sampai tanggal</label>
          <input
            type="date"
            name="sampai"
            value={filterTanggal.sampai}
            onChange={handleFilterChange}
            className="p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <button
            onClick={applyFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md"
          >
            Filter
          </button>
          <button
            onClick={resetFilter}
            className="ml-2 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-200 dark:hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tabel penjualan */}
      <div className="overflow-x-auto rounded border border-gray-300 dark:border-gray-600">
        <table className="w-full border-collapse table-auto text-left">
          <thead  className="bg-indigo-200 dark:bg-indigo-700">
            <tr className="bg-indigo-600 text-white">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Tanggal</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Jumlah (kg)</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Harga per kg (Rp)</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Total (Rp)</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Nama Pembeli</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Catatan</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : penjualans.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">
                  Tidak ada data penjualan.
                </td>
              </tr>
            ) : (
              penjualans.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{p.tanggal}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{p.jumlah_kg}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{p.harga_per_kg.toLocaleString("id-ID")}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {(p.jumlah_kg * p.harga_per_kg).toLocaleString("id-ID")}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{p.nama_pembeli || "-"}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{p.catatan || "-"}</td>
                  <td className="px-4 py-2 flex  justify-center border-b space-x-2 ">
                    <button 
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-1 rounded font-semibold"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold"
                      title="Hapus"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

export default function ModalPage() {
  const [modals, setModals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tanggal, setTanggal] = useState("");
  const [jumlahModal, setJumlahModal] = useState("");
  const [catatan, setCatatan] = useState("");
  const [alert, setAlert] = useState(null);
  const [editId, setEditId] = useState(null);

  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  useEffect(() => {
    fetchModals();
  }, []);

  async function fetchModals() {
    setLoading(true);

    let query = supabase.from("modal").select("*").order("tanggal", { ascending: false });

    if (filterStart && filterEnd) {
      query = query.gte("tanggal", filterStart).lte("tanggal", filterEnd);
    } else if (filterStart) {
      query = query.gte("tanggal", filterStart);
    } else if (filterEnd) {
      query = query.lte("tanggal", filterEnd);
    }

    const { data, error } = await query;

    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setModals(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tanggal || !jumlahModal) {
      setAlert({ type: "error", message: "Tanggal dan jumlah modal wajib diisi." });
      return;
    }

    const formattedTanggal = tanggal.length === 10 ? `${tanggal}T00:00:00` : tanggal;

    const dataInsert = {
      tanggal: formattedTanggal,
      jumlah_modal: parseFloat(jumlahModal),
      catatan,
    };


    if (editId) {
      const { error } = await supabase.from("modal").update(dataInsert).eq("id", editId);
      if (error) {
        setAlert({ type: "error", message: error.message });
      } else {
        setAlert({ type: "success", message: "Data modal berhasil diperbarui." });
        resetForm();
        fetchModals();
      }
    } else {
      const { error } = await supabase.from("modal").insert([dataInsert]);
      if (error) {
        setAlert({ type: "error", message: error.message });
      } else {
        setAlert({ type: "success", message: "Modal berhasil ditambahkan." });
        resetForm();
        fetchModals();
      }
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus data modal ini?")) return;
    const { error } = await supabase.from("modal").delete().eq("id", id);
    if (error) {
      setAlert({ type: "error", message: error.message });
    } else {
      setAlert({ type: "success", message: "Data modal berhasil dihapus." });
      fetchModals();
    }
  }

  function handleEdit(modal) {
    setEditId(modal.id);
    setTanggal(modal.tanggal.slice(0, 10));
    setJumlahModal(modal.jumlah_modal);
    setCatatan(modal.catatan || "");
    setAlert(null);
  }

  function resetForm() {
    setEditId(null);
    setTanggal("");
    setJumlahModal("");
    setCatatan("");
    setAlert(null);
  }

  function handleFilter() {
    fetchModals();
  }

  function resetFilter() {
    setFilterStart("");
    setFilterEnd("");
    fetchModals();
  }

  return (
    <div className="text-gray-900 dark:text-gray-100 p-4" data-aos="fade-up">
      <h2 className="text-3xl font-bold mb-6">Modal Usaha</h2>

      {alert && (
        <div className={`mb-4 p-3 rounded ${alert.type === "error" ? "bg-red-300 text-red-900" : "bg-green-300 text-green-900"}`}>
          {alert.message}
        </div>
      )}

      {/* Form tambah/edit modal */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-300 dark:border-gray-600 rounded shadow-sm bg-white dark:bg-gray-800">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="date"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Jumlah Modal (Rp)"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 flex-grow"
            value={jumlahModal}
            onChange={(e) => setJumlahModal(e.target.value)}
            required
            min={0}
            step="any"
          />
          <input
            type="text"
            placeholder="Keterangan (modal untuk apa)"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 flex-grow min-w-[250px]"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition">
            {editId ? "Update" : "Tambah"}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition">
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Filter tanggal */}
      <div className="mb-6 p-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 flex flex-wrap gap-4 items-center">
        <label>
          Dari:{" "}
          <input
            type="date"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
          />
        </label>
        <label>
          Sampai:{" "}
          <input
            type="date"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
          />
        </label>
        <button onClick={handleFilter} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
          Filter
        </button>
        <button onClick={resetFilter} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition">
          Reset
        </button>
      </div>

      {/* Tabel data modal */}
      {loading ? (
        <p>Loading data modal...</p>
      ) : modals.length === 0 ? (
        <p>Belum ada data modal.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-300 dark:border-gray-600">
          <table className="w-full border-collapse table-auto text-left">
            <thead className="bg-indigo-200 dark:bg-indigo-700">
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Tanggal</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Jumlah Modal (Rp)</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Keterangan</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {modals.map((modal) => (
                <tr key={modal.id} className="odd:bg-gray-100 dark:odd:bg-gray-800">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{modal.tanggal?.slice(0, 10)}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {modal.jumlah_modal?.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{modal.catatan || "-"}</td>
                  <td className="px-4 py-2 flex  justify-center border-b space-x-2 ">
                    <button onClick={() => handleEdit(modal)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-1 rounded font-semibold">Edit</button>
                    <button onClick={() => handleDelete(modal.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold">Hapus</button>
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

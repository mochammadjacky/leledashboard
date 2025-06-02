import React, { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";



export default function Laporan() {
  const [biayaListrik, setBiayaListrik] = useState([]);
  const [biayaPakan, setBiayaPakan] = useState([]);
  const [biayaLainnya, setBiayaLainnya] = useState([]);
  const [stokBibit, setStokBibit] = useState([]);
  const [labaRugi, setLabaRugi] = useState([]);
  const [penjualan, setPenjualan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchLaporanData();
  }, []);

  async function fetchLaporanData() {
    setLoading(true);
    setError(null);
    try {
      let queryListrik = supabase.from("biaya_listrik").select("*").order("tanggal", { ascending: false });
      let queryPakan = supabase.from("biaya_pakan").select("*").order("tanggal", { ascending: false });
      let queryLainnya = supabase.from("biaya_lainnya").select("*").order("tanggal", { ascending: false });
      let queryStokBibit = supabase.from("stok_bibit").select("*").order("tanggal", { ascending: false });
      let queryLabaRugi = supabase.from("laba_rugi").select("*").order("tanggal", { ascending: false });
      let queryPenjualan = supabase.from("penjualan").select("*").order("tanggal", { ascending: false });

      if (startDate) {
        queryListrik = queryListrik.gte("tanggal", startDate);
        queryPakan = queryPakan.gte("tanggal", startDate);
        queryLainnya = queryLainnya.gte("tanggal", startDate);
        queryStokBibit = queryStokBibit.gte("tanggal", startDate);
        queryLabaRugi = queryLabaRugi.gte("tanggal", startDate);
        queryPenjualan = queryPenjualan.gte("tanggal", startDate);
      }
      if (endDate) {
        queryListrik = queryListrik.lte("tanggal", endDate);
        queryPakan = queryPakan.lte("tanggal", endDate);
        queryLainnya = queryLainnya.lte("tanggal", endDate);
        queryStokBibit = queryStokBibit.lte("tanggal", endDate);
        queryLabaRugi = queryLabaRugi.lte("tanggal", endDate);
        queryPenjualan = queryPenjualan.gte("tanggal", endDate);
      }

      const [listrikData, pakanData, lainnyaData,penjualan, stokBibitData, labaRugiData] = await Promise.all([
        queryListrik.then(({ data, error }) => { if (error) throw error; return data; }),
        queryPakan.then(({ data, error }) => { if (error) throw error; return data; }),
        queryLainnya.then(({ data, error }) => { if (error) throw error; return data; }),
        queryStokBibit.then(({ data, error }) => { if (error) throw error; return data; }),
        queryLabaRugi.then(({ data, error }) => { if (error) throw error; return data; }),
        queryPenjualan.then(({ data, error }) => { if (error) throw error; return data; }),
      ]);

      setBiayaListrik(listrikData || []);
      setBiayaPakan(pakanData || []);
      setBiayaLainnya(lainnyaData || []);
      setPenjualan(penjualan || []);
      setStokBibit(stokBibitData || []);
      setLabaRugi(labaRugiData || []);
    } catch (err) {
      setError("Gagal memuat data: " + err.message);
    }
    setLoading(false);
  }

  const totalListrik = biayaListrik.reduce((acc, curr) => acc + Number(curr.jumlah_biaya || 0), 0);
  const totalPenjualan = penjualan.reduce((acc, curr) => acc + Number(curr.jumlah_biaya || 0), 0);
  const totalPakan = biayaPakan.reduce((acc, curr) => acc + Number(curr.jumlah_biaya || 0), 0);
  const totalLainnya = biayaLainnya.reduce((acc, curr) => acc + Number(curr.nominal || 0), 0);
  const totalKeseluruhan = totalListrik + totalPakan + totalLainnya - totalPenjualan;

  const totalPendapatan = labaRugi.reduce((acc, curr) => acc + Number(curr.pendapatan || 0), 0);
  const totalBiayaLR = labaRugi.reduce((acc, curr) => acc + Number(curr.biaya || 0), 0);
  const labaBersih = totalPendapatan - totalBiayaLR;

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Biaya dan Laba Rugi", 14, 20);
    let dateRange = "Semua tanggal";
    if (startDate && endDate) dateRange = `Dari ${startDate} sampai ${endDate}`;
    else if (startDate) dateRange = `Mulai dari ${startDate}`;
    else if (endDate) dateRange = `Sampai ${endDate}`;
    doc.setFontSize(12);
    doc.text(dateRange, 14, 28);

    autoTable(doc, { startY: 35, head: [["Tanggal", "Jumlah Biaya (Rp)", "Catatan"]],
      body: biayaListrik.map(item => [item.tanggal, Number(item.jumlah_biaya).toLocaleString("id-ID"), item.catatan || "-"]),
    });
    let finalY = doc.lastAutoTable.finalY;

    autoTable(doc, { startY: finalY + 10, head: [["Nama Pakan", "Harga", "Tanggal", "Catatan"]],
      body: biayaPakan.map(item => [item.tanggal, Number(item.jumlah_biaya).toLocaleString("id-ID"), item.catatan || "-"]),
    });
    finalY = doc.lastAutoTable.finalY;

     autoTable(doc, { startY: finalY + 10, head: [["Tanggal", "Jumlah", "Harga per Kg", "Total", "Nama Pembeli", "Catatan"]],
      body: penjualan.map(item => [item.tanggal, Number(item.nominal).toLocaleString("id-ID"), item.catatan || "-"]),
    });
    finalY = doc.lastAutoTable.finalY;

    autoTable(doc, { startY: finalY + 10, head: [["Tanggal", "Nominal (Rp)", "Catatan"]],
      body: biayaLainnya.map(item => [item.tanggal, Number(item.nominal).toLocaleString("id-ID"), item.catatan || "-"]),
    });
    finalY = doc.lastAutoTable.finalY;

    autoTable(doc, { startY: finalY + 10, head: [["Tanggal", "Jumlah", "Harga", "Catatan"]],
      body: stokBibit.map(item => [item.tanggal, item.jumlah, Number(item.harga).toLocaleString("id-ID"), item.catatan || "-"]),
    });
    finalY = doc.lastAutoTable.finalY;

    doc.setFontSize(14);
    doc.text("Laporan Laba Rugi", 14, finalY + 15);
    doc.setFontSize(12);
    doc.text(`Total Pendapatan: Rp ${totalPendapatan.toLocaleString("id-ID")}`, 14, finalY + 25);
    doc.text(`Total Biaya: Rp ${totalBiayaLR.toLocaleString("id-ID")}`, 14, finalY + 35);
    doc.text(`Laba Bersih: Rp ${labaBersih.toLocaleString("id-ID")}`, 14, finalY + 45);
    doc.save("Laporan.pdf");
  }

  function exportExcel() {
    const data = [
      ...biayaListrik.map(item => ({ ...item, kategori: "Biaya Listrik" })),
      ...biayaPakan.map(item => ({ ...item, kategori: "Biaya Pakan" })),
      ...biayaLainnya.map(item => ({ ...item, kategori: "Biaya Lainnya" })),
      ...stokBibit.map(item => ({ ...item, kategori: "Stok Bibit" })),
      ...labaRugi.map(item => ({ ...item, kategori: "Laba Rugi" }))
      ,,,penjualan.map(item => ({ ...item, kategori: "Penjualan" })),
      ];
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, "Laporan.xlsx");
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Laporan</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded p-2"/>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded p-2"/>
        <button onClick={fetchLaporanData} className="bg-blue-500 text-white rounded px-4 py-2">Terapkan Filter</button>
        <button onClick={exportPDF} className="bg-green-500 text-white rounded px-4 py-2">Export PDF</button>
        <button onClick={exportExcel} className="bg-yellow-500 text-white rounded px-4 py-2">Export Excel</button>
      </div>

      {loading && <p className="text-blue-500">Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tabel dan total di sini */}
      {renderTable("Biaya Listrik", biayaListrik, ["tanggal", "jumlah_biaya", "catatan"])}
      {renderTable("Biaya Pakan", biayaPakan, ["nama_pakan", "harga", "tanggal","catatan"])}
      {renderTable("Biaya Lainnya", biayaLainnya, ["tanggal", "nominal", "catatan"])}
      {renderTable("Stok Bibit", stokBibit, ["tanggal", "jumlah", "harga", "harga_per_unit","catatan"])}
      {renderTable("Laba Rugi", labaRugi, ["tanggal", "pendapatan", "biaya", "keterangan"])}
      {renderTable("Penjualan", penjualan, ["tanggal", "jumlah (kg)", "harga per kg", "nama pembeli", "catatan"])}

    </div>
  );

  function renderTable(title, data, columns) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>{columns.map(col => <th key={col} className="border p-2">{col}</th>)}</tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  {columns.map(col => <td key={col} className="border p-2">{item[col]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

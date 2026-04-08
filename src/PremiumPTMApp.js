import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import QRCode from "react-qr-code";

export default function PremiumPTMApp() {
  const [form, setForm] = useState({
    name: "",
    batch: "",
    phone: "",
    slot: "",
    date: "",
    reasons: {
      batchChange: false,
      timeChange: false,
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [passData, setPassData] = useState(null);
  const [records, setRecords] = useState([]);

  const slots = ["4–5 PM", "5–6 PM", "6–7 PM", "7–8 PM"];

  useEffect(() => {
    const saved = localStorage.getItem("ptm_records");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const generatePass = () => {
    const id = "PTM-" + Date.now();
    const timestamp = new Date().toLocaleString();

    const data = {
      ...form,
      id,
      issuedAt: timestamp,
    };

    const updated = [...records, data];
    setRecords(updated);
    localStorage.setItem("ptm_records", JSON.stringify(updated));

    setPassData(data);
    setSubmitted(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.batch || !form.phone || !form.slot || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    generatePass();
  };

  if (submitted && passData) {
    return (
      <div className="p-6 flex justify-center bg-gray-100 min-h-screen">
        <Card className="w-full max-w-md shadow-2xl rounded-2xl border-2">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">🎟 ENTRY PASS</h2>
            <p className="text-sm text-gray-500 mb-4">Parent-Teacher Meeting</p>

            <div className="text-left space-y-1 mb-4">
              <p><strong>ID:</strong> {passData.id}</p>
              <p><strong>Student:</strong> {passData.name}</p>
              <p><strong>Batch:</strong> {passData.batch}</p>
              <p><strong>Phone:</strong> {passData.phone}</p>
              <p><strong>Date:</strong> {passData.date}</p>
              <p><strong>Time:</strong> {passData.slot}</p>
              <p><strong>Issued:</strong> {passData.issuedAt}</p>
            </div>

            <div className="flex justify-center my-4">
              <QRCode
                value={JSON.stringify(passData)}
                size={120}
              />
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Show this QR code at entry for verification
            </p>

            <div className="flex gap-2">
              <Button className="w-full" onClick={() => window.print()}>
                🖨 Print
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(passData));
                  alert("Pass copied! Share via WhatsApp");
                }}
              >
                📲 Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">PTM Booking</h2>

          <Input placeholder="Student Name" className="mb-3" onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <Input placeholder="Batch" className="mb-3" onChange={(e) => setForm({ ...form, batch: e.target.value })} />

          <Input placeholder="Phone Number" className="mb-3" onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <Input type="date" className="mb-3" onChange={(e) => setForm({ ...form, date: e.target.value })} />

          <select className="w-full border rounded-lg p-2 mb-3" onChange={(e) => setForm({ ...form, slot: e.target.value })}>
            <option value="">Select Time Slot</option>
            {slots.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="mb-3">
            <label className="block mb-2 font-medium">Reason</label>
            <div className="flex items-center gap-2 mb-2">
              <Checkbox onCheckedChange={(val) => setForm({ ...form, reasons: { ...form.reasons, batchChange: val } })} />
              <span>Batch Change</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox onCheckedChange={(val) => setForm({ ...form, reasons: { ...form.reasons, timeChange: val } })} />
              <span>Time Change</span>
            </div>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Generate Premium Pass
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

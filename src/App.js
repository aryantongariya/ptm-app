// frontend/src/App.js
import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import logo from './logo.jpg'
import "./App.css";

export default function App() {
  const [form, setForm] = useState({
    studentName: "",
    studentName2: "",
    // age: "",
    // batch: "",
    activitis: [],
    priority: [],
    daysAttending: [],
    batchTimings: [],
    parentName: "",
    parentPhone: "",
    meetingPurposes: [],
    meetingTime: null,
    meetingMode: null,
    otherReason: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const passRef = useRef(null);

  // Days options with checkboxes
  const daysOptions = [
    { value: "MWF", label: "Monday, Wednesday, Friday (MWF)" },
    { value: "TTS", label: "Tuesday, Thursday, Saturday (TTS)" },
    { value: "Mon-Fri", label: "Monday to Friday" },
    { value: "Sat-Sun", label: "Saturday & Sunday" },
    { value: "Daily", label: "Daily (Monday to Saturday)" },
    { value: "Weekend", label: "Weekend Only (Sat & Sun)" },
  ];
  // Activitis options with checkboxes
  const activitisOptions = [
    { value: "Dance", label: "Dance" },
    { value: "GYmnastics", label: "GYmnastics" },
    { value: "Kathak", label: "Kathak Dance" },
    { value: "Theatre", label: "Theatre Class" },
    { value: "Fitness", label: "Fitness Class" },
    { value: "Weekend", label: "Aerial Dance" },
  ];

  // Batch timings with checkboxes
  const batchTimingsOptions = [
    { value: "4:00-5:00", label: "🕐 4:00 PM – 5:00 PM" },
    { value: "5:00-6:00", label: "🕑 5:00 PM – 6:00 PM" },
    { value: "6:00-7:00", label: "🕒 6:00 PM – 7:00 PM" },
    { value: "7:00-8:00", label: "🕓 7:00 PM – 8:00 PM" },
    { value: "10:30-11:30", label: "🌅 10:30 AM – 11:30 AM" },
    { value: "11:30-12:30", label: "☀️ 11:30 AM – 12:30 PM" },
  ];

  // Meeting purposes with checkboxes
  const prioritySelect = [
    "Low",
    "Medium",
    "Urgent",
    "High", 
  ];  
  
  const purposes = [
    "🎭 Performance",
    "🏫 School Event",
    "💍 Wedding Performance",
    "🏆 Competition Participation",
    "💃 Dance Progress Update",
    "❤️ Health-related Discussion",
    "⏰ Time / Batch Change",
    "🥗 Diet-related Discussion",
    "💰 Fees-related Query",
    "💬 Other Reason",
    
  ];

  // Meeting time slots
  const morningSlots = ["10:30 AM – 11:30 AM", "11:30 AM – 12:30 PM"];
  const eveningSlots = ["4:00 PM – 5:00 PM", "5:00 PM – 6:00 PM", "6:00 PM – 7:00 PM", "7:00 PM – 8:00 PM"];

  // Meeting modes
  const meetingModes = ["📞 Audio Call", "📹 Video Call", "👥 One-on-One (In Person)"];

  const handleActivitisChange = (day) => {
    setForm(prev => ({
      ...prev,
      activitis: prev.activitis.includes(day)
        ? prev.activitis.filter(d => d !== day)
        : [...prev.activitis, day]
    }));
  }; const handleDaysChange = (day) => {
    setForm(prev => ({
      ...prev,
      daysAttending: prev.daysAttending.includes(day)
        ? prev.daysAttending.filter(d => d !== day)
        : [...prev.daysAttending, day]
    }));
  };

  const handleBatchTimingChange = (timing) => {
    setForm(prev => ({
      ...prev,
      batchTimings: prev.batchTimings.includes(timing)
        ? prev.batchTimings.filter(t => t !== timing)
        : [...prev.batchTimings, timing]
    }));
  };

  const handlePurposeChange = (purpose) => {
    setForm(prev => ({
      ...prev,
      meetingPurposes: prev.meetingPurposes.includes(purpose)
        ? prev.meetingPurposes.filter(p => p !== purpose)
        : [...prev.meetingPurposes, purpose]
    }));
  };  
  const handlePriorityChange = (purpose) => {
    setForm(prev => ({
      ...prev,
      priority: prev.priority.includes(purpose)
        ? prev.priority.filter(p => p !== purpose)
        : [...prev.priority, purpose]
    }));
  };

  const handleTimeSelect = (slot) => {
    setForm({ ...form, meetingTime: slot });
  };

  const handleModeSelect = (mode) => {
    setForm({ ...form, meetingMode: mode });
  };

  const validateForm = () => {
    if (!form.studentName.trim()) {
      alert("⚠️ Please enter first name");
      return false;
    }
    // if (!form.age) {
    //   alert("⚠️ Please enter student age");
    //   return false;
    // }
    if (!form.studentName2.trim()) {
      alert("⚠️ Please enter second name");
      return false;
    }
    if (form.activitis.length === 0) {
      alert("⚠️ Please select at least one activiti");
      return false;
    } if (form.daysAttending.length === 0) {
      alert("⚠️ Please select at least one day");
      return false;
    }
    if (form.batchTimings.length === 0) {
      alert("⚠️ Please select at least one batch timing");
      return false;
    }
    if (!form.parentName.trim()) {
      alert("⚠️ Please enter parent name");
      return false;
    }
    if (!form.parentPhone.trim() || !/^\d{10}$/.test(form.parentPhone)) {
      alert("📞 Please enter valid 10-digit phone number");
      return false;
    }
    if (form.meetingPurposes.length === 0) {
      alert("⚠️ Please select at least one purpose for meeting");
      return false;
    }  
    if (form.priority.length === 0) {
      alert("⚠️ Please select priority for meeting");
      return false;
    }
    if (!form.meetingTime) {
      alert("⏰ Please select a preferred meeting time");
      return false;
    }
    if (!form.meetingMode) {
      alert("📞 Please select meeting mode");
      return false;
    }
    return true;
  };

  const generateWhatsAppMessage = (data) => {
    const activitisText = data.activitis.join(", ");
    const daysText = data.daysAttending.join(", ");
    const batchTimingsText = data.batchTimings.join(", ");
    
    return `🏫 *A ONE NATRAJ ACADEMY* 🏫
━━━━━━━━━━━━━━━━━━━━━━
*PARENT-TEACHER MEETING (PTM) PASS*
━━━━━━━━━━━━━━━━━━━━━━

📋 *STUDENT DETAILS:*
👨‍🎓 *STUDENT Name:* ${data.studentName && data.studentName2} 
📅 *Activities Attending:* ${activitisText}
📅 *Days Attending:* ${daysText}
⏰ *Batch Timings:* ${batchTimingsText}
👨‍👩‍👧 *Parent Name:* ${data.parentName}
📞 *Parent Phone:* ${data.parentPhone}

━━━━━━━━━━━━━━━━━━━━━━
🎯 *PURPOSE OF MEETING:*
${data.meetingPurposes.map(p => `✅ ${p}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━
⏰ *PRIORITY:*
${data.priority}

━━━━━━━━━━━━━━━━━━━━━━
⏰ *PREFERRED MEETING TIME:*
${data.meetingTime}

━━━━━━━━━━━━━━━━━━━━━━
📞 *MODE OF MEETING:*
${data.meetingMode}

━━━━━━━━━━━━━━━━━━━━━━
🆔 *PASS ID:* ${data.id}
📅 *ISSUED ON:* ${data.issuedAt}

━━━━━━━━━━━━━━━━━━━━━━
━━━━━━━━━━━━━━━━━━━━━━
*A One Natraj Academy* 🎵`;
  };

  const downloadPassAsPNG = async () => {
    if (!passRef.current) {
      alert("Pass not found. Please try again.");
      return;
    }
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(passRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const link = document.createElement('a');
      const studentName = passData.studentName || 'pass';
      link.download = `PTM_Pass_${studentName}_${passData.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      alert('✅ Pass downloaded successfully!');
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to generate PNG. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const showConfirmationPopup = () => {
    if (!validateForm()) return;
    setShowPopup(true);
  };

  const closePopupAndProceed = async () => {
    setShowPopup(false);
    setLoading(true);

    const id = "PTM-" + Date.now();
    const timestamp = new Date().toLocaleString();

    const data = {
      ...form,
      id,
      issuedAt: timestamp,
    };

    setPassData(data);
    setSubmitted(true);
    setLoading(false);

    // Send WhatsApp message
    const message = generateWhatsAppMessage(data);
    const phoneNumber = "918587906794";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleSubmit = () => {
    showConfirmationPopup();
  };

  const sendWhatsAppAgain = () => {
    const message = generateWhatsAppMessage(passData);
    const phoneNumber = "918587906794";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (submitted && passData) {
    const activitisText = passData.activitis.join(", ");
    const daysText = passData.daysAttending.join(", ");
    const batchTimingsText = passData.batchTimings.join(", ");

    return (
      <div className="pass-container">
        {/* Beautiful Digital Pass */}
        <div className="pass-wrapper" ref={passRef}>
          <div className="beautiful-pass">
            <div className="pass-border">
              <div className="pass-inner">
                {/* Header with Academy Name */}
                <div className="pass-header-design">
                  {/* <div className="academy-icon"></div> */}
                  <img src={logo} alt="logo" />
                  {/* <h1 className="academy-name">A ONE NATRAJ ACADEMY</h1> */}
                  {/* <div className="academy-icon">🎵</div> */}
                </div>
                
                <div className="pass-title">
                  <h2>PARENT-TEACHER MEETING (PTM) PASS</h2>
                  {/* <div className="title-underline"></div> */}
                </div>

                {/* Student Details Section */}
                <div className="pass-section">
                  <h3 className="section-heading">📋 STUDENT DETAILS</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-icon">👨‍🎓</span>
                      <span className="detail-label">STUDENT Name:</span>
                      <span className="detail-value">{passData.studentName} {passData.studentName2}</span>
                    </div>
                    {/* <div className="detail-item">
                      <span className="detail-icon">🎂</span>
                      <span className="detail-label">Age:</span>
                      <span className="detail-value">{passData.age} years</span>
                    </div> */}
                    {/* <div className="detail-item">
                      <span className="detail-icon">📚</span>
                      <span className="detail-label">Batch:</span>
                      <span className="detail-value">{passData.batch}</span>
                    </div> */}
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-label">Activities Attending:</span>
                      <span className="detail-value">{activitisText}</span>
                    </div>
                      <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-label">Days Attending:</span>
                      <span className="detail-value">{daysText}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">⏰</span>
                      <span className="detail-label">Batch Timings:</span>
                      <span className="detail-value">{batchTimingsText}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👨‍👩‍👧</span>
                      <span className="detail-label">Parent Name:</span>
                      <span className="detail-value">{passData.parentName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📞</span>
                      <span className="detail-label">Parent Phone:</span>
                      <span className="detail-value">{passData.parentPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Purpose of Meeting Section */}
                <div className="pass-section">
                  <h3 className="section-heading">🎯 PURPOSE OF MEETING</h3>
                  <div className="purposes-list">
                    {passData.meetingPurposes.map((purpose, idx) => (
                      <div key={idx} className="purpose-item">
                        <span className="checkmark">✅</span>
                        <span>{purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meeting Details Section */}
                <div className="pass-section two-columns">
                  <div className="column">
                    <h3 className="section-heading">⏰ PREFERRED MEETING TIME</h3>
                    <div className="meeting-time-box">
                      {passData.meetingTime}
                    </div>
                  </div> 
                  <div className="column">
                    <h3 className="section-heading">⏰ PRIORITY MEETING </h3>
                    <div className="meeting-time-box">
                      {passData.priority}
                    </div>
                  </div>
                  <div className="column">
                    <h3 className="section-heading">📞 MODE OF MEETING</h3>
                    <div className="meeting-mode-box">
                      {passData.meetingMode}
                    </div>
                  </div>
                </div>

                {/* QR Code and Pass Info */}
                <div className="pass-footer-section">
                  {/* <div className="qr-container">
                    <QRCode value={JSON.stringify(passData)} size={100} />
                  </div> */}
                  <div className="pass-info">
                    <div className="pass-id-box">
                      <span className="pass-id-label">🆔 PASS ID:</span>
                      <span className="pass-id-value">{passData.id}</span>
                    </div>
                    <div className="issued-date">
                      📅 ISSUED ON: {passData.issuedAt}
                    </div>
                  </div>
                </div>

                {/* Important Note */}
                <div className="important-note">
                  <p>📌 <strong>IMPORTANT NOTE:</strong> You will receive confirmation of your meeting within 24–48 hours. The final meeting time will be scheduled based on mutual availability.</p>
                  <p className="thankyou-text">✅ Thank you for your cooperation!</p>
                </div>

                {/* Footer */}
                <div className="pass-footer-text">
                  <p>A One Natraj Academy </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn-download-png" 
            onClick={downloadPassAsPNG}
            disabled={downloading}
          >
            {downloading ? "⏳ Generating PNG..." : "📸 Download Pass "}
          </button>
          <button className="btn-whatsapp" onClick={sendWhatsAppAgain}>
            📲 Send Pass On WhatsApp
          </button>
          <button className="btn-new" onClick={() => {
            setSubmitted(false);
            setPassData(null);
            setForm({
              studentName: "",
              studentName2: "",
              // age: "",
              // batch: "",
              activitis: [],
              daysAttending: [],
              batchTimings: [],
              parentName: "",
              parentPhone: "",
              meetingPurposes: [],
              priority: [],
              meetingTime: null,
              meetingMode: null,
              otherReason: "",
            });
          }}>
            + Create New Pass
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-icon">📌</div>
            <h3>IMPORTANT NOTE</h3>
            <div className="popup-message">
              <p>After sending the pass on WhatsApp, you will receive meeting confirmation within 24–48 hours.</p>
              <p>The final meeting time will be scheduled based on mutual availability.</p>
              <p className="thankyou">✅ Thank you for your cooperation!</p>
            </div>
            <div className="popup-buttons">
              <button className="popup-cancel" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="popup-confirm" onClick={closePopupAndProceed}>
                Proceed & Send Pass
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-container">
        <div className="form-header">
          <img src={logo} alt="" />
          {/* <h1>🏫 A ONE NATRAJ ACADEMY</h1> */}
          <p>Parent-Teacher Meeting (PTM) Booking System</p>
          <small>Please fill this form before meeting the teacher</small>
        </div>
        
        <div className="form-body">
          <div className="intro-text">
            <p><strong>📢 Dear Parents,</strong></p>
            <p>To ensure a smooth and well-organized interaction, we have introduced this PTM slip system. If you have any Query, feedback, or concerns regarding your child's dance or any other activity, we request you to kindly fill this form before meeting the teacher.</p>
            <p><em>Thank you for your cooperation!</em></p>
          </div>

          <hr className="divider" />

          <h3 className="section-title">📋 Student Details</h3>
          
          <div className="input-group">
            <label>👨‍🎓 Student Name *</label>
            <input type="text" placeholder="Enter first name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
          </div>

          <div className="input-group">
            <label>👨‍🎓 Second Student Name (if applicable)</label>
            <input type="text" placeholder="Enter second name" value={form.studentName2} onChange={(e) => setForm({ ...form, studentName2: e.target.value })} />
          </div>

          {/* <div className="input-group">
            <label>🎂 Age *</label>
            <input type="number" placeholder="Enter student's age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div> */}

          {/* <div className="input-group">
            <label>📚 Batch Name *</label>
            <input type="text" placeholder="e.g., Beginner Batch, Advanced Batch" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
          </div> */}

          <h3 className="section-title">📅 Activities (Select all that apply) *</h3>
          <div className="checkbox-group">
            {activitisOptions.map((day) => (
              <label key={day.value} className="checkbox-label">
                <input type="checkbox" checked={form.activitis.includes(day.value)} onChange={() => handleActivitisChange(day.value)} />
                {day.label}
              </label>
            ))}
          </div>  <h3 className="section-title">📅 Days Attending (Select all that apply) *</h3>
          <div className="checkbox-group">
            {daysOptions.map((day) => (
              <label key={day.value} className="checkbox-label">
                <input type="checkbox" checked={form.daysAttending.includes(day.value)} onChange={() => handleDaysChange(day.value)} />
                {day.label}
              </label>
            ))}
          </div>

          <h3 className="section-title">⏰ Batch Timings (Select all that apply) *</h3>
          <div className="checkbox-group">
            {batchTimingsOptions.map((timing) => (
              <label key={timing.value} className="checkbox-label">
                <input type="checkbox" checked={form.batchTimings.includes(timing.value)} onChange={() => handleBatchTimingChange(timing.value)} />
                {timing.label}
              </label>
            ))}
          </div>

          <div className="input-group">
            <label>👨‍👩‍👧 Parent Name *</label>
            <input type="text" placeholder="Enter parent/guardian name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
          </div>

          <div className="input-group">
            <label>📞 Parent Phone Number (10-digit) *</label>
            <input type="tel" placeholder="Enter 10-digit mobile number" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} />
          </div>

          <h3 className="section-title">🎯 Purpose of Meeting (Select all that apply) *</h3>
          <div className="checkbox-group">
            {purposes.map((purpose) => (
              <label key={purpose} className="checkbox-label">
                <input type="checkbox" checked={form.meetingPurposes.includes(purpose)} onChange={() => handlePurposeChange(purpose)} />
                {purpose}
              </label>
            ))}
          </div> 
          <h3 className="section-title">🎯 Select Priority  *</h3>
          <div className="checkbox-group">
            {prioritySelect.map((purpose) => (
              <label key={purpose} className="checkbox-label">
                <input type="checkbox" checked={form.priority.includes(purpose)} onChange={() => handlePriorityChange(purpose)} />
                {purpose}
              </label>
            ))}
          </div>

          {/* <div className="input-group">
            <label>💬 Other Reason (if any)</label>
            <textarea rows="2" placeholder="Please specify any other reason..." value={form.otherReason} onChange={(e) => setForm({ ...form, otherReason: e.target.value })} />
          </div> */}

          <h3 className="section-title">⏰ Preferred Meeting Time (Select one) *</h3>
          <div className="time-section">
            <h4>Morning Slots:</h4>
            <div className="slot-grid">
              {morningSlots.map((slot) => (
                <div key={slot} className={`slot-option ${form.meetingTime === slot ? "selected" : ""}`} onClick={() => handleTimeSelect(slot)}>
                  {slot}
                </div>
              ))}
            </div>
          </div>

          <div className="time-section">
            <h4>Evening Slots:</h4>
            <div className="slot-grid">
              {eveningSlots.map((slot) => (
                <div key={slot} className={`slot-option ${form.meetingTime === slot ? "selected" : ""}`} onClick={() => handleTimeSelect(slot)}>
                  {slot}
                </div>
              ))}
            </div>
          </div>

          <h3 className="section-title">📞 Mode of Meeting (Select one) *</h3>
          <div className="mode-group">
            {meetingModes.map((mode) => (
              <div key={mode} className={`mode-option ${form.meetingMode === mode ? "selected" : ""}`} onClick={() => handleModeSelect(mode)}>
                {mode}
              </div>
            ))}
          </div>

          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳ Generating Pass..." : "🎟️ Generate PTM PASS"}
          </button>
        </div>
      </div>
    </div>
  );
}
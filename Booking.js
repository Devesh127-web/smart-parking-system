import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Booking() {
  const [slotDetails, setSlotDetails] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { mallId, slotId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlotDetails();
  }, [slotId]);

  const fetchSlotDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch slot details (you may need to adjust this endpoint)
      const res = await axios.get(`${API}/api/slots/${mallId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const slots = res.data.slots || res.data;
      const slot = slots.find(s => (s._id || s.id) === slotId);
      
      if (slot) {
        setSlotDetails({
          ...slot,
          mallName: res.data.mallName || "Mall"
        });
      } else {
        setError("Slot not found");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load slot details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!vehicleNumber.trim()) {
      setError("Vehicle number is required");
      return false;
    }
    if (vehicleNumber.length < 3) {
      setError("Please enter a valid vehicle number");
      return false;
    }
    if (duration < 1 || duration > 24) {
      setError("Duration must be between 1 and 24 hours");
      return false;
    }
    return true;
  };

  const handleBooking = async (e) => {
    e?.preventDefault();
    setError("");
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        `${API}/api/bookings`,
        {
          mallId,
          slotId,
          vehicleNumber: vehicleNumber.toUpperCase(),
          duration
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/malls");
      }, 2000);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Booking failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/slots/${mallId}`);
  };

  const calculatePrice = () => {
    const basePrice = slotDetails?.pricePerHour || 50;
    return basePrice * duration;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ color: "#fff", fontSize: "16px" }}>Loading...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        marginBottom: "40px"
      }}>
        <button
          onClick={handleBack}
          style={{
            padding: "10px 20px",
            background: "rgba(255, 255, 255, 0.2)",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#fff";
            e.target.style.color = "#667eea";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.2)";
            e.target.style.color = "#fff";
          }}
        >
          ← Back to Slots
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px"
          }}>
            🎫
          </div>
          <div>
            <h1 style={{
              color: "#fff",
              fontSize: "28px",
              fontWeight: "700",
              margin: 0
            }}>Book Your Slot</h1>
            <p style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "14px",
              margin: 0
            }}>Complete your parking reservation</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "48px 40px"
        }}>
          {/* Success Message */}
          {success && (
            <div style={{
              background: "#e8f5e9",
              border: "1px solid #c8e6c9",
              color: "#2e7d32",
              padding: "16px 20px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span style={{ fontSize: "24px" }}>✓</span>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>Booking Successful!</div>
                <div>Redirecting you to malls page...</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !success && (
            <div style={{
              background: "#fee",
              border: "1px solid #fcc",
              color: "#c33",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Slot Information */}
          {slotDetails && (
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "32px",
              color: "#fff"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "700",
                margin: "0 0 16px"
              }}>Slot Details</h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "16px"
              }}>
                <div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Mall</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>{slotDetails.mallName}</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Slot Number</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>
                    {slotDetails.slotNumber || slotDetails.number || `#${slotId.slice(-4)}`}
                  </div>
                </div>
                {slotDetails.floor && (
                  <div>
                    <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Floor</div>
                    <div style={{ fontSize: "16px", fontWeight: "600" }}>{slotDetails.floor}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Rate</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>
                    ₹{slotDetails.pricePerHour || 50}/hour
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleBooking}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>
                Vehicle Number *
              </label>
              <input
                type="text"
                placeholder="e.g., MH12AB1234"
                value={vehicleNumber}
                onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                disabled={submitting || success}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  outline: "none",
                  boxSizing: "border-box",
                  textTransform: "uppercase"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>
                Duration (hours) *
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value) || 1)}
                disabled={submitting || success}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
              <p style={{
                fontSize: "12px",
                color: "#718096",
                margin: "8px 0 0"
              }}>
                Enter duration between 1 and 24 hours
              </p>
            </div>

            {/* Price Summary */}
            {slotDetails && (
              <div style={{
                background: "#f7fafc",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "24px"
              }}>
                <h4 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  margin: "0 0 12px"
                }}>Price Summary</h4>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#718096"
                }}>
                  <span>Rate per hour</span>
                  <span>₹{slotDetails.pricePerHour || 50}</span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#718096"
                }}>
                  <span>Duration</span>
                  <span>{duration} hour{duration !== 1 ? 's' : ''}</span>
                </div>
                
                <div style={{
                  borderTop: "2px solid #e2e8f0",
                  marginTop: "12px",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1a202c"
                }}>
                  <span>Total Amount</span>
                  <span>₹{calculatePrice()}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || success}
              style={{
                width: "100%",
                padding: "14px",
                background: (submitting || success) ? "#a0aec0" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: (submitting || success) ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: (submitting || success) ? "none" : "0 4px 12px rgba(102, 126, 234, 0.4)"
              }}
              onMouseEnter={(e) => {
                if (!submitting && !success) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = (submitting || success) ? "none" : "0 4px 12px rgba(102, 126, 234, 0.4)";
              }}
            >
              {submitting ? "Processing..." : success ? "Booking Confirmed ✓" : "Confirm Booking"}
            </button>
          </form>

          {/* Additional Info */}
          <div style={{
            marginTop: "24px",
            padding: "16px",
            background: "#fffbeb",
            border: "1px solid #fef3c7",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#92400e"
          }}>
            <strong>Note:</strong> Your parking slot will be reserved for {duration} hour{duration !== 1 ? 's' : ''} from the time of booking. 
            Please arrive within 30 minutes to avoid cancellation.
          </div>
        </div>
      </div>
    </div>
  );
}
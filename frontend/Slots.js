import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [mallName, setMallName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { mallId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlots();
  }, [mallId]);

  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API}/api/slots/${mallId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSlots(res.data.slots || res.data);
      setMallName(res.data.mallName || "Mall");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load slots. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slotId) => {
    navigate(`/booking/${mallId}/${slotId}`);
  };

  const handleBack = () => {
    navigate("/malls");
  };

  const getSlotColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return { bg: 'linear-gradient(135deg, #00c853 0%, #00e676 100%)', icon: '✓' };
      case 'occupied':
        return { bg: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)', icon: '✗' };
      case 'reserved':
        return { bg: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', icon: '⏱' };
      default:
        return { bg: 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)', icon: '?' };
    }
  };

  const availableSlots = slots.filter(s => s.status?.toLowerCase() === 'available');
  const occupiedSlots = slots.filter(s => s.status?.toLowerCase() === 'occupied');
  const reservedSlots = slots.filter(s => s.status?.toLowerCase() === 'reserved');

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        maxWidth: "1200px",
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
          ← Back to Malls
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
            🅿️
          </div>
          <div>
            <h1 style={{
              color: "#fff",
              fontSize: "28px",
              fontWeight: "700",
              margin: 0
            }}>{mallName}</h1>
            <p style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "14px",
              margin: 0
            }}>Select an available parking slot</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "48px 40px"
        }}>
          {/* Stats Bar */}
          {!loading && slots.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px"
            }}>
              <div style={{
                padding: "16px",
                background: "linear-gradient(135deg, #00c853 0%, #00e676 100%)",
                borderRadius: "12px",
                color: "#fff"
              }}>
                <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Available</div>
                <div style={{ fontSize: "32px", fontWeight: "700" }}>{availableSlots.length}</div>
              </div>
              <div style={{
                padding: "16px",
                background: "linear-gradient(135deg, #f44336 0%, #ef5350 100%)",
                borderRadius: "12px",
                color: "#fff"
              }}>
                <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Occupied</div>
                <div style={{ fontSize: "32px", fontWeight: "700" }}>{occupiedSlots.length}</div>
              </div>
              <div style={{
                padding: "16px",
                background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
                borderRadius: "12px",
                color: "#fff"
              }}>
                <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Reserved</div>
                <div style={{ fontSize: "32px", fontWeight: "700" }}>{reservedSlots.length}</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
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
              <button
                onClick={fetchSlots}
                style={{
                  marginLeft: "12px",
                  padding: "4px 12px",
                  background: "#c33",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                border: "4px solid #e2e8f0",
                borderTopColor: "#667eea",
                borderRadius: "50%",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite"
              }} />
              <p style={{ color: "#718096", fontSize: "16px" }}>Loading parking slots...</p>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Slots Grid */}
          {!loading && slots.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "16px"
            }}>
              {slots.map((slot) => {
                const isAvailable = slot.status?.toLowerCase() === 'available';
                const slotStyle = getSlotColor(slot.status);
                
                return (
                  <div
                    key={slot._id || slot.id}
                    onClick={() => isAvailable && handleSlotSelect(slot._id || slot.id)}
                    style={{
                      background: slotStyle.bg,
                      borderRadius: "12px",
                      padding: "24px 16px",
                      cursor: isAvailable ? "pointer" : "not-allowed",
                      transition: "all 0.3s",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      opacity: isAvailable ? 1 : 0.6,
                      textAlign: "center",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      if (isAvailable) {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                  >
                    {/* Status Icon */}
                    <div style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      margin: "0 auto 12px",
                      color: "#fff"
                    }}>
                      {slotStyle.icon}
                    </div>

                    {/* Slot Number */}
                    <div style={{
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: "700",
                      marginBottom: "4px"
                    }}>
                      {slot.slotNumber || slot.number || `#${slot._id?.slice(-4)}`}
                    </div>

                    {/* Status */}
                    <div style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "12px",
                      textTransform: "capitalize"
                    }}>
                      {slot.status}
                    </div>

                    {/* Floor/Level if available */}
                    {slot.floor && (
                      <div style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "11px",
                        marginTop: "4px"
                      }}>
                        Floor {slot.floor}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && slots.length === 0 && !error && (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#718096"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🚗</div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1a202c",
                margin: "0 0 8px"
              }}>No Parking Slots</h3>
              <p style={{ margin: "0", fontSize: "14px" }}>
                There are no parking slots available for this mall.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
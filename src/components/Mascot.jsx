import React, { useState, useEffect } from "react";

export default function Mascot({ trigger }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      transition: 'transform 0.3s',
      transform: visible ? 'scale(1.5)' : 'scale(1)',
    }}>
      🐣
    </div>
  );
}

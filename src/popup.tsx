import React, { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const KeyCombinationPopup: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false)
  const [keyCombo, setKeyCombo] = useState<string>("")

  useEffect(() => {
    const loadSavedKeyCombo = async () => {
      const savedCombo = await storage.get("keyCombo")
      if (savedCombo) {
        setKeyCombo(savedCombo)
      }
    }
    loadSavedKeyCombo()
  }, [])

  const handleStartCapture = () => {
    setIsCapturing(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault()
    if (isCapturing) {
      const combo = []
      if (e.ctrlKey) combo.push("Ctrl")
      if (e.metaKey) combo.push("Cmd")
      if (e.altKey) combo.push("Alt")
      if (e.shiftKey) combo.push("Shift")
      if (
        e.key !== "Control" &&
        e.key !== "Meta" &&
        e.key !== "Alt" &&
        e.key !== "Shift"
      ) {
        combo.push(e.key.toUpperCase())
      }
      setKeyCombo(combo.join(" + "))
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (isCapturing) {
      setIsCapturing(false)
    }
  }

  const handleSave = async () => {
    await storage.set("keyCombo", keyCombo)
    // You might want to add some visual feedback here to indicate successful save
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Set Key Combination</h2>
      <div
        style={styles.comboDisplay}
        onClick={handleStartCapture}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex={0}>
        {isCapturing
          ? "Press your desired key combination..."
          : keyCombo || "Click to set combination"}
      </div>
      <button style={styles.button} onClick={handleSave}>
        Save
      </button>
      <p style={styles.info}>
        Current combination: {keyCombo || "Cmd/Ctrl + K (Default)"}
      </p>
    </div>
  )
}

const styles = {
  container: {
    width: "300px",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
    backgroundColor: "#f5f5f7",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  } as const,
  title: {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "15px",
    color: "#1d1d1f"
  } as const,
  comboDisplay: {
    padding: "10px",
    border: "1px solid #d2d2d7",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    marginBottom: "15px",
    minHeight: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#86868b"
  } as const,
  button: {
    backgroundColor: "#0071e3",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease"
  } as const,
  info: {
    fontSize: "12px",
    color: "#86868b",
    marginTop: "15px"
  } as const
}

export default KeyCombinationPopup

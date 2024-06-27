import { faker } from "@faker-js/faker"
import type { PlasmoCSConfig, PlasmoGetOverlayAnchor } from "plasmo"
import React, { useEffect, useRef, useState } from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const CATEGORIES = ["Person", "Address", "Company", "Misc"]

const OPTIONS = {
  Person: [
    { label: "First Name", generate: () => faker.person.firstName() },
    { label: "Last Name", generate: () => faker.person.lastName() },
    { label: "Full Name", generate: () => faker.person.fullName() },
    { label: "Email", generate: () => faker.internet.email() },
    { label: "Phone Number", generate: () => faker.phone.number() }
  ],
  Address: [
    { label: "Street Address", generate: () => faker.location.streetAddress() },
    { label: "City", generate: () => faker.location.city() },
    { label: "State", generate: () => faker.location.state() },
    { label: "Country", generate: () => faker.location.country() },
    { label: "Zipcode", generate: () => faker.location.zipCode() }
  ],
  Company: [
    { label: "Company Name", generate: () => faker.company.name() },
    { label: "Industry", generate: () => faker.company.buzzNoun() },
    { label: "Catch Phrase", generate: () => faker.company.catchPhrase() }
  ],
  Misc: [
    { label: "Lorem Sentence", generate: () => faker.lorem.sentence() },
    { label: "Date", generate: () => faker.date.recent().toLocaleDateString() },
    { label: "Time", generate: () => faker.date.recent().toLocaleTimeString() }
  ]
}

const FakeDataMenu: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const activeInputRef = useRef<HTMLInputElement | null>(null)
  const [keyCombo, setKeyCombo] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const loadKeyCombo = async () => {
      const savedCombo = await storage.get("keyCombo")
      setKeyCombo(savedCombo || null)
    }
    loadKeyCombo()
  }, [])

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement) {
        activeInputRef.current = e.target
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isDefaultCombo = (e.ctrlKey || e.metaKey) && e.key === "k"
      const isCustomCombo = keyCombo && matchesKeyCombo(e, keyCombo)

      if (isDefaultCombo || isCustomCombo) {
        e.preventDefault()
        showMenu()
      } else if (isVisible) {
        handleMenuNavigation(e)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("focusin", handleFocus)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("focusin", handleFocus)
    }
  }, [isVisible, selectedCategory, selectedOptionIndex, keyCombo])

  const matchesKeyCombo = (e: KeyboardEvent, combo: string): boolean => {
    const parts = combo
      .toLowerCase()
      .split("+")
      .map((part) => part.trim())
    const pressedKeys = new Set<string>()

    if (e.ctrlKey) pressedKeys.add("ctrl")
    if (e.metaKey) pressedKeys.add("cmd")
    if (e.altKey) pressedKeys.add("alt")
    if (e.shiftKey) pressedKeys.add("shift")
    pressedKeys.add(e.key.toLowerCase())

    return parts.every((part) => pressedKeys.has(part))
  }

  const showMenu = () => {
    if (activeInputRef.current) {
      const rect = activeInputRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      })
    }
    setIsVisible(true)
  }

  const handleMenuNavigation = (e: KeyboardEvent) => {
    const currentOptions = OPTIONS[selectedCategory]
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault()
        setSelectedOptionIndex((prev) =>
          prev > 0 ? prev - 1 : currentOptions.length - 1
        )
        break
      case "ArrowDown":
        e.preventDefault()
        setSelectedOptionIndex((prev) =>
          prev < currentOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowLeft":
        e.preventDefault()
        setSelectedCategory((prev) => {
          const newIndex = CATEGORIES.indexOf(prev) - 1
          return CATEGORIES[newIndex < 0 ? CATEGORIES.length - 1 : newIndex]
        })
        setSelectedOptionIndex(0)
        break
      case "ArrowRight":
        e.preventDefault()
        setSelectedCategory((prev) => {
          const newIndex = CATEGORIES.indexOf(prev) + 1
          return CATEGORIES[newIndex >= CATEGORIES.length ? 0 : newIndex]
        })
        setSelectedOptionIndex(0)
        break
      case "Enter":
        e.preventDefault()
        insertFakeData(
          OPTIONS[selectedCategory][selectedOptionIndex].generate()
        )
        setIsVisible(false)
        break
      case "Escape":
        setIsVisible(false)
        break
    }
  }

  const setNativeValue = (element: HTMLInputElement, value: string) => {
    const lastValue = element.value
    element.value = value
    const event = new Event("input", { bubbles: true })
    // React 15
    ;(event as any).simulated = true
    // React 16+
    const tracker = (element as any)._valueTracker
    if (tracker) {
      tracker.setValue(lastValue)
    }
    element.dispatchEvent(event)
  }

  const insertFakeData = (data: string) => {
    if (activeInputRef.current) {
      const input = activeInputRef.current
      const currentValue = input.value
      const cursorPosition = input.selectionStart || 0
      const needsSpace =
        currentValue.length > 0 && currentValue[cursorPosition - 1] !== " "
      const newValue =
        currentValue.slice(0, cursorPosition) +
        (needsSpace ? " " : "") +
        data +
        currentValue.slice(cursorPosition)

      // Use the setNativeValue function to update the input
      setNativeValue(input, newValue)

      // Set the cursor position
      const newCursorPosition =
        cursorPosition + (needsSpace ? 1 : 0) + data.length
      input.setSelectionRange(newCursorPosition, newCursorPosition)

      // Focus the input
      input.focus()
    }

    setTimeout(() => {
      if (menuRef.current) {
        menuRef.current.focus()
      }
    }, 0)
  }

  if (!isVisible) return null

  return (
    <div
      ref={menuRef}
      tabIndex={-1}
      style={{
        ...styles.menu,
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsVisible(false)
        }
      }}>
      <div style={styles.tabs}>
        {CATEGORIES.map((category) => (
          <div
            key={category}
            style={{
              ...styles.tab,
              ...(category === selectedCategory ? styles.selectedTab : {})
            }}
            onClick={() => {
              setSelectedCategory(category)
              setSelectedOptionIndex(0)
            }}>
            {category}
          </div>
        ))}
      </div>
      <div style={styles.optionsContainer}>
        {OPTIONS[selectedCategory].map((option, index) => (
          <div
            key={option.label}
            onClick={() => {
              insertFakeData(option.generate())
            }}
            style={{
              ...styles.option,
              ...(index === selectedOptionIndex ? styles.selectedOption : {})
            }}>
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  menu: {
    position: "absolute",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    zIndex: 9999,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    color: "#333333",
    width: "400px",
    maxHeight: "60vh",
    overflowY: "auto",
    backdropFilter: "blur(10px)"
  } as const,
  tabs: {
    display: "flex",
    borderBottom: "1px solid #e0e0e0",
    marginBottom: "12px"
  } as const,
  tab: {
    padding: "8px 16px",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s ease"
  } as const,
  selectedTab: {
    borderBottom: "2px solid #007AFF",
    color: "#007AFF"
  } as const,
  optionsContainer: {
    maxHeight: "300px",
    overflowY: "auto"
  } as const,
  option: {
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    margin: "4px 0",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "rgba(0, 122, 255, 0.1)"
    }
  } as const,
  selectedOption: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    fontWeight: "500"
  } as const
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.body

export const PlasmoOverlay = () => <FakeDataMenu />

export default PlasmoOverlay

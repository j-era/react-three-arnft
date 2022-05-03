import React from "react"
import { createRoot } from "react-dom/client"
import App from "./app"


const params = new URLSearchParams(window.location.search)

const preview = params.has("preview")

createRoot(document.getElementById("root")).render(<App preview={preview} />)

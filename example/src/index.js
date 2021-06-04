import React from "react"
import ReactDOM from "react-dom"

import App from "./app"

const params = new URLSearchParams(window.location.search)

const preview = params.has("preview")

ReactDOM.render(<App preview={preview} />, document.getElementById("root"))

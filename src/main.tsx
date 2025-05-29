import ReactDOM from "react-dom/client"
import Provider from "./Provider"
import Router from "./Router"
import Container from "./Container"
import "./styles/styles.css"
console.log("✅ ReactDOM rendering...")
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <Container>
      <Router />
    </Container>
  </Provider>
)

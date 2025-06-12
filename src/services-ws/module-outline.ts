// constants
const wsBaseUrl = import.meta.env.VITE_GAIA_WEBSOCKET_BASE_URL as string

// service
async function wsService(taskId: string, taskType: string, msgType: string) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsBaseUrl)

    ws.onopen = () => {
      console.log("Connected to module outline websocket")
      ws.send(
        JSON.stringify({
          taskId,
          taskType,
          msgType,
        }),
      )
    }

    ws.onmessage = (event) => {
      console.log("Received message from module outline websocket", event)

      if (typeof event.data !== "string") {
        reject(new Error("Invalid data received from websocket"))
        return
      }

      const data = JSON.parse(event.data) as unknown
      if (
        !data ||
        typeof data !== "object" || 
        !("type" in data) 
      ) {
        reject(new Error("Invalid data received from websocket"))
        return
      }

      if (data.type === "task_completed" && "result" in data) {
        resolve(data.result)
        cleanup(ws)
      } else if (
        data.type === "error" &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        reject(new Error(data.message))
        cleanup(ws)
      } else {
        reject(new Error("Unexpected message received from websocket"))
      }
    }

    ws.onclose = () => {
      console.log("Disconnected from module outline websocket")
      reject(new Error("WebSocket connection closed"))
      cleanup(ws)
    }

    ws.onerror = (error) => {
      console.error("Error from module outline websocket", error)
      reject(new Error(`Error from module outline websocket ${error.type}`))
      cleanup(ws)
    }

    function cleanup(ws: WebSocket) {
      ws.close()
    }
  })
}

export { wsService }

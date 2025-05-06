const wsBaseUrl = import.meta.env.VITE_GAIA_WEBSOCKET_BASE_URL

type WsResponse = {
  type: "complete" | "progress" | "error"
  taskId: string
  message: string | number
}

type WsCallbacks = {
  onProgress?: (progress: number) => void
  onComplete: (result: any) => void
  onError: (error: Error) => void
}

let ws: WebSocket | null = null
let isConnecting = false

function connect(reject: (reason?: any) => void) {
  if (ws || isConnecting) return

  isConnecting = true
  ws = new WebSocket(wsBaseUrl)

  ws.onopen = () => {
    isConnecting = false
  }

  ws.onclose = () => {
    if (ws) {
      ws = null
    }
    reject(new Error("Disconnected from module outline websocket"))
    isConnecting = false
  }

  ws.onerror = (error) => {
    console.error("Error from module outline websocket", error)
    reject(new Error("Error from module outline websocket"))
    ws?.close()
  }
}

async function useWs(
  taskId: string,
  taskType: string,
  msgType: string,
  callbacks: WsCallbacks,
) {
  return new Promise<any>((resolve, reject) => {
    if (!ws) {
      connect(reject)
    }

    // Set up message handler for this specific task
    const messageHandler = (event: MessageEvent) => {
      const data: WsResponse = JSON.parse(event.data)

      if (data.taskId !== taskId) return

      if (data.type === "complete") {
        callbacks.onComplete(data.message)
        ws?.removeEventListener("message", messageHandler)
        cleanup(ws)
        resolve(data.message)
      } else if (data.type === "progress") {
        console.log("Progress from module outline websocket", data.message)
        if (isNaN(Number(data.message))) return
        callbacks.onProgress?.(Number(data.message))
      } else if (data.type === "error") {
        callbacks.onError?.(new Error(data.message as string))
        ws?.removeEventListener("message", messageHandler)
        reject(new Error(data.message as string))
      }
    }

    // Add message handler
    ws?.addEventListener("message", messageHandler)

    // Send the message when the connection is ready
    const sendMessage = () => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            taskId,
            taskType,
            msgType,
          }),
        )
      } else {
        setTimeout(sendMessage, 100)
      }
    }

    function cleanup(ws: WebSocket | null) {
      if (ws) {
        ws.close()
      }
    }
  })
}

export { useWs }

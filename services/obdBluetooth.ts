const COMMON_OBD_SERVICES = [
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  '0000ffe0-0000-1000-8000-00805f9b34fb',
  '0000fff0-0000-1000-8000-00805f9b34fb',
]

interface ObdCharacteristic {
  properties: { write: boolean; writeWithoutResponse: boolean; notify: boolean; indicate: boolean }
  value: DataView | null
  startNotifications(): Promise<ObdCharacteristic>
  writeValue(value: BufferSource): Promise<void>
  writeValueWithResponse?(value: BufferSource): Promise<void>
  addEventListener(type: string, listener: EventListener): void
  removeEventListener(type: string, listener: EventListener): void
}

interface ObdService { getCharacteristics(): Promise<ObdCharacteristic[]> }
interface ObdServer { getPrimaryServices(): Promise<ObdService[]> }
interface ObdDevice {
  name?: string
  id: string
  gatt?: { connected: boolean; connect(): Promise<ObdServer>; disconnect(): void }
  addEventListener(type: string, listener: EventListener): void
}

declare global {
  interface Navigator {
    bluetooth: { requestDevice(options: { acceptAllDevices: boolean; optionalServices: string[] }): Promise<ObdDevice> }
  }
}

export type ObdConnectionState = 'disconnected' | 'connecting' | 'connected'
export interface ObdBluetoothDeviceInfo { name: string; id: string }

export class ObdBluetoothTransport {
  private device: ObdDevice | null = null
  private writeCharacteristic: ObdCharacteristic | null = null
  private notifyCharacteristic: ObdCharacteristic | null = null
  private responseBuffer = ''
  private pendingResponse: { resolve: (value: string) => void; reject: (reason: Error) => void; timeout: number } | null = null
  onStateChange?: (state: ObdConnectionState) => void
  onDeviceChange?: (device: ObdBluetoothDeviceInfo | null) => void

  get connected() { return Boolean(this.device?.gatt?.connected && this.writeCharacteristic && this.notifyCharacteristic) }

  async connect(): Promise<ObdBluetoothDeviceInfo> {
    if (!('bluetooth' in navigator)) throw new Error('Web Bluetooth is not supported in this browser')
    if (!window.isSecureContext) throw new Error('Bluetooth requires HTTPS or localhost')
    this.onStateChange?.('connecting')
    try {
      this.device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: COMMON_OBD_SERVICES })
      this.device.addEventListener('gattserverdisconnected', this.handleDisconnect)
      const server = await this.device.gatt?.connect()
      if (!server) throw new Error('Could not open GATT connection')
      const characteristics = await this.findCharacteristics(server)
      if (!characteristics.write || !characteristics.notify) throw new Error('Adapter exposes no writable and notification characteristics')
      this.writeCharacteristic = characteristics.write
      this.notifyCharacteristic = characteristics.notify
      this.notifyCharacteristic.addEventListener('characteristicvaluechanged', this.handleNotification)
      await this.notifyCharacteristic.startNotifications()
      this.onStateChange?.('connected')
      const info = { name: this.device.name || 'Unnamed OBD adapter', id: this.device.id }
      this.onDeviceChange?.(info)
      return info
    } catch (error) {
      this.onStateChange?.('disconnected')
      throw error instanceof Error ? error : new Error('Bluetooth connection failed')
    }
  }

  async disconnect() {
    this.notifyCharacteristic?.removeEventListener('characteristicvaluechanged', this.handleNotification)
    if (this.device?.gatt?.connected) this.device.gatt.disconnect()
    this.resetConnection()
  }

  async send(command: string): Promise<string> {
    if (!this.writeCharacteristic || !this.connected) throw new Error('Connect an OBD adapter first')
    if (this.pendingResponse) throw new Error('Wait for current OBD response')
    const encoded = new TextEncoder().encode(`${command.trim().replace(/\r/g, '')}\r`)
    this.responseBuffer = ''
    let responseTimeout = 0
    const response = new Promise<string>((resolve, reject) => {
      responseTimeout = window.setTimeout(() => { this.pendingResponse = null; reject(new Error('OBD adapter response timed out')) }, 5000)
      this.pendingResponse = { resolve, reject, timeout: responseTimeout }
    })
    try {
      if (this.writeCharacteristic.writeValueWithResponse) await this.writeCharacteristic.writeValueWithResponse(encoded)
      else await this.writeCharacteristic.writeValue(encoded)
    } catch (error) {
      window.clearTimeout(responseTimeout)
      this.pendingResponse = null
      throw error
    }
    return response
  }

  private async findCharacteristics(server: ObdServer) {
    const services = await server.getPrimaryServices()
    let write: ObdCharacteristic | null = null
    let notify: ObdCharacteristic | null = null
    for (const service of services) {
      const characteristics = await service.getCharacteristics()
      write ||= characteristics.find((item) => item.properties.write || item.properties.writeWithoutResponse) ?? null
      notify ||= characteristics.find((item) => item.properties.notify || item.properties.indicate) ?? null
    }
    return { write, notify }
  }

  private handleNotification = (event: Event) => {
    const characteristic = event.target as unknown as ObdCharacteristic
    if (!characteristic.value) return
    this.responseBuffer += new TextDecoder().decode(characteristic.value)
    if (!this.responseBuffer.includes('>') || !this.pendingResponse) return
    const response = this.responseBuffer.replace(/\r/g, '\n').replace(/\n+/g, '\n').trim()
    const pending = this.pendingResponse
    this.pendingResponse = null
    window.clearTimeout(pending.timeout)
    pending.resolve(response)
  }

  private handleDisconnect = () => { this.resetConnection(); this.onStateChange?.('disconnected') }
  private resetConnection() { this.writeCharacteristic = null; this.notifyCharacteristic = null; this.device = null; this.responseBuffer = ''; this.onDeviceChange?.(null) }
}

const QR_SIZE = 29 // Version 3, error correction level L
const DATA_CODEWORDS = 55
const ECC_CODEWORDS = 15

function multiply(a, b) {
  let product = 0
  for (let bit = 7; bit >= 0; bit -= 1) {
    product = (product << 1) ^ ((product >>> 7) * 0x11d)
    if ((b >>> bit) & 1) product ^= a
  }
  return product
}

function makeCodewords(value) {
  const bytes = new TextEncoder().encode(value)
  const bits = []
  const append = (number, length) => {
    for (let bit = length - 1; bit >= 0; bit -= 1) bits.push((number >>> bit) & 1)
  }

  append(0b0100, 4) // byte mode
  append(bytes.length, 8)
  bytes.forEach((byte) => append(byte, 8))
  for (let i = 0; i < Math.min(4, DATA_CODEWORDS * 8 - bits.length); i += 1) bits.push(0)
  while (bits.length % 8) bits.push(0)

  const data = []
  for (let i = 0; i < bits.length; i += 8) {
    data.push(bits.slice(i, i + 8).reduce((result, bit) => (result << 1) | bit, 0))
  }
  for (let pad = 0; data.length < DATA_CODEWORDS; pad += 1) data.push(pad % 2 ? 0x11 : 0xec)

  let generator = [1]
  let root = 1
  for (let i = 0; i < ECC_CODEWORDS; i += 1) {
    const next = Array(generator.length + 1).fill(0)
    generator.forEach((coefficient, index) => {
      next[index] ^= coefficient
      next[index + 1] ^= multiply(coefficient, root)
    })
    generator = next
    root = multiply(root, 2)
  }

  const remainder = [...data, ...Array(ECC_CODEWORDS).fill(0)]
  for (let i = 0; i < data.length; i += 1) {
    const factor = remainder[i]
    if (factor) generator.forEach((coefficient, index) => { remainder[i + index] ^= multiply(coefficient, factor) })
  }
  return [...data, ...remainder.slice(data.length)]
}

function createMatrix(codewords) {
  const matrix = Array.from({ length: QR_SIZE }, () => Array(QR_SIZE).fill(null))
  const set = (x, y, dark) => {
    if (x >= 0 && x < QR_SIZE && y >= 0 && y < QR_SIZE) matrix[y][x] = Boolean(dark)
  }

  const finder = (cx, cy) => {
    for (let dy = -1; dy <= 7; dy += 1) {
      for (let dx = -1; dx <= 7; dx += 1) {
        const distance = Math.max(Math.abs(dx - 3), Math.abs(dy - 3))
        set(cx + dx, cy + dy, dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 && distance !== 2)
      }
    }
  }
  finder(0, 0)
  finder(QR_SIZE - 7, 0)
  finder(0, QR_SIZE - 7)

  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      set(22 + dx, 22 + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
    }
  }
  for (let i = 8; i < QR_SIZE - 8; i += 1) {
    set(i, 6, i % 2 === 0)
    set(6, i, i % 2 === 0)
  }

  // Reserve both format information areas before filling the data modules.
  for (let i = 0; i <= 5; i += 1) set(8, i, false)
  set(8, 7, false); set(8, 8, false); set(7, 8, false)
  for (let i = 9; i < 15; i += 1) set(14 - i, 8, false)
  for (let i = 0; i < 8; i += 1) set(QR_SIZE - 1 - i, 8, false)
  for (let i = 8; i < 15; i += 1) set(8, QR_SIZE - 15 + i, false)

  const dataBits = codewords.flatMap((byte) => Array.from({ length: 8 }, (_, bit) => (byte >>> (7 - bit)) & 1))
  let bitIndex = 0
  for (let right = QR_SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vertical = 0; vertical < QR_SIZE; vertical += 1) {
      const y = ((right + 1) & 2) === 0 ? QR_SIZE - 1 - vertical : vertical
      for (let offset = 0; offset < 2; offset += 1) {
        const x = right - offset
        if (matrix[y][x] === null) {
          const bit = dataBits[bitIndex++] ?? 0
          set(x, y, Boolean(bit ^ (((x + y) % 2) === 0))) // mask pattern 0
        }
      }
    }
  }

  // Level L (01), mask 0, followed by the QR format BCH code and XOR mask.
  const formatData = 0b01000
  let remainder = formatData
  for (let i = 0; i < 10; i += 1) remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537)
  const format = ((formatData << 10) | remainder) ^ 0x5412
  const formatBit = (i) => ((format >>> i) & 1) !== 0
  for (let i = 0; i <= 5; i += 1) set(8, i, formatBit(i))
  set(8, 7, formatBit(6)); set(8, 8, formatBit(7)); set(7, 8, formatBit(8))
  for (let i = 9; i < 15; i += 1) set(14 - i, 8, formatBit(i))
  for (let i = 0; i < 8; i += 1) set(QR_SIZE - 1 - i, 8, formatBit(i))
  for (let i = 8; i < 15; i += 1) set(8, QR_SIZE - 15 + i, formatBit(i))
  set(8, QR_SIZE - 8, true)
  return matrix
}

export function makeQrSvg(value) {
  const matrix = createMatrix(makeCodewords(value))
  const quietZone = 4
  const canvasSize = QR_SIZE + quietZone * 2
  const cells = []
  matrix.forEach((row, y) => row.forEach((dark, x) => {
    if (dark) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`)
  }))
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasSize} ${canvasSize}" shape-rendering="crispEdges"><rect width="${canvasSize}" height="${canvasSize}" fill="#111"/><g transform="translate(${quietZone} ${quietZone})" fill="#fff">${cells.join('')}</g></svg>`
}

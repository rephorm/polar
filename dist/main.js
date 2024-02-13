/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/gcode-interpreter/lib/Interpreter.js":
/*!***********************************************************!*\
  !*** ./node_modules/gcode-interpreter/lib/Interpreter.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint no-continue: 0 */


var _gcodeParser = __webpack_require__(/*! gcode-parser */ "./node_modules/gcode-parser/lib/index.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {};

/**
 * Returns an object composed from arrays of property names and values.
 * @example
 *   fromPairs([['a', 1], ['b', 2]]);
 *   // => { 'a': 1, 'b': 2 }
 */
var fromPairs = function fromPairs(pairs) {
    var index = -1;
    var length = !pairs ? 0 : pairs.length;
    var result = {};

    while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
    }

    return result;
};

var partitionWordsByGroup = function partitionWordsByGroup() {
    var words = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var groups = [];

    for (var i = 0; i < words.length; ++i) {
        var word = words[i];
        var letter = word[0];

        if (letter === 'G' || letter === 'M' || letter === 'T') {
            groups.push([word]);
            continue;
        }

        if (groups.length > 0) {
            groups[groups.length - 1].push(word);
        } else {
            groups.push([word]);
        }
    }

    return groups;
};

var interpret = function interpret(self, data) {
    var groups = partitionWordsByGroup(data.words);

    for (var i = 0; i < groups.length; ++i) {
        var words = groups[i];
        var word = words[0] || [];
        var letter = word[0];
        var code = word[1];
        var cmd = '';
        var args = {};

        if (letter === 'G') {
            cmd = letter + code;
            args = fromPairs(words.slice(1));

            // Motion Mode
            if (code === 0 || code === 1 || code === 2 || code === 3 || code === 38.2 || code === 38.3 || code === 38.4 || code === 38.5) {
                self.motionMode = cmd;
            } else if (code === 80) {
                self.motionMode = '';
            }
        } else if (letter === 'M') {
            cmd = letter + code;
            args = fromPairs(words.slice(1));
        } else if (letter === 'T') {
            // T1 ; w/o M6
            cmd = letter;
            args = code;
        } else if (letter === 'F') {
            // F750 ; w/o motion command
            cmd = letter;
            args = code;
        } else if (letter === 'X' || letter === 'Y' || letter === 'Z' || letter === 'A' || letter === 'B' || letter === 'C' || letter === 'I' || letter === 'J' || letter === 'K') {
            // Use previous motion command if the line does not start with G-code or M-code.
            // @example
            //   G0 Z0.25
            //   X-0.5 Y0.
            //   Z0.1
            //   G01 Z0. F5.
            //   G2 X0.5 Y0. I0. J-0.5
            //   X0. Y-0.5 I-0.5 J0.
            //   X-0.5 Y0. I0. J0.5
            // @example
            //   G01
            //   M03 S0
            //   X5.2 Y0.2 M03 S0
            //   X5.3 Y0.1 M03 S1000
            //   X5.4 Y0 M03 S0
            //   X5.5 Y0 M03 S0
            cmd = self.motionMode;
            args = fromPairs(words);
        }

        if (!cmd) {
            continue;
        }

        if (typeof self.handlers[cmd] === 'function') {
            var func = self.handlers[cmd];
            func(args);
        } else if (typeof self.defaultHandler === 'function') {
            self.defaultHandler(cmd, args);
        }

        if (typeof self[cmd] === 'function') {
            var _func = self[cmd].bind(self);
            _func(args);
        }
    }
};

var Interpreter = function () {
    function Interpreter(options) {
        _classCallCheck(this, Interpreter);

        this.motionMode = 'G0';
        this.handlers = {};

        options = options || {};

        this.handlers = options.handlers || {};
        this.defaultHandler = options.defaultHandler;
    }

    _createClass(Interpreter, [{
        key: 'loadFromStream',
        value: function loadFromStream(stream) {
            var _this = this;

            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

            var s = (0, _gcodeParser.parseStream)(stream, callback);
            s.on('data', function (data) {
                interpret(_this, data);
            });
            return s;
        }
    }, {
        key: 'loadFromFile',
        value: function loadFromFile(file) {
            var _this2 = this;

            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

            var s = (0, _gcodeParser.parseFile)(file, callback);
            s.on('data', function (data) {
                interpret(_this2, data);
            });
            return s;
        }
    }, {
        key: 'loadFromFileSync',
        value: function loadFromFileSync(file) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

            var list = (0, _gcodeParser.parseFileSync)(file);
            for (var i = 0; i < list.length; ++i) {
                interpret(this, list[i]);
                callback(list[i], i);
            }
            return list;
        }
    }, {
        key: 'loadFromString',
        value: function loadFromString(str) {
            var _this3 = this;

            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

            var s = (0, _gcodeParser.parseString)(str, callback);
            s.on('data', function (data) {
                interpret(_this3, data);
            });
            return s;
        }
    }, {
        key: 'loadFromStringSync',
        value: function loadFromStringSync(str) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

            var list = (0, _gcodeParser.parseStringSync)(str);
            for (var i = 0; i < list.length; ++i) {
                interpret(this, list[i]);
                callback(list[i], i);
            }
            return list;
        }
    }]);

    return Interpreter;
}();

exports["default"] = Interpreter;

/***/ }),

/***/ "./node_modules/gcode-interpreter/lib/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/gcode-interpreter/lib/index.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _Interpreter = __webpack_require__(/*! ./Interpreter */ "./node_modules/gcode-interpreter/lib/Interpreter.js");

var _Interpreter2 = _interopRequireDefault(_Interpreter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _Interpreter2.default;

/***/ }),

/***/ "./node_modules/gcode-parser/lib/index.js":
/*!************************************************!*\
  !*** ./node_modules/gcode-parser/lib/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.parseStringSync = exports.parseString = exports.parseFileSync = exports.parseFile = exports.parseStream = exports.parseLine = exports.GCodeLineStream = void 0;

var _events = _interopRequireDefault(__webpack_require__(/*! events */ "./node_modules/events/events.js"));

var _fs = _interopRequireDefault(__webpack_require__(/*! fs */ "?5874"));

var _timers = _interopRequireDefault(__webpack_require__(/*! timers */ "./node_modules/timers-browserify/main.js"));

var _stream = _interopRequireWildcard(__webpack_require__(/*! stream */ "./node_modules/stream-browserify/index.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var noop = function noop() {};

var streamify = function streamify(text) {
  var s = new _stream["default"].Readable();
  s.push(text);
  s.push(null);
  return s;
};

var containsLineEnd = function () {
  var re = new RegExp(/.*(?:\r\n|\r|\n)/g);
  return function (s) {
    return !!s.match(re);
  };
}(); // @param {array} arr The array to iterate over.
// @param {object} opts The options object.
// @param {function} iteratee The iteratee invoked per element.
// @param {function} done The done invoked after the loop has finished.


var iterateArray = function iterateArray() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var iteratee = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
  var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;

  if (typeof opts === 'function') {
    done = iteratee;
    iteratee = opts;
    opts = {};
  }

  opts.batchSize = opts.batchSize || 1;

  var loop = function loop() {
    var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    for (var count = 0; i < arr.length && count < opts.batchSize; ++i, ++count) {
      iteratee(arr[i], i, arr);
    }

    if (i < arr.length) {
      _timers["default"].setImmediate(function () {
        return loop(i);
      });

      return;
    }

    done();
  };

  loop();
}; // @param {string} line The G-code line


var parseLine = function () {
  // http://reprap.org/wiki/G-code#Special_fields
  // The checksum "cs" for a GCode string "cmd" (including its line number) is computed
  // by exor-ing the bytes in the string up to and not including the * character.
  var computeChecksum = function computeChecksum(s) {
    s = s || '';

    if (s.lastIndexOf('*') >= 0) {
      s = s.substr(0, s.lastIndexOf('*'));
    }

    var cs = 0;

    for (var i = 0; i < s.length; ++i) {
      var c = s[i].charCodeAt(0);
      cs ^= c;
    }

    return cs;
  }; // http://linuxcnc.org/docs/html/gcode/overview.html#gcode:comments
  // Comments can be embedded in a line using parentheses () or for the remainder of a lineusing a semi-colon. The semi-colon is not treated as the start of a comment when enclosed in parentheses.


  var stripComments = function () {
    var re1 = new RegExp(/\s*\([^\)]*\)/g); // Remove anything inside the parentheses

    var re2 = new RegExp(/\s*;.*/g); // Remove anything after a semi-colon to the end of the line, including preceding spaces

    var re3 = new RegExp(/\s+/g);
    return function (line) {
      return line.replace(re1, '').replace(re2, '').replace(re3, '');
    };
  }();

  var re = /(%.*)|({.*)|((?:\$\$)|(?:\$[a-zA-Z0-9#]*))|([a-zA-Z][0-9\+\-\.]+)|(\*[0-9]+)/igm;
  return function (line, options) {
    options = options || {};
    options.flatten = !!options.flatten;
    options.noParseLine = !!options.noParseLine;
    var result = {
      line: line
    };

    if (options.noParseLine) {
      return result;
    }

    result.words = [];
    var ln; // Line number

    var cs; // Checksum

    var words = stripComments(line).match(re) || [];

    for (var i = 0; i < words.length; ++i) {
      var word = words[i];
      var letter = word[0].toUpperCase();
      var argument = word.slice(1); // Parse % commands for bCNC and CNCjs
      // - %wait Wait until the planner queue is empty

      if (letter === '%') {
        result.cmds = (result.cmds || []).concat(line.trim());
        continue;
      } // Parse JSON commands for TinyG and g2core


      if (letter === '{') {
        result.cmds = (result.cmds || []).concat(line.trim());
        continue;
      } // Parse $ commands for Grbl
      // - $C Check gcode mode
      // - $H Run homing cycle


      if (letter === '$') {
        result.cmds = (result.cmds || []).concat("".concat(letter).concat(argument));
        continue;
      } // N: Line number


      if (letter === 'N' && typeof ln === 'undefined') {
        // Line (block) number in program
        ln = Number(argument);
        continue;
      } // *: Checksum


      if (letter === '*' && typeof cs === 'undefined') {
        cs = Number(argument);
        continue;
      }

      var value = Number(argument);

      if (Number.isNaN(value)) {
        value = argument;
      }

      if (options.flatten) {
        result.words.push(letter + value);
      } else {
        result.words.push([letter, value]);
      }
    } // Line number


    typeof ln !== 'undefined' && (result.ln = ln); // Checksum

    typeof cs !== 'undefined' && (result.cs = cs);

    if (result.cs && computeChecksum(line) !== result.cs) {
      result.err = true; // checksum failed
    }

    return result;
  };
}(); // @param {object} stream The G-code line stream
// @param {options} options The options object
// @param {function} callback The callback function


exports.parseLine = parseLine;

var parseStream = function parseStream(stream, options) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var emitter = new _events["default"].EventEmitter();

  try {
    var results = [];
    stream.pipe(new GCodeLineStream(options)).on('data', function (data) {
      emitter.emit('data', data);
      results.push(data);
    }).on('end', function () {
      emitter.emit('end', results);
      callback && callback(null, results);
    }).on('error', callback);
  } catch (err) {
    callback(err);
  }

  return emitter;
}; // @param {string} file The G-code path name
// @param {options} options The options object
// @param {function} callback The callback function


exports.parseStream = parseStream;

var parseFile = function parseFile(file, options) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  file = file || '';

  var s = _fs["default"].createReadStream(file, {
    encoding: 'utf8'
  });

  s.on('error', callback);
  return parseStream(s, options, callback);
};

exports.parseFile = parseFile;

var parseFileSync = function parseFileSync(file, options) {
  return parseStringSync(_fs["default"].readFileSync(file, 'utf8'), options);
}; // @param {string} str The G-code text string
// @param {options} options The options object
// @param {function} callback The callback function


exports.parseFileSync = parseFileSync;

var parseString = function parseString(str, options) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  return parseStream(streamify(str), options, callback);
};

exports.parseString = parseString;

var parseStringSync = function parseStringSync(str, options) {
  var _options = _objectSpread({}, options),
      _options$flatten = _options.flatten,
      flatten = _options$flatten === void 0 ? false : _options$flatten,
      _options$noParseLine = _options.noParseLine,
      noParseLine = _options$noParseLine === void 0 ? false : _options$noParseLine;

  var results = [];
  var lines = str.split('\n');

  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i].trim();

    if (line.length === 0) {
      continue;
    }

    var result = parseLine(line, {
      flatten: flatten,
      noParseLine: noParseLine
    });
    results.push(result);
  }

  return results;
}; // @param {string} str The G-code text string
// @param {options} options The options object


exports.parseStringSync = parseStringSync;

var GCodeLineStream =
/*#__PURE__*/
function (_Transform) {
  _inherits(GCodeLineStream, _Transform);

  // @param {object} [options] The options object
  // @param {number} [options.batchSize] The batch size.
  // @param {boolean} [options.flatten] True to flatten the array, false otherwise.
  // @param {boolean} [options.noParseLine] True to not parse line, false otherwise.
  function GCodeLineStream() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, GCodeLineStream);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GCodeLineStream).call(this, {
      objectMode: true
    }));

    _defineProperty(_assertThisInitialized(_this), "state", {
      lineCount: 0,
      lastChunkEndedWithCR: false
    });

    _defineProperty(_assertThisInitialized(_this), "options", {
      batchSize: 1000,
      noParseLine: false
    });

    _defineProperty(_assertThisInitialized(_this), "lineBuffer", '');

    _defineProperty(_assertThisInitialized(_this), "re", new RegExp(/.*(?:\r\n|\r|\n)|.+$/g));

    _this.options = _objectSpread({}, _this.options, options);
    return _this;
  }

  _createClass(GCodeLineStream, [{
    key: "_transform",
    value: function _transform(chunk, encoding, next) {
      var _this2 = this;

      // decode binary chunks as UTF-8
      encoding = encoding || 'utf8';

      if (Buffer.isBuffer(chunk)) {
        if (encoding === 'buffer') {
          encoding = 'utf8';
        }

        chunk = chunk.toString(encoding);
      }

      this.lineBuffer += chunk;

      if (!containsLineEnd(chunk)) {
        next();
        return;
      }

      var lines = this.lineBuffer.match(this.re);

      if (!lines || lines.length === 0) {
        next();
        return;
      } // Do not split CRLF which spans chunks


      if (this.state.lastChunkEndedWithCR && lines[0] === '\n') {
        lines.shift();
      }

      this.state.lastChunkEndedWithCR = this.lineBuffer[this.lineBuffer.length - 1] === '\r';

      if (this.lineBuffer[this.lineBuffer.length - 1] === '\r' || this.lineBuffer[this.lineBuffer.length - 1] === '\n') {
        this.lineBuffer = '';
      } else {
        var line = lines.pop() || '';
        this.lineBuffer = line;
      }

      iterateArray(lines, {
        batchSize: this.options.batchSize
      }, function (line, key) {
        line = line.trim();

        if (line.length > 0) {
          var result = parseLine(line, {
            flatten: _this2.options.flatten,
            noParseLine: _this2.options.noParseLine
          });

          _this2.push(result);
        }
      }, next);
    }
  }, {
    key: "_flush",
    value: function _flush(done) {
      if (this.lineBuffer) {
        var line = this.lineBuffer.trim();

        if (line.length > 0) {
          var result = parseLine(line, {
            flatten: this.options.flatten,
            noParseLine: this.options.noParseLine
          });
          this.push(result);
        }

        this.lineBuffer = '';
        this.state.lastChunkEndedWithCR = false;
      }

      done();
    }
  }]);

  return GCodeLineStream;
}(_stream.Transform);

exports.GCodeLineStream = GCodeLineStream;

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/readable-stream/errors-browser.js":
/*!********************************************************!*\
  !*** ./node_modules/readable-stream/errors-browser.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;


/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_duplex.js":
/*!************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_duplex.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

module.exports = Duplex;
var Readable = __webpack_require__(/*! ./_stream_readable */ "./node_modules/readable-stream/lib/_stream_readable.js");
var Writable = __webpack_require__(/*! ./_stream_writable */ "./node_modules/readable-stream/lib/_stream_writable.js");
__webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js")(Duplex, Readable);
{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}
function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;
  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;
    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}
Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

// the no-half-open enforcer
function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(onEndNT, this);
}
function onEndNT(self) {
  self.end();
}
Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_passthrough.js":
/*!*****************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_passthrough.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;
var Transform = __webpack_require__(/*! ./_stream_transform */ "./node_modules/readable-stream/lib/_stream_transform.js");
__webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js")(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}
PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_readable.js":
/*!**************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_readable.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



module.exports = Readable;

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = (__webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter);
var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(/*! ./internal/streams/stream */ "./node_modules/readable-stream/lib/internal/streams/stream-browser.js");
/*</replacement>*/

var Buffer = (__webpack_require__(/*! buffer */ "./node_modules/buffer/index.js").Buffer);
var OurUint8Array = (typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*<replacement>*/
var debugUtil = __webpack_require__(/*! util */ "?d17e");
var debug;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/

var BufferList = __webpack_require__(/*! ./internal/streams/buffer_list */ "./node_modules/readable-stream/lib/internal/streams/buffer_list.js");
var destroyImpl = __webpack_require__(/*! ./internal/streams/destroy */ "./node_modules/readable-stream/lib/internal/streams/destroy.js");
var _require = __webpack_require__(/*! ./internal/streams/state */ "./node_modules/readable-stream/lib/internal/streams/state.js"),
  getHighWaterMark = _require.getHighWaterMark;
var _require$codes = (__webpack_require__(/*! ../errors */ "./node_modules/readable-stream/errors-browser.js").codes),
  ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
  ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;

// Lazy loaded to improve the startup performance.
var StringDecoder;
var createReadableStreamAsyncIterator;
var from;
__webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js")(Readable, Stream);
var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];
function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}
function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");
  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true;

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = options.emitClose !== false;

  // Should .destroy() be called after 'end' (and potentially 'finish')
  this.autoDestroy = !!options.autoDestroy;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = (__webpack_require__(/*! string_decoder/ */ "./node_modules/string_decoder/lib/string_decoder.js").StringDecoder);
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {
  Duplex = Duplex || __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");
  if (!(this instanceof Readable)) return new Readable(options);

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex);

  // legacy
  this.readable = true;
  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }
  Stream.call(this);
}
Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;
  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }
  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};
function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  }

  // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.
  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}
function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}
function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }
  return er;
}
Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = (__webpack_require__(/*! string_decoder/ */ "./node_modules/string_decoder/lib/string_decoder.js").StringDecoder);
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder;
  // If setEncoding(null), decoder.encoding equals utf8
  this._readableState.encoding = this._readableState.decoder.encoding;

  // Iterate over current buffer to convert already stored Buffers:
  var p = this._readableState.buffer.head;
  var content = '';
  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }
  this._readableState.buffer.clear();
  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
};

// Don't raise the hwm > 1GB
var MAX_HWM = 0x40000000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }
  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }
  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;
  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }
  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }
  if (ret !== null) this.emit('data', ret);
  return ret;
};
function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;
  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;
    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}
function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);
  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  }

  // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.
  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}
function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};
Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;
  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }
  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);
    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);
  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }
  return dest;
};
function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}
Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    for (var i = 0; i < len; i++) dests[i].emit('unpipe', this, {
      hasUnpiped: false
    });
    return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;
  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0;

    // Try start flowing on next tick if stream isn't explicitly paused
    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);
      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }
  return res;
};
Readable.prototype.addListener = Readable.prototype.on;
Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);
  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }
  return res;
};
Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);
  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }
  return res;
};
function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;
  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true;

    // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}
function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()
    state.flowing = !state.readableListening;
    resume(this, state);
  }
  state.paused = false;
  return this;
};
function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}
function resume_(stream, state) {
  debug('resume', state.reading);
  if (!state.reading) {
    stream.read(0);
  }
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}
Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  this._readableState.paused = true;
  return this;
};
function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null);
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;
  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }
    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;
    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };
  return this;
};
if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = __webpack_require__(/*! ./internal/streams/async_iterator */ "./node_modules/readable-stream/lib/internal/streams/async_iterator.js");
    }
    return createReadableStreamAsyncIterator(this);
  };
}
Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
});

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}
function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);
  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}
function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length);

  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;
      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}
if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = __webpack_require__(/*! ./internal/streams/from */ "./node_modules/readable-stream/lib/internal/streams/from-browser.js");
    }
    return from(Readable, iterable, opts);
  };
}
function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_transform.js":
/*!***************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_transform.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;
var _require$codes = (__webpack_require__(/*! ../errors */ "./node_modules/readable-stream/errors-browser.js").codes),
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
  ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
  ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
var Duplex = __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");
__webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js")(Transform, Duplex);
function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;
  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }
  ts.writechunk = null;
  ts.writecb = null;
  if (data != null)
    // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;
  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}
function prefinish() {
  var _this = this;
  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}
Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};
Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;
  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};
Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};
function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null)
    // single equals check for both `null` and `undefined`
    stream.push(data);

  // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_writable.js":
/*!**************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_writable.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;
  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(/*! util-deprecate */ "./node_modules/util-deprecate/browser.js")
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(/*! ./internal/streams/stream */ "./node_modules/readable-stream/lib/internal/streams/stream-browser.js");
/*</replacement>*/

var Buffer = (__webpack_require__(/*! buffer */ "./node_modules/buffer/index.js").Buffer);
var OurUint8Array = (typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
var destroyImpl = __webpack_require__(/*! ./internal/streams/destroy */ "./node_modules/readable-stream/lib/internal/streams/destroy.js");
var _require = __webpack_require__(/*! ./internal/streams/state */ "./node_modules/readable-stream/lib/internal/streams/state.js"),
  getHighWaterMark = _require.getHighWaterMark;
var _require$codes = (__webpack_require__(/*! ../errors */ "./node_modules/readable-stream/errors-browser.js").codes),
  ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
  ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
  ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
  ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
  ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
  ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
  ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
  ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
var errorOrDestroy = destroyImpl.errorOrDestroy;
__webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js")(Writable, Stream);
function nop() {}
function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");
  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // Should close be emitted on destroy. Defaults to true.
  this.emitClose = options.emitClose !== false;

  // Should .destroy() be called after 'finish' (and potentially 'end')
  this.autoDestroy = !!options.autoDestroy;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}
WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};
(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}
function Writable(options) {
  Duplex = Duplex || __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.

  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex);

  // legacy.
  this.writable = true;
  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }
  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};
function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END();
  // TODO: defer error events consistently everywhere, not just the cb
  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var er;
  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }
  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }
  return true;
}
Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);
  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};
Writable.prototype.cork = function () {
  this._writableState.corked++;
};
Writable.prototype.uncork = function () {
  var state = this._writableState;
  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};
Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};
Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}
Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;
  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }
  return ret;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}
function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}
function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}
function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;
    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }
    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}
function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;
  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }
    if (entry === null) state.lastBufferedRequest = null;
  }
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}
Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};
Writable.prototype._writev = null;
Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;
  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending) endWritable(this, state, cb);
  return this;
};
Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});
function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      errorOrDestroy(stream, err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}
function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;
        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }
  return need;
}
function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}
function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }

  // reuse the free corkReq.
  state.corkedRequestsFree.next = corkReq;
}
Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  cb(err);
};

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/async_iterator.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/async_iterator.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _Object$setPrototypeO;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var finished = __webpack_require__(/*! ./end-of-stream */ "./node_modules/readable-stream/lib/internal/streams/end-of-stream.js");
var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');
function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}
function readAndResolve(iter) {
  var resolve = iter[kLastResolve];
  if (resolve !== null) {
    var data = iter[kStream].read();
    // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'
    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}
function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}
function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }
      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}
var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },
  next: function next() {
    var _this = this;
    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];
    if (error !== null) {
      return Promise.reject(error);
    }
    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }
    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    }

    // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time
    var lastPromise = this[kLastPromise];
    var promise;
    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();
      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }
      promise = new Promise(this[kHandlePromise]);
    }
    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;
  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);
var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;
  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();
      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject];
      // reject if we are waiting for data in the Promise
      // returned by next() and store the error
      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }
      iterator[kError] = err;
      return;
    }
    var resolve = iterator[kLastResolve];
    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }
    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};
module.exports = createReadableStreamAsyncIterator;

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/buffer_list.js":
/*!**************************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/buffer_list.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var _require = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js"),
  Buffer = _require.Buffer;
var _require2 = __webpack_require__(/*! util */ "?ed1b"),
  inspect = _require2.inspect;
var custom = inspect && inspect.custom || 'inspect';
function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}
module.exports = /*#__PURE__*/function () {
  function BufferList() {
    _classCallCheck(this, BufferList);
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;
      while (p = p.next) ret += s + p.data;
      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    }

    // Consumes a specified amount of bytes or characters from the buffered data.
  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;
      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }
      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    }

    // Consumes a specified amount of characters from the buffered data.
  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      this.length -= c;
      return ret;
    }

    // Consumes a specified amount of bytes from the buffered data.
  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      this.length -= c;
      return ret;
    }

    // Make sure the linked list only shows the minimal necessary information.
  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);
  return BufferList;
}();

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/destroy.js":
/*!**********************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/destroy.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;
  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;
  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }
  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });
  return this;
}
function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}
function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}
function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }
  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}
function emitErrorNT(self, err) {
  self.emit('error', err);
}
function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.

  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}
module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/end-of-stream.js":
/*!****************************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/end-of-stream.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).



var ERR_STREAM_PREMATURE_CLOSE = (__webpack_require__(/*! ../../../errors */ "./node_modules/readable-stream/errors-browser.js").codes).ERR_STREAM_PREMATURE_CLOSE;
function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    callback.apply(this, args);
  };
}
function noop() {}
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}
function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;
  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };
  var writableEnded = stream._writableState && stream._writableState.finished;
  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };
  var readableEnded = stream._readableState && stream._readableState.endEmitted;
  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };
  var onerror = function onerror(err) {
    callback.call(stream, err);
  };
  var onclose = function onclose() {
    var err;
    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };
  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };
  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }
  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}
module.exports = eos;

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/from-browser.js":
/*!***************************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/from-browser.js ***!
  \***************************************************************************/
/***/ ((module) => {

module.exports = function () {
  throw new Error('Readable.from is not available in the browser')
};


/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/pipeline.js":
/*!***********************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/pipeline.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).



var eos;
function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}
var _require$codes = (__webpack_require__(/*! ../../../errors */ "./node_modules/readable-stream/errors-browser.js").codes),
  ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
  ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}
function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = __webpack_require__(/*! ./end-of-stream */ "./node_modules/readable-stream/lib/internal/streams/end-of-stream.js");
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true;

    // request.destroy just do .end - .abort is what we want
    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}
function call(fn) {
  fn();
}
function pipe(from, to) {
  return from.pipe(to);
}
function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}
function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }
  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];
  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }
  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}
module.exports = pipeline;

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/state.js":
/*!********************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/state.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ERR_INVALID_OPT_VALUE = (__webpack_require__(/*! ../../../errors */ "./node_modules/readable-stream/errors-browser.js").codes).ERR_INVALID_OPT_VALUE;
function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}
function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }
    return Math.floor(hwm);
  }

  // Default value
  return state.objectMode ? 16 : 16 * 1024;
}
module.exports = {
  getHighWaterMark: getHighWaterMark
};

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/stream-browser.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/stream-browser.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter;


/***/ }),

/***/ "./node_modules/safe-buffer/index.js":
/*!*******************************************!*\
  !*** ./node_modules/safe-buffer/index.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof __webpack_require__.g === "undefined" ? this : __webpack_require__.g : self));


/***/ }),

/***/ "./node_modules/stream-browserify/index.js":
/*!*************************************************!*\
  !*** ./node_modules/stream-browserify/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = (__webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter);
var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");

inherits(Stream, EE);
Stream.Readable = __webpack_require__(/*! readable-stream/lib/_stream_readable.js */ "./node_modules/readable-stream/lib/_stream_readable.js");
Stream.Writable = __webpack_require__(/*! readable-stream/lib/_stream_writable.js */ "./node_modules/readable-stream/lib/_stream_writable.js");
Stream.Duplex = __webpack_require__(/*! readable-stream/lib/_stream_duplex.js */ "./node_modules/readable-stream/lib/_stream_duplex.js");
Stream.Transform = __webpack_require__(/*! readable-stream/lib/_stream_transform.js */ "./node_modules/readable-stream/lib/_stream_transform.js");
Stream.PassThrough = __webpack_require__(/*! readable-stream/lib/_stream_passthrough.js */ "./node_modules/readable-stream/lib/_stream_passthrough.js");
Stream.finished = __webpack_require__(/*! readable-stream/lib/internal/streams/end-of-stream.js */ "./node_modules/readable-stream/lib/internal/streams/end-of-stream.js")
Stream.pipeline = __webpack_require__(/*! readable-stream/lib/internal/streams/pipeline.js */ "./node_modules/readable-stream/lib/internal/streams/pipeline.js")

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),

/***/ "./node_modules/string_decoder/lib/string_decoder.js":
/*!***********************************************************!*\
  !*** ./node_modules/string_decoder/lib/string_decoder.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var Buffer = (__webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer);
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var scope = (typeof __webpack_require__.g !== "undefined" && __webpack_require__.g) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof __webpack_require__.g !== "undefined" && __webpack_require__.g.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof __webpack_require__.g !== "undefined" && __webpack_require__.g.clearImmediate) ||
                         (this && this.clearImmediate);


/***/ }),

/***/ "./node_modules/util-deprecate/browser.js":
/*!************************************************!*\
  !*** ./node_modules/util-deprecate/browser.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!__webpack_require__.g.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = __webpack_require__.g.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}


/***/ }),

/***/ "./src/examples.js":
/*!*************************!*\
  !*** ./src/examples.js ***!
  \*************************/
/***/ (() => {


const STAR = `; Unintentionally upside-down star.
G21
G90;svg#svg1 > g#layer1 > path#path9
G0 X97.288441 Y271.867151
G1 X70.804368 Y192.14469 F300
G1 X139.44676 Y241.329396 F300
G1 X54.859873 Y241.329396 F300
G1 X124.04275999999999 Y192.14469 F300
G1 X97.288441 Y271.867151 F300
M2
`

const CIRCLES = `; Circle pattern
G21
G90;svg#svg1 > g#layer1 > path#path1
G0 X36.581744 Y277.670564
G1 X36.183207245642215 Y274.3942897050995 F300
G1 X35.010842212419234 Y271.3091049409604 F300
G1 X33.133027367924534 Y268.59495383798264 F300
G1 X30.65928670669237 Y266.41013990060344 F300
G1 X27.733901737335884 Y264.88209291799353 F300
G1 X24.527496229463516 Y264.0999365914924 F300
G1 X22.915739000000002 Y264.004559 F300
G1 X19.639464635109192 Y264.40309517898424 F300
G1 X16.55427966508144 Y265.5754596703925 F300
G1 X13.840128232325187 Y267.4532740382327 F300
G1 X11.655313860512006 Y269.92701431577166 F300
G1 X10.127266364151174 Y272.85239901677517 F300
G1 X9.345109474546748 Y276.05880438728656 F300
G1 X9.2497316 Y277.670564 F300
G1 X9.648268522175075 Y280.94683827448665 F300
G1 X10.820633713427362 Y284.0320229785749 F300
G1 X12.698448696946267 Y286.7461739853672 F300
G1 X15.17218947008896 Y288.9309877960365 F300
G1 X18.09757451771505 Y290.4590346288024 F300
G1 X21.303980065650993 Y291.24119079106504 F300
G1 X22.91573899999999 Y291.33656829999995 F300
G1 X26.192013294900512 Y290.9380315456422 F300
G1 X29.277198059039627 Y289.7656665124192 F300
G1 X31.99134916201739 Y287.88785166792456 F300
G1 X34.17616309939663 Y285.4141110066924 F300
G1 X35.70421008200652 Y282.48872603733594 F300
G1 X36.48636640850767 Y279.28232052946356 F300
G1 X36.581744 Y277.670564 F300;svg#svg1 > g#layer1 > path#circle1
G0 X60.192922 Y277.670564
G1 X59.79438524564222 Y274.39428970509954 F300
G1 X58.62202021241924 Y271.3091049409604 F300
G1 X56.744205367924536 Y268.59495383798264 F300
G1 X54.27046470669237 Y266.41013990060344 F300
G1 X51.34507973733589 Y264.88209291799353 F300
G1 X48.13867422946352 Y264.0999365914924 F300
G1 X46.526917 Y264.004559 F300
G1 X43.25064261761166 Y264.40309503514084 F300
G1 X40.16545759611176 Y265.57545939109536 F300
G1 X37.4513060809109 Y267.45327363977196 F300
G1 X35.26649160048922 Y269.9270138213876 F300
G1 X33.73844397569066 Y272.8523984553029 F300
G1 X32.9562869453104 Y276.058803791474 F300
G1 X32.86090899999999 Y277.670564 F300
G1 X33.259445922175054 Y280.9468382744867 F300
G1 X34.43181111342732 Y284.03202297857496 F300
G1 X36.30962609694622 Y286.74617398536725 F300
G1 X38.7833668700889 Y288.9309877960366 F300
G1 X41.708751917714956 Y290.45903462880244 F300
G1 X44.915157465650914 Y291.24119079106515 F300
G1 X46.52691699999998 Y291.3365683 F300
G1 X49.803191294900515 Y290.9380315456422 F300
G1 X52.888376059039636 Y289.7656665124192 F300
G1 X55.602527162017395 Y287.88785166792456 F300
G1 X57.787341099396635 Y285.4141110066924 F300
G1 X59.31538808200652 Y282.48872603733594 F300
G1 X60.09754440850768 Y279.28232052946356 F300
G1 X60.19292200000001 Y277.670564 F300;svg#svg1 > g#layer1 > path#circle2
G0 X83.80409 Y277.670564
G1 X83.40555324564224 Y274.39428970509954 F300
G1 X82.23318821241928 Y271.30910494096037 F300
G1 X80.35537336792461 Y268.59495383798264 F300
G1 X77.88163270669246 Y266.4101399006034 F300
G1 X74.95624773733599 Y264.8820929179935 F300
G1 X71.74984222946362 Y264.0999365914923 F300
G1 X70.138082 Y264.004559 F300
G1 X66.8618077050995 Y264.40309575435776 F300
G1 X63.77662294096041 Y265.57546078758077 F300
G1 X61.06247183798265 Y267.4532756320755 F300
G1 X58.87765790060341 Y269.92701629330764 F300
G1 X57.34961091799353 Y272.8524012626641 F300
G1 X56.56745459149239 Y276.0588067705365 F300
G1 X56.472077 Y277.670564 F300
G1 X56.87061392217508 Y280.9468382744867 F300
G1 X58.04297911342737 Y284.0320229785749 F300
G1 X59.920794096946295 Y286.74617398536725 F300
G1 X62.394534870088975 Y288.93098779603656 F300
G1 X65.31991991771504 Y290.4590346288024 F300
G1 X68.52632546565098 Y291.24119079106504 F300
G1 X70.138082 Y291.3365683 F300
G1 X73.41435638238833 Y290.93803226485915 F300
G1 X76.49954140388824 Y289.7656679089046 F300
G1 X79.21369291908913 Y287.8878536602281 F300
G1 X81.3985073995108 Y285.4141134786124 F300
G1 X82.92655502430938 Y282.48872884469716 F300
G1 X83.70871205468966 Y279.2823235085261 F300
G1 X83.80409 Y277.670564 F300;svg#svg1 > g#layer1 > path#circle3
G0 X107.41525 Y277.670564
G1 X107.01671324564263 Y274.3942897050995 F300
G1 X105.84434821242004 Y271.3091049409602 F300
G1 X103.96653336792569 Y268.5949538379822 F300
G1 X101.4927927066938 Y266.41013990060264 F300
G1 X98.56740773733752 Y264.8820929179924 F300
G1 X95.36100222946526 Y264.0999365914908 F300
G1 X93.749251 Y264.004559 F300
G1 X90.47297661761166 Y264.40309503514084 F300
G1 X87.38779159611177 Y265.57545939109536 F300
G1 X84.67364008091091 Y267.45327363977196 F300
G1 X82.48882560048922 Y269.9270138213876 F300
G1 X80.96077797569066 Y272.8523984553029 F300
G1 X80.1786209453104 Y276.058803791474 F300
G1 X80.083243 Y277.670564 F300
G1 X80.48177992217505 Y280.9468382744867 F300
G1 X81.65414511342732 Y284.0320229785749 F300
G1 X83.53196009694622 Y286.74617398536725 F300
G1 X86.0057008700889 Y288.9309877960366 F300
G1 X88.93108591771495 Y290.45903462880244 F300
G1 X92.13749146565092 Y291.24119079106515 F300
G1 X93.749251 Y291.3365683 F300
G1 X97.02552511992438 Y290.9380301072084 F300
G1 X100.11070936934145 Y289.7656637194487 F300
G1 X102.82485964787259 Y287.88784768331806 F300
G1 X105.00967249916663 Y285.41410606285314 F300
G1 X106.53771819739895 Y282.4887204226146 F300
G1 X107.31987311614175 Y279.2823145713403 F300
G1 X107.41525 Y277.670564 F300;svg#svg1 > g#layer1 > path#circle4
G0 X131.02641 Y277.670564
G1 X130.6278732456425 Y274.3942897050995 F300
G1 X129.4555082124198 Y271.30910494096025 F300
G1 X127.57769336792533 Y268.5949538379823 F300
G1 X125.10395270669338 Y266.41013990060287 F300
G1 X122.17856773733702 Y264.8820929179927 F300
G1 X118.97216222946474 Y264.09993659149126 F300
G1 X117.36041 Y264.00455900000003 F300
G1 X114.08413585091287 Y264.4030969530527 F300
G1 X110.99895151570874 Y265.5754631150563 F300
G1 X108.28480109976982 Y267.453278952581 F300
G1 X106.09998806746155 Y269.92702041317386 F300
G1 X104.57194215516633 Y272.85240594159876 F300
G1 X103.78978700179715 Y276.0588117356395 F300
G1 X103.69441 Y277.670564 F300
G1 X104.09294692217479 Y280.9468382744867 F300
G1 X105.26531211342679 Y284.032022978575 F300
G1 X107.14312709694546 Y286.74617398536753 F300
G1 X109.61686787008796 Y288.9309877960371 F300
G1 X112.54225291771392 Y290.4590346288032 F300
G1 X115.74865846564983 Y291.2411907910662 F300
G1 X117.36041 Y291.33656829999995 F300
G1 X120.63668414908715 Y290.9380303469473 F300
G1 X123.72186848429128 Y289.7656641849437 F300
G1 X126.43601890023018 Y287.88784834741904 F300
G1 X128.62083193253847 Y285.41410688682623 F300
G1 X130.14887784483372 Y282.48872135840134 F300
G1 X130.9310329982029 Y279.2823155643606 F300
G1 X131.02641 Y277.67056399999996 F300;svg#svg1 > g#layer1 > path#circle5
G0 X154.6376 Y277.670564
G1 X154.2390632456425 Y274.3942897050994 F300
G1 X153.06669821241982 Y271.3091049409602 F300
G1 X151.18888336792537 Y268.5949538379823 F300
G1 X148.7151427066934 Y266.4101399006028 F300
G1 X145.78975773733706 Y264.8820929179927 F300
G1 X142.58335222946477 Y264.0999365914912 F300
G1 X140.9716 Y264.004559 F300
G1 X137.69532555928652 Y264.40309455566285 F300
G1 X134.61014036621287 Y265.5754584601051 F300
G1 X131.89598857619666 Y267.45327231156955 F300
G1 X129.71117373374673 Y269.92701217344074 F300
G1 X128.18312568082243 Y272.8523965837284 F300
G1 X127.40096818118947 Y276.058801805432 F300
G1 X127.30559000000001 Y277.670564 F300
G1 X127.70412692217495 Y280.94683827448665 F300
G1 X128.87649211342713 Y284.03202297857496 F300
G1 X130.75430709694595 Y286.74617398536736 F300
G1 X133.22804787008855 Y288.9309877960368 F300
G1 X136.15343291771455 Y290.4590346288027 F300
G1 X139.35983846565048 Y291.2411907910655 F300
G1 X140.9716 Y291.33656829999995 F300
G1 X144.24787414908712 Y290.9380303469473 F300
G1 X147.33305848429126 Y289.7656641849437 F300
G1 X150.0472089002302 Y287.88784834741904 F300
G1 X152.23202193253846 Y285.41410688682623 F300
G1 X153.7600678448337 Y282.48872135840134 F300
G1 X154.5422229982029 Y279.2823155643606 F300
G1 X154.6376 Y277.67056399999996 F300;svg#svg1 > g#layer1 > path#circle6
G0 X178.24881 Y277.670564
G1 X177.85027324564393 Y274.39428970509925 F300
G1 X176.67790821242255 Y271.30910494095957 F300
G1 X174.80009336792926 Y268.5949538379808 F300
G1 X172.32635270669823 Y266.41013990060026 F300
G1 X169.40096773734257 Y264.88209291798887 F300
G1 X166.19456222947062 Y264.0999365914861 F300
G1 X164.58279 Y264.004559 F300
G1 X161.306516142541 Y264.4030993504422 F300
G1 X158.22133266520808 Y265.5754677700066 F300
G1 X155.5071836233479 Y267.45328559359046 F300
G1 X153.3223724011825 Y269.9270286529036 F300
G1 X151.7943286295171 Y272.8524152994641 F300
G1 X151.01217582241213 Y276.0588216658403 F300
G1 X150.91680000000002 Y277.67056400000007 F300
G1 X151.31533692217283 Y280.94683827448694 F300
G1 X152.487702113423 Y284.032022978576 F300
G1 X154.36551709694007 Y286.7461739853696 F300
G1 X156.83925787008127 Y288.93098779604054 F300
G1 X159.7646429177063 Y290.4590346288084 F300
G1 X162.97104846564173 Y291.2411907910733 F300
G1 X164.58279 Y291.3365683 F300
G1 X167.85906473233808 Y290.9380351417271 F300
G1 X170.94425078327964 Y289.7656734948469 F300
G1 X173.65840394737168 Y287.8878616294437 F300
G1 X175.84322059996208 Y285.4141233662955 F300
G1 X177.37127079351464 Y282.4887400741466 F300
G1 X178.15343063941103 Y279.28233542478193 F300
G1 X178.24881 Y277.67056399999996 F300;svg#svg1 > g#layer1 > path#circle7
G0 X201.86 Y277.670564
G1 X201.46146324564447 Y274.39428970509925 F300
G1 X200.2890982124236 Y271.30910494095934 F300
G1 X198.41128336793074 Y268.59495383798026 F300
G1 X195.93754270670007 Y266.41013990059935 F300
G1 X193.01215773734464 Y264.8820929179875 F300
G1 X189.8057522294728 Y264.09993659148415 F300
G1 X188.19401 Y264.004559 F300
G1 X184.91773555928648 Y264.40309455566285 F300
G1 X181.83255036621284 Y265.5754584601051 F300
G1 X179.11839857619663 Y267.45327231156955 F300
G1 X176.9335837337467 Y269.92701217344074 F300
G1 X175.4055356808224 Y272.8523965837284 F300
G1 X174.62337818118942 Y276.058801805432 F300
G1 X174.528 Y277.670564 F300
G1 X174.9265369221749 Y280.94683827448665 F300
G1 X176.09890211342707 Y284.0320229785749 F300
G1 X177.9767170969459 Y286.7461739853673 F300
G1 X180.4504578700885 Y288.93098779603673 F300
G1 X183.37584291771452 Y290.4590346288027 F300
G1 X186.58224846565045 Y291.2411907910655 F300
G1 X188.19400999999996 Y291.33656829999995 F300
G1 X191.47028385745898 Y290.9380279495578 F300
G1 X194.55546733479193 Y289.76565952999346 F300
G1 X197.26961637665212 Y287.8878417064095 F300
G1 X199.4544275988176 Y285.4140986470964 F300
G1 X200.98247137048295 Y282.4887120005359 F300
G1 X201.76462417758796 Y279.28230563415974 F300
G1 X201.86 Y277.670564 F300;svg#svg1 > g#layer1 > path#circle8
G0 X36.581744 Y254.059382
G1 X36.18320772512016 Y250.78310764677425 F300
G1 X35.01084314340946 Y247.69792271106127 F300
G1 X33.133028696126814 Y244.9837713332681 F300
G1 X30.65928835463897 Y242.79895703386055 F300
G1 X27.73390360890995 Y241.27090962312488 F300
G1 X24.52749821550504 Y240.488752827371 F300
G1 X22.915739000000002 Y240.39337500000002 F300
G1 X19.639464635109192 Y240.79191117898426 F300
G1 X16.55427966508144 Y241.9642756703925 F300
G1 X13.840128232325187 Y243.84209003823275 F300
G1 X11.655313860511992 Y246.3158303157717 F300
G1 X10.127266364151165 Y249.24121501677521 F300
G1 X9.345109474546744 Y252.44762038728663 F300
G1 X9.2497316 Y254.05938200000003 F300
G1 X9.64826835435779 Y257.3356562949005 F300
G1 X10.820633387580779 Y260.4208410590396 F300
G1 X12.698448232075483 Y263.1349921620174 F300
G1 X15.172188893307649 Y265.3198060993966 F300
G1 X18.097573862664134 Y266.8478530820065 F300
G1 X21.30397937053648 Y267.63000940850765 F300
G1 X22.915738999999995 Y267.725387 F300
G1 X26.19201329490051 Y267.3268502456422 F300
G1 X29.277198059039595 Y266.1544852124192 F300
G1 X31.99134916201735 Y264.2766703679245 F300
G1 X34.1761630993966 Y261.80292970669234 F300
G1 X35.70421008200647 Y258.8775447373359 F300
G1 X36.486366408507614 Y255.6711392294635 F300
G1 X36.581744 Y254.05938199999997 F300;svg#svg1 > g#layer1 > path#circle9
G0 X60.192922 Y254.059382
G1 X59.79438572512017 Y250.78310764677428 F300
G1 X58.62202114340947 Y247.6979227110613 F300
G1 X56.74420669612683 Y244.9837713332681 F300
G1 X54.27046635463902 Y242.79895703386057 F300
G1 X51.34508160891 Y241.27090962312488 F300
G1 X48.13867621550512 Y240.488752827371 F300
G1 X46.526917000000005 Y240.39337500000002 F300
G1 X43.25064261761166 Y240.79191103514086 F300
G1 X40.16545759611176 Y241.9642753910954 F300
G1 X37.45130608091089 Y243.842089639772 F300
G1 X35.2664916004892 Y246.31582982138764 F300
G1 X33.73844397569066 Y249.24121445530287 F300
G1 X32.9562869453104 Y252.447619791474 F300
G1 X32.86090899999999 Y254.059382 F300
G1 X33.259445754357756 Y257.3356562949005 F300
G1 X34.431810787580716 Y260.4208410590396 F300
G1 X36.30962563207538 Y263.13499216201734 F300
G1 X38.78336629330754 Y265.3198060993966 F300
G1 X41.70875126266401 Y266.8478530820065 F300
G1 X44.91515677053637 Y267.6300094085077 F300
G1 X46.52691699999999 Y267.725387 F300
G1 X49.80319129490051 Y267.3268502456422 F300
G1 X52.8883760590396 Y266.1544852124192 F300
G1 X55.60252716201735 Y264.2766703679245 F300
G1 X57.7873410993966 Y261.80292970669234 F300
G1 X59.31538808200648 Y258.8775447373359 F300
G1 X60.09754440850761 Y255.67113922946353 F300
G1 X60.19292200000001 Y254.05938199999997 F300;svg#svg1 > g#layer1 > path#circle10
G0 X83.80409 Y254.059382
G1 X83.40555372512019 Y250.78310764677425 F300
G1 X82.23318914340952 Y247.69792271106127 F300
G1 X80.35537469612692 Y244.9837713332681 F300
G1 X77.8816343546391 Y242.79895703386052 F300
G1 X74.95624960891011 Y241.27090962312482 F300
G1 X71.74984421550522 Y240.48875282737092 F300
G1 X70.138082 Y240.393375 F300
G1 X66.86180770509947 Y240.7919117543578 F300
G1 X63.776622940960365 Y241.96427678758081 F300
G1 X61.06247183798261 Y243.84209163207552 F300
G1 X58.87765790060338 Y246.31583229330772 F300
G1 X57.3496109179935 Y249.2412172626642 F300
G1 X56.567454591492385 Y252.44762277053655 F300
G1 X56.472077 Y254.05938200000003 F300
G1 X56.87061375435779 Y257.3356562949005 F300
G1 X58.04297878758077 Y260.42084105903956 F300
G1 X59.92079363207547 Y263.13499216201734 F300
G1 X62.394534293307636 Y265.31980609939654 F300
G1 X65.31991926266411 Y266.84785308200645 F300
G1 X68.52632477053649 Y267.6300094085076 F300
G1 X70.138082 Y267.725387 F300
G1 X73.41435638238833 Y267.32685096485915 F300
G1 X76.49954140388823 Y266.1544866089046 F300
G1 X79.21369291908908 Y264.276672360228 F300
G1 X81.39850739951078 Y261.80293217861237 F300
G1 X82.92655502430934 Y258.8775475446971 F300
G1 X83.70871205468958 Y255.671142208526 F300
G1 X83.80409 Y254.05938199999997 F300;svg#svg1 > g#layer1 > path#circle11
G0 X107.41525 Y254.059382
G1 X107.01671372512058 Y250.78310764677423 F300
G1 X105.84434914341028 Y247.69792271106107 F300
G1 X103.96653469612801 Y244.98377133326767 F300
G1 X101.49279435464048 Y242.7989570338598 F300
G1 X98.56740960891167 Y241.27090962312377 F300
G1 X95.36100421550688 Y240.48875282736947 F300
G1 X93.749251 Y240.393375 F300
G1 X90.47297661761166 Y240.79191103514086 F300
G1 X87.38779159611177 Y241.9642753910954 F300
G1 X84.6736400809109 Y243.84208963977198 F300
G1 X82.48882560048922 Y246.3158298213876 F300
G1 X80.96077797569066 Y249.24121445530284 F300
G1 X80.17862094531041 Y252.44761979147395 F300
G1 X80.083243 Y254.059382 F300
G1 X80.48177975435776 Y257.3356562949005 F300
G1 X81.65414478758072 Y260.4208410590396 F300
G1 X83.53195963207538 Y263.13499216201734 F300
G1 X86.00570029330754 Y265.3198060993966 F300
G1 X88.93108526266401 Y266.8478530820065 F300
G1 X92.13749077053637 Y267.6300094085077 F300
G1 X93.749251 Y267.725387 F300
G1 X97.02552511992438 Y267.32684880720836 F300
G1 X100.11070936934146 Y266.15448241944864 F300
G1 X102.82485964787259 Y264.276666383318 F300
G1 X105.00967249916661 Y261.8029247628531 F300
G1 X106.5377181973989 Y258.87753912261456 F300
G1 X107.31987311614168 Y255.6711332713402 F300
G1 X107.41525 Y254.059382 F300;svg#svg1 > g#layer1 > path#circle12
G0 X131.02641 Y254.059382
G1 X130.62787372512048 Y250.78310764677423 F300
G1 X129.45550914341007 Y247.69792271106115 F300
G1 X127.57769469612771 Y244.9837713332678 F300
G1 X125.10395435464011 Y242.79895703386006 F300
G1 X122.17856960891123 Y241.27090962312408 F300
G1 X118.97216421550641 Y240.4887528273699 F300
G1 X117.36041 Y240.39337500000002 F300
G1 X114.08413585091287 Y240.79191295305267 F300
G1 X110.99895151570874 Y241.96427911505629 F300
G1 X108.28480109976984 Y243.84209495258096 F300
G1 X106.09998806746158 Y246.3158364131738 F300
G1 X104.57194215516634 Y249.2412219415987 F300
G1 X103.78978700179715 Y252.44762773563943 F300
G1 X103.69441 Y254.059382 F300
G1 X104.09294675435748 Y257.3356562949005 F300
G1 X105.26531178758019 Y260.42084105903973 F300
G1 X107.14312663207464 Y263.1349921620177 F300
G1 X109.6168672933066 Y265.3198060993971 F300
G1 X112.54225226266294 Y266.8478530820073 F300
G1 X115.74865777053522 Y267.6300094085087 F300
G1 X117.36041 Y267.725387 F300
G1 X120.6366841490871 Y267.3268490469474 F300
G1 X123.72186848429122 Y266.1544828849438 F300
G1 X126.43601890023015 Y264.2766670474191 F300
G1 X128.6208319325384 Y261.8029255868263 F300
G1 X130.14887784483366 Y258.8775400584014 F300
G1 X130.93103299820285 Y255.67113426436066 F300
G1 X131.02641 Y254.05938200000006 F300
G1 X131.02641 Y254.059382 F300;svg#svg1 > g#layer1 > path#circle13
G0 X154.6376 Y254.059382
G1 X154.23906372512047 Y250.78310764677423 F300
G1 X153.06669914341006 Y247.69792271106112 F300
G1 X151.18888469612767 Y244.98377133326778 F300
G1 X148.71514435464005 Y242.79895703386 F300
G1 X145.78975960891117 Y241.27090962312406 F300
G1 X142.58335421550635 Y240.48875282736986 F300
G1 X140.9716 Y240.39337500000002 F300
G1 X137.69532555928652 Y240.7919105556629 F300
G1 X134.61014036621287 Y241.96427446010512 F300
G1 X131.89598857619666 Y243.8420883115696 F300
G1 X129.71117373374673 Y246.3158281734408 F300
G1 X128.18312568082243 Y249.24121258372847 F300
G1 X127.40096818118947 Y252.447617805432 F300
G1 X127.30559000000001 Y254.05938200000003 F300
G1 X127.70412675435767 Y257.3356562949005 F300
G1 X128.87649178758053 Y260.4208410590397 F300
G1 X130.75430663207513 Y263.13499216201745 F300
G1 X133.2280472933072 Y265.3198060993968 F300
G1 X136.1534322626636 Y266.8478530820068 F300
G1 X139.35983777053596 Y267.6300094085081 F300
G1 X140.9716 Y267.72538699999996 F300
G1 X144.24787414908712 Y267.3268490469474 F300
G1 X147.33305848429123 Y266.1544828849438 F300
G1 X150.04720890023015 Y264.2766670474191 F300
G1 X152.23202193253843 Y261.8029255868263 F300
G1 X153.76006784483366 Y258.8775400584014 F300
G1 X154.54222299820285 Y255.67113426436063 F300
G1 X154.6376 Y254.05938200000006 F300
G1 X154.6376 Y254.059382 F300;svg#svg1 > g#layer1 > path#circle14
G0 X178.24881 Y254.059382
G1 X177.85027372512187 Y250.78310764677403 F300
G1 X176.6779091434128 Y247.69792271106044 F300
G1 X174.80009469613157 Y244.9837713332663 F300
G1 X172.32635435464488 Y242.79895703385748 F300
G1 X169.40096960891665 Y241.27090962312025 F300
G1 X166.19456421551217 Y240.48875282736472 F300
G1 X164.58279 Y240.39337500000002 F300
G1 X161.30651614254097 Y240.79191535044222 F300
G1 X158.22133266520808 Y241.9642837700066 F300
G1 X155.5071836233479 Y243.8421015935905 F300
G1 X153.32237240118246 Y246.31584465290365 F300
G1 X151.79432862951708 Y249.2412312994642 F300
G1 X151.01217582241213 Y252.44763766584038 F300
G1 X150.91680000000002 Y254.05938200000003 F300
G1 X151.31533675435557 Y257.3356562949008 F300
G1 X152.48770178757644 Y260.42084105904064 F300
G1 X154.3655166320693 Y263.1349921620197 F300
G1 X156.83925729329997 Y265.31980609940064 F300
G1 X159.7646422626554 Y266.8478530820125 F300
G1 X162.97104777052724 Y267.63000940851583 F300
G1 X164.58279000000002 Y267.725387 F300
G1 X167.85906473233808 Y267.3268538417271 F300
G1 X170.94425078327964 Y266.1544921948469 F300
G1 X173.65840394737165 Y264.2766803294437 F300
G1 X175.84322059996205 Y261.8029420662955 F300
G1 X177.3712707935146 Y258.87755877414656 F300
G1 X178.15343063941097 Y255.6711541247819 F300
G1 X178.24881 Y254.05938199999997 F300;svg#svg1 > g#layer1 > path#circle15
G0 X201.86 Y254.059382
G1 X201.46146372512243 Y250.78310764677397 F300
G1 X200.28909914341384 Y247.69792271106022 F300
G1 X198.41128469613307 Y244.98377133326576 F300
G1 X195.93754435464675 Y242.79895703385654 F300
G1 X193.0121596089188 Y241.27090962311888 F300
G1 X189.80575421551444 Y240.4887528273628 F300
G1 X188.19401 Y240.39337500000002 F300
G1 X184.91773555928648 Y240.7919105556629 F300
G1 X181.83255036621284 Y241.96427446010512 F300
G1 X179.11839857619663 Y243.8420883115696 F300
G1 X176.9335837337467 Y246.3158281734408 F300
G1 X175.4055356808224 Y249.24121258372847 F300
G1 X174.62337818118942 Y252.447617805432 F300
G1 X174.528 Y254.05938200000003 F300
G1 X174.92653675435764 Y257.3356562949005 F300
G1 X176.09890178758053 Y260.4208410590397 F300
G1 X177.97671663207512 Y263.1349921620175 F300
G1 X180.4504572933072 Y265.3198060993968 F300
G1 X183.37584226266364 Y266.84785308200685 F300
G1 X186.582247770536 Y267.6300094085081 F300
G1 X188.19400999999996 Y267.72538699999996 F300
G1 X191.470283857459 Y267.3268466495578 F300
G1 X194.55546733479193 Y266.1544782299934 F300
G1 X197.2696163766521 Y264.2766604064095 F300
G1 X199.45442759881755 Y261.8029173470964 F300
G1 X200.98247137048293 Y258.8775307005359 F300
G1 X201.7646241775879 Y255.67112433415969 F300
G1 X201.86 Y254.05938199999997 F300;svg#svg1 > g#layer1 > path#circle16
G0 X36.581744 Y230.448214
G1 X36.18319118313555 Y227.17194165903547 F300
G1 X35.010811024265266 Y224.08676264265938 F300
G1 X33.132982873189576 Y221.37262074603206 F300
G1 X30.659231500552217 Y219.18781893662813 F300
G1 X27.733839039711576 Y217.65978629625138 F300
G1 X24.52742969721866 Y216.87764568972705 F300
G1 X22.915739000000002 Y216.78227600000002 F300
G1 X19.639464635104254 Y217.1808121789437 F300
G1 X16.554279665062015 Y218.35317667031376 F300
G1 X13.840128232282536 Y220.23099103812038 F300
G1 X11.655313860438728 Y222.70473131563227 F300
G1 X10.127266364041688 Y225.63011601661685 F300
G1 X9.34510947439756 Y228.83652138711858 F300
G1 X9.249731599999999 Y230.44821400000004 F300
G1 X9.648267635140856 Y233.72448838238836 F300
G1 X10.820631991095404 Y236.80967340388827 F300
G1 X12.698446239771998 Y239.52382491908912 F300
G1 X15.172186421387643 Y241.70863939951082 F300
G1 X18.097571055302907 Y243.2366870243094 F300
G1 X21.303976391474038 Y244.01884405468962 F300
G1 X22.915739 Y244.11422199999998 F300
G1 X26.192013294900534 Y243.71568524564222 F300
G1 X29.27719805903965 Y242.54332021241925 F300
G1 X31.991349162017414 Y240.66550536792457 F300
G1 X34.17616309939665 Y238.1917647066924 F300
G1 X35.704210082006554 Y235.2663797373359 F300
G1 X36.48636640850771 Y232.05997422946356 F300
G1 X36.581744 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle17
G0 X60.192922 Y230.448214
G1 X59.79436918313555 Y227.17194165903547 F300
G1 X58.62198902426526 Y224.08676264265938 F300
G1 X56.74416087318957 Y221.37262074603206 F300
G1 X54.27040950055222 Y219.18781893662813 F300
G1 X51.34501703971157 Y217.65978629625138 F300
G1 X48.13860769721866 Y216.87764568972705 F300
G1 X46.526917 Y216.78227600000002 F300
G1 X43.2506426176067 Y217.18081203510033 F300
G1 X40.165457596092295 Y218.3531763910167 F300
G1 X37.451306080868186 Y220.2309906396597 F300
G1 X35.26649160041589 Y222.7047308212483 F300
G1 X33.73844397558113 Y225.63011545514465 F300
G1 X32.9562869451612 Y228.8365207913061 F300
G1 X32.86090899999999 Y230.448214 F300
G1 X33.25944503514083 Y233.72448838238836 F300
G1 X34.43180939109536 Y236.80967340388827 F300
G1 X36.30962363977193 Y239.52382491908912 F300
G1 X38.78336382138755 Y241.70863939951082 F300
G1 X41.70874845530281 Y243.2366870243094 F300
G1 X44.915153791473955 Y244.01884405468968 F300
G1 X46.526917 Y244.11422199999998 F300
G1 X49.80319129490054 Y243.71568524564222 F300
G1 X52.88837605903966 Y242.54332021241925 F300
G1 X55.602527162017424 Y240.66550536792457 F300
G1 X57.78734109939666 Y238.1917647066924 F300
G1 X59.315388082006564 Y235.2663797373359 F300
G1 X60.09754440850772 Y232.05997422946356 F300
G1 X60.19292200000001 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle18
G0 X83.80409 Y230.448214
G1 X83.40553718313558 Y227.17194165903544 F300
G1 X82.23315702426532 Y224.08676264265935 F300
G1 X80.35532887318966 Y221.37262074603206 F300
G1 X77.88157750055231 Y219.18781893662808 F300
G1 X74.95618503971168 Y217.6597862962513 F300
G1 X71.74977569721878 Y216.87764568972696 F300
G1 X70.138082 Y216.78227600000002 F300
G1 X66.86180770509452 Y217.18081275431726 F300
G1 X63.77662294094093 Y218.35317778750206 F300
G1 X61.06247183793995 Y220.23099263196318 F300
G1 X58.877657900530096 Y222.70473329316832 F300
G1 X57.34961091788401 Y225.63011826250587 F300
G1 X56.567454591343186 Y228.8365237703686 F300
G1 X56.47207699999999 Y230.448214 F300
G1 X56.87061303514086 Y233.7244883823884 F300
G1 X58.042977391095405 Y236.80967340388824 F300
G1 X59.920791639772006 Y239.52382491908912 F300
G1 X62.39453182138763 Y241.7086393995108 F300
G1 X65.31991645530287 Y243.23668702430933 F300
G1 X68.52632179147402 Y244.0188440546896 F300
G1 X70.13808200000001 Y244.11422199999998 F300
G1 X73.41435638238833 Y243.71568596485915 F300
G1 X76.49954140388822 Y242.54332160890465 F300
G1 X79.2136929190891 Y240.66550736022808 F300
G1 X81.3985073995108 Y238.19176717861248 F300
G1 X82.9265550243094 Y235.26638254469725 F300
G1 X83.70871205468968 Y232.05997720852613 F300
G1 X83.80409 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle19
G0 X107.41525 Y230.448214
G1 X107.01669718313597 Y227.1719416590354 F300
G1 X105.84431702426608 Y224.08676264265915 F300
G1 X103.96648887319074 Y221.3726207460316 F300
G1 X101.49273750055367 Y219.18781893662737 F300
G1 X98.56734503971322 Y217.65978629625022 F300
G1 X95.36093569722044 Y216.8776456897255 F300
G1 X93.749251 Y216.78227600000002 F300
G1 X90.4729766176067 Y217.18081203510033 F300
G1 X87.3877915960923 Y218.3531763910167 F300
G1 X84.67364008086818 Y220.2309906396597 F300
G1 X82.4888256004159 Y222.7047308212483 F300
G1 X80.96077797558112 Y225.63011545514465 F300
G1 X80.1786209451612 Y228.8365207913061 F300
G1 X80.083243 Y230.448214 F300
G1 X80.48177903514083 Y233.72448838238836 F300
G1 X81.65414339109536 Y236.80967340388827 F300
G1 X83.53195763977193 Y239.52382491908912 F300
G1 X86.00569782138756 Y241.70863939951082 F300
G1 X88.93108245530281 Y243.2366870243094 F300
G1 X92.13748779147396 Y244.01884405468968 F300
G1 X93.74925100000003 Y244.11422199999998 F300
G1 X97.02552511992438 Y243.7156838072084 F300
G1 X100.11070936934145 Y242.5433174194487 F300
G1 X102.82485964787259 Y240.66550138331806 F300
G1 X105.00967249916665 Y238.19175976285314 F300
G1 X106.53771819739897 Y235.26637412261462 F300
G1 X107.31987311614178 Y232.05996827134027 F300
G1 X107.41525 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle20
G0 X131.02641 Y230.448214
G1 X130.62785718313586 Y227.17194165903538 F300
G1 X129.45547702426586 Y224.0867626426592 F300
G1 X127.57764887319044 Y221.37262074603174 F300
G1 X125.10389750055329 Y219.1878189366276 F300
G1 X122.1785050397128 Y217.65978629625056 F300
G1 X118.97209569721996 Y216.87764568972594 F300
G1 X117.36041 Y216.78227600000002 F300
G1 X114.08413585090793 Y217.18081395301212 F300
G1 X110.99895151568931 Y218.35318011497753 F300
G1 X108.28480109972716 Y220.23099595246865 F300
G1 X106.09998806738827 Y222.70473741303442 F300
G1 X104.57194215505683 Y225.6301229414404 F300
G1 X103.78978700164795 Y228.83652873547146 F300
G1 X103.69441 Y230.44821399999998 F300
G1 X104.09294603514056 Y233.72448838238842 F300
G1 X105.26531039109481 Y236.8096734038884 F300
G1 X107.14312463977116 Y239.52382491908946 F300
G1 X109.6168648213866 Y241.70863939951138 F300
G1 X112.5422494553017 Y243.2366870243102 F300
G1 X115.74865479147275 Y244.01884405469076 F300
G1 X117.36041000000002 Y244.114222 F300
G1 X120.63668414908715 Y243.7156840469474 F300
G1 X123.72186848429128 Y242.5433178849438 F300
G1 X126.4360189002302 Y240.66550204741912 F300
G1 X128.6208319325385 Y238.19176058682632 F300
G1 X130.14887784483375 Y235.26637505840145 F300
G1 X130.93103299820294 Y232.05996926436072 F300
G1 X131.02641 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle21
G0 X154.6376 Y230.448214
G1 X154.23904718313585 Y227.17194165903538 F300
G1 X153.06666702426585 Y224.0867626426592 F300
G1 X151.18883887319043 Y221.37262074603174 F300
G1 X148.7150875005533 Y219.1878189366276 F300
G1 X145.78969503971283 Y217.65978629625056 F300
G1 X142.58328569722 Y216.87764568972594 F300
G1 X140.9716 Y216.78227600000002 F300
G1 X137.6953255592816 Y217.18081155562237 F300
G1 X134.6101403661934 Y218.3531754600264 F300
G1 X131.89598857615397 Y220.23098931145725 F300
G1 X129.71117373367346 Y222.70472917330142 F300
G1 X128.18312568071295 Y225.6301135835702 F300
G1 X127.40096818104027 Y228.83651880526406 F300
G1 X127.30559000000002 Y230.448214 F300
G1 X127.70412603514073 Y233.7244883823884 F300
G1 X128.87649039109516 Y236.8096734038883 F300
G1 X130.75430463977165 Y239.52382491908926 F300
G1 X133.2280448213872 Y241.70863939951104 F300
G1 X136.15342945530236 Y243.2366870243097 F300
G1 X139.35983479147347 Y244.01884405469008 F300
G1 X140.97160000000002 Y244.114222 F300
G1 X144.24787414908715 Y243.7156840469474 F300
G1 X147.33305848429129 Y242.5433178849438 F300
G1 X150.0472089002302 Y240.66550204741912 F300
G1 X152.2320219325385 Y238.19176058682632 F300
G1 X153.76006784483377 Y235.26637505840142 F300
G1 X154.54222299820296 Y232.0599692643607 F300
G1 X154.63760000000002 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle22
G0 X178.24881 Y230.448214
G1 X177.85025718313724 Y227.17194165903524 F300
G1 X176.67787702426858 Y224.08676264265856 F300
G1 X174.8000488731943 Y221.37262074603026 F300
G1 X172.32629750055807 Y219.18781893662504 F300
G1 X169.40090503971822 Y217.65978629624675 F300
G1 X166.1944956972257 Y216.87764568972077 F300
G1 X164.58279 Y216.78227600000002 F300
G1 X161.30651614253605 Y217.1808163504017 F300
G1 X158.2213326651886 Y218.3531847699279 F300
G1 X155.5071836233052 Y220.23100259347822 F300
G1 X153.32237240110913 Y222.70474565276433 F300
G1 X151.79432862940757 Y225.63013229930596 F300
G1 X151.01217582226292 Y228.8365386656725 F300
G1 X150.91680000000002 Y230.44821400000004 F300
G1 X151.31533603513864 Y233.72448838238864 F300
G1 X152.4877003910911 Y236.80967340388935 F300
G1 X154.36551463976585 Y239.52382491909148 F300
G1 X156.83925482138 Y241.70863939951485 F300
G1 X159.7646394552942 Y243.2366870243154 F300
G1 X162.9710447914648 Y244.0188440546978 F300
G1 X164.58279 Y244.11422199999998 F300
G1 X167.85906473233808 Y243.71568884172711 F300
G1 X170.94425078327964 Y242.54332719484697 F300
G1 X173.65840394737168 Y240.66551532944376 F300
G1 X175.84322059996208 Y238.19177706629554 F300
G1 X177.37127079351467 Y235.26639377414665 F300
G1 X178.15343063941106 Y232.059989124782 F300
G1 X178.24881 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle23
G0 X201.86 Y230.448214
G1 X201.4614471831378 Y227.17194165903518 F300
G1 X200.28906702426963 Y224.08676264265833 F300
G1 X198.4112388731958 Y221.37262074602972 F300
G1 X195.9374875005599 Y219.1878189366241 F300
G1 X193.01209503972032 Y217.65978629624533 F300
G1 X189.80568569722797 Y216.87764568971883 F300
G1 X188.19401 Y216.78227600000002 F300
G1 X184.91773555928157 Y217.18081155562237 F300
G1 X181.83255036619337 Y218.3531754600264 F300
G1 X179.11839857615394 Y220.23098931145725 F300
G1 X176.93358373367343 Y222.70472917330142 F300
G1 X175.40553568071292 Y225.6301135835702 F300
G1 X174.62337818104024 Y228.83651880526406 F300
G1 X174.528 Y230.44821400000004 F300
G1 X174.9265360351407 Y233.72448838238836 F300
G1 X176.09890039109513 Y236.8096734038883 F300
G1 X177.97671463977161 Y239.52382491908924 F300
G1 X180.45045482138718 Y241.70863939951101 F300
G1 X183.37583945530238 Y243.2366870243097 F300
G1 X186.5822447914735 Y244.01884405469008 F300
G1 X188.19400999999996 Y244.11422199999998 F300
G1 X191.470283857459 Y243.7156816495578 F300
G1 X194.55546733479196 Y242.54331322999343 F300
G1 X197.26961637665215 Y240.66549540640955 F300
G1 X199.4544275988176 Y238.19175234709644 F300
G1 X200.98247137048298 Y235.2663657005359 F300
G1 X201.764624177588 Y232.05995933415971 F300
G1 X201.86 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle24
G0 X36.581744 Y206.837173
G1 X36.183192381829755 Y203.56090051321658 F300
G1 X35.01081335173815 Y200.47572106790042 F300
G1 X33.13298619368935 Y197.76157848422977 F300
G1 X30.65923562040854 Y195.57677576975124 F300
G1 X27.733843718631476 Y194.0487420590573 F300
G1 X24.527434662301648 Y193.26660027939974 F300
G1 X22.915739 Y193.17122999999998 F300
G1 X19.639464635104957 Y193.5697661789494 F300
G1 X16.554279665064776 Y194.74213067032488 F300
G1 X13.84012823228857 Y196.61994503813628 F300
G1 X11.65531386044909 Y199.093685315652 F300
G1 X10.12726636405719 Y202.0190700166393 F300
G1 X9.345109474418695 Y205.22547538714238 F300
G1 X9.2497316 Y206.837173 F300
G1 X9.64828585529741 Y210.1134451659814 F300
G1 X10.820667368701898 Y213.19862366762882 F300
G1 X12.698496711409499 Y215.91276473980366 F300
G1 X15.172249043274284 Y218.0975654631177 F300
G1 X18.097642174990675 Y219.62559681911358 F300
G1 X21.304051860878676 Y220.40773601787785 F300
G1 X22.915738999999988 Y220.503105 F300
G1 X26.192013294906378 Y220.10456824569025 F300
G1 X29.27719805906265 Y218.93220321251246 F300
G1 X31.991349162067923 Y217.05438836805754 F300
G1 X34.176163099483425 Y214.58064770685738 F300
G1 X35.70421008213618 Y211.6552627375233 F300
G1 X36.486366408684304 Y208.44885722966237 F300
G1 X36.581744 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle25
G0 X60.192922 Y206.837173
G1 X59.794370381829765 Y203.5609005132166 F300
G1 X58.62199135173817 Y200.47572106790045 F300
G1 X56.744164193689365 Y197.7615784842298 F300
G1 X54.27041362040854 Y195.57677576975124 F300
G1 X51.34502171863148 Y194.0487420590573 F300
G1 X48.13861266230165 Y193.26660027939974 F300
G1 X46.526917 Y193.17122999999998 F300
G1 X43.250642617607426 Y193.56976603510606 F300
G1 X40.165457596095074 Y194.7421303910278 F300
G1 X37.451306080874254 Y196.61994463967557 F300
G1 X35.266491600426306 Y199.09368482126797 F300
G1 X33.73844397559667 Y202.01906945516697 F300
G1 X32.95628694518235 Y205.2254747913298 F300
G1 X32.86090899999999 Y206.837173 F300
G1 X33.25946325529738 Y210.11344516598137 F300
G1 X34.43184476870184 Y213.19862366762882 F300
G1 X36.30967411140941 Y215.91276473980366 F300
G1 X38.78342644327415 Y218.0975654631177 F300
G1 X41.70881957499053 Y219.6255968191136 F300
G1 X44.91522926087852 Y220.40773601787794 F300
G1 X46.52691699999999 Y220.503105 F300
G1 X49.80319129490638 Y220.10456824569025 F300
G1 X52.88837605906265 Y218.9322032125125 F300
G1 X55.60252716206791 Y217.05438836805757 F300
G1 X57.7873410994834 Y214.58064770685743 F300
G1 X59.31538808213616 Y211.65526273752337 F300
G1 X60.0975444086843 Y208.44885722966248 F300
G1 X60.19292200000001 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle26
G0 X83.80409 Y206.837173
G1 X83.40553838182979 Y203.56090051321664 F300
G1 X82.23315935173821 Y200.47572106790045 F300
G1 X80.35533219368943 Y197.7615784842298 F300
G1 X77.88158162040862 Y195.57677576975124 F300
G1 X74.95618971863155 Y194.04874205905725 F300
G1 X71.74978066230172 Y193.26660027939965 F300
G1 X70.138082 Y193.17122999999998 F300
G1 X66.86180770509523 Y193.56976675432296 F300
G1 X63.776622940943696 Y194.7421317875132 F300
G1 X61.062471837946 Y196.61994663197905 F300
G1 X58.87765790054048 Y199.09368729318803 F300
G1 X57.34961091789953 Y202.01907226252825 F300
G1 X56.56745459136434 Y205.22547777039233 F300
G1 X56.472077 Y206.83717299999998 F300
G1 X56.87063125529741 Y210.11344516598137 F300
G1 X58.04301276870191 Y213.1986236676288 F300
G1 X59.92084211140951 Y215.91276473980363 F300
G1 X62.39459444327429 Y218.0975654631177 F300
G1 X65.31998757499066 Y219.62559681911355 F300
G1 X68.52639726087864 Y220.40773601787782 F300
G1 X70.138082 Y220.503105 F300
G1 X73.4143563823942 Y220.10456896490717 F300
G1 X76.49954140391128 Y218.93220460899786 F300
G1 X79.21369291913966 Y217.05439036036105 F300
G1 X81.39850739959759 Y214.58065017877743 F300
G1 X82.92655502443904 Y211.65526554488457 F300
G1 X83.70871205486628 Y208.4488602087249 F300
G1 X83.80409 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle27
G0 X107.41525 Y206.837173
G1 X107.01669838183017 Y203.56090051321658 F300
G1 X105.84431935173896 Y200.47572106790025 F300
G1 X103.9664921936905 Y197.76157848422935 F300
G1 X101.49274162040999 Y195.5767757697505 F300
G1 X98.56734971863311 Y194.0487420590562 F300
G1 X95.36094066230339 Y193.26660027939823 F300
G1 X93.749251 Y193.17122999999998 F300
G1 X90.47297661760743 Y193.56976603510606 F300
G1 X87.38779159609508 Y194.7421303910278 F300
G1 X84.67364008087426 Y196.61994463967557 F300
G1 X82.4888256004263 Y199.093684821268 F300
G1 X80.96077797559667 Y202.019069455167 F300
G1 X80.17862094518235 Y205.22547479132984 F300
G1 X80.083243 Y206.837173 F300
G1 X80.48179725529738 Y210.11344516598137 F300
G1 X81.65417876870185 Y213.19862366762882 F300
G1 X83.53200811140943 Y215.91276473980366 F300
G1 X86.0057604432742 Y218.09756546311772 F300
G1 X88.93115357499057 Y219.62559681911364 F300
G1 X92.13756326087855 Y220.40773601787794 F300
G1 X93.749251 Y220.503105 F300
G1 X97.02552511993022 Y220.1045668072564 F300
G1 X100.11070936936449 Y218.9322004195419 F300
G1 X102.82485964792312 Y217.05438438345104 F300
G1 X105.00967249925341 Y214.58064276301815 F300
G1 X106.53771819752859 Y211.65525712280203 F300
G1 X107.31987311631838 Y208.44885127153916 F300
G1 X107.41525 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle28
G0 X131.02641 Y206.837173
G1 X130.62785838183004 Y203.5609005132166 F300
G1 X129.45547935173872 Y200.4757210679003 F300
G1 X127.57765219369017 Y197.7615784842295 F300
G1 X125.10390162040956 Y195.57677576975072 F300
G1 X122.17850971863264 Y194.04874205905654 F300
G1 X118.97210066230286 Y193.26660027939866 F300
G1 X117.36041 Y193.17123000000004 F300
G1 X114.08413585090864 Y193.56976795301787 F300
G1 X110.99895151569207 Y194.74213411498872 F300
G1 X108.2848010997332 Y196.61994995248457 F300
G1 X106.09998806739867 Y199.0936914130542 F300
G1 X104.57194215507235 Y202.01907694146286 F300
G1 X103.7897870016691 Y205.2254827354953 F300
G1 X103.69441 Y206.837173 F300
G1 X104.09296425529712 Y210.1134451659814 F300
G1 X105.26534576870131 Y213.19862366762894 F300
G1 X107.14317511140865 Y215.91276473980395 F300
G1 X109.61692744327324 Y218.09756546311823 F300
G1 X112.54232057498949 Y219.62559681911438 F300
G1 X115.74873026087742 Y220.40773601787896 F300
G1 X117.36041 Y220.503105 F300
G1 X120.63668414909299 Y220.10456704699538 F300
G1 X123.72186848431427 Y218.932200885037 F300
G1 X126.43601890028071 Y217.05438504755207 F300
G1 X128.62083193262524 Y214.58064358699127 F300
G1 X130.14887784496338 Y211.65525805858874 F300
G1 X130.93103299837955 Y208.4488522645595 F300
G1 X131.02641 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle29
G0 X154.6376 Y206.837173
G1 X154.23904838183006 Y203.56090051321658 F300
G1 X153.06666935173874 Y200.4757210679003 F300
G1 X151.1888421936902 Y197.76157848422952 F300
G1 X148.71509162040957 Y195.57677576975072 F300
G1 X145.78969971863265 Y194.04874205905654 F300
G1 X142.58329066230286 Y193.26660027939866 F300
G1 X140.97160000000002 Y193.17123000000004 F300
G1 X137.69532555928228 Y193.56976555562812 F300
G1 X134.61014036619616 Y194.74212946003757 F300
G1 X131.89598857616 Y196.6199433114732 F300
G1 X129.71117373368384 Y199.09368317332118 F300
G1 X128.18312568072844 Y202.01906758359263 F300
G1 X127.4009681810614 Y205.2254728052879 F300
G1 X127.30559000000001 Y206.83717300000004 F300
G1 X127.7041442552973 Y210.11344516598137 F300
G1 X128.87652576870167 Y213.19862366762885 F300
G1 X130.75435511140915 Y215.91276473980378 F300
G1 X133.22810744327384 Y218.0975654631179 F300
G1 X136.15350057499015 Y219.6255968191139 F300
G1 X139.3599102608781 Y220.4077360178783 F300
G1 X140.9716 Y220.503105 F300
G1 X144.24787414909298 Y220.10456704699538 F300
G1 X147.33305848431428 Y218.932200885037 F300
G1 X150.04720890028074 Y217.05438504755207 F300
G1 X152.23202193262523 Y214.58064358699127 F300
G1 X153.76006784496337 Y211.65525805858877 F300
G1 X154.54222299837954 Y208.4488522645595 F300
G1 X154.6376 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle30
G0 X178.24881 Y206.837173
G1 X177.85025838183145 Y203.56090051321638 F300
G1 X176.67787935174147 Y200.47572106789957 F300
G1 X174.80005219369409 Y197.76157848422798 F300
G1 X172.3263016204144 Y195.57677576974814 F300
G1 X169.40090971863813 Y194.0487420590527 F300
G1 X166.19450066230868 Y193.26660027939346 F300
G1 X164.58279 Y193.17122999999998 F300
G1 X161.30651614253674 Y193.5697703504074 F300
G1 X158.22133266519137 Y194.742138769939 F300
G1 X155.50718362331122 Y196.6199565934941 F300
G1 X153.3223724011195 Y199.093699652784 F300
G1 X151.7943286294231 Y202.0190862993283 F300
G1 X151.01217582228406 Y205.22549266569618 F300
G1 X150.91680000000002 Y206.837173 F300
G1 X151.3153542552952 Y210.11344516598166 F300
G1 X152.48773576869758 Y213.19862366762987 F300
G1 X154.36556511140333 Y215.912764739806 F300
G1 X156.83931744326662 Y218.09756546312173 F300
G1 X159.76471057498196 Y219.62559681911958 F300
G1 X162.97112026086944 Y220.40773601788607 F300
G1 X164.58279 Y220.503105 F300
G1 X167.85906473234394 Y220.10457184177514 F300
G1 X170.94425078330266 Y218.93221019494018 F300
G1 X173.65840394742222 Y217.05439832957674 F300
G1 X175.84322060004888 Y214.58066006646052 F300
G1 X177.37127079364433 Y211.65527677433403 F300
G1 X178.15343063958767 Y208.44887212498082 F300
G1 X178.24881 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle31
G0 X201.86 Y206.837173
G1 X201.461448381832 Y203.56090051321632 F300
G1 X200.2890693517425 Y200.47572106789937 F300
G1 X198.41124219369556 Y197.76157848422744 F300
G1 X195.93749162041624 Y195.5767757697472 F300
G1 X193.0120997186402 Y194.04874205905128 F300
G1 X189.80569066231087 Y193.26660027939153 F300
G1 X188.19401 Y193.17122999999998 F300
G1 X184.91773555928225 Y193.56976555562807 F300
G1 X181.83255036619613 Y194.74212946003752 F300
G1 X179.11839857615996 Y196.61994331147315 F300
G1 X176.9335837336838 Y199.09368317332112 F300
G1 X175.4055356807284 Y202.01906758359257 F300
G1 X174.62337818106138 Y205.22547280528784 F300
G1 X174.528 Y206.837173 F300
G1 X174.92655425529728 Y210.1134451659814 F300
G1 X176.09893576870164 Y213.19862366762888 F300
G1 X177.97676511140912 Y215.91276473980378 F300
G1 X180.4505174432738 Y218.09756546311792 F300
G1 X183.37591057499012 Y219.6255968191139 F300
G1 X186.58232026087808 Y220.4077360178783 F300
G1 X188.19400999999996 Y220.503105 F300
G1 X191.47028385746486 Y220.10456464960583 F300
G1 X194.55546733481498 Y218.93219623008667 F300
G1 X197.26961637670266 Y217.05437840654255 F300
G1 X199.45442759890437 Y214.58063534726145 F300
G1 X200.98247137061264 Y211.6552487007233 F300
G1 X201.7646241777646 Y208.44884233435857 F300
G1 X201.86 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle32
G0 X36.581744 Y183.22607
G1 X36.18321084172709 Y179.9497952676619 F300
G1 X35.0108491948469 Y176.8646092167203 F300
G1 X33.13303732944368 Y174.1504560526283 F300
G1 X30.659299066295425 Y171.9656394000379 F300
G1 X27.73391577414651 Y170.43758920648534 F300
G1 X24.527511124781828 Y169.65542936058898 F300
G1 X22.915739000000002 Y169.56005 F300
G1 X19.639464635108986 Y169.95858617898253 F300
G1 X16.554279665080625 Y171.13095067038915 F300
G1 X13.840128232323407 Y173.00876503822795 F300
G1 X11.65531386050893 Y175.48250531576576 F300
G1 X10.127266364146566 Y178.40789001676848 F300
G1 X9.34510947454046 Y181.61429538727947 F300
G1 X9.249731600000002 Y183.22607 F300
G1 X9.648269553052652 Y186.50234414908712 F300
G1 X10.820635715056264 Y189.58752848429125 F300
G1 X12.69845155258096 Y192.3016789002302 F300
G1 X15.172193013173775 Y194.48649193253846 F300
G1 X18.09757854159865 Y196.01453784483368 F300
G1 X21.30398433563939 Y196.79669299820287 F300
G1 X22.915738999999995 Y196.89207 F300
G1 X26.192013294900573 Y196.4935332456425 F300
G1 X29.27719805903979 Y195.3211682124198 F300
G1 X31.991349162017716 Y193.44335336792534 F300
G1 X34.176163099397165 Y190.96961270669337 F300
G1 X35.70421008200732 Y188.04422773733702 F300
G1 X36.486366408508744 Y184.83782222946473 F300
G1 X36.581744 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle33
G0 X60.192922 Y183.22607
G1 X59.7943888417271 Y179.9497952676619 F300
G1 X58.62202719484691 Y176.8646092167203 F300
G1 X56.74421532944368 Y174.1504560526283 F300
G1 X54.27047706629543 Y171.9656394000379 F300
G1 X51.34509377414652 Y170.43758920648534 F300
G1 X48.138689124781834 Y169.65542936058898 F300
G1 X46.526917000000005 Y169.56005 F300
G1 X43.25064261761144 Y169.95858603513912 F300
G1 X40.165457596110954 Y171.13095039109206 F300
G1 X37.451306080909106 Y173.00876463976724 F300
G1 X35.266491600486134 Y175.48250482138172 F300
G1 X33.73844397568604 Y178.40788945529619 F300
G1 X32.95628694530412 Y181.6142947914669 F300
G1 X32.860909000000014 Y183.22607 F300
G1 X33.259446953052645 Y186.50234414908715 F300
G1 X34.431813115056244 Y189.58752848429128 F300
G1 X36.30962895258092 Y192.30167890023023 F300
G1 X38.78337041317373 Y194.48649193253848 F300
G1 X41.70875594159861 Y196.01453784483377 F300
G1 X44.91516173563933 Y196.79669299820296 F300
G1 X46.52691700000001 Y196.89207 F300
G1 X49.80319129490058 Y196.4935332456425 F300
G1 X52.88837605903977 Y195.32116821241982 F300
G1 X55.60252716201768 Y193.44335336792537 F300
G1 X57.78734109939715 Y190.9696127066934 F300
G1 X59.31538808200732 Y188.04422773733705 F300
G1 X60.097544408508746 Y184.83782222946476 F300
G1 X60.192922 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle34
G0 X83.80409 Y183.22607
G1 X83.40555684172712 Y179.94979526766193 F300
G1 X82.23319519484696 Y176.86460921672037 F300
G1 X80.35538332944375 Y174.1504560526283 F300
G1 X77.88164506629552 Y171.96563940003787 F300
G1 X74.95626177414664 Y170.4375892064853 F300
G1 X71.74985712478195 Y169.65542936058893 F300
G1 X70.138082 Y169.56005 F300
G1 X66.86180770509927 Y169.95858675435608 F300
G1 X63.77662294095954 Y171.13095178757746 F300
G1 X61.062471837980816 Y173.00876663207075 F300
G1 X58.877657900600305 Y175.48250729330178 F300
G1 X57.3496109179889 Y178.40789226265747 F300
G1 X56.5674545914861 Y181.61429777052945 F300
G1 X56.472077000000006 Y183.22607 F300
G1 X56.870614953052666 Y186.50234414908715 F300
G1 X58.04298111505628 Y189.58752848429125 F300
G1 X59.920796952580986 Y192.3016789002302 F300
G1 X62.394538413173805 Y194.48649193253843 F300
G1 X65.3199239415987 Y196.01453784483368 F300
G1 X68.52632973563944 Y196.79669299820284 F300
G1 X70.138082 Y196.89207 F300
G1 X73.41435638238839 Y196.49353396485947 F300
G1 X76.49954140388837 Y195.3211696089052 F300
G1 X79.21369291908943 Y193.44335536022888 F300
G1 X81.39850739951132 Y190.96961517861345 F300
G1 X82.92655502431016 Y188.04423054469834 F300
G1 X83.70871205469072 Y184.83782520852728 F300
G1 X83.80409 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle35
G0 X107.41525 Y183.22607
G1 X107.01671684172751 Y179.94979526766187 F300
G1 X105.84435519484774 Y176.8646092167202 F300
G1 X103.96654332944486 Y174.1504560526279 F300
G1 X101.49280506629688 Y171.9656394000372 F300
G1 X98.56742177414817 Y170.43758920648423 F300
G1 X95.3610171247836 Y169.65542936058748 F300
G1 X93.749251 Y169.56005 F300
G1 X90.47297661761147 Y169.95858603513915 F300
G1 X87.38779159611094 Y171.13095039109209 F300
G1 X84.6736400809091 Y173.00876463976726 F300
G1 X82.48882560048612 Y175.48250482138175 F300
G1 X80.96077797568603 Y178.4078894552962 F300
G1 X80.17862094530412 Y181.61429479146693 F300
G1 X80.083243 Y183.22607 F300
G1 X80.48178095305263 Y186.50234414908712 F300
G1 X81.65414711505622 Y189.58752848429125 F300
G1 X83.5319629525809 Y192.3016789002302 F300
G1 X86.00570441317372 Y194.48649193253848 F300
G1 X88.9310899415986 Y196.01453784483377 F300
G1 X92.13749573563932 Y196.79669299820296 F300
G1 X93.749251 Y196.89207 F300
G1 X97.02552511992441 Y196.49353180720868 F300
G1 X100.11070936934158 Y195.32116541944924 F300
G1 X102.82485964787288 Y193.44334938331883 F300
G1 X105.00967249916717 Y190.9696077628541 F300
G1 X106.53771819739973 Y188.04422212261574 F300
G1 X107.31987311614282 Y184.83781627134144 F300
G1 X107.41525 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle36
G0 X131.02641 Y183.22607
G1 X130.6278768417274 Y179.94979526766187 F300
G1 X129.45551519484752 Y176.86460921672023 F300
G1 X127.57770332944456 Y174.15045605262802 F300
G1 X125.10396506629651 Y171.9656394000374 F300
G1 X122.17858177414774 Y170.43758920648452 F300
G1 X118.97217712478317 Y169.65542936058787 F300
G1 X117.36041 Y169.56005 F300
G1 X114.08413585091266 Y169.95858795305094 F300
G1 X110.99895151570792 Y171.13095411505293 F300
G1 X108.28480109976803 Y173.00876995257622 F300
G1 X106.09998806745848 Y175.4825114131679 F300
G1 X104.57194215516171 Y178.407896941592 F300
G1 X103.78978700179086 Y181.61430273563235 F300
G1 X103.69441 Y183.22606999999996 F300
G1 X104.09294795305235 Y186.50234414908715 F300
G1 X105.26531411505567 Y189.5875284842914 F300
G1 X107.14312995258011 Y192.30167890023048 F300
G1 X109.61687141317275 Y194.486491932539 F300
G1 X112.5422569415975 Y196.0145378448345 F300
G1 X115.74866273563818 Y196.79669299820398 F300
G1 X117.36040999999999 Y196.89207 F300
G1 X120.63668414908719 Y196.49353204694765 F300
G1 X123.72186848429142 Y195.32116588494432 F300
G1 X126.4360189002305 Y193.44335004741987 F300
G1 X128.620831932539 Y190.96960858682726 F300
G1 X130.14887784483452 Y188.0442230584025 F300
G1 X130.931032998204 Y184.83781726436186 F300
G1 X131.02641 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle37
G0 X154.6376 Y183.22607
G1 X154.2390668417274 Y179.94979526766184 F300
G1 X153.06670519484751 Y176.8646092167202 F300
G1 X151.18889332944454 Y174.150456052628 F300
G1 X148.7151550662965 Y171.96563940003736 F300
G1 X145.78977177414774 Y170.43758920648452 F300
G1 X142.58336712478317 Y169.65542936058787 F300
G1 X140.9716 Y169.56005 F300
G1 X137.69532555928632 Y169.95858555566116 F300
G1 X134.61014036621205 Y171.13094946010176 F300
G1 X131.89598857619487 Y173.0087633115648 F300
G1 X129.7111737337437 Y175.48250317343485 F300
G1 X128.18312568081782 Y178.40788758372173 F300
G1 X127.40096818118317 Y181.61429280542487 F300
G1 X127.30559000000001 Y183.22607 F300
G1 X127.70412795305253 Y186.50234414908712 F300
G1 X128.87649411505603 Y189.5875284842913 F300
G1 X130.75430995258063 Y192.3016789002303 F300
G1 X133.22805141317338 Y194.48649193253868 F300
G1 X136.1534369415982 Y196.01453784483402 F300
G1 X139.3598427356389 Y196.79669299820333 F300
G1 X140.9716 Y196.89207 F300
G1 X144.24787414908718 Y196.49353204694765 F300
G1 X147.33305848429143 Y195.32116588494432 F300
G1 X150.0472089002305 Y193.44335004741987 F300
G1 X152.232021932539 Y190.96960858682726 F300
G1 X153.7600678448345 Y188.0442230584025 F300
G1 X154.54222299820398 Y184.83781726436186 F300
G1 X154.6376 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle38
G0 X178.24881 Y183.22607
G1 X177.8502768417288 Y179.94979526766167 F300
G1 X176.67791519485021 Y176.86460921671951 F300
G1 X174.8001033294484 Y174.15045605262648 F300
G1 X172.3263650663013 Y171.9656394000348 F300
G1 X169.40098177415317 Y170.4375892064807 F300
G1 X166.1945771247889 Y169.6554293605827 F300
G1 X164.58279 Y169.56005 F300
G1 X161.30651614254077 Y169.9585903504405 F300
G1 X158.22133266520723 Y171.13095877000328 F300
G1 X155.50718362334607 Y173.0087765935858 F300
G1 X153.32237240117934 Y175.4825196528978 F300
G1 X151.79432862951245 Y178.40790629945755 F300
G1 X151.01217582240582 Y181.61431266583335 F300
G1 X150.91680000000002 Y183.22607 F300
G1 X151.31533795305043 Y186.5023441490874 F300
G1 X152.48770411505194 Y189.5875284842923 F300
G1 X154.3655199525748 Y192.30167890023253 F300
G1 X156.83926141316613 Y194.48649193254246 F300
G1 X159.76464694159 Y196.0145378448397 F300
G1 X162.9710527356302 Y196.79669299821109 F300
G1 X164.58279000000002 Y196.89207 F300
G1 X167.85906473233814 Y196.4935368417274 F300
G1 X170.94425078327978 Y195.3211751948475 F300
G1 X173.658403947372 Y193.44336332944454 F300
G1 X175.84322059996262 Y190.9696250662965 F300
G1 X177.37127079351546 Y188.04424177414774 F300
G1 X178.1534306394121 Y184.83783712478314 F300
G1 X178.24881 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle39
G0 X201.86 Y183.22607
G1 X201.46146684172936 Y179.9497952676616 F300
G1 X200.2891051948513 Y176.8646092167193 F300
G1 X198.4112933294499 Y174.15045605262597 F300
G1 X195.93755506630316 Y171.96563940003387 F300
G1 X193.01217177415532 Y170.43758920647932 F300
G1 X189.8057671247912 Y169.65542936058077 F300
G1 X188.19401000000002 Y169.56005 F300
G1 X184.91773555928634 Y169.95858555566116 F300
G1 X181.83255036621208 Y171.13094946010176 F300
G1 X179.1183985761949 Y173.0087633115648 F300
G1 X176.93358373374372 Y175.48250317343485 F300
G1 X175.40553568081785 Y178.40788758372173 F300
G1 X174.6233781811832 Y181.61429280542487 F300
G1 X174.52800000000005 Y183.22607 F300
G1 X174.92653795305256 Y186.50234414908715 F300
G1 X176.09890411505606 Y189.5875284842913 F300
G1 X177.97671995258065 Y192.3016789002303 F300
G1 X180.4504614131734 Y194.48649193253868 F300
G1 X183.3758469415982 Y196.01453784483402 F300
G1 X186.58225273563892 Y196.79669299820333 F300
G1 X188.19401000000002 Y196.89207 F300
G1 X191.4702838574591 Y196.4935296495581 F300
G1 X194.5554673347921 Y195.321161229994 F300
G1 X197.26961637665246 Y193.44334340641035 F300
G1 X199.4544275988181 Y190.9696003470974 F300
G1 X200.98247137048378 Y188.04421370053703 F300
G1 X201.76462417758904 Y184.8378073341609 F300
G1 X201.86 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle40
G0 X36.581744 Y159.6149
G1 X36.18320364955779 Y156.33862614254096 F300
G1 X35.0108352299934 Y153.25344266520804 F300
G1 X33.133017406409465 Y150.53929362334785 F300
G1 X30.659274347096336 Y148.35448240118242 F300
G1 X27.733887700535792 Y146.82643862951707 F300
G1 X24.527481334159585 Y146.0442858224121 F300
G1 X22.915739000000006 Y145.94891 F300
G1 X19.639464635108915 Y146.347446178982 F300
G1 X16.55427966508039 Y147.51981067038815 F300
G1 X13.840128232322849 Y149.39762503822652 F300
G1 X11.655313860507961 Y151.871365315764 F300
G1 X10.127266364145132 Y154.79675001676645 F300
G1 X9.345109474538521 Y158.0031553872773 F300
G1 X9.249731600000002 Y159.6149 F300
G1 X9.648264758272907 Y162.89117473233807 F300
G1 X10.820626405153094 Y165.97636078327963 F300
G1 X12.698438270556327 Y168.69051394737167 F300
G1 X15.172176533704583 Y170.87533059996207 F300
G1 X18.0975598258535 Y172.40338079351463 F300
G1 X21.30396447521819 Y173.185540639411 F300
G1 X22.91573899999999 Y173.28091999999995 F300
G1 X26.192013294900747 Y172.88238324564387 F300
G1 X29.277198059040465 Y171.71001821242248 F300
G1 X31.99134916201919 Y169.8322033679292 F300
G1 X34.1761630993997 Y167.35846270669816 F300
G1 X35.70421008201111 Y164.43307773734247 F300
G1 X36.48636640851391 Y161.2266722294705 F300
G1 X36.581744 Y159.61489999999998 F300;svg#svg1 > g#layer1 > path#circle41
G0 X60.192922 Y159.6149
G1 X59.79438164955779 Y156.33862614254096 F300
G1 X58.6220132299934 Y153.25344266520804 F300
G1 X56.74419540640947 Y150.53929362334785 F300
G1 X54.27045234709634 Y148.35448240118242 F300
G1 X51.34506570053579 Y146.82643862951707 F300
G1 X48.13865933415959 Y146.0442858224121 F300
G1 X46.526917000000005 Y145.94891 F300
G1 X43.250642617611355 Y146.34744603513863 F300
G1 X40.16545759611066 Y147.51981039109106 F300
G1 X37.45130608090853 Y149.3976246397658 F300
G1 X35.26649160048517 Y151.87136482137996 F300
G1 X33.7384439756846 Y154.79674945529416 F300
G1 X32.95628694530217 Y158.00315479146477 F300
G1 X32.860909 Y159.61489999999998 F300
G1 X33.25944215827288 Y162.8911747323381 F300
G1 X34.431803805153045 Y165.97636078327963 F300
G1 X36.30961567055626 Y168.6905139473717 F300
G1 X38.7833539337045 Y170.8753305999621 F300
G1 X41.70873722585341 Y172.40338079351469 F300
G1 X44.91514187521809 Y173.18554063941104 F300
G1 X46.52691699999999 Y173.28091999999998 F300
G1 X49.80319129490075 Y172.88238324564387 F300
G1 X52.88837605904047 Y171.71001821242248 F300
G1 X55.60252716201919 Y169.8322033679292 F300
G1 X57.78734109939971 Y167.35846270669816 F300
G1 X59.315388082011104 Y164.43307773734247 F300
G1 X60.09754440851391 Y161.22667222947052 F300
G1 X60.192922 Y159.61489999999998 F300;svg#svg1 > g#layer1 > path#circle42
G0 X83.80409 Y159.6149
G1 X83.40554964955781 Y156.33862614254096 F300
G1 X82.23318122999345 Y153.253442665208 F300
G1 X80.35536340640955 Y150.53929362334785 F300
G1 X77.88162034709643 Y148.35448240118237 F300
G1 X74.95623370053592 Y146.826438629517 F300
G1 X71.74982733415972 Y146.044285822412 F300
G1 X70.138082 Y145.94891 F300
G1 X66.86180770509918 Y146.34744675435556 F300
G1 X63.7766229409593 Y147.51981178757646 F300
G1 X61.06247183798027 Y149.39762663206932 F300
G1 X58.877657900599345 Y151.8713672933 F300
G1 X57.34961091798747 Y154.79675226265545 F300
G1 X56.56745459148415 Y158.00315777052728 F300
G1 X56.472077 Y159.61489999999998 F300
G1 X56.87061015827292 Y162.89117473233807 F300
G1 X58.042971805153115 Y165.97636078327963 F300
G1 X59.920783670556354 Y168.69051394737167 F300
G1 X62.39452193370462 Y170.87533059996207 F300
G1 X65.31990522585355 Y172.40338079351463 F300
G1 X68.5263098752182 Y173.18554063941096 F300
G1 X70.13808200000001 Y173.28091999999995 F300
G1 X73.41435638238853 Y172.88238396486082 F300
G1 X76.49954140388905 Y171.71001960890788 F300
G1 X79.2136929190909 Y169.8322053602327 F300
G1 X81.39850739951387 Y167.35846517861822 F300
G1 X82.92655502431397 Y164.43308054470376 F300
G1 X83.70871205469588 Y161.22667520853304 F300
G1 X83.80409 Y159.61489999999998 F300;svg#svg1 > g#layer1 > path#circle43
G0 X107.41525 Y159.6149
G1 X107.01670964955821 Y156.3386261425409 F300
G1 X105.84434122999421 Y153.25344266520784 F300
G1 X103.96652340641063 Y150.53929362334742 F300
G1 X101.49278034709776 Y148.35448240118166 F300
G1 X98.56739370053741 Y146.8264386295159 F300
G1 X95.36098733416132 Y146.04428582241056 F300
G1 X93.74925100000002 Y145.94891 F300
G1 X90.47297661761137 Y146.34744603513863 F300
G1 X87.38779159611067 Y147.51981039109106 F300
G1 X84.67364008090854 Y149.39762463976578 F300
G1 X82.48882560048519 Y151.87136482137993 F300
G1 X80.9607779756846 Y154.79674945529413 F300
G1 X80.17862094530217 Y158.0031547914647 F300
G1 X80.083243 Y159.61489999999998 F300
G1 X80.48177615827288 Y162.89117473233807 F300
G1 X81.65413780515304 Y165.9763607832796 F300
G1 X83.53194967055624 Y168.69051394737167 F300
G1 X86.00568793370448 Y170.8753305999621 F300
G1 X88.93107122585337 Y172.40338079351466 F300
G1 X92.13747587521804 Y173.18554063941104 F300
G1 X93.74925100000002 Y173.28091999999998 F300
G1 X97.02552511992458 Y172.88238180721007 F300
G1 X100.11070936934229 Y171.71001541945196 F300
G1 X102.82485964787436 Y169.83219938332272 F300
G1 X105.0096724991697 Y167.35845776285893 F300
G1 X106.53771819740352 Y164.43307212262118 F300
G1 X107.31987311614797 Y161.22666627134723 F300
G1 X107.41525 Y159.6149 F300;svg#svg1 > g#layer1 > path#circle44
G0 X131.02641 Y159.6149
G1 X130.6278696495581 Y156.33862614254093 F300
G1 X129.455501229994 Y153.25344266520793 F300
G1 X127.57768340641034 Y150.53929362334756 F300
G1 X125.10394034709743 Y148.35448240118188 F300
G1 X122.17855370053707 Y146.82643862951628 F300
G1 X118.97214733416092 Y146.04428582241098 F300
G1 X117.36041 Y145.94891 F300
G1 X114.08413585091259 Y146.34744795305042 F300
G1 X110.99895151570769 Y147.51981411505193 F300
G1 X108.28480109976748 Y149.39762995257476 F300
G1 X106.09998806745753 Y151.8713714131661 F300
G1 X104.5719421551603 Y154.79675694158993 F300
G1 X103.78978700178892 Y158.00316273563013 F300
G1 X103.69441 Y159.61489999999998 F300
G1 X104.0929431582726 Y162.89117473233813 F300
G1 X105.2653048051525 Y165.9763607832798 F300
G1 X107.14311667055546 Y168.690513947372 F300
G1 X109.61685493370348 Y170.8753305999626 F300
G1 X112.54223822585224 Y172.40338079351545 F300
G1 X115.74864287521686 Y173.18554063941212 F300
G1 X117.36041000000002 Y173.28092 F300
G1 X120.63668414908734 Y172.88238204694906 F300
G1 X123.72186848429209 Y171.71001588494707 F300
G1 X126.43601890023197 Y169.83220004742378 F300
G1 X128.62083193254153 Y167.35845858683209 F300
G1 X130.1488778448383 Y164.433073058408 F300
G1 X130.93103299820913 Y161.2266672643677 F300
G1 X131.02641 Y159.6149 F300;svg#svg1 > g#layer1 > path#circle45
G0 X154.6376 Y159.6149
G1 X154.2390596495581 Y156.33862614254093 F300
G1 X153.066691229994 Y153.25344266520793 F300
G1 X151.18887340641035 Y150.53929362334756 F300
G1 X148.7151303470974 Y148.35448240118188 F300
G1 X145.78974370053706 Y146.82643862951628 F300
G1 X142.58333733416092 Y146.04428582241098 F300
G1 X140.9716 Y145.94891 F300
G1 X137.69532555928626 Y146.34744555566067 F300
G1 X134.6101403662118 Y147.5198094601008 F300
G1 X131.8959885761943 Y149.3976233115634 F300
G1 X129.7111737337427 Y151.8713631734331 F300
G1 X128.1831256808164 Y154.79674758371976 F300
G1 X127.40096818118124 Y158.00315280542281 F300
G1 X127.30559000000002 Y159.6149 F300
G1 X127.70412315827278 Y162.8911747323381 F300
G1 X128.87648480515284 Y165.9763607832797 F300
G1 X130.75429667055596 Y168.6905139473718 F300
G1 X133.22803493370412 Y170.87533059996233 F300
G1 X136.15341822585296 Y172.403380793515 F300
G1 X139.3598228752176 Y173.18554063941147 F300
G1 X140.97160000000002 Y173.28092 F300
G1 X144.24787414908735 Y172.88238204694906 F300
G1 X147.33305848429208 Y171.71001588494707 F300
G1 X150.04720890023196 Y169.83220004742378 F300
G1 X152.23202193254153 Y167.35845858683209 F300
G1 X153.76006784483832 Y164.43307305840798 F300
G1 X154.54222299820916 Y161.22666726436768 F300
G1 X154.6376 Y159.6149 F300;svg#svg1 > g#layer1 > path#circle46
G0 X178.24881 Y159.6149
G1 X177.8502696495595 Y156.33862614254076 F300
G1 X176.6779012299967 Y153.25344266520722 F300
G1 X174.8000834064142 Y150.53929362334605 F300
G1 X172.3263403471022 Y148.35448240117933 F300
G1 X169.40095370054243 Y146.82643862951244 F300
G1 X166.19454733416663 Y146.0442858224058 F300
G1 X164.58279 Y145.94891 F300
G1 X161.30651614254072 Y146.34745035043997 F300
G1 X158.221332665207 Y147.51981877000227 F300
G1 X155.50718362334555 Y149.39763659358434 F300
G1 X153.3223724011784 Y151.871379652896 F300
G1 X151.79432862951106 Y154.7967662994555 F300
G1 X151.0121758224039 Y158.00317266583116 F300
G1 X150.91680000000002 Y159.6149 F300
G1 X151.31533315827068 Y162.89117473233838 F300
G1 X152.48769480514875 Y165.9763607832807 F300
G1 X154.36550667055013 Y168.69051394737403 F300
G1 X156.83924493369688 Y170.8753305999661 F300
G1 X159.76462822584475 Y172.40338079352068 F300
G1 X162.9710328752089 Y173.18554063941923 F300
G1 X164.58279000000002 Y173.28092 F300
G1 X167.8590647323383 Y172.88238684172882 F300
G1 X170.94425078328047 Y171.71002519485023 F300
G1 X173.6584039473735 Y169.83221332944842 F300
G1 X175.84322059996518 Y167.3584750663013 F300
G1 X177.37127079351927 Y164.43309177415318 F300
G1 X178.15343063941728 Y161.22668712478892 F300
G1 X178.24881 Y159.6149 F300;svg#svg1 > g#layer1 > path#circle47
G0 X201.86 Y159.6149
G1 X201.46145964956003 Y156.3386261425407 F300
G1 X200.28909122999775 Y153.25344266520696 F300
G1 X198.4112734064157 Y150.53929362334551 F300
G1 X195.93753034710406 Y148.35448240117842 F300
G1 X193.01214370054456 Y146.82643862951105 F300
G1 X189.8057373341689 Y146.04428582240388 F300
G1 X188.19401 Y145.94891 F300
G1 X184.91773555928623 Y146.34744555566067 F300
G1 X181.83255036621176 Y147.5198094601008 F300
G1 X179.11839857619427 Y149.3976233115634 F300
G1 X176.93358373374267 Y151.8713631734331 F300
G1 X175.40553568081637 Y154.79674758371976 F300
G1 X174.6233781811812 Y158.00315280542281 F300
G1 X174.528 Y159.6149 F300
G1 X174.92653315827278 Y162.8911747323381 F300
G1 X176.09889480515284 Y165.9763607832797 F300
G1 X177.97670667055598 Y168.6905139473718 F300
G1 X180.45044493370415 Y170.8753305999623 F300
G1 X183.375828225853 Y172.40338079351497 F300
G1 X186.58223287521767 Y173.18554063941144 F300
G1 X188.19401 Y173.28091999999995 F300
G1 X191.47028385745924 Y172.88237964955945 F300
G1 X194.55546733479278 Y171.71001122999667 F300
G1 X197.26961637665394 Y169.83219340641418 F300
G1 X199.4544275988207 Y167.35845034710218 F300
G1 X200.98247137048756 Y164.43306370054245 F300
G1 X201.76462417759421 Y161.22665733416665 F300
G1 X201.86 Y159.61489999999998 F300;svg#svg1 > g#layer1 > path#circle48
G0 X36.581744 Y136.00371
G1 X36.183210841727096 Y132.72743526766192 F300
G1 X35.010849194846905 Y129.64224921672033 F300
G1 X33.13303732944368 Y126.92809605262832 F300
G1 X30.659299066295432 Y124.74327940003792 F300
G1 X27.733915774146517 Y123.21522920648536 F300
G1 X24.52751112478184 Y122.43306936058902 F300
G1 X22.915739000000006 Y122.33769 F300
G1 X19.639464635108986 Y122.73622617898255 F300
G1 X16.554279665080625 Y123.90859067038917 F300
G1 X13.840128232323407 Y125.78640503822797 F300
G1 X11.65531386050893 Y128.26014531576578 F300
G1 X10.127266364146566 Y131.1855300167685 F300
G1 X9.34510947454046 Y134.3919353872795 F300
G1 X9.249731600000002 Y136.00371 F300
G1 X9.648267155662882 Y139.2799844407135 F300
G1 X10.820631060105093 Y142.3651696337872 F300
G1 X12.69844491156954 Y145.07932142380338 F300
G1 X15.17218477344074 Y147.2641362662533 F300
G1 X18.09756918372843 Y148.79218431917764 F300
G1 X21.303974405431983 Y149.5743418188106 F300
G1 X22.915739 Y149.66972 F300
G1 X26.19201329490055 Y149.27118324564236 F300
G1 X29.277198059039684 Y148.0988182124195 F300
G1 X31.991349162017492 Y146.2210033679249 F300
G1 X34.17616309939683 Y143.74726270669282 F300
G1 X35.704210082006824 Y140.8218777373364 F300
G1 X36.4863664085081 Y137.61547222946407 F300
G1 X36.581744 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle49
G0 X60.192922 Y136.00371
G1 X59.7943888417271 Y132.72743526766192 F300
G1 X58.62202719484691 Y129.64224921672033 F300
G1 X56.74421532944368 Y126.92809605262832 F300
G1 X54.27047706629543 Y124.74327940003792 F300
G1 X51.34509377414652 Y123.21522920648536 F300
G1 X48.138689124781834 Y122.43306936058902 F300
G1 X46.526917000000005 Y122.33769 F300
G1 X43.250642617611426 Y122.73622603513914 F300
G1 X40.16545759611094 Y123.90859039109208 F300
G1 X37.45130608090909 Y125.78640463976726 F300
G1 X35.26649160048612 Y128.26014482138174 F300
G1 X33.738443975686025 Y131.1855294552962 F300
G1 X32.95628694530411 Y134.39193479146692 F300
G1 X32.860909 Y136.00371 F300
G1 X33.25944455566286 Y139.27998444071352 F300
G1 X34.43180846010505 Y142.3651696337872 F300
G1 X36.309622311569505 Y145.07932142380344 F300
G1 X38.78336217344068 Y147.26413626625333 F300
G1 X41.708746583728356 Y148.7921843191777 F300
G1 X44.915151805431904 Y149.57434181881067 F300
G1 X46.526917 Y149.66972000000004 F300
G1 X49.80319129490055 Y149.27118324564236 F300
G1 X52.88837605903968 Y148.0988182124195 F300
G1 X55.60252716201749 Y146.2210033679249 F300
G1 X57.78734109939683 Y143.74726270669282 F300
G1 X59.31538808200683 Y140.82187773733642 F300
G1 X60.0975444085081 Y137.61547222946407 F300
G1 X60.192922 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle50
G0 X83.80409 Y136.00371
G1 X83.40555684172712 Y132.72743526766195 F300
G1 X82.23319519484696 Y129.6422492167204 F300
G1 X80.35538332944375 Y126.92809605262832 F300
G1 X77.88164506629552 Y124.74327940003789 F300
G1 X74.95626177414664 Y123.21522920648532 F300
G1 X71.74985712478198 Y122.43306936058895 F300
G1 X70.13808199999998 Y122.33769000000002 F300
G1 X66.86180770509928 Y122.73622675435608 F300
G1 X63.77662294095957 Y123.90859178757746 F300
G1 X61.06247183798084 Y125.78640663207075 F300
G1 X58.877657900600305 Y128.2601472933018 F300
G1 X57.3496109179889 Y131.1855322626575 F300
G1 X56.5674545914861 Y134.39193777052947 F300
G1 X56.472077000000006 Y136.00371 F300
G1 X56.87061255566289 Y139.27998444071352 F300
G1 X58.0429764601051 Y142.3651696337872 F300
G1 X59.92079031156956 Y145.07932142380338 F300
G1 X62.39453017344077 Y147.2641362662533 F300
G1 X65.31991458372843 Y148.7921843191776 F300
G1 X68.526319805432 Y149.57434181881058 F300
G1 X70.13808200000001 Y149.66972 F300
G1 X73.41435638238835 Y149.27118396485932 F300
G1 X76.49954140388827 Y148.0988196089049 F300
G1 X79.21369291908921 Y146.22100536022845 F300
G1 X81.39850739951099 Y143.7472651786129 F300
G1 X82.92655502430968 Y140.82188054469773 F300
G1 X83.70871205469008 Y137.61547520852662 F300
G1 X83.80409 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle51
G0 X107.41525 Y136.00371
G1 X107.01671684172751 Y132.7274352676619 F300
G1 X105.84435519484774 Y129.64224921672022 F300
G1 X103.96654332944486 Y126.92809605262791 F300
G1 X101.49280506629691 Y124.74327940003721 F300
G1 X98.5674217741482 Y123.21522920648427 F300
G1 X95.36101712478361 Y122.4330693605875 F300
G1 X93.749251 Y122.33769000000002 F300
G1 X90.47297661761144 Y122.73622603513917 F300
G1 X87.38779159611093 Y123.9085903910921 F300
G1 X84.6736400809091 Y125.78640463976727 F300
G1 X82.48882560048614 Y128.26014482138174 F300
G1 X80.96077797568606 Y131.18552945529618 F300
G1 X80.17862094530412 Y134.39193479146692 F300
G1 X80.083243 Y136.00371 F300
G1 X80.48177855566286 Y139.27998444071352 F300
G1 X81.65414246010505 Y142.3651696337872 F300
G1 X83.5319563115695 Y145.07932142380344 F300
G1 X86.00569617344067 Y147.26413626625333 F300
G1 X88.93108058372836 Y148.7921843191777 F300
G1 X92.13748580543191 Y149.57434181881067 F300
G1 X93.749251 Y149.66972000000004 F300
G1 X97.0255251199244 Y149.27118180720854 F300
G1 X100.11070936934154 Y148.09881541944895 F300
G1 X102.8248596478727 Y146.2209993833184 F300
G1 X105.00967249916685 Y143.74725776285356 F300
G1 X106.53771819739926 Y140.8218721226151 F300
G1 X107.31987311614218 Y137.61546627134075 F300
G1 X107.41525 Y136.00371000000004 F300;svg#svg1 > g#layer1 > path#circle52
G0 X131.02641 Y136.00371
G1 X130.6278768417274 Y132.7274352676619 F300
G1 X129.45551519484752 Y129.64224921672024 F300
G1 X127.57770332944456 Y126.92809605262804 F300
G1 X125.10396506629651 Y124.7432794000374 F300
G1 X122.17858177414774 Y123.21522920648455 F300
G1 X118.97217712478314 Y122.4330693605879 F300
G1 X117.36041 Y122.33769 F300
G1 X114.08413585091269 Y122.73622795305094 F300
G1 X110.99895151570794 Y123.90859411505295 F300
G1 X108.28480109976803 Y125.78640995257624 F300
G1 X106.09998806745848 Y128.26015141316793 F300
G1 X104.57194215516171 Y131.18553694159203 F300
G1 X103.78978700179086 Y134.39194273563237 F300
G1 X103.69441 Y136.00371 F300
G1 X104.09294555566258 Y139.27998444071355 F300
G1 X105.2653094601045 Y142.3651696337873 F300
G1 X107.14312331156871 Y145.0793214238037 F300
G1 X109.61686317343973 Y147.26413626625384 F300
G1 X112.54224758372727 Y148.79218431917843 F300
G1 X115.74865280543078 Y149.57434181881172 F300
G1 X117.36041 Y149.66972 F300
G1 X120.63668414908716 Y149.2711820469475 F300
G1 X123.7218684842913 Y148.098815884944 F300
G1 X126.43601890023031 Y146.2210000474194 F300
G1 X128.6208319325387 Y143.74725858682666 F300
G1 X130.14887784483403 Y140.82187305840185 F300
G1 X130.93103299820334 Y137.61546726436114 F300
G1 X131.02641 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle53
G0 X154.6376 Y136.00371
G1 X154.2390668417274 Y132.72743526766186 F300
G1 X153.06670519484751 Y129.64224921672022 F300
G1 X151.18889332944454 Y126.928096052628 F300
G1 X148.7151550662965 Y124.74327940003738 F300
G1 X145.78977177414774 Y123.21522920648454 F300
G1 X142.58336712478317 Y122.4330693605879 F300
G1 X140.9716 Y122.33769 F300
G1 X137.69532555928632 Y122.73622555566118 F300
G1 X134.61014036621205 Y123.90858946010178 F300
G1 X131.89598857619487 Y125.78640331156481 F300
G1 X129.7111737337437 Y128.26014317343487 F300
G1 X128.18312568081782 Y131.18552758372175 F300
G1 X127.40096818118317 Y134.3919328054249 F300
G1 X127.30559000000001 Y136.00371 F300
G1 X127.70412555566278 Y139.27998444071352 F300
G1 X128.87648946010486 Y142.36516963378725 F300
G1 X130.75430331156923 Y145.0793214238035 F300
G1 X133.22804317344034 Y147.26413626625353 F300
G1 X136.15342758372796 Y148.79218431917795 F300
G1 X139.3598328054315 Y149.57434181881106 F300
G1 X140.97160000000002 Y149.66972 F300
G1 X144.24787414908715 Y149.2711820469475 F300
G1 X147.3330584842913 Y148.098815884944 F300
G1 X150.04720890023032 Y146.2210000474194 F300
G1 X152.2320219325387 Y143.74725858682666 F300
G1 X153.76006784483403 Y140.82187305840185 F300
G1 X154.54222299820333 Y137.61546726436114 F300
G1 X154.6376 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle54
G0 X178.24881 Y136.00371
G1 X177.8502768417288 Y132.7274352676617 F300
G1 X176.67791519485021 Y129.64224921671953 F300
G1 X174.8001033294484 Y126.9280960526265 F300
G1 X172.3263650663013 Y124.74327940003481 F300
G1 X169.4009817741532 Y123.21522920648074 F300
G1 X166.1945771247889 Y122.43306936058272 F300
G1 X164.58279 Y122.33769 F300
G1 X161.30651614254077 Y122.73623035044051 F300
G1 X158.22133266520723 Y123.9085987700033 F300
G1 X155.50718362334607 Y125.78641659358581 F300
G1 X153.32237240117934 Y128.2601596528978 F300
G1 X151.79432862951245 Y131.18554629945757 F300
G1 X151.01217582240582 Y134.39195266583337 F300
G1 X150.91680000000002 Y136.00371 F300
G1 X151.31533555566068 Y139.27998444071378 F300
G1 X152.4876994601008 Y142.36516963378824 F300
G1 X154.3655133115634 Y145.07932142380574 F300
G1 X156.83925317343312 Y147.26413626625734 F300
G1 X159.76463758371978 Y148.79218431918366 F300
G1 X162.9710428054228 Y149.5743418188188 F300
G1 X164.58279000000005 Y149.66972 F300
G1 X167.8590647323381 Y149.27118684172726 F300
G1 X170.9442507832797 Y148.0988251948472 F300
G1 X173.6584039473718 Y146.22101332944408 F300
G1 X175.8432205999623 Y143.7472750662959 F300
G1 X177.37127079351498 Y140.8218917741471 F300
G1 X178.15343063941145 Y137.61548712478248 F300
G1 X178.24881 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle55
G0 X201.86 Y136.00371
G1 X201.46146684172936 Y132.72743526766163 F300
G1 X200.2891051948513 Y129.6422492167193 F300
G1 X198.4112933294499 Y126.92809605262599 F300
G1 X195.93755506630316 Y124.7432794000339 F300
G1 X193.01217177415532 Y123.21522920647935 F300
G1 X189.80576712479117 Y122.4330693605808 F300
G1 X188.19401 Y122.33769000000001 F300
G1 X184.91773555928629 Y122.73622555566118 F300
G1 X181.83255036621202 Y123.90858946010178 F300
G1 X179.11839857619483 Y125.78640331156481 F300
G1 X176.93358373374366 Y128.26014317343487 F300
G1 X175.4055356808178 Y131.18552758372175 F300
G1 X174.62337818118314 Y134.3919328054249 F300
G1 X174.528 Y136.00371 F300
G1 X174.92653555566275 Y139.27998444071352 F300
G1 X176.09889946010483 Y142.36516963378725 F300
G1 X177.9767133115692 Y145.0793214238035 F300
G1 X180.4504531734403 Y147.26413626625353 F300
G1 X183.37583758372793 Y148.79218431917795 F300
G1 X186.58224280543146 Y149.57434181881106 F300
G1 X188.19401 Y149.66972 F300
G1 X191.47028385745904 Y149.27117964955795 F300
G1 X194.55546733479198 Y148.0988112299937 F300
G1 X197.26961637665227 Y146.2209934064099 F300
G1 X199.4544275988178 Y143.74725034709684 F300
G1 X200.9824713704833 Y140.82186370053637 F300
G1 X201.7646241775884 Y137.61545733416023 F300
G1 X201.86 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle56
G0 X36.581744 Y112.39250999999999
G1 X36.18320844433711 Y109.1162355592865 F300
G1 X35.01084453989489 Y106.03105036621282 F300
G1 X33.133030688430416 Y103.31689857619662 F300
G1 X30.659290826559207 Y101.1320837337467 F300
G1 X27.733906416271534 Y99.6040356808224 F300
G1 X24.52750119456796 Y98.82187818118943 F300
G1 X22.915739 Y98.72649999999999 F300
G1 X19.639464635109174 Y99.1250361789841 F300
G1 X16.554279665081378 Y100.29740067039222 F300
G1 X13.840128232325048 Y102.17521503823235 F300
G1 X11.655313860511754 Y104.64895531577122 F300
G1 X10.127266364150811 Y107.57434001677467 F300
G1 X9.345109474546263 Y110.78074538728605 F300
G1 X9.249731600000004 Y112.39250999999997 F300
G1 X9.648267155662882 Y115.66878444071348 F300
G1 X10.820631060105093 Y118.75396963378715 F300
G1 X12.698444911569558 Y121.46812142380337 F300
G1 X15.172184773440762 Y123.65293626625329 F300
G1 X18.097569183728456 Y125.18098431917761 F300
G1 X21.303974405431997 Y125.96314181881058 F300
G1 X22.915738999999988 Y126.05851999999999 F300
G1 X26.192013294900526 Y125.65998324564232 F300
G1 X29.277198059039684 Y124.48761821241945 F300
G1 X31.99134916201751 Y122.60980336792485 F300
G1 X34.17616309939685 Y120.13606270669275 F300
G1 X35.70421008200684 Y117.21067773733634 F300
G1 X36.4863664085081 Y114.00427222946401 F300
G1 X36.581744 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle57
G0 X60.192922 Y112.39250999999999
G1 X59.794386444337114 Y109.1162355592865 F300
G1 X58.62202253989489 Y106.03105036621282 F300
G1 X56.74420868843042 Y103.31689857619662 F300
G1 X54.27046882655921 Y101.1320837337467 F300
G1 X51.34508441627153 Y99.6040356808224 F300
G1 X48.13867919456796 Y98.82187818118943 F300
G1 X46.52691699999999 Y98.72649999999999 F300
G1 X43.25064261761162 Y99.12503603514071 F300
G1 X40.1654575961117 Y100.29740039109512 F300
G1 X37.45130608091077 Y102.1752146397716 F300
G1 X35.266491600489 Y104.64895482138712 F300
G1 X33.738443975690316 Y107.5743394553023 F300
G1 X32.95628694530993 Y110.78074479147341 F300
G1 X32.860909 Y112.39250999999999 F300
G1 X33.25944455566286 Y115.66878444071348 F300
G1 X34.43180846010505 Y118.75396963378716 F300
G1 X36.309622311569484 Y121.46812142380337 F300
G1 X38.78336217344068 Y123.6529362662533 F300
G1 X41.708746583728356 Y125.18098431917764 F300
G1 X44.91515180543193 Y125.96314181881064 F300
G1 X46.526917 Y126.05851999999999 F300
G1 X49.80319129490052 Y125.65998324564232 F300
G1 X52.88837605903968 Y124.48761821241945 F300
G1 X55.60252716201751 Y122.60980336792485 F300
G1 X57.78734109939685 Y120.13606270669275 F300
G1 X59.31538808200685 Y117.21067773733633 F300
G1 X60.09754440850811 Y114.00427222946398 F300
G1 X60.192922 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle58
G0 X83.80409 Y112.39250999999999
G1 X83.40555444433714 Y109.1162355592865 F300
G1 X82.23319053989495 Y106.03105036621281 F300
G1 X80.35537668843051 Y103.3168985761966 F300
G1 X77.88163682655932 Y101.13208373374667 F300
G1 X74.95625241627164 Y99.60403568082234 F300
G1 X71.74984719456808 Y98.82187818118933 F300
G1 X70.138082 Y98.72649999999999 F300
G1 X66.86180770509947 Y99.12503675435765 F300
G1 X63.77662294096034 Y100.29740178758051 F300
G1 X61.06247183798251 Y102.1752166320751 F300
G1 X58.87765790060317 Y104.6489572933072 F300
G1 X57.34961091799316 Y107.57434226266362 F300
G1 X56.5674545914919 Y110.78074777053594 F300
G1 X56.472077 Y112.39250999999999 F300
G1 X56.87061255566289 Y115.66878444071347 F300
G1 X58.0429764601051 Y118.75396963378715 F300
G1 X59.92079031156956 Y121.46812142380334 F300
G1 X62.39453017344077 Y123.65293626625325 F300
G1 X65.31991458372846 Y125.18098431917757 F300
G1 X68.52631980543204 Y125.96314181881054 F300
G1 X70.13808200000001 Y126.05851999999999 F300
G1 X73.41435638238838 Y125.65998396485926 F300
G1 X76.4995414038883 Y124.48761960890485 F300
G1 X79.21369291908923 Y122.60980536022838 F300
G1 X81.39850739951102 Y120.13606517861282 F300
G1 X82.92655502430969 Y117.21068054469764 F300
G1 X83.70871205469008 Y114.00427520852652 F300
G1 X83.80409 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle59
G0 X107.41525 Y112.39250999999999
G1 X107.01671444433754 Y109.11623555928644 F300
G1 X105.84435053989571 Y106.03105036621264 F300
G1 X103.9665366884316 Y103.31689857619618 F300
G1 X101.49279682656069 Y101.13208373374596 F300
G1 X98.56741241627323 Y99.60403568082128 F300
G1 X95.36100719456975 Y98.82187818118788 F300
G1 X93.749251 Y98.72649999999999 F300
G1 X90.47297661761162 Y99.12503603514071 F300
G1 X87.3877915961117 Y100.29740039109512 F300
G1 X84.67364008091077 Y102.1752146397716 F300
G1 X82.48882560048898 Y104.64895482138714 F300
G1 X80.9607779756903 Y107.57433945530231 F300
G1 X80.17862094530992 Y110.7807447914734 F300
G1 X80.083243 Y112.39250999999999 F300
G1 X80.48177855566286 Y115.66878444071348 F300
G1 X81.65414246010505 Y118.75396963378716 F300
G1 X83.53195631156949 Y121.46812142380337 F300
G1 X86.00569617344067 Y123.6529362662533 F300
G1 X88.93108058372833 Y125.18098431917764 F300
G1 X92.13748580543188 Y125.96314181881064 F300
G1 X93.74925100000002 Y126.05851999999999 F300
G1 X97.02552511992442 Y125.6599818072085 F300
G1 X100.11070936934155 Y124.4876154194489 F300
G1 X102.82485964787274 Y122.60979938331833 F300
G1 X105.00967249916688 Y120.13605776285348 F300
G1 X106.53771819739929 Y117.21067212261501 F300
G1 X107.31987311614218 Y114.0042662713407 F300
G1 X107.41525 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle60
G0 X131.02641 Y112.39250999999999
G1 X130.6278744443374 Y109.11623555928647 F300
G1 X129.4555105398955 Y106.03105036621268 F300
G1 X127.57769668843129 Y103.31689857619631 F300
G1 X125.1039568265603 Y101.13208373374619 F300
G1 X122.17857241627276 Y99.6040356808216 F300
G1 X118.97216719456925 Y98.82187818118831 F300
G1 X117.36041000000002 Y98.72649999999999 F300
G1 X114.08413585091287 Y99.12503795305251 F300
G1 X110.9989515157087 Y100.297404115056 F300
G1 X108.28480109976971 Y102.17521995258058 F300
G1 X106.09998806746135 Y104.64896141317331 F300
G1 X104.57194215516598 Y107.57434694159814 F300
G1 X103.78978700179667 Y110.78075273563886 F300
G1 X103.69441 Y112.39250999999999 F300
G1 X104.09294555566258 Y115.66878444071351 F300
G1 X105.2653094601045 Y118.75396963378726 F300
G1 X107.14312331156871 Y121.46812142380367 F300
G1 X109.6168631734397 Y123.65293626625379 F300
G1 X112.54224758372725 Y125.18098431917838 F300
G1 X115.74865280543074 Y125.96314181881166 F300
G1 X117.36041 Y126.05851999999999 F300
G1 X120.63668414908713 Y125.65998204694746 F300
G1 X123.7218684842913 Y124.48761588494396 F300
G1 X126.43601890023031 Y122.60980004741938 F300
G1 X128.6208319325387 Y120.13605858682662 F300
G1 X130.14887784483403 Y117.21067305840181 F300
G1 X130.93103299820334 Y114.00426726436109 F300
G1 X131.02641 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle61
G0 X154.6376 Y112.39250999999999
G1 X154.2390644443374 Y109.11623555928647 F300
G1 X153.06670053989546 Y106.03105036621268 F300
G1 X151.18888668843127 Y103.3168985761963 F300
G1 X148.71514682656027 Y101.13208373374616 F300
G1 X145.78976241627274 Y99.6040356808216 F300
G1 X142.58335719456926 Y98.82187818118831 F300
G1 X140.9716 Y98.72649999999999 F300
G1 X137.69532555928652 Y99.12503555566275 F300
G1 X134.6101403662128 Y100.29739946010484 F300
G1 X131.89598857619652 Y102.1752133115692 F300
G1 X129.7111737337465 Y104.64895317344033 F300
G1 X128.1831256808221 Y107.57433758372795 F300
G1 X127.40096818118899 Y110.7807428054315 F300
G1 X127.30559000000002 Y112.39250999999997 F300
G1 X127.70412555566278 Y115.6687844407135 F300
G1 X128.87648946010486 Y118.75396963378722 F300
G1 X130.75430331156923 Y121.46812142380348 F300
G1 X133.22804317344034 Y123.6529362662535 F300
G1 X136.15342758372796 Y125.18098431917792 F300
G1 X139.3598328054315 Y125.96314181881102 F300
G1 X140.97160000000002 Y126.05851999999999 F300
G1 X144.24787414908712 Y125.65998204694746 F300
G1 X147.3330584842913 Y124.48761588494396 F300
G1 X150.04720890023032 Y122.60980004741938 F300
G1 X152.23202193253866 Y120.13605858682665 F300
G1 X153.76006784483403 Y117.21067305840181 F300
G1 X154.54222299820333 Y114.00426726436109 F300
G1 X154.6376 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle62
G0 X178.24881 Y112.39250999999999
G1 X177.85027444433882 Y109.1162355592863 F300
G1 X176.67791053989822 Y106.03105036621203 F300
G1 X174.8000966884352 Y103.31689857619486 F300
G1 X172.3263568265651 Y101.13208373374364 F300
G1 X169.40097241627822 Y99.6040356808178 F300
G1 X166.19456719457506 Y98.82187818118314 F300
G1 X164.58279 Y98.72649999999999 F300
G1 X161.30651614254097 Y99.12504035044206 F300
G1 X158.22133266520802 Y100.29740877000633 F300
G1 X155.50718362334774 Y102.17522659359014 F300
G1 X153.3223724011822 Y104.64896965290318 F300
G1 X151.79432862951674 Y107.57435629946363 F300
G1 X151.01217582241165 Y110.78076266583977 F300
G1 X150.91680000000002 Y112.39250999999999 F300
G1 X151.31533555566068 Y115.66878444071375 F300
G1 X152.4876994601008 Y118.75396963378823 F300
G1 X154.3655133115634 Y121.46812142380571 F300
G1 X156.83925317343312 Y123.65293626625731 F300
G1 X159.76463758371978 Y125.18098431918362 F300
G1 X162.97104280542283 Y125.96314181881878 F300
G1 X164.58279000000005 Y126.05851999999999 F300
G1 X167.85906473233808 Y125.65998684172722 F300
G1 X170.94425078327967 Y124.48762519484717 F300
G1 X173.65840394737177 Y122.60981332944407 F300
G1 X175.84322059996228 Y120.1360750662959 F300
G1 X177.37127079351498 Y117.21069177414705 F300
G1 X178.15343063941145 Y114.00428712478244 F300
G1 X178.24881 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle63
G0 X201.86 Y112.39250999999999
G1 X201.46146444433936 Y109.11623555928622 F300
G1 X200.28910053989924 Y106.03105036621174 F300
G1 X198.41128668843663 Y103.31689857619425 F300
G1 X195.93754682656692 Y101.13208373374266 F300
G1 X193.0121624162803 Y99.60403568081637 F300
G1 X189.80575719457724 Y98.8218781811812 F300
G1 X188.19401 Y98.72649999999999 F300
G1 X184.91773555928648 Y99.12503555566275 F300
G1 X181.83255036621276 Y100.29739946010484 F300
G1 X179.11839857619648 Y102.1752133115692 F300
G1 X176.93358373374647 Y104.64895317344033 F300
G1 X175.40553568082206 Y107.57433758372795 F300
G1 X174.62337818118894 Y110.7807428054315 F300
G1 X174.528 Y112.39250999999997 F300
G1 X174.92653555566275 Y115.6687844407135 F300
G1 X176.09889946010483 Y118.75396963378722 F300
G1 X177.9767133115692 Y121.46812142380348 F300
G1 X180.4504531734403 Y123.6529362662535 F300
G1 X183.37583758372793 Y125.18098431917792 F300
G1 X186.58224280543146 Y125.96314181881102 F300
G1 X188.19401 Y126.05851999999999 F300
G1 X191.47028385745904 Y125.65997964955791 F300
G1 X194.555467334792 Y124.48761122999365 F300
G1 X197.2696163766523 Y122.60979340640984 F300
G1 X199.45442759881783 Y120.1360503470968 F300
G1 X200.9824713704833 Y117.21066370053634 F300
G1 X201.7646241775884 Y114.00425733416019 F300
G1 X201.86 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle64
G0 X26.279597 Y277.670564
G1 X25.885541988489724 Y276.0907513503787 F300
G1 X24.79570009625525 Y274.88106874327434 F300
G1 X23.265407245314403 Y274.3249292370717 F300
G1 X22.915739 Y274.306706 F300
G1 X21.33592611609147 Y274.7007600722244 F300
G1 X20.126242861016156 Y275.79060124523556 F300
G1 X19.570102444969997 Y277.3208937655205 F300
G1 X19.551879 Y277.670564 F300
G1 X19.945932602581426 Y279.25037700105196 F300
G1 X21.035773415980874 Y280.46006058011255 F300
G1 X22.566065770937666 Y281.0162014510803 F300
G1 X22.915739 Y281.03442500000006 F300
G1 X24.49555164962138 Y280.6403699884899 F300
G1 X25.705234256725824 Y279.5505280962555 F300
G1 X26.26137376292862 Y278.0202352453147 F300
G1 X26.279597 Y277.67056400000007 F300;svg#svg1 > g#layer1 > path#circle65
G0 X73.501942 Y277.670564
G1 X73.10788698848967 Y276.0907513503787 F300
G1 X72.01804509625515 Y274.8810687432744 F300
G1 X70.48775224531428 Y274.3249292370718 F300
G1 X70.13808199999998 Y274.306706 F300
G1 X68.55826935037864 Y274.70076101151034 F300
G1 X67.34858674327428 Y275.7906029037448 F300
G1 X66.79244723707161 Y277.32089575468564 F300
G1 X66.774224 Y277.670564 F300
G1 X67.16827760258137 Y279.25037700105196 F300
G1 X68.25811841598077 Y280.4600605801126 F300
G1 X69.78841077093755 Y281.0162014510804 F300
G1 X70.13808200000001 Y281.03442500000006 F300
G1 X71.71789488390856 Y280.6403709277758 F300
G1 X72.92757813898396 Y279.55052975476474 F300
G1 X73.48371855503024 Y278.02023723447985 F300
G1 X73.501942 Y277.67056400000007 F300;svg#svg1 > g#layer1 > path#circle66
G0 X120.72427 Y277.670564
G1 X120.33021498848967 Y276.0907513503787 F300
G1 X119.24037309625515 Y274.8810687432744 F300
G1 X117.71008024531429 Y274.3249292370718 F300
G1 X117.36040999999999 Y274.306706 F300
G1 X115.78059711609149 Y274.7007600722244 F300
G1 X114.57091386101617 Y275.79060124523556 F300
G1 X114.01477344497 Y277.3208937655205 F300
G1 X113.99655000000001 Y277.670564 F300
G1 X114.39060360258142 Y279.25037700105196 F300
G1 X115.48044441598087 Y280.46006058011255 F300
G1 X117.01073677093767 Y281.0162014510803 F300
G1 X117.36041 Y281.03442500000006 F300
G1 X118.94022288390856 Y280.6403709277758 F300
G1 X120.14990613898397 Y279.55052975476474 F300
G1 X120.70604655503024 Y278.02023723447985 F300
G1 X120.72427 Y277.67056400000007 F300;svg#svg1 > g#layer1 > path#circle67
G0 X167.94667 Y277.670564
G1 X167.55261498851985 Y276.0907513503712 F300
G1 X166.4627730963084 Y274.8810687432461 F300
G1 X164.93248024537817 Y274.32492923701426 F300
G1 X164.58279000000002 Y274.3067060000001 F300
G1 X163.00297828753295 Y274.70076476865256 F300
G1 X161.7932982723167 Y275.79060953777633 F300
G1 X161.23716240548993 Y277.3209037113354 F300
G1 X161.21894 Y277.67056400000007 F300
G1 X161.61299360257556 Y279.2503770010534 F300
G1 X162.70283441597053 Y280.460060580118 F300
G1 X164.23312677092525 Y281.01620145109143 F300
G1 X164.58279000000002 Y281.034425 F300
G1 X166.16260522674966 Y280.64038032064246 F300
G1 X167.3722949615111 Y279.5505463398854 F300
G1 X167.9284444759814 Y278.0202571261894 F300
G1 X167.94667 Y277.670564 F300;svg#svg1 > g#layer1 > path#circle72
G0 X49.890775 Y254.059382
G1 X49.49672092777564 Y252.47956911609148 F300
G1 X48.40687975476446 Y251.26988586101618 F300
G1 X46.87658723447953 Y250.71374544497002 F300
G1 X46.526917 Y250.695522 F300
G1 X44.94710411609148 Y251.0895760722244 F300
G1 X43.737420861016204 Y252.1794172452356 F300
G1 X43.1812804449701 Y253.70970976552059 F300
G1 X43.163056999999995 Y254.05938199999997 F300
G1 X43.557111541867386 Y255.63919476676497 F300
G1 X44.64695307449031 Y256.84887769785485 F300
G1 X46.17724576010329 Y257.4050176589792 F300
G1 X46.526917 Y257.42324099999996 F300
G1 X48.10672964962132 Y257.0291859884896 F300
G1 X49.31641225672561 Y255.93934409625504 F300
G1 X49.87255176292819 Y254.40905124531417 F300
G1 X49.89077499999999 Y254.05938199999997 F300
G1 X49.890775 Y254.059382 F300;svg#svg1 > g#layer1 > path#circle73
G0 X97.113105 Y254.059382
G1 X96.71905092777743 Y252.47956911609103 F300
G1 X95.62920975476761 Y251.2698858610145 F300
G1 X94.09891723448332 Y250.7137454449666 F300
G1 X93.749251 Y250.695522 F300
G1 X92.16943717894836 Y251.0895723150794 F300
G1 X90.95975133199353 Y252.17941061119365 F300
G1 X90.40360727657546 Y253.70970180884956 F300
G1 X90.385383 Y254.05938199999997 F300
G1 X90.77943754186204 Y255.6391947667663 F300
G1 X91.86927907448086 Y256.84887769785985 F300
G1 X93.39957176009194 Y257.40501765898944 F300
G1 X93.749251 Y257.42324099999996 F300
G1 X95.3290631810453 Y257.0291841099182 F300
G1 X96.53874449220639 Y255.93934077923825 F300
G1 X97.09488217872142 Y254.4090472669872 F300
G1 X97.113105 Y254.05938199999997 F300
G1 X97.113105 Y254.059382 F300;svg#svg1 > g#layer1 > path#circle74
G0 X144.33545 Y254.059382
G1 X143.94139592778146 Y252.47956911609003 F300
G1 X142.85155475477472 Y251.26988586101072 F300
G1 X141.32126223449185 Y250.71374544495893 F300
G1 X140.9716 Y250.695522 F300
G1 X139.39178594466398 Y251.0895713757928 F300
G1 X138.18209944974032 Y252.17940895268183 F300
G1 X137.62595448447976 Y253.70969981967912 F300
G1 X137.60773000000003 Y254.05938199999997 F300
G1 X138.0017845418593 Y255.639194766767 F300
G1 X139.09162607447604 Y256.8488776978624 F300
G1 X140.62191876008615 Y257.40501765899467 F300
G1 X140.97160000000002 Y257.42324099999996 F300
G1 X142.551411712467 Y257.02918223134736 F300
G1 X143.7610917276832 Y255.93933746222353 F300
G1 X144.3172275945099 Y254.40904328866444 F300
G1 X144.33545 Y254.05938199999997 F300
G1 X144.33545 Y254.059382 F300;svg#svg1 > g#layer1 > path#circle75
G0 X191.55785 Y254.059382
G1 X191.16379592780126 Y252.47956911608506 F300
G1 X190.0739547548097 Y251.26988586099208 F300
G1 X188.5436622345338 Y250.71374544492107 F300
G1 X188.19400999999996 Y250.69552199999998 F300
G1 X186.61419477325038 Y251.0895666793577 F300
G1 X185.40450503848905 Y252.17940066011488 F300
G1 X184.84835552401893 Y253.709689873811 F300
G1 X184.83013 Y254.05938199999997 F300
G1 X185.22418454183725 Y255.6391947667725 F300
G1 X186.31402607443707 Y256.84887769788315 F300
G1 X187.84431876003944 Y257.40501765903673 F300
G1 X188.19401000000002 Y257.42324099999996 F300
G1 X189.77382054101156 Y257.0291775349227 F300
G1 X190.98349731635798 Y255.93932916969595 F300
G1 X191.53962863396038 Y254.40903334287623 F300
G1 X191.55785 Y254.05938199999997 F300
G1 X191.55785 Y254.059382 F300;svg#svg1 > g#layer1 > path#circle76
G0 X26.279597 Y230.448214
G1 X25.88553588313474 Y228.86840287325896 F300
G1 X24.79568931595831 Y227.65872447797625 F300
G1 X23.265394315767242 Y227.102590885761 F300
G1 X22.915739 Y227.08436900000004 F300
G1 X21.33592611608798 Y227.4784230722104 F300
G1 X20.12624286100303 Y228.5682642452109 F300
G1 X19.570102444943334 Y230.0985567654909 F300
G1 X19.551879 Y230.44821400000004 F300
G1 X19.945933072224427 Y232.02802688390852 F300
G1 X21.03577424523566 Y233.2377101389838 F300
G1 X22.566066765520613 Y233.7938505550299 F300
G1 X22.915739 Y233.812074 F300
G1 X24.49555164962134 Y233.41801898848968 F300
G1 X25.705234256725657 Y232.32817709625516 F300
G1 X26.261373762928276 Y230.7978842453143 F300
G1 X26.279597 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle77
G0 X73.501942 Y230.448214
G1 X73.10788088313467 Y228.86840287325896 F300
G1 X72.0180343159582 Y227.65872447797628 F300
G1 X70.48773931576712 Y227.10259088576112 F300
G1 X70.13808199999998 Y227.08436900000004 F300
G1 X68.55826935037516 Y227.47842401149632 F300
G1 X67.34858674326117 Y228.5682659037201 F300
G1 X66.79244723704495 Y230.098558754656 F300
G1 X66.774224 Y230.44821400000004 F300
G1 X67.16827807222438 Y232.02802688390855 F300
G1 X68.25811924523556 Y233.23771013898386 F300
G1 X69.7884117655205 Y233.79385055503002 F300
G1 X70.138082 Y233.812074 F300
G1 X71.71789488390851 Y233.4180199277756 F300
G1 X72.92757813898379 Y232.32817875476437 F300
G1 X73.4837185550299 Y230.7978862344794 F300
G1 X73.501942 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle78
G0 X120.72427 Y230.448214
G1 X120.33020888313467 Y228.86840287325896 F300
G1 X119.24036231595821 Y227.65872447797628 F300
G1 X117.71006731576712 Y227.10259088576112 F300
G1 X117.36040999999999 Y227.08436900000004 F300
G1 X115.78059711608799 Y227.4784230722104 F300
G1 X114.57091386100304 Y228.5682642452109 F300
G1 X114.01477344494334 Y230.0985567654909 F300
G1 X113.99655000000001 Y230.44821400000004 F300
G1 X114.39060407222443 Y232.02802688390852 F300
G1 X115.48044524523566 Y233.2377101389838 F300
G1 X117.01073776552062 Y233.7938505550299 F300
G1 X117.36041 Y233.812074 F300
G1 X118.94022288390852 Y233.4180199277756 F300
G1 X120.1499061389838 Y232.32817875476437 F300
G1 X120.7060465550299 Y230.7978862344794 F300
G1 X120.72427 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle79
G0 X167.94667 Y230.448214
G1 X167.55260888316485 Y228.86840287325145 F300
G1 X166.46276231601146 Y227.65872447794797 F300
G1 X164.932467315831 Y227.10259088570356 F300
G1 X164.58279000000002 Y227.08436900000004 F300
G1 X163.00297828752946 Y227.47842776863854 F300
G1 X161.7932982723036 Y228.5682725377516 F300
G1 X161.23716240546327 Y230.09856671130575 F300
G1 X161.21894 Y230.44821400000004 F300
G1 X161.61299407221856 Y232.02802688391 F300
G1 X162.7028352452253 Y233.2377101389893 F300
G1 X164.2331277655082 Y233.79385055504108 F300
G1 X164.58279000000002 Y233.812074 F300
G1 X166.16260522674963 Y233.4180293206423 F300
G1 X167.37229496151096 Y232.3281953398851 F300
G1 X167.92844447598108 Y230.797906126189 F300
G1 X167.94667 Y230.448214 F300;svg#svg1 > g#layer1 > path#circle80
G0 X49.890775 Y206.837173
G1 X49.4967124742075 Y205.2573622246962 F300
G1 X48.406864828200625 Y204.0476848013749 F300
G1 X46.876569332031984 Y203.49155257392718 F300
G1 X46.52691699999999 Y203.47333100000003 F300
G1 X44.94710411608633 Y203.86738507220383 F300
G1 X43.73742086099684 Y204.95722624519928 F300
G1 X43.18128044493078 Y206.48751876547698 F300
G1 X43.163056999999995 Y206.83717300000004 F300
G1 X43.557119525792544 Y208.4169837753038 F300
G1 X44.64696717179946 Y209.62666119862507 F300
G1 X46.177262667968115 Y210.18279342607275 F300
G1 X46.526917 Y210.20101499999998 F300
G1 X48.10672964962647 Y209.80695998851027 F300
G1 X49.316412256745004 Y208.71711809629153 F300
G1 X49.87255176296759 Y207.18682524535794 F300
G1 X49.89077499999999 Y206.83717299999998 F300;svg#svg1 > g#layer1 > path#circle81
G0 X97.113105 Y206.837173
G1 X96.7190424742093 Y205.25736222469575 F300
G1 X95.6291948282038 Y204.04768480137324 F300
G1 X94.09889933203578 Y203.49155257392377 F300
G1 X93.749251 Y203.47333100000003 F300
G1 X92.16943717894321 Y203.86738131505882 F300
G1 X90.95975133197416 Y204.95721961115729 F300
G1 X90.40360727653614 Y206.48751080880592 F300
G1 X90.385383 Y206.837173 F300
G1 X90.7794455257872 Y208.41698377530514 F300
G1 X91.86929317179 Y209.6266611986301 F300
G1 X93.39958866795678 Y210.18279342608298 F300
G1 X93.749251 Y210.201015 F300
G1 X95.32906318105046 Y209.80695810993888 F300
G1 X96.53874449222579 Y208.71711477927474 F300
G1 X97.09488217876081 Y207.18682126703092 F300
G1 X97.113105 Y206.83717299999998 F300;svg#svg1 > g#layer1 > path#circle82
G0 X144.33545 Y206.837173
G1 X143.94138747421331 Y205.25736222469476 F300
G1 X142.8515398282109 Y204.04768480136946 F300
G1 X141.3212443320443 Y203.4915525739161 F300
G1 X140.9716 Y203.47333100000003 F300
G1 X139.39178594465884 Y203.8673803757722 F300
G1 X138.18209944972097 Y204.95721795264546 F300
G1 X137.62595448444046 Y206.4875088196355 F300
G1 X137.60773 Y206.837173 F300
G1 X138.00179252578448 Y208.41698377530582 F300
G1 X139.0916401717852 Y209.6266611986327 F300
G1 X140.621935667951 Y210.1827934260882 F300
G1 X140.9716 Y210.201015 F300
G1 X142.55141171247217 Y209.80695623136805 F300
G1 X143.7610917277026 Y208.71711146226002 F300
G1 X144.31722759454928 Y207.1868172887082 F300
G1 X144.33545 Y206.83717299999998 F300;svg#svg1 > g#layer1 > path#circle83
G0 X191.55785 Y206.837173
G1 X191.16378747423312 Y205.2573622246898 F300
G1 X190.07393982824587 Y204.0476848013508 F300
G1 X188.54364433208627 Y203.49155257387824 F300
G1 X188.19401 Y203.473331 F300
G1 X186.61419477324526 Y203.86737567933713 F300
G1 X185.40450503846972 Y204.95720966007855 F300
G1 X184.84835552397965 Y206.4874988737674 F300
G1 X184.83013 Y206.83717300000004 F300
G1 X185.2241925257624 Y208.4169837753113 F300
G1 X186.31404017174623 Y209.62666119865338 F300
G1 X187.84433566790426 Y210.18279342613027 F300
G1 X188.19401 Y210.20101499999998 F300
G1 X189.7738205410167 Y209.8069515349434 F300
G1 X190.9834973163774 Y208.71710316973247 F300
G1 X191.5396286339998 Y207.18680734292002 F300
G1 X191.55785 Y206.837173 F300;svg#svg1 > g#layer1 > path#circle84
G0 X26.279597 Y183.22607
G1 X25.885542927775628 Y181.64625711609145 F300
G1 X24.795701754764437 Y180.43657386101614 F300
G1 X23.265409234479502 Y179.88043344496998 F300
G1 X22.915739 Y179.86221 F300
G1 X21.33592611609148 Y180.2562640722244 F300
G1 X20.12624286101621 Y181.34610524523563 F300
G1 X19.570102444970107 Y182.8763977655206 F300
G1 X19.551879000000003 Y183.22607 F300
G1 X19.945933072224427 Y184.8058828839085 F300
G1 X21.03577424523566 Y186.0155661389838 F300
G1 X22.566066765520613 Y186.5717065550299 F300
G1 X22.915739 Y186.58992999999998 F300
G1 X24.49555164962134 Y186.19587498848966 F300
G1 X25.705234256725657 Y185.10603309625515 F300
G1 X26.261373762928276 Y183.57574024531428 F300
G1 X26.279597 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle85
G0 X73.501942 Y183.22607
G1 X73.10788792777556 Y181.64625711609148 F300
G1 X72.01804675476433 Y180.4365738610162 F300
G1 X70.48775423447938 Y179.8804334449701 F300
G1 X70.138082 Y179.86221 F300
G1 X68.55826935037867 Y180.25626501151032 F300
G1 X67.34858674327434 Y181.34610690374484 F300
G1 X66.79244723707173 Y182.8763997546857 F300
G1 X66.774224 Y183.22607 F300
G1 X67.16827807222438 Y184.80588288390854 F300
G1 X68.25811924523556 Y186.01556613898384 F300
G1 X69.7884117655205 Y186.57170655503 F300
G1 X70.138082 Y186.58992999999998 F300
G1 X71.71789488390851 Y186.19587592777557 F300
G1 X72.92757813898379 Y185.10603475476435 F300
G1 X73.4837185550299 Y183.57574223447938 F300
G1 X73.501942 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle86
G0 X120.72427 Y183.22607
G1 X120.33021592777557 Y181.64625711609148 F300
G1 X119.24037475476433 Y180.4365738610162 F300
G1 X117.71008223447939 Y179.8804334449701 F300
G1 X117.36041 Y179.86221 F300
G1 X115.78059711609149 Y180.2562640722244 F300
G1 X114.57091386101621 Y181.34610524523563 F300
G1 X114.0147734449701 Y182.8763977655206 F300
G1 X113.99655 Y183.22607 F300
G1 X114.39060407222443 Y184.8058828839085 F300
G1 X115.48044524523566 Y186.0155661389838 F300
G1 X117.01073776552062 Y186.5717065550299 F300
G1 X117.36041 Y186.58992999999998 F300
G1 X118.94022288390852 Y186.19587592777557 F300
G1 X120.1499061389838 Y185.10603475476435 F300
G1 X120.7060465550299 Y183.57574223447938 F300
G1 X120.72427 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle87
G0 X167.94667 Y183.22607
G1 X167.55261592780576 Y181.64625711608394 F300
G1 X166.46277475481762 Y180.43657386098786 F300
G1 X164.93248223454327 Y179.88043344491257 F300
G1 X164.58279000000002 Y179.86221 F300
G1 X163.00297828753295 Y180.25626876865255 F300
G1 X161.79329827231675 Y181.34611353777635 F300
G1 X161.23716240549 Y182.87640771133542 F300
G1 X161.21894 Y183.22607 F300
G1 X161.61299407221856 Y184.80588288391 F300
G1 X162.7028352452253 Y186.0155661389893 F300
G1 X164.2331277655082 Y186.57170655504106 F300
G1 X164.58279000000002 Y186.58992999999998 F300
G1 X166.16260522674963 Y186.19588532064228 F300
G1 X167.37229496151096 Y185.10605133988508 F300
G1 X167.92844447598108 Y183.57576212618898 F300
G1 X167.94667 Y183.22607 F300;svg#svg1 > g#layer1 > path#circle88
G0 X49.890775 Y159.6149
G1 X49.496716231347506 Y158.03508828753294 F300
G1 X48.406871462223755 Y156.82540827231668 F300
G1 X46.87657728866469 Y156.26927240548991 F300
G1 X46.52691699999999 Y156.25105 F300
G1 X44.94710411609001 Y156.64510407221854 F300
G1 X43.73742086101069 Y157.73494524522528 F300
G1 X43.18128044495891 Y159.26523776550818 F300
G1 X43.163056999999995 Y159.6149 F300
G1 X43.557106375792806 Y161.19471405533602 F300
G1 X44.64694395268184 Y162.40440055025968 F300
G1 X46.17723481967912 Y162.96054551552024 F300
G1 X46.526917 Y162.97876999999997 F300
G1 X48.10672964962336 Y162.58471498849775 F300
G1 X49.31641225673326 Y161.49487309626943 F300
G1 X49.87255176294372 Y159.96458024533143 F300
G1 X49.890775 Y159.61489999999998 F300;svg#svg1 > g#layer1 > path#circle89
G0 X97.113105 Y159.6149
G1 X96.7190462313493 Y158.0350882875325 F300
G1 X95.62920146222692 Y156.825408272315 F300
G1 X94.09890728866849 Y156.2692724054865 F300
G1 X93.749251 Y156.25105 F300
G1 X92.1694371789469 Y156.64510031507353 F300
G1 X90.95975133198802 Y157.73493861118328 F300
G1 X90.40360727656427 Y159.26522980883712 F300
G1 X90.385383 Y159.6149 F300
G1 X90.77943237578745 Y161.19471405533739 F300
G1 X91.86926995267237 Y162.4044005502647 F300
G1 X93.39956081966777 Y162.96054551553047 F300
G1 X93.74925099999999 Y162.97877 F300
G1 X95.32906318104733 Y162.58471310992635 F300
G1 X96.53874449221405 Y161.49486977925264 F300
G1 X97.09488217873695 Y159.96457626700442 F300
G1 X97.113105 Y159.61489999999998 F300;svg#svg1 > g#layer1 > path#circle90
G0 X144.33545 Y159.6149
G1 X143.94139123135332 Y158.0350882875315 F300
G1 X142.851546462234 Y156.82540827231125 F300
G1 X141.321252288677 Y156.26927240547883 F300
G1 X140.9716 Y156.25105 F300
G1 X139.39178594466253 Y156.64509937578694 F300
G1 X138.18209944973484 Y157.7349369526715 F300
G1 X137.6259544844686 Y159.2652278196667 F300
G1 X137.60773000000003 Y159.6149 F300
G1 X138.00177937578474 Y161.19471405533807 F300
G1 X139.09161695266755 Y162.40440055026727 F300
G1 X140.621907819662 Y162.9605455155357 F300
G1 X140.9716 Y162.97877 F300
G1 X142.55141171246905 Y162.58471123135553 F300
G1 X143.76109172769085 Y161.49486646223792 F300
G1 X144.31722759452543 Y159.9645722886817 F300
G1 X144.33545 Y159.61489999999998 F300;svg#svg1 > g#layer1 > path#circle91
G0 X191.55785 Y159.6149
G1 X191.16379123137312 Y158.03508828752655 F300
G1 X190.073946462269 Y156.82540827229263 F300
G1 X188.54365228871896 Y156.269272405441 F300
G1 X188.19400999999996 Y156.25105 F300
G1 X186.61419477324893 Y156.64509467935184 F300
G1 X185.40450503848356 Y157.73492866010454 F300
G1 X184.84835552400776 Y159.26521787379858 F300
G1 X184.83013 Y159.6149 F300
G1 X185.22417937576265 Y161.19471405534355 F300
G1 X186.31401695262858 Y162.404400550288 F300
G1 X187.84430781961527 Y162.96054551557776 F300
G1 X188.19401 Y162.97876999999997 F300
G1 X189.7738205410136 Y162.5847065349309 F300
G1 X190.98349731636566 Y161.49485816971037 F300
G1 X191.53962863397592 Y159.96456234289352 F300
G1 X191.55785 Y159.6149 F300;svg#svg1 > g#layer1 > path#circle92
G0 X26.279597 Y136.00371
G1 X25.885542927775628 Y134.42389711609147 F300
G1 X24.795701754764437 Y133.21421386101616 F300
G1 X23.265409234479502 Y132.65807344497 F300
G1 X22.915739 Y132.63985000000002 F300
G1 X21.33592611609148 Y133.03390407222443 F300
G1 X20.12624286101621 Y134.12374524523565 F300
G1 X19.570102444970107 Y135.65403776552063 F300
G1 X19.551879000000003 Y136.00371 F300
G1 X19.945933072224427 Y137.58352288390853 F300
G1 X21.03577424523566 Y138.7932061389838 F300
G1 X22.566066765520613 Y139.3493465550299 F300
G1 X22.915739 Y139.36757 F300
G1 X24.49555164962134 Y138.97351498848968 F300
G1 X25.705234256725657 Y137.88367309625517 F300
G1 X26.261373762928276 Y136.3533802453143 F300
G1 X26.279597 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle93
G0 X73.501942 Y136.00371
G1 X73.10788792777556 Y134.4238971160915 F300
G1 X72.01804675476433 Y133.21421386101622 F300
G1 X70.48775423447938 Y132.6580734449701 F300
G1 X70.138082 Y132.63985000000002 F300
G1 X68.55826935037867 Y133.03390501151034 F300
G1 X67.34858674327434 Y134.12374690374486 F300
G1 X66.79244723707173 Y135.65403975468573 F300
G1 X66.774224 Y136.00371 F300
G1 X67.16827807222438 Y137.58352288390856 F300
G1 X68.25811924523556 Y138.79320613898386 F300
G1 X69.7884117655205 Y139.34934655503002 F300
G1 X70.138082 Y139.36757 F300
G1 X71.71789488390851 Y138.9735159277756 F300
G1 X72.92757813898379 Y137.88367475476437 F300
G1 X73.4837185550299 Y136.3533822344794 F300
G1 X73.501942 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle94
G0 X120.72427 Y136.00371
G1 X120.33021592777557 Y134.4238971160915 F300
G1 X119.24037475476433 Y133.21421386101622 F300
G1 X117.71008223447939 Y132.6580734449701 F300
G1 X117.36041 Y132.63985000000002 F300
G1 X115.78059711609149 Y133.03390407222443 F300
G1 X114.57091386101621 Y134.12374524523565 F300
G1 X114.0147734449701 Y135.65403776552063 F300
G1 X113.99655 Y136.00371 F300
G1 X114.39060407222443 Y137.58352288390853 F300
G1 X115.48044524523566 Y138.7932061389838 F300
G1 X117.01073776552062 Y139.3493465550299 F300
G1 X117.36041 Y139.36757 F300
G1 X118.94022288390852 Y138.9735159277756 F300
G1 X120.1499061389838 Y137.88367475476437 F300
G1 X120.7060465550299 Y136.3533822344794 F300
G1 X120.72427 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle95
G0 X167.94667 Y136.00371
G1 X167.55261592780576 Y134.42389711608396 F300
G1 X166.46277475481762 Y133.21421386098788 F300
G1 X164.93248223454327 Y132.6580734449126 F300
G1 X164.58279000000002 Y132.63985000000002 F300
G1 X163.00297828753295 Y133.03390876865257 F300
G1 X161.79329827231675 Y134.12375353777637 F300
G1 X161.23716240549 Y135.65404771133544 F300
G1 X161.21894 Y136.00371 F300
G1 X161.61299407221856 Y137.58352288391 F300
G1 X162.7028352452253 Y138.79320613898932 F300
G1 X164.2331277655082 Y139.34934655504108 F300
G1 X164.58279000000002 Y139.36757 F300
G1 X166.16260522674963 Y138.9735253206423 F300
G1 X167.37229496151096 Y137.8836913398851 F300
G1 X167.92844447598108 Y136.353402126189 F300
G1 X167.94667 Y136.00371 F300;svg#svg1 > g#layer1 > path#circle96
G0 X49.890775 Y112.39250999999999
G1 X49.49672092777563 Y110.81269711609144 F300
G1 X48.40687975476443 Y109.60301386101614 F300
G1 X46.8765872344795 Y109.04687344496999 F300
G1 X46.526917 Y109.02865 F300
G1 X44.94710411609148 Y109.42270407222442 F300
G1 X43.737420861016204 Y110.51254524523564 F300
G1 X43.1812804449701 Y112.0428377655206 F300
G1 X43.163056999999995 Y112.39250999999999 F300
G1 X43.55711107222442 Y113.9723228839085 F300
G1 X44.64695224523565 Y115.18200613898377 F300
G1 X46.17724476552061 Y115.73814655502987 F300
G1 X46.526917 Y115.75636999999998 F300
G1 X48.106729649621336 Y115.36231498848966 F300
G1 X49.316412256725656 Y114.27247309625514 F300
G1 X49.87255176292827 Y112.74218024531427 F300
G1 X49.890775 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle97
G0 X97.113105 Y112.39250999999999
G1 X96.71905092777742 Y110.81269711609102 F300
G1 X95.6292097547676 Y109.60301386101447 F300
G1 X94.0989172344833 Y109.0468734449666 F300
G1 X93.749251 Y109.02865 F300
G1 X92.16943717894836 Y109.42270031507941 F300
G1 X90.95975133199353 Y110.51253861119365 F300
G1 X90.40360727657546 Y112.04282980884956 F300
G1 X90.385383 Y112.39250999999999 F300
G1 X90.77943707221907 Y113.97232288390984 F300
G1 X91.8692782452262 Y115.18200613898881 F300
G1 X93.39957076550927 Y115.73814655504009 F300
G1 X93.749251 Y115.75636999999998 F300
G1 X95.3290631810453 Y115.36231310991826 F300
G1 X96.53874449220642 Y114.27246977923834 F300
G1 X97.09488217872149 Y112.74217626698727 F300
G1 X97.113105 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle98
G0 X144.33545 Y112.39250999999999
G1 X143.94139592778146 Y110.81269711609 F300
G1 X142.85155475477472 Y109.60301386101068 F300
G1 X141.32126223449183 Y109.0468734449589 F300
G1 X140.9716 Y109.02865 F300
G1 X139.39178594466398 Y109.4226993757928 F300
G1 X138.18209944974032 Y110.51253695268183 F300
G1 X137.62595448447976 Y112.04282781967912 F300
G1 X137.60773000000003 Y112.39250999999999 F300
G1 X138.00178407221634 Y113.97232288391054 F300
G1 X139.0916252452214 Y115.18200613899138 F300
G1 X140.6219177655035 Y115.73814655504533 F300
G1 X140.97160000000002 Y115.75636999999998 F300
G1 X142.55141171246706 Y115.36231123134743 F300
G1 X143.76109172768327 Y114.27246646222363 F300
G1 X144.31722759451 Y112.74217228866455 F300
G1 X144.33545 Y112.39250999999999 F300;svg#svg1 > g#layer1 > path#circle99
G0 X191.55785 Y112.39250999999999
G1 X191.16379592780123 Y110.81269711608506 F300
G1 X190.07395475480968 Y109.60301386099206 F300
G1 X188.54366223453377 Y109.04687344492109 F300
G1 X188.19400999999996 Y109.02865 F300
G1 X186.61419477325038 Y109.4226946793577 F300
G1 X185.40450503848905 Y110.5125286601149 F300
G1 X184.84835552401893 Y112.042817873811 F300
G1 X184.83013 Y112.39250999999999 F300
G1 X185.22418407219425 Y113.97232288391604 F300
G1 X186.3140252451824 Y115.1820061390121 F300
G1 X187.84431776545674 Y115.73814655508741 F300
G1 X188.19401 Y115.75636999999998 F300
G1 X189.77382054101156 Y115.36230653492278 F300
G1 X190.98349731635804 Y114.27245816969604 F300
G1 X191.53962863396046 Y112.74216234287634 F300
G1 X191.55784999999997 Y112.39250999999999 F300
M2
`

var examples = [
    {
        name: 'star',
        gcode: STAR,
    },
    {
        name: 'circles',
        gcode: CIRCLES,
    },
]

window.addEventListener('load', (ev) => {
    var span = document.getElementById('examples-holder')
    var first = true
    examples.forEach((example) => {
        var a = document.createElement('a')

        a.innerText = example.name
        a.href = "#"
        a.addEventListener('click', (ev) => {
            document.getElementById('gcode').value = example.gcode
        })
        console.log(example.name, a)
        if (!first) {
            span.appendChild(document.createTextNode(' | '))
        }
        first = false
        span.appendChild(a)
    })
})

/***/ }),

/***/ "./src/polar.js":
/*!**********************!*\
  !*** ./src/polar.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var gcode_interpreter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gcode-interpreter */ "./node_modules/gcode-interpreter/lib/index.js");
/* harmony import */ var gcode_interpreter__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gcode_interpreter__WEBPACK_IMPORTED_MODULE_0__);


class Plotter {
    /** @type{HTMLCanvasElement} */
    canvas;
    /** @type{CanvasRenderingContext2D} */
    ctx;

    x;
    y;

    uvel = 0;
    vvel = 0;

    machineWidth = 100;
    u = 75;
    v = 75;

    penDown = true;
    penColor = '#000000';

    commandQueue = [];

    running = false;

    ppi = 1;
    feedRateScale = 1.0;

    // max ms between updates
    maxProcessDelta = 75;

    constructor(canvasId, machineWidth) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')

        this.plot = document.createElement('canvas');
        this.plot.width = this.canvas.width;
        this.plot.height = this.canvas.height;
        this.plotCtx = this.plot.getContext('2d');

        this.machineWidth = machineWidth;
        this.u = this.machineWidth / 2.0 + 10;
        this.v = this.u;

        this.physdt = 1000.0 / 240.0;
        this.lastT = performance.now()
    }

    draw() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.drawImage(this.plot, 0, 0);

        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(this.x,this.y);
        ctx.lineTo(this.machineWidth, 0);
        ctx.stroke();

        ctx.fillStyle = 'green';
        ctx.fillRect(this.x-2, this.y-2, 4, 4);

        ctx.fillText("(u, v) = (" + Math.round(this.u) + ", " + Math.round(this.v) + ")", 170, 20)
        ctx.fillText("(x, y) = (" + Math.round(this.x) + ", " + Math.round(this.y) + ")", 170, 40)
    }

    process(t) {
        var dt = t - this.lastT;

        if (dt > this.maxProcessDelta) {
            // Assume the page was off-screen.
            // Skip and start again on next frame.
            this.lastT = t;
            return;
        }
        this.plotCtx.strokeStyle = this.penColor
        this.plotCtx.beginPath();
        this.plotCtx.moveTo(this.x, this.y);
        while (dt > 0) {
            var step = Math.min(dt, this.physdt);
            this.processPhysics(step);
            this.processCommand(t);
            dt -= step;
        }
        this.plotCtx.stroke();

        

        this.draw();
        this.lastT = t;
    }

    /*
          x
        +----|---------+
        |\           _/
        | \ u      _/
      y |  \     _/   v
        |   \  _/
        |    \/
         
        u^2 = x^2 + y^2
        v^2 = (W - x)^2 + y^2 = x^2 + y^2 + W^2 - 2Wx

        v^2 - u^2 = W^2 - 2Wx
        x = (W^2 - v^2 + u^2)/2W
        y = sqrt(u^2 - x^2)
        */
    uv2xy(u, v) {
        var m = this.machineWidth;
        var x = (m*m + u*u - v*v) / (2*m);
        return {
            x: x,
            y: Math.sqrt(u*u - x*x),
        }
    }

    xy2uv(x,y) {
        var m = this.machineWidth;
        return {
            u: Math.sqrt(x*x + y*y),
            v: Math.sqrt((m-x)*(m-x) + y*y),
        }
    }
    
    processPhysics(dt) {
        this.u += this.uvel * dt;
        this.v += this.vvel * dt;

        // TODO: Check constraints for physicality.

        this.x = (this.machineWidth * this.machineWidth + this.u*this.u - this.v*this.v) / (2 * this.machineWidth);
        this.y = Math.sqrt(this.u * this.u - this.x * this.x)
        //console.log(this.machineWidth, this.x, this.y)
        if (this.penDown) {
            this.plotCtx.lineTo(this.x, this.y)
        } else {
            this.plotCtx.moveTo(this.x, this.y)
        }
    }

    processCommand(t) {
        if (this.commandQueue.length == 0) {
            return;
        }
        var cmd = this.commandQueue.shift()
        var cmds = cmd.process(this, t);
        this.commandQueue = cmds.concat(this.commandQueue);
    }

    run() {
        var self = this;
        this.running = true;
        window.requestAnimationFrame(function frame(t) {
            self.process(t)
            if (self.running) {
                window.requestAnimationFrame(frame);
            }
        })
    }

    stop() {
        this.running = false;
    }
    
    enqueueCommand(cmd) {
        this.commandQueue.push(cmd)
    }

    reset() {
        this.commandQueue = []
        this.u = this.v = this.machineWidth / 2.0 + 10;
        this.uvel = this.vvel = 0;
        this.penDown = false;
        this.plotCtx.clearRect(0, 0, this.plot.width, this.plot.height)
    }
}

// Move from current position to provided polar coordinates over some duration.
// Controls the plotters 'motors' (uvel, vvel) and waits for the duration.
class MoveCommand {
    constructor(u, v, duration) {
        this.u = u
        this.v = v
        this.duration = duration
        this.started = false
    }

    // Process handles the command and returns a list of commands that replace it.
    process(plotter, t) {
        if (!this.started) {
            this.deadline = t + this.duration
            plotter.uvel = (this.u - plotter.u) / this.duration
            plotter.vvel = (this.v - plotter.v) / this.duration
            this.started = true
        } else {
            if (t >= this.deadline) {
                plotter.uvel = 0;
                plotter.vvel = 0;
                return [];
            } else {
                // Adjust for drift
                plotter.uvel = (this.u - plotter.u) / (this.deadline - t)
                plotter.vvel = (this.v - plotter.v) / (this.deadline - t)
            }
        }
        return [this];
    }
}

// Maximum distance to move in one arc
var maxMove = 5;

// Move from current position to provided cartesian position at some speed.
// This simply replaces itself by a series of polar moves small enough to have negligible arcs.
// See CMoveCommand instead.
class CMoveCommandPieceWise {
    defaultSpeed = 0.2 // pixels per ms

    constructor(x, y, speed) {
        this.x = x
        this.y = y
        this.speed = speed || this.defaultSpeed
    }

    process(plotter, t) {
        var dx = this.x - plotter.x;
        var dy = this.y - plotter.y;

        var dist = Math.sqrt(dx*dx+dy*dy)
        var duration = dist / this.speed
        var delta = Math.sqrt(dx*dx+dy*dy);
        var steps = Math.ceil(delta / maxMove);
        var cmds = []
        for (var i = 1; i <= steps; i++) {
            var x = plotter.x + i * dx / steps
            var y = plotter.y + i * dy / steps
            var uv = plotter.xy2uv(x, y);
            cmds.push(new MoveCommand(uv.u, uv.v, duration / steps));
        }
        return cmds;
    }
}

// A cartesian move command.
// Calculates cartesian velocity and transforms to 'polar' coords.
class CMoveCommand {
    defaultSpeed = 0.2

    constructor(x, y, speed, absolute) {
        this.x = x
        this.y = y
        this.speed = speed || this.defaultSpeed
        this.absolute = absolute
        this.started = false
    }

    process(plotter, t) {
        if (!this.started) {
            // Convert to absolute coords and handle scaling.
            if (this.absolute) {
                this.x = (this.x * plotter.ppi) || plotter.x
                this.y = (this.y * plotter.ppi) || plotter.y
            } else {
                this.x = plotter.x + ((this.x * plotter.ppi) || 0)
                this.y = plotter.y + ((this.y * plotter.ppi) || 0)
            }
        }

        var dx = this.x - plotter.x
        var dy = this.y - plotter.y
        var dist = Math.sqrt(dx*dx + dy*dy)

        if (!this.started) {
            this.started = true
            this.deadline = t + (dist / this.speed)
        }
        if (t >= this.deadline) {
            plotter.uvel = 0
            plotter.vvel = 0
            // var errx =  plotter.x - this.x
            // var erry = plotter.y - this.y 
            // var err = Math.sqrt(errx*errx + erry*erry)
            return []
        }

        /*
            Coord transform (Jacobian matrix):

            u^2 = x^2 + y^2
            v^2 = (W - x)^2 + y^2 = x^2 + y^2 + W^2 - 2Wx

            2 u du = 2x dx + 2 y dy
            du = (x/u)dx + (y/u)dy
            
            2 v dv = 2(x-W) dx + 2y dy
            dv = ((x-W)/v)dx + (y/v)dy
        */
        var du = dx * plotter.x / plotter.u + dy * plotter.y / plotter.u
        var dv = dx * (plotter.x - plotter.machineWidth)/plotter.v + dy * plotter.y / plotter.v
        
        plotter.uvel = this.speed * du / dist
        plotter.vvel = this.speed * dv / dist
        return [this]
    }
}

class PenCommand {
    constructor(penDown) {
        this.penDown = penDown
    }

    process(plotter, t) {
        plotter.penDown = this.penDown
        return []
    }
}

function makeInterpreter(plotter) {
    var absolute = true

    const handlers = {
        'G0': (params) => {
            plotter.enqueueCommand(new PenCommand(false))
            plotter.enqueueCommand(new CMoveCommand(params.X, params.Y, 0, absolute))
        },
        'G1': (params) => {
            plotter.enqueueCommand(new PenCommand(true))
            plotter.enqueueCommand(new CMoveCommand(params.X, params.Y, params.F/60000.0*plotter.feedRateScale, absolute))
        },
        'G90': (params) => {
            absolute = true;
        },
        'G91': (params) => {
            absolute = false;
        }
    }
    var gi = new (gcode_interpreter__WEBPACK_IMPORTED_MODULE_0___default())({
        handlers: handlers,
        defaultHandler: (cmd, params) => {
            console.log("Unhandled command", cmd, params)
        }
    })
    return gi;
}

// Main entry point.
window.addEventListener('load', function() {
    var p = new Plotter('canvas', 400);
    var interp = makeInterpreter(p)
    p.run();

    document.getElementById('submit-gcode').addEventListener('click', (ev) => {
        var gcode = document.getElementById('gcode').value
        //var maxArcStep = parseFloat(document.getElementById('max-arc-step').value) || 5
        var feedRateScale = parseFloat(document.getElementById('feed-rate-scale').value) || 20
        var ppi = parseFloat(document.getElementById('pixels-per-inch').value) || 1
        var penColor = document.getElementById('pen-color').value || '#000000';

        plotter.ppi = ppi
        plotter.feedRateScale = feedRateScale
        plotter.penColor = penColor
        interp.loadFromString(gcode, (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
        })
        .on('data', (data) => {
        })
        .on('end', (results) => {
        })
    });

    document.getElementById('reset').addEventListener('click', (ev) => {
        p.reset()
    });

    // for debugging / interactivity
    window.plotter = p
})

/***/ }),

/***/ "?5874":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?ed1b":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?d17e":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var process_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");
/* harmony import */ var process_browser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(process_browser__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js");
/* harmony import */ var _polar_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./polar.js */ "./src/polar.js");
/* harmony import */ var _examples_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./examples.js */ "./src/examples.js");
/* harmony import */ var _examples_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_examples_js__WEBPACK_IMPORTED_MODULE_3__);

window.process = (process_browser__WEBPACK_IMPORTED_MODULE_0___default())

;
window.Buffer = buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer

;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQVk7O0FBRVosa0JBQWtCO0FBQ2xCLG1CQUFtQjtBQUNuQixxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxTQUFTO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMkMsVUFBVTtBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVk7O0FBRVosZUFBZSxtQkFBTyxDQUFDLG9EQUFXO0FBQ2xDLGdCQUFnQixtQkFBTyxDQUFDLGdEQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQWM7QUFDZCxrQkFBa0I7QUFDbEIseUJBQXlCOztBQUV6QjtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGlCQUFpQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGVBQWU7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EseUJBQXlCLFFBQVE7QUFDakM7QUFDQSxzQkFBc0IsZUFBZTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsU0FBUztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxxQkFBcUIsV0FBVyxHQUFHLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQSxnQkFBZ0IsV0FBVyxHQUFHLElBQUksS0FBSyxhQUFhO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsTUFBTTtBQUN0Qjs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsbUJBQW1CLEtBQUssbURBQW1ELGNBQWM7QUFDekYsR0FBRztBQUNIO0FBQ0E7QUFDQSwrQkFBK0IsSUFBSTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLE1BQU0sYUFBYSxTQUFTO0FBQ3REO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsZ0JBQWdCO0FBQ3pCLGNBQWMsb0JBQW9CLEVBQUUsSUFBSTtBQUN4QztBQUNBLFlBQVksZ0JBQWdCLEVBQUUsSUFBSTtBQUNsQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsR0FBRyxTQUFTLEdBQUcsS0FBSyxxQkFBcUIsRUFBRSxFQUFFO0FBQ3BFLFFBQVE7QUFDUix5QkFBeUIsR0FBRyxLQUFLLHlCQUF5QixFQUFFLEVBQUU7QUFDOUQsbUJBQW1CLHlCQUF5QixFQUFFLEVBQUU7QUFDaEQ7QUFDQSxNQUFNO0FBQ04sb0JBQW9CLElBQUksRUFBRSxHQUFHLFNBQVMsSUFBSSxFQUFFLEVBQUU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDLGNBQWMsU0FBUyxPQUFPO0FBQ3hFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLFlBQVk7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixnQkFBZ0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsZ0JBQWdCO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsUUFBUTtBQUMxQjtBQUNBLG9CQUFvQixRQUFRO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxvQkFBb0IsU0FBUztBQUM3QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBLGtDQUFrQyxRQUFRO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVMseUJBQXlCO0FBQ2xDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhEQUE4RCxZQUFZO0FBQzFFO0FBQ0EsOERBQThELFlBQVk7QUFDMUU7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxZQUFZO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDaGZhOztBQUViLDhDQUE2QztBQUM3QztBQUNBLENBQUMsRUFBQzs7QUFFRixpQ0FBaUMsMkNBQTJDLGdCQUFnQixrQkFBa0IsT0FBTywyQkFBMkIsd0RBQXdELGdDQUFnQyx1REFBdUQsK0RBQStELHlEQUF5RCxxRUFBcUUsNkRBQTZELHdCQUF3QixJQUFJOzs7QUFHcmpCLG1CQUFtQixtQkFBTyxDQUFDLDhEQUFjOztBQUV6QyxrREFBa0QsMENBQTBDOztBQUU1Rjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxvQkFBb0Isa0JBQWtCO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVTtBQUNWLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsaUJBQWlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRCQUE0QixpQkFBaUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxDQUFDOztBQUVELGtCQUFlOzs7Ozs7Ozs7OztBQ2xORjs7QUFFYixtQkFBbUIsbUJBQU8sQ0FBQywwRUFBZTs7QUFFMUM7O0FBRUEsdUNBQXVDLHVDQUF1Qzs7QUFFOUU7Ozs7Ozs7Ozs7O0FDUmE7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0YsdUJBQXVCLEdBQUcsbUJBQW1CLEdBQUcscUJBQXFCLEdBQUcsaUJBQWlCLEdBQUcsbUJBQW1CLEdBQUcsaUJBQWlCLEdBQUcsdUJBQXVCOztBQUU3SixxQ0FBcUMsbUJBQU8sQ0FBQywrQ0FBUTs7QUFFckQsaUNBQWlDLG1CQUFPLENBQUMsaUJBQUk7O0FBRTdDLHFDQUFxQyxtQkFBTyxDQUFDLHdEQUFROztBQUVyRCxzQ0FBc0MsbUJBQU8sQ0FBQyx5REFBUTs7QUFFdEQsd0NBQXdDLDZCQUE2QixjQUFjLE9BQU8saUJBQWlCLG1CQUFtQix1QkFBdUIsc0RBQXNELHNIQUFzSCw0QkFBNEIsNENBQTRDLE9BQU8sZ0NBQWdDLHlCQUF5Qjs7QUFFemMsdUNBQXVDLHVDQUF1Qzs7QUFFOUUsd0JBQXdCLDJFQUEyRSxrQ0FBa0Msd0JBQXdCLE9BQU8sa0NBQWtDLG1JQUFtSTs7QUFFelUsa0RBQWtELDBDQUEwQzs7QUFFNUYsNENBQTRDLGdCQUFnQixrQkFBa0IsT0FBTywyQkFBMkIsd0RBQXdELGdDQUFnQyx1REFBdUQ7O0FBRS9QLDhEQUE4RCxzRUFBc0UsOERBQThEOztBQUVsTSxrREFBa0QsMEVBQTBFLGVBQWU7O0FBRTNJLDhCQUE4QixnR0FBZ0csbURBQW1EOztBQUVqTCx3Q0FBd0MsdUJBQXVCLHlGQUF5Rjs7QUFFeEosMkNBQTJDLCtEQUErRCw2RUFBNkUseUVBQXlFLGVBQWUsdURBQXVELEdBQUc7O0FBRXpVLGlDQUFpQyw0RUFBNEUsaUJBQWlCLGFBQWE7O0FBRTNJLGlDQUFpQyxnQkFBZ0Isc0JBQXNCLE9BQU8sdURBQXVELG1DQUFtQywwREFBMEQsc0ZBQXNGLGlFQUFpRSxNQUFNLGlDQUFpQyw0Q0FBNEMsS0FBSzs7QUFFamQsNENBQTRDLGtCQUFrQixrQ0FBa0Msb0VBQW9FLEtBQUssT0FBTyxvQkFBb0I7O0FBRXBNOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxJQUFJLFdBQVcsT0FBTztBQUN2QixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTs7O0FBR3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHdCQUF3QiwwQ0FBMEM7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUcsV0FBVyxRQUFROzs7QUFHdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxvQkFBb0IsY0FBYztBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7OztBQUdBO0FBQ0EsNENBQTRDOztBQUU1Qyw4QkFBOEIsT0FBTzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZOztBQUVaLFlBQVk7O0FBRVo7O0FBRUEsb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7OztBQUdSLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7OztBQUdSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07OztBQUdOLG1EQUFtRDs7QUFFbkQ7O0FBRUE7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBLENBQUMsSUFBSSxXQUFXLFFBQVE7QUFDeEIsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsVUFBVTs7O0FBR3JCLGlCQUFpQjs7QUFFakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQSxHQUFHLFdBQVcsUUFBUTtBQUN0QixXQUFXLFNBQVM7QUFDcEIsV0FBVyxVQUFVOzs7QUFHckIsbUJBQW1COztBQUVuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQSxHQUFHLFdBQVcsUUFBUTtBQUN0QixXQUFXLFNBQVM7QUFDcEIsV0FBVyxVQUFVOzs7QUFHckIscUJBQXFCOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1COztBQUVuQjtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQixrQkFBa0I7QUFDcEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsR0FBRyxXQUFXLFFBQVE7QUFDdEIsV0FBVyxTQUFTOzs7QUFHcEIsdUJBQXVCOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsU0FBUztBQUN0QixhQUFhLFNBQVM7QUFDdEI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUEsb0NBQW9DO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7OztBQUdSO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRCx1QkFBdUI7Ozs7Ozs7Ozs7QUM5YnZCO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUyxXQUFXOztBQUVwQjtBQUNBO0FBQ0E7QUFDQSxTQUFTLFdBQVc7O0FBRXBCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsV0FBVzs7QUFFcEI7QUFDQTtBQUNBLFNBQVMsVUFBVTs7QUFFbkI7QUFDQTs7Ozs7Ozs7Ozs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMxQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBOztBQUVBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7Ozs7Ozs7Ozs7OztBQ3ZMaEI7O0FBRWIsZ0RBQWdELDBEQUEwRCwyQ0FBMkM7O0FBRXJKOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLG9CQUFvQjs7Ozs7Ozs7Ozs7O0FDOUhwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGtGQUFvQjtBQUMzQyxlQUFlLG1CQUFPLENBQUMsa0ZBQW9CO0FBQzNDLG1CQUFPLENBQUMsNkRBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDN0hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0EsZ0JBQWdCLG1CQUFPLENBQUMsb0ZBQXFCO0FBQzdDLG1CQUFPLENBQUMsNkRBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUyxtRkFBOEI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLG1CQUFPLENBQUMsd0dBQTJCO0FBQ2hEOztBQUVBLGFBQWEsNEVBQXdCO0FBQ3JDLDRCQUE0QixxQkFBTSxtQkFBbUIscUJBQU0sbUZBQW1GO0FBQzlJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixtQkFBTyxDQUFDLG1CQUFNO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFPLENBQUMsMEdBQWdDO0FBQ3pELGtCQUFrQixtQkFBTyxDQUFDLGtHQUE0QjtBQUN0RCxlQUFlLG1CQUFPLENBQUMsOEZBQTBCO0FBQ2pEO0FBQ0EscUJBQXFCLGdHQUEwQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFPLENBQUMsNkRBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFLG1GQUFtRjtBQUM1SjtBQUNBO0FBQ0EscUJBQXFCLG1CQUFPLENBQUMsOEVBQWtCO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxpSEFBd0M7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixtQkFBTyxDQUFDLDhFQUFrQjtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRkFBK0Y7QUFDL0YsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLDRGQUE0RjtBQUM1RixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQyxpSEFBd0M7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0RUFBNEU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHlCQUF5QjtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsbUJBQU8sQ0FBQyxnSEFBbUM7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQSxtREFBbUQsK0RBQStEO0FBQ2xIO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1CQUFPLENBQUMsb0dBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsT0FBTztBQUN4QztBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNsZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsYUFBYTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQSxxQkFBcUIsZ0dBQTBCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLDhFQUFrQjtBQUN2QyxtQkFBTyxDQUFDLDZEQUFVO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGdFQUFnQjtBQUNyQztBQUNBOztBQUVBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLHdHQUEyQjtBQUNoRDs7QUFFQSxhQUFhLDRFQUF3QjtBQUNyQyw0QkFBNEIscUJBQU0sbUJBQW1CLHFCQUFNLG1GQUFtRjtBQUM5STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsbUJBQU8sQ0FBQyxrR0FBNEI7QUFDdEQsZUFBZSxtQkFBTyxDQUFDLDhGQUEwQjtBQUNqRDtBQUNBLHFCQUFxQixnR0FBMEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQU8sQ0FBQyw2REFBVTtBQUNsQjtBQUNBO0FBQ0EscUJBQXFCLG1CQUFPLENBQUMsOEVBQWtCO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSTtBQUNKLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixtQkFBTyxDQUFDLDhFQUFrQjs7QUFFL0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0Usc0RBQXNEO0FBQzlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNob0JhOztBQUViO0FBQ0EsNENBQTRDLDJCQUEyQixrQkFBa0Isa0NBQWtDLG9FQUFvRSxLQUFLLE9BQU8sb0JBQW9CO0FBQy9OLCtCQUErQix1Q0FBdUM7QUFDdEUscUNBQXFDLCtEQUErRCxzQ0FBc0MsMEJBQTBCLCtDQUErQyx5Q0FBeUMsdUVBQXVFO0FBQ25VLGVBQWUsbUJBQU8sQ0FBQyw2RkFBaUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsaUVBQWlFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLHlGQUF5RjtBQUN6RjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbkxhOztBQUViLDJDQUEyQyxnQ0FBZ0Msb0NBQW9DLG9EQUFvRCw2REFBNkQsaUVBQWlFLHNDQUFzQztBQUN2VSxpQ0FBaUMsZ0JBQWdCLHNCQUFzQixPQUFPLHVEQUF1RCw2REFBNkQsNENBQTRDLG9LQUFvSyxtRkFBbUYsS0FBSztBQUMxZSw0Q0FBNEMsMkJBQTJCLGtCQUFrQixrQ0FBa0Msb0VBQW9FLEtBQUssT0FBTyxvQkFBb0I7QUFDL04sa0RBQWtELDBDQUEwQztBQUM1Riw0Q0FBNEMsZ0JBQWdCLGtCQUFrQixPQUFPLDJCQUEyQix3REFBd0QsZ0NBQWdDLHVEQUF1RDtBQUMvUCw4REFBOEQsc0VBQXNFLDhEQUE4RCxrREFBa0QsaUJBQWlCLEdBQUc7QUFDeFEsK0JBQStCLHVDQUF1QztBQUN0RSxxQ0FBcUMsK0RBQStELHNDQUFzQywwQkFBMEIsK0NBQStDLHlDQUF5Qyx1RUFBdUU7QUFDblUsZUFBZSxtQkFBTyxDQUFDLDhDQUFRO0FBQy9CO0FBQ0EsZ0JBQWdCLG1CQUFPLENBQUMsbUJBQU07QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQyxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EseURBQXlELGNBQWM7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQ3RMWTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0ZBQXdGO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMvRkE7QUFDQTs7QUFFYTs7QUFFYixpQ0FBaUMsc0dBQWdDO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0UsYUFBYTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3JGQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNHQUFnQztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILCtCQUErQixtQkFBTyxDQUFDLDZGQUFpQjtBQUN4RDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFLGFBQWE7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3JGYTs7QUFFYiw0QkFBNEIsc0dBQWdDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNyQkEsa0dBQStDOzs7Ozs7Ozs7OztBQ0EvQztBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLDhDQUFRO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUUsY0FBYztBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDaEVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJDQUEyQyx1QkFBdUI7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMsc0NBQXNDLHFCQUFNLDBCQUEwQixxQkFBTTs7Ozs7Ozs7Ozs7QUN6TDdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUyxtRkFBOEI7QUFDdkMsZUFBZSxtQkFBTyxDQUFDLDZEQUFVOztBQUVqQztBQUNBLGtCQUFrQixtQkFBTyxDQUFDLHVHQUF5QztBQUNuRSxrQkFBa0IsbUJBQU8sQ0FBQyx1R0FBeUM7QUFDbkUsZ0JBQWdCLG1CQUFPLENBQUMsbUdBQXVDO0FBQy9ELG1CQUFtQixtQkFBTyxDQUFDLHlHQUEwQztBQUNyRSxxQkFBcUIsbUJBQU8sQ0FBQyw2R0FBNEM7QUFDekUsa0JBQWtCLG1CQUFPLENBQUMsbUlBQXVEO0FBQ2pGLGtCQUFrQixtQkFBTyxDQUFDLHlIQUFrRDs7QUFFNUU7QUFDQTs7OztBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViOztBQUVBLGFBQWEsc0ZBQTZCO0FBQzFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixzQ0FBc0Msc0NBQXNDO0FBQ3pHO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3ZTQSxvQkFBb0IscUJBQU0sb0JBQW9CLHFCQUFNO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixHQUFHLGNBQWM7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsbUJBQU8sQ0FBQyxpRUFBYztBQUN0QjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEIsK0JBQStCLHFCQUFNLG9CQUFvQixxQkFBTTtBQUMvRDtBQUNBLHNCQUFzQjtBQUN0QixpQ0FBaUMscUJBQU0sb0JBQW9CLHFCQUFNO0FBQ2pFOzs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUyxxQkFBTTtBQUNmLElBQUk7QUFDSjtBQUNBO0FBQ0EsWUFBWSxxQkFBTTtBQUNsQjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pFQSxnQkFBZ0I7QUFDaEI7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkI7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdDVFMEM7QUFDM0M7QUFDQTtBQUNBLGNBQWMsbUJBQW1CO0FBQ2pDO0FBQ0EsY0FBYywwQkFBMEI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLFlBQVk7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsMERBQVc7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7OztBQzlYRDs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOcUM7QUFDckMsaUJBQWlCLHdEQUFPOztBQUV4QixDQUEyQjtBQUMzQixnQkFBZ0IsMENBQWE7O0FBRTdCLENBQW1CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL2djb2RlLWludGVycHJldGVyL2xpYi9JbnRlcnByZXRlci5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9nY29kZS1pbnRlcnByZXRlci9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvZ2NvZGUtcGFyc2VyL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9lcnJvcnMtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fZHVwbGV4LmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9wYXNzdGhyb3VnaC5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fcmVhZGFibGUuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fd3JpdGFibGUuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9pbnRlcm5hbC9zdHJlYW1zL2FzeW5jX2l0ZXJhdG9yLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvaW50ZXJuYWwvc3RyZWFtcy9idWZmZXJfbGlzdC5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveS5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvZW5kLW9mLXN0cmVhbS5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvZnJvbS1icm93c2VyLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvaW50ZXJuYWwvc3RyZWFtcy9waXBlbGluZS5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvc3RhdGUuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9pbnRlcm5hbC9zdHJlYW1zL3N0cmVhbS1icm93c2VyLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3NhZmUtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvc3RyZWFtLWJyb3dzZXJpZnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvc3RyaW5nX2RlY29kZXIvbGliL3N0cmluZ19kZWNvZGVyLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvdXRpbC1kZXByZWNhdGUvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL3NyYy9leGFtcGxlcy5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL3NyYy9wb2xhci5qcyIsIndlYnBhY2s6Ly9wb2xhci9pZ25vcmVkfC9ob21lL3JlcGhvcm0vY29kZS9wb2xhci9ub2RlX21vZHVsZXMvZ2NvZGUtcGFyc2VyL2xpYnxmcyIsIndlYnBhY2s6Ly9wb2xhci9pZ25vcmVkfC9ob21lL3JlcGhvcm0vY29kZS9wb2xhci9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9pbnRlcm5hbC9zdHJlYW1zfHV0aWwiLCJ3ZWJwYWNrOi8vcG9sYXIvaWdub3JlZHwvaG9tZS9yZXBob3JtL2NvZGUvcG9sYXIvbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWJ8dXRpbCIsIndlYnBhY2s6Ly9wb2xhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wb2xhci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9wb2xhci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcG9sYXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9wb2xhci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BvbGFyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgdmFyIGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXSArXG4gICAgICAnPT0nXG4gICAgKVxuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDEwXSArXG4gICAgICBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl0gK1xuICAgICAgJz0nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG5jb25zdCBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxuY29uc3QgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuY29uc3QgY3VzdG9tSW5zcGVjdFN5bWJvbCA9XG4gICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2xbJ2ZvciddID09PSAnZnVuY3Rpb24nKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxuICAgID8gU3ltYm9sWydmb3InXSgnbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxuICAgIDogbnVsbFxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbmNvbnN0IEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgY29uc3QgcHJvdG8gPSB7IGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfSB9XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHByb3RvLCBVaW50OEFycmF5LnByb3RvdHlwZSlcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYXJyLCBwcm90bylcbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MlxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdwYXJlbnQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHRoaXMpKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ5dGVPZmZzZXRcbiAgfVxufSlcblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA+IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgbGVuZ3RoICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYnVmLCBCdWZmZXIucHJvdG90eXBlKVxuICByZXR1cm4gYnVmXG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1RoZSBcInN0cmluZ1wiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuIFJlY2VpdmVkIHR5cGUgbnVtYmVyJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUoYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuZnVuY3Rpb24gZnJvbSAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5Vmlldyh2YWx1ZSlcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAgICdvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB2YWx1ZSlcbiAgICApXG4gIH1cblxuICBpZiAoaXNJbnN0YW5jZSh2YWx1ZSwgQXJyYXlCdWZmZXIpIHx8XG4gICAgICAodmFsdWUgJiYgaXNJbnN0YW5jZSh2YWx1ZS5idWZmZXIsIEFycmF5QnVmZmVyKSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgKGlzSW5zdGFuY2UodmFsdWUsIFNoYXJlZEFycmF5QnVmZmVyKSB8fFxuICAgICAgKHZhbHVlICYmIGlzSW5zdGFuY2UodmFsdWUuYnVmZmVyLCBTaGFyZWRBcnJheUJ1ZmZlcikpKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICApXG4gIH1cblxuICBjb25zdCB2YWx1ZU9mID0gdmFsdWUudmFsdWVPZiAmJiB2YWx1ZS52YWx1ZU9mKClcbiAgaWYgKHZhbHVlT2YgIT0gbnVsbCAmJiB2YWx1ZU9mICE9PSB2YWx1ZSkge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh2YWx1ZU9mLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBjb25zdCBiID0gZnJvbU9iamVjdCh2YWx1ZSlcbiAgaWYgKGIpIHJldHVybiBiXG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1ByaW1pdGl2ZSAhPSBudWxsICYmXG4gICAgICB0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdKCdzdHJpbmcnKSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAnVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgJyArXG4gICAgJ29yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHZhbHVlKVxuICApXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20odmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gTm90ZTogQ2hhbmdlIHByb3RvdHlwZSAqYWZ0ZXIqIEJ1ZmZlci5mcm9tIGlzIGRlZmluZWQgdG8gd29ya2Fyb3VuZCBDaHJvbWUgYnVnOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC8xNDhcbk9iamVjdC5zZXRQcm90b3R5cGVPZihCdWZmZXIucHJvdG90eXBlLCBVaW50OEFycmF5LnByb3RvdHlwZSlcbk9iamVjdC5zZXRQcm90b3R5cGVPZihCdWZmZXIsIFVpbnQ4QXJyYXkpXG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyBzaXplICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2Moc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlIChzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgfVxuXG4gIGNvbnN0IGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIGxldCBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuXG4gIGNvbnN0IGFjdHVhbCA9IGJ1Zi53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgYnVmID0gYnVmLnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAoYXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIGNvbnN0IGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBidWZbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5VmlldyAoYXJyYXlWaWV3KSB7XG4gIGlmIChpc0luc3RhbmNlKGFycmF5VmlldywgVWludDhBcnJheSkpIHtcbiAgICBjb25zdCBjb3B5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlWaWV3KVxuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIoY29weS5idWZmZXIsIGNvcHkuYnl0ZU9mZnNldCwgY29weS5ieXRlTGVuZ3RoKVxuICB9XG4gIHJldHVybiBmcm9tQXJyYXlMaWtlKGFycmF5Vmlldylcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyIChhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcIm9mZnNldFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wibGVuZ3RoXCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGxldCBidWZcbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihidWYsIEJ1ZmZlci5wcm90b3R5cGUpXG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0IChvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgY29uc3QgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICBjb25zdCBidWYgPSBjcmVhdGVCdWZmZXIobGVuKVxuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBidWZcbiAgICB9XG5cbiAgICBvYmouY29weShidWYsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gYnVmXG4gIH1cblxuICBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBudW1iZXJJc05hTihvYmoubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcigwKVxuICAgIH1cbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmopXG4gIH1cblxuICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqLmRhdGEpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IEtfTUFYX0xFTkdUSGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsgS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyID09PSB0cnVlICYmXG4gICAgYiAhPT0gQnVmZmVyLnByb3RvdHlwZSAvLyBzbyBCdWZmZXIuaXNCdWZmZXIoQnVmZmVyLnByb3RvdHlwZSkgd2lsbCBiZSBmYWxzZVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKGlzSW5zdGFuY2UoYSwgVWludDhBcnJheSkpIGEgPSBCdWZmZXIuZnJvbShhLCBhLm9mZnNldCwgYS5ieXRlTGVuZ3RoKVxuICBpZiAoaXNJbnN0YW5jZShiLCBVaW50OEFycmF5KSkgYiA9IEJ1ZmZlci5mcm9tKGIsIGIub2Zmc2V0LCBiLmJ5dGVMZW5ndGgpXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcImJ1ZjFcIiwgXCJidWYyXCIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknXG4gICAgKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgbGV0IHggPSBhLmxlbmd0aFxuICBsZXQgeSA9IGIubGVuZ3RoXG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICBsZXQgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIGxldCBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgbGV0IGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoaXNJbnN0YW5jZShidWYsIFVpbnQ4QXJyYXkpKSB7XG4gICAgICBpZiAocG9zICsgYnVmLmxlbmd0aCA+IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuICAgICAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICBidWYsXG4gICAgICAgICAgcG9zXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgfVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IGlzSW5zdGFuY2Uoc3RyaW5nLCBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInN0cmluZ1wiIGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIG9yIEFycmF5QnVmZmVyLiAnICtcbiAgICAgICdSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2Ygc3RyaW5nXG4gICAgKVxuICB9XG5cbiAgY29uc3QgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBjb25zdCBtdXN0TWF0Y2ggPSAoYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdID09PSB0cnVlKVxuICBpZiAoIW11c3RNYXRjaCAmJiBsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIGxldCBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHtcbiAgICAgICAgICByZXR1cm4gbXVzdE1hdGNoID8gLTEgOiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICB9XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICBsZXQgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcmNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhpcyBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIChhbmQgdGhlIGBpcy1idWZmZXJgIG5wbSBwYWNrYWdlKVxuLy8gdG8gZGV0ZWN0IGEgQnVmZmVyIGluc3RhbmNlLiBJdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgYGluc3RhbmNlb2YgQnVmZmVyYFxuLy8gcmVsaWFibHkgaW4gYSBicm93c2VyaWZ5IGNvbnRleHQgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBtdWx0aXBsZSBkaWZmZXJlbnRcbi8vIGNvcGllcyBvZiB0aGUgJ2J1ZmZlcicgcGFja2FnZSBpbiB1c2UuIFRoaXMgbWV0aG9kIHdvcmtzIGV2ZW4gZm9yIEJ1ZmZlclxuLy8gaW5zdGFuY2VzIHRoYXQgd2VyZSBjcmVhdGVkIGZyb20gYW5vdGhlciBjb3B5IG9mIHRoZSBgYnVmZmVyYCBwYWNrYWdlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTU0XG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICBjb25zdCBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZyA9IEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmdcblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICBsZXQgc3RyID0gJydcbiAgY29uc3QgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLnJlcGxhY2UoLyguezJ9KS9nLCAnJDEgJykudHJpbSgpXG4gIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cbmlmIChjdXN0b21JbnNwZWN0U3ltYm9sKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGVbY3VzdG9tSW5zcGVjdFN5bWJvbF0gPSBCdWZmZXIucHJvdG90eXBlLmluc3BlY3Rcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKGlzSW5zdGFuY2UodGFyZ2V0LCBVaW50OEFycmF5KSkge1xuICAgIHRhcmdldCA9IEJ1ZmZlci5mcm9tKHRhcmdldCwgdGFyZ2V0Lm9mZnNldCwgdGFyZ2V0LmJ5dGVMZW5ndGgpXG4gIH1cbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidGFyZ2V0XCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheS4gJyArXG4gICAgICAnUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB0YXJnZXQpXG4gICAgKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgbGV0IHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIGxldCB5ID0gZW5kIC0gc3RhcnRcbiAgY29uc3QgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICBjb25zdCB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICBjb25zdCB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAobnVtYmVySXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmICh0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbdmFsXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgbGV0IGluZGV4U2l6ZSA9IDFcbiAgbGV0IGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgbGV0IHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgbGV0IGlcbiAgaWYgKGRpcikge1xuICAgIGxldCBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGxldCBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgY29uc3QgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGxldCBpXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCA+Pj4gMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgbGV0IGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICBjb25zdCByZXMgPSBbXVxuXG4gIGxldCBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICBjb25zdCBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICBsZXQgY29kZVBvaW50ID0gbnVsbFxuICAgIGxldCBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpXG4gICAgICA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpXG4gICAgICAgICAgPyAzXG4gICAgICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRilcbiAgICAgICAgICAgICAgPyAyXG4gICAgICAgICAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgbGV0IHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxuY29uc3QgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIGNvbnN0IGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgbGV0IHJlcyA9ICcnXG4gIGxldCBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBsZXQgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgbGV0IHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgY29uc3QgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIGxldCBvdXQgPSAnJ1xuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSBoZXhTbGljZUxvb2t1cFRhYmxlW2J1ZltpXV1cbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGNvbnN0IGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIGxldCByZXMgPSAnJ1xuICAvLyBJZiBieXRlcy5sZW5ndGggaXMgb2RkLCB0aGUgbGFzdCA4IGJpdHMgbXVzdCBiZSBpZ25vcmVkIChzYW1lIGFzIG5vZGUuanMpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICBjb25zdCBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIGNvbnN0IG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG5ld0J1ZiwgQnVmZmVyLnByb3RvdHlwZSlcblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50TEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXRdXG4gIGxldCBtdWwgPSAxXG4gIGxldCBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnRCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIGxldCB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgbGV0IG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50OCA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MTZMRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQxNkJFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDMyTEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MzJCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdVSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiByZWFkQmlnVUludDY0TEUgKG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgY29uc3QgZmlyc3QgPSB0aGlzW29mZnNldF1cbiAgY29uc3QgbGFzdCA9IHRoaXNbb2Zmc2V0ICsgN11cbiAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQgfHwgbGFzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYm91bmRzRXJyb3Iob2Zmc2V0LCB0aGlzLmxlbmd0aCAtIDgpXG4gIH1cblxuICBjb25zdCBsbyA9IGZpcnN0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMjRcblxuICBjb25zdCBoaSA9IHRoaXNbKytvZmZzZXRdICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICBsYXN0ICogMiAqKiAyNFxuXG4gIHJldHVybiBCaWdJbnQobG8pICsgKEJpZ0ludChoaSkgPDwgQmlnSW50KDMyKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEJpZ1VJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdVSW50NjRCRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IGhpID0gZmlyc3QgKiAyICoqIDI0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XVxuXG4gIGNvbnN0IGxvID0gdGhpc1srK29mZnNldF0gKiAyICoqIDI0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICBsYXN0XG5cbiAgcmV0dXJuIChCaWdJbnQoaGkpIDw8IEJpZ0ludCgzMikpICsgQmlnSW50KGxvKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgbGV0IHZhbCA9IHRoaXNbb2Zmc2V0XVxuICBsZXQgbXVsID0gMVxuICBsZXQgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIGxldCBpID0gYnl0ZUxlbmd0aFxuICBsZXQgbXVsID0gMVxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgY29uc3QgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIGNvbnN0IHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdJbnQ2NExFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdJbnQ2NExFIChvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGNvbnN0IGZpcnN0ID0gdGhpc1tvZmZzZXRdXG4gIGNvbnN0IGxhc3QgPSB0aGlzW29mZnNldCArIDddXG4gIGlmIChmaXJzdCA9PT0gdW5kZWZpbmVkIHx8IGxhc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgdGhpcy5sZW5ndGggLSA4KVxuICB9XG5cbiAgY29uc3QgdmFsID0gdGhpc1tvZmZzZXQgKyA0XSArXG4gICAgdGhpc1tvZmZzZXQgKyA1XSAqIDIgKiogOCArXG4gICAgdGhpc1tvZmZzZXQgKyA2XSAqIDIgKiogMTYgK1xuICAgIChsYXN0IDw8IDI0KSAvLyBPdmVyZmxvd1xuXG4gIHJldHVybiAoQmlnSW50KHZhbCkgPDwgQmlnSW50KDMyKSkgK1xuICAgIEJpZ0ludChmaXJzdCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDI0KVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkQmlnSW50NjRCRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiByZWFkQmlnSW50NjRCRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IHZhbCA9IChmaXJzdCA8PCAyNCkgKyAvLyBPdmVyZmxvd1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdXG5cbiAgcmV0dXJuIChCaWdJbnQodmFsKSA8PCBCaWdJbnQoMzIpKSArXG4gICAgQmlnSW50KHRoaXNbKytvZmZzZXRdICogMiAqKiAyNCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgbGFzdClcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludExFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIGxldCBtdWwgPSAxXG4gIGxldCBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50QkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgbGV0IGkgPSBieXRlTGVuZ3RoIC0gMVxuICBsZXQgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQ4ID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDE2TEUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQxNkJFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MzJMRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDMyQkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gd3J0QmlnVUludDY0TEUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbWluLCBtYXgpIHtcbiAgY2hlY2tJbnRCSSh2YWx1ZSwgbWluLCBtYXgsIGJ1Ziwgb2Zmc2V0LCA3KVxuXG4gIGxldCBsbyA9IE51bWJlcih2YWx1ZSAmIEJpZ0ludCgweGZmZmZmZmZmKSlcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0KytdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxldCBoaSA9IE51bWJlcih2YWx1ZSA+PiBCaWdJbnQoMzIpICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgcmV0dXJuIG9mZnNldFxufVxuXG5mdW5jdGlvbiB3cnRCaWdVSW50NjRCRSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBtaW4sIG1heCkge1xuICBjaGVja0ludEJJKHZhbHVlLCBtaW4sIG1heCwgYnVmLCBvZmZzZXQsIDcpXG5cbiAgbGV0IGxvID0gTnVtYmVyKHZhbHVlICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0ICsgN10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCArIDZdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQgKyA1XSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0ICsgNF0gPSBsb1xuICBsZXQgaGkgPSBOdW1iZXIodmFsdWUgPj4gQmlnSW50KDMyKSAmIEJpZ0ludCgweGZmZmZmZmZmKSlcbiAgYnVmW29mZnNldCArIDNdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQgKyAyXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0ICsgMV0gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldF0gPSBoaVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlQmlnVUludDY0TEUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gd3JpdGVCaWdVSW50NjRMRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NExFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIEJpZ0ludCgwKSwgQmlnSW50KCcweGZmZmZmZmZmZmZmZmZmZmYnKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdVSW50NjRCRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ1VJbnQ2NEJFICh2YWx1ZSwgb2Zmc2V0ID0gMCkge1xuICByZXR1cm4gd3J0QmlnVUludDY0QkUodGhpcywgdmFsdWUsIG9mZnNldCwgQmlnSW50KDApLCBCaWdJbnQoJzB4ZmZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICBsZXQgaSA9IDBcbiAgbGV0IG11bCA9IDFcbiAgbGV0IHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICBsZXQgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIGxldCBtdWwgPSAxXG4gIGxldCBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlQmlnSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ0ludDY0TEUgKHZhbHVlLCBvZmZzZXQgPSAwKSB7XG4gIHJldHVybiB3cnRCaWdVSW50NjRMRSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAtQmlnSW50KCcweDgwMDAwMDAwMDAwMDAwMDAnKSwgQmlnSW50KCcweDdmZmZmZmZmZmZmZmZmZmYnKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHdyaXRlQmlnSW50NjRCRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NEJFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIC1CaWdJbnQoJzB4ODAwMDAwMDAwMDAwMDAwMCcpLCBCaWdJbnQoJzB4N2ZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc2hvdWxkIGJlIGEgQnVmZmVyJylcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIGNvbnN0IGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFVzZSBidWlsdC1pbiB3aGVuIGF2YWlsYWJsZSwgbWlzc2luZyBmcm9tIElFMTFcbiAgICB0aGlzLmNvcHlXaXRoaW4odGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpXG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoKGVuY29kaW5nID09PSAndXRmOCcgJiYgY29kZSA8IDEyOCkgfHxcbiAgICAgICAgICBlbmNvZGluZyA9PT0gJ2xhdGluMScpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoOiBJZiBgdmFsYCBmaXRzIGludG8gYSBzaW5nbGUgYnl0ZSwgdXNlIHRoYXQgbnVtZXJpYyB2YWx1ZS5cbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdib29sZWFuJykge1xuICAgIHZhbCA9IE51bWJlcih2YWwpXG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgbGV0IGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICAgIGNvbnN0IGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyB2YWwgK1xuICAgICAgICAnXCIgaXMgaW52YWxpZCBmb3IgYXJndW1lbnQgXCJ2YWx1ZVwiJylcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gQ1VTVE9NIEVSUk9SU1xuLy8gPT09PT09PT09PT09PVxuXG4vLyBTaW1wbGlmaWVkIHZlcnNpb25zIGZyb20gTm9kZSwgY2hhbmdlZCBmb3IgQnVmZmVyLW9ubHkgdXNhZ2VcbmNvbnN0IGVycm9ycyA9IHt9XG5mdW5jdGlvbiBFIChzeW0sIGdldE1lc3NhZ2UsIEJhc2UpIHtcbiAgZXJyb3JzW3N5bV0gPSBjbGFzcyBOb2RlRXJyb3IgZXh0ZW5kcyBCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBzdXBlcigpXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIHtcbiAgICAgICAgdmFsdWU6IGdldE1lc3NhZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSlcblxuICAgICAgLy8gQWRkIHRoZSBlcnJvciBjb2RlIHRvIHRoZSBuYW1lIHRvIGluY2x1ZGUgaXQgaW4gdGhlIHN0YWNrIHRyYWNlLlxuICAgICAgdGhpcy5uYW1lID0gYCR7dGhpcy5uYW1lfSBbJHtzeW19XWBcbiAgICAgIC8vIEFjY2VzcyB0aGUgc3RhY2sgdG8gZ2VuZXJhdGUgdGhlIGVycm9yIG1lc3NhZ2UgaW5jbHVkaW5nIHRoZSBlcnJvciBjb2RlXG4gICAgICAvLyBmcm9tIHRoZSBuYW1lLlxuICAgICAgdGhpcy5zdGFjayAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgLy8gUmVzZXQgdGhlIG5hbWUgdG8gdGhlIGFjdHVhbCBuYW1lLlxuICAgICAgZGVsZXRlIHRoaXMubmFtZVxuICAgIH1cblxuICAgIGdldCBjb2RlICgpIHtcbiAgICAgIHJldHVybiBzeW1cbiAgICB9XG5cbiAgICBzZXQgY29kZSAodmFsdWUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY29kZScsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdG9TdHJpbmcgKCkge1xuICAgICAgcmV0dXJuIGAke3RoaXMubmFtZX0gWyR7c3ltfV06ICR7dGhpcy5tZXNzYWdlfWBcbiAgICB9XG4gIH1cbn1cblxuRSgnRVJSX0JVRkZFUl9PVVRfT0ZfQk9VTkRTJyxcbiAgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuIGAke25hbWV9IGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kc2BcbiAgICB9XG5cbiAgICByZXR1cm4gJ0F0dGVtcHQgdG8gYWNjZXNzIG1lbW9yeSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnXG4gIH0sIFJhbmdlRXJyb3IpXG5FKCdFUlJfSU5WQUxJRF9BUkdfVFlQRScsXG4gIGZ1bmN0aW9uIChuYW1lLCBhY3R1YWwpIHtcbiAgICByZXR1cm4gYFRoZSBcIiR7bmFtZX1cIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlICR7dHlwZW9mIGFjdHVhbH1gXG4gIH0sIFR5cGVFcnJvcilcbkUoJ0VSUl9PVVRfT0ZfUkFOR0UnLFxuICBmdW5jdGlvbiAoc3RyLCByYW5nZSwgaW5wdXQpIHtcbiAgICBsZXQgbXNnID0gYFRoZSB2YWx1ZSBvZiBcIiR7c3RyfVwiIGlzIG91dCBvZiByYW5nZS5gXG4gICAgbGV0IHJlY2VpdmVkID0gaW5wdXRcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihpbnB1dCkgJiYgTWF0aC5hYnMoaW5wdXQpID4gMiAqKiAzMikge1xuICAgICAgcmVjZWl2ZWQgPSBhZGROdW1lcmljYWxTZXBhcmF0b3IoU3RyaW5nKGlucHV0KSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ2JpZ2ludCcpIHtcbiAgICAgIHJlY2VpdmVkID0gU3RyaW5nKGlucHV0KVxuICAgICAgaWYgKGlucHV0ID4gQmlnSW50KDIpICoqIEJpZ0ludCgzMikgfHwgaW5wdXQgPCAtKEJpZ0ludCgyKSAqKiBCaWdJbnQoMzIpKSkge1xuICAgICAgICByZWNlaXZlZCA9IGFkZE51bWVyaWNhbFNlcGFyYXRvcihyZWNlaXZlZClcbiAgICAgIH1cbiAgICAgIHJlY2VpdmVkICs9ICduJ1xuICAgIH1cbiAgICBtc2cgKz0gYCBJdCBtdXN0IGJlICR7cmFuZ2V9LiBSZWNlaXZlZCAke3JlY2VpdmVkfWBcbiAgICByZXR1cm4gbXNnXG4gIH0sIFJhbmdlRXJyb3IpXG5cbmZ1bmN0aW9uIGFkZE51bWVyaWNhbFNlcGFyYXRvciAodmFsKSB7XG4gIGxldCByZXMgPSAnJ1xuICBsZXQgaSA9IHZhbC5sZW5ndGhcbiAgY29uc3Qgc3RhcnQgPSB2YWxbMF0gPT09ICctJyA/IDEgOiAwXG4gIGZvciAoOyBpID49IHN0YXJ0ICsgNDsgaSAtPSAzKSB7XG4gICAgcmVzID0gYF8ke3ZhbC5zbGljZShpIC0gMywgaSl9JHtyZXN9YFxuICB9XG4gIHJldHVybiBgJHt2YWwuc2xpY2UoMCwgaSl9JHtyZXN9YFxufVxuXG4vLyBDSEVDSyBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjaGVja0JvdW5kcyAoYnVmLCBvZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgaWYgKGJ1ZltvZmZzZXRdID09PSB1bmRlZmluZWQgfHwgYnVmW29mZnNldCArIGJ5dGVMZW5ndGhdID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIGJ1Zi5sZW5ndGggLSAoYnl0ZUxlbmd0aCArIDEpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50QkkgKHZhbHVlLCBtaW4sIG1heCwgYnVmLCBvZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB7XG4gICAgY29uc3QgbiA9IHR5cGVvZiBtaW4gPT09ICdiaWdpbnQnID8gJ24nIDogJydcbiAgICBsZXQgcmFuZ2VcbiAgICBpZiAoYnl0ZUxlbmd0aCA+IDMpIHtcbiAgICAgIGlmIChtaW4gPT09IDAgfHwgbWluID09PSBCaWdJbnQoMCkpIHtcbiAgICAgICAgcmFuZ2UgPSBgPj0gMCR7bn0gYW5kIDwgMiR7bn0gKiogJHsoYnl0ZUxlbmd0aCArIDEpICogOH0ke259YFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmFuZ2UgPSBgPj0gLSgyJHtufSAqKiAkeyhieXRlTGVuZ3RoICsgMSkgKiA4IC0gMX0ke259KSBhbmQgPCAyICoqIGAgK1xuICAgICAgICAgICAgICAgIGAkeyhieXRlTGVuZ3RoICsgMSkgKiA4IC0gMX0ke259YFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZSA9IGA+PSAke21pbn0ke259IGFuZCA8PSAke21heH0ke259YFxuICAgIH1cbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9PVVRfT0ZfUkFOR0UoJ3ZhbHVlJywgcmFuZ2UsIHZhbHVlKVxuICB9XG4gIGNoZWNrQm91bmRzKGJ1Ziwgb2Zmc2V0LCBieXRlTGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU51bWJlciAodmFsdWUsIG5hbWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9JTlZBTElEX0FSR19UWVBFKG5hbWUsICdudW1iZXInLCB2YWx1ZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBib3VuZHNFcnJvciAodmFsdWUsIGxlbmd0aCwgdHlwZSkge1xuICBpZiAoTWF0aC5mbG9vcih2YWx1ZSkgIT09IHZhbHVlKSB7XG4gICAgdmFsaWRhdGVOdW1iZXIodmFsdWUsIHR5cGUpXG4gICAgdGhyb3cgbmV3IGVycm9ycy5FUlJfT1VUX09GX1JBTkdFKHR5cGUgfHwgJ29mZnNldCcsICdhbiBpbnRlZ2VyJywgdmFsdWUpXG4gIH1cblxuICBpZiAobGVuZ3RoIDwgMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRVJSX0JVRkZFUl9PVVRfT0ZfQk9VTkRTKClcbiAgfVxuXG4gIHRocm93IG5ldyBlcnJvcnMuRVJSX09VVF9PRl9SQU5HRSh0eXBlIHx8ICdvZmZzZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYD49ICR7dHlwZSA/IDEgOiAwfSBhbmQgPD0gJHtsZW5ndGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlKVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmNvbnN0IElOVkFMSURfQkFTRTY0X1JFID0gL1teKy8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgdGFrZXMgZXF1YWwgc2lnbnMgYXMgZW5kIG9mIHRoZSBCYXNlNjQgZW5jb2RpbmdcbiAgc3RyID0gc3RyLnNwbGl0KCc9JylbMF1cbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICBsZXQgY29kZVBvaW50XG4gIGNvbnN0IGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgbGV0IGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIGNvbnN0IGJ5dGVzID0gW11cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgY29uc3QgYnl0ZUFycmF5ID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICBsZXQgYywgaGksIGxvXG4gIGNvbnN0IGJ5dGVBcnJheSA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgbGV0IGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbi8vIEFycmF5QnVmZmVyIG9yIFVpbnQ4QXJyYXkgb2JqZWN0cyBmcm9tIG90aGVyIGNvbnRleHRzIChpLmUuIGlmcmFtZXMpIGRvIG5vdCBwYXNzXG4vLyB0aGUgYGluc3RhbmNlb2ZgIGNoZWNrIGJ1dCB0aGV5IHNob3VsZCBiZSB0cmVhdGVkIGFzIG9mIHRoYXQgdHlwZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE2NlxuZnVuY3Rpb24gaXNJbnN0YW5jZSAob2JqLCB0eXBlKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiB0eXBlIHx8XG4gICAgKG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lICE9IG51bGwgJiZcbiAgICAgIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlLm5hbWUpXG59XG5mdW5jdGlvbiBudW1iZXJJc05hTiAob2JqKSB7XG4gIC8vIEZvciBJRTExIHN1cHBvcnRcbiAgcmV0dXJuIG9iaiAhPT0gb2JqIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG5cbi8vIENyZWF0ZSBsb29rdXAgdGFibGUgZm9yIGB0b1N0cmluZygnaGV4JylgXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8yMTlcbmNvbnN0IGhleFNsaWNlTG9va3VwVGFibGUgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBhbHBoYWJldCA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xuICBjb25zdCB0YWJsZSA9IG5ldyBBcnJheSgyNTYpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgIGNvbnN0IGkxNiA9IGkgKiAxNlxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTY7ICsraikge1xuICAgICAgdGFibGVbaTE2ICsgal0gPSBhbHBoYWJldFtpXSArIGFscGhhYmV0W2pdXG4gICAgfVxuICB9XG4gIHJldHVybiB0YWJsZVxufSkoKVxuXG4vLyBSZXR1cm4gbm90IGZ1bmN0aW9uIHdpdGggRXJyb3IgaWYgQmlnSW50IG5vdCBzdXBwb3J0ZWRcbmZ1bmN0aW9uIGRlZmluZUJpZ0ludE1ldGhvZCAoZm4pIHtcbiAgcmV0dXJuIHR5cGVvZiBCaWdJbnQgPT09ICd1bmRlZmluZWQnID8gQnVmZmVyQmlnSW50Tm90RGVmaW5lZCA6IGZuXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlckJpZ0ludE5vdERlZmluZWQgKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0JpZ0ludCBub3Qgc3VwcG9ydGVkJylcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSID0gdHlwZW9mIFJlZmxlY3QgPT09ICdvYmplY3QnID8gUmVmbGVjdCA6IG51bGxcbnZhciBSZWZsZWN0QXBwbHkgPSBSICYmIHR5cGVvZiBSLmFwcGx5ID09PSAnZnVuY3Rpb24nXG4gID8gUi5hcHBseVxuICA6IGZ1bmN0aW9uIFJlZmxlY3RBcHBseSh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpO1xuICB9XG5cbnZhciBSZWZsZWN0T3duS2V5c1xuaWYgKFIgJiYgdHlwZW9mIFIub3duS2V5cyA9PT0gJ2Z1bmN0aW9uJykge1xuICBSZWZsZWN0T3duS2V5cyA9IFIub3duS2V5c1xufSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gZnVuY3Rpb24gUmVmbGVjdE93bktleXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldClcbiAgICAgIC5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKTtcbiAgfTtcbn0gZWxzZSB7XG4gIFJlZmxlY3RPd25LZXlzID0gZnVuY3Rpb24gUmVmbGVjdE93bktleXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIFByb2Nlc3NFbWl0V2FybmluZyh3YXJuaW5nKSB7XG4gIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2FybikgY29uc29sZS53YXJuKHdhcm5pbmcpO1xufVxuXG52YXIgTnVtYmVySXNOYU4gPSBOdW1iZXIuaXNOYU4gfHwgZnVuY3Rpb24gTnVtYmVySXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICBFdmVudEVtaXR0ZXIuaW5pdC5jYWxsKHRoaXMpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5tb2R1bGUuZXhwb3J0cy5vbmNlID0gb25jZTtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHNDb3VudCA9IDA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbmZ1bmN0aW9uIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEZ1bmN0aW9uLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgbGlzdGVuZXIpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIsICdkZWZhdWx0TWF4TGlzdGVuZXJzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJyB8fCBhcmcgPCAwIHx8IE51bWJlcklzTmFOKGFyZykpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJkZWZhdWx0TWF4TGlzdGVuZXJzXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIGFyZyArICcuJyk7XG4gICAgfVxuICAgIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSBhcmc7XG4gIH1cbn0pO1xuXG5FdmVudEVtaXR0ZXIuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gIGlmICh0aGlzLl9ldmVudHMgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5fZXZlbnRzID09PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykuX2V2ZW50cykge1xuICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn07XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycyhuKSB7XG4gIGlmICh0eXBlb2YgbiAhPT0gJ251bWJlcicgfHwgbiA8IDAgfHwgTnVtYmVySXNOYU4obikpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiblwiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBuICsgJy4nKTtcbiAgfVxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIF9nZXRNYXhMaXN0ZW5lcnModGhhdCkge1xuICBpZiAodGhhdC5fbWF4TGlzdGVuZXJzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICByZXR1cm4gdGhhdC5fbWF4TGlzdGVuZXJzO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmdldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuIF9nZXRNYXhMaXN0ZW5lcnModGhpcyk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KHR5cGUpIHtcbiAgdmFyIGFyZ3MgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICB2YXIgZG9FcnJvciA9ICh0eXBlID09PSAnZXJyb3InKTtcblxuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpXG4gICAgZG9FcnJvciA9IChkb0Vycm9yICYmIGV2ZW50cy5lcnJvciA9PT0gdW5kZWZpbmVkKTtcbiAgZWxzZSBpZiAoIWRvRXJyb3IpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKGRvRXJyb3IpIHtcbiAgICB2YXIgZXI7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMClcbiAgICAgIGVyID0gYXJnc1swXTtcbiAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgLy8gTm90ZTogVGhlIGNvbW1lbnRzIG9uIHRoZSBgdGhyb3dgIGxpbmVzIGFyZSBpbnRlbnRpb25hbCwgdGhleSBzaG93XG4gICAgICAvLyB1cCBpbiBOb2RlJ3Mgb3V0cHV0IGlmIHRoaXMgcmVzdWx0cyBpbiBhbiB1bmhhbmRsZWQgZXhjZXB0aW9uLlxuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgfVxuICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmhhbmRsZWQgZXJyb3IuJyArIChlciA/ICcgKCcgKyBlci5tZXNzYWdlICsgJyknIDogJycpKTtcbiAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgIHRocm93IGVycjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgfVxuXG4gIHZhciBoYW5kbGVyID0gZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChoYW5kbGVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFJlZmxlY3RBcHBseShoYW5kbGVyLCB0aGlzLCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuID0gaGFuZGxlci5sZW5ndGg7XG4gICAgdmFyIGxpc3RlbmVycyA9IGFycmF5Q2xvbmUoaGFuZGxlciwgbGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKVxuICAgICAgUmVmbGVjdEFwcGx5KGxpc3RlbmVyc1tpXSwgdGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmZ1bmN0aW9uIF9hZGRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCBwcmVwZW5kKSB7XG4gIHZhciBtO1xuICB2YXIgZXZlbnRzO1xuICB2YXIgZXhpc3Rpbmc7XG5cbiAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0YXJnZXQuX2V2ZW50c0NvdW50ID0gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAgIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgICBpZiAoZXZlbnRzLm5ld0xpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRhcmdldC5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA/IGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gICAgICAvLyBSZS1hc3NpZ24gYGV2ZW50c2AgYmVjYXVzZSBhIG5ld0xpc3RlbmVyIGhhbmRsZXIgY291bGQgaGF2ZSBjYXVzZWQgdGhlXG4gICAgICAvLyB0aGlzLl9ldmVudHMgdG8gYmUgYXNzaWduZWQgdG8gYSBuZXcgb2JqZWN0XG4gICAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgICB9XG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV07XG4gIH1cblxuICBpZiAoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gICAgKyt0YXJnZXQuX2V2ZW50c0NvdW50O1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgZXhpc3RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPVxuICAgICAgICBwcmVwZW5kID8gW2xpc3RlbmVyLCBleGlzdGluZ10gOiBbZXhpc3RpbmcsIGxpc3RlbmVyXTtcbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB9IGVsc2UgaWYgKHByZXBlbmQpIHtcbiAgICAgIGV4aXN0aW5nLnVuc2hpZnQobGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGlzdGluZy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgIG0gPSBfZ2V0TWF4TGlzdGVuZXJzKHRhcmdldCk7XG4gICAgaWYgKG0gPiAwICYmIGV4aXN0aW5nLmxlbmd0aCA+IG0gJiYgIWV4aXN0aW5nLndhcm5lZCkge1xuICAgICAgZXhpc3Rpbmcud2FybmVkID0gdHJ1ZTtcbiAgICAgIC8vIE5vIGVycm9yIGNvZGUgZm9yIHRoaXMgc2luY2UgaXQgaXMgYSBXYXJuaW5nXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICAgIHZhciB3ID0gbmV3IEVycm9yKCdQb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5IGxlYWsgZGV0ZWN0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZy5sZW5ndGggKyAnICcgKyBTdHJpbmcodHlwZSkgKyAnIGxpc3RlbmVycyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FkZGVkLiBVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2luY3JlYXNlIGxpbWl0Jyk7XG4gICAgICB3Lm5hbWUgPSAnTWF4TGlzdGVuZXJzRXhjZWVkZWRXYXJuaW5nJztcbiAgICAgIHcuZW1pdHRlciA9IHRhcmdldDtcbiAgICAgIHcudHlwZSA9IHR5cGU7XG4gICAgICB3LmNvdW50ID0gZXhpc3RpbmcubGVuZ3RoO1xuICAgICAgUHJvY2Vzc0VtaXRXYXJuaW5nKHcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG4gICAgfTtcblxuZnVuY3Rpb24gb25jZVdyYXBwZXIoKSB7XG4gIGlmICghdGhpcy5maXJlZCkge1xuICAgIHRoaXMudGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy53cmFwRm4pO1xuICAgIHRoaXMuZmlyZWQgPSB0cnVlO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCk7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXIuYXBwbHkodGhpcy50YXJnZXQsIGFyZ3VtZW50cyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX29uY2VXcmFwKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHN0YXRlID0geyBmaXJlZDogZmFsc2UsIHdyYXBGbjogdW5kZWZpbmVkLCB0YXJnZXQ6IHRhcmdldCwgdHlwZTogdHlwZSwgbGlzdGVuZXI6IGxpc3RlbmVyIH07XG4gIHZhciB3cmFwcGVkID0gb25jZVdyYXBwZXIuYmluZChzdGF0ZSk7XG4gIHdyYXBwZWQubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgc3RhdGUud3JhcEZuID0gd3JhcHBlZDtcbiAgcmV0dXJuIHdyYXBwZWQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UodHlwZSwgbGlzdGVuZXIpIHtcbiAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIHRoaXMub24odHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kT25jZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kT25jZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgIHRoaXMucHJlcGVuZExpc3RlbmVyKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuLy8gRW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmIGFuZCBvbmx5IGlmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgbGlzdCwgZXZlbnRzLCBwb3NpdGlvbiwgaSwgb3JpZ2luYWxMaXN0ZW5lcjtcblxuICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGxpc3QgPSBldmVudHNbdHlwZV07XG4gICAgICBpZiAobGlzdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8IGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0Lmxpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGlzdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwb3NpdGlvbiA9IC0xO1xuXG4gICAgICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHwgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsTGlzdGVuZXIgPSBsaXN0W2ldLmxpc3RlbmVyO1xuICAgICAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAocG9zaXRpb24gPT09IDApXG4gICAgICAgICAgbGlzdC5zaGlmdCgpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzcGxpY2VPbmUobGlzdCwgcG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKVxuICAgICAgICAgIGV2ZW50c1t0eXBlXSA9IGxpc3RbMF07XG5cbiAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBvcmlnaW5hbExpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMsIGV2ZW50cywgaTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRzW3R5cGVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV2ZW50cyk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lcnMgPSBldmVudHNbdHlwZV07XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTElGTyBvcmRlclxuICAgICAgICBmb3IgKGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuZnVuY3Rpb24gX2xpc3RlbmVycyh0YXJnZXQsIHR5cGUsIHVud3JhcCkge1xuICB2YXIgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcbiAgaWYgKGV2bGlzdGVuZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB1bndyYXAgPyBbZXZsaXN0ZW5lci5saXN0ZW5lciB8fCBldmxpc3RlbmVyXSA6IFtldmxpc3RlbmVyXTtcblxuICByZXR1cm4gdW53cmFwID9cbiAgICB1bndyYXBMaXN0ZW5lcnMoZXZsaXN0ZW5lcikgOiBhcnJheUNsb25lKGV2bGlzdGVuZXIsIGV2bGlzdGVuZXIubGVuZ3RoKTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCB0cnVlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmF3TGlzdGVuZXJzID0gZnVuY3Rpb24gcmF3TGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5saXN0ZW5lckNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsIHR5cGUpO1xuICB9XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBsaXN0ZW5lckNvdW50O1xuZnVuY3Rpb24gbGlzdGVuZXJDb3VudCh0eXBlKSB7XG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG5cbiAgICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoZXZsaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHJldHVybiB0aGlzLl9ldmVudHNDb3VudCA+IDAgPyBSZWZsZWN0T3duS2V5cyh0aGlzLl9ldmVudHMpIDogW107XG59O1xuXG5mdW5jdGlvbiBhcnJheUNsb25lKGFyciwgbikge1xuICB2YXIgY29weSA9IG5ldyBBcnJheShuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyArK2kpXG4gICAgY29weVtpXSA9IGFycltpXTtcbiAgcmV0dXJuIGNvcHk7XG59XG5cbmZ1bmN0aW9uIHNwbGljZU9uZShsaXN0LCBpbmRleCkge1xuICBmb3IgKDsgaW5kZXggKyAxIDwgbGlzdC5sZW5ndGg7IGluZGV4KyspXG4gICAgbGlzdFtpbmRleF0gPSBsaXN0W2luZGV4ICsgMV07XG4gIGxpc3QucG9wKCk7XG59XG5cbmZ1bmN0aW9uIHVud3JhcExpc3RlbmVycyhhcnIpIHtcbiAgdmFyIHJldCA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXQubGVuZ3RoOyArK2kpIHtcbiAgICByZXRbaV0gPSBhcnJbaV0ubGlzdGVuZXIgfHwgYXJyW2ldO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIG9uY2UoZW1pdHRlciwgbmFtZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGZ1bmN0aW9uIGVycm9yTGlzdGVuZXIoZXJyKSB7XG4gICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKG5hbWUsIHJlc29sdmVyKTtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVyKCkge1xuICAgICAgaWYgKHR5cGVvZiBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICByZXNvbHZlKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgfTtcblxuICAgIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCBuYW1lLCByZXNvbHZlciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIGlmIChuYW1lICE9PSAnZXJyb3InKSB7XG4gICAgICBhZGRFcnJvckhhbmRsZXJJZkV2ZW50RW1pdHRlcihlbWl0dGVyLCBlcnJvckxpc3RlbmVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgaGFuZGxlciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsICdlcnJvcicsIGhhbmRsZXIsIGZsYWdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgbmFtZSwgbGlzdGVuZXIsIGZsYWdzKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChmbGFncy5vbmNlKSB7XG4gICAgICBlbWl0dGVyLm9uY2UobmFtZSwgbGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbWl0dGVyLm9uKG5hbWUsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIEV2ZW50VGFyZ2V0IGRvZXMgbm90IGhhdmUgYGVycm9yYCBldmVudCBzZW1hbnRpY3MgbGlrZSBOb2RlXG4gICAgLy8gRXZlbnRFbWl0dGVycywgd2UgZG8gbm90IGxpc3RlbiBmb3IgYGVycm9yYCBldmVudHMgaGVyZS5cbiAgICBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZnVuY3Rpb24gd3JhcExpc3RlbmVyKGFyZykge1xuICAgICAgLy8gSUUgZG9lcyBub3QgaGF2ZSBidWlsdGluIGB7IG9uY2U6IHRydWUgfWAgc3VwcG9ydCBzbyB3ZVxuICAgICAgLy8gaGF2ZSB0byBkbyBpdCBtYW51YWxseS5cbiAgICAgIGlmIChmbGFncy5vbmNlKSB7XG4gICAgICAgIGVtaXR0ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCB3cmFwTGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgbGlzdGVuZXIoYXJnKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJlbWl0dGVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEV2ZW50RW1pdHRlci4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGVtaXR0ZXIpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTsgLyogZXNsaW50IG5vLWNvbnRpbnVlOiAwICovXG5cblxudmFyIF9nY29kZVBhcnNlciA9IHJlcXVpcmUoJ2djb2RlLXBhcnNlcicpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCBjb21wb3NlZCBmcm9tIGFycmF5cyBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgdmFsdWVzLlxuICogQGV4YW1wbGVcbiAqICAgZnJvbVBhaXJzKFtbJ2EnLCAxXSwgWydiJywgMl1dKTtcbiAqICAgLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gKi9cbnZhciBmcm9tUGFpcnMgPSBmdW5jdGlvbiBmcm9tUGFpcnMocGFpcnMpIHtcbiAgICB2YXIgaW5kZXggPSAtMTtcbiAgICB2YXIgbGVuZ3RoID0gIXBhaXJzID8gMCA6IHBhaXJzLmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgcGFpciA9IHBhaXJzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0W3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxudmFyIHBhcnRpdGlvbldvcmRzQnlHcm91cCA9IGZ1bmN0aW9uIHBhcnRpdGlvbldvcmRzQnlHcm91cCgpIHtcbiAgICB2YXIgd29yZHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFtdO1xuXG4gICAgdmFyIGdyb3VwcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgd29yZCA9IHdvcmRzW2ldO1xuICAgICAgICB2YXIgbGV0dGVyID0gd29yZFswXTtcblxuICAgICAgICBpZiAobGV0dGVyID09PSAnRycgfHwgbGV0dGVyID09PSAnTScgfHwgbGV0dGVyID09PSAnVCcpIHtcbiAgICAgICAgICAgIGdyb3Vwcy5wdXNoKFt3b3JkXSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChncm91cHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZ3JvdXBzW2dyb3Vwcy5sZW5ndGggLSAxXS5wdXNoKHdvcmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ3JvdXBzLnB1c2goW3dvcmRdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cHM7XG59O1xuXG52YXIgaW50ZXJwcmV0ID0gZnVuY3Rpb24gaW50ZXJwcmV0KHNlbGYsIGRhdGEpIHtcbiAgICB2YXIgZ3JvdXBzID0gcGFydGl0aW9uV29yZHNCeUdyb3VwKGRhdGEud29yZHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHdvcmRzID0gZ3JvdXBzW2ldO1xuICAgICAgICB2YXIgd29yZCA9IHdvcmRzWzBdIHx8IFtdO1xuICAgICAgICB2YXIgbGV0dGVyID0gd29yZFswXTtcbiAgICAgICAgdmFyIGNvZGUgPSB3b3JkWzFdO1xuICAgICAgICB2YXIgY21kID0gJyc7XG4gICAgICAgIHZhciBhcmdzID0ge307XG5cbiAgICAgICAgaWYgKGxldHRlciA9PT0gJ0cnKSB7XG4gICAgICAgICAgICBjbWQgPSBsZXR0ZXIgKyBjb2RlO1xuICAgICAgICAgICAgYXJncyA9IGZyb21QYWlycyh3b3Jkcy5zbGljZSgxKSk7XG5cbiAgICAgICAgICAgIC8vIE1vdGlvbiBNb2RlXG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gMCB8fCBjb2RlID09PSAxIHx8IGNvZGUgPT09IDIgfHwgY29kZSA9PT0gMyB8fCBjb2RlID09PSAzOC4yIHx8IGNvZGUgPT09IDM4LjMgfHwgY29kZSA9PT0gMzguNCB8fCBjb2RlID09PSAzOC41KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5tb3Rpb25Nb2RlID0gY21kO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb2RlID09PSA4MCkge1xuICAgICAgICAgICAgICAgIHNlbGYubW90aW9uTW9kZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGxldHRlciA9PT0gJ00nKSB7XG4gICAgICAgICAgICBjbWQgPSBsZXR0ZXIgKyBjb2RlO1xuICAgICAgICAgICAgYXJncyA9IGZyb21QYWlycyh3b3Jkcy5zbGljZSgxKSk7XG4gICAgICAgIH0gZWxzZSBpZiAobGV0dGVyID09PSAnVCcpIHtcbiAgICAgICAgICAgIC8vIFQxIDsgdy9vIE02XG4gICAgICAgICAgICBjbWQgPSBsZXR0ZXI7XG4gICAgICAgICAgICBhcmdzID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChsZXR0ZXIgPT09ICdGJykge1xuICAgICAgICAgICAgLy8gRjc1MCA7IHcvbyBtb3Rpb24gY29tbWFuZFxuICAgICAgICAgICAgY21kID0gbGV0dGVyO1xuICAgICAgICAgICAgYXJncyA9IGNvZGU7XG4gICAgICAgIH0gZWxzZSBpZiAobGV0dGVyID09PSAnWCcgfHwgbGV0dGVyID09PSAnWScgfHwgbGV0dGVyID09PSAnWicgfHwgbGV0dGVyID09PSAnQScgfHwgbGV0dGVyID09PSAnQicgfHwgbGV0dGVyID09PSAnQycgfHwgbGV0dGVyID09PSAnSScgfHwgbGV0dGVyID09PSAnSicgfHwgbGV0dGVyID09PSAnSycpIHtcbiAgICAgICAgICAgIC8vIFVzZSBwcmV2aW91cyBtb3Rpb24gY29tbWFuZCBpZiB0aGUgbGluZSBkb2VzIG5vdCBzdGFydCB3aXRoIEctY29kZSBvciBNLWNvZGUuXG4gICAgICAgICAgICAvLyBAZXhhbXBsZVxuICAgICAgICAgICAgLy8gICBHMCBaMC4yNVxuICAgICAgICAgICAgLy8gICBYLTAuNSBZMC5cbiAgICAgICAgICAgIC8vICAgWjAuMVxuICAgICAgICAgICAgLy8gICBHMDEgWjAuIEY1LlxuICAgICAgICAgICAgLy8gICBHMiBYMC41IFkwLiBJMC4gSi0wLjVcbiAgICAgICAgICAgIC8vICAgWDAuIFktMC41IEktMC41IEowLlxuICAgICAgICAgICAgLy8gICBYLTAuNSBZMC4gSTAuIEowLjVcbiAgICAgICAgICAgIC8vIEBleGFtcGxlXG4gICAgICAgICAgICAvLyAgIEcwMVxuICAgICAgICAgICAgLy8gICBNMDMgUzBcbiAgICAgICAgICAgIC8vICAgWDUuMiBZMC4yIE0wMyBTMFxuICAgICAgICAgICAgLy8gICBYNS4zIFkwLjEgTTAzIFMxMDAwXG4gICAgICAgICAgICAvLyAgIFg1LjQgWTAgTTAzIFMwXG4gICAgICAgICAgICAvLyAgIFg1LjUgWTAgTTAzIFMwXG4gICAgICAgICAgICBjbWQgPSBzZWxmLm1vdGlvbk1vZGU7XG4gICAgICAgICAgICBhcmdzID0gZnJvbVBhaXJzKHdvcmRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY21kKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZi5oYW5kbGVyc1tjbWRdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZnVuYyA9IHNlbGYuaGFuZGxlcnNbY21kXTtcbiAgICAgICAgICAgIGZ1bmMoYXJncyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYuZGVmYXVsdEhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHNlbGYuZGVmYXVsdEhhbmRsZXIoY21kLCBhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZltjbWRdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgX2Z1bmMgPSBzZWxmW2NtZF0uYmluZChzZWxmKTtcbiAgICAgICAgICAgIF9mdW5jKGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxudmFyIEludGVycHJldGVyID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEludGVycHJldGVyKG9wdGlvbnMpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEludGVycHJldGVyKTtcblxuICAgICAgICB0aGlzLm1vdGlvbk1vZGUgPSAnRzAnO1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0ge307XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IG9wdGlvbnMuaGFuZGxlcnMgfHwge307XG4gICAgICAgIHRoaXMuZGVmYXVsdEhhbmRsZXIgPSBvcHRpb25zLmRlZmF1bHRIYW5kbGVyO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhJbnRlcnByZXRlciwgW3tcbiAgICAgICAga2V5OiAnbG9hZEZyb21TdHJlYW0nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZEZyb21TdHJlYW0oc3RyZWFtKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG5vb3A7XG5cbiAgICAgICAgICAgIHZhciBzID0gKDAsIF9nY29kZVBhcnNlci5wYXJzZVN0cmVhbSkoc3RyZWFtLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBzLm9uKCdkYXRhJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXQoX3RoaXMsIGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnbG9hZEZyb21GaWxlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWRGcm9tRmlsZShmaWxlKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBub29wO1xuXG4gICAgICAgICAgICB2YXIgcyA9ICgwLCBfZ2NvZGVQYXJzZXIucGFyc2VGaWxlKShmaWxlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBzLm9uKCdkYXRhJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXQoX3RoaXMyLCBkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2xvYWRGcm9tRmlsZVN5bmMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZEZyb21GaWxlU3luYyhmaWxlKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG5vb3A7XG5cbiAgICAgICAgICAgIHZhciBsaXN0ID0gKDAsIF9nY29kZVBhcnNlci5wYXJzZUZpbGVTeW5jKShmaWxlKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGludGVycHJldCh0aGlzLCBsaXN0W2ldKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhsaXN0W2ldLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdsb2FkRnJvbVN0cmluZycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkRnJvbVN0cmluZyhzdHIpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG5vb3A7XG5cbiAgICAgICAgICAgIHZhciBzID0gKDAsIF9nY29kZVBhcnNlci5wYXJzZVN0cmluZykoc3RyLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBzLm9uKCdkYXRhJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXQoX3RoaXMzLCBkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2xvYWRGcm9tU3RyaW5nU3luYycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkRnJvbVN0cmluZ1N5bmMoc3RyKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG5vb3A7XG5cbiAgICAgICAgICAgIHZhciBsaXN0ID0gKDAsIF9nY29kZVBhcnNlci5wYXJzZVN0cmluZ1N5bmMpKHN0cik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXQodGhpcywgbGlzdFtpXSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobGlzdFtpXSwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBJbnRlcnByZXRlcjtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gSW50ZXJwcmV0ZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX0ludGVycHJldGVyID0gcmVxdWlyZSgnLi9JbnRlcnByZXRlcicpO1xuXG52YXIgX0ludGVycHJldGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0ludGVycHJldGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxubW9kdWxlLmV4cG9ydHMgPSBfSW50ZXJwcmV0ZXIyLmRlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnBhcnNlU3RyaW5nU3luYyA9IGV4cG9ydHMucGFyc2VTdHJpbmcgPSBleHBvcnRzLnBhcnNlRmlsZVN5bmMgPSBleHBvcnRzLnBhcnNlRmlsZSA9IGV4cG9ydHMucGFyc2VTdHJlYW0gPSBleHBvcnRzLnBhcnNlTGluZSA9IGV4cG9ydHMuR0NvZGVMaW5lU3RyZWFtID0gdm9pZCAwO1xuXG52YXIgX2V2ZW50cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcImV2ZW50c1wiKSk7XG5cbnZhciBfZnMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJmc1wiKSk7XG5cbnZhciBfdGltZXJzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwidGltZXJzXCIpKTtcblxudmFyIF9zdHJlYW0gPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwic3RyZWFtXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgeyB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7fTsgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosIGtleSwgZGVzYyk7IH0gZWxzZSB7IG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307IHZhciBvd25LZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgaWYgKHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSAnZnVuY3Rpb24nKSB7IG93bktleXMgPSBvd25LZXlzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZSkuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBzeW0pLmVudW1lcmFibGU7IH0pKTsgfSBvd25LZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSk7IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxudmFyIHN0cmVhbWlmeSA9IGZ1bmN0aW9uIHN0cmVhbWlmeSh0ZXh0KSB7XG4gIHZhciBzID0gbmV3IF9zdHJlYW1bXCJkZWZhdWx0XCJdLlJlYWRhYmxlKCk7XG4gIHMucHVzaCh0ZXh0KTtcbiAgcy5wdXNoKG51bGwpO1xuICByZXR1cm4gcztcbn07XG5cbnZhciBjb250YWluc0xpbmVFbmQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciByZSA9IG5ldyBSZWdFeHAoLy4qKD86XFxyXFxufFxccnxcXG4pL2cpO1xuICByZXR1cm4gZnVuY3Rpb24gKHMpIHtcbiAgICByZXR1cm4gISFzLm1hdGNoKHJlKTtcbiAgfTtcbn0oKTsgLy8gQHBhcmFtIHthcnJheX0gYXJyIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4vLyBAcGFyYW0ge29iamVjdH0gb3B0cyBUaGUgb3B0aW9ucyBvYmplY3QuXG4vLyBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbi8vIEBwYXJhbSB7ZnVuY3Rpb259IGRvbmUgVGhlIGRvbmUgaW52b2tlZCBhZnRlciB0aGUgbG9vcCBoYXMgZmluaXNoZWQuXG5cblxudmFyIGl0ZXJhdGVBcnJheSA9IGZ1bmN0aW9uIGl0ZXJhdGVBcnJheSgpIHtcbiAgdmFyIGFyciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgdmFyIGl0ZXJhdGVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBub29wO1xuICB2YXIgZG9uZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogbm9vcDtcblxuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBkb25lID0gaXRlcmF0ZWU7XG4gICAgaXRlcmF0ZWUgPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIG9wdHMuYmF0Y2hTaXplID0gb3B0cy5iYXRjaFNpemUgfHwgMTtcblxuICB2YXIgbG9vcCA9IGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgdmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG5cbiAgICBmb3IgKHZhciBjb3VudCA9IDA7IGkgPCBhcnIubGVuZ3RoICYmIGNvdW50IDwgb3B0cy5iYXRjaFNpemU7ICsraSwgKytjb3VudCkge1xuICAgICAgaXRlcmF0ZWUoYXJyW2ldLCBpLCBhcnIpO1xuICAgIH1cblxuICAgIGlmIChpIDwgYXJyLmxlbmd0aCkge1xuICAgICAgX3RpbWVyc1tcImRlZmF1bHRcIl0uc2V0SW1tZWRpYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGxvb3AoaSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRvbmUoKTtcbiAgfTtcblxuICBsb29wKCk7XG59OyAvLyBAcGFyYW0ge3N0cmluZ30gbGluZSBUaGUgRy1jb2RlIGxpbmVcblxuXG52YXIgcGFyc2VMaW5lID0gZnVuY3Rpb24gKCkge1xuICAvLyBodHRwOi8vcmVwcmFwLm9yZy93aWtpL0ctY29kZSNTcGVjaWFsX2ZpZWxkc1xuICAvLyBUaGUgY2hlY2tzdW0gXCJjc1wiIGZvciBhIEdDb2RlIHN0cmluZyBcImNtZFwiIChpbmNsdWRpbmcgaXRzIGxpbmUgbnVtYmVyKSBpcyBjb21wdXRlZFxuICAvLyBieSBleG9yLWluZyB0aGUgYnl0ZXMgaW4gdGhlIHN0cmluZyB1cCB0byBhbmQgbm90IGluY2x1ZGluZyB0aGUgKiBjaGFyYWN0ZXIuXG4gIHZhciBjb21wdXRlQ2hlY2tzdW0gPSBmdW5jdGlvbiBjb21wdXRlQ2hlY2tzdW0ocykge1xuICAgIHMgPSBzIHx8ICcnO1xuXG4gICAgaWYgKHMubGFzdEluZGV4T2YoJyonKSA+PSAwKSB7XG4gICAgICBzID0gcy5zdWJzdHIoMCwgcy5sYXN0SW5kZXhPZignKicpKTtcbiAgICB9XG5cbiAgICB2YXIgY3MgPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIgYyA9IHNbaV0uY2hhckNvZGVBdCgwKTtcbiAgICAgIGNzIF49IGM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNzO1xuICB9OyAvLyBodHRwOi8vbGludXhjbmMub3JnL2RvY3MvaHRtbC9nY29kZS9vdmVydmlldy5odG1sI2djb2RlOmNvbW1lbnRzXG4gIC8vIENvbW1lbnRzIGNhbiBiZSBlbWJlZGRlZCBpbiBhIGxpbmUgdXNpbmcgcGFyZW50aGVzZXMgKCkgb3IgZm9yIHRoZSByZW1haW5kZXIgb2YgYSBsaW5ldXNpbmcgYSBzZW1pLWNvbG9uLiBUaGUgc2VtaS1jb2xvbiBpcyBub3QgdHJlYXRlZCBhcyB0aGUgc3RhcnQgb2YgYSBjb21tZW50IHdoZW4gZW5jbG9zZWQgaW4gcGFyZW50aGVzZXMuXG5cblxuICB2YXIgc3RyaXBDb21tZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmUxID0gbmV3IFJlZ0V4cCgvXFxzKlxcKFteXFwpXSpcXCkvZyk7IC8vIFJlbW92ZSBhbnl0aGluZyBpbnNpZGUgdGhlIHBhcmVudGhlc2VzXG5cbiAgICB2YXIgcmUyID0gbmV3IFJlZ0V4cCgvXFxzKjsuKi9nKTsgLy8gUmVtb3ZlIGFueXRoaW5nIGFmdGVyIGEgc2VtaS1jb2xvbiB0byB0aGUgZW5kIG9mIHRoZSBsaW5lLCBpbmNsdWRpbmcgcHJlY2VkaW5nIHNwYWNlc1xuXG4gICAgdmFyIHJlMyA9IG5ldyBSZWdFeHAoL1xccysvZyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICByZXR1cm4gbGluZS5yZXBsYWNlKHJlMSwgJycpLnJlcGxhY2UocmUyLCAnJykucmVwbGFjZShyZTMsICcnKTtcbiAgICB9O1xuICB9KCk7XG5cbiAgdmFyIHJlID0gLyglLiopfCh7LiopfCgoPzpcXCRcXCQpfCg/OlxcJFthLXpBLVowLTkjXSopKXwoW2EtekEtWl1bMC05XFwrXFwtXFwuXSspfChcXCpbMC05XSspL2lnbTtcbiAgcmV0dXJuIGZ1bmN0aW9uIChsaW5lLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5mbGF0dGVuID0gISFvcHRpb25zLmZsYXR0ZW47XG4gICAgb3B0aW9ucy5ub1BhcnNlTGluZSA9ICEhb3B0aW9ucy5ub1BhcnNlTGluZTtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgbGluZTogbGluZVxuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucy5ub1BhcnNlTGluZSkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXN1bHQud29yZHMgPSBbXTtcbiAgICB2YXIgbG47IC8vIExpbmUgbnVtYmVyXG5cbiAgICB2YXIgY3M7IC8vIENoZWNrc3VtXG5cbiAgICB2YXIgd29yZHMgPSBzdHJpcENvbW1lbnRzKGxpbmUpLm1hdGNoKHJlKSB8fCBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB3b3JkID0gd29yZHNbaV07XG4gICAgICB2YXIgbGV0dGVyID0gd29yZFswXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgdmFyIGFyZ3VtZW50ID0gd29yZC5zbGljZSgxKTsgLy8gUGFyc2UgJSBjb21tYW5kcyBmb3IgYkNOQyBhbmQgQ05DanNcbiAgICAgIC8vIC0gJXdhaXQgV2FpdCB1bnRpbCB0aGUgcGxhbm5lciBxdWV1ZSBpcyBlbXB0eVxuXG4gICAgICBpZiAobGV0dGVyID09PSAnJScpIHtcbiAgICAgICAgcmVzdWx0LmNtZHMgPSAocmVzdWx0LmNtZHMgfHwgW10pLmNvbmNhdChsaW5lLnRyaW0oKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSAvLyBQYXJzZSBKU09OIGNvbW1hbmRzIGZvciBUaW55RyBhbmQgZzJjb3JlXG5cblxuICAgICAgaWYgKGxldHRlciA9PT0gJ3snKSB7XG4gICAgICAgIHJlc3VsdC5jbWRzID0gKHJlc3VsdC5jbWRzIHx8IFtdKS5jb25jYXQobGluZS50cmltKCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gLy8gUGFyc2UgJCBjb21tYW5kcyBmb3IgR3JibFxuICAgICAgLy8gLSAkQyBDaGVjayBnY29kZSBtb2RlXG4gICAgICAvLyAtICRIIFJ1biBob21pbmcgY3ljbGVcblxuXG4gICAgICBpZiAobGV0dGVyID09PSAnJCcpIHtcbiAgICAgICAgcmVzdWx0LmNtZHMgPSAocmVzdWx0LmNtZHMgfHwgW10pLmNvbmNhdChcIlwiLmNvbmNhdChsZXR0ZXIpLmNvbmNhdChhcmd1bWVudCkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gLy8gTjogTGluZSBudW1iZXJcblxuXG4gICAgICBpZiAobGV0dGVyID09PSAnTicgJiYgdHlwZW9mIGxuID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBMaW5lIChibG9jaykgbnVtYmVyIGluIHByb2dyYW1cbiAgICAgICAgbG4gPSBOdW1iZXIoYXJndW1lbnQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gLy8gKjogQ2hlY2tzdW1cblxuXG4gICAgICBpZiAobGV0dGVyID09PSAnKicgJiYgdHlwZW9mIGNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjcyA9IE51bWJlcihhcmd1bWVudCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWUgPSBOdW1iZXIoYXJndW1lbnQpO1xuXG4gICAgICBpZiAoTnVtYmVyLmlzTmFOKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IGFyZ3VtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5mbGF0dGVuKSB7XG4gICAgICAgIHJlc3VsdC53b3Jkcy5wdXNoKGxldHRlciArIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC53b3Jkcy5wdXNoKFtsZXR0ZXIsIHZhbHVlXSk7XG4gICAgICB9XG4gICAgfSAvLyBMaW5lIG51bWJlclxuXG5cbiAgICB0eXBlb2YgbG4gIT09ICd1bmRlZmluZWQnICYmIChyZXN1bHQubG4gPSBsbik7IC8vIENoZWNrc3VtXG5cbiAgICB0eXBlb2YgY3MgIT09ICd1bmRlZmluZWQnICYmIChyZXN1bHQuY3MgPSBjcyk7XG5cbiAgICBpZiAocmVzdWx0LmNzICYmIGNvbXB1dGVDaGVja3N1bShsaW5lKSAhPT0gcmVzdWx0LmNzKSB7XG4gICAgICByZXN1bHQuZXJyID0gdHJ1ZTsgLy8gY2hlY2tzdW0gZmFpbGVkXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0oKTsgLy8gQHBhcmFtIHtvYmplY3R9IHN0cmVhbSBUaGUgRy1jb2RlIGxpbmUgc3RyZWFtXG4vLyBAcGFyYW0ge29wdGlvbnN9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0XG4vLyBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cblxuXG5leHBvcnRzLnBhcnNlTGluZSA9IHBhcnNlTGluZTtcblxudmFyIHBhcnNlU3RyZWFtID0gZnVuY3Rpb24gcGFyc2VTdHJlYW0oc3RyZWFtLCBvcHRpb25zKSB7XG4gIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogbm9vcDtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIGVtaXR0ZXIgPSBuZXcgX2V2ZW50c1tcImRlZmF1bHRcIl0uRXZlbnRFbWl0dGVyKCk7XG5cbiAgdHJ5IHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHN0cmVhbS5waXBlKG5ldyBHQ29kZUxpbmVTdHJlYW0ob3B0aW9ucykpLm9uKCdkYXRhJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGVtaXR0ZXIuZW1pdCgnZGF0YScsIGRhdGEpO1xuICAgICAgcmVzdWx0cy5wdXNoKGRhdGEpO1xuICAgIH0pLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBlbWl0dGVyLmVtaXQoJ2VuZCcsIHJlc3VsdHMpO1xuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgfSkub24oJ2Vycm9yJywgY2FsbGJhY2spO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9XG5cbiAgcmV0dXJuIGVtaXR0ZXI7XG59OyAvLyBAcGFyYW0ge3N0cmluZ30gZmlsZSBUaGUgRy1jb2RlIHBhdGggbmFtZVxuLy8gQHBhcmFtIHtvcHRpb25zfSBvcHRpb25zIFRoZSBvcHRpb25zIG9iamVjdFxuLy8gQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG5cblxuZXhwb3J0cy5wYXJzZVN0cmVhbSA9IHBhcnNlU3RyZWFtO1xuXG52YXIgcGFyc2VGaWxlID0gZnVuY3Rpb24gcGFyc2VGaWxlKGZpbGUsIG9wdGlvbnMpIHtcbiAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBub29wO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBmaWxlID0gZmlsZSB8fCAnJztcblxuICB2YXIgcyA9IF9mc1tcImRlZmF1bHRcIl0uY3JlYXRlUmVhZFN0cmVhbShmaWxlLCB7XG4gICAgZW5jb2Rpbmc6ICd1dGY4J1xuICB9KTtcblxuICBzLm9uKCdlcnJvcicsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHBhcnNlU3RyZWFtKHMsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydHMucGFyc2VGaWxlID0gcGFyc2VGaWxlO1xuXG52YXIgcGFyc2VGaWxlU3luYyA9IGZ1bmN0aW9uIHBhcnNlRmlsZVN5bmMoZmlsZSwgb3B0aW9ucykge1xuICByZXR1cm4gcGFyc2VTdHJpbmdTeW5jKF9mc1tcImRlZmF1bHRcIl0ucmVhZEZpbGVTeW5jKGZpbGUsICd1dGY4JyksIG9wdGlvbnMpO1xufTsgLy8gQHBhcmFtIHtzdHJpbmd9IHN0ciBUaGUgRy1jb2RlIHRleHQgc3RyaW5nXG4vLyBAcGFyYW0ge29wdGlvbnN9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0XG4vLyBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cblxuXG5leHBvcnRzLnBhcnNlRmlsZVN5bmMgPSBwYXJzZUZpbGVTeW5jO1xuXG52YXIgcGFyc2VTdHJpbmcgPSBmdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIsIG9wdGlvbnMpIHtcbiAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBub29wO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICByZXR1cm4gcGFyc2VTdHJlYW0oc3RyZWFtaWZ5KHN0ciksIG9wdGlvbnMsIGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydHMucGFyc2VTdHJpbmcgPSBwYXJzZVN0cmluZztcblxudmFyIHBhcnNlU3RyaW5nU3luYyA9IGZ1bmN0aW9uIHBhcnNlU3RyaW5nU3luYyhzdHIsIG9wdGlvbnMpIHtcbiAgdmFyIF9vcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgb3B0aW9ucyksXG4gICAgICBfb3B0aW9ucyRmbGF0dGVuID0gX29wdGlvbnMuZmxhdHRlbixcbiAgICAgIGZsYXR0ZW4gPSBfb3B0aW9ucyRmbGF0dGVuID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGZsYXR0ZW4sXG4gICAgICBfb3B0aW9ucyRub1BhcnNlTGluZSA9IF9vcHRpb25zLm5vUGFyc2VMaW5lLFxuICAgICAgbm9QYXJzZUxpbmUgPSBfb3B0aW9ucyRub1BhcnNlTGluZSA9PT0gdm9pZCAwID8gZmFsc2UgOiBfb3B0aW9ucyRub1BhcnNlTGluZTtcblxuICB2YXIgcmVzdWx0cyA9IFtdO1xuICB2YXIgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgbGluZSA9IGxpbmVzW2ldLnRyaW0oKTtcblxuICAgIGlmIChsaW5lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHBhcnNlTGluZShsaW5lLCB7XG4gICAgICBmbGF0dGVuOiBmbGF0dGVuLFxuICAgICAgbm9QYXJzZUxpbmU6IG5vUGFyc2VMaW5lXG4gICAgfSk7XG4gICAgcmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0cztcbn07IC8vIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIEctY29kZSB0ZXh0IHN0cmluZ1xuLy8gQHBhcmFtIHtvcHRpb25zfSBvcHRpb25zIFRoZSBvcHRpb25zIG9iamVjdFxuXG5cbmV4cG9ydHMucGFyc2VTdHJpbmdTeW5jID0gcGFyc2VTdHJpbmdTeW5jO1xuXG52YXIgR0NvZGVMaW5lU3RyZWFtID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfVHJhbnNmb3JtKSB7XG4gIF9pbmhlcml0cyhHQ29kZUxpbmVTdHJlYW0sIF9UcmFuc2Zvcm0pO1xuXG4gIC8vIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0XG4gIC8vIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5iYXRjaFNpemVdIFRoZSBiYXRjaCBzaXplLlxuICAvLyBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmZsYXR0ZW5dIFRydWUgdG8gZmxhdHRlbiB0aGUgYXJyYXksIGZhbHNlIG90aGVyd2lzZS5cbiAgLy8gQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5ub1BhcnNlTGluZV0gVHJ1ZSB0byBub3QgcGFyc2UgbGluZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICBmdW5jdGlvbiBHQ29kZUxpbmVTdHJlYW0oKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEdDb2RlTGluZVN0cmVhbSk7XG5cbiAgICBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihHQ29kZUxpbmVTdHJlYW0pLmNhbGwodGhpcywge1xuICAgICAgb2JqZWN0TW9kZTogdHJ1ZVxuICAgIH0pKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJzdGF0ZVwiLCB7XG4gICAgICBsaW5lQ291bnQ6IDAsXG4gICAgICBsYXN0Q2h1bmtFbmRlZFdpdGhDUjogZmFsc2VcbiAgICB9KTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJvcHRpb25zXCIsIHtcbiAgICAgIGJhdGNoU2l6ZTogMTAwMCxcbiAgICAgIG5vUGFyc2VMaW5lOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImxpbmVCdWZmZXJcIiwgJycpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInJlXCIsIG5ldyBSZWdFeHAoLy4qKD86XFxyXFxufFxccnxcXG4pfC4rJC9nKSk7XG5cbiAgICBfdGhpcy5vcHRpb25zID0gX29iamVjdFNwcmVhZCh7fSwgX3RoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEdDb2RlTGluZVN0cmVhbSwgW3tcbiAgICBrZXk6IFwiX3RyYW5zZm9ybVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfdHJhbnNmb3JtKGNodW5rLCBlbmNvZGluZywgbmV4dCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIC8vIGRlY29kZSBiaW5hcnkgY2h1bmtzIGFzIFVURi04XG4gICAgICBlbmNvZGluZyA9IGVuY29kaW5nIHx8ICd1dGY4JztcblxuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpIHtcbiAgICAgICAgaWYgKGVuY29kaW5nID09PSAnYnVmZmVyJykge1xuICAgICAgICAgIGVuY29kaW5nID0gJ3V0ZjgnO1xuICAgICAgICB9XG5cbiAgICAgICAgY2h1bmsgPSBjaHVuay50b1N0cmluZyhlbmNvZGluZyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGluZUJ1ZmZlciArPSBjaHVuaztcblxuICAgICAgaWYgKCFjb250YWluc0xpbmVFbmQoY2h1bmspKSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGluZXMgPSB0aGlzLmxpbmVCdWZmZXIubWF0Y2godGhpcy5yZSk7XG5cbiAgICAgIGlmICghbGluZXMgfHwgbGluZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSAvLyBEbyBub3Qgc3BsaXQgQ1JMRiB3aGljaCBzcGFucyBjaHVua3NcblxuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5sYXN0Q2h1bmtFbmRlZFdpdGhDUiAmJiBsaW5lc1swXSA9PT0gJ1xcbicpIHtcbiAgICAgICAgbGluZXMuc2hpZnQoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGF0ZS5sYXN0Q2h1bmtFbmRlZFdpdGhDUiA9IHRoaXMubGluZUJ1ZmZlclt0aGlzLmxpbmVCdWZmZXIubGVuZ3RoIC0gMV0gPT09ICdcXHInO1xuXG4gICAgICBpZiAodGhpcy5saW5lQnVmZmVyW3RoaXMubGluZUJ1ZmZlci5sZW5ndGggLSAxXSA9PT0gJ1xccicgfHwgdGhpcy5saW5lQnVmZmVyW3RoaXMubGluZUJ1ZmZlci5sZW5ndGggLSAxXSA9PT0gJ1xcbicpIHtcbiAgICAgICAgdGhpcy5saW5lQnVmZmVyID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbGluZSA9IGxpbmVzLnBvcCgpIHx8ICcnO1xuICAgICAgICB0aGlzLmxpbmVCdWZmZXIgPSBsaW5lO1xuICAgICAgfVxuXG4gICAgICBpdGVyYXRlQXJyYXkobGluZXMsIHtcbiAgICAgICAgYmF0Y2hTaXplOiB0aGlzLm9wdGlvbnMuYmF0Y2hTaXplXG4gICAgICB9LCBmdW5jdGlvbiAobGluZSwga2V5KSB7XG4gICAgICAgIGxpbmUgPSBsaW5lLnRyaW0oKTtcblxuICAgICAgICBpZiAobGluZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlTGluZShsaW5lLCB7XG4gICAgICAgICAgICBmbGF0dGVuOiBfdGhpczIub3B0aW9ucy5mbGF0dGVuLFxuICAgICAgICAgICAgbm9QYXJzZUxpbmU6IF90aGlzMi5vcHRpb25zLm5vUGFyc2VMaW5lXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBfdGhpczIucHVzaChyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICB9LCBuZXh0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZsdXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9mbHVzaChkb25lKSB7XG4gICAgICBpZiAodGhpcy5saW5lQnVmZmVyKSB7XG4gICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lQnVmZmVyLnRyaW0oKTtcblxuICAgICAgICBpZiAobGluZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlTGluZShsaW5lLCB7XG4gICAgICAgICAgICBmbGF0dGVuOiB0aGlzLm9wdGlvbnMuZmxhdHRlbixcbiAgICAgICAgICAgIG5vUGFyc2VMaW5lOiB0aGlzLm9wdGlvbnMubm9QYXJzZUxpbmVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGluZUJ1ZmZlciA9ICcnO1xuICAgICAgICB0aGlzLnN0YXRlLmxhc3RDaHVua0VuZGVkV2l0aENSID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gR0NvZGVMaW5lU3RyZWFtO1xufShfc3RyZWFtLlRyYW5zZm9ybSk7XG5cbmV4cG9ydHMuR0NvZGVMaW5lU3RyZWFtID0gR0NvZGVMaW5lU3RyZWFtOyIsIi8qISBpZWVlNzU0LiBCU0QtMy1DbGF1c2UgTGljZW5zZS4gRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnL29wZW5zb3VyY2U+ICovXG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBpZiAoc3VwZXJDdG9yKSB7XG4gICAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGlmIChzdXBlckN0b3IpIHtcbiAgICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gICAgfVxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIGNvZGVzID0ge307XG5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yVHlwZShjb2RlLCBtZXNzYWdlLCBCYXNlKSB7XG4gIGlmICghQmFzZSkge1xuICAgIEJhc2UgPSBFcnJvcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1lc3NhZ2UoYXJnMSwgYXJnMiwgYXJnMykge1xuICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWVzc2FnZShhcmcxLCBhcmcyLCBhcmczKTtcbiAgICB9XG4gIH1cblxuICB2YXIgTm9kZUVycm9yID1cbiAgLyojX19QVVJFX18qL1xuICBmdW5jdGlvbiAoX0Jhc2UpIHtcbiAgICBfaW5oZXJpdHNMb29zZShOb2RlRXJyb3IsIF9CYXNlKTtcblxuICAgIGZ1bmN0aW9uIE5vZGVFcnJvcihhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgICByZXR1cm4gX0Jhc2UuY2FsbCh0aGlzLCBnZXRNZXNzYWdlKGFyZzEsIGFyZzIsIGFyZzMpKSB8fCB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiBOb2RlRXJyb3I7XG4gIH0oQmFzZSk7XG5cbiAgTm9kZUVycm9yLnByb3RvdHlwZS5uYW1lID0gQmFzZS5uYW1lO1xuICBOb2RlRXJyb3IucHJvdG90eXBlLmNvZGUgPSBjb2RlO1xuICBjb2Rlc1tjb2RlXSA9IE5vZGVFcnJvcjtcbn0gLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2Jsb2IvdjEwLjguMC9saWIvaW50ZXJuYWwvZXJyb3JzLmpzXG5cblxuZnVuY3Rpb24gb25lT2YoZXhwZWN0ZWQsIHRoaW5nKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGV4cGVjdGVkKSkge1xuICAgIHZhciBsZW4gPSBleHBlY3RlZC5sZW5ndGg7XG4gICAgZXhwZWN0ZWQgPSBleHBlY3RlZC5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgIHJldHVybiBTdHJpbmcoaSk7XG4gICAgfSk7XG5cbiAgICBpZiAobGVuID4gMikge1xuICAgICAgcmV0dXJuIFwib25lIG9mIFwiLmNvbmNhdCh0aGluZywgXCIgXCIpLmNvbmNhdChleHBlY3RlZC5zbGljZSgwLCBsZW4gLSAxKS5qb2luKCcsICcpLCBcIiwgb3IgXCIpICsgZXhwZWN0ZWRbbGVuIC0gMV07XG4gICAgfSBlbHNlIGlmIChsZW4gPT09IDIpIHtcbiAgICAgIHJldHVybiBcIm9uZSBvZiBcIi5jb25jYXQodGhpbmcsIFwiIFwiKS5jb25jYXQoZXhwZWN0ZWRbMF0sIFwiIG9yIFwiKS5jb25jYXQoZXhwZWN0ZWRbMV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJvZiBcIi5jb25jYXQodGhpbmcsIFwiIFwiKS5jb25jYXQoZXhwZWN0ZWRbMF0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXCJvZiBcIi5jb25jYXQodGhpbmcsIFwiIFwiKS5jb25jYXQoU3RyaW5nKGV4cGVjdGVkKSk7XG4gIH1cbn0gLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3RyaW5nL3N0YXJ0c1dpdGhcblxuXG5mdW5jdGlvbiBzdGFydHNXaXRoKHN0ciwgc2VhcmNoLCBwb3MpIHtcbiAgcmV0dXJuIHN0ci5zdWJzdHIoIXBvcyB8fCBwb3MgPCAwID8gMCA6ICtwb3MsIHNlYXJjaC5sZW5ndGgpID09PSBzZWFyY2g7XG59IC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9lbmRzV2l0aFxuXG5cbmZ1bmN0aW9uIGVuZHNXaXRoKHN0ciwgc2VhcmNoLCB0aGlzX2xlbikge1xuICBpZiAodGhpc19sZW4gPT09IHVuZGVmaW5lZCB8fCB0aGlzX2xlbiA+IHN0ci5sZW5ndGgpIHtcbiAgICB0aGlzX2xlbiA9IHN0ci5sZW5ndGg7XG4gIH1cblxuICByZXR1cm4gc3RyLnN1YnN0cmluZyh0aGlzX2xlbiAtIHNlYXJjaC5sZW5ndGgsIHRoaXNfbGVuKSA9PT0gc2VhcmNoO1xufSAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvaW5jbHVkZXNcblxuXG5mdW5jdGlvbiBpbmNsdWRlcyhzdHIsIHNlYXJjaCwgc3RhcnQpIHtcbiAgaWYgKHR5cGVvZiBzdGFydCAhPT0gJ251bWJlcicpIHtcbiAgICBzdGFydCA9IDA7XG4gIH1cblxuICBpZiAoc3RhcnQgKyBzZWFyY2gubGVuZ3RoID4gc3RyLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyLmluZGV4T2Yoc2VhcmNoLCBzdGFydCkgIT09IC0xO1xuICB9XG59XG5cbmNyZWF0ZUVycm9yVHlwZSgnRVJSX0lOVkFMSURfT1BUX1ZBTFVFJywgZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiAnVGhlIHZhbHVlIFwiJyArIHZhbHVlICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcIicgKyBuYW1lICsgJ1wiJztcbn0sIFR5cGVFcnJvcik7XG5jcmVhdGVFcnJvclR5cGUoJ0VSUl9JTlZBTElEX0FSR19UWVBFJywgZnVuY3Rpb24gKG5hbWUsIGV4cGVjdGVkLCBhY3R1YWwpIHtcbiAgLy8gZGV0ZXJtaW5lcjogJ211c3QgYmUnIG9yICdtdXN0IG5vdCBiZSdcbiAgdmFyIGRldGVybWluZXI7XG5cbiAgaWYgKHR5cGVvZiBleHBlY3RlZCA9PT0gJ3N0cmluZycgJiYgc3RhcnRzV2l0aChleHBlY3RlZCwgJ25vdCAnKSkge1xuICAgIGRldGVybWluZXIgPSAnbXVzdCBub3QgYmUnO1xuICAgIGV4cGVjdGVkID0gZXhwZWN0ZWQucmVwbGFjZSgvXm5vdCAvLCAnJyk7XG4gIH0gZWxzZSB7XG4gICAgZGV0ZXJtaW5lciA9ICdtdXN0IGJlJztcbiAgfVxuXG4gIHZhciBtc2c7XG5cbiAgaWYgKGVuZHNXaXRoKG5hbWUsICcgYXJndW1lbnQnKSkge1xuICAgIC8vIEZvciBjYXNlcyBsaWtlICdmaXJzdCBhcmd1bWVudCdcbiAgICBtc2cgPSBcIlRoZSBcIi5jb25jYXQobmFtZSwgXCIgXCIpLmNvbmNhdChkZXRlcm1pbmVyLCBcIiBcIikuY29uY2F0KG9uZU9mKGV4cGVjdGVkLCAndHlwZScpKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdHlwZSA9IGluY2x1ZGVzKG5hbWUsICcuJykgPyAncHJvcGVydHknIDogJ2FyZ3VtZW50JztcbiAgICBtc2cgPSBcIlRoZSBcXFwiXCIuY29uY2F0KG5hbWUsIFwiXFxcIiBcIikuY29uY2F0KHR5cGUsIFwiIFwiKS5jb25jYXQoZGV0ZXJtaW5lciwgXCIgXCIpLmNvbmNhdChvbmVPZihleHBlY3RlZCwgJ3R5cGUnKSk7XG4gIH1cblxuICBtc2cgKz0gXCIuIFJlY2VpdmVkIHR5cGUgXCIuY29uY2F0KHR5cGVvZiBhY3R1YWwpO1xuICByZXR1cm4gbXNnO1xufSwgVHlwZUVycm9yKTtcbmNyZWF0ZUVycm9yVHlwZSgnRVJSX1NUUkVBTV9QVVNIX0FGVEVSX0VPRicsICdzdHJlYW0ucHVzaCgpIGFmdGVyIEVPRicpO1xuY3JlYXRlRXJyb3JUeXBlKCdFUlJfTUVUSE9EX05PVF9JTVBMRU1FTlRFRCcsIGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiAnVGhlICcgKyBuYW1lICsgJyBtZXRob2QgaXMgbm90IGltcGxlbWVudGVkJztcbn0pO1xuY3JlYXRlRXJyb3JUeXBlKCdFUlJfU1RSRUFNX1BSRU1BVFVSRV9DTE9TRScsICdQcmVtYXR1cmUgY2xvc2UnKTtcbmNyZWF0ZUVycm9yVHlwZSgnRVJSX1NUUkVBTV9ERVNUUk9ZRUQnLCBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gJ0Nhbm5vdCBjYWxsICcgKyBuYW1lICsgJyBhZnRlciBhIHN0cmVhbSB3YXMgZGVzdHJveWVkJztcbn0pO1xuY3JlYXRlRXJyb3JUeXBlKCdFUlJfTVVMVElQTEVfQ0FMTEJBQ0snLCAnQ2FsbGJhY2sgY2FsbGVkIG11bHRpcGxlIHRpbWVzJyk7XG5jcmVhdGVFcnJvclR5cGUoJ0VSUl9TVFJFQU1fQ0FOTk9UX1BJUEUnLCAnQ2Fubm90IHBpcGUsIG5vdCByZWFkYWJsZScpO1xuY3JlYXRlRXJyb3JUeXBlKCdFUlJfU1RSRUFNX1dSSVRFX0FGVEVSX0VORCcsICd3cml0ZSBhZnRlciBlbmQnKTtcbmNyZWF0ZUVycm9yVHlwZSgnRVJSX1NUUkVBTV9OVUxMX1ZBTFVFUycsICdNYXkgbm90IHdyaXRlIG51bGwgdmFsdWVzIHRvIHN0cmVhbScsIFR5cGVFcnJvcik7XG5jcmVhdGVFcnJvclR5cGUoJ0VSUl9VTktOT1dOX0VOQ09ESU5HJywgZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBhcmc7XG59LCBUeXBlRXJyb3IpO1xuY3JlYXRlRXJyb3JUeXBlKCdFUlJfU1RSRUFNX1VOU0hJRlRfQUZURVJfRU5EX0VWRU5UJywgJ3N0cmVhbS51bnNoaWZ0KCkgYWZ0ZXIgZW5kIGV2ZW50Jyk7XG5tb2R1bGUuZXhwb3J0cy5jb2RlcyA9IGNvZGVzO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIGEgZHVwbGV4IHN0cmVhbSBpcyBqdXN0IGEgc3RyZWFtIHRoYXQgaXMgYm90aCByZWFkYWJsZSBhbmQgd3JpdGFibGUuXG4vLyBTaW5jZSBKUyBkb2Vzbid0IGhhdmUgbXVsdGlwbGUgcHJvdG90eXBhbCBpbmhlcml0YW5jZSwgdGhpcyBjbGFzc1xuLy8gcHJvdG90eXBhbGx5IGluaGVyaXRzIGZyb20gUmVhZGFibGUsIGFuZCB0aGVuIHBhcmFzaXRpY2FsbHkgZnJvbVxuLy8gV3JpdGFibGUuXG5cbid1c2Ugc3RyaWN0JztcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgcmV0dXJuIGtleXM7XG59O1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbm1vZHVsZS5leHBvcnRzID0gRHVwbGV4O1xudmFyIFJlYWRhYmxlID0gcmVxdWlyZSgnLi9fc3RyZWFtX3JlYWRhYmxlJyk7XG52YXIgV3JpdGFibGUgPSByZXF1aXJlKCcuL19zdHJlYW1fd3JpdGFibGUnKTtcbnJlcXVpcmUoJ2luaGVyaXRzJykoRHVwbGV4LCBSZWFkYWJsZSk7XG57XG4gIC8vIEFsbG93IHRoZSBrZXlzIGFycmF5IHRvIGJlIEdDJ2VkLlxuICB2YXIga2V5cyA9IG9iamVjdEtleXMoV3JpdGFibGUucHJvdG90eXBlKTtcbiAgZm9yICh2YXIgdiA9IDA7IHYgPCBrZXlzLmxlbmd0aDsgdisrKSB7XG4gICAgdmFyIG1ldGhvZCA9IGtleXNbdl07XG4gICAgaWYgKCFEdXBsZXgucHJvdG90eXBlW21ldGhvZF0pIER1cGxleC5wcm90b3R5cGVbbWV0aG9kXSA9IFdyaXRhYmxlLnByb3RvdHlwZVttZXRob2RdO1xuICB9XG59XG5mdW5jdGlvbiBEdXBsZXgob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRHVwbGV4KSkgcmV0dXJuIG5ldyBEdXBsZXgob3B0aW9ucyk7XG4gIFJlYWRhYmxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gIFdyaXRhYmxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gIHRoaXMuYWxsb3dIYWxmT3BlbiA9IHRydWU7XG4gIGlmIChvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMucmVhZGFibGUgPT09IGZhbHNlKSB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgaWYgKG9wdGlvbnMud3JpdGFibGUgPT09IGZhbHNlKSB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gICAgaWYgKG9wdGlvbnMuYWxsb3dIYWxmT3BlbiA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuYWxsb3dIYWxmT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5vbmNlKCdlbmQnLCBvbmVuZCk7XG4gICAgfVxuICB9XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRHVwbGV4LnByb3RvdHlwZSwgJ3dyaXRhYmxlSGlnaFdhdGVyTWFyaycsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUuaGlnaFdhdGVyTWFyaztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRHVwbGV4LnByb3RvdHlwZSwgJ3dyaXRhYmxlQnVmZmVyJywge1xuICAvLyBtYWtpbmcgaXQgZXhwbGljaXQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgZW51bWVyYWJsZVxuICAvLyBiZWNhdXNlIG90aGVyd2lzZSBzb21lIHByb3RvdHlwZSBtYW5pcHVsYXRpb24gaW5cbiAgLy8gdXNlcmxhbmQgd2lsbCBmYWlsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZSAmJiB0aGlzLl93cml0YWJsZVN0YXRlLmdldEJ1ZmZlcigpO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShEdXBsZXgucHJvdG90eXBlLCAnd3JpdGFibGVMZW5ndGgnLCB7XG4gIC8vIG1ha2luZyBpdCBleHBsaWNpdCB0aGlzIHByb3BlcnR5IGlzIG5vdCBlbnVtZXJhYmxlXG4gIC8vIGJlY2F1c2Ugb3RoZXJ3aXNlIHNvbWUgcHJvdG90eXBlIG1hbmlwdWxhdGlvbiBpblxuICAvLyB1c2VybGFuZCB3aWxsIGZhaWxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl93cml0YWJsZVN0YXRlLmxlbmd0aDtcbiAgfVxufSk7XG5cbi8vIHRoZSBuby1oYWxmLW9wZW4gZW5mb3JjZXJcbmZ1bmN0aW9uIG9uZW5kKCkge1xuICAvLyBJZiB0aGUgd3JpdGFibGUgc2lkZSBlbmRlZCwgdGhlbiB3ZSdyZSBvay5cbiAgaWYgKHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQpIHJldHVybjtcblxuICAvLyBubyBtb3JlIGRhdGEgY2FuIGJlIHdyaXR0ZW4uXG4gIC8vIEJ1dCBhbGxvdyBtb3JlIHdyaXRlcyB0byBoYXBwZW4gaW4gdGhpcyB0aWNrLlxuICBwcm9jZXNzLm5leHRUaWNrKG9uRW5kTlQsIHRoaXMpO1xufVxuZnVuY3Rpb24gb25FbmROVChzZWxmKSB7XG4gIHNlbGYuZW5kKCk7XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRHVwbGV4LnByb3RvdHlwZSwgJ2Rlc3Ryb3llZCcsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgaWYgKHRoaXMuX3JlYWRhYmxlU3RhdGUgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl93cml0YWJsZVN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkICYmIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgIC8vIHdlIGlnbm9yZSB0aGUgdmFsdWUgaWYgdGhlIHN0cmVhbVxuICAgIC8vIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXRcbiAgICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHRoZSB1c2VyIGlzIGV4cGxpY2l0bHlcbiAgICAvLyBtYW5hZ2luZyBkZXN0cm95ZWRcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZCA9IHZhbHVlO1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkID0gdmFsdWU7XG4gIH1cbn0pOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBhIHBhc3N0aHJvdWdoIHN0cmVhbS5cbi8vIGJhc2ljYWxseSBqdXN0IHRoZSBtb3N0IG1pbmltYWwgc29ydCBvZiBUcmFuc2Zvcm0gc3RyZWFtLlxuLy8gRXZlcnkgd3JpdHRlbiBjaHVuayBnZXRzIG91dHB1dCBhcy1pcy5cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhc3NUaHJvdWdoO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vX3N0cmVhbV90cmFuc2Zvcm0nKTtcbnJlcXVpcmUoJ2luaGVyaXRzJykoUGFzc1Rocm91Z2gsIFRyYW5zZm9ybSk7XG5mdW5jdGlvbiBQYXNzVGhyb3VnaChvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQYXNzVGhyb3VnaCkpIHJldHVybiBuZXcgUGFzc1Rocm91Z2gob3B0aW9ucyk7XG4gIFRyYW5zZm9ybS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xufVxuUGFzc1Rocm91Z2gucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihudWxsLCBjaHVuayk7XG59OyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhZGFibGU7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgRHVwbGV4O1xuLyo8L3JlcGxhY2VtZW50PiovXG5cblJlYWRhYmxlLlJlYWRhYmxlU3RhdGUgPSBSZWFkYWJsZVN0YXRlO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIEVFID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIEVFbGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uIEVFbGlzdGVuZXJDb3VudChlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVycyh0eXBlKS5sZW5ndGg7XG59O1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgU3RyZWFtID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9zdHJlYW1zL3N0cmVhbScpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG52YXIgT3VyVWludDhBcnJheSA9ICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHt9KS5VaW50OEFycmF5IHx8IGZ1bmN0aW9uICgpIHt9O1xuZnVuY3Rpb24gX3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuaykge1xuICByZXR1cm4gQnVmZmVyLmZyb20oY2h1bmspO1xufVxuZnVuY3Rpb24gX2lzVWludDhBcnJheShvYmopIHtcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopIHx8IG9iaiBpbnN0YW5jZW9mIE91clVpbnQ4QXJyYXk7XG59XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgZGVidWdVdGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIGRlYnVnO1xuaWYgKGRlYnVnVXRpbCAmJiBkZWJ1Z1V0aWwuZGVidWdsb2cpIHtcbiAgZGVidWcgPSBkZWJ1Z1V0aWwuZGVidWdsb2coJ3N0cmVhbScpO1xufSBlbHNlIHtcbiAgZGVidWcgPSBmdW5jdGlvbiBkZWJ1ZygpIHt9O1xufVxuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBCdWZmZXJMaXN0ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9zdHJlYW1zL2J1ZmZlcl9saXN0Jyk7XG52YXIgZGVzdHJveUltcGwgPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveScpO1xudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9zdHJlYW1zL3N0YXRlJyksXG4gIGdldEhpZ2hXYXRlck1hcmsgPSBfcmVxdWlyZS5nZXRIaWdoV2F0ZXJNYXJrO1xudmFyIF9yZXF1aXJlJGNvZGVzID0gcmVxdWlyZSgnLi4vZXJyb3JzJykuY29kZXMsXG4gIEVSUl9JTlZBTElEX0FSR19UWVBFID0gX3JlcXVpcmUkY29kZXMuRVJSX0lOVkFMSURfQVJHX1RZUEUsXG4gIEVSUl9TVFJFQU1fUFVTSF9BRlRFUl9FT0YgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfU1RSRUFNX1BVU0hfQUZURVJfRU9GLFxuICBFUlJfTUVUSE9EX05PVF9JTVBMRU1FTlRFRCA9IF9yZXF1aXJlJGNvZGVzLkVSUl9NRVRIT0RfTk9UX0lNUExFTUVOVEVELFxuICBFUlJfU1RSRUFNX1VOU0hJRlRfQUZURVJfRU5EX0VWRU5UID0gX3JlcXVpcmUkY29kZXMuRVJSX1NUUkVBTV9VTlNISUZUX0FGVEVSX0VORF9FVkVOVDtcblxuLy8gTGF6eSBsb2FkZWQgdG8gaW1wcm92ZSB0aGUgc3RhcnR1cCBwZXJmb3JtYW5jZS5cbnZhciBTdHJpbmdEZWNvZGVyO1xudmFyIGNyZWF0ZVJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjtcbnZhciBmcm9tO1xucmVxdWlyZSgnaW5oZXJpdHMnKShSZWFkYWJsZSwgU3RyZWFtKTtcbnZhciBlcnJvck9yRGVzdHJveSA9IGRlc3Ryb3lJbXBsLmVycm9yT3JEZXN0cm95O1xudmFyIGtQcm94eUV2ZW50cyA9IFsnZXJyb3InLCAnY2xvc2UnLCAnZGVzdHJveScsICdwYXVzZScsICdyZXN1bWUnXTtcbmZ1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcihlbWl0dGVyLCBldmVudCwgZm4pIHtcbiAgLy8gU2FkbHkgdGhpcyBpcyBub3QgY2FjaGVhYmxlIGFzIHNvbWUgbGlicmFyaWVzIGJ1bmRsZSB0aGVpciBvd25cbiAgLy8gZXZlbnQgZW1pdHRlciBpbXBsZW1lbnRhdGlvbiB3aXRoIHRoZW0uXG4gIGlmICh0eXBlb2YgZW1pdHRlci5wcmVwZW5kTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHJldHVybiBlbWl0dGVyLnByZXBlbmRMaXN0ZW5lcihldmVudCwgZm4pO1xuXG4gIC8vIFRoaXMgaXMgYSBoYWNrIHRvIG1ha2Ugc3VyZSB0aGF0IG91ciBlcnJvciBoYW5kbGVyIGlzIGF0dGFjaGVkIGJlZm9yZSBhbnlcbiAgLy8gdXNlcmxhbmQgb25lcy4gIE5FVkVSIERPIFRISVMuIFRoaXMgaXMgaGVyZSBvbmx5IGJlY2F1c2UgdGhpcyBjb2RlIG5lZWRzXG4gIC8vIHRvIGNvbnRpbnVlIHRvIHdvcmsgd2l0aCBvbGRlciB2ZXJzaW9ucyBvZiBOb2RlLmpzIHRoYXQgZG8gbm90IGluY2x1ZGVcbiAgLy8gdGhlIHByZXBlbmRMaXN0ZW5lcigpIG1ldGhvZC4gVGhlIGdvYWwgaXMgdG8gZXZlbnR1YWxseSByZW1vdmUgdGhpcyBoYWNrLlxuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW2V2ZW50XSkgZW1pdHRlci5vbihldmVudCwgZm4pO2Vsc2UgaWYgKEFycmF5LmlzQXJyYXkoZW1pdHRlci5fZXZlbnRzW2V2ZW50XSkpIGVtaXR0ZXIuX2V2ZW50c1tldmVudF0udW5zaGlmdChmbik7ZWxzZSBlbWl0dGVyLl9ldmVudHNbZXZlbnRdID0gW2ZuLCBlbWl0dGVyLl9ldmVudHNbZXZlbnRdXTtcbn1cbmZ1bmN0aW9uIFJlYWRhYmxlU3RhdGUob3B0aW9ucywgc3RyZWFtLCBpc0R1cGxleCkge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBEdXBsZXggc3RyZWFtcyBhcmUgYm90aCByZWFkYWJsZSBhbmQgd3JpdGFibGUsIGJ1dCBzaGFyZVxuICAvLyB0aGUgc2FtZSBvcHRpb25zIG9iamVjdC5cbiAgLy8gSG93ZXZlciwgc29tZSBjYXNlcyByZXF1aXJlIHNldHRpbmcgb3B0aW9ucyB0byBkaWZmZXJlbnRcbiAgLy8gdmFsdWVzIGZvciB0aGUgcmVhZGFibGUgYW5kIHRoZSB3cml0YWJsZSBzaWRlcyBvZiB0aGUgZHVwbGV4IHN0cmVhbS5cbiAgLy8gVGhlc2Ugb3B0aW9ucyBjYW4gYmUgcHJvdmlkZWQgc2VwYXJhdGVseSBhcyByZWFkYWJsZVhYWCBhbmQgd3JpdGFibGVYWFguXG4gIGlmICh0eXBlb2YgaXNEdXBsZXggIT09ICdib29sZWFuJykgaXNEdXBsZXggPSBzdHJlYW0gaW5zdGFuY2VvZiBEdXBsZXg7XG5cbiAgLy8gb2JqZWN0IHN0cmVhbSBmbGFnLiBVc2VkIHRvIG1ha2UgcmVhZChuKSBpZ25vcmUgbiBhbmQgdG9cbiAgLy8gbWFrZSBhbGwgdGhlIGJ1ZmZlciBtZXJnaW5nIGFuZCBsZW5ndGggY2hlY2tzIGdvIGF3YXlcbiAgdGhpcy5vYmplY3RNb2RlID0gISFvcHRpb25zLm9iamVjdE1vZGU7XG4gIGlmIChpc0R1cGxleCkgdGhpcy5vYmplY3RNb2RlID0gdGhpcy5vYmplY3RNb2RlIHx8ICEhb3B0aW9ucy5yZWFkYWJsZU9iamVjdE1vZGU7XG5cbiAgLy8gdGhlIHBvaW50IGF0IHdoaWNoIGl0IHN0b3BzIGNhbGxpbmcgX3JlYWQoKSB0byBmaWxsIHRoZSBidWZmZXJcbiAgLy8gTm90ZTogMCBpcyBhIHZhbGlkIHZhbHVlLCBtZWFucyBcImRvbid0IGNhbGwgX3JlYWQgcHJlZW1wdGl2ZWx5IGV2ZXJcIlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSBnZXRIaWdoV2F0ZXJNYXJrKHRoaXMsIG9wdGlvbnMsICdyZWFkYWJsZUhpZ2hXYXRlck1hcmsnLCBpc0R1cGxleCk7XG5cbiAgLy8gQSBsaW5rZWQgbGlzdCBpcyB1c2VkIHRvIHN0b3JlIGRhdGEgY2h1bmtzIGluc3RlYWQgb2YgYW4gYXJyYXkgYmVjYXVzZSB0aGVcbiAgLy8gbGlua2VkIGxpc3QgY2FuIHJlbW92ZSBlbGVtZW50cyBmcm9tIHRoZSBiZWdpbm5pbmcgZmFzdGVyIHRoYW5cbiAgLy8gYXJyYXkuc2hpZnQoKVxuICB0aGlzLmJ1ZmZlciA9IG5ldyBCdWZmZXJMaXN0KCk7XG4gIHRoaXMubGVuZ3RoID0gMDtcbiAgdGhpcy5waXBlcyA9IG51bGw7XG4gIHRoaXMucGlwZXNDb3VudCA9IDA7XG4gIHRoaXMuZmxvd2luZyA9IG51bGw7XG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgdGhpcy5lbmRFbWl0dGVkID0gZmFsc2U7XG4gIHRoaXMucmVhZGluZyA9IGZhbHNlO1xuXG4gIC8vIGEgZmxhZyB0byBiZSBhYmxlIHRvIHRlbGwgaWYgdGhlIGV2ZW50ICdyZWFkYWJsZScvJ2RhdGEnIGlzIGVtaXR0ZWRcbiAgLy8gaW1tZWRpYXRlbHksIG9yIG9uIGEgbGF0ZXIgdGljay4gIFdlIHNldCB0aGlzIHRvIHRydWUgYXQgZmlyc3QsIGJlY2F1c2VcbiAgLy8gYW55IGFjdGlvbnMgdGhhdCBzaG91bGRuJ3QgaGFwcGVuIHVudGlsIFwibGF0ZXJcIiBzaG91bGQgZ2VuZXJhbGx5IGFsc29cbiAgLy8gbm90IGhhcHBlbiBiZWZvcmUgdGhlIGZpcnN0IHJlYWQgY2FsbC5cbiAgdGhpcy5zeW5jID0gdHJ1ZTtcblxuICAvLyB3aGVuZXZlciB3ZSByZXR1cm4gbnVsbCwgdGhlbiB3ZSBzZXQgYSBmbGFnIHRvIHNheVxuICAvLyB0aGF0IHdlJ3JlIGF3YWl0aW5nIGEgJ3JlYWRhYmxlJyBldmVudCBlbWlzc2lvbi5cbiAgdGhpcy5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5yZWFkYWJsZUxpc3RlbmluZyA9IGZhbHNlO1xuICB0aGlzLnJlc3VtZVNjaGVkdWxlZCA9IGZhbHNlO1xuICB0aGlzLnBhdXNlZCA9IHRydWU7XG5cbiAgLy8gU2hvdWxkIGNsb3NlIGJlIGVtaXR0ZWQgb24gZGVzdHJveS4gRGVmYXVsdHMgdG8gdHJ1ZS5cbiAgdGhpcy5lbWl0Q2xvc2UgPSBvcHRpb25zLmVtaXRDbG9zZSAhPT0gZmFsc2U7XG5cbiAgLy8gU2hvdWxkIC5kZXN0cm95KCkgYmUgY2FsbGVkIGFmdGVyICdlbmQnIChhbmQgcG90ZW50aWFsbHkgJ2ZpbmlzaCcpXG4gIHRoaXMuYXV0b0Rlc3Ryb3kgPSAhIW9wdGlvbnMuYXV0b0Rlc3Ryb3k7XG5cbiAgLy8gaGFzIGl0IGJlZW4gZGVzdHJveWVkXG4gIHRoaXMuZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLy8gQ3J5cHRvIGlzIGtpbmQgb2Ygb2xkIGFuZCBjcnVzdHkuICBIaXN0b3JpY2FsbHksIGl0cyBkZWZhdWx0IHN0cmluZ1xuICAvLyBlbmNvZGluZyBpcyAnYmluYXJ5JyBzbyB3ZSBoYXZlIHRvIG1ha2UgdGhpcyBjb25maWd1cmFibGUuXG4gIC8vIEV2ZXJ5dGhpbmcgZWxzZSBpbiB0aGUgdW5pdmVyc2UgdXNlcyAndXRmOCcsIHRob3VnaC5cbiAgdGhpcy5kZWZhdWx0RW5jb2RpbmcgPSBvcHRpb25zLmRlZmF1bHRFbmNvZGluZyB8fCAndXRmOCc7XG5cbiAgLy8gdGhlIG51bWJlciBvZiB3cml0ZXJzIHRoYXQgYXJlIGF3YWl0aW5nIGEgZHJhaW4gZXZlbnQgaW4gLnBpcGUoKXNcbiAgdGhpcy5hd2FpdERyYWluID0gMDtcblxuICAvLyBpZiB0cnVlLCBhIG1heWJlUmVhZE1vcmUgaGFzIGJlZW4gc2NoZWR1bGVkXG4gIHRoaXMucmVhZGluZ01vcmUgPSBmYWxzZTtcbiAgdGhpcy5kZWNvZGVyID0gbnVsbDtcbiAgdGhpcy5lbmNvZGluZyA9IG51bGw7XG4gIGlmIChvcHRpb25zLmVuY29kaW5nKSB7XG4gICAgaWYgKCFTdHJpbmdEZWNvZGVyKSBTdHJpbmdEZWNvZGVyID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXIvJykuU3RyaW5nRGVjb2RlcjtcbiAgICB0aGlzLmRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2RlcihvcHRpb25zLmVuY29kaW5nKTtcbiAgICB0aGlzLmVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZztcbiAgfVxufVxuZnVuY3Rpb24gUmVhZGFibGUob3B0aW9ucykge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVhZGFibGUpKSByZXR1cm4gbmV3IFJlYWRhYmxlKG9wdGlvbnMpO1xuXG4gIC8vIENoZWNraW5nIGZvciBhIFN0cmVhbS5EdXBsZXggaW5zdGFuY2UgaXMgZmFzdGVyIGhlcmUgaW5zdGVhZCBvZiBpbnNpZGVcbiAgLy8gdGhlIFJlYWRhYmxlU3RhdGUgY29uc3RydWN0b3IsIGF0IGxlYXN0IHdpdGggVjggNi41XG4gIHZhciBpc0R1cGxleCA9IHRoaXMgaW5zdGFuY2VvZiBEdXBsZXg7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUgPSBuZXcgUmVhZGFibGVTdGF0ZShvcHRpb25zLCB0aGlzLCBpc0R1cGxleCk7XG5cbiAgLy8gbGVnYWN5XG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuICBpZiAob3B0aW9ucykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWFkID09PSAnZnVuY3Rpb24nKSB0aGlzLl9yZWFkID0gb3B0aW9ucy5yZWFkO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSB0aGlzLl9kZXN0cm95ID0gb3B0aW9ucy5kZXN0cm95O1xuICB9XG4gIFN0cmVhbS5jYWxsKHRoaXMpO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlLnByb3RvdHlwZSwgJ2Rlc3Ryb3llZCcsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgaWYgKHRoaXMuX3JlYWRhYmxlU3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQ7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgLy8gd2UgaWdub3JlIHRoZSB2YWx1ZSBpZiB0aGUgc3RyZWFtXG4gICAgLy8gaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldFxuICAgIGlmICghdGhpcy5fcmVhZGFibGVTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHRoZSB1c2VyIGlzIGV4cGxpY2l0bHlcbiAgICAvLyBtYW5hZ2luZyBkZXN0cm95ZWRcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZCA9IHZhbHVlO1xuICB9XG59KTtcblJlYWRhYmxlLnByb3RvdHlwZS5kZXN0cm95ID0gZGVzdHJveUltcGwuZGVzdHJveTtcblJlYWRhYmxlLnByb3RvdHlwZS5fdW5kZXN0cm95ID0gZGVzdHJveUltcGwudW5kZXN0cm95O1xuUmVhZGFibGUucHJvdG90eXBlLl9kZXN0cm95ID0gZnVuY3Rpb24gKGVyciwgY2IpIHtcbiAgY2IoZXJyKTtcbn07XG5cbi8vIE1hbnVhbGx5IHNob3ZlIHNvbWV0aGluZyBpbnRvIHRoZSByZWFkKCkgYnVmZmVyLlxuLy8gVGhpcyByZXR1cm5zIHRydWUgaWYgdGhlIGhpZ2hXYXRlck1hcmsgaGFzIG5vdCBiZWVuIGhpdCB5ZXQsXG4vLyBzaW1pbGFyIHRvIGhvdyBXcml0YWJsZS53cml0ZSgpIHJldHVybnMgdHJ1ZSBpZiB5b3Ugc2hvdWxkXG4vLyB3cml0ZSgpIHNvbWUgbW9yZS5cblJlYWRhYmxlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZykge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgc2tpcENodW5rQ2hlY2s7XG4gIGlmICghc3RhdGUub2JqZWN0TW9kZSkge1xuICAgIGlmICh0eXBlb2YgY2h1bmsgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuY29kaW5nIHx8IHN0YXRlLmRlZmF1bHRFbmNvZGluZztcbiAgICAgIGlmIChlbmNvZGluZyAhPT0gc3RhdGUuZW5jb2RpbmcpIHtcbiAgICAgICAgY2h1bmsgPSBCdWZmZXIuZnJvbShjaHVuaywgZW5jb2RpbmcpO1xuICAgICAgICBlbmNvZGluZyA9ICcnO1xuICAgICAgfVxuICAgICAgc2tpcENodW5rQ2hlY2sgPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBza2lwQ2h1bmtDaGVjayA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlYWRhYmxlQWRkQ2h1bmsodGhpcywgY2h1bmssIGVuY29kaW5nLCBmYWxzZSwgc2tpcENodW5rQ2hlY2spO1xufTtcblxuLy8gVW5zaGlmdCBzaG91bGQgKmFsd2F5cyogYmUgc29tZXRoaW5nIGRpcmVjdGx5IG91dCBvZiByZWFkKClcblJlYWRhYmxlLnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24gKGNodW5rKSB7XG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIGNodW5rLCBudWxsLCB0cnVlLCBmYWxzZSk7XG59O1xuZnVuY3Rpb24gcmVhZGFibGVBZGRDaHVuayhzdHJlYW0sIGNodW5rLCBlbmNvZGluZywgYWRkVG9Gcm9udCwgc2tpcENodW5rQ2hlY2spIHtcbiAgZGVidWcoJ3JlYWRhYmxlQWRkQ2h1bmsnLCBjaHVuayk7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgaWYgKGNodW5rID09PSBudWxsKSB7XG4gICAgc3RhdGUucmVhZGluZyA9IGZhbHNlO1xuICAgIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGVyO1xuICAgIGlmICghc2tpcENodW5rQ2hlY2spIGVyID0gY2h1bmtJbnZhbGlkKHN0YXRlLCBjaHVuayk7XG4gICAgaWYgKGVyKSB7XG4gICAgICBlcnJvck9yRGVzdHJveShzdHJlYW0sIGVyKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLm9iamVjdE1vZGUgfHwgY2h1bmsgJiYgY2h1bmsubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHR5cGVvZiBjaHVuayAhPT0gJ3N0cmluZycgJiYgIXN0YXRlLm9iamVjdE1vZGUgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGNodW5rKSAhPT0gQnVmZmVyLnByb3RvdHlwZSkge1xuICAgICAgICBjaHVuayA9IF91aW50OEFycmF5VG9CdWZmZXIoY2h1bmspO1xuICAgICAgfVxuICAgICAgaWYgKGFkZFRvRnJvbnQpIHtcbiAgICAgICAgaWYgKHN0YXRlLmVuZEVtaXR0ZWQpIGVycm9yT3JEZXN0cm95KHN0cmVhbSwgbmV3IEVSUl9TVFJFQU1fVU5TSElGVF9BRlRFUl9FTkRfRVZFTlQoKSk7ZWxzZSBhZGRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmVuZGVkKSB7XG4gICAgICAgIGVycm9yT3JEZXN0cm95KHN0cmVhbSwgbmV3IEVSUl9TVFJFQU1fUFVTSF9BRlRFUl9FT0YoKSk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmRlc3Ryb3llZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChzdGF0ZS5kZWNvZGVyICYmICFlbmNvZGluZykge1xuICAgICAgICAgIGNodW5rID0gc3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7XG4gICAgICAgICAgaWYgKHN0YXRlLm9iamVjdE1vZGUgfHwgY2h1bmsubGVuZ3RoICE9PSAwKSBhZGRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgZmFsc2UpO2Vsc2UgbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZGRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghYWRkVG9Gcm9udCkge1xuICAgICAgc3RhdGUucmVhZGluZyA9IGZhbHNlO1xuICAgICAgbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICAvLyBXZSBjYW4gcHVzaCBtb3JlIGRhdGEgaWYgd2UgYXJlIGJlbG93IHRoZSBoaWdoV2F0ZXJNYXJrLlxuICAvLyBBbHNvLCBpZiB3ZSBoYXZlIG5vIGRhdGEgeWV0LCB3ZSBjYW4gc3RhbmQgc29tZSBtb3JlIGJ5dGVzLlxuICAvLyBUaGlzIGlzIHRvIHdvcmsgYXJvdW5kIGNhc2VzIHdoZXJlIGh3bT0wLCBzdWNoIGFzIHRoZSByZXBsLlxuICByZXR1cm4gIXN0YXRlLmVuZGVkICYmIChzdGF0ZS5sZW5ndGggPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrIHx8IHN0YXRlLmxlbmd0aCA9PT0gMCk7XG59XG5mdW5jdGlvbiBhZGRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgYWRkVG9Gcm9udCkge1xuICBpZiAoc3RhdGUuZmxvd2luZyAmJiBzdGF0ZS5sZW5ndGggPT09IDAgJiYgIXN0YXRlLnN5bmMpIHtcbiAgICBzdGF0ZS5hd2FpdERyYWluID0gMDtcbiAgICBzdHJlYW0uZW1pdCgnZGF0YScsIGNodW5rKTtcbiAgfSBlbHNlIHtcbiAgICAvLyB1cGRhdGUgdGhlIGJ1ZmZlciBpbmZvLlxuICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICBpZiAoYWRkVG9Gcm9udCkgc3RhdGUuYnVmZmVyLnVuc2hpZnQoY2h1bmspO2Vsc2Ugc3RhdGUuYnVmZmVyLnB1c2goY2h1bmspO1xuICAgIGlmIChzdGF0ZS5uZWVkUmVhZGFibGUpIGVtaXRSZWFkYWJsZShzdHJlYW0pO1xuICB9XG4gIG1heWJlUmVhZE1vcmUoc3RyZWFtLCBzdGF0ZSk7XG59XG5mdW5jdGlvbiBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKSB7XG4gIHZhciBlcjtcbiAgaWYgKCFfaXNVaW50OEFycmF5KGNodW5rKSAmJiB0eXBlb2YgY2h1bmsgIT09ICdzdHJpbmcnICYmIGNodW5rICE9PSB1bmRlZmluZWQgJiYgIXN0YXRlLm9iamVjdE1vZGUpIHtcbiAgICBlciA9IG5ldyBFUlJfSU5WQUxJRF9BUkdfVFlQRSgnY2h1bmsnLCBbJ3N0cmluZycsICdCdWZmZXInLCAnVWludDhBcnJheSddLCBjaHVuayk7XG4gIH1cbiAgcmV0dXJuIGVyO1xufVxuUmVhZGFibGUucHJvdG90eXBlLmlzUGF1c2VkID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nID09PSBmYWxzZTtcbn07XG5cbi8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuUmVhZGFibGUucHJvdG90eXBlLnNldEVuY29kaW5nID0gZnVuY3Rpb24gKGVuYykge1xuICBpZiAoIVN0cmluZ0RlY29kZXIpIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2Rlci8nKS5TdHJpbmdEZWNvZGVyO1xuICB2YXIgZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKGVuYyk7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVjb2RlciA9IGRlY29kZXI7XG4gIC8vIElmIHNldEVuY29kaW5nKG51bGwpLCBkZWNvZGVyLmVuY29kaW5nIGVxdWFscyB1dGY4XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuZW5jb2RpbmcgPSB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlY29kZXIuZW5jb2Rpbmc7XG5cbiAgLy8gSXRlcmF0ZSBvdmVyIGN1cnJlbnQgYnVmZmVyIHRvIGNvbnZlcnQgYWxyZWFkeSBzdG9yZWQgQnVmZmVyczpcbiAgdmFyIHAgPSB0aGlzLl9yZWFkYWJsZVN0YXRlLmJ1ZmZlci5oZWFkO1xuICB2YXIgY29udGVudCA9ICcnO1xuICB3aGlsZSAocCAhPT0gbnVsbCkge1xuICAgIGNvbnRlbnQgKz0gZGVjb2Rlci53cml0ZShwLmRhdGEpO1xuICAgIHAgPSBwLm5leHQ7XG4gIH1cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5idWZmZXIuY2xlYXIoKTtcbiAgaWYgKGNvbnRlbnQgIT09ICcnKSB0aGlzLl9yZWFkYWJsZVN0YXRlLmJ1ZmZlci5wdXNoKGNvbnRlbnQpO1xuICB0aGlzLl9yZWFkYWJsZVN0YXRlLmxlbmd0aCA9IGNvbnRlbnQubGVuZ3RoO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIERvbid0IHJhaXNlIHRoZSBod20gPiAxR0JcbnZhciBNQVhfSFdNID0gMHg0MDAwMDAwMDtcbmZ1bmN0aW9uIGNvbXB1dGVOZXdIaWdoV2F0ZXJNYXJrKG4pIHtcbiAgaWYgKG4gPj0gTUFYX0hXTSkge1xuICAgIC8vIFRPRE8ocm9uYWcpOiBUaHJvdyBFUlJfVkFMVUVfT1VUX09GX1JBTkdFLlxuICAgIG4gPSBNQVhfSFdNO1xuICB9IGVsc2Uge1xuICAgIC8vIEdldCB0aGUgbmV4dCBoaWdoZXN0IHBvd2VyIG9mIDIgdG8gcHJldmVudCBpbmNyZWFzaW5nIGh3bSBleGNlc3NpdmVseSBpblxuICAgIC8vIHRpbnkgYW1vdW50c1xuICAgIG4tLTtcbiAgICBuIHw9IG4gPj4+IDE7XG4gICAgbiB8PSBuID4+PiAyO1xuICAgIG4gfD0gbiA+Pj4gNDtcbiAgICBuIHw9IG4gPj4+IDg7XG4gICAgbiB8PSBuID4+PiAxNjtcbiAgICBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgZGVzaWduZWQgdG8gYmUgaW5saW5hYmxlLCBzbyBwbGVhc2UgdGFrZSBjYXJlIHdoZW4gbWFraW5nXG4vLyBjaGFuZ2VzIHRvIHRoZSBmdW5jdGlvbiBib2R5LlxuZnVuY3Rpb24gaG93TXVjaFRvUmVhZChuLCBzdGF0ZSkge1xuICBpZiAobiA8PSAwIHx8IHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5lbmRlZCkgcmV0dXJuIDA7XG4gIGlmIChzdGF0ZS5vYmplY3RNb2RlKSByZXR1cm4gMTtcbiAgaWYgKG4gIT09IG4pIHtcbiAgICAvLyBPbmx5IGZsb3cgb25lIGJ1ZmZlciBhdCBhIHRpbWVcbiAgICBpZiAoc3RhdGUuZmxvd2luZyAmJiBzdGF0ZS5sZW5ndGgpIHJldHVybiBzdGF0ZS5idWZmZXIuaGVhZC5kYXRhLmxlbmd0aDtlbHNlIHJldHVybiBzdGF0ZS5sZW5ndGg7XG4gIH1cbiAgLy8gSWYgd2UncmUgYXNraW5nIGZvciBtb3JlIHRoYW4gdGhlIGN1cnJlbnQgaHdtLCB0aGVuIHJhaXNlIHRoZSBod20uXG4gIGlmIChuID4gc3RhdGUuaGlnaFdhdGVyTWFyaykgc3RhdGUuaGlnaFdhdGVyTWFyayA9IGNvbXB1dGVOZXdIaWdoV2F0ZXJNYXJrKG4pO1xuICBpZiAobiA8PSBzdGF0ZS5sZW5ndGgpIHJldHVybiBuO1xuICAvLyBEb24ndCBoYXZlIGVub3VnaFxuICBpZiAoIXN0YXRlLmVuZGVkKSB7XG4gICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gc3RhdGUubGVuZ3RoO1xufVxuXG4vLyB5b3UgY2FuIG92ZXJyaWRlIGVpdGhlciB0aGlzIG1ldGhvZCwgb3IgdGhlIGFzeW5jIF9yZWFkKG4pIGJlbG93LlxuUmVhZGFibGUucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbiAobikge1xuICBkZWJ1ZygncmVhZCcsIG4pO1xuICBuID0gcGFyc2VJbnQobiwgMTApO1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgbk9yaWcgPSBuO1xuICBpZiAobiAhPT0gMCkgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gZmFsc2U7XG5cbiAgLy8gaWYgd2UncmUgZG9pbmcgcmVhZCgwKSB0byB0cmlnZ2VyIGEgcmVhZGFibGUgZXZlbnQsIGJ1dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYSBidW5jaCBvZiBkYXRhIGluIHRoZSBidWZmZXIsIHRoZW4ganVzdCB0cmlnZ2VyXG4gIC8vIHRoZSAncmVhZGFibGUnIGV2ZW50IGFuZCBtb3ZlIG9uLlxuICBpZiAobiA9PT0gMCAmJiBzdGF0ZS5uZWVkUmVhZGFibGUgJiYgKChzdGF0ZS5oaWdoV2F0ZXJNYXJrICE9PSAwID8gc3RhdGUubGVuZ3RoID49IHN0YXRlLmhpZ2hXYXRlck1hcmsgOiBzdGF0ZS5sZW5ndGggPiAwKSB8fCBzdGF0ZS5lbmRlZCkpIHtcbiAgICBkZWJ1ZygncmVhZDogZW1pdFJlYWRhYmxlJywgc3RhdGUubGVuZ3RoLCBzdGF0ZS5lbmRlZCk7XG4gICAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5lbmRlZCkgZW5kUmVhZGFibGUodGhpcyk7ZWxzZSBlbWl0UmVhZGFibGUodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbiA9IGhvd011Y2hUb1JlYWQobiwgc3RhdGUpO1xuXG4gIC8vIGlmIHdlJ3ZlIGVuZGVkLCBhbmQgd2UncmUgbm93IGNsZWFyLCB0aGVuIGZpbmlzaCBpdCB1cC5cbiAgaWYgKG4gPT09IDAgJiYgc3RhdGUuZW5kZWQpIHtcbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKSBlbmRSZWFkYWJsZSh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFsbCB0aGUgYWN0dWFsIGNodW5rIGdlbmVyYXRpb24gbG9naWMgbmVlZHMgdG8gYmVcbiAgLy8gKmJlbG93KiB0aGUgY2FsbCB0byBfcmVhZC4gIFRoZSByZWFzb24gaXMgdGhhdCBpbiBjZXJ0YWluXG4gIC8vIHN5bnRoZXRpYyBzdHJlYW0gY2FzZXMsIHN1Y2ggYXMgcGFzc3Rocm91Z2ggc3RyZWFtcywgX3JlYWRcbiAgLy8gbWF5IGJlIGEgY29tcGxldGVseSBzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hpY2ggbWF5IGNoYW5nZVxuICAvLyB0aGUgc3RhdGUgb2YgdGhlIHJlYWQgYnVmZmVyLCBwcm92aWRpbmcgZW5vdWdoIGRhdGEgd2hlblxuICAvLyBiZWZvcmUgdGhlcmUgd2FzICpub3QqIGVub3VnaC5cbiAgLy9cbiAgLy8gU28sIHRoZSBzdGVwcyBhcmU6XG4gIC8vIDEuIEZpZ3VyZSBvdXQgd2hhdCB0aGUgc3RhdGUgb2YgdGhpbmdzIHdpbGwgYmUgYWZ0ZXIgd2UgZG9cbiAgLy8gYSByZWFkIGZyb20gdGhlIGJ1ZmZlci5cbiAgLy9cbiAgLy8gMi4gSWYgdGhhdCByZXN1bHRpbmcgc3RhdGUgd2lsbCB0cmlnZ2VyIGEgX3JlYWQsIHRoZW4gY2FsbCBfcmVhZC5cbiAgLy8gTm90ZSB0aGF0IHRoaXMgbWF5IGJlIGFzeW5jaHJvbm91cywgb3Igc3luY2hyb25vdXMuICBZZXMsIGl0IGlzXG4gIC8vIGRlZXBseSB1Z2x5IHRvIHdyaXRlIEFQSXMgdGhpcyB3YXksIGJ1dCB0aGF0IHN0aWxsIGRvZXNuJ3QgbWVhblxuICAvLyB0aGF0IHRoZSBSZWFkYWJsZSBjbGFzcyBzaG91bGQgYmVoYXZlIGltcHJvcGVybHksIGFzIHN0cmVhbXMgYXJlXG4gIC8vIGRlc2lnbmVkIHRvIGJlIHN5bmMvYXN5bmMgYWdub3N0aWMuXG4gIC8vIFRha2Ugbm90ZSBpZiB0aGUgX3JlYWQgY2FsbCBpcyBzeW5jIG9yIGFzeW5jIChpZSwgaWYgdGhlIHJlYWQgY2FsbFxuICAvLyBoYXMgcmV0dXJuZWQgeWV0KSwgc28gdGhhdCB3ZSBrbm93IHdoZXRoZXIgb3Igbm90IGl0J3Mgc2FmZSB0byBlbWl0XG4gIC8vICdyZWFkYWJsZScgZXRjLlxuICAvL1xuICAvLyAzLiBBY3R1YWxseSBwdWxsIHRoZSByZXF1ZXN0ZWQgY2h1bmtzIG91dCBvZiB0aGUgYnVmZmVyIGFuZCByZXR1cm4uXG5cbiAgLy8gaWYgd2UgbmVlZCBhIHJlYWRhYmxlIGV2ZW50LCB0aGVuIHdlIG5lZWQgdG8gZG8gc29tZSByZWFkaW5nLlxuICB2YXIgZG9SZWFkID0gc3RhdGUubmVlZFJlYWRhYmxlO1xuICBkZWJ1ZygnbmVlZCByZWFkYWJsZScsIGRvUmVhZCk7XG5cbiAgLy8gaWYgd2UgY3VycmVudGx5IGhhdmUgbGVzcyB0aGFuIHRoZSBoaWdoV2F0ZXJNYXJrLCB0aGVuIGFsc28gcmVhZCBzb21lXG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgfHwgc3RhdGUubGVuZ3RoIC0gbiA8IHN0YXRlLmhpZ2hXYXRlck1hcmspIHtcbiAgICBkb1JlYWQgPSB0cnVlO1xuICAgIGRlYnVnKCdsZW5ndGggbGVzcyB0aGFuIHdhdGVybWFyaycsIGRvUmVhZCk7XG4gIH1cblxuICAvLyBob3dldmVyLCBpZiB3ZSd2ZSBlbmRlZCwgdGhlbiB0aGVyZSdzIG5vIHBvaW50LCBhbmQgaWYgd2UncmUgYWxyZWFkeVxuICAvLyByZWFkaW5nLCB0aGVuIGl0J3MgdW5uZWNlc3NhcnkuXG4gIGlmIChzdGF0ZS5lbmRlZCB8fCBzdGF0ZS5yZWFkaW5nKSB7XG4gICAgZG9SZWFkID0gZmFsc2U7XG4gICAgZGVidWcoJ3JlYWRpbmcgb3IgZW5kZWQnLCBkb1JlYWQpO1xuICB9IGVsc2UgaWYgKGRvUmVhZCkge1xuICAgIGRlYnVnKCdkbyByZWFkJyk7XG4gICAgc3RhdGUucmVhZGluZyA9IHRydWU7XG4gICAgc3RhdGUuc3luYyA9IHRydWU7XG4gICAgLy8gaWYgdGhlIGxlbmd0aCBpcyBjdXJyZW50bHkgemVybywgdGhlbiB3ZSAqbmVlZCogYSByZWFkYWJsZSBldmVudC5cbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKSBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgIC8vIGNhbGwgaW50ZXJuYWwgcmVhZCBtZXRob2RcbiAgICB0aGlzLl9yZWFkKHN0YXRlLmhpZ2hXYXRlck1hcmspO1xuICAgIHN0YXRlLnN5bmMgPSBmYWxzZTtcbiAgICAvLyBJZiBfcmVhZCBwdXNoZWQgZGF0YSBzeW5jaHJvbm91c2x5LCB0aGVuIGByZWFkaW5nYCB3aWxsIGJlIGZhbHNlLFxuICAgIC8vIGFuZCB3ZSBuZWVkIHRvIHJlLWV2YWx1YXRlIGhvdyBtdWNoIGRhdGEgd2UgY2FuIHJldHVybiB0byB0aGUgdXNlci5cbiAgICBpZiAoIXN0YXRlLnJlYWRpbmcpIG4gPSBob3dNdWNoVG9SZWFkKG5PcmlnLCBzdGF0ZSk7XG4gIH1cbiAgdmFyIHJldDtcbiAgaWYgKG4gPiAwKSByZXQgPSBmcm9tTGlzdChuLCBzdGF0ZSk7ZWxzZSByZXQgPSBudWxsO1xuICBpZiAocmV0ID09PSBudWxsKSB7XG4gICAgc3RhdGUubmVlZFJlYWRhYmxlID0gc3RhdGUubGVuZ3RoIDw9IHN0YXRlLmhpZ2hXYXRlck1hcms7XG4gICAgbiA9IDA7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUubGVuZ3RoIC09IG47XG4gICAgc3RhdGUuYXdhaXREcmFpbiA9IDA7XG4gIH1cbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIElmIHdlIGhhdmUgbm90aGluZyBpbiB0aGUgYnVmZmVyLCB0aGVuIHdlIHdhbnQgdG8ga25vd1xuICAgIC8vIGFzIHNvb24gYXMgd2UgKmRvKiBnZXQgc29tZXRoaW5nIGludG8gdGhlIGJ1ZmZlci5cbiAgICBpZiAoIXN0YXRlLmVuZGVkKSBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuXG4gICAgLy8gSWYgd2UgdHJpZWQgdG8gcmVhZCgpIHBhc3QgdGhlIEVPRiwgdGhlbiBlbWl0IGVuZCBvbiB0aGUgbmV4dCB0aWNrLlxuICAgIGlmIChuT3JpZyAhPT0gbiAmJiBzdGF0ZS5lbmRlZCkgZW5kUmVhZGFibGUodGhpcyk7XG4gIH1cbiAgaWYgKHJldCAhPT0gbnVsbCkgdGhpcy5lbWl0KCdkYXRhJywgcmV0KTtcbiAgcmV0dXJuIHJldDtcbn07XG5mdW5jdGlvbiBvbkVvZkNodW5rKHN0cmVhbSwgc3RhdGUpIHtcbiAgZGVidWcoJ29uRW9mQ2h1bmsnKTtcbiAgaWYgKHN0YXRlLmVuZGVkKSByZXR1cm47XG4gIGlmIChzdGF0ZS5kZWNvZGVyKSB7XG4gICAgdmFyIGNodW5rID0gc3RhdGUuZGVjb2Rlci5lbmQoKTtcbiAgICBpZiAoY2h1bmsgJiYgY2h1bmsubGVuZ3RoKSB7XG4gICAgICBzdGF0ZS5idWZmZXIucHVzaChjaHVuayk7XG4gICAgICBzdGF0ZS5sZW5ndGggKz0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHN0YXRlLmVuZGVkID0gdHJ1ZTtcbiAgaWYgKHN0YXRlLnN5bmMpIHtcbiAgICAvLyBpZiB3ZSBhcmUgc3luYywgd2FpdCB1bnRpbCBuZXh0IHRpY2sgdG8gZW1pdCB0aGUgZGF0YS5cbiAgICAvLyBPdGhlcndpc2Ugd2UgcmlzayBlbWl0dGluZyBkYXRhIGluIHRoZSBmbG93KClcbiAgICAvLyB0aGUgcmVhZGFibGUgY29kZSB0cmlnZ2VycyBkdXJpbmcgYSByZWFkKCkgY2FsbFxuICAgIGVtaXRSZWFkYWJsZShzdHJlYW0pO1xuICB9IGVsc2Uge1xuICAgIC8vIGVtaXQgJ3JlYWRhYmxlJyBub3cgdG8gbWFrZSBzdXJlIGl0IGdldHMgcGlja2VkIHVwLlxuICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IGZhbHNlO1xuICAgIGlmICghc3RhdGUuZW1pdHRlZFJlYWRhYmxlKSB7XG4gICAgICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSB0cnVlO1xuICAgICAgZW1pdFJlYWRhYmxlXyhzdHJlYW0pO1xuICAgIH1cbiAgfVxufVxuXG4vLyBEb24ndCBlbWl0IHJlYWRhYmxlIHJpZ2h0IGF3YXkgaW4gc3luYyBtb2RlLCBiZWNhdXNlIHRoaXMgY2FuIHRyaWdnZXJcbi8vIGFub3RoZXIgcmVhZCgpIGNhbGwgPT4gc3RhY2sgb3ZlcmZsb3cuICBUaGlzIHdheSwgaXQgbWlnaHQgdHJpZ2dlclxuLy8gYSBuZXh0VGljayByZWN1cnNpb24gd2FybmluZywgYnV0IHRoYXQncyBub3Qgc28gYmFkLlxuZnVuY3Rpb24gZW1pdFJlYWRhYmxlKHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIGRlYnVnKCdlbWl0UmVhZGFibGUnLCBzdGF0ZS5uZWVkUmVhZGFibGUsIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSk7XG4gIHN0YXRlLm5lZWRSZWFkYWJsZSA9IGZhbHNlO1xuICBpZiAoIXN0YXRlLmVtaXR0ZWRSZWFkYWJsZSkge1xuICAgIGRlYnVnKCdlbWl0UmVhZGFibGUnLCBzdGF0ZS5mbG93aW5nKTtcbiAgICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSB0cnVlO1xuICAgIHByb2Nlc3MubmV4dFRpY2soZW1pdFJlYWRhYmxlXywgc3RyZWFtKTtcbiAgfVxufVxuZnVuY3Rpb24gZW1pdFJlYWRhYmxlXyhzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBkZWJ1ZygnZW1pdFJlYWRhYmxlXycsIHN0YXRlLmRlc3Ryb3llZCwgc3RhdGUubGVuZ3RoLCBzdGF0ZS5lbmRlZCk7XG4gIGlmICghc3RhdGUuZGVzdHJveWVkICYmIChzdGF0ZS5sZW5ndGggfHwgc3RhdGUuZW5kZWQpKSB7XG4gICAgc3RyZWFtLmVtaXQoJ3JlYWRhYmxlJyk7XG4gICAgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gZmFsc2U7XG4gIH1cblxuICAvLyBUaGUgc3RyZWFtIG5lZWRzIGFub3RoZXIgcmVhZGFibGUgZXZlbnQgaWZcbiAgLy8gMS4gSXQgaXMgbm90IGZsb3dpbmcsIGFzIHRoZSBmbG93IG1lY2hhbmlzbSB3aWxsIHRha2VcbiAgLy8gICAgY2FyZSBvZiBpdC5cbiAgLy8gMi4gSXQgaXMgbm90IGVuZGVkLlxuICAvLyAzLiBJdCBpcyBiZWxvdyB0aGUgaGlnaFdhdGVyTWFyaywgc28gd2UgY2FuIHNjaGVkdWxlXG4gIC8vICAgIGFub3RoZXIgcmVhZGFibGUgbGF0ZXIuXG4gIHN0YXRlLm5lZWRSZWFkYWJsZSA9ICFzdGF0ZS5mbG93aW5nICYmICFzdGF0ZS5lbmRlZCAmJiBzdGF0ZS5sZW5ndGggPD0gc3RhdGUuaGlnaFdhdGVyTWFyaztcbiAgZmxvdyhzdHJlYW0pO1xufVxuXG4vLyBhdCB0aGlzIHBvaW50LCB0aGUgdXNlciBoYXMgcHJlc3VtYWJseSBzZWVuIHRoZSAncmVhZGFibGUnIGV2ZW50LFxuLy8gYW5kIGNhbGxlZCByZWFkKCkgdG8gY29uc3VtZSBzb21lIGRhdGEuICB0aGF0IG1heSBoYXZlIHRyaWdnZXJlZFxuLy8gaW4gdHVybiBhbm90aGVyIF9yZWFkKG4pIGNhbGwsIGluIHdoaWNoIGNhc2UgcmVhZGluZyA9IHRydWUgaWZcbi8vIGl0J3MgaW4gcHJvZ3Jlc3MuXG4vLyBIb3dldmVyLCBpZiB3ZSdyZSBub3QgZW5kZWQsIG9yIHJlYWRpbmcsIGFuZCB0aGUgbGVuZ3RoIDwgaHdtLFxuLy8gdGhlbiBnbyBhaGVhZCBhbmQgdHJ5IHRvIHJlYWQgc29tZSBtb3JlIHByZWVtcHRpdmVseS5cbmZ1bmN0aW9uIG1heWJlUmVhZE1vcmUoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoIXN0YXRlLnJlYWRpbmdNb3JlKSB7XG4gICAgc3RhdGUucmVhZGluZ01vcmUgPSB0cnVlO1xuICAgIHByb2Nlc3MubmV4dFRpY2sobWF5YmVSZWFkTW9yZV8sIHN0cmVhbSwgc3RhdGUpO1xuICB9XG59XG5mdW5jdGlvbiBtYXliZVJlYWRNb3JlXyhzdHJlYW0sIHN0YXRlKSB7XG4gIC8vIEF0dGVtcHQgdG8gcmVhZCBtb3JlIGRhdGEgaWYgd2Ugc2hvdWxkLlxuICAvL1xuICAvLyBUaGUgY29uZGl0aW9ucyBmb3IgcmVhZGluZyBtb3JlIGRhdGEgYXJlIChvbmUgb2YpOlxuICAvLyAtIE5vdCBlbm91Z2ggZGF0YSBidWZmZXJlZCAoc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyaykuIFRoZSBsb29wXG4gIC8vICAgaXMgcmVzcG9uc2libGUgZm9yIGZpbGxpbmcgdGhlIGJ1ZmZlciB3aXRoIGVub3VnaCBkYXRhIGlmIHN1Y2ggZGF0YVxuICAvLyAgIGlzIGF2YWlsYWJsZS4gSWYgaGlnaFdhdGVyTWFyayBpcyAwIGFuZCB3ZSBhcmUgbm90IGluIHRoZSBmbG93aW5nIG1vZGVcbiAgLy8gICB3ZSBzaG91bGQgX25vdF8gYXR0ZW1wdCB0byBidWZmZXIgYW55IGV4dHJhIGRhdGEuIFdlJ2xsIGdldCBtb3JlIGRhdGFcbiAgLy8gICB3aGVuIHRoZSBzdHJlYW0gY29uc3VtZXIgY2FsbHMgcmVhZCgpIGluc3RlYWQuXG4gIC8vIC0gTm8gZGF0YSBpbiB0aGUgYnVmZmVyLCBhbmQgdGhlIHN0cmVhbSBpcyBpbiBmbG93aW5nIG1vZGUuIEluIHRoaXMgbW9kZVxuICAvLyAgIHRoZSBsb29wIGJlbG93IGlzIHJlc3BvbnNpYmxlIGZvciBlbnN1cmluZyByZWFkKCkgaXMgY2FsbGVkLiBGYWlsaW5nIHRvXG4gIC8vICAgY2FsbCByZWFkIGhlcmUgd291bGQgYWJvcnQgdGhlIGZsb3cgYW5kIHRoZXJlJ3Mgbm8gb3RoZXIgbWVjaGFuaXNtIGZvclxuICAvLyAgIGNvbnRpbnVpbmcgdGhlIGZsb3cgaWYgdGhlIHN0cmVhbSBjb25zdW1lciBoYXMganVzdCBzdWJzY3JpYmVkIHRvIHRoZVxuICAvLyAgICdkYXRhJyBldmVudC5cbiAgLy9cbiAgLy8gSW4gYWRkaXRpb24gdG8gdGhlIGFib3ZlIGNvbmRpdGlvbnMgdG8ga2VlcCByZWFkaW5nIGRhdGEsIHRoZSBmb2xsb3dpbmdcbiAgLy8gY29uZGl0aW9ucyBwcmV2ZW50IHRoZSBkYXRhIGZyb20gYmVpbmcgcmVhZDpcbiAgLy8gLSBUaGUgc3RyZWFtIGhhcyBlbmRlZCAoc3RhdGUuZW5kZWQpLlxuICAvLyAtIFRoZXJlIGlzIGFscmVhZHkgYSBwZW5kaW5nICdyZWFkJyBvcGVyYXRpb24gKHN0YXRlLnJlYWRpbmcpLiBUaGlzIGlzIGFcbiAgLy8gICBjYXNlIHdoZXJlIHRoZSB0aGUgc3RyZWFtIGhhcyBjYWxsZWQgdGhlIGltcGxlbWVudGF0aW9uIGRlZmluZWQgX3JlYWQoKVxuICAvLyAgIG1ldGhvZCwgYnV0IHRoZXkgYXJlIHByb2Nlc3NpbmcgdGhlIGNhbGwgYXN5bmNocm9ub3VzbHkgYW5kIGhhdmUgX25vdF9cbiAgLy8gICBjYWxsZWQgcHVzaCgpIHdpdGggbmV3IGRhdGEuIEluIHRoaXMgY2FzZSB3ZSBza2lwIHBlcmZvcm1pbmcgbW9yZVxuICAvLyAgIHJlYWQoKXMuIFRoZSBleGVjdXRpb24gZW5kcyBpbiB0aGlzIG1ldGhvZCBhZ2FpbiBhZnRlciB0aGUgX3JlYWQoKSBlbmRzXG4gIC8vICAgdXAgY2FsbGluZyBwdXNoKCkgd2l0aCBtb3JlIGRhdGEuXG4gIHdoaWxlICghc3RhdGUucmVhZGluZyAmJiAhc3RhdGUuZW5kZWQgJiYgKHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcmsgfHwgc3RhdGUuZmxvd2luZyAmJiBzdGF0ZS5sZW5ndGggPT09IDApKSB7XG4gICAgdmFyIGxlbiA9IHN0YXRlLmxlbmd0aDtcbiAgICBkZWJ1ZygnbWF5YmVSZWFkTW9yZSByZWFkIDAnKTtcbiAgICBzdHJlYW0ucmVhZCgwKTtcbiAgICBpZiAobGVuID09PSBzdGF0ZS5sZW5ndGgpXG4gICAgICAvLyBkaWRuJ3QgZ2V0IGFueSBkYXRhLCBzdG9wIHNwaW5uaW5nLlxuICAgICAgYnJlYWs7XG4gIH1cbiAgc3RhdGUucmVhZGluZ01vcmUgPSBmYWxzZTtcbn1cblxuLy8gYWJzdHJhY3QgbWV0aG9kLiAgdG8gYmUgb3ZlcnJpZGRlbiBpbiBzcGVjaWZpYyBpbXBsZW1lbnRhdGlvbiBjbGFzc2VzLlxuLy8gY2FsbCBjYihlciwgZGF0YSkgd2hlcmUgZGF0YSBpcyA8PSBuIGluIGxlbmd0aC5cbi8vIGZvciB2aXJ0dWFsIChub24tc3RyaW5nLCBub24tYnVmZmVyKSBzdHJlYW1zLCBcImxlbmd0aFwiIGlzIHNvbWV3aGF0XG4vLyBhcmJpdHJhcnksIGFuZCBwZXJoYXBzIG5vdCB2ZXJ5IG1lYW5pbmdmdWwuXG5SZWFkYWJsZS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbiAobikge1xuICBlcnJvck9yRGVzdHJveSh0aGlzLCBuZXcgRVJSX01FVEhPRF9OT1RfSU1QTEVNRU5URUQoJ19yZWFkKCknKSk7XG59O1xuUmVhZGFibGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoZGVzdCwgcGlwZU9wdHMpIHtcbiAgdmFyIHNyYyA9IHRoaXM7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHN3aXRjaCAoc3RhdGUucGlwZXNDb3VudCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHN0YXRlLnBpcGVzID0gZGVzdDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTpcbiAgICAgIHN0YXRlLnBpcGVzID0gW3N0YXRlLnBpcGVzLCBkZXN0XTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzdGF0ZS5waXBlcy5wdXNoKGRlc3QpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgc3RhdGUucGlwZXNDb3VudCArPSAxO1xuICBkZWJ1ZygncGlwZSBjb3VudD0lZCBvcHRzPSVqJywgc3RhdGUucGlwZXNDb3VudCwgcGlwZU9wdHMpO1xuICB2YXIgZG9FbmQgPSAoIXBpcGVPcHRzIHx8IHBpcGVPcHRzLmVuZCAhPT0gZmFsc2UpICYmIGRlc3QgIT09IHByb2Nlc3Muc3Rkb3V0ICYmIGRlc3QgIT09IHByb2Nlc3Muc3RkZXJyO1xuICB2YXIgZW5kRm4gPSBkb0VuZCA/IG9uZW5kIDogdW5waXBlO1xuICBpZiAoc3RhdGUuZW5kRW1pdHRlZCkgcHJvY2Vzcy5uZXh0VGljayhlbmRGbik7ZWxzZSBzcmMub25jZSgnZW5kJywgZW5kRm4pO1xuICBkZXN0Lm9uKCd1bnBpcGUnLCBvbnVucGlwZSk7XG4gIGZ1bmN0aW9uIG9udW5waXBlKHJlYWRhYmxlLCB1bnBpcGVJbmZvKSB7XG4gICAgZGVidWcoJ29udW5waXBlJyk7XG4gICAgaWYgKHJlYWRhYmxlID09PSBzcmMpIHtcbiAgICAgIGlmICh1bnBpcGVJbmZvICYmIHVucGlwZUluZm8uaGFzVW5waXBlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgdW5waXBlSW5mby5oYXNVbnBpcGVkID0gdHJ1ZTtcbiAgICAgICAgY2xlYW51cCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBvbmVuZCgpIHtcbiAgICBkZWJ1Zygnb25lbmQnKTtcbiAgICBkZXN0LmVuZCgpO1xuICB9XG5cbiAgLy8gd2hlbiB0aGUgZGVzdCBkcmFpbnMsIGl0IHJlZHVjZXMgdGhlIGF3YWl0RHJhaW4gY291bnRlclxuICAvLyBvbiB0aGUgc291cmNlLiAgVGhpcyB3b3VsZCBiZSBtb3JlIGVsZWdhbnQgd2l0aCBhIC5vbmNlKClcbiAgLy8gaGFuZGxlciBpbiBmbG93KCksIGJ1dCBhZGRpbmcgYW5kIHJlbW92aW5nIHJlcGVhdGVkbHkgaXNcbiAgLy8gdG9vIHNsb3cuXG4gIHZhciBvbmRyYWluID0gcGlwZU9uRHJhaW4oc3JjKTtcbiAgZGVzdC5vbignZHJhaW4nLCBvbmRyYWluKTtcbiAgdmFyIGNsZWFuZWRVcCA9IGZhbHNlO1xuICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIGRlYnVnKCdjbGVhbnVwJyk7XG4gICAgLy8gY2xlYW51cCBldmVudCBoYW5kbGVycyBvbmNlIHRoZSBwaXBlIGlzIGJyb2tlblxuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgb25maW5pc2gpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2RyYWluJywgb25kcmFpbik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCd1bnBpcGUnLCBvbnVucGlwZSk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBvbmVuZCk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCB1bnBpcGUpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZGF0YScsIG9uZGF0YSk7XG4gICAgY2xlYW5lZFVwID0gdHJ1ZTtcblxuICAgIC8vIGlmIHRoZSByZWFkZXIgaXMgd2FpdGluZyBmb3IgYSBkcmFpbiBldmVudCBmcm9tIHRoaXNcbiAgICAvLyBzcGVjaWZpYyB3cml0ZXIsIHRoZW4gaXQgd291bGQgY2F1c2UgaXQgdG8gbmV2ZXIgc3RhcnRcbiAgICAvLyBmbG93aW5nIGFnYWluLlxuICAgIC8vIFNvLCBpZiB0aGlzIGlzIGF3YWl0aW5nIGEgZHJhaW4sIHRoZW4gd2UganVzdCBjYWxsIGl0IG5vdy5cbiAgICAvLyBJZiB3ZSBkb24ndCBrbm93LCB0aGVuIGFzc3VtZSB0aGF0IHdlIGFyZSB3YWl0aW5nIGZvciBvbmUuXG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4gJiYgKCFkZXN0Ll93cml0YWJsZVN0YXRlIHx8IGRlc3QuX3dyaXRhYmxlU3RhdGUubmVlZERyYWluKSkgb25kcmFpbigpO1xuICB9XG4gIHNyYy5vbignZGF0YScsIG9uZGF0YSk7XG4gIGZ1bmN0aW9uIG9uZGF0YShjaHVuaykge1xuICAgIGRlYnVnKCdvbmRhdGEnKTtcbiAgICB2YXIgcmV0ID0gZGVzdC53cml0ZShjaHVuayk7XG4gICAgZGVidWcoJ2Rlc3Qud3JpdGUnLCByZXQpO1xuICAgIGlmIChyZXQgPT09IGZhbHNlKSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciB1bnBpcGVkIGR1cmluZyBgZGVzdC53cml0ZSgpYCwgaXQgaXMgcG9zc2libGVcbiAgICAgIC8vIHRvIGdldCBzdHVjayBpbiBhIHBlcm1hbmVudGx5IHBhdXNlZCBzdGF0ZSBpZiB0aGF0IHdyaXRlXG4gICAgICAvLyBhbHNvIHJldHVybmVkIGZhbHNlLlxuICAgICAgLy8gPT4gQ2hlY2sgd2hldGhlciBgZGVzdGAgaXMgc3RpbGwgYSBwaXBpbmcgZGVzdGluYXRpb24uXG4gICAgICBpZiAoKHN0YXRlLnBpcGVzQ291bnQgPT09IDEgJiYgc3RhdGUucGlwZXMgPT09IGRlc3QgfHwgc3RhdGUucGlwZXNDb3VudCA+IDEgJiYgaW5kZXhPZihzdGF0ZS5waXBlcywgZGVzdCkgIT09IC0xKSAmJiAhY2xlYW5lZFVwKSB7XG4gICAgICAgIGRlYnVnKCdmYWxzZSB3cml0ZSByZXNwb25zZSwgcGF1c2UnLCBzdGF0ZS5hd2FpdERyYWluKTtcbiAgICAgICAgc3RhdGUuYXdhaXREcmFpbisrO1xuICAgICAgfVxuICAgICAgc3JjLnBhdXNlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIGRlc3QgaGFzIGFuIGVycm9yLCB0aGVuIHN0b3AgcGlwaW5nIGludG8gaXQuXG4gIC8vIGhvd2V2ZXIsIGRvbid0IHN1cHByZXNzIHRoZSB0aHJvd2luZyBiZWhhdmlvciBmb3IgdGhpcy5cbiAgZnVuY3Rpb24gb25lcnJvcihlcikge1xuICAgIGRlYnVnKCdvbmVycm9yJywgZXIpO1xuICAgIHVucGlwZSgpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgaWYgKEVFbGlzdGVuZXJDb3VudChkZXN0LCAnZXJyb3InKSA9PT0gMCkgZXJyb3JPckRlc3Ryb3koZGVzdCwgZXIpO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIG91ciBlcnJvciBoYW5kbGVyIGlzIGF0dGFjaGVkIGJlZm9yZSB1c2VybGFuZCBvbmVzLlxuICBwcmVwZW5kTGlzdGVuZXIoZGVzdCwgJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgLy8gQm90aCBjbG9zZSBhbmQgZmluaXNoIHNob3VsZCB0cmlnZ2VyIHVucGlwZSwgYnV0IG9ubHkgb25jZS5cbiAgZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdjbG9zZScsIG9uY2xvc2UpO1xuICBmdW5jdGlvbiBvbmZpbmlzaCgpIHtcbiAgICBkZWJ1Zygnb25maW5pc2gnKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuICAgIHVucGlwZSgpO1xuICB9XG4gIGRlc3Qub25jZSgnZmluaXNoJywgb25maW5pc2gpO1xuICBmdW5jdGlvbiB1bnBpcGUoKSB7XG4gICAgZGVidWcoJ3VucGlwZScpO1xuICAgIHNyYy51bnBpcGUoZGVzdCk7XG4gIH1cblxuICAvLyB0ZWxsIHRoZSBkZXN0IHRoYXQgaXQncyBiZWluZyBwaXBlZCB0b1xuICBkZXN0LmVtaXQoJ3BpcGUnLCBzcmMpO1xuXG4gIC8vIHN0YXJ0IHRoZSBmbG93IGlmIGl0IGhhc24ndCBiZWVuIHN0YXJ0ZWQgYWxyZWFkeS5cbiAgaWYgKCFzdGF0ZS5mbG93aW5nKSB7XG4gICAgZGVidWcoJ3BpcGUgcmVzdW1lJyk7XG4gICAgc3JjLnJlc3VtZSgpO1xuICB9XG4gIHJldHVybiBkZXN0O1xufTtcbmZ1bmN0aW9uIHBpcGVPbkRyYWluKHNyYykge1xuICByZXR1cm4gZnVuY3Rpb24gcGlwZU9uRHJhaW5GdW5jdGlvblJlc3VsdCgpIHtcbiAgICB2YXIgc3RhdGUgPSBzcmMuX3JlYWRhYmxlU3RhdGU7XG4gICAgZGVidWcoJ3BpcGVPbkRyYWluJywgc3RhdGUuYXdhaXREcmFpbik7XG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4pIHN0YXRlLmF3YWl0RHJhaW4tLTtcbiAgICBpZiAoc3RhdGUuYXdhaXREcmFpbiA9PT0gMCAmJiBFRWxpc3RlbmVyQ291bnQoc3JjLCAnZGF0YScpKSB7XG4gICAgICBzdGF0ZS5mbG93aW5nID0gdHJ1ZTtcbiAgICAgIGZsb3coc3JjKTtcbiAgICB9XG4gIH07XG59XG5SZWFkYWJsZS5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gKGRlc3QpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgdmFyIHVucGlwZUluZm8gPSB7XG4gICAgaGFzVW5waXBlZDogZmFsc2VcbiAgfTtcblxuICAvLyBpZiB3ZSdyZSBub3QgcGlwaW5nIGFueXdoZXJlLCB0aGVuIGRvIG5vdGhpbmcuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAwKSByZXR1cm4gdGhpcztcblxuICAvLyBqdXN0IG9uZSBkZXN0aW5hdGlvbi4gIG1vc3QgY29tbW9uIGNhc2UuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKSB7XG4gICAgLy8gcGFzc2VkIGluIG9uZSwgYnV0IGl0J3Mgbm90IHRoZSByaWdodCBvbmUuXG4gICAgaWYgKGRlc3QgJiYgZGVzdCAhPT0gc3RhdGUucGlwZXMpIHJldHVybiB0aGlzO1xuICAgIGlmICghZGVzdCkgZGVzdCA9IHN0YXRlLnBpcGVzO1xuXG4gICAgLy8gZ290IGEgbWF0Y2guXG4gICAgc3RhdGUucGlwZXMgPSBudWxsO1xuICAgIHN0YXRlLnBpcGVzQ291bnQgPSAwO1xuICAgIHN0YXRlLmZsb3dpbmcgPSBmYWxzZTtcbiAgICBpZiAoZGVzdCkgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzLCB1bnBpcGVJbmZvKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNsb3cgY2FzZS4gbXVsdGlwbGUgcGlwZSBkZXN0aW5hdGlvbnMuXG5cbiAgaWYgKCFkZXN0KSB7XG4gICAgLy8gcmVtb3ZlIGFsbC5cbiAgICB2YXIgZGVzdHMgPSBzdGF0ZS5waXBlcztcbiAgICB2YXIgbGVuID0gc3RhdGUucGlwZXNDb3VudDtcbiAgICBzdGF0ZS5waXBlcyA9IG51bGw7XG4gICAgc3RhdGUucGlwZXNDb3VudCA9IDA7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIGRlc3RzW2ldLmVtaXQoJ3VucGlwZScsIHRoaXMsIHtcbiAgICAgIGhhc1VucGlwZWQ6IGZhbHNlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB0cnkgdG8gZmluZCB0aGUgcmlnaHQgb25lLlxuICB2YXIgaW5kZXggPSBpbmRleE9mKHN0YXRlLnBpcGVzLCBkZXN0KTtcbiAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIHRoaXM7XG4gIHN0YXRlLnBpcGVzLnNwbGljZShpbmRleCwgMSk7XG4gIHN0YXRlLnBpcGVzQ291bnQgLT0gMTtcbiAgaWYgKHN0YXRlLnBpcGVzQ291bnQgPT09IDEpIHN0YXRlLnBpcGVzID0gc3RhdGUucGlwZXNbMF07XG4gIGRlc3QuZW1pdCgndW5waXBlJywgdGhpcywgdW5waXBlSW5mbyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gc2V0IHVwIGRhdGEgZXZlbnRzIGlmIHRoZXkgYXJlIGFza2VkIGZvclxuLy8gRW5zdXJlIHJlYWRhYmxlIGxpc3RlbmVycyBldmVudHVhbGx5IGdldCBzb21ldGhpbmdcblJlYWRhYmxlLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldiwgZm4pIHtcbiAgdmFyIHJlcyA9IFN0cmVhbS5wcm90b3R5cGUub24uY2FsbCh0aGlzLCBldiwgZm4pO1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICBpZiAoZXYgPT09ICdkYXRhJykge1xuICAgIC8vIHVwZGF0ZSByZWFkYWJsZUxpc3RlbmluZyBzbyB0aGF0IHJlc3VtZSgpIG1heSBiZSBhIG5vLW9wXG4gICAgLy8gYSBmZXcgbGluZXMgZG93bi4gVGhpcyBpcyBuZWVkZWQgdG8gc3VwcG9ydCBvbmNlKCdyZWFkYWJsZScpLlxuICAgIHN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nID0gdGhpcy5saXN0ZW5lckNvdW50KCdyZWFkYWJsZScpID4gMDtcblxuICAgIC8vIFRyeSBzdGFydCBmbG93aW5nIG9uIG5leHQgdGljayBpZiBzdHJlYW0gaXNuJ3QgZXhwbGljaXRseSBwYXVzZWRcbiAgICBpZiAoc3RhdGUuZmxvd2luZyAhPT0gZmFsc2UpIHRoaXMucmVzdW1lKCk7XG4gIH0gZWxzZSBpZiAoZXYgPT09ICdyZWFkYWJsZScpIHtcbiAgICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQgJiYgIXN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nKSB7XG4gICAgICBzdGF0ZS5yZWFkYWJsZUxpc3RlbmluZyA9IHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG4gICAgICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgICAgIGRlYnVnKCdvbiByZWFkYWJsZScsIHN0YXRlLmxlbmd0aCwgc3RhdGUucmVhZGluZyk7XG4gICAgICBpZiAoc3RhdGUubGVuZ3RoKSB7XG4gICAgICAgIGVtaXRSZWFkYWJsZSh0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAoIXN0YXRlLnJlYWRpbmcpIHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhuUmVhZGluZ05leHRUaWNrLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG5SZWFkYWJsZS5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBSZWFkYWJsZS5wcm90b3R5cGUub247XG5SZWFkYWJsZS5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXYsIGZuKSB7XG4gIHZhciByZXMgPSBTdHJlYW0ucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyLmNhbGwodGhpcywgZXYsIGZuKTtcbiAgaWYgKGV2ID09PSAncmVhZGFibGUnKSB7XG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayBpZiB0aGVyZSBpcyBzb21lb25lIHN0aWxsIGxpc3RlbmluZyB0b1xuICAgIC8vIHJlYWRhYmxlIGFuZCByZXNldCB0aGUgc3RhdGUuIEhvd2V2ZXIgdGhpcyBuZWVkcyB0byBoYXBwZW5cbiAgICAvLyBhZnRlciByZWFkYWJsZSBoYXMgYmVlbiBlbWl0dGVkIGJ1dCBiZWZvcmUgSS9PIChuZXh0VGljaykgdG9cbiAgICAvLyBzdXBwb3J0IG9uY2UoJ3JlYWRhYmxlJywgZm4pIGN5Y2xlcy4gVGhpcyBtZWFucyB0aGF0IGNhbGxpbmdcbiAgICAvLyByZXN1bWUgd2l0aGluIHRoZSBzYW1lIHRpY2sgd2lsbCBoYXZlIG5vXG4gICAgLy8gZWZmZWN0LlxuICAgIHByb2Nlc3MubmV4dFRpY2sodXBkYXRlUmVhZGFibGVMaXN0ZW5pbmcsIHRoaXMpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuUmVhZGFibGUucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIChldikge1xuICB2YXIgcmVzID0gU3RyZWFtLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgaWYgKGV2ID09PSAncmVhZGFibGUnIHx8IGV2ID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIGlmIHRoZXJlIGlzIHNvbWVvbmUgc3RpbGwgbGlzdGVuaW5nIHRvXG4gICAgLy8gcmVhZGFibGUgYW5kIHJlc2V0IHRoZSBzdGF0ZS4gSG93ZXZlciB0aGlzIG5lZWRzIHRvIGhhcHBlblxuICAgIC8vIGFmdGVyIHJlYWRhYmxlIGhhcyBiZWVuIGVtaXR0ZWQgYnV0IGJlZm9yZSBJL08gKG5leHRUaWNrKSB0b1xuICAgIC8vIHN1cHBvcnQgb25jZSgncmVhZGFibGUnLCBmbikgY3ljbGVzLiBUaGlzIG1lYW5zIHRoYXQgY2FsbGluZ1xuICAgIC8vIHJlc3VtZSB3aXRoaW4gdGhlIHNhbWUgdGljayB3aWxsIGhhdmUgbm9cbiAgICAvLyBlZmZlY3QuXG4gICAgcHJvY2Vzcy5uZXh0VGljayh1cGRhdGVSZWFkYWJsZUxpc3RlbmluZywgdGhpcyk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG5mdW5jdGlvbiB1cGRhdGVSZWFkYWJsZUxpc3RlbmluZyhzZWxmKSB7XG4gIHZhciBzdGF0ZSA9IHNlbGYuX3JlYWRhYmxlU3RhdGU7XG4gIHN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nID0gc2VsZi5saXN0ZW5lckNvdW50KCdyZWFkYWJsZScpID4gMDtcbiAgaWYgKHN0YXRlLnJlc3VtZVNjaGVkdWxlZCAmJiAhc3RhdGUucGF1c2VkKSB7XG4gICAgLy8gZmxvd2luZyBuZWVkcyB0byBiZSBzZXQgdG8gdHJ1ZSBub3csIG90aGVyd2lzZVxuICAgIC8vIHRoZSB1cGNvbWluZyByZXN1bWUgd2lsbCBub3QgZmxvdy5cbiAgICBzdGF0ZS5mbG93aW5nID0gdHJ1ZTtcblxuICAgIC8vIGNydWRlIHdheSB0byBjaGVjayBpZiB3ZSBzaG91bGQgcmVzdW1lXG4gIH0gZWxzZSBpZiAoc2VsZi5saXN0ZW5lckNvdW50KCdkYXRhJykgPiAwKSB7XG4gICAgc2VsZi5yZXN1bWUoKTtcbiAgfVxufVxuZnVuY3Rpb24gblJlYWRpbmdOZXh0VGljayhzZWxmKSB7XG4gIGRlYnVnKCdyZWFkYWJsZSBuZXh0dGljayByZWFkIDAnKTtcbiAgc2VsZi5yZWFkKDApO1xufVxuXG4vLyBwYXVzZSgpIGFuZCByZXN1bWUoKSBhcmUgcmVtbmFudHMgb2YgdGhlIGxlZ2FjeSByZWFkYWJsZSBzdHJlYW0gQVBJXG4vLyBJZiB0aGUgdXNlciB1c2VzIHRoZW0sIHRoZW4gc3dpdGNoIGludG8gb2xkIG1vZGUuXG5SZWFkYWJsZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICBpZiAoIXN0YXRlLmZsb3dpbmcpIHtcbiAgICBkZWJ1ZygncmVzdW1lJyk7XG4gICAgLy8gd2UgZmxvdyBvbmx5IGlmIHRoZXJlIGlzIG5vIG9uZSBsaXN0ZW5pbmdcbiAgICAvLyBmb3IgcmVhZGFibGUsIGJ1dCB3ZSBzdGlsbCBoYXZlIHRvIGNhbGxcbiAgICAvLyByZXN1bWUoKVxuICAgIHN0YXRlLmZsb3dpbmcgPSAhc3RhdGUucmVhZGFibGVMaXN0ZW5pbmc7XG4gICAgcmVzdW1lKHRoaXMsIHN0YXRlKTtcbiAgfVxuICBzdGF0ZS5wYXVzZWQgPSBmYWxzZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZnVuY3Rpb24gcmVzdW1lKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5yZXN1bWVTY2hlZHVsZWQpIHtcbiAgICBzdGF0ZS5yZXN1bWVTY2hlZHVsZWQgPSB0cnVlO1xuICAgIHByb2Nlc3MubmV4dFRpY2socmVzdW1lXywgc3RyZWFtLCBzdGF0ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHJlc3VtZV8oc3RyZWFtLCBzdGF0ZSkge1xuICBkZWJ1ZygncmVzdW1lJywgc3RhdGUucmVhZGluZyk7XG4gIGlmICghc3RhdGUucmVhZGluZykge1xuICAgIHN0cmVhbS5yZWFkKDApO1xuICB9XG4gIHN0YXRlLnJlc3VtZVNjaGVkdWxlZCA9IGZhbHNlO1xuICBzdHJlYW0uZW1pdCgncmVzdW1lJyk7XG4gIGZsb3coc3RyZWFtKTtcbiAgaWYgKHN0YXRlLmZsb3dpbmcgJiYgIXN0YXRlLnJlYWRpbmcpIHN0cmVhbS5yZWFkKDApO1xufVxuUmVhZGFibGUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICBkZWJ1ZygnY2FsbCBwYXVzZSBmbG93aW5nPSVqJywgdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nKTtcbiAgaWYgKHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyAhPT0gZmFsc2UpIHtcbiAgICBkZWJ1ZygncGF1c2UnKTtcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmVtaXQoJ3BhdXNlJyk7XG4gIH1cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5wYXVzZWQgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5mdW5jdGlvbiBmbG93KHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIGRlYnVnKCdmbG93Jywgc3RhdGUuZmxvd2luZyk7XG4gIHdoaWxlIChzdGF0ZS5mbG93aW5nICYmIHN0cmVhbS5yZWFkKCkgIT09IG51bGwpO1xufVxuXG4vLyB3cmFwIGFuIG9sZC1zdHlsZSBzdHJlYW0gYXMgdGhlIGFzeW5jIGRhdGEgc291cmNlLlxuLy8gVGhpcyBpcyAqbm90KiBwYXJ0IG9mIHRoZSByZWFkYWJsZSBzdHJlYW0gaW50ZXJmYWNlLlxuLy8gSXQgaXMgYW4gdWdseSB1bmZvcnR1bmF0ZSBtZXNzIG9mIGhpc3RvcnkuXG5SZWFkYWJsZS5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uIChzdHJlYW0pIHtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgdmFyIHBhdXNlZCA9IGZhbHNlO1xuICBzdHJlYW0ub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBkZWJ1Zygnd3JhcHBlZCBlbmQnKTtcbiAgICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICAgIHZhciBjaHVuayA9IHN0YXRlLmRlY29kZXIuZW5kKCk7XG4gICAgICBpZiAoY2h1bmsgJiYgY2h1bmsubGVuZ3RoKSBfdGhpcy5wdXNoKGNodW5rKTtcbiAgICB9XG4gICAgX3RoaXMucHVzaChudWxsKTtcbiAgfSk7XG4gIHN0cmVhbS5vbignZGF0YScsIGZ1bmN0aW9uIChjaHVuaykge1xuICAgIGRlYnVnKCd3cmFwcGVkIGRhdGEnKTtcbiAgICBpZiAoc3RhdGUuZGVjb2RlcikgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLndyaXRlKGNodW5rKTtcblxuICAgIC8vIGRvbid0IHNraXAgb3ZlciBmYWxzeSB2YWx1ZXMgaW4gb2JqZWN0TW9kZVxuICAgIGlmIChzdGF0ZS5vYmplY3RNb2RlICYmIChjaHVuayA9PT0gbnVsbCB8fCBjaHVuayA9PT0gdW5kZWZpbmVkKSkgcmV0dXJuO2Vsc2UgaWYgKCFzdGF0ZS5vYmplY3RNb2RlICYmICghY2h1bmsgfHwgIWNodW5rLmxlbmd0aCkpIHJldHVybjtcbiAgICB2YXIgcmV0ID0gX3RoaXMucHVzaChjaHVuayk7XG4gICAgaWYgKCFyZXQpIHtcbiAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICBzdHJlYW0ucGF1c2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHByb3h5IGFsbCB0aGUgb3RoZXIgbWV0aG9kcy5cbiAgLy8gaW1wb3J0YW50IHdoZW4gd3JhcHBpbmcgZmlsdGVycyBhbmQgZHVwbGV4ZXMuXG4gIGZvciAodmFyIGkgaW4gc3RyZWFtKSB7XG4gICAgaWYgKHRoaXNbaV0gPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygc3RyZWFtW2ldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzW2ldID0gZnVuY3Rpb24gbWV0aG9kV3JhcChtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG1ldGhvZFdyYXBSZXR1cm5GdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gc3RyZWFtW21ldGhvZF0uYXBwbHkoc3RyZWFtLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfShpKTtcbiAgICB9XG4gIH1cblxuICAvLyBwcm94eSBjZXJ0YWluIGltcG9ydGFudCBldmVudHMuXG4gIGZvciAodmFyIG4gPSAwOyBuIDwga1Byb3h5RXZlbnRzLmxlbmd0aDsgbisrKSB7XG4gICAgc3RyZWFtLm9uKGtQcm94eUV2ZW50c1tuXSwgdGhpcy5lbWl0LmJpbmQodGhpcywga1Byb3h5RXZlbnRzW25dKSk7XG4gIH1cblxuICAvLyB3aGVuIHdlIHRyeSB0byBjb25zdW1lIHNvbWUgbW9yZSBieXRlcywgc2ltcGx5IHVucGF1c2UgdGhlXG4gIC8vIHVuZGVybHlpbmcgc3RyZWFtLlxuICB0aGlzLl9yZWFkID0gZnVuY3Rpb24gKG4pIHtcbiAgICBkZWJ1Zygnd3JhcHBlZCBfcmVhZCcsIG4pO1xuICAgIGlmIChwYXVzZWQpIHtcbiAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgc3RyZWFtLnJlc3VtZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcbiAgUmVhZGFibGUucHJvdG90eXBlW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY3JlYXRlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNyZWF0ZVJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvciA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvc3RyZWFtcy9hc3luY19pdGVyYXRvcicpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yKHRoaXMpO1xuICB9O1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlLnByb3RvdHlwZSwgJ3JlYWRhYmxlSGlnaFdhdGVyTWFyaycsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuaGlnaFdhdGVyTWFyaztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGUucHJvdG90eXBlLCAncmVhZGFibGVCdWZmZXInLCB7XG4gIC8vIG1ha2luZyBpdCBleHBsaWNpdCB0aGlzIHByb3BlcnR5IGlzIG5vdCBlbnVtZXJhYmxlXG4gIC8vIGJlY2F1c2Ugb3RoZXJ3aXNlIHNvbWUgcHJvdG90eXBlIG1hbmlwdWxhdGlvbiBpblxuICAvLyB1c2VybGFuZCB3aWxsIGZhaWxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlICYmIHRoaXMuX3JlYWRhYmxlU3RhdGUuYnVmZmVyO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZS5wcm90b3R5cGUsICdyZWFkYWJsZUZsb3dpbmcnLCB7XG4gIC8vIG1ha2luZyBpdCBleHBsaWNpdCB0aGlzIHByb3BlcnR5IGlzIG5vdCBlbnVtZXJhYmxlXG4gIC8vIGJlY2F1c2Ugb3RoZXJ3aXNlIHNvbWUgcHJvdG90eXBlIG1hbmlwdWxhdGlvbiBpblxuICAvLyB1c2VybGFuZCB3aWxsIGZhaWxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmc7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gc2V0KHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3JlYWRhYmxlU3RhdGUpIHtcbiAgICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyA9IHN0YXRlO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIGV4cG9zZWQgZm9yIHRlc3RpbmcgcHVycG9zZXMgb25seS5cblJlYWRhYmxlLl9mcm9tTGlzdCA9IGZyb21MaXN0O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlLnByb3RvdHlwZSwgJ3JlYWRhYmxlTGVuZ3RoJywge1xuICAvLyBtYWtpbmcgaXQgZXhwbGljaXQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgZW51bWVyYWJsZVxuICAvLyBiZWNhdXNlIG90aGVyd2lzZSBzb21lIHByb3RvdHlwZSBtYW5pcHVsYXRpb24gaW5cbiAgLy8gdXNlcmxhbmQgd2lsbCBmYWlsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5sZW5ndGg7XG4gIH1cbn0pO1xuXG4vLyBQbHVjayBvZmYgbiBieXRlcyBmcm9tIGFuIGFycmF5IG9mIGJ1ZmZlcnMuXG4vLyBMZW5ndGggaXMgdGhlIGNvbWJpbmVkIGxlbmd0aHMgb2YgYWxsIHRoZSBidWZmZXJzIGluIHRoZSBsaXN0LlxuLy8gVGhpcyBmdW5jdGlvbiBpcyBkZXNpZ25lZCB0byBiZSBpbmxpbmFibGUsIHNvIHBsZWFzZSB0YWtlIGNhcmUgd2hlbiBtYWtpbmdcbi8vIGNoYW5nZXMgdG8gdGhlIGZ1bmN0aW9uIGJvZHkuXG5mdW5jdGlvbiBmcm9tTGlzdChuLCBzdGF0ZSkge1xuICAvLyBub3RoaW5nIGJ1ZmZlcmVkXG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICB2YXIgcmV0O1xuICBpZiAoc3RhdGUub2JqZWN0TW9kZSkgcmV0ID0gc3RhdGUuYnVmZmVyLnNoaWZ0KCk7ZWxzZSBpZiAoIW4gfHwgbiA+PSBzdGF0ZS5sZW5ndGgpIHtcbiAgICAvLyByZWFkIGl0IGFsbCwgdHJ1bmNhdGUgdGhlIGxpc3RcbiAgICBpZiAoc3RhdGUuZGVjb2RlcikgcmV0ID0gc3RhdGUuYnVmZmVyLmpvaW4oJycpO2Vsc2UgaWYgKHN0YXRlLmJ1ZmZlci5sZW5ndGggPT09IDEpIHJldCA9IHN0YXRlLmJ1ZmZlci5maXJzdCgpO2Vsc2UgcmV0ID0gc3RhdGUuYnVmZmVyLmNvbmNhdChzdGF0ZS5sZW5ndGgpO1xuICAgIHN0YXRlLmJ1ZmZlci5jbGVhcigpO1xuICB9IGVsc2Uge1xuICAgIC8vIHJlYWQgcGFydCBvZiBsaXN0XG4gICAgcmV0ID0gc3RhdGUuYnVmZmVyLmNvbnN1bWUobiwgc3RhdGUuZGVjb2Rlcik7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cbmZ1bmN0aW9uIGVuZFJlYWRhYmxlKHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIGRlYnVnKCdlbmRSZWFkYWJsZScsIHN0YXRlLmVuZEVtaXR0ZWQpO1xuICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQpIHtcbiAgICBzdGF0ZS5lbmRlZCA9IHRydWU7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhlbmRSZWFkYWJsZU5ULCBzdGF0ZSwgc3RyZWFtKTtcbiAgfVxufVxuZnVuY3Rpb24gZW5kUmVhZGFibGVOVChzdGF0ZSwgc3RyZWFtKSB7XG4gIGRlYnVnKCdlbmRSZWFkYWJsZU5UJywgc3RhdGUuZW5kRW1pdHRlZCwgc3RhdGUubGVuZ3RoKTtcblxuICAvLyBDaGVjayB0aGF0IHdlIGRpZG4ndCBnZXQgb25lIGxhc3QgdW5zaGlmdC5cbiAgaWYgKCFzdGF0ZS5lbmRFbWl0dGVkICYmIHN0YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgIHN0YXRlLmVuZEVtaXR0ZWQgPSB0cnVlO1xuICAgIHN0cmVhbS5yZWFkYWJsZSA9IGZhbHNlO1xuICAgIHN0cmVhbS5lbWl0KCdlbmQnKTtcbiAgICBpZiAoc3RhdGUuYXV0b0Rlc3Ryb3kpIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgZHVwbGV4IHN0cmVhbXMgd2UgbmVlZCBhIHdheSB0byBkZXRlY3RcbiAgICAgIC8vIGlmIHRoZSB3cml0YWJsZSBzaWRlIGlzIHJlYWR5IGZvciBhdXRvRGVzdHJveSBhcyB3ZWxsXG4gICAgICB2YXIgd1N0YXRlID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICAgICAgaWYgKCF3U3RhdGUgfHwgd1N0YXRlLmF1dG9EZXN0cm95ICYmIHdTdGF0ZS5maW5pc2hlZCkge1xuICAgICAgICBzdHJlYW0uZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcbiAgUmVhZGFibGUuZnJvbSA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgb3B0cykge1xuICAgIGlmIChmcm9tID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZyb20gPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvZnJvbScpO1xuICAgIH1cbiAgICByZXR1cm4gZnJvbShSZWFkYWJsZSwgaXRlcmFibGUsIG9wdHMpO1xuICB9O1xufVxuZnVuY3Rpb24gaW5kZXhPZih4cywgeCkge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHhzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmICh4c1tpXSA9PT0geCkgcmV0dXJuIGk7XG4gIH1cbiAgcmV0dXJuIC0xO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBhIHRyYW5zZm9ybSBzdHJlYW0gaXMgYSByZWFkYWJsZS93cml0YWJsZSBzdHJlYW0gd2hlcmUgeW91IGRvXG4vLyBzb21ldGhpbmcgd2l0aCB0aGUgZGF0YS4gIFNvbWV0aW1lcyBpdCdzIGNhbGxlZCBhIFwiZmlsdGVyXCIsXG4vLyBidXQgdGhhdCdzIG5vdCBhIGdyZWF0IG5hbWUgZm9yIGl0LCBzaW5jZSB0aGF0IGltcGxpZXMgYSB0aGluZyB3aGVyZVxuLy8gc29tZSBiaXRzIHBhc3MgdGhyb3VnaCwgYW5kIG90aGVycyBhcmUgc2ltcGx5IGlnbm9yZWQuICAoVGhhdCB3b3VsZFxuLy8gYmUgYSB2YWxpZCBleGFtcGxlIG9mIGEgdHJhbnNmb3JtLCBvZiBjb3Vyc2UuKVxuLy9cbi8vIFdoaWxlIHRoZSBvdXRwdXQgaXMgY2F1c2FsbHkgcmVsYXRlZCB0byB0aGUgaW5wdXQsIGl0J3Mgbm90IGFcbi8vIG5lY2Vzc2FyaWx5IHN5bW1ldHJpYyBvciBzeW5jaHJvbm91cyB0cmFuc2Zvcm1hdGlvbi4gIEZvciBleGFtcGxlLFxuLy8gYSB6bGliIHN0cmVhbSBtaWdodCB0YWtlIG11bHRpcGxlIHBsYWluLXRleHQgd3JpdGVzKCksIGFuZCB0aGVuXG4vLyBlbWl0IGEgc2luZ2xlIGNvbXByZXNzZWQgY2h1bmsgc29tZSB0aW1lIGluIHRoZSBmdXR1cmUuXG4vL1xuLy8gSGVyZSdzIGhvdyB0aGlzIHdvcmtzOlxuLy9cbi8vIFRoZSBUcmFuc2Zvcm0gc3RyZWFtIGhhcyBhbGwgdGhlIGFzcGVjdHMgb2YgdGhlIHJlYWRhYmxlIGFuZCB3cml0YWJsZVxuLy8gc3RyZWFtIGNsYXNzZXMuICBXaGVuIHlvdSB3cml0ZShjaHVuayksIHRoYXQgY2FsbHMgX3dyaXRlKGNodW5rLGNiKVxuLy8gaW50ZXJuYWxseSwgYW5kIHJldHVybnMgZmFsc2UgaWYgdGhlcmUncyBhIGxvdCBvZiBwZW5kaW5nIHdyaXRlc1xuLy8gYnVmZmVyZWQgdXAuICBXaGVuIHlvdSBjYWxsIHJlYWQoKSwgdGhhdCBjYWxscyBfcmVhZChuKSB1bnRpbFxuLy8gdGhlcmUncyBlbm91Z2ggcGVuZGluZyByZWFkYWJsZSBkYXRhIGJ1ZmZlcmVkIHVwLlxuLy9cbi8vIEluIGEgdHJhbnNmb3JtIHN0cmVhbSwgdGhlIHdyaXR0ZW4gZGF0YSBpcyBwbGFjZWQgaW4gYSBidWZmZXIuICBXaGVuXG4vLyBfcmVhZChuKSBpcyBjYWxsZWQsIGl0IHRyYW5zZm9ybXMgdGhlIHF1ZXVlZCB1cCBkYXRhLCBjYWxsaW5nIHRoZVxuLy8gYnVmZmVyZWQgX3dyaXRlIGNiJ3MgYXMgaXQgY29uc3VtZXMgY2h1bmtzLiAgSWYgY29uc3VtaW5nIGEgc2luZ2xlXG4vLyB3cml0dGVuIGNodW5rIHdvdWxkIHJlc3VsdCBpbiBtdWx0aXBsZSBvdXRwdXQgY2h1bmtzLCB0aGVuIHRoZSBmaXJzdFxuLy8gb3V0cHV0dGVkIGJpdCBjYWxscyB0aGUgcmVhZGNiLCBhbmQgc3Vic2VxdWVudCBjaHVua3MganVzdCBnbyBpbnRvXG4vLyB0aGUgcmVhZCBidWZmZXIsIGFuZCB3aWxsIGNhdXNlIGl0IHRvIGVtaXQgJ3JlYWRhYmxlJyBpZiBuZWNlc3NhcnkuXG4vL1xuLy8gVGhpcyB3YXksIGJhY2stcHJlc3N1cmUgaXMgYWN0dWFsbHkgZGV0ZXJtaW5lZCBieSB0aGUgcmVhZGluZyBzaWRlLFxuLy8gc2luY2UgX3JlYWQgaGFzIHRvIGJlIGNhbGxlZCB0byBzdGFydCBwcm9jZXNzaW5nIGEgbmV3IGNodW5rLiAgSG93ZXZlcixcbi8vIGEgcGF0aG9sb2dpY2FsIGluZmxhdGUgdHlwZSBvZiB0cmFuc2Zvcm0gY2FuIGNhdXNlIGV4Y2Vzc2l2ZSBidWZmZXJpbmdcbi8vIGhlcmUuICBGb3IgZXhhbXBsZSwgaW1hZ2luZSBhIHN0cmVhbSB3aGVyZSBldmVyeSBieXRlIG9mIGlucHV0IGlzXG4vLyBpbnRlcnByZXRlZCBhcyBhbiBpbnRlZ2VyIGZyb20gMC0yNTUsIGFuZCB0aGVuIHJlc3VsdHMgaW4gdGhhdCBtYW55XG4vLyBieXRlcyBvZiBvdXRwdXQuICBXcml0aW5nIHRoZSA0IGJ5dGVzIHtmZixmZixmZixmZn0gd291bGQgcmVzdWx0IGluXG4vLyAxa2Igb2YgZGF0YSBiZWluZyBvdXRwdXQuICBJbiB0aGlzIGNhc2UsIHlvdSBjb3VsZCB3cml0ZSBhIHZlcnkgc21hbGxcbi8vIGFtb3VudCBvZiBpbnB1dCwgYW5kIGVuZCB1cCB3aXRoIGEgdmVyeSBsYXJnZSBhbW91bnQgb2Ygb3V0cHV0LiAgSW5cbi8vIHN1Y2ggYSBwYXRob2xvZ2ljYWwgaW5mbGF0aW5nIG1lY2hhbmlzbSwgdGhlcmUnZCBiZSBubyB3YXkgdG8gdGVsbFxuLy8gdGhlIHN5c3RlbSB0byBzdG9wIGRvaW5nIHRoZSB0cmFuc2Zvcm0uICBBIHNpbmdsZSA0TUIgd3JpdGUgY291bGRcbi8vIGNhdXNlIHRoZSBzeXN0ZW0gdG8gcnVuIG91dCBvZiBtZW1vcnkuXG4vL1xuLy8gSG93ZXZlciwgZXZlbiBpbiBzdWNoIGEgcGF0aG9sb2dpY2FsIGNhc2UsIG9ubHkgYSBzaW5nbGUgd3JpdHRlbiBjaHVua1xuLy8gd291bGQgYmUgY29uc3VtZWQsIGFuZCB0aGVuIHRoZSByZXN0IHdvdWxkIHdhaXQgKHVuLXRyYW5zZm9ybWVkKSB1bnRpbFxuLy8gdGhlIHJlc3VsdHMgb2YgdGhlIHByZXZpb3VzIHRyYW5zZm9ybWVkIGNodW5rIHdlcmUgY29uc3VtZWQuXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2Zvcm07XG52YXIgX3JlcXVpcmUkY29kZXMgPSByZXF1aXJlKCcuLi9lcnJvcnMnKS5jb2RlcyxcbiAgRVJSX01FVEhPRF9OT1RfSU1QTEVNRU5URUQgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfTUVUSE9EX05PVF9JTVBMRU1FTlRFRCxcbiAgRVJSX01VTFRJUExFX0NBTExCQUNLID0gX3JlcXVpcmUkY29kZXMuRVJSX01VTFRJUExFX0NBTExCQUNLLFxuICBFUlJfVFJBTlNGT1JNX0FMUkVBRFlfVFJBTlNGT1JNSU5HID0gX3JlcXVpcmUkY29kZXMuRVJSX1RSQU5TRk9STV9BTFJFQURZX1RSQU5TRk9STUlORyxcbiAgRVJSX1RSQU5TRk9STV9XSVRIX0xFTkdUSF8wID0gX3JlcXVpcmUkY29kZXMuRVJSX1RSQU5TRk9STV9XSVRIX0xFTkdUSF8wO1xudmFyIER1cGxleCA9IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcbnJlcXVpcmUoJ2luaGVyaXRzJykoVHJhbnNmb3JtLCBEdXBsZXgpO1xuZnVuY3Rpb24gYWZ0ZXJUcmFuc2Zvcm0oZXIsIGRhdGEpIHtcbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuICB2YXIgY2IgPSB0cy53cml0ZWNiO1xuICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFUlJfTVVMVElQTEVfQ0FMTEJBQ0soKSk7XG4gIH1cbiAgdHMud3JpdGVjaHVuayA9IG51bGw7XG4gIHRzLndyaXRlY2IgPSBudWxsO1xuICBpZiAoZGF0YSAhPSBudWxsKVxuICAgIC8vIHNpbmdsZSBlcXVhbHMgY2hlY2sgZm9yIGJvdGggYG51bGxgIGFuZCBgdW5kZWZpbmVkYFxuICAgIHRoaXMucHVzaChkYXRhKTtcbiAgY2IoZXIpO1xuICB2YXIgcnMgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICBycy5yZWFkaW5nID0gZmFsc2U7XG4gIGlmIChycy5uZWVkUmVhZGFibGUgfHwgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaykge1xuICAgIHRoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayk7XG4gIH1cbn1cbmZ1bmN0aW9uIFRyYW5zZm9ybShvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUcmFuc2Zvcm0pKSByZXR1cm4gbmV3IFRyYW5zZm9ybShvcHRpb25zKTtcbiAgRHVwbGV4LmNhbGwodGhpcywgb3B0aW9ucyk7XG4gIHRoaXMuX3RyYW5zZm9ybVN0YXRlID0ge1xuICAgIGFmdGVyVHJhbnNmb3JtOiBhZnRlclRyYW5zZm9ybS5iaW5kKHRoaXMpLFxuICAgIG5lZWRUcmFuc2Zvcm06IGZhbHNlLFxuICAgIHRyYW5zZm9ybWluZzogZmFsc2UsXG4gICAgd3JpdGVjYjogbnVsbCxcbiAgICB3cml0ZWNodW5rOiBudWxsLFxuICAgIHdyaXRlZW5jb2Rpbmc6IG51bGxcbiAgfTtcblxuICAvLyBzdGFydCBvdXQgYXNraW5nIGZvciBhIHJlYWRhYmxlIGV2ZW50IG9uY2UgZGF0YSBpcyB0cmFuc2Zvcm1lZC5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuXG4gIC8vIHdlIGhhdmUgaW1wbGVtZW50ZWQgdGhlIF9yZWFkIG1ldGhvZCwgYW5kIGRvbmUgdGhlIG90aGVyIHRoaW5nc1xuICAvLyB0aGF0IFJlYWRhYmxlIHdhbnRzIGJlZm9yZSB0aGUgZmlyc3QgX3JlYWQgY2FsbCwgc28gdW5zZXQgdGhlXG4gIC8vIHN5bmMgZ3VhcmQgZmxhZy5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5zeW5jID0gZmFsc2U7XG4gIGlmIChvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnRyYW5zZm9ybSA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fdHJhbnNmb3JtID0gb3B0aW9ucy50cmFuc2Zvcm07XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmZsdXNoID09PSAnZnVuY3Rpb24nKSB0aGlzLl9mbHVzaCA9IG9wdGlvbnMuZmx1c2g7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB3cml0YWJsZSBzaWRlIGZpbmlzaGVzLCB0aGVuIGZsdXNoIG91dCBhbnl0aGluZyByZW1haW5pbmcuXG4gIHRoaXMub24oJ3ByZWZpbmlzaCcsIHByZWZpbmlzaCk7XG59XG5mdW5jdGlvbiBwcmVmaW5pc2goKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIGlmICh0eXBlb2YgdGhpcy5fZmx1c2ggPT09ICdmdW5jdGlvbicgJiYgIXRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkKSB7XG4gICAgdGhpcy5fZmx1c2goZnVuY3Rpb24gKGVyLCBkYXRhKSB7XG4gICAgICBkb25lKF90aGlzLCBlciwgZGF0YSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZG9uZSh0aGlzLCBudWxsLCBudWxsKTtcbiAgfVxufVxuVHJhbnNmb3JtLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZykge1xuICB0aGlzLl90cmFuc2Zvcm1TdGF0ZS5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gIHJldHVybiBEdXBsZXgucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCBjaHVuaywgZW5jb2RpbmcpO1xufTtcblxuLy8gVGhpcyBpcyB0aGUgcGFydCB3aGVyZSB5b3UgZG8gc3R1ZmYhXG4vLyBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uIGluIGltcGxlbWVudGF0aW9uIGNsYXNzZXMuXG4vLyAnY2h1bmsnIGlzIGFuIGlucHV0IGNodW5rLlxuLy9cbi8vIENhbGwgYHB1c2gobmV3Q2h1bmspYCB0byBwYXNzIGFsb25nIHRyYW5zZm9ybWVkIG91dHB1dFxuLy8gdG8gdGhlIHJlYWRhYmxlIHNpZGUuICBZb3UgbWF5IGNhbGwgJ3B1c2gnIHplcm8gb3IgbW9yZSB0aW1lcy5cbi8vXG4vLyBDYWxsIGBjYihlcnIpYCB3aGVuIHlvdSBhcmUgZG9uZSB3aXRoIHRoaXMgY2h1bmsuICBJZiB5b3UgcGFzc1xuLy8gYW4gZXJyb3IsIHRoZW4gdGhhdCdsbCBwdXQgdGhlIGh1cnQgb24gdGhlIHdob2xlIG9wZXJhdGlvbi4gIElmIHlvdVxuLy8gbmV2ZXIgY2FsbCBjYigpLCB0aGVuIHlvdSdsbCBuZXZlciBnZXQgYW5vdGhlciBjaHVuay5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGNiKG5ldyBFUlJfTUVUSE9EX05PVF9JTVBMRU1FTlRFRCgnX3RyYW5zZm9ybSgpJykpO1xufTtcblRyYW5zZm9ybS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLndyaXRlY2IgPSBjYjtcbiAgdHMud3JpdGVjaHVuayA9IGNodW5rO1xuICB0cy53cml0ZWVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIGlmICghdHMudHJhbnNmb3JtaW5nKSB7XG4gICAgdmFyIHJzID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgICBpZiAodHMubmVlZFRyYW5zZm9ybSB8fCBycy5uZWVkUmVhZGFibGUgfHwgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaykgdGhpcy5fcmVhZChycy5oaWdoV2F0ZXJNYXJrKTtcbiAgfVxufTtcblxuLy8gRG9lc24ndCBtYXR0ZXIgd2hhdCB0aGUgYXJncyBhcmUgaGVyZS5cbi8vIF90cmFuc2Zvcm0gZG9lcyBhbGwgdGhlIHdvcmsuXG4vLyBUaGF0IHdlIGdvdCBoZXJlIG1lYW5zIHRoYXQgdGhlIHJlYWRhYmxlIHNpZGUgd2FudHMgbW9yZSBkYXRhLlxuVHJhbnNmb3JtLnByb3RvdHlwZS5fcmVhZCA9IGZ1bmN0aW9uIChuKSB7XG4gIHZhciB0cyA9IHRoaXMuX3RyYW5zZm9ybVN0YXRlO1xuICBpZiAodHMud3JpdGVjaHVuayAhPT0gbnVsbCAmJiAhdHMudHJhbnNmb3JtaW5nKSB7XG4gICAgdHMudHJhbnNmb3JtaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl90cmFuc2Zvcm0odHMud3JpdGVjaHVuaywgdHMud3JpdGVlbmNvZGluZywgdHMuYWZ0ZXJUcmFuc2Zvcm0pO1xuICB9IGVsc2Uge1xuICAgIC8vIG1hcmsgdGhhdCB3ZSBuZWVkIGEgdHJhbnNmb3JtLCBzbyB0aGF0IGFueSBkYXRhIHRoYXQgY29tZXMgaW5cbiAgICAvLyB3aWxsIGdldCBwcm9jZXNzZWQsIG5vdyB0aGF0IHdlJ3ZlIGFza2VkIGZvciBpdC5cbiAgICB0cy5uZWVkVHJhbnNmb3JtID0gdHJ1ZTtcbiAgfVxufTtcblRyYW5zZm9ybS5wcm90b3R5cGUuX2Rlc3Ryb3kgPSBmdW5jdGlvbiAoZXJyLCBjYikge1xuICBEdXBsZXgucHJvdG90eXBlLl9kZXN0cm95LmNhbGwodGhpcywgZXJyLCBmdW5jdGlvbiAoZXJyMikge1xuICAgIGNiKGVycjIpO1xuICB9KTtcbn07XG5mdW5jdGlvbiBkb25lKHN0cmVhbSwgZXIsIGRhdGEpIHtcbiAgaWYgKGVyKSByZXR1cm4gc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuICBpZiAoZGF0YSAhPSBudWxsKVxuICAgIC8vIHNpbmdsZSBlcXVhbHMgY2hlY2sgZm9yIGJvdGggYG51bGxgIGFuZCBgdW5kZWZpbmVkYFxuICAgIHN0cmVhbS5wdXNoKGRhdGEpO1xuXG4gIC8vIFRPRE8oQnJpZGdlQVIpOiBXcml0ZSBhIHRlc3QgZm9yIHRoZXNlIHR3byBlcnJvciBjYXNlc1xuICAvLyBpZiB0aGVyZSdzIG5vdGhpbmcgaW4gdGhlIHdyaXRlIGJ1ZmZlciwgdGhlbiB0aGF0IG1lYW5zXG4gIC8vIHRoYXQgbm90aGluZyBtb3JlIHdpbGwgZXZlciBiZSBwcm92aWRlZFxuICBpZiAoc3RyZWFtLl93cml0YWJsZVN0YXRlLmxlbmd0aCkgdGhyb3cgbmV3IEVSUl9UUkFOU0ZPUk1fV0lUSF9MRU5HVEhfMCgpO1xuICBpZiAoc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZS50cmFuc2Zvcm1pbmcpIHRocm93IG5ldyBFUlJfVFJBTlNGT1JNX0FMUkVBRFlfVFJBTlNGT1JNSU5HKCk7XG4gIHJldHVybiBzdHJlYW0ucHVzaChudWxsKTtcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gQSBiaXQgc2ltcGxlciB0aGFuIHJlYWRhYmxlIHN0cmVhbXMuXG4vLyBJbXBsZW1lbnQgYW4gYXN5bmMgLl93cml0ZShjaHVuaywgZW5jb2RpbmcsIGNiKSwgYW5kIGl0J2xsIGhhbmRsZSBhbGxcbi8vIHRoZSBkcmFpbiBldmVudCBlbWlzc2lvbiBhbmQgYnVmZmVyaW5nLlxuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gV3JpdGFibGU7XG5cbi8qIDxyZXBsYWNlbWVudD4gKi9cbmZ1bmN0aW9uIFdyaXRlUmVxKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdGhpcy5jaHVuayA9IGNodW5rO1xuICB0aGlzLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIHRoaXMuY2FsbGJhY2sgPSBjYjtcbiAgdGhpcy5uZXh0ID0gbnVsbDtcbn1cblxuLy8gSXQgc2VlbXMgYSBsaW5rZWQgbGlzdCBidXQgaXQgaXMgbm90XG4vLyB0aGVyZSB3aWxsIGJlIG9ubHkgMiBvZiB0aGVzZSBmb3IgZWFjaCBzdHJlYW1cbmZ1bmN0aW9uIENvcmtlZFJlcXVlc3Qoc3RhdGUpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgdGhpcy5lbnRyeSA9IG51bGw7XG4gIHRoaXMuZmluaXNoID0gZnVuY3Rpb24gKCkge1xuICAgIG9uQ29ya2VkRmluaXNoKF90aGlzLCBzdGF0ZSk7XG4gIH07XG59XG4vKiA8L3JlcGxhY2VtZW50PiAqL1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIER1cGxleDtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5Xcml0YWJsZS5Xcml0YWJsZVN0YXRlID0gV3JpdGFibGVTdGF0ZTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBpbnRlcm5hbFV0aWwgPSB7XG4gIGRlcHJlY2F0ZTogcmVxdWlyZSgndXRpbC1kZXByZWNhdGUnKVxufTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIFN0cmVhbSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvc3RyZWFtcy9zdHJlYW0nKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xudmFyIE91clVpbnQ4QXJyYXkgPSAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB7fSkuVWludDhBcnJheSB8fCBmdW5jdGlvbiAoKSB7fTtcbmZ1bmN0aW9uIF91aW50OEFycmF5VG9CdWZmZXIoY2h1bmspIHtcbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKGNodW5rKTtcbn1cbmZ1bmN0aW9uIF9pc1VpbnQ4QXJyYXkob2JqKSB7XG4gIHJldHVybiBCdWZmZXIuaXNCdWZmZXIob2JqKSB8fCBvYmogaW5zdGFuY2VvZiBPdXJVaW50OEFycmF5O1xufVxudmFyIGRlc3Ryb3lJbXBsID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9zdHJlYW1zL2Rlc3Ryb3knKTtcbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvc3RyZWFtcy9zdGF0ZScpLFxuICBnZXRIaWdoV2F0ZXJNYXJrID0gX3JlcXVpcmUuZ2V0SGlnaFdhdGVyTWFyaztcbnZhciBfcmVxdWlyZSRjb2RlcyA9IHJlcXVpcmUoJy4uL2Vycm9ycycpLmNvZGVzLFxuICBFUlJfSU5WQUxJRF9BUkdfVFlQRSA9IF9yZXF1aXJlJGNvZGVzLkVSUl9JTlZBTElEX0FSR19UWVBFLFxuICBFUlJfTUVUSE9EX05PVF9JTVBMRU1FTlRFRCA9IF9yZXF1aXJlJGNvZGVzLkVSUl9NRVRIT0RfTk9UX0lNUExFTUVOVEVELFxuICBFUlJfTVVMVElQTEVfQ0FMTEJBQ0sgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfTVVMVElQTEVfQ0FMTEJBQ0ssXG4gIEVSUl9TVFJFQU1fQ0FOTk9UX1BJUEUgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfU1RSRUFNX0NBTk5PVF9QSVBFLFxuICBFUlJfU1RSRUFNX0RFU1RST1lFRCA9IF9yZXF1aXJlJGNvZGVzLkVSUl9TVFJFQU1fREVTVFJPWUVELFxuICBFUlJfU1RSRUFNX05VTExfVkFMVUVTID0gX3JlcXVpcmUkY29kZXMuRVJSX1NUUkVBTV9OVUxMX1ZBTFVFUyxcbiAgRVJSX1NUUkVBTV9XUklURV9BRlRFUl9FTkQgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfU1RSRUFNX1dSSVRFX0FGVEVSX0VORCxcbiAgRVJSX1VOS05PV05fRU5DT0RJTkcgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfVU5LTk9XTl9FTkNPRElORztcbnZhciBlcnJvck9yRGVzdHJveSA9IGRlc3Ryb3lJbXBsLmVycm9yT3JEZXN0cm95O1xucmVxdWlyZSgnaW5oZXJpdHMnKShXcml0YWJsZSwgU3RyZWFtKTtcbmZ1bmN0aW9uIG5vcCgpIHt9XG5mdW5jdGlvbiBXcml0YWJsZVN0YXRlKG9wdGlvbnMsIHN0cmVhbSwgaXNEdXBsZXgpIHtcbiAgRHVwbGV4ID0gRHVwbGV4IHx8IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gRHVwbGV4IHN0cmVhbXMgYXJlIGJvdGggcmVhZGFibGUgYW5kIHdyaXRhYmxlLCBidXQgc2hhcmVcbiAgLy8gdGhlIHNhbWUgb3B0aW9ucyBvYmplY3QuXG4gIC8vIEhvd2V2ZXIsIHNvbWUgY2FzZXMgcmVxdWlyZSBzZXR0aW5nIG9wdGlvbnMgdG8gZGlmZmVyZW50XG4gIC8vIHZhbHVlcyBmb3IgdGhlIHJlYWRhYmxlIGFuZCB0aGUgd3JpdGFibGUgc2lkZXMgb2YgdGhlIGR1cGxleCBzdHJlYW0sXG4gIC8vIGUuZy4gb3B0aW9ucy5yZWFkYWJsZU9iamVjdE1vZGUgdnMuIG9wdGlvbnMud3JpdGFibGVPYmplY3RNb2RlLCBldGMuXG4gIGlmICh0eXBlb2YgaXNEdXBsZXggIT09ICdib29sZWFuJykgaXNEdXBsZXggPSBzdHJlYW0gaW5zdGFuY2VvZiBEdXBsZXg7XG5cbiAgLy8gb2JqZWN0IHN0cmVhbSBmbGFnIHRvIGluZGljYXRlIHdoZXRoZXIgb3Igbm90IHRoaXMgc3RyZWFtXG4gIC8vIGNvbnRhaW5zIGJ1ZmZlcnMgb3Igb2JqZWN0cy5cbiAgdGhpcy5vYmplY3RNb2RlID0gISFvcHRpb25zLm9iamVjdE1vZGU7XG4gIGlmIChpc0R1cGxleCkgdGhpcy5vYmplY3RNb2RlID0gdGhpcy5vYmplY3RNb2RlIHx8ICEhb3B0aW9ucy53cml0YWJsZU9iamVjdE1vZGU7XG5cbiAgLy8gdGhlIHBvaW50IGF0IHdoaWNoIHdyaXRlKCkgc3RhcnRzIHJldHVybmluZyBmYWxzZVxuICAvLyBOb3RlOiAwIGlzIGEgdmFsaWQgdmFsdWUsIG1lYW5zIHRoYXQgd2UgYWx3YXlzIHJldHVybiBmYWxzZSBpZlxuICAvLyB0aGUgZW50aXJlIGJ1ZmZlciBpcyBub3QgZmx1c2hlZCBpbW1lZGlhdGVseSBvbiB3cml0ZSgpXG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IGdldEhpZ2hXYXRlck1hcmsodGhpcywgb3B0aW9ucywgJ3dyaXRhYmxlSGlnaFdhdGVyTWFyaycsIGlzRHVwbGV4KTtcblxuICAvLyBpZiBfZmluYWwgaGFzIGJlZW4gY2FsbGVkXG4gIHRoaXMuZmluYWxDYWxsZWQgPSBmYWxzZTtcblxuICAvLyBkcmFpbiBldmVudCBmbGFnLlxuICB0aGlzLm5lZWREcmFpbiA9IGZhbHNlO1xuICAvLyBhdCB0aGUgc3RhcnQgb2YgY2FsbGluZyBlbmQoKVxuICB0aGlzLmVuZGluZyA9IGZhbHNlO1xuICAvLyB3aGVuIGVuZCgpIGhhcyBiZWVuIGNhbGxlZCwgYW5kIHJldHVybmVkXG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgLy8gd2hlbiAnZmluaXNoJyBpcyBlbWl0dGVkXG4gIHRoaXMuZmluaXNoZWQgPSBmYWxzZTtcblxuICAvLyBoYXMgaXQgYmVlbiBkZXN0cm95ZWRcbiAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvLyBzaG91bGQgd2UgZGVjb2RlIHN0cmluZ3MgaW50byBidWZmZXJzIGJlZm9yZSBwYXNzaW5nIHRvIF93cml0ZT9cbiAgLy8gdGhpcyBpcyBoZXJlIHNvIHRoYXQgc29tZSBub2RlLWNvcmUgc3RyZWFtcyBjYW4gb3B0aW1pemUgc3RyaW5nXG4gIC8vIGhhbmRsaW5nIGF0IGEgbG93ZXIgbGV2ZWwuXG4gIHZhciBub0RlY29kZSA9IG9wdGlvbnMuZGVjb2RlU3RyaW5ncyA9PT0gZmFsc2U7XG4gIHRoaXMuZGVjb2RlU3RyaW5ncyA9ICFub0RlY29kZTtcblxuICAvLyBDcnlwdG8gaXMga2luZCBvZiBvbGQgYW5kIGNydXN0eS4gIEhpc3RvcmljYWxseSwgaXRzIGRlZmF1bHQgc3RyaW5nXG4gIC8vIGVuY29kaW5nIGlzICdiaW5hcnknIHNvIHdlIGhhdmUgdG8gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZS5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIGluIHRoZSB1bml2ZXJzZSB1c2VzICd1dGY4JywgdGhvdWdoLlxuICB0aGlzLmRlZmF1bHRFbmNvZGluZyA9IG9wdGlvbnMuZGVmYXVsdEVuY29kaW5nIHx8ICd1dGY4JztcblxuICAvLyBub3QgYW4gYWN0dWFsIGJ1ZmZlciB3ZSBrZWVwIHRyYWNrIG9mLCBidXQgYSBtZWFzdXJlbWVudFxuICAvLyBvZiBob3cgbXVjaCB3ZSdyZSB3YWl0aW5nIHRvIGdldCBwdXNoZWQgdG8gc29tZSB1bmRlcmx5aW5nXG4gIC8vIHNvY2tldCBvciBmaWxlLlxuICB0aGlzLmxlbmd0aCA9IDA7XG5cbiAgLy8gYSBmbGFnIHRvIHNlZSB3aGVuIHdlJ3JlIGluIHRoZSBtaWRkbGUgb2YgYSB3cml0ZS5cbiAgdGhpcy53cml0aW5nID0gZmFsc2U7XG5cbiAgLy8gd2hlbiB0cnVlIGFsbCB3cml0ZXMgd2lsbCBiZSBidWZmZXJlZCB1bnRpbCAudW5jb3JrKCkgY2FsbFxuICB0aGlzLmNvcmtlZCA9IDA7XG5cbiAgLy8gYSBmbGFnIHRvIGJlIGFibGUgdG8gdGVsbCBpZiB0aGUgb253cml0ZSBjYiBpcyBjYWxsZWQgaW1tZWRpYXRlbHksXG4gIC8vIG9yIG9uIGEgbGF0ZXIgdGljay4gIFdlIHNldCB0aGlzIHRvIHRydWUgYXQgZmlyc3QsIGJlY2F1c2UgYW55XG4gIC8vIGFjdGlvbnMgdGhhdCBzaG91bGRuJ3QgaGFwcGVuIHVudGlsIFwibGF0ZXJcIiBzaG91bGQgZ2VuZXJhbGx5IGFsc29cbiAgLy8gbm90IGhhcHBlbiBiZWZvcmUgdGhlIGZpcnN0IHdyaXRlIGNhbGwuXG4gIHRoaXMuc3luYyA9IHRydWU7XG5cbiAgLy8gYSBmbGFnIHRvIGtub3cgaWYgd2UncmUgcHJvY2Vzc2luZyBwcmV2aW91c2x5IGJ1ZmZlcmVkIGl0ZW1zLCB3aGljaFxuICAvLyBtYXkgY2FsbCB0aGUgX3dyaXRlKCkgY2FsbGJhY2sgaW4gdGhlIHNhbWUgdGljaywgc28gdGhhdCB3ZSBkb24ndFxuICAvLyBlbmQgdXAgaW4gYW4gb3ZlcmxhcHBlZCBvbndyaXRlIHNpdHVhdGlvbi5cbiAgdGhpcy5idWZmZXJQcm9jZXNzaW5nID0gZmFsc2U7XG5cbiAgLy8gdGhlIGNhbGxiYWNrIHRoYXQncyBwYXNzZWQgdG8gX3dyaXRlKGNodW5rLGNiKVxuICB0aGlzLm9ud3JpdGUgPSBmdW5jdGlvbiAoZXIpIHtcbiAgICBvbndyaXRlKHN0cmVhbSwgZXIpO1xuICB9O1xuXG4gIC8vIHRoZSBjYWxsYmFjayB0aGF0IHRoZSB1c2VyIHN1cHBsaWVzIHRvIHdyaXRlKGNodW5rLGVuY29kaW5nLGNiKVxuICB0aGlzLndyaXRlY2IgPSBudWxsO1xuXG4gIC8vIHRoZSBhbW91bnQgdGhhdCBpcyBiZWluZyB3cml0dGVuIHdoZW4gX3dyaXRlIGlzIGNhbGxlZC5cbiAgdGhpcy53cml0ZWxlbiA9IDA7XG4gIHRoaXMuYnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcbiAgdGhpcy5sYXN0QnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcblxuICAvLyBudW1iZXIgb2YgcGVuZGluZyB1c2VyLXN1cHBsaWVkIHdyaXRlIGNhbGxiYWNrc1xuICAvLyB0aGlzIG11c3QgYmUgMCBiZWZvcmUgJ2ZpbmlzaCcgY2FuIGJlIGVtaXR0ZWRcbiAgdGhpcy5wZW5kaW5nY2IgPSAwO1xuXG4gIC8vIGVtaXQgcHJlZmluaXNoIGlmIHRoZSBvbmx5IHRoaW5nIHdlJ3JlIHdhaXRpbmcgZm9yIGlzIF93cml0ZSBjYnNcbiAgLy8gVGhpcyBpcyByZWxldmFudCBmb3Igc3luY2hyb25vdXMgVHJhbnNmb3JtIHN0cmVhbXNcbiAgdGhpcy5wcmVmaW5pc2hlZCA9IGZhbHNlO1xuXG4gIC8vIFRydWUgaWYgdGhlIGVycm9yIHdhcyBhbHJlYWR5IGVtaXR0ZWQgYW5kIHNob3VsZCBub3QgYmUgdGhyb3duIGFnYWluXG4gIHRoaXMuZXJyb3JFbWl0dGVkID0gZmFsc2U7XG5cbiAgLy8gU2hvdWxkIGNsb3NlIGJlIGVtaXR0ZWQgb24gZGVzdHJveS4gRGVmYXVsdHMgdG8gdHJ1ZS5cbiAgdGhpcy5lbWl0Q2xvc2UgPSBvcHRpb25zLmVtaXRDbG9zZSAhPT0gZmFsc2U7XG5cbiAgLy8gU2hvdWxkIC5kZXN0cm95KCkgYmUgY2FsbGVkIGFmdGVyICdmaW5pc2gnIChhbmQgcG90ZW50aWFsbHkgJ2VuZCcpXG4gIHRoaXMuYXV0b0Rlc3Ryb3kgPSAhIW9wdGlvbnMuYXV0b0Rlc3Ryb3k7XG5cbiAgLy8gY291bnQgYnVmZmVyZWQgcmVxdWVzdHNcbiAgdGhpcy5idWZmZXJlZFJlcXVlc3RDb3VudCA9IDA7XG5cbiAgLy8gYWxsb2NhdGUgdGhlIGZpcnN0IENvcmtlZFJlcXVlc3QsIHRoZXJlIGlzIGFsd2F5c1xuICAvLyBvbmUgYWxsb2NhdGVkIGFuZCBmcmVlIHRvIHVzZSwgYW5kIHdlIG1haW50YWluIGF0IG1vc3QgdHdvXG4gIHRoaXMuY29ya2VkUmVxdWVzdHNGcmVlID0gbmV3IENvcmtlZFJlcXVlc3QodGhpcyk7XG59XG5Xcml0YWJsZVN0YXRlLnByb3RvdHlwZS5nZXRCdWZmZXIgPSBmdW5jdGlvbiBnZXRCdWZmZXIoKSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5idWZmZXJlZFJlcXVlc3Q7XG4gIHZhciBvdXQgPSBbXTtcbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBvdXQucHVzaChjdXJyZW50KTtcbiAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuKGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGFibGVTdGF0ZS5wcm90b3R5cGUsICdidWZmZXInLCB7XG4gICAgICBnZXQ6IGludGVybmFsVXRpbC5kZXByZWNhdGUoZnVuY3Rpb24gd3JpdGFibGVTdGF0ZUJ1ZmZlckdldHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QnVmZmVyKCk7XG4gICAgICB9LCAnX3dyaXRhYmxlU3RhdGUuYnVmZmVyIGlzIGRlcHJlY2F0ZWQuIFVzZSBfd3JpdGFibGVTdGF0ZS5nZXRCdWZmZXIgJyArICdpbnN0ZWFkLicsICdERVAwMDAzJylcbiAgICB9KTtcbiAgfSBjYXRjaCAoXykge31cbn0pKCk7XG5cbi8vIFRlc3QgX3dyaXRhYmxlU3RhdGUgZm9yIGluaGVyaXRhbmNlIHRvIGFjY291bnQgZm9yIER1cGxleCBzdHJlYW1zLFxuLy8gd2hvc2UgcHJvdG90eXBlIGNoYWluIG9ubHkgcG9pbnRzIHRvIFJlYWRhYmxlLlxudmFyIHJlYWxIYXNJbnN0YW5jZTtcbmlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5oYXNJbnN0YW5jZSAmJiB0eXBlb2YgRnVuY3Rpb24ucHJvdG90eXBlW1N5bWJvbC5oYXNJbnN0YW5jZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgcmVhbEhhc0luc3RhbmNlID0gRnVuY3Rpb24ucHJvdG90eXBlW1N5bWJvbC5oYXNJbnN0YW5jZV07XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZSwgU3ltYm9sLmhhc0luc3RhbmNlLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKG9iamVjdCkge1xuICAgICAgaWYgKHJlYWxIYXNJbnN0YW5jZS5jYWxsKHRoaXMsIG9iamVjdCkpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKHRoaXMgIT09IFdyaXRhYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgICByZXR1cm4gb2JqZWN0ICYmIG9iamVjdC5fd3JpdGFibGVTdGF0ZSBpbnN0YW5jZW9mIFdyaXRhYmxlU3RhdGU7XG4gICAgfVxuICB9KTtcbn0gZWxzZSB7XG4gIHJlYWxIYXNJbnN0YW5jZSA9IGZ1bmN0aW9uIHJlYWxIYXNJbnN0YW5jZShvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgdGhpcztcbiAgfTtcbn1cbmZ1bmN0aW9uIFdyaXRhYmxlKG9wdGlvbnMpIHtcbiAgRHVwbGV4ID0gRHVwbGV4IHx8IHJlcXVpcmUoJy4vX3N0cmVhbV9kdXBsZXgnKTtcblxuICAvLyBXcml0YWJsZSBjdG9yIGlzIGFwcGxpZWQgdG8gRHVwbGV4ZXMsIHRvby5cbiAgLy8gYHJlYWxIYXNJbnN0YW5jZWAgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgdXNpbmcgcGxhaW4gYGluc3RhbmNlb2ZgXG4gIC8vIHdvdWxkIHJldHVybiBmYWxzZSwgYXMgbm8gYF93cml0YWJsZVN0YXRlYCBwcm9wZXJ0eSBpcyBhdHRhY2hlZC5cblxuICAvLyBUcnlpbmcgdG8gdXNlIHRoZSBjdXN0b20gYGluc3RhbmNlb2ZgIGZvciBXcml0YWJsZSBoZXJlIHdpbGwgYWxzbyBicmVhayB0aGVcbiAgLy8gTm9kZS5qcyBMYXp5VHJhbnNmb3JtIGltcGxlbWVudGF0aW9uLCB3aGljaCBoYXMgYSBub24tdHJpdmlhbCBnZXR0ZXIgZm9yXG4gIC8vIGBfd3JpdGFibGVTdGF0ZWAgdGhhdCB3b3VsZCBsZWFkIHRvIGluZmluaXRlIHJlY3Vyc2lvbi5cblxuICAvLyBDaGVja2luZyBmb3IgYSBTdHJlYW0uRHVwbGV4IGluc3RhbmNlIGlzIGZhc3RlciBoZXJlIGluc3RlYWQgb2YgaW5zaWRlXG4gIC8vIHRoZSBXcml0YWJsZVN0YXRlIGNvbnN0cnVjdG9yLCBhdCBsZWFzdCB3aXRoIFY4IDYuNVxuICB2YXIgaXNEdXBsZXggPSB0aGlzIGluc3RhbmNlb2YgRHVwbGV4O1xuICBpZiAoIWlzRHVwbGV4ICYmICFyZWFsSGFzSW5zdGFuY2UuY2FsbChXcml0YWJsZSwgdGhpcykpIHJldHVybiBuZXcgV3JpdGFibGUob3B0aW9ucyk7XG4gIHRoaXMuX3dyaXRhYmxlU3RhdGUgPSBuZXcgV3JpdGFibGVTdGF0ZShvcHRpb25zLCB0aGlzLCBpc0R1cGxleCk7XG5cbiAgLy8gbGVnYWN5LlxuICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMud3JpdGUgPT09ICdmdW5jdGlvbicpIHRoaXMuX3dyaXRlID0gb3B0aW9ucy53cml0ZTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMud3JpdGV2ID09PSAnZnVuY3Rpb24nKSB0aGlzLl93cml0ZXYgPSBvcHRpb25zLndyaXRldjtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fZGVzdHJveSA9IG9wdGlvbnMuZGVzdHJveTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZmluYWwgPT09ICdmdW5jdGlvbicpIHRoaXMuX2ZpbmFsID0gb3B0aW9ucy5maW5hbDtcbiAgfVxuICBTdHJlYW0uY2FsbCh0aGlzKTtcbn1cblxuLy8gT3RoZXJ3aXNlIHBlb3BsZSBjYW4gcGlwZSBXcml0YWJsZSBzdHJlYW1zLCB3aGljaCBpcyBqdXN0IHdyb25nLlxuV3JpdGFibGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoKSB7XG4gIGVycm9yT3JEZXN0cm95KHRoaXMsIG5ldyBFUlJfU1RSRUFNX0NBTk5PVF9QSVBFKCkpO1xufTtcbmZ1bmN0aW9uIHdyaXRlQWZ0ZXJFbmQoc3RyZWFtLCBjYikge1xuICB2YXIgZXIgPSBuZXcgRVJSX1NUUkVBTV9XUklURV9BRlRFUl9FTkQoKTtcbiAgLy8gVE9ETzogZGVmZXIgZXJyb3IgZXZlbnRzIGNvbnNpc3RlbnRseSBldmVyeXdoZXJlLCBub3QganVzdCB0aGUgY2JcbiAgZXJyb3JPckRlc3Ryb3koc3RyZWFtLCBlcik7XG4gIHByb2Nlc3MubmV4dFRpY2soY2IsIGVyKTtcbn1cblxuLy8gQ2hlY2tzIHRoYXQgYSB1c2VyLXN1cHBsaWVkIGNodW5rIGlzIHZhbGlkLCBlc3BlY2lhbGx5IGZvciB0aGUgcGFydGljdWxhclxuLy8gbW9kZSB0aGUgc3RyZWFtIGlzIGluLiBDdXJyZW50bHkgdGhpcyBtZWFucyB0aGF0IGBudWxsYCBpcyBuZXZlciBhY2NlcHRlZFxuLy8gYW5kIHVuZGVmaW5lZC9ub24tc3RyaW5nIHZhbHVlcyBhcmUgb25seSBhbGxvd2VkIGluIG9iamVjdCBtb2RlLlxuZnVuY3Rpb24gdmFsaWRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgY2IpIHtcbiAgdmFyIGVyO1xuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcbiAgICBlciA9IG5ldyBFUlJfU1RSRUFNX05VTExfVkFMVUVTKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGNodW5rICE9PSAnc3RyaW5nJyAmJiAhc3RhdGUub2JqZWN0TW9kZSkge1xuICAgIGVyID0gbmV3IEVSUl9JTlZBTElEX0FSR19UWVBFKCdjaHVuaycsIFsnc3RyaW5nJywgJ0J1ZmZlciddLCBjaHVuayk7XG4gIH1cbiAgaWYgKGVyKSB7XG4gICAgZXJyb3JPckRlc3Ryb3koc3RyZWFtLCBlcik7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhjYiwgZXIpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbldyaXRhYmxlLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG4gIHZhciByZXQgPSBmYWxzZTtcbiAgdmFyIGlzQnVmID0gIXN0YXRlLm9iamVjdE1vZGUgJiYgX2lzVWludDhBcnJheShjaHVuayk7XG4gIGlmIChpc0J1ZiAmJiAhQnVmZmVyLmlzQnVmZmVyKGNodW5rKSkge1xuICAgIGNodW5rID0gX3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuayk7XG4gIH1cbiAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9XG4gIGlmIChpc0J1ZikgZW5jb2RpbmcgPSAnYnVmZmVyJztlbHNlIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gc3RhdGUuZGVmYXVsdEVuY29kaW5nO1xuICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSBjYiA9IG5vcDtcbiAgaWYgKHN0YXRlLmVuZGluZykgd3JpdGVBZnRlckVuZCh0aGlzLCBjYik7ZWxzZSBpZiAoaXNCdWYgfHwgdmFsaWRDaHVuayh0aGlzLCBzdGF0ZSwgY2h1bmssIGNiKSkge1xuICAgIHN0YXRlLnBlbmRpbmdjYisrO1xuICAgIHJldCA9IHdyaXRlT3JCdWZmZXIodGhpcywgc3RhdGUsIGlzQnVmLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcbldyaXRhYmxlLnByb3RvdHlwZS5jb3JrID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl93cml0YWJsZVN0YXRlLmNvcmtlZCsrO1xufTtcbldyaXRhYmxlLnByb3RvdHlwZS51bmNvcmsgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG4gIGlmIChzdGF0ZS5jb3JrZWQpIHtcbiAgICBzdGF0ZS5jb3JrZWQtLTtcbiAgICBpZiAoIXN0YXRlLndyaXRpbmcgJiYgIXN0YXRlLmNvcmtlZCAmJiAhc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyAmJiBzdGF0ZS5idWZmZXJlZFJlcXVlc3QpIGNsZWFyQnVmZmVyKHRoaXMsIHN0YXRlKTtcbiAgfVxufTtcbldyaXRhYmxlLnByb3RvdHlwZS5zZXREZWZhdWx0RW5jb2RpbmcgPSBmdW5jdGlvbiBzZXREZWZhdWx0RW5jb2RpbmcoZW5jb2RpbmcpIHtcbiAgLy8gbm9kZTo6UGFyc2VFbmNvZGluZygpIHJlcXVpcmVzIGxvd2VyIGNhc2UuXG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnKSBlbmNvZGluZyA9IGVuY29kaW5nLnRvTG93ZXJDYXNlKCk7XG4gIGlmICghKFsnaGV4JywgJ3V0ZjgnLCAndXRmLTgnLCAnYXNjaWknLCAnYmluYXJ5JywgJ2Jhc2U2NCcsICd1Y3MyJywgJ3Vjcy0yJywgJ3V0ZjE2bGUnLCAndXRmLTE2bGUnLCAncmF3J10uaW5kZXhPZigoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKSkgPiAtMSkpIHRocm93IG5ldyBFUlJfVU5LTk9XTl9FTkNPRElORyhlbmNvZGluZyk7XG4gIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVmYXVsdEVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIHJldHVybiB0aGlzO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZS5wcm90b3R5cGUsICd3cml0YWJsZUJ1ZmZlcicsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUgJiYgdGhpcy5fd3JpdGFibGVTdGF0ZS5nZXRCdWZmZXIoKTtcbiAgfVxufSk7XG5mdW5jdGlvbiBkZWNvZGVDaHVuayhzdGF0ZSwgY2h1bmssIGVuY29kaW5nKSB7XG4gIGlmICghc3RhdGUub2JqZWN0TW9kZSAmJiBzdGF0ZS5kZWNvZGVTdHJpbmdzICE9PSBmYWxzZSAmJiB0eXBlb2YgY2h1bmsgPT09ICdzdHJpbmcnKSB7XG4gICAgY2h1bmsgPSBCdWZmZXIuZnJvbShjaHVuaywgZW5jb2RpbmcpO1xuICB9XG4gIHJldHVybiBjaHVuaztcbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZS5wcm90b3R5cGUsICd3cml0YWJsZUhpZ2hXYXRlck1hcmsnLCB7XG4gIC8vIG1ha2luZyBpdCBleHBsaWNpdCB0aGlzIHByb3BlcnR5IGlzIG5vdCBlbnVtZXJhYmxlXG4gIC8vIGJlY2F1c2Ugb3RoZXJ3aXNlIHNvbWUgcHJvdG90eXBlIG1hbmlwdWxhdGlvbiBpblxuICAvLyB1c2VybGFuZCB3aWxsIGZhaWxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl93cml0YWJsZVN0YXRlLmhpZ2hXYXRlck1hcms7XG4gIH1cbn0pO1xuXG4vLyBpZiB3ZSdyZSBhbHJlYWR5IHdyaXRpbmcgc29tZXRoaW5nLCB0aGVuIGp1c3QgcHV0IHRoaXNcbi8vIGluIHRoZSBxdWV1ZSwgYW5kIHdhaXQgb3VyIHR1cm4uICBPdGhlcndpc2UsIGNhbGwgX3dyaXRlXG4vLyBJZiB3ZSByZXR1cm4gZmFsc2UsIHRoZW4gd2UgbmVlZCBhIGRyYWluIGV2ZW50LCBzbyBzZXQgdGhhdCBmbGFnLlxuZnVuY3Rpb24gd3JpdGVPckJ1ZmZlcihzdHJlYW0sIHN0YXRlLCBpc0J1ZiwgY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBpZiAoIWlzQnVmKSB7XG4gICAgdmFyIG5ld0NodW5rID0gZGVjb2RlQ2h1bmsoc3RhdGUsIGNodW5rLCBlbmNvZGluZyk7XG4gICAgaWYgKGNodW5rICE9PSBuZXdDaHVuaykge1xuICAgICAgaXNCdWYgPSB0cnVlO1xuICAgICAgZW5jb2RpbmcgPSAnYnVmZmVyJztcbiAgICAgIGNodW5rID0gbmV3Q2h1bms7XG4gICAgfVxuICB9XG4gIHZhciBsZW4gPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgc3RhdGUubGVuZ3RoICs9IGxlbjtcbiAgdmFyIHJldCA9IHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcms7XG4gIC8vIHdlIG11c3QgZW5zdXJlIHRoYXQgcHJldmlvdXMgbmVlZERyYWluIHdpbGwgbm90IGJlIHJlc2V0IHRvIGZhbHNlLlxuICBpZiAoIXJldCkgc3RhdGUubmVlZERyYWluID0gdHJ1ZTtcbiAgaWYgKHN0YXRlLndyaXRpbmcgfHwgc3RhdGUuY29ya2VkKSB7XG4gICAgdmFyIGxhc3QgPSBzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0O1xuICAgIHN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3QgPSB7XG4gICAgICBjaHVuazogY2h1bmssXG4gICAgICBlbmNvZGluZzogZW5jb2RpbmcsXG4gICAgICBpc0J1ZjogaXNCdWYsXG4gICAgICBjYWxsYmFjazogY2IsXG4gICAgICBuZXh0OiBudWxsXG4gICAgfTtcbiAgICBpZiAobGFzdCkge1xuICAgICAgbGFzdC5uZXh0ID0gc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0ID0gc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdDtcbiAgICB9XG4gICAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQgKz0gMTtcbiAgfSBlbHNlIHtcbiAgICBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIGZhbHNlLCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5mdW5jdGlvbiBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIHdyaXRldiwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHN0YXRlLndyaXRlbGVuID0gbGVuO1xuICBzdGF0ZS53cml0ZWNiID0gY2I7XG4gIHN0YXRlLndyaXRpbmcgPSB0cnVlO1xuICBzdGF0ZS5zeW5jID0gdHJ1ZTtcbiAgaWYgKHN0YXRlLmRlc3Ryb3llZCkgc3RhdGUub253cml0ZShuZXcgRVJSX1NUUkVBTV9ERVNUUk9ZRUQoJ3dyaXRlJykpO2Vsc2UgaWYgKHdyaXRldikgc3RyZWFtLl93cml0ZXYoY2h1bmssIHN0YXRlLm9ud3JpdGUpO2Vsc2Ugc3RyZWFtLl93cml0ZShjaHVuaywgZW5jb2RpbmcsIHN0YXRlLm9ud3JpdGUpO1xuICBzdGF0ZS5zeW5jID0gZmFsc2U7XG59XG5mdW5jdGlvbiBvbndyaXRlRXJyb3Ioc3RyZWFtLCBzdGF0ZSwgc3luYywgZXIsIGNiKSB7XG4gIC0tc3RhdGUucGVuZGluZ2NiO1xuICBpZiAoc3luYykge1xuICAgIC8vIGRlZmVyIHRoZSBjYWxsYmFjayBpZiB3ZSBhcmUgYmVpbmcgY2FsbGVkIHN5bmNocm9ub3VzbHlcbiAgICAvLyB0byBhdm9pZCBwaWxpbmcgdXAgdGhpbmdzIG9uIHRoZSBzdGFja1xuICAgIHByb2Nlc3MubmV4dFRpY2soY2IsIGVyKTtcbiAgICAvLyB0aGlzIGNhbiBlbWl0IGZpbmlzaCwgYW5kIGl0IHdpbGwgYWx3YXlzIGhhcHBlblxuICAgIC8vIGFmdGVyIGVycm9yXG4gICAgcHJvY2Vzcy5uZXh0VGljayhmaW5pc2hNYXliZSwgc3RyZWFtLCBzdGF0ZSk7XG4gICAgc3RyZWFtLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCA9IHRydWU7XG4gICAgZXJyb3JPckRlc3Ryb3koc3RyZWFtLCBlcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gdGhlIGNhbGxlciBleHBlY3QgdGhpcyB0byBoYXBwZW4gYmVmb3JlIGlmXG4gICAgLy8gaXQgaXMgYXN5bmNcbiAgICBjYihlcik7XG4gICAgc3RyZWFtLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCA9IHRydWU7XG4gICAgZXJyb3JPckRlc3Ryb3koc3RyZWFtLCBlcik7XG4gICAgLy8gdGhpcyBjYW4gZW1pdCBmaW5pc2gsIGJ1dCBmaW5pc2ggbXVzdFxuICAgIC8vIGFsd2F5cyBmb2xsb3cgZXJyb3JcbiAgICBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKTtcbiAgfVxufVxuZnVuY3Rpb24gb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKSB7XG4gIHN0YXRlLndyaXRpbmcgPSBmYWxzZTtcbiAgc3RhdGUud3JpdGVjYiA9IG51bGw7XG4gIHN0YXRlLmxlbmd0aCAtPSBzdGF0ZS53cml0ZWxlbjtcbiAgc3RhdGUud3JpdGVsZW4gPSAwO1xufVxuZnVuY3Rpb24gb253cml0ZShzdHJlYW0sIGVyKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHN5bmMgPSBzdGF0ZS5zeW5jO1xuICB2YXIgY2IgPSBzdGF0ZS53cml0ZWNiO1xuICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgRVJSX01VTFRJUExFX0NBTExCQUNLKCk7XG4gIG9ud3JpdGVTdGF0ZVVwZGF0ZShzdGF0ZSk7XG4gIGlmIChlcikgb253cml0ZUVycm9yKHN0cmVhbSwgc3RhdGUsIHN5bmMsIGVyLCBjYik7ZWxzZSB7XG4gICAgLy8gQ2hlY2sgaWYgd2UncmUgYWN0dWFsbHkgcmVhZHkgdG8gZmluaXNoLCBidXQgZG9uJ3QgZW1pdCB5ZXRcbiAgICB2YXIgZmluaXNoZWQgPSBuZWVkRmluaXNoKHN0YXRlKSB8fCBzdHJlYW0uZGVzdHJveWVkO1xuICAgIGlmICghZmluaXNoZWQgJiYgIXN0YXRlLmNvcmtlZCAmJiAhc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyAmJiBzdGF0ZS5idWZmZXJlZFJlcXVlc3QpIHtcbiAgICAgIGNsZWFyQnVmZmVyKHN0cmVhbSwgc3RhdGUpO1xuICAgIH1cbiAgICBpZiAoc3luYykge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhhZnRlcldyaXRlLCBzdHJlYW0sIHN0YXRlLCBmaW5pc2hlZCwgY2IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZnRlcldyaXRlKHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYik7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBhZnRlcldyaXRlKHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYikge1xuICBpZiAoIWZpbmlzaGVkKSBvbndyaXRlRHJhaW4oc3RyZWFtLCBzdGF0ZSk7XG4gIHN0YXRlLnBlbmRpbmdjYi0tO1xuICBjYigpO1xuICBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKTtcbn1cblxuLy8gTXVzdCBmb3JjZSBjYWxsYmFjayB0byBiZSBjYWxsZWQgb24gbmV4dFRpY2ssIHNvIHRoYXQgd2UgZG9uJ3Rcbi8vIGVtaXQgJ2RyYWluJyBiZWZvcmUgdGhlIHdyaXRlKCkgY29uc3VtZXIgZ2V0cyB0aGUgJ2ZhbHNlJyByZXR1cm5cbi8vIHZhbHVlLCBhbmQgaGFzIGEgY2hhbmNlIHRvIGF0dGFjaCBhICdkcmFpbicgbGlzdGVuZXIuXG5mdW5jdGlvbiBvbndyaXRlRHJhaW4oc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLm5lZWREcmFpbikge1xuICAgIHN0YXRlLm5lZWREcmFpbiA9IGZhbHNlO1xuICAgIHN0cmVhbS5lbWl0KCdkcmFpbicpO1xuICB9XG59XG5cbi8vIGlmIHRoZXJlJ3Mgc29tZXRoaW5nIGluIHRoZSBidWZmZXIgd2FpdGluZywgdGhlbiBwcm9jZXNzIGl0XG5mdW5jdGlvbiBjbGVhckJ1ZmZlcihzdHJlYW0sIHN0YXRlKSB7XG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSB0cnVlO1xuICB2YXIgZW50cnkgPSBzdGF0ZS5idWZmZXJlZFJlcXVlc3Q7XG4gIGlmIChzdHJlYW0uX3dyaXRldiAmJiBlbnRyeSAmJiBlbnRyeS5uZXh0KSB7XG4gICAgLy8gRmFzdCBjYXNlLCB3cml0ZSBldmVyeXRoaW5nIHVzaW5nIF93cml0ZXYoKVxuICAgIHZhciBsID0gc3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQ7XG4gICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheShsKTtcbiAgICB2YXIgaG9sZGVyID0gc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlO1xuICAgIGhvbGRlci5lbnRyeSA9IGVudHJ5O1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgdmFyIGFsbEJ1ZmZlcnMgPSB0cnVlO1xuICAgIHdoaWxlIChlbnRyeSkge1xuICAgICAgYnVmZmVyW2NvdW50XSA9IGVudHJ5O1xuICAgICAgaWYgKCFlbnRyeS5pc0J1ZikgYWxsQnVmZmVycyA9IGZhbHNlO1xuICAgICAgZW50cnkgPSBlbnRyeS5uZXh0O1xuICAgICAgY291bnQgKz0gMTtcbiAgICB9XG4gICAgYnVmZmVyLmFsbEJ1ZmZlcnMgPSBhbGxCdWZmZXJzO1xuICAgIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgdHJ1ZSwgc3RhdGUubGVuZ3RoLCBidWZmZXIsICcnLCBob2xkZXIuZmluaXNoKTtcblxuICAgIC8vIGRvV3JpdGUgaXMgYWxtb3N0IGFsd2F5cyBhc3luYywgZGVmZXIgdGhlc2UgdG8gc2F2ZSBhIGJpdCBvZiB0aW1lXG4gICAgLy8gYXMgdGhlIGhvdCBwYXRoIGVuZHMgd2l0aCBkb1dyaXRlXG4gICAgc3RhdGUucGVuZGluZ2NiKys7XG4gICAgc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdCA9IG51bGw7XG4gICAgaWYgKGhvbGRlci5uZXh0KSB7XG4gICAgICBzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWUgPSBob2xkZXIubmV4dDtcbiAgICAgIGhvbGRlci5uZXh0ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlID0gbmV3IENvcmtlZFJlcXVlc3Qoc3RhdGUpO1xuICAgIH1cbiAgICBzdGF0ZS5idWZmZXJlZFJlcXVlc3RDb3VudCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gU2xvdyBjYXNlLCB3cml0ZSBjaHVua3Mgb25lLWJ5LW9uZVxuICAgIHdoaWxlIChlbnRyeSkge1xuICAgICAgdmFyIGNodW5rID0gZW50cnkuY2h1bms7XG4gICAgICB2YXIgZW5jb2RpbmcgPSBlbnRyeS5lbmNvZGluZztcbiAgICAgIHZhciBjYiA9IGVudHJ5LmNhbGxiYWNrO1xuICAgICAgdmFyIGxlbiA9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuICAgICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCBmYWxzZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcbiAgICAgIGVudHJ5ID0gZW50cnkubmV4dDtcbiAgICAgIHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdENvdW50LS07XG4gICAgICAvLyBpZiB3ZSBkaWRuJ3QgY2FsbCB0aGUgb253cml0ZSBpbW1lZGlhdGVseSwgdGhlblxuICAgICAgLy8gaXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHdhaXQgdW50aWwgaXQgZG9lcy5cbiAgICAgIC8vIGFsc28sIHRoYXQgbWVhbnMgdGhhdCB0aGUgY2h1bmsgYW5kIGNiIGFyZSBjdXJyZW50bHlcbiAgICAgIC8vIGJlaW5nIHByb2Nlc3NlZCwgc28gbW92ZSB0aGUgYnVmZmVyIGNvdW50ZXIgcGFzdCB0aGVtLlxuICAgICAgaWYgKHN0YXRlLndyaXRpbmcpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCkgc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdCA9IG51bGw7XG4gIH1cbiAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0ID0gZW50cnk7XG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSBmYWxzZTtcbn1cbldyaXRhYmxlLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihuZXcgRVJSX01FVEhPRF9OT1RfSU1QTEVNRU5URUQoJ193cml0ZSgpJykpO1xufTtcbldyaXRhYmxlLnByb3RvdHlwZS5fd3JpdGV2ID0gbnVsbDtcbldyaXRhYmxlLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xuICBpZiAodHlwZW9mIGNodW5rID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBjaHVuaztcbiAgICBjaHVuayA9IG51bGw7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9XG4gIGlmIChjaHVuayAhPT0gbnVsbCAmJiBjaHVuayAhPT0gdW5kZWZpbmVkKSB0aGlzLndyaXRlKGNodW5rLCBlbmNvZGluZyk7XG5cbiAgLy8gLmVuZCgpIGZ1bGx5IHVuY29ya3NcbiAgaWYgKHN0YXRlLmNvcmtlZCkge1xuICAgIHN0YXRlLmNvcmtlZCA9IDE7XG4gICAgdGhpcy51bmNvcmsoKTtcbiAgfVxuXG4gIC8vIGlnbm9yZSB1bm5lY2Vzc2FyeSBlbmQoKSBjYWxscy5cbiAgaWYgKCFzdGF0ZS5lbmRpbmcpIGVuZFdyaXRhYmxlKHRoaXMsIHN0YXRlLCBjYik7XG4gIHJldHVybiB0aGlzO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZS5wcm90b3R5cGUsICd3cml0YWJsZUxlbmd0aCcsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUubGVuZ3RoO1xuICB9XG59KTtcbmZ1bmN0aW9uIG5lZWRGaW5pc2goc3RhdGUpIHtcbiAgcmV0dXJuIHN0YXRlLmVuZGluZyAmJiBzdGF0ZS5sZW5ndGggPT09IDAgJiYgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0ID09PSBudWxsICYmICFzdGF0ZS5maW5pc2hlZCAmJiAhc3RhdGUud3JpdGluZztcbn1cbmZ1bmN0aW9uIGNhbGxGaW5hbChzdHJlYW0sIHN0YXRlKSB7XG4gIHN0cmVhbS5fZmluYWwoZnVuY3Rpb24gKGVycikge1xuICAgIHN0YXRlLnBlbmRpbmdjYi0tO1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGVycm9yT3JEZXN0cm95KHN0cmVhbSwgZXJyKTtcbiAgICB9XG4gICAgc3RhdGUucHJlZmluaXNoZWQgPSB0cnVlO1xuICAgIHN0cmVhbS5lbWl0KCdwcmVmaW5pc2gnKTtcbiAgICBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBwcmVmaW5pc2goc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoIXN0YXRlLnByZWZpbmlzaGVkICYmICFzdGF0ZS5maW5hbENhbGxlZCkge1xuICAgIGlmICh0eXBlb2Ygc3RyZWFtLl9maW5hbCA9PT0gJ2Z1bmN0aW9uJyAmJiAhc3RhdGUuZGVzdHJveWVkKSB7XG4gICAgICBzdGF0ZS5wZW5kaW5nY2IrKztcbiAgICAgIHN0YXRlLmZpbmFsQ2FsbGVkID0gdHJ1ZTtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY2FsbEZpbmFsLCBzdHJlYW0sIHN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucHJlZmluaXNoZWQgPSB0cnVlO1xuICAgICAgc3RyZWFtLmVtaXQoJ3ByZWZpbmlzaCcpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSkge1xuICB2YXIgbmVlZCA9IG5lZWRGaW5pc2goc3RhdGUpO1xuICBpZiAobmVlZCkge1xuICAgIHByZWZpbmlzaChzdHJlYW0sIHN0YXRlKTtcbiAgICBpZiAoc3RhdGUucGVuZGluZ2NiID09PSAwKSB7XG4gICAgICBzdGF0ZS5maW5pc2hlZCA9IHRydWU7XG4gICAgICBzdHJlYW0uZW1pdCgnZmluaXNoJyk7XG4gICAgICBpZiAoc3RhdGUuYXV0b0Rlc3Ryb3kpIHtcbiAgICAgICAgLy8gSW4gY2FzZSBvZiBkdXBsZXggc3RyZWFtcyB3ZSBuZWVkIGEgd2F5IHRvIGRldGVjdFxuICAgICAgICAvLyBpZiB0aGUgcmVhZGFibGUgc2lkZSBpcyByZWFkeSBmb3IgYXV0b0Rlc3Ryb3kgYXMgd2VsbFxuICAgICAgICB2YXIgclN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICAgICAgICBpZiAoIXJTdGF0ZSB8fCByU3RhdGUuYXV0b0Rlc3Ryb3kgJiYgclN0YXRlLmVuZEVtaXR0ZWQpIHtcbiAgICAgICAgICBzdHJlYW0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBuZWVkO1xufVxuZnVuY3Rpb24gZW5kV3JpdGFibGUoc3RyZWFtLCBzdGF0ZSwgY2IpIHtcbiAgc3RhdGUuZW5kaW5nID0gdHJ1ZTtcbiAgZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSk7XG4gIGlmIChjYikge1xuICAgIGlmIChzdGF0ZS5maW5pc2hlZCkgcHJvY2Vzcy5uZXh0VGljayhjYik7ZWxzZSBzdHJlYW0ub25jZSgnZmluaXNoJywgY2IpO1xuICB9XG4gIHN0YXRlLmVuZGVkID0gdHJ1ZTtcbiAgc3RyZWFtLndyaXRhYmxlID0gZmFsc2U7XG59XG5mdW5jdGlvbiBvbkNvcmtlZEZpbmlzaChjb3JrUmVxLCBzdGF0ZSwgZXJyKSB7XG4gIHZhciBlbnRyeSA9IGNvcmtSZXEuZW50cnk7XG4gIGNvcmtSZXEuZW50cnkgPSBudWxsO1xuICB3aGlsZSAoZW50cnkpIHtcbiAgICB2YXIgY2IgPSBlbnRyeS5jYWxsYmFjaztcbiAgICBzdGF0ZS5wZW5kaW5nY2ItLTtcbiAgICBjYihlcnIpO1xuICAgIGVudHJ5ID0gZW50cnkubmV4dDtcbiAgfVxuXG4gIC8vIHJldXNlIHRoZSBmcmVlIGNvcmtSZXEuXG4gIHN0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZS5uZXh0ID0gY29ya1JlcTtcbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZS5wcm90b3R5cGUsICdkZXN0cm95ZWQnLCB7XG4gIC8vIG1ha2luZyBpdCBleHBsaWNpdCB0aGlzIHByb3BlcnR5IGlzIG5vdCBlbnVtZXJhYmxlXG4gIC8vIGJlY2F1c2Ugb3RoZXJ3aXNlIHNvbWUgcHJvdG90eXBlIG1hbmlwdWxhdGlvbiBpblxuICAvLyB1c2VybGFuZCB3aWxsIGZhaWxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIGlmICh0aGlzLl93cml0YWJsZVN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgIC8vIHdlIGlnbm9yZSB0aGUgdmFsdWUgaWYgdGhlIHN0cmVhbVxuICAgIC8vIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXRcbiAgICBpZiAoIXRoaXMuX3dyaXRhYmxlU3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCB0aGUgdXNlciBpcyBleHBsaWNpdGx5XG4gICAgLy8gbWFuYWdpbmcgZGVzdHJveWVkXG4gICAgdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQgPSB2YWx1ZTtcbiAgfVxufSk7XG5Xcml0YWJsZS5wcm90b3R5cGUuZGVzdHJveSA9IGRlc3Ryb3lJbXBsLmRlc3Ryb3k7XG5Xcml0YWJsZS5wcm90b3R5cGUuX3VuZGVzdHJveSA9IGRlc3Ryb3lJbXBsLnVuZGVzdHJveTtcbldyaXRhYmxlLnByb3RvdHlwZS5fZGVzdHJveSA9IGZ1bmN0aW9uIChlcnIsIGNiKSB7XG4gIGNiKGVycik7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9PYmplY3Qkc2V0UHJvdG90eXBlTztcbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsga2V5ID0gX3RvUHJvcGVydHlLZXkoa2V5KTsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5mdW5jdGlvbiBfdG9Qcm9wZXJ0eUtleShhcmcpIHsgdmFyIGtleSA9IF90b1ByaW1pdGl2ZShhcmcsIFwic3RyaW5nXCIpOyByZXR1cm4gdHlwZW9mIGtleSA9PT0gXCJzeW1ib2xcIiA/IGtleSA6IFN0cmluZyhrZXkpOyB9XG5mdW5jdGlvbiBfdG9QcmltaXRpdmUoaW5wdXQsIGhpbnQpIHsgaWYgKHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIiB8fCBpbnB1dCA9PT0gbnVsbCkgcmV0dXJuIGlucHV0OyB2YXIgcHJpbSA9IGlucHV0W1N5bWJvbC50b1ByaW1pdGl2ZV07IGlmIChwcmltICE9PSB1bmRlZmluZWQpIHsgdmFyIHJlcyA9IHByaW0uY2FsbChpbnB1dCwgaGludCB8fCBcImRlZmF1bHRcIik7IGlmICh0eXBlb2YgcmVzICE9PSBcIm9iamVjdFwiKSByZXR1cm4gcmVzOyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7IH0gcmV0dXJuIChoaW50ID09PSBcInN0cmluZ1wiID8gU3RyaW5nIDogTnVtYmVyKShpbnB1dCk7IH1cbnZhciBmaW5pc2hlZCA9IHJlcXVpcmUoJy4vZW5kLW9mLXN0cmVhbScpO1xudmFyIGtMYXN0UmVzb2x2ZSA9IFN5bWJvbCgnbGFzdFJlc29sdmUnKTtcbnZhciBrTGFzdFJlamVjdCA9IFN5bWJvbCgnbGFzdFJlamVjdCcpO1xudmFyIGtFcnJvciA9IFN5bWJvbCgnZXJyb3InKTtcbnZhciBrRW5kZWQgPSBTeW1ib2woJ2VuZGVkJyk7XG52YXIga0xhc3RQcm9taXNlID0gU3ltYm9sKCdsYXN0UHJvbWlzZScpO1xudmFyIGtIYW5kbGVQcm9taXNlID0gU3ltYm9sKCdoYW5kbGVQcm9taXNlJyk7XG52YXIga1N0cmVhbSA9IFN5bWJvbCgnc3RyZWFtJyk7XG5mdW5jdGlvbiBjcmVhdGVJdGVyUmVzdWx0KHZhbHVlLCBkb25lKSB7XG4gIHJldHVybiB7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGRvbmU6IGRvbmVcbiAgfTtcbn1cbmZ1bmN0aW9uIHJlYWRBbmRSZXNvbHZlKGl0ZXIpIHtcbiAgdmFyIHJlc29sdmUgPSBpdGVyW2tMYXN0UmVzb2x2ZV07XG4gIGlmIChyZXNvbHZlICE9PSBudWxsKSB7XG4gICAgdmFyIGRhdGEgPSBpdGVyW2tTdHJlYW1dLnJlYWQoKTtcbiAgICAvLyB3ZSBkZWZlciBpZiBkYXRhIGlzIG51bGxcbiAgICAvLyB3ZSBjYW4gYmUgZXhwZWN0aW5nIGVpdGhlciAnZW5kJyBvclxuICAgIC8vICdlcnJvcidcbiAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgaXRlcltrTGFzdFByb21pc2VdID0gbnVsbDtcbiAgICAgIGl0ZXJba0xhc3RSZXNvbHZlXSA9IG51bGw7XG4gICAgICBpdGVyW2tMYXN0UmVqZWN0XSA9IG51bGw7XG4gICAgICByZXNvbHZlKGNyZWF0ZUl0ZXJSZXN1bHQoZGF0YSwgZmFsc2UpKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIG9uUmVhZGFibGUoaXRlcikge1xuICAvLyB3ZSB3YWl0IGZvciB0aGUgbmV4dCB0aWNrLCBiZWNhdXNlIGl0IG1pZ2h0XG4gIC8vIGVtaXQgYW4gZXJyb3Igd2l0aCBwcm9jZXNzLm5leHRUaWNrXG4gIHByb2Nlc3MubmV4dFRpY2socmVhZEFuZFJlc29sdmUsIGl0ZXIpO1xufVxuZnVuY3Rpb24gd3JhcEZvck5leHQobGFzdFByb21pc2UsIGl0ZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBsYXN0UHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpdGVyW2tFbmRlZF0pIHtcbiAgICAgICAgcmVzb2x2ZShjcmVhdGVJdGVyUmVzdWx0KHVuZGVmaW5lZCwgdHJ1ZSkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpdGVyW2tIYW5kbGVQcm9taXNlXShyZXNvbHZlLCByZWplY3QpO1xuICAgIH0sIHJlamVjdCk7XG4gIH07XG59XG52YXIgQXN5bmNJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihmdW5jdGlvbiAoKSB7fSk7XG52YXIgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yUHJvdG90eXBlID0gT2JqZWN0LnNldFByb3RvdHlwZU9mKChfT2JqZWN0JHNldFByb3RvdHlwZU8gPSB7XG4gIGdldCBzdHJlYW0oKSB7XG4gICAgcmV0dXJuIHRoaXNba1N0cmVhbV07XG4gIH0sXG4gIG5leHQ6IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAvLyBpZiB3ZSBoYXZlIGRldGVjdGVkIGFuIGVycm9yIGluIHRoZSBtZWFud2hpbGVcbiAgICAvLyByZWplY3Qgc3RyYWlnaHQgYXdheVxuICAgIHZhciBlcnJvciA9IHRoaXNba0Vycm9yXTtcbiAgICBpZiAoZXJyb3IgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgfVxuICAgIGlmICh0aGlzW2tFbmRlZF0pIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY3JlYXRlSXRlclJlc3VsdCh1bmRlZmluZWQsIHRydWUpKTtcbiAgICB9XG4gICAgaWYgKHRoaXNba1N0cmVhbV0uZGVzdHJveWVkKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIGRlZmVyIHZpYSBuZXh0VGljayBiZWNhdXNlIGlmIC5kZXN0cm95KGVycikgaXNcbiAgICAgIC8vIGNhbGxlZCwgdGhlIGVycm9yIHdpbGwgYmUgZW1pdHRlZCB2aWEgbmV4dFRpY2ssIGFuZFxuICAgICAgLy8gd2UgY2Fubm90IGd1YXJhbnRlZSB0aGF0IHRoZXJlIGlzIG5vIGVycm9yIGxpbmdlcmluZyBhcm91bmRcbiAgICAgIC8vIHdhaXRpbmcgdG8gYmUgZW1pdHRlZC5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChfdGhpc1trRXJyb3JdKSB7XG4gICAgICAgICAgICByZWplY3QoX3RoaXNba0Vycm9yXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUoY3JlYXRlSXRlclJlc3VsdCh1bmRlZmluZWQsIHRydWUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gaWYgd2UgaGF2ZSBtdWx0aXBsZSBuZXh0KCkgY2FsbHNcbiAgICAvLyB3ZSB3aWxsIHdhaXQgZm9yIHRoZSBwcmV2aW91cyBQcm9taXNlIHRvIGZpbmlzaFxuICAgIC8vIHRoaXMgbG9naWMgaXMgb3B0aW1pemVkIHRvIHN1cHBvcnQgZm9yIGF3YWl0IGxvb3BzLFxuICAgIC8vIHdoZXJlIG5leHQoKSBpcyBvbmx5IGNhbGxlZCBvbmNlIGF0IGEgdGltZVxuICAgIHZhciBsYXN0UHJvbWlzZSA9IHRoaXNba0xhc3RQcm9taXNlXTtcbiAgICB2YXIgcHJvbWlzZTtcbiAgICBpZiAobGFzdFByb21pc2UpIHtcbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSh3cmFwRm9yTmV4dChsYXN0UHJvbWlzZSwgdGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBmYXN0IHBhdGggbmVlZGVkIHRvIHN1cHBvcnQgbXVsdGlwbGUgdGhpcy5wdXNoKClcbiAgICAgIC8vIHdpdGhvdXQgdHJpZ2dlcmluZyB0aGUgbmV4dCgpIHF1ZXVlXG4gICAgICB2YXIgZGF0YSA9IHRoaXNba1N0cmVhbV0ucmVhZCgpO1xuICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjcmVhdGVJdGVyUmVzdWx0KGRhdGEsIGZhbHNlKSk7XG4gICAgICB9XG4gICAgICBwcm9taXNlID0gbmV3IFByb21pc2UodGhpc1trSGFuZGxlUHJvbWlzZV0pO1xuICAgIH1cbiAgICB0aGlzW2tMYXN0UHJvbWlzZV0gPSBwcm9taXNlO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59LCBfZGVmaW5lUHJvcGVydHkoX09iamVjdCRzZXRQcm90b3R5cGVPLCBTeW1ib2wuYXN5bmNJdGVyYXRvciwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn0pLCBfZGVmaW5lUHJvcGVydHkoX09iamVjdCRzZXRQcm90b3R5cGVPLCBcInJldHVyblwiLCBmdW5jdGlvbiBfcmV0dXJuKCkge1xuICB2YXIgX3RoaXMyID0gdGhpcztcbiAgLy8gZGVzdHJveShlcnIsIGNiKSBpcyBhIHByaXZhdGUgQVBJXG4gIC8vIHdlIGNhbiBndWFyYW50ZWUgd2UgaGF2ZSB0aGF0IGhlcmUsIGJlY2F1c2Ugd2UgY29udHJvbCB0aGVcbiAgLy8gUmVhZGFibGUgY2xhc3MgdGhpcyBpcyBhdHRhY2hlZCB0b1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIF90aGlzMltrU3RyZWFtXS5kZXN0cm95KG51bGwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoY3JlYXRlSXRlclJlc3VsdCh1bmRlZmluZWQsIHRydWUpKTtcbiAgICB9KTtcbiAgfSk7XG59KSwgX09iamVjdCRzZXRQcm90b3R5cGVPKSwgQXN5bmNJdGVyYXRvclByb3RvdHlwZSk7XG52YXIgY3JlYXRlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yID0gZnVuY3Rpb24gY3JlYXRlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yKHN0cmVhbSkge1xuICB2YXIgX09iamVjdCRjcmVhdGU7XG4gIHZhciBpdGVyYXRvciA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yUHJvdG90eXBlLCAoX09iamVjdCRjcmVhdGUgPSB7fSwgX2RlZmluZVByb3BlcnR5KF9PYmplY3QkY3JlYXRlLCBrU3RyZWFtLCB7XG4gICAgdmFsdWU6IHN0cmVhbSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgX2RlZmluZVByb3BlcnR5KF9PYmplY3QkY3JlYXRlLCBrTGFzdFJlc29sdmUsIHtcbiAgICB2YWx1ZTogbnVsbCxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgX2RlZmluZVByb3BlcnR5KF9PYmplY3QkY3JlYXRlLCBrTGFzdFJlamVjdCwge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBfZGVmaW5lUHJvcGVydHkoX09iamVjdCRjcmVhdGUsIGtFcnJvciwge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBfZGVmaW5lUHJvcGVydHkoX09iamVjdCRjcmVhdGUsIGtFbmRlZCwge1xuICAgIHZhbHVlOiBzdHJlYW0uX3JlYWRhYmxlU3RhdGUuZW5kRW1pdHRlZCxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgX2RlZmluZVByb3BlcnR5KF9PYmplY3QkY3JlYXRlLCBrSGFuZGxlUHJvbWlzZSwge1xuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBkYXRhID0gaXRlcmF0b3Jba1N0cmVhbV0ucmVhZCgpO1xuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgaXRlcmF0b3Jba0xhc3RQcm9taXNlXSA9IG51bGw7XG4gICAgICAgIGl0ZXJhdG9yW2tMYXN0UmVzb2x2ZV0gPSBudWxsO1xuICAgICAgICBpdGVyYXRvcltrTGFzdFJlamVjdF0gPSBudWxsO1xuICAgICAgICByZXNvbHZlKGNyZWF0ZUl0ZXJSZXN1bHQoZGF0YSwgZmFsc2UpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZXJhdG9yW2tMYXN0UmVzb2x2ZV0gPSByZXNvbHZlO1xuICAgICAgICBpdGVyYXRvcltrTGFzdFJlamVjdF0gPSByZWplY3Q7XG4gICAgICB9XG4gICAgfSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgX09iamVjdCRjcmVhdGUpKTtcbiAgaXRlcmF0b3Jba0xhc3RQcm9taXNlXSA9IG51bGw7XG4gIGZpbmlzaGVkKHN0cmVhbSwgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIgJiYgZXJyLmNvZGUgIT09ICdFUlJfU1RSRUFNX1BSRU1BVFVSRV9DTE9TRScpIHtcbiAgICAgIHZhciByZWplY3QgPSBpdGVyYXRvcltrTGFzdFJlamVjdF07XG4gICAgICAvLyByZWplY3QgaWYgd2UgYXJlIHdhaXRpbmcgZm9yIGRhdGEgaW4gdGhlIFByb21pc2VcbiAgICAgIC8vIHJldHVybmVkIGJ5IG5leHQoKSBhbmQgc3RvcmUgdGhlIGVycm9yXG4gICAgICBpZiAocmVqZWN0ICE9PSBudWxsKSB7XG4gICAgICAgIGl0ZXJhdG9yW2tMYXN0UHJvbWlzZV0gPSBudWxsO1xuICAgICAgICBpdGVyYXRvcltrTGFzdFJlc29sdmVdID0gbnVsbDtcbiAgICAgICAgaXRlcmF0b3Jba0xhc3RSZWplY3RdID0gbnVsbDtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgICBpdGVyYXRvcltrRXJyb3JdID0gZXJyO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzb2x2ZSA9IGl0ZXJhdG9yW2tMYXN0UmVzb2x2ZV07XG4gICAgaWYgKHJlc29sdmUgIT09IG51bGwpIHtcbiAgICAgIGl0ZXJhdG9yW2tMYXN0UHJvbWlzZV0gPSBudWxsO1xuICAgICAgaXRlcmF0b3Jba0xhc3RSZXNvbHZlXSA9IG51bGw7XG4gICAgICBpdGVyYXRvcltrTGFzdFJlamVjdF0gPSBudWxsO1xuICAgICAgcmVzb2x2ZShjcmVhdGVJdGVyUmVzdWx0KHVuZGVmaW5lZCwgdHJ1ZSkpO1xuICAgIH1cbiAgICBpdGVyYXRvcltrRW5kZWRdID0gdHJ1ZTtcbiAgfSk7XG4gIHN0cmVhbS5vbigncmVhZGFibGUnLCBvblJlYWRhYmxlLmJpbmQobnVsbCwgaXRlcmF0b3IpKTtcbiAgcmV0dXJuIGl0ZXJhdG9yO1xufTtcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGVudW1lcmFibGVPbmx5ICYmIChzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTsgfSkpLCBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7IH0gcmV0dXJuIGtleXM7IH1cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBudWxsICE9IGFyZ3VtZW50c1tpXSA/IGFyZ3VtZW50c1tpXSA6IHt9OyBpICUgMiA/IG93bktleXMoT2JqZWN0KHNvdXJjZSksICEwKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7IH0pIDogT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpIDogb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpOyB9KTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGtleSA9IF90b1Byb3BlcnR5S2V5KGtleSk7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgX3RvUHJvcGVydHlLZXkoZGVzY3JpcHRvci5rZXkpLCBkZXNjcmlwdG9yKTsgfSB9XG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgXCJwcm90b3R5cGVcIiwgeyB3cml0YWJsZTogZmFsc2UgfSk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuZnVuY3Rpb24gX3RvUHJvcGVydHlLZXkoYXJnKSB7IHZhciBrZXkgPSBfdG9QcmltaXRpdmUoYXJnLCBcInN0cmluZ1wiKTsgcmV0dXJuIHR5cGVvZiBrZXkgPT09IFwic3ltYm9sXCIgPyBrZXkgOiBTdHJpbmcoa2V5KTsgfVxuZnVuY3Rpb24gX3RvUHJpbWl0aXZlKGlucHV0LCBoaW50KSB7IGlmICh0eXBlb2YgaW5wdXQgIT09IFwib2JqZWN0XCIgfHwgaW5wdXQgPT09IG51bGwpIHJldHVybiBpbnB1dDsgdmFyIHByaW0gPSBpbnB1dFtTeW1ib2wudG9QcmltaXRpdmVdOyBpZiAocHJpbSAhPT0gdW5kZWZpbmVkKSB7IHZhciByZXMgPSBwcmltLmNhbGwoaW5wdXQsIGhpbnQgfHwgXCJkZWZhdWx0XCIpOyBpZiAodHlwZW9mIHJlcyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHJlczsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkBAdG9QcmltaXRpdmUgbXVzdCByZXR1cm4gYSBwcmltaXRpdmUgdmFsdWUuXCIpOyB9IHJldHVybiAoaGludCA9PT0gXCJzdHJpbmdcIiA/IFN0cmluZyA6IE51bWJlcikoaW5wdXQpOyB9XG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdidWZmZXInKSxcbiAgQnVmZmVyID0gX3JlcXVpcmUuQnVmZmVyO1xudmFyIF9yZXF1aXJlMiA9IHJlcXVpcmUoJ3V0aWwnKSxcbiAgaW5zcGVjdCA9IF9yZXF1aXJlMi5pbnNwZWN0O1xudmFyIGN1c3RvbSA9IGluc3BlY3QgJiYgaW5zcGVjdC5jdXN0b20gfHwgJ2luc3BlY3QnO1xuZnVuY3Rpb24gY29weUJ1ZmZlcihzcmMsIHRhcmdldCwgb2Zmc2V0KSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuY29weS5jYWxsKHNyYywgdGFyZ2V0LCBvZmZzZXQpO1xufVxubW9kdWxlLmV4cG9ydHMgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBCdWZmZXJMaXN0KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCdWZmZXJMaXN0KTtcbiAgICB0aGlzLmhlYWQgPSBudWxsO1xuICAgIHRoaXMudGFpbCA9IG51bGw7XG4gICAgdGhpcy5sZW5ndGggPSAwO1xuICB9XG4gIF9jcmVhdGVDbGFzcyhCdWZmZXJMaXN0LCBbe1xuICAgIGtleTogXCJwdXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHB1c2godikge1xuICAgICAgdmFyIGVudHJ5ID0ge1xuICAgICAgICBkYXRhOiB2LFxuICAgICAgICBuZXh0OiBudWxsXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMubGVuZ3RoID4gMCkgdGhpcy50YWlsLm5leHQgPSBlbnRyeTtlbHNlIHRoaXMuaGVhZCA9IGVudHJ5O1xuICAgICAgdGhpcy50YWlsID0gZW50cnk7XG4gICAgICArK3RoaXMubGVuZ3RoO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ1bnNoaWZ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVuc2hpZnQodikge1xuICAgICAgdmFyIGVudHJ5ID0ge1xuICAgICAgICBkYXRhOiB2LFxuICAgICAgICBuZXh0OiB0aGlzLmhlYWRcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHRoaXMudGFpbCA9IGVudHJ5O1xuICAgICAgdGhpcy5oZWFkID0gZW50cnk7XG4gICAgICArK3RoaXMubGVuZ3RoO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzaGlmdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaGlmdCgpIHtcbiAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgdmFyIHJldCA9IHRoaXMuaGVhZC5kYXRhO1xuICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAxKSB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBudWxsO2Vsc2UgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgICAtLXRoaXMubGVuZ3RoO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBudWxsO1xuICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJqb2luXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGpvaW4ocykge1xuICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gJyc7XG4gICAgICB2YXIgcCA9IHRoaXMuaGVhZDtcbiAgICAgIHZhciByZXQgPSAnJyArIHAuZGF0YTtcbiAgICAgIHdoaWxlIChwID0gcC5uZXh0KSByZXQgKz0gcyArIHAuZGF0YTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbmNhdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb25jYXQobikge1xuICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gQnVmZmVyLmFsbG9jKDApO1xuICAgICAgdmFyIHJldCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShuID4+PiAwKTtcbiAgICAgIHZhciBwID0gdGhpcy5oZWFkO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgd2hpbGUgKHApIHtcbiAgICAgICAgY29weUJ1ZmZlcihwLmRhdGEsIHJldCwgaSk7XG4gICAgICAgIGkgKz0gcC5kYXRhLmxlbmd0aDtcbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLy8gQ29uc3VtZXMgYSBzcGVjaWZpZWQgYW1vdW50IG9mIGJ5dGVzIG9yIGNoYXJhY3RlcnMgZnJvbSB0aGUgYnVmZmVyZWQgZGF0YS5cbiAgfSwge1xuICAgIGtleTogXCJjb25zdW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbnN1bWUobiwgaGFzU3RyaW5ncykge1xuICAgICAgdmFyIHJldDtcbiAgICAgIGlmIChuIDwgdGhpcy5oZWFkLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgIC8vIGBzbGljZWAgaXMgdGhlIHNhbWUgZm9yIGJ1ZmZlcnMgYW5kIHN0cmluZ3MuXG4gICAgICAgIHJldCA9IHRoaXMuaGVhZC5kYXRhLnNsaWNlKDAsIG4pO1xuICAgICAgICB0aGlzLmhlYWQuZGF0YSA9IHRoaXMuaGVhZC5kYXRhLnNsaWNlKG4pO1xuICAgICAgfSBlbHNlIGlmIChuID09PSB0aGlzLmhlYWQuZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgLy8gRmlyc3QgY2h1bmsgaXMgYSBwZXJmZWN0IG1hdGNoLlxuICAgICAgICByZXQgPSB0aGlzLnNoaWZ0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZXN1bHQgc3BhbnMgbW9yZSB0aGFuIG9uZSBidWZmZXIuXG4gICAgICAgIHJldCA9IGhhc1N0cmluZ3MgPyB0aGlzLl9nZXRTdHJpbmcobikgOiB0aGlzLl9nZXRCdWZmZXIobik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmaXJzdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaXJzdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmhlYWQuZGF0YTtcbiAgICB9XG5cbiAgICAvLyBDb25zdW1lcyBhIHNwZWNpZmllZCBhbW91bnQgb2YgY2hhcmFjdGVycyBmcm9tIHRoZSBidWZmZXJlZCBkYXRhLlxuICB9LCB7XG4gICAga2V5OiBcIl9nZXRTdHJpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFN0cmluZyhuKSB7XG4gICAgICB2YXIgcCA9IHRoaXMuaGVhZDtcbiAgICAgIHZhciBjID0gMTtcbiAgICAgIHZhciByZXQgPSBwLmRhdGE7XG4gICAgICBuIC09IHJldC5sZW5ndGg7XG4gICAgICB3aGlsZSAocCA9IHAubmV4dCkge1xuICAgICAgICB2YXIgc3RyID0gcC5kYXRhO1xuICAgICAgICB2YXIgbmIgPSBuID4gc3RyLmxlbmd0aCA/IHN0ci5sZW5ndGggOiBuO1xuICAgICAgICBpZiAobmIgPT09IHN0ci5sZW5ndGgpIHJldCArPSBzdHI7ZWxzZSByZXQgKz0gc3RyLnNsaWNlKDAsIG4pO1xuICAgICAgICBuIC09IG5iO1xuICAgICAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICAgIGlmIChuYiA9PT0gc3RyLmxlbmd0aCkge1xuICAgICAgICAgICAgKytjO1xuICAgICAgICAgICAgaWYgKHAubmV4dCkgdGhpcy5oZWFkID0gcC5uZXh0O2Vsc2UgdGhpcy5oZWFkID0gdGhpcy50YWlsID0gbnVsbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oZWFkID0gcDtcbiAgICAgICAgICAgIHAuZGF0YSA9IHN0ci5zbGljZShuYik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgICsrYztcbiAgICAgIH1cbiAgICAgIHRoaXMubGVuZ3RoIC09IGM7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8vIENvbnN1bWVzIGEgc3BlY2lmaWVkIGFtb3VudCBvZiBieXRlcyBmcm9tIHRoZSBidWZmZXJlZCBkYXRhLlxuICB9LCB7XG4gICAga2V5OiBcIl9nZXRCdWZmZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEJ1ZmZlcihuKSB7XG4gICAgICB2YXIgcmV0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKG4pO1xuICAgICAgdmFyIHAgPSB0aGlzLmhlYWQ7XG4gICAgICB2YXIgYyA9IDE7XG4gICAgICBwLmRhdGEuY29weShyZXQpO1xuICAgICAgbiAtPSBwLmRhdGEubGVuZ3RoO1xuICAgICAgd2hpbGUgKHAgPSBwLm5leHQpIHtcbiAgICAgICAgdmFyIGJ1ZiA9IHAuZGF0YTtcbiAgICAgICAgdmFyIG5iID0gbiA+IGJ1Zi5sZW5ndGggPyBidWYubGVuZ3RoIDogbjtcbiAgICAgICAgYnVmLmNvcHkocmV0LCByZXQubGVuZ3RoIC0gbiwgMCwgbmIpO1xuICAgICAgICBuIC09IG5iO1xuICAgICAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICAgIGlmIChuYiA9PT0gYnVmLmxlbmd0aCkge1xuICAgICAgICAgICAgKytjO1xuICAgICAgICAgICAgaWYgKHAubmV4dCkgdGhpcy5oZWFkID0gcC5uZXh0O2Vsc2UgdGhpcy5oZWFkID0gdGhpcy50YWlsID0gbnVsbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oZWFkID0gcDtcbiAgICAgICAgICAgIHAuZGF0YSA9IGJ1Zi5zbGljZShuYik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgICsrYztcbiAgICAgIH1cbiAgICAgIHRoaXMubGVuZ3RoIC09IGM7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgbGlua2VkIGxpc3Qgb25seSBzaG93cyB0aGUgbWluaW1hbCBuZWNlc3NhcnkgaW5mb3JtYXRpb24uXG4gIH0sIHtcbiAgICBrZXk6IGN1c3RvbSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoXywgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIGluc3BlY3QodGhpcywgX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBvcHRpb25zKSwge30sIHtcbiAgICAgICAgLy8gT25seSBpbnNwZWN0IG9uZSBsZXZlbC5cbiAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgIC8vIEl0IHNob3VsZCBub3QgcmVjdXJzZS5cbiAgICAgICAgY3VzdG9tSW5zcGVjdDogZmFsc2VcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIEJ1ZmZlckxpc3Q7XG59KCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB1bmRvY3VtZW50ZWQgY2IoKSBBUEksIG5lZWRlZCBmb3IgY29yZSwgbm90IGZvciBwdWJsaWMgQVBJXG5mdW5jdGlvbiBkZXN0cm95KGVyciwgY2IpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdmFyIHJlYWRhYmxlRGVzdHJveWVkID0gdGhpcy5fcmVhZGFibGVTdGF0ZSAmJiB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZDtcbiAgdmFyIHdyaXRhYmxlRGVzdHJveWVkID0gdGhpcy5fd3JpdGFibGVTdGF0ZSAmJiB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZDtcbiAgaWYgKHJlYWRhYmxlRGVzdHJveWVkIHx8IHdyaXRhYmxlRGVzdHJveWVkKSB7XG4gICAgaWYgKGNiKSB7XG4gICAgICBjYihlcnIpO1xuICAgIH0gZWxzZSBpZiAoZXJyKSB7XG4gICAgICBpZiAoIXRoaXMuX3dyaXRhYmxlU3RhdGUpIHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhlbWl0RXJyb3JOVCwgdGhpcywgZXJyKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkKSB7XG4gICAgICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhlbWl0RXJyb3JOVCwgdGhpcywgZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB3ZSBzZXQgZGVzdHJveWVkIHRvIHRydWUgYmVmb3JlIGZpcmluZyBlcnJvciBjYWxsYmFja3MgaW4gb3JkZXJcbiAgLy8gdG8gbWFrZSBpdCByZS1lbnRyYW5jZSBzYWZlIGluIGNhc2UgZGVzdHJveSgpIGlzIGNhbGxlZCB3aXRoaW4gY2FsbGJhY2tzXG5cbiAgaWYgKHRoaXMuX3JlYWRhYmxlU3RhdGUpIHtcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZCA9IHRydWU7XG4gIH1cblxuICAvLyBpZiB0aGlzIGlzIGEgZHVwbGV4IHN0cmVhbSBtYXJrIHRoZSB3cml0YWJsZSBwYXJ0IGFzIGRlc3Ryb3llZCBhcyB3ZWxsXG4gIGlmICh0aGlzLl93cml0YWJsZVN0YXRlKSB7XG4gICAgdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQgPSB0cnVlO1xuICB9XG4gIHRoaXMuX2Rlc3Ryb3koZXJyIHx8IG51bGwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoIWNiICYmIGVycikge1xuICAgICAgaWYgKCFfdGhpcy5fd3JpdGFibGVTdGF0ZSkge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXRFcnJvckFuZENsb3NlTlQsIF90aGlzLCBlcnIpO1xuICAgICAgfSBlbHNlIGlmICghX3RoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkKSB7XG4gICAgICAgIF90aGlzLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCA9IHRydWU7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZW1pdEVycm9yQW5kQ2xvc2VOVCwgX3RoaXMsIGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXRDbG9zZU5ULCBfdGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjYikge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhlbWl0Q2xvc2VOVCwgX3RoaXMpO1xuICAgICAgY2IoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhlbWl0Q2xvc2VOVCwgX3RoaXMpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufVxuZnVuY3Rpb24gZW1pdEVycm9yQW5kQ2xvc2VOVChzZWxmLCBlcnIpIHtcbiAgZW1pdEVycm9yTlQoc2VsZiwgZXJyKTtcbiAgZW1pdENsb3NlTlQoc2VsZik7XG59XG5mdW5jdGlvbiBlbWl0Q2xvc2VOVChzZWxmKSB7XG4gIGlmIChzZWxmLl93cml0YWJsZVN0YXRlICYmICFzZWxmLl93cml0YWJsZVN0YXRlLmVtaXRDbG9zZSkgcmV0dXJuO1xuICBpZiAoc2VsZi5fcmVhZGFibGVTdGF0ZSAmJiAhc2VsZi5fcmVhZGFibGVTdGF0ZS5lbWl0Q2xvc2UpIHJldHVybjtcbiAgc2VsZi5lbWl0KCdjbG9zZScpO1xufVxuZnVuY3Rpb24gdW5kZXN0cm95KCkge1xuICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSkge1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkID0gZmFsc2U7XG4gICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZW5kRW1pdHRlZCA9IGZhbHNlO1xuICB9XG4gIGlmICh0aGlzLl93cml0YWJsZVN0YXRlKSB7XG4gICAgdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmVuZGVkID0gZmFsc2U7XG4gICAgdGhpcy5fd3JpdGFibGVTdGF0ZS5lbmRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmZpbmFsQ2FsbGVkID0gZmFsc2U7XG4gICAgdGhpcy5fd3JpdGFibGVTdGF0ZS5wcmVmaW5pc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZmluaXNoZWQgPSBmYWxzZTtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCA9IGZhbHNlO1xuICB9XG59XG5mdW5jdGlvbiBlbWl0RXJyb3JOVChzZWxmLCBlcnIpIHtcbiAgc2VsZi5lbWl0KCdlcnJvcicsIGVycik7XG59XG5mdW5jdGlvbiBlcnJvck9yRGVzdHJveShzdHJlYW0sIGVycikge1xuICAvLyBXZSBoYXZlIHRlc3RzIHRoYXQgcmVseSBvbiBlcnJvcnMgYmVpbmcgZW1pdHRlZFxuICAvLyBpbiB0aGUgc2FtZSB0aWNrLCBzbyBjaGFuZ2luZyB0aGlzIGlzIHNlbXZlciBtYWpvci5cbiAgLy8gRm9yIG5vdyB3aGVuIHlvdSBvcHQtaW4gdG8gYXV0b0Rlc3Ryb3kgd2UgYWxsb3dcbiAgLy8gdGhlIGVycm9yIHRvIGJlIGVtaXR0ZWQgbmV4dFRpY2suIEluIGEgZnV0dXJlXG4gIC8vIHNlbXZlciBtYWpvciB1cGRhdGUgd2Ugc2hvdWxkIGNoYW5nZSB0aGUgZGVmYXVsdCB0byB0aGlzLlxuXG4gIHZhciByU3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIHZhciB3U3RhdGUgPSBzdHJlYW0uX3dyaXRhYmxlU3RhdGU7XG4gIGlmIChyU3RhdGUgJiYgclN0YXRlLmF1dG9EZXN0cm95IHx8IHdTdGF0ZSAmJiB3U3RhdGUuYXV0b0Rlc3Ryb3kpIHN0cmVhbS5kZXN0cm95KGVycik7ZWxzZSBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcnIpO1xufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gIHVuZGVzdHJveTogdW5kZXN0cm95LFxuICBlcnJvck9yRGVzdHJveTogZXJyb3JPckRlc3Ryb3lcbn07IiwiLy8gUG9ydGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hZmludG9zaC9lbmQtb2Ytc3RyZWFtIHdpdGhcbi8vIHBlcm1pc3Npb24gZnJvbSB0aGUgYXV0aG9yLCBNYXRoaWFzIEJ1dXMgKEBtYWZpbnRvc2gpLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBFUlJfU1RSRUFNX1BSRU1BVFVSRV9DTE9TRSA9IHJlcXVpcmUoJy4uLy4uLy4uL2Vycm9ycycpLmNvZGVzLkVSUl9TVFJFQU1fUFJFTUFUVVJFX0NMT1NFO1xuZnVuY3Rpb24gb25jZShjYWxsYmFjaykge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNhbGxlZCkgcmV0dXJuO1xuICAgIGNhbGxlZCA9IHRydWU7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cbiAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuZnVuY3Rpb24gaXNSZXF1ZXN0KHN0cmVhbSkge1xuICByZXR1cm4gc3RyZWFtLnNldEhlYWRlciAmJiB0eXBlb2Ygc3RyZWFtLmFib3J0ID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gZW9zKHN0cmVhbSwgb3B0cywgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSByZXR1cm4gZW9zKHN0cmVhbSwgbnVsbCwgb3B0cyk7XG4gIGlmICghb3B0cykgb3B0cyA9IHt9O1xuICBjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2sgfHwgbm9vcCk7XG4gIHZhciByZWFkYWJsZSA9IG9wdHMucmVhZGFibGUgfHwgb3B0cy5yZWFkYWJsZSAhPT0gZmFsc2UgJiYgc3RyZWFtLnJlYWRhYmxlO1xuICB2YXIgd3JpdGFibGUgPSBvcHRzLndyaXRhYmxlIHx8IG9wdHMud3JpdGFibGUgIT09IGZhbHNlICYmIHN0cmVhbS53cml0YWJsZTtcbiAgdmFyIG9ubGVnYWN5ZmluaXNoID0gZnVuY3Rpb24gb25sZWdhY3lmaW5pc2goKSB7XG4gICAgaWYgKCFzdHJlYW0ud3JpdGFibGUpIG9uZmluaXNoKCk7XG4gIH07XG4gIHZhciB3cml0YWJsZUVuZGVkID0gc3RyZWFtLl93cml0YWJsZVN0YXRlICYmIHN0cmVhbS5fd3JpdGFibGVTdGF0ZS5maW5pc2hlZDtcbiAgdmFyIG9uZmluaXNoID0gZnVuY3Rpb24gb25maW5pc2goKSB7XG4gICAgd3JpdGFibGUgPSBmYWxzZTtcbiAgICB3cml0YWJsZUVuZGVkID0gdHJ1ZTtcbiAgICBpZiAoIXJlYWRhYmxlKSBjYWxsYmFjay5jYWxsKHN0cmVhbSk7XG4gIH07XG4gIHZhciByZWFkYWJsZUVuZGVkID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlICYmIHN0cmVhbS5fcmVhZGFibGVTdGF0ZS5lbmRFbWl0dGVkO1xuICB2YXIgb25lbmQgPSBmdW5jdGlvbiBvbmVuZCgpIHtcbiAgICByZWFkYWJsZSA9IGZhbHNlO1xuICAgIHJlYWRhYmxlRW5kZWQgPSB0cnVlO1xuICAgIGlmICghd3JpdGFibGUpIGNhbGxiYWNrLmNhbGwoc3RyZWFtKTtcbiAgfTtcbiAgdmFyIG9uZXJyb3IgPSBmdW5jdGlvbiBvbmVycm9yKGVycikge1xuICAgIGNhbGxiYWNrLmNhbGwoc3RyZWFtLCBlcnIpO1xuICB9O1xuICB2YXIgb25jbG9zZSA9IGZ1bmN0aW9uIG9uY2xvc2UoKSB7XG4gICAgdmFyIGVycjtcbiAgICBpZiAocmVhZGFibGUgJiYgIXJlYWRhYmxlRW5kZWQpIHtcbiAgICAgIGlmICghc3RyZWFtLl9yZWFkYWJsZVN0YXRlIHx8ICFzdHJlYW0uX3JlYWRhYmxlU3RhdGUuZW5kZWQpIGVyciA9IG5ldyBFUlJfU1RSRUFNX1BSRU1BVFVSRV9DTE9TRSgpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoc3RyZWFtLCBlcnIpO1xuICAgIH1cbiAgICBpZiAod3JpdGFibGUgJiYgIXdyaXRhYmxlRW5kZWQpIHtcbiAgICAgIGlmICghc3RyZWFtLl93cml0YWJsZVN0YXRlIHx8ICFzdHJlYW0uX3dyaXRhYmxlU3RhdGUuZW5kZWQpIGVyciA9IG5ldyBFUlJfU1RSRUFNX1BSRU1BVFVSRV9DTE9TRSgpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoc3RyZWFtLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgdmFyIG9ucmVxdWVzdCA9IGZ1bmN0aW9uIG9ucmVxdWVzdCgpIHtcbiAgICBzdHJlYW0ucmVxLm9uKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gIH07XG4gIGlmIChpc1JlcXVlc3Qoc3RyZWFtKSkge1xuICAgIHN0cmVhbS5vbignY29tcGxldGUnLCBvbmZpbmlzaCk7XG4gICAgc3RyZWFtLm9uKCdhYm9ydCcsIG9uY2xvc2UpO1xuICAgIGlmIChzdHJlYW0ucmVxKSBvbnJlcXVlc3QoKTtlbHNlIHN0cmVhbS5vbigncmVxdWVzdCcsIG9ucmVxdWVzdCk7XG4gIH0gZWxzZSBpZiAod3JpdGFibGUgJiYgIXN0cmVhbS5fd3JpdGFibGVTdGF0ZSkge1xuICAgIC8vIGxlZ2FjeSBzdHJlYW1zXG4gICAgc3RyZWFtLm9uKCdlbmQnLCBvbmxlZ2FjeWZpbmlzaCk7XG4gICAgc3RyZWFtLm9uKCdjbG9zZScsIG9ubGVnYWN5ZmluaXNoKTtcbiAgfVxuICBzdHJlYW0ub24oJ2VuZCcsIG9uZW5kKTtcbiAgc3RyZWFtLm9uKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gIGlmIChvcHRzLmVycm9yICE9PSBmYWxzZSkgc3RyZWFtLm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuICBzdHJlYW0ub24oJ2Nsb3NlJywgb25jbG9zZSk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdjb21wbGV0ZScsIG9uZmluaXNoKTtcbiAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2Fib3J0Jywgb25jbG9zZSk7XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdyZXF1ZXN0Jywgb25yZXF1ZXN0KTtcbiAgICBpZiAoc3RyZWFtLnJlcSkgc3RyZWFtLnJlcS5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgb25maW5pc2gpO1xuICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25sZWdhY3lmaW5pc2gpO1xuICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmxlZ2FjeWZpbmlzaCk7XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBvbmVuZCk7XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmNsb3NlKTtcbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZW9zOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ1JlYWRhYmxlLmZyb20gaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgYnJvd3NlcicpXG59O1xuIiwiLy8gUG9ydGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hZmludG9zaC9wdW1wIHdpdGhcbi8vIHBlcm1pc3Npb24gZnJvbSB0aGUgYXV0aG9yLCBNYXRoaWFzIEJ1dXMgKEBtYWZpbnRvc2gpLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlb3M7XG5mdW5jdGlvbiBvbmNlKGNhbGxiYWNrKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FsbGVkKSByZXR1cm47XG4gICAgY2FsbGVkID0gdHJ1ZTtcbiAgICBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG4gIH07XG59XG52YXIgX3JlcXVpcmUkY29kZXMgPSByZXF1aXJlKCcuLi8uLi8uLi9lcnJvcnMnKS5jb2RlcyxcbiAgRVJSX01JU1NJTkdfQVJHUyA9IF9yZXF1aXJlJGNvZGVzLkVSUl9NSVNTSU5HX0FSR1MsXG4gIEVSUl9TVFJFQU1fREVTVFJPWUVEID0gX3JlcXVpcmUkY29kZXMuRVJSX1NUUkVBTV9ERVNUUk9ZRUQ7XG5mdW5jdGlvbiBub29wKGVycikge1xuICAvLyBSZXRocm93IHRoZSBlcnJvciBpZiBpdCBleGlzdHMgdG8gYXZvaWQgc3dhbGxvd2luZyBpdFxuICBpZiAoZXJyKSB0aHJvdyBlcnI7XG59XG5mdW5jdGlvbiBpc1JlcXVlc3Qoc3RyZWFtKSB7XG4gIHJldHVybiBzdHJlYW0uc2V0SGVhZGVyICYmIHR5cGVvZiBzdHJlYW0uYWJvcnQgPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBkZXN0cm95ZXIoc3RyZWFtLCByZWFkaW5nLCB3cml0aW5nLCBjYWxsYmFjaykge1xuICBjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2spO1xuICB2YXIgY2xvc2VkID0gZmFsc2U7XG4gIHN0cmVhbS5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgY2xvc2VkID0gdHJ1ZTtcbiAgfSk7XG4gIGlmIChlb3MgPT09IHVuZGVmaW5lZCkgZW9zID0gcmVxdWlyZSgnLi9lbmQtb2Ytc3RyZWFtJyk7XG4gIGVvcyhzdHJlYW0sIHtcbiAgICByZWFkYWJsZTogcmVhZGluZyxcbiAgICB3cml0YWJsZTogd3JpdGluZ1xuICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgY2xvc2VkID0gdHJ1ZTtcbiAgICBjYWxsYmFjaygpO1xuICB9KTtcbiAgdmFyIGRlc3Ryb3llZCA9IGZhbHNlO1xuICByZXR1cm4gZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChjbG9zZWQpIHJldHVybjtcbiAgICBpZiAoZGVzdHJveWVkKSByZXR1cm47XG4gICAgZGVzdHJveWVkID0gdHJ1ZTtcblxuICAgIC8vIHJlcXVlc3QuZGVzdHJveSBqdXN0IGRvIC5lbmQgLSAuYWJvcnQgaXMgd2hhdCB3ZSB3YW50XG4gICAgaWYgKGlzUmVxdWVzdChzdHJlYW0pKSByZXR1cm4gc3RyZWFtLmFib3J0KCk7XG4gICAgaWYgKHR5cGVvZiBzdHJlYW0uZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIHN0cmVhbS5kZXN0cm95KCk7XG4gICAgY2FsbGJhY2soZXJyIHx8IG5ldyBFUlJfU1RSRUFNX0RFU1RST1lFRCgncGlwZScpKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNhbGwoZm4pIHtcbiAgZm4oKTtcbn1cbmZ1bmN0aW9uIHBpcGUoZnJvbSwgdG8pIHtcbiAgcmV0dXJuIGZyb20ucGlwZSh0byk7XG59XG5mdW5jdGlvbiBwb3BDYWxsYmFjayhzdHJlYW1zKSB7XG4gIGlmICghc3RyZWFtcy5sZW5ndGgpIHJldHVybiBub29wO1xuICBpZiAodHlwZW9mIHN0cmVhbXNbc3RyZWFtcy5sZW5ndGggLSAxXSAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG5vb3A7XG4gIHJldHVybiBzdHJlYW1zLnBvcCgpO1xufVxuZnVuY3Rpb24gcGlwZWxpbmUoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBzdHJlYW1zID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIHN0cmVhbXNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cbiAgdmFyIGNhbGxiYWNrID0gcG9wQ2FsbGJhY2soc3RyZWFtcyk7XG4gIGlmIChBcnJheS5pc0FycmF5KHN0cmVhbXNbMF0pKSBzdHJlYW1zID0gc3RyZWFtc1swXTtcbiAgaWYgKHN0cmVhbXMubGVuZ3RoIDwgMikge1xuICAgIHRocm93IG5ldyBFUlJfTUlTU0lOR19BUkdTKCdzdHJlYW1zJyk7XG4gIH1cbiAgdmFyIGVycm9yO1xuICB2YXIgZGVzdHJveXMgPSBzdHJlYW1zLm1hcChmdW5jdGlvbiAoc3RyZWFtLCBpKSB7XG4gICAgdmFyIHJlYWRpbmcgPSBpIDwgc3RyZWFtcy5sZW5ndGggLSAxO1xuICAgIHZhciB3cml0aW5nID0gaSA+IDA7XG4gICAgcmV0dXJuIGRlc3Ryb3llcihzdHJlYW0sIHJlYWRpbmcsIHdyaXRpbmcsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuICAgICAgaWYgKGVycikgZGVzdHJveXMuZm9yRWFjaChjYWxsKTtcbiAgICAgIGlmIChyZWFkaW5nKSByZXR1cm47XG4gICAgICBkZXN0cm95cy5mb3JFYWNoKGNhbGwpO1xuICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIHN0cmVhbXMucmVkdWNlKHBpcGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBwaXBlbGluZTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBFUlJfSU5WQUxJRF9PUFRfVkFMVUUgPSByZXF1aXJlKCcuLi8uLi8uLi9lcnJvcnMnKS5jb2Rlcy5FUlJfSU5WQUxJRF9PUFRfVkFMVUU7XG5mdW5jdGlvbiBoaWdoV2F0ZXJNYXJrRnJvbShvcHRpb25zLCBpc0R1cGxleCwgZHVwbGV4S2V5KSB7XG4gIHJldHVybiBvcHRpb25zLmhpZ2hXYXRlck1hcmsgIT0gbnVsbCA/IG9wdGlvbnMuaGlnaFdhdGVyTWFyayA6IGlzRHVwbGV4ID8gb3B0aW9uc1tkdXBsZXhLZXldIDogbnVsbDtcbn1cbmZ1bmN0aW9uIGdldEhpZ2hXYXRlck1hcmsoc3RhdGUsIG9wdGlvbnMsIGR1cGxleEtleSwgaXNEdXBsZXgpIHtcbiAgdmFyIGh3bSA9IGhpZ2hXYXRlck1hcmtGcm9tKG9wdGlvbnMsIGlzRHVwbGV4LCBkdXBsZXhLZXkpO1xuICBpZiAoaHdtICE9IG51bGwpIHtcbiAgICBpZiAoIShpc0Zpbml0ZShod20pICYmIE1hdGguZmxvb3IoaHdtKSA9PT0gaHdtKSB8fCBod20gPCAwKSB7XG4gICAgICB2YXIgbmFtZSA9IGlzRHVwbGV4ID8gZHVwbGV4S2V5IDogJ2hpZ2hXYXRlck1hcmsnO1xuICAgICAgdGhyb3cgbmV3IEVSUl9JTlZBTElEX09QVF9WQUxVRShuYW1lLCBod20pO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihod20pO1xuICB9XG5cbiAgLy8gRGVmYXVsdCB2YWx1ZVxuICByZXR1cm4gc3RhdGUub2JqZWN0TW9kZSA/IDE2IDogMTYgKiAxMDI0O1xufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEhpZ2hXYXRlck1hcms6IGdldEhpZ2hXYXRlck1hcmtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG4iLCIvKiEgc2FmZS1idWZmZXIuIE1JVCBMaWNlbnNlLiBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmcvb3BlbnNvdXJjZT4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vZGUvbm8tZGVwcmVjYXRlZC1hcGkgKi9cbnZhciBidWZmZXIgPSByZXF1aXJlKCdidWZmZXInKVxudmFyIEJ1ZmZlciA9IGJ1ZmZlci5CdWZmZXJcblxuLy8gYWx0ZXJuYXRpdmUgdG8gdXNpbmcgT2JqZWN0LmtleXMgZm9yIG9sZCBicm93c2Vyc1xuZnVuY3Rpb24gY29weVByb3BzIChzcmMsIGRzdCkge1xuICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgZHN0W2tleV0gPSBzcmNba2V5XVxuICB9XG59XG5pZiAoQnVmZmVyLmZyb20gJiYgQnVmZmVyLmFsbG9jICYmIEJ1ZmZlci5hbGxvY1Vuc2FmZSAmJiBCdWZmZXIuYWxsb2NVbnNhZmVTbG93KSB7XG4gIG1vZHVsZS5leHBvcnRzID0gYnVmZmVyXG59IGVsc2Uge1xuICAvLyBDb3B5IHByb3BlcnRpZXMgZnJvbSByZXF1aXJlKCdidWZmZXInKVxuICBjb3B5UHJvcHMoYnVmZmVyLCBleHBvcnRzKVxuICBleHBvcnRzLkJ1ZmZlciA9IFNhZmVCdWZmZXJcbn1cblxuZnVuY3Rpb24gU2FmZUJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuU2FmZUJ1ZmZlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEJ1ZmZlci5wcm90b3R5cGUpXG5cbi8vIENvcHkgc3RhdGljIG1ldGhvZHMgZnJvbSBCdWZmZXJcbmNvcHlQcm9wcyhCdWZmZXIsIFNhZmVCdWZmZXIpXG5cblNhZmVCdWZmZXIuZnJvbSA9IGZ1bmN0aW9uIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuU2FmZUJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgdmFyIGJ1ZiA9IEJ1ZmZlcihzaXplKVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1Zi5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICBidWYuZmlsbChmaWxsKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBidWYuZmlsbCgwKVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuU2FmZUJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuICByZXR1cm4gQnVmZmVyKHNpemUpXG59XG5cblNhZmVCdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHJldHVybiBidWZmZXIuU2xvd0J1ZmZlcihzaXplKVxufVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RyZWFtO1xuXG52YXIgRUUgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5pbmhlcml0cyhTdHJlYW0sIEVFKTtcblN0cmVhbS5SZWFkYWJsZSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9yZWFkYWJsZS5qcycpO1xuU3RyZWFtLldyaXRhYmxlID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzJyk7XG5TdHJlYW0uRHVwbGV4ID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX2R1cGxleC5qcycpO1xuU3RyZWFtLlRyYW5zZm9ybSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV90cmFuc2Zvcm0uanMnKTtcblN0cmVhbS5QYXNzVGhyb3VnaCA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9wYXNzdGhyb3VnaC5qcycpO1xuU3RyZWFtLmZpbmlzaGVkID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2xpYi9pbnRlcm5hbC9zdHJlYW1zL2VuZC1vZi1zdHJlYW0uanMnKVxuU3RyZWFtLnBpcGVsaW5lID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2xpYi9pbnRlcm5hbC9zdHJlYW1zL3BpcGVsaW5lLmpzJylcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC40LnhcblN0cmVhbS5TdHJlYW0gPSBTdHJlYW07XG5cblxuXG4vLyBvbGQtc3R5bGUgc3RyZWFtcy4gIE5vdGUgdGhhdCB0aGUgcGlwZSBtZXRob2QgKHRoZSBvbmx5IHJlbGV2YW50XG4vLyBwYXJ0IG9mIHRoaXMgY2xhc3MpIGlzIG92ZXJyaWRkZW4gaW4gdGhlIFJlYWRhYmxlIGNsYXNzLlxuXG5mdW5jdGlvbiBTdHJlYW0oKSB7XG4gIEVFLmNhbGwodGhpcyk7XG59XG5cblN0cmVhbS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uKGRlc3QsIG9wdGlvbnMpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXM7XG5cbiAgZnVuY3Rpb24gb25kYXRhKGNodW5rKSB7XG4gICAgaWYgKGRlc3Qud3JpdGFibGUpIHtcbiAgICAgIGlmIChmYWxzZSA9PT0gZGVzdC53cml0ZShjaHVuaykgJiYgc291cmNlLnBhdXNlKSB7XG4gICAgICAgIHNvdXJjZS5wYXVzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNvdXJjZS5vbignZGF0YScsIG9uZGF0YSk7XG5cbiAgZnVuY3Rpb24gb25kcmFpbigpIHtcbiAgICBpZiAoc291cmNlLnJlYWRhYmxlICYmIHNvdXJjZS5yZXN1bWUpIHtcbiAgICAgIHNvdXJjZS5yZXN1bWUoKTtcbiAgICB9XG4gIH1cblxuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gIC8vIElmIHRoZSAnZW5kJyBvcHRpb24gaXMgbm90IHN1cHBsaWVkLCBkZXN0LmVuZCgpIHdpbGwgYmUgY2FsbGVkIHdoZW5cbiAgLy8gc291cmNlIGdldHMgdGhlICdlbmQnIG9yICdjbG9zZScgZXZlbnRzLiAgT25seSBkZXN0LmVuZCgpIG9uY2UuXG4gIGlmICghZGVzdC5faXNTdGRpbyAmJiAoIW9wdGlvbnMgfHwgb3B0aW9ucy5lbmQgIT09IGZhbHNlKSkge1xuICAgIHNvdXJjZS5vbignZW5kJywgb25lbmQpO1xuICAgIHNvdXJjZS5vbignY2xvc2UnLCBvbmNsb3NlKTtcbiAgfVxuXG4gIHZhciBkaWRPbkVuZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBvbmVuZCgpIHtcbiAgICBpZiAoZGlkT25FbmQpIHJldHVybjtcbiAgICBkaWRPbkVuZCA9IHRydWU7XG5cbiAgICBkZXN0LmVuZCgpO1xuICB9XG5cblxuICBmdW5jdGlvbiBvbmNsb3NlKCkge1xuICAgIGlmIChkaWRPbkVuZCkgcmV0dXJuO1xuICAgIGRpZE9uRW5kID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgZGVzdC5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSBkZXN0LmRlc3Ryb3koKTtcbiAgfVxuXG4gIC8vIGRvbid0IGxlYXZlIGRhbmdsaW5nIHBpcGVzIHdoZW4gdGhlcmUgYXJlIGVycm9ycy5cbiAgZnVuY3Rpb24gb25lcnJvcihlcikge1xuICAgIGNsZWFudXAoKTtcbiAgICBpZiAoRUUubGlzdGVuZXJDb3VudCh0aGlzLCAnZXJyb3InKSA9PT0gMCkge1xuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCBzdHJlYW0gZXJyb3IgaW4gcGlwZS5cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2Vycm9yJywgb25lcnJvcik7XG4gIGRlc3Qub24oJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgLy8gcmVtb3ZlIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZC5cbiAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2RhdGEnLCBvbmRhdGEpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2RyYWluJywgb25kcmFpbik7XG5cbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG5cbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZW5kJywgY2xlYW51cCk7XG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsZWFudXApO1xuXG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGVhbnVwKTtcbiAgfVxuXG4gIHNvdXJjZS5vbignZW5kJywgY2xlYW51cCk7XG4gIHNvdXJjZS5vbignY2xvc2UnLCBjbGVhbnVwKTtcblxuICBkZXN0Lm9uKCdjbG9zZScsIGNsZWFudXApO1xuXG4gIGRlc3QuZW1pdCgncGlwZScsIHNvdXJjZSk7XG5cbiAgLy8gQWxsb3cgZm9yIHVuaXgtbGlrZSB1c2FnZTogQS5waXBlKEIpLnBpcGUoQylcbiAgcmV0dXJuIGRlc3Q7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBpc0VuY29kaW5nID0gQnVmZmVyLmlzRW5jb2RpbmcgfHwgZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIGVuY29kaW5nID0gJycgKyBlbmNvZGluZztcbiAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpjYXNlICd1dGY4JzpjYXNlICd1dGYtOCc6Y2FzZSAnYXNjaWknOmNhc2UgJ2JpbmFyeSc6Y2FzZSAnYmFzZTY0JzpjYXNlICd1Y3MyJzpjYXNlICd1Y3MtMic6Y2FzZSAndXRmMTZsZSc6Y2FzZSAndXRmLTE2bGUnOmNhc2UgJ3Jhdyc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfbm9ybWFsaXplRW5jb2RpbmcoZW5jKSB7XG4gIGlmICghZW5jKSByZXR1cm4gJ3V0ZjgnO1xuICB2YXIgcmV0cmllZDtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuYykge1xuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiAndXRmOCc7XG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gJ3V0ZjE2bGUnO1xuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiAnbGF0aW4xJztcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gZW5jO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHJldHJpZWQpIHJldHVybjsgLy8gdW5kZWZpbmVkXG4gICAgICAgIGVuYyA9ICgnJyArIGVuYykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0cmllZCA9IHRydWU7XG4gICAgfVxuICB9XG59O1xuXG4vLyBEbyBub3QgY2FjaGUgYEJ1ZmZlci5pc0VuY29kaW5nYCB3aGVuIGNoZWNraW5nIGVuY29kaW5nIG5hbWVzIGFzIHNvbWVcbi8vIG1vZHVsZXMgbW9ua2V5LXBhdGNoIGl0IHRvIHN1cHBvcnQgYWRkaXRpb25hbCBlbmNvZGluZ3NcbmZ1bmN0aW9uIG5vcm1hbGl6ZUVuY29kaW5nKGVuYykge1xuICB2YXIgbmVuYyA9IF9ub3JtYWxpemVFbmNvZGluZyhlbmMpO1xuICBpZiAodHlwZW9mIG5lbmMgIT09ICdzdHJpbmcnICYmIChCdWZmZXIuaXNFbmNvZGluZyA9PT0gaXNFbmNvZGluZyB8fCAhaXNFbmNvZGluZyhlbmMpKSkgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jKTtcbiAgcmV0dXJuIG5lbmMgfHwgZW5jO1xufVxuXG4vLyBTdHJpbmdEZWNvZGVyIHByb3ZpZGVzIGFuIGludGVyZmFjZSBmb3IgZWZmaWNpZW50bHkgc3BsaXR0aW5nIGEgc2VyaWVzIG9mXG4vLyBidWZmZXJzIGludG8gYSBzZXJpZXMgb2YgSlMgc3RyaW5ncyB3aXRob3V0IGJyZWFraW5nIGFwYXJ0IG11bHRpLWJ5dGVcbi8vIGNoYXJhY3RlcnMuXG5leHBvcnRzLlN0cmluZ0RlY29kZXIgPSBTdHJpbmdEZWNvZGVyO1xuZnVuY3Rpb24gU3RyaW5nRGVjb2RlcihlbmNvZGluZykge1xuICB0aGlzLmVuY29kaW5nID0gbm9ybWFsaXplRW5jb2RpbmcoZW5jb2RpbmcpO1xuICB2YXIgbmI7XG4gIHN3aXRjaCAodGhpcy5lbmNvZGluZykge1xuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgdGhpcy50ZXh0ID0gdXRmMTZUZXh0O1xuICAgICAgdGhpcy5lbmQgPSB1dGYxNkVuZDtcbiAgICAgIG5iID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgdGhpcy5maWxsTGFzdCA9IHV0ZjhGaWxsTGFzdDtcbiAgICAgIG5iID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICB0aGlzLnRleHQgPSBiYXNlNjRUZXh0O1xuICAgICAgdGhpcy5lbmQgPSBiYXNlNjRFbmQ7XG4gICAgICBuYiA9IDM7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy53cml0ZSA9IHNpbXBsZVdyaXRlO1xuICAgICAgdGhpcy5lbmQgPSBzaW1wbGVFbmQ7XG4gICAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5sYXN0TmVlZCA9IDA7XG4gIHRoaXMubGFzdFRvdGFsID0gMDtcbiAgdGhpcy5sYXN0Q2hhciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShuYik7XG59XG5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGJ1Zikge1xuICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xuICB2YXIgcjtcbiAgdmFyIGk7XG4gIGlmICh0aGlzLmxhc3ROZWVkKSB7XG4gICAgciA9IHRoaXMuZmlsbExhc3QoYnVmKTtcbiAgICBpZiAociA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XG4gICAgaSA9IHRoaXMubGFzdE5lZWQ7XG4gICAgdGhpcy5sYXN0TmVlZCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgaSA9IDA7XG4gIH1cbiAgaWYgKGkgPCBidWYubGVuZ3RoKSByZXR1cm4gciA/IHIgKyB0aGlzLnRleHQoYnVmLCBpKSA6IHRoaXMudGV4dChidWYsIGkpO1xuICByZXR1cm4gciB8fCAnJztcbn07XG5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmVuZCA9IHV0ZjhFbmQ7XG5cbi8vIFJldHVybnMgb25seSBjb21wbGV0ZSBjaGFyYWN0ZXJzIGluIGEgQnVmZmVyXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS50ZXh0ID0gdXRmOFRleHQ7XG5cbi8vIEF0dGVtcHRzIHRvIGNvbXBsZXRlIGEgcGFydGlhbCBub24tVVRGLTggY2hhcmFjdGVyIHVzaW5nIGJ5dGVzIGZyb20gYSBCdWZmZXJcblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmZpbGxMYXN0ID0gZnVuY3Rpb24gKGJ1Zikge1xuICBpZiAodGhpcy5sYXN0TmVlZCA8PSBidWYubGVuZ3RoKSB7XG4gICAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkLCAwLCB0aGlzLmxhc3ROZWVkKTtcbiAgICByZXR1cm4gdGhpcy5sYXN0Q2hhci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCB0aGlzLmxhc3RUb3RhbCk7XG4gIH1cbiAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkLCAwLCBidWYubGVuZ3RoKTtcbiAgdGhpcy5sYXN0TmVlZCAtPSBidWYubGVuZ3RoO1xufTtcblxuLy8gQ2hlY2tzIHRoZSB0eXBlIG9mIGEgVVRGLTggYnl0ZSwgd2hldGhlciBpdCdzIEFTQ0lJLCBhIGxlYWRpbmcgYnl0ZSwgb3IgYVxuLy8gY29udGludWF0aW9uIGJ5dGUuIElmIGFuIGludmFsaWQgYnl0ZSBpcyBkZXRlY3RlZCwgLTIgaXMgcmV0dXJuZWQuXG5mdW5jdGlvbiB1dGY4Q2hlY2tCeXRlKGJ5dGUpIHtcbiAgaWYgKGJ5dGUgPD0gMHg3RikgcmV0dXJuIDA7ZWxzZSBpZiAoYnl0ZSA+PiA1ID09PSAweDA2KSByZXR1cm4gMjtlbHNlIGlmIChieXRlID4+IDQgPT09IDB4MEUpIHJldHVybiAzO2Vsc2UgaWYgKGJ5dGUgPj4gMyA9PT0gMHgxRSkgcmV0dXJuIDQ7XG4gIHJldHVybiBieXRlID4+IDYgPT09IDB4MDIgPyAtMSA6IC0yO1xufVxuXG4vLyBDaGVja3MgYXQgbW9zdCAzIGJ5dGVzIGF0IHRoZSBlbmQgb2YgYSBCdWZmZXIgaW4gb3JkZXIgdG8gZGV0ZWN0IGFuXG4vLyBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgVVRGLTggY2hhcmFjdGVyLiBUaGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzICgyLCAzLCBvciA0KVxuLy8gbmVlZGVkIHRvIGNvbXBsZXRlIHRoZSBVVEYtOCBjaGFyYWN0ZXIgKGlmIGFwcGxpY2FibGUpIGFyZSByZXR1cm5lZC5cbmZ1bmN0aW9uIHV0ZjhDaGVja0luY29tcGxldGUoc2VsZiwgYnVmLCBpKSB7XG4gIHZhciBqID0gYnVmLmxlbmd0aCAtIDE7XG4gIGlmIChqIDwgaSkgcmV0dXJuIDA7XG4gIHZhciBuYiA9IHV0ZjhDaGVja0J5dGUoYnVmW2pdKTtcbiAgaWYgKG5iID49IDApIHtcbiAgICBpZiAobmIgPiAwKSBzZWxmLmxhc3ROZWVkID0gbmIgLSAxO1xuICAgIHJldHVybiBuYjtcbiAgfVxuICBpZiAoLS1qIDwgaSB8fCBuYiA9PT0gLTIpIHJldHVybiAwO1xuICBuYiA9IHV0ZjhDaGVja0J5dGUoYnVmW2pdKTtcbiAgaWYgKG5iID49IDApIHtcbiAgICBpZiAobmIgPiAwKSBzZWxmLmxhc3ROZWVkID0gbmIgLSAyO1xuICAgIHJldHVybiBuYjtcbiAgfVxuICBpZiAoLS1qIDwgaSB8fCBuYiA9PT0gLTIpIHJldHVybiAwO1xuICBuYiA9IHV0ZjhDaGVja0J5dGUoYnVmW2pdKTtcbiAgaWYgKG5iID49IDApIHtcbiAgICBpZiAobmIgPiAwKSB7XG4gICAgICBpZiAobmIgPT09IDIpIG5iID0gMDtlbHNlIHNlbGYubGFzdE5lZWQgPSBuYiAtIDM7XG4gICAgfVxuICAgIHJldHVybiBuYjtcbiAgfVxuICByZXR1cm4gMDtcbn1cblxuLy8gVmFsaWRhdGVzIGFzIG1hbnkgY29udGludWF0aW9uIGJ5dGVzIGZvciBhIG11bHRpLWJ5dGUgVVRGLTggY2hhcmFjdGVyIGFzXG4vLyBuZWVkZWQgb3IgYXJlIGF2YWlsYWJsZS4gSWYgd2Ugc2VlIGEgbm9uLWNvbnRpbnVhdGlvbiBieXRlIHdoZXJlIHdlIGV4cGVjdFxuLy8gb25lLCB3ZSBcInJlcGxhY2VcIiB0aGUgdmFsaWRhdGVkIGNvbnRpbnVhdGlvbiBieXRlcyB3ZSd2ZSBzZWVuIHNvIGZhciB3aXRoXG4vLyBhIHNpbmdsZSBVVEYtOCByZXBsYWNlbWVudCBjaGFyYWN0ZXIgKCdcXHVmZmZkJyksIHRvIG1hdGNoIHY4J3MgVVRGLTggZGVjb2Rpbmdcbi8vIGJlaGF2aW9yLiBUaGUgY29udGludWF0aW9uIGJ5dGUgY2hlY2sgaXMgaW5jbHVkZWQgdGhyZWUgdGltZXMgaW4gdGhlIGNhc2Vcbi8vIHdoZXJlIGFsbCBvZiB0aGUgY29udGludWF0aW9uIGJ5dGVzIGZvciBhIGNoYXJhY3RlciBleGlzdCBpbiB0aGUgc2FtZSBidWZmZXIuXG4vLyBJdCBpcyBhbHNvIGRvbmUgdGhpcyB3YXkgYXMgYSBzbGlnaHQgcGVyZm9ybWFuY2UgaW5jcmVhc2UgaW5zdGVhZCBvZiB1c2luZyBhXG4vLyBsb29wLlxuZnVuY3Rpb24gdXRmOENoZWNrRXh0cmFCeXRlcyhzZWxmLCBidWYsIHApIHtcbiAgaWYgKChidWZbMF0gJiAweEMwKSAhPT0gMHg4MCkge1xuICAgIHNlbGYubGFzdE5lZWQgPSAwO1xuICAgIHJldHVybiAnXFx1ZmZmZCc7XG4gIH1cbiAgaWYgKHNlbGYubGFzdE5lZWQgPiAxICYmIGJ1Zi5sZW5ndGggPiAxKSB7XG4gICAgaWYgKChidWZbMV0gJiAweEMwKSAhPT0gMHg4MCkge1xuICAgICAgc2VsZi5sYXN0TmVlZCA9IDE7XG4gICAgICByZXR1cm4gJ1xcdWZmZmQnO1xuICAgIH1cbiAgICBpZiAoc2VsZi5sYXN0TmVlZCA+IDIgJiYgYnVmLmxlbmd0aCA+IDIpIHtcbiAgICAgIGlmICgoYnVmWzJdICYgMHhDMCkgIT09IDB4ODApIHtcbiAgICAgICAgc2VsZi5sYXN0TmVlZCA9IDI7XG4gICAgICAgIHJldHVybiAnXFx1ZmZmZCc7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIEF0dGVtcHRzIHRvIGNvbXBsZXRlIGEgbXVsdGktYnl0ZSBVVEYtOCBjaGFyYWN0ZXIgdXNpbmcgYnl0ZXMgZnJvbSBhIEJ1ZmZlci5cbmZ1bmN0aW9uIHV0ZjhGaWxsTGFzdChidWYpIHtcbiAgdmFyIHAgPSB0aGlzLmxhc3RUb3RhbCAtIHRoaXMubGFzdE5lZWQ7XG4gIHZhciByID0gdXRmOENoZWNrRXh0cmFCeXRlcyh0aGlzLCBidWYsIHApO1xuICBpZiAociAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcjtcbiAgaWYgKHRoaXMubGFzdE5lZWQgPD0gYnVmLmxlbmd0aCkge1xuICAgIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIHAsIDAsIHRoaXMubGFzdE5lZWQpO1xuICAgIHJldHVybiB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsIDAsIHRoaXMubGFzdFRvdGFsKTtcbiAgfVxuICBidWYuY29weSh0aGlzLmxhc3RDaGFyLCBwLCAwLCBidWYubGVuZ3RoKTtcbiAgdGhpcy5sYXN0TmVlZCAtPSBidWYubGVuZ3RoO1xufVxuXG4vLyBSZXR1cm5zIGFsbCBjb21wbGV0ZSBVVEYtOCBjaGFyYWN0ZXJzIGluIGEgQnVmZmVyLiBJZiB0aGUgQnVmZmVyIGVuZGVkIG9uIGFcbi8vIHBhcnRpYWwgY2hhcmFjdGVyLCB0aGUgY2hhcmFjdGVyJ3MgYnl0ZXMgYXJlIGJ1ZmZlcmVkIHVudGlsIHRoZSByZXF1aXJlZFxuLy8gbnVtYmVyIG9mIGJ5dGVzIGFyZSBhdmFpbGFibGUuXG5mdW5jdGlvbiB1dGY4VGV4dChidWYsIGkpIHtcbiAgdmFyIHRvdGFsID0gdXRmOENoZWNrSW5jb21wbGV0ZSh0aGlzLCBidWYsIGkpO1xuICBpZiAoIXRoaXMubGFzdE5lZWQpIHJldHVybiBidWYudG9TdHJpbmcoJ3V0ZjgnLCBpKTtcbiAgdGhpcy5sYXN0VG90YWwgPSB0b3RhbDtcbiAgdmFyIGVuZCA9IGJ1Zi5sZW5ndGggLSAodG90YWwgLSB0aGlzLmxhc3ROZWVkKTtcbiAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgMCwgZW5kKTtcbiAgcmV0dXJuIGJ1Zi50b1N0cmluZygndXRmOCcsIGksIGVuZCk7XG59XG5cbi8vIEZvciBVVEYtOCwgYSByZXBsYWNlbWVudCBjaGFyYWN0ZXIgaXMgYWRkZWQgd2hlbiBlbmRpbmcgb24gYSBwYXJ0aWFsXG4vLyBjaGFyYWN0ZXIuXG5mdW5jdGlvbiB1dGY4RW5kKGJ1Zikge1xuICB2YXIgciA9IGJ1ZiAmJiBidWYubGVuZ3RoID8gdGhpcy53cml0ZShidWYpIDogJyc7XG4gIGlmICh0aGlzLmxhc3ROZWVkKSByZXR1cm4gciArICdcXHVmZmZkJztcbiAgcmV0dXJuIHI7XG59XG5cbi8vIFVURi0xNkxFIHR5cGljYWxseSBuZWVkcyB0d28gYnl0ZXMgcGVyIGNoYXJhY3RlciwgYnV0IGV2ZW4gaWYgd2UgaGF2ZSBhbiBldmVuXG4vLyBudW1iZXIgb2YgYnl0ZXMgYXZhaWxhYmxlLCB3ZSBuZWVkIHRvIGNoZWNrIGlmIHdlIGVuZCBvbiBhIGxlYWRpbmcvaGlnaFxuLy8gc3Vycm9nYXRlLiBJbiB0aGF0IGNhc2UsIHdlIG5lZWQgdG8gd2FpdCBmb3IgdGhlIG5leHQgdHdvIGJ5dGVzIGluIG9yZGVyIHRvXG4vLyBkZWNvZGUgdGhlIGxhc3QgY2hhcmFjdGVyIHByb3Blcmx5LlxuZnVuY3Rpb24gdXRmMTZUZXh0KGJ1ZiwgaSkge1xuICBpZiAoKGJ1Zi5sZW5ndGggLSBpKSAlIDIgPT09IDApIHtcbiAgICB2YXIgciA9IGJ1Zi50b1N0cmluZygndXRmMTZsZScsIGkpO1xuICAgIGlmIChyKSB7XG4gICAgICB2YXIgYyA9IHIuY2hhckNvZGVBdChyLmxlbmd0aCAtIDEpO1xuICAgICAgaWYgKGMgPj0gMHhEODAwICYmIGMgPD0gMHhEQkZGKSB7XG4gICAgICAgIHRoaXMubGFzdE5lZWQgPSAyO1xuICAgICAgICB0aGlzLmxhc3RUb3RhbCA9IDQ7XG4gICAgICAgIHRoaXMubGFzdENoYXJbMF0gPSBidWZbYnVmLmxlbmd0aCAtIDJdO1xuICAgICAgICB0aGlzLmxhc3RDaGFyWzFdID0gYnVmW2J1Zi5sZW5ndGggLSAxXTtcbiAgICAgICAgcmV0dXJuIHIuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfVxuICB0aGlzLmxhc3ROZWVkID0gMTtcbiAgdGhpcy5sYXN0VG90YWwgPSAyO1xuICB0aGlzLmxhc3RDaGFyWzBdID0gYnVmW2J1Zi5sZW5ndGggLSAxXTtcbiAgcmV0dXJuIGJ1Zi50b1N0cmluZygndXRmMTZsZScsIGksIGJ1Zi5sZW5ndGggLSAxKTtcbn1cblxuLy8gRm9yIFVURi0xNkxFIHdlIGRvIG5vdCBleHBsaWNpdGx5IGFwcGVuZCBzcGVjaWFsIHJlcGxhY2VtZW50IGNoYXJhY3RlcnMgaWYgd2Vcbi8vIGVuZCBvbiBhIHBhcnRpYWwgY2hhcmFjdGVyLCB3ZSBzaW1wbHkgbGV0IHY4IGhhbmRsZSB0aGF0LlxuZnVuY3Rpb24gdXRmMTZFbmQoYnVmKSB7XG4gIHZhciByID0gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiAnJztcbiAgaWYgKHRoaXMubGFzdE5lZWQpIHtcbiAgICB2YXIgZW5kID0gdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkO1xuICAgIHJldHVybiByICsgdGhpcy5sYXN0Q2hhci50b1N0cmluZygndXRmMTZsZScsIDAsIGVuZCk7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRleHQoYnVmLCBpKSB7XG4gIHZhciBuID0gKGJ1Zi5sZW5ndGggLSBpKSAlIDM7XG4gIGlmIChuID09PSAwKSByZXR1cm4gYnVmLnRvU3RyaW5nKCdiYXNlNjQnLCBpKTtcbiAgdGhpcy5sYXN0TmVlZCA9IDMgLSBuO1xuICB0aGlzLmxhc3RUb3RhbCA9IDM7XG4gIGlmIChuID09PSAxKSB7XG4gICAgdGhpcy5sYXN0Q2hhclswXSA9IGJ1ZltidWYubGVuZ3RoIC0gMV07XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5sYXN0Q2hhclswXSA9IGJ1ZltidWYubGVuZ3RoIC0gMl07XG4gICAgdGhpcy5sYXN0Q2hhclsxXSA9IGJ1ZltidWYubGVuZ3RoIC0gMV07XG4gIH1cbiAgcmV0dXJuIGJ1Zi50b1N0cmluZygnYmFzZTY0JywgaSwgYnVmLmxlbmd0aCAtIG4pO1xufVxuXG5mdW5jdGlvbiBiYXNlNjRFbmQoYnVmKSB7XG4gIHZhciByID0gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiAnJztcbiAgaWYgKHRoaXMubGFzdE5lZWQpIHJldHVybiByICsgdGhpcy5sYXN0Q2hhci50b1N0cmluZygnYmFzZTY0JywgMCwgMyAtIHRoaXMubGFzdE5lZWQpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gUGFzcyBieXRlcyBvbiB0aHJvdWdoIGZvciBzaW5nbGUtYnl0ZSBlbmNvZGluZ3MgKGUuZy4gYXNjaWksIGxhdGluMSwgaGV4KVxuZnVuY3Rpb24gc2ltcGxlV3JpdGUoYnVmKSB7XG4gIHJldHVybiBidWYudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG59XG5cbmZ1bmN0aW9uIHNpbXBsZUVuZChidWYpIHtcbiAgcmV0dXJuIGJ1ZiAmJiBidWYubGVuZ3RoID8gdGhpcy53cml0ZShidWYpIDogJyc7XG59IiwidmFyIHNjb3BlID0gKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsKSB8fFxuICAgICAgICAgICAgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYpIHx8XG4gICAgICAgICAgICB3aW5kb3c7XG52YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCBzY29wZSwgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCBzY29wZSwgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbChzY29wZSwgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG4vLyBPbiBzb21lIGV4b3RpYyBlbnZpcm9ubWVudHMsIGl0J3Mgbm90IGNsZWFyIHdoaWNoIG9iamVjdCBgc2V0aW1tZWRpYXRlYCB3YXNcbi8vIGFibGUgdG8gaW5zdGFsbCBvbnRvLiAgU2VhcmNoIGVhY2ggcG9zc2liaWxpdHkgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlXG4vLyBgc2V0aW1tZWRpYXRlYCBsaWJyYXJ5LlxuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuc2V0SW1tZWRpYXRlKTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5jbGVhckltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgJiYgdGhpcy5jbGVhckltbWVkaWF0ZSk7XG4iLCJcbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBkZXByZWNhdGU7XG5cbi8qKlxuICogTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbiAqIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4gKlxuICogSWYgYGxvY2FsU3RvcmFnZS5ub0RlcHJlY2F0aW9uID0gdHJ1ZWAgaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG4gKlxuICogSWYgYGxvY2FsU3RvcmFnZS50aHJvd0RlcHJlY2F0aW9uID0gdHJ1ZWAgaXMgc2V0LCB0aGVuIGRlcHJlY2F0ZWQgZnVuY3Rpb25zXG4gKiB3aWxsIHRocm93IGFuIEVycm9yIHdoZW4gaW52b2tlZC5cbiAqXG4gKiBJZiBgbG9jYWxTdG9yYWdlLnRyYWNlRGVwcmVjYXRpb24gPSB0cnVlYCBpcyBzZXQsIHRoZW4gZGVwcmVjYXRlZCBmdW5jdGlvbnNcbiAqIHdpbGwgaW52b2tlIGBjb25zb2xlLnRyYWNlKClgIGluc3RlYWQgb2YgYGNvbnNvbGUuZXJyb3IoKWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gLSB0aGUgZnVuY3Rpb24gdG8gZGVwcmVjYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gbXNnIC0gdGhlIHN0cmluZyB0byBwcmludCB0byB0aGUgY29uc29sZSB3aGVuIGBmbmAgaXMgaW52b2tlZFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBhIG5ldyBcImRlcHJlY2F0ZWRcIiB2ZXJzaW9uIG9mIGBmbmBcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVwcmVjYXRlIChmbiwgbXNnKSB7XG4gIGlmIChjb25maWcoJ25vRGVwcmVjYXRpb24nKSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKGNvbmZpZygndGhyb3dEZXByZWNhdGlvbicpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChjb25maWcoJ3RyYWNlRGVwcmVjYXRpb24nKSkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGBsb2NhbFN0b3JhZ2VgIGZvciBib29sZWFuIHZhbHVlcyBmb3IgdGhlIGdpdmVuIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb25maWcgKG5hbWUpIHtcbiAgLy8gYWNjZXNzaW5nIGdsb2JhbC5sb2NhbFN0b3JhZ2UgY2FuIHRyaWdnZXIgYSBET01FeGNlcHRpb24gaW4gc2FuZGJveGVkIGlmcmFtZXNcbiAgdHJ5IHtcbiAgICBpZiAoIWdsb2JhbC5sb2NhbFN0b3JhZ2UpIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdmFsID0gZ2xvYmFsLmxvY2FsU3RvcmFnZVtuYW1lXTtcbiAgaWYgKG51bGwgPT0gdmFsKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBTdHJpbmcodmFsKS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG59XG4iLCJcbmNvbnN0IFNUQVIgPSBgOyBVbmludGVudGlvbmFsbHkgdXBzaWRlLWRvd24gc3Rhci5cbkcyMVxuRzkwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI3BhdGg5XG5HMCBYOTcuMjg4NDQxIFkyNzEuODY3MTUxXG5HMSBYNzAuODA0MzY4IFkxOTIuMTQ0NjkgRjMwMFxuRzEgWDEzOS40NDY3NiBZMjQxLjMyOTM5NiBGMzAwXG5HMSBYNTQuODU5ODczIFkyNDEuMzI5Mzk2IEYzMDBcbkcxIFgxMjQuMDQyNzU5OTk5OTk5OTkgWTE5Mi4xNDQ2OSBGMzAwXG5HMSBYOTcuMjg4NDQxIFkyNzEuODY3MTUxIEYzMDBcbk0yXG5gXG5cbmNvbnN0IENJUkNMRVMgPSBgOyBDaXJjbGUgcGF0dGVyblxuRzIxXG5HOTA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjcGF0aDFcbkcwIFgzNi41ODE3NDQgWTI3Ny42NzA1NjRcbkcxIFgzNi4xODMyMDcyNDU2NDIyMTUgWTI3NC4zOTQyODk3MDUwOTk1IEYzMDBcbkcxIFgzNS4wMTA4NDIyMTI0MTkyMzQgWTI3MS4zMDkxMDQ5NDA5NjA0IEYzMDBcbkcxIFgzMy4xMzMwMjczNjc5MjQ1MzQgWTI2OC41OTQ5NTM4Mzc5ODI2NCBGMzAwXG5HMSBYMzAuNjU5Mjg2NzA2NjkyMzcgWTI2Ni40MTAxMzk5MDA2MDM0NCBGMzAwXG5HMSBYMjcuNzMzOTAxNzM3MzM1ODg0IFkyNjQuODgyMDkyOTE3OTkzNTMgRjMwMFxuRzEgWDI0LjUyNzQ5NjIyOTQ2MzUxNiBZMjY0LjA5OTkzNjU5MTQ5MjQgRjMwMFxuRzEgWDIyLjkxNTczOTAwMDAwMDAwMiBZMjY0LjAwNDU1OSBGMzAwXG5HMSBYMTkuNjM5NDY0NjM1MTA5MTkyIFkyNjQuNDAzMDk1MTc4OTg0MjQgRjMwMFxuRzEgWDE2LjU1NDI3OTY2NTA4MTQ0IFkyNjUuNTc1NDU5NjcwMzkyNSBGMzAwXG5HMSBYMTMuODQwMTI4MjMyMzI1MTg3IFkyNjcuNDUzMjc0MDM4MjMyNyBGMzAwXG5HMSBYMTEuNjU1MzEzODYwNTEyMDA2IFkyNjkuOTI3MDE0MzE1NzcxNjYgRjMwMFxuRzEgWDEwLjEyNzI2NjM2NDE1MTE3NCBZMjcyLjg1MjM5OTAxNjc3NTE3IEYzMDBcbkcxIFg5LjM0NTEwOTQ3NDU0Njc0OCBZMjc2LjA1ODgwNDM4NzI4NjU2IEYzMDBcbkcxIFg5LjI0OTczMTYgWTI3Ny42NzA1NjQgRjMwMFxuRzEgWDkuNjQ4MjY4NTIyMTc1MDc1IFkyODAuOTQ2ODM4Mjc0NDg2NjUgRjMwMFxuRzEgWDEwLjgyMDYzMzcxMzQyNzM2MiBZMjg0LjAzMjAyMjk3ODU3NDkgRjMwMFxuRzEgWDEyLjY5ODQ0ODY5Njk0NjI2NyBZMjg2Ljc0NjE3Mzk4NTM2NzIgRjMwMFxuRzEgWDE1LjE3MjE4OTQ3MDA4ODk2IFkyODguOTMwOTg3Nzk2MDM2NSBGMzAwXG5HMSBYMTguMDk3NTc0NTE3NzE1MDUgWTI5MC40NTkwMzQ2Mjg4MDI0IEYzMDBcbkcxIFgyMS4zMDM5ODAwNjU2NTA5OTMgWTI5MS4yNDExOTA3OTEwNjUwNCBGMzAwXG5HMSBYMjIuOTE1NzM4OTk5OTk5OTkgWTI5MS4zMzY1NjgyOTk5OTk5NSBGMzAwXG5HMSBYMjYuMTkyMDEzMjk0OTAwNTEyIFkyOTAuOTM4MDMxNTQ1NjQyMiBGMzAwXG5HMSBYMjkuMjc3MTk4MDU5MDM5NjI3IFkyODkuNzY1NjY2NTEyNDE5MiBGMzAwXG5HMSBYMzEuOTkxMzQ5MTYyMDE3MzkgWTI4Ny44ODc4NTE2Njc5MjQ1NiBGMzAwXG5HMSBYMzQuMTc2MTYzMDk5Mzk2NjMgWTI4NS40MTQxMTEwMDY2OTI0IEYzMDBcbkcxIFgzNS43MDQyMTAwODIwMDY1MiBZMjgyLjQ4ODcyNjAzNzMzNTk0IEYzMDBcbkcxIFgzNi40ODYzNjY0MDg1MDc2NyBZMjc5LjI4MjMyMDUyOTQ2MzU2IEYzMDBcbkcxIFgzNi41ODE3NDQgWTI3Ny42NzA1NjQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUxXG5HMCBYNjAuMTkyOTIyIFkyNzcuNjcwNTY0XG5HMSBYNTkuNzk0Mzg1MjQ1NjQyMjIgWTI3NC4zOTQyODk3MDUwOTk1NCBGMzAwXG5HMSBYNTguNjIyMDIwMjEyNDE5MjQgWTI3MS4zMDkxMDQ5NDA5NjA0IEYzMDBcbkcxIFg1Ni43NDQyMDUzNjc5MjQ1MzYgWTI2OC41OTQ5NTM4Mzc5ODI2NCBGMzAwXG5HMSBYNTQuMjcwNDY0NzA2NjkyMzcgWTI2Ni40MTAxMzk5MDA2MDM0NCBGMzAwXG5HMSBYNTEuMzQ1MDc5NzM3MzM1ODkgWTI2NC44ODIwOTI5MTc5OTM1MyBGMzAwXG5HMSBYNDguMTM4Njc0MjI5NDYzNTIgWTI2NC4wOTk5MzY1OTE0OTI0IEYzMDBcbkcxIFg0Ni41MjY5MTcgWTI2NC4wMDQ1NTkgRjMwMFxuRzEgWDQzLjI1MDY0MjYxNzYxMTY2IFkyNjQuNDAzMDk1MDM1MTQwODQgRjMwMFxuRzEgWDQwLjE2NTQ1NzU5NjExMTc2IFkyNjUuNTc1NDU5MzkxMDk1MzYgRjMwMFxuRzEgWDM3LjQ1MTMwNjA4MDkxMDkgWTI2Ny40NTMyNzM2Mzk3NzE5NiBGMzAwXG5HMSBYMzUuMjY2NDkxNjAwNDg5MjIgWTI2OS45MjcwMTM4MjEzODc2IEYzMDBcbkcxIFgzMy43Mzg0NDM5NzU2OTA2NiBZMjcyLjg1MjM5ODQ1NTMwMjkgRjMwMFxuRzEgWDMyLjk1NjI4Njk0NTMxMDQgWTI3Ni4wNTg4MDM3OTE0NzQgRjMwMFxuRzEgWDMyLjg2MDkwODk5OTk5OTk5IFkyNzcuNjcwNTY0IEYzMDBcbkcxIFgzMy4yNTk0NDU5MjIxNzUwNTQgWTI4MC45NDY4MzgyNzQ0ODY3IEYzMDBcbkcxIFgzNC40MzE4MTExMTM0MjczMiBZMjg0LjAzMjAyMjk3ODU3NDk2IEYzMDBcbkcxIFgzNi4zMDk2MjYwOTY5NDYyMiBZMjg2Ljc0NjE3Mzk4NTM2NzI1IEYzMDBcbkcxIFgzOC43ODMzNjY4NzAwODg5IFkyODguOTMwOTg3Nzk2MDM2NiBGMzAwXG5HMSBYNDEuNzA4NzUxOTE3NzE0OTU2IFkyOTAuNDU5MDM0NjI4ODAyNDQgRjMwMFxuRzEgWDQ0LjkxNTE1NzQ2NTY1MDkxNCBZMjkxLjI0MTE5MDc5MTA2NTE1IEYzMDBcbkcxIFg0Ni41MjY5MTY5OTk5OTk5OCBZMjkxLjMzNjU2ODMgRjMwMFxuRzEgWDQ5LjgwMzE5MTI5NDkwMDUxNSBZMjkwLjkzODAzMTU0NTY0MjIgRjMwMFxuRzEgWDUyLjg4ODM3NjA1OTAzOTYzNiBZMjg5Ljc2NTY2NjUxMjQxOTIgRjMwMFxuRzEgWDU1LjYwMjUyNzE2MjAxNzM5NSBZMjg3Ljg4Nzg1MTY2NzkyNDU2IEYzMDBcbkcxIFg1Ny43ODczNDEwOTkzOTY2MzUgWTI4NS40MTQxMTEwMDY2OTI0IEYzMDBcbkcxIFg1OS4zMTUzODgwODIwMDY1MiBZMjgyLjQ4ODcyNjAzNzMzNTk0IEYzMDBcbkcxIFg2MC4wOTc1NDQ0MDg1MDc2OCBZMjc5LjI4MjMyMDUyOTQ2MzU2IEYzMDBcbkcxIFg2MC4xOTI5MjIwMDAwMDAwMSBZMjc3LjY3MDU2NCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTJcbkcwIFg4My44MDQwOSBZMjc3LjY3MDU2NFxuRzEgWDgzLjQwNTU1MzI0NTY0MjI0IFkyNzQuMzk0Mjg5NzA1MDk5NTQgRjMwMFxuRzEgWDgyLjIzMzE4ODIxMjQxOTI4IFkyNzEuMzA5MTA0OTQwOTYwMzcgRjMwMFxuRzEgWDgwLjM1NTM3MzM2NzkyNDYxIFkyNjguNTk0OTUzODM3OTgyNjQgRjMwMFxuRzEgWDc3Ljg4MTYzMjcwNjY5MjQ2IFkyNjYuNDEwMTM5OTAwNjAzNCBGMzAwXG5HMSBYNzQuOTU2MjQ3NzM3MzM1OTkgWTI2NC44ODIwOTI5MTc5OTM1IEYzMDBcbkcxIFg3MS43NDk4NDIyMjk0NjM2MiBZMjY0LjA5OTkzNjU5MTQ5MjMgRjMwMFxuRzEgWDcwLjEzODA4MiBZMjY0LjAwNDU1OSBGMzAwXG5HMSBYNjYuODYxODA3NzA1MDk5NSBZMjY0LjQwMzA5NTc1NDM1Nzc2IEYzMDBcbkcxIFg2My43NzY2MjI5NDA5NjA0MSBZMjY1LjU3NTQ2MDc4NzU4MDc3IEYzMDBcbkcxIFg2MS4wNjI0NzE4Mzc5ODI2NSBZMjY3LjQ1MzI3NTYzMjA3NTUgRjMwMFxuRzEgWDU4Ljg3NzY1NzkwMDYwMzQxIFkyNjkuOTI3MDE2MjkzMzA3NjQgRjMwMFxuRzEgWDU3LjM0OTYxMDkxNzk5MzUzIFkyNzIuODUyNDAxMjYyNjY0MSBGMzAwXG5HMSBYNTYuNTY3NDU0NTkxNDkyMzkgWTI3Ni4wNTg4MDY3NzA1MzY1IEYzMDBcbkcxIFg1Ni40NzIwNzcgWTI3Ny42NzA1NjQgRjMwMFxuRzEgWDU2Ljg3MDYxMzkyMjE3NTA4IFkyODAuOTQ2ODM4Mjc0NDg2NyBGMzAwXG5HMSBYNTguMDQyOTc5MTEzNDI3MzcgWTI4NC4wMzIwMjI5Nzg1NzQ5IEYzMDBcbkcxIFg1OS45MjA3OTQwOTY5NDYyOTUgWTI4Ni43NDYxNzM5ODUzNjcyNSBGMzAwXG5HMSBYNjIuMzk0NTM0ODcwMDg4OTc1IFkyODguOTMwOTg3Nzk2MDM2NTYgRjMwMFxuRzEgWDY1LjMxOTkxOTkxNzcxNTA0IFkyOTAuNDU5MDM0NjI4ODAyNCBGMzAwXG5HMSBYNjguNTI2MzI1NDY1NjUwOTggWTI5MS4yNDExOTA3OTEwNjUwNCBGMzAwXG5HMSBYNzAuMTM4MDgyIFkyOTEuMzM2NTY4MyBGMzAwXG5HMSBYNzMuNDE0MzU2MzgyMzg4MzMgWTI5MC45MzgwMzIyNjQ4NTkxNSBGMzAwXG5HMSBYNzYuNDk5NTQxNDAzODg4MjQgWTI4OS43NjU2Njc5MDg5MDQ2IEYzMDBcbkcxIFg3OS4yMTM2OTI5MTkwODkxMyBZMjg3Ljg4Nzg1MzY2MDIyODEgRjMwMFxuRzEgWDgxLjM5ODUwNzM5OTUxMDggWTI4NS40MTQxMTM0Nzg2MTI0IEYzMDBcbkcxIFg4Mi45MjY1NTUwMjQzMDkzOCBZMjgyLjQ4ODcyODg0NDY5NzE2IEYzMDBcbkcxIFg4My43MDg3MTIwNTQ2ODk2NiBZMjc5LjI4MjMyMzUwODUyNjEgRjMwMFxuRzEgWDgzLjgwNDA5IFkyNzcuNjcwNTY0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlM1xuRzAgWDEwNy40MTUyNSBZMjc3LjY3MDU2NFxuRzEgWDEwNy4wMTY3MTMyNDU2NDI2MyBZMjc0LjM5NDI4OTcwNTA5OTUgRjMwMFxuRzEgWDEwNS44NDQzNDgyMTI0MjAwNCBZMjcxLjMwOTEwNDk0MDk2MDIgRjMwMFxuRzEgWDEwMy45NjY1MzMzNjc5MjU2OSBZMjY4LjU5NDk1MzgzNzk4MjIgRjMwMFxuRzEgWDEwMS40OTI3OTI3MDY2OTM4IFkyNjYuNDEwMTM5OTAwNjAyNjQgRjMwMFxuRzEgWDk4LjU2NzQwNzczNzMzNzUyIFkyNjQuODgyMDkyOTE3OTkyNCBGMzAwXG5HMSBYOTUuMzYxMDAyMjI5NDY1MjYgWTI2NC4wOTk5MzY1OTE0OTA4IEYzMDBcbkcxIFg5My43NDkyNTEgWTI2NC4wMDQ1NTkgRjMwMFxuRzEgWDkwLjQ3Mjk3NjYxNzYxMTY2IFkyNjQuNDAzMDk1MDM1MTQwODQgRjMwMFxuRzEgWDg3LjM4Nzc5MTU5NjExMTc3IFkyNjUuNTc1NDU5MzkxMDk1MzYgRjMwMFxuRzEgWDg0LjY3MzY0MDA4MDkxMDkxIFkyNjcuNDUzMjczNjM5NzcxOTYgRjMwMFxuRzEgWDgyLjQ4ODgyNTYwMDQ4OTIyIFkyNjkuOTI3MDEzODIxMzg3NiBGMzAwXG5HMSBYODAuOTYwNzc3OTc1NjkwNjYgWTI3Mi44NTIzOTg0NTUzMDI5IEYzMDBcbkcxIFg4MC4xNzg2MjA5NDUzMTA0IFkyNzYuMDU4ODAzNzkxNDc0IEYzMDBcbkcxIFg4MC4wODMyNDMgWTI3Ny42NzA1NjQgRjMwMFxuRzEgWDgwLjQ4MTc3OTkyMjE3NTA1IFkyODAuOTQ2ODM4Mjc0NDg2NyBGMzAwXG5HMSBYODEuNjU0MTQ1MTEzNDI3MzIgWTI4NC4wMzIwMjI5Nzg1NzQ5IEYzMDBcbkcxIFg4My41MzE5NjAwOTY5NDYyMiBZMjg2Ljc0NjE3Mzk4NTM2NzI1IEYzMDBcbkcxIFg4Ni4wMDU3MDA4NzAwODg5IFkyODguOTMwOTg3Nzk2MDM2NiBGMzAwXG5HMSBYODguOTMxMDg1OTE3NzE0OTUgWTI5MC40NTkwMzQ2Mjg4MDI0NCBGMzAwXG5HMSBYOTIuMTM3NDkxNDY1NjUwOTIgWTI5MS4yNDExOTA3OTEwNjUxNSBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkyOTEuMzM2NTY4MyBGMzAwXG5HMSBYOTcuMDI1NTI1MTE5OTI0MzggWTI5MC45MzgwMzAxMDcyMDg0IEYzMDBcbkcxIFgxMDAuMTEwNzA5MzY5MzQxNDUgWTI4OS43NjU2NjM3MTk0NDg3IEYzMDBcbkcxIFgxMDIuODI0ODU5NjQ3ODcyNTkgWTI4Ny44ODc4NDc2ODMzMTgwNiBGMzAwXG5HMSBYMTA1LjAwOTY3MjQ5OTE2NjYzIFkyODUuNDE0MTA2MDYyODUzMTQgRjMwMFxuRzEgWDEwNi41Mzc3MTgxOTczOTg5NSBZMjgyLjQ4ODcyMDQyMjYxNDYgRjMwMFxuRzEgWDEwNy4zMTk4NzMxMTYxNDE3NSBZMjc5LjI4MjMxNDU3MTM0MDMgRjMwMFxuRzEgWDEwNy40MTUyNSBZMjc3LjY3MDU2NCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTRcbkcwIFgxMzEuMDI2NDEgWTI3Ny42NzA1NjRcbkcxIFgxMzAuNjI3ODczMjQ1NjQyNSBZMjc0LjM5NDI4OTcwNTA5OTUgRjMwMFxuRzEgWDEyOS40NTU1MDgyMTI0MTk4IFkyNzEuMzA5MTA0OTQwOTYwMjUgRjMwMFxuRzEgWDEyNy41Nzc2OTMzNjc5MjUzMyBZMjY4LjU5NDk1MzgzNzk4MjMgRjMwMFxuRzEgWDEyNS4xMDM5NTI3MDY2OTMzOCBZMjY2LjQxMDEzOTkwMDYwMjg3IEYzMDBcbkcxIFgxMjIuMTc4NTY3NzM3MzM3MDIgWTI2NC44ODIwOTI5MTc5OTI3IEYzMDBcbkcxIFgxMTguOTcyMTYyMjI5NDY0NzQgWTI2NC4wOTk5MzY1OTE0OTEyNiBGMzAwXG5HMSBYMTE3LjM2MDQxIFkyNjQuMDA0NTU5MDAwMDAwMDMgRjMwMFxuRzEgWDExNC4wODQxMzU4NTA5MTI4NyBZMjY0LjQwMzA5Njk1MzA1MjcgRjMwMFxuRzEgWDExMC45OTg5NTE1MTU3MDg3NCBZMjY1LjU3NTQ2MzExNTA1NjMgRjMwMFxuRzEgWDEwOC4yODQ4MDEwOTk3Njk4MiBZMjY3LjQ1MzI3ODk1MjU4MSBGMzAwXG5HMSBYMTA2LjA5OTk4ODA2NzQ2MTU1IFkyNjkuOTI3MDIwNDEzMTczODYgRjMwMFxuRzEgWDEwNC41NzE5NDIxNTUxNjYzMyBZMjcyLjg1MjQwNTk0MTU5ODc2IEYzMDBcbkcxIFgxMDMuNzg5Nzg3MDAxNzk3MTUgWTI3Ni4wNTg4MTE3MzU2Mzk1IEYzMDBcbkcxIFgxMDMuNjk0NDEgWTI3Ny42NzA1NjQgRjMwMFxuRzEgWDEwNC4wOTI5NDY5MjIxNzQ3OSBZMjgwLjk0NjgzODI3NDQ4NjcgRjMwMFxuRzEgWDEwNS4yNjUzMTIxMTM0MjY3OSBZMjg0LjAzMjAyMjk3ODU3NSBGMzAwXG5HMSBYMTA3LjE0MzEyNzA5Njk0NTQ2IFkyODYuNzQ2MTczOTg1MzY3NTMgRjMwMFxuRzEgWDEwOS42MTY4Njc4NzAwODc5NiBZMjg4LjkzMDk4Nzc5NjAzNzEgRjMwMFxuRzEgWDExMi41NDIyNTI5MTc3MTM5MiBZMjkwLjQ1OTAzNDYyODgwMzIgRjMwMFxuRzEgWDExNS43NDg2NTg0NjU2NDk4MyBZMjkxLjI0MTE5MDc5MTA2NjIgRjMwMFxuRzEgWDExNy4zNjA0MSBZMjkxLjMzNjU2ODI5OTk5OTk1IEYzMDBcbkcxIFgxMjAuNjM2Njg0MTQ5MDg3MTUgWTI5MC45MzgwMzAzNDY5NDczIEYzMDBcbkcxIFgxMjMuNzIxODY4NDg0MjkxMjggWTI4OS43NjU2NjQxODQ5NDM3IEYzMDBcbkcxIFgxMjYuNDM2MDE4OTAwMjMwMTggWTI4Ny44ODc4NDgzNDc0MTkwNCBGMzAwXG5HMSBYMTI4LjYyMDgzMTkzMjUzODQ3IFkyODUuNDE0MTA2ODg2ODI2MjMgRjMwMFxuRzEgWDEzMC4xNDg4Nzc4NDQ4MzM3MiBZMjgyLjQ4ODcyMTM1ODQwMTM0IEYzMDBcbkcxIFgxMzAuOTMxMDMyOTk4MjAyOSBZMjc5LjI4MjMxNTU2NDM2MDYgRjMwMFxuRzEgWDEzMS4wMjY0MSBZMjc3LjY3MDU2Mzk5OTk5OTk2IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNVxuRzAgWDE1NC42Mzc2IFkyNzcuNjcwNTY0XG5HMSBYMTU0LjIzOTA2MzI0NTY0MjUgWTI3NC4zOTQyODk3MDUwOTk0IEYzMDBcbkcxIFgxNTMuMDY2Njk4MjEyNDE5ODIgWTI3MS4zMDkxMDQ5NDA5NjAyIEYzMDBcbkcxIFgxNTEuMTg4ODgzMzY3OTI1MzcgWTI2OC41OTQ5NTM4Mzc5ODIzIEYzMDBcbkcxIFgxNDguNzE1MTQyNzA2NjkzNCBZMjY2LjQxMDEzOTkwMDYwMjggRjMwMFxuRzEgWDE0NS43ODk3NTc3MzczMzcwNiBZMjY0Ljg4MjA5MjkxNzk5MjcgRjMwMFxuRzEgWDE0Mi41ODMzNTIyMjk0NjQ3NyBZMjY0LjA5OTkzNjU5MTQ5MTIgRjMwMFxuRzEgWDE0MC45NzE2IFkyNjQuMDA0NTU5IEYzMDBcbkcxIFgxMzcuNjk1MzI1NTU5Mjg2NTIgWTI2NC40MDMwOTQ1NTU2NjI4NSBGMzAwXG5HMSBYMTM0LjYxMDE0MDM2NjIxMjg3IFkyNjUuNTc1NDU4NDYwMTA1MSBGMzAwXG5HMSBYMTMxLjg5NTk4ODU3NjE5NjY2IFkyNjcuNDUzMjcyMzExNTY5NTUgRjMwMFxuRzEgWDEyOS43MTExNzM3MzM3NDY3MyBZMjY5LjkyNzAxMjE3MzQ0MDc0IEYzMDBcbkcxIFgxMjguMTgzMTI1NjgwODIyNDMgWTI3Mi44NTIzOTY1ODM3Mjg0IEYzMDBcbkcxIFgxMjcuNDAwOTY4MTgxMTg5NDcgWTI3Ni4wNTg4MDE4MDU0MzIgRjMwMFxuRzEgWDEyNy4zMDU1OTAwMDAwMDAwMSBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYMTI3LjcwNDEyNjkyMjE3NDk1IFkyODAuOTQ2ODM4Mjc0NDg2NjUgRjMwMFxuRzEgWDEyOC44NzY0OTIxMTM0MjcxMyBZMjg0LjAzMjAyMjk3ODU3NDk2IEYzMDBcbkcxIFgxMzAuNzU0MzA3MDk2OTQ1OTUgWTI4Ni43NDYxNzM5ODUzNjczNiBGMzAwXG5HMSBYMTMzLjIyODA0Nzg3MDA4ODU1IFkyODguOTMwOTg3Nzk2MDM2OCBGMzAwXG5HMSBYMTM2LjE1MzQzMjkxNzcxNDU1IFkyOTAuNDU5MDM0NjI4ODAyNyBGMzAwXG5HMSBYMTM5LjM1OTgzODQ2NTY1MDQ4IFkyOTEuMjQxMTkwNzkxMDY1NSBGMzAwXG5HMSBYMTQwLjk3MTYgWTI5MS4zMzY1NjgyOTk5OTk5NSBGMzAwXG5HMSBYMTQ0LjI0Nzg3NDE0OTA4NzEyIFkyOTAuOTM4MDMwMzQ2OTQ3MyBGMzAwXG5HMSBYMTQ3LjMzMzA1ODQ4NDI5MTI2IFkyODkuNzY1NjY0MTg0OTQzNyBGMzAwXG5HMSBYMTUwLjA0NzIwODkwMDIzMDIgWTI4Ny44ODc4NDgzNDc0MTkwNCBGMzAwXG5HMSBYMTUyLjIzMjAyMTkzMjUzODQ2IFkyODUuNDE0MTA2ODg2ODI2MjMgRjMwMFxuRzEgWDE1My43NjAwNjc4NDQ4MzM3IFkyODIuNDg4NzIxMzU4NDAxMzQgRjMwMFxuRzEgWDE1NC41NDIyMjI5OTgyMDI5IFkyNzkuMjgyMzE1NTY0MzYwNiBGMzAwXG5HMSBYMTU0LjYzNzYgWTI3Ny42NzA1NjM5OTk5OTk5NiBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTZcbkcwIFgxNzguMjQ4ODEgWTI3Ny42NzA1NjRcbkcxIFgxNzcuODUwMjczMjQ1NjQzOTMgWTI3NC4zOTQyODk3MDUwOTkyNSBGMzAwXG5HMSBYMTc2LjY3NzkwODIxMjQyMjU1IFkyNzEuMzA5MTA0OTQwOTU5NTcgRjMwMFxuRzEgWDE3NC44MDAwOTMzNjc5MjkyNiBZMjY4LjU5NDk1MzgzNzk4MDggRjMwMFxuRzEgWDE3Mi4zMjYzNTI3MDY2OTgyMyBZMjY2LjQxMDEzOTkwMDYwMDI2IEYzMDBcbkcxIFgxNjkuNDAwOTY3NzM3MzQyNTcgWTI2NC44ODIwOTI5MTc5ODg4NyBGMzAwXG5HMSBYMTY2LjE5NDU2MjIyOTQ3MDYyIFkyNjQuMDk5OTM2NTkxNDg2MSBGMzAwXG5HMSBYMTY0LjU4Mjc5IFkyNjQuMDA0NTU5IEYzMDBcbkcxIFgxNjEuMzA2NTE2MTQyNTQxIFkyNjQuNDAzMDk5MzUwNDQyMiBGMzAwXG5HMSBYMTU4LjIyMTMzMjY2NTIwODA4IFkyNjUuNTc1NDY3NzcwMDA2NiBGMzAwXG5HMSBYMTU1LjUwNzE4MzYyMzM0NzkgWTI2Ny40NTMyODU1OTM1OTA0NiBGMzAwXG5HMSBYMTUzLjMyMjM3MjQwMTE4MjUgWTI2OS45MjcwMjg2NTI5MDM2IEYzMDBcbkcxIFgxNTEuNzk0MzI4NjI5NTE3MSBZMjcyLjg1MjQxNTI5OTQ2NDEgRjMwMFxuRzEgWDE1MS4wMTIxNzU4MjI0MTIxMyBZMjc2LjA1ODgyMTY2NTg0MDMgRjMwMFxuRzEgWDE1MC45MTY4MDAwMDAwMDAwMiBZMjc3LjY3MDU2NDAwMDAwMDA3IEYzMDBcbkcxIFgxNTEuMzE1MzM2OTIyMTcyODMgWTI4MC45NDY4MzgyNzQ0ODY5NCBGMzAwXG5HMSBYMTUyLjQ4NzcwMjExMzQyMyBZMjg0LjAzMjAyMjk3ODU3NiBGMzAwXG5HMSBYMTU0LjM2NTUxNzA5Njk0MDA3IFkyODYuNzQ2MTczOTg1MzY5NiBGMzAwXG5HMSBYMTU2LjgzOTI1Nzg3MDA4MTI3IFkyODguOTMwOTg3Nzk2MDQwNTQgRjMwMFxuRzEgWDE1OS43NjQ2NDI5MTc3MDYzIFkyOTAuNDU5MDM0NjI4ODA4NCBGMzAwXG5HMSBYMTYyLjk3MTA0ODQ2NTY0MTczIFkyOTEuMjQxMTkwNzkxMDczMyBGMzAwXG5HMSBYMTY0LjU4Mjc5IFkyOTEuMzM2NTY4MyBGMzAwXG5HMSBYMTY3Ljg1OTA2NDczMjMzODA4IFkyOTAuOTM4MDM1MTQxNzI3MSBGMzAwXG5HMSBYMTcwLjk0NDI1MDc4MzI3OTY0IFkyODkuNzY1NjczNDk0ODQ2OSBGMzAwXG5HMSBYMTczLjY1ODQwMzk0NzM3MTY4IFkyODcuODg3ODYxNjI5NDQzNyBGMzAwXG5HMSBYMTc1Ljg0MzIyMDU5OTk2MjA4IFkyODUuNDE0MTIzMzY2Mjk1NSBGMzAwXG5HMSBYMTc3LjM3MTI3MDc5MzUxNDY0IFkyODIuNDg4NzQwMDc0MTQ2NiBGMzAwXG5HMSBYMTc4LjE1MzQzMDYzOTQxMTAzIFkyNzkuMjgyMzM1NDI0NzgxOTMgRjMwMFxuRzEgWDE3OC4yNDg4MSBZMjc3LjY3MDU2Mzk5OTk5OTk2IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlN1xuRzAgWDIwMS44NiBZMjc3LjY3MDU2NFxuRzEgWDIwMS40NjE0NjMyNDU2NDQ0NyBZMjc0LjM5NDI4OTcwNTA5OTI1IEYzMDBcbkcxIFgyMDAuMjg5MDk4MjEyNDIzNiBZMjcxLjMwOTEwNDk0MDk1OTM0IEYzMDBcbkcxIFgxOTguNDExMjgzMzY3OTMwNzQgWTI2OC41OTQ5NTM4Mzc5ODAyNiBGMzAwXG5HMSBYMTk1LjkzNzU0MjcwNjcwMDA3IFkyNjYuNDEwMTM5OTAwNTk5MzUgRjMwMFxuRzEgWDE5My4wMTIxNTc3MzczNDQ2NCBZMjY0Ljg4MjA5MjkxNzk4NzUgRjMwMFxuRzEgWDE4OS44MDU3NTIyMjk0NzI4IFkyNjQuMDk5OTM2NTkxNDg0MTUgRjMwMFxuRzEgWDE4OC4xOTQwMSBZMjY0LjAwNDU1OSBGMzAwXG5HMSBYMTg0LjkxNzczNTU1OTI4NjQ4IFkyNjQuNDAzMDk0NTU1NjYyODUgRjMwMFxuRzEgWDE4MS44MzI1NTAzNjYyMTI4NCBZMjY1LjU3NTQ1ODQ2MDEwNTEgRjMwMFxuRzEgWDE3OS4xMTgzOTg1NzYxOTY2MyBZMjY3LjQ1MzI3MjMxMTU2OTU1IEYzMDBcbkcxIFgxNzYuOTMzNTgzNzMzNzQ2NyBZMjY5LjkyNzAxMjE3MzQ0MDc0IEYzMDBcbkcxIFgxNzUuNDA1NTM1NjgwODIyNCBZMjcyLjg1MjM5NjU4MzcyODQgRjMwMFxuRzEgWDE3NC42MjMzNzgxODExODk0MiBZMjc2LjA1ODgwMTgwNTQzMiBGMzAwXG5HMSBYMTc0LjUyOCBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYMTc0LjkyNjUzNjkyMjE3NDkgWTI4MC45NDY4MzgyNzQ0ODY2NSBGMzAwXG5HMSBYMTc2LjA5ODkwMjExMzQyNzA3IFkyODQuMDMyMDIyOTc4NTc0OSBGMzAwXG5HMSBYMTc3Ljk3NjcxNzA5Njk0NTkgWTI4Ni43NDYxNzM5ODUzNjczIEYzMDBcbkcxIFgxODAuNDUwNDU3ODcwMDg4NSBZMjg4LjkzMDk4Nzc5NjAzNjczIEYzMDBcbkcxIFgxODMuMzc1ODQyOTE3NzE0NTIgWTI5MC40NTkwMzQ2Mjg4MDI3IEYzMDBcbkcxIFgxODYuNTgyMjQ4NDY1NjUwNDUgWTI5MS4yNDExOTA3OTEwNjU1IEYzMDBcbkcxIFgxODguMTk0MDA5OTk5OTk5OTYgWTI5MS4zMzY1NjgyOTk5OTk5NSBGMzAwXG5HMSBYMTkxLjQ3MDI4Mzg1NzQ1ODk4IFkyOTAuOTM4MDI3OTQ5NTU3OCBGMzAwXG5HMSBYMTk0LjU1NTQ2NzMzNDc5MTkzIFkyODkuNzY1NjU5NTI5OTkzNDYgRjMwMFxuRzEgWDE5Ny4yNjk2MTYzNzY2NTIxMiBZMjg3Ljg4Nzg0MTcwNjQwOTUgRjMwMFxuRzEgWDE5OS40NTQ0Mjc1OTg4MTc2IFkyODUuNDE0MDk4NjQ3MDk2NCBGMzAwXG5HMSBYMjAwLjk4MjQ3MTM3MDQ4Mjk1IFkyODIuNDg4NzEyMDAwNTM1OSBGMzAwXG5HMSBYMjAxLjc2NDYyNDE3NzU4Nzk2IFkyNzkuMjgyMzA1NjM0MTU5NzQgRjMwMFxuRzEgWDIwMS44NiBZMjc3LjY3MDU2NCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZThcbkcwIFgzNi41ODE3NDQgWTI1NC4wNTkzODJcbkcxIFgzNi4xODMyMDc3MjUxMjAxNiBZMjUwLjc4MzEwNzY0Njc3NDI1IEYzMDBcbkcxIFgzNS4wMTA4NDMxNDM0MDk0NiBZMjQ3LjY5NzkyMjcxMTA2MTI3IEYzMDBcbkcxIFgzMy4xMzMwMjg2OTYxMjY4MTQgWTI0NC45ODM3NzEzMzMyNjgxIEYzMDBcbkcxIFgzMC42NTkyODgzNTQ2Mzg5NyBZMjQyLjc5ODk1NzAzMzg2MDU1IEYzMDBcbkcxIFgyNy43MzM5MDM2MDg5MDk5NSBZMjQxLjI3MDkwOTYyMzEyNDg4IEYzMDBcbkcxIFgyNC41Mjc0OTgyMTU1MDUwNCBZMjQwLjQ4ODc1MjgyNzM3MSBGMzAwXG5HMSBYMjIuOTE1NzM5MDAwMDAwMDAyIFkyNDAuMzkzMzc1MDAwMDAwMDIgRjMwMFxuRzEgWDE5LjYzOTQ2NDYzNTEwOTE5MiBZMjQwLjc5MTkxMTE3ODk4NDI2IEYzMDBcbkcxIFgxNi41NTQyNzk2NjUwODE0NCBZMjQxLjk2NDI3NTY3MDM5MjUgRjMwMFxuRzEgWDEzLjg0MDEyODIzMjMyNTE4NyBZMjQzLjg0MjA5MDAzODIzMjc1IEYzMDBcbkcxIFgxMS42NTUzMTM4NjA1MTE5OTIgWTI0Ni4zMTU4MzAzMTU3NzE3IEYzMDBcbkcxIFgxMC4xMjcyNjYzNjQxNTExNjUgWTI0OS4yNDEyMTUwMTY3NzUyMSBGMzAwXG5HMSBYOS4zNDUxMDk0NzQ1NDY3NDQgWTI1Mi40NDc2MjAzODcyODY2MyBGMzAwXG5HMSBYOS4yNDk3MzE2IFkyNTQuMDU5MzgyMDAwMDAwMDMgRjMwMFxuRzEgWDkuNjQ4MjY4MzU0MzU3NzkgWTI1Ny4zMzU2NTYyOTQ5MDA1IEYzMDBcbkcxIFgxMC44MjA2MzMzODc1ODA3NzkgWTI2MC40MjA4NDEwNTkwMzk2IEYzMDBcbkcxIFgxMi42OTg0NDgyMzIwNzU0ODMgWTI2My4xMzQ5OTIxNjIwMTc0IEYzMDBcbkcxIFgxNS4xNzIxODg4OTMzMDc2NDkgWTI2NS4zMTk4MDYwOTkzOTY2IEYzMDBcbkcxIFgxOC4wOTc1NzM4NjI2NjQxMzQgWTI2Ni44NDc4NTMwODIwMDY1IEYzMDBcbkcxIFgyMS4zMDM5NzkzNzA1MzY0OCBZMjY3LjYzMDAwOTQwODUwNzY1IEYzMDBcbkcxIFgyMi45MTU3Mzg5OTk5OTk5OTUgWTI2Ny43MjUzODcgRjMwMFxuRzEgWDI2LjE5MjAxMzI5NDkwMDUxIFkyNjcuMzI2ODUwMjQ1NjQyMiBGMzAwXG5HMSBYMjkuMjc3MTk4MDU5MDM5NTk1IFkyNjYuMTU0NDg1MjEyNDE5MiBGMzAwXG5HMSBYMzEuOTkxMzQ5MTYyMDE3MzUgWTI2NC4yNzY2NzAzNjc5MjQ1IEYzMDBcbkcxIFgzNC4xNzYxNjMwOTkzOTY2IFkyNjEuODAyOTI5NzA2NjkyMzQgRjMwMFxuRzEgWDM1LjcwNDIxMDA4MjAwNjQ3IFkyNTguODc3NTQ0NzM3MzM1OSBGMzAwXG5HMSBYMzYuNDg2MzY2NDA4NTA3NjE0IFkyNTUuNjcxMTM5MjI5NDYzNSBGMzAwXG5HMSBYMzYuNTgxNzQ0IFkyNTQuMDU5MzgxOTk5OTk5OTcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU5XG5HMCBYNjAuMTkyOTIyIFkyNTQuMDU5MzgyXG5HMSBYNTkuNzk0Mzg1NzI1MTIwMTcgWTI1MC43ODMxMDc2NDY3NzQyOCBGMzAwXG5HMSBYNTguNjIyMDIxMTQzNDA5NDcgWTI0Ny42OTc5MjI3MTEwNjEzIEYzMDBcbkcxIFg1Ni43NDQyMDY2OTYxMjY4MyBZMjQ0Ljk4Mzc3MTMzMzI2ODEgRjMwMFxuRzEgWDU0LjI3MDQ2NjM1NDYzOTAyIFkyNDIuNzk4OTU3MDMzODYwNTcgRjMwMFxuRzEgWDUxLjM0NTA4MTYwODkxIFkyNDEuMjcwOTA5NjIzMTI0ODggRjMwMFxuRzEgWDQ4LjEzODY3NjIxNTUwNTEyIFkyNDAuNDg4NzUyODI3MzcxIEYzMDBcbkcxIFg0Ni41MjY5MTcwMDAwMDAwMDUgWTI0MC4zOTMzNzUwMDAwMDAwMiBGMzAwXG5HMSBYNDMuMjUwNjQyNjE3NjExNjYgWTI0MC43OTE5MTEwMzUxNDA4NiBGMzAwXG5HMSBYNDAuMTY1NDU3NTk2MTExNzYgWTI0MS45NjQyNzUzOTEwOTU0IEYzMDBcbkcxIFgzNy40NTEzMDYwODA5MTA4OSBZMjQzLjg0MjA4OTYzOTc3MiBGMzAwXG5HMSBYMzUuMjY2NDkxNjAwNDg5MiBZMjQ2LjMxNTgyOTgyMTM4NzY0IEYzMDBcbkcxIFgzMy43Mzg0NDM5NzU2OTA2NiBZMjQ5LjI0MTIxNDQ1NTMwMjg3IEYzMDBcbkcxIFgzMi45NTYyODY5NDUzMTA0IFkyNTIuNDQ3NjE5NzkxNDc0IEYzMDBcbkcxIFgzMi44NjA5MDg5OTk5OTk5OSBZMjU0LjA1OTM4MiBGMzAwXG5HMSBYMzMuMjU5NDQ1NzU0MzU3NzU2IFkyNTcuMzM1NjU2Mjk0OTAwNSBGMzAwXG5HMSBYMzQuNDMxODEwNzg3NTgwNzE2IFkyNjAuNDIwODQxMDU5MDM5NiBGMzAwXG5HMSBYMzYuMzA5NjI1NjMyMDc1MzggWTI2My4xMzQ5OTIxNjIwMTczNCBGMzAwXG5HMSBYMzguNzgzMzY2MjkzMzA3NTQgWTI2NS4zMTk4MDYwOTkzOTY2IEYzMDBcbkcxIFg0MS43MDg3NTEyNjI2NjQwMSBZMjY2Ljg0Nzg1MzA4MjAwNjUgRjMwMFxuRzEgWDQ0LjkxNTE1Njc3MDUzNjM3IFkyNjcuNjMwMDA5NDA4NTA3NyBGMzAwXG5HMSBYNDYuNTI2OTE2OTk5OTk5OTkgWTI2Ny43MjUzODcgRjMwMFxuRzEgWDQ5LjgwMzE5MTI5NDkwMDUxIFkyNjcuMzI2ODUwMjQ1NjQyMiBGMzAwXG5HMSBYNTIuODg4Mzc2MDU5MDM5NiBZMjY2LjE1NDQ4NTIxMjQxOTIgRjMwMFxuRzEgWDU1LjYwMjUyNzE2MjAxNzM1IFkyNjQuMjc2NjcwMzY3OTI0NSBGMzAwXG5HMSBYNTcuNzg3MzQxMDk5Mzk2NiBZMjYxLjgwMjkyOTcwNjY5MjM0IEYzMDBcbkcxIFg1OS4zMTUzODgwODIwMDY0OCBZMjU4Ljg3NzU0NDczNzMzNTkgRjMwMFxuRzEgWDYwLjA5NzU0NDQwODUwNzYxIFkyNTUuNjcxMTM5MjI5NDYzNTMgRjMwMFxuRzEgWDYwLjE5MjkyMjAwMDAwMDAxIFkyNTQuMDU5MzgxOTk5OTk5OTcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUxMFxuRzAgWDgzLjgwNDA5IFkyNTQuMDU5MzgyXG5HMSBYODMuNDA1NTUzNzI1MTIwMTkgWTI1MC43ODMxMDc2NDY3NzQyNSBGMzAwXG5HMSBYODIuMjMzMTg5MTQzNDA5NTIgWTI0Ny42OTc5MjI3MTEwNjEyNyBGMzAwXG5HMSBYODAuMzU1Mzc0Njk2MTI2OTIgWTI0NC45ODM3NzEzMzMyNjgxIEYzMDBcbkcxIFg3Ny44ODE2MzQzNTQ2MzkxIFkyNDIuNzk4OTU3MDMzODYwNTIgRjMwMFxuRzEgWDc0Ljk1NjI0OTYwODkxMDExIFkyNDEuMjcwOTA5NjIzMTI0ODIgRjMwMFxuRzEgWDcxLjc0OTg0NDIxNTUwNTIyIFkyNDAuNDg4NzUyODI3MzcwOTIgRjMwMFxuRzEgWDcwLjEzODA4MiBZMjQwLjM5MzM3NSBGMzAwXG5HMSBYNjYuODYxODA3NzA1MDk5NDcgWTI0MC43OTE5MTE3NTQzNTc4IEYzMDBcbkcxIFg2My43NzY2MjI5NDA5NjAzNjUgWTI0MS45NjQyNzY3ODc1ODA4MSBGMzAwXG5HMSBYNjEuMDYyNDcxODM3OTgyNjEgWTI0My44NDIwOTE2MzIwNzU1MiBGMzAwXG5HMSBYNTguODc3NjU3OTAwNjAzMzggWTI0Ni4zMTU4MzIyOTMzMDc3MiBGMzAwXG5HMSBYNTcuMzQ5NjEwOTE3OTkzNSBZMjQ5LjI0MTIxNzI2MjY2NDIgRjMwMFxuRzEgWDU2LjU2NzQ1NDU5MTQ5MjM4NSBZMjUyLjQ0NzYyMjc3MDUzNjU1IEYzMDBcbkcxIFg1Ni40NzIwNzcgWTI1NC4wNTkzODIwMDAwMDAwMyBGMzAwXG5HMSBYNTYuODcwNjEzNzU0MzU3NzkgWTI1Ny4zMzU2NTYyOTQ5MDA1IEYzMDBcbkcxIFg1OC4wNDI5Nzg3ODc1ODA3NyBZMjYwLjQyMDg0MTA1OTAzOTU2IEYzMDBcbkcxIFg1OS45MjA3OTM2MzIwNzU0NyBZMjYzLjEzNDk5MjE2MjAxNzM0IEYzMDBcbkcxIFg2Mi4zOTQ1MzQyOTMzMDc2MzYgWTI2NS4zMTk4MDYwOTkzOTY1NCBGMzAwXG5HMSBYNjUuMzE5OTE5MjYyNjY0MTEgWTI2Ni44NDc4NTMwODIwMDY0NSBGMzAwXG5HMSBYNjguNTI2MzI0NzcwNTM2NDkgWTI2Ny42MzAwMDk0MDg1MDc2IEYzMDBcbkcxIFg3MC4xMzgwODIgWTI2Ny43MjUzODcgRjMwMFxuRzEgWDczLjQxNDM1NjM4MjM4ODMzIFkyNjcuMzI2ODUwOTY0ODU5MTUgRjMwMFxuRzEgWDc2LjQ5OTU0MTQwMzg4ODIzIFkyNjYuMTU0NDg2NjA4OTA0NiBGMzAwXG5HMSBYNzkuMjEzNjkyOTE5MDg5MDggWTI2NC4yNzY2NzIzNjAyMjggRjMwMFxuRzEgWDgxLjM5ODUwNzM5OTUxMDc4IFkyNjEuODAyOTMyMTc4NjEyMzcgRjMwMFxuRzEgWDgyLjkyNjU1NTAyNDMwOTM0IFkyNTguODc3NTQ3NTQ0Njk3MSBGMzAwXG5HMSBYODMuNzA4NzEyMDU0Njg5NTggWTI1NS42NzExNDIyMDg1MjYgRjMwMFxuRzEgWDgzLjgwNDA5IFkyNTQuMDU5MzgxOTk5OTk5OTcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUxMVxuRzAgWDEwNy40MTUyNSBZMjU0LjA1OTM4MlxuRzEgWDEwNy4wMTY3MTM3MjUxMjA1OCBZMjUwLjc4MzEwNzY0Njc3NDIzIEYzMDBcbkcxIFgxMDUuODQ0MzQ5MTQzNDEwMjggWTI0Ny42OTc5MjI3MTEwNjEwNyBGMzAwXG5HMSBYMTAzLjk2NjUzNDY5NjEyODAxIFkyNDQuOTgzNzcxMzMzMjY3NjcgRjMwMFxuRzEgWDEwMS40OTI3OTQzNTQ2NDA0OCBZMjQyLjc5ODk1NzAzMzg1OTggRjMwMFxuRzEgWDk4LjU2NzQwOTYwODkxMTY3IFkyNDEuMjcwOTA5NjIzMTIzNzcgRjMwMFxuRzEgWDk1LjM2MTAwNDIxNTUwNjg4IFkyNDAuNDg4NzUyODI3MzY5NDcgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMjQwLjM5MzM3NSBGMzAwXG5HMSBYOTAuNDcyOTc2NjE3NjExNjYgWTI0MC43OTE5MTEwMzUxNDA4NiBGMzAwXG5HMSBYODcuMzg3NzkxNTk2MTExNzcgWTI0MS45NjQyNzUzOTEwOTU0IEYzMDBcbkcxIFg4NC42NzM2NDAwODA5MTA5IFkyNDMuODQyMDg5NjM5NzcxOTggRjMwMFxuRzEgWDgyLjQ4ODgyNTYwMDQ4OTIyIFkyNDYuMzE1ODI5ODIxMzg3NiBGMzAwXG5HMSBYODAuOTYwNzc3OTc1NjkwNjYgWTI0OS4yNDEyMTQ0NTUzMDI4NCBGMzAwXG5HMSBYODAuMTc4NjIwOTQ1MzEwNDEgWTI1Mi40NDc2MTk3OTE0NzM5NSBGMzAwXG5HMSBYODAuMDgzMjQzIFkyNTQuMDU5MzgyIEYzMDBcbkcxIFg4MC40ODE3Nzk3NTQzNTc3NiBZMjU3LjMzNTY1NjI5NDkwMDUgRjMwMFxuRzEgWDgxLjY1NDE0NDc4NzU4MDcyIFkyNjAuNDIwODQxMDU5MDM5NiBGMzAwXG5HMSBYODMuNTMxOTU5NjMyMDc1MzggWTI2My4xMzQ5OTIxNjIwMTczNCBGMzAwXG5HMSBYODYuMDA1NzAwMjkzMzA3NTQgWTI2NS4zMTk4MDYwOTkzOTY2IEYzMDBcbkcxIFg4OC45MzEwODUyNjI2NjQwMSBZMjY2Ljg0Nzg1MzA4MjAwNjUgRjMwMFxuRzEgWDkyLjEzNzQ5MDc3MDUzNjM3IFkyNjcuNjMwMDA5NDA4NTA3NyBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkyNjcuNzI1Mzg3IEYzMDBcbkcxIFg5Ny4wMjU1MjUxMTk5MjQzOCBZMjY3LjMyNjg0ODgwNzIwODM2IEYzMDBcbkcxIFgxMDAuMTEwNzA5MzY5MzQxNDYgWTI2Ni4xNTQ0ODI0MTk0NDg2NCBGMzAwXG5HMSBYMTAyLjgyNDg1OTY0Nzg3MjU5IFkyNjQuMjc2NjY2MzgzMzE4IEYzMDBcbkcxIFgxMDUuMDA5NjcyNDk5MTY2NjEgWTI2MS44MDI5MjQ3NjI4NTMxIEYzMDBcbkcxIFgxMDYuNTM3NzE4MTk3Mzk4OSBZMjU4Ljg3NzUzOTEyMjYxNDU2IEYzMDBcbkcxIFgxMDcuMzE5ODczMTE2MTQxNjggWTI1NS42NzExMzMyNzEzNDAyIEYzMDBcbkcxIFgxMDcuNDE1MjUgWTI1NC4wNTkzODIgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUxMlxuRzAgWDEzMS4wMjY0MSBZMjU0LjA1OTM4MlxuRzEgWDEzMC42Mjc4NzM3MjUxMjA0OCBZMjUwLjc4MzEwNzY0Njc3NDIzIEYzMDBcbkcxIFgxMjkuNDU1NTA5MTQzNDEwMDcgWTI0Ny42OTc5MjI3MTEwNjExNSBGMzAwXG5HMSBYMTI3LjU3NzY5NDY5NjEyNzcxIFkyNDQuOTgzNzcxMzMzMjY3OCBGMzAwXG5HMSBYMTI1LjEwMzk1NDM1NDY0MDExIFkyNDIuNzk4OTU3MDMzODYwMDYgRjMwMFxuRzEgWDEyMi4xNzg1Njk2MDg5MTEyMyBZMjQxLjI3MDkwOTYyMzEyNDA4IEYzMDBcbkcxIFgxMTguOTcyMTY0MjE1NTA2NDEgWTI0MC40ODg3NTI4MjczNjk5IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTI0MC4zOTMzNzUwMDAwMDAwMiBGMzAwXG5HMSBYMTE0LjA4NDEzNTg1MDkxMjg3IFkyNDAuNzkxOTEyOTUzMDUyNjcgRjMwMFxuRzEgWDExMC45OTg5NTE1MTU3MDg3NCBZMjQxLjk2NDI3OTExNTA1NjI5IEYzMDBcbkcxIFgxMDguMjg0ODAxMDk5NzY5ODQgWTI0My44NDIwOTQ5NTI1ODA5NiBGMzAwXG5HMSBYMTA2LjA5OTk4ODA2NzQ2MTU4IFkyNDYuMzE1ODM2NDEzMTczOCBGMzAwXG5HMSBYMTA0LjU3MTk0MjE1NTE2NjM0IFkyNDkuMjQxMjIxOTQxNTk4NyBGMzAwXG5HMSBYMTAzLjc4OTc4NzAwMTc5NzE1IFkyNTIuNDQ3NjI3NzM1NjM5NDMgRjMwMFxuRzEgWDEwMy42OTQ0MSBZMjU0LjA1OTM4MiBGMzAwXG5HMSBYMTA0LjA5Mjk0Njc1NDM1NzQ4IFkyNTcuMzM1NjU2Mjk0OTAwNSBGMzAwXG5HMSBYMTA1LjI2NTMxMTc4NzU4MDE5IFkyNjAuNDIwODQxMDU5MDM5NzMgRjMwMFxuRzEgWDEwNy4xNDMxMjY2MzIwNzQ2NCBZMjYzLjEzNDk5MjE2MjAxNzcgRjMwMFxuRzEgWDEwOS42MTY4NjcyOTMzMDY2IFkyNjUuMzE5ODA2MDk5Mzk3MSBGMzAwXG5HMSBYMTEyLjU0MjI1MjI2MjY2Mjk0IFkyNjYuODQ3ODUzMDgyMDA3MyBGMzAwXG5HMSBYMTE1Ljc0ODY1Nzc3MDUzNTIyIFkyNjcuNjMwMDA5NDA4NTA4NyBGMzAwXG5HMSBYMTE3LjM2MDQxIFkyNjcuNzI1Mzg3IEYzMDBcbkcxIFgxMjAuNjM2Njg0MTQ5MDg3MSBZMjY3LjMyNjg0OTA0Njk0NzQgRjMwMFxuRzEgWDEyMy43MjE4Njg0ODQyOTEyMiBZMjY2LjE1NDQ4Mjg4NDk0MzggRjMwMFxuRzEgWDEyNi40MzYwMTg5MDAyMzAxNSBZMjY0LjI3NjY2NzA0NzQxOTEgRjMwMFxuRzEgWDEyOC42MjA4MzE5MzI1Mzg0IFkyNjEuODAyOTI1NTg2ODI2MyBGMzAwXG5HMSBYMTMwLjE0ODg3Nzg0NDgzMzY2IFkyNTguODc3NTQwMDU4NDAxNCBGMzAwXG5HMSBYMTMwLjkzMTAzMjk5ODIwMjg1IFkyNTUuNjcxMTM0MjY0MzYwNjYgRjMwMFxuRzEgWDEzMS4wMjY0MSBZMjU0LjA1OTM4MjAwMDAwMDA2IEYzMDBcbkcxIFgxMzEuMDI2NDEgWTI1NC4wNTkzODIgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUxM1xuRzAgWDE1NC42Mzc2IFkyNTQuMDU5MzgyXG5HMSBYMTU0LjIzOTA2MzcyNTEyMDQ3IFkyNTAuNzgzMTA3NjQ2Nzc0MjMgRjMwMFxuRzEgWDE1My4wNjY2OTkxNDM0MTAwNiBZMjQ3LjY5NzkyMjcxMTA2MTEyIEYzMDBcbkcxIFgxNTEuMTg4ODg0Njk2MTI3NjcgWTI0NC45ODM3NzEzMzMyNjc3OCBGMzAwXG5HMSBYMTQ4LjcxNTE0NDM1NDY0MDA1IFkyNDIuNzk4OTU3MDMzODYgRjMwMFxuRzEgWDE0NS43ODk3NTk2MDg5MTExNyBZMjQxLjI3MDkwOTYyMzEyNDA2IEYzMDBcbkcxIFgxNDIuNTgzMzU0MjE1NTA2MzUgWTI0MC40ODg3NTI4MjczNjk4NiBGMzAwXG5HMSBYMTQwLjk3MTYgWTI0MC4zOTMzNzUwMDAwMDAwMiBGMzAwXG5HMSBYMTM3LjY5NTMyNTU1OTI4NjUyIFkyNDAuNzkxOTEwNTU1NjYyOSBGMzAwXG5HMSBYMTM0LjYxMDE0MDM2NjIxMjg3IFkyNDEuOTY0Mjc0NDYwMTA1MTIgRjMwMFxuRzEgWDEzMS44OTU5ODg1NzYxOTY2NiBZMjQzLjg0MjA4ODMxMTU2OTYgRjMwMFxuRzEgWDEyOS43MTExNzM3MzM3NDY3MyBZMjQ2LjMxNTgyODE3MzQ0MDggRjMwMFxuRzEgWDEyOC4xODMxMjU2ODA4MjI0MyBZMjQ5LjI0MTIxMjU4MzcyODQ3IEYzMDBcbkcxIFgxMjcuNDAwOTY4MTgxMTg5NDcgWTI1Mi40NDc2MTc4MDU0MzIgRjMwMFxuRzEgWDEyNy4zMDU1OTAwMDAwMDAwMSBZMjU0LjA1OTM4MjAwMDAwMDAzIEYzMDBcbkcxIFgxMjcuNzA0MTI2NzU0MzU3NjcgWTI1Ny4zMzU2NTYyOTQ5MDA1IEYzMDBcbkcxIFgxMjguODc2NDkxNzg3NTgwNTMgWTI2MC40MjA4NDEwNTkwMzk3IEYzMDBcbkcxIFgxMzAuNzU0MzA2NjMyMDc1MTMgWTI2My4xMzQ5OTIxNjIwMTc0NSBGMzAwXG5HMSBYMTMzLjIyODA0NzI5MzMwNzIgWTI2NS4zMTk4MDYwOTkzOTY4IEYzMDBcbkcxIFgxMzYuMTUzNDMyMjYyNjYzNiBZMjY2Ljg0Nzg1MzA4MjAwNjggRjMwMFxuRzEgWDEzOS4zNTk4Mzc3NzA1MzU5NiBZMjY3LjYzMDAwOTQwODUwODEgRjMwMFxuRzEgWDE0MC45NzE2IFkyNjcuNzI1Mzg2OTk5OTk5OTYgRjMwMFxuRzEgWDE0NC4yNDc4NzQxNDkwODcxMiBZMjY3LjMyNjg0OTA0Njk0NzQgRjMwMFxuRzEgWDE0Ny4zMzMwNTg0ODQyOTEyMyBZMjY2LjE1NDQ4Mjg4NDk0MzggRjMwMFxuRzEgWDE1MC4wNDcyMDg5MDAyMzAxNSBZMjY0LjI3NjY2NzA0NzQxOTEgRjMwMFxuRzEgWDE1Mi4yMzIwMjE5MzI1Mzg0MyBZMjYxLjgwMjkyNTU4NjgyNjMgRjMwMFxuRzEgWDE1My43NjAwNjc4NDQ4MzM2NiBZMjU4Ljg3NzU0MDA1ODQwMTQgRjMwMFxuRzEgWDE1NC41NDIyMjI5OTgyMDI4NSBZMjU1LjY3MTEzNDI2NDM2MDYzIEYzMDBcbkcxIFgxNTQuNjM3NiBZMjU0LjA1OTM4MjAwMDAwMDA2IEYzMDBcbkcxIFgxNTQuNjM3NiBZMjU0LjA1OTM4MiBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTE0XG5HMCBYMTc4LjI0ODgxIFkyNTQuMDU5MzgyXG5HMSBYMTc3Ljg1MDI3MzcyNTEyMTg3IFkyNTAuNzgzMTA3NjQ2Nzc0MDMgRjMwMFxuRzEgWDE3Ni42Nzc5MDkxNDM0MTI4IFkyNDcuNjk3OTIyNzExMDYwNDQgRjMwMFxuRzEgWDE3NC44MDAwOTQ2OTYxMzE1NyBZMjQ0Ljk4Mzc3MTMzMzI2NjMgRjMwMFxuRzEgWDE3Mi4zMjYzNTQzNTQ2NDQ4OCBZMjQyLjc5ODk1NzAzMzg1NzQ4IEYzMDBcbkcxIFgxNjkuNDAwOTY5NjA4OTE2NjUgWTI0MS4yNzA5MDk2MjMxMjAyNSBGMzAwXG5HMSBYMTY2LjE5NDU2NDIxNTUxMjE3IFkyNDAuNDg4NzUyODI3MzY0NzIgRjMwMFxuRzEgWDE2NC41ODI3OSBZMjQwLjM5MzM3NTAwMDAwMDAyIEYzMDBcbkcxIFgxNjEuMzA2NTE2MTQyNTQwOTcgWTI0MC43OTE5MTUzNTA0NDIyMiBGMzAwXG5HMSBYMTU4LjIyMTMzMjY2NTIwODA4IFkyNDEuOTY0MjgzNzcwMDA2NiBGMzAwXG5HMSBYMTU1LjUwNzE4MzYyMzM0NzkgWTI0My44NDIxMDE1OTM1OTA1IEYzMDBcbkcxIFgxNTMuMzIyMzcyNDAxMTgyNDYgWTI0Ni4zMTU4NDQ2NTI5MDM2NSBGMzAwXG5HMSBYMTUxLjc5NDMyODYyOTUxNzA4IFkyNDkuMjQxMjMxMjk5NDY0MiBGMzAwXG5HMSBYMTUxLjAxMjE3NTgyMjQxMjEzIFkyNTIuNDQ3NjM3NjY1ODQwMzggRjMwMFxuRzEgWDE1MC45MTY4MDAwMDAwMDAwMiBZMjU0LjA1OTM4MjAwMDAwMDAzIEYzMDBcbkcxIFgxNTEuMzE1MzM2NzU0MzU1NTcgWTI1Ny4zMzU2NTYyOTQ5MDA4IEYzMDBcbkcxIFgxNTIuNDg3NzAxNzg3NTc2NDQgWTI2MC40MjA4NDEwNTkwNDA2NCBGMzAwXG5HMSBYMTU0LjM2NTUxNjYzMjA2OTMgWTI2My4xMzQ5OTIxNjIwMTk3IEYzMDBcbkcxIFgxNTYuODM5MjU3MjkzMjk5OTcgWTI2NS4zMTk4MDYwOTk0MDA2NCBGMzAwXG5HMSBYMTU5Ljc2NDY0MjI2MjY1NTQgWTI2Ni44NDc4NTMwODIwMTI1IEYzMDBcbkcxIFgxNjIuOTcxMDQ3NzcwNTI3MjQgWTI2Ny42MzAwMDk0MDg1MTU4MyBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkyNjcuNzI1Mzg3IEYzMDBcbkcxIFgxNjcuODU5MDY0NzMyMzM4MDggWTI2Ny4zMjY4NTM4NDE3MjcxIEYzMDBcbkcxIFgxNzAuOTQ0MjUwNzgzMjc5NjQgWTI2Ni4xNTQ0OTIxOTQ4NDY5IEYzMDBcbkcxIFgxNzMuNjU4NDAzOTQ3MzcxNjUgWTI2NC4yNzY2ODAzMjk0NDM3IEYzMDBcbkcxIFgxNzUuODQzMjIwNTk5OTYyMDUgWTI2MS44MDI5NDIwNjYyOTU1IEYzMDBcbkcxIFgxNzcuMzcxMjcwNzkzNTE0NiBZMjU4Ljg3NzU1ODc3NDE0NjU2IEYzMDBcbkcxIFgxNzguMTUzNDMwNjM5NDEwOTcgWTI1NS42NzExNTQxMjQ3ODE5IEYzMDBcbkcxIFgxNzguMjQ4ODEgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTE1XG5HMCBYMjAxLjg2IFkyNTQuMDU5MzgyXG5HMSBYMjAxLjQ2MTQ2MzcyNTEyMjQzIFkyNTAuNzgzMTA3NjQ2NzczOTcgRjMwMFxuRzEgWDIwMC4yODkwOTkxNDM0MTM4NCBZMjQ3LjY5NzkyMjcxMTA2MDIyIEYzMDBcbkcxIFgxOTguNDExMjg0Njk2MTMzMDcgWTI0NC45ODM3NzEzMzMyNjU3NiBGMzAwXG5HMSBYMTk1LjkzNzU0NDM1NDY0Njc1IFkyNDIuNzk4OTU3MDMzODU2NTQgRjMwMFxuRzEgWDE5My4wMTIxNTk2MDg5MTg4IFkyNDEuMjcwOTA5NjIzMTE4ODggRjMwMFxuRzEgWDE4OS44MDU3NTQyMTU1MTQ0NCBZMjQwLjQ4ODc1MjgyNzM2MjggRjMwMFxuRzEgWDE4OC4xOTQwMSBZMjQwLjM5MzM3NTAwMDAwMDAyIEYzMDBcbkcxIFgxODQuOTE3NzM1NTU5Mjg2NDggWTI0MC43OTE5MTA1NTU2NjI5IEYzMDBcbkcxIFgxODEuODMyNTUwMzY2MjEyODQgWTI0MS45NjQyNzQ0NjAxMDUxMiBGMzAwXG5HMSBYMTc5LjExODM5ODU3NjE5NjYzIFkyNDMuODQyMDg4MzExNTY5NiBGMzAwXG5HMSBYMTc2LjkzMzU4MzczMzc0NjcgWTI0Ni4zMTU4MjgxNzM0NDA4IEYzMDBcbkcxIFgxNzUuNDA1NTM1NjgwODIyNCBZMjQ5LjI0MTIxMjU4MzcyODQ3IEYzMDBcbkcxIFgxNzQuNjIzMzc4MTgxMTg5NDIgWTI1Mi40NDc2MTc4MDU0MzIgRjMwMFxuRzEgWDE3NC41MjggWTI1NC4wNTkzODIwMDAwMDAwMyBGMzAwXG5HMSBYMTc0LjkyNjUzNjc1NDM1NzY0IFkyNTcuMzM1NjU2Mjk0OTAwNSBGMzAwXG5HMSBYMTc2LjA5ODkwMTc4NzU4MDUzIFkyNjAuNDIwODQxMDU5MDM5NyBGMzAwXG5HMSBYMTc3Ljk3NjcxNjYzMjA3NTEyIFkyNjMuMTM0OTkyMTYyMDE3NSBGMzAwXG5HMSBYMTgwLjQ1MDQ1NzI5MzMwNzIgWTI2NS4zMTk4MDYwOTkzOTY4IEYzMDBcbkcxIFgxODMuMzc1ODQyMjYyNjYzNjQgWTI2Ni44NDc4NTMwODIwMDY4NSBGMzAwXG5HMSBYMTg2LjU4MjI0Nzc3MDUzNiBZMjY3LjYzMDAwOTQwODUwODEgRjMwMFxuRzEgWDE4OC4xOTQwMDk5OTk5OTk5NiBZMjY3LjcyNTM4Njk5OTk5OTk2IEYzMDBcbkcxIFgxOTEuNDcwMjgzODU3NDU5IFkyNjcuMzI2ODQ2NjQ5NTU3OCBGMzAwXG5HMSBYMTk0LjU1NTQ2NzMzNDc5MTkzIFkyNjYuMTU0NDc4MjI5OTkzNCBGMzAwXG5HMSBYMTk3LjI2OTYxNjM3NjY1MjEgWTI2NC4yNzY2NjA0MDY0MDk1IEYzMDBcbkcxIFgxOTkuNDU0NDI3NTk4ODE3NTUgWTI2MS44MDI5MTczNDcwOTY0IEYzMDBcbkcxIFgyMDAuOTgyNDcxMzcwNDgyOTMgWTI1OC44Nzc1MzA3MDA1MzU5IEYzMDBcbkcxIFgyMDEuNzY0NjI0MTc3NTg3OSBZMjU1LjY3MTEyNDMzNDE1OTY5IEYzMDBcbkcxIFgyMDEuODYgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTE2XG5HMCBYMzYuNTgxNzQ0IFkyMzAuNDQ4MjE0XG5HMSBYMzYuMTgzMTkxMTgzMTM1NTUgWTIyNy4xNzE5NDE2NTkwMzU0NyBGMzAwXG5HMSBYMzUuMDEwODExMDI0MjY1MjY2IFkyMjQuMDg2NzYyNjQyNjU5MzggRjMwMFxuRzEgWDMzLjEzMjk4Mjg3MzE4OTU3NiBZMjIxLjM3MjYyMDc0NjAzMjA2IEYzMDBcbkcxIFgzMC42NTkyMzE1MDA1NTIyMTcgWTIxOS4xODc4MTg5MzY2MjgxMyBGMzAwXG5HMSBYMjcuNzMzODM5MDM5NzExNTc2IFkyMTcuNjU5Nzg2Mjk2MjUxMzggRjMwMFxuRzEgWDI0LjUyNzQyOTY5NzIxODY2IFkyMTYuODc3NjQ1Njg5NzI3MDUgRjMwMFxuRzEgWDIyLjkxNTczOTAwMDAwMDAwMiBZMjE2Ljc4MjI3NjAwMDAwMDAyIEYzMDBcbkcxIFgxOS42Mzk0NjQ2MzUxMDQyNTQgWTIxNy4xODA4MTIxNzg5NDM3IEYzMDBcbkcxIFgxNi41NTQyNzk2NjUwNjIwMTUgWTIxOC4zNTMxNzY2NzAzMTM3NiBGMzAwXG5HMSBYMTMuODQwMTI4MjMyMjgyNTM2IFkyMjAuMjMwOTkxMDM4MTIwMzggRjMwMFxuRzEgWDExLjY1NTMxMzg2MDQzODcyOCBZMjIyLjcwNDczMTMxNTYzMjI3IEYzMDBcbkcxIFgxMC4xMjcyNjYzNjQwNDE2ODggWTIyNS42MzAxMTYwMTY2MTY4NSBGMzAwXG5HMSBYOS4zNDUxMDk0NzQzOTc1NiBZMjI4LjgzNjUyMTM4NzExODU4IEYzMDBcbkcxIFg5LjI0OTczMTU5OTk5OTk5OSBZMjMwLjQ0ODIxNDAwMDAwMDA0IEYzMDBcbkcxIFg5LjY0ODI2NzYzNTE0MDg1NiBZMjMzLjcyNDQ4ODM4MjM4ODM2IEYzMDBcbkcxIFgxMC44MjA2MzE5OTEwOTU0MDQgWTIzNi44MDk2NzM0MDM4ODgyNyBGMzAwXG5HMSBYMTIuNjk4NDQ2MjM5NzcxOTk4IFkyMzkuNTIzODI0OTE5MDg5MTIgRjMwMFxuRzEgWDE1LjE3MjE4NjQyMTM4NzY0MyBZMjQxLjcwODYzOTM5OTUxMDgyIEYzMDBcbkcxIFgxOC4wOTc1NzEwNTUzMDI5MDcgWTI0My4yMzY2ODcwMjQzMDk0IEYzMDBcbkcxIFgyMS4zMDM5NzYzOTE0NzQwMzggWTI0NC4wMTg4NDQwNTQ2ODk2MiBGMzAwXG5HMSBYMjIuOTE1NzM5IFkyNDQuMTE0MjIxOTk5OTk5OTggRjMwMFxuRzEgWDI2LjE5MjAxMzI5NDkwMDUzNCBZMjQzLjcxNTY4NTI0NTY0MjIyIEYzMDBcbkcxIFgyOS4yNzcxOTgwNTkwMzk2NSBZMjQyLjU0MzMyMDIxMjQxOTI1IEYzMDBcbkcxIFgzMS45OTEzNDkxNjIwMTc0MTQgWTI0MC42NjU1MDUzNjc5MjQ1NyBGMzAwXG5HMSBYMzQuMTc2MTYzMDk5Mzk2NjUgWTIzOC4xOTE3NjQ3MDY2OTI0IEYzMDBcbkcxIFgzNS43MDQyMTAwODIwMDY1NTQgWTIzNS4yNjYzNzk3MzczMzU5IEYzMDBcbkcxIFgzNi40ODYzNjY0MDg1MDc3MSBZMjMyLjA1OTk3NDIyOTQ2MzU2IEYzMDBcbkcxIFgzNi41ODE3NDQgWTIzMC40NDgyMTQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUxN1xuRzAgWDYwLjE5MjkyMiBZMjMwLjQ0ODIxNFxuRzEgWDU5Ljc5NDM2OTE4MzEzNTU1IFkyMjcuMTcxOTQxNjU5MDM1NDcgRjMwMFxuRzEgWDU4LjYyMTk4OTAyNDI2NTI2IFkyMjQuMDg2NzYyNjQyNjU5MzggRjMwMFxuRzEgWDU2Ljc0NDE2MDg3MzE4OTU3IFkyMjEuMzcyNjIwNzQ2MDMyMDYgRjMwMFxuRzEgWDU0LjI3MDQwOTUwMDU1MjIyIFkyMTkuMTg3ODE4OTM2NjI4MTMgRjMwMFxuRzEgWDUxLjM0NTAxNzAzOTcxMTU3IFkyMTcuNjU5Nzg2Mjk2MjUxMzggRjMwMFxuRzEgWDQ4LjEzODYwNzY5NzIxODY2IFkyMTYuODc3NjQ1Njg5NzI3MDUgRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMjE2Ljc4MjI3NjAwMDAwMDAyIEYzMDBcbkcxIFg0My4yNTA2NDI2MTc2MDY3IFkyMTcuMTgwODEyMDM1MTAwMzMgRjMwMFxuRzEgWDQwLjE2NTQ1NzU5NjA5MjI5NSBZMjE4LjM1MzE3NjM5MTAxNjcgRjMwMFxuRzEgWDM3LjQ1MTMwNjA4MDg2ODE4NiBZMjIwLjIzMDk5MDYzOTY1OTcgRjMwMFxuRzEgWDM1LjI2NjQ5MTYwMDQxNTg5IFkyMjIuNzA0NzMwODIxMjQ4MyBGMzAwXG5HMSBYMzMuNzM4NDQzOTc1NTgxMTMgWTIyNS42MzAxMTU0NTUxNDQ2NSBGMzAwXG5HMSBYMzIuOTU2Mjg2OTQ1MTYxMiBZMjI4LjgzNjUyMDc5MTMwNjEgRjMwMFxuRzEgWDMyLjg2MDkwODk5OTk5OTk5IFkyMzAuNDQ4MjE0IEYzMDBcbkcxIFgzMy4yNTk0NDUwMzUxNDA4MyBZMjMzLjcyNDQ4ODM4MjM4ODM2IEYzMDBcbkcxIFgzNC40MzE4MDkzOTEwOTUzNiBZMjM2LjgwOTY3MzQwMzg4ODI3IEYzMDBcbkcxIFgzNi4zMDk2MjM2Mzk3NzE5MyBZMjM5LjUyMzgyNDkxOTA4OTEyIEYzMDBcbkcxIFgzOC43ODMzNjM4MjEzODc1NSBZMjQxLjcwODYzOTM5OTUxMDgyIEYzMDBcbkcxIFg0MS43MDg3NDg0NTUzMDI4MSBZMjQzLjIzNjY4NzAyNDMwOTQgRjMwMFxuRzEgWDQ0LjkxNTE1Mzc5MTQ3Mzk1NSBZMjQ0LjAxODg0NDA1NDY4OTY4IEYzMDBcbkcxIFg0Ni41MjY5MTcgWTI0NC4xMTQyMjE5OTk5OTk5OCBGMzAwXG5HMSBYNDkuODAzMTkxMjk0OTAwNTQgWTI0My43MTU2ODUyNDU2NDIyMiBGMzAwXG5HMSBYNTIuODg4Mzc2MDU5MDM5NjYgWTI0Mi41NDMzMjAyMTI0MTkyNSBGMzAwXG5HMSBYNTUuNjAyNTI3MTYyMDE3NDI0IFkyNDAuNjY1NTA1MzY3OTI0NTcgRjMwMFxuRzEgWDU3Ljc4NzM0MTA5OTM5NjY2IFkyMzguMTkxNzY0NzA2NjkyNCBGMzAwXG5HMSBYNTkuMzE1Mzg4MDgyMDA2NTY0IFkyMzUuMjY2Mzc5NzM3MzM1OSBGMzAwXG5HMSBYNjAuMDk3NTQ0NDA4NTA3NzIgWTIzMi4wNTk5NzQyMjk0NjM1NiBGMzAwXG5HMSBYNjAuMTkyOTIyMDAwMDAwMDEgWTIzMC40NDgyMTQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUxOFxuRzAgWDgzLjgwNDA5IFkyMzAuNDQ4MjE0XG5HMSBYODMuNDA1NTM3MTgzMTM1NTggWTIyNy4xNzE5NDE2NTkwMzU0NCBGMzAwXG5HMSBYODIuMjMzMTU3MDI0MjY1MzIgWTIyNC4wODY3NjI2NDI2NTkzNSBGMzAwXG5HMSBYODAuMzU1MzI4ODczMTg5NjYgWTIyMS4zNzI2MjA3NDYwMzIwNiBGMzAwXG5HMSBYNzcuODgxNTc3NTAwNTUyMzEgWTIxOS4xODc4MTg5MzY2MjgwOCBGMzAwXG5HMSBYNzQuOTU2MTg1MDM5NzExNjggWTIxNy42NTk3ODYyOTYyNTEzIEYzMDBcbkcxIFg3MS43NDk3NzU2OTcyMTg3OCBZMjE2Ljg3NzY0NTY4OTcyNjk2IEYzMDBcbkcxIFg3MC4xMzgwODIgWTIxNi43ODIyNzYwMDAwMDAwMiBGMzAwXG5HMSBYNjYuODYxODA3NzA1MDk0NTIgWTIxNy4xODA4MTI3NTQzMTcyNiBGMzAwXG5HMSBYNjMuNzc2NjIyOTQwOTQwOTMgWTIxOC4zNTMxNzc3ODc1MDIwNiBGMzAwXG5HMSBYNjEuMDYyNDcxODM3OTM5OTUgWTIyMC4yMzA5OTI2MzE5NjMxOCBGMzAwXG5HMSBYNTguODc3NjU3OTAwNTMwMDk2IFkyMjIuNzA0NzMzMjkzMTY4MzIgRjMwMFxuRzEgWDU3LjM0OTYxMDkxNzg4NDAxIFkyMjUuNjMwMTE4MjYyNTA1ODcgRjMwMFxuRzEgWDU2LjU2NzQ1NDU5MTM0MzE4NiBZMjI4LjgzNjUyMzc3MDM2ODYgRjMwMFxuRzEgWDU2LjQ3MjA3Njk5OTk5OTk5IFkyMzAuNDQ4MjE0IEYzMDBcbkcxIFg1Ni44NzA2MTMwMzUxNDA4NiBZMjMzLjcyNDQ4ODM4MjM4ODQgRjMwMFxuRzEgWDU4LjA0Mjk3NzM5MTA5NTQwNSBZMjM2LjgwOTY3MzQwMzg4ODI0IEYzMDBcbkcxIFg1OS45MjA3OTE2Mzk3NzIwMDYgWTIzOS41MjM4MjQ5MTkwODkxMiBGMzAwXG5HMSBYNjIuMzk0NTMxODIxMzg3NjMgWTI0MS43MDg2MzkzOTk1MTA4IEYzMDBcbkcxIFg2NS4zMTk5MTY0NTUzMDI4NyBZMjQzLjIzNjY4NzAyNDMwOTMzIEYzMDBcbkcxIFg2OC41MjYzMjE3OTE0NzQwMiBZMjQ0LjAxODg0NDA1NDY4OTYgRjMwMFxuRzEgWDcwLjEzODA4MjAwMDAwMDAxIFkyNDQuMTE0MjIxOTk5OTk5OTggRjMwMFxuRzEgWDczLjQxNDM1NjM4MjM4ODMzIFkyNDMuNzE1Njg1OTY0ODU5MTUgRjMwMFxuRzEgWDc2LjQ5OTU0MTQwMzg4ODIyIFkyNDIuNTQzMzIxNjA4OTA0NjUgRjMwMFxuRzEgWDc5LjIxMzY5MjkxOTA4OTEgWTI0MC42NjU1MDczNjAyMjgwOCBGMzAwXG5HMSBYODEuMzk4NTA3Mzk5NTEwOCBZMjM4LjE5MTc2NzE3ODYxMjQ4IEYzMDBcbkcxIFg4Mi45MjY1NTUwMjQzMDk0IFkyMzUuMjY2MzgyNTQ0Njk3MjUgRjMwMFxuRzEgWDgzLjcwODcxMjA1NDY4OTY4IFkyMzIuMDU5OTc3MjA4NTI2MTMgRjMwMFxuRzEgWDgzLjgwNDA5IFkyMzAuNDQ4MjE0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMTlcbkcwIFgxMDcuNDE1MjUgWTIzMC40NDgyMTRcbkcxIFgxMDcuMDE2Njk3MTgzMTM1OTcgWTIyNy4xNzE5NDE2NTkwMzU0IEYzMDBcbkcxIFgxMDUuODQ0MzE3MDI0MjY2MDggWTIyNC4wODY3NjI2NDI2NTkxNSBGMzAwXG5HMSBYMTAzLjk2NjQ4ODg3MzE5MDc0IFkyMjEuMzcyNjIwNzQ2MDMxNiBGMzAwXG5HMSBYMTAxLjQ5MjczNzUwMDU1MzY3IFkyMTkuMTg3ODE4OTM2NjI3MzcgRjMwMFxuRzEgWDk4LjU2NzM0NTAzOTcxMzIyIFkyMTcuNjU5Nzg2Mjk2MjUwMjIgRjMwMFxuRzEgWDk1LjM2MDkzNTY5NzIyMDQ0IFkyMTYuODc3NjQ1Njg5NzI1NSBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkyMTYuNzgyMjc2MDAwMDAwMDIgRjMwMFxuRzEgWDkwLjQ3Mjk3NjYxNzYwNjcgWTIxNy4xODA4MTIwMzUxMDAzMyBGMzAwXG5HMSBYODcuMzg3NzkxNTk2MDkyMyBZMjE4LjM1MzE3NjM5MTAxNjcgRjMwMFxuRzEgWDg0LjY3MzY0MDA4MDg2ODE4IFkyMjAuMjMwOTkwNjM5NjU5NyBGMzAwXG5HMSBYODIuNDg4ODI1NjAwNDE1OSBZMjIyLjcwNDczMDgyMTI0ODMgRjMwMFxuRzEgWDgwLjk2MDc3Nzk3NTU4MTEyIFkyMjUuNjMwMTE1NDU1MTQ0NjUgRjMwMFxuRzEgWDgwLjE3ODYyMDk0NTE2MTIgWTIyOC44MzY1MjA3OTEzMDYxIEYzMDBcbkcxIFg4MC4wODMyNDMgWTIzMC40NDgyMTQgRjMwMFxuRzEgWDgwLjQ4MTc3OTAzNTE0MDgzIFkyMzMuNzI0NDg4MzgyMzg4MzYgRjMwMFxuRzEgWDgxLjY1NDE0MzM5MTA5NTM2IFkyMzYuODA5NjczNDAzODg4MjcgRjMwMFxuRzEgWDgzLjUzMTk1NzYzOTc3MTkzIFkyMzkuNTIzODI0OTE5MDg5MTIgRjMwMFxuRzEgWDg2LjAwNTY5NzgyMTM4NzU2IFkyNDEuNzA4NjM5Mzk5NTEwODIgRjMwMFxuRzEgWDg4LjkzMTA4MjQ1NTMwMjgxIFkyNDMuMjM2Njg3MDI0MzA5NCBGMzAwXG5HMSBYOTIuMTM3NDg3NzkxNDczOTYgWTI0NC4wMTg4NDQwNTQ2ODk2OCBGMzAwXG5HMSBYOTMuNzQ5MjUxMDAwMDAwMDMgWTI0NC4xMTQyMjE5OTk5OTk5OCBGMzAwXG5HMSBYOTcuMDI1NTI1MTE5OTI0MzggWTI0My43MTU2ODM4MDcyMDg0IEYzMDBcbkcxIFgxMDAuMTEwNzA5MzY5MzQxNDUgWTI0Mi41NDMzMTc0MTk0NDg3IEYzMDBcbkcxIFgxMDIuODI0ODU5NjQ3ODcyNTkgWTI0MC42NjU1MDEzODMzMTgwNiBGMzAwXG5HMSBYMTA1LjAwOTY3MjQ5OTE2NjY1IFkyMzguMTkxNzU5NzYyODUzMTQgRjMwMFxuRzEgWDEwNi41Mzc3MTgxOTczOTg5NyBZMjM1LjI2NjM3NDEyMjYxNDYyIEYzMDBcbkcxIFgxMDcuMzE5ODczMTE2MTQxNzggWTIzMi4wNTk5NjgyNzEzNDAyNyBGMzAwXG5HMSBYMTA3LjQxNTI1IFkyMzAuNDQ4MjE0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMjBcbkcwIFgxMzEuMDI2NDEgWTIzMC40NDgyMTRcbkcxIFgxMzAuNjI3ODU3MTgzMTM1ODYgWTIyNy4xNzE5NDE2NTkwMzUzOCBGMzAwXG5HMSBYMTI5LjQ1NTQ3NzAyNDI2NTg2IFkyMjQuMDg2NzYyNjQyNjU5MiBGMzAwXG5HMSBYMTI3LjU3NzY0ODg3MzE5MDQ0IFkyMjEuMzcyNjIwNzQ2MDMxNzQgRjMwMFxuRzEgWDEyNS4xMDM4OTc1MDA1NTMyOSBZMjE5LjE4NzgxODkzNjYyNzYgRjMwMFxuRzEgWDEyMi4xNzg1MDUwMzk3MTI4IFkyMTcuNjU5Nzg2Mjk2MjUwNTYgRjMwMFxuRzEgWDExOC45NzIwOTU2OTcyMTk5NiBZMjE2Ljg3NzY0NTY4OTcyNTk0IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTIxNi43ODIyNzYwMDAwMDAwMiBGMzAwXG5HMSBYMTE0LjA4NDEzNTg1MDkwNzkzIFkyMTcuMTgwODEzOTUzMDEyMTIgRjMwMFxuRzEgWDExMC45OTg5NTE1MTU2ODkzMSBZMjE4LjM1MzE4MDExNDk3NzUzIEYzMDBcbkcxIFgxMDguMjg0ODAxMDk5NzI3MTYgWTIyMC4yMzA5OTU5NTI0Njg2NSBGMzAwXG5HMSBYMTA2LjA5OTk4ODA2NzM4ODI3IFkyMjIuNzA0NzM3NDEzMDM0NDIgRjMwMFxuRzEgWDEwNC41NzE5NDIxNTUwNTY4MyBZMjI1LjYzMDEyMjk0MTQ0MDQgRjMwMFxuRzEgWDEwMy43ODk3ODcwMDE2NDc5NSBZMjI4LjgzNjUyODczNTQ3MTQ2IEYzMDBcbkcxIFgxMDMuNjk0NDEgWTIzMC40NDgyMTM5OTk5OTk5OCBGMzAwXG5HMSBYMTA0LjA5Mjk0NjAzNTE0MDU2IFkyMzMuNzI0NDg4MzgyMzg4NDIgRjMwMFxuRzEgWDEwNS4yNjUzMTAzOTEwOTQ4MSBZMjM2LjgwOTY3MzQwMzg4ODQgRjMwMFxuRzEgWDEwNy4xNDMxMjQ2Mzk3NzExNiBZMjM5LjUyMzgyNDkxOTA4OTQ2IEYzMDBcbkcxIFgxMDkuNjE2ODY0ODIxMzg2NiBZMjQxLjcwODYzOTM5OTUxMTM4IEYzMDBcbkcxIFgxMTIuNTQyMjQ5NDU1MzAxNyBZMjQzLjIzNjY4NzAyNDMxMDIgRjMwMFxuRzEgWDExNS43NDg2NTQ3OTE0NzI3NSBZMjQ0LjAxODg0NDA1NDY5MDc2IEYzMDBcbkcxIFgxMTcuMzYwNDEwMDAwMDAwMDIgWTI0NC4xMTQyMjIgRjMwMFxuRzEgWDEyMC42MzY2ODQxNDkwODcxNSBZMjQzLjcxNTY4NDA0Njk0NzQgRjMwMFxuRzEgWDEyMy43MjE4Njg0ODQyOTEyOCBZMjQyLjU0MzMxNzg4NDk0MzggRjMwMFxuRzEgWDEyNi40MzYwMTg5MDAyMzAyIFkyNDAuNjY1NTAyMDQ3NDE5MTIgRjMwMFxuRzEgWDEyOC42MjA4MzE5MzI1Mzg1IFkyMzguMTkxNzYwNTg2ODI2MzIgRjMwMFxuRzEgWDEzMC4xNDg4Nzc4NDQ4MzM3NSBZMjM1LjI2NjM3NTA1ODQwMTQ1IEYzMDBcbkcxIFgxMzAuOTMxMDMyOTk4MjAyOTQgWTIzMi4wNTk5NjkyNjQzNjA3MiBGMzAwXG5HMSBYMTMxLjAyNjQxIFkyMzAuNDQ4MjE0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMjFcbkcwIFgxNTQuNjM3NiBZMjMwLjQ0ODIxNFxuRzEgWDE1NC4yMzkwNDcxODMxMzU4NSBZMjI3LjE3MTk0MTY1OTAzNTM4IEYzMDBcbkcxIFgxNTMuMDY2NjY3MDI0MjY1ODUgWTIyNC4wODY3NjI2NDI2NTkyIEYzMDBcbkcxIFgxNTEuMTg4ODM4ODczMTkwNDMgWTIyMS4zNzI2MjA3NDYwMzE3NCBGMzAwXG5HMSBYMTQ4LjcxNTA4NzUwMDU1MzMgWTIxOS4xODc4MTg5MzY2Mjc2IEYzMDBcbkcxIFgxNDUuNzg5Njk1MDM5NzEyODMgWTIxNy42NTk3ODYyOTYyNTA1NiBGMzAwXG5HMSBYMTQyLjU4MzI4NTY5NzIyIFkyMTYuODc3NjQ1Njg5NzI1OTQgRjMwMFxuRzEgWDE0MC45NzE2IFkyMTYuNzgyMjc2MDAwMDAwMDIgRjMwMFxuRzEgWDEzNy42OTUzMjU1NTkyODE2IFkyMTcuMTgwODExNTU1NjIyMzcgRjMwMFxuRzEgWDEzNC42MTAxNDAzNjYxOTM0IFkyMTguMzUzMTc1NDYwMDI2NCBGMzAwXG5HMSBYMTMxLjg5NTk4ODU3NjE1Mzk3IFkyMjAuMjMwOTg5MzExNDU3MjUgRjMwMFxuRzEgWDEyOS43MTExNzM3MzM2NzM0NiBZMjIyLjcwNDcyOTE3MzMwMTQyIEYzMDBcbkcxIFgxMjguMTgzMTI1NjgwNzEyOTUgWTIyNS42MzAxMTM1ODM1NzAyIEYzMDBcbkcxIFgxMjcuNDAwOTY4MTgxMDQwMjcgWTIyOC44MzY1MTg4MDUyNjQwNiBGMzAwXG5HMSBYMTI3LjMwNTU5MDAwMDAwMDAyIFkyMzAuNDQ4MjE0IEYzMDBcbkcxIFgxMjcuNzA0MTI2MDM1MTQwNzMgWTIzMy43MjQ0ODgzODIzODg0IEYzMDBcbkcxIFgxMjguODc2NDkwMzkxMDk1MTYgWTIzNi44MDk2NzM0MDM4ODgzIEYzMDBcbkcxIFgxMzAuNzU0MzA0NjM5NzcxNjUgWTIzOS41MjM4MjQ5MTkwODkyNiBGMzAwXG5HMSBYMTMzLjIyODA0NDgyMTM4NzIgWTI0MS43MDg2MzkzOTk1MTEwNCBGMzAwXG5HMSBYMTM2LjE1MzQyOTQ1NTMwMjM2IFkyNDMuMjM2Njg3MDI0MzA5NyBGMzAwXG5HMSBYMTM5LjM1OTgzNDc5MTQ3MzQ3IFkyNDQuMDE4ODQ0MDU0NjkwMDggRjMwMFxuRzEgWDE0MC45NzE2MDAwMDAwMDAwMiBZMjQ0LjExNDIyMiBGMzAwXG5HMSBYMTQ0LjI0Nzg3NDE0OTA4NzE1IFkyNDMuNzE1Njg0MDQ2OTQ3NCBGMzAwXG5HMSBYMTQ3LjMzMzA1ODQ4NDI5MTI5IFkyNDIuNTQzMzE3ODg0OTQzOCBGMzAwXG5HMSBYMTUwLjA0NzIwODkwMDIzMDIgWTI0MC42NjU1MDIwNDc0MTkxMiBGMzAwXG5HMSBYMTUyLjIzMjAyMTkzMjUzODUgWTIzOC4xOTE3NjA1ODY4MjYzMiBGMzAwXG5HMSBYMTUzLjc2MDA2Nzg0NDgzMzc3IFkyMzUuMjY2Mzc1MDU4NDAxNDIgRjMwMFxuRzEgWDE1NC41NDIyMjI5OTgyMDI5NiBZMjMyLjA1OTk2OTI2NDM2MDcgRjMwMFxuRzEgWDE1NC42Mzc2MDAwMDAwMDAwMiBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTIyXG5HMCBYMTc4LjI0ODgxIFkyMzAuNDQ4MjE0XG5HMSBYMTc3Ljg1MDI1NzE4MzEzNzI0IFkyMjcuMTcxOTQxNjU5MDM1MjQgRjMwMFxuRzEgWDE3Ni42Nzc4NzcwMjQyNjg1OCBZMjI0LjA4Njc2MjY0MjY1ODU2IEYzMDBcbkcxIFgxNzQuODAwMDQ4ODczMTk0MyBZMjIxLjM3MjYyMDc0NjAzMDI2IEYzMDBcbkcxIFgxNzIuMzI2Mjk3NTAwNTU4MDcgWTIxOS4xODc4MTg5MzY2MjUwNCBGMzAwXG5HMSBYMTY5LjQwMDkwNTAzOTcxODIyIFkyMTcuNjU5Nzg2Mjk2MjQ2NzUgRjMwMFxuRzEgWDE2Ni4xOTQ0OTU2OTcyMjU3IFkyMTYuODc3NjQ1Njg5NzIwNzcgRjMwMFxuRzEgWDE2NC41ODI3OSBZMjE2Ljc4MjI3NjAwMDAwMDAyIEYzMDBcbkcxIFgxNjEuMzA2NTE2MTQyNTM2MDUgWTIxNy4xODA4MTYzNTA0MDE3IEYzMDBcbkcxIFgxNTguMjIxMzMyNjY1MTg4NiBZMjE4LjM1MzE4NDc2OTkyNzkgRjMwMFxuRzEgWDE1NS41MDcxODM2MjMzMDUyIFkyMjAuMjMxMDAyNTkzNDc4MjIgRjMwMFxuRzEgWDE1My4zMjIzNzI0MDExMDkxMyBZMjIyLjcwNDc0NTY1Mjc2NDMzIEYzMDBcbkcxIFgxNTEuNzk0MzI4NjI5NDA3NTcgWTIyNS42MzAxMzIyOTkzMDU5NiBGMzAwXG5HMSBYMTUxLjAxMjE3NTgyMjI2MjkyIFkyMjguODM2NTM4NjY1NjcyNSBGMzAwXG5HMSBYMTUwLjkxNjgwMDAwMDAwMDAyIFkyMzAuNDQ4MjE0MDAwMDAwMDQgRjMwMFxuRzEgWDE1MS4zMTUzMzYwMzUxMzg2NCBZMjMzLjcyNDQ4ODM4MjM4ODY0IEYzMDBcbkcxIFgxNTIuNDg3NzAwMzkxMDkxMSBZMjM2LjgwOTY3MzQwMzg4OTM1IEYzMDBcbkcxIFgxNTQuMzY1NTE0NjM5NzY1ODUgWTIzOS41MjM4MjQ5MTkwOTE0OCBGMzAwXG5HMSBYMTU2LjgzOTI1NDgyMTM4IFkyNDEuNzA4NjM5Mzk5NTE0ODUgRjMwMFxuRzEgWDE1OS43NjQ2Mzk0NTUyOTQyIFkyNDMuMjM2Njg3MDI0MzE1NCBGMzAwXG5HMSBYMTYyLjk3MTA0NDc5MTQ2NDggWTI0NC4wMTg4NDQwNTQ2OTc4IEYzMDBcbkcxIFgxNjQuNTgyNzkgWTI0NC4xMTQyMjE5OTk5OTk5OCBGMzAwXG5HMSBYMTY3Ljg1OTA2NDczMjMzODA4IFkyNDMuNzE1Njg4ODQxNzI3MTEgRjMwMFxuRzEgWDE3MC45NDQyNTA3ODMyNzk2NCBZMjQyLjU0MzMyNzE5NDg0Njk3IEYzMDBcbkcxIFgxNzMuNjU4NDAzOTQ3MzcxNjggWTI0MC42NjU1MTUzMjk0NDM3NiBGMzAwXG5HMSBYMTc1Ljg0MzIyMDU5OTk2MjA4IFkyMzguMTkxNzc3MDY2Mjk1NTQgRjMwMFxuRzEgWDE3Ny4zNzEyNzA3OTM1MTQ2NyBZMjM1LjI2NjM5Mzc3NDE0NjY1IEYzMDBcbkcxIFgxNzguMTUzNDMwNjM5NDExMDYgWTIzMi4wNTk5ODkxMjQ3ODIgRjMwMFxuRzEgWDE3OC4yNDg4MSBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTIzXG5HMCBYMjAxLjg2IFkyMzAuNDQ4MjE0XG5HMSBYMjAxLjQ2MTQ0NzE4MzEzNzggWTIyNy4xNzE5NDE2NTkwMzUxOCBGMzAwXG5HMSBYMjAwLjI4OTA2NzAyNDI2OTYzIFkyMjQuMDg2NzYyNjQyNjU4MzMgRjMwMFxuRzEgWDE5OC40MTEyMzg4NzMxOTU4IFkyMjEuMzcyNjIwNzQ2MDI5NzIgRjMwMFxuRzEgWDE5NS45Mzc0ODc1MDA1NTk5IFkyMTkuMTg3ODE4OTM2NjI0MSBGMzAwXG5HMSBYMTkzLjAxMjA5NTAzOTcyMDMyIFkyMTcuNjU5Nzg2Mjk2MjQ1MzMgRjMwMFxuRzEgWDE4OS44MDU2ODU2OTcyMjc5NyBZMjE2Ljg3NzY0NTY4OTcxODgzIEYzMDBcbkcxIFgxODguMTk0MDEgWTIxNi43ODIyNzYwMDAwMDAwMiBGMzAwXG5HMSBYMTg0LjkxNzczNTU1OTI4MTU3IFkyMTcuMTgwODExNTU1NjIyMzcgRjMwMFxuRzEgWDE4MS44MzI1NTAzNjYxOTMzNyBZMjE4LjM1MzE3NTQ2MDAyNjQgRjMwMFxuRzEgWDE3OS4xMTgzOTg1NzYxNTM5NCBZMjIwLjIzMDk4OTMxMTQ1NzI1IEYzMDBcbkcxIFgxNzYuOTMzNTgzNzMzNjczNDMgWTIyMi43MDQ3MjkxNzMzMDE0MiBGMzAwXG5HMSBYMTc1LjQwNTUzNTY4MDcxMjkyIFkyMjUuNjMwMTEzNTgzNTcwMiBGMzAwXG5HMSBYMTc0LjYyMzM3ODE4MTA0MDI0IFkyMjguODM2NTE4ODA1MjY0MDYgRjMwMFxuRzEgWDE3NC41MjggWTIzMC40NDgyMTQwMDAwMDAwNCBGMzAwXG5HMSBYMTc0LjkyNjUzNjAzNTE0MDcgWTIzMy43MjQ0ODgzODIzODgzNiBGMzAwXG5HMSBYMTc2LjA5ODkwMDM5MTA5NTEzIFkyMzYuODA5NjczNDAzODg4MyBGMzAwXG5HMSBYMTc3Ljk3NjcxNDYzOTc3MTYxIFkyMzkuNTIzODI0OTE5MDg5MjQgRjMwMFxuRzEgWDE4MC40NTA0NTQ4MjEzODcxOCBZMjQxLjcwODYzOTM5OTUxMTAxIEYzMDBcbkcxIFgxODMuMzc1ODM5NDU1MzAyMzggWTI0My4yMzY2ODcwMjQzMDk3IEYzMDBcbkcxIFgxODYuNTgyMjQ0NzkxNDczNSBZMjQ0LjAxODg0NDA1NDY5MDA4IEYzMDBcbkcxIFgxODguMTk0MDA5OTk5OTk5OTYgWTI0NC4xMTQyMjE5OTk5OTk5OCBGMzAwXG5HMSBYMTkxLjQ3MDI4Mzg1NzQ1OSBZMjQzLjcxNTY4MTY0OTU1NzggRjMwMFxuRzEgWDE5NC41NTU0NjczMzQ3OTE5NiBZMjQyLjU0MzMxMzIyOTk5MzQzIEYzMDBcbkcxIFgxOTcuMjY5NjE2Mzc2NjUyMTUgWTI0MC42NjU0OTU0MDY0MDk1NSBGMzAwXG5HMSBYMTk5LjQ1NDQyNzU5ODgxNzYgWTIzOC4xOTE3NTIzNDcwOTY0NCBGMzAwXG5HMSBYMjAwLjk4MjQ3MTM3MDQ4Mjk4IFkyMzUuMjY2MzY1NzAwNTM1OSBGMzAwXG5HMSBYMjAxLjc2NDYyNDE3NzU4OCBZMjMyLjA1OTk1OTMzNDE1OTcxIEYzMDBcbkcxIFgyMDEuODYgWTIzMC40NDgyMTQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUyNFxuRzAgWDM2LjU4MTc0NCBZMjA2LjgzNzE3M1xuRzEgWDM2LjE4MzE5MjM4MTgyOTc1NSBZMjAzLjU2MDkwMDUxMzIxNjU4IEYzMDBcbkcxIFgzNS4wMTA4MTMzNTE3MzgxNSBZMjAwLjQ3NTcyMTA2NzkwMDQyIEYzMDBcbkcxIFgzMy4xMzI5ODYxOTM2ODkzNSBZMTk3Ljc2MTU3ODQ4NDIyOTc3IEYzMDBcbkcxIFgzMC42NTkyMzU2MjA0MDg1NCBZMTk1LjU3Njc3NTc2OTc1MTI0IEYzMDBcbkcxIFgyNy43MzM4NDM3MTg2MzE0NzYgWTE5NC4wNDg3NDIwNTkwNTczIEYzMDBcbkcxIFgyNC41Mjc0MzQ2NjIzMDE2NDggWTE5My4yNjY2MDAyNzkzOTk3NCBGMzAwXG5HMSBYMjIuOTE1NzM5IFkxOTMuMTcxMjI5OTk5OTk5OTggRjMwMFxuRzEgWDE5LjYzOTQ2NDYzNTEwNDk1NyBZMTkzLjU2OTc2NjE3ODk0OTQgRjMwMFxuRzEgWDE2LjU1NDI3OTY2NTA2NDc3NiBZMTk0Ljc0MjEzMDY3MDMyNDg4IEYzMDBcbkcxIFgxMy44NDAxMjgyMzIyODg1NyBZMTk2LjYxOTk0NTAzODEzNjI4IEYzMDBcbkcxIFgxMS42NTUzMTM4NjA0NDkwOSBZMTk5LjA5MzY4NTMxNTY1MiBGMzAwXG5HMSBYMTAuMTI3MjY2MzY0MDU3MTkgWTIwMi4wMTkwNzAwMTY2MzkzIEYzMDBcbkcxIFg5LjM0NTEwOTQ3NDQxODY5NSBZMjA1LjIyNTQ3NTM4NzE0MjM4IEYzMDBcbkcxIFg5LjI0OTczMTYgWTIwNi44MzcxNzMgRjMwMFxuRzEgWDkuNjQ4Mjg1ODU1Mjk3NDEgWTIxMC4xMTM0NDUxNjU5ODE0IEYzMDBcbkcxIFgxMC44MjA2NjczNjg3MDE4OTggWTIxMy4xOTg2MjM2Njc2Mjg4MiBGMzAwXG5HMSBYMTIuNjk4NDk2NzExNDA5NDk5IFkyMTUuOTEyNzY0NzM5ODAzNjYgRjMwMFxuRzEgWDE1LjE3MjI0OTA0MzI3NDI4NCBZMjE4LjA5NzU2NTQ2MzExNzcgRjMwMFxuRzEgWDE4LjA5NzY0MjE3NDk5MDY3NSBZMjE5LjYyNTU5NjgxOTExMzU4IEYzMDBcbkcxIFgyMS4zMDQwNTE4NjA4Nzg2NzYgWTIyMC40MDc3MzYwMTc4Nzc4NSBGMzAwXG5HMSBYMjIuOTE1NzM4OTk5OTk5OTg4IFkyMjAuNTAzMTA1IEYzMDBcbkcxIFgyNi4xOTIwMTMyOTQ5MDYzNzggWTIyMC4xMDQ1NjgyNDU2OTAyNSBGMzAwXG5HMSBYMjkuMjc3MTk4MDU5MDYyNjUgWTIxOC45MzIyMDMyMTI1MTI0NiBGMzAwXG5HMSBYMzEuOTkxMzQ5MTYyMDY3OTIzIFkyMTcuMDU0Mzg4MzY4MDU3NTQgRjMwMFxuRzEgWDM0LjE3NjE2MzA5OTQ4MzQyNSBZMjE0LjU4MDY0NzcwNjg1NzM4IEYzMDBcbkcxIFgzNS43MDQyMTAwODIxMzYxOCBZMjExLjY1NTI2MjczNzUyMzMgRjMwMFxuRzEgWDM2LjQ4NjM2NjQwODY4NDMwNCBZMjA4LjQ0ODg1NzIyOTY2MjM3IEYzMDBcbkcxIFgzNi41ODE3NDQgWTIwNi44MzcxNzMgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUyNVxuRzAgWDYwLjE5MjkyMiBZMjA2LjgzNzE3M1xuRzEgWDU5Ljc5NDM3MDM4MTgyOTc2NSBZMjAzLjU2MDkwMDUxMzIxNjYgRjMwMFxuRzEgWDU4LjYyMTk5MTM1MTczODE3IFkyMDAuNDc1NzIxMDY3OTAwNDUgRjMwMFxuRzEgWDU2Ljc0NDE2NDE5MzY4OTM2NSBZMTk3Ljc2MTU3ODQ4NDIyOTggRjMwMFxuRzEgWDU0LjI3MDQxMzYyMDQwODU0IFkxOTUuNTc2Nzc1NzY5NzUxMjQgRjMwMFxuRzEgWDUxLjM0NTAyMTcxODYzMTQ4IFkxOTQuMDQ4NzQyMDU5MDU3MyBGMzAwXG5HMSBYNDguMTM4NjEyNjYyMzAxNjUgWTE5My4yNjY2MDAyNzkzOTk3NCBGMzAwXG5HMSBYNDYuNTI2OTE3IFkxOTMuMTcxMjI5OTk5OTk5OTggRjMwMFxuRzEgWDQzLjI1MDY0MjYxNzYwNzQyNiBZMTkzLjU2OTc2NjAzNTEwNjA2IEYzMDBcbkcxIFg0MC4xNjU0NTc1OTYwOTUwNzQgWTE5NC43NDIxMzAzOTEwMjc4IEYzMDBcbkcxIFgzNy40NTEzMDYwODA4NzQyNTQgWTE5Ni42MTk5NDQ2Mzk2NzU1NyBGMzAwXG5HMSBYMzUuMjY2NDkxNjAwNDI2MzA2IFkxOTkuMDkzNjg0ODIxMjY3OTcgRjMwMFxuRzEgWDMzLjczODQ0Mzk3NTU5NjY3IFkyMDIuMDE5MDY5NDU1MTY2OTcgRjMwMFxuRzEgWDMyLjk1NjI4Njk0NTE4MjM1IFkyMDUuMjI1NDc0NzkxMzI5OCBGMzAwXG5HMSBYMzIuODYwOTA4OTk5OTk5OTkgWTIwNi44MzcxNzMgRjMwMFxuRzEgWDMzLjI1OTQ2MzI1NTI5NzM4IFkyMTAuMTEzNDQ1MTY1OTgxMzcgRjMwMFxuRzEgWDM0LjQzMTg0NDc2ODcwMTg0IFkyMTMuMTk4NjIzNjY3NjI4ODIgRjMwMFxuRzEgWDM2LjMwOTY3NDExMTQwOTQxIFkyMTUuOTEyNzY0NzM5ODAzNjYgRjMwMFxuRzEgWDM4Ljc4MzQyNjQ0MzI3NDE1IFkyMTguMDk3NTY1NDYzMTE3NyBGMzAwXG5HMSBYNDEuNzA4ODE5NTc0OTkwNTMgWTIxOS42MjU1OTY4MTkxMTM2IEYzMDBcbkcxIFg0NC45MTUyMjkyNjA4Nzg1MiBZMjIwLjQwNzczNjAxNzg3Nzk0IEYzMDBcbkcxIFg0Ni41MjY5MTY5OTk5OTk5OSBZMjIwLjUwMzEwNSBGMzAwXG5HMSBYNDkuODAzMTkxMjk0OTA2MzggWTIyMC4xMDQ1NjgyNDU2OTAyNSBGMzAwXG5HMSBYNTIuODg4Mzc2MDU5MDYyNjUgWTIxOC45MzIyMDMyMTI1MTI1IEYzMDBcbkcxIFg1NS42MDI1MjcxNjIwNjc5MSBZMjE3LjA1NDM4ODM2ODA1NzU3IEYzMDBcbkcxIFg1Ny43ODczNDEwOTk0ODM0IFkyMTQuNTgwNjQ3NzA2ODU3NDMgRjMwMFxuRzEgWDU5LjMxNTM4ODA4MjEzNjE2IFkyMTEuNjU1MjYyNzM3NTIzMzcgRjMwMFxuRzEgWDYwLjA5NzU0NDQwODY4NDMgWTIwOC40NDg4NTcyMjk2NjI0OCBGMzAwXG5HMSBYNjAuMTkyOTIyMDAwMDAwMDEgWTIwNi44MzcxNzMgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUyNlxuRzAgWDgzLjgwNDA5IFkyMDYuODM3MTczXG5HMSBYODMuNDA1NTM4MzgxODI5NzkgWTIwMy41NjA5MDA1MTMyMTY2NCBGMzAwXG5HMSBYODIuMjMzMTU5MzUxNzM4MjEgWTIwMC40NzU3MjEwNjc5MDA0NSBGMzAwXG5HMSBYODAuMzU1MzMyMTkzNjg5NDMgWTE5Ny43NjE1Nzg0ODQyMjk4IEYzMDBcbkcxIFg3Ny44ODE1ODE2MjA0MDg2MiBZMTk1LjU3Njc3NTc2OTc1MTI0IEYzMDBcbkcxIFg3NC45NTYxODk3MTg2MzE1NSBZMTk0LjA0ODc0MjA1OTA1NzI1IEYzMDBcbkcxIFg3MS43NDk3ODA2NjIzMDE3MiBZMTkzLjI2NjYwMDI3OTM5OTY1IEYzMDBcbkcxIFg3MC4xMzgwODIgWTE5My4xNzEyMjk5OTk5OTk5OCBGMzAwXG5HMSBYNjYuODYxODA3NzA1MDk1MjMgWTE5My41Njk3NjY3NTQzMjI5NiBGMzAwXG5HMSBYNjMuNzc2NjIyOTQwOTQzNjk2IFkxOTQuNzQyMTMxNzg3NTEzMiBGMzAwXG5HMSBYNjEuMDYyNDcxODM3OTQ2IFkxOTYuNjE5OTQ2NjMxOTc5MDUgRjMwMFxuRzEgWDU4Ljg3NzY1NzkwMDU0MDQ4IFkxOTkuMDkzNjg3MjkzMTg4MDMgRjMwMFxuRzEgWDU3LjM0OTYxMDkxNzg5OTUzIFkyMDIuMDE5MDcyMjYyNTI4MjUgRjMwMFxuRzEgWDU2LjU2NzQ1NDU5MTM2NDM0IFkyMDUuMjI1NDc3NzcwMzkyMzMgRjMwMFxuRzEgWDU2LjQ3MjA3NyBZMjA2LjgzNzE3Mjk5OTk5OTk4IEYzMDBcbkcxIFg1Ni44NzA2MzEyNTUyOTc0MSBZMjEwLjExMzQ0NTE2NTk4MTM3IEYzMDBcbkcxIFg1OC4wNDMwMTI3Njg3MDE5MSBZMjEzLjE5ODYyMzY2NzYyODggRjMwMFxuRzEgWDU5LjkyMDg0MjExMTQwOTUxIFkyMTUuOTEyNzY0NzM5ODAzNjMgRjMwMFxuRzEgWDYyLjM5NDU5NDQ0MzI3NDI5IFkyMTguMDk3NTY1NDYzMTE3NyBGMzAwXG5HMSBYNjUuMzE5OTg3NTc0OTkwNjYgWTIxOS42MjU1OTY4MTkxMTM1NSBGMzAwXG5HMSBYNjguNTI2Mzk3MjYwODc4NjQgWTIyMC40MDc3MzYwMTc4Nzc4MiBGMzAwXG5HMSBYNzAuMTM4MDgyIFkyMjAuNTAzMTA1IEYzMDBcbkcxIFg3My40MTQzNTYzODIzOTQyIFkyMjAuMTA0NTY4OTY0OTA3MTcgRjMwMFxuRzEgWDc2LjQ5OTU0MTQwMzkxMTI4IFkyMTguOTMyMjA0NjA4OTk3ODYgRjMwMFxuRzEgWDc5LjIxMzY5MjkxOTEzOTY2IFkyMTcuMDU0MzkwMzYwMzYxMDUgRjMwMFxuRzEgWDgxLjM5ODUwNzM5OTU5NzU5IFkyMTQuNTgwNjUwMTc4Nzc3NDMgRjMwMFxuRzEgWDgyLjkyNjU1NTAyNDQzOTA0IFkyMTEuNjU1MjY1NTQ0ODg0NTcgRjMwMFxuRzEgWDgzLjcwODcxMjA1NDg2NjI4IFkyMDguNDQ4ODYwMjA4NzI0OSBGMzAwXG5HMSBYODMuODA0MDkgWTIwNi44MzcxNzMgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUyN1xuRzAgWDEwNy40MTUyNSBZMjA2LjgzNzE3M1xuRzEgWDEwNy4wMTY2OTgzODE4MzAxNyBZMjAzLjU2MDkwMDUxMzIxNjU4IEYzMDBcbkcxIFgxMDUuODQ0MzE5MzUxNzM4OTYgWTIwMC40NzU3MjEwNjc5MDAyNSBGMzAwXG5HMSBYMTAzLjk2NjQ5MjE5MzY5MDUgWTE5Ny43NjE1Nzg0ODQyMjkzNSBGMzAwXG5HMSBYMTAxLjQ5Mjc0MTYyMDQwOTk5IFkxOTUuNTc2Nzc1NzY5NzUwNSBGMzAwXG5HMSBYOTguNTY3MzQ5NzE4NjMzMTEgWTE5NC4wNDg3NDIwNTkwNTYyIEYzMDBcbkcxIFg5NS4zNjA5NDA2NjIzMDMzOSBZMTkzLjI2NjYwMDI3OTM5ODIzIEYzMDBcbkcxIFg5My43NDkyNTEgWTE5My4xNzEyMjk5OTk5OTk5OCBGMzAwXG5HMSBYOTAuNDcyOTc2NjE3NjA3NDMgWTE5My41Njk3NjYwMzUxMDYwNiBGMzAwXG5HMSBYODcuMzg3NzkxNTk2MDk1MDggWTE5NC43NDIxMzAzOTEwMjc4IEYzMDBcbkcxIFg4NC42NzM2NDAwODA4NzQyNiBZMTk2LjYxOTk0NDYzOTY3NTU3IEYzMDBcbkcxIFg4Mi40ODg4MjU2MDA0MjYzIFkxOTkuMDkzNjg0ODIxMjY4IEYzMDBcbkcxIFg4MC45NjA3Nzc5NzU1OTY2NyBZMjAyLjAxOTA2OTQ1NTE2NyBGMzAwXG5HMSBYODAuMTc4NjIwOTQ1MTgyMzUgWTIwNS4yMjU0NzQ3OTEzMjk4NCBGMzAwXG5HMSBYODAuMDgzMjQzIFkyMDYuODM3MTczIEYzMDBcbkcxIFg4MC40ODE3OTcyNTUyOTczOCBZMjEwLjExMzQ0NTE2NTk4MTM3IEYzMDBcbkcxIFg4MS42NTQxNzg3Njg3MDE4NSBZMjEzLjE5ODYyMzY2NzYyODgyIEYzMDBcbkcxIFg4My41MzIwMDgxMTE0MDk0MyBZMjE1LjkxMjc2NDczOTgwMzY2IEYzMDBcbkcxIFg4Ni4wMDU3NjA0NDMyNzQyIFkyMTguMDk3NTY1NDYzMTE3NzIgRjMwMFxuRzEgWDg4LjkzMTE1MzU3NDk5MDU3IFkyMTkuNjI1NTk2ODE5MTEzNjQgRjMwMFxuRzEgWDkyLjEzNzU2MzI2MDg3ODU1IFkyMjAuNDA3NzM2MDE3ODc3OTQgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMjIwLjUwMzEwNSBGMzAwXG5HMSBYOTcuMDI1NTI1MTE5OTMwMjIgWTIyMC4xMDQ1NjY4MDcyNTY0IEYzMDBcbkcxIFgxMDAuMTEwNzA5MzY5MzY0NDkgWTIxOC45MzIyMDA0MTk1NDE5IEYzMDBcbkcxIFgxMDIuODI0ODU5NjQ3OTIzMTIgWTIxNy4wNTQzODQzODM0NTEwNCBGMzAwXG5HMSBYMTA1LjAwOTY3MjQ5OTI1MzQxIFkyMTQuNTgwNjQyNzYzMDE4MTUgRjMwMFxuRzEgWDEwNi41Mzc3MTgxOTc1Mjg1OSBZMjExLjY1NTI1NzEyMjgwMjAzIEYzMDBcbkcxIFgxMDcuMzE5ODczMTE2MzE4MzggWTIwOC40NDg4NTEyNzE1MzkxNiBGMzAwXG5HMSBYMTA3LjQxNTI1IFkyMDYuODM3MTczIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMjhcbkcwIFgxMzEuMDI2NDEgWTIwNi44MzcxNzNcbkcxIFgxMzAuNjI3ODU4MzgxODMwMDQgWTIwMy41NjA5MDA1MTMyMTY2IEYzMDBcbkcxIFgxMjkuNDU1NDc5MzUxNzM4NzIgWTIwMC40NzU3MjEwNjc5MDAzIEYzMDBcbkcxIFgxMjcuNTc3NjUyMTkzNjkwMTcgWTE5Ny43NjE1Nzg0ODQyMjk1IEYzMDBcbkcxIFgxMjUuMTAzOTAxNjIwNDA5NTYgWTE5NS41NzY3NzU3Njk3NTA3MiBGMzAwXG5HMSBYMTIyLjE3ODUwOTcxODYzMjY0IFkxOTQuMDQ4NzQyMDU5MDU2NTQgRjMwMFxuRzEgWDExOC45NzIxMDA2NjIzMDI4NiBZMTkzLjI2NjYwMDI3OTM5ODY2IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTE5My4xNzEyMzAwMDAwMDAwNCBGMzAwXG5HMSBYMTE0LjA4NDEzNTg1MDkwODY0IFkxOTMuNTY5NzY3OTUzMDE3ODcgRjMwMFxuRzEgWDExMC45OTg5NTE1MTU2OTIwNyBZMTk0Ljc0MjEzNDExNDk4ODcyIEYzMDBcbkcxIFgxMDguMjg0ODAxMDk5NzMzMiBZMTk2LjYxOTk0OTk1MjQ4NDU3IEYzMDBcbkcxIFgxMDYuMDk5OTg4MDY3Mzk4NjcgWTE5OS4wOTM2OTE0MTMwNTQyIEYzMDBcbkcxIFgxMDQuNTcxOTQyMTU1MDcyMzUgWTIwMi4wMTkwNzY5NDE0NjI4NiBGMzAwXG5HMSBYMTAzLjc4OTc4NzAwMTY2OTEgWTIwNS4yMjU0ODI3MzU0OTUzIEYzMDBcbkcxIFgxMDMuNjk0NDEgWTIwNi44MzcxNzMgRjMwMFxuRzEgWDEwNC4wOTI5NjQyNTUyOTcxMiBZMjEwLjExMzQ0NTE2NTk4MTQgRjMwMFxuRzEgWDEwNS4yNjUzNDU3Njg3MDEzMSBZMjEzLjE5ODYyMzY2NzYyODk0IEYzMDBcbkcxIFgxMDcuMTQzMTc1MTExNDA4NjUgWTIxNS45MTI3NjQ3Mzk4MDM5NSBGMzAwXG5HMSBYMTA5LjYxNjkyNzQ0MzI3MzI0IFkyMTguMDk3NTY1NDYzMTE4MjMgRjMwMFxuRzEgWDExMi41NDIzMjA1NzQ5ODk0OSBZMjE5LjYyNTU5NjgxOTExNDM4IEYzMDBcbkcxIFgxMTUuNzQ4NzMwMjYwODc3NDIgWTIyMC40MDc3MzYwMTc4Nzg5NiBGMzAwXG5HMSBYMTE3LjM2MDQxIFkyMjAuNTAzMTA1IEYzMDBcbkcxIFgxMjAuNjM2Njg0MTQ5MDkyOTkgWTIyMC4xMDQ1NjcwNDY5OTUzOCBGMzAwXG5HMSBYMTIzLjcyMTg2ODQ4NDMxNDI3IFkyMTguOTMyMjAwODg1MDM3IEYzMDBcbkcxIFgxMjYuNDM2MDE4OTAwMjgwNzEgWTIxNy4wNTQzODUwNDc1NTIwNyBGMzAwXG5HMSBYMTI4LjYyMDgzMTkzMjYyNTI0IFkyMTQuNTgwNjQzNTg2OTkxMjcgRjMwMFxuRzEgWDEzMC4xNDg4Nzc4NDQ5NjMzOCBZMjExLjY1NTI1ODA1ODU4ODc0IEYzMDBcbkcxIFgxMzAuOTMxMDMyOTk4Mzc5NTUgWTIwOC40NDg4NTIyNjQ1NTk1IEYzMDBcbkcxIFgxMzEuMDI2NDEgWTIwNi44MzcxNzMgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUyOVxuRzAgWDE1NC42Mzc2IFkyMDYuODM3MTczXG5HMSBYMTU0LjIzOTA0ODM4MTgzMDA2IFkyMDMuNTYwOTAwNTEzMjE2NTggRjMwMFxuRzEgWDE1My4wNjY2NjkzNTE3Mzg3NCBZMjAwLjQ3NTcyMTA2NzkwMDMgRjMwMFxuRzEgWDE1MS4xODg4NDIxOTM2OTAyIFkxOTcuNzYxNTc4NDg0MjI5NTIgRjMwMFxuRzEgWDE0OC43MTUwOTE2MjA0MDk1NyBZMTk1LjU3Njc3NTc2OTc1MDcyIEYzMDBcbkcxIFgxNDUuNzg5Njk5NzE4NjMyNjUgWTE5NC4wNDg3NDIwNTkwNTY1NCBGMzAwXG5HMSBYMTQyLjU4MzI5MDY2MjMwMjg2IFkxOTMuMjY2NjAwMjc5Mzk4NjYgRjMwMFxuRzEgWDE0MC45NzE2MDAwMDAwMDAwMiBZMTkzLjE3MTIzMDAwMDAwMDA0IEYzMDBcbkcxIFgxMzcuNjk1MzI1NTU5MjgyMjggWTE5My41Njk3NjU1NTU2MjgxMiBGMzAwXG5HMSBYMTM0LjYxMDE0MDM2NjE5NjE2IFkxOTQuNzQyMTI5NDYwMDM3NTcgRjMwMFxuRzEgWDEzMS44OTU5ODg1NzYxNiBZMTk2LjYxOTk0MzMxMTQ3MzIgRjMwMFxuRzEgWDEyOS43MTExNzM3MzM2ODM4NCBZMTk5LjA5MzY4MzE3MzMyMTE4IEYzMDBcbkcxIFgxMjguMTgzMTI1NjgwNzI4NDQgWTIwMi4wMTkwNjc1ODM1OTI2MyBGMzAwXG5HMSBYMTI3LjQwMDk2ODE4MTA2MTQgWTIwNS4yMjU0NzI4MDUyODc5IEYzMDBcbkcxIFgxMjcuMzA1NTkwMDAwMDAwMDEgWTIwNi44MzcxNzMwMDAwMDAwNCBGMzAwXG5HMSBYMTI3LjcwNDE0NDI1NTI5NzMgWTIxMC4xMTM0NDUxNjU5ODEzNyBGMzAwXG5HMSBYMTI4Ljg3NjUyNTc2ODcwMTY3IFkyMTMuMTk4NjIzNjY3NjI4ODUgRjMwMFxuRzEgWDEzMC43NTQzNTUxMTE0MDkxNSBZMjE1LjkxMjc2NDczOTgwMzc4IEYzMDBcbkcxIFgxMzMuMjI4MTA3NDQzMjczODQgWTIxOC4wOTc1NjU0NjMxMTc5IEYzMDBcbkcxIFgxMzYuMTUzNTAwNTc0OTkwMTUgWTIxOS42MjU1OTY4MTkxMTM5IEYzMDBcbkcxIFgxMzkuMzU5OTEwMjYwODc4MSBZMjIwLjQwNzczNjAxNzg3ODMgRjMwMFxuRzEgWDE0MC45NzE2IFkyMjAuNTAzMTA1IEYzMDBcbkcxIFgxNDQuMjQ3ODc0MTQ5MDkyOTggWTIyMC4xMDQ1NjcwNDY5OTUzOCBGMzAwXG5HMSBYMTQ3LjMzMzA1ODQ4NDMxNDI4IFkyMTguOTMyMjAwODg1MDM3IEYzMDBcbkcxIFgxNTAuMDQ3MjA4OTAwMjgwNzQgWTIxNy4wNTQzODUwNDc1NTIwNyBGMzAwXG5HMSBYMTUyLjIzMjAyMTkzMjYyNTIzIFkyMTQuNTgwNjQzNTg2OTkxMjcgRjMwMFxuRzEgWDE1My43NjAwNjc4NDQ5NjMzNyBZMjExLjY1NTI1ODA1ODU4ODc3IEYzMDBcbkcxIFgxNTQuNTQyMjIyOTk4Mzc5NTQgWTIwOC40NDg4NTIyNjQ1NTk1IEYzMDBcbkcxIFgxNTQuNjM3NiBZMjA2LjgzNzE3MyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTMwXG5HMCBYMTc4LjI0ODgxIFkyMDYuODM3MTczXG5HMSBYMTc3Ljg1MDI1ODM4MTgzMTQ1IFkyMDMuNTYwOTAwNTEzMjE2MzggRjMwMFxuRzEgWDE3Ni42Nzc4NzkzNTE3NDE0NyBZMjAwLjQ3NTcyMTA2Nzg5OTU3IEYzMDBcbkcxIFgxNzQuODAwMDUyMTkzNjk0MDkgWTE5Ny43NjE1Nzg0ODQyMjc5OCBGMzAwXG5HMSBYMTcyLjMyNjMwMTYyMDQxNDQgWTE5NS41NzY3NzU3Njk3NDgxNCBGMzAwXG5HMSBYMTY5LjQwMDkwOTcxODYzODEzIFkxOTQuMDQ4NzQyMDU5MDUyNyBGMzAwXG5HMSBYMTY2LjE5NDUwMDY2MjMwODY4IFkxOTMuMjY2NjAwMjc5MzkzNDYgRjMwMFxuRzEgWDE2NC41ODI3OSBZMTkzLjE3MTIyOTk5OTk5OTk4IEYzMDBcbkcxIFgxNjEuMzA2NTE2MTQyNTM2NzQgWTE5My41Njk3NzAzNTA0MDc0IEYzMDBcbkcxIFgxNTguMjIxMzMyNjY1MTkxMzcgWTE5NC43NDIxMzg3Njk5MzkgRjMwMFxuRzEgWDE1NS41MDcxODM2MjMzMTEyMiBZMTk2LjYxOTk1NjU5MzQ5NDEgRjMwMFxuRzEgWDE1My4zMjIzNzI0MDExMTk1IFkxOTkuMDkzNjk5NjUyNzg0IEYzMDBcbkcxIFgxNTEuNzk0MzI4NjI5NDIzMSBZMjAyLjAxOTA4NjI5OTMyODMgRjMwMFxuRzEgWDE1MS4wMTIxNzU4MjIyODQwNiBZMjA1LjIyNTQ5MjY2NTY5NjE4IEYzMDBcbkcxIFgxNTAuOTE2ODAwMDAwMDAwMDIgWTIwNi44MzcxNzMgRjMwMFxuRzEgWDE1MS4zMTUzNTQyNTUyOTUyIFkyMTAuMTEzNDQ1MTY1OTgxNjYgRjMwMFxuRzEgWDE1Mi40ODc3MzU3Njg2OTc1OCBZMjEzLjE5ODYyMzY2NzYyOTg3IEYzMDBcbkcxIFgxNTQuMzY1NTY1MTExNDAzMzMgWTIxNS45MTI3NjQ3Mzk4MDYgRjMwMFxuRzEgWDE1Ni44MzkzMTc0NDMyNjY2MiBZMjE4LjA5NzU2NTQ2MzEyMTczIEYzMDBcbkcxIFgxNTkuNzY0NzEwNTc0OTgxOTYgWTIxOS42MjU1OTY4MTkxMTk1OCBGMzAwXG5HMSBYMTYyLjk3MTEyMDI2MDg2OTQ0IFkyMjAuNDA3NzM2MDE3ODg2MDcgRjMwMFxuRzEgWDE2NC41ODI3OSBZMjIwLjUwMzEwNSBGMzAwXG5HMSBYMTY3Ljg1OTA2NDczMjM0Mzk0IFkyMjAuMTA0NTcxODQxNzc1MTQgRjMwMFxuRzEgWDE3MC45NDQyNTA3ODMzMDI2NiBZMjE4LjkzMjIxMDE5NDk0MDE4IEYzMDBcbkcxIFgxNzMuNjU4NDAzOTQ3NDIyMjIgWTIxNy4wNTQzOTgzMjk1NzY3NCBGMzAwXG5HMSBYMTc1Ljg0MzIyMDYwMDA0ODg4IFkyMTQuNTgwNjYwMDY2NDYwNTIgRjMwMFxuRzEgWDE3Ny4zNzEyNzA3OTM2NDQzMyBZMjExLjY1NTI3Njc3NDMzNDAzIEYzMDBcbkcxIFgxNzguMTUzNDMwNjM5NTg3NjcgWTIwOC40NDg4NzIxMjQ5ODA4MiBGMzAwXG5HMSBYMTc4LjI0ODgxIFkyMDYuODM3MTczIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMzFcbkcwIFgyMDEuODYgWTIwNi44MzcxNzNcbkcxIFgyMDEuNDYxNDQ4MzgxODMyIFkyMDMuNTYwOTAwNTEzMjE2MzIgRjMwMFxuRzEgWDIwMC4yODkwNjkzNTE3NDI1IFkyMDAuNDc1NzIxMDY3ODk5MzcgRjMwMFxuRzEgWDE5OC40MTEyNDIxOTM2OTU1NiBZMTk3Ljc2MTU3ODQ4NDIyNzQ0IEYzMDBcbkcxIFgxOTUuOTM3NDkxNjIwNDE2MjQgWTE5NS41NzY3NzU3Njk3NDcyIEYzMDBcbkcxIFgxOTMuMDEyMDk5NzE4NjQwMiBZMTk0LjA0ODc0MjA1OTA1MTI4IEYzMDBcbkcxIFgxODkuODA1NjkwNjYyMzEwODcgWTE5My4yNjY2MDAyNzkzOTE1MyBGMzAwXG5HMSBYMTg4LjE5NDAxIFkxOTMuMTcxMjI5OTk5OTk5OTggRjMwMFxuRzEgWDE4NC45MTc3MzU1NTkyODIyNSBZMTkzLjU2OTc2NTU1NTYyODA3IEYzMDBcbkcxIFgxODEuODMyNTUwMzY2MTk2MTMgWTE5NC43NDIxMjk0NjAwMzc1MiBGMzAwXG5HMSBYMTc5LjExODM5ODU3NjE1OTk2IFkxOTYuNjE5OTQzMzExNDczMTUgRjMwMFxuRzEgWDE3Ni45MzM1ODM3MzM2ODM4IFkxOTkuMDkzNjgzMTczMzIxMTIgRjMwMFxuRzEgWDE3NS40MDU1MzU2ODA3Mjg0IFkyMDIuMDE5MDY3NTgzNTkyNTcgRjMwMFxuRzEgWDE3NC42MjMzNzgxODEwNjEzOCBZMjA1LjIyNTQ3MjgwNTI4Nzg0IEYzMDBcbkcxIFgxNzQuNTI4IFkyMDYuODM3MTczIEYzMDBcbkcxIFgxNzQuOTI2NTU0MjU1Mjk3MjggWTIxMC4xMTM0NDUxNjU5ODE0IEYzMDBcbkcxIFgxNzYuMDk4OTM1NzY4NzAxNjQgWTIxMy4xOTg2MjM2Njc2Mjg4OCBGMzAwXG5HMSBYMTc3Ljk3Njc2NTExMTQwOTEyIFkyMTUuOTEyNzY0NzM5ODAzNzggRjMwMFxuRzEgWDE4MC40NTA1MTc0NDMyNzM4IFkyMTguMDk3NTY1NDYzMTE3OTIgRjMwMFxuRzEgWDE4My4zNzU5MTA1NzQ5OTAxMiBZMjE5LjYyNTU5NjgxOTExMzkgRjMwMFxuRzEgWDE4Ni41ODIzMjAyNjA4NzgwOCBZMjIwLjQwNzczNjAxNzg3ODMgRjMwMFxuRzEgWDE4OC4xOTQwMDk5OTk5OTk5NiBZMjIwLjUwMzEwNSBGMzAwXG5HMSBYMTkxLjQ3MDI4Mzg1NzQ2NDg2IFkyMjAuMTA0NTY0NjQ5NjA1ODMgRjMwMFxuRzEgWDE5NC41NTU0NjczMzQ4MTQ5OCBZMjE4LjkzMjE5NjIzMDA4NjY3IEYzMDBcbkcxIFgxOTcuMjY5NjE2Mzc2NzAyNjYgWTIxNy4wNTQzNzg0MDY1NDI1NSBGMzAwXG5HMSBYMTk5LjQ1NDQyNzU5ODkwNDM3IFkyMTQuNTgwNjM1MzQ3MjYxNDUgRjMwMFxuRzEgWDIwMC45ODI0NzEzNzA2MTI2NCBZMjExLjY1NTI0ODcwMDcyMzMgRjMwMFxuRzEgWDIwMS43NjQ2MjQxNzc3NjQ2IFkyMDguNDQ4ODQyMzM0MzU4NTcgRjMwMFxuRzEgWDIwMS44NiBZMjA2LjgzNzE3MyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTMyXG5HMCBYMzYuNTgxNzQ0IFkxODMuMjI2MDdcbkcxIFgzNi4xODMyMTA4NDE3MjcwOSBZMTc5Ljk0OTc5NTI2NzY2MTkgRjMwMFxuRzEgWDM1LjAxMDg0OTE5NDg0NjkgWTE3Ni44NjQ2MDkyMTY3MjAzIEYzMDBcbkcxIFgzMy4xMzMwMzczMjk0NDM2OCBZMTc0LjE1MDQ1NjA1MjYyODMgRjMwMFxuRzEgWDMwLjY1OTI5OTA2NjI5NTQyNSBZMTcxLjk2NTYzOTQwMDAzNzkgRjMwMFxuRzEgWDI3LjczMzkxNTc3NDE0NjUxIFkxNzAuNDM3NTg5MjA2NDg1MzQgRjMwMFxuRzEgWDI0LjUyNzUxMTEyNDc4MTgyOCBZMTY5LjY1NTQyOTM2MDU4ODk4IEYzMDBcbkcxIFgyMi45MTU3MzkwMDAwMDAwMDIgWTE2OS41NjAwNSBGMzAwXG5HMSBYMTkuNjM5NDY0NjM1MTA4OTg2IFkxNjkuOTU4NTg2MTc4OTgyNTMgRjMwMFxuRzEgWDE2LjU1NDI3OTY2NTA4MDYyNSBZMTcxLjEzMDk1MDY3MDM4OTE1IEYzMDBcbkcxIFgxMy44NDAxMjgyMzIzMjM0MDcgWTE3My4wMDg3NjUwMzgyMjc5NSBGMzAwXG5HMSBYMTEuNjU1MzEzODYwNTA4OTMgWTE3NS40ODI1MDUzMTU3NjU3NiBGMzAwXG5HMSBYMTAuMTI3MjY2MzY0MTQ2NTY2IFkxNzguNDA3ODkwMDE2NzY4NDggRjMwMFxuRzEgWDkuMzQ1MTA5NDc0NTQwNDYgWTE4MS42MTQyOTUzODcyNzk0NyBGMzAwXG5HMSBYOS4yNDk3MzE2MDAwMDAwMDIgWTE4My4yMjYwNyBGMzAwXG5HMSBYOS42NDgyNjk1NTMwNTI2NTIgWTE4Ni41MDIzNDQxNDkwODcxMiBGMzAwXG5HMSBYMTAuODIwNjM1NzE1MDU2MjY0IFkxODkuNTg3NTI4NDg0MjkxMjUgRjMwMFxuRzEgWDEyLjY5ODQ1MTU1MjU4MDk2IFkxOTIuMzAxNjc4OTAwMjMwMiBGMzAwXG5HMSBYMTUuMTcyMTkzMDEzMTczNzc1IFkxOTQuNDg2NDkxOTMyNTM4NDYgRjMwMFxuRzEgWDE4LjA5NzU3ODU0MTU5ODY1IFkxOTYuMDE0NTM3ODQ0ODMzNjggRjMwMFxuRzEgWDIxLjMwMzk4NDMzNTYzOTM5IFkxOTYuNzk2NjkyOTk4MjAyODcgRjMwMFxuRzEgWDIyLjkxNTczODk5OTk5OTk5NSBZMTk2Ljg5MjA3IEYzMDBcbkcxIFgyNi4xOTIwMTMyOTQ5MDA1NzMgWTE5Ni40OTM1MzMyNDU2NDI1IEYzMDBcbkcxIFgyOS4yNzcxOTgwNTkwMzk3OSBZMTk1LjMyMTE2ODIxMjQxOTggRjMwMFxuRzEgWDMxLjk5MTM0OTE2MjAxNzcxNiBZMTkzLjQ0MzM1MzM2NzkyNTM0IEYzMDBcbkcxIFgzNC4xNzYxNjMwOTkzOTcxNjUgWTE5MC45Njk2MTI3MDY2OTMzNyBGMzAwXG5HMSBYMzUuNzA0MjEwMDgyMDA3MzIgWTE4OC4wNDQyMjc3MzczMzcwMiBGMzAwXG5HMSBYMzYuNDg2MzY2NDA4NTA4NzQ0IFkxODQuODM3ODIyMjI5NDY0NzMgRjMwMFxuRzEgWDM2LjU4MTc0NCBZMTgzLjIyNjA3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMzNcbkcwIFg2MC4xOTI5MjIgWTE4My4yMjYwN1xuRzEgWDU5Ljc5NDM4ODg0MTcyNzEgWTE3OS45NDk3OTUyNjc2NjE5IEYzMDBcbkcxIFg1OC42MjIwMjcxOTQ4NDY5MSBZMTc2Ljg2NDYwOTIxNjcyMDMgRjMwMFxuRzEgWDU2Ljc0NDIxNTMyOTQ0MzY4IFkxNzQuMTUwNDU2MDUyNjI4MyBGMzAwXG5HMSBYNTQuMjcwNDc3MDY2Mjk1NDMgWTE3MS45NjU2Mzk0MDAwMzc5IEYzMDBcbkcxIFg1MS4zNDUwOTM3NzQxNDY1MiBZMTcwLjQzNzU4OTIwNjQ4NTM0IEYzMDBcbkcxIFg0OC4xMzg2ODkxMjQ3ODE4MzQgWTE2OS42NTU0MjkzNjA1ODg5OCBGMzAwXG5HMSBYNDYuNTI2OTE3MDAwMDAwMDA1IFkxNjkuNTYwMDUgRjMwMFxuRzEgWDQzLjI1MDY0MjYxNzYxMTQ0IFkxNjkuOTU4NTg2MDM1MTM5MTIgRjMwMFxuRzEgWDQwLjE2NTQ1NzU5NjExMDk1NCBZMTcxLjEzMDk1MDM5MTA5MjA2IEYzMDBcbkcxIFgzNy40NTEzMDYwODA5MDkxMDYgWTE3My4wMDg3NjQ2Mzk3NjcyNCBGMzAwXG5HMSBYMzUuMjY2NDkxNjAwNDg2MTM0IFkxNzUuNDgyNTA0ODIxMzgxNzIgRjMwMFxuRzEgWDMzLjczODQ0Mzk3NTY4NjA0IFkxNzguNDA3ODg5NDU1Mjk2MTkgRjMwMFxuRzEgWDMyLjk1NjI4Njk0NTMwNDEyIFkxODEuNjE0Mjk0NzkxNDY2OSBGMzAwXG5HMSBYMzIuODYwOTA5MDAwMDAwMDE0IFkxODMuMjI2MDcgRjMwMFxuRzEgWDMzLjI1OTQ0Njk1MzA1MjY0NSBZMTg2LjUwMjM0NDE0OTA4NzE1IEYzMDBcbkcxIFgzNC40MzE4MTMxMTUwNTYyNDQgWTE4OS41ODc1Mjg0ODQyOTEyOCBGMzAwXG5HMSBYMzYuMzA5NjI4OTUyNTgwOTIgWTE5Mi4zMDE2Nzg5MDAyMzAyMyBGMzAwXG5HMSBYMzguNzgzMzcwNDEzMTczNzMgWTE5NC40ODY0OTE5MzI1Mzg0OCBGMzAwXG5HMSBYNDEuNzA4NzU1OTQxNTk4NjEgWTE5Ni4wMTQ1Mzc4NDQ4MzM3NyBGMzAwXG5HMSBYNDQuOTE1MTYxNzM1NjM5MzMgWTE5Ni43OTY2OTI5OTgyMDI5NiBGMzAwXG5HMSBYNDYuNTI2OTE3MDAwMDAwMDEgWTE5Ni44OTIwNyBGMzAwXG5HMSBYNDkuODAzMTkxMjk0OTAwNTggWTE5Ni40OTM1MzMyNDU2NDI1IEYzMDBcbkcxIFg1Mi44ODgzNzYwNTkwMzk3NyBZMTk1LjMyMTE2ODIxMjQxOTgyIEYzMDBcbkcxIFg1NS42MDI1MjcxNjIwMTc2OCBZMTkzLjQ0MzM1MzM2NzkyNTM3IEYzMDBcbkcxIFg1Ny43ODczNDEwOTkzOTcxNSBZMTkwLjk2OTYxMjcwNjY5MzQgRjMwMFxuRzEgWDU5LjMxNTM4ODA4MjAwNzMyIFkxODguMDQ0MjI3NzM3MzM3MDUgRjMwMFxuRzEgWDYwLjA5NzU0NDQwODUwODc0NiBZMTg0LjgzNzgyMjIyOTQ2NDc2IEYzMDBcbkcxIFg2MC4xOTI5MjIgWTE4My4yMjYwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTM0XG5HMCBYODMuODA0MDkgWTE4My4yMjYwN1xuRzEgWDgzLjQwNTU1Njg0MTcyNzEyIFkxNzkuOTQ5Nzk1MjY3NjYxOTMgRjMwMFxuRzEgWDgyLjIzMzE5NTE5NDg0Njk2IFkxNzYuODY0NjA5MjE2NzIwMzcgRjMwMFxuRzEgWDgwLjM1NTM4MzMyOTQ0Mzc1IFkxNzQuMTUwNDU2MDUyNjI4MyBGMzAwXG5HMSBYNzcuODgxNjQ1MDY2Mjk1NTIgWTE3MS45NjU2Mzk0MDAwMzc4NyBGMzAwXG5HMSBYNzQuOTU2MjYxNzc0MTQ2NjQgWTE3MC40Mzc1ODkyMDY0ODUzIEYzMDBcbkcxIFg3MS43NDk4NTcxMjQ3ODE5NSBZMTY5LjY1NTQyOTM2MDU4ODkzIEYzMDBcbkcxIFg3MC4xMzgwODIgWTE2OS41NjAwNSBGMzAwXG5HMSBYNjYuODYxODA3NzA1MDk5MjcgWTE2OS45NTg1ODY3NTQzNTYwOCBGMzAwXG5HMSBYNjMuNzc2NjIyOTQwOTU5NTQgWTE3MS4xMzA5NTE3ODc1Nzc0NiBGMzAwXG5HMSBYNjEuMDYyNDcxODM3OTgwODE2IFkxNzMuMDA4NzY2NjMyMDcwNzUgRjMwMFxuRzEgWDU4Ljg3NzY1NzkwMDYwMDMwNSBZMTc1LjQ4MjUwNzI5MzMwMTc4IEYzMDBcbkcxIFg1Ny4zNDk2MTA5MTc5ODg5IFkxNzguNDA3ODkyMjYyNjU3NDcgRjMwMFxuRzEgWDU2LjU2NzQ1NDU5MTQ4NjEgWTE4MS42MTQyOTc3NzA1Mjk0NSBGMzAwXG5HMSBYNTYuNDcyMDc3MDAwMDAwMDA2IFkxODMuMjI2MDcgRjMwMFxuRzEgWDU2Ljg3MDYxNDk1MzA1MjY2NiBZMTg2LjUwMjM0NDE0OTA4NzE1IEYzMDBcbkcxIFg1OC4wNDI5ODExMTUwNTYyOCBZMTg5LjU4NzUyODQ4NDI5MTI1IEYzMDBcbkcxIFg1OS45MjA3OTY5NTI1ODA5ODYgWTE5Mi4zMDE2Nzg5MDAyMzAyIEYzMDBcbkcxIFg2Mi4zOTQ1Mzg0MTMxNzM4MDUgWTE5NC40ODY0OTE5MzI1Mzg0MyBGMzAwXG5HMSBYNjUuMzE5OTIzOTQxNTk4NyBZMTk2LjAxNDUzNzg0NDgzMzY4IEYzMDBcbkcxIFg2OC41MjYzMjk3MzU2Mzk0NCBZMTk2Ljc5NjY5Mjk5ODIwMjg0IEYzMDBcbkcxIFg3MC4xMzgwODIgWTE5Ni44OTIwNyBGMzAwXG5HMSBYNzMuNDE0MzU2MzgyMzg4MzkgWTE5Ni40OTM1MzM5NjQ4NTk0NyBGMzAwXG5HMSBYNzYuNDk5NTQxNDAzODg4MzcgWTE5NS4zMjExNjk2MDg5MDUyIEYzMDBcbkcxIFg3OS4yMTM2OTI5MTkwODk0MyBZMTkzLjQ0MzM1NTM2MDIyODg4IEYzMDBcbkcxIFg4MS4zOTg1MDczOTk1MTEzMiBZMTkwLjk2OTYxNTE3ODYxMzQ1IEYzMDBcbkcxIFg4Mi45MjY1NTUwMjQzMTAxNiBZMTg4LjA0NDIzMDU0NDY5ODM0IEYzMDBcbkcxIFg4My43MDg3MTIwNTQ2OTA3MiBZMTg0LjgzNzgyNTIwODUyNzI4IEYzMDBcbkcxIFg4My44MDQwOSBZMTgzLjIyNjA3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMzVcbkcwIFgxMDcuNDE1MjUgWTE4My4yMjYwN1xuRzEgWDEwNy4wMTY3MTY4NDE3Mjc1MSBZMTc5Ljk0OTc5NTI2NzY2MTg3IEYzMDBcbkcxIFgxMDUuODQ0MzU1MTk0ODQ3NzQgWTE3Ni44NjQ2MDkyMTY3MjAyIEYzMDBcbkcxIFgxMDMuOTY2NTQzMzI5NDQ0ODYgWTE3NC4xNTA0NTYwNTI2Mjc5IEYzMDBcbkcxIFgxMDEuNDkyODA1MDY2Mjk2ODggWTE3MS45NjU2Mzk0MDAwMzcyIEYzMDBcbkcxIFg5OC41Njc0MjE3NzQxNDgxNyBZMTcwLjQzNzU4OTIwNjQ4NDIzIEYzMDBcbkcxIFg5NS4zNjEwMTcxMjQ3ODM2IFkxNjkuNjU1NDI5MzYwNTg3NDggRjMwMFxuRzEgWDkzLjc0OTI1MSBZMTY5LjU2MDA1IEYzMDBcbkcxIFg5MC40NzI5NzY2MTc2MTE0NyBZMTY5Ljk1ODU4NjAzNTEzOTE1IEYzMDBcbkcxIFg4Ny4zODc3OTE1OTYxMTA5NCBZMTcxLjEzMDk1MDM5MTA5MjA5IEYzMDBcbkcxIFg4NC42NzM2NDAwODA5MDkxIFkxNzMuMDA4NzY0NjM5NzY3MjYgRjMwMFxuRzEgWDgyLjQ4ODgyNTYwMDQ4NjEyIFkxNzUuNDgyNTA0ODIxMzgxNzUgRjMwMFxuRzEgWDgwLjk2MDc3Nzk3NTY4NjAzIFkxNzguNDA3ODg5NDU1Mjk2MiBGMzAwXG5HMSBYODAuMTc4NjIwOTQ1MzA0MTIgWTE4MS42MTQyOTQ3OTE0NjY5MyBGMzAwXG5HMSBYODAuMDgzMjQzIFkxODMuMjI2MDcgRjMwMFxuRzEgWDgwLjQ4MTc4MDk1MzA1MjYzIFkxODYuNTAyMzQ0MTQ5MDg3MTIgRjMwMFxuRzEgWDgxLjY1NDE0NzExNTA1NjIyIFkxODkuNTg3NTI4NDg0MjkxMjUgRjMwMFxuRzEgWDgzLjUzMTk2Mjk1MjU4MDkgWTE5Mi4zMDE2Nzg5MDAyMzAyIEYzMDBcbkcxIFg4Ni4wMDU3MDQ0MTMxNzM3MiBZMTk0LjQ4NjQ5MTkzMjUzODQ4IEYzMDBcbkcxIFg4OC45MzEwODk5NDE1OTg2IFkxOTYuMDE0NTM3ODQ0ODMzNzcgRjMwMFxuRzEgWDkyLjEzNzQ5NTczNTYzOTMyIFkxOTYuNzk2NjkyOTk4MjAyOTYgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMTk2Ljg5MjA3IEYzMDBcbkcxIFg5Ny4wMjU1MjUxMTk5MjQ0MSBZMTk2LjQ5MzUzMTgwNzIwODY4IEYzMDBcbkcxIFgxMDAuMTEwNzA5MzY5MzQxNTggWTE5NS4zMjExNjU0MTk0NDkyNCBGMzAwXG5HMSBYMTAyLjgyNDg1OTY0Nzg3Mjg4IFkxOTMuNDQzMzQ5MzgzMzE4ODMgRjMwMFxuRzEgWDEwNS4wMDk2NzI0OTkxNjcxNyBZMTkwLjk2OTYwNzc2Mjg1NDEgRjMwMFxuRzEgWDEwNi41Mzc3MTgxOTczOTk3MyBZMTg4LjA0NDIyMjEyMjYxNTc0IEYzMDBcbkcxIFgxMDcuMzE5ODczMTE2MTQyODIgWTE4NC44Mzc4MTYyNzEzNDE0NCBGMzAwXG5HMSBYMTA3LjQxNTI1IFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUzNlxuRzAgWDEzMS4wMjY0MSBZMTgzLjIyNjA3XG5HMSBYMTMwLjYyNzg3Njg0MTcyNzQgWTE3OS45NDk3OTUyNjc2NjE4NyBGMzAwXG5HMSBYMTI5LjQ1NTUxNTE5NDg0NzUyIFkxNzYuODY0NjA5MjE2NzIwMjMgRjMwMFxuRzEgWDEyNy41Nzc3MDMzMjk0NDQ1NiBZMTc0LjE1MDQ1NjA1MjYyODAyIEYzMDBcbkcxIFgxMjUuMTAzOTY1MDY2Mjk2NTEgWTE3MS45NjU2Mzk0MDAwMzc0IEYzMDBcbkcxIFgxMjIuMTc4NTgxNzc0MTQ3NzQgWTE3MC40Mzc1ODkyMDY0ODQ1MiBGMzAwXG5HMSBYMTE4Ljk3MjE3NzEyNDc4MzE3IFkxNjkuNjU1NDI5MzYwNTg3ODcgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTY5LjU2MDA1IEYzMDBcbkcxIFgxMTQuMDg0MTM1ODUwOTEyNjYgWTE2OS45NTg1ODc5NTMwNTA5NCBGMzAwXG5HMSBYMTEwLjk5ODk1MTUxNTcwNzkyIFkxNzEuMTMwOTU0MTE1MDUyOTMgRjMwMFxuRzEgWDEwOC4yODQ4MDEwOTk3NjgwMyBZMTczLjAwODc2OTk1MjU3NjIyIEYzMDBcbkcxIFgxMDYuMDk5OTg4MDY3NDU4NDggWTE3NS40ODI1MTE0MTMxNjc5IEYzMDBcbkcxIFgxMDQuNTcxOTQyMTU1MTYxNzEgWTE3OC40MDc4OTY5NDE1OTIgRjMwMFxuRzEgWDEwMy43ODk3ODcwMDE3OTA4NiBZMTgxLjYxNDMwMjczNTYzMjM1IEYzMDBcbkcxIFgxMDMuNjk0NDEgWTE4My4yMjYwNjk5OTk5OTk5NiBGMzAwXG5HMSBYMTA0LjA5Mjk0Nzk1MzA1MjM1IFkxODYuNTAyMzQ0MTQ5MDg3MTUgRjMwMFxuRzEgWDEwNS4yNjUzMTQxMTUwNTU2NyBZMTg5LjU4NzUyODQ4NDI5MTQgRjMwMFxuRzEgWDEwNy4xNDMxMjk5NTI1ODAxMSBZMTkyLjMwMTY3ODkwMDIzMDQ4IEYzMDBcbkcxIFgxMDkuNjE2ODcxNDEzMTcyNzUgWTE5NC40ODY0OTE5MzI1MzkgRjMwMFxuRzEgWDExMi41NDIyNTY5NDE1OTc1IFkxOTYuMDE0NTM3ODQ0ODM0NSBGMzAwXG5HMSBYMTE1Ljc0ODY2MjczNTYzODE4IFkxOTYuNzk2NjkyOTk4MjAzOTggRjMwMFxuRzEgWDExNy4zNjA0MDk5OTk5OTk5OSBZMTk2Ljg5MjA3IEYzMDBcbkcxIFgxMjAuNjM2Njg0MTQ5MDg3MTkgWTE5Ni40OTM1MzIwNDY5NDc2NSBGMzAwXG5HMSBYMTIzLjcyMTg2ODQ4NDI5MTQyIFkxOTUuMzIxMTY1ODg0OTQ0MzIgRjMwMFxuRzEgWDEyNi40MzYwMTg5MDAyMzA1IFkxOTMuNDQzMzUwMDQ3NDE5ODcgRjMwMFxuRzEgWDEyOC42MjA4MzE5MzI1MzkgWTE5MC45Njk2MDg1ODY4MjcyNiBGMzAwXG5HMSBYMTMwLjE0ODg3Nzg0NDgzNDUyIFkxODguMDQ0MjIzMDU4NDAyNSBGMzAwXG5HMSBYMTMwLjkzMTAzMjk5ODIwNCBZMTg0LjgzNzgxNzI2NDM2MTg2IEYzMDBcbkcxIFgxMzEuMDI2NDEgWTE4My4yMjYwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTM3XG5HMCBYMTU0LjYzNzYgWTE4My4yMjYwN1xuRzEgWDE1NC4yMzkwNjY4NDE3Mjc0IFkxNzkuOTQ5Nzk1MjY3NjYxODQgRjMwMFxuRzEgWDE1My4wNjY3MDUxOTQ4NDc1MSBZMTc2Ljg2NDYwOTIxNjcyMDIgRjMwMFxuRzEgWDE1MS4xODg4OTMzMjk0NDQ1NCBZMTc0LjE1MDQ1NjA1MjYyOCBGMzAwXG5HMSBYMTQ4LjcxNTE1NTA2NjI5NjUgWTE3MS45NjU2Mzk0MDAwMzczNiBGMzAwXG5HMSBYMTQ1Ljc4OTc3MTc3NDE0Nzc0IFkxNzAuNDM3NTg5MjA2NDg0NTIgRjMwMFxuRzEgWDE0Mi41ODMzNjcxMjQ3ODMxNyBZMTY5LjY1NTQyOTM2MDU4Nzg3IEYzMDBcbkcxIFgxNDAuOTcxNiBZMTY5LjU2MDA1IEYzMDBcbkcxIFgxMzcuNjk1MzI1NTU5Mjg2MzIgWTE2OS45NTg1ODU1NTU2NjExNiBGMzAwXG5HMSBYMTM0LjYxMDE0MDM2NjIxMjA1IFkxNzEuMTMwOTQ5NDYwMTAxNzYgRjMwMFxuRzEgWDEzMS44OTU5ODg1NzYxOTQ4NyBZMTczLjAwODc2MzMxMTU2NDggRjMwMFxuRzEgWDEyOS43MTExNzM3MzM3NDM3IFkxNzUuNDgyNTAzMTczNDM0ODUgRjMwMFxuRzEgWDEyOC4xODMxMjU2ODA4MTc4MiBZMTc4LjQwNzg4NzU4MzcyMTczIEYzMDBcbkcxIFgxMjcuNDAwOTY4MTgxMTgzMTcgWTE4MS42MTQyOTI4MDU0MjQ4NyBGMzAwXG5HMSBYMTI3LjMwNTU5MDAwMDAwMDAxIFkxODMuMjI2MDcgRjMwMFxuRzEgWDEyNy43MDQxMjc5NTMwNTI1MyBZMTg2LjUwMjM0NDE0OTA4NzEyIEYzMDBcbkcxIFgxMjguODc2NDk0MTE1MDU2MDMgWTE4OS41ODc1Mjg0ODQyOTEzIEYzMDBcbkcxIFgxMzAuNzU0MzA5OTUyNTgwNjMgWTE5Mi4zMDE2Nzg5MDAyMzAzIEYzMDBcbkcxIFgxMzMuMjI4MDUxNDEzMTczMzggWTE5NC40ODY0OTE5MzI1Mzg2OCBGMzAwXG5HMSBYMTM2LjE1MzQzNjk0MTU5ODIgWTE5Ni4wMTQ1Mzc4NDQ4MzQwMiBGMzAwXG5HMSBYMTM5LjM1OTg0MjczNTYzODkgWTE5Ni43OTY2OTI5OTgyMDMzMyBGMzAwXG5HMSBYMTQwLjk3MTYgWTE5Ni44OTIwNyBGMzAwXG5HMSBYMTQ0LjI0Nzg3NDE0OTA4NzE4IFkxOTYuNDkzNTMyMDQ2OTQ3NjUgRjMwMFxuRzEgWDE0Ny4zMzMwNTg0ODQyOTE0MyBZMTk1LjMyMTE2NTg4NDk0NDMyIEYzMDBcbkcxIFgxNTAuMDQ3MjA4OTAwMjMwNSBZMTkzLjQ0MzM1MDA0NzQxOTg3IEYzMDBcbkcxIFgxNTIuMjMyMDIxOTMyNTM5IFkxOTAuOTY5NjA4NTg2ODI3MjYgRjMwMFxuRzEgWDE1My43NjAwNjc4NDQ4MzQ1IFkxODguMDQ0MjIzMDU4NDAyNSBGMzAwXG5HMSBYMTU0LjU0MjIyMjk5ODIwMzk4IFkxODQuODM3ODE3MjY0MzYxODYgRjMwMFxuRzEgWDE1NC42Mzc2IFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUzOFxuRzAgWDE3OC4yNDg4MSBZMTgzLjIyNjA3XG5HMSBYMTc3Ljg1MDI3Njg0MTcyODggWTE3OS45NDk3OTUyNjc2NjE2NyBGMzAwXG5HMSBYMTc2LjY3NzkxNTE5NDg1MDIxIFkxNzYuODY0NjA5MjE2NzE5NTEgRjMwMFxuRzEgWDE3NC44MDAxMDMzMjk0NDg0IFkxNzQuMTUwNDU2MDUyNjI2NDggRjMwMFxuRzEgWDE3Mi4zMjYzNjUwNjYzMDEzIFkxNzEuOTY1NjM5NDAwMDM0OCBGMzAwXG5HMSBYMTY5LjQwMDk4MTc3NDE1MzE3IFkxNzAuNDM3NTg5MjA2NDgwNyBGMzAwXG5HMSBYMTY2LjE5NDU3NzEyNDc4ODkgWTE2OS42NTU0MjkzNjA1ODI3IEYzMDBcbkcxIFgxNjQuNTgyNzkgWTE2OS41NjAwNSBGMzAwXG5HMSBYMTYxLjMwNjUxNjE0MjU0MDc3IFkxNjkuOTU4NTkwMzUwNDQwNSBGMzAwXG5HMSBYMTU4LjIyMTMzMjY2NTIwNzIzIFkxNzEuMTMwOTU4NzcwMDAzMjggRjMwMFxuRzEgWDE1NS41MDcxODM2MjMzNDYwNyBZMTczLjAwODc3NjU5MzU4NTggRjMwMFxuRzEgWDE1My4zMjIzNzI0MDExNzkzNCBZMTc1LjQ4MjUxOTY1Mjg5NzggRjMwMFxuRzEgWDE1MS43OTQzMjg2Mjk1MTI0NSBZMTc4LjQwNzkwNjI5OTQ1NzU1IEYzMDBcbkcxIFgxNTEuMDEyMTc1ODIyNDA1ODIgWTE4MS42MTQzMTI2NjU4MzMzNSBGMzAwXG5HMSBYMTUwLjkxNjgwMDAwMDAwMDAyIFkxODMuMjI2MDcgRjMwMFxuRzEgWDE1MS4zMTUzMzc5NTMwNTA0MyBZMTg2LjUwMjM0NDE0OTA4NzQgRjMwMFxuRzEgWDE1Mi40ODc3MDQxMTUwNTE5NCBZMTg5LjU4NzUyODQ4NDI5MjMgRjMwMFxuRzEgWDE1NC4zNjU1MTk5NTI1NzQ4IFkxOTIuMzAxNjc4OTAwMjMyNTMgRjMwMFxuRzEgWDE1Ni44MzkyNjE0MTMxNjYxMyBZMTk0LjQ4NjQ5MTkzMjU0MjQ2IEYzMDBcbkcxIFgxNTkuNzY0NjQ2OTQxNTkgWTE5Ni4wMTQ1Mzc4NDQ4Mzk3IEYzMDBcbkcxIFgxNjIuOTcxMDUyNzM1NjMwMiBZMTk2Ljc5NjY5Mjk5ODIxMTA5IEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDIgWTE5Ni44OTIwNyBGMzAwXG5HMSBYMTY3Ljg1OTA2NDczMjMzODE0IFkxOTYuNDkzNTM2ODQxNzI3NCBGMzAwXG5HMSBYMTcwLjk0NDI1MDc4MzI3OTc4IFkxOTUuMzIxMTc1MTk0ODQ3NSBGMzAwXG5HMSBYMTczLjY1ODQwMzk0NzM3MiBZMTkzLjQ0MzM2MzMyOTQ0NDU0IEYzMDBcbkcxIFgxNzUuODQzMjIwNTk5OTYyNjIgWTE5MC45Njk2MjUwNjYyOTY1IEYzMDBcbkcxIFgxNzcuMzcxMjcwNzkzNTE1NDYgWTE4OC4wNDQyNDE3NzQxNDc3NCBGMzAwXG5HMSBYMTc4LjE1MzQzMDYzOTQxMjEgWTE4NC44Mzc4MzcxMjQ3ODMxNCBGMzAwXG5HMSBYMTc4LjI0ODgxIFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUzOVxuRzAgWDIwMS44NiBZMTgzLjIyNjA3XG5HMSBYMjAxLjQ2MTQ2Njg0MTcyOTM2IFkxNzkuOTQ5Nzk1MjY3NjYxNiBGMzAwXG5HMSBYMjAwLjI4OTEwNTE5NDg1MTMgWTE3Ni44NjQ2MDkyMTY3MTkzIEYzMDBcbkcxIFgxOTguNDExMjkzMzI5NDQ5OSBZMTc0LjE1MDQ1NjA1MjYyNTk3IEYzMDBcbkcxIFgxOTUuOTM3NTU1MDY2MzAzMTYgWTE3MS45NjU2Mzk0MDAwMzM4NyBGMzAwXG5HMSBYMTkzLjAxMjE3MTc3NDE1NTMyIFkxNzAuNDM3NTg5MjA2NDc5MzIgRjMwMFxuRzEgWDE4OS44MDU3NjcxMjQ3OTEyIFkxNjkuNjU1NDI5MzYwNTgwNzcgRjMwMFxuRzEgWDE4OC4xOTQwMTAwMDAwMDAwMiBZMTY5LjU2MDA1IEYzMDBcbkcxIFgxODQuOTE3NzM1NTU5Mjg2MzQgWTE2OS45NTg1ODU1NTU2NjExNiBGMzAwXG5HMSBYMTgxLjgzMjU1MDM2NjIxMjA4IFkxNzEuMTMwOTQ5NDYwMTAxNzYgRjMwMFxuRzEgWDE3OS4xMTgzOTg1NzYxOTQ5IFkxNzMuMDA4NzYzMzExNTY0OCBGMzAwXG5HMSBYMTc2LjkzMzU4MzczMzc0MzcyIFkxNzUuNDgyNTAzMTczNDM0ODUgRjMwMFxuRzEgWDE3NS40MDU1MzU2ODA4MTc4NSBZMTc4LjQwNzg4NzU4MzcyMTczIEYzMDBcbkcxIFgxNzQuNjIzMzc4MTgxMTgzMiBZMTgxLjYxNDI5MjgwNTQyNDg3IEYzMDBcbkcxIFgxNzQuNTI4MDAwMDAwMDAwMDUgWTE4My4yMjYwNyBGMzAwXG5HMSBYMTc0LjkyNjUzNzk1MzA1MjU2IFkxODYuNTAyMzQ0MTQ5MDg3MTUgRjMwMFxuRzEgWDE3Ni4wOTg5MDQxMTUwNTYwNiBZMTg5LjU4NzUyODQ4NDI5MTMgRjMwMFxuRzEgWDE3Ny45NzY3MTk5NTI1ODA2NSBZMTkyLjMwMTY3ODkwMDIzMDMgRjMwMFxuRzEgWDE4MC40NTA0NjE0MTMxNzM0IFkxOTQuNDg2NDkxOTMyNTM4NjggRjMwMFxuRzEgWDE4My4zNzU4NDY5NDE1OTgyIFkxOTYuMDE0NTM3ODQ0ODM0MDIgRjMwMFxuRzEgWDE4Ni41ODIyNTI3MzU2Mzg5MiBZMTk2Ljc5NjY5Mjk5ODIwMzMzIEYzMDBcbkcxIFgxODguMTk0MDEwMDAwMDAwMDIgWTE5Ni44OTIwNyBGMzAwXG5HMSBYMTkxLjQ3MDI4Mzg1NzQ1OTEgWTE5Ni40OTM1Mjk2NDk1NTgxIEYzMDBcbkcxIFgxOTQuNTU1NDY3MzM0NzkyMSBZMTk1LjMyMTE2MTIyOTk5NCBGMzAwXG5HMSBYMTk3LjI2OTYxNjM3NjY1MjQ2IFkxOTMuNDQzMzQzNDA2NDEwMzUgRjMwMFxuRzEgWDE5OS40NTQ0Mjc1OTg4MTgxIFkxOTAuOTY5NjAwMzQ3MDk3NCBGMzAwXG5HMSBYMjAwLjk4MjQ3MTM3MDQ4Mzc4IFkxODguMDQ0MjEzNzAwNTM3MDMgRjMwMFxuRzEgWDIwMS43NjQ2MjQxNzc1ODkwNCBZMTg0LjgzNzgwNzMzNDE2MDkgRjMwMFxuRzEgWDIwMS44NiBZMTgzLjIyNjA3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNDBcbkcwIFgzNi41ODE3NDQgWTE1OS42MTQ5XG5HMSBYMzYuMTgzMjAzNjQ5NTU3NzkgWTE1Ni4zMzg2MjYxNDI1NDA5NiBGMzAwXG5HMSBYMzUuMDEwODM1MjI5OTkzNCBZMTUzLjI1MzQ0MjY2NTIwODA0IEYzMDBcbkcxIFgzMy4xMzMwMTc0MDY0MDk0NjUgWTE1MC41MzkyOTM2MjMzNDc4NSBGMzAwXG5HMSBYMzAuNjU5Mjc0MzQ3MDk2MzM2IFkxNDguMzU0NDgyNDAxMTgyNDIgRjMwMFxuRzEgWDI3LjczMzg4NzcwMDUzNTc5MiBZMTQ2LjgyNjQzODYyOTUxNzA3IEYzMDBcbkcxIFgyNC41Mjc0ODEzMzQxNTk1ODUgWTE0Ni4wNDQyODU4MjI0MTIxIEYzMDBcbkcxIFgyMi45MTU3MzkwMDAwMDAwMDYgWTE0NS45NDg5MSBGMzAwXG5HMSBYMTkuNjM5NDY0NjM1MTA4OTE1IFkxNDYuMzQ3NDQ2MTc4OTgyIEYzMDBcbkcxIFgxNi41NTQyNzk2NjUwODAzOSBZMTQ3LjUxOTgxMDY3MDM4ODE1IEYzMDBcbkcxIFgxMy44NDAxMjgyMzIzMjI4NDkgWTE0OS4zOTc2MjUwMzgyMjY1MiBGMzAwXG5HMSBYMTEuNjU1MzEzODYwNTA3OTYxIFkxNTEuODcxMzY1MzE1NzY0IEYzMDBcbkcxIFgxMC4xMjcyNjYzNjQxNDUxMzIgWTE1NC43OTY3NTAwMTY3NjY0NSBGMzAwXG5HMSBYOS4zNDUxMDk0NzQ1Mzg1MjEgWTE1OC4wMDMxNTUzODcyNzczIEYzMDBcbkcxIFg5LjI0OTczMTYwMDAwMDAwMiBZMTU5LjYxNDkgRjMwMFxuRzEgWDkuNjQ4MjY0NzU4MjcyOTA3IFkxNjIuODkxMTc0NzMyMzM4MDcgRjMwMFxuRzEgWDEwLjgyMDYyNjQwNTE1MzA5NCBZMTY1Ljk3NjM2MDc4MzI3OTYzIEYzMDBcbkcxIFgxMi42OTg0MzgyNzA1NTYzMjcgWTE2OC42OTA1MTM5NDczNzE2NyBGMzAwXG5HMSBYMTUuMTcyMTc2NTMzNzA0NTgzIFkxNzAuODc1MzMwNTk5OTYyMDcgRjMwMFxuRzEgWDE4LjA5NzU1OTgyNTg1MzUgWTE3Mi40MDMzODA3OTM1MTQ2MyBGMzAwXG5HMSBYMjEuMzAzOTY0NDc1MjE4MTkgWTE3My4xODU1NDA2Mzk0MTEgRjMwMFxuRzEgWDIyLjkxNTczODk5OTk5OTk5IFkxNzMuMjgwOTE5OTk5OTk5OTUgRjMwMFxuRzEgWDI2LjE5MjAxMzI5NDkwMDc0NyBZMTcyLjg4MjM4MzI0NTY0Mzg3IEYzMDBcbkcxIFgyOS4yNzcxOTgwNTkwNDA0NjUgWTE3MS43MTAwMTgyMTI0MjI0OCBGMzAwXG5HMSBYMzEuOTkxMzQ5MTYyMDE5MTkgWTE2OS44MzIyMDMzNjc5MjkyIEYzMDBcbkcxIFgzNC4xNzYxNjMwOTkzOTk3IFkxNjcuMzU4NDYyNzA2Njk4MTYgRjMwMFxuRzEgWDM1LjcwNDIxMDA4MjAxMTExIFkxNjQuNDMzMDc3NzM3MzQyNDcgRjMwMFxuRzEgWDM2LjQ4NjM2NjQwODUxMzkxIFkxNjEuMjI2NjcyMjI5NDcwNSBGMzAwXG5HMSBYMzYuNTgxNzQ0IFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU0MVxuRzAgWDYwLjE5MjkyMiBZMTU5LjYxNDlcbkcxIFg1OS43OTQzODE2NDk1NTc3OSBZMTU2LjMzODYyNjE0MjU0MDk2IEYzMDBcbkcxIFg1OC42MjIwMTMyMjk5OTM0IFkxNTMuMjUzNDQyNjY1MjA4MDQgRjMwMFxuRzEgWDU2Ljc0NDE5NTQwNjQwOTQ3IFkxNTAuNTM5MjkzNjIzMzQ3ODUgRjMwMFxuRzEgWDU0LjI3MDQ1MjM0NzA5NjM0IFkxNDguMzU0NDgyNDAxMTgyNDIgRjMwMFxuRzEgWDUxLjM0NTA2NTcwMDUzNTc5IFkxNDYuODI2NDM4NjI5NTE3MDcgRjMwMFxuRzEgWDQ4LjEzODY1OTMzNDE1OTU5IFkxNDYuMDQ0Mjg1ODIyNDEyMSBGMzAwXG5HMSBYNDYuNTI2OTE3MDAwMDAwMDA1IFkxNDUuOTQ4OTEgRjMwMFxuRzEgWDQzLjI1MDY0MjYxNzYxMTM1NSBZMTQ2LjM0NzQ0NjAzNTEzODYzIEYzMDBcbkcxIFg0MC4xNjU0NTc1OTYxMTA2NiBZMTQ3LjUxOTgxMDM5MTA5MTA2IEYzMDBcbkcxIFgzNy40NTEzMDYwODA5MDg1MyBZMTQ5LjM5NzYyNDYzOTc2NTggRjMwMFxuRzEgWDM1LjI2NjQ5MTYwMDQ4NTE3IFkxNTEuODcxMzY0ODIxMzc5OTYgRjMwMFxuRzEgWDMzLjczODQ0Mzk3NTY4NDYgWTE1NC43OTY3NDk0NTUyOTQxNiBGMzAwXG5HMSBYMzIuOTU2Mjg2OTQ1MzAyMTcgWTE1OC4wMDMxNTQ3OTE0NjQ3NyBGMzAwXG5HMSBYMzIuODYwOTA5IFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMFxuRzEgWDMzLjI1OTQ0MjE1ODI3Mjg4IFkxNjIuODkxMTc0NzMyMzM4MSBGMzAwXG5HMSBYMzQuNDMxODAzODA1MTUzMDQ1IFkxNjUuOTc2MzYwNzgzMjc5NjMgRjMwMFxuRzEgWDM2LjMwOTYxNTY3MDU1NjI2IFkxNjguNjkwNTEzOTQ3MzcxNyBGMzAwXG5HMSBYMzguNzgzMzUzOTMzNzA0NSBZMTcwLjg3NTMzMDU5OTk2MjEgRjMwMFxuRzEgWDQxLjcwODczNzIyNTg1MzQxIFkxNzIuNDAzMzgwNzkzNTE0NjkgRjMwMFxuRzEgWDQ0LjkxNTE0MTg3NTIxODA5IFkxNzMuMTg1NTQwNjM5NDExMDQgRjMwMFxuRzEgWDQ2LjUyNjkxNjk5OTk5OTk5IFkxNzMuMjgwOTE5OTk5OTk5OTggRjMwMFxuRzEgWDQ5LjgwMzE5MTI5NDkwMDc1IFkxNzIuODgyMzgzMjQ1NjQzODcgRjMwMFxuRzEgWDUyLjg4ODM3NjA1OTA0MDQ3IFkxNzEuNzEwMDE4MjEyNDIyNDggRjMwMFxuRzEgWDU1LjYwMjUyNzE2MjAxOTE5IFkxNjkuODMyMjAzMzY3OTI5MiBGMzAwXG5HMSBYNTcuNzg3MzQxMDk5Mzk5NzEgWTE2Ny4zNTg0NjI3MDY2OTgxNiBGMzAwXG5HMSBYNTkuMzE1Mzg4MDgyMDExMTA0IFkxNjQuNDMzMDc3NzM3MzQyNDcgRjMwMFxuRzEgWDYwLjA5NzU0NDQwODUxMzkxIFkxNjEuMjI2NjcyMjI5NDcwNTIgRjMwMFxuRzEgWDYwLjE5MjkyMiBZMTU5LjYxNDg5OTk5OTk5OTk4IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNDJcbkcwIFg4My44MDQwOSBZMTU5LjYxNDlcbkcxIFg4My40MDU1NDk2NDk1NTc4MSBZMTU2LjMzODYyNjE0MjU0MDk2IEYzMDBcbkcxIFg4Mi4yMzMxODEyMjk5OTM0NSBZMTUzLjI1MzQ0MjY2NTIwOCBGMzAwXG5HMSBYODAuMzU1MzYzNDA2NDA5NTUgWTE1MC41MzkyOTM2MjMzNDc4NSBGMzAwXG5HMSBYNzcuODgxNjIwMzQ3MDk2NDMgWTE0OC4zNTQ0ODI0MDExODIzNyBGMzAwXG5HMSBYNzQuOTU2MjMzNzAwNTM1OTIgWTE0Ni44MjY0Mzg2Mjk1MTcgRjMwMFxuRzEgWDcxLjc0OTgyNzMzNDE1OTcyIFkxNDYuMDQ0Mjg1ODIyNDEyIEYzMDBcbkcxIFg3MC4xMzgwODIgWTE0NS45NDg5MSBGMzAwXG5HMSBYNjYuODYxODA3NzA1MDk5MTggWTE0Ni4zNDc0NDY3NTQzNTU1NiBGMzAwXG5HMSBYNjMuNzc2NjIyOTQwOTU5MyBZMTQ3LjUxOTgxMTc4NzU3NjQ2IEYzMDBcbkcxIFg2MS4wNjI0NzE4Mzc5ODAyNyBZMTQ5LjM5NzYyNjYzMjA2OTMyIEYzMDBcbkcxIFg1OC44Nzc2NTc5MDA1OTkzNDUgWTE1MS44NzEzNjcyOTMzIEYzMDBcbkcxIFg1Ny4zNDk2MTA5MTc5ODc0NyBZMTU0Ljc5Njc1MjI2MjY1NTQ1IEYzMDBcbkcxIFg1Ni41Njc0NTQ1OTE0ODQxNSBZMTU4LjAwMzE1Nzc3MDUyNzI4IEYzMDBcbkcxIFg1Ni40NzIwNzcgWTE1OS42MTQ4OTk5OTk5OTk5OCBGMzAwXG5HMSBYNTYuODcwNjEwMTU4MjcyOTIgWTE2Mi44OTExNzQ3MzIzMzgwNyBGMzAwXG5HMSBYNTguMDQyOTcxODA1MTUzMTE1IFkxNjUuOTc2MzYwNzgzMjc5NjMgRjMwMFxuRzEgWDU5LjkyMDc4MzY3MDU1NjM1NCBZMTY4LjY5MDUxMzk0NzM3MTY3IEYzMDBcbkcxIFg2Mi4zOTQ1MjE5MzM3MDQ2MiBZMTcwLjg3NTMzMDU5OTk2MjA3IEYzMDBcbkcxIFg2NS4zMTk5MDUyMjU4NTM1NSBZMTcyLjQwMzM4MDc5MzUxNDYzIEYzMDBcbkcxIFg2OC41MjYzMDk4NzUyMTgyIFkxNzMuMTg1NTQwNjM5NDEwOTYgRjMwMFxuRzEgWDcwLjEzODA4MjAwMDAwMDAxIFkxNzMuMjgwOTE5OTk5OTk5OTUgRjMwMFxuRzEgWDczLjQxNDM1NjM4MjM4ODUzIFkxNzIuODgyMzgzOTY0ODYwODIgRjMwMFxuRzEgWDc2LjQ5OTU0MTQwMzg4OTA1IFkxNzEuNzEwMDE5NjA4OTA3ODggRjMwMFxuRzEgWDc5LjIxMzY5MjkxOTA5MDkgWTE2OS44MzIyMDUzNjAyMzI3IEYzMDBcbkcxIFg4MS4zOTg1MDczOTk1MTM4NyBZMTY3LjM1ODQ2NTE3ODYxODIyIEYzMDBcbkcxIFg4Mi45MjY1NTUwMjQzMTM5NyBZMTY0LjQzMzA4MDU0NDcwMzc2IEYzMDBcbkcxIFg4My43MDg3MTIwNTQ2OTU4OCBZMTYxLjIyNjY3NTIwODUzMzA0IEYzMDBcbkcxIFg4My44MDQwOSBZMTU5LjYxNDg5OTk5OTk5OTk4IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNDNcbkcwIFgxMDcuNDE1MjUgWTE1OS42MTQ5XG5HMSBYMTA3LjAxNjcwOTY0OTU1ODIxIFkxNTYuMzM4NjI2MTQyNTQwOSBGMzAwXG5HMSBYMTA1Ljg0NDM0MTIyOTk5NDIxIFkxNTMuMjUzNDQyNjY1MjA3ODQgRjMwMFxuRzEgWDEwMy45NjY1MjM0MDY0MTA2MyBZMTUwLjUzOTI5MzYyMzM0NzQyIEYzMDBcbkcxIFgxMDEuNDkyNzgwMzQ3MDk3NzYgWTE0OC4zNTQ0ODI0MDExODE2NiBGMzAwXG5HMSBYOTguNTY3MzkzNzAwNTM3NDEgWTE0Ni44MjY0Mzg2Mjk1MTU5IEYzMDBcbkcxIFg5NS4zNjA5ODczMzQxNjEzMiBZMTQ2LjA0NDI4NTgyMjQxMDU2IEYzMDBcbkcxIFg5My43NDkyNTEwMDAwMDAwMiBZMTQ1Ljk0ODkxIEYzMDBcbkcxIFg5MC40NzI5NzY2MTc2MTEzNyBZMTQ2LjM0NzQ0NjAzNTEzODYzIEYzMDBcbkcxIFg4Ny4zODc3OTE1OTYxMTA2NyBZMTQ3LjUxOTgxMDM5MTA5MTA2IEYzMDBcbkcxIFg4NC42NzM2NDAwODA5MDg1NCBZMTQ5LjM5NzYyNDYzOTc2NTc4IEYzMDBcbkcxIFg4Mi40ODg4MjU2MDA0ODUxOSBZMTUxLjg3MTM2NDgyMTM3OTkzIEYzMDBcbkcxIFg4MC45NjA3Nzc5NzU2ODQ2IFkxNTQuNzk2NzQ5NDU1Mjk0MTMgRjMwMFxuRzEgWDgwLjE3ODYyMDk0NTMwMjE3IFkxNTguMDAzMTU0NzkxNDY0NyBGMzAwXG5HMSBYODAuMDgzMjQzIFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMFxuRzEgWDgwLjQ4MTc3NjE1ODI3Mjg4IFkxNjIuODkxMTc0NzMyMzM4MDcgRjMwMFxuRzEgWDgxLjY1NDEzNzgwNTE1MzA0IFkxNjUuOTc2MzYwNzgzMjc5NiBGMzAwXG5HMSBYODMuNTMxOTQ5NjcwNTU2MjQgWTE2OC42OTA1MTM5NDczNzE2NyBGMzAwXG5HMSBYODYuMDA1Njg3OTMzNzA0NDggWTE3MC44NzUzMzA1OTk5NjIxIEYzMDBcbkcxIFg4OC45MzEwNzEyMjU4NTMzNyBZMTcyLjQwMzM4MDc5MzUxNDY2IEYzMDBcbkcxIFg5Mi4xMzc0NzU4NzUyMTgwNCBZMTczLjE4NTU0MDYzOTQxMTA0IEYzMDBcbkcxIFg5My43NDkyNTEwMDAwMDAwMiBZMTczLjI4MDkxOTk5OTk5OTk4IEYzMDBcbkcxIFg5Ny4wMjU1MjUxMTk5MjQ1OCBZMTcyLjg4MjM4MTgwNzIxMDA3IEYzMDBcbkcxIFgxMDAuMTEwNzA5MzY5MzQyMjkgWTE3MS43MTAwMTU0MTk0NTE5NiBGMzAwXG5HMSBYMTAyLjgyNDg1OTY0Nzg3NDM2IFkxNjkuODMyMTk5MzgzMzIyNzIgRjMwMFxuRzEgWDEwNS4wMDk2NzI0OTkxNjk3IFkxNjcuMzU4NDU3NzYyODU4OTMgRjMwMFxuRzEgWDEwNi41Mzc3MTgxOTc0MDM1MiBZMTY0LjQzMzA3MjEyMjYyMTE4IEYzMDBcbkcxIFgxMDcuMzE5ODczMTE2MTQ3OTcgWTE2MS4yMjY2NjYyNzEzNDcyMyBGMzAwXG5HMSBYMTA3LjQxNTI1IFkxNTkuNjE0OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTQ0XG5HMCBYMTMxLjAyNjQxIFkxNTkuNjE0OVxuRzEgWDEzMC42Mjc4Njk2NDk1NTgxIFkxNTYuMzM4NjI2MTQyNTQwOTMgRjMwMFxuRzEgWDEyOS40NTU1MDEyMjk5OTQgWTE1My4yNTM0NDI2NjUyMDc5MyBGMzAwXG5HMSBYMTI3LjU3NzY4MzQwNjQxMDM0IFkxNTAuNTM5MjkzNjIzMzQ3NTYgRjMwMFxuRzEgWDEyNS4xMDM5NDAzNDcwOTc0MyBZMTQ4LjM1NDQ4MjQwMTE4MTg4IEYzMDBcbkcxIFgxMjIuMTc4NTUzNzAwNTM3MDcgWTE0Ni44MjY0Mzg2Mjk1MTYyOCBGMzAwXG5HMSBYMTE4Ljk3MjE0NzMzNDE2MDkyIFkxNDYuMDQ0Mjg1ODIyNDEwOTggRjMwMFxuRzEgWDExNy4zNjA0MSBZMTQ1Ljk0ODkxIEYzMDBcbkcxIFgxMTQuMDg0MTM1ODUwOTEyNTkgWTE0Ni4zNDc0NDc5NTMwNTA0MiBGMzAwXG5HMSBYMTEwLjk5ODk1MTUxNTcwNzY5IFkxNDcuNTE5ODE0MTE1MDUxOTMgRjMwMFxuRzEgWDEwOC4yODQ4MDEwOTk3Njc0OCBZMTQ5LjM5NzYyOTk1MjU3NDc2IEYzMDBcbkcxIFgxMDYuMDk5OTg4MDY3NDU3NTMgWTE1MS44NzEzNzE0MTMxNjYxIEYzMDBcbkcxIFgxMDQuNTcxOTQyMTU1MTYwMyBZMTU0Ljc5Njc1Njk0MTU4OTkzIEYzMDBcbkcxIFgxMDMuNzg5Nzg3MDAxNzg4OTIgWTE1OC4wMDMxNjI3MzU2MzAxMyBGMzAwXG5HMSBYMTAzLjY5NDQxIFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMFxuRzEgWDEwNC4wOTI5NDMxNTgyNzI2IFkxNjIuODkxMTc0NzMyMzM4MTMgRjMwMFxuRzEgWDEwNS4yNjUzMDQ4MDUxNTI1IFkxNjUuOTc2MzYwNzgzMjc5OCBGMzAwXG5HMSBYMTA3LjE0MzExNjY3MDU1NTQ2IFkxNjguNjkwNTEzOTQ3MzcyIEYzMDBcbkcxIFgxMDkuNjE2ODU0OTMzNzAzNDggWTE3MC44NzUzMzA1OTk5NjI2IEYzMDBcbkcxIFgxMTIuNTQyMjM4MjI1ODUyMjQgWTE3Mi40MDMzODA3OTM1MTU0NSBGMzAwXG5HMSBYMTE1Ljc0ODY0Mjg3NTIxNjg2IFkxNzMuMTg1NTQwNjM5NDEyMTIgRjMwMFxuRzEgWDExNy4zNjA0MTAwMDAwMDAwMiBZMTczLjI4MDkyIEYzMDBcbkcxIFgxMjAuNjM2Njg0MTQ5MDg3MzQgWTE3Mi44ODIzODIwNDY5NDkwNiBGMzAwXG5HMSBYMTIzLjcyMTg2ODQ4NDI5MjA5IFkxNzEuNzEwMDE1ODg0OTQ3MDcgRjMwMFxuRzEgWDEyNi40MzYwMTg5MDAyMzE5NyBZMTY5LjgzMjIwMDA0NzQyMzc4IEYzMDBcbkcxIFgxMjguNjIwODMxOTMyNTQxNTMgWTE2Ny4zNTg0NTg1ODY4MzIwOSBGMzAwXG5HMSBYMTMwLjE0ODg3Nzg0NDgzODMgWTE2NC40MzMwNzMwNTg0MDggRjMwMFxuRzEgWDEzMC45MzEwMzI5OTgyMDkxMyBZMTYxLjIyNjY2NzI2NDM2NzcgRjMwMFxuRzEgWDEzMS4wMjY0MSBZMTU5LjYxNDkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU0NVxuRzAgWDE1NC42Mzc2IFkxNTkuNjE0OVxuRzEgWDE1NC4yMzkwNTk2NDk1NTgxIFkxNTYuMzM4NjI2MTQyNTQwOTMgRjMwMFxuRzEgWDE1My4wNjY2OTEyMjk5OTQgWTE1My4yNTM0NDI2NjUyMDc5MyBGMzAwXG5HMSBYMTUxLjE4ODg3MzQwNjQxMDM1IFkxNTAuNTM5MjkzNjIzMzQ3NTYgRjMwMFxuRzEgWDE0OC43MTUxMzAzNDcwOTc0IFkxNDguMzU0NDgyNDAxMTgxODggRjMwMFxuRzEgWDE0NS43ODk3NDM3MDA1MzcwNiBZMTQ2LjgyNjQzODYyOTUxNjI4IEYzMDBcbkcxIFgxNDIuNTgzMzM3MzM0MTYwOTIgWTE0Ni4wNDQyODU4MjI0MTA5OCBGMzAwXG5HMSBYMTQwLjk3MTYgWTE0NS45NDg5MSBGMzAwXG5HMSBYMTM3LjY5NTMyNTU1OTI4NjI2IFkxNDYuMzQ3NDQ1NTU1NjYwNjcgRjMwMFxuRzEgWDEzNC42MTAxNDAzNjYyMTE4IFkxNDcuNTE5ODA5NDYwMTAwOCBGMzAwXG5HMSBYMTMxLjg5NTk4ODU3NjE5NDMgWTE0OS4zOTc2MjMzMTE1NjM0IEYzMDBcbkcxIFgxMjkuNzExMTczNzMzNzQyNyBZMTUxLjg3MTM2MzE3MzQzMzEgRjMwMFxuRzEgWDEyOC4xODMxMjU2ODA4MTY0IFkxNTQuNzk2NzQ3NTgzNzE5NzYgRjMwMFxuRzEgWDEyNy40MDA5NjgxODExODEyNCBZMTU4LjAwMzE1MjgwNTQyMjgxIEYzMDBcbkcxIFgxMjcuMzA1NTkwMDAwMDAwMDIgWTE1OS42MTQ5IEYzMDBcbkcxIFgxMjcuNzA0MTIzMTU4MjcyNzggWTE2Mi44OTExNzQ3MzIzMzgxIEYzMDBcbkcxIFgxMjguODc2NDg0ODA1MTUyODQgWTE2NS45NzYzNjA3ODMyNzk3IEYzMDBcbkcxIFgxMzAuNzU0Mjk2NjcwNTU1OTYgWTE2OC42OTA1MTM5NDczNzE4IEYzMDBcbkcxIFgxMzMuMjI4MDM0OTMzNzA0MTIgWTE3MC44NzUzMzA1OTk5NjIzMyBGMzAwXG5HMSBYMTM2LjE1MzQxODIyNTg1Mjk2IFkxNzIuNDAzMzgwNzkzNTE1IEYzMDBcbkcxIFgxMzkuMzU5ODIyODc1MjE3NiBZMTczLjE4NTU0MDYzOTQxMTQ3IEYzMDBcbkcxIFgxNDAuOTcxNjAwMDAwMDAwMDIgWTE3My4yODA5MiBGMzAwXG5HMSBYMTQ0LjI0Nzg3NDE0OTA4NzM1IFkxNzIuODgyMzgyMDQ2OTQ5MDYgRjMwMFxuRzEgWDE0Ny4zMzMwNTg0ODQyOTIwOCBZMTcxLjcxMDAxNTg4NDk0NzA3IEYzMDBcbkcxIFgxNTAuMDQ3MjA4OTAwMjMxOTYgWTE2OS44MzIyMDAwNDc0MjM3OCBGMzAwXG5HMSBYMTUyLjIzMjAyMTkzMjU0MTUzIFkxNjcuMzU4NDU4NTg2ODMyMDkgRjMwMFxuRzEgWDE1My43NjAwNjc4NDQ4MzgzMiBZMTY0LjQzMzA3MzA1ODQwNzk4IEYzMDBcbkcxIFgxNTQuNTQyMjIyOTk4MjA5MTYgWTE2MS4yMjY2NjcyNjQzNjc2OCBGMzAwXG5HMSBYMTU0LjYzNzYgWTE1OS42MTQ5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNDZcbkcwIFgxNzguMjQ4ODEgWTE1OS42MTQ5XG5HMSBYMTc3Ljg1MDI2OTY0OTU1OTUgWTE1Ni4zMzg2MjYxNDI1NDA3NiBGMzAwXG5HMSBYMTc2LjY3NzkwMTIyOTk5NjcgWTE1My4yNTM0NDI2NjUyMDcyMiBGMzAwXG5HMSBYMTc0LjgwMDA4MzQwNjQxNDIgWTE1MC41MzkyOTM2MjMzNDYwNSBGMzAwXG5HMSBYMTcyLjMyNjM0MDM0NzEwMjIgWTE0OC4zNTQ0ODI0MDExNzkzMyBGMzAwXG5HMSBYMTY5LjQwMDk1MzcwMDU0MjQzIFkxNDYuODI2NDM4NjI5NTEyNDQgRjMwMFxuRzEgWDE2Ni4xOTQ1NDczMzQxNjY2MyBZMTQ2LjA0NDI4NTgyMjQwNTggRjMwMFxuRzEgWDE2NC41ODI3OSBZMTQ1Ljk0ODkxIEYzMDBcbkcxIFgxNjEuMzA2NTE2MTQyNTQwNzIgWTE0Ni4zNDc0NTAzNTA0Mzk5NyBGMzAwXG5HMSBYMTU4LjIyMTMzMjY2NTIwNyBZMTQ3LjUxOTgxODc3MDAwMjI3IEYzMDBcbkcxIFgxNTUuNTA3MTgzNjIzMzQ1NTUgWTE0OS4zOTc2MzY1OTM1ODQzNCBGMzAwXG5HMSBYMTUzLjMyMjM3MjQwMTE3ODQgWTE1MS44NzEzNzk2NTI4OTYgRjMwMFxuRzEgWDE1MS43OTQzMjg2Mjk1MTEwNiBZMTU0Ljc5Njc2NjI5OTQ1NTUgRjMwMFxuRzEgWDE1MS4wMTIxNzU4MjI0MDM5IFkxNTguMDAzMTcyNjY1ODMxMTYgRjMwMFxuRzEgWDE1MC45MTY4MDAwMDAwMDAwMiBZMTU5LjYxNDkgRjMwMFxuRzEgWDE1MS4zMTUzMzMxNTgyNzA2OCBZMTYyLjg5MTE3NDczMjMzODM4IEYzMDBcbkcxIFgxNTIuNDg3Njk0ODA1MTQ4NzUgWTE2NS45NzYzNjA3ODMyODA3IEYzMDBcbkcxIFgxNTQuMzY1NTA2NjcwNTUwMTMgWTE2OC42OTA1MTM5NDczNzQwMyBGMzAwXG5HMSBYMTU2LjgzOTI0NDkzMzY5Njg4IFkxNzAuODc1MzMwNTk5OTY2MSBGMzAwXG5HMSBYMTU5Ljc2NDYyODIyNTg0NDc1IFkxNzIuNDAzMzgwNzkzNTIwNjggRjMwMFxuRzEgWDE2Mi45NzEwMzI4NzUyMDg5IFkxNzMuMTg1NTQwNjM5NDE5MjMgRjMwMFxuRzEgWDE2NC41ODI3OTAwMDAwMDAwMiBZMTczLjI4MDkyIEYzMDBcbkcxIFgxNjcuODU5MDY0NzMyMzM4MyBZMTcyLjg4MjM4Njg0MTcyODgyIEYzMDBcbkcxIFgxNzAuOTQ0MjUwNzgzMjgwNDcgWTE3MS43MTAwMjUxOTQ4NTAyMyBGMzAwXG5HMSBYMTczLjY1ODQwMzk0NzM3MzUgWTE2OS44MzIyMTMzMjk0NDg0MiBGMzAwXG5HMSBYMTc1Ljg0MzIyMDU5OTk2NTE4IFkxNjcuMzU4NDc1MDY2MzAxMyBGMzAwXG5HMSBYMTc3LjM3MTI3MDc5MzUxOTI3IFkxNjQuNDMzMDkxNzc0MTUzMTggRjMwMFxuRzEgWDE3OC4xNTM0MzA2Mzk0MTcyOCBZMTYxLjIyNjY4NzEyNDc4ODkyIEYzMDBcbkcxIFgxNzguMjQ4ODEgWTE1OS42MTQ5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNDdcbkcwIFgyMDEuODYgWTE1OS42MTQ5XG5HMSBYMjAxLjQ2MTQ1OTY0OTU2MDAzIFkxNTYuMzM4NjI2MTQyNTQwNyBGMzAwXG5HMSBYMjAwLjI4OTA5MTIyOTk5Nzc1IFkxNTMuMjUzNDQyNjY1MjA2OTYgRjMwMFxuRzEgWDE5OC40MTEyNzM0MDY0MTU3IFkxNTAuNTM5MjkzNjIzMzQ1NTEgRjMwMFxuRzEgWDE5NS45Mzc1MzAzNDcxMDQwNiBZMTQ4LjM1NDQ4MjQwMTE3ODQyIEYzMDBcbkcxIFgxOTMuMDEyMTQzNzAwNTQ0NTYgWTE0Ni44MjY0Mzg2Mjk1MTEwNSBGMzAwXG5HMSBYMTg5LjgwNTczNzMzNDE2ODkgWTE0Ni4wNDQyODU4MjI0MDM4OCBGMzAwXG5HMSBYMTg4LjE5NDAxIFkxNDUuOTQ4OTEgRjMwMFxuRzEgWDE4NC45MTc3MzU1NTkyODYyMyBZMTQ2LjM0NzQ0NTU1NTY2MDY3IEYzMDBcbkcxIFgxODEuODMyNTUwMzY2MjExNzYgWTE0Ny41MTk4MDk0NjAxMDA4IEYzMDBcbkcxIFgxNzkuMTE4Mzk4NTc2MTk0MjcgWTE0OS4zOTc2MjMzMTE1NjM0IEYzMDBcbkcxIFgxNzYuOTMzNTgzNzMzNzQyNjcgWTE1MS44NzEzNjMxNzM0MzMxIEYzMDBcbkcxIFgxNzUuNDA1NTM1NjgwODE2MzcgWTE1NC43OTY3NDc1ODM3MTk3NiBGMzAwXG5HMSBYMTc0LjYyMzM3ODE4MTE4MTIgWTE1OC4wMDMxNTI4MDU0MjI4MSBGMzAwXG5HMSBYMTc0LjUyOCBZMTU5LjYxNDkgRjMwMFxuRzEgWDE3NC45MjY1MzMxNTgyNzI3OCBZMTYyLjg5MTE3NDczMjMzODEgRjMwMFxuRzEgWDE3Ni4wOTg4OTQ4MDUxNTI4NCBZMTY1Ljk3NjM2MDc4MzI3OTcgRjMwMFxuRzEgWDE3Ny45NzY3MDY2NzA1NTU5OCBZMTY4LjY5MDUxMzk0NzM3MTggRjMwMFxuRzEgWDE4MC40NTA0NDQ5MzM3MDQxNSBZMTcwLjg3NTMzMDU5OTk2MjMgRjMwMFxuRzEgWDE4My4zNzU4MjgyMjU4NTMgWTE3Mi40MDMzODA3OTM1MTQ5NyBGMzAwXG5HMSBYMTg2LjU4MjIzMjg3NTIxNzY3IFkxNzMuMTg1NTQwNjM5NDExNDQgRjMwMFxuRzEgWDE4OC4xOTQwMSBZMTczLjI4MDkxOTk5OTk5OTk1IEYzMDBcbkcxIFgxOTEuNDcwMjgzODU3NDU5MjQgWTE3Mi44ODIzNzk2NDk1NTk0NSBGMzAwXG5HMSBYMTk0LjU1NTQ2NzMzNDc5Mjc4IFkxNzEuNzEwMDExMjI5OTk2NjcgRjMwMFxuRzEgWDE5Ny4yNjk2MTYzNzY2NTM5NCBZMTY5LjgzMjE5MzQwNjQxNDE4IEYzMDBcbkcxIFgxOTkuNDU0NDI3NTk4ODIwNyBZMTY3LjM1ODQ1MDM0NzEwMjE4IEYzMDBcbkcxIFgyMDAuOTgyNDcxMzcwNDg3NTYgWTE2NC40MzMwNjM3MDA1NDI0NSBGMzAwXG5HMSBYMjAxLjc2NDYyNDE3NzU5NDIxIFkxNjEuMjI2NjU3MzM0MTY2NjUgRjMwMFxuRzEgWDIwMS44NiBZMTU5LjYxNDg5OTk5OTk5OTk4IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNDhcbkcwIFgzNi41ODE3NDQgWTEzNi4wMDM3MVxuRzEgWDM2LjE4MzIxMDg0MTcyNzA5NiBZMTMyLjcyNzQzNTI2NzY2MTkyIEYzMDBcbkcxIFgzNS4wMTA4NDkxOTQ4NDY5MDUgWTEyOS42NDIyNDkyMTY3MjAzMyBGMzAwXG5HMSBYMzMuMTMzMDM3MzI5NDQzNjggWTEyNi45MjgwOTYwNTI2MjgzMiBGMzAwXG5HMSBYMzAuNjU5Mjk5MDY2Mjk1NDMyIFkxMjQuNzQzMjc5NDAwMDM3OTIgRjMwMFxuRzEgWDI3LjczMzkxNTc3NDE0NjUxNyBZMTIzLjIxNTIyOTIwNjQ4NTM2IEYzMDBcbkcxIFgyNC41Mjc1MTExMjQ3ODE4NCBZMTIyLjQzMzA2OTM2MDU4OTAyIEYzMDBcbkcxIFgyMi45MTU3MzkwMDAwMDAwMDYgWTEyMi4zMzc2OSBGMzAwXG5HMSBYMTkuNjM5NDY0NjM1MTA4OTg2IFkxMjIuNzM2MjI2MTc4OTgyNTUgRjMwMFxuRzEgWDE2LjU1NDI3OTY2NTA4MDYyNSBZMTIzLjkwODU5MDY3MDM4OTE3IEYzMDBcbkcxIFgxMy44NDAxMjgyMzIzMjM0MDcgWTEyNS43ODY0MDUwMzgyMjc5NyBGMzAwXG5HMSBYMTEuNjU1MzEzODYwNTA4OTMgWTEyOC4yNjAxNDUzMTU3NjU3OCBGMzAwXG5HMSBYMTAuMTI3MjY2MzY0MTQ2NTY2IFkxMzEuMTg1NTMwMDE2NzY4NSBGMzAwXG5HMSBYOS4zNDUxMDk0NzQ1NDA0NiBZMTM0LjM5MTkzNTM4NzI3OTUgRjMwMFxuRzEgWDkuMjQ5NzMxNjAwMDAwMDAyIFkxMzYuMDAzNzEgRjMwMFxuRzEgWDkuNjQ4MjY3MTU1NjYyODgyIFkxMzkuMjc5OTg0NDQwNzEzNSBGMzAwXG5HMSBYMTAuODIwNjMxMDYwMTA1MDkzIFkxNDIuMzY1MTY5NjMzNzg3MiBGMzAwXG5HMSBYMTIuNjk4NDQ0OTExNTY5NTQgWTE0NS4wNzkzMjE0MjM4MDMzOCBGMzAwXG5HMSBYMTUuMTcyMTg0NzczNDQwNzQgWTE0Ny4yNjQxMzYyNjYyNTMzIEYzMDBcbkcxIFgxOC4wOTc1NjkxODM3Mjg0MyBZMTQ4Ljc5MjE4NDMxOTE3NzY0IEYzMDBcbkcxIFgyMS4zMDM5NzQ0MDU0MzE5ODMgWTE0OS41NzQzNDE4MTg4MTA2IEYzMDBcbkcxIFgyMi45MTU3MzkgWTE0OS42Njk3MiBGMzAwXG5HMSBYMjYuMTkyMDEzMjk0OTAwNTUgWTE0OS4yNzExODMyNDU2NDIzNiBGMzAwXG5HMSBYMjkuMjc3MTk4MDU5MDM5Njg0IFkxNDguMDk4ODE4MjEyNDE5NSBGMzAwXG5HMSBYMzEuOTkxMzQ5MTYyMDE3NDkyIFkxNDYuMjIxMDAzMzY3OTI0OSBGMzAwXG5HMSBYMzQuMTc2MTYzMDk5Mzk2ODMgWTE0My43NDcyNjI3MDY2OTI4MiBGMzAwXG5HMSBYMzUuNzA0MjEwMDgyMDA2ODI0IFkxNDAuODIxODc3NzM3MzM2NCBGMzAwXG5HMSBYMzYuNDg2MzY2NDA4NTA4MSBZMTM3LjYxNTQ3MjIyOTQ2NDA3IEYzMDBcbkcxIFgzNi41ODE3NDQgWTEzNi4wMDM3MSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTQ5XG5HMCBYNjAuMTkyOTIyIFkxMzYuMDAzNzFcbkcxIFg1OS43OTQzODg4NDE3MjcxIFkxMzIuNzI3NDM1MjY3NjYxOTIgRjMwMFxuRzEgWDU4LjYyMjAyNzE5NDg0NjkxIFkxMjkuNjQyMjQ5MjE2NzIwMzMgRjMwMFxuRzEgWDU2Ljc0NDIxNTMyOTQ0MzY4IFkxMjYuOTI4MDk2MDUyNjI4MzIgRjMwMFxuRzEgWDU0LjI3MDQ3NzA2NjI5NTQzIFkxMjQuNzQzMjc5NDAwMDM3OTIgRjMwMFxuRzEgWDUxLjM0NTA5Mzc3NDE0NjUyIFkxMjMuMjE1MjI5MjA2NDg1MzYgRjMwMFxuRzEgWDQ4LjEzODY4OTEyNDc4MTgzNCBZMTIyLjQzMzA2OTM2MDU4OTAyIEYzMDBcbkcxIFg0Ni41MjY5MTcwMDAwMDAwMDUgWTEyMi4zMzc2OSBGMzAwXG5HMSBYNDMuMjUwNjQyNjE3NjExNDI2IFkxMjIuNzM2MjI2MDM1MTM5MTQgRjMwMFxuRzEgWDQwLjE2NTQ1NzU5NjExMDk0IFkxMjMuOTA4NTkwMzkxMDkyMDggRjMwMFxuRzEgWDM3LjQ1MTMwNjA4MDkwOTA5IFkxMjUuNzg2NDA0NjM5NzY3MjYgRjMwMFxuRzEgWDM1LjI2NjQ5MTYwMDQ4NjEyIFkxMjguMjYwMTQ0ODIxMzgxNzQgRjMwMFxuRzEgWDMzLjczODQ0Mzk3NTY4NjAyNSBZMTMxLjE4NTUyOTQ1NTI5NjIgRjMwMFxuRzEgWDMyLjk1NjI4Njk0NTMwNDExIFkxMzQuMzkxOTM0NzkxNDY2OTIgRjMwMFxuRzEgWDMyLjg2MDkwOSBZMTM2LjAwMzcxIEYzMDBcbkcxIFgzMy4yNTk0NDQ1NTU2NjI4NiBZMTM5LjI3OTk4NDQ0MDcxMzUyIEYzMDBcbkcxIFgzNC40MzE4MDg0NjAxMDUwNSBZMTQyLjM2NTE2OTYzMzc4NzIgRjMwMFxuRzEgWDM2LjMwOTYyMjMxMTU2OTUwNSBZMTQ1LjA3OTMyMTQyMzgwMzQ0IEYzMDBcbkcxIFgzOC43ODMzNjIxNzM0NDA2OCBZMTQ3LjI2NDEzNjI2NjI1MzMzIEYzMDBcbkcxIFg0MS43MDg3NDY1ODM3MjgzNTYgWTE0OC43OTIxODQzMTkxNzc3IEYzMDBcbkcxIFg0NC45MTUxNTE4MDU0MzE5MDQgWTE0OS41NzQzNDE4MTg4MTA2NyBGMzAwXG5HMSBYNDYuNTI2OTE3IFkxNDkuNjY5NzIwMDAwMDAwMDQgRjMwMFxuRzEgWDQ5LjgwMzE5MTI5NDkwMDU1IFkxNDkuMjcxMTgzMjQ1NjQyMzYgRjMwMFxuRzEgWDUyLjg4ODM3NjA1OTAzOTY4IFkxNDguMDk4ODE4MjEyNDE5NSBGMzAwXG5HMSBYNTUuNjAyNTI3MTYyMDE3NDkgWTE0Ni4yMjEwMDMzNjc5MjQ5IEYzMDBcbkcxIFg1Ny43ODczNDEwOTkzOTY4MyBZMTQzLjc0NzI2MjcwNjY5MjgyIEYzMDBcbkcxIFg1OS4zMTUzODgwODIwMDY4MyBZMTQwLjgyMTg3NzczNzMzNjQyIEYzMDBcbkcxIFg2MC4wOTc1NDQ0MDg1MDgxIFkxMzcuNjE1NDcyMjI5NDY0MDcgRjMwMFxuRzEgWDYwLjE5MjkyMiBZMTM2LjAwMzcxIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNTBcbkcwIFg4My44MDQwOSBZMTM2LjAwMzcxXG5HMSBYODMuNDA1NTU2ODQxNzI3MTIgWTEzMi43Mjc0MzUyNjc2NjE5NSBGMzAwXG5HMSBYODIuMjMzMTk1MTk0ODQ2OTYgWTEyOS42NDIyNDkyMTY3MjA0IEYzMDBcbkcxIFg4MC4zNTUzODMzMjk0NDM3NSBZMTI2LjkyODA5NjA1MjYyODMyIEYzMDBcbkcxIFg3Ny44ODE2NDUwNjYyOTU1MiBZMTI0Ljc0MzI3OTQwMDAzNzg5IEYzMDBcbkcxIFg3NC45NTYyNjE3NzQxNDY2NCBZMTIzLjIxNTIyOTIwNjQ4NTMyIEYzMDBcbkcxIFg3MS43NDk4NTcxMjQ3ODE5OCBZMTIyLjQzMzA2OTM2MDU4ODk1IEYzMDBcbkcxIFg3MC4xMzgwODE5OTk5OTk5OCBZMTIyLjMzNzY5MDAwMDAwMDAyIEYzMDBcbkcxIFg2Ni44NjE4MDc3MDUwOTkyOCBZMTIyLjczNjIyNjc1NDM1NjA4IEYzMDBcbkcxIFg2My43NzY2MjI5NDA5NTk1NyBZMTIzLjkwODU5MTc4NzU3NzQ2IEYzMDBcbkcxIFg2MS4wNjI0NzE4Mzc5ODA4NCBZMTI1Ljc4NjQwNjYzMjA3MDc1IEYzMDBcbkcxIFg1OC44Nzc2NTc5MDA2MDAzMDUgWTEyOC4yNjAxNDcyOTMzMDE4IEYzMDBcbkcxIFg1Ny4zNDk2MTA5MTc5ODg5IFkxMzEuMTg1NTMyMjYyNjU3NSBGMzAwXG5HMSBYNTYuNTY3NDU0NTkxNDg2MSBZMTM0LjM5MTkzNzc3MDUyOTQ3IEYzMDBcbkcxIFg1Ni40NzIwNzcwMDAwMDAwMDYgWTEzNi4wMDM3MSBGMzAwXG5HMSBYNTYuODcwNjEyNTU1NjYyODkgWTEzOS4yNzk5ODQ0NDA3MTM1MiBGMzAwXG5HMSBYNTguMDQyOTc2NDYwMTA1MSBZMTQyLjM2NTE2OTYzMzc4NzIgRjMwMFxuRzEgWDU5LjkyMDc5MDMxMTU2OTU2IFkxNDUuMDc5MzIxNDIzODAzMzggRjMwMFxuRzEgWDYyLjM5NDUzMDE3MzQ0MDc3IFkxNDcuMjY0MTM2MjY2MjUzMyBGMzAwXG5HMSBYNjUuMzE5OTE0NTgzNzI4NDMgWTE0OC43OTIxODQzMTkxNzc2IEYzMDBcbkcxIFg2OC41MjYzMTk4MDU0MzIgWTE0OS41NzQzNDE4MTg4MTA1OCBGMzAwXG5HMSBYNzAuMTM4MDgyMDAwMDAwMDEgWTE0OS42Njk3MiBGMzAwXG5HMSBYNzMuNDE0MzU2MzgyMzg4MzUgWTE0OS4yNzExODM5NjQ4NTkzMiBGMzAwXG5HMSBYNzYuNDk5NTQxNDAzODg4MjcgWTE0OC4wOTg4MTk2MDg5MDQ5IEYzMDBcbkcxIFg3OS4yMTM2OTI5MTkwODkyMSBZMTQ2LjIyMTAwNTM2MDIyODQ1IEYzMDBcbkcxIFg4MS4zOTg1MDczOTk1MTA5OSBZMTQzLjc0NzI2NTE3ODYxMjkgRjMwMFxuRzEgWDgyLjkyNjU1NTAyNDMwOTY4IFkxNDAuODIxODgwNTQ0Njk3NzMgRjMwMFxuRzEgWDgzLjcwODcxMjA1NDY5MDA4IFkxMzcuNjE1NDc1MjA4NTI2NjIgRjMwMFxuRzEgWDgzLjgwNDA5IFkxMzYuMDAzNzEgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU1MVxuRzAgWDEwNy40MTUyNSBZMTM2LjAwMzcxXG5HMSBYMTA3LjAxNjcxNjg0MTcyNzUxIFkxMzIuNzI3NDM1MjY3NjYxOSBGMzAwXG5HMSBYMTA1Ljg0NDM1NTE5NDg0Nzc0IFkxMjkuNjQyMjQ5MjE2NzIwMjIgRjMwMFxuRzEgWDEwMy45NjY1NDMzMjk0NDQ4NiBZMTI2LjkyODA5NjA1MjYyNzkxIEYzMDBcbkcxIFgxMDEuNDkyODA1MDY2Mjk2OTEgWTEyNC43NDMyNzk0MDAwMzcyMSBGMzAwXG5HMSBYOTguNTY3NDIxNzc0MTQ4MiBZMTIzLjIxNTIyOTIwNjQ4NDI3IEYzMDBcbkcxIFg5NS4zNjEwMTcxMjQ3ODM2MSBZMTIyLjQzMzA2OTM2MDU4NzUgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMTIyLjMzNzY5MDAwMDAwMDAyIEYzMDBcbkcxIFg5MC40NzI5NzY2MTc2MTE0NCBZMTIyLjczNjIyNjAzNTEzOTE3IEYzMDBcbkcxIFg4Ny4zODc3OTE1OTYxMTA5MyBZMTIzLjkwODU5MDM5MTA5MjEgRjMwMFxuRzEgWDg0LjY3MzY0MDA4MDkwOTEgWTEyNS43ODY0MDQ2Mzk3NjcyNyBGMzAwXG5HMSBYODIuNDg4ODI1NjAwNDg2MTQgWTEyOC4yNjAxNDQ4MjEzODE3NCBGMzAwXG5HMSBYODAuOTYwNzc3OTc1Njg2MDYgWTEzMS4xODU1Mjk0NTUyOTYxOCBGMzAwXG5HMSBYODAuMTc4NjIwOTQ1MzA0MTIgWTEzNC4zOTE5MzQ3OTE0NjY5MiBGMzAwXG5HMSBYODAuMDgzMjQzIFkxMzYuMDAzNzEgRjMwMFxuRzEgWDgwLjQ4MTc3ODU1NTY2Mjg2IFkxMzkuMjc5OTg0NDQwNzEzNTIgRjMwMFxuRzEgWDgxLjY1NDE0MjQ2MDEwNTA1IFkxNDIuMzY1MTY5NjMzNzg3MiBGMzAwXG5HMSBYODMuNTMxOTU2MzExNTY5NSBZMTQ1LjA3OTMyMTQyMzgwMzQ0IEYzMDBcbkcxIFg4Ni4wMDU2OTYxNzM0NDA2NyBZMTQ3LjI2NDEzNjI2NjI1MzMzIEYzMDBcbkcxIFg4OC45MzEwODA1ODM3MjgzNiBZMTQ4Ljc5MjE4NDMxOTE3NzcgRjMwMFxuRzEgWDkyLjEzNzQ4NTgwNTQzMTkxIFkxNDkuNTc0MzQxODE4ODEwNjcgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMTQ5LjY2OTcyMDAwMDAwMDA0IEYzMDBcbkcxIFg5Ny4wMjU1MjUxMTk5MjQ0IFkxNDkuMjcxMTgxODA3MjA4NTQgRjMwMFxuRzEgWDEwMC4xMTA3MDkzNjkzNDE1NCBZMTQ4LjA5ODgxNTQxOTQ0ODk1IEYzMDBcbkcxIFgxMDIuODI0ODU5NjQ3ODcyNyBZMTQ2LjIyMDk5OTM4MzMxODQgRjMwMFxuRzEgWDEwNS4wMDk2NzI0OTkxNjY4NSBZMTQzLjc0NzI1Nzc2Mjg1MzU2IEYzMDBcbkcxIFgxMDYuNTM3NzE4MTk3Mzk5MjYgWTE0MC44MjE4NzIxMjI2MTUxIEYzMDBcbkcxIFgxMDcuMzE5ODczMTE2MTQyMTggWTEzNy42MTU0NjYyNzEzNDA3NSBGMzAwXG5HMSBYMTA3LjQxNTI1IFkxMzYuMDAzNzEwMDAwMDAwMDQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU1MlxuRzAgWDEzMS4wMjY0MSBZMTM2LjAwMzcxXG5HMSBYMTMwLjYyNzg3Njg0MTcyNzQgWTEzMi43Mjc0MzUyNjc2NjE5IEYzMDBcbkcxIFgxMjkuNDU1NTE1MTk0ODQ3NTIgWTEyOS42NDIyNDkyMTY3MjAyNCBGMzAwXG5HMSBYMTI3LjU3NzcwMzMyOTQ0NDU2IFkxMjYuOTI4MDk2MDUyNjI4MDQgRjMwMFxuRzEgWDEyNS4xMDM5NjUwNjYyOTY1MSBZMTI0Ljc0MzI3OTQwMDAzNzQgRjMwMFxuRzEgWDEyMi4xNzg1ODE3NzQxNDc3NCBZMTIzLjIxNTIyOTIwNjQ4NDU1IEYzMDBcbkcxIFgxMTguOTcyMTc3MTI0NzgzMTQgWTEyMi40MzMwNjkzNjA1ODc5IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTEyMi4zMzc2OSBGMzAwXG5HMSBYMTE0LjA4NDEzNTg1MDkxMjY5IFkxMjIuNzM2MjI3OTUzMDUwOTQgRjMwMFxuRzEgWDExMC45OTg5NTE1MTU3MDc5NCBZMTIzLjkwODU5NDExNTA1Mjk1IEYzMDBcbkcxIFgxMDguMjg0ODAxMDk5NzY4MDMgWTEyNS43ODY0MDk5NTI1NzYyNCBGMzAwXG5HMSBYMTA2LjA5OTk4ODA2NzQ1ODQ4IFkxMjguMjYwMTUxNDEzMTY3OTMgRjMwMFxuRzEgWDEwNC41NzE5NDIxNTUxNjE3MSBZMTMxLjE4NTUzNjk0MTU5MjAzIEYzMDBcbkcxIFgxMDMuNzg5Nzg3MDAxNzkwODYgWTEzNC4zOTE5NDI3MzU2MzIzNyBGMzAwXG5HMSBYMTAzLjY5NDQxIFkxMzYuMDAzNzEgRjMwMFxuRzEgWDEwNC4wOTI5NDU1NTU2NjI1OCBZMTM5LjI3OTk4NDQ0MDcxMzU1IEYzMDBcbkcxIFgxMDUuMjY1MzA5NDYwMTA0NSBZMTQyLjM2NTE2OTYzMzc4NzMgRjMwMFxuRzEgWDEwNy4xNDMxMjMzMTE1Njg3MSBZMTQ1LjA3OTMyMTQyMzgwMzcgRjMwMFxuRzEgWDEwOS42MTY4NjMxNzM0Mzk3MyBZMTQ3LjI2NDEzNjI2NjI1Mzg0IEYzMDBcbkcxIFgxMTIuNTQyMjQ3NTgzNzI3MjcgWTE0OC43OTIxODQzMTkxNzg0MyBGMzAwXG5HMSBYMTE1Ljc0ODY1MjgwNTQzMDc4IFkxNDkuNTc0MzQxODE4ODExNzIgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTQ5LjY2OTcyIEYzMDBcbkcxIFgxMjAuNjM2Njg0MTQ5MDg3MTYgWTE0OS4yNzExODIwNDY5NDc1IEYzMDBcbkcxIFgxMjMuNzIxODY4NDg0MjkxMyBZMTQ4LjA5ODgxNTg4NDk0NCBGMzAwXG5HMSBYMTI2LjQzNjAxODkwMDIzMDMxIFkxNDYuMjIxMDAwMDQ3NDE5NCBGMzAwXG5HMSBYMTI4LjYyMDgzMTkzMjUzODcgWTE0My43NDcyNTg1ODY4MjY2NiBGMzAwXG5HMSBYMTMwLjE0ODg3Nzg0NDgzNDAzIFkxNDAuODIxODczMDU4NDAxODUgRjMwMFxuRzEgWDEzMC45MzEwMzI5OTgyMDMzNCBZMTM3LjYxNTQ2NzI2NDM2MTE0IEYzMDBcbkcxIFgxMzEuMDI2NDEgWTEzNi4wMDM3MSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTUzXG5HMCBYMTU0LjYzNzYgWTEzNi4wMDM3MVxuRzEgWDE1NC4yMzkwNjY4NDE3Mjc0IFkxMzIuNzI3NDM1MjY3NjYxODYgRjMwMFxuRzEgWDE1My4wNjY3MDUxOTQ4NDc1MSBZMTI5LjY0MjI0OTIxNjcyMDIyIEYzMDBcbkcxIFgxNTEuMTg4ODkzMzI5NDQ0NTQgWTEyNi45MjgwOTYwNTI2MjggRjMwMFxuRzEgWDE0OC43MTUxNTUwNjYyOTY1IFkxMjQuNzQzMjc5NDAwMDM3MzggRjMwMFxuRzEgWDE0NS43ODk3NzE3NzQxNDc3NCBZMTIzLjIxNTIyOTIwNjQ4NDU0IEYzMDBcbkcxIFgxNDIuNTgzMzY3MTI0NzgzMTcgWTEyMi40MzMwNjkzNjA1ODc5IEYzMDBcbkcxIFgxNDAuOTcxNiBZMTIyLjMzNzY5IEYzMDBcbkcxIFgxMzcuNjk1MzI1NTU5Mjg2MzIgWTEyMi43MzYyMjU1NTU2NjExOCBGMzAwXG5HMSBYMTM0LjYxMDE0MDM2NjIxMjA1IFkxMjMuOTA4NTg5NDYwMTAxNzggRjMwMFxuRzEgWDEzMS44OTU5ODg1NzYxOTQ4NyBZMTI1Ljc4NjQwMzMxMTU2NDgxIEYzMDBcbkcxIFgxMjkuNzExMTczNzMzNzQzNyBZMTI4LjI2MDE0MzE3MzQzNDg3IEYzMDBcbkcxIFgxMjguMTgzMTI1NjgwODE3ODIgWTEzMS4xODU1Mjc1ODM3MjE3NSBGMzAwXG5HMSBYMTI3LjQwMDk2ODE4MTE4MzE3IFkxMzQuMzkxOTMyODA1NDI0OSBGMzAwXG5HMSBYMTI3LjMwNTU5MDAwMDAwMDAxIFkxMzYuMDAzNzEgRjMwMFxuRzEgWDEyNy43MDQxMjU1NTU2NjI3OCBZMTM5LjI3OTk4NDQ0MDcxMzUyIEYzMDBcbkcxIFgxMjguODc2NDg5NDYwMTA0ODYgWTE0Mi4zNjUxNjk2MzM3ODcyNSBGMzAwXG5HMSBYMTMwLjc1NDMwMzMxMTU2OTIzIFkxNDUuMDc5MzIxNDIzODAzNSBGMzAwXG5HMSBYMTMzLjIyODA0MzE3MzQ0MDM0IFkxNDcuMjY0MTM2MjY2MjUzNTMgRjMwMFxuRzEgWDEzNi4xNTM0Mjc1ODM3Mjc5NiBZMTQ4Ljc5MjE4NDMxOTE3Nzk1IEYzMDBcbkcxIFgxMzkuMzU5ODMyODA1NDMxNSBZMTQ5LjU3NDM0MTgxODgxMTA2IEYzMDBcbkcxIFgxNDAuOTcxNjAwMDAwMDAwMDIgWTE0OS42Njk3MiBGMzAwXG5HMSBYMTQ0LjI0Nzg3NDE0OTA4NzE1IFkxNDkuMjcxMTgyMDQ2OTQ3NSBGMzAwXG5HMSBYMTQ3LjMzMzA1ODQ4NDI5MTMgWTE0OC4wOTg4MTU4ODQ5NDQgRjMwMFxuRzEgWDE1MC4wNDcyMDg5MDAyMzAzMiBZMTQ2LjIyMTAwMDA0NzQxOTQgRjMwMFxuRzEgWDE1Mi4yMzIwMjE5MzI1Mzg3IFkxNDMuNzQ3MjU4NTg2ODI2NjYgRjMwMFxuRzEgWDE1My43NjAwNjc4NDQ4MzQwMyBZMTQwLjgyMTg3MzA1ODQwMTg1IEYzMDBcbkcxIFgxNTQuNTQyMjIyOTk4MjAzMzMgWTEzNy42MTU0NjcyNjQzNjExNCBGMzAwXG5HMSBYMTU0LjYzNzYgWTEzNi4wMDM3MSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTU0XG5HMCBYMTc4LjI0ODgxIFkxMzYuMDAzNzFcbkcxIFgxNzcuODUwMjc2ODQxNzI4OCBZMTMyLjcyNzQzNTI2NzY2MTcgRjMwMFxuRzEgWDE3Ni42Nzc5MTUxOTQ4NTAyMSBZMTI5LjY0MjI0OTIxNjcxOTUzIEYzMDBcbkcxIFgxNzQuODAwMTAzMzI5NDQ4NCBZMTI2LjkyODA5NjA1MjYyNjUgRjMwMFxuRzEgWDE3Mi4zMjYzNjUwNjYzMDEzIFkxMjQuNzQzMjc5NDAwMDM0ODEgRjMwMFxuRzEgWDE2OS40MDA5ODE3NzQxNTMyIFkxMjMuMjE1MjI5MjA2NDgwNzQgRjMwMFxuRzEgWDE2Ni4xOTQ1NzcxMjQ3ODg5IFkxMjIuNDMzMDY5MzYwNTgyNzIgRjMwMFxuRzEgWDE2NC41ODI3OSBZMTIyLjMzNzY5IEYzMDBcbkcxIFgxNjEuMzA2NTE2MTQyNTQwNzcgWTEyMi43MzYyMzAzNTA0NDA1MSBGMzAwXG5HMSBYMTU4LjIyMTMzMjY2NTIwNzIzIFkxMjMuOTA4NTk4NzcwMDAzMyBGMzAwXG5HMSBYMTU1LjUwNzE4MzYyMzM0NjA3IFkxMjUuNzg2NDE2NTkzNTg1ODEgRjMwMFxuRzEgWDE1My4zMjIzNzI0MDExNzkzNCBZMTI4LjI2MDE1OTY1Mjg5NzggRjMwMFxuRzEgWDE1MS43OTQzMjg2Mjk1MTI0NSBZMTMxLjE4NTU0NjI5OTQ1NzU3IEYzMDBcbkcxIFgxNTEuMDEyMTc1ODIyNDA1ODIgWTEzNC4zOTE5NTI2NjU4MzMzNyBGMzAwXG5HMSBYMTUwLjkxNjgwMDAwMDAwMDAyIFkxMzYuMDAzNzEgRjMwMFxuRzEgWDE1MS4zMTUzMzU1NTU2NjA2OCBZMTM5LjI3OTk4NDQ0MDcxMzc4IEYzMDBcbkcxIFgxNTIuNDg3Njk5NDYwMTAwOCBZMTQyLjM2NTE2OTYzMzc4ODI0IEYzMDBcbkcxIFgxNTQuMzY1NTEzMzExNTYzNCBZMTQ1LjA3OTMyMTQyMzgwNTc0IEYzMDBcbkcxIFgxNTYuODM5MjUzMTczNDMzMTIgWTE0Ny4yNjQxMzYyNjYyNTczNCBGMzAwXG5HMSBYMTU5Ljc2NDYzNzU4MzcxOTc4IFkxNDguNzkyMTg0MzE5MTgzNjYgRjMwMFxuRzEgWDE2Mi45NzEwNDI4MDU0MjI4IFkxNDkuNTc0MzQxODE4ODE4OCBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDA1IFkxNDkuNjY5NzIgRjMwMFxuRzEgWDE2Ny44NTkwNjQ3MzIzMzgxIFkxNDkuMjcxMTg2ODQxNzI3MjYgRjMwMFxuRzEgWDE3MC45NDQyNTA3ODMyNzk3IFkxNDguMDk4ODI1MTk0ODQ3MiBGMzAwXG5HMSBYMTczLjY1ODQwMzk0NzM3MTggWTE0Ni4yMjEwMTMzMjk0NDQwOCBGMzAwXG5HMSBYMTc1Ljg0MzIyMDU5OTk2MjMgWTE0My43NDcyNzUwNjYyOTU5IEYzMDBcbkcxIFgxNzcuMzcxMjcwNzkzNTE0OTggWTE0MC44MjE4OTE3NzQxNDcxIEYzMDBcbkcxIFgxNzguMTUzNDMwNjM5NDExNDUgWTEzNy42MTU0ODcxMjQ3ODI0OCBGMzAwXG5HMSBYMTc4LjI0ODgxIFkxMzYuMDAzNzEgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU1NVxuRzAgWDIwMS44NiBZMTM2LjAwMzcxXG5HMSBYMjAxLjQ2MTQ2Njg0MTcyOTM2IFkxMzIuNzI3NDM1MjY3NjYxNjMgRjMwMFxuRzEgWDIwMC4yODkxMDUxOTQ4NTEzIFkxMjkuNjQyMjQ5MjE2NzE5MyBGMzAwXG5HMSBYMTk4LjQxMTI5MzMyOTQ0OTkgWTEyNi45MjgwOTYwNTI2MjU5OSBGMzAwXG5HMSBYMTk1LjkzNzU1NTA2NjMwMzE2IFkxMjQuNzQzMjc5NDAwMDMzOSBGMzAwXG5HMSBYMTkzLjAxMjE3MTc3NDE1NTMyIFkxMjMuMjE1MjI5MjA2NDc5MzUgRjMwMFxuRzEgWDE4OS44MDU3NjcxMjQ3OTExNyBZMTIyLjQzMzA2OTM2MDU4MDggRjMwMFxuRzEgWDE4OC4xOTQwMSBZMTIyLjMzNzY5MDAwMDAwMDAxIEYzMDBcbkcxIFgxODQuOTE3NzM1NTU5Mjg2MjkgWTEyMi43MzYyMjU1NTU2NjExOCBGMzAwXG5HMSBYMTgxLjgzMjU1MDM2NjIxMjAyIFkxMjMuOTA4NTg5NDYwMTAxNzggRjMwMFxuRzEgWDE3OS4xMTgzOTg1NzYxOTQ4MyBZMTI1Ljc4NjQwMzMxMTU2NDgxIEYzMDBcbkcxIFgxNzYuOTMzNTgzNzMzNzQzNjYgWTEyOC4yNjAxNDMxNzM0MzQ4NyBGMzAwXG5HMSBYMTc1LjQwNTUzNTY4MDgxNzggWTEzMS4xODU1Mjc1ODM3MjE3NSBGMzAwXG5HMSBYMTc0LjYyMzM3ODE4MTE4MzE0IFkxMzQuMzkxOTMyODA1NDI0OSBGMzAwXG5HMSBYMTc0LjUyOCBZMTM2LjAwMzcxIEYzMDBcbkcxIFgxNzQuOTI2NTM1NTU1NjYyNzUgWTEzOS4yNzk5ODQ0NDA3MTM1MiBGMzAwXG5HMSBYMTc2LjA5ODg5OTQ2MDEwNDgzIFkxNDIuMzY1MTY5NjMzNzg3MjUgRjMwMFxuRzEgWDE3Ny45NzY3MTMzMTE1NjkyIFkxNDUuMDc5MzIxNDIzODAzNSBGMzAwXG5HMSBYMTgwLjQ1MDQ1MzE3MzQ0MDMgWTE0Ny4yNjQxMzYyNjYyNTM1MyBGMzAwXG5HMSBYMTgzLjM3NTgzNzU4MzcyNzkzIFkxNDguNzkyMTg0MzE5MTc3OTUgRjMwMFxuRzEgWDE4Ni41ODIyNDI4MDU0MzE0NiBZMTQ5LjU3NDM0MTgxODgxMTA2IEYzMDBcbkcxIFgxODguMTk0MDEgWTE0OS42Njk3MiBGMzAwXG5HMSBYMTkxLjQ3MDI4Mzg1NzQ1OTA0IFkxNDkuMjcxMTc5NjQ5NTU3OTUgRjMwMFxuRzEgWDE5NC41NTU0NjczMzQ3OTE5OCBZMTQ4LjA5ODgxMTIyOTk5MzcgRjMwMFxuRzEgWDE5Ny4yNjk2MTYzNzY2NTIyNyBZMTQ2LjIyMDk5MzQwNjQwOTkgRjMwMFxuRzEgWDE5OS40NTQ0Mjc1OTg4MTc4IFkxNDMuNzQ3MjUwMzQ3MDk2ODQgRjMwMFxuRzEgWDIwMC45ODI0NzEzNzA0ODMzIFkxNDAuODIxODYzNzAwNTM2MzcgRjMwMFxuRzEgWDIwMS43NjQ2MjQxNzc1ODg0IFkxMzcuNjE1NDU3MzM0MTYwMjMgRjMwMFxuRzEgWDIwMS44NiBZMTM2LjAwMzcxIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNTZcbkcwIFgzNi41ODE3NDQgWTExMi4zOTI1MDk5OTk5OTk5OVxuRzEgWDM2LjE4MzIwODQ0NDMzNzExIFkxMDkuMTE2MjM1NTU5Mjg2NSBGMzAwXG5HMSBYMzUuMDEwODQ0NTM5ODk0ODkgWTEwNi4wMzEwNTAzNjYyMTI4MiBGMzAwXG5HMSBYMzMuMTMzMDMwNjg4NDMwNDE2IFkxMDMuMzE2ODk4NTc2MTk2NjIgRjMwMFxuRzEgWDMwLjY1OTI5MDgyNjU1OTIwNyBZMTAxLjEzMjA4MzczMzc0NjcgRjMwMFxuRzEgWDI3LjczMzkwNjQxNjI3MTUzNCBZOTkuNjA0MDM1NjgwODIyNCBGMzAwXG5HMSBYMjQuNTI3NTAxMTk0NTY3OTYgWTk4LjgyMTg3ODE4MTE4OTQzIEYzMDBcbkcxIFgyMi45MTU3MzkgWTk4LjcyNjQ5OTk5OTk5OTk5IEYzMDBcbkcxIFgxOS42Mzk0NjQ2MzUxMDkxNzQgWTk5LjEyNTAzNjE3ODk4NDEgRjMwMFxuRzEgWDE2LjU1NDI3OTY2NTA4MTM3OCBZMTAwLjI5NzQwMDY3MDM5MjIyIEYzMDBcbkcxIFgxMy44NDAxMjgyMzIzMjUwNDggWTEwMi4xNzUyMTUwMzgyMzIzNSBGMzAwXG5HMSBYMTEuNjU1MzEzODYwNTExNzU0IFkxMDQuNjQ4OTU1MzE1NzcxMjIgRjMwMFxuRzEgWDEwLjEyNzI2NjM2NDE1MDgxMSBZMTA3LjU3NDM0MDAxNjc3NDY3IEYzMDBcbkcxIFg5LjM0NTEwOTQ3NDU0NjI2MyBZMTEwLjc4MDc0NTM4NzI4NjA1IEYzMDBcbkcxIFg5LjI0OTczMTYwMDAwMDAwNCBZMTEyLjM5MjUwOTk5OTk5OTk3IEYzMDBcbkcxIFg5LjY0ODI2NzE1NTY2Mjg4MiBZMTE1LjY2ODc4NDQ0MDcxMzQ4IEYzMDBcbkcxIFgxMC44MjA2MzEwNjAxMDUwOTMgWTExOC43NTM5Njk2MzM3ODcxNSBGMzAwXG5HMSBYMTIuNjk4NDQ0OTExNTY5NTU4IFkxMjEuNDY4MTIxNDIzODAzMzcgRjMwMFxuRzEgWDE1LjE3MjE4NDc3MzQ0MDc2MiBZMTIzLjY1MjkzNjI2NjI1MzI5IEYzMDBcbkcxIFgxOC4wOTc1NjkxODM3Mjg0NTYgWTEyNS4xODA5ODQzMTkxNzc2MSBGMzAwXG5HMSBYMjEuMzAzOTc0NDA1NDMxOTk3IFkxMjUuOTYzMTQxODE4ODEwNTggRjMwMFxuRzEgWDIyLjkxNTczODk5OTk5OTk4OCBZMTI2LjA1ODUxOTk5OTk5OTk5IEYzMDBcbkcxIFgyNi4xOTIwMTMyOTQ5MDA1MjYgWTEyNS42NTk5ODMyNDU2NDIzMiBGMzAwXG5HMSBYMjkuMjc3MTk4MDU5MDM5Njg0IFkxMjQuNDg3NjE4MjEyNDE5NDUgRjMwMFxuRzEgWDMxLjk5MTM0OTE2MjAxNzUxIFkxMjIuNjA5ODAzMzY3OTI0ODUgRjMwMFxuRzEgWDM0LjE3NjE2MzA5OTM5Njg1IFkxMjAuMTM2MDYyNzA2NjkyNzUgRjMwMFxuRzEgWDM1LjcwNDIxMDA4MjAwNjg0IFkxMTcuMjEwNjc3NzM3MzM2MzQgRjMwMFxuRzEgWDM2LjQ4NjM2NjQwODUwODEgWTExNC4wMDQyNzIyMjk0NjQwMSBGMzAwXG5HMSBYMzYuNTgxNzQ0IFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU1N1xuRzAgWDYwLjE5MjkyMiBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYNTkuNzk0Mzg2NDQ0MzM3MTE0IFkxMDkuMTE2MjM1NTU5Mjg2NSBGMzAwXG5HMSBYNTguNjIyMDIyNTM5ODk0ODkgWTEwNi4wMzEwNTAzNjYyMTI4MiBGMzAwXG5HMSBYNTYuNzQ0MjA4Njg4NDMwNDIgWTEwMy4zMTY4OTg1NzYxOTY2MiBGMzAwXG5HMSBYNTQuMjcwNDY4ODI2NTU5MjEgWTEwMS4xMzIwODM3MzM3NDY3IEYzMDBcbkcxIFg1MS4zNDUwODQ0MTYyNzE1MyBZOTkuNjA0MDM1NjgwODIyNCBGMzAwXG5HMSBYNDguMTM4Njc5MTk0NTY3OTYgWTk4LjgyMTg3ODE4MTE4OTQzIEYzMDBcbkcxIFg0Ni41MjY5MTY5OTk5OTk5OSBZOTguNzI2NDk5OTk5OTk5OTkgRjMwMFxuRzEgWDQzLjI1MDY0MjYxNzYxMTYyIFk5OS4xMjUwMzYwMzUxNDA3MSBGMzAwXG5HMSBYNDAuMTY1NDU3NTk2MTExNyBZMTAwLjI5NzQwMDM5MTA5NTEyIEYzMDBcbkcxIFgzNy40NTEzMDYwODA5MTA3NyBZMTAyLjE3NTIxNDYzOTc3MTYgRjMwMFxuRzEgWDM1LjI2NjQ5MTYwMDQ4OSBZMTA0LjY0ODk1NDgyMTM4NzEyIEYzMDBcbkcxIFgzMy43Mzg0NDM5NzU2OTAzMTYgWTEwNy41NzQzMzk0NTUzMDIzIEYzMDBcbkcxIFgzMi45NTYyODY5NDUzMDk5MyBZMTEwLjc4MDc0NDc5MTQ3MzQxIEYzMDBcbkcxIFgzMi44NjA5MDkgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwXG5HMSBYMzMuMjU5NDQ0NTU1NjYyODYgWTExNS42Njg3ODQ0NDA3MTM0OCBGMzAwXG5HMSBYMzQuNDMxODA4NDYwMTA1MDUgWTExOC43NTM5Njk2MzM3ODcxNiBGMzAwXG5HMSBYMzYuMzA5NjIyMzExNTY5NDg0IFkxMjEuNDY4MTIxNDIzODAzMzcgRjMwMFxuRzEgWDM4Ljc4MzM2MjE3MzQ0MDY4IFkxMjMuNjUyOTM2MjY2MjUzMyBGMzAwXG5HMSBYNDEuNzA4NzQ2NTgzNzI4MzU2IFkxMjUuMTgwOTg0MzE5MTc3NjQgRjMwMFxuRzEgWDQ0LjkxNTE1MTgwNTQzMTkzIFkxMjUuOTYzMTQxODE4ODEwNjQgRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMTI2LjA1ODUxOTk5OTk5OTk5IEYzMDBcbkcxIFg0OS44MDMxOTEyOTQ5MDA1MiBZMTI1LjY1OTk4MzI0NTY0MjMyIEYzMDBcbkcxIFg1Mi44ODgzNzYwNTkwMzk2OCBZMTI0LjQ4NzYxODIxMjQxOTQ1IEYzMDBcbkcxIFg1NS42MDI1MjcxNjIwMTc1MSBZMTIyLjYwOTgwMzM2NzkyNDg1IEYzMDBcbkcxIFg1Ny43ODczNDEwOTkzOTY4NSBZMTIwLjEzNjA2MjcwNjY5Mjc1IEYzMDBcbkcxIFg1OS4zMTUzODgwODIwMDY4NSBZMTE3LjIxMDY3NzczNzMzNjMzIEYzMDBcbkcxIFg2MC4wOTc1NDQ0MDg1MDgxMSBZMTE0LjAwNDI3MjIyOTQ2Mzk4IEYzMDBcbkcxIFg2MC4xOTI5MjIgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTU4XG5HMCBYODMuODA0MDkgWTExMi4zOTI1MDk5OTk5OTk5OVxuRzEgWDgzLjQwNTU1NDQ0NDMzNzE0IFkxMDkuMTE2MjM1NTU5Mjg2NSBGMzAwXG5HMSBYODIuMjMzMTkwNTM5ODk0OTUgWTEwNi4wMzEwNTAzNjYyMTI4MSBGMzAwXG5HMSBYODAuMzU1Mzc2Njg4NDMwNTEgWTEwMy4zMTY4OTg1NzYxOTY2IEYzMDBcbkcxIFg3Ny44ODE2MzY4MjY1NTkzMiBZMTAxLjEzMjA4MzczMzc0NjY3IEYzMDBcbkcxIFg3NC45NTYyNTI0MTYyNzE2NCBZOTkuNjA0MDM1NjgwODIyMzQgRjMwMFxuRzEgWDcxLjc0OTg0NzE5NDU2ODA4IFk5OC44MjE4NzgxODExODkzMyBGMzAwXG5HMSBYNzAuMTM4MDgyIFk5OC43MjY0OTk5OTk5OTk5OSBGMzAwXG5HMSBYNjYuODYxODA3NzA1MDk5NDcgWTk5LjEyNTAzNjc1NDM1NzY1IEYzMDBcbkcxIFg2My43NzY2MjI5NDA5NjAzNCBZMTAwLjI5NzQwMTc4NzU4MDUxIEYzMDBcbkcxIFg2MS4wNjI0NzE4Mzc5ODI1MSBZMTAyLjE3NTIxNjYzMjA3NTEgRjMwMFxuRzEgWDU4Ljg3NzY1NzkwMDYwMzE3IFkxMDQuNjQ4OTU3MjkzMzA3MiBGMzAwXG5HMSBYNTcuMzQ5NjEwOTE3OTkzMTYgWTEwNy41NzQzNDIyNjI2NjM2MiBGMzAwXG5HMSBYNTYuNTY3NDU0NTkxNDkxOSBZMTEwLjc4MDc0Nzc3MDUzNTk0IEYzMDBcbkcxIFg1Ni40NzIwNzcgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwXG5HMSBYNTYuODcwNjEyNTU1NjYyODkgWTExNS42Njg3ODQ0NDA3MTM0NyBGMzAwXG5HMSBYNTguMDQyOTc2NDYwMTA1MSBZMTE4Ljc1Mzk2OTYzMzc4NzE1IEYzMDBcbkcxIFg1OS45MjA3OTAzMTE1Njk1NiBZMTIxLjQ2ODEyMTQyMzgwMzM0IEYzMDBcbkcxIFg2Mi4zOTQ1MzAxNzM0NDA3NyBZMTIzLjY1MjkzNjI2NjI1MzI1IEYzMDBcbkcxIFg2NS4zMTk5MTQ1ODM3Mjg0NiBZMTI1LjE4MDk4NDMxOTE3NzU3IEYzMDBcbkcxIFg2OC41MjYzMTk4MDU0MzIwNCBZMTI1Ljk2MzE0MTgxODgxMDU0IEYzMDBcbkcxIFg3MC4xMzgwODIwMDAwMDAwMSBZMTI2LjA1ODUxOTk5OTk5OTk5IEYzMDBcbkcxIFg3My40MTQzNTYzODIzODgzOCBZMTI1LjY1OTk4Mzk2NDg1OTI2IEYzMDBcbkcxIFg3Ni40OTk1NDE0MDM4ODgzIFkxMjQuNDg3NjE5NjA4OTA0ODUgRjMwMFxuRzEgWDc5LjIxMzY5MjkxOTA4OTIzIFkxMjIuNjA5ODA1MzYwMjI4MzggRjMwMFxuRzEgWDgxLjM5ODUwNzM5OTUxMTAyIFkxMjAuMTM2MDY1MTc4NjEyODIgRjMwMFxuRzEgWDgyLjkyNjU1NTAyNDMwOTY5IFkxMTcuMjEwNjgwNTQ0Njk3NjQgRjMwMFxuRzEgWDgzLjcwODcxMjA1NDY5MDA4IFkxMTQuMDA0Mjc1MjA4NTI2NTIgRjMwMFxuRzEgWDgzLjgwNDA5IFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU1OVxuRzAgWDEwNy40MTUyNSBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYMTA3LjAxNjcxNDQ0NDMzNzU0IFkxMDkuMTE2MjM1NTU5Mjg2NDQgRjMwMFxuRzEgWDEwNS44NDQzNTA1Mzk4OTU3MSBZMTA2LjAzMTA1MDM2NjIxMjY0IEYzMDBcbkcxIFgxMDMuOTY2NTM2Njg4NDMxNiBZMTAzLjMxNjg5ODU3NjE5NjE4IEYzMDBcbkcxIFgxMDEuNDkyNzk2ODI2NTYwNjkgWTEwMS4xMzIwODM3MzM3NDU5NiBGMzAwXG5HMSBYOTguNTY3NDEyNDE2MjczMjMgWTk5LjYwNDAzNTY4MDgyMTI4IEYzMDBcbkcxIFg5NS4zNjEwMDcxOTQ1Njk3NSBZOTguODIxODc4MTgxMTg3ODggRjMwMFxuRzEgWDkzLjc0OTI1MSBZOTguNzI2NDk5OTk5OTk5OTkgRjMwMFxuRzEgWDkwLjQ3Mjk3NjYxNzYxMTYyIFk5OS4xMjUwMzYwMzUxNDA3MSBGMzAwXG5HMSBYODcuMzg3NzkxNTk2MTExNyBZMTAwLjI5NzQwMDM5MTA5NTEyIEYzMDBcbkcxIFg4NC42NzM2NDAwODA5MTA3NyBZMTAyLjE3NTIxNDYzOTc3MTYgRjMwMFxuRzEgWDgyLjQ4ODgyNTYwMDQ4ODk4IFkxMDQuNjQ4OTU0ODIxMzg3MTQgRjMwMFxuRzEgWDgwLjk2MDc3Nzk3NTY5MDMgWTEwNy41NzQzMzk0NTUzMDIzMSBGMzAwXG5HMSBYODAuMTc4NjIwOTQ1MzA5OTIgWTExMC43ODA3NDQ3OTE0NzM0IEYzMDBcbkcxIFg4MC4wODMyNDMgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwXG5HMSBYODAuNDgxNzc4NTU1NjYyODYgWTExNS42Njg3ODQ0NDA3MTM0OCBGMzAwXG5HMSBYODEuNjU0MTQyNDYwMTA1MDUgWTExOC43NTM5Njk2MzM3ODcxNiBGMzAwXG5HMSBYODMuNTMxOTU2MzExNTY5NDkgWTEyMS40NjgxMjE0MjM4MDMzNyBGMzAwXG5HMSBYODYuMDA1Njk2MTczNDQwNjcgWTEyMy42NTI5MzYyNjYyNTMzIEYzMDBcbkcxIFg4OC45MzEwODA1ODM3MjgzMyBZMTI1LjE4MDk4NDMxOTE3NzY0IEYzMDBcbkcxIFg5Mi4xMzc0ODU4MDU0MzE4OCBZMTI1Ljk2MzE0MTgxODgxMDY0IEYzMDBcbkcxIFg5My43NDkyNTEwMDAwMDAwMiBZMTI2LjA1ODUxOTk5OTk5OTk5IEYzMDBcbkcxIFg5Ny4wMjU1MjUxMTk5MjQ0MiBZMTI1LjY1OTk4MTgwNzIwODUgRjMwMFxuRzEgWDEwMC4xMTA3MDkzNjkzNDE1NSBZMTI0LjQ4NzYxNTQxOTQ0ODkgRjMwMFxuRzEgWDEwMi44MjQ4NTk2NDc4NzI3NCBZMTIyLjYwOTc5OTM4MzMxODMzIEYzMDBcbkcxIFgxMDUuMDA5NjcyNDk5MTY2ODggWTEyMC4xMzYwNTc3NjI4NTM0OCBGMzAwXG5HMSBYMTA2LjUzNzcxODE5NzM5OTI5IFkxMTcuMjEwNjcyMTIyNjE1MDEgRjMwMFxuRzEgWDEwNy4zMTk4NzMxMTYxNDIxOCBZMTE0LjAwNDI2NjI3MTM0MDcgRjMwMFxuRzEgWDEwNy40MTUyNSBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNjBcbkcwIFgxMzEuMDI2NDEgWTExMi4zOTI1MDk5OTk5OTk5OVxuRzEgWDEzMC42Mjc4NzQ0NDQzMzc0IFkxMDkuMTE2MjM1NTU5Mjg2NDcgRjMwMFxuRzEgWDEyOS40NTU1MTA1Mzk4OTU1IFkxMDYuMDMxMDUwMzY2MjEyNjggRjMwMFxuRzEgWDEyNy41Nzc2OTY2ODg0MzEyOSBZMTAzLjMxNjg5ODU3NjE5NjMxIEYzMDBcbkcxIFgxMjUuMTAzOTU2ODI2NTYwMyBZMTAxLjEzMjA4MzczMzc0NjE5IEYzMDBcbkcxIFgxMjIuMTc4NTcyNDE2MjcyNzYgWTk5LjYwNDAzNTY4MDgyMTYgRjMwMFxuRzEgWDExOC45NzIxNjcxOTQ1NjkyNSBZOTguODIxODc4MTgxMTg4MzEgRjMwMFxuRzEgWDExNy4zNjA0MTAwMDAwMDAwMiBZOTguNzI2NDk5OTk5OTk5OTkgRjMwMFxuRzEgWDExNC4wODQxMzU4NTA5MTI4NyBZOTkuMTI1MDM3OTUzMDUyNTEgRjMwMFxuRzEgWDExMC45OTg5NTE1MTU3MDg3IFkxMDAuMjk3NDA0MTE1MDU2IEYzMDBcbkcxIFgxMDguMjg0ODAxMDk5NzY5NzEgWTEwMi4xNzUyMTk5NTI1ODA1OCBGMzAwXG5HMSBYMTA2LjA5OTk4ODA2NzQ2MTM1IFkxMDQuNjQ4OTYxNDEzMTczMzEgRjMwMFxuRzEgWDEwNC41NzE5NDIxNTUxNjU5OCBZMTA3LjU3NDM0Njk0MTU5ODE0IEYzMDBcbkcxIFgxMDMuNzg5Nzg3MDAxNzk2NjcgWTExMC43ODA3NTI3MzU2Mzg4NiBGMzAwXG5HMSBYMTAzLjY5NDQxIFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMFxuRzEgWDEwNC4wOTI5NDU1NTU2NjI1OCBZMTE1LjY2ODc4NDQ0MDcxMzUxIEYzMDBcbkcxIFgxMDUuMjY1MzA5NDYwMTA0NSBZMTE4Ljc1Mzk2OTYzMzc4NzI2IEYzMDBcbkcxIFgxMDcuMTQzMTIzMzExNTY4NzEgWTEyMS40NjgxMjE0MjM4MDM2NyBGMzAwXG5HMSBYMTA5LjYxNjg2MzE3MzQzOTcgWTEyMy42NTI5MzYyNjYyNTM3OSBGMzAwXG5HMSBYMTEyLjU0MjI0NzU4MzcyNzI1IFkxMjUuMTgwOTg0MzE5MTc4MzggRjMwMFxuRzEgWDExNS43NDg2NTI4MDU0MzA3NCBZMTI1Ljk2MzE0MTgxODgxMTY2IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTEyNi4wNTg1MTk5OTk5OTk5OSBGMzAwXG5HMSBYMTIwLjYzNjY4NDE0OTA4NzEzIFkxMjUuNjU5OTgyMDQ2OTQ3NDYgRjMwMFxuRzEgWDEyMy43MjE4Njg0ODQyOTEzIFkxMjQuNDg3NjE1ODg0OTQzOTYgRjMwMFxuRzEgWDEyNi40MzYwMTg5MDAyMzAzMSBZMTIyLjYwOTgwMDA0NzQxOTM4IEYzMDBcbkcxIFgxMjguNjIwODMxOTMyNTM4NyBZMTIwLjEzNjA1ODU4NjgyNjYyIEYzMDBcbkcxIFgxMzAuMTQ4ODc3ODQ0ODM0MDMgWTExNy4yMTA2NzMwNTg0MDE4MSBGMzAwXG5HMSBYMTMwLjkzMTAzMjk5ODIwMzM0IFkxMTQuMDA0MjY3MjY0MzYxMDkgRjMwMFxuRzEgWDEzMS4wMjY0MSBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNjFcbkcwIFgxNTQuNjM3NiBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYMTU0LjIzOTA2NDQ0NDMzNzQgWTEwOS4xMTYyMzU1NTkyODY0NyBGMzAwXG5HMSBYMTUzLjA2NjcwMDUzOTg5NTQ2IFkxMDYuMDMxMDUwMzY2MjEyNjggRjMwMFxuRzEgWDE1MS4xODg4ODY2ODg0MzEyNyBZMTAzLjMxNjg5ODU3NjE5NjMgRjMwMFxuRzEgWDE0OC43MTUxNDY4MjY1NjAyNyBZMTAxLjEzMjA4MzczMzc0NjE2IEYzMDBcbkcxIFgxNDUuNzg5NzYyNDE2MjcyNzQgWTk5LjYwNDAzNTY4MDgyMTYgRjMwMFxuRzEgWDE0Mi41ODMzNTcxOTQ1NjkyNiBZOTguODIxODc4MTgxMTg4MzEgRjMwMFxuRzEgWDE0MC45NzE2IFk5OC43MjY0OTk5OTk5OTk5OSBGMzAwXG5HMSBYMTM3LjY5NTMyNTU1OTI4NjUyIFk5OS4xMjUwMzU1NTU2NjI3NSBGMzAwXG5HMSBYMTM0LjYxMDE0MDM2NjIxMjggWTEwMC4yOTczOTk0NjAxMDQ4NCBGMzAwXG5HMSBYMTMxLjg5NTk4ODU3NjE5NjUyIFkxMDIuMTc1MjEzMzExNTY5MiBGMzAwXG5HMSBYMTI5LjcxMTE3MzczMzc0NjUgWTEwNC42NDg5NTMxNzM0NDAzMyBGMzAwXG5HMSBYMTI4LjE4MzEyNTY4MDgyMjEgWTEwNy41NzQzMzc1ODM3Mjc5NSBGMzAwXG5HMSBYMTI3LjQwMDk2ODE4MTE4ODk5IFkxMTAuNzgwNzQyODA1NDMxNSBGMzAwXG5HMSBYMTI3LjMwNTU5MDAwMDAwMDAyIFkxMTIuMzkyNTA5OTk5OTk5OTcgRjMwMFxuRzEgWDEyNy43MDQxMjU1NTU2NjI3OCBZMTE1LjY2ODc4NDQ0MDcxMzUgRjMwMFxuRzEgWDEyOC44NzY0ODk0NjAxMDQ4NiBZMTE4Ljc1Mzk2OTYzMzc4NzIyIEYzMDBcbkcxIFgxMzAuNzU0MzAzMzExNTY5MjMgWTEyMS40NjgxMjE0MjM4MDM0OCBGMzAwXG5HMSBYMTMzLjIyODA0MzE3MzQ0MDM0IFkxMjMuNjUyOTM2MjY2MjUzNSBGMzAwXG5HMSBYMTM2LjE1MzQyNzU4MzcyNzk2IFkxMjUuMTgwOTg0MzE5MTc3OTIgRjMwMFxuRzEgWDEzOS4zNTk4MzI4MDU0MzE1IFkxMjUuOTYzMTQxODE4ODExMDIgRjMwMFxuRzEgWDE0MC45NzE2MDAwMDAwMDAwMiBZMTI2LjA1ODUxOTk5OTk5OTk5IEYzMDBcbkcxIFgxNDQuMjQ3ODc0MTQ5MDg3MTIgWTEyNS42NTk5ODIwNDY5NDc0NiBGMzAwXG5HMSBYMTQ3LjMzMzA1ODQ4NDI5MTMgWTEyNC40ODc2MTU4ODQ5NDM5NiBGMzAwXG5HMSBYMTUwLjA0NzIwODkwMDIzMDMyIFkxMjIuNjA5ODAwMDQ3NDE5MzggRjMwMFxuRzEgWDE1Mi4yMzIwMjE5MzI1Mzg2NiBZMTIwLjEzNjA1ODU4NjgyNjY1IEYzMDBcbkcxIFgxNTMuNzYwMDY3ODQ0ODM0MDMgWTExNy4yMTA2NzMwNTg0MDE4MSBGMzAwXG5HMSBYMTU0LjU0MjIyMjk5ODIwMzMzIFkxMTQuMDA0MjY3MjY0MzYxMDkgRjMwMFxuRzEgWDE1NC42Mzc2IFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU2MlxuRzAgWDE3OC4yNDg4MSBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYMTc3Ljg1MDI3NDQ0NDMzODgyIFkxMDkuMTE2MjM1NTU5Mjg2MyBGMzAwXG5HMSBYMTc2LjY3NzkxMDUzOTg5ODIyIFkxMDYuMDMxMDUwMzY2MjEyMDMgRjMwMFxuRzEgWDE3NC44MDAwOTY2ODg0MzUyIFkxMDMuMzE2ODk4NTc2MTk0ODYgRjMwMFxuRzEgWDE3Mi4zMjYzNTY4MjY1NjUxIFkxMDEuMTMyMDgzNzMzNzQzNjQgRjMwMFxuRzEgWDE2OS40MDA5NzI0MTYyNzgyMiBZOTkuNjA0MDM1NjgwODE3OCBGMzAwXG5HMSBYMTY2LjE5NDU2NzE5NDU3NTA2IFk5OC44MjE4NzgxODExODMxNCBGMzAwXG5HMSBYMTY0LjU4Mjc5IFk5OC43MjY0OTk5OTk5OTk5OSBGMzAwXG5HMSBYMTYxLjMwNjUxNjE0MjU0MDk3IFk5OS4xMjUwNDAzNTA0NDIwNiBGMzAwXG5HMSBYMTU4LjIyMTMzMjY2NTIwODAyIFkxMDAuMjk3NDA4NzcwMDA2MzMgRjMwMFxuRzEgWDE1NS41MDcxODM2MjMzNDc3NCBZMTAyLjE3NTIyNjU5MzU5MDE0IEYzMDBcbkcxIFgxNTMuMzIyMzcyNDAxMTgyMiBZMTA0LjY0ODk2OTY1MjkwMzE4IEYzMDBcbkcxIFgxNTEuNzk0MzI4NjI5NTE2NzQgWTEwNy41NzQzNTYyOTk0NjM2MyBGMzAwXG5HMSBYMTUxLjAxMjE3NTgyMjQxMTY1IFkxMTAuNzgwNzYyNjY1ODM5NzcgRjMwMFxuRzEgWDE1MC45MTY4MDAwMDAwMDAwMiBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDBcbkcxIFgxNTEuMzE1MzM1NTU1NjYwNjggWTExNS42Njg3ODQ0NDA3MTM3NSBGMzAwXG5HMSBYMTUyLjQ4NzY5OTQ2MDEwMDggWTExOC43NTM5Njk2MzM3ODgyMyBGMzAwXG5HMSBYMTU0LjM2NTUxMzMxMTU2MzQgWTEyMS40NjgxMjE0MjM4MDU3MSBGMzAwXG5HMSBYMTU2LjgzOTI1MzE3MzQzMzEyIFkxMjMuNjUyOTM2MjY2MjU3MzEgRjMwMFxuRzEgWDE1OS43NjQ2Mzc1ODM3MTk3OCBZMTI1LjE4MDk4NDMxOTE4MzYyIEYzMDBcbkcxIFgxNjIuOTcxMDQyODA1NDIyODMgWTEyNS45NjMxNDE4MTg4MTg3OCBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDA1IFkxMjYuMDU4NTE5OTk5OTk5OTkgRjMwMFxuRzEgWDE2Ny44NTkwNjQ3MzIzMzgwOCBZMTI1LjY1OTk4Njg0MTcyNzIyIEYzMDBcbkcxIFgxNzAuOTQ0MjUwNzgzMjc5NjcgWTEyNC40ODc2MjUxOTQ4NDcxNyBGMzAwXG5HMSBYMTczLjY1ODQwMzk0NzM3MTc3IFkxMjIuNjA5ODEzMzI5NDQ0MDcgRjMwMFxuRzEgWDE3NS44NDMyMjA1OTk5NjIyOCBZMTIwLjEzNjA3NTA2NjI5NTkgRjMwMFxuRzEgWDE3Ny4zNzEyNzA3OTM1MTQ5OCBZMTE3LjIxMDY5MTc3NDE0NzA1IEYzMDBcbkcxIFgxNzguMTUzNDMwNjM5NDExNDUgWTExNC4wMDQyODcxMjQ3ODI0NCBGMzAwXG5HMSBYMTc4LjI0ODgxIFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU2M1xuRzAgWDIwMS44NiBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYMjAxLjQ2MTQ2NDQ0NDMzOTM2IFkxMDkuMTE2MjM1NTU5Mjg2MjIgRjMwMFxuRzEgWDIwMC4yODkxMDA1Mzk4OTkyNCBZMTA2LjAzMTA1MDM2NjIxMTc0IEYzMDBcbkcxIFgxOTguNDExMjg2Njg4NDM2NjMgWTEwMy4zMTY4OTg1NzYxOTQyNSBGMzAwXG5HMSBYMTk1LjkzNzU0NjgyNjU2NjkyIFkxMDEuMTMyMDgzNzMzNzQyNjYgRjMwMFxuRzEgWDE5My4wMTIxNjI0MTYyODAzIFk5OS42MDQwMzU2ODA4MTYzNyBGMzAwXG5HMSBYMTg5LjgwNTc1NzE5NDU3NzI0IFk5OC44MjE4NzgxODExODEyIEYzMDBcbkcxIFgxODguMTk0MDEgWTk4LjcyNjQ5OTk5OTk5OTk5IEYzMDBcbkcxIFgxODQuOTE3NzM1NTU5Mjg2NDggWTk5LjEyNTAzNTU1NTY2Mjc1IEYzMDBcbkcxIFgxODEuODMyNTUwMzY2MjEyNzYgWTEwMC4yOTczOTk0NjAxMDQ4NCBGMzAwXG5HMSBYMTc5LjExODM5ODU3NjE5NjQ4IFkxMDIuMTc1MjEzMzExNTY5MiBGMzAwXG5HMSBYMTc2LjkzMzU4MzczMzc0NjQ3IFkxMDQuNjQ4OTUzMTczNDQwMzMgRjMwMFxuRzEgWDE3NS40MDU1MzU2ODA4MjIwNiBZMTA3LjU3NDMzNzU4MzcyNzk1IEYzMDBcbkcxIFgxNzQuNjIzMzc4MTgxMTg4OTQgWTExMC43ODA3NDI4MDU0MzE1IEYzMDBcbkcxIFgxNzQuNTI4IFkxMTIuMzkyNTA5OTk5OTk5OTcgRjMwMFxuRzEgWDE3NC45MjY1MzU1NTU2NjI3NSBZMTE1LjY2ODc4NDQ0MDcxMzUgRjMwMFxuRzEgWDE3Ni4wOTg4OTk0NjAxMDQ4MyBZMTE4Ljc1Mzk2OTYzMzc4NzIyIEYzMDBcbkcxIFgxNzcuOTc2NzEzMzExNTY5MiBZMTIxLjQ2ODEyMTQyMzgwMzQ4IEYzMDBcbkcxIFgxODAuNDUwNDUzMTczNDQwMyBZMTIzLjY1MjkzNjI2NjI1MzUgRjMwMFxuRzEgWDE4My4zNzU4Mzc1ODM3Mjc5MyBZMTI1LjE4MDk4NDMxOTE3NzkyIEYzMDBcbkcxIFgxODYuNTgyMjQyODA1NDMxNDYgWTEyNS45NjMxNDE4MTg4MTEwMiBGMzAwXG5HMSBYMTg4LjE5NDAxIFkxMjYuMDU4NTE5OTk5OTk5OTkgRjMwMFxuRzEgWDE5MS40NzAyODM4NTc0NTkwNCBZMTI1LjY1OTk3OTY0OTU1NzkxIEYzMDBcbkcxIFgxOTQuNTU1NDY3MzM0NzkyIFkxMjQuNDg3NjExMjI5OTkzNjUgRjMwMFxuRzEgWDE5Ny4yNjk2MTYzNzY2NTIzIFkxMjIuNjA5NzkzNDA2NDA5ODQgRjMwMFxuRzEgWDE5OS40NTQ0Mjc1OTg4MTc4MyBZMTIwLjEzNjA1MDM0NzA5NjggRjMwMFxuRzEgWDIwMC45ODI0NzEzNzA0ODMzIFkxMTcuMjEwNjYzNzAwNTM2MzQgRjMwMFxuRzEgWDIwMS43NjQ2MjQxNzc1ODg0IFkxMTQuMDA0MjU3MzM0MTYwMTkgRjMwMFxuRzEgWDIwMS44NiBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNjRcbkcwIFgyNi4yNzk1OTcgWTI3Ny42NzA1NjRcbkcxIFgyNS44ODU1NDE5ODg0ODk3MjQgWTI3Ni4wOTA3NTEzNTAzNzg3IEYzMDBcbkcxIFgyNC43OTU3MDAwOTYyNTUyNSBZMjc0Ljg4MTA2ODc0MzI3NDM0IEYzMDBcbkcxIFgyMy4yNjU0MDcyNDUzMTQ0MDMgWTI3NC4zMjQ5MjkyMzcwNzE3IEYzMDBcbkcxIFgyMi45MTU3MzkgWTI3NC4zMDY3MDYgRjMwMFxuRzEgWDIxLjMzNTkyNjExNjA5MTQ3IFkyNzQuNzAwNzYwMDcyMjI0NCBGMzAwXG5HMSBYMjAuMTI2MjQyODYxMDE2MTU2IFkyNzUuNzkwNjAxMjQ1MjM1NTYgRjMwMFxuRzEgWDE5LjU3MDEwMjQ0NDk2OTk5NyBZMjc3LjMyMDg5Mzc2NTUyMDUgRjMwMFxuRzEgWDE5LjU1MTg3OSBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYMTkuOTQ1OTMyNjAyNTgxNDI2IFkyNzkuMjUwMzc3MDAxMDUxOTYgRjMwMFxuRzEgWDIxLjAzNTc3MzQxNTk4MDg3NCBZMjgwLjQ2MDA2MDU4MDExMjU1IEYzMDBcbkcxIFgyMi41NjYwNjU3NzA5Mzc2NjYgWTI4MS4wMTYyMDE0NTEwODAzIEYzMDBcbkcxIFgyMi45MTU3MzkgWTI4MS4wMzQ0MjUwMDAwMDAwNiBGMzAwXG5HMSBYMjQuNDk1NTUxNjQ5NjIxMzggWTI4MC42NDAzNjk5ODg0ODk5IEYzMDBcbkcxIFgyNS43MDUyMzQyNTY3MjU4MjQgWTI3OS41NTA1MjgwOTYyNTU1IEYzMDBcbkcxIFgyNi4yNjEzNzM3NjI5Mjg2MiBZMjc4LjAyMDIzNTI0NTMxNDcgRjMwMFxuRzEgWDI2LjI3OTU5NyBZMjc3LjY3MDU2NDAwMDAwMDA3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNjVcbkcwIFg3My41MDE5NDIgWTI3Ny42NzA1NjRcbkcxIFg3My4xMDc4ODY5ODg0ODk2NyBZMjc2LjA5MDc1MTM1MDM3ODcgRjMwMFxuRzEgWDcyLjAxODA0NTA5NjI1NTE1IFkyNzQuODgxMDY4NzQzMjc0NCBGMzAwXG5HMSBYNzAuNDg3NzUyMjQ1MzE0MjggWTI3NC4zMjQ5MjkyMzcwNzE4IEYzMDBcbkcxIFg3MC4xMzgwODE5OTk5OTk5OCBZMjc0LjMwNjcwNiBGMzAwXG5HMSBYNjguNTU4MjY5MzUwMzc4NjQgWTI3NC43MDA3NjEwMTE1MTAzNCBGMzAwXG5HMSBYNjcuMzQ4NTg2NzQzMjc0MjggWTI3NS43OTA2MDI5MDM3NDQ4IEYzMDBcbkcxIFg2Ni43OTI0NDcyMzcwNzE2MSBZMjc3LjMyMDg5NTc1NDY4NTY0IEYzMDBcbkcxIFg2Ni43NzQyMjQgWTI3Ny42NzA1NjQgRjMwMFxuRzEgWDY3LjE2ODI3NzYwMjU4MTM3IFkyNzkuMjUwMzc3MDAxMDUxOTYgRjMwMFxuRzEgWDY4LjI1ODExODQxNTk4MDc3IFkyODAuNDYwMDYwNTgwMTEyNiBGMzAwXG5HMSBYNjkuNzg4NDEwNzcwOTM3NTUgWTI4MS4wMTYyMDE0NTEwODA0IEYzMDBcbkcxIFg3MC4xMzgwODIwMDAwMDAwMSBZMjgxLjAzNDQyNTAwMDAwMDA2IEYzMDBcbkcxIFg3MS43MTc4OTQ4ODM5MDg1NiBZMjgwLjY0MDM3MDkyNzc3NTggRjMwMFxuRzEgWDcyLjkyNzU3ODEzODk4Mzk2IFkyNzkuNTUwNTI5NzU0NzY0NzQgRjMwMFxuRzEgWDczLjQ4MzcxODU1NTAzMDI0IFkyNzguMDIwMjM3MjM0NDc5ODUgRjMwMFxuRzEgWDczLjUwMTk0MiBZMjc3LjY3MDU2NDAwMDAwMDA3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNjZcbkcwIFgxMjAuNzI0MjcgWTI3Ny42NzA1NjRcbkcxIFgxMjAuMzMwMjE0OTg4NDg5NjcgWTI3Ni4wOTA3NTEzNTAzNzg3IEYzMDBcbkcxIFgxMTkuMjQwMzczMDk2MjU1MTUgWTI3NC44ODEwNjg3NDMyNzQ0IEYzMDBcbkcxIFgxMTcuNzEwMDgwMjQ1MzE0MjkgWTI3NC4zMjQ5MjkyMzcwNzE4IEYzMDBcbkcxIFgxMTcuMzYwNDA5OTk5OTk5OTkgWTI3NC4zMDY3MDYgRjMwMFxuRzEgWDExNS43ODA1OTcxMTYwOTE0OSBZMjc0LjcwMDc2MDA3MjIyNDQgRjMwMFxuRzEgWDExNC41NzA5MTM4NjEwMTYxNyBZMjc1Ljc5MDYwMTI0NTIzNTU2IEYzMDBcbkcxIFgxMTQuMDE0NzczNDQ0OTcgWTI3Ny4zMjA4OTM3NjU1MjA1IEYzMDBcbkcxIFgxMTMuOTk2NTUwMDAwMDAwMDEgWTI3Ny42NzA1NjQgRjMwMFxuRzEgWDExNC4zOTA2MDM2MDI1ODE0MiBZMjc5LjI1MDM3NzAwMTA1MTk2IEYzMDBcbkcxIFgxMTUuNDgwNDQ0NDE1OTgwODcgWTI4MC40NjAwNjA1ODAxMTI1NSBGMzAwXG5HMSBYMTE3LjAxMDczNjc3MDkzNzY3IFkyODEuMDE2MjAxNDUxMDgwMyBGMzAwXG5HMSBYMTE3LjM2MDQxIFkyODEuMDM0NDI1MDAwMDAwMDYgRjMwMFxuRzEgWDExOC45NDAyMjI4ODM5MDg1NiBZMjgwLjY0MDM3MDkyNzc3NTggRjMwMFxuRzEgWDEyMC4xNDk5MDYxMzg5ODM5NyBZMjc5LjU1MDUyOTc1NDc2NDc0IEYzMDBcbkcxIFgxMjAuNzA2MDQ2NTU1MDMwMjQgWTI3OC4wMjAyMzcyMzQ0Nzk4NSBGMzAwXG5HMSBYMTIwLjcyNDI3IFkyNzcuNjcwNTY0MDAwMDAwMDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU2N1xuRzAgWDE2Ny45NDY2NyBZMjc3LjY3MDU2NFxuRzEgWDE2Ny41NTI2MTQ5ODg1MTk4NSBZMjc2LjA5MDc1MTM1MDM3MTIgRjMwMFxuRzEgWDE2Ni40NjI3NzMwOTYzMDg0IFkyNzQuODgxMDY4NzQzMjQ2MSBGMzAwXG5HMSBYMTY0LjkzMjQ4MDI0NTM3ODE3IFkyNzQuMzI0OTI5MjM3MDE0MjYgRjMwMFxuRzEgWDE2NC41ODI3OTAwMDAwMDAwMiBZMjc0LjMwNjcwNjAwMDAwMDEgRjMwMFxuRzEgWDE2My4wMDI5NzgyODc1MzI5NSBZMjc0LjcwMDc2NDc2ODY1MjU2IEYzMDBcbkcxIFgxNjEuNzkzMjk4MjcyMzE2NyBZMjc1Ljc5MDYwOTUzNzc3NjMzIEYzMDBcbkcxIFgxNjEuMjM3MTYyNDA1NDg5OTMgWTI3Ny4zMjA5MDM3MTEzMzU0IEYzMDBcbkcxIFgxNjEuMjE4OTQgWTI3Ny42NzA1NjQwMDAwMDAwNyBGMzAwXG5HMSBYMTYxLjYxMjk5MzYwMjU3NTU2IFkyNzkuMjUwMzc3MDAxMDUzNCBGMzAwXG5HMSBYMTYyLjcwMjgzNDQxNTk3MDUzIFkyODAuNDYwMDYwNTgwMTE4IEYzMDBcbkcxIFgxNjQuMjMzMTI2NzcwOTI1MjUgWTI4MS4wMTYyMDE0NTEwOTE0MyBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkyODEuMDM0NDI1IEYzMDBcbkcxIFgxNjYuMTYyNjA1MjI2NzQ5NjYgWTI4MC42NDAzODAzMjA2NDI0NiBGMzAwXG5HMSBYMTY3LjM3MjI5NDk2MTUxMTEgWTI3OS41NTA1NDYzMzk4ODU0IEYzMDBcbkcxIFgxNjcuOTI4NDQ0NDc1OTgxNCBZMjc4LjAyMDI1NzEyNjE4OTQgRjMwMFxuRzEgWDE2Ny45NDY2NyBZMjc3LjY3MDU2NCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTcyXG5HMCBYNDkuODkwNzc1IFkyNTQuMDU5MzgyXG5HMSBYNDkuNDk2NzIwOTI3Nzc1NjQgWTI1Mi40Nzk1NjkxMTYwOTE0OCBGMzAwXG5HMSBYNDguNDA2ODc5NzU0NzY0NDYgWTI1MS4yNjk4ODU4NjEwMTYxOCBGMzAwXG5HMSBYNDYuODc2NTg3MjM0NDc5NTMgWTI1MC43MTM3NDU0NDQ5NzAwMiBGMzAwXG5HMSBYNDYuNTI2OTE3IFkyNTAuNjk1NTIyIEYzMDBcbkcxIFg0NC45NDcxMDQxMTYwOTE0OCBZMjUxLjA4OTU3NjA3MjIyNDQgRjMwMFxuRzEgWDQzLjczNzQyMDg2MTAxNjIwNCBZMjUyLjE3OTQxNzI0NTIzNTYgRjMwMFxuRzEgWDQzLjE4MTI4MDQ0NDk3MDEgWTI1My43MDk3MDk3NjU1MjA1OSBGMzAwXG5HMSBYNDMuMTYzMDU2OTk5OTk5OTk1IFkyNTQuMDU5MzgxOTk5OTk5OTcgRjMwMFxuRzEgWDQzLjU1NzExMTU0MTg2NzM4NiBZMjU1LjYzOTE5NDc2Njc2NDk3IEYzMDBcbkcxIFg0NC42NDY5NTMwNzQ0OTAzMSBZMjU2Ljg0ODg3NzY5Nzg1NDg1IEYzMDBcbkcxIFg0Ni4xNzcyNDU3NjAxMDMyOSBZMjU3LjQwNTAxNzY1ODk3OTIgRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMjU3LjQyMzI0MDk5OTk5OTk2IEYzMDBcbkcxIFg0OC4xMDY3Mjk2NDk2MjEzMiBZMjU3LjAyOTE4NTk4ODQ4OTYgRjMwMFxuRzEgWDQ5LjMxNjQxMjI1NjcyNTYxIFkyNTUuOTM5MzQ0MDk2MjU1MDQgRjMwMFxuRzEgWDQ5Ljg3MjU1MTc2MjkyODE5IFkyNTQuNDA5MDUxMjQ1MzE0MTcgRjMwMFxuRzEgWDQ5Ljg5MDc3NDk5OTk5OTk5IFkyNTQuMDU5MzgxOTk5OTk5OTcgRjMwMFxuRzEgWDQ5Ljg5MDc3NSBZMjU0LjA1OTM4MiBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTczXG5HMCBYOTcuMTEzMTA1IFkyNTQuMDU5MzgyXG5HMSBYOTYuNzE5MDUwOTI3Nzc3NDMgWTI1Mi40Nzk1NjkxMTYwOTEwMyBGMzAwXG5HMSBYOTUuNjI5MjA5NzU0NzY3NjEgWTI1MS4yNjk4ODU4NjEwMTQ1IEYzMDBcbkcxIFg5NC4wOTg5MTcyMzQ0ODMzMiBZMjUwLjcxMzc0NTQ0NDk2NjYgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMjUwLjY5NTUyMiBGMzAwXG5HMSBYOTIuMTY5NDM3MTc4OTQ4MzYgWTI1MS4wODk1NzIzMTUwNzk0IEYzMDBcbkcxIFg5MC45NTk3NTEzMzE5OTM1MyBZMjUyLjE3OTQxMDYxMTE5MzY1IEYzMDBcbkcxIFg5MC40MDM2MDcyNzY1NzU0NiBZMjUzLjcwOTcwMTgwODg0OTU2IEYzMDBcbkcxIFg5MC4zODUzODMgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwXG5HMSBYOTAuNzc5NDM3NTQxODYyMDQgWTI1NS42MzkxOTQ3NjY3NjYzIEYzMDBcbkcxIFg5MS44NjkyNzkwNzQ0ODA4NiBZMjU2Ljg0ODg3NzY5Nzg1OTg1IEYzMDBcbkcxIFg5My4zOTk1NzE3NjAwOTE5NCBZMjU3LjQwNTAxNzY1ODk4OTQ0IEYzMDBcbkcxIFg5My43NDkyNTEgWTI1Ny40MjMyNDA5OTk5OTk5NiBGMzAwXG5HMSBYOTUuMzI5MDYzMTgxMDQ1MyBZMjU3LjAyOTE4NDEwOTkxODIgRjMwMFxuRzEgWDk2LjUzODc0NDQ5MjIwNjM5IFkyNTUuOTM5MzQwNzc5MjM4MjUgRjMwMFxuRzEgWDk3LjA5NDg4MjE3ODcyMTQyIFkyNTQuNDA5MDQ3MjY2OTg3MiBGMzAwXG5HMSBYOTcuMTEzMTA1IFkyNTQuMDU5MzgxOTk5OTk5OTcgRjMwMFxuRzEgWDk3LjExMzEwNSBZMjU0LjA1OTM4MiBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTc0XG5HMCBYMTQ0LjMzNTQ1IFkyNTQuMDU5MzgyXG5HMSBYMTQzLjk0MTM5NTkyNzc4MTQ2IFkyNTIuNDc5NTY5MTE2MDkwMDMgRjMwMFxuRzEgWDE0Mi44NTE1NTQ3NTQ3NzQ3MiBZMjUxLjI2OTg4NTg2MTAxMDcyIEYzMDBcbkcxIFgxNDEuMzIxMjYyMjM0NDkxODUgWTI1MC43MTM3NDU0NDQ5NTg5MyBGMzAwXG5HMSBYMTQwLjk3MTYgWTI1MC42OTU1MjIgRjMwMFxuRzEgWDEzOS4zOTE3ODU5NDQ2NjM5OCBZMjUxLjA4OTU3MTM3NTc5MjggRjMwMFxuRzEgWDEzOC4xODIwOTk0NDk3NDAzMiBZMjUyLjE3OTQwODk1MjY4MTgzIEYzMDBcbkcxIFgxMzcuNjI1OTU0NDg0NDc5NzYgWTI1My43MDk2OTk4MTk2NzkxMiBGMzAwXG5HMSBYMTM3LjYwNzczMDAwMDAwMDAzIFkyNTQuMDU5MzgxOTk5OTk5OTcgRjMwMFxuRzEgWDEzOC4wMDE3ODQ1NDE4NTkzIFkyNTUuNjM5MTk0NzY2NzY3IEYzMDBcbkcxIFgxMzkuMDkxNjI2MDc0NDc2MDQgWTI1Ni44NDg4Nzc2OTc4NjI0IEYzMDBcbkcxIFgxNDAuNjIxOTE4NzYwMDg2MTUgWTI1Ny40MDUwMTc2NTg5OTQ2NyBGMzAwXG5HMSBYMTQwLjk3MTYwMDAwMDAwMDAyIFkyNTcuNDIzMjQwOTk5OTk5OTYgRjMwMFxuRzEgWDE0Mi41NTE0MTE3MTI0NjcgWTI1Ny4wMjkxODIyMzEzNDczNiBGMzAwXG5HMSBYMTQzLjc2MTA5MTcyNzY4MzIgWTI1NS45MzkzMzc0NjIyMjM1MyBGMzAwXG5HMSBYMTQ0LjMxNzIyNzU5NDUwOTkgWTI1NC40MDkwNDMyODg2NjQ0NCBGMzAwXG5HMSBYMTQ0LjMzNTQ1IFkyNTQuMDU5MzgxOTk5OTk5OTcgRjMwMFxuRzEgWDE0NC4zMzU0NSBZMjU0LjA1OTM4MiBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTc1XG5HMCBYMTkxLjU1Nzg1IFkyNTQuMDU5MzgyXG5HMSBYMTkxLjE2Mzc5NTkyNzgwMTI2IFkyNTIuNDc5NTY5MTE2MDg1MDYgRjMwMFxuRzEgWDE5MC4wNzM5NTQ3NTQ4MDk3IFkyNTEuMjY5ODg1ODYwOTkyMDggRjMwMFxuRzEgWDE4OC41NDM2NjIyMzQ1MzM4IFkyNTAuNzEzNzQ1NDQ0OTIxMDcgRjMwMFxuRzEgWDE4OC4xOTQwMDk5OTk5OTk5NiBZMjUwLjY5NTUyMTk5OTk5OTk4IEYzMDBcbkcxIFgxODYuNjE0MTk0NzczMjUwMzggWTI1MS4wODk1NjY2NzkzNTc3IEYzMDBcbkcxIFgxODUuNDA0NTA1MDM4NDg5MDUgWTI1Mi4xNzk0MDA2NjAxMTQ4OCBGMzAwXG5HMSBYMTg0Ljg0ODM1NTUyNDAxODkzIFkyNTMuNzA5Njg5ODczODExIEYzMDBcbkcxIFgxODQuODMwMTMgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwXG5HMSBYMTg1LjIyNDE4NDU0MTgzNzI1IFkyNTUuNjM5MTk0NzY2NzcyNSBGMzAwXG5HMSBYMTg2LjMxNDAyNjA3NDQzNzA3IFkyNTYuODQ4ODc3Njk3ODgzMTUgRjMwMFxuRzEgWDE4Ny44NDQzMTg3NjAwMzk0NCBZMjU3LjQwNTAxNzY1OTAzNjczIEYzMDBcbkcxIFgxODguMTk0MDEwMDAwMDAwMDIgWTI1Ny40MjMyNDA5OTk5OTk5NiBGMzAwXG5HMSBYMTg5Ljc3MzgyMDU0MTAxMTU2IFkyNTcuMDI5MTc3NTM0OTIyNyBGMzAwXG5HMSBYMTkwLjk4MzQ5NzMxNjM1Nzk4IFkyNTUuOTM5MzI5MTY5Njk1OTUgRjMwMFxuRzEgWDE5MS41Mzk2Mjg2MzM5NjAzOCBZMjU0LjQwOTAzMzM0Mjg3NjIzIEYzMDBcbkcxIFgxOTEuNTU3ODUgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwXG5HMSBYMTkxLjU1Nzg1IFkyNTQuMDU5MzgyIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNzZcbkcwIFgyNi4yNzk1OTcgWTIzMC40NDgyMTRcbkcxIFgyNS44ODU1MzU4ODMxMzQ3NCBZMjI4Ljg2ODQwMjg3MzI1ODk2IEYzMDBcbkcxIFgyNC43OTU2ODkzMTU5NTgzMSBZMjI3LjY1ODcyNDQ3Nzk3NjI1IEYzMDBcbkcxIFgyMy4yNjUzOTQzMTU3NjcyNDIgWTIyNy4xMDI1OTA4ODU3NjEgRjMwMFxuRzEgWDIyLjkxNTczOSBZMjI3LjA4NDM2OTAwMDAwMDA0IEYzMDBcbkcxIFgyMS4zMzU5MjYxMTYwODc5OCBZMjI3LjQ3ODQyMzA3MjIxMDQgRjMwMFxuRzEgWDIwLjEyNjI0Mjg2MTAwMzAzIFkyMjguNTY4MjY0MjQ1MjEwOSBGMzAwXG5HMSBYMTkuNTcwMTAyNDQ0OTQzMzM0IFkyMzAuMDk4NTU2NzY1NDkwOSBGMzAwXG5HMSBYMTkuNTUxODc5IFkyMzAuNDQ4MjE0MDAwMDAwMDQgRjMwMFxuRzEgWDE5Ljk0NTkzMzA3MjIyNDQyNyBZMjMyLjAyODAyNjg4MzkwODUyIEYzMDBcbkcxIFgyMS4wMzU3NzQyNDUyMzU2NiBZMjMzLjIzNzcxMDEzODk4MzggRjMwMFxuRzEgWDIyLjU2NjA2Njc2NTUyMDYxMyBZMjMzLjc5Mzg1MDU1NTAyOTkgRjMwMFxuRzEgWDIyLjkxNTczOSBZMjMzLjgxMjA3NCBGMzAwXG5HMSBYMjQuNDk1NTUxNjQ5NjIxMzQgWTIzMy40MTgwMTg5ODg0ODk2OCBGMzAwXG5HMSBYMjUuNzA1MjM0MjU2NzI1NjU3IFkyMzIuMzI4MTc3MDk2MjU1MTYgRjMwMFxuRzEgWDI2LjI2MTM3Mzc2MjkyODI3NiBZMjMwLjc5Nzg4NDI0NTMxNDMgRjMwMFxuRzEgWDI2LjI3OTU5NyBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTc3XG5HMCBYNzMuNTAxOTQyIFkyMzAuNDQ4MjE0XG5HMSBYNzMuMTA3ODgwODgzMTM0NjcgWTIyOC44Njg0MDI4NzMyNTg5NiBGMzAwXG5HMSBYNzIuMDE4MDM0MzE1OTU4MiBZMjI3LjY1ODcyNDQ3Nzk3NjI4IEYzMDBcbkcxIFg3MC40ODc3MzkzMTU3NjcxMiBZMjI3LjEwMjU5MDg4NTc2MTEyIEYzMDBcbkcxIFg3MC4xMzgwODE5OTk5OTk5OCBZMjI3LjA4NDM2OTAwMDAwMDA0IEYzMDBcbkcxIFg2OC41NTgyNjkzNTAzNzUxNiBZMjI3LjQ3ODQyNDAxMTQ5NjMyIEYzMDBcbkcxIFg2Ny4zNDg1ODY3NDMyNjExNyBZMjI4LjU2ODI2NTkwMzcyMDEgRjMwMFxuRzEgWDY2Ljc5MjQ0NzIzNzA0NDk1IFkyMzAuMDk4NTU4NzU0NjU2IEYzMDBcbkcxIFg2Ni43NzQyMjQgWTIzMC40NDgyMTQwMDAwMDAwNCBGMzAwXG5HMSBYNjcuMTY4Mjc4MDcyMjI0MzggWTIzMi4wMjgwMjY4ODM5MDg1NSBGMzAwXG5HMSBYNjguMjU4MTE5MjQ1MjM1NTYgWTIzMy4yMzc3MTAxMzg5ODM4NiBGMzAwXG5HMSBYNjkuNzg4NDExNzY1NTIwNSBZMjMzLjc5Mzg1MDU1NTAzMDAyIEYzMDBcbkcxIFg3MC4xMzgwODIgWTIzMy44MTIwNzQgRjMwMFxuRzEgWDcxLjcxNzg5NDg4MzkwODUxIFkyMzMuNDE4MDE5OTI3Nzc1NiBGMzAwXG5HMSBYNzIuOTI3NTc4MTM4OTgzNzkgWTIzMi4zMjgxNzg3NTQ3NjQzNyBGMzAwXG5HMSBYNzMuNDgzNzE4NTU1MDI5OSBZMjMwLjc5Nzg4NjIzNDQ3OTQgRjMwMFxuRzEgWDczLjUwMTk0MiBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTc4XG5HMCBYMTIwLjcyNDI3IFkyMzAuNDQ4MjE0XG5HMSBYMTIwLjMzMDIwODg4MzEzNDY3IFkyMjguODY4NDAyODczMjU4OTYgRjMwMFxuRzEgWDExOS4yNDAzNjIzMTU5NTgyMSBZMjI3LjY1ODcyNDQ3Nzk3NjI4IEYzMDBcbkcxIFgxMTcuNzEwMDY3MzE1NzY3MTIgWTIyNy4xMDI1OTA4ODU3NjExMiBGMzAwXG5HMSBYMTE3LjM2MDQwOTk5OTk5OTk5IFkyMjcuMDg0MzY5MDAwMDAwMDQgRjMwMFxuRzEgWDExNS43ODA1OTcxMTYwODc5OSBZMjI3LjQ3ODQyMzA3MjIxMDQgRjMwMFxuRzEgWDExNC41NzA5MTM4NjEwMDMwNCBZMjI4LjU2ODI2NDI0NTIxMDkgRjMwMFxuRzEgWDExNC4wMTQ3NzM0NDQ5NDMzNCBZMjMwLjA5ODU1Njc2NTQ5MDkgRjMwMFxuRzEgWDExMy45OTY1NTAwMDAwMDAwMSBZMjMwLjQ0ODIxNDAwMDAwMDA0IEYzMDBcbkcxIFgxMTQuMzkwNjA0MDcyMjI0NDMgWTIzMi4wMjgwMjY4ODM5MDg1MiBGMzAwXG5HMSBYMTE1LjQ4MDQ0NTI0NTIzNTY2IFkyMzMuMjM3NzEwMTM4OTgzOCBGMzAwXG5HMSBYMTE3LjAxMDczNzc2NTUyMDYyIFkyMzMuNzkzODUwNTU1MDI5OSBGMzAwXG5HMSBYMTE3LjM2MDQxIFkyMzMuODEyMDc0IEYzMDBcbkcxIFgxMTguOTQwMjIyODgzOTA4NTIgWTIzMy40MTgwMTk5Mjc3NzU2IEYzMDBcbkcxIFgxMjAuMTQ5OTA2MTM4OTgzOCBZMjMyLjMyODE3ODc1NDc2NDM3IEYzMDBcbkcxIFgxMjAuNzA2MDQ2NTU1MDI5OSBZMjMwLjc5Nzg4NjIzNDQ3OTQgRjMwMFxuRzEgWDEyMC43MjQyNyBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTc5XG5HMCBYMTY3Ljk0NjY3IFkyMzAuNDQ4MjE0XG5HMSBYMTY3LjU1MjYwODg4MzE2NDg1IFkyMjguODY4NDAyODczMjUxNDUgRjMwMFxuRzEgWDE2Ni40NjI3NjIzMTYwMTE0NiBZMjI3LjY1ODcyNDQ3Nzk0Nzk3IEYzMDBcbkcxIFgxNjQuOTMyNDY3MzE1ODMxIFkyMjcuMTAyNTkwODg1NzAzNTYgRjMwMFxuRzEgWDE2NC41ODI3OTAwMDAwMDAwMiBZMjI3LjA4NDM2OTAwMDAwMDA0IEYzMDBcbkcxIFgxNjMuMDAyOTc4Mjg3NTI5NDYgWTIyNy40Nzg0Mjc3Njg2Mzg1NCBGMzAwXG5HMSBYMTYxLjc5MzI5ODI3MjMwMzYgWTIyOC41NjgyNzI1Mzc3NTE2IEYzMDBcbkcxIFgxNjEuMjM3MTYyNDA1NDYzMjcgWTIzMC4wOTg1NjY3MTEzMDU3NSBGMzAwXG5HMSBYMTYxLjIxODk0IFkyMzAuNDQ4MjE0MDAwMDAwMDQgRjMwMFxuRzEgWDE2MS42MTI5OTQwNzIyMTg1NiBZMjMyLjAyODAyNjg4MzkxIEYzMDBcbkcxIFgxNjIuNzAyODM1MjQ1MjI1MyBZMjMzLjIzNzcxMDEzODk4OTMgRjMwMFxuRzEgWDE2NC4yMzMxMjc3NjU1MDgyIFkyMzMuNzkzODUwNTU1MDQxMDggRjMwMFxuRzEgWDE2NC41ODI3OTAwMDAwMDAwMiBZMjMzLjgxMjA3NCBGMzAwXG5HMSBYMTY2LjE2MjYwNTIyNjc0OTYzIFkyMzMuNDE4MDI5MzIwNjQyMyBGMzAwXG5HMSBYMTY3LjM3MjI5NDk2MTUxMDk2IFkyMzIuMzI4MTk1MzM5ODg1MSBGMzAwXG5HMSBYMTY3LjkyODQ0NDQ3NTk4MTA4IFkyMzAuNzk3OTA2MTI2MTg5IEYzMDBcbkcxIFgxNjcuOTQ2NjcgWTIzMC40NDgyMTQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4MFxuRzAgWDQ5Ljg5MDc3NSBZMjA2LjgzNzE3M1xuRzEgWDQ5LjQ5NjcxMjQ3NDIwNzUgWTIwNS4yNTczNjIyMjQ2OTYyIEYzMDBcbkcxIFg0OC40MDY4NjQ4MjgyMDA2MjUgWTIwNC4wNDc2ODQ4MDEzNzQ5IEYzMDBcbkcxIFg0Ni44NzY1NjkzMzIwMzE5ODQgWTIwMy40OTE1NTI1NzM5MjcxOCBGMzAwXG5HMSBYNDYuNTI2OTE2OTk5OTk5OTkgWTIwMy40NzMzMzEwMDAwMDAwMyBGMzAwXG5HMSBYNDQuOTQ3MTA0MTE2MDg2MzMgWTIwMy44NjczODUwNzIyMDM4MyBGMzAwXG5HMSBYNDMuNzM3NDIwODYwOTk2ODQgWTIwNC45NTcyMjYyNDUxOTkyOCBGMzAwXG5HMSBYNDMuMTgxMjgwNDQ0OTMwNzggWTIwNi40ODc1MTg3NjU0NzY5OCBGMzAwXG5HMSBYNDMuMTYzMDU2OTk5OTk5OTk1IFkyMDYuODM3MTczMDAwMDAwMDQgRjMwMFxuRzEgWDQzLjU1NzExOTUyNTc5MjU0NCBZMjA4LjQxNjk4Mzc3NTMwMzggRjMwMFxuRzEgWDQ0LjY0Njk2NzE3MTc5OTQ2IFkyMDkuNjI2NjYxMTk4NjI1MDcgRjMwMFxuRzEgWDQ2LjE3NzI2MjY2Nzk2ODExNSBZMjEwLjE4Mjc5MzQyNjA3Mjc1IEYzMDBcbkcxIFg0Ni41MjY5MTcgWTIxMC4yMDEwMTQ5OTk5OTk5OCBGMzAwXG5HMSBYNDguMTA2NzI5NjQ5NjI2NDcgWTIwOS44MDY5NTk5ODg1MTAyNyBGMzAwXG5HMSBYNDkuMzE2NDEyMjU2NzQ1MDA0IFkyMDguNzE3MTE4MDk2MjkxNTMgRjMwMFxuRzEgWDQ5Ljg3MjU1MTc2Mjk2NzU5IFkyMDcuMTg2ODI1MjQ1MzU3OTQgRjMwMFxuRzEgWDQ5Ljg5MDc3NDk5OTk5OTk5IFkyMDYuODM3MTcyOTk5OTk5OTggRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4MVxuRzAgWDk3LjExMzEwNSBZMjA2LjgzNzE3M1xuRzEgWDk2LjcxOTA0MjQ3NDIwOTMgWTIwNS4yNTczNjIyMjQ2OTU3NSBGMzAwXG5HMSBYOTUuNjI5MTk0ODI4MjAzOCBZMjA0LjA0NzY4NDgwMTM3MzI0IEYzMDBcbkcxIFg5NC4wOTg4OTkzMzIwMzU3OCBZMjAzLjQ5MTU1MjU3MzkyMzc3IEYzMDBcbkcxIFg5My43NDkyNTEgWTIwMy40NzMzMzEwMDAwMDAwMyBGMzAwXG5HMSBYOTIuMTY5NDM3MTc4OTQzMjEgWTIwMy44NjczODEzMTUwNTg4MiBGMzAwXG5HMSBYOTAuOTU5NzUxMzMxOTc0MTYgWTIwNC45NTcyMTk2MTExNTcyOSBGMzAwXG5HMSBYOTAuNDAzNjA3Mjc2NTM2MTQgWTIwNi40ODc1MTA4MDg4MDU5MiBGMzAwXG5HMSBYOTAuMzg1MzgzIFkyMDYuODM3MTczIEYzMDBcbkcxIFg5MC43Nzk0NDU1MjU3ODcyIFkyMDguNDE2OTgzNzc1MzA1MTQgRjMwMFxuRzEgWDkxLjg2OTI5MzE3MTc5IFkyMDkuNjI2NjYxMTk4NjMwMSBGMzAwXG5HMSBYOTMuMzk5NTg4NjY3OTU2NzggWTIxMC4xODI3OTM0MjYwODI5OCBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkyMTAuMjAxMDE1IEYzMDBcbkcxIFg5NS4zMjkwNjMxODEwNTA0NiBZMjA5LjgwNjk1ODEwOTkzODg4IEYzMDBcbkcxIFg5Ni41Mzg3NDQ0OTIyMjU3OSBZMjA4LjcxNzExNDc3OTI3NDc0IEYzMDBcbkcxIFg5Ny4wOTQ4ODIxNzg3NjA4MSBZMjA3LjE4NjgyMTI2NzAzMDkyIEYzMDBcbkcxIFg5Ny4xMTMxMDUgWTIwNi44MzcxNzI5OTk5OTk5OCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTgyXG5HMCBYMTQ0LjMzNTQ1IFkyMDYuODM3MTczXG5HMSBYMTQzLjk0MTM4NzQ3NDIxMzMxIFkyMDUuMjU3MzYyMjI0Njk0NzYgRjMwMFxuRzEgWDE0Mi44NTE1Mzk4MjgyMTA5IFkyMDQuMDQ3Njg0ODAxMzY5NDYgRjMwMFxuRzEgWDE0MS4zMjEyNDQzMzIwNDQzIFkyMDMuNDkxNTUyNTczOTE2MSBGMzAwXG5HMSBYMTQwLjk3MTYgWTIwMy40NzMzMzEwMDAwMDAwMyBGMzAwXG5HMSBYMTM5LjM5MTc4NTk0NDY1ODg0IFkyMDMuODY3MzgwMzc1NzcyMiBGMzAwXG5HMSBYMTM4LjE4MjA5OTQ0OTcyMDk3IFkyMDQuOTU3MjE3OTUyNjQ1NDYgRjMwMFxuRzEgWDEzNy42MjU5NTQ0ODQ0NDA0NiBZMjA2LjQ4NzUwODgxOTYzNTUgRjMwMFxuRzEgWDEzNy42MDc3MyBZMjA2LjgzNzE3MyBGMzAwXG5HMSBYMTM4LjAwMTc5MjUyNTc4NDQ4IFkyMDguNDE2OTgzNzc1MzA1ODIgRjMwMFxuRzEgWDEzOS4wOTE2NDAxNzE3ODUyIFkyMDkuNjI2NjYxMTk4NjMyNyBGMzAwXG5HMSBYMTQwLjYyMTkzNTY2Nzk1MSBZMjEwLjE4Mjc5MzQyNjA4ODIgRjMwMFxuRzEgWDE0MC45NzE2IFkyMTAuMjAxMDE1IEYzMDBcbkcxIFgxNDIuNTUxNDExNzEyNDcyMTcgWTIwOS44MDY5NTYyMzEzNjgwNSBGMzAwXG5HMSBYMTQzLjc2MTA5MTcyNzcwMjYgWTIwOC43MTcxMTE0NjIyNjAwMiBGMzAwXG5HMSBYMTQ0LjMxNzIyNzU5NDU0OTI4IFkyMDcuMTg2ODE3Mjg4NzA4MiBGMzAwXG5HMSBYMTQ0LjMzNTQ1IFkyMDYuODM3MTcyOTk5OTk5OTggRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4M1xuRzAgWDE5MS41NTc4NSBZMjA2LjgzNzE3M1xuRzEgWDE5MS4xNjM3ODc0NzQyMzMxMiBZMjA1LjI1NzM2MjIyNDY4OTggRjMwMFxuRzEgWDE5MC4wNzM5Mzk4MjgyNDU4NyBZMjA0LjA0NzY4NDgwMTM1MDggRjMwMFxuRzEgWDE4OC41NDM2NDQzMzIwODYyNyBZMjAzLjQ5MTU1MjU3Mzg3ODI0IEYzMDBcbkcxIFgxODguMTk0MDEgWTIwMy40NzMzMzEgRjMwMFxuRzEgWDE4Ni42MTQxOTQ3NzMyNDUyNiBZMjAzLjg2NzM3NTY3OTMzNzEzIEYzMDBcbkcxIFgxODUuNDA0NTA1MDM4NDY5NzIgWTIwNC45NTcyMDk2NjAwNzg1NSBGMzAwXG5HMSBYMTg0Ljg0ODM1NTUyMzk3OTY1IFkyMDYuNDg3NDk4ODczNzY3NCBGMzAwXG5HMSBYMTg0LjgzMDEzIFkyMDYuODM3MTczMDAwMDAwMDQgRjMwMFxuRzEgWDE4NS4yMjQxOTI1MjU3NjI0IFkyMDguNDE2OTgzNzc1MzExMyBGMzAwXG5HMSBYMTg2LjMxNDA0MDE3MTc0NjIzIFkyMDkuNjI2NjYxMTk4NjUzMzggRjMwMFxuRzEgWDE4Ny44NDQzMzU2Njc5MDQyNiBZMjEwLjE4Mjc5MzQyNjEzMDI3IEYzMDBcbkcxIFgxODguMTk0MDEgWTIxMC4yMDEwMTQ5OTk5OTk5OCBGMzAwXG5HMSBYMTg5Ljc3MzgyMDU0MTAxNjcgWTIwOS44MDY5NTE1MzQ5NDM0IEYzMDBcbkcxIFgxOTAuOTgzNDk3MzE2Mzc3NCBZMjA4LjcxNzEwMzE2OTczMjQ3IEYzMDBcbkcxIFgxOTEuNTM5NjI4NjMzOTk5OCBZMjA3LjE4NjgwNzM0MjkyMDAyIEYzMDBcbkcxIFgxOTEuNTU3ODUgWTIwNi44MzcxNzMgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4NFxuRzAgWDI2LjI3OTU5NyBZMTgzLjIyNjA3XG5HMSBYMjUuODg1NTQyOTI3Nzc1NjI4IFkxODEuNjQ2MjU3MTE2MDkxNDUgRjMwMFxuRzEgWDI0Ljc5NTcwMTc1NDc2NDQzNyBZMTgwLjQzNjU3Mzg2MTAxNjE0IEYzMDBcbkcxIFgyMy4yNjU0MDkyMzQ0Nzk1MDIgWTE3OS44ODA0MzM0NDQ5Njk5OCBGMzAwXG5HMSBYMjIuOTE1NzM5IFkxNzkuODYyMjEgRjMwMFxuRzEgWDIxLjMzNTkyNjExNjA5MTQ4IFkxODAuMjU2MjY0MDcyMjI0NCBGMzAwXG5HMSBYMjAuMTI2MjQyODYxMDE2MjEgWTE4MS4zNDYxMDUyNDUyMzU2MyBGMzAwXG5HMSBYMTkuNTcwMTAyNDQ0OTcwMTA3IFkxODIuODc2Mzk3NzY1NTIwNiBGMzAwXG5HMSBYMTkuNTUxODc5MDAwMDAwMDAzIFkxODMuMjI2MDcgRjMwMFxuRzEgWDE5Ljk0NTkzMzA3MjIyNDQyNyBZMTg0LjgwNTg4Mjg4MzkwODUgRjMwMFxuRzEgWDIxLjAzNTc3NDI0NTIzNTY2IFkxODYuMDE1NTY2MTM4OTgzOCBGMzAwXG5HMSBYMjIuNTY2MDY2NzY1NTIwNjEzIFkxODYuNTcxNzA2NTU1MDI5OSBGMzAwXG5HMSBYMjIuOTE1NzM5IFkxODYuNTg5OTI5OTk5OTk5OTggRjMwMFxuRzEgWDI0LjQ5NTU1MTY0OTYyMTM0IFkxODYuMTk1ODc0OTg4NDg5NjYgRjMwMFxuRzEgWDI1LjcwNTIzNDI1NjcyNTY1NyBZMTg1LjEwNjAzMzA5NjI1NTE1IEYzMDBcbkcxIFgyNi4yNjEzNzM3NjI5MjgyNzYgWTE4My41NzU3NDAyNDUzMTQyOCBGMzAwXG5HMSBYMjYuMjc5NTk3IFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4NVxuRzAgWDczLjUwMTk0MiBZMTgzLjIyNjA3XG5HMSBYNzMuMTA3ODg3OTI3Nzc1NTYgWTE4MS42NDYyNTcxMTYwOTE0OCBGMzAwXG5HMSBYNzIuMDE4MDQ2NzU0NzY0MzMgWTE4MC40MzY1NzM4NjEwMTYyIEYzMDBcbkcxIFg3MC40ODc3NTQyMzQ0NzkzOCBZMTc5Ljg4MDQzMzQ0NDk3MDEgRjMwMFxuRzEgWDcwLjEzODA4MiBZMTc5Ljg2MjIxIEYzMDBcbkcxIFg2OC41NTgyNjkzNTAzNzg2NyBZMTgwLjI1NjI2NTAxMTUxMDMyIEYzMDBcbkcxIFg2Ny4zNDg1ODY3NDMyNzQzNCBZMTgxLjM0NjEwNjkwMzc0NDg0IEYzMDBcbkcxIFg2Ni43OTI0NDcyMzcwNzE3MyBZMTgyLjg3NjM5OTc1NDY4NTcgRjMwMFxuRzEgWDY2Ljc3NDIyNCBZMTgzLjIyNjA3IEYzMDBcbkcxIFg2Ny4xNjgyNzgwNzIyMjQzOCBZMTg0LjgwNTg4Mjg4MzkwODU0IEYzMDBcbkcxIFg2OC4yNTgxMTkyNDUyMzU1NiBZMTg2LjAxNTU2NjEzODk4Mzg0IEYzMDBcbkcxIFg2OS43ODg0MTE3NjU1MjA1IFkxODYuNTcxNzA2NTU1MDMgRjMwMFxuRzEgWDcwLjEzODA4MiBZMTg2LjU4OTkyOTk5OTk5OTk4IEYzMDBcbkcxIFg3MS43MTc4OTQ4ODM5MDg1MSBZMTg2LjE5NTg3NTkyNzc3NTU3IEYzMDBcbkcxIFg3Mi45Mjc1NzgxMzg5ODM3OSBZMTg1LjEwNjAzNDc1NDc2NDM1IEYzMDBcbkcxIFg3My40ODM3MTg1NTUwMjk5IFkxODMuNTc1NzQyMjM0NDc5MzggRjMwMFxuRzEgWDczLjUwMTk0MiBZMTgzLjIyNjA3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlODZcbkcwIFgxMjAuNzI0MjcgWTE4My4yMjYwN1xuRzEgWDEyMC4zMzAyMTU5Mjc3NzU1NyBZMTgxLjY0NjI1NzExNjA5MTQ4IEYzMDBcbkcxIFgxMTkuMjQwMzc0NzU0NzY0MzMgWTE4MC40MzY1NzM4NjEwMTYyIEYzMDBcbkcxIFgxMTcuNzEwMDgyMjM0NDc5MzkgWTE3OS44ODA0MzM0NDQ5NzAxIEYzMDBcbkcxIFgxMTcuMzYwNDEgWTE3OS44NjIyMSBGMzAwXG5HMSBYMTE1Ljc4MDU5NzExNjA5MTQ5IFkxODAuMjU2MjY0MDcyMjI0NCBGMzAwXG5HMSBYMTE0LjU3MDkxMzg2MTAxNjIxIFkxODEuMzQ2MTA1MjQ1MjM1NjMgRjMwMFxuRzEgWDExNC4wMTQ3NzM0NDQ5NzAxIFkxODIuODc2Mzk3NzY1NTIwNiBGMzAwXG5HMSBYMTEzLjk5NjU1IFkxODMuMjI2MDcgRjMwMFxuRzEgWDExNC4zOTA2MDQwNzIyMjQ0MyBZMTg0LjgwNTg4Mjg4MzkwODUgRjMwMFxuRzEgWDExNS40ODA0NDUyNDUyMzU2NiBZMTg2LjAxNTU2NjEzODk4MzggRjMwMFxuRzEgWDExNy4wMTA3Mzc3NjU1MjA2MiBZMTg2LjU3MTcwNjU1NTAyOTkgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTg2LjU4OTkyOTk5OTk5OTk4IEYzMDBcbkcxIFgxMTguOTQwMjIyODgzOTA4NTIgWTE4Ni4xOTU4NzU5Mjc3NzU1NyBGMzAwXG5HMSBYMTIwLjE0OTkwNjEzODk4MzggWTE4NS4xMDYwMzQ3NTQ3NjQzNSBGMzAwXG5HMSBYMTIwLjcwNjA0NjU1NTAyOTkgWTE4My41NzU3NDIyMzQ0NzkzOCBGMzAwXG5HMSBYMTIwLjcyNDI3IFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4N1xuRzAgWDE2Ny45NDY2NyBZMTgzLjIyNjA3XG5HMSBYMTY3LjU1MjYxNTkyNzgwNTc2IFkxODEuNjQ2MjU3MTE2MDgzOTQgRjMwMFxuRzEgWDE2Ni40NjI3NzQ3NTQ4MTc2MiBZMTgwLjQzNjU3Mzg2MDk4Nzg2IEYzMDBcbkcxIFgxNjQuOTMyNDgyMjM0NTQzMjcgWTE3OS44ODA0MzM0NDQ5MTI1NyBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkxNzkuODYyMjEgRjMwMFxuRzEgWDE2My4wMDI5NzgyODc1MzI5NSBZMTgwLjI1NjI2ODc2ODY1MjU1IEYzMDBcbkcxIFgxNjEuNzkzMjk4MjcyMzE2NzUgWTE4MS4zNDYxMTM1Mzc3NzYzNSBGMzAwXG5HMSBYMTYxLjIzNzE2MjQwNTQ5IFkxODIuODc2NDA3NzExMzM1NDIgRjMwMFxuRzEgWDE2MS4yMTg5NCBZMTgzLjIyNjA3IEYzMDBcbkcxIFgxNjEuNjEyOTk0MDcyMjE4NTYgWTE4NC44MDU4ODI4ODM5MSBGMzAwXG5HMSBYMTYyLjcwMjgzNTI0NTIyNTMgWTE4Ni4wMTU1NjYxMzg5ODkzIEYzMDBcbkcxIFgxNjQuMjMzMTI3NzY1NTA4MiBZMTg2LjU3MTcwNjU1NTA0MTA2IEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDIgWTE4Ni41ODk5Mjk5OTk5OTk5OCBGMzAwXG5HMSBYMTY2LjE2MjYwNTIyNjc0OTYzIFkxODYuMTk1ODg1MzIwNjQyMjggRjMwMFxuRzEgWDE2Ny4zNzIyOTQ5NjE1MTA5NiBZMTg1LjEwNjA1MTMzOTg4NTA4IEYzMDBcbkcxIFgxNjcuOTI4NDQ0NDc1OTgxMDggWTE4My41NzU3NjIxMjYxODg5OCBGMzAwXG5HMSBYMTY3Ljk0NjY3IFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4OFxuRzAgWDQ5Ljg5MDc3NSBZMTU5LjYxNDlcbkcxIFg0OS40OTY3MTYyMzEzNDc1MDYgWTE1OC4wMzUwODgyODc1MzI5NCBGMzAwXG5HMSBYNDguNDA2ODcxNDYyMjIzNzU1IFkxNTYuODI1NDA4MjcyMzE2NjggRjMwMFxuRzEgWDQ2Ljg3NjU3NzI4ODY2NDY5IFkxNTYuMjY5MjcyNDA1NDg5OTEgRjMwMFxuRzEgWDQ2LjUyNjkxNjk5OTk5OTk5IFkxNTYuMjUxMDUgRjMwMFxuRzEgWDQ0Ljk0NzEwNDExNjA5MDAxIFkxNTYuNjQ1MTA0MDcyMjE4NTQgRjMwMFxuRzEgWDQzLjczNzQyMDg2MTAxMDY5IFkxNTcuNzM0OTQ1MjQ1MjI1MjggRjMwMFxuRzEgWDQzLjE4MTI4MDQ0NDk1ODkxIFkxNTkuMjY1MjM3NzY1NTA4MTggRjMwMFxuRzEgWDQzLjE2MzA1Njk5OTk5OTk5NSBZMTU5LjYxNDkgRjMwMFxuRzEgWDQzLjU1NzEwNjM3NTc5MjgwNiBZMTYxLjE5NDcxNDA1NTMzNjAyIEYzMDBcbkcxIFg0NC42NDY5NDM5NTI2ODE4NCBZMTYyLjQwNDQwMDU1MDI1OTY4IEYzMDBcbkcxIFg0Ni4xNzcyMzQ4MTk2NzkxMiBZMTYyLjk2MDU0NTUxNTUyMDI0IEYzMDBcbkcxIFg0Ni41MjY5MTcgWTE2Mi45Nzg3Njk5OTk5OTk5NyBGMzAwXG5HMSBYNDguMTA2NzI5NjQ5NjIzMzYgWTE2Mi41ODQ3MTQ5ODg0OTc3NSBGMzAwXG5HMSBYNDkuMzE2NDEyMjU2NzMzMjYgWTE2MS40OTQ4NzMwOTYyNjk0MyBGMzAwXG5HMSBYNDkuODcyNTUxNzYyOTQzNzIgWTE1OS45NjQ1ODAyNDUzMzE0MyBGMzAwXG5HMSBYNDkuODkwNzc1IFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4OVxuRzAgWDk3LjExMzEwNSBZMTU5LjYxNDlcbkcxIFg5Ni43MTkwNDYyMzEzNDkzIFkxNTguMDM1MDg4Mjg3NTMyNSBGMzAwXG5HMSBYOTUuNjI5MjAxNDYyMjI2OTIgWTE1Ni44MjU0MDgyNzIzMTUgRjMwMFxuRzEgWDk0LjA5ODkwNzI4ODY2ODQ5IFkxNTYuMjY5MjcyNDA1NDg2NSBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkxNTYuMjUxMDUgRjMwMFxuRzEgWDkyLjE2OTQzNzE3ODk0NjkgWTE1Ni42NDUxMDAzMTUwNzM1MyBGMzAwXG5HMSBYOTAuOTU5NzUxMzMxOTg4MDIgWTE1Ny43MzQ5Mzg2MTExODMyOCBGMzAwXG5HMSBYOTAuNDAzNjA3Mjc2NTY0MjcgWTE1OS4yNjUyMjk4MDg4MzcxMiBGMzAwXG5HMSBYOTAuMzg1MzgzIFkxNTkuNjE0OSBGMzAwXG5HMSBYOTAuNzc5NDMyMzc1Nzg3NDUgWTE2MS4xOTQ3MTQwNTUzMzczOSBGMzAwXG5HMSBYOTEuODY5MjY5OTUyNjcyMzcgWTE2Mi40MDQ0MDA1NTAyNjQ3IEYzMDBcbkcxIFg5My4zOTk1NjA4MTk2Njc3NyBZMTYyLjk2MDU0NTUxNTUzMDQ3IEYzMDBcbkcxIFg5My43NDkyNTA5OTk5OTk5OSBZMTYyLjk3ODc3IEYzMDBcbkcxIFg5NS4zMjkwNjMxODEwNDczMyBZMTYyLjU4NDcxMzEwOTkyNjM1IEYzMDBcbkcxIFg5Ni41Mzg3NDQ0OTIyMTQwNSBZMTYxLjQ5NDg2OTc3OTI1MjY0IEYzMDBcbkcxIFg5Ny4wOTQ4ODIxNzg3MzY5NSBZMTU5Ljk2NDU3NjI2NzAwNDQyIEYzMDBcbkcxIFg5Ny4xMTMxMDUgWTE1OS42MTQ4OTk5OTk5OTk5OCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTkwXG5HMCBYMTQ0LjMzNTQ1IFkxNTkuNjE0OVxuRzEgWDE0My45NDEzOTEyMzEzNTMzMiBZMTU4LjAzNTA4ODI4NzUzMTUgRjMwMFxuRzEgWDE0Mi44NTE1NDY0NjIyMzQgWTE1Ni44MjU0MDgyNzIzMTEyNSBGMzAwXG5HMSBYMTQxLjMyMTI1MjI4ODY3NyBZMTU2LjI2OTI3MjQwNTQ3ODgzIEYzMDBcbkcxIFgxNDAuOTcxNiBZMTU2LjI1MTA1IEYzMDBcbkcxIFgxMzkuMzkxNzg1OTQ0NjYyNTMgWTE1Ni42NDUwOTkzNzU3ODY5NCBGMzAwXG5HMSBYMTM4LjE4MjA5OTQ0OTczNDg0IFkxNTcuNzM0OTM2OTUyNjcxNSBGMzAwXG5HMSBYMTM3LjYyNTk1NDQ4NDQ2ODYgWTE1OS4yNjUyMjc4MTk2NjY3IEYzMDBcbkcxIFgxMzcuNjA3NzMwMDAwMDAwMDMgWTE1OS42MTQ5IEYzMDBcbkcxIFgxMzguMDAxNzc5Mzc1Nzg0NzQgWTE2MS4xOTQ3MTQwNTUzMzgwNyBGMzAwXG5HMSBYMTM5LjA5MTYxNjk1MjY2NzU1IFkxNjIuNDA0NDAwNTUwMjY3MjcgRjMwMFxuRzEgWDE0MC42MjE5MDc4MTk2NjIgWTE2Mi45NjA1NDU1MTU1MzU3IEYzMDBcbkcxIFgxNDAuOTcxNiBZMTYyLjk3ODc3IEYzMDBcbkcxIFgxNDIuNTUxNDExNzEyNDY5MDUgWTE2Mi41ODQ3MTEyMzEzNTU1MyBGMzAwXG5HMSBYMTQzLjc2MTA5MTcyNzY5MDg1IFkxNjEuNDk0ODY2NDYyMjM3OTIgRjMwMFxuRzEgWDE0NC4zMTcyMjc1OTQ1MjU0MyBZMTU5Ljk2NDU3MjI4ODY4MTcgRjMwMFxuRzEgWDE0NC4zMzU0NSBZMTU5LjYxNDg5OTk5OTk5OTk4IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOTFcbkcwIFgxOTEuNTU3ODUgWTE1OS42MTQ5XG5HMSBYMTkxLjE2Mzc5MTIzMTM3MzEyIFkxNTguMDM1MDg4Mjg3NTI2NTUgRjMwMFxuRzEgWDE5MC4wNzM5NDY0NjIyNjkgWTE1Ni44MjU0MDgyNzIyOTI2MyBGMzAwXG5HMSBYMTg4LjU0MzY1MjI4ODcxODk2IFkxNTYuMjY5MjcyNDA1NDQxIEYzMDBcbkcxIFgxODguMTk0MDA5OTk5OTk5OTYgWTE1Ni4yNTEwNSBGMzAwXG5HMSBYMTg2LjYxNDE5NDc3MzI0ODkzIFkxNTYuNjQ1MDk0Njc5MzUxODQgRjMwMFxuRzEgWDE4NS40MDQ1MDUwMzg0ODM1NiBZMTU3LjczNDkyODY2MDEwNDU0IEYzMDBcbkcxIFgxODQuODQ4MzU1NTI0MDA3NzYgWTE1OS4yNjUyMTc4NzM3OTg1OCBGMzAwXG5HMSBYMTg0LjgzMDEzIFkxNTkuNjE0OSBGMzAwXG5HMSBYMTg1LjIyNDE3OTM3NTc2MjY1IFkxNjEuMTk0NzE0MDU1MzQzNTUgRjMwMFxuRzEgWDE4Ni4zMTQwMTY5NTI2Mjg1OCBZMTYyLjQwNDQwMDU1MDI4OCBGMzAwXG5HMSBYMTg3Ljg0NDMwNzgxOTYxNTI3IFkxNjIuOTYwNTQ1NTE1NTc3NzYgRjMwMFxuRzEgWDE4OC4xOTQwMSBZMTYyLjk3ODc2OTk5OTk5OTk3IEYzMDBcbkcxIFgxODkuNzczODIwNTQxMDEzNiBZMTYyLjU4NDcwNjUzNDkzMDkgRjMwMFxuRzEgWDE5MC45ODM0OTczMTYzNjU2NiBZMTYxLjQ5NDg1ODE2OTcxMDM3IEYzMDBcbkcxIFgxOTEuNTM5NjI4NjMzOTc1OTIgWTE1OS45NjQ1NjIzNDI4OTM1MiBGMzAwXG5HMSBYMTkxLjU1Nzg1IFkxNTkuNjE0OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTkyXG5HMCBYMjYuMjc5NTk3IFkxMzYuMDAzNzFcbkcxIFgyNS44ODU1NDI5Mjc3NzU2MjggWTEzNC40MjM4OTcxMTYwOTE0NyBGMzAwXG5HMSBYMjQuNzk1NzAxNzU0NzY0NDM3IFkxMzMuMjE0MjEzODYxMDE2MTYgRjMwMFxuRzEgWDIzLjI2NTQwOTIzNDQ3OTUwMiBZMTMyLjY1ODA3MzQ0NDk3IEYzMDBcbkcxIFgyMi45MTU3MzkgWTEzMi42Mzk4NTAwMDAwMDAwMiBGMzAwXG5HMSBYMjEuMzM1OTI2MTE2MDkxNDggWTEzMy4wMzM5MDQwNzIyMjQ0MyBGMzAwXG5HMSBYMjAuMTI2MjQyODYxMDE2MjEgWTEzNC4xMjM3NDUyNDUyMzU2NSBGMzAwXG5HMSBYMTkuNTcwMTAyNDQ0OTcwMTA3IFkxMzUuNjU0MDM3NzY1NTIwNjMgRjMwMFxuRzEgWDE5LjU1MTg3OTAwMDAwMDAwMyBZMTM2LjAwMzcxIEYzMDBcbkcxIFgxOS45NDU5MzMwNzIyMjQ0MjcgWTEzNy41ODM1MjI4ODM5MDg1MyBGMzAwXG5HMSBYMjEuMDM1Nzc0MjQ1MjM1NjYgWTEzOC43OTMyMDYxMzg5ODM4IEYzMDBcbkcxIFgyMi41NjYwNjY3NjU1MjA2MTMgWTEzOS4zNDkzNDY1NTUwMjk5IEYzMDBcbkcxIFgyMi45MTU3MzkgWTEzOS4zNjc1NyBGMzAwXG5HMSBYMjQuNDk1NTUxNjQ5NjIxMzQgWTEzOC45NzM1MTQ5ODg0ODk2OCBGMzAwXG5HMSBYMjUuNzA1MjM0MjU2NzI1NjU3IFkxMzcuODgzNjczMDk2MjU1MTcgRjMwMFxuRzEgWDI2LjI2MTM3Mzc2MjkyODI3NiBZMTM2LjM1MzM4MDI0NTMxNDMgRjMwMFxuRzEgWDI2LjI3OTU5NyBZMTM2LjAwMzcxIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOTNcbkcwIFg3My41MDE5NDIgWTEzNi4wMDM3MVxuRzEgWDczLjEwNzg4NzkyNzc3NTU2IFkxMzQuNDIzODk3MTE2MDkxNSBGMzAwXG5HMSBYNzIuMDE4MDQ2NzU0NzY0MzMgWTEzMy4yMTQyMTM4NjEwMTYyMiBGMzAwXG5HMSBYNzAuNDg3NzU0MjM0NDc5MzggWTEzMi42NTgwNzM0NDQ5NzAxIEYzMDBcbkcxIFg3MC4xMzgwODIgWTEzMi42Mzk4NTAwMDAwMDAwMiBGMzAwXG5HMSBYNjguNTU4MjY5MzUwMzc4NjcgWTEzMy4wMzM5MDUwMTE1MTAzNCBGMzAwXG5HMSBYNjcuMzQ4NTg2NzQzMjc0MzQgWTEzNC4xMjM3NDY5MDM3NDQ4NiBGMzAwXG5HMSBYNjYuNzkyNDQ3MjM3MDcxNzMgWTEzNS42NTQwMzk3NTQ2ODU3MyBGMzAwXG5HMSBYNjYuNzc0MjI0IFkxMzYuMDAzNzEgRjMwMFxuRzEgWDY3LjE2ODI3ODA3MjIyNDM4IFkxMzcuNTgzNTIyODgzOTA4NTYgRjMwMFxuRzEgWDY4LjI1ODExOTI0NTIzNTU2IFkxMzguNzkzMjA2MTM4OTgzODYgRjMwMFxuRzEgWDY5Ljc4ODQxMTc2NTUyMDUgWTEzOS4zNDkzNDY1NTUwMzAwMiBGMzAwXG5HMSBYNzAuMTM4MDgyIFkxMzkuMzY3NTcgRjMwMFxuRzEgWDcxLjcxNzg5NDg4MzkwODUxIFkxMzguOTczNTE1OTI3Nzc1NiBGMzAwXG5HMSBYNzIuOTI3NTc4MTM4OTgzNzkgWTEzNy44ODM2NzQ3NTQ3NjQzNyBGMzAwXG5HMSBYNzMuNDgzNzE4NTU1MDI5OSBZMTM2LjM1MzM4MjIzNDQ3OTQgRjMwMFxuRzEgWDczLjUwMTk0MiBZMTM2LjAwMzcxIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOTRcbkcwIFgxMjAuNzI0MjcgWTEzNi4wMDM3MVxuRzEgWDEyMC4zMzAyMTU5Mjc3NzU1NyBZMTM0LjQyMzg5NzExNjA5MTUgRjMwMFxuRzEgWDExOS4yNDAzNzQ3NTQ3NjQzMyBZMTMzLjIxNDIxMzg2MTAxNjIyIEYzMDBcbkcxIFgxMTcuNzEwMDgyMjM0NDc5MzkgWTEzMi42NTgwNzM0NDQ5NzAxIEYzMDBcbkcxIFgxMTcuMzYwNDEgWTEzMi42Mzk4NTAwMDAwMDAwMiBGMzAwXG5HMSBYMTE1Ljc4MDU5NzExNjA5MTQ5IFkxMzMuMDMzOTA0MDcyMjI0NDMgRjMwMFxuRzEgWDExNC41NzA5MTM4NjEwMTYyMSBZMTM0LjEyMzc0NTI0NTIzNTY1IEYzMDBcbkcxIFgxMTQuMDE0NzczNDQ0OTcwMSBZMTM1LjY1NDAzNzc2NTUyMDYzIEYzMDBcbkcxIFgxMTMuOTk2NTUgWTEzNi4wMDM3MSBGMzAwXG5HMSBYMTE0LjM5MDYwNDA3MjIyNDQzIFkxMzcuNTgzNTIyODgzOTA4NTMgRjMwMFxuRzEgWDExNS40ODA0NDUyNDUyMzU2NiBZMTM4Ljc5MzIwNjEzODk4MzggRjMwMFxuRzEgWDExNy4wMTA3Mzc3NjU1MjA2MiBZMTM5LjM0OTM0NjU1NTAyOTkgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTM5LjM2NzU3IEYzMDBcbkcxIFgxMTguOTQwMjIyODgzOTA4NTIgWTEzOC45NzM1MTU5Mjc3NzU2IEYzMDBcbkcxIFgxMjAuMTQ5OTA2MTM4OTgzOCBZMTM3Ljg4MzY3NDc1NDc2NDM3IEYzMDBcbkcxIFgxMjAuNzA2MDQ2NTU1MDI5OSBZMTM2LjM1MzM4MjIzNDQ3OTQgRjMwMFxuRzEgWDEyMC43MjQyNyBZMTM2LjAwMzcxIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOTVcbkcwIFgxNjcuOTQ2NjcgWTEzNi4wMDM3MVxuRzEgWDE2Ny41NTI2MTU5Mjc4MDU3NiBZMTM0LjQyMzg5NzExNjA4Mzk2IEYzMDBcbkcxIFgxNjYuNDYyNzc0NzU0ODE3NjIgWTEzMy4yMTQyMTM4NjA5ODc4OCBGMzAwXG5HMSBYMTY0LjkzMjQ4MjIzNDU0MzI3IFkxMzIuNjU4MDczNDQ0OTEyNiBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkxMzIuNjM5ODUwMDAwMDAwMDIgRjMwMFxuRzEgWDE2My4wMDI5NzgyODc1MzI5NSBZMTMzLjAzMzkwODc2ODY1MjU3IEYzMDBcbkcxIFgxNjEuNzkzMjk4MjcyMzE2NzUgWTEzNC4xMjM3NTM1Mzc3NzYzNyBGMzAwXG5HMSBYMTYxLjIzNzE2MjQwNTQ5IFkxMzUuNjU0MDQ3NzExMzM1NDQgRjMwMFxuRzEgWDE2MS4yMTg5NCBZMTM2LjAwMzcxIEYzMDBcbkcxIFgxNjEuNjEyOTk0MDcyMjE4NTYgWTEzNy41ODM1MjI4ODM5MSBGMzAwXG5HMSBYMTYyLjcwMjgzNTI0NTIyNTMgWTEzOC43OTMyMDYxMzg5ODkzMiBGMzAwXG5HMSBYMTY0LjIzMzEyNzc2NTUwODIgWTEzOS4zNDkzNDY1NTUwNDEwOCBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkxMzkuMzY3NTcgRjMwMFxuRzEgWDE2Ni4xNjI2MDUyMjY3NDk2MyBZMTM4Ljk3MzUyNTMyMDY0MjMgRjMwMFxuRzEgWDE2Ny4zNzIyOTQ5NjE1MTA5NiBZMTM3Ljg4MzY5MTMzOTg4NTEgRjMwMFxuRzEgWDE2Ny45Mjg0NDQ0NzU5ODEwOCBZMTM2LjM1MzQwMjEyNjE4OSBGMzAwXG5HMSBYMTY3Ljk0NjY3IFkxMzYuMDAzNzEgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU5NlxuRzAgWDQ5Ljg5MDc3NSBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYNDkuNDk2NzIwOTI3Nzc1NjMgWTExMC44MTI2OTcxMTYwOTE0NCBGMzAwXG5HMSBYNDguNDA2ODc5NzU0NzY0NDMgWTEwOS42MDMwMTM4NjEwMTYxNCBGMzAwXG5HMSBYNDYuODc2NTg3MjM0NDc5NSBZMTA5LjA0Njg3MzQ0NDk2OTk5IEYzMDBcbkcxIFg0Ni41MjY5MTcgWTEwOS4wMjg2NSBGMzAwXG5HMSBYNDQuOTQ3MTA0MTE2MDkxNDggWTEwOS40MjI3MDQwNzIyMjQ0MiBGMzAwXG5HMSBYNDMuNzM3NDIwODYxMDE2MjA0IFkxMTAuNTEyNTQ1MjQ1MjM1NjQgRjMwMFxuRzEgWDQzLjE4MTI4MDQ0NDk3MDEgWTExMi4wNDI4Mzc3NjU1MjA2IEYzMDBcbkcxIFg0My4xNjMwNTY5OTk5OTk5OTUgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwXG5HMSBYNDMuNTU3MTExMDcyMjI0NDIgWTExMy45NzIzMjI4ODM5MDg1IEYzMDBcbkcxIFg0NC42NDY5NTIyNDUyMzU2NSBZMTE1LjE4MjAwNjEzODk4Mzc3IEYzMDBcbkcxIFg0Ni4xNzcyNDQ3NjU1MjA2MSBZMTE1LjczODE0NjU1NTAyOTg3IEYzMDBcbkcxIFg0Ni41MjY5MTcgWTExNS43NTYzNjk5OTk5OTk5OCBGMzAwXG5HMSBYNDguMTA2NzI5NjQ5NjIxMzM2IFkxMTUuMzYyMzE0OTg4NDg5NjYgRjMwMFxuRzEgWDQ5LjMxNjQxMjI1NjcyNTY1NiBZMTE0LjI3MjQ3MzA5NjI1NTE0IEYzMDBcbkcxIFg0OS44NzI1NTE3NjI5MjgyNyBZMTEyLjc0MjE4MDI0NTMxNDI3IEYzMDBcbkcxIFg0OS44OTA3NzUgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTk3XG5HMCBYOTcuMTEzMTA1IFkxMTIuMzkyNTA5OTk5OTk5OTlcbkcxIFg5Ni43MTkwNTA5Mjc3Nzc0MiBZMTEwLjgxMjY5NzExNjA5MTAyIEYzMDBcbkcxIFg5NS42MjkyMDk3NTQ3Njc2IFkxMDkuNjAzMDEzODYxMDE0NDcgRjMwMFxuRzEgWDk0LjA5ODkxNzIzNDQ4MzMgWTEwOS4wNDY4NzM0NDQ5NjY2IEYzMDBcbkcxIFg5My43NDkyNTEgWTEwOS4wMjg2NSBGMzAwXG5HMSBYOTIuMTY5NDM3MTc4OTQ4MzYgWTEwOS40MjI3MDAzMTUwNzk0MSBGMzAwXG5HMSBYOTAuOTU5NzUxMzMxOTkzNTMgWTExMC41MTI1Mzg2MTExOTM2NSBGMzAwXG5HMSBYOTAuNDAzNjA3Mjc2NTc1NDYgWTExMi4wNDI4Mjk4MDg4NDk1NiBGMzAwXG5HMSBYOTAuMzg1MzgzIFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMFxuRzEgWDkwLjc3OTQzNzA3MjIxOTA3IFkxMTMuOTcyMzIyODgzOTA5ODQgRjMwMFxuRzEgWDkxLjg2OTI3ODI0NTIyNjIgWTExNS4xODIwMDYxMzg5ODg4MSBGMzAwXG5HMSBYOTMuMzk5NTcwNzY1NTA5MjcgWTExNS43MzgxNDY1NTUwNDAwOSBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkxMTUuNzU2MzY5OTk5OTk5OTggRjMwMFxuRzEgWDk1LjMyOTA2MzE4MTA0NTMgWTExNS4zNjIzMTMxMDk5MTgyNiBGMzAwXG5HMSBYOTYuNTM4NzQ0NDkyMjA2NDIgWTExNC4yNzI0Njk3NzkyMzgzNCBGMzAwXG5HMSBYOTcuMDk0ODgyMTc4NzIxNDkgWTExMi43NDIxNzYyNjY5ODcyNyBGMzAwXG5HMSBYOTcuMTEzMTA1IFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU5OFxuRzAgWDE0NC4zMzU0NSBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYMTQzLjk0MTM5NTkyNzc4MTQ2IFkxMTAuODEyNjk3MTE2MDkgRjMwMFxuRzEgWDE0Mi44NTE1NTQ3NTQ3NzQ3MiBZMTA5LjYwMzAxMzg2MTAxMDY4IEYzMDBcbkcxIFgxNDEuMzIxMjYyMjM0NDkxODMgWTEwOS4wNDY4NzM0NDQ5NTg5IEYzMDBcbkcxIFgxNDAuOTcxNiBZMTA5LjAyODY1IEYzMDBcbkcxIFgxMzkuMzkxNzg1OTQ0NjYzOTggWTEwOS40MjI2OTkzNzU3OTI4IEYzMDBcbkcxIFgxMzguMTgyMDk5NDQ5NzQwMzIgWTExMC41MTI1MzY5NTI2ODE4MyBGMzAwXG5HMSBYMTM3LjYyNTk1NDQ4NDQ3OTc2IFkxMTIuMDQyODI3ODE5Njc5MTIgRjMwMFxuRzEgWDEzNy42MDc3MzAwMDAwMDAwMyBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDBcbkcxIFgxMzguMDAxNzg0MDcyMjE2MzQgWTExMy45NzIzMjI4ODM5MTA1NCBGMzAwXG5HMSBYMTM5LjA5MTYyNTI0NTIyMTQgWTExNS4xODIwMDYxMzg5OTEzOCBGMzAwXG5HMSBYMTQwLjYyMTkxNzc2NTUwMzUgWTExNS43MzgxNDY1NTUwNDUzMyBGMzAwXG5HMSBYMTQwLjk3MTYwMDAwMDAwMDAyIFkxMTUuNzU2MzY5OTk5OTk5OTggRjMwMFxuRzEgWDE0Mi41NTE0MTE3MTI0NjcwNiBZMTE1LjM2MjMxMTIzMTM0NzQzIEYzMDBcbkcxIFgxNDMuNzYxMDkxNzI3NjgzMjcgWTExNC4yNzI0NjY0NjIyMjM2MyBGMzAwXG5HMSBYMTQ0LjMxNzIyNzU5NDUxIFkxMTIuNzQyMTcyMjg4NjY0NTUgRjMwMFxuRzEgWDE0NC4zMzU0NSBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOTlcbkcwIFgxOTEuNTU3ODUgWTExMi4zOTI1MDk5OTk5OTk5OVxuRzEgWDE5MS4xNjM3OTU5Mjc4MDEyMyBZMTEwLjgxMjY5NzExNjA4NTA2IEYzMDBcbkcxIFgxOTAuMDczOTU0NzU0ODA5NjggWTEwOS42MDMwMTM4NjA5OTIwNiBGMzAwXG5HMSBYMTg4LjU0MzY2MjIzNDUzMzc3IFkxMDkuMDQ2ODczNDQ0OTIxMDkgRjMwMFxuRzEgWDE4OC4xOTQwMDk5OTk5OTk5NiBZMTA5LjAyODY1IEYzMDBcbkcxIFgxODYuNjE0MTk0NzczMjUwMzggWTEwOS40MjI2OTQ2NzkzNTc3IEYzMDBcbkcxIFgxODUuNDA0NTA1MDM4NDg5MDUgWTExMC41MTI1Mjg2NjAxMTQ5IEYzMDBcbkcxIFgxODQuODQ4MzU1NTI0MDE4OTMgWTExMi4wNDI4MTc4NzM4MTEgRjMwMFxuRzEgWDE4NC44MzAxMyBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDBcbkcxIFgxODUuMjI0MTg0MDcyMTk0MjUgWTExMy45NzIzMjI4ODM5MTYwNCBGMzAwXG5HMSBYMTg2LjMxNDAyNTI0NTE4MjQgWTExNS4xODIwMDYxMzkwMTIxIEYzMDBcbkcxIFgxODcuODQ0MzE3NzY1NDU2NzQgWTExNS43MzgxNDY1NTUwODc0MSBGMzAwXG5HMSBYMTg4LjE5NDAxIFkxMTUuNzU2MzY5OTk5OTk5OTggRjMwMFxuRzEgWDE4OS43NzM4MjA1NDEwMTE1NiBZMTE1LjM2MjMwNjUzNDkyMjc4IEYzMDBcbkcxIFgxOTAuOTgzNDk3MzE2MzU4MDQgWTExNC4yNzI0NTgxNjk2OTYwNCBGMzAwXG5HMSBYMTkxLjUzOTYyODYzMzk2MDQ2IFkxMTIuNzQyMTYyMzQyODc2MzQgRjMwMFxuRzEgWDE5MS41NTc4NDk5OTk5OTk5NyBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDBcbk0yXG5gXG5cbnZhciBleGFtcGxlcyA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdzdGFyJyxcbiAgICAgICAgZ2NvZGU6IFNUQVIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdjaXJjbGVzJyxcbiAgICAgICAgZ2NvZGU6IENJUkNMRVMsXG4gICAgfSxcbl1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXYpID0+IHtcbiAgICB2YXIgc3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGFtcGxlcy1ob2xkZXInKVxuICAgIHZhciBmaXJzdCA9IHRydWVcbiAgICBleGFtcGxlcy5mb3JFYWNoKChleGFtcGxlKSA9PiB7XG4gICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG5cbiAgICAgICAgYS5pbm5lclRleHQgPSBleGFtcGxlLm5hbWVcbiAgICAgICAgYS5ocmVmID0gXCIjXCJcbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2djb2RlJykudmFsdWUgPSBleGFtcGxlLmdjb2RlXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKGV4YW1wbGUubmFtZSwgYSlcbiAgICAgICAgaWYgKCFmaXJzdCkge1xuICAgICAgICAgICAgc3Bhbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIHwgJykpXG4gICAgICAgIH1cbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgICBzcGFuLmFwcGVuZENoaWxkKGEpXG4gICAgfSlcbn0pIiwiaW1wb3J0IEludGVycHJldGVyIGZyb20gJ2djb2RlLWludGVycHJldGVyJ1xyXG5cclxuY2xhc3MgUGxvdHRlciB7XHJcbiAgICAvKiogQHR5cGV7SFRNTENhbnZhc0VsZW1lbnR9ICovXHJcbiAgICBjYW52YXM7XHJcbiAgICAvKiogQHR5cGV7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSAqL1xyXG4gICAgY3R4O1xyXG5cclxuICAgIHg7XHJcbiAgICB5O1xyXG5cclxuICAgIHV2ZWwgPSAwO1xyXG4gICAgdnZlbCA9IDA7XHJcblxyXG4gICAgbWFjaGluZVdpZHRoID0gMTAwO1xyXG4gICAgdSA9IDc1O1xyXG4gICAgdiA9IDc1O1xyXG5cclxuICAgIHBlbkRvd24gPSB0cnVlO1xyXG4gICAgcGVuQ29sb3IgPSAnIzAwMDAwMCc7XHJcblxyXG4gICAgY29tbWFuZFF1ZXVlID0gW107XHJcblxyXG4gICAgcnVubmluZyA9IGZhbHNlO1xyXG5cclxuICAgIHBwaSA9IDE7XHJcbiAgICBmZWVkUmF0ZVNjYWxlID0gMS4wO1xyXG5cclxuICAgIC8vIG1heCBtcyBiZXR3ZWVuIHVwZGF0ZXNcclxuICAgIG1heFByb2Nlc3NEZWx0YSA9IDc1O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhc0lkLCBtYWNoaW5lV2lkdGgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhc0lkKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cclxuICAgICAgICB0aGlzLnBsb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLnBsb3Qud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcclxuICAgICAgICB0aGlzLnBsb3QuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMucGxvdEN0eCA9IHRoaXMucGxvdC5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICB0aGlzLm1hY2hpbmVXaWR0aCA9IG1hY2hpbmVXaWR0aDtcclxuICAgICAgICB0aGlzLnUgPSB0aGlzLm1hY2hpbmVXaWR0aCAvIDIuMCArIDEwO1xyXG4gICAgICAgIHRoaXMudiA9IHRoaXMudTtcclxuXHJcbiAgICAgICAgdGhpcy5waHlzZHQgPSAxMDAwLjAgLyAyNDAuMDtcclxuICAgICAgICB0aGlzLmxhc3RUID0gcGVyZm9ybWFuY2Uubm93KClcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KCkge1xyXG4gICAgICAgIHZhciBjdHggPSB0aGlzLmN0eDtcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpXHJcblxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5wbG90LCAwLCAwKTtcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbygwLDApO1xyXG4gICAgICAgIGN0eC5saW5lVG8odGhpcy54LHRoaXMueSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh0aGlzLm1hY2hpbmVXaWR0aCwgMCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICBjdHguZmlsbFJlY3QodGhpcy54LTIsIHRoaXMueS0yLCA0LCA0KTtcclxuXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiKHUsIHYpID0gKFwiICsgTWF0aC5yb3VuZCh0aGlzLnUpICsgXCIsIFwiICsgTWF0aC5yb3VuZCh0aGlzLnYpICsgXCIpXCIsIDE3MCwgMjApXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiKHgsIHkpID0gKFwiICsgTWF0aC5yb3VuZCh0aGlzLngpICsgXCIsIFwiICsgTWF0aC5yb3VuZCh0aGlzLnkpICsgXCIpXCIsIDE3MCwgNDApXHJcbiAgICB9XHJcblxyXG4gICAgcHJvY2Vzcyh0KSB7XHJcbiAgICAgICAgdmFyIGR0ID0gdCAtIHRoaXMubGFzdFQ7XHJcblxyXG4gICAgICAgIGlmIChkdCA+IHRoaXMubWF4UHJvY2Vzc0RlbHRhKSB7XHJcbiAgICAgICAgICAgIC8vIEFzc3VtZSB0aGUgcGFnZSB3YXMgb2ZmLXNjcmVlbi5cclxuICAgICAgICAgICAgLy8gU2tpcCBhbmQgc3RhcnQgYWdhaW4gb24gbmV4dCBmcmFtZS5cclxuICAgICAgICAgICAgdGhpcy5sYXN0VCA9IHQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbG90Q3R4LnN0cm9rZVN0eWxlID0gdGhpcy5wZW5Db2xvclxyXG4gICAgICAgIHRoaXMucGxvdEN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLnBsb3RDdHgubW92ZVRvKHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICB3aGlsZSAoZHQgPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBzdGVwID0gTWF0aC5taW4oZHQsIHRoaXMucGh5c2R0KTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGh5c2ljcyhzdGVwKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ29tbWFuZCh0KTtcclxuICAgICAgICAgICAgZHQgLT0gc3RlcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbG90Q3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0VCA9IHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICAgIHhcclxuICAgICAgICArLS0tLXwtLS0tLS0tLS0rXHJcbiAgICAgICAgfFxcICAgICAgICAgICBfL1xyXG4gICAgICAgIHwgXFwgdSAgICAgIF8vXHJcbiAgICAgIHkgfCAgXFwgICAgIF8vICAgdlxyXG4gICAgICAgIHwgICBcXCAgXy9cclxuICAgICAgICB8ICAgIFxcL1xyXG4gICAgICAgICBcclxuICAgICAgICB1XjIgPSB4XjIgKyB5XjJcclxuICAgICAgICB2XjIgPSAoVyAtIHgpXjIgKyB5XjIgPSB4XjIgKyB5XjIgKyBXXjIgLSAyV3hcclxuXHJcbiAgICAgICAgdl4yIC0gdV4yID0gV14yIC0gMld4XHJcbiAgICAgICAgeCA9IChXXjIgLSB2XjIgKyB1XjIpLzJXXHJcbiAgICAgICAgeSA9IHNxcnQodV4yIC0geF4yKVxyXG4gICAgICAgICovXHJcbiAgICB1djJ4eSh1LCB2KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1hY2hpbmVXaWR0aDtcclxuICAgICAgICB2YXIgeCA9IChtKm0gKyB1KnUgLSB2KnYpIC8gKDIqbSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogTWF0aC5zcXJ0KHUqdSAtIHgqeCksXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHh5MnV2KHgseSkge1xyXG4gICAgICAgIHZhciBtID0gdGhpcy5tYWNoaW5lV2lkdGg7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdTogTWF0aC5zcXJ0KHgqeCArIHkqeSksXHJcbiAgICAgICAgICAgIHY6IE1hdGguc3FydCgobS14KSoobS14KSArIHkqeSksXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm9jZXNzUGh5c2ljcyhkdCkge1xyXG4gICAgICAgIHRoaXMudSArPSB0aGlzLnV2ZWwgKiBkdDtcclxuICAgICAgICB0aGlzLnYgKz0gdGhpcy52dmVsICogZHQ7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IENoZWNrIGNvbnN0cmFpbnRzIGZvciBwaHlzaWNhbGl0eS5cclxuXHJcbiAgICAgICAgdGhpcy54ID0gKHRoaXMubWFjaGluZVdpZHRoICogdGhpcy5tYWNoaW5lV2lkdGggKyB0aGlzLnUqdGhpcy51IC0gdGhpcy52KnRoaXMudikgLyAoMiAqIHRoaXMubWFjaGluZVdpZHRoKTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLnNxcnQodGhpcy51ICogdGhpcy51IC0gdGhpcy54ICogdGhpcy54KVxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5tYWNoaW5lV2lkdGgsIHRoaXMueCwgdGhpcy55KVxyXG4gICAgICAgIGlmICh0aGlzLnBlbkRvd24pIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90Q3R4LmxpbmVUbyh0aGlzLngsIHRoaXMueSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3RDdHgubW92ZVRvKHRoaXMueCwgdGhpcy55KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm9jZXNzQ29tbWFuZCh0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZFF1ZXVlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNtZCA9IHRoaXMuY29tbWFuZFF1ZXVlLnNoaWZ0KClcclxuICAgICAgICB2YXIgY21kcyA9IGNtZC5wcm9jZXNzKHRoaXMsIHQpO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gY21kcy5jb25jYXQodGhpcy5jb21tYW5kUXVldWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIGZyYW1lKHQpIHtcclxuICAgICAgICAgICAgc2VsZi5wcm9jZXNzKHQpXHJcbiAgICAgICAgICAgIGlmIChzZWxmLnJ1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbnF1ZXVlQ29tbWFuZChjbWQpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKGNtZClcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IFtdXHJcbiAgICAgICAgdGhpcy51ID0gdGhpcy52ID0gdGhpcy5tYWNoaW5lV2lkdGggLyAyLjAgKyAxMDtcclxuICAgICAgICB0aGlzLnV2ZWwgPSB0aGlzLnZ2ZWwgPSAwO1xyXG4gICAgICAgIHRoaXMucGVuRG93biA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGxvdEN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wbG90LndpZHRoLCB0aGlzLnBsb3QuaGVpZ2h0KVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBNb3ZlIGZyb20gY3VycmVudCBwb3NpdGlvbiB0byBwcm92aWRlZCBwb2xhciBjb29yZGluYXRlcyBvdmVyIHNvbWUgZHVyYXRpb24uXHJcbi8vIENvbnRyb2xzIHRoZSBwbG90dGVycyAnbW90b3JzJyAodXZlbCwgdnZlbCkgYW5kIHdhaXRzIGZvciB0aGUgZHVyYXRpb24uXHJcbmNsYXNzIE1vdmVDb21tYW5kIHtcclxuICAgIGNvbnN0cnVjdG9yKHUsIHYsIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy51ID0gdVxyXG4gICAgICAgIHRoaXMudiA9IHZcclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb25cclxuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFByb2Nlc3MgaGFuZGxlcyB0aGUgY29tbWFuZCBhbmQgcmV0dXJucyBhIGxpc3Qgb2YgY29tbWFuZHMgdGhhdCByZXBsYWNlIGl0LlxyXG4gICAgcHJvY2VzcyhwbG90dGVyLCB0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWFkbGluZSA9IHQgKyB0aGlzLmR1cmF0aW9uXHJcbiAgICAgICAgICAgIHBsb3R0ZXIudXZlbCA9ICh0aGlzLnUgLSBwbG90dGVyLnUpIC8gdGhpcy5kdXJhdGlvblxyXG4gICAgICAgICAgICBwbG90dGVyLnZ2ZWwgPSAodGhpcy52IC0gcGxvdHRlci52KSAvIHRoaXMuZHVyYXRpb25cclxuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0ID49IHRoaXMuZGVhZGxpbmUpIHtcclxuICAgICAgICAgICAgICAgIHBsb3R0ZXIudXZlbCA9IDA7XHJcbiAgICAgICAgICAgICAgICBwbG90dGVyLnZ2ZWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQWRqdXN0IGZvciBkcmlmdFxyXG4gICAgICAgICAgICAgICAgcGxvdHRlci51dmVsID0gKHRoaXMudSAtIHBsb3R0ZXIudSkgLyAodGhpcy5kZWFkbGluZSAtIHQpXHJcbiAgICAgICAgICAgICAgICBwbG90dGVyLnZ2ZWwgPSAodGhpcy52IC0gcGxvdHRlci52KSAvICh0aGlzLmRlYWRsaW5lIC0gdClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3RoaXNdO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBNYXhpbXVtIGRpc3RhbmNlIHRvIG1vdmUgaW4gb25lIGFyY1xyXG52YXIgbWF4TW92ZSA9IDU7XHJcblxyXG4vLyBNb3ZlIGZyb20gY3VycmVudCBwb3NpdGlvbiB0byBwcm92aWRlZCBjYXJ0ZXNpYW4gcG9zaXRpb24gYXQgc29tZSBzcGVlZC5cclxuLy8gVGhpcyBzaW1wbHkgcmVwbGFjZXMgaXRzZWxmIGJ5IGEgc2VyaWVzIG9mIHBvbGFyIG1vdmVzIHNtYWxsIGVub3VnaCB0byBoYXZlIG5lZ2xpZ2libGUgYXJjcy5cclxuLy8gU2VlIENNb3ZlQ29tbWFuZCBpbnN0ZWFkLlxyXG5jbGFzcyBDTW92ZUNvbW1hbmRQaWVjZVdpc2Uge1xyXG4gICAgZGVmYXVsdFNwZWVkID0gMC4yIC8vIHBpeGVscyBwZXIgbXNcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBzcGVlZCkge1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkIHx8IHRoaXMuZGVmYXVsdFNwZWVkXHJcbiAgICB9XHJcblxyXG4gICAgcHJvY2VzcyhwbG90dGVyLCB0KSB7XHJcbiAgICAgICAgdmFyIGR4ID0gdGhpcy54IC0gcGxvdHRlci54O1xyXG4gICAgICAgIHZhciBkeSA9IHRoaXMueSAtIHBsb3R0ZXIueTtcclxuXHJcbiAgICAgICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoZHgqZHgrZHkqZHkpXHJcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gZGlzdCAvIHRoaXMuc3BlZWRcclxuICAgICAgICB2YXIgZGVsdGEgPSBNYXRoLnNxcnQoZHgqZHgrZHkqZHkpO1xyXG4gICAgICAgIHZhciBzdGVwcyA9IE1hdGguY2VpbChkZWx0YSAvIG1heE1vdmUpO1xyXG4gICAgICAgIHZhciBjbWRzID0gW11cclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBzdGVwczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gcGxvdHRlci54ICsgaSAqIGR4IC8gc3RlcHNcclxuICAgICAgICAgICAgdmFyIHkgPSBwbG90dGVyLnkgKyBpICogZHkgLyBzdGVwc1xyXG4gICAgICAgICAgICB2YXIgdXYgPSBwbG90dGVyLnh5MnV2KHgsIHkpO1xyXG4gICAgICAgICAgICBjbWRzLnB1c2gobmV3IE1vdmVDb21tYW5kKHV2LnUsIHV2LnYsIGR1cmF0aW9uIC8gc3RlcHMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNtZHM7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEEgY2FydGVzaWFuIG1vdmUgY29tbWFuZC5cclxuLy8gQ2FsY3VsYXRlcyBjYXJ0ZXNpYW4gdmVsb2NpdHkgYW5kIHRyYW5zZm9ybXMgdG8gJ3BvbGFyJyBjb29yZHMuXHJcbmNsYXNzIENNb3ZlQ29tbWFuZCB7XHJcbiAgICBkZWZhdWx0U3BlZWQgPSAwLjJcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBzcGVlZCwgYWJzb2x1dGUpIHtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZCB8fCB0aGlzLmRlZmF1bHRTcGVlZFxyXG4gICAgICAgIHRoaXMuYWJzb2x1dGUgPSBhYnNvbHV0ZVxyXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgcHJvY2VzcyhwbG90dGVyLCB0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgLy8gQ29udmVydCB0byBhYnNvbHV0ZSBjb29yZHMgYW5kIGhhbmRsZSBzY2FsaW5nLlxyXG4gICAgICAgICAgICBpZiAodGhpcy5hYnNvbHV0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gKHRoaXMueCAqIHBsb3R0ZXIucHBpKSB8fCBwbG90dGVyLnhcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9ICh0aGlzLnkgKiBwbG90dGVyLnBwaSkgfHwgcGxvdHRlci55XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBwbG90dGVyLnggKyAoKHRoaXMueCAqIHBsb3R0ZXIucHBpKSB8fCAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy55ID0gcGxvdHRlci55ICsgKCh0aGlzLnkgKiBwbG90dGVyLnBwaSkgfHwgMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGR4ID0gdGhpcy54IC0gcGxvdHRlci54XHJcbiAgICAgICAgdmFyIGR5ID0gdGhpcy55IC0gcGxvdHRlci55XHJcbiAgICAgICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSlcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLmRlYWRsaW5lID0gdCArIChkaXN0IC8gdGhpcy5zcGVlZClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHQgPj0gdGhpcy5kZWFkbGluZSkge1xyXG4gICAgICAgICAgICBwbG90dGVyLnV2ZWwgPSAwXHJcbiAgICAgICAgICAgIHBsb3R0ZXIudnZlbCA9IDBcclxuICAgICAgICAgICAgLy8gdmFyIGVycnggPSAgcGxvdHRlci54IC0gdGhpcy54XHJcbiAgICAgICAgICAgIC8vIHZhciBlcnJ5ID0gcGxvdHRlci55IC0gdGhpcy55IFxyXG4gICAgICAgICAgICAvLyB2YXIgZXJyID0gTWF0aC5zcXJ0KGVycngqZXJyeCArIGVycnkqZXJyeSlcclxuICAgICAgICAgICAgcmV0dXJuIFtdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICBDb29yZCB0cmFuc2Zvcm0gKEphY29iaWFuIG1hdHJpeCk6XHJcblxyXG4gICAgICAgICAgICB1XjIgPSB4XjIgKyB5XjJcclxuICAgICAgICAgICAgdl4yID0gKFcgLSB4KV4yICsgeV4yID0geF4yICsgeV4yICsgV14yIC0gMld4XHJcblxyXG4gICAgICAgICAgICAyIHUgZHUgPSAyeCBkeCArIDIgeSBkeVxyXG4gICAgICAgICAgICBkdSA9ICh4L3UpZHggKyAoeS91KWR5XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAyIHYgZHYgPSAyKHgtVykgZHggKyAyeSBkeVxyXG4gICAgICAgICAgICBkdiA9ICgoeC1XKS92KWR4ICsgKHkvdilkeVxyXG4gICAgICAgICovXHJcbiAgICAgICAgdmFyIGR1ID0gZHggKiBwbG90dGVyLnggLyBwbG90dGVyLnUgKyBkeSAqIHBsb3R0ZXIueSAvIHBsb3R0ZXIudVxyXG4gICAgICAgIHZhciBkdiA9IGR4ICogKHBsb3R0ZXIueCAtIHBsb3R0ZXIubWFjaGluZVdpZHRoKS9wbG90dGVyLnYgKyBkeSAqIHBsb3R0ZXIueSAvIHBsb3R0ZXIudlxyXG4gICAgICAgIFxyXG4gICAgICAgIHBsb3R0ZXIudXZlbCA9IHRoaXMuc3BlZWQgKiBkdSAvIGRpc3RcclxuICAgICAgICBwbG90dGVyLnZ2ZWwgPSB0aGlzLnNwZWVkICogZHYgLyBkaXN0XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQZW5Db21tYW5kIHtcclxuICAgIGNvbnN0cnVjdG9yKHBlbkRvd24pIHtcclxuICAgICAgICB0aGlzLnBlbkRvd24gPSBwZW5Eb3duXHJcbiAgICB9XHJcblxyXG4gICAgcHJvY2VzcyhwbG90dGVyLCB0KSB7XHJcbiAgICAgICAgcGxvdHRlci5wZW5Eb3duID0gdGhpcy5wZW5Eb3duXHJcbiAgICAgICAgcmV0dXJuIFtdXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VJbnRlcnByZXRlcihwbG90dGVyKSB7XHJcbiAgICB2YXIgYWJzb2x1dGUgPSB0cnVlXHJcblxyXG4gICAgY29uc3QgaGFuZGxlcnMgPSB7XHJcbiAgICAgICAgJ0cwJzogKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICBwbG90dGVyLmVucXVldWVDb21tYW5kKG5ldyBQZW5Db21tYW5kKGZhbHNlKSlcclxuICAgICAgICAgICAgcGxvdHRlci5lbnF1ZXVlQ29tbWFuZChuZXcgQ01vdmVDb21tYW5kKHBhcmFtcy5YLCBwYXJhbXMuWSwgMCwgYWJzb2x1dGUpKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ0cxJzogKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICBwbG90dGVyLmVucXVldWVDb21tYW5kKG5ldyBQZW5Db21tYW5kKHRydWUpKVxyXG4gICAgICAgICAgICBwbG90dGVyLmVucXVldWVDb21tYW5kKG5ldyBDTW92ZUNvbW1hbmQocGFyYW1zLlgsIHBhcmFtcy5ZLCBwYXJhbXMuRi82MDAwMC4wKnBsb3R0ZXIuZmVlZFJhdGVTY2FsZSwgYWJzb2x1dGUpKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ0c5MCc6IChwYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgYWJzb2x1dGUgPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ0c5MSc6IChwYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgYWJzb2x1dGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgZ2kgPSBuZXcgSW50ZXJwcmV0ZXIoe1xyXG4gICAgICAgIGhhbmRsZXJzOiBoYW5kbGVycyxcclxuICAgICAgICBkZWZhdWx0SGFuZGxlcjogKGNtZCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5oYW5kbGVkIGNvbW1hbmRcIiwgY21kLCBwYXJhbXMpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBnaTtcclxufVxyXG5cclxuLy8gTWFpbiBlbnRyeSBwb2ludC5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuICAgIHZhciBwID0gbmV3IFBsb3R0ZXIoJ2NhbnZhcycsIDQwMCk7XHJcbiAgICB2YXIgaW50ZXJwID0gbWFrZUludGVycHJldGVyKHApXHJcbiAgICBwLnJ1bigpO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQtZ2NvZGUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xyXG4gICAgICAgIHZhciBnY29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnY29kZScpLnZhbHVlXHJcbiAgICAgICAgLy92YXIgbWF4QXJjU3RlcCA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21heC1hcmMtc3RlcCcpLnZhbHVlKSB8fCA1XHJcbiAgICAgICAgdmFyIGZlZWRSYXRlU2NhbGUgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmZWVkLXJhdGUtc2NhbGUnKS52YWx1ZSkgfHwgMjBcclxuICAgICAgICB2YXIgcHBpID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGl4ZWxzLXBlci1pbmNoJykudmFsdWUpIHx8IDFcclxuICAgICAgICB2YXIgcGVuQ29sb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGVuLWNvbG9yJykudmFsdWUgfHwgJyMwMDAwMDAnO1xyXG5cclxuICAgICAgICBwbG90dGVyLnBwaSA9IHBwaVxyXG4gICAgICAgIHBsb3R0ZXIuZmVlZFJhdGVTY2FsZSA9IGZlZWRSYXRlU2NhbGVcclxuICAgICAgICBwbG90dGVyLnBlbkNvbG9yID0gcGVuQ29sb3JcclxuICAgICAgICBpbnRlcnAubG9hZEZyb21TdHJpbmcoZ2NvZGUsIChlcnIsIHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdlbmQnLCAocmVzdWx0cykgPT4ge1xyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xyXG4gICAgICAgIHAucmVzZXQoKVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gZm9yIGRlYnVnZ2luZyAvIGludGVyYWN0aXZpdHlcclxuICAgIHdpbmRvdy5wbG90dGVyID0gcFxyXG59KSIsIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyIsIi8qIChpZ25vcmVkKSAqLyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBwcm9jZXNzIGZyb20gJ3Byb2Nlc3MvYnJvd3NlcidcbndpbmRvdy5wcm9jZXNzID0gcHJvY2Vzc1xuXG5pbXBvcnQgYnVmZmVyIGZyb20gJ2J1ZmZlcidcbndpbmRvdy5CdWZmZXIgPSBidWZmZXIuQnVmZmVyXG5cbmltcG9ydCAnLi9wb2xhci5qcydcbmltcG9ydCAnLi9leGFtcGxlcy5qcyciXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
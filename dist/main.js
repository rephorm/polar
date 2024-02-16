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

    xoffset = 0;
    yoffset = 0;

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
        this.physdt = 1000.0 / 240.0;
        this.lastT = performance.now()

        this.reset()
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
        this.plotCtx.fillStyle = '#fff'
        this.plotCtx.fillRect(0, 0, this.plot.width, this.plot.height)
    }

    download() {
        var a = document.createElement('a')
        a.href = this.plot.toDataURL()
        a.download = 'plot.png'
        a.click()
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
                console.log(plotter.xoffset, this.x, plotter.ppi)
                this.x = (this.x * plotter.ppi + plotter.xoffset) || plotter.x
                this.y = (this.y * plotter.ppi + plotter.yoffset) || plotter.y
                console.log(this.x, plotter.xoffset, this.x + plotter.xoffset,
                     (this.x * plotter.ppi + plotter.xoffset),
                      (this.x * plotter.ppi + plotter.xoffset) || plotter.x)
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

        plotter.feedRateScale = parseFloat(document.getElementById('feed-rate-scale').value) || 20
        plotter.ppi = parseFloat(document.getElementById('pixels-per-inch').value) || 1
        plotter.penColor = document.getElementById('pen-color').value || '#000000';
        plotter.xoffset = parseFloat(document.getElementById('x-offset').value) || 0
        plotter.yoffset = parseFloat(document.getElementById('y-offset').value) || 0
        
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

    this.document.getElementById('download-link').addEventListener('click', (ev) => {
        p.download();
    })

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQVk7O0FBRVosa0JBQWtCO0FBQ2xCLG1CQUFtQjtBQUNuQixxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxTQUFTO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMkMsVUFBVTtBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVk7O0FBRVosZUFBZSxtQkFBTyxDQUFDLG9EQUFXO0FBQ2xDLGdCQUFnQixtQkFBTyxDQUFDLGdEQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQWM7QUFDZCxrQkFBa0I7QUFDbEIseUJBQXlCOztBQUV6QjtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGlCQUFpQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGVBQWU7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EseUJBQXlCLFFBQVE7QUFDakM7QUFDQSxzQkFBc0IsZUFBZTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsU0FBUztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxxQkFBcUIsV0FBVyxHQUFHLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQSxnQkFBZ0IsV0FBVyxHQUFHLElBQUksS0FBSyxhQUFhO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsTUFBTTtBQUN0Qjs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsbUJBQW1CLEtBQUssbURBQW1ELGNBQWM7QUFDekYsR0FBRztBQUNIO0FBQ0E7QUFDQSwrQkFBK0IsSUFBSTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLE1BQU0sYUFBYSxTQUFTO0FBQ3REO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsZ0JBQWdCO0FBQ3pCLGNBQWMsb0JBQW9CLEVBQUUsSUFBSTtBQUN4QztBQUNBLFlBQVksZ0JBQWdCLEVBQUUsSUFBSTtBQUNsQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsR0FBRyxTQUFTLEdBQUcsS0FBSyxxQkFBcUIsRUFBRSxFQUFFO0FBQ3BFLFFBQVE7QUFDUix5QkFBeUIsR0FBRyxLQUFLLHlCQUF5QixFQUFFLEVBQUU7QUFDOUQsbUJBQW1CLHlCQUF5QixFQUFFLEVBQUU7QUFDaEQ7QUFDQSxNQUFNO0FBQ04sb0JBQW9CLElBQUksRUFBRSxHQUFHLFNBQVMsSUFBSSxFQUFFLEVBQUU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDLGNBQWMsU0FBUyxPQUFPO0FBQ3hFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLFlBQVk7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixnQkFBZ0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsZ0JBQWdCO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsUUFBUTtBQUMxQjtBQUNBLG9CQUFvQixRQUFRO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxvQkFBb0IsU0FBUztBQUM3QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBLGtDQUFrQyxRQUFRO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVMseUJBQXlCO0FBQ2xDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhEQUE4RCxZQUFZO0FBQzFFO0FBQ0EsOERBQThELFlBQVk7QUFDMUU7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxZQUFZO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDaGZhOztBQUViLDhDQUE2QztBQUM3QztBQUNBLENBQUMsRUFBQzs7QUFFRixpQ0FBaUMsMkNBQTJDLGdCQUFnQixrQkFBa0IsT0FBTywyQkFBMkIsd0RBQXdELGdDQUFnQyx1REFBdUQsK0RBQStELHlEQUF5RCxxRUFBcUUsNkRBQTZELHdCQUF3QixJQUFJOzs7QUFHcmpCLG1CQUFtQixtQkFBTyxDQUFDLDhEQUFjOztBQUV6QyxrREFBa0QsMENBQTBDOztBQUU1Rjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxvQkFBb0Isa0JBQWtCO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVTtBQUNWLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsaUJBQWlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRCQUE0QixpQkFBaUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxDQUFDOztBQUVELGtCQUFlOzs7Ozs7Ozs7OztBQ2xORjs7QUFFYixtQkFBbUIsbUJBQU8sQ0FBQywwRUFBZTs7QUFFMUM7O0FBRUEsdUNBQXVDLHVDQUF1Qzs7QUFFOUU7Ozs7Ozs7Ozs7O0FDUmE7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0YsdUJBQXVCLEdBQUcsbUJBQW1CLEdBQUcscUJBQXFCLEdBQUcsaUJBQWlCLEdBQUcsbUJBQW1CLEdBQUcsaUJBQWlCLEdBQUcsdUJBQXVCOztBQUU3SixxQ0FBcUMsbUJBQU8sQ0FBQywrQ0FBUTs7QUFFckQsaUNBQWlDLG1CQUFPLENBQUMsaUJBQUk7O0FBRTdDLHFDQUFxQyxtQkFBTyxDQUFDLHdEQUFROztBQUVyRCxzQ0FBc0MsbUJBQU8sQ0FBQyx5REFBUTs7QUFFdEQsd0NBQXdDLDZCQUE2QixjQUFjLE9BQU8saUJBQWlCLG1CQUFtQix1QkFBdUIsc0RBQXNELHNIQUFzSCw0QkFBNEIsNENBQTRDLE9BQU8sZ0NBQWdDLHlCQUF5Qjs7QUFFemMsdUNBQXVDLHVDQUF1Qzs7QUFFOUUsd0JBQXdCLDJFQUEyRSxrQ0FBa0Msd0JBQXdCLE9BQU8sa0NBQWtDLG1JQUFtSTs7QUFFelUsa0RBQWtELDBDQUEwQzs7QUFFNUYsNENBQTRDLGdCQUFnQixrQkFBa0IsT0FBTywyQkFBMkIsd0RBQXdELGdDQUFnQyx1REFBdUQ7O0FBRS9QLDhEQUE4RCxzRUFBc0UsOERBQThEOztBQUVsTSxrREFBa0QsMEVBQTBFLGVBQWU7O0FBRTNJLDhCQUE4QixnR0FBZ0csbURBQW1EOztBQUVqTCx3Q0FBd0MsdUJBQXVCLHlGQUF5Rjs7QUFFeEosMkNBQTJDLCtEQUErRCw2RUFBNkUseUVBQXlFLGVBQWUsdURBQXVELEdBQUc7O0FBRXpVLGlDQUFpQyw0RUFBNEUsaUJBQWlCLGFBQWE7O0FBRTNJLGlDQUFpQyxnQkFBZ0Isc0JBQXNCLE9BQU8sdURBQXVELG1DQUFtQywwREFBMEQsc0ZBQXNGLGlFQUFpRSxNQUFNLGlDQUFpQyw0Q0FBNEMsS0FBSzs7QUFFamQsNENBQTRDLGtCQUFrQixrQ0FBa0Msb0VBQW9FLEtBQUssT0FBTyxvQkFBb0I7O0FBRXBNOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxJQUFJLFdBQVcsT0FBTztBQUN2QixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTs7O0FBR3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHdCQUF3QiwwQ0FBMEM7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUcsV0FBVyxRQUFROzs7QUFHdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxvQkFBb0IsY0FBYztBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7OztBQUdBO0FBQ0EsNENBQTRDOztBQUU1Qyw4QkFBOEIsT0FBTzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZOztBQUVaLFlBQVk7O0FBRVo7O0FBRUEsb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7OztBQUdSLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7OztBQUdSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07OztBQUdOLG1EQUFtRDs7QUFFbkQ7O0FBRUE7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBLENBQUMsSUFBSSxXQUFXLFFBQVE7QUFDeEIsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsVUFBVTs7O0FBR3JCLGlCQUFpQjs7QUFFakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQSxHQUFHLFdBQVcsUUFBUTtBQUN0QixXQUFXLFNBQVM7QUFDcEIsV0FBVyxVQUFVOzs7QUFHckIsbUJBQW1COztBQUVuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQSxHQUFHLFdBQVcsUUFBUTtBQUN0QixXQUFXLFNBQVM7QUFDcEIsV0FBVyxVQUFVOzs7QUFHckIscUJBQXFCOztBQUVyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1COztBQUVuQjtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQixrQkFBa0I7QUFDcEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsR0FBRyxXQUFXLFFBQVE7QUFDdEIsV0FBVyxTQUFTOzs7QUFHcEIsdUJBQXVCOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsU0FBUztBQUN0QixhQUFhLFNBQVM7QUFDdEI7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUEsb0NBQW9DO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7OztBQUdSO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsQ0FBQzs7QUFFRCx1QkFBdUI7Ozs7Ozs7Ozs7QUM5YnZCO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUyxXQUFXOztBQUVwQjtBQUNBO0FBQ0E7QUFDQSxTQUFTLFdBQVc7O0FBRXBCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsV0FBVzs7QUFFcEI7QUFDQTtBQUNBLFNBQVMsVUFBVTs7QUFFbkI7QUFDQTs7Ozs7Ozs7Ozs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMxQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBOztBQUVBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7Ozs7Ozs7Ozs7OztBQ3ZMaEI7O0FBRWIsZ0RBQWdELDBEQUEwRCwyQ0FBMkM7O0FBRXJKOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLG9CQUFvQjs7Ozs7Ozs7Ozs7O0FDOUhwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGtGQUFvQjtBQUMzQyxlQUFlLG1CQUFPLENBQUMsa0ZBQW9CO0FBQzNDLG1CQUFPLENBQUMsNkRBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDN0hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0EsZ0JBQWdCLG1CQUFPLENBQUMsb0ZBQXFCO0FBQzdDLG1CQUFPLENBQUMsNkRBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUyxtRkFBOEI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLG1CQUFPLENBQUMsd0dBQTJCO0FBQ2hEOztBQUVBLGFBQWEsNEVBQXdCO0FBQ3JDLDRCQUE0QixxQkFBTSxtQkFBbUIscUJBQU0sbUZBQW1GO0FBQzlJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixtQkFBTyxDQUFDLG1CQUFNO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFPLENBQUMsMEdBQWdDO0FBQ3pELGtCQUFrQixtQkFBTyxDQUFDLGtHQUE0QjtBQUN0RCxlQUFlLG1CQUFPLENBQUMsOEZBQTBCO0FBQ2pEO0FBQ0EscUJBQXFCLGdHQUEwQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFPLENBQUMsNkRBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFLG1GQUFtRjtBQUM1SjtBQUNBO0FBQ0EscUJBQXFCLG1CQUFPLENBQUMsOEVBQWtCO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxpSEFBd0M7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixtQkFBTyxDQUFDLDhFQUFrQjtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRkFBK0Y7QUFDL0YsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLDRGQUE0RjtBQUM1RixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQyxpSEFBd0M7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0RUFBNEU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHlCQUF5QjtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsbUJBQU8sQ0FBQyxnSEFBbUM7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQSxtREFBbUQsK0RBQStEO0FBQ2xIO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1CQUFPLENBQUMsb0dBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsT0FBTztBQUN4QztBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNsZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsYUFBYTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQSxxQkFBcUIsZ0dBQTBCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLDhFQUFrQjtBQUN2QyxtQkFBTyxDQUFDLDZEQUFVO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGdFQUFnQjtBQUNyQztBQUNBOztBQUVBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLHdHQUEyQjtBQUNoRDs7QUFFQSxhQUFhLDRFQUF3QjtBQUNyQyw0QkFBNEIscUJBQU0sbUJBQW1CLHFCQUFNLG1GQUFtRjtBQUM5STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsbUJBQU8sQ0FBQyxrR0FBNEI7QUFDdEQsZUFBZSxtQkFBTyxDQUFDLDhGQUEwQjtBQUNqRDtBQUNBLHFCQUFxQixnR0FBMEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQU8sQ0FBQyw2REFBVTtBQUNsQjtBQUNBO0FBQ0EscUJBQXFCLG1CQUFPLENBQUMsOEVBQWtCO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSTtBQUNKLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixtQkFBTyxDQUFDLDhFQUFrQjs7QUFFL0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0Usc0RBQXNEO0FBQzlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNob0JhOztBQUViO0FBQ0EsNENBQTRDLDJCQUEyQixrQkFBa0Isa0NBQWtDLG9FQUFvRSxLQUFLLE9BQU8sb0JBQW9CO0FBQy9OLCtCQUErQix1Q0FBdUM7QUFDdEUscUNBQXFDLCtEQUErRCxzQ0FBc0MsMEJBQTBCLCtDQUErQyx5Q0FBeUMsdUVBQXVFO0FBQ25VLGVBQWUsbUJBQU8sQ0FBQyw2RkFBaUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsaUVBQWlFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLHlGQUF5RjtBQUN6RjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbkxhOztBQUViLDJDQUEyQyxnQ0FBZ0Msb0NBQW9DLG9EQUFvRCw2REFBNkQsaUVBQWlFLHNDQUFzQztBQUN2VSxpQ0FBaUMsZ0JBQWdCLHNCQUFzQixPQUFPLHVEQUF1RCw2REFBNkQsNENBQTRDLG9LQUFvSyxtRkFBbUYsS0FBSztBQUMxZSw0Q0FBNEMsMkJBQTJCLGtCQUFrQixrQ0FBa0Msb0VBQW9FLEtBQUssT0FBTyxvQkFBb0I7QUFDL04sa0RBQWtELDBDQUEwQztBQUM1Riw0Q0FBNEMsZ0JBQWdCLGtCQUFrQixPQUFPLDJCQUEyQix3REFBd0QsZ0NBQWdDLHVEQUF1RDtBQUMvUCw4REFBOEQsc0VBQXNFLDhEQUE4RCxrREFBa0QsaUJBQWlCLEdBQUc7QUFDeFEsK0JBQStCLHVDQUF1QztBQUN0RSxxQ0FBcUMsK0RBQStELHNDQUFzQywwQkFBMEIsK0NBQStDLHlDQUF5Qyx1RUFBdUU7QUFDblUsZUFBZSxtQkFBTyxDQUFDLDhDQUFRO0FBQy9CO0FBQ0EsZ0JBQWdCLG1CQUFPLENBQUMsbUJBQU07QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQyxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EseURBQXlELGNBQWM7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQ3RMWTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0ZBQXdGO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMvRkE7QUFDQTs7QUFFYTs7QUFFYixpQ0FBaUMsc0dBQWdDO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0UsYUFBYTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3JGQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNHQUFnQztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILCtCQUErQixtQkFBTyxDQUFDLDZGQUFpQjtBQUN4RDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFLGFBQWE7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3JGYTs7QUFFYiw0QkFBNEIsc0dBQWdDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNyQkEsa0dBQStDOzs7Ozs7Ozs7OztBQ0EvQztBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLDhDQUFRO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUUsY0FBYztBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDaEVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJDQUEyQyx1QkFBdUI7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMsc0NBQXNDLHFCQUFNLDBCQUEwQixxQkFBTTs7Ozs7Ozs7Ozs7QUN6TDdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUyxtRkFBOEI7QUFDdkMsZUFBZSxtQkFBTyxDQUFDLDZEQUFVOztBQUVqQztBQUNBLGtCQUFrQixtQkFBTyxDQUFDLHVHQUF5QztBQUNuRSxrQkFBa0IsbUJBQU8sQ0FBQyx1R0FBeUM7QUFDbkUsZ0JBQWdCLG1CQUFPLENBQUMsbUdBQXVDO0FBQy9ELG1CQUFtQixtQkFBTyxDQUFDLHlHQUEwQztBQUNyRSxxQkFBcUIsbUJBQU8sQ0FBQyw2R0FBNEM7QUFDekUsa0JBQWtCLG1CQUFPLENBQUMsbUlBQXVEO0FBQ2pGLGtCQUFrQixtQkFBTyxDQUFDLHlIQUFrRDs7QUFFNUU7QUFDQTs7OztBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViOztBQUVBLGFBQWEsc0ZBQTZCO0FBQzFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixzQ0FBc0Msc0NBQXNDO0FBQ3pHO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3ZTQSxvQkFBb0IscUJBQU0sb0JBQW9CLHFCQUFNO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixHQUFHLGNBQWM7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0EsbUJBQU8sQ0FBQyxpRUFBYztBQUN0QjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEIsK0JBQStCLHFCQUFNLG9CQUFvQixxQkFBTTtBQUMvRDtBQUNBLHNCQUFzQjtBQUN0QixpQ0FBaUMscUJBQU0sb0JBQW9CLHFCQUFNO0FBQ2pFOzs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUyxxQkFBTTtBQUNmLElBQUk7QUFDSjtBQUNBO0FBQ0EsWUFBWSxxQkFBTTtBQUNsQjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2pFQSxnQkFBZ0I7QUFDaEI7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkI7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdDVFMEM7QUFDM0M7QUFDQTtBQUNBLGNBQWMsbUJBQW1CO0FBQ2pDO0FBQ0EsY0FBYywwQkFBMEI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixZQUFZO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsMERBQVc7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7O0FDaFpEOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05xQztBQUNyQyxpQkFBaUIsd0RBQU87O0FBRXhCLENBQTJCO0FBQzNCLGdCQUFnQiwwQ0FBYTs7QUFFN0IsQ0FBbUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvZ2NvZGUtaW50ZXJwcmV0ZXIvbGliL0ludGVycHJldGVyLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL2djb2RlLWludGVycHJldGVyL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9nY29kZS1wYXJzZXIvbGliL2luZGV4LmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2Vycm9ycy1icm93c2VyLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9kdXBsZXguanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9yZWFkYWJsZS5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV93cml0YWJsZS5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvYXN5bmNfaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9pbnRlcm5hbC9zdHJlYW1zL2J1ZmZlcl9saXN0LmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvaW50ZXJuYWwvc3RyZWFtcy9kZXN0cm95LmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvaW50ZXJuYWwvc3RyZWFtcy9lbmQtb2Ytc3RyZWFtLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvaW50ZXJuYWwvc3RyZWFtcy9mcm9tLWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9pbnRlcm5hbC9zdHJlYW1zL3BpcGVsaW5lLmpzIiwid2VicGFjazovL3BvbGFyLy4vbm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvaW50ZXJuYWwvc3RyZWFtcy9zdGF0ZS5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvc3RyZWFtLWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvc2FmZS1idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9zdHJlYW0tYnJvd3NlcmlmeS9pbmRleC5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy9zdHJpbmdfZGVjb2Rlci9saWIvc3RyaW5nX2RlY29kZXIuanMiLCJ3ZWJwYWNrOi8vcG9sYXIvLi9ub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly9wb2xhci8uL25vZGVfbW9kdWxlcy91dGlsLWRlcHJlY2F0ZS9icm93c2VyLmpzIiwid2VicGFjazovL3BvbGFyLy4vc3JjL2V4YW1wbGVzLmpzIiwid2VicGFjazovL3BvbGFyLy4vc3JjL3BvbGFyLmpzIiwid2VicGFjazovL3BvbGFyL2lnbm9yZWR8L2hvbWUvcmVwaG9ybS9jb2RlL3BvbGFyL25vZGVfbW9kdWxlcy9nY29kZS1wYXJzZXIvbGlifGZzIiwid2VicGFjazovL3BvbGFyL2lnbm9yZWR8L2hvbWUvcmVwaG9ybS9jb2RlL3BvbGFyL25vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXN8dXRpbCIsIndlYnBhY2s6Ly9wb2xhci9pZ25vcmVkfC9ob21lL3JlcGhvcm0vY29kZS9wb2xhci9ub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYnx1dGlsIiwid2VicGFjazovL3BvbGFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BvbGFyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3BvbGFyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wb2xhci93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3BvbGFyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcG9sYXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wb2xhci8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuZXhwb3J0cy5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbnZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG5mb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICBsb29rdXBbaV0gPSBjb2RlW2ldXG4gIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxufVxuXG4vLyBTdXBwb3J0IGRlY29kaW5nIFVSTC1zYWZlIGJhc2U2NCBzdHJpbmdzLCBhcyBOb2RlLmpzIGRvZXMuXG4vLyBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Jhc2U2NCNVUkxfYXBwbGljYXRpb25zXG5yZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcbnJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xuXG5mdW5jdGlvbiBnZXRMZW5zIChiNjQpIHtcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gVHJpbSBvZmYgZXh0cmEgYnl0ZXMgYWZ0ZXIgcGxhY2Vob2xkZXIgYnl0ZXMgYXJlIGZvdW5kXG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzL2lzc3Vlcy80MlxuICB2YXIgdmFsaWRMZW4gPSBiNjQuaW5kZXhPZignPScpXG4gIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuXG5cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW5cbiAgICA/IDBcbiAgICA6IDQgLSAodmFsaWRMZW4gJSA0KVxuXG4gIHJldHVybiBbdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbl1cbn1cblxuLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChiNjQpIHtcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gX2J5dGVMZW5ndGggKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikge1xuICByZXR1cm4gKCh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNMZW5cbn1cblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cblxuICB2YXIgYXJyID0gbmV3IEFycihfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pKVxuXG4gIHZhciBjdXJCeXRlID0gMFxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgdmFyIGxlbiA9IHBsYWNlSG9sZGVyc0xlbiA+IDBcbiAgICA/IHZhbGlkTGVuIC0gNFxuICAgIDogdmFsaWRMZW5cblxuICB2YXIgaVxuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHxcbiAgICAgIHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAyKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMSkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArXG4gICAgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9XG4gICAgICAoKHVpbnQ4W2ldIDw8IDE2KSAmIDB4RkYwMDAwKSArXG4gICAgICAoKHVpbnQ4W2kgKyAxXSA8PCA4KSAmIDB4RkYwMCkgK1xuICAgICAgKHVpbnQ4W2kgKyAyXSAmIDB4RkYpXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG5jb25zdCBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5jb25zdCBjdXN0b21JbnNwZWN0U3ltYm9sID1cbiAgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbFsnZm9yJ10gPT09ICdmdW5jdGlvbicpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZG90LW5vdGF0aW9uXG4gICAgPyBTeW1ib2xbJ2ZvciddKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZG90LW5vdGF0aW9uXG4gICAgOiBudWxsXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuY29uc3QgS19NQVhfTEVOR1RIID0gMHg3ZmZmZmZmZlxuZXhwb3J0cy5rTWF4TGVuZ3RoID0gS19NQVhfTEVOR1RIXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFByaW50IHdhcm5pbmcgYW5kIHJlY29tbWVuZCB1c2luZyBgYnVmZmVyYCB2NC54IHdoaWNoIGhhcyBhbiBPYmplY3RcbiAqICAgICAgICAgICAgICAgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIFdlIHJlcG9ydCB0aGF0IHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGlmIHRoZSBhcmUgbm90IHN1YmNsYXNzYWJsZVxuICogdXNpbmcgX19wcm90b19fLiBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YFxuICogKFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4KS4gSUUgMTAgbGFja3Mgc3VwcG9ydFxuICogZm9yIF9fcHJvdG9fXyBhbmQgaGFzIGEgYnVnZ3kgdHlwZWQgYXJyYXkgaW1wbGVtZW50YXRpb24uXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5pZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gIGNvbnNvbGUuZXJyb3IoXG4gICAgJ1RoaXMgYnJvd3NlciBsYWNrcyB0eXBlZCBhcnJheSAoVWludDhBcnJheSkgc3VwcG9ydCB3aGljaCBpcyByZXF1aXJlZCBieSAnICtcbiAgICAnYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4nXG4gIClcbn1cblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICAvLyBDYW4gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWQ/XG4gIHRyeSB7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBjb25zdCBwcm90byA9IHsgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9IH1cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YocHJvdG8sIFVpbnQ4QXJyYXkucHJvdG90eXBlKVxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihhcnIsIHByb3RvKVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ3BhcmVudCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGhpcykpIHJldHVybiB1bmRlZmluZWRcbiAgICByZXR1cm4gdGhpcy5idWZmZXJcbiAgfVxufSlcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdvZmZzZXQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHRoaXMpKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXMuYnl0ZU9mZnNldFxuICB9XG59KVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyBsZW5ndGggKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwic2l6ZVwiJylcbiAgfVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBjb25zdCBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihidWYsIEJ1ZmZlci5wcm90b3R5cGUpXG4gIHJldHVybiBidWZcbn1cblxuLyoqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGhhdmUgdGhlaXJcbiAqIHByb3RvdHlwZSBjaGFuZ2VkIHRvIGBCdWZmZXIucHJvdG90eXBlYC4gRnVydGhlcm1vcmUsIGBCdWZmZXJgIGlzIGEgc3ViY2xhc3Mgb2ZcbiAqIGBVaW50OEFycmF5YCwgc28gdGhlIHJldHVybmVkIGluc3RhbmNlcyB3aWxsIGhhdmUgYWxsIHRoZSBub2RlIGBCdWZmZXJgIG1ldGhvZHNcbiAqIGFuZCB0aGUgYFVpbnQ4QXJyYXlgIG1ldGhvZHMuIFNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0XG4gKiByZXR1cm5zIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIFRoZSBgVWludDhBcnJheWAgcHJvdG90eXBlIHJlbWFpbnMgdW5tb2RpZmllZC5cbiAqL1xuXG5mdW5jdGlvbiBCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnVGhlIFwic3RyaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIHN0cmluZy4gUmVjZWl2ZWQgdHlwZSBudW1iZXInXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZShhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20oYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG5mdW5jdGlvbiBmcm9tICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlWaWV3KHZhbHVlKVxuICB9XG5cbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICcgK1xuICAgICAgJ29yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHZhbHVlKVxuICAgIClcbiAgfVxuXG4gIGlmIChpc0luc3RhbmNlKHZhbHVlLCBBcnJheUJ1ZmZlcikgfHxcbiAgICAgICh2YWx1ZSAmJiBpc0luc3RhbmNlKHZhbHVlLmJ1ZmZlciwgQXJyYXlCdWZmZXIpKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgU2hhcmVkQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAoaXNJbnN0YW5jZSh2YWx1ZSwgU2hhcmVkQXJyYXlCdWZmZXIpIHx8XG4gICAgICAodmFsdWUgJiYgaXNJbnN0YW5jZSh2YWx1ZS5idWZmZXIsIFNoYXJlZEFycmF5QnVmZmVyKSkpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgb2YgdHlwZSBudW1iZXIuIFJlY2VpdmVkIHR5cGUgbnVtYmVyJ1xuICAgIClcbiAgfVxuXG4gIGNvbnN0IHZhbHVlT2YgPSB2YWx1ZS52YWx1ZU9mICYmIHZhbHVlLnZhbHVlT2YoKVxuICBpZiAodmFsdWVPZiAhPSBudWxsICYmIHZhbHVlT2YgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlT2YsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGNvbnN0IGIgPSBmcm9tT2JqZWN0KHZhbHVlKVxuICBpZiAoYikgcmV0dXJuIGJcblxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvUHJpbWl0aXZlICE9IG51bGwgJiZcbiAgICAgIHR5cGVvZiB2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlW1N5bWJvbC50b1ByaW1pdGl2ZV0oJ3N0cmluZycpLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAnb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdmFsdWUpXG4gIClcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbSh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBOb3RlOiBDaGFuZ2UgcHJvdG90eXBlICphZnRlciogQnVmZmVyLmZyb20gaXMgZGVmaW5lZCB0byB3b3JrYXJvdW5kIENocm9tZSBidWc6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzE0OFxuT2JqZWN0LnNldFByb3RvdHlwZU9mKEJ1ZmZlci5wcm90b3R5cGUsIFVpbnQ4QXJyYXkucHJvdG90eXBlKVxuT2JqZWN0LnNldFByb3RvdHlwZU9mKEJ1ZmZlciwgVWludDhBcnJheSlcblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIHNpemUgKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwic2l6ZVwiJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICB9XG5cbiAgY29uc3QgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgbGV0IGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG5cbiAgY29uc3QgYWN0dWFsID0gYnVmLndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG5cbiAgaWYgKGFjdHVhbCAhPT0gbGVuZ3RoKSB7XG4gICAgLy8gV3JpdGluZyBhIGhleCBzdHJpbmcsIGZvciBleGFtcGxlLCB0aGF0IGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyB3aWxsXG4gICAgLy8gY2F1c2UgZXZlcnl0aGluZyBhZnRlciB0aGUgZmlyc3QgaW52YWxpZCBjaGFyYWN0ZXIgdG8gYmUgaWdub3JlZC4gKGUuZy5cbiAgICAvLyAnYWJ4eGNkJyB3aWxsIGJlIHRyZWF0ZWQgYXMgJ2FiJylcbiAgICBidWYgPSBidWYuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlMaWtlIChhcnJheSkge1xuICBjb25zdCBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgY29uc3QgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIGJ1ZltpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlWaWV3IChhcnJheVZpZXcpIHtcbiAgaWYgKGlzSW5zdGFuY2UoYXJyYXlWaWV3LCBVaW50OEFycmF5KSkge1xuICAgIGNvbnN0IGNvcHkgPSBuZXcgVWludDhBcnJheShhcnJheVZpZXcpXG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcihjb3B5LmJ1ZmZlciwgY29weS5ieXRlT2Zmc2V0LCBjb3B5LmJ5dGVMZW5ndGgpXG4gIH1cbiAgcmV0dXJuIGZyb21BcnJheUxpa2UoYXJyYXlWaWV3KVxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wib2Zmc2V0XCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJsZW5ndGhcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgbGV0IGJ1ZlxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGJ1ZiwgQnVmZmVyLnByb3RvdHlwZSlcblxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICBjb25zdCBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIGNvbnN0IGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW4pXG5cbiAgICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGJ1ZlxuICAgIH1cblxuICAgIG9iai5jb3B5KGJ1ZiwgMCwgMCwgbGVuKVxuICAgIHJldHVybiBidWZcbiAgfVxuXG4gIGlmIChvYmoubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IG51bWJlcklzTmFOKG9iai5sZW5ndGgpKSB7XG4gICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKDApXG4gICAgfVxuICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iailcbiAgfVxuXG4gIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgQXJyYXkuaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmouZGF0YSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwgS19NQVhfTEVOR1RIYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBLX01BWF9MRU5HVEgudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiBiICE9IG51bGwgJiYgYi5faXNCdWZmZXIgPT09IHRydWUgJiZcbiAgICBiICE9PSBCdWZmZXIucHJvdG90eXBlIC8vIHNvIEJ1ZmZlci5pc0J1ZmZlcihCdWZmZXIucHJvdG90eXBlKSB3aWxsIGJlIGZhbHNlXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoaXNJbnN0YW5jZShhLCBVaW50OEFycmF5KSkgYSA9IEJ1ZmZlci5mcm9tKGEsIGEub2Zmc2V0LCBhLmJ5dGVMZW5ndGgpXG4gIGlmIChpc0luc3RhbmNlKGIsIFVpbnQ4QXJyYXkpKSBiID0gQnVmZmVyLmZyb20oYiwgYi5vZmZzZXQsIGIuYnl0ZUxlbmd0aClcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwiYnVmMVwiLCBcImJ1ZjJcIiBhcmd1bWVudHMgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheSdcbiAgICApXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICBsZXQgeCA9IGEubGVuZ3RoXG4gIGxldCB5ID0gYi5sZW5ndGhcblxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIGxldCBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGxlbmd0aClcbiAgbGV0IHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICBsZXQgYnVmID0gbGlzdFtpXVxuICAgIGlmIChpc0luc3RhbmNlKGJ1ZiwgVWludDhBcnJheSkpIHtcbiAgICAgIGlmIChwb3MgKyBidWYubGVuZ3RoID4gYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSBidWYgPSBCdWZmZXIuZnJvbShidWYpXG4gICAgICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICAgICAgYnVmZmVyLFxuICAgICAgICAgIGJ1ZixcbiAgICAgICAgICBwb3NcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH0gZWxzZSB7XG4gICAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICB9XG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgaXNJbnN0YW5jZShzdHJpbmcsIEFycmF5QnVmZmVyKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwic3RyaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgb3IgQXJyYXlCdWZmZXIuICcgK1xuICAgICAgJ1JlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBzdHJpbmdcbiAgICApXG4gIH1cblxuICBjb25zdCBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGNvbnN0IG11c3RNYXRjaCA9IChhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gPT09IHRydWUpXG4gIGlmICghbXVzdE1hdGNoICYmIGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgbGV0IGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkge1xuICAgICAgICAgIHJldHVybiBtdXN0TWF0Y2ggPyAtMSA6IHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIH1cbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIGxldCBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2VyY2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgKGFuZCB0aGUgYGlzLWJ1ZmZlcmAgbnBtIHBhY2thZ2UpXG4vLyB0byBkZXRlY3QgYSBCdWZmZXIgaW5zdGFuY2UuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHVzZSBgaW5zdGFuY2VvZiBCdWZmZXJgXG4vLyByZWxpYWJseSBpbiBhIGJyb3dzZXJpZnkgY29udGV4dCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG11bHRpcGxlIGRpZmZlcmVudFxuLy8gY29waWVzIG9mIHRoZSAnYnVmZmVyJyBwYWNrYWdlIGluIHVzZS4gVGhpcyBtZXRob2Qgd29ya3MgZXZlbiBmb3IgQnVmZmVyXG4vLyBpbnN0YW5jZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgZnJvbSBhbm90aGVyIGNvcHkgb2YgdGhlIGBidWZmZXJgIHBhY2thZ2UuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNTRcbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIGNvbnN0IGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgY29uc3QgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgY29uc3QgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgY29uc3QgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nID0gQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZ1xuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIGxldCBzdHIgPSAnJ1xuICBjb25zdCBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkucmVwbGFjZSgvKC57Mn0pL2csICckMSAnKS50cmltKClcbiAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuaWYgKGN1c3RvbUluc3BlY3RTeW1ib2wpIHtcbiAgQnVmZmVyLnByb3RvdHlwZVtjdXN0b21JbnNwZWN0U3ltYm9sXSA9IEJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoaXNJbnN0YW5jZSh0YXJnZXQsIFVpbnQ4QXJyYXkpKSB7XG4gICAgdGFyZ2V0ID0gQnVmZmVyLmZyb20odGFyZ2V0LCB0YXJnZXQub2Zmc2V0LCB0YXJnZXQuYnl0ZUxlbmd0aClcbiAgfVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJ0YXJnZXRcIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIEJ1ZmZlciBvciBVaW50OEFycmF5LiAnICtcbiAgICAgICdSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHRhcmdldClcbiAgICApXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICBsZXQgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgbGV0IHkgPSBlbmQgLSBzdGFydFxuICBjb25zdCBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIGNvbnN0IHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIGNvbnN0IHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0IC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChudW1iZXJJc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFt2YWxdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICBsZXQgaW5kZXhTaXplID0gMVxuICBsZXQgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICBsZXQgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICBsZXQgaVxuICBpZiAoZGlyKSB7XG4gICAgbGV0IGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgbGV0IGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICBjb25zdCByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgbGV0IGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChudW1iZXJJc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoID4+PiAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgY29uc3QgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICBsZXQgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIGNvbnN0IHJlcyA9IFtdXG5cbiAgbGV0IGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIGNvbnN0IGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIGxldCBjb2RlUG9pbnQgPSBudWxsXG4gICAgbGV0IGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRilcbiAgICAgID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERilcbiAgICAgICAgICA/IDNcbiAgICAgICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKVxuICAgICAgICAgICAgICA/IDJcbiAgICAgICAgICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICBsZXQgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG5jb25zdCBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgY29uc3QgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICBsZXQgcmVzID0gJydcbiAgbGV0IGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGxldCByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBsZXQgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBjb25zdCBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgbGV0IG91dCA9ICcnXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IGhleFNsaWNlTG9va3VwVGFibGVbYnVmW2ldXVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgY29uc3QgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgbGV0IHJlcyA9ICcnXG4gIC8vIElmIGJ5dGVzLmxlbmd0aCBpcyBvZGQsIHRoZSBsYXN0IDggYml0cyBtdXN0IGJlIGlnbm9yZWQgKHNhbWUgYXMgbm9kZS5qcylcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGggLSAxOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIChieXRlc1tpICsgMV0gKiAyNTYpKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgY29uc3QgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YobmV3QnVmLCBCdWZmZXIucHJvdG90eXBlKVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnRMRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIGxldCB2YWwgPSB0aGlzW29mZnNldF1cbiAgbGV0IG11bCA9IDFcbiAgbGV0IGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludEJFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgbGV0IHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICBsZXQgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQ4ID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQxNkxFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDE2QkUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MzJMRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQzMkJFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEJpZ1VJbnQ2NExFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdVSW50NjRMRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IGxvID0gZmlyc3QgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAyNFxuXG4gIGNvbnN0IGhpID0gdGhpc1srK29mZnNldF0gK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIGxhc3QgKiAyICoqIDI0XG5cbiAgcmV0dXJuIEJpZ0ludChsbykgKyAoQmlnSW50KGhpKSA8PCBCaWdJbnQoMzIpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkQmlnVUludDY0QkUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gcmVhZEJpZ1VJbnQ2NEJFIChvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGNvbnN0IGZpcnN0ID0gdGhpc1tvZmZzZXRdXG4gIGNvbnN0IGxhc3QgPSB0aGlzW29mZnNldCArIDddXG4gIGlmIChmaXJzdCA9PT0gdW5kZWZpbmVkIHx8IGxhc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgdGhpcy5sZW5ndGggLSA4KVxuICB9XG5cbiAgY29uc3QgaGkgPSBmaXJzdCAqIDIgKiogMjQgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdXG5cbiAgY29uc3QgbG8gPSB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMjQgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIGxhc3RcblxuICByZXR1cm4gKEJpZ0ludChoaSkgPDwgQmlnSW50KDMyKSkgKyBCaWdJbnQobG8pXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXRdXG4gIGxldCBtdWwgPSAxXG4gIGxldCBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgbGV0IGkgPSBieXRlTGVuZ3RoXG4gIGxldCBtdWwgPSAxXG4gIGxldCB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICBjb25zdCB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgY29uc3QgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEJpZ0ludDY0TEUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gcmVhZEJpZ0ludDY0TEUgKG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgY29uc3QgZmlyc3QgPSB0aGlzW29mZnNldF1cbiAgY29uc3QgbGFzdCA9IHRoaXNbb2Zmc2V0ICsgN11cbiAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQgfHwgbGFzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYm91bmRzRXJyb3Iob2Zmc2V0LCB0aGlzLmxlbmd0aCAtIDgpXG4gIH1cblxuICBjb25zdCB2YWwgPSB0aGlzW29mZnNldCArIDRdICtcbiAgICB0aGlzW29mZnNldCArIDVdICogMiAqKiA4ICtcbiAgICB0aGlzW29mZnNldCArIDZdICogMiAqKiAxNiArXG4gICAgKGxhc3QgPDwgMjQpIC8vIE92ZXJmbG93XG5cbiAgcmV0dXJuIChCaWdJbnQodmFsKSA8PCBCaWdJbnQoMzIpKSArXG4gICAgQmlnSW50KGZpcnN0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMjQpXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdJbnQ2NEJFIChvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGNvbnN0IGZpcnN0ID0gdGhpc1tvZmZzZXRdXG4gIGNvbnN0IGxhc3QgPSB0aGlzW29mZnNldCArIDddXG4gIGlmIChmaXJzdCA9PT0gdW5kZWZpbmVkIHx8IGxhc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgdGhpcy5sZW5ndGggLSA4KVxuICB9XG5cbiAgY29uc3QgdmFsID0gKGZpcnN0IDw8IDI0KSArIC8vIE92ZXJmbG93XG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF1cblxuICByZXR1cm4gKEJpZ0ludCh2YWwpIDw8IEJpZ0ludCgzMikpICtcbiAgICBCaWdJbnQodGhpc1srK29mZnNldF0gKiAyICoqIDI0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICBsYXN0KVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50TEUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgbGV0IG11bCA9IDFcbiAgbGV0IGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnRCRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY29uc3QgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICBsZXQgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIGxldCBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDggPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MTZMRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDE2QkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQzMkxFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MzJCRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiB3cnRCaWdVSW50NjRMRSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBtaW4sIG1heCkge1xuICBjaGVja0ludEJJKHZhbHVlLCBtaW4sIG1heCwgYnVmLCBvZmZzZXQsIDcpXG5cbiAgbGV0IGxvID0gTnVtYmVyKHZhbHVlICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0KytdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0KytdID0gbG9cbiAgbGV0IGhpID0gTnVtYmVyKHZhbHVlID4+IEJpZ0ludCgzMikgJiBCaWdJbnQoMHhmZmZmZmZmZikpXG4gIGJ1ZltvZmZzZXQrK10gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBoaVxuICByZXR1cm4gb2Zmc2V0XG59XG5cbmZ1bmN0aW9uIHdydEJpZ1VJbnQ2NEJFIChidWYsIHZhbHVlLCBvZmZzZXQsIG1pbiwgbWF4KSB7XG4gIGNoZWNrSW50QkkodmFsdWUsIG1pbiwgbWF4LCBidWYsIG9mZnNldCwgNylcblxuICBsZXQgbG8gPSBOdW1iZXIodmFsdWUgJiBCaWdJbnQoMHhmZmZmZmZmZikpXG4gIGJ1ZltvZmZzZXQgKyA3XSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0ICsgNl0gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCArIDVdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQgKyA0XSA9IGxvXG4gIGxldCBoaSA9IE51bWJlcih2YWx1ZSA+PiBCaWdJbnQoMzIpICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0ICsgM10gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCArIDJdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQgKyAxXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0XSA9IGhpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdVSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ1VJbnQ2NExFICh2YWx1ZSwgb2Zmc2V0ID0gMCkge1xuICByZXR1cm4gd3J0QmlnVUludDY0TEUodGhpcywgdmFsdWUsIG9mZnNldCwgQmlnSW50KDApLCBCaWdJbnQoJzB4ZmZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUJpZ1VJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHdyaXRlQmlnVUludDY0QkUgKHZhbHVlLCBvZmZzZXQgPSAwKSB7XG4gIHJldHVybiB3cnRCaWdVSW50NjRCRSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBCaWdJbnQoMCksIEJpZ0ludCgnMHhmZmZmZmZmZmZmZmZmZmZmJykpXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIGxldCBpID0gMFxuICBsZXQgbXVsID0gMVxuICBsZXQgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIGxldCBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgbGV0IG11bCA9IDFcbiAgbGV0IHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdJbnQ2NExFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHdyaXRlQmlnSW50NjRMRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NExFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIC1CaWdJbnQoJzB4ODAwMDAwMDAwMDAwMDAwMCcpLCBCaWdJbnQoJzB4N2ZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUJpZ0ludDY0QkUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gd3JpdGVCaWdJbnQ2NEJFICh2YWx1ZSwgb2Zmc2V0ID0gMCkge1xuICByZXR1cm4gd3J0QmlnVUludDY0QkUodGhpcywgdmFsdWUsIG9mZnNldCwgLUJpZ0ludCgnMHg4MDAwMDAwMDAwMDAwMDAwJyksIEJpZ0ludCgnMHg3ZmZmZmZmZmZmZmZmZmZmJykpXG59KVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzaG91bGQgYmUgYSBCdWZmZXInKVxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgY29uc3QgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gVXNlIGJ1aWx0LWluIHdoZW4gYXZhaWxhYmxlLCBtaXNzaW5nIGZyb20gSUUxMVxuICAgIHRoaXMuY29weVdpdGhpbih0YXJnZXRTdGFydCwgc3RhcnQsIGVuZClcbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmICgoZW5jb2RpbmcgPT09ICd1dGY4JyAmJiBjb2RlIDwgMTI4KSB8fFxuICAgICAgICAgIGVuY29kaW5nID09PSAnbGF0aW4xJykge1xuICAgICAgICAvLyBGYXN0IHBhdGg6IElmIGB2YWxgIGZpdHMgaW50byBhIHNpbmdsZSBieXRlLCB1c2UgdGhhdCBudW1lcmljIHZhbHVlLlxuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgdmFsID0gTnVtYmVyKHZhbClcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICBsZXQgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gICAgY29uc3QgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHZhbHVlIFwiJyArIHZhbCArXG4gICAgICAgICdcIiBpcyBpbnZhbGlkIGZvciBhcmd1bWVudCBcInZhbHVlXCInKVxuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBDVVNUT00gRVJST1JTXG4vLyA9PT09PT09PT09PT09XG5cbi8vIFNpbXBsaWZpZWQgdmVyc2lvbnMgZnJvbSBOb2RlLCBjaGFuZ2VkIGZvciBCdWZmZXItb25seSB1c2FnZVxuY29uc3QgZXJyb3JzID0ge31cbmZ1bmN0aW9uIEUgKHN5bSwgZ2V0TWVzc2FnZSwgQmFzZSkge1xuICBlcnJvcnNbc3ltXSA9IGNsYXNzIE5vZGVFcnJvciBleHRlbmRzIEJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIHN1cGVyKClcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtZXNzYWdlJywge1xuICAgICAgICB2YWx1ZTogZ2V0TWVzc2FnZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KVxuXG4gICAgICAvLyBBZGQgdGhlIGVycm9yIGNvZGUgdG8gdGhlIG5hbWUgdG8gaW5jbHVkZSBpdCBpbiB0aGUgc3RhY2sgdHJhY2UuXG4gICAgICB0aGlzLm5hbWUgPSBgJHt0aGlzLm5hbWV9IFske3N5bX1dYFxuICAgICAgLy8gQWNjZXNzIHRoZSBzdGFjayB0byBnZW5lcmF0ZSB0aGUgZXJyb3IgbWVzc2FnZSBpbmNsdWRpbmcgdGhlIGVycm9yIGNvZGVcbiAgICAgIC8vIGZyb20gdGhlIG5hbWUuXG4gICAgICB0aGlzLnN0YWNrIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gICAgICAvLyBSZXNldCB0aGUgbmFtZSB0byB0aGUgYWN0dWFsIG5hbWUuXG4gICAgICBkZWxldGUgdGhpcy5uYW1lXG4gICAgfVxuXG4gICAgZ2V0IGNvZGUgKCkge1xuICAgICAgcmV0dXJuIHN5bVxuICAgIH1cblxuICAgIHNldCBjb2RlICh2YWx1ZSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdjb2RlJywge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0b1N0cmluZyAoKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5uYW1lfSBbJHtzeW19XTogJHt0aGlzLm1lc3NhZ2V9YFxuICAgIH1cbiAgfVxufVxuXG5FKCdFUlJfQlVGRkVSX09VVF9PRl9CT1VORFMnLFxuICBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICByZXR1cm4gYCR7bmFtZX0gaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzYFxuICAgIH1cblxuICAgIHJldHVybiAnQXR0ZW1wdCB0byBhY2Nlc3MgbWVtb3J5IG91dHNpZGUgYnVmZmVyIGJvdW5kcydcbiAgfSwgUmFuZ2VFcnJvcilcbkUoJ0VSUl9JTlZBTElEX0FSR19UWVBFJyxcbiAgZnVuY3Rpb24gKG5hbWUsIGFjdHVhbCkge1xuICAgIHJldHVybiBgVGhlIFwiJHtuYW1lfVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuIFJlY2VpdmVkIHR5cGUgJHt0eXBlb2YgYWN0dWFsfWBcbiAgfSwgVHlwZUVycm9yKVxuRSgnRVJSX09VVF9PRl9SQU5HRScsXG4gIGZ1bmN0aW9uIChzdHIsIHJhbmdlLCBpbnB1dCkge1xuICAgIGxldCBtc2cgPSBgVGhlIHZhbHVlIG9mIFwiJHtzdHJ9XCIgaXMgb3V0IG9mIHJhbmdlLmBcbiAgICBsZXQgcmVjZWl2ZWQgPSBpbnB1dFxuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGlucHV0KSAmJiBNYXRoLmFicyhpbnB1dCkgPiAyICoqIDMyKSB7XG4gICAgICByZWNlaXZlZCA9IGFkZE51bWVyaWNhbFNlcGFyYXRvcihTdHJpbmcoaW5wdXQpKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnYmlnaW50Jykge1xuICAgICAgcmVjZWl2ZWQgPSBTdHJpbmcoaW5wdXQpXG4gICAgICBpZiAoaW5wdXQgPiBCaWdJbnQoMikgKiogQmlnSW50KDMyKSB8fCBpbnB1dCA8IC0oQmlnSW50KDIpICoqIEJpZ0ludCgzMikpKSB7XG4gICAgICAgIHJlY2VpdmVkID0gYWRkTnVtZXJpY2FsU2VwYXJhdG9yKHJlY2VpdmVkKVxuICAgICAgfVxuICAgICAgcmVjZWl2ZWQgKz0gJ24nXG4gICAgfVxuICAgIG1zZyArPSBgIEl0IG11c3QgYmUgJHtyYW5nZX0uIFJlY2VpdmVkICR7cmVjZWl2ZWR9YFxuICAgIHJldHVybiBtc2dcbiAgfSwgUmFuZ2VFcnJvcilcblxuZnVuY3Rpb24gYWRkTnVtZXJpY2FsU2VwYXJhdG9yICh2YWwpIHtcbiAgbGV0IHJlcyA9ICcnXG4gIGxldCBpID0gdmFsLmxlbmd0aFxuICBjb25zdCBzdGFydCA9IHZhbFswXSA9PT0gJy0nID8gMSA6IDBcbiAgZm9yICg7IGkgPj0gc3RhcnQgKyA0OyBpIC09IDMpIHtcbiAgICByZXMgPSBgXyR7dmFsLnNsaWNlKGkgLSAzLCBpKX0ke3Jlc31gXG4gIH1cbiAgcmV0dXJuIGAke3ZhbC5zbGljZSgwLCBpKX0ke3Jlc31gXG59XG5cbi8vIENIRUNLIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNoZWNrQm91bmRzIChidWYsIG9mZnNldCwgYnl0ZUxlbmd0aCkge1xuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBpZiAoYnVmW29mZnNldF0gPT09IHVuZGVmaW5lZCB8fCBidWZbb2Zmc2V0ICsgYnl0ZUxlbmd0aF0gPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgYnVmLmxlbmd0aCAtIChieXRlTGVuZ3RoICsgMSkpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tJbnRCSSAodmFsdWUsIG1pbiwgbWF4LCBidWYsIG9mZnNldCwgYnl0ZUxlbmd0aCkge1xuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHtcbiAgICBjb25zdCBuID0gdHlwZW9mIG1pbiA9PT0gJ2JpZ2ludCcgPyAnbicgOiAnJ1xuICAgIGxldCByYW5nZVxuICAgIGlmIChieXRlTGVuZ3RoID4gMykge1xuICAgICAgaWYgKG1pbiA9PT0gMCB8fCBtaW4gPT09IEJpZ0ludCgwKSkge1xuICAgICAgICByYW5nZSA9IGA+PSAwJHtufSBhbmQgPCAyJHtufSAqKiAkeyhieXRlTGVuZ3RoICsgMSkgKiA4fSR7bn1gXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByYW5nZSA9IGA+PSAtKDIke259ICoqICR7KGJ5dGVMZW5ndGggKyAxKSAqIDggLSAxfSR7bn0pIGFuZCA8IDIgKiogYCArXG4gICAgICAgICAgICAgICAgYCR7KGJ5dGVMZW5ndGggKyAxKSAqIDggLSAxfSR7bn1gXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhbmdlID0gYD49ICR7bWlufSR7bn0gYW5kIDw9ICR7bWF4fSR7bn1gXG4gICAgfVxuICAgIHRocm93IG5ldyBlcnJvcnMuRVJSX09VVF9PRl9SQU5HRSgndmFsdWUnLCByYW5nZSwgdmFsdWUpXG4gIH1cbiAgY2hlY2tCb3VuZHMoYnVmLCBvZmZzZXQsIGJ5dGVMZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTnVtYmVyICh2YWx1ZSwgbmFtZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRVJSX0lOVkFMSURfQVJHX1RZUEUobmFtZSwgJ251bWJlcicsIHZhbHVlKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJvdW5kc0Vycm9yICh2YWx1ZSwgbGVuZ3RoLCB0eXBlKSB7XG4gIGlmIChNYXRoLmZsb29yKHZhbHVlKSAhPT0gdmFsdWUpIHtcbiAgICB2YWxpZGF0ZU51bWJlcih2YWx1ZSwgdHlwZSlcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9PVVRfT0ZfUkFOR0UodHlwZSB8fCAnb2Zmc2V0JywgJ2FuIGludGVnZXInLCB2YWx1ZSlcbiAgfVxuXG4gIGlmIChsZW5ndGggPCAwKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5FUlJfQlVGRkVSX09VVF9PRl9CT1VORFMoKVxuICB9XG5cbiAgdGhyb3cgbmV3IGVycm9ycy5FUlJfT1VUX09GX1JBTkdFKHR5cGUgfHwgJ29mZnNldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPj0gJHt0eXBlID8gMSA6IDB9IGFuZCA8PSAke2xlbmd0aH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUpXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuY29uc3QgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSB0YWtlcyBlcXVhbCBzaWducyBhcyBlbmQgb2YgdGhlIEJhc2U2NCBlbmNvZGluZ1xuICBzdHIgPSBzdHIuc3BsaXQoJz0nKVswXVxuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIGxldCBjb2RlUG9pbnRcbiAgY29uc3QgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICBsZXQgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgY29uc3QgYnl0ZXMgPSBbXVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICBjb25zdCBieXRlQXJyYXkgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIGxldCBjLCBoaSwgbG9cbiAgY29uc3QgYnl0ZUFycmF5ID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBsZXQgaVxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuLy8gQXJyYXlCdWZmZXIgb3IgVWludDhBcnJheSBvYmplY3RzIGZyb20gb3RoZXIgY29udGV4dHMgKGkuZS4gaWZyYW1lcykgZG8gbm90IHBhc3Ncbi8vIHRoZSBgaW5zdGFuY2VvZmAgY2hlY2sgYnV0IHRoZXkgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgb2YgdGhhdCB0eXBlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTY2XG5mdW5jdGlvbiBpc0luc3RhbmNlIChvYmosIHR5cGUpIHtcbiAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIHR5cGUgfHxcbiAgICAob2JqICE9IG51bGwgJiYgb2JqLmNvbnN0cnVjdG9yICE9IG51bGwgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWUgIT0gbnVsbCAmJlxuICAgICAgb2JqLmNvbnN0cnVjdG9yLm5hbWUgPT09IHR5cGUubmFtZSlcbn1cbmZ1bmN0aW9uIG51bWJlcklzTmFOIChvYmopIHtcbiAgLy8gRm9yIElFMTEgc3VwcG9ydFxuICByZXR1cm4gb2JqICE9PSBvYmogLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cblxuLy8gQ3JlYXRlIGxvb2t1cCB0YWJsZSBmb3IgYHRvU3RyaW5nKCdoZXgnKWBcbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzIxOVxuY29uc3QgaGV4U2xpY2VMb29rdXBUYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGFscGhhYmV0ID0gJzAxMjM0NTY3ODlhYmNkZWYnXG4gIGNvbnN0IHRhYmxlID0gbmV3IEFycmF5KDI1NilcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgY29uc3QgaTE2ID0gaSAqIDE2XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxNjsgKytqKSB7XG4gICAgICB0YWJsZVtpMTYgKyBqXSA9IGFscGhhYmV0W2ldICsgYWxwaGFiZXRbal1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhYmxlXG59KSgpXG5cbi8vIFJldHVybiBub3QgZnVuY3Rpb24gd2l0aCBFcnJvciBpZiBCaWdJbnQgbm90IHN1cHBvcnRlZFxuZnVuY3Rpb24gZGVmaW5lQmlnSW50TWV0aG9kIChmbikge1xuICByZXR1cm4gdHlwZW9mIEJpZ0ludCA9PT0gJ3VuZGVmaW5lZCcgPyBCdWZmZXJCaWdJbnROb3REZWZpbmVkIDogZm5cbn1cblxuZnVuY3Rpb24gQnVmZmVyQmlnSW50Tm90RGVmaW5lZCAoKSB7XG4gIHRocm93IG5ldyBFcnJvcignQmlnSW50IG5vdCBzdXBwb3J0ZWQnKVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbFxudmFyIFJlZmxlY3RBcHBseSA9IFIgJiYgdHlwZW9mIFIuYXBwbHkgPT09ICdmdW5jdGlvbidcbiAgPyBSLmFwcGx5XG4gIDogZnVuY3Rpb24gUmVmbGVjdEFwcGx5KHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodGFyZ2V0LCByZWNlaXZlciwgYXJncyk7XG4gIH1cblxudmFyIFJlZmxlY3RPd25LZXlzXG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzXG59IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xuICB9O1xufSBlbHNlIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG5cbnZhciBOdW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBOdW1iZXJJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbm1vZHVsZS5leHBvcnRzLm9uY2UgPSBvbmNlO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50c0NvdW50ID0gMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInIHx8IGFyZyA8IDAgfHwgTnVtYmVySXNOYU4oYXJnKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcImRlZmF1bHRNYXhMaXN0ZW5lcnNcIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgYXJnICsgJy4nKTtcbiAgICB9XG4gICAgZGVmYXVsdE1heExpc3RlbmVycyA9IGFyZztcbiAgfVxufSk7XG5cbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYgKHRoaXMuX2V2ZW50cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLl9ldmVudHMgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5fZXZlbnRzKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufTtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pIHtcbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuIDwgMCB8fCBOdW1iZXJJc05hTihuKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJuXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIG4gKyAnLicpO1xuICB9XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gX2dldE1heExpc3RlbmVycyh0aGF0KSB7XG4gIGlmICh0aGF0Ll9tYXhMaXN0ZW5lcnMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIHJldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnM7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZ2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gX2dldE1heExpc3RlbmVycyh0aGlzKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZClcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09PSB1bmRlZmluZWQpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIHZhciBlcjtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKVxuICAgICAgZXIgPSBhcmdzWzBdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tbWVudHMgb24gdGhlIGB0aHJvd2AgbGluZXMgYXJlIGludGVudGlvbmFsLCB0aGV5IHNob3dcbiAgICAgIC8vIHVwIGluIE5vZGUncyBvdXRwdXQgaWYgdGhpcyByZXN1bHRzIGluIGFuIHVuaGFuZGxlZCBleGNlcHRpb24uXG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9XG4gICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuaGFuZGxlZCBlcnJvci4nICsgKGVyID8gJyAoJyArIGVyLm1lc3NhZ2UgKyAnKScgOiAnJykpO1xuICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgdGhyb3cgZXJyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG5cbiAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUmVmbGVjdEFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBSZWZsZWN0QXBwbHkobGlzdGVuZXJzW2ldLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICArK3RhcmdldC5fZXZlbnRzQ291bnQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9XG4gICAgICAgIHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIH0gZWxzZSBpZiAocHJlcGVuZCkge1xuICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgbSA9IF9nZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtcbiAgICBpZiAobSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSAmJiAhZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgLy8gTm8gZXJyb3IgY29kZSBmb3IgdGhpcyBzaW5jZSBpdCBpcyBhIFdhcm5pbmdcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgdmFyIHcgPSBuZXcgRXJyb3IoJ1Bvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIFN0cmluZyh0eXBlKSArICcgbGlzdGVuZXJzICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnaW5jcmVhc2UgbGltaXQnKTtcbiAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgdy5lbWl0dGVyID0gdGFyZ2V0O1xuICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICBQcm9jZXNzRW1pdFdhcm5pbmcodyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9O1xuXG5mdW5jdGlvbiBvbmNlV3JhcHBlcigpIHtcbiAgaWYgKCF0aGlzLmZpcmVkKSB7XG4gICAgdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLndyYXBGbik7XG4gICAgdGhpcy5maXJlZCA9IHRydWU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0KTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCwgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBvbmNlV3JhcHBlci5iaW5kKHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgdGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4vLyBFbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWYgYW5kIG9ubHkgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0LCBldmVudHMsIHBvc2l0aW9uLCBpLCBvcmlnaW5hbExpc3RlbmVyO1xuXG4gICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgbGlzdCA9IGV2ZW50c1t0eXBlXTtcbiAgICAgIGlmIChsaXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3QubGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgb3JpZ2luYWxMaXN0ZW5lciA9IGxpc3RbaV0ubGlzdGVuZXI7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gMClcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpXG4gICAgICAgICAgZXZlbnRzW3R5cGVdID0gbGlzdFswXTtcblxuICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIG9yaWdpbmFsTGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycywgZXZlbnRzLCBpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZXZlbnRzKTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBMSUZPIG9yZGVyXG4gICAgICAgIGZvciAoaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5mdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCwgdHlwZSwgdW53cmFwKSB7XG4gIHZhciBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuICBpZiAoZXZsaXN0ZW5lciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHVud3JhcCA/IFtldmxpc3RlbmVyLmxpc3RlbmVyIHx8IGV2bGlzdGVuZXJdIDogW2V2bGlzdGVuZXJdO1xuXG4gIHJldHVybiB1bndyYXAgP1xuICAgIHVud3JhcExpc3RlbmVycyhldmxpc3RlbmVyKSA6IGFycmF5Q2xvbmUoZXZsaXN0ZW5lciwgZXZsaXN0ZW5lci5sZW5ndGgpO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIHRydWUpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnMgPSBmdW5jdGlvbiByYXdMaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLmxpc3RlbmVyQ291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5lckNvdW50LmNhbGwoZW1pdHRlciwgdHlwZSk7XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGxpc3RlbmVyQ291bnQ7XG5mdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChldmxpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3RPd25LZXlzKHRoaXMuX2V2ZW50cykgOiBbXTtcbn07XG5cbmZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLCBuKSB7XG4gIHZhciBjb3B5ID0gbmV3IEFycmF5KG4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSlcbiAgICBjb3B5W2ldID0gYXJyW2ldO1xuICByZXR1cm4gY29weTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAoOyBpbmRleCArIDEgPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKylcbiAgICBsaXN0W2luZGV4XSA9IGxpc3RbaW5kZXggKyAxXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycikge1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJldC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGFycltpXS5saXN0ZW5lciB8fCBhcnJbaV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gb25jZShlbWl0dGVyLCBuYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lcihlcnIpIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobmFtZSwgcmVzb2x2ZXIpO1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZXIoKSB7XG4gICAgICBpZiAodHlwZW9mIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBlcnJvckxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xuXG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIHJlc29sdmVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgaWYgKG5hbWUgIT09ICdlcnJvcicpIHtcbiAgICAgIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGVycm9yTGlzdGVuZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFcnJvckhhbmRsZXJJZkV2ZW50RW1pdHRlcihlbWl0dGVyLCBoYW5kbGVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgJ2Vycm9yJywgaGFuZGxlciwgZmxhZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCBuYW1lLCBsaXN0ZW5lciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgIGVtaXR0ZXIub25jZShuYW1lLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtaXR0ZXIub24obmFtZSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gRXZlbnRUYXJnZXQgZG9lcyBub3QgaGF2ZSBgZXJyb3JgIGV2ZW50IHNlbWFudGljcyBsaWtlIE5vZGVcbiAgICAvLyBFdmVudEVtaXR0ZXJzLCB3ZSBkbyBub3QgbGlzdGVuIGZvciBgZXJyb3JgIGV2ZW50cyBoZXJlLlxuICAgIGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmdW5jdGlvbiB3cmFwTGlzdGVuZXIoYXJnKSB7XG4gICAgICAvLyBJRSBkb2VzIG5vdCBoYXZlIGJ1aWx0aW4gYHsgb25jZTogdHJ1ZSB9YCBzdXBwb3J0IHNvIHdlXG4gICAgICAvLyBoYXZlIHRvIGRvIGl0IG1hbnVhbGx5LlxuICAgICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIHdyYXBMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBsaXN0ZW5lcihhcmcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImVtaXR0ZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRXZlbnRFbWl0dGVyLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgZW1pdHRlcik7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpOyAvKiBlc2xpbnQgbm8tY29udGludWU6IDAgKi9cblxuXG52YXIgX2djb2RlUGFyc2VyID0gcmVxdWlyZSgnZ2NvZGUtcGFyc2VyJyk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IGNvbXBvc2VkIGZyb20gYXJyYXlzIG9mIHByb3BlcnR5IG5hbWVzIGFuZCB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICogICBmcm9tUGFpcnMoW1snYScsIDFdLCBbJ2InLCAyXV0pO1xuICogICAvLyA9PiB7ICdhJzogMSwgJ2InOiAyIH1cbiAqL1xudmFyIGZyb21QYWlycyA9IGZ1bmN0aW9uIGZyb21QYWlycyhwYWlycykge1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIHZhciBsZW5ndGggPSAhcGFpcnMgPyAwIDogcGFpcnMubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciBwYWlyID0gcGFpcnNbaW5kZXhdO1xuICAgICAgICByZXN1bHRbcGFpclswXV0gPSBwYWlyWzFdO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG52YXIgcGFydGl0aW9uV29yZHNCeUdyb3VwID0gZnVuY3Rpb24gcGFydGl0aW9uV29yZHNCeUdyb3VwKCkge1xuICAgIHZhciB3b3JkcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG5cbiAgICB2YXIgZ3JvdXBzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciB3b3JkID0gd29yZHNbaV07XG4gICAgICAgIHZhciBsZXR0ZXIgPSB3b3JkWzBdO1xuXG4gICAgICAgIGlmIChsZXR0ZXIgPT09ICdHJyB8fCBsZXR0ZXIgPT09ICdNJyB8fCBsZXR0ZXIgPT09ICdUJykge1xuICAgICAgICAgICAgZ3JvdXBzLnB1c2goW3dvcmRdKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdyb3Vwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBncm91cHNbZ3JvdXBzLmxlbmd0aCAtIDFdLnB1c2god29yZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncm91cHMucHVzaChbd29yZF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3Vwcztcbn07XG5cbnZhciBpbnRlcnByZXQgPSBmdW5jdGlvbiBpbnRlcnByZXQoc2VsZiwgZGF0YSkge1xuICAgIHZhciBncm91cHMgPSBwYXJ0aXRpb25Xb3Jkc0J5R3JvdXAoZGF0YS53b3Jkcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgd29yZHMgPSBncm91cHNbaV07XG4gICAgICAgIHZhciB3b3JkID0gd29yZHNbMF0gfHwgW107XG4gICAgICAgIHZhciBsZXR0ZXIgPSB3b3JkWzBdO1xuICAgICAgICB2YXIgY29kZSA9IHdvcmRbMV07XG4gICAgICAgIHZhciBjbWQgPSAnJztcbiAgICAgICAgdmFyIGFyZ3MgPSB7fTtcblxuICAgICAgICBpZiAobGV0dGVyID09PSAnRycpIHtcbiAgICAgICAgICAgIGNtZCA9IGxldHRlciArIGNvZGU7XG4gICAgICAgICAgICBhcmdzID0gZnJvbVBhaXJzKHdvcmRzLnNsaWNlKDEpKTtcblxuICAgICAgICAgICAgLy8gTW90aW9uIE1vZGVcbiAgICAgICAgICAgIGlmIChjb2RlID09PSAwIHx8IGNvZGUgPT09IDEgfHwgY29kZSA9PT0gMiB8fCBjb2RlID09PSAzIHx8IGNvZGUgPT09IDM4LjIgfHwgY29kZSA9PT0gMzguMyB8fCBjb2RlID09PSAzOC40IHx8IGNvZGUgPT09IDM4LjUpIHtcbiAgICAgICAgICAgICAgICBzZWxmLm1vdGlvbk1vZGUgPSBjbWQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDgwKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5tb3Rpb25Nb2RlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobGV0dGVyID09PSAnTScpIHtcbiAgICAgICAgICAgIGNtZCA9IGxldHRlciArIGNvZGU7XG4gICAgICAgICAgICBhcmdzID0gZnJvbVBhaXJzKHdvcmRzLnNsaWNlKDEpKTtcbiAgICAgICAgfSBlbHNlIGlmIChsZXR0ZXIgPT09ICdUJykge1xuICAgICAgICAgICAgLy8gVDEgOyB3L28gTTZcbiAgICAgICAgICAgIGNtZCA9IGxldHRlcjtcbiAgICAgICAgICAgIGFyZ3MgPSBjb2RlO1xuICAgICAgICB9IGVsc2UgaWYgKGxldHRlciA9PT0gJ0YnKSB7XG4gICAgICAgICAgICAvLyBGNzUwIDsgdy9vIG1vdGlvbiBjb21tYW5kXG4gICAgICAgICAgICBjbWQgPSBsZXR0ZXI7XG4gICAgICAgICAgICBhcmdzID0gY29kZTtcbiAgICAgICAgfSBlbHNlIGlmIChsZXR0ZXIgPT09ICdYJyB8fCBsZXR0ZXIgPT09ICdZJyB8fCBsZXR0ZXIgPT09ICdaJyB8fCBsZXR0ZXIgPT09ICdBJyB8fCBsZXR0ZXIgPT09ICdCJyB8fCBsZXR0ZXIgPT09ICdDJyB8fCBsZXR0ZXIgPT09ICdJJyB8fCBsZXR0ZXIgPT09ICdKJyB8fCBsZXR0ZXIgPT09ICdLJykge1xuICAgICAgICAgICAgLy8gVXNlIHByZXZpb3VzIG1vdGlvbiBjb21tYW5kIGlmIHRoZSBsaW5lIGRvZXMgbm90IHN0YXJ0IHdpdGggRy1jb2RlIG9yIE0tY29kZS5cbiAgICAgICAgICAgIC8vIEBleGFtcGxlXG4gICAgICAgICAgICAvLyAgIEcwIFowLjI1XG4gICAgICAgICAgICAvLyAgIFgtMC41IFkwLlxuICAgICAgICAgICAgLy8gICBaMC4xXG4gICAgICAgICAgICAvLyAgIEcwMSBaMC4gRjUuXG4gICAgICAgICAgICAvLyAgIEcyIFgwLjUgWTAuIEkwLiBKLTAuNVxuICAgICAgICAgICAgLy8gICBYMC4gWS0wLjUgSS0wLjUgSjAuXG4gICAgICAgICAgICAvLyAgIFgtMC41IFkwLiBJMC4gSjAuNVxuICAgICAgICAgICAgLy8gQGV4YW1wbGVcbiAgICAgICAgICAgIC8vICAgRzAxXG4gICAgICAgICAgICAvLyAgIE0wMyBTMFxuICAgICAgICAgICAgLy8gICBYNS4yIFkwLjIgTTAzIFMwXG4gICAgICAgICAgICAvLyAgIFg1LjMgWTAuMSBNMDMgUzEwMDBcbiAgICAgICAgICAgIC8vICAgWDUuNCBZMCBNMDMgUzBcbiAgICAgICAgICAgIC8vICAgWDUuNSBZMCBNMDMgUzBcbiAgICAgICAgICAgIGNtZCA9IHNlbGYubW90aW9uTW9kZTtcbiAgICAgICAgICAgIGFyZ3MgPSBmcm9tUGFpcnMod29yZHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjbWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzZWxmLmhhbmRsZXJzW2NtZF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBmdW5jID0gc2VsZi5oYW5kbGVyc1tjbWRdO1xuICAgICAgICAgICAgZnVuYyhhcmdzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZi5kZWZhdWx0SGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc2VsZi5kZWZhdWx0SGFuZGxlcihjbWQsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzZWxmW2NtZF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBfZnVuYyA9IHNlbGZbY21kXS5iaW5kKHNlbGYpO1xuICAgICAgICAgICAgX2Z1bmMoYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgSW50ZXJwcmV0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSW50ZXJwcmV0ZXIob3B0aW9ucykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSW50ZXJwcmV0ZXIpO1xuXG4gICAgICAgIHRoaXMubW90aW9uTW9kZSA9ICdHMCc7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSB7fTtcblxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLmhhbmRsZXJzID0gb3B0aW9ucy5oYW5kbGVycyB8fCB7fTtcbiAgICAgICAgdGhpcy5kZWZhdWx0SGFuZGxlciA9IG9wdGlvbnMuZGVmYXVsdEhhbmRsZXI7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEludGVycHJldGVyLCBbe1xuICAgICAgICBrZXk6ICdsb2FkRnJvbVN0cmVhbScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkRnJvbVN0cmVhbShzdHJlYW0pIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbm9vcDtcblxuICAgICAgICAgICAgdmFyIHMgPSAoMCwgX2djb2RlUGFyc2VyLnBhcnNlU3RyZWFtKShzdHJlYW0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHMub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGludGVycHJldChfdGhpcywgZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdsb2FkRnJvbUZpbGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZEZyb21GaWxlKGZpbGUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG5vb3A7XG5cbiAgICAgICAgICAgIHZhciBzID0gKDAsIF9nY29kZVBhcnNlci5wYXJzZUZpbGUpKGZpbGUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHMub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGludGVycHJldChfdGhpczIsIGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnbG9hZEZyb21GaWxlU3luYycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkRnJvbUZpbGVTeW5jKGZpbGUpIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbm9vcDtcblxuICAgICAgICAgICAgdmFyIGxpc3QgPSAoMCwgX2djb2RlUGFyc2VyLnBhcnNlRmlsZVN5bmMpKGZpbGUpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0KHRoaXMsIGxpc3RbaV0pO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGxpc3RbaV0sIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2xvYWRGcm9tU3RyaW5nJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWRGcm9tU3RyaW5nKHN0cikge1xuICAgICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbm9vcDtcblxuICAgICAgICAgICAgdmFyIHMgPSAoMCwgX2djb2RlUGFyc2VyLnBhcnNlU3RyaW5nKShzdHIsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHMub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGludGVycHJldChfdGhpczMsIGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnbG9hZEZyb21TdHJpbmdTeW5jJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWRGcm9tU3RyaW5nU3luYyhzdHIpIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbm9vcDtcblxuICAgICAgICAgICAgdmFyIGxpc3QgPSAoMCwgX2djb2RlUGFyc2VyLnBhcnNlU3RyaW5nU3luYykoc3RyKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGludGVycHJldCh0aGlzLCBsaXN0W2ldKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhsaXN0W2ldLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEludGVycHJldGVyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBJbnRlcnByZXRlcjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfSW50ZXJwcmV0ZXIgPSByZXF1aXJlKCcuL0ludGVycHJldGVyJyk7XG5cbnZhciBfSW50ZXJwcmV0ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfSW50ZXJwcmV0ZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9JbnRlcnByZXRlcjIuZGVmYXVsdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucGFyc2VTdHJpbmdTeW5jID0gZXhwb3J0cy5wYXJzZVN0cmluZyA9IGV4cG9ydHMucGFyc2VGaWxlU3luYyA9IGV4cG9ydHMucGFyc2VGaWxlID0gZXhwb3J0cy5wYXJzZVN0cmVhbSA9IGV4cG9ydHMucGFyc2VMaW5lID0gZXhwb3J0cy5HQ29kZUxpbmVTdHJlYW0gPSB2b2lkIDA7XG5cbnZhciBfZXZlbnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiZXZlbnRzXCIpKTtcblxudmFyIF9mcyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcImZzXCIpKTtcblxudmFyIF90aW1lcnMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJ0aW1lcnNcIikpO1xuXG52YXIgX3N0cmVhbSA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJzdHJlYW1cIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmpbXCJkZWZhdWx0XCJdID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTsgdmFyIG93bktleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpOyBpZiAodHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09ICdmdW5jdGlvbicpIHsgb3duS2V5cyA9IG93bktleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlKS5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHN5bSkuZW51bWVyYWJsZTsgfSkpOyB9IG93bktleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG52YXIgc3RyZWFtaWZ5ID0gZnVuY3Rpb24gc3RyZWFtaWZ5KHRleHQpIHtcbiAgdmFyIHMgPSBuZXcgX3N0cmVhbVtcImRlZmF1bHRcIl0uUmVhZGFibGUoKTtcbiAgcy5wdXNoKHRleHQpO1xuICBzLnB1c2gobnVsbCk7XG4gIHJldHVybiBzO1xufTtcblxudmFyIGNvbnRhaW5zTGluZUVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlID0gbmV3IFJlZ0V4cCgvLiooPzpcXHJcXG58XFxyfFxcbikvZyk7XG4gIHJldHVybiBmdW5jdGlvbiAocykge1xuICAgIHJldHVybiAhIXMubWF0Y2gocmUpO1xuICB9O1xufSgpOyAvLyBAcGFyYW0ge2FycmF5fSBhcnIgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbi8vIEBwYXJhbSB7b2JqZWN0fSBvcHRzIFRoZSBvcHRpb25zIG9iamVjdC5cbi8vIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuLy8gQHBhcmFtIHtmdW5jdGlvbn0gZG9uZSBUaGUgZG9uZSBpbnZva2VkIGFmdGVyIHRoZSBsb29wIGhhcyBmaW5pc2hlZC5cblxuXG52YXIgaXRlcmF0ZUFycmF5ID0gZnVuY3Rpb24gaXRlcmF0ZUFycmF5KCkge1xuICB2YXIgYXJyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbXTtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICB2YXIgaXRlcmF0ZWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG5vb3A7XG4gIHZhciBkb25lID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBub29wO1xuXG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGRvbmUgPSBpdGVyYXRlZTtcbiAgICBpdGVyYXRlZSA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9XG5cbiAgb3B0cy5iYXRjaFNpemUgPSBvcHRzLmJhdGNoU2l6ZSB8fCAxO1xuXG4gIHZhciBsb29wID0gZnVuY3Rpb24gbG9vcCgpIHtcbiAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogMDtcblxuICAgIGZvciAodmFyIGNvdW50ID0gMDsgaSA8IGFyci5sZW5ndGggJiYgY291bnQgPCBvcHRzLmJhdGNoU2l6ZTsgKytpLCArK2NvdW50KSB7XG4gICAgICBpdGVyYXRlZShhcnJbaV0sIGksIGFycik7XG4gICAgfVxuXG4gICAgaWYgKGkgPCBhcnIubGVuZ3RoKSB7XG4gICAgICBfdGltZXJzW1wiZGVmYXVsdFwiXS5zZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbG9vcChpKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZG9uZSgpO1xuICB9O1xuXG4gIGxvb3AoKTtcbn07IC8vIEBwYXJhbSB7c3RyaW5nfSBsaW5lIFRoZSBHLWNvZGUgbGluZVxuXG5cbnZhciBwYXJzZUxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIGh0dHA6Ly9yZXByYXAub3JnL3dpa2kvRy1jb2RlI1NwZWNpYWxfZmllbGRzXG4gIC8vIFRoZSBjaGVja3N1bSBcImNzXCIgZm9yIGEgR0NvZGUgc3RyaW5nIFwiY21kXCIgKGluY2x1ZGluZyBpdHMgbGluZSBudW1iZXIpIGlzIGNvbXB1dGVkXG4gIC8vIGJ5IGV4b3ItaW5nIHRoZSBieXRlcyBpbiB0aGUgc3RyaW5nIHVwIHRvIGFuZCBub3QgaW5jbHVkaW5nIHRoZSAqIGNoYXJhY3Rlci5cbiAgdmFyIGNvbXB1dGVDaGVja3N1bSA9IGZ1bmN0aW9uIGNvbXB1dGVDaGVja3N1bShzKSB7XG4gICAgcyA9IHMgfHwgJyc7XG5cbiAgICBpZiAocy5sYXN0SW5kZXhPZignKicpID49IDApIHtcbiAgICAgIHMgPSBzLnN1YnN0cigwLCBzLmxhc3RJbmRleE9mKCcqJykpO1xuICAgIH1cblxuICAgIHZhciBjcyA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBjID0gc1tpXS5jaGFyQ29kZUF0KDApO1xuICAgICAgY3MgXj0gYztcbiAgICB9XG5cbiAgICByZXR1cm4gY3M7XG4gIH07IC8vIGh0dHA6Ly9saW51eGNuYy5vcmcvZG9jcy9odG1sL2djb2RlL292ZXJ2aWV3Lmh0bWwjZ2NvZGU6Y29tbWVudHNcbiAgLy8gQ29tbWVudHMgY2FuIGJlIGVtYmVkZGVkIGluIGEgbGluZSB1c2luZyBwYXJlbnRoZXNlcyAoKSBvciBmb3IgdGhlIHJlbWFpbmRlciBvZiBhIGxpbmV1c2luZyBhIHNlbWktY29sb24uIFRoZSBzZW1pLWNvbG9uIGlzIG5vdCB0cmVhdGVkIGFzIHRoZSBzdGFydCBvZiBhIGNvbW1lbnQgd2hlbiBlbmNsb3NlZCBpbiBwYXJlbnRoZXNlcy5cblxuXG4gIHZhciBzdHJpcENvbW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZTEgPSBuZXcgUmVnRXhwKC9cXHMqXFwoW15cXCldKlxcKS9nKTsgLy8gUmVtb3ZlIGFueXRoaW5nIGluc2lkZSB0aGUgcGFyZW50aGVzZXNcblxuICAgIHZhciByZTIgPSBuZXcgUmVnRXhwKC9cXHMqOy4qL2cpOyAvLyBSZW1vdmUgYW55dGhpbmcgYWZ0ZXIgYSBzZW1pLWNvbG9uIHRvIHRoZSBlbmQgb2YgdGhlIGxpbmUsIGluY2x1ZGluZyBwcmVjZWRpbmcgc3BhY2VzXG5cbiAgICB2YXIgcmUzID0gbmV3IFJlZ0V4cCgvXFxzKy9nKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgIHJldHVybiBsaW5lLnJlcGxhY2UocmUxLCAnJykucmVwbGFjZShyZTIsICcnKS5yZXBsYWNlKHJlMywgJycpO1xuICAgIH07XG4gIH0oKTtcblxuICB2YXIgcmUgPSAvKCUuKil8KHsuKil8KCg/OlxcJFxcJCl8KD86XFwkW2EtekEtWjAtOSNdKikpfChbYS16QS1aXVswLTlcXCtcXC1cXC5dKyl8KFxcKlswLTldKykvaWdtO1xuICByZXR1cm4gZnVuY3Rpb24gKGxpbmUsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLmZsYXR0ZW4gPSAhIW9wdGlvbnMuZmxhdHRlbjtcbiAgICBvcHRpb25zLm5vUGFyc2VMaW5lID0gISFvcHRpb25zLm5vUGFyc2VMaW5lO1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBsaW5lOiBsaW5lXG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zLm5vUGFyc2VMaW5lKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJlc3VsdC53b3JkcyA9IFtdO1xuICAgIHZhciBsbjsgLy8gTGluZSBudW1iZXJcblxuICAgIHZhciBjczsgLy8gQ2hlY2tzdW1cblxuICAgIHZhciB3b3JkcyA9IHN0cmlwQ29tbWVudHMobGluZSkubWF0Y2gocmUpIHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIHdvcmQgPSB3b3Jkc1tpXTtcbiAgICAgIHZhciBsZXR0ZXIgPSB3b3JkWzBdLnRvVXBwZXJDYXNlKCk7XG4gICAgICB2YXIgYXJndW1lbnQgPSB3b3JkLnNsaWNlKDEpOyAvLyBQYXJzZSAlIGNvbW1hbmRzIGZvciBiQ05DIGFuZCBDTkNqc1xuICAgICAgLy8gLSAld2FpdCBXYWl0IHVudGlsIHRoZSBwbGFubmVyIHF1ZXVlIGlzIGVtcHR5XG5cbiAgICAgIGlmIChsZXR0ZXIgPT09ICclJykge1xuICAgICAgICByZXN1bHQuY21kcyA9IChyZXN1bHQuY21kcyB8fCBbXSkuY29uY2F0KGxpbmUudHJpbSgpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IC8vIFBhcnNlIEpTT04gY29tbWFuZHMgZm9yIFRpbnlHIGFuZCBnMmNvcmVcblxuXG4gICAgICBpZiAobGV0dGVyID09PSAneycpIHtcbiAgICAgICAgcmVzdWx0LmNtZHMgPSAocmVzdWx0LmNtZHMgfHwgW10pLmNvbmNhdChsaW5lLnRyaW0oKSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSAvLyBQYXJzZSAkIGNvbW1hbmRzIGZvciBHcmJsXG4gICAgICAvLyAtICRDIENoZWNrIGdjb2RlIG1vZGVcbiAgICAgIC8vIC0gJEggUnVuIGhvbWluZyBjeWNsZVxuXG5cbiAgICAgIGlmIChsZXR0ZXIgPT09ICckJykge1xuICAgICAgICByZXN1bHQuY21kcyA9IChyZXN1bHQuY21kcyB8fCBbXSkuY29uY2F0KFwiXCIuY29uY2F0KGxldHRlcikuY29uY2F0KGFyZ3VtZW50KSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSAvLyBOOiBMaW5lIG51bWJlclxuXG5cbiAgICAgIGlmIChsZXR0ZXIgPT09ICdOJyAmJiB0eXBlb2YgbG4gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIExpbmUgKGJsb2NrKSBudW1iZXIgaW4gcHJvZ3JhbVxuICAgICAgICBsbiA9IE51bWJlcihhcmd1bWVudCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSAvLyAqOiBDaGVja3N1bVxuXG5cbiAgICAgIGlmIChsZXR0ZXIgPT09ICcqJyAmJiB0eXBlb2YgY3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNzID0gTnVtYmVyKGFyZ3VtZW50KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZSA9IE51bWJlcihhcmd1bWVudCk7XG5cbiAgICAgIGlmIChOdW1iZXIuaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gYXJndW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmZsYXR0ZW4pIHtcbiAgICAgICAgcmVzdWx0LndvcmRzLnB1c2gobGV0dGVyICsgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LndvcmRzLnB1c2goW2xldHRlciwgdmFsdWVdKTtcbiAgICAgIH1cbiAgICB9IC8vIExpbmUgbnVtYmVyXG5cblxuICAgIHR5cGVvZiBsbiAhPT0gJ3VuZGVmaW5lZCcgJiYgKHJlc3VsdC5sbiA9IGxuKTsgLy8gQ2hlY2tzdW1cblxuICAgIHR5cGVvZiBjcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHJlc3VsdC5jcyA9IGNzKTtcblxuICAgIGlmIChyZXN1bHQuY3MgJiYgY29tcHV0ZUNoZWNrc3VtKGxpbmUpICE9PSByZXN1bHQuY3MpIHtcbiAgICAgIHJlc3VsdC5lcnIgPSB0cnVlOyAvLyBjaGVja3N1bSBmYWlsZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpOyAvLyBAcGFyYW0ge29iamVjdH0gc3RyZWFtIFRoZSBHLWNvZGUgbGluZSBzdHJlYW1cbi8vIEBwYXJhbSB7b3B0aW9uc30gb3B0aW9ucyBUaGUgb3B0aW9ucyBvYmplY3Rcbi8vIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuXG5cbmV4cG9ydHMucGFyc2VMaW5lID0gcGFyc2VMaW5lO1xuXG52YXIgcGFyc2VTdHJlYW0gPSBmdW5jdGlvbiBwYXJzZVN0cmVhbShzdHJlYW0sIG9wdGlvbnMpIHtcbiAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBub29wO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgZW1pdHRlciA9IG5ldyBfZXZlbnRzW1wiZGVmYXVsdFwiXS5FdmVudEVtaXR0ZXIoKTtcblxuICB0cnkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgc3RyZWFtLnBpcGUobmV3IEdDb2RlTGluZVN0cmVhbShvcHRpb25zKSkub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgZW1pdHRlci5lbWl0KCdkYXRhJywgZGF0YSk7XG4gICAgICByZXN1bHRzLnB1c2goZGF0YSk7XG4gICAgfSkub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGVtaXR0ZXIuZW1pdCgnZW5kJywgcmVzdWx0cyk7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICB9KS5vbignZXJyb3InLCBjYWxsYmFjayk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH1cblxuICByZXR1cm4gZW1pdHRlcjtcbn07IC8vIEBwYXJhbSB7c3RyaW5nfSBmaWxlIFRoZSBHLWNvZGUgcGF0aCBuYW1lXG4vLyBAcGFyYW0ge29wdGlvbnN9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0XG4vLyBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cblxuXG5leHBvcnRzLnBhcnNlU3RyZWFtID0gcGFyc2VTdHJlYW07XG5cbnZhciBwYXJzZUZpbGUgPSBmdW5jdGlvbiBwYXJzZUZpbGUoZmlsZSwgb3B0aW9ucykge1xuICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG5vb3A7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGZpbGUgPSBmaWxlIHx8ICcnO1xuXG4gIHZhciBzID0gX2ZzW1wiZGVmYXVsdFwiXS5jcmVhdGVSZWFkU3RyZWFtKGZpbGUsIHtcbiAgICBlbmNvZGluZzogJ3V0ZjgnXG4gIH0pO1xuXG4gIHMub24oJ2Vycm9yJywgY2FsbGJhY2spO1xuICByZXR1cm4gcGFyc2VTdHJlYW0ocywgb3B0aW9ucywgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cy5wYXJzZUZpbGUgPSBwYXJzZUZpbGU7XG5cbnZhciBwYXJzZUZpbGVTeW5jID0gZnVuY3Rpb24gcGFyc2VGaWxlU3luYyhmaWxlLCBvcHRpb25zKSB7XG4gIHJldHVybiBwYXJzZVN0cmluZ1N5bmMoX2ZzW1wiZGVmYXVsdFwiXS5yZWFkRmlsZVN5bmMoZmlsZSwgJ3V0ZjgnKSwgb3B0aW9ucyk7XG59OyAvLyBAcGFyYW0ge3N0cmluZ30gc3RyIFRoZSBHLWNvZGUgdGV4dCBzdHJpbmdcbi8vIEBwYXJhbSB7b3B0aW9uc30gb3B0aW9ucyBUaGUgb3B0aW9ucyBvYmplY3Rcbi8vIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuXG5cbmV4cG9ydHMucGFyc2VGaWxlU3luYyA9IHBhcnNlRmlsZVN5bmM7XG5cbnZhciBwYXJzZVN0cmluZyA9IGZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0ciwgb3B0aW9ucykge1xuICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG5vb3A7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiBwYXJzZVN0cmVhbShzdHJlYW1pZnkoc3RyKSwgb3B0aW9ucywgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cy5wYXJzZVN0cmluZyA9IHBhcnNlU3RyaW5nO1xuXG52YXIgcGFyc2VTdHJpbmdTeW5jID0gZnVuY3Rpb24gcGFyc2VTdHJpbmdTeW5jKHN0ciwgb3B0aW9ucykge1xuICB2YXIgX29wdGlvbnMgPSBfb2JqZWN0U3ByZWFkKHt9LCBvcHRpb25zKSxcbiAgICAgIF9vcHRpb25zJGZsYXR0ZW4gPSBfb3B0aW9ucy5mbGF0dGVuLFxuICAgICAgZmxhdHRlbiA9IF9vcHRpb25zJGZsYXR0ZW4gPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkZmxhdHRlbixcbiAgICAgIF9vcHRpb25zJG5vUGFyc2VMaW5lID0gX29wdGlvbnMubm9QYXJzZUxpbmUsXG4gICAgICBub1BhcnNlTGluZSA9IF9vcHRpb25zJG5vUGFyc2VMaW5lID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJG5vUGFyc2VMaW5lO1xuXG4gIHZhciByZXN1bHRzID0gW107XG4gIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7ICsraSkge1xuICAgIHZhciBsaW5lID0gbGluZXNbaV0udHJpbSgpO1xuXG4gICAgaWYgKGxpbmUubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gcGFyc2VMaW5lKGxpbmUsIHtcbiAgICAgIGZsYXR0ZW46IGZsYXR0ZW4sXG4gICAgICBub1BhcnNlTGluZTogbm9QYXJzZUxpbmVcbiAgICB9KTtcbiAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHRzO1xufTsgLy8gQHBhcmFtIHtzdHJpbmd9IHN0ciBUaGUgRy1jb2RlIHRleHQgc3RyaW5nXG4vLyBAcGFyYW0ge29wdGlvbnN9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0XG5cblxuZXhwb3J0cy5wYXJzZVN0cmluZ1N5bmMgPSBwYXJzZVN0cmluZ1N5bmM7XG5cbnZhciBHQ29kZUxpbmVTdHJlYW0gPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9UcmFuc2Zvcm0pIHtcbiAgX2luaGVyaXRzKEdDb2RlTGluZVN0cmVhbSwgX1RyYW5zZm9ybSk7XG5cbiAgLy8gQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3RcbiAgLy8gQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmJhdGNoU2l6ZV0gVGhlIGJhdGNoIHNpemUuXG4gIC8vIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZmxhdHRlbl0gVHJ1ZSB0byBmbGF0dGVuIHRoZSBhcnJheSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAvLyBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm5vUGFyc2VMaW5lXSBUcnVlIHRvIG5vdCBwYXJzZSBsaW5lLCBmYWxzZSBvdGhlcndpc2UuXG4gIGZ1bmN0aW9uIEdDb2RlTGluZVN0cmVhbSgpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgR0NvZGVMaW5lU3RyZWFtKTtcblxuICAgIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX2dldFByb3RvdHlwZU9mKEdDb2RlTGluZVN0cmVhbSkuY2FsbCh0aGlzLCB7XG4gICAgICBvYmplY3RNb2RlOiB0cnVlXG4gICAgfSkpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInN0YXRlXCIsIHtcbiAgICAgIGxpbmVDb3VudDogMCxcbiAgICAgIGxhc3RDaHVua0VuZGVkV2l0aENSOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIm9wdGlvbnNcIiwge1xuICAgICAgYmF0Y2hTaXplOiAxMDAwLFxuICAgICAgbm9QYXJzZUxpbmU6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwibGluZUJ1ZmZlclwiLCAnJyk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwicmVcIiwgbmV3IFJlZ0V4cCgvLiooPzpcXHJcXG58XFxyfFxcbil8LiskL2cpKTtcblxuICAgIF90aGlzLm9wdGlvbnMgPSBfb2JqZWN0U3ByZWFkKHt9LCBfdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoR0NvZGVMaW5lU3RyZWFtLCBbe1xuICAgIGtleTogXCJfdHJhbnNmb3JtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF90cmFuc2Zvcm0oY2h1bmssIGVuY29kaW5nLCBuZXh0KSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgLy8gZGVjb2RlIGJpbmFyeSBjaHVua3MgYXMgVVRGLThcbiAgICAgIGVuY29kaW5nID0gZW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSkge1xuICAgICAgICBpZiAoZW5jb2RpbmcgPT09ICdidWZmZXInKSB7XG4gICAgICAgICAgZW5jb2RpbmcgPSAndXRmOCc7XG4gICAgICAgIH1cblxuICAgICAgICBjaHVuayA9IGNodW5rLnRvU3RyaW5nKGVuY29kaW5nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5saW5lQnVmZmVyICs9IGNodW5rO1xuXG4gICAgICBpZiAoIWNvbnRhaW5zTGluZUVuZChjaHVuaykpIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBsaW5lcyA9IHRoaXMubGluZUJ1ZmZlci5tYXRjaCh0aGlzLnJlKTtcblxuICAgICAgaWYgKCFsaW5lcyB8fCBsaW5lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IC8vIERvIG5vdCBzcGxpdCBDUkxGIHdoaWNoIHNwYW5zIGNodW5rc1xuXG5cbiAgICAgIGlmICh0aGlzLnN0YXRlLmxhc3RDaHVua0VuZGVkV2l0aENSICYmIGxpbmVzWzBdID09PSAnXFxuJykge1xuICAgICAgICBsaW5lcy5zaGlmdCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXRlLmxhc3RDaHVua0VuZGVkV2l0aENSID0gdGhpcy5saW5lQnVmZmVyW3RoaXMubGluZUJ1ZmZlci5sZW5ndGggLSAxXSA9PT0gJ1xccic7XG5cbiAgICAgIGlmICh0aGlzLmxpbmVCdWZmZXJbdGhpcy5saW5lQnVmZmVyLmxlbmd0aCAtIDFdID09PSAnXFxyJyB8fCB0aGlzLmxpbmVCdWZmZXJbdGhpcy5saW5lQnVmZmVyLmxlbmd0aCAtIDFdID09PSAnXFxuJykge1xuICAgICAgICB0aGlzLmxpbmVCdWZmZXIgPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBsaW5lID0gbGluZXMucG9wKCkgfHwgJyc7XG4gICAgICAgIHRoaXMubGluZUJ1ZmZlciA9IGxpbmU7XG4gICAgICB9XG5cbiAgICAgIGl0ZXJhdGVBcnJheShsaW5lcywge1xuICAgICAgICBiYXRjaFNpemU6IHRoaXMub3B0aW9ucy5iYXRjaFNpemVcbiAgICAgIH0sIGZ1bmN0aW9uIChsaW5lLCBrZXkpIHtcbiAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xuXG4gICAgICAgIGlmIChsaW5lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gcGFyc2VMaW5lKGxpbmUsIHtcbiAgICAgICAgICAgIGZsYXR0ZW46IF90aGlzMi5vcHRpb25zLmZsYXR0ZW4sXG4gICAgICAgICAgICBub1BhcnNlTGluZTogX3RoaXMyLm9wdGlvbnMubm9QYXJzZUxpbmVcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIF90aGlzMi5wdXNoKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH0sIG5leHQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfZmx1c2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2ZsdXNoKGRvbmUpIHtcbiAgICAgIGlmICh0aGlzLmxpbmVCdWZmZXIpIHtcbiAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmxpbmVCdWZmZXIudHJpbSgpO1xuXG4gICAgICAgIGlmIChsaW5lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gcGFyc2VMaW5lKGxpbmUsIHtcbiAgICAgICAgICAgIGZsYXR0ZW46IHRoaXMub3B0aW9ucy5mbGF0dGVuLFxuICAgICAgICAgICAgbm9QYXJzZUxpbmU6IHRoaXMub3B0aW9ucy5ub1BhcnNlTGluZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMucHVzaChyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5saW5lQnVmZmVyID0gJyc7XG4gICAgICAgIHRoaXMuc3RhdGUubGFzdENodW5rRW5kZWRXaXRoQ1IgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZG9uZSgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBHQ29kZUxpbmVTdHJlYW07XG59KF9zdHJlYW0uVHJhbnNmb3JtKTtcblxuZXhwb3J0cy5HQ29kZUxpbmVTdHJlYW0gPSBHQ29kZUxpbmVTdHJlYW07IiwiLyohIGllZWU3NTQuIEJTRC0zLUNsYXVzZSBMaWNlbnNlLiBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmcvb3BlbnNvdXJjZT4gKi9cbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGlmIChzdXBlckN0b3IpIHtcbiAgICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgaWYgKHN1cGVyQ3Rvcikge1xuICAgICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgICB9XG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgY29kZXMgPSB7fTtcblxuZnVuY3Rpb24gY3JlYXRlRXJyb3JUeXBlKGNvZGUsIG1lc3NhZ2UsIEJhc2UpIHtcbiAgaWYgKCFCYXNlKSB7XG4gICAgQmFzZSA9IEVycm9yO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TWVzc2FnZShhcmcxLCBhcmcyLCBhcmczKSB7XG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtZXNzYWdlKGFyZzEsIGFyZzIsIGFyZzMpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBOb2RlRXJyb3IgPVxuICAvKiNfX1BVUkVfXyovXG4gIGZ1bmN0aW9uIChfQmFzZSkge1xuICAgIF9pbmhlcml0c0xvb3NlKE5vZGVFcnJvciwgX0Jhc2UpO1xuXG4gICAgZnVuY3Rpb24gTm9kZUVycm9yKGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgIHJldHVybiBfQmFzZS5jYWxsKHRoaXMsIGdldE1lc3NhZ2UoYXJnMSwgYXJnMiwgYXJnMykpIHx8IHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIE5vZGVFcnJvcjtcbiAgfShCYXNlKTtcblxuICBOb2RlRXJyb3IucHJvdG90eXBlLm5hbWUgPSBCYXNlLm5hbWU7XG4gIE5vZGVFcnJvci5wcm90b3R5cGUuY29kZSA9IGNvZGU7XG4gIGNvZGVzW2NvZGVdID0gTm9kZUVycm9yO1xufSAvLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi92MTAuOC4wL2xpYi9pbnRlcm5hbC9lcnJvcnMuanNcblxuXG5mdW5jdGlvbiBvbmVPZihleHBlY3RlZCwgdGhpbmcpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZXhwZWN0ZWQpKSB7XG4gICAgdmFyIGxlbiA9IGV4cGVjdGVkLmxlbmd0aDtcbiAgICBleHBlY3RlZCA9IGV4cGVjdGVkLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgcmV0dXJuIFN0cmluZyhpKTtcbiAgICB9KTtcblxuICAgIGlmIChsZW4gPiAyKSB7XG4gICAgICByZXR1cm4gXCJvbmUgb2YgXCIuY29uY2F0KHRoaW5nLCBcIiBcIikuY29uY2F0KGV4cGVjdGVkLnNsaWNlKDAsIGxlbiAtIDEpLmpvaW4oJywgJyksIFwiLCBvciBcIikgKyBleHBlY3RlZFtsZW4gLSAxXTtcbiAgICB9IGVsc2UgaWYgKGxlbiA9PT0gMikge1xuICAgICAgcmV0dXJuIFwib25lIG9mIFwiLmNvbmNhdCh0aGluZywgXCIgXCIpLmNvbmNhdChleHBlY3RlZFswXSwgXCIgb3IgXCIpLmNvbmNhdChleHBlY3RlZFsxXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIm9mIFwiLmNvbmNhdCh0aGluZywgXCIgXCIpLmNvbmNhdChleHBlY3RlZFswXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIm9mIFwiLmNvbmNhdCh0aGluZywgXCIgXCIpLmNvbmNhdChTdHJpbmcoZXhwZWN0ZWQpKTtcbiAgfVxufSAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvc3RhcnRzV2l0aFxuXG5cbmZ1bmN0aW9uIHN0YXJ0c1dpdGgoc3RyLCBzZWFyY2gsIHBvcykge1xuICByZXR1cm4gc3RyLnN1YnN0cighcG9zIHx8IHBvcyA8IDAgPyAwIDogK3Bvcywgc2VhcmNoLmxlbmd0aCkgPT09IHNlYXJjaDtcbn0gLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3RyaW5nL2VuZHNXaXRoXG5cblxuZnVuY3Rpb24gZW5kc1dpdGgoc3RyLCBzZWFyY2gsIHRoaXNfbGVuKSB7XG4gIGlmICh0aGlzX2xlbiA9PT0gdW5kZWZpbmVkIHx8IHRoaXNfbGVuID4gc3RyLmxlbmd0aCkge1xuICAgIHRoaXNfbGVuID0gc3RyLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiBzdHIuc3Vic3RyaW5nKHRoaXNfbGVuIC0gc2VhcmNoLmxlbmd0aCwgdGhpc19sZW4pID09PSBzZWFyY2g7XG59IC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9pbmNsdWRlc1xuXG5cbmZ1bmN0aW9uIGluY2x1ZGVzKHN0ciwgc2VhcmNoLCBzdGFydCkge1xuICBpZiAodHlwZW9mIHN0YXJ0ICE9PSAnbnVtYmVyJykge1xuICAgIHN0YXJ0ID0gMDtcbiAgfVxuXG4gIGlmIChzdGFydCArIHNlYXJjaC5sZW5ndGggPiBzdHIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHIuaW5kZXhPZihzZWFyY2gsIHN0YXJ0KSAhPT0gLTE7XG4gIH1cbn1cblxuY3JlYXRlRXJyb3JUeXBlKCdFUlJfSU5WQUxJRF9PUFRfVkFMVUUnLCBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuICdUaGUgdmFsdWUgXCInICsgdmFsdWUgKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwiJyArIG5hbWUgKyAnXCInO1xufSwgVHlwZUVycm9yKTtcbmNyZWF0ZUVycm9yVHlwZSgnRVJSX0lOVkFMSURfQVJHX1RZUEUnLCBmdW5jdGlvbiAobmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCkge1xuICAvLyBkZXRlcm1pbmVyOiAnbXVzdCBiZScgb3IgJ211c3Qgbm90IGJlJ1xuICB2YXIgZGV0ZXJtaW5lcjtcblxuICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJyAmJiBzdGFydHNXaXRoKGV4cGVjdGVkLCAnbm90ICcpKSB7XG4gICAgZGV0ZXJtaW5lciA9ICdtdXN0IG5vdCBiZSc7XG4gICAgZXhwZWN0ZWQgPSBleHBlY3RlZC5yZXBsYWNlKC9ebm90IC8sICcnKTtcbiAgfSBlbHNlIHtcbiAgICBkZXRlcm1pbmVyID0gJ211c3QgYmUnO1xuICB9XG5cbiAgdmFyIG1zZztcblxuICBpZiAoZW5kc1dpdGgobmFtZSwgJyBhcmd1bWVudCcpKSB7XG4gICAgLy8gRm9yIGNhc2VzIGxpa2UgJ2ZpcnN0IGFyZ3VtZW50J1xuICAgIG1zZyA9IFwiVGhlIFwiLmNvbmNhdChuYW1lLCBcIiBcIikuY29uY2F0KGRldGVybWluZXIsIFwiIFwiKS5jb25jYXQob25lT2YoZXhwZWN0ZWQsICd0eXBlJykpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0eXBlID0gaW5jbHVkZXMobmFtZSwgJy4nKSA/ICdwcm9wZXJ0eScgOiAnYXJndW1lbnQnO1xuICAgIG1zZyA9IFwiVGhlIFxcXCJcIi5jb25jYXQobmFtZSwgXCJcXFwiIFwiKS5jb25jYXQodHlwZSwgXCIgXCIpLmNvbmNhdChkZXRlcm1pbmVyLCBcIiBcIikuY29uY2F0KG9uZU9mKGV4cGVjdGVkLCAndHlwZScpKTtcbiAgfVxuXG4gIG1zZyArPSBcIi4gUmVjZWl2ZWQgdHlwZSBcIi5jb25jYXQodHlwZW9mIGFjdHVhbCk7XG4gIHJldHVybiBtc2c7XG59LCBUeXBlRXJyb3IpO1xuY3JlYXRlRXJyb3JUeXBlKCdFUlJfU1RSRUFNX1BVU0hfQUZURVJfRU9GJywgJ3N0cmVhbS5wdXNoKCkgYWZ0ZXIgRU9GJyk7XG5jcmVhdGVFcnJvclR5cGUoJ0VSUl9NRVRIT0RfTk9UX0lNUExFTUVOVEVEJywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuICdUaGUgJyArIG5hbWUgKyAnIG1ldGhvZCBpcyBub3QgaW1wbGVtZW50ZWQnO1xufSk7XG5jcmVhdGVFcnJvclR5cGUoJ0VSUl9TVFJFQU1fUFJFTUFUVVJFX0NMT1NFJywgJ1ByZW1hdHVyZSBjbG9zZScpO1xuY3JlYXRlRXJyb3JUeXBlKCdFUlJfU1RSRUFNX0RFU1RST1lFRCcsIGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiAnQ2Fubm90IGNhbGwgJyArIG5hbWUgKyAnIGFmdGVyIGEgc3RyZWFtIHdhcyBkZXN0cm95ZWQnO1xufSk7XG5jcmVhdGVFcnJvclR5cGUoJ0VSUl9NVUxUSVBMRV9DQUxMQkFDSycsICdDYWxsYmFjayBjYWxsZWQgbXVsdGlwbGUgdGltZXMnKTtcbmNyZWF0ZUVycm9yVHlwZSgnRVJSX1NUUkVBTV9DQU5OT1RfUElQRScsICdDYW5ub3QgcGlwZSwgbm90IHJlYWRhYmxlJyk7XG5jcmVhdGVFcnJvclR5cGUoJ0VSUl9TVFJFQU1fV1JJVEVfQUZURVJfRU5EJywgJ3dyaXRlIGFmdGVyIGVuZCcpO1xuY3JlYXRlRXJyb3JUeXBlKCdFUlJfU1RSRUFNX05VTExfVkFMVUVTJywgJ01heSBub3Qgd3JpdGUgbnVsbCB2YWx1ZXMgdG8gc3RyZWFtJywgVHlwZUVycm9yKTtcbmNyZWF0ZUVycm9yVHlwZSgnRVJSX1VOS05PV05fRU5DT0RJTkcnLCBmdW5jdGlvbiAoYXJnKSB7XG4gIHJldHVybiAnVW5rbm93biBlbmNvZGluZzogJyArIGFyZztcbn0sIFR5cGVFcnJvcik7XG5jcmVhdGVFcnJvclR5cGUoJ0VSUl9TVFJFQU1fVU5TSElGVF9BRlRFUl9FTkRfRVZFTlQnLCAnc3RyZWFtLnVuc2hpZnQoKSBhZnRlciBlbmQgZXZlbnQnKTtcbm1vZHVsZS5leHBvcnRzLmNvZGVzID0gY29kZXM7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gYSBkdXBsZXggc3RyZWFtIGlzIGp1c3QgYSBzdHJlYW0gdGhhdCBpcyBib3RoIHJlYWRhYmxlIGFuZCB3cml0YWJsZS5cbi8vIFNpbmNlIEpTIGRvZXNuJ3QgaGF2ZSBtdWx0aXBsZSBwcm90b3R5cGFsIGluaGVyaXRhbmNlLCB0aGlzIGNsYXNzXG4vLyBwcm90b3R5cGFsbHkgaW5oZXJpdHMgZnJvbSBSZWFkYWJsZSwgYW5kIHRoZW4gcGFyYXNpdGljYWxseSBmcm9tXG4vLyBXcml0YWJsZS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICByZXR1cm4ga2V5cztcbn07XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxubW9kdWxlLmV4cG9ydHMgPSBEdXBsZXg7XG52YXIgUmVhZGFibGUgPSByZXF1aXJlKCcuL19zdHJlYW1fcmVhZGFibGUnKTtcbnZhciBXcml0YWJsZSA9IHJlcXVpcmUoJy4vX3N0cmVhbV93cml0YWJsZScpO1xucmVxdWlyZSgnaW5oZXJpdHMnKShEdXBsZXgsIFJlYWRhYmxlKTtcbntcbiAgLy8gQWxsb3cgdGhlIGtleXMgYXJyYXkgdG8gYmUgR0MnZWQuXG4gIHZhciBrZXlzID0gb2JqZWN0S2V5cyhXcml0YWJsZS5wcm90b3R5cGUpO1xuICBmb3IgKHZhciB2ID0gMDsgdiA8IGtleXMubGVuZ3RoOyB2KyspIHtcbiAgICB2YXIgbWV0aG9kID0ga2V5c1t2XTtcbiAgICBpZiAoIUR1cGxleC5wcm90b3R5cGVbbWV0aG9kXSkgRHVwbGV4LnByb3RvdHlwZVttZXRob2RdID0gV3JpdGFibGUucHJvdG90eXBlW21ldGhvZF07XG4gIH1cbn1cbmZ1bmN0aW9uIER1cGxleChvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEdXBsZXgpKSByZXR1cm4gbmV3IER1cGxleChvcHRpb25zKTtcbiAgUmVhZGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgV3JpdGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgdGhpcy5hbGxvd0hhbGZPcGVuID0gdHJ1ZTtcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5yZWFkYWJsZSA9PT0gZmFsc2UpIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcbiAgICBpZiAob3B0aW9ucy53cml0YWJsZSA9PT0gZmFsc2UpIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcbiAgICBpZiAob3B0aW9ucy5hbGxvd0hhbGZPcGVuID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5hbGxvd0hhbGZPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLm9uY2UoJ2VuZCcsIG9uZW5kKTtcbiAgICB9XG4gIH1cbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShEdXBsZXgucHJvdG90eXBlLCAnd3JpdGFibGVIaWdoV2F0ZXJNYXJrJywge1xuICAvLyBtYWtpbmcgaXQgZXhwbGljaXQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgZW51bWVyYWJsZVxuICAvLyBiZWNhdXNlIG90aGVyd2lzZSBzb21lIHByb3RvdHlwZSBtYW5pcHVsYXRpb24gaW5cbiAgLy8gdXNlcmxhbmQgd2lsbCBmYWlsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZS5oaWdoV2F0ZXJNYXJrO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShEdXBsZXgucHJvdG90eXBlLCAnd3JpdGFibGVCdWZmZXInLCB7XG4gIC8vIG1ha2luZyBpdCBleHBsaWNpdCB0aGlzIHByb3BlcnR5IGlzIG5vdCBlbnVtZXJhYmxlXG4gIC8vIGJlY2F1c2Ugb3RoZXJ3aXNlIHNvbWUgcHJvdG90eXBlIG1hbmlwdWxhdGlvbiBpblxuICAvLyB1c2VybGFuZCB3aWxsIGZhaWxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl93cml0YWJsZVN0YXRlICYmIHRoaXMuX3dyaXRhYmxlU3RhdGUuZ2V0QnVmZmVyKCk7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KER1cGxleC5wcm90b3R5cGUsICd3cml0YWJsZUxlbmd0aCcsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUubGVuZ3RoO1xuICB9XG59KTtcblxuLy8gdGhlIG5vLWhhbGYtb3BlbiBlbmZvcmNlclxuZnVuY3Rpb24gb25lbmQoKSB7XG4gIC8vIElmIHRoZSB3cml0YWJsZSBzaWRlIGVuZGVkLCB0aGVuIHdlJ3JlIG9rLlxuICBpZiAodGhpcy5fd3JpdGFibGVTdGF0ZS5lbmRlZCkgcmV0dXJuO1xuXG4gIC8vIG5vIG1vcmUgZGF0YSBjYW4gYmUgd3JpdHRlbi5cbiAgLy8gQnV0IGFsbG93IG1vcmUgd3JpdGVzIHRvIGhhcHBlbiBpbiB0aGlzIHRpY2suXG4gIHByb2Nlc3MubmV4dFRpY2sob25FbmROVCwgdGhpcyk7XG59XG5mdW5jdGlvbiBvbkVuZE5UKHNlbGYpIHtcbiAgc2VsZi5lbmQoKTtcbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShEdXBsZXgucHJvdG90eXBlLCAnZGVzdHJveWVkJywge1xuICAvLyBtYWtpbmcgaXQgZXhwbGljaXQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgZW51bWVyYWJsZVxuICAvLyBiZWNhdXNlIG90aGVyd2lzZSBzb21lIHByb3RvdHlwZSBtYW5pcHVsYXRpb24gaW5cbiAgLy8gdXNlcmxhbmQgd2lsbCBmYWlsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQgJiYgdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQ7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgLy8gd2UgaWdub3JlIHRoZSB2YWx1ZSBpZiB0aGUgc3RyZWFtXG4gICAgLy8gaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldFxuICAgIGlmICh0aGlzLl9yZWFkYWJsZVN0YXRlID09PSB1bmRlZmluZWQgfHwgdGhpcy5fd3JpdGFibGVTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgdGhlIHVzZXIgaXMgZXhwbGljaXRseVxuICAgIC8vIG1hbmFnaW5nIGRlc3Ryb3llZFxuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkID0gdmFsdWU7XG4gICAgdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQgPSB2YWx1ZTtcbiAgfVxufSk7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIGEgcGFzc3Rocm91Z2ggc3RyZWFtLlxuLy8gYmFzaWNhbGx5IGp1c3QgdGhlIG1vc3QgbWluaW1hbCBzb3J0IG9mIFRyYW5zZm9ybSBzdHJlYW0uXG4vLyBFdmVyeSB3cml0dGVuIGNodW5rIGdldHMgb3V0cHV0IGFzLWlzLlxuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUGFzc1Rocm91Z2g7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9fc3RyZWFtX3RyYW5zZm9ybScpO1xucmVxdWlyZSgnaW5oZXJpdHMnKShQYXNzVGhyb3VnaCwgVHJhbnNmb3JtKTtcbmZ1bmN0aW9uIFBhc3NUaHJvdWdoKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBhc3NUaHJvdWdoKSkgcmV0dXJuIG5ldyBQYXNzVGhyb3VnaChvcHRpb25zKTtcbiAgVHJhbnNmb3JtLmNhbGwodGhpcywgb3B0aW9ucyk7XG59XG5QYXNzVGhyb3VnaC5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGNiKG51bGwsIGNodW5rKTtcbn07IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFkYWJsZTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBEdXBsZXg7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuUmVhZGFibGUuUmVhZGFibGVTdGF0ZSA9IFJlYWRhYmxlU3RhdGU7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgRUUgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgRUVsaXN0ZW5lckNvdW50ID0gZnVuY3Rpb24gRUVsaXN0ZW5lckNvdW50KGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJzKHR5cGUpLmxlbmd0aDtcbn07XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBTdHJlYW0gPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvc3RyZWFtJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbnZhciBPdXJVaW50OEFycmF5ID0gKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDoge30pLlVpbnQ4QXJyYXkgfHwgZnVuY3Rpb24gKCkge307XG5mdW5jdGlvbiBfdWludDhBcnJheVRvQnVmZmVyKGNodW5rKSB7XG4gIHJldHVybiBCdWZmZXIuZnJvbShjaHVuayk7XG59XG5mdW5jdGlvbiBfaXNVaW50OEFycmF5KG9iaikge1xuICByZXR1cm4gQnVmZmVyLmlzQnVmZmVyKG9iaikgfHwgb2JqIGluc3RhbmNlb2YgT3VyVWludDhBcnJheTtcbn1cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBkZWJ1Z1V0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgZGVidWc7XG5pZiAoZGVidWdVdGlsICYmIGRlYnVnVXRpbC5kZWJ1Z2xvZykge1xuICBkZWJ1ZyA9IGRlYnVnVXRpbC5kZWJ1Z2xvZygnc3RyZWFtJyk7XG59IGVsc2Uge1xuICBkZWJ1ZyA9IGZ1bmN0aW9uIGRlYnVnKCkge307XG59XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIEJ1ZmZlckxpc3QgPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvYnVmZmVyX2xpc3QnKTtcbnZhciBkZXN0cm95SW1wbCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvc3RyZWFtcy9kZXN0cm95Jyk7XG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvc3RhdGUnKSxcbiAgZ2V0SGlnaFdhdGVyTWFyayA9IF9yZXF1aXJlLmdldEhpZ2hXYXRlck1hcms7XG52YXIgX3JlcXVpcmUkY29kZXMgPSByZXF1aXJlKCcuLi9lcnJvcnMnKS5jb2RlcyxcbiAgRVJSX0lOVkFMSURfQVJHX1RZUEUgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfSU5WQUxJRF9BUkdfVFlQRSxcbiAgRVJSX1NUUkVBTV9QVVNIX0FGVEVSX0VPRiA9IF9yZXF1aXJlJGNvZGVzLkVSUl9TVFJFQU1fUFVTSF9BRlRFUl9FT0YsXG4gIEVSUl9NRVRIT0RfTk9UX0lNUExFTUVOVEVEID0gX3JlcXVpcmUkY29kZXMuRVJSX01FVEhPRF9OT1RfSU1QTEVNRU5URUQsXG4gIEVSUl9TVFJFQU1fVU5TSElGVF9BRlRFUl9FTkRfRVZFTlQgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfU1RSRUFNX1VOU0hJRlRfQUZURVJfRU5EX0VWRU5UO1xuXG4vLyBMYXp5IGxvYWRlZCB0byBpbXByb3ZlIHRoZSBzdGFydHVwIHBlcmZvcm1hbmNlLlxudmFyIFN0cmluZ0RlY29kZXI7XG52YXIgY3JlYXRlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yO1xudmFyIGZyb207XG5yZXF1aXJlKCdpbmhlcml0cycpKFJlYWRhYmxlLCBTdHJlYW0pO1xudmFyIGVycm9yT3JEZXN0cm95ID0gZGVzdHJveUltcGwuZXJyb3JPckRlc3Ryb3k7XG52YXIga1Byb3h5RXZlbnRzID0gWydlcnJvcicsICdjbG9zZScsICdkZXN0cm95JywgJ3BhdXNlJywgJ3Jlc3VtZSddO1xuZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKGVtaXR0ZXIsIGV2ZW50LCBmbikge1xuICAvLyBTYWRseSB0aGlzIGlzIG5vdCBjYWNoZWFibGUgYXMgc29tZSBsaWJyYXJpZXMgYnVuZGxlIHRoZWlyIG93blxuICAvLyBldmVudCBlbWl0dGVyIGltcGxlbWVudGF0aW9uIHdpdGggdGhlbS5cbiAgaWYgKHR5cGVvZiBlbWl0dGVyLnByZXBlbmRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGVtaXR0ZXIucHJlcGVuZExpc3RlbmVyKGV2ZW50LCBmbik7XG5cbiAgLy8gVGhpcyBpcyBhIGhhY2sgdG8gbWFrZSBzdXJlIHRoYXQgb3VyIGVycm9yIGhhbmRsZXIgaXMgYXR0YWNoZWQgYmVmb3JlIGFueVxuICAvLyB1c2VybGFuZCBvbmVzLiAgTkVWRVIgRE8gVEhJUy4gVGhpcyBpcyBoZXJlIG9ubHkgYmVjYXVzZSB0aGlzIGNvZGUgbmVlZHNcbiAgLy8gdG8gY29udGludWUgdG8gd29yayB3aXRoIG9sZGVyIHZlcnNpb25zIG9mIE5vZGUuanMgdGhhdCBkbyBub3QgaW5jbHVkZVxuICAvLyB0aGUgcHJlcGVuZExpc3RlbmVyKCkgbWV0aG9kLiBUaGUgZ29hbCBpcyB0byBldmVudHVhbGx5IHJlbW92ZSB0aGlzIGhhY2suXG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbZXZlbnRdKSBlbWl0dGVyLm9uKGV2ZW50LCBmbik7ZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlbWl0dGVyLl9ldmVudHNbZXZlbnRdKSkgZW1pdHRlci5fZXZlbnRzW2V2ZW50XS51bnNoaWZ0KGZuKTtlbHNlIGVtaXR0ZXIuX2V2ZW50c1tldmVudF0gPSBbZm4sIGVtaXR0ZXIuX2V2ZW50c1tldmVudF1dO1xufVxuZnVuY3Rpb24gUmVhZGFibGVTdGF0ZShvcHRpb25zLCBzdHJlYW0sIGlzRHVwbGV4KSB7XG4gIER1cGxleCA9IER1cGxleCB8fCByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIER1cGxleCBzdHJlYW1zIGFyZSBib3RoIHJlYWRhYmxlIGFuZCB3cml0YWJsZSwgYnV0IHNoYXJlXG4gIC8vIHRoZSBzYW1lIG9wdGlvbnMgb2JqZWN0LlxuICAvLyBIb3dldmVyLCBzb21lIGNhc2VzIHJlcXVpcmUgc2V0dGluZyBvcHRpb25zIHRvIGRpZmZlcmVudFxuICAvLyB2YWx1ZXMgZm9yIHRoZSByZWFkYWJsZSBhbmQgdGhlIHdyaXRhYmxlIHNpZGVzIG9mIHRoZSBkdXBsZXggc3RyZWFtLlxuICAvLyBUaGVzZSBvcHRpb25zIGNhbiBiZSBwcm92aWRlZCBzZXBhcmF0ZWx5IGFzIHJlYWRhYmxlWFhYIGFuZCB3cml0YWJsZVhYWC5cbiAgaWYgKHR5cGVvZiBpc0R1cGxleCAhPT0gJ2Jvb2xlYW4nKSBpc0R1cGxleCA9IHN0cmVhbSBpbnN0YW5jZW9mIER1cGxleDtcblxuICAvLyBvYmplY3Qgc3RyZWFtIGZsYWcuIFVzZWQgdG8gbWFrZSByZWFkKG4pIGlnbm9yZSBuIGFuZCB0b1xuICAvLyBtYWtlIGFsbCB0aGUgYnVmZmVyIG1lcmdpbmcgYW5kIGxlbmd0aCBjaGVja3MgZ28gYXdheVxuICB0aGlzLm9iamVjdE1vZGUgPSAhIW9wdGlvbnMub2JqZWN0TW9kZTtcbiAgaWYgKGlzRHVwbGV4KSB0aGlzLm9iamVjdE1vZGUgPSB0aGlzLm9iamVjdE1vZGUgfHwgISFvcHRpb25zLnJlYWRhYmxlT2JqZWN0TW9kZTtcblxuICAvLyB0aGUgcG9pbnQgYXQgd2hpY2ggaXQgc3RvcHMgY2FsbGluZyBfcmVhZCgpIHRvIGZpbGwgdGhlIGJ1ZmZlclxuICAvLyBOb3RlOiAwIGlzIGEgdmFsaWQgdmFsdWUsIG1lYW5zIFwiZG9uJ3QgY2FsbCBfcmVhZCBwcmVlbXB0aXZlbHkgZXZlclwiXG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IGdldEhpZ2hXYXRlck1hcmsodGhpcywgb3B0aW9ucywgJ3JlYWRhYmxlSGlnaFdhdGVyTWFyaycsIGlzRHVwbGV4KTtcblxuICAvLyBBIGxpbmtlZCBsaXN0IGlzIHVzZWQgdG8gc3RvcmUgZGF0YSBjaHVua3MgaW5zdGVhZCBvZiBhbiBhcnJheSBiZWNhdXNlIHRoZVxuICAvLyBsaW5rZWQgbGlzdCBjYW4gcmVtb3ZlIGVsZW1lbnRzIGZyb20gdGhlIGJlZ2lubmluZyBmYXN0ZXIgdGhhblxuICAvLyBhcnJheS5zaGlmdCgpXG4gIHRoaXMuYnVmZmVyID0gbmV3IEJ1ZmZlckxpc3QoKTtcbiAgdGhpcy5sZW5ndGggPSAwO1xuICB0aGlzLnBpcGVzID0gbnVsbDtcbiAgdGhpcy5waXBlc0NvdW50ID0gMDtcbiAgdGhpcy5mbG93aW5nID0gbnVsbDtcbiAgdGhpcy5lbmRlZCA9IGZhbHNlO1xuICB0aGlzLmVuZEVtaXR0ZWQgPSBmYWxzZTtcbiAgdGhpcy5yZWFkaW5nID0gZmFsc2U7XG5cbiAgLy8gYSBmbGFnIHRvIGJlIGFibGUgdG8gdGVsbCBpZiB0aGUgZXZlbnQgJ3JlYWRhYmxlJy8nZGF0YScgaXMgZW1pdHRlZFxuICAvLyBpbW1lZGlhdGVseSwgb3Igb24gYSBsYXRlciB0aWNrLiAgV2Ugc2V0IHRoaXMgdG8gdHJ1ZSBhdCBmaXJzdCwgYmVjYXVzZVxuICAvLyBhbnkgYWN0aW9ucyB0aGF0IHNob3VsZG4ndCBoYXBwZW4gdW50aWwgXCJsYXRlclwiIHNob3VsZCBnZW5lcmFsbHkgYWxzb1xuICAvLyBub3QgaGFwcGVuIGJlZm9yZSB0aGUgZmlyc3QgcmVhZCBjYWxsLlxuICB0aGlzLnN5bmMgPSB0cnVlO1xuXG4gIC8vIHdoZW5ldmVyIHdlIHJldHVybiBudWxsLCB0aGVuIHdlIHNldCBhIGZsYWcgdG8gc2F5XG4gIC8vIHRoYXQgd2UncmUgYXdhaXRpbmcgYSAncmVhZGFibGUnIGV2ZW50IGVtaXNzaW9uLlxuICB0aGlzLm5lZWRSZWFkYWJsZSA9IGZhbHNlO1xuICB0aGlzLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuICB0aGlzLnJlYWRhYmxlTGlzdGVuaW5nID0gZmFsc2U7XG4gIHRoaXMucmVzdW1lU2NoZWR1bGVkID0gZmFsc2U7XG4gIHRoaXMucGF1c2VkID0gdHJ1ZTtcblxuICAvLyBTaG91bGQgY2xvc2UgYmUgZW1pdHRlZCBvbiBkZXN0cm95LiBEZWZhdWx0cyB0byB0cnVlLlxuICB0aGlzLmVtaXRDbG9zZSA9IG9wdGlvbnMuZW1pdENsb3NlICE9PSBmYWxzZTtcblxuICAvLyBTaG91bGQgLmRlc3Ryb3koKSBiZSBjYWxsZWQgYWZ0ZXIgJ2VuZCcgKGFuZCBwb3RlbnRpYWxseSAnZmluaXNoJylcbiAgdGhpcy5hdXRvRGVzdHJveSA9ICEhb3B0aW9ucy5hdXRvRGVzdHJveTtcblxuICAvLyBoYXMgaXQgYmVlbiBkZXN0cm95ZWRcbiAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvLyBDcnlwdG8gaXMga2luZCBvZiBvbGQgYW5kIGNydXN0eS4gIEhpc3RvcmljYWxseSwgaXRzIGRlZmF1bHQgc3RyaW5nXG4gIC8vIGVuY29kaW5nIGlzICdiaW5hcnknIHNvIHdlIGhhdmUgdG8gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZS5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIGluIHRoZSB1bml2ZXJzZSB1c2VzICd1dGY4JywgdGhvdWdoLlxuICB0aGlzLmRlZmF1bHRFbmNvZGluZyA9IG9wdGlvbnMuZGVmYXVsdEVuY29kaW5nIHx8ICd1dGY4JztcblxuICAvLyB0aGUgbnVtYmVyIG9mIHdyaXRlcnMgdGhhdCBhcmUgYXdhaXRpbmcgYSBkcmFpbiBldmVudCBpbiAucGlwZSgpc1xuICB0aGlzLmF3YWl0RHJhaW4gPSAwO1xuXG4gIC8vIGlmIHRydWUsIGEgbWF5YmVSZWFkTW9yZSBoYXMgYmVlbiBzY2hlZHVsZWRcbiAgdGhpcy5yZWFkaW5nTW9yZSA9IGZhbHNlO1xuICB0aGlzLmRlY29kZXIgPSBudWxsO1xuICB0aGlzLmVuY29kaW5nID0gbnVsbDtcbiAgaWYgKG9wdGlvbnMuZW5jb2RpbmcpIHtcbiAgICBpZiAoIVN0cmluZ0RlY29kZXIpIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2Rlci8nKS5TdHJpbmdEZWNvZGVyO1xuICAgIHRoaXMuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIHRoaXMuZW5jb2RpbmcgPSBvcHRpb25zLmVuY29kaW5nO1xuICB9XG59XG5mdW5jdGlvbiBSZWFkYWJsZShvcHRpb25zKSB7XG4gIER1cGxleCA9IER1cGxleCB8fCByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZWFkYWJsZSkpIHJldHVybiBuZXcgUmVhZGFibGUob3B0aW9ucyk7XG5cbiAgLy8gQ2hlY2tpbmcgZm9yIGEgU3RyZWFtLkR1cGxleCBpbnN0YW5jZSBpcyBmYXN0ZXIgaGVyZSBpbnN0ZWFkIG9mIGluc2lkZVxuICAvLyB0aGUgUmVhZGFibGVTdGF0ZSBjb25zdHJ1Y3RvciwgYXQgbGVhc3Qgd2l0aCBWOCA2LjVcbiAgdmFyIGlzRHVwbGV4ID0gdGhpcyBpbnN0YW5jZW9mIER1cGxleDtcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZSA9IG5ldyBSZWFkYWJsZVN0YXRlKG9wdGlvbnMsIHRoaXMsIGlzRHVwbGV4KTtcblxuICAvLyBsZWdhY3lcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG4gIGlmIChvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnJlYWQgPT09ICdmdW5jdGlvbicpIHRoaXMuX3JlYWQgPSBvcHRpb25zLnJlYWQ7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIHRoaXMuX2Rlc3Ryb3kgPSBvcHRpb25zLmRlc3Ryb3k7XG4gIH1cbiAgU3RyZWFtLmNhbGwodGhpcyk7XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGUucHJvdG90eXBlLCAnZGVzdHJveWVkJywge1xuICAvLyBtYWtpbmcgaXQgZXhwbGljaXQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgZW51bWVyYWJsZVxuICAvLyBiZWNhdXNlIG90aGVyd2lzZSBzb21lIHByb3RvdHlwZSBtYW5pcHVsYXRpb24gaW5cbiAgLy8gdXNlcmxhbmQgd2lsbCBmYWlsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZDtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAvLyB3ZSBpZ25vcmUgdGhlIHZhbHVlIGlmIHRoZSBzdHJlYW1cbiAgICAvLyBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgeWV0XG4gICAgaWYgKCF0aGlzLl9yZWFkYWJsZVN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgdGhlIHVzZXIgaXMgZXhwbGljaXRseVxuICAgIC8vIG1hbmFnaW5nIGRlc3Ryb3llZFxuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkID0gdmFsdWU7XG4gIH1cbn0pO1xuUmVhZGFibGUucHJvdG90eXBlLmRlc3Ryb3kgPSBkZXN0cm95SW1wbC5kZXN0cm95O1xuUmVhZGFibGUucHJvdG90eXBlLl91bmRlc3Ryb3kgPSBkZXN0cm95SW1wbC51bmRlc3Ryb3k7XG5SZWFkYWJsZS5wcm90b3R5cGUuX2Rlc3Ryb3kgPSBmdW5jdGlvbiAoZXJyLCBjYikge1xuICBjYihlcnIpO1xufTtcblxuLy8gTWFudWFsbHkgc2hvdmUgc29tZXRoaW5nIGludG8gdGhlIHJlYWQoKSBidWZmZXIuXG4vLyBUaGlzIHJldHVybnMgdHJ1ZSBpZiB0aGUgaGlnaFdhdGVyTWFyayBoYXMgbm90IGJlZW4gaGl0IHlldCxcbi8vIHNpbWlsYXIgdG8gaG93IFdyaXRhYmxlLndyaXRlKCkgcmV0dXJucyB0cnVlIGlmIHlvdSBzaG91bGRcbi8vIHdyaXRlKCkgc29tZSBtb3JlLlxuUmVhZGFibGUucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHZhciBza2lwQ2h1bmtDaGVjaztcbiAgaWYgKCFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgaWYgKHR5cGVvZiBjaHVuayA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5jb2RpbmcgfHwgc3RhdGUuZGVmYXVsdEVuY29kaW5nO1xuICAgICAgaWYgKGVuY29kaW5nICE9PSBzdGF0ZS5lbmNvZGluZykge1xuICAgICAgICBjaHVuayA9IEJ1ZmZlci5mcm9tKGNodW5rLCBlbmNvZGluZyk7XG4gICAgICAgIGVuY29kaW5nID0gJyc7XG4gICAgICB9XG4gICAgICBza2lwQ2h1bmtDaGVjayA9IHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNraXBDaHVua0NoZWNrID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVhZGFibGVBZGRDaHVuayh0aGlzLCBjaHVuaywgZW5jb2RpbmcsIGZhbHNlLCBza2lwQ2h1bmtDaGVjayk7XG59O1xuXG4vLyBVbnNoaWZ0IHNob3VsZCAqYWx3YXlzKiBiZSBzb21ldGhpbmcgZGlyZWN0bHkgb3V0IG9mIHJlYWQoKVxuUmVhZGFibGUucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgcmV0dXJuIHJlYWRhYmxlQWRkQ2h1bmsodGhpcywgY2h1bmssIG51bGwsIHRydWUsIGZhbHNlKTtcbn07XG5mdW5jdGlvbiByZWFkYWJsZUFkZENodW5rKHN0cmVhbSwgY2h1bmssIGVuY29kaW5nLCBhZGRUb0Zyb250LCBza2lwQ2h1bmtDaGVjaykge1xuICBkZWJ1ZygncmVhZGFibGVBZGRDaHVuaycsIGNodW5rKTtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcbiAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgb25Fb2ZDaHVuayhzdHJlYW0sIHN0YXRlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXI7XG4gICAgaWYgKCFza2lwQ2h1bmtDaGVjaykgZXIgPSBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKTtcbiAgICBpZiAoZXIpIHtcbiAgICAgIGVycm9yT3JEZXN0cm95KHN0cmVhbSwgZXIpO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUub2JqZWN0TW9kZSB8fCBjaHVuayAmJiBjaHVuay5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodHlwZW9mIGNodW5rICE9PSAnc3RyaW5nJyAmJiAhc3RhdGUub2JqZWN0TW9kZSAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2h1bmspICE9PSBCdWZmZXIucHJvdG90eXBlKSB7XG4gICAgICAgIGNodW5rID0gX3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuayk7XG4gICAgICB9XG4gICAgICBpZiAoYWRkVG9Gcm9udCkge1xuICAgICAgICBpZiAoc3RhdGUuZW5kRW1pdHRlZCkgZXJyb3JPckRlc3Ryb3koc3RyZWFtLCBuZXcgRVJSX1NUUkVBTV9VTlNISUZUX0FGVEVSX0VORF9FVkVOVCgpKTtlbHNlIGFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuZW5kZWQpIHtcbiAgICAgICAgZXJyb3JPckRlc3Ryb3koc3RyZWFtLCBuZXcgRVJSX1NUUkVBTV9QVVNIX0FGVEVSX0VPRigpKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuZGVzdHJveWVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHN0YXRlLmRlY29kZXIgJiYgIWVuY29kaW5nKSB7XG4gICAgICAgICAgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLndyaXRlKGNodW5rKTtcbiAgICAgICAgICBpZiAoc3RhdGUub2JqZWN0TW9kZSB8fCBjaHVuay5sZW5ndGggIT09IDApIGFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBmYWxzZSk7ZWxzZSBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFhZGRUb0Zyb250KSB7XG4gICAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgICBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFdlIGNhbiBwdXNoIG1vcmUgZGF0YSBpZiB3ZSBhcmUgYmVsb3cgdGhlIGhpZ2hXYXRlck1hcmsuXG4gIC8vIEFsc28sIGlmIHdlIGhhdmUgbm8gZGF0YSB5ZXQsIHdlIGNhbiBzdGFuZCBzb21lIG1vcmUgYnl0ZXMuXG4gIC8vIFRoaXMgaXMgdG8gd29yayBhcm91bmQgY2FzZXMgd2hlcmUgaHdtPTAsIHN1Y2ggYXMgdGhlIHJlcGwuXG4gIHJldHVybiAhc3RhdGUuZW5kZWQgJiYgKHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcmsgfHwgc3RhdGUubGVuZ3RoID09PSAwKTtcbn1cbmZ1bmN0aW9uIGFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBhZGRUb0Zyb250KSB7XG4gIGlmIChzdGF0ZS5mbG93aW5nICYmIHN0YXRlLmxlbmd0aCA9PT0gMCAmJiAhc3RhdGUuc3luYykge1xuICAgIHN0YXRlLmF3YWl0RHJhaW4gPSAwO1xuICAgIHN0cmVhbS5lbWl0KCdkYXRhJywgY2h1bmspO1xuICB9IGVsc2Uge1xuICAgIC8vIHVwZGF0ZSB0aGUgYnVmZmVyIGluZm8uXG4gICAgc3RhdGUubGVuZ3RoICs9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuICAgIGlmIChhZGRUb0Zyb250KSBzdGF0ZS5idWZmZXIudW5zaGlmdChjaHVuayk7ZWxzZSBzdGF0ZS5idWZmZXIucHVzaChjaHVuayk7XG4gICAgaWYgKHN0YXRlLm5lZWRSZWFkYWJsZSkgZW1pdFJlYWRhYmxlKHN0cmVhbSk7XG4gIH1cbiAgbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKTtcbn1cbmZ1bmN0aW9uIGNodW5rSW52YWxpZChzdGF0ZSwgY2h1bmspIHtcbiAgdmFyIGVyO1xuICBpZiAoIV9pc1VpbnQ4QXJyYXkoY2h1bmspICYmIHR5cGVvZiBjaHVuayAhPT0gJ3N0cmluZycgJiYgY2h1bmsgIT09IHVuZGVmaW5lZCAmJiAhc3RhdGUub2JqZWN0TW9kZSkge1xuICAgIGVyID0gbmV3IEVSUl9JTlZBTElEX0FSR19UWVBFKCdjaHVuaycsIFsnc3RyaW5nJywgJ0J1ZmZlcicsICdVaW50OEFycmF5J10sIGNodW5rKTtcbiAgfVxuICByZXR1cm4gZXI7XG59XG5SZWFkYWJsZS5wcm90b3R5cGUuaXNQYXVzZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcgPT09IGZhbHNlO1xufTtcblxuLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG5SZWFkYWJsZS5wcm90b3R5cGUuc2V0RW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jKSB7XG4gIGlmICghU3RyaW5nRGVjb2RlcikgU3RyaW5nRGVjb2RlciA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyLycpLlN0cmluZ0RlY29kZXI7XG4gIHZhciBkZWNvZGVyID0gbmV3IFN0cmluZ0RlY29kZXIoZW5jKTtcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5kZWNvZGVyID0gZGVjb2RlcjtcbiAgLy8gSWYgc2V0RW5jb2RpbmcobnVsbCksIGRlY29kZXIuZW5jb2RpbmcgZXF1YWxzIHV0ZjhcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmNvZGluZyA9IHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVjb2Rlci5lbmNvZGluZztcblxuICAvLyBJdGVyYXRlIG92ZXIgY3VycmVudCBidWZmZXIgdG8gY29udmVydCBhbHJlYWR5IHN0b3JlZCBCdWZmZXJzOlxuICB2YXIgcCA9IHRoaXMuX3JlYWRhYmxlU3RhdGUuYnVmZmVyLmhlYWQ7XG4gIHZhciBjb250ZW50ID0gJyc7XG4gIHdoaWxlIChwICE9PSBudWxsKSB7XG4gICAgY29udGVudCArPSBkZWNvZGVyLndyaXRlKHAuZGF0YSk7XG4gICAgcCA9IHAubmV4dDtcbiAgfVxuICB0aGlzLl9yZWFkYWJsZVN0YXRlLmJ1ZmZlci5jbGVhcigpO1xuICBpZiAoY29udGVudCAhPT0gJycpIHRoaXMuX3JlYWRhYmxlU3RhdGUuYnVmZmVyLnB1c2goY29udGVudCk7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUubGVuZ3RoID0gY29udGVudC5sZW5ndGg7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gRG9uJ3QgcmFpc2UgdGhlIGh3bSA+IDFHQlxudmFyIE1BWF9IV00gPSAweDQwMDAwMDAwO1xuZnVuY3Rpb24gY29tcHV0ZU5ld0hpZ2hXYXRlck1hcmsobikge1xuICBpZiAobiA+PSBNQVhfSFdNKSB7XG4gICAgLy8gVE9ETyhyb25hZyk6IFRocm93IEVSUl9WQUxVRV9PVVRfT0ZfUkFOR0UuXG4gICAgbiA9IE1BWF9IV007XG4gIH0gZWxzZSB7XG4gICAgLy8gR2V0IHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgMiB0byBwcmV2ZW50IGluY3JlYXNpbmcgaHdtIGV4Y2Vzc2l2ZWx5IGluXG4gICAgLy8gdGlueSBhbW91bnRzXG4gICAgbi0tO1xuICAgIG4gfD0gbiA+Pj4gMTtcbiAgICBuIHw9IG4gPj4+IDI7XG4gICAgbiB8PSBuID4+PiA0O1xuICAgIG4gfD0gbiA+Pj4gODtcbiAgICBuIHw9IG4gPj4+IDE2O1xuICAgIG4rKztcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiBpcyBkZXNpZ25lZCB0byBiZSBpbmxpbmFibGUsIHNvIHBsZWFzZSB0YWtlIGNhcmUgd2hlbiBtYWtpbmdcbi8vIGNoYW5nZXMgdG8gdGhlIGZ1bmN0aW9uIGJvZHkuXG5mdW5jdGlvbiBob3dNdWNoVG9SZWFkKG4sIHN0YXRlKSB7XG4gIGlmIChuIDw9IDAgfHwgc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLmVuZGVkKSByZXR1cm4gMDtcbiAgaWYgKHN0YXRlLm9iamVjdE1vZGUpIHJldHVybiAxO1xuICBpZiAobiAhPT0gbikge1xuICAgIC8vIE9ubHkgZmxvdyBvbmUgYnVmZmVyIGF0IGEgdGltZVxuICAgIGlmIChzdGF0ZS5mbG93aW5nICYmIHN0YXRlLmxlbmd0aCkgcmV0dXJuIHN0YXRlLmJ1ZmZlci5oZWFkLmRhdGEubGVuZ3RoO2Vsc2UgcmV0dXJuIHN0YXRlLmxlbmd0aDtcbiAgfVxuICAvLyBJZiB3ZSdyZSBhc2tpbmcgZm9yIG1vcmUgdGhhbiB0aGUgY3VycmVudCBod20sIHRoZW4gcmFpc2UgdGhlIGh3bS5cbiAgaWYgKG4gPiBzdGF0ZS5oaWdoV2F0ZXJNYXJrKSBzdGF0ZS5oaWdoV2F0ZXJNYXJrID0gY29tcHV0ZU5ld0hpZ2hXYXRlck1hcmsobik7XG4gIGlmIChuIDw9IHN0YXRlLmxlbmd0aCkgcmV0dXJuIG47XG4gIC8vIERvbid0IGhhdmUgZW5vdWdoXG4gIGlmICghc3RhdGUuZW5kZWQpIHtcbiAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgIHJldHVybiAwO1xuICB9XG4gIHJldHVybiBzdGF0ZS5sZW5ndGg7XG59XG5cbi8vIHlvdSBjYW4gb3ZlcnJpZGUgZWl0aGVyIHRoaXMgbWV0aG9kLCBvciB0aGUgYXN5bmMgX3JlYWQobikgYmVsb3cuXG5SZWFkYWJsZS5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uIChuKSB7XG4gIGRlYnVnKCdyZWFkJywgbik7XG4gIG4gPSBwYXJzZUludChuLCAxMCk7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHZhciBuT3JpZyA9IG47XG4gIGlmIChuICE9PSAwKSBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcblxuICAvLyBpZiB3ZSdyZSBkb2luZyByZWFkKDApIHRvIHRyaWdnZXIgYSByZWFkYWJsZSBldmVudCwgYnV0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhIGJ1bmNoIG9mIGRhdGEgaW4gdGhlIGJ1ZmZlciwgdGhlbiBqdXN0IHRyaWdnZXJcbiAgLy8gdGhlICdyZWFkYWJsZScgZXZlbnQgYW5kIG1vdmUgb24uXG4gIGlmIChuID09PSAwICYmIHN0YXRlLm5lZWRSZWFkYWJsZSAmJiAoKHN0YXRlLmhpZ2hXYXRlck1hcmsgIT09IDAgPyBzdGF0ZS5sZW5ndGggPj0gc3RhdGUuaGlnaFdhdGVyTWFyayA6IHN0YXRlLmxlbmd0aCA+IDApIHx8IHN0YXRlLmVuZGVkKSkge1xuICAgIGRlYnVnKCdyZWFkOiBlbWl0UmVhZGFibGUnLCBzdGF0ZS5sZW5ndGgsIHN0YXRlLmVuZGVkKTtcbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLmVuZGVkKSBlbmRSZWFkYWJsZSh0aGlzKTtlbHNlIGVtaXRSZWFkYWJsZSh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBuID0gaG93TXVjaFRvUmVhZChuLCBzdGF0ZSk7XG5cbiAgLy8gaWYgd2UndmUgZW5kZWQsIGFuZCB3ZSdyZSBub3cgY2xlYXIsIHRoZW4gZmluaXNoIGl0IHVwLlxuICBpZiAobiA9PT0gMCAmJiBzdGF0ZS5lbmRlZCkge1xuICAgIGlmIChzdGF0ZS5sZW5ndGggPT09IDApIGVuZFJlYWRhYmxlKHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQWxsIHRoZSBhY3R1YWwgY2h1bmsgZ2VuZXJhdGlvbiBsb2dpYyBuZWVkcyB0byBiZVxuICAvLyAqYmVsb3cqIHRoZSBjYWxsIHRvIF9yZWFkLiAgVGhlIHJlYXNvbiBpcyB0aGF0IGluIGNlcnRhaW5cbiAgLy8gc3ludGhldGljIHN0cmVhbSBjYXNlcywgc3VjaCBhcyBwYXNzdGhyb3VnaCBzdHJlYW1zLCBfcmVhZFxuICAvLyBtYXkgYmUgYSBjb21wbGV0ZWx5IHN5bmNocm9ub3VzIG9wZXJhdGlvbiB3aGljaCBtYXkgY2hhbmdlXG4gIC8vIHRoZSBzdGF0ZSBvZiB0aGUgcmVhZCBidWZmZXIsIHByb3ZpZGluZyBlbm91Z2ggZGF0YSB3aGVuXG4gIC8vIGJlZm9yZSB0aGVyZSB3YXMgKm5vdCogZW5vdWdoLlxuICAvL1xuICAvLyBTbywgdGhlIHN0ZXBzIGFyZTpcbiAgLy8gMS4gRmlndXJlIG91dCB3aGF0IHRoZSBzdGF0ZSBvZiB0aGluZ3Mgd2lsbCBiZSBhZnRlciB3ZSBkb1xuICAvLyBhIHJlYWQgZnJvbSB0aGUgYnVmZmVyLlxuICAvL1xuICAvLyAyLiBJZiB0aGF0IHJlc3VsdGluZyBzdGF0ZSB3aWxsIHRyaWdnZXIgYSBfcmVhZCwgdGhlbiBjYWxsIF9yZWFkLlxuICAvLyBOb3RlIHRoYXQgdGhpcyBtYXkgYmUgYXN5bmNocm9ub3VzLCBvciBzeW5jaHJvbm91cy4gIFllcywgaXQgaXNcbiAgLy8gZGVlcGx5IHVnbHkgdG8gd3JpdGUgQVBJcyB0aGlzIHdheSwgYnV0IHRoYXQgc3RpbGwgZG9lc24ndCBtZWFuXG4gIC8vIHRoYXQgdGhlIFJlYWRhYmxlIGNsYXNzIHNob3VsZCBiZWhhdmUgaW1wcm9wZXJseSwgYXMgc3RyZWFtcyBhcmVcbiAgLy8gZGVzaWduZWQgdG8gYmUgc3luYy9hc3luYyBhZ25vc3RpYy5cbiAgLy8gVGFrZSBub3RlIGlmIHRoZSBfcmVhZCBjYWxsIGlzIHN5bmMgb3IgYXN5bmMgKGllLCBpZiB0aGUgcmVhZCBjYWxsXG4gIC8vIGhhcyByZXR1cm5lZCB5ZXQpLCBzbyB0aGF0IHdlIGtub3cgd2hldGhlciBvciBub3QgaXQncyBzYWZlIHRvIGVtaXRcbiAgLy8gJ3JlYWRhYmxlJyBldGMuXG4gIC8vXG4gIC8vIDMuIEFjdHVhbGx5IHB1bGwgdGhlIHJlcXVlc3RlZCBjaHVua3Mgb3V0IG9mIHRoZSBidWZmZXIgYW5kIHJldHVybi5cblxuICAvLyBpZiB3ZSBuZWVkIGEgcmVhZGFibGUgZXZlbnQsIHRoZW4gd2UgbmVlZCB0byBkbyBzb21lIHJlYWRpbmcuXG4gIHZhciBkb1JlYWQgPSBzdGF0ZS5uZWVkUmVhZGFibGU7XG4gIGRlYnVnKCduZWVkIHJlYWRhYmxlJywgZG9SZWFkKTtcblxuICAvLyBpZiB3ZSBjdXJyZW50bHkgaGF2ZSBsZXNzIHRoYW4gdGhlIGhpZ2hXYXRlck1hcmssIHRoZW4gYWxzbyByZWFkIHNvbWVcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCB8fCBzdGF0ZS5sZW5ndGggLSBuIDwgc3RhdGUuaGlnaFdhdGVyTWFyaykge1xuICAgIGRvUmVhZCA9IHRydWU7XG4gICAgZGVidWcoJ2xlbmd0aCBsZXNzIHRoYW4gd2F0ZXJtYXJrJywgZG9SZWFkKTtcbiAgfVxuXG4gIC8vIGhvd2V2ZXIsIGlmIHdlJ3ZlIGVuZGVkLCB0aGVuIHRoZXJlJ3Mgbm8gcG9pbnQsIGFuZCBpZiB3ZSdyZSBhbHJlYWR5XG4gIC8vIHJlYWRpbmcsIHRoZW4gaXQncyB1bm5lY2Vzc2FyeS5cbiAgaWYgKHN0YXRlLmVuZGVkIHx8IHN0YXRlLnJlYWRpbmcpIHtcbiAgICBkb1JlYWQgPSBmYWxzZTtcbiAgICBkZWJ1ZygncmVhZGluZyBvciBlbmRlZCcsIGRvUmVhZCk7XG4gIH0gZWxzZSBpZiAoZG9SZWFkKSB7XG4gICAgZGVidWcoJ2RvIHJlYWQnKTtcbiAgICBzdGF0ZS5yZWFkaW5nID0gdHJ1ZTtcbiAgICBzdGF0ZS5zeW5jID0gdHJ1ZTtcbiAgICAvLyBpZiB0aGUgbGVuZ3RoIGlzIGN1cnJlbnRseSB6ZXJvLCB0aGVuIHdlICpuZWVkKiBhIHJlYWRhYmxlIGV2ZW50LlxuICAgIGlmIChzdGF0ZS5sZW5ndGggPT09IDApIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgLy8gY2FsbCBpbnRlcm5hbCByZWFkIG1ldGhvZFxuICAgIHRoaXMuX3JlYWQoc3RhdGUuaGlnaFdhdGVyTWFyayk7XG4gICAgc3RhdGUuc3luYyA9IGZhbHNlO1xuICAgIC8vIElmIF9yZWFkIHB1c2hlZCBkYXRhIHN5bmNocm9ub3VzbHksIHRoZW4gYHJlYWRpbmdgIHdpbGwgYmUgZmFsc2UsXG4gICAgLy8gYW5kIHdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgaG93IG11Y2ggZGF0YSB3ZSBjYW4gcmV0dXJuIHRvIHRoZSB1c2VyLlxuICAgIGlmICghc3RhdGUucmVhZGluZykgbiA9IGhvd011Y2hUb1JlYWQobk9yaWcsIHN0YXRlKTtcbiAgfVxuICB2YXIgcmV0O1xuICBpZiAobiA+IDApIHJldCA9IGZyb21MaXN0KG4sIHN0YXRlKTtlbHNlIHJldCA9IG51bGw7XG4gIGlmIChyZXQgPT09IG51bGwpIHtcbiAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSBzdGF0ZS5sZW5ndGggPD0gc3RhdGUuaGlnaFdhdGVyTWFyaztcbiAgICBuID0gMDtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5sZW5ndGggLT0gbjtcbiAgICBzdGF0ZS5hd2FpdERyYWluID0gMDtcbiAgfVxuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gSWYgd2UgaGF2ZSBub3RoaW5nIGluIHRoZSBidWZmZXIsIHRoZW4gd2Ugd2FudCB0byBrbm93XG4gICAgLy8gYXMgc29vbiBhcyB3ZSAqZG8qIGdldCBzb21ldGhpbmcgaW50byB0aGUgYnVmZmVyLlxuICAgIGlmICghc3RhdGUuZW5kZWQpIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG5cbiAgICAvLyBJZiB3ZSB0cmllZCB0byByZWFkKCkgcGFzdCB0aGUgRU9GLCB0aGVuIGVtaXQgZW5kIG9uIHRoZSBuZXh0IHRpY2suXG4gICAgaWYgKG5PcmlnICE9PSBuICYmIHN0YXRlLmVuZGVkKSBlbmRSZWFkYWJsZSh0aGlzKTtcbiAgfVxuICBpZiAocmV0ICE9PSBudWxsKSB0aGlzLmVtaXQoJ2RhdGEnLCByZXQpO1xuICByZXR1cm4gcmV0O1xufTtcbmZ1bmN0aW9uIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSkge1xuICBkZWJ1Zygnb25Fb2ZDaHVuaycpO1xuICBpZiAoc3RhdGUuZW5kZWQpIHJldHVybjtcbiAgaWYgKHN0YXRlLmRlY29kZXIpIHtcbiAgICB2YXIgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLmVuZCgpO1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuICBpZiAoc3RhdGUuc3luYykge1xuICAgIC8vIGlmIHdlIGFyZSBzeW5jLCB3YWl0IHVudGlsIG5leHQgdGljayB0byBlbWl0IHRoZSBkYXRhLlxuICAgIC8vIE90aGVyd2lzZSB3ZSByaXNrIGVtaXR0aW5nIGRhdGEgaW4gdGhlIGZsb3coKVxuICAgIC8vIHRoZSByZWFkYWJsZSBjb2RlIHRyaWdnZXJzIGR1cmluZyBhIHJlYWQoKSBjYWxsXG4gICAgZW1pdFJlYWRhYmxlKHN0cmVhbSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gZW1pdCAncmVhZGFibGUnIG5vdyB0byBtYWtlIHN1cmUgaXQgZ2V0cyBwaWNrZWQgdXAuXG4gICAgc3RhdGUubmVlZFJlYWRhYmxlID0gZmFsc2U7XG4gICAgaWYgKCFzdGF0ZS5lbWl0dGVkUmVhZGFibGUpIHtcbiAgICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgICBlbWl0UmVhZGFibGVfKHN0cmVhbSk7XG4gICAgfVxuICB9XG59XG5cbi8vIERvbid0IGVtaXQgcmVhZGFibGUgcmlnaHQgYXdheSBpbiBzeW5jIG1vZGUsIGJlY2F1c2UgdGhpcyBjYW4gdHJpZ2dlclxuLy8gYW5vdGhlciByZWFkKCkgY2FsbCA9PiBzdGFjayBvdmVyZmxvdy4gIFRoaXMgd2F5LCBpdCBtaWdodCB0cmlnZ2VyXG4vLyBhIG5leHRUaWNrIHJlY3Vyc2lvbiB3YXJuaW5nLCBidXQgdGhhdCdzIG5vdCBzbyBiYWQuXG5mdW5jdGlvbiBlbWl0UmVhZGFibGUoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgZGVidWcoJ2VtaXRSZWFkYWJsZScsIHN0YXRlLm5lZWRSZWFkYWJsZSwgc3RhdGUuZW1pdHRlZFJlYWRhYmxlKTtcbiAgc3RhdGUubmVlZFJlYWRhYmxlID0gZmFsc2U7XG4gIGlmICghc3RhdGUuZW1pdHRlZFJlYWRhYmxlKSB7XG4gICAgZGVidWcoJ2VtaXRSZWFkYWJsZScsIHN0YXRlLmZsb3dpbmcpO1xuICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhlbWl0UmVhZGFibGVfLCBzdHJlYW0pO1xuICB9XG59XG5mdW5jdGlvbiBlbWl0UmVhZGFibGVfKHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIGRlYnVnKCdlbWl0UmVhZGFibGVfJywgc3RhdGUuZGVzdHJveWVkLCBzdGF0ZS5sZW5ndGgsIHN0YXRlLmVuZGVkKTtcbiAgaWYgKCFzdGF0ZS5kZXN0cm95ZWQgJiYgKHN0YXRlLmxlbmd0aCB8fCBzdGF0ZS5lbmRlZCkpIHtcbiAgICBzdHJlYW0uZW1pdCgncmVhZGFibGUnKTtcbiAgICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIFRoZSBzdHJlYW0gbmVlZHMgYW5vdGhlciByZWFkYWJsZSBldmVudCBpZlxuICAvLyAxLiBJdCBpcyBub3QgZmxvd2luZywgYXMgdGhlIGZsb3cgbWVjaGFuaXNtIHdpbGwgdGFrZVxuICAvLyAgICBjYXJlIG9mIGl0LlxuICAvLyAyLiBJdCBpcyBub3QgZW5kZWQuXG4gIC8vIDMuIEl0IGlzIGJlbG93IHRoZSBoaWdoV2F0ZXJNYXJrLCBzbyB3ZSBjYW4gc2NoZWR1bGVcbiAgLy8gICAgYW5vdGhlciByZWFkYWJsZSBsYXRlci5cbiAgc3RhdGUubmVlZFJlYWRhYmxlID0gIXN0YXRlLmZsb3dpbmcgJiYgIXN0YXRlLmVuZGVkICYmIHN0YXRlLmxlbmd0aCA8PSBzdGF0ZS5oaWdoV2F0ZXJNYXJrO1xuICBmbG93KHN0cmVhbSk7XG59XG5cbi8vIGF0IHRoaXMgcG9pbnQsIHRoZSB1c2VyIGhhcyBwcmVzdW1hYmx5IHNlZW4gdGhlICdyZWFkYWJsZScgZXZlbnQsXG4vLyBhbmQgY2FsbGVkIHJlYWQoKSB0byBjb25zdW1lIHNvbWUgZGF0YS4gIHRoYXQgbWF5IGhhdmUgdHJpZ2dlcmVkXG4vLyBpbiB0dXJuIGFub3RoZXIgX3JlYWQobikgY2FsbCwgaW4gd2hpY2ggY2FzZSByZWFkaW5nID0gdHJ1ZSBpZlxuLy8gaXQncyBpbiBwcm9ncmVzcy5cbi8vIEhvd2V2ZXIsIGlmIHdlJ3JlIG5vdCBlbmRlZCwgb3IgcmVhZGluZywgYW5kIHRoZSBsZW5ndGggPCBod20sXG4vLyB0aGVuIGdvIGFoZWFkIGFuZCB0cnkgdG8gcmVhZCBzb21lIG1vcmUgcHJlZW1wdGl2ZWx5LlxuZnVuY3Rpb24gbWF5YmVSZWFkTW9yZShzdHJlYW0sIHN0YXRlKSB7XG4gIGlmICghc3RhdGUucmVhZGluZ01vcmUpIHtcbiAgICBzdGF0ZS5yZWFkaW5nTW9yZSA9IHRydWU7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhtYXliZVJlYWRNb3JlXywgc3RyZWFtLCBzdGF0ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIG1heWJlUmVhZE1vcmVfKHN0cmVhbSwgc3RhdGUpIHtcbiAgLy8gQXR0ZW1wdCB0byByZWFkIG1vcmUgZGF0YSBpZiB3ZSBzaG91bGQuXG4gIC8vXG4gIC8vIFRoZSBjb25kaXRpb25zIGZvciByZWFkaW5nIG1vcmUgZGF0YSBhcmUgKG9uZSBvZik6XG4gIC8vIC0gTm90IGVub3VnaCBkYXRhIGJ1ZmZlcmVkIChzdGF0ZS5sZW5ndGggPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrKS4gVGhlIGxvb3BcbiAgLy8gICBpcyByZXNwb25zaWJsZSBmb3IgZmlsbGluZyB0aGUgYnVmZmVyIHdpdGggZW5vdWdoIGRhdGEgaWYgc3VjaCBkYXRhXG4gIC8vICAgaXMgYXZhaWxhYmxlLiBJZiBoaWdoV2F0ZXJNYXJrIGlzIDAgYW5kIHdlIGFyZSBub3QgaW4gdGhlIGZsb3dpbmcgbW9kZVxuICAvLyAgIHdlIHNob3VsZCBfbm90XyBhdHRlbXB0IHRvIGJ1ZmZlciBhbnkgZXh0cmEgZGF0YS4gV2UnbGwgZ2V0IG1vcmUgZGF0YVxuICAvLyAgIHdoZW4gdGhlIHN0cmVhbSBjb25zdW1lciBjYWxscyByZWFkKCkgaW5zdGVhZC5cbiAgLy8gLSBObyBkYXRhIGluIHRoZSBidWZmZXIsIGFuZCB0aGUgc3RyZWFtIGlzIGluIGZsb3dpbmcgbW9kZS4gSW4gdGhpcyBtb2RlXG4gIC8vICAgdGhlIGxvb3AgYmVsb3cgaXMgcmVzcG9uc2libGUgZm9yIGVuc3VyaW5nIHJlYWQoKSBpcyBjYWxsZWQuIEZhaWxpbmcgdG9cbiAgLy8gICBjYWxsIHJlYWQgaGVyZSB3b3VsZCBhYm9ydCB0aGUgZmxvdyBhbmQgdGhlcmUncyBubyBvdGhlciBtZWNoYW5pc20gZm9yXG4gIC8vICAgY29udGludWluZyB0aGUgZmxvdyBpZiB0aGUgc3RyZWFtIGNvbnN1bWVyIGhhcyBqdXN0IHN1YnNjcmliZWQgdG8gdGhlXG4gIC8vICAgJ2RhdGEnIGV2ZW50LlxuICAvL1xuICAvLyBJbiBhZGRpdGlvbiB0byB0aGUgYWJvdmUgY29uZGl0aW9ucyB0byBrZWVwIHJlYWRpbmcgZGF0YSwgdGhlIGZvbGxvd2luZ1xuICAvLyBjb25kaXRpb25zIHByZXZlbnQgdGhlIGRhdGEgZnJvbSBiZWluZyByZWFkOlxuICAvLyAtIFRoZSBzdHJlYW0gaGFzIGVuZGVkIChzdGF0ZS5lbmRlZCkuXG4gIC8vIC0gVGhlcmUgaXMgYWxyZWFkeSBhIHBlbmRpbmcgJ3JlYWQnIG9wZXJhdGlvbiAoc3RhdGUucmVhZGluZykuIFRoaXMgaXMgYVxuICAvLyAgIGNhc2Ugd2hlcmUgdGhlIHRoZSBzdHJlYW0gaGFzIGNhbGxlZCB0aGUgaW1wbGVtZW50YXRpb24gZGVmaW5lZCBfcmVhZCgpXG4gIC8vICAgbWV0aG9kLCBidXQgdGhleSBhcmUgcHJvY2Vzc2luZyB0aGUgY2FsbCBhc3luY2hyb25vdXNseSBhbmQgaGF2ZSBfbm90X1xuICAvLyAgIGNhbGxlZCBwdXNoKCkgd2l0aCBuZXcgZGF0YS4gSW4gdGhpcyBjYXNlIHdlIHNraXAgcGVyZm9ybWluZyBtb3JlXG4gIC8vICAgcmVhZCgpcy4gVGhlIGV4ZWN1dGlvbiBlbmRzIGluIHRoaXMgbWV0aG9kIGFnYWluIGFmdGVyIHRoZSBfcmVhZCgpIGVuZHNcbiAgLy8gICB1cCBjYWxsaW5nIHB1c2goKSB3aXRoIG1vcmUgZGF0YS5cbiAgd2hpbGUgKCFzdGF0ZS5yZWFkaW5nICYmICFzdGF0ZS5lbmRlZCAmJiAoc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyayB8fCBzdGF0ZS5mbG93aW5nICYmIHN0YXRlLmxlbmd0aCA9PT0gMCkpIHtcbiAgICB2YXIgbGVuID0gc3RhdGUubGVuZ3RoO1xuICAgIGRlYnVnKCdtYXliZVJlYWRNb3JlIHJlYWQgMCcpO1xuICAgIHN0cmVhbS5yZWFkKDApO1xuICAgIGlmIChsZW4gPT09IHN0YXRlLmxlbmd0aClcbiAgICAgIC8vIGRpZG4ndCBnZXQgYW55IGRhdGEsIHN0b3Agc3Bpbm5pbmcuXG4gICAgICBicmVhaztcbiAgfVxuICBzdGF0ZS5yZWFkaW5nTW9yZSA9IGZhbHNlO1xufVxuXG4vLyBhYnN0cmFjdCBtZXRob2QuICB0byBiZSBvdmVycmlkZGVuIGluIHNwZWNpZmljIGltcGxlbWVudGF0aW9uIGNsYXNzZXMuXG4vLyBjYWxsIGNiKGVyLCBkYXRhKSB3aGVyZSBkYXRhIGlzIDw9IG4gaW4gbGVuZ3RoLlxuLy8gZm9yIHZpcnR1YWwgKG5vbi1zdHJpbmcsIG5vbi1idWZmZXIpIHN0cmVhbXMsIFwibGVuZ3RoXCIgaXMgc29tZXdoYXRcbi8vIGFyYml0cmFyeSwgYW5kIHBlcmhhcHMgbm90IHZlcnkgbWVhbmluZ2Z1bC5cblJlYWRhYmxlLnByb3RvdHlwZS5fcmVhZCA9IGZ1bmN0aW9uIChuKSB7XG4gIGVycm9yT3JEZXN0cm95KHRoaXMsIG5ldyBFUlJfTUVUSE9EX05PVF9JTVBMRU1FTlRFRCgnX3JlYWQoKScpKTtcbn07XG5SZWFkYWJsZS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uIChkZXN0LCBwaXBlT3B0cykge1xuICB2YXIgc3JjID0gdGhpcztcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgc3dpdGNoIChzdGF0ZS5waXBlc0NvdW50KSB7XG4gICAgY2FzZSAwOlxuICAgICAgc3RhdGUucGlwZXMgPSBkZXN0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAxOlxuICAgICAgc3RhdGUucGlwZXMgPSBbc3RhdGUucGlwZXMsIGRlc3RdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHN0YXRlLnBpcGVzLnB1c2goZGVzdCk7XG4gICAgICBicmVhaztcbiAgfVxuICBzdGF0ZS5waXBlc0NvdW50ICs9IDE7XG4gIGRlYnVnKCdwaXBlIGNvdW50PSVkIG9wdHM9JWonLCBzdGF0ZS5waXBlc0NvdW50LCBwaXBlT3B0cyk7XG4gIHZhciBkb0VuZCA9ICghcGlwZU9wdHMgfHwgcGlwZU9wdHMuZW5kICE9PSBmYWxzZSkgJiYgZGVzdCAhPT0gcHJvY2Vzcy5zdGRvdXQgJiYgZGVzdCAhPT0gcHJvY2Vzcy5zdGRlcnI7XG4gIHZhciBlbmRGbiA9IGRvRW5kID8gb25lbmQgOiB1bnBpcGU7XG4gIGlmIChzdGF0ZS5lbmRFbWl0dGVkKSBwcm9jZXNzLm5leHRUaWNrKGVuZEZuKTtlbHNlIHNyYy5vbmNlKCdlbmQnLCBlbmRGbik7XG4gIGRlc3Qub24oJ3VucGlwZScsIG9udW5waXBlKTtcbiAgZnVuY3Rpb24gb251bnBpcGUocmVhZGFibGUsIHVucGlwZUluZm8pIHtcbiAgICBkZWJ1Zygnb251bnBpcGUnKTtcbiAgICBpZiAocmVhZGFibGUgPT09IHNyYykge1xuICAgICAgaWYgKHVucGlwZUluZm8gJiYgdW5waXBlSW5mby5oYXNVbnBpcGVkID09PSBmYWxzZSkge1xuICAgICAgICB1bnBpcGVJbmZvLmhhc1VucGlwZWQgPSB0cnVlO1xuICAgICAgICBjbGVhbnVwKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGRlYnVnKCdvbmVuZCcpO1xuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuICAvLyB3aGVuIHRoZSBkZXN0IGRyYWlucywgaXQgcmVkdWNlcyB0aGUgYXdhaXREcmFpbiBjb3VudGVyXG4gIC8vIG9uIHRoZSBzb3VyY2UuICBUaGlzIHdvdWxkIGJlIG1vcmUgZWxlZ2FudCB3aXRoIGEgLm9uY2UoKVxuICAvLyBoYW5kbGVyIGluIGZsb3coKSwgYnV0IGFkZGluZyBhbmQgcmVtb3ZpbmcgcmVwZWF0ZWRseSBpc1xuICAvLyB0b28gc2xvdy5cbiAgdmFyIG9uZHJhaW4gPSBwaXBlT25EcmFpbihzcmMpO1xuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuICB2YXIgY2xlYW5lZFVwID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgZGVidWcoJ2NsZWFudXAnKTtcbiAgICAvLyBjbGVhbnVwIGV2ZW50IGhhbmRsZXJzIG9uY2UgdGhlIHBpcGUgaXMgYnJva2VuXG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmNsb3NlKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZHJhaW4nLCBvbmRyYWluKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ3VucGlwZScsIG9udW5waXBlKTtcbiAgICBzcmMucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uZW5kKTtcbiAgICBzcmMucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIHVucGlwZSk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25kYXRhKTtcbiAgICBjbGVhbmVkVXAgPSB0cnVlO1xuXG4gICAgLy8gaWYgdGhlIHJlYWRlciBpcyB3YWl0aW5nIGZvciBhIGRyYWluIGV2ZW50IGZyb20gdGhpc1xuICAgIC8vIHNwZWNpZmljIHdyaXRlciwgdGhlbiBpdCB3b3VsZCBjYXVzZSBpdCB0byBuZXZlciBzdGFydFxuICAgIC8vIGZsb3dpbmcgYWdhaW4uXG4gICAgLy8gU28sIGlmIHRoaXMgaXMgYXdhaXRpbmcgYSBkcmFpbiwgdGhlbiB3ZSBqdXN0IGNhbGwgaXQgbm93LlxuICAgIC8vIElmIHdlIGRvbid0IGtub3csIHRoZW4gYXNzdW1lIHRoYXQgd2UgYXJlIHdhaXRpbmcgZm9yIG9uZS5cbiAgICBpZiAoc3RhdGUuYXdhaXREcmFpbiAmJiAoIWRlc3QuX3dyaXRhYmxlU3RhdGUgfHwgZGVzdC5fd3JpdGFibGVTdGF0ZS5uZWVkRHJhaW4pKSBvbmRyYWluKCk7XG4gIH1cbiAgc3JjLm9uKCdkYXRhJywgb25kYXRhKTtcbiAgZnVuY3Rpb24gb25kYXRhKGNodW5rKSB7XG4gICAgZGVidWcoJ29uZGF0YScpO1xuICAgIHZhciByZXQgPSBkZXN0LndyaXRlKGNodW5rKTtcbiAgICBkZWJ1ZygnZGVzdC53cml0ZScsIHJldCk7XG4gICAgaWYgKHJldCA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIElmIHRoZSB1c2VyIHVucGlwZWQgZHVyaW5nIGBkZXN0LndyaXRlKClgLCBpdCBpcyBwb3NzaWJsZVxuICAgICAgLy8gdG8gZ2V0IHN0dWNrIGluIGEgcGVybWFuZW50bHkgcGF1c2VkIHN0YXRlIGlmIHRoYXQgd3JpdGVcbiAgICAgIC8vIGFsc28gcmV0dXJuZWQgZmFsc2UuXG4gICAgICAvLyA9PiBDaGVjayB3aGV0aGVyIGBkZXN0YCBpcyBzdGlsbCBhIHBpcGluZyBkZXN0aW5hdGlvbi5cbiAgICAgIGlmICgoc3RhdGUucGlwZXNDb3VudCA9PT0gMSAmJiBzdGF0ZS5waXBlcyA9PT0gZGVzdCB8fCBzdGF0ZS5waXBlc0NvdW50ID4gMSAmJiBpbmRleE9mKHN0YXRlLnBpcGVzLCBkZXN0KSAhPT0gLTEpICYmICFjbGVhbmVkVXApIHtcbiAgICAgICAgZGVidWcoJ2ZhbHNlIHdyaXRlIHJlc3BvbnNlLCBwYXVzZScsIHN0YXRlLmF3YWl0RHJhaW4pO1xuICAgICAgICBzdGF0ZS5hd2FpdERyYWluKys7XG4gICAgICB9XG4gICAgICBzcmMucGF1c2UoKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgZGVzdCBoYXMgYW4gZXJyb3IsIHRoZW4gc3RvcCBwaXBpbmcgaW50byBpdC5cbiAgLy8gaG93ZXZlciwgZG9uJ3Qgc3VwcHJlc3MgdGhlIHRocm93aW5nIGJlaGF2aW9yIGZvciB0aGlzLlxuICBmdW5jdGlvbiBvbmVycm9yKGVyKSB7XG4gICAgZGVidWcoJ29uZXJyb3InLCBlcik7XG4gICAgdW5waXBlKCk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBpZiAoRUVsaXN0ZW5lckNvdW50KGRlc3QsICdlcnJvcicpID09PSAwKSBlcnJvck9yRGVzdHJveShkZXN0LCBlcik7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgb3VyIGVycm9yIGhhbmRsZXIgaXMgYXR0YWNoZWQgYmVmb3JlIHVzZXJsYW5kIG9uZXMuXG4gIHByZXBlbmRMaXN0ZW5lcihkZXN0LCAnZXJyb3InLCBvbmVycm9yKTtcblxuICAvLyBCb3RoIGNsb3NlIGFuZCBmaW5pc2ggc2hvdWxkIHRyaWdnZXIgdW5waXBlLCBidXQgb25seSBvbmNlLlxuICBmdW5jdGlvbiBvbmNsb3NlKCkge1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICB1bnBpcGUoKTtcbiAgfVxuICBkZXN0Lm9uY2UoJ2Nsb3NlJywgb25jbG9zZSk7XG4gIGZ1bmN0aW9uIG9uZmluaXNoKCkge1xuICAgIGRlYnVnKCdvbmZpbmlzaCcpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gIGZ1bmN0aW9uIHVucGlwZSgpIHtcbiAgICBkZWJ1ZygndW5waXBlJyk7XG4gICAgc3JjLnVucGlwZShkZXN0KTtcbiAgfVxuXG4gIC8vIHRlbGwgdGhlIGRlc3QgdGhhdCBpdCdzIGJlaW5nIHBpcGVkIHRvXG4gIGRlc3QuZW1pdCgncGlwZScsIHNyYyk7XG5cbiAgLy8gc3RhcnQgdGhlIGZsb3cgaWYgaXQgaGFzbid0IGJlZW4gc3RhcnRlZCBhbHJlYWR5LlxuICBpZiAoIXN0YXRlLmZsb3dpbmcpIHtcbiAgICBkZWJ1ZygncGlwZSByZXN1bWUnKTtcbiAgICBzcmMucmVzdW1lKCk7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59O1xuZnVuY3Rpb24gcGlwZU9uRHJhaW4oc3JjKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwaXBlT25EcmFpbkZ1bmN0aW9uUmVzdWx0KCkge1xuICAgIHZhciBzdGF0ZSA9IHNyYy5fcmVhZGFibGVTdGF0ZTtcbiAgICBkZWJ1ZygncGlwZU9uRHJhaW4nLCBzdGF0ZS5hd2FpdERyYWluKTtcbiAgICBpZiAoc3RhdGUuYXdhaXREcmFpbikgc3RhdGUuYXdhaXREcmFpbi0tO1xuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluID09PSAwICYmIEVFbGlzdGVuZXJDb3VudChzcmMsICdkYXRhJykpIHtcbiAgICAgIHN0YXRlLmZsb3dpbmcgPSB0cnVlO1xuICAgICAgZmxvdyhzcmMpO1xuICAgIH1cbiAgfTtcbn1cblJlYWRhYmxlLnByb3RvdHlwZS51bnBpcGUgPSBmdW5jdGlvbiAoZGVzdCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgdW5waXBlSW5mbyA9IHtcbiAgICBoYXNVbnBpcGVkOiBmYWxzZVxuICB9O1xuXG4gIC8vIGlmIHdlJ3JlIG5vdCBwaXBpbmcgYW55d2hlcmUsIHRoZW4gZG8gbm90aGluZy5cbiAgaWYgKHN0YXRlLnBpcGVzQ291bnQgPT09IDApIHJldHVybiB0aGlzO1xuXG4gIC8vIGp1c3Qgb25lIGRlc3RpbmF0aW9uLiAgbW9zdCBjb21tb24gY2FzZS5cbiAgaWYgKHN0YXRlLnBpcGVzQ291bnQgPT09IDEpIHtcbiAgICAvLyBwYXNzZWQgaW4gb25lLCBidXQgaXQncyBub3QgdGhlIHJpZ2h0IG9uZS5cbiAgICBpZiAoZGVzdCAmJiBkZXN0ICE9PSBzdGF0ZS5waXBlcykgcmV0dXJuIHRoaXM7XG4gICAgaWYgKCFkZXN0KSBkZXN0ID0gc3RhdGUucGlwZXM7XG5cbiAgICAvLyBnb3QgYSBtYXRjaC5cbiAgICBzdGF0ZS5waXBlcyA9IG51bGw7XG4gICAgc3RhdGUucGlwZXNDb3VudCA9IDA7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuICAgIGlmIChkZXN0KSBkZXN0LmVtaXQoJ3VucGlwZScsIHRoaXMsIHVucGlwZUluZm8pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc2xvdyBjYXNlLiBtdWx0aXBsZSBwaXBlIGRlc3RpbmF0aW9ucy5cblxuICBpZiAoIWRlc3QpIHtcbiAgICAvLyByZW1vdmUgYWxsLlxuICAgIHZhciBkZXN0cyA9IHN0YXRlLnBpcGVzO1xuICAgIHZhciBsZW4gPSBzdGF0ZS5waXBlc0NvdW50O1xuICAgIHN0YXRlLnBpcGVzID0gbnVsbDtcbiAgICBzdGF0ZS5waXBlc0NvdW50ID0gMDtcbiAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgZGVzdHNbaV0uZW1pdCgndW5waXBlJywgdGhpcywge1xuICAgICAgaGFzVW5waXBlZDogZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHRyeSB0byBmaW5kIHRoZSByaWdodCBvbmUuXG4gIHZhciBpbmRleCA9IGluZGV4T2Yoc3RhdGUucGlwZXMsIGRlc3QpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gdGhpcztcbiAgc3RhdGUucGlwZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgc3RhdGUucGlwZXNDb3VudCAtPSAxO1xuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMSkgc3RhdGUucGlwZXMgPSBzdGF0ZS5waXBlc1swXTtcbiAgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzLCB1bnBpcGVJbmZvKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBzZXQgdXAgZGF0YSBldmVudHMgaWYgdGhleSBhcmUgYXNrZWQgZm9yXG4vLyBFbnN1cmUgcmVhZGFibGUgbGlzdGVuZXJzIGV2ZW50dWFsbHkgZ2V0IHNvbWV0aGluZ1xuUmVhZGFibGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2LCBmbikge1xuICB2YXIgcmVzID0gU3RyZWFtLnByb3RvdHlwZS5vbi5jYWxsKHRoaXMsIGV2LCBmbik7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIGlmIChldiA9PT0gJ2RhdGEnKSB7XG4gICAgLy8gdXBkYXRlIHJlYWRhYmxlTGlzdGVuaW5nIHNvIHRoYXQgcmVzdW1lKCkgbWF5IGJlIGEgbm8tb3BcbiAgICAvLyBhIGZldyBsaW5lcyBkb3duLiBUaGlzIGlzIG5lZWRlZCB0byBzdXBwb3J0IG9uY2UoJ3JlYWRhYmxlJykuXG4gICAgc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcgPSB0aGlzLmxpc3RlbmVyQ291bnQoJ3JlYWRhYmxlJykgPiAwO1xuXG4gICAgLy8gVHJ5IHN0YXJ0IGZsb3dpbmcgb24gbmV4dCB0aWNrIGlmIHN0cmVhbSBpc24ndCBleHBsaWNpdGx5IHBhdXNlZFxuICAgIGlmIChzdGF0ZS5mbG93aW5nICE9PSBmYWxzZSkgdGhpcy5yZXN1bWUoKTtcbiAgfSBlbHNlIGlmIChldiA9PT0gJ3JlYWRhYmxlJykge1xuICAgIGlmICghc3RhdGUuZW5kRW1pdHRlZCAmJiAhc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcpIHtcbiAgICAgIHN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nID0gc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmZsb3dpbmcgPSBmYWxzZTtcbiAgICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgZGVidWcoJ29uIHJlYWRhYmxlJywgc3RhdGUubGVuZ3RoLCBzdGF0ZS5yZWFkaW5nKTtcbiAgICAgIGlmIChzdGF0ZS5sZW5ndGgpIHtcbiAgICAgICAgZW1pdFJlYWRhYmxlKHRoaXMpO1xuICAgICAgfSBlbHNlIGlmICghc3RhdGUucmVhZGluZykge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKG5SZWFkaW5nTmV4dFRpY2ssIHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufTtcblJlYWRhYmxlLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IFJlYWRhYmxlLnByb3RvdHlwZS5vbjtcblJlYWRhYmxlLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChldiwgZm4pIHtcbiAgdmFyIHJlcyA9IFN0cmVhbS5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIuY2FsbCh0aGlzLCBldiwgZm4pO1xuICBpZiAoZXYgPT09ICdyZWFkYWJsZScpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIGlmIHRoZXJlIGlzIHNvbWVvbmUgc3RpbGwgbGlzdGVuaW5nIHRvXG4gICAgLy8gcmVhZGFibGUgYW5kIHJlc2V0IHRoZSBzdGF0ZS4gSG93ZXZlciB0aGlzIG5lZWRzIHRvIGhhcHBlblxuICAgIC8vIGFmdGVyIHJlYWRhYmxlIGhhcyBiZWVuIGVtaXR0ZWQgYnV0IGJlZm9yZSBJL08gKG5leHRUaWNrKSB0b1xuICAgIC8vIHN1cHBvcnQgb25jZSgncmVhZGFibGUnLCBmbikgY3ljbGVzLiBUaGlzIG1lYW5zIHRoYXQgY2FsbGluZ1xuICAgIC8vIHJlc3VtZSB3aXRoaW4gdGhlIHNhbWUgdGljayB3aWxsIGhhdmUgbm9cbiAgICAvLyBlZmZlY3QuXG4gICAgcHJvY2Vzcy5uZXh0VGljayh1cGRhdGVSZWFkYWJsZUxpc3RlbmluZywgdGhpcyk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG5SZWFkYWJsZS5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gKGV2KSB7XG4gIHZhciByZXMgPSBTdHJlYW0ucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICBpZiAoZXYgPT09ICdyZWFkYWJsZScgfHwgZXYgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlcmUgaXMgc29tZW9uZSBzdGlsbCBsaXN0ZW5pbmcgdG9cbiAgICAvLyByZWFkYWJsZSBhbmQgcmVzZXQgdGhlIHN0YXRlLiBIb3dldmVyIHRoaXMgbmVlZHMgdG8gaGFwcGVuXG4gICAgLy8gYWZ0ZXIgcmVhZGFibGUgaGFzIGJlZW4gZW1pdHRlZCBidXQgYmVmb3JlIEkvTyAobmV4dFRpY2spIHRvXG4gICAgLy8gc3VwcG9ydCBvbmNlKCdyZWFkYWJsZScsIGZuKSBjeWNsZXMuIFRoaXMgbWVhbnMgdGhhdCBjYWxsaW5nXG4gICAgLy8gcmVzdW1lIHdpdGhpbiB0aGUgc2FtZSB0aWNrIHdpbGwgaGF2ZSBub1xuICAgIC8vIGVmZmVjdC5cbiAgICBwcm9jZXNzLm5leHRUaWNrKHVwZGF0ZVJlYWRhYmxlTGlzdGVuaW5nLCB0aGlzKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbmZ1bmN0aW9uIHVwZGF0ZVJlYWRhYmxlTGlzdGVuaW5nKHNlbGYpIHtcbiAgdmFyIHN0YXRlID0gc2VsZi5fcmVhZGFibGVTdGF0ZTtcbiAgc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcgPSBzZWxmLmxpc3RlbmVyQ291bnQoJ3JlYWRhYmxlJykgPiAwO1xuICBpZiAoc3RhdGUucmVzdW1lU2NoZWR1bGVkICYmICFzdGF0ZS5wYXVzZWQpIHtcbiAgICAvLyBmbG93aW5nIG5lZWRzIHRvIGJlIHNldCB0byB0cnVlIG5vdywgb3RoZXJ3aXNlXG4gICAgLy8gdGhlIHVwY29taW5nIHJlc3VtZSB3aWxsIG5vdCBmbG93LlxuICAgIHN0YXRlLmZsb3dpbmcgPSB0cnVlO1xuXG4gICAgLy8gY3J1ZGUgd2F5IHRvIGNoZWNrIGlmIHdlIHNob3VsZCByZXN1bWVcbiAgfSBlbHNlIGlmIChzZWxmLmxpc3RlbmVyQ291bnQoJ2RhdGEnKSA+IDApIHtcbiAgICBzZWxmLnJlc3VtZSgpO1xuICB9XG59XG5mdW5jdGlvbiBuUmVhZGluZ05leHRUaWNrKHNlbGYpIHtcbiAgZGVidWcoJ3JlYWRhYmxlIG5leHR0aWNrIHJlYWQgMCcpO1xuICBzZWxmLnJlYWQoMCk7XG59XG5cbi8vIHBhdXNlKCkgYW5kIHJlc3VtZSgpIGFyZSByZW1uYW50cyBvZiB0aGUgbGVnYWN5IHJlYWRhYmxlIHN0cmVhbSBBUElcbi8vIElmIHRoZSB1c2VyIHVzZXMgdGhlbSwgdGhlbiBzd2l0Y2ggaW50byBvbGQgbW9kZS5cblJlYWRhYmxlLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdyZXN1bWUnKTtcbiAgICAvLyB3ZSBmbG93IG9ubHkgaWYgdGhlcmUgaXMgbm8gb25lIGxpc3RlbmluZ1xuICAgIC8vIGZvciByZWFkYWJsZSwgYnV0IHdlIHN0aWxsIGhhdmUgdG8gY2FsbFxuICAgIC8vIHJlc3VtZSgpXG4gICAgc3RhdGUuZmxvd2luZyA9ICFzdGF0ZS5yZWFkYWJsZUxpc3RlbmluZztcbiAgICByZXN1bWUodGhpcywgc3RhdGUpO1xuICB9XG4gIHN0YXRlLnBhdXNlZCA9IGZhbHNlO1xuICByZXR1cm4gdGhpcztcbn07XG5mdW5jdGlvbiByZXN1bWUoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoIXN0YXRlLnJlc3VtZVNjaGVkdWxlZCkge1xuICAgIHN0YXRlLnJlc3VtZVNjaGVkdWxlZCA9IHRydWU7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhyZXN1bWVfLCBzdHJlYW0sIHN0YXRlKTtcbiAgfVxufVxuZnVuY3Rpb24gcmVzdW1lXyhzdHJlYW0sIHN0YXRlKSB7XG4gIGRlYnVnKCdyZXN1bWUnLCBzdGF0ZS5yZWFkaW5nKTtcbiAgaWYgKCFzdGF0ZS5yZWFkaW5nKSB7XG4gICAgc3RyZWFtLnJlYWQoMCk7XG4gIH1cbiAgc3RhdGUucmVzdW1lU2NoZWR1bGVkID0gZmFsc2U7XG4gIHN0cmVhbS5lbWl0KCdyZXN1bWUnKTtcbiAgZmxvdyhzdHJlYW0pO1xuICBpZiAoc3RhdGUuZmxvd2luZyAmJiAhc3RhdGUucmVhZGluZykgc3RyZWFtLnJlYWQoMCk7XG59XG5SZWFkYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gIGRlYnVnKCdjYWxsIHBhdXNlIGZsb3dpbmc9JWonLCB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpO1xuICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nICE9PSBmYWxzZSkge1xuICAgIGRlYnVnKCdwYXVzZScpO1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuICAgIHRoaXMuZW1pdCgncGF1c2UnKTtcbiAgfVxuICB0aGlzLl9yZWFkYWJsZVN0YXRlLnBhdXNlZCA9IHRydWU7XG4gIHJldHVybiB0aGlzO1xufTtcbmZ1bmN0aW9uIGZsb3coc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgZGVidWcoJ2Zsb3cnLCBzdGF0ZS5mbG93aW5nKTtcbiAgd2hpbGUgKHN0YXRlLmZsb3dpbmcgJiYgc3RyZWFtLnJlYWQoKSAhPT0gbnVsbCk7XG59XG5cbi8vIHdyYXAgYW4gb2xkLXN0eWxlIHN0cmVhbSBhcyB0aGUgYXN5bmMgZGF0YSBzb3VyY2UuXG4vLyBUaGlzIGlzICpub3QqIHBhcnQgb2YgdGhlIHJlYWRhYmxlIHN0cmVhbSBpbnRlcmZhY2UuXG4vLyBJdCBpcyBhbiB1Z2x5IHVuZm9ydHVuYXRlIG1lc3Mgb2YgaGlzdG9yeS5cblJlYWRhYmxlLnByb3RvdHlwZS53cmFwID0gZnVuY3Rpb24gKHN0cmVhbSkge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgcGF1c2VkID0gZmFsc2U7XG4gIHN0cmVhbS5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgIGRlYnVnKCd3cmFwcGVkIGVuZCcpO1xuICAgIGlmIChzdGF0ZS5kZWNvZGVyICYmICFzdGF0ZS5lbmRlZCkge1xuICAgICAgdmFyIGNodW5rID0gc3RhdGUuZGVjb2Rlci5lbmQoKTtcbiAgICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIF90aGlzLnB1c2goY2h1bmspO1xuICAgIH1cbiAgICBfdGhpcy5wdXNoKG51bGwpO1xuICB9KTtcbiAgc3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgZGVidWcoJ3dyYXBwZWQgZGF0YScpO1xuICAgIGlmIChzdGF0ZS5kZWNvZGVyKSBjaHVuayA9IHN0YXRlLmRlY29kZXIud3JpdGUoY2h1bmspO1xuXG4gICAgLy8gZG9uJ3Qgc2tpcCBvdmVyIGZhbHN5IHZhbHVlcyBpbiBvYmplY3RNb2RlXG4gICAgaWYgKHN0YXRlLm9iamVjdE1vZGUgJiYgKGNodW5rID09PSBudWxsIHx8IGNodW5rID09PSB1bmRlZmluZWQpKSByZXR1cm47ZWxzZSBpZiAoIXN0YXRlLm9iamVjdE1vZGUgJiYgKCFjaHVuayB8fCAhY2h1bmsubGVuZ3RoKSkgcmV0dXJuO1xuICAgIHZhciByZXQgPSBfdGhpcy5wdXNoKGNodW5rKTtcbiAgICBpZiAoIXJldCkge1xuICAgICAgcGF1c2VkID0gdHJ1ZTtcbiAgICAgIHN0cmVhbS5wYXVzZSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gcHJveHkgYWxsIHRoZSBvdGhlciBtZXRob2RzLlxuICAvLyBpbXBvcnRhbnQgd2hlbiB3cmFwcGluZyBmaWx0ZXJzIGFuZCBkdXBsZXhlcy5cbiAgZm9yICh2YXIgaSBpbiBzdHJlYW0pIHtcbiAgICBpZiAodGhpc1tpXSA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBzdHJlYW1baV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXNbaV0gPSBmdW5jdGlvbiBtZXRob2RXcmFwKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbWV0aG9kV3JhcFJldHVybkZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBzdHJlYW1bbWV0aG9kXS5hcHBseShzdHJlYW0sIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9KGkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHByb3h5IGNlcnRhaW4gaW1wb3J0YW50IGV2ZW50cy5cbiAgZm9yICh2YXIgbiA9IDA7IG4gPCBrUHJveHlFdmVudHMubGVuZ3RoOyBuKyspIHtcbiAgICBzdHJlYW0ub24oa1Byb3h5RXZlbnRzW25dLCB0aGlzLmVtaXQuYmluZCh0aGlzLCBrUHJveHlFdmVudHNbbl0pKTtcbiAgfVxuXG4gIC8vIHdoZW4gd2UgdHJ5IHRvIGNvbnN1bWUgc29tZSBtb3JlIGJ5dGVzLCBzaW1wbHkgdW5wYXVzZSB0aGVcbiAgLy8gdW5kZXJseWluZyBzdHJlYW0uXG4gIHRoaXMuX3JlYWQgPSBmdW5jdGlvbiAobikge1xuICAgIGRlYnVnKCd3cmFwcGVkIF9yZWFkJywgbik7XG4gICAgaWYgKHBhdXNlZCkge1xuICAgICAgcGF1c2VkID0gZmFsc2U7XG4gICAgICBzdHJlYW0ucmVzdW1lKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdGhpcztcbn07XG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xuICBSZWFkYWJsZS5wcm90b3R5cGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjcmVhdGVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY3JlYXRlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9zdHJlYW1zL2FzeW5jX2l0ZXJhdG9yJyk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IodGhpcyk7XG4gIH07XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGUucHJvdG90eXBlLCAncmVhZGFibGVIaWdoV2F0ZXJNYXJrJywge1xuICAvLyBtYWtpbmcgaXQgZXhwbGljaXQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgZW51bWVyYWJsZVxuICAvLyBiZWNhdXNlIG90aGVyd2lzZSBzb21lIHByb3RvdHlwZSBtYW5pcHVsYXRpb24gaW5cbiAgLy8gdXNlcmxhbmQgd2lsbCBmYWlsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5oaWdoV2F0ZXJNYXJrO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZS5wcm90b3R5cGUsICdyZWFkYWJsZUJ1ZmZlcicsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUgJiYgdGhpcy5fcmVhZGFibGVTdGF0ZS5idWZmZXI7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlLnByb3RvdHlwZSwgJ3JlYWRhYmxlRmxvd2luZycsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZztcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiBzZXQoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSkge1xuICAgICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nID0gc3RhdGU7XG4gICAgfVxuICB9XG59KTtcblxuLy8gZXhwb3NlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5LlxuUmVhZGFibGUuX2Zyb21MaXN0ID0gZnJvbUxpc3Q7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGUucHJvdG90eXBlLCAncmVhZGFibGVMZW5ndGgnLCB7XG4gIC8vIG1ha2luZyBpdCBleHBsaWNpdCB0aGlzIHByb3BlcnR5IGlzIG5vdCBlbnVtZXJhYmxlXG4gIC8vIGJlY2F1c2Ugb3RoZXJ3aXNlIHNvbWUgcHJvdG90eXBlIG1hbmlwdWxhdGlvbiBpblxuICAvLyB1c2VybGFuZCB3aWxsIGZhaWxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmxlbmd0aDtcbiAgfVxufSk7XG5cbi8vIFBsdWNrIG9mZiBuIGJ5dGVzIGZyb20gYW4gYXJyYXkgb2YgYnVmZmVycy5cbi8vIExlbmd0aCBpcyB0aGUgY29tYmluZWQgbGVuZ3RocyBvZiBhbGwgdGhlIGJ1ZmZlcnMgaW4gdGhlIGxpc3QuXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIGRlc2lnbmVkIHRvIGJlIGlubGluYWJsZSwgc28gcGxlYXNlIHRha2UgY2FyZSB3aGVuIG1ha2luZ1xuLy8gY2hhbmdlcyB0byB0aGUgZnVuY3Rpb24gYm9keS5cbmZ1bmN0aW9uIGZyb21MaXN0KG4sIHN0YXRlKSB7XG4gIC8vIG5vdGhpbmcgYnVmZmVyZWRcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gIHZhciByZXQ7XG4gIGlmIChzdGF0ZS5vYmplY3RNb2RlKSByZXQgPSBzdGF0ZS5idWZmZXIuc2hpZnQoKTtlbHNlIGlmICghbiB8fCBuID49IHN0YXRlLmxlbmd0aCkge1xuICAgIC8vIHJlYWQgaXQgYWxsLCB0cnVuY2F0ZSB0aGUgbGlzdFxuICAgIGlmIChzdGF0ZS5kZWNvZGVyKSByZXQgPSBzdGF0ZS5idWZmZXIuam9pbignJyk7ZWxzZSBpZiAoc3RhdGUuYnVmZmVyLmxlbmd0aCA9PT0gMSkgcmV0ID0gc3RhdGUuYnVmZmVyLmZpcnN0KCk7ZWxzZSByZXQgPSBzdGF0ZS5idWZmZXIuY29uY2F0KHN0YXRlLmxlbmd0aCk7XG4gICAgc3RhdGUuYnVmZmVyLmNsZWFyKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gcmVhZCBwYXJ0IG9mIGxpc3RcbiAgICByZXQgPSBzdGF0ZS5idWZmZXIuY29uc3VtZShuLCBzdGF0ZS5kZWNvZGVyKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuZnVuY3Rpb24gZW5kUmVhZGFibGUoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgZGVidWcoJ2VuZFJlYWRhYmxlJywgc3RhdGUuZW5kRW1pdHRlZCk7XG4gIGlmICghc3RhdGUuZW5kRW1pdHRlZCkge1xuICAgIHN0YXRlLmVuZGVkID0gdHJ1ZTtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGVuZFJlYWRhYmxlTlQsIHN0YXRlLCBzdHJlYW0pO1xuICB9XG59XG5mdW5jdGlvbiBlbmRSZWFkYWJsZU5UKHN0YXRlLCBzdHJlYW0pIHtcbiAgZGVidWcoJ2VuZFJlYWRhYmxlTlQnLCBzdGF0ZS5lbmRFbWl0dGVkLCBzdGF0ZS5sZW5ndGgpO1xuXG4gIC8vIENoZWNrIHRoYXQgd2UgZGlkbid0IGdldCBvbmUgbGFzdCB1bnNoaWZ0LlxuICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQgJiYgc3RhdGUubGVuZ3RoID09PSAwKSB7XG4gICAgc3RhdGUuZW5kRW1pdHRlZCA9IHRydWU7XG4gICAgc3RyZWFtLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgc3RyZWFtLmVtaXQoJ2VuZCcpO1xuICAgIGlmIChzdGF0ZS5hdXRvRGVzdHJveSkge1xuICAgICAgLy8gSW4gY2FzZSBvZiBkdXBsZXggc3RyZWFtcyB3ZSBuZWVkIGEgd2F5IHRvIGRldGVjdFxuICAgICAgLy8gaWYgdGhlIHdyaXRhYmxlIHNpZGUgaXMgcmVhZHkgZm9yIGF1dG9EZXN0cm95IGFzIHdlbGxcbiAgICAgIHZhciB3U3RhdGUgPSBzdHJlYW0uX3dyaXRhYmxlU3RhdGU7XG4gICAgICBpZiAoIXdTdGF0ZSB8fCB3U3RhdGUuYXV0b0Rlc3Ryb3kgJiYgd1N0YXRlLmZpbmlzaGVkKSB7XG4gICAgICAgIHN0cmVhbS5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xuICBSZWFkYWJsZS5mcm9tID0gZnVuY3Rpb24gKGl0ZXJhYmxlLCBvcHRzKSB7XG4gICAgaWYgKGZyb20gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnJvbSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvc3RyZWFtcy9mcm9tJyk7XG4gICAgfVxuICAgIHJldHVybiBmcm9tKFJlYWRhYmxlLCBpdGVyYWJsZSwgb3B0cyk7XG4gIH07XG59XG5mdW5jdGlvbiBpbmRleE9mKHhzLCB4KSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKHhzW2ldID09PSB4KSByZXR1cm4gaTtcbiAgfVxuICByZXR1cm4gLTE7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIGEgdHJhbnNmb3JtIHN0cmVhbSBpcyBhIHJlYWRhYmxlL3dyaXRhYmxlIHN0cmVhbSB3aGVyZSB5b3UgZG9cbi8vIHNvbWV0aGluZyB3aXRoIHRoZSBkYXRhLiAgU29tZXRpbWVzIGl0J3MgY2FsbGVkIGEgXCJmaWx0ZXJcIixcbi8vIGJ1dCB0aGF0J3Mgbm90IGEgZ3JlYXQgbmFtZSBmb3IgaXQsIHNpbmNlIHRoYXQgaW1wbGllcyBhIHRoaW5nIHdoZXJlXG4vLyBzb21lIGJpdHMgcGFzcyB0aHJvdWdoLCBhbmQgb3RoZXJzIGFyZSBzaW1wbHkgaWdub3JlZC4gIChUaGF0IHdvdWxkXG4vLyBiZSBhIHZhbGlkIGV4YW1wbGUgb2YgYSB0cmFuc2Zvcm0sIG9mIGNvdXJzZS4pXG4vL1xuLy8gV2hpbGUgdGhlIG91dHB1dCBpcyBjYXVzYWxseSByZWxhdGVkIHRvIHRoZSBpbnB1dCwgaXQncyBub3QgYVxuLy8gbmVjZXNzYXJpbHkgc3ltbWV0cmljIG9yIHN5bmNocm9ub3VzIHRyYW5zZm9ybWF0aW9uLiAgRm9yIGV4YW1wbGUsXG4vLyBhIHpsaWIgc3RyZWFtIG1pZ2h0IHRha2UgbXVsdGlwbGUgcGxhaW4tdGV4dCB3cml0ZXMoKSwgYW5kIHRoZW5cbi8vIGVtaXQgYSBzaW5nbGUgY29tcHJlc3NlZCBjaHVuayBzb21lIHRpbWUgaW4gdGhlIGZ1dHVyZS5cbi8vXG4vLyBIZXJlJ3MgaG93IHRoaXMgd29ya3M6XG4vL1xuLy8gVGhlIFRyYW5zZm9ybSBzdHJlYW0gaGFzIGFsbCB0aGUgYXNwZWN0cyBvZiB0aGUgcmVhZGFibGUgYW5kIHdyaXRhYmxlXG4vLyBzdHJlYW0gY2xhc3Nlcy4gIFdoZW4geW91IHdyaXRlKGNodW5rKSwgdGhhdCBjYWxscyBfd3JpdGUoY2h1bmssY2IpXG4vLyBpbnRlcm5hbGx5LCBhbmQgcmV0dXJucyBmYWxzZSBpZiB0aGVyZSdzIGEgbG90IG9mIHBlbmRpbmcgd3JpdGVzXG4vLyBidWZmZXJlZCB1cC4gIFdoZW4geW91IGNhbGwgcmVhZCgpLCB0aGF0IGNhbGxzIF9yZWFkKG4pIHVudGlsXG4vLyB0aGVyZSdzIGVub3VnaCBwZW5kaW5nIHJlYWRhYmxlIGRhdGEgYnVmZmVyZWQgdXAuXG4vL1xuLy8gSW4gYSB0cmFuc2Zvcm0gc3RyZWFtLCB0aGUgd3JpdHRlbiBkYXRhIGlzIHBsYWNlZCBpbiBhIGJ1ZmZlci4gIFdoZW5cbi8vIF9yZWFkKG4pIGlzIGNhbGxlZCwgaXQgdHJhbnNmb3JtcyB0aGUgcXVldWVkIHVwIGRhdGEsIGNhbGxpbmcgdGhlXG4vLyBidWZmZXJlZCBfd3JpdGUgY2IncyBhcyBpdCBjb25zdW1lcyBjaHVua3MuICBJZiBjb25zdW1pbmcgYSBzaW5nbGVcbi8vIHdyaXR0ZW4gY2h1bmsgd291bGQgcmVzdWx0IGluIG11bHRpcGxlIG91dHB1dCBjaHVua3MsIHRoZW4gdGhlIGZpcnN0XG4vLyBvdXRwdXR0ZWQgYml0IGNhbGxzIHRoZSByZWFkY2IsIGFuZCBzdWJzZXF1ZW50IGNodW5rcyBqdXN0IGdvIGludG9cbi8vIHRoZSByZWFkIGJ1ZmZlciwgYW5kIHdpbGwgY2F1c2UgaXQgdG8gZW1pdCAncmVhZGFibGUnIGlmIG5lY2Vzc2FyeS5cbi8vXG4vLyBUaGlzIHdheSwgYmFjay1wcmVzc3VyZSBpcyBhY3R1YWxseSBkZXRlcm1pbmVkIGJ5IHRoZSByZWFkaW5nIHNpZGUsXG4vLyBzaW5jZSBfcmVhZCBoYXMgdG8gYmUgY2FsbGVkIHRvIHN0YXJ0IHByb2Nlc3NpbmcgYSBuZXcgY2h1bmsuICBIb3dldmVyLFxuLy8gYSBwYXRob2xvZ2ljYWwgaW5mbGF0ZSB0eXBlIG9mIHRyYW5zZm9ybSBjYW4gY2F1c2UgZXhjZXNzaXZlIGJ1ZmZlcmluZ1xuLy8gaGVyZS4gIEZvciBleGFtcGxlLCBpbWFnaW5lIGEgc3RyZWFtIHdoZXJlIGV2ZXJ5IGJ5dGUgb2YgaW5wdXQgaXNcbi8vIGludGVycHJldGVkIGFzIGFuIGludGVnZXIgZnJvbSAwLTI1NSwgYW5kIHRoZW4gcmVzdWx0cyBpbiB0aGF0IG1hbnlcbi8vIGJ5dGVzIG9mIG91dHB1dC4gIFdyaXRpbmcgdGhlIDQgYnl0ZXMge2ZmLGZmLGZmLGZmfSB3b3VsZCByZXN1bHQgaW5cbi8vIDFrYiBvZiBkYXRhIGJlaW5nIG91dHB1dC4gIEluIHRoaXMgY2FzZSwgeW91IGNvdWxkIHdyaXRlIGEgdmVyeSBzbWFsbFxuLy8gYW1vdW50IG9mIGlucHV0LCBhbmQgZW5kIHVwIHdpdGggYSB2ZXJ5IGxhcmdlIGFtb3VudCBvZiBvdXRwdXQuICBJblxuLy8gc3VjaCBhIHBhdGhvbG9naWNhbCBpbmZsYXRpbmcgbWVjaGFuaXNtLCB0aGVyZSdkIGJlIG5vIHdheSB0byB0ZWxsXG4vLyB0aGUgc3lzdGVtIHRvIHN0b3AgZG9pbmcgdGhlIHRyYW5zZm9ybS4gIEEgc2luZ2xlIDRNQiB3cml0ZSBjb3VsZFxuLy8gY2F1c2UgdGhlIHN5c3RlbSB0byBydW4gb3V0IG9mIG1lbW9yeS5cbi8vXG4vLyBIb3dldmVyLCBldmVuIGluIHN1Y2ggYSBwYXRob2xvZ2ljYWwgY2FzZSwgb25seSBhIHNpbmdsZSB3cml0dGVuIGNodW5rXG4vLyB3b3VsZCBiZSBjb25zdW1lZCwgYW5kIHRoZW4gdGhlIHJlc3Qgd291bGQgd2FpdCAodW4tdHJhbnNmb3JtZWQpIHVudGlsXG4vLyB0aGUgcmVzdWx0cyBvZiB0aGUgcHJldmlvdXMgdHJhbnNmb3JtZWQgY2h1bmsgd2VyZSBjb25zdW1lZC5cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTtcbnZhciBfcmVxdWlyZSRjb2RlcyA9IHJlcXVpcmUoJy4uL2Vycm9ycycpLmNvZGVzLFxuICBFUlJfTUVUSE9EX05PVF9JTVBMRU1FTlRFRCA9IF9yZXF1aXJlJGNvZGVzLkVSUl9NRVRIT0RfTk9UX0lNUExFTUVOVEVELFxuICBFUlJfTVVMVElQTEVfQ0FMTEJBQ0sgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfTVVMVElQTEVfQ0FMTEJBQ0ssXG4gIEVSUl9UUkFOU0ZPUk1fQUxSRUFEWV9UUkFOU0ZPUk1JTkcgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfVFJBTlNGT1JNX0FMUkVBRFlfVFJBTlNGT1JNSU5HLFxuICBFUlJfVFJBTlNGT1JNX1dJVEhfTEVOR1RIXzAgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfVFJBTlNGT1JNX1dJVEhfTEVOR1RIXzA7XG52YXIgRHVwbGV4ID0gcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xucmVxdWlyZSgnaW5oZXJpdHMnKShUcmFuc2Zvcm0sIER1cGxleCk7XG5mdW5jdGlvbiBhZnRlclRyYW5zZm9ybShlciwgZGF0YSkge1xuICB2YXIgdHMgPSB0aGlzLl90cmFuc2Zvcm1TdGF0ZTtcbiAgdHMudHJhbnNmb3JtaW5nID0gZmFsc2U7XG4gIHZhciBjYiA9IHRzLndyaXRlY2I7XG4gIGlmIChjYiA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVSUl9NVUxUSVBMRV9DQUxMQkFDSygpKTtcbiAgfVxuICB0cy53cml0ZWNodW5rID0gbnVsbDtcbiAgdHMud3JpdGVjYiA9IG51bGw7XG4gIGlmIChkYXRhICE9IG51bGwpXG4gICAgLy8gc2luZ2xlIGVxdWFscyBjaGVjayBmb3IgYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgXG4gICAgdGhpcy5wdXNoKGRhdGEpO1xuICBjYihlcik7XG4gIHZhciBycyA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHJzLnJlYWRpbmcgPSBmYWxzZTtcbiAgaWYgKHJzLm5lZWRSZWFkYWJsZSB8fCBycy5sZW5ndGggPCBycy5oaWdoV2F0ZXJNYXJrKSB7XG4gICAgdGhpcy5fcmVhZChycy5oaWdoV2F0ZXJNYXJrKTtcbiAgfVxufVxuZnVuY3Rpb24gVHJhbnNmb3JtKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFRyYW5zZm9ybSkpIHJldHVybiBuZXcgVHJhbnNmb3JtKG9wdGlvbnMpO1xuICBEdXBsZXguY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgdGhpcy5fdHJhbnNmb3JtU3RhdGUgPSB7XG4gICAgYWZ0ZXJUcmFuc2Zvcm06IGFmdGVyVHJhbnNmb3JtLmJpbmQodGhpcyksXG4gICAgbmVlZFRyYW5zZm9ybTogZmFsc2UsXG4gICAgdHJhbnNmb3JtaW5nOiBmYWxzZSxcbiAgICB3cml0ZWNiOiBudWxsLFxuICAgIHdyaXRlY2h1bms6IG51bGwsXG4gICAgd3JpdGVlbmNvZGluZzogbnVsbFxuICB9O1xuXG4gIC8vIHN0YXJ0IG91dCBhc2tpbmcgZm9yIGEgcmVhZGFibGUgZXZlbnQgb25jZSBkYXRhIGlzIHRyYW5zZm9ybWVkLlxuICB0aGlzLl9yZWFkYWJsZVN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG5cbiAgLy8gd2UgaGF2ZSBpbXBsZW1lbnRlZCB0aGUgX3JlYWQgbWV0aG9kLCBhbmQgZG9uZSB0aGUgb3RoZXIgdGhpbmdzXG4gIC8vIHRoYXQgUmVhZGFibGUgd2FudHMgYmVmb3JlIHRoZSBmaXJzdCBfcmVhZCBjYWxsLCBzbyB1bnNldCB0aGVcbiAgLy8gc3luYyBndWFyZCBmbGFnLlxuICB0aGlzLl9yZWFkYWJsZVN0YXRlLnN5bmMgPSBmYWxzZTtcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudHJhbnNmb3JtID09PSAnZnVuY3Rpb24nKSB0aGlzLl90cmFuc2Zvcm0gPSBvcHRpb25zLnRyYW5zZm9ybTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZmx1c2ggPT09ICdmdW5jdGlvbicpIHRoaXMuX2ZsdXNoID0gb3B0aW9ucy5mbHVzaDtcbiAgfVxuXG4gIC8vIFdoZW4gdGhlIHdyaXRhYmxlIHNpZGUgZmluaXNoZXMsIHRoZW4gZmx1c2ggb3V0IGFueXRoaW5nIHJlbWFpbmluZy5cbiAgdGhpcy5vbigncHJlZmluaXNoJywgcHJlZmluaXNoKTtcbn1cbmZ1bmN0aW9uIHByZWZpbmlzaCgpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgaWYgKHR5cGVvZiB0aGlzLl9mbHVzaCA9PT0gJ2Z1bmN0aW9uJyAmJiAhdGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQpIHtcbiAgICB0aGlzLl9mbHVzaChmdW5jdGlvbiAoZXIsIGRhdGEpIHtcbiAgICAgIGRvbmUoX3RoaXMsIGVyLCBkYXRhKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBkb25lKHRoaXMsIG51bGwsIG51bGwpO1xuICB9XG59XG5UcmFuc2Zvcm0ucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nKSB7XG4gIHRoaXMuX3RyYW5zZm9ybVN0YXRlLm5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgcmV0dXJuIER1cGxleC5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIGNodW5rLCBlbmNvZGluZyk7XG59O1xuXG4vLyBUaGlzIGlzIHRoZSBwYXJ0IHdoZXJlIHlvdSBkbyBzdHVmZiFcbi8vIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb24gaW4gaW1wbGVtZW50YXRpb24gY2xhc3Nlcy5cbi8vICdjaHVuaycgaXMgYW4gaW5wdXQgY2h1bmsuXG4vL1xuLy8gQ2FsbCBgcHVzaChuZXdDaHVuaylgIHRvIHBhc3MgYWxvbmcgdHJhbnNmb3JtZWQgb3V0cHV0XG4vLyB0byB0aGUgcmVhZGFibGUgc2lkZS4gIFlvdSBtYXkgY2FsbCAncHVzaCcgemVybyBvciBtb3JlIHRpbWVzLlxuLy9cbi8vIENhbGwgYGNiKGVycilgIHdoZW4geW91IGFyZSBkb25lIHdpdGggdGhpcyBjaHVuay4gIElmIHlvdSBwYXNzXG4vLyBhbiBlcnJvciwgdGhlbiB0aGF0J2xsIHB1dCB0aGUgaHVydCBvbiB0aGUgd2hvbGUgb3BlcmF0aW9uLiAgSWYgeW91XG4vLyBuZXZlciBjYWxsIGNiKCksIHRoZW4geW91J2xsIG5ldmVyIGdldCBhbm90aGVyIGNodW5rLlxuVHJhbnNmb3JtLnByb3RvdHlwZS5fdHJhbnNmb3JtID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgY2IobmV3IEVSUl9NRVRIT0RfTk9UX0lNUExFTUVOVEVEKCdfdHJhbnNmb3JtKCknKSk7XG59O1xuVHJhbnNmb3JtLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgdHMgPSB0aGlzLl90cmFuc2Zvcm1TdGF0ZTtcbiAgdHMud3JpdGVjYiA9IGNiO1xuICB0cy53cml0ZWNodW5rID0gY2h1bms7XG4gIHRzLndyaXRlZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgaWYgKCF0cy50cmFuc2Zvcm1pbmcpIHtcbiAgICB2YXIgcnMgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICAgIGlmICh0cy5uZWVkVHJhbnNmb3JtIHx8IHJzLm5lZWRSZWFkYWJsZSB8fCBycy5sZW5ndGggPCBycy5oaWdoV2F0ZXJNYXJrKSB0aGlzLl9yZWFkKHJzLmhpZ2hXYXRlck1hcmspO1xuICB9XG59O1xuXG4vLyBEb2Vzbid0IG1hdHRlciB3aGF0IHRoZSBhcmdzIGFyZSBoZXJlLlxuLy8gX3RyYW5zZm9ybSBkb2VzIGFsbCB0aGUgd29yay5cbi8vIFRoYXQgd2UgZ290IGhlcmUgbWVhbnMgdGhhdCB0aGUgcmVhZGFibGUgc2lkZSB3YW50cyBtb3JlIGRhdGEuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24gKG4pIHtcbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGU7XG4gIGlmICh0cy53cml0ZWNodW5rICE9PSBudWxsICYmICF0cy50cmFuc2Zvcm1pbmcpIHtcbiAgICB0cy50cmFuc2Zvcm1pbmcgPSB0cnVlO1xuICAgIHRoaXMuX3RyYW5zZm9ybSh0cy53cml0ZWNodW5rLCB0cy53cml0ZWVuY29kaW5nLCB0cy5hZnRlclRyYW5zZm9ybSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbWFyayB0aGF0IHdlIG5lZWQgYSB0cmFuc2Zvcm0sIHNvIHRoYXQgYW55IGRhdGEgdGhhdCBjb21lcyBpblxuICAgIC8vIHdpbGwgZ2V0IHByb2Nlc3NlZCwgbm93IHRoYXQgd2UndmUgYXNrZWQgZm9yIGl0LlxuICAgIHRzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICB9XG59O1xuVHJhbnNmb3JtLnByb3RvdHlwZS5fZGVzdHJveSA9IGZ1bmN0aW9uIChlcnIsIGNiKSB7XG4gIER1cGxleC5wcm90b3R5cGUuX2Rlc3Ryb3kuY2FsbCh0aGlzLCBlcnIsIGZ1bmN0aW9uIChlcnIyKSB7XG4gICAgY2IoZXJyMik7XG4gIH0pO1xufTtcbmZ1bmN0aW9uIGRvbmUoc3RyZWFtLCBlciwgZGF0YSkge1xuICBpZiAoZXIpIHJldHVybiBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG4gIGlmIChkYXRhICE9IG51bGwpXG4gICAgLy8gc2luZ2xlIGVxdWFscyBjaGVjayBmb3IgYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgXG4gICAgc3RyZWFtLnB1c2goZGF0YSk7XG5cbiAgLy8gVE9ETyhCcmlkZ2VBUik6IFdyaXRlIGEgdGVzdCBmb3IgdGhlc2UgdHdvIGVycm9yIGNhc2VzXG4gIC8vIGlmIHRoZXJlJ3Mgbm90aGluZyBpbiB0aGUgd3JpdGUgYnVmZmVyLCB0aGVuIHRoYXQgbWVhbnNcbiAgLy8gdGhhdCBub3RoaW5nIG1vcmUgd2lsbCBldmVyIGJlIHByb3ZpZGVkXG4gIGlmIChzdHJlYW0uX3dyaXRhYmxlU3RhdGUubGVuZ3RoKSB0aHJvdyBuZXcgRVJSX1RSQU5TRk9STV9XSVRIX0xFTkdUSF8wKCk7XG4gIGlmIChzdHJlYW0uX3RyYW5zZm9ybVN0YXRlLnRyYW5zZm9ybWluZykgdGhyb3cgbmV3IEVSUl9UUkFOU0ZPUk1fQUxSRUFEWV9UUkFOU0ZPUk1JTkcoKTtcbiAgcmV0dXJuIHN0cmVhbS5wdXNoKG51bGwpO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBBIGJpdCBzaW1wbGVyIHRoYW4gcmVhZGFibGUgc3RyZWFtcy5cbi8vIEltcGxlbWVudCBhbiBhc3luYyAuX3dyaXRlKGNodW5rLCBlbmNvZGluZywgY2IpLCBhbmQgaXQnbGwgaGFuZGxlIGFsbFxuLy8gdGhlIGRyYWluIGV2ZW50IGVtaXNzaW9uIGFuZCBidWZmZXJpbmcuXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBXcml0YWJsZTtcblxuLyogPHJlcGxhY2VtZW50PiAqL1xuZnVuY3Rpb24gV3JpdGVSZXEoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB0aGlzLmNodW5rID0gY2h1bms7XG4gIHRoaXMuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgdGhpcy5jYWxsYmFjayA9IGNiO1xuICB0aGlzLm5leHQgPSBudWxsO1xufVxuXG4vLyBJdCBzZWVtcyBhIGxpbmtlZCBsaXN0IGJ1dCBpdCBpcyBub3Rcbi8vIHRoZXJlIHdpbGwgYmUgb25seSAyIG9mIHRoZXNlIGZvciBlYWNoIHN0cmVhbVxuZnVuY3Rpb24gQ29ya2VkUmVxdWVzdChzdGF0ZSkge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB0aGlzLm5leHQgPSBudWxsO1xuICB0aGlzLmVudHJ5ID0gbnVsbDtcbiAgdGhpcy5maW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgb25Db3JrZWRGaW5pc2goX3RoaXMsIHN0YXRlKTtcbiAgfTtcbn1cbi8qIDwvcmVwbGFjZW1lbnQ+ICovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgRHVwbGV4O1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbldyaXRhYmxlLldyaXRhYmxlU3RhdGUgPSBXcml0YWJsZVN0YXRlO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIGludGVybmFsVXRpbCA9IHtcbiAgZGVwcmVjYXRlOiByZXF1aXJlKCd1dGlsLWRlcHJlY2F0ZScpXG59O1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgU3RyZWFtID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9zdHJlYW1zL3N0cmVhbScpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG52YXIgT3VyVWludDhBcnJheSA9ICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHt9KS5VaW50OEFycmF5IHx8IGZ1bmN0aW9uICgpIHt9O1xuZnVuY3Rpb24gX3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuaykge1xuICByZXR1cm4gQnVmZmVyLmZyb20oY2h1bmspO1xufVxuZnVuY3Rpb24gX2lzVWludDhBcnJheShvYmopIHtcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopIHx8IG9iaiBpbnN0YW5jZW9mIE91clVpbnQ4QXJyYXk7XG59XG52YXIgZGVzdHJveUltcGwgPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveScpO1xudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9zdHJlYW1zL3N0YXRlJyksXG4gIGdldEhpZ2hXYXRlck1hcmsgPSBfcmVxdWlyZS5nZXRIaWdoV2F0ZXJNYXJrO1xudmFyIF9yZXF1aXJlJGNvZGVzID0gcmVxdWlyZSgnLi4vZXJyb3JzJykuY29kZXMsXG4gIEVSUl9JTlZBTElEX0FSR19UWVBFID0gX3JlcXVpcmUkY29kZXMuRVJSX0lOVkFMSURfQVJHX1RZUEUsXG4gIEVSUl9NRVRIT0RfTk9UX0lNUExFTUVOVEVEID0gX3JlcXVpcmUkY29kZXMuRVJSX01FVEhPRF9OT1RfSU1QTEVNRU5URUQsXG4gIEVSUl9NVUxUSVBMRV9DQUxMQkFDSyA9IF9yZXF1aXJlJGNvZGVzLkVSUl9NVUxUSVBMRV9DQUxMQkFDSyxcbiAgRVJSX1NUUkVBTV9DQU5OT1RfUElQRSA9IF9yZXF1aXJlJGNvZGVzLkVSUl9TVFJFQU1fQ0FOTk9UX1BJUEUsXG4gIEVSUl9TVFJFQU1fREVTVFJPWUVEID0gX3JlcXVpcmUkY29kZXMuRVJSX1NUUkVBTV9ERVNUUk9ZRUQsXG4gIEVSUl9TVFJFQU1fTlVMTF9WQUxVRVMgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfU1RSRUFNX05VTExfVkFMVUVTLFxuICBFUlJfU1RSRUFNX1dSSVRFX0FGVEVSX0VORCA9IF9yZXF1aXJlJGNvZGVzLkVSUl9TVFJFQU1fV1JJVEVfQUZURVJfRU5ELFxuICBFUlJfVU5LTk9XTl9FTkNPRElORyA9IF9yZXF1aXJlJGNvZGVzLkVSUl9VTktOT1dOX0VOQ09ESU5HO1xudmFyIGVycm9yT3JEZXN0cm95ID0gZGVzdHJveUltcGwuZXJyb3JPckRlc3Ryb3k7XG5yZXF1aXJlKCdpbmhlcml0cycpKFdyaXRhYmxlLCBTdHJlYW0pO1xuZnVuY3Rpb24gbm9wKCkge31cbmZ1bmN0aW9uIFdyaXRhYmxlU3RhdGUob3B0aW9ucywgc3RyZWFtLCBpc0R1cGxleCkge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBEdXBsZXggc3RyZWFtcyBhcmUgYm90aCByZWFkYWJsZSBhbmQgd3JpdGFibGUsIGJ1dCBzaGFyZVxuICAvLyB0aGUgc2FtZSBvcHRpb25zIG9iamVjdC5cbiAgLy8gSG93ZXZlciwgc29tZSBjYXNlcyByZXF1aXJlIHNldHRpbmcgb3B0aW9ucyB0byBkaWZmZXJlbnRcbiAgLy8gdmFsdWVzIGZvciB0aGUgcmVhZGFibGUgYW5kIHRoZSB3cml0YWJsZSBzaWRlcyBvZiB0aGUgZHVwbGV4IHN0cmVhbSxcbiAgLy8gZS5nLiBvcHRpb25zLnJlYWRhYmxlT2JqZWN0TW9kZSB2cy4gb3B0aW9ucy53cml0YWJsZU9iamVjdE1vZGUsIGV0Yy5cbiAgaWYgKHR5cGVvZiBpc0R1cGxleCAhPT0gJ2Jvb2xlYW4nKSBpc0R1cGxleCA9IHN0cmVhbSBpbnN0YW5jZW9mIER1cGxleDtcblxuICAvLyBvYmplY3Qgc3RyZWFtIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciBvciBub3QgdGhpcyBzdHJlYW1cbiAgLy8gY29udGFpbnMgYnVmZmVycyBvciBvYmplY3RzLlxuICB0aGlzLm9iamVjdE1vZGUgPSAhIW9wdGlvbnMub2JqZWN0TW9kZTtcbiAgaWYgKGlzRHVwbGV4KSB0aGlzLm9iamVjdE1vZGUgPSB0aGlzLm9iamVjdE1vZGUgfHwgISFvcHRpb25zLndyaXRhYmxlT2JqZWN0TW9kZTtcblxuICAvLyB0aGUgcG9pbnQgYXQgd2hpY2ggd3JpdGUoKSBzdGFydHMgcmV0dXJuaW5nIGZhbHNlXG4gIC8vIE5vdGU6IDAgaXMgYSB2YWxpZCB2YWx1ZSwgbWVhbnMgdGhhdCB3ZSBhbHdheXMgcmV0dXJuIGZhbHNlIGlmXG4gIC8vIHRoZSBlbnRpcmUgYnVmZmVyIGlzIG5vdCBmbHVzaGVkIGltbWVkaWF0ZWx5IG9uIHdyaXRlKClcbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gZ2V0SGlnaFdhdGVyTWFyayh0aGlzLCBvcHRpb25zLCAnd3JpdGFibGVIaWdoV2F0ZXJNYXJrJywgaXNEdXBsZXgpO1xuXG4gIC8vIGlmIF9maW5hbCBoYXMgYmVlbiBjYWxsZWRcbiAgdGhpcy5maW5hbENhbGxlZCA9IGZhbHNlO1xuXG4gIC8vIGRyYWluIGV2ZW50IGZsYWcuXG4gIHRoaXMubmVlZERyYWluID0gZmFsc2U7XG4gIC8vIGF0IHRoZSBzdGFydCBvZiBjYWxsaW5nIGVuZCgpXG4gIHRoaXMuZW5kaW5nID0gZmFsc2U7XG4gIC8vIHdoZW4gZW5kKCkgaGFzIGJlZW4gY2FsbGVkLCBhbmQgcmV0dXJuZWRcbiAgdGhpcy5lbmRlZCA9IGZhbHNlO1xuICAvLyB3aGVuICdmaW5pc2gnIGlzIGVtaXR0ZWRcbiAgdGhpcy5maW5pc2hlZCA9IGZhbHNlO1xuXG4gIC8vIGhhcyBpdCBiZWVuIGRlc3Ryb3llZFxuICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xuXG4gIC8vIHNob3VsZCB3ZSBkZWNvZGUgc3RyaW5ncyBpbnRvIGJ1ZmZlcnMgYmVmb3JlIHBhc3NpbmcgdG8gX3dyaXRlP1xuICAvLyB0aGlzIGlzIGhlcmUgc28gdGhhdCBzb21lIG5vZGUtY29yZSBzdHJlYW1zIGNhbiBvcHRpbWl6ZSBzdHJpbmdcbiAgLy8gaGFuZGxpbmcgYXQgYSBsb3dlciBsZXZlbC5cbiAgdmFyIG5vRGVjb2RlID0gb3B0aW9ucy5kZWNvZGVTdHJpbmdzID09PSBmYWxzZTtcbiAgdGhpcy5kZWNvZGVTdHJpbmdzID0gIW5vRGVjb2RlO1xuXG4gIC8vIENyeXB0byBpcyBraW5kIG9mIG9sZCBhbmQgY3J1c3R5LiAgSGlzdG9yaWNhbGx5LCBpdHMgZGVmYXVsdCBzdHJpbmdcbiAgLy8gZW5jb2RpbmcgaXMgJ2JpbmFyeScgc28gd2UgaGF2ZSB0byBtYWtlIHRoaXMgY29uZmlndXJhYmxlLlxuICAvLyBFdmVyeXRoaW5nIGVsc2UgaW4gdGhlIHVuaXZlcnNlIHVzZXMgJ3V0ZjgnLCB0aG91Z2guXG4gIHRoaXMuZGVmYXVsdEVuY29kaW5nID0gb3B0aW9ucy5kZWZhdWx0RW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXG4gIC8vIG5vdCBhbiBhY3R1YWwgYnVmZmVyIHdlIGtlZXAgdHJhY2sgb2YsIGJ1dCBhIG1lYXN1cmVtZW50XG4gIC8vIG9mIGhvdyBtdWNoIHdlJ3JlIHdhaXRpbmcgdG8gZ2V0IHB1c2hlZCB0byBzb21lIHVuZGVybHlpbmdcbiAgLy8gc29ja2V0IG9yIGZpbGUuXG4gIHRoaXMubGVuZ3RoID0gMDtcblxuICAvLyBhIGZsYWcgdG8gc2VlIHdoZW4gd2UncmUgaW4gdGhlIG1pZGRsZSBvZiBhIHdyaXRlLlxuICB0aGlzLndyaXRpbmcgPSBmYWxzZTtcblxuICAvLyB3aGVuIHRydWUgYWxsIHdyaXRlcyB3aWxsIGJlIGJ1ZmZlcmVkIHVudGlsIC51bmNvcmsoKSBjYWxsXG4gIHRoaXMuY29ya2VkID0gMDtcblxuICAvLyBhIGZsYWcgdG8gYmUgYWJsZSB0byB0ZWxsIGlmIHRoZSBvbndyaXRlIGNiIGlzIGNhbGxlZCBpbW1lZGlhdGVseSxcbiAgLy8gb3Igb24gYSBsYXRlciB0aWNrLiAgV2Ugc2V0IHRoaXMgdG8gdHJ1ZSBhdCBmaXJzdCwgYmVjYXVzZSBhbnlcbiAgLy8gYWN0aW9ucyB0aGF0IHNob3VsZG4ndCBoYXBwZW4gdW50aWwgXCJsYXRlclwiIHNob3VsZCBnZW5lcmFsbHkgYWxzb1xuICAvLyBub3QgaGFwcGVuIGJlZm9yZSB0aGUgZmlyc3Qgd3JpdGUgY2FsbC5cbiAgdGhpcy5zeW5jID0gdHJ1ZTtcblxuICAvLyBhIGZsYWcgdG8ga25vdyBpZiB3ZSdyZSBwcm9jZXNzaW5nIHByZXZpb3VzbHkgYnVmZmVyZWQgaXRlbXMsIHdoaWNoXG4gIC8vIG1heSBjYWxsIHRoZSBfd3JpdGUoKSBjYWxsYmFjayBpbiB0aGUgc2FtZSB0aWNrLCBzbyB0aGF0IHdlIGRvbid0XG4gIC8vIGVuZCB1cCBpbiBhbiBvdmVybGFwcGVkIG9ud3JpdGUgc2l0dWF0aW9uLlxuICB0aGlzLmJ1ZmZlclByb2Nlc3NpbmcgPSBmYWxzZTtcblxuICAvLyB0aGUgY2FsbGJhY2sgdGhhdCdzIHBhc3NlZCB0byBfd3JpdGUoY2h1bmssY2IpXG4gIHRoaXMub253cml0ZSA9IGZ1bmN0aW9uIChlcikge1xuICAgIG9ud3JpdGUoc3RyZWFtLCBlcik7XG4gIH07XG5cbiAgLy8gdGhlIGNhbGxiYWNrIHRoYXQgdGhlIHVzZXIgc3VwcGxpZXMgdG8gd3JpdGUoY2h1bmssZW5jb2RpbmcsY2IpXG4gIHRoaXMud3JpdGVjYiA9IG51bGw7XG5cbiAgLy8gdGhlIGFtb3VudCB0aGF0IGlzIGJlaW5nIHdyaXR0ZW4gd2hlbiBfd3JpdGUgaXMgY2FsbGVkLlxuICB0aGlzLndyaXRlbGVuID0gMDtcbiAgdGhpcy5idWZmZXJlZFJlcXVlc3QgPSBudWxsO1xuICB0aGlzLmxhc3RCdWZmZXJlZFJlcXVlc3QgPSBudWxsO1xuXG4gIC8vIG51bWJlciBvZiBwZW5kaW5nIHVzZXItc3VwcGxpZWQgd3JpdGUgY2FsbGJhY2tzXG4gIC8vIHRoaXMgbXVzdCBiZSAwIGJlZm9yZSAnZmluaXNoJyBjYW4gYmUgZW1pdHRlZFxuICB0aGlzLnBlbmRpbmdjYiA9IDA7XG5cbiAgLy8gZW1pdCBwcmVmaW5pc2ggaWYgdGhlIG9ubHkgdGhpbmcgd2UncmUgd2FpdGluZyBmb3IgaXMgX3dyaXRlIGNic1xuICAvLyBUaGlzIGlzIHJlbGV2YW50IGZvciBzeW5jaHJvbm91cyBUcmFuc2Zvcm0gc3RyZWFtc1xuICB0aGlzLnByZWZpbmlzaGVkID0gZmFsc2U7XG5cbiAgLy8gVHJ1ZSBpZiB0aGUgZXJyb3Igd2FzIGFscmVhZHkgZW1pdHRlZCBhbmQgc2hvdWxkIG5vdCBiZSB0aHJvd24gYWdhaW5cbiAgdGhpcy5lcnJvckVtaXR0ZWQgPSBmYWxzZTtcblxuICAvLyBTaG91bGQgY2xvc2UgYmUgZW1pdHRlZCBvbiBkZXN0cm95LiBEZWZhdWx0cyB0byB0cnVlLlxuICB0aGlzLmVtaXRDbG9zZSA9IG9wdGlvbnMuZW1pdENsb3NlICE9PSBmYWxzZTtcblxuICAvLyBTaG91bGQgLmRlc3Ryb3koKSBiZSBjYWxsZWQgYWZ0ZXIgJ2ZpbmlzaCcgKGFuZCBwb3RlbnRpYWxseSAnZW5kJylcbiAgdGhpcy5hdXRvRGVzdHJveSA9ICEhb3B0aW9ucy5hdXRvRGVzdHJveTtcblxuICAvLyBjb3VudCBidWZmZXJlZCByZXF1ZXN0c1xuICB0aGlzLmJ1ZmZlcmVkUmVxdWVzdENvdW50ID0gMDtcblxuICAvLyBhbGxvY2F0ZSB0aGUgZmlyc3QgQ29ya2VkUmVxdWVzdCwgdGhlcmUgaXMgYWx3YXlzXG4gIC8vIG9uZSBhbGxvY2F0ZWQgYW5kIGZyZWUgdG8gdXNlLCBhbmQgd2UgbWFpbnRhaW4gYXQgbW9zdCB0d29cbiAgdGhpcy5jb3JrZWRSZXF1ZXN0c0ZyZWUgPSBuZXcgQ29ya2VkUmVxdWVzdCh0aGlzKTtcbn1cbldyaXRhYmxlU3RhdGUucHJvdG90eXBlLmdldEJ1ZmZlciA9IGZ1bmN0aW9uIGdldEJ1ZmZlcigpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLmJ1ZmZlcmVkUmVxdWVzdDtcbiAgdmFyIG91dCA9IFtdO1xuICB3aGlsZSAoY3VycmVudCkge1xuICAgIG91dC5wdXNoKGN1cnJlbnQpO1xuICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG4oZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZVN0YXRlLnByb3RvdHlwZSwgJ2J1ZmZlcicsIHtcbiAgICAgIGdldDogaW50ZXJuYWxVdGlsLmRlcHJlY2F0ZShmdW5jdGlvbiB3cml0YWJsZVN0YXRlQnVmZmVyR2V0dGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCdWZmZXIoKTtcbiAgICAgIH0sICdfd3JpdGFibGVTdGF0ZS5idWZmZXIgaXMgZGVwcmVjYXRlZC4gVXNlIF93cml0YWJsZVN0YXRlLmdldEJ1ZmZlciAnICsgJ2luc3RlYWQuJywgJ0RFUDAwMDMnKVxuICAgIH0pO1xuICB9IGNhdGNoIChfKSB7fVxufSkoKTtcblxuLy8gVGVzdCBfd3JpdGFibGVTdGF0ZSBmb3IgaW5oZXJpdGFuY2UgdG8gYWNjb3VudCBmb3IgRHVwbGV4IHN0cmVhbXMsXG4vLyB3aG9zZSBwcm90b3R5cGUgY2hhaW4gb25seSBwb2ludHMgdG8gUmVhZGFibGUuXG52YXIgcmVhbEhhc0luc3RhbmNlO1xuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmhhc0luc3RhbmNlICYmIHR5cGVvZiBGdW5jdGlvbi5wcm90b3R5cGVbU3ltYm9sLmhhc0luc3RhbmNlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICByZWFsSGFzSW5zdGFuY2UgPSBGdW5jdGlvbi5wcm90b3R5cGVbU3ltYm9sLmhhc0luc3RhbmNlXTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLCBTeW1ib2wuaGFzSW5zdGFuY2UsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUob2JqZWN0KSB7XG4gICAgICBpZiAocmVhbEhhc0luc3RhbmNlLmNhbGwodGhpcywgb2JqZWN0KSkgcmV0dXJuIHRydWU7XG4gICAgICBpZiAodGhpcyAhPT0gV3JpdGFibGUpIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiBvYmplY3QgJiYgb2JqZWN0Ll93cml0YWJsZVN0YXRlIGluc3RhbmNlb2YgV3JpdGFibGVTdGF0ZTtcbiAgICB9XG4gIH0pO1xufSBlbHNlIHtcbiAgcmVhbEhhc0luc3RhbmNlID0gZnVuY3Rpb24gcmVhbEhhc0luc3RhbmNlKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiB0aGlzO1xuICB9O1xufVxuZnVuY3Rpb24gV3JpdGFibGUob3B0aW9ucykge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4gIC8vIFdyaXRhYmxlIGN0b3IgaXMgYXBwbGllZCB0byBEdXBsZXhlcywgdG9vLlxuICAvLyBgcmVhbEhhc0luc3RhbmNlYCBpcyBuZWNlc3NhcnkgYmVjYXVzZSB1c2luZyBwbGFpbiBgaW5zdGFuY2VvZmBcbiAgLy8gd291bGQgcmV0dXJuIGZhbHNlLCBhcyBubyBgX3dyaXRhYmxlU3RhdGVgIHByb3BlcnR5IGlzIGF0dGFjaGVkLlxuXG4gIC8vIFRyeWluZyB0byB1c2UgdGhlIGN1c3RvbSBgaW5zdGFuY2VvZmAgZm9yIFdyaXRhYmxlIGhlcmUgd2lsbCBhbHNvIGJyZWFrIHRoZVxuICAvLyBOb2RlLmpzIExhenlUcmFuc2Zvcm0gaW1wbGVtZW50YXRpb24sIHdoaWNoIGhhcyBhIG5vbi10cml2aWFsIGdldHRlciBmb3JcbiAgLy8gYF93cml0YWJsZVN0YXRlYCB0aGF0IHdvdWxkIGxlYWQgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuXG4gIC8vIENoZWNraW5nIGZvciBhIFN0cmVhbS5EdXBsZXggaW5zdGFuY2UgaXMgZmFzdGVyIGhlcmUgaW5zdGVhZCBvZiBpbnNpZGVcbiAgLy8gdGhlIFdyaXRhYmxlU3RhdGUgY29uc3RydWN0b3IsIGF0IGxlYXN0IHdpdGggVjggNi41XG4gIHZhciBpc0R1cGxleCA9IHRoaXMgaW5zdGFuY2VvZiBEdXBsZXg7XG4gIGlmICghaXNEdXBsZXggJiYgIXJlYWxIYXNJbnN0YW5jZS5jYWxsKFdyaXRhYmxlLCB0aGlzKSkgcmV0dXJuIG5ldyBXcml0YWJsZShvcHRpb25zKTtcbiAgdGhpcy5fd3JpdGFibGVTdGF0ZSA9IG5ldyBXcml0YWJsZVN0YXRlKG9wdGlvbnMsIHRoaXMsIGlzRHVwbGV4KTtcblxuICAvLyBsZWdhY3kuXG4gIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuICBpZiAob3B0aW9ucykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy53cml0ZSA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fd3JpdGUgPSBvcHRpb25zLndyaXRlO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy53cml0ZXYgPT09ICdmdW5jdGlvbicpIHRoaXMuX3dyaXRldiA9IG9wdGlvbnMud3JpdGV2O1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSB0aGlzLl9kZXN0cm95ID0gb3B0aW9ucy5kZXN0cm95O1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5maW5hbCA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fZmluYWwgPSBvcHRpb25zLmZpbmFsO1xuICB9XG4gIFN0cmVhbS5jYWxsKHRoaXMpO1xufVxuXG4vLyBPdGhlcndpc2UgcGVvcGxlIGNhbiBwaXBlIFdyaXRhYmxlIHN0cmVhbXMsIHdoaWNoIGlzIGp1c3Qgd3JvbmcuXG5Xcml0YWJsZS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgZXJyb3JPckRlc3Ryb3kodGhpcywgbmV3IEVSUl9TVFJFQU1fQ0FOTk9UX1BJUEUoKSk7XG59O1xuZnVuY3Rpb24gd3JpdGVBZnRlckVuZChzdHJlYW0sIGNiKSB7XG4gIHZhciBlciA9IG5ldyBFUlJfU1RSRUFNX1dSSVRFX0FGVEVSX0VORCgpO1xuICAvLyBUT0RPOiBkZWZlciBlcnJvciBldmVudHMgY29uc2lzdGVudGx5IGV2ZXJ5d2hlcmUsIG5vdCBqdXN0IHRoZSBjYlxuICBlcnJvck9yRGVzdHJveShzdHJlYW0sIGVyKTtcbiAgcHJvY2Vzcy5uZXh0VGljayhjYiwgZXIpO1xufVxuXG4vLyBDaGVja3MgdGhhdCBhIHVzZXItc3VwcGxpZWQgY2h1bmsgaXMgdmFsaWQsIGVzcGVjaWFsbHkgZm9yIHRoZSBwYXJ0aWN1bGFyXG4vLyBtb2RlIHRoZSBzdHJlYW0gaXMgaW4uIEN1cnJlbnRseSB0aGlzIG1lYW5zIHRoYXQgYG51bGxgIGlzIG5ldmVyIGFjY2VwdGVkXG4vLyBhbmQgdW5kZWZpbmVkL25vbi1zdHJpbmcgdmFsdWVzIGFyZSBvbmx5IGFsbG93ZWQgaW4gb2JqZWN0IG1vZGUuXG5mdW5jdGlvbiB2YWxpZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBjYikge1xuICB2YXIgZXI7XG4gIGlmIChjaHVuayA9PT0gbnVsbCkge1xuICAgIGVyID0gbmV3IEVSUl9TVFJFQU1fTlVMTF9WQUxVRVMoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgY2h1bmsgIT09ICdzdHJpbmcnICYmICFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgZXIgPSBuZXcgRVJSX0lOVkFMSURfQVJHX1RZUEUoJ2NodW5rJywgWydzdHJpbmcnLCAnQnVmZmVyJ10sIGNodW5rKTtcbiAgfVxuICBpZiAoZXIpIHtcbiAgICBlcnJvck9yRGVzdHJveShzdHJlYW0sIGVyKTtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGNiLCBlcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuV3JpdGFibGUucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHJldCA9IGZhbHNlO1xuICB2YXIgaXNCdWYgPSAhc3RhdGUub2JqZWN0TW9kZSAmJiBfaXNVaW50OEFycmF5KGNodW5rKTtcbiAgaWYgKGlzQnVmICYmICFCdWZmZXIuaXNCdWZmZXIoY2h1bmspKSB7XG4gICAgY2h1bmsgPSBfdWludDhBcnJheVRvQnVmZmVyKGNodW5rKTtcbiAgfVxuICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cbiAgaWYgKGlzQnVmKSBlbmNvZGluZyA9ICdidWZmZXInO2Vsc2UgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG4gIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIGNiID0gbm9wO1xuICBpZiAoc3RhdGUuZW5kaW5nKSB3cml0ZUFmdGVyRW5kKHRoaXMsIGNiKTtlbHNlIGlmIChpc0J1ZiB8fCB2YWxpZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgY2IpKSB7XG4gICAgc3RhdGUucGVuZGluZ2NiKys7XG4gICAgcmV0ID0gd3JpdGVPckJ1ZmZlcih0aGlzLCBzdGF0ZSwgaXNCdWYsIGNodW5rLCBlbmNvZGluZywgY2IpO1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuV3JpdGFibGUucHJvdG90eXBlLmNvcmsgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX3dyaXRhYmxlU3RhdGUuY29ya2VkKys7XG59O1xuV3JpdGFibGUucHJvdG90eXBlLnVuY29yayA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcbiAgaWYgKHN0YXRlLmNvcmtlZCkge1xuICAgIHN0YXRlLmNvcmtlZC0tO1xuICAgIGlmICghc3RhdGUud3JpdGluZyAmJiAhc3RhdGUuY29ya2VkICYmICFzdGF0ZS5idWZmZXJQcm9jZXNzaW5nICYmIHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdCkgY2xlYXJCdWZmZXIodGhpcywgc3RhdGUpO1xuICB9XG59O1xuV3JpdGFibGUucHJvdG90eXBlLnNldERlZmF1bHRFbmNvZGluZyA9IGZ1bmN0aW9uIHNldERlZmF1bHRFbmNvZGluZyhlbmNvZGluZykge1xuICAvLyBub2RlOjpQYXJzZUVuY29kaW5nKCkgcmVxdWlyZXMgbG93ZXIgY2FzZS5cbiAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycpIGVuY29kaW5nID0gZW5jb2RpbmcudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCEoWydoZXgnLCAndXRmOCcsICd1dGYtOCcsICdhc2NpaScsICdiaW5hcnknLCAnYmFzZTY0JywgJ3VjczInLCAndWNzLTInLCAndXRmMTZsZScsICd1dGYtMTZsZScsICdyYXcnXS5pbmRleE9mKChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpKSA+IC0xKSkgdGhyb3cgbmV3IEVSUl9VTktOT1dOX0VOQ09ESU5HKGVuY29kaW5nKTtcbiAgdGhpcy5fd3JpdGFibGVTdGF0ZS5kZWZhdWx0RW5jb2RpbmcgPSBlbmNvZGluZztcbiAgcmV0dXJuIHRoaXM7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwgJ3dyaXRhYmxlQnVmZmVyJywge1xuICAvLyBtYWtpbmcgaXQgZXhwbGljaXQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgZW51bWVyYWJsZVxuICAvLyBiZWNhdXNlIG90aGVyd2lzZSBzb21lIHByb3RvdHlwZSBtYW5pcHVsYXRpb24gaW5cbiAgLy8gdXNlcmxhbmQgd2lsbCBmYWlsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZSAmJiB0aGlzLl93cml0YWJsZVN0YXRlLmdldEJ1ZmZlcigpO1xuICB9XG59KTtcbmZ1bmN0aW9uIGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpIHtcbiAgaWYgKCFzdGF0ZS5vYmplY3RNb2RlICYmIHN0YXRlLmRlY29kZVN0cmluZ3MgIT09IGZhbHNlICYmIHR5cGVvZiBjaHVuayA9PT0gJ3N0cmluZycpIHtcbiAgICBjaHVuayA9IEJ1ZmZlci5mcm9tKGNodW5rLCBlbmNvZGluZyk7XG4gIH1cbiAgcmV0dXJuIGNodW5rO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwgJ3dyaXRhYmxlSGlnaFdhdGVyTWFyaycsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUuaGlnaFdhdGVyTWFyaztcbiAgfVxufSk7XG5cbi8vIGlmIHdlJ3JlIGFscmVhZHkgd3JpdGluZyBzb21ldGhpbmcsIHRoZW4ganVzdCBwdXQgdGhpc1xuLy8gaW4gdGhlIHF1ZXVlLCBhbmQgd2FpdCBvdXIgdHVybi4gIE90aGVyd2lzZSwgY2FsbCBfd3JpdGVcbi8vIElmIHdlIHJldHVybiBmYWxzZSwgdGhlbiB3ZSBuZWVkIGEgZHJhaW4gZXZlbnQsIHNvIHNldCB0aGF0IGZsYWcuXG5mdW5jdGlvbiB3cml0ZU9yQnVmZmVyKHN0cmVhbSwgc3RhdGUsIGlzQnVmLCBjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGlmICghaXNCdWYpIHtcbiAgICB2YXIgbmV3Q2h1bmsgPSBkZWNvZGVDaHVuayhzdGF0ZSwgY2h1bmssIGVuY29kaW5nKTtcbiAgICBpZiAoY2h1bmsgIT09IG5ld0NodW5rKSB7XG4gICAgICBpc0J1ZiA9IHRydWU7XG4gICAgICBlbmNvZGluZyA9ICdidWZmZXInO1xuICAgICAgY2h1bmsgPSBuZXdDaHVuaztcbiAgICB9XG4gIH1cbiAgdmFyIGxlbiA9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuICBzdGF0ZS5sZW5ndGggKz0gbGVuO1xuICB2YXIgcmV0ID0gc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyaztcbiAgLy8gd2UgbXVzdCBlbnN1cmUgdGhhdCBwcmV2aW91cyBuZWVkRHJhaW4gd2lsbCBub3QgYmUgcmVzZXQgdG8gZmFsc2UuXG4gIGlmICghcmV0KSBzdGF0ZS5uZWVkRHJhaW4gPSB0cnVlO1xuICBpZiAoc3RhdGUud3JpdGluZyB8fCBzdGF0ZS5jb3JrZWQpIHtcbiAgICB2YXIgbGFzdCA9IHN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q7XG4gICAgc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdCA9IHtcbiAgICAgIGNodW5rOiBjaHVuayxcbiAgICAgIGVuY29kaW5nOiBlbmNvZGluZyxcbiAgICAgIGlzQnVmOiBpc0J1ZixcbiAgICAgIGNhbGxiYWNrOiBjYixcbiAgICAgIG5leHQ6IG51bGxcbiAgICB9O1xuICAgIGlmIChsYXN0KSB7XG4gICAgICBsYXN0Lm5leHQgPSBzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5idWZmZXJlZFJlcXVlc3QgPSBzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0O1xuICAgIH1cbiAgICBzdGF0ZS5idWZmZXJlZFJlcXVlc3RDb3VudCArPSAxO1xuICB9IGVsc2Uge1xuICAgIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmFsc2UsIGxlbiwgY2h1bmssIGVuY29kaW5nLCBjYik7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cbmZ1bmN0aW9uIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgd3JpdGV2LCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgc3RhdGUud3JpdGVsZW4gPSBsZW47XG4gIHN0YXRlLndyaXRlY2IgPSBjYjtcbiAgc3RhdGUud3JpdGluZyA9IHRydWU7XG4gIHN0YXRlLnN5bmMgPSB0cnVlO1xuICBpZiAoc3RhdGUuZGVzdHJveWVkKSBzdGF0ZS5vbndyaXRlKG5ldyBFUlJfU1RSRUFNX0RFU1RST1lFRCgnd3JpdGUnKSk7ZWxzZSBpZiAod3JpdGV2KSBzdHJlYW0uX3dyaXRldihjaHVuaywgc3RhdGUub253cml0ZSk7ZWxzZSBzdHJlYW0uX3dyaXRlKGNodW5rLCBlbmNvZGluZywgc3RhdGUub253cml0ZSk7XG4gIHN0YXRlLnN5bmMgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIG9ud3JpdGVFcnJvcihzdHJlYW0sIHN0YXRlLCBzeW5jLCBlciwgY2IpIHtcbiAgLS1zdGF0ZS5wZW5kaW5nY2I7XG4gIGlmIChzeW5jKSB7XG4gICAgLy8gZGVmZXIgdGhlIGNhbGxiYWNrIGlmIHdlIGFyZSBiZWluZyBjYWxsZWQgc3luY2hyb25vdXNseVxuICAgIC8vIHRvIGF2b2lkIHBpbGluZyB1cCB0aGluZ3Mgb24gdGhlIHN0YWNrXG4gICAgcHJvY2Vzcy5uZXh0VGljayhjYiwgZXIpO1xuICAgIC8vIHRoaXMgY2FuIGVtaXQgZmluaXNoLCBhbmQgaXQgd2lsbCBhbHdheXMgaGFwcGVuXG4gICAgLy8gYWZ0ZXIgZXJyb3JcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZpbmlzaE1heWJlLCBzdHJlYW0sIHN0YXRlKTtcbiAgICBzdHJlYW0uX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkID0gdHJ1ZTtcbiAgICBlcnJvck9yRGVzdHJveShzdHJlYW0sIGVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyB0aGUgY2FsbGVyIGV4cGVjdCB0aGlzIHRvIGhhcHBlbiBiZWZvcmUgaWZcbiAgICAvLyBpdCBpcyBhc3luY1xuICAgIGNiKGVyKTtcbiAgICBzdHJlYW0uX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkID0gdHJ1ZTtcbiAgICBlcnJvck9yRGVzdHJveShzdHJlYW0sIGVyKTtcbiAgICAvLyB0aGlzIGNhbiBlbWl0IGZpbmlzaCwgYnV0IGZpbmlzaCBtdXN0XG4gICAgLy8gYWx3YXlzIGZvbGxvdyBlcnJvclxuICAgIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xuICB9XG59XG5mdW5jdGlvbiBvbndyaXRlU3RhdGVVcGRhdGUoc3RhdGUpIHtcbiAgc3RhdGUud3JpdGluZyA9IGZhbHNlO1xuICBzdGF0ZS53cml0ZWNiID0gbnVsbDtcbiAgc3RhdGUubGVuZ3RoIC09IHN0YXRlLndyaXRlbGVuO1xuICBzdGF0ZS53cml0ZWxlbiA9IDA7XG59XG5mdW5jdGlvbiBvbndyaXRlKHN0cmVhbSwgZXIpIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgc3luYyA9IHN0YXRlLnN5bmM7XG4gIHZhciBjYiA9IHN0YXRlLndyaXRlY2I7XG4gIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBFUlJfTVVMVElQTEVfQ0FMTEJBQ0soKTtcbiAgb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKTtcbiAgaWYgKGVyKSBvbndyaXRlRXJyb3Ioc3RyZWFtLCBzdGF0ZSwgc3luYywgZXIsIGNiKTtlbHNlIHtcbiAgICAvLyBDaGVjayBpZiB3ZSdyZSBhY3R1YWxseSByZWFkeSB0byBmaW5pc2gsIGJ1dCBkb24ndCBlbWl0IHlldFxuICAgIHZhciBmaW5pc2hlZCA9IG5lZWRGaW5pc2goc3RhdGUpIHx8IHN0cmVhbS5kZXN0cm95ZWQ7XG4gICAgaWYgKCFmaW5pc2hlZCAmJiAhc3RhdGUuY29ya2VkICYmICFzdGF0ZS5idWZmZXJQcm9jZXNzaW5nICYmIHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdCkge1xuICAgICAgY2xlYXJCdWZmZXIoc3RyZWFtLCBzdGF0ZSk7XG4gICAgfVxuICAgIGlmIChzeW5jKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGFmdGVyV3JpdGUsIHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKSB7XG4gIGlmICghZmluaXNoZWQpIG9ud3JpdGVEcmFpbihzdHJlYW0sIHN0YXRlKTtcbiAgc3RhdGUucGVuZGluZ2NiLS07XG4gIGNiKCk7XG4gIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xufVxuXG4vLyBNdXN0IGZvcmNlIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCBvbiBuZXh0VGljaywgc28gdGhhdCB3ZSBkb24ndFxuLy8gZW1pdCAnZHJhaW4nIGJlZm9yZSB0aGUgd3JpdGUoKSBjb25zdW1lciBnZXRzIHRoZSAnZmFsc2UnIHJldHVyblxuLy8gdmFsdWUsIGFuZCBoYXMgYSBjaGFuY2UgdG8gYXR0YWNoIGEgJ2RyYWluJyBsaXN0ZW5lci5cbmZ1bmN0aW9uIG9ud3JpdGVEcmFpbihzdHJlYW0sIHN0YXRlKSB7XG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgJiYgc3RhdGUubmVlZERyYWluKSB7XG4gICAgc3RhdGUubmVlZERyYWluID0gZmFsc2U7XG4gICAgc3RyZWFtLmVtaXQoJ2RyYWluJyk7XG4gIH1cbn1cblxuLy8gaWYgdGhlcmUncyBzb21ldGhpbmcgaW4gdGhlIGJ1ZmZlciB3YWl0aW5nLCB0aGVuIHByb2Nlc3MgaXRcbmZ1bmN0aW9uIGNsZWFyQnVmZmVyKHN0cmVhbSwgc3RhdGUpIHtcbiAgc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyA9IHRydWU7XG4gIHZhciBlbnRyeSA9IHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdDtcbiAgaWYgKHN0cmVhbS5fd3JpdGV2ICYmIGVudHJ5ICYmIGVudHJ5Lm5leHQpIHtcbiAgICAvLyBGYXN0IGNhc2UsIHdyaXRlIGV2ZXJ5dGhpbmcgdXNpbmcgX3dyaXRldigpXG4gICAgdmFyIGwgPSBzdGF0ZS5idWZmZXJlZFJlcXVlc3RDb3VudDtcbiAgICB2YXIgYnVmZmVyID0gbmV3IEFycmF5KGwpO1xuICAgIHZhciBob2xkZXIgPSBzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWU7XG4gICAgaG9sZGVyLmVudHJ5ID0gZW50cnk7XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICB2YXIgYWxsQnVmZmVycyA9IHRydWU7XG4gICAgd2hpbGUgKGVudHJ5KSB7XG4gICAgICBidWZmZXJbY291bnRdID0gZW50cnk7XG4gICAgICBpZiAoIWVudHJ5LmlzQnVmKSBhbGxCdWZmZXJzID0gZmFsc2U7XG4gICAgICBlbnRyeSA9IGVudHJ5Lm5leHQ7XG4gICAgICBjb3VudCArPSAxO1xuICAgIH1cbiAgICBidWZmZXIuYWxsQnVmZmVycyA9IGFsbEJ1ZmZlcnM7XG4gICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCB0cnVlLCBzdGF0ZS5sZW5ndGgsIGJ1ZmZlciwgJycsIGhvbGRlci5maW5pc2gpO1xuXG4gICAgLy8gZG9Xcml0ZSBpcyBhbG1vc3QgYWx3YXlzIGFzeW5jLCBkZWZlciB0aGVzZSB0byBzYXZlIGEgYml0IG9mIHRpbWVcbiAgICAvLyBhcyB0aGUgaG90IHBhdGggZW5kcyB3aXRoIGRvV3JpdGVcbiAgICBzdGF0ZS5wZW5kaW5nY2IrKztcbiAgICBzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcbiAgICBpZiAoaG9sZGVyLm5leHQpIHtcbiAgICAgIHN0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZSA9IGhvbGRlci5uZXh0O1xuICAgICAgaG9sZGVyLm5leHQgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWUgPSBuZXcgQ29ya2VkUmVxdWVzdChzdGF0ZSk7XG4gICAgfVxuICAgIHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdENvdW50ID0gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBTbG93IGNhc2UsIHdyaXRlIGNodW5rcyBvbmUtYnktb25lXG4gICAgd2hpbGUgKGVudHJ5KSB7XG4gICAgICB2YXIgY2h1bmsgPSBlbnRyeS5jaHVuaztcbiAgICAgIHZhciBlbmNvZGluZyA9IGVudHJ5LmVuY29kaW5nO1xuICAgICAgdmFyIGNiID0gZW50cnkuY2FsbGJhY2s7XG4gICAgICB2YXIgbGVuID0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG4gICAgICBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIGZhbHNlLCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpO1xuICAgICAgZW50cnkgPSBlbnRyeS5uZXh0O1xuICAgICAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQtLTtcbiAgICAgIC8vIGlmIHdlIGRpZG4ndCBjYWxsIHRoZSBvbndyaXRlIGltbWVkaWF0ZWx5LCB0aGVuXG4gICAgICAvLyBpdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gd2FpdCB1bnRpbCBpdCBkb2VzLlxuICAgICAgLy8gYWxzbywgdGhhdCBtZWFucyB0aGF0IHRoZSBjaHVuayBhbmQgY2IgYXJlIGN1cnJlbnRseVxuICAgICAgLy8gYmVpbmcgcHJvY2Vzc2VkLCBzbyBtb3ZlIHRoZSBidWZmZXIgY291bnRlciBwYXN0IHRoZW0uXG4gICAgICBpZiAoc3RhdGUud3JpdGluZykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVudHJ5ID09PSBudWxsKSBzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcbiAgfVxuICBzdGF0ZS5idWZmZXJlZFJlcXVlc3QgPSBlbnRyeTtcbiAgc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyA9IGZhbHNlO1xufVxuV3JpdGFibGUucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGNiKG5ldyBFUlJfTUVUSE9EX05PVF9JTVBMRU1FTlRFRCgnX3dyaXRlKCknKSk7XG59O1xuV3JpdGFibGUucHJvdG90eXBlLl93cml0ZXYgPSBudWxsO1xuV3JpdGFibGUucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG4gIGlmICh0eXBlb2YgY2h1bmsgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGNodW5rO1xuICAgIGNodW5rID0gbnVsbDtcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cbiAgaWYgKGNodW5rICE9PSBudWxsICYmIGNodW5rICE9PSB1bmRlZmluZWQpIHRoaXMud3JpdGUoY2h1bmssIGVuY29kaW5nKTtcblxuICAvLyAuZW5kKCkgZnVsbHkgdW5jb3Jrc1xuICBpZiAoc3RhdGUuY29ya2VkKSB7XG4gICAgc3RhdGUuY29ya2VkID0gMTtcbiAgICB0aGlzLnVuY29yaygpO1xuICB9XG5cbiAgLy8gaWdub3JlIHVubmVjZXNzYXJ5IGVuZCgpIGNhbGxzLlxuICBpZiAoIXN0YXRlLmVuZGluZykgZW5kV3JpdGFibGUodGhpcywgc3RhdGUsIGNiKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwgJ3dyaXRhYmxlTGVuZ3RoJywge1xuICAvLyBtYWtpbmcgaXQgZXhwbGljaXQgdGhpcyBwcm9wZXJ0eSBpcyBub3QgZW51bWVyYWJsZVxuICAvLyBiZWNhdXNlIG90aGVyd2lzZSBzb21lIHByb3RvdHlwZSBtYW5pcHVsYXRpb24gaW5cbiAgLy8gdXNlcmxhbmQgd2lsbCBmYWlsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZS5sZW5ndGg7XG4gIH1cbn0pO1xuZnVuY3Rpb24gbmVlZEZpbmlzaChzdGF0ZSkge1xuICByZXR1cm4gc3RhdGUuZW5kaW5nICYmIHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5idWZmZXJlZFJlcXVlc3QgPT09IG51bGwgJiYgIXN0YXRlLmZpbmlzaGVkICYmICFzdGF0ZS53cml0aW5nO1xufVxuZnVuY3Rpb24gY2FsbEZpbmFsKHN0cmVhbSwgc3RhdGUpIHtcbiAgc3RyZWFtLl9maW5hbChmdW5jdGlvbiAoZXJyKSB7XG4gICAgc3RhdGUucGVuZGluZ2NiLS07XG4gICAgaWYgKGVycikge1xuICAgICAgZXJyb3JPckRlc3Ryb3koc3RyZWFtLCBlcnIpO1xuICAgIH1cbiAgICBzdGF0ZS5wcmVmaW5pc2hlZCA9IHRydWU7XG4gICAgc3RyZWFtLmVtaXQoJ3ByZWZpbmlzaCcpO1xuICAgIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHByZWZpbmlzaChzdHJlYW0sIHN0YXRlKSB7XG4gIGlmICghc3RhdGUucHJlZmluaXNoZWQgJiYgIXN0YXRlLmZpbmFsQ2FsbGVkKSB7XG4gICAgaWYgKHR5cGVvZiBzdHJlYW0uX2ZpbmFsID09PSAnZnVuY3Rpb24nICYmICFzdGF0ZS5kZXN0cm95ZWQpIHtcbiAgICAgIHN0YXRlLnBlbmRpbmdjYisrO1xuICAgICAgc3RhdGUuZmluYWxDYWxsZWQgPSB0cnVlO1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjYWxsRmluYWwsIHN0cmVhbSwgc3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5wcmVmaW5pc2hlZCA9IHRydWU7XG4gICAgICBzdHJlYW0uZW1pdCgncHJlZmluaXNoJyk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKSB7XG4gIHZhciBuZWVkID0gbmVlZEZpbmlzaChzdGF0ZSk7XG4gIGlmIChuZWVkKSB7XG4gICAgcHJlZmluaXNoKHN0cmVhbSwgc3RhdGUpO1xuICAgIGlmIChzdGF0ZS5wZW5kaW5nY2IgPT09IDApIHtcbiAgICAgIHN0YXRlLmZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIHN0cmVhbS5lbWl0KCdmaW5pc2gnKTtcbiAgICAgIGlmIChzdGF0ZS5hdXRvRGVzdHJveSkge1xuICAgICAgICAvLyBJbiBjYXNlIG9mIGR1cGxleCBzdHJlYW1zIHdlIG5lZWQgYSB3YXkgdG8gZGV0ZWN0XG4gICAgICAgIC8vIGlmIHRoZSByZWFkYWJsZSBzaWRlIGlzIHJlYWR5IGZvciBhdXRvRGVzdHJveSBhcyB3ZWxsXG4gICAgICAgIHZhciByU3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gICAgICAgIGlmICghclN0YXRlIHx8IHJTdGF0ZS5hdXRvRGVzdHJveSAmJiByU3RhdGUuZW5kRW1pdHRlZCkge1xuICAgICAgICAgIHN0cmVhbS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5lZWQ7XG59XG5mdW5jdGlvbiBlbmRXcml0YWJsZShzdHJlYW0sIHN0YXRlLCBjYikge1xuICBzdGF0ZS5lbmRpbmcgPSB0cnVlO1xuICBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKTtcbiAgaWYgKGNiKSB7XG4gICAgaWYgKHN0YXRlLmZpbmlzaGVkKSBwcm9jZXNzLm5leHRUaWNrKGNiKTtlbHNlIHN0cmVhbS5vbmNlKCdmaW5pc2gnLCBjYik7XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuICBzdHJlYW0ud3JpdGFibGUgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIG9uQ29ya2VkRmluaXNoKGNvcmtSZXEsIHN0YXRlLCBlcnIpIHtcbiAgdmFyIGVudHJ5ID0gY29ya1JlcS5lbnRyeTtcbiAgY29ya1JlcS5lbnRyeSA9IG51bGw7XG4gIHdoaWxlIChlbnRyeSkge1xuICAgIHZhciBjYiA9IGVudHJ5LmNhbGxiYWNrO1xuICAgIHN0YXRlLnBlbmRpbmdjYi0tO1xuICAgIGNiKGVycik7XG4gICAgZW50cnkgPSBlbnRyeS5uZXh0O1xuICB9XG5cbiAgLy8gcmV1c2UgdGhlIGZyZWUgY29ya1JlcS5cbiAgc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlLm5leHQgPSBjb3JrUmVxO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwgJ2Rlc3Ryb3llZCcsIHtcbiAgLy8gbWFraW5nIGl0IGV4cGxpY2l0IHRoaXMgcHJvcGVydHkgaXMgbm90IGVudW1lcmFibGVcbiAgLy8gYmVjYXVzZSBvdGhlcndpc2Ugc29tZSBwcm90b3R5cGUgbWFuaXB1bGF0aW9uIGluXG4gIC8vIHVzZXJsYW5kIHdpbGwgZmFpbFxuICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgaWYgKHRoaXMuX3dyaXRhYmxlU3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQ7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgLy8gd2UgaWdub3JlIHRoZSB2YWx1ZSBpZiB0aGUgc3RyZWFtXG4gICAgLy8gaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldFxuICAgIGlmICghdGhpcy5fd3JpdGFibGVTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHRoZSB1c2VyIGlzIGV4cGxpY2l0bHlcbiAgICAvLyBtYW5hZ2luZyBkZXN0cm95ZWRcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZCA9IHZhbHVlO1xuICB9XG59KTtcbldyaXRhYmxlLnByb3RvdHlwZS5kZXN0cm95ID0gZGVzdHJveUltcGwuZGVzdHJveTtcbldyaXRhYmxlLnByb3RvdHlwZS5fdW5kZXN0cm95ID0gZGVzdHJveUltcGwudW5kZXN0cm95O1xuV3JpdGFibGUucHJvdG90eXBlLl9kZXN0cm95ID0gZnVuY3Rpb24gKGVyciwgY2IpIHtcbiAgY2IoZXJyKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX09iamVjdCRzZXRQcm90b3R5cGVPO1xuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBrZXkgPSBfdG9Qcm9wZXJ0eUtleShrZXkpOyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cbmZ1bmN0aW9uIF90b1Byb3BlcnR5S2V5KGFyZykgeyB2YXIga2V5ID0gX3RvUHJpbWl0aXZlKGFyZywgXCJzdHJpbmdcIik7IHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN5bWJvbFwiID8ga2V5IDogU3RyaW5nKGtleSk7IH1cbmZ1bmN0aW9uIF90b1ByaW1pdGl2ZShpbnB1dCwgaGludCkgeyBpZiAodHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiIHx8IGlucHV0ID09PSBudWxsKSByZXR1cm4gaW5wdXQ7IHZhciBwcmltID0gaW5wdXRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHByaW0gIT09IHVuZGVmaW5lZCkgeyB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTsgaWYgKHR5cGVvZiByZXMgIT09IFwib2JqZWN0XCIpIHJldHVybiByZXM7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTsgfSByZXR1cm4gKGhpbnQgPT09IFwic3RyaW5nXCIgPyBTdHJpbmcgOiBOdW1iZXIpKGlucHV0KTsgfVxudmFyIGZpbmlzaGVkID0gcmVxdWlyZSgnLi9lbmQtb2Ytc3RyZWFtJyk7XG52YXIga0xhc3RSZXNvbHZlID0gU3ltYm9sKCdsYXN0UmVzb2x2ZScpO1xudmFyIGtMYXN0UmVqZWN0ID0gU3ltYm9sKCdsYXN0UmVqZWN0Jyk7XG52YXIga0Vycm9yID0gU3ltYm9sKCdlcnJvcicpO1xudmFyIGtFbmRlZCA9IFN5bWJvbCgnZW5kZWQnKTtcbnZhciBrTGFzdFByb21pc2UgPSBTeW1ib2woJ2xhc3RQcm9taXNlJyk7XG52YXIga0hhbmRsZVByb21pc2UgPSBTeW1ib2woJ2hhbmRsZVByb21pc2UnKTtcbnZhciBrU3RyZWFtID0gU3ltYm9sKCdzdHJlYW0nKTtcbmZ1bmN0aW9uIGNyZWF0ZUl0ZXJSZXN1bHQodmFsdWUsIGRvbmUpIHtcbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogdmFsdWUsXG4gICAgZG9uZTogZG9uZVxuICB9O1xufVxuZnVuY3Rpb24gcmVhZEFuZFJlc29sdmUoaXRlcikge1xuICB2YXIgcmVzb2x2ZSA9IGl0ZXJba0xhc3RSZXNvbHZlXTtcbiAgaWYgKHJlc29sdmUgIT09IG51bGwpIHtcbiAgICB2YXIgZGF0YSA9IGl0ZXJba1N0cmVhbV0ucmVhZCgpO1xuICAgIC8vIHdlIGRlZmVyIGlmIGRhdGEgaXMgbnVsbFxuICAgIC8vIHdlIGNhbiBiZSBleHBlY3RpbmcgZWl0aGVyICdlbmQnIG9yXG4gICAgLy8gJ2Vycm9yJ1xuICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICBpdGVyW2tMYXN0UHJvbWlzZV0gPSBudWxsO1xuICAgICAgaXRlcltrTGFzdFJlc29sdmVdID0gbnVsbDtcbiAgICAgIGl0ZXJba0xhc3RSZWplY3RdID0gbnVsbDtcbiAgICAgIHJlc29sdmUoY3JlYXRlSXRlclJlc3VsdChkYXRhLCBmYWxzZSkpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gb25SZWFkYWJsZShpdGVyKSB7XG4gIC8vIHdlIHdhaXQgZm9yIHRoZSBuZXh0IHRpY2ssIGJlY2F1c2UgaXQgbWlnaHRcbiAgLy8gZW1pdCBhbiBlcnJvciB3aXRoIHByb2Nlc3MubmV4dFRpY2tcbiAgcHJvY2Vzcy5uZXh0VGljayhyZWFkQW5kUmVzb2x2ZSwgaXRlcik7XG59XG5mdW5jdGlvbiB3cmFwRm9yTmV4dChsYXN0UHJvbWlzZSwgaXRlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGxhc3RQcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGl0ZXJba0VuZGVkXSkge1xuICAgICAgICByZXNvbHZlKGNyZWF0ZUl0ZXJSZXN1bHQodW5kZWZpbmVkLCB0cnVlKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGl0ZXJba0hhbmRsZVByb21pc2VdKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSwgcmVqZWN0KTtcbiAgfTtcbn1cbnZhciBBc3luY0l0ZXJhdG9yUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGZ1bmN0aW9uICgpIHt9KTtcbnZhciBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JQcm90b3R5cGUgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YoKF9PYmplY3Qkc2V0UHJvdG90eXBlTyA9IHtcbiAgZ2V0IHN0cmVhbSgpIHtcbiAgICByZXR1cm4gdGhpc1trU3RyZWFtXTtcbiAgfSxcbiAgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIC8vIGlmIHdlIGhhdmUgZGV0ZWN0ZWQgYW4gZXJyb3IgaW4gdGhlIG1lYW53aGlsZVxuICAgIC8vIHJlamVjdCBzdHJhaWdodCBhd2F5XG4gICAgdmFyIGVycm9yID0gdGhpc1trRXJyb3JdO1xuICAgIGlmIChlcnJvciAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9XG4gICAgaWYgKHRoaXNba0VuZGVkXSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjcmVhdGVJdGVyUmVzdWx0KHVuZGVmaW5lZCwgdHJ1ZSkpO1xuICAgIH1cbiAgICBpZiAodGhpc1trU3RyZWFtXS5kZXN0cm95ZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gZGVmZXIgdmlhIG5leHRUaWNrIGJlY2F1c2UgaWYgLmRlc3Ryb3koZXJyKSBpc1xuICAgICAgLy8gY2FsbGVkLCB0aGUgZXJyb3Igd2lsbCBiZSBlbWl0dGVkIHZpYSBuZXh0VGljaywgYW5kXG4gICAgICAvLyB3ZSBjYW5ub3QgZ3VhcmFudGVlIHRoYXQgdGhlcmUgaXMgbm8gZXJyb3IgbGluZ2VyaW5nIGFyb3VuZFxuICAgICAgLy8gd2FpdGluZyB0byBiZSBlbWl0dGVkLlxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKF90aGlzW2tFcnJvcl0pIHtcbiAgICAgICAgICAgIHJlamVjdChfdGhpc1trRXJyb3JdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShjcmVhdGVJdGVyUmVzdWx0KHVuZGVmaW5lZCwgdHJ1ZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSBoYXZlIG11bHRpcGxlIG5leHQoKSBjYWxsc1xuICAgIC8vIHdlIHdpbGwgd2FpdCBmb3IgdGhlIHByZXZpb3VzIFByb21pc2UgdG8gZmluaXNoXG4gICAgLy8gdGhpcyBsb2dpYyBpcyBvcHRpbWl6ZWQgdG8gc3VwcG9ydCBmb3IgYXdhaXQgbG9vcHMsXG4gICAgLy8gd2hlcmUgbmV4dCgpIGlzIG9ubHkgY2FsbGVkIG9uY2UgYXQgYSB0aW1lXG4gICAgdmFyIGxhc3RQcm9taXNlID0gdGhpc1trTGFzdFByb21pc2VdO1xuICAgIHZhciBwcm9taXNlO1xuICAgIGlmIChsYXN0UHJvbWlzZSkge1xuICAgICAgcHJvbWlzZSA9IG5ldyBQcm9taXNlKHdyYXBGb3JOZXh0KGxhc3RQcm9taXNlLCB0aGlzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGZhc3QgcGF0aCBuZWVkZWQgdG8gc3VwcG9ydCBtdWx0aXBsZSB0aGlzLnB1c2goKVxuICAgICAgLy8gd2l0aG91dCB0cmlnZ2VyaW5nIHRoZSBuZXh0KCkgcXVldWVcbiAgICAgIHZhciBkYXRhID0gdGhpc1trU3RyZWFtXS5yZWFkKCk7XG4gICAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNyZWF0ZUl0ZXJSZXN1bHQoZGF0YSwgZmFsc2UpKTtcbiAgICAgIH1cbiAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSh0aGlzW2tIYW5kbGVQcm9taXNlXSk7XG4gICAgfVxuICAgIHRoaXNba0xhc3RQcm9taXNlXSA9IHByb21pc2U7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn0sIF9kZWZpbmVQcm9wZXJ0eShfT2JqZWN0JHNldFByb3RvdHlwZU8sIFN5bWJvbC5hc3luY0l0ZXJhdG9yLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufSksIF9kZWZpbmVQcm9wZXJ0eShfT2JqZWN0JHNldFByb3RvdHlwZU8sIFwicmV0dXJuXCIsIGZ1bmN0aW9uIF9yZXR1cm4oKSB7XG4gIHZhciBfdGhpczIgPSB0aGlzO1xuICAvLyBkZXN0cm95KGVyciwgY2IpIGlzIGEgcHJpdmF0ZSBBUElcbiAgLy8gd2UgY2FuIGd1YXJhbnRlZSB3ZSBoYXZlIHRoYXQgaGVyZSwgYmVjYXVzZSB3ZSBjb250cm9sIHRoZVxuICAvLyBSZWFkYWJsZSBjbGFzcyB0aGlzIGlzIGF0dGFjaGVkIHRvXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgX3RoaXMyW2tTdHJlYW1dLmRlc3Ryb3kobnVsbCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShjcmVhdGVJdGVyUmVzdWx0KHVuZGVmaW5lZCwgdHJ1ZSkpO1xuICAgIH0pO1xuICB9KTtcbn0pLCBfT2JqZWN0JHNldFByb3RvdHlwZU8pLCBBc3luY0l0ZXJhdG9yUHJvdG90eXBlKTtcbnZhciBjcmVhdGVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IgPSBmdW5jdGlvbiBjcmVhdGVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3Ioc3RyZWFtKSB7XG4gIHZhciBfT2JqZWN0JGNyZWF0ZTtcbiAgdmFyIGl0ZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JQcm90b3R5cGUsIChfT2JqZWN0JGNyZWF0ZSA9IHt9LCBfZGVmaW5lUHJvcGVydHkoX09iamVjdCRjcmVhdGUsIGtTdHJlYW0sIHtcbiAgICB2YWx1ZTogc3RyZWFtLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBfZGVmaW5lUHJvcGVydHkoX09iamVjdCRjcmVhdGUsIGtMYXN0UmVzb2x2ZSwge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBfZGVmaW5lUHJvcGVydHkoX09iamVjdCRjcmVhdGUsIGtMYXN0UmVqZWN0LCB7XG4gICAgdmFsdWU6IG51bGwsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIF9kZWZpbmVQcm9wZXJ0eShfT2JqZWN0JGNyZWF0ZSwga0Vycm9yLCB7XG4gICAgdmFsdWU6IG51bGwsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIF9kZWZpbmVQcm9wZXJ0eShfT2JqZWN0JGNyZWF0ZSwga0VuZGVkLCB7XG4gICAgdmFsdWU6IHN0cmVhbS5fcmVhZGFibGVTdGF0ZS5lbmRFbWl0dGVkLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBfZGVmaW5lUHJvcGVydHkoX09iamVjdCRjcmVhdGUsIGtIYW5kbGVQcm9taXNlLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGRhdGEgPSBpdGVyYXRvcltrU3RyZWFtXS5yZWFkKCk7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBpdGVyYXRvcltrTGFzdFByb21pc2VdID0gbnVsbDtcbiAgICAgICAgaXRlcmF0b3Jba0xhc3RSZXNvbHZlXSA9IG51bGw7XG4gICAgICAgIGl0ZXJhdG9yW2tMYXN0UmVqZWN0XSA9IG51bGw7XG4gICAgICAgIHJlc29sdmUoY3JlYXRlSXRlclJlc3VsdChkYXRhLCBmYWxzZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlcmF0b3Jba0xhc3RSZXNvbHZlXSA9IHJlc29sdmU7XG4gICAgICAgIGl0ZXJhdG9yW2tMYXN0UmVqZWN0XSA9IHJlamVjdDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBfT2JqZWN0JGNyZWF0ZSkpO1xuICBpdGVyYXRvcltrTGFzdFByb21pc2VdID0gbnVsbDtcbiAgZmluaXNoZWQoc3RyZWFtLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGVyciAmJiBlcnIuY29kZSAhPT0gJ0VSUl9TVFJFQU1fUFJFTUFUVVJFX0NMT1NFJykge1xuICAgICAgdmFyIHJlamVjdCA9IGl0ZXJhdG9yW2tMYXN0UmVqZWN0XTtcbiAgICAgIC8vIHJlamVjdCBpZiB3ZSBhcmUgd2FpdGluZyBmb3IgZGF0YSBpbiB0aGUgUHJvbWlzZVxuICAgICAgLy8gcmV0dXJuZWQgYnkgbmV4dCgpIGFuZCBzdG9yZSB0aGUgZXJyb3JcbiAgICAgIGlmIChyZWplY3QgIT09IG51bGwpIHtcbiAgICAgICAgaXRlcmF0b3Jba0xhc3RQcm9taXNlXSA9IG51bGw7XG4gICAgICAgIGl0ZXJhdG9yW2tMYXN0UmVzb2x2ZV0gPSBudWxsO1xuICAgICAgICBpdGVyYXRvcltrTGFzdFJlamVjdF0gPSBudWxsO1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIGl0ZXJhdG9yW2tFcnJvcl0gPSBlcnI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXNvbHZlID0gaXRlcmF0b3Jba0xhc3RSZXNvbHZlXTtcbiAgICBpZiAocmVzb2x2ZSAhPT0gbnVsbCkge1xuICAgICAgaXRlcmF0b3Jba0xhc3RQcm9taXNlXSA9IG51bGw7XG4gICAgICBpdGVyYXRvcltrTGFzdFJlc29sdmVdID0gbnVsbDtcbiAgICAgIGl0ZXJhdG9yW2tMYXN0UmVqZWN0XSA9IG51bGw7XG4gICAgICByZXNvbHZlKGNyZWF0ZUl0ZXJSZXN1bHQodW5kZWZpbmVkLCB0cnVlKSk7XG4gICAgfVxuICAgIGl0ZXJhdG9yW2tFbmRlZF0gPSB0cnVlO1xuICB9KTtcbiAgc3RyZWFtLm9uKCdyZWFkYWJsZScsIG9uUmVhZGFibGUuYmluZChudWxsLCBpdGVyYXRvcikpO1xuICByZXR1cm4gaXRlcmF0b3I7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHsgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpOyBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTsgZW51bWVyYWJsZU9ubHkgJiYgKHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KSksIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IG51bGwgIT0gYXJndW1lbnRzW2ldID8gYXJndW1lbnRzW2ldIDoge307IGkgJSAyID8gb3duS2V5cyhPYmplY3Qoc291cmNlKSwgITApLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkgOiBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IHJldHVybiB0YXJnZXQ7IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsga2V5ID0gX3RvUHJvcGVydHlLZXkoa2V5KTsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBfdG9Qcm9wZXJ0eUtleShkZXNjcmlwdG9yLmtleSksIGRlc2NyaXB0b3IpOyB9IH1cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnN0cnVjdG9yLCBcInByb3RvdHlwZVwiLCB7IHdyaXRhYmxlOiBmYWxzZSB9KTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5mdW5jdGlvbiBfdG9Qcm9wZXJ0eUtleShhcmcpIHsgdmFyIGtleSA9IF90b1ByaW1pdGl2ZShhcmcsIFwic3RyaW5nXCIpOyByZXR1cm4gdHlwZW9mIGtleSA9PT0gXCJzeW1ib2xcIiA/IGtleSA6IFN0cmluZyhrZXkpOyB9XG5mdW5jdGlvbiBfdG9QcmltaXRpdmUoaW5wdXQsIGhpbnQpIHsgaWYgKHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIiB8fCBpbnB1dCA9PT0gbnVsbCkgcmV0dXJuIGlucHV0OyB2YXIgcHJpbSA9IGlucHV0W1N5bWJvbC50b1ByaW1pdGl2ZV07IGlmIChwcmltICE9PSB1bmRlZmluZWQpIHsgdmFyIHJlcyA9IHByaW0uY2FsbChpbnB1dCwgaGludCB8fCBcImRlZmF1bHRcIik7IGlmICh0eXBlb2YgcmVzICE9PSBcIm9iamVjdFwiKSByZXR1cm4gcmVzOyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7IH0gcmV0dXJuIChoaW50ID09PSBcInN0cmluZ1wiID8gU3RyaW5nIDogTnVtYmVyKShpbnB1dCk7IH1cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ2J1ZmZlcicpLFxuICBCdWZmZXIgPSBfcmVxdWlyZS5CdWZmZXI7XG52YXIgX3JlcXVpcmUyID0gcmVxdWlyZSgndXRpbCcpLFxuICBpbnNwZWN0ID0gX3JlcXVpcmUyLmluc3BlY3Q7XG52YXIgY3VzdG9tID0gaW5zcGVjdCAmJiBpbnNwZWN0LmN1c3RvbSB8fCAnaW5zcGVjdCc7XG5mdW5jdGlvbiBjb3B5QnVmZmVyKHNyYywgdGFyZ2V0LCBvZmZzZXQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5jb3B5LmNhbGwoc3JjLCB0YXJnZXQsIG9mZnNldCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJ1ZmZlckxpc3QoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJ1ZmZlckxpc3QpO1xuICAgIHRoaXMuaGVhZCA9IG51bGw7XG4gICAgdGhpcy50YWlsID0gbnVsbDtcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG4gIH1cbiAgX2NyZWF0ZUNsYXNzKEJ1ZmZlckxpc3QsIFt7XG4gICAga2V5OiBcInB1c2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHVzaCh2KSB7XG4gICAgICB2YXIgZW50cnkgPSB7XG4gICAgICAgIGRhdGE6IHYsXG4gICAgICAgIG5leHQ6IG51bGxcbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5sZW5ndGggPiAwKSB0aGlzLnRhaWwubmV4dCA9IGVudHJ5O2Vsc2UgdGhpcy5oZWFkID0gZW50cnk7XG4gICAgICB0aGlzLnRhaWwgPSBlbnRyeTtcbiAgICAgICsrdGhpcy5sZW5ndGg7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVuc2hpZnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5zaGlmdCh2KSB7XG4gICAgICB2YXIgZW50cnkgPSB7XG4gICAgICAgIGRhdGE6IHYsXG4gICAgICAgIG5leHQ6IHRoaXMuaGVhZFxuICAgICAgfTtcbiAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgdGhpcy50YWlsID0gZW50cnk7XG4gICAgICB0aGlzLmhlYWQgPSBlbnRyeTtcbiAgICAgICsrdGhpcy5sZW5ndGg7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNoaWZ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNoaWZ0KCkge1xuICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICB2YXIgcmV0ID0gdGhpcy5oZWFkLmRhdGE7XG4gICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IG51bGw7ZWxzZSB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dDtcbiAgICAgIC0tdGhpcy5sZW5ndGg7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGVhclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IG51bGw7XG4gICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImpvaW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gam9pbihzKSB7XG4gICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiAnJztcbiAgICAgIHZhciBwID0gdGhpcy5oZWFkO1xuICAgICAgdmFyIHJldCA9ICcnICsgcC5kYXRhO1xuICAgICAgd2hpbGUgKHAgPSBwLm5leHQpIHJldCArPSBzICsgcC5kYXRhO1xuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29uY2F0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbmNhdChuKSB7XG4gICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiBCdWZmZXIuYWxsb2MoMCk7XG4gICAgICB2YXIgcmV0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKG4gPj4+IDApO1xuICAgICAgdmFyIHAgPSB0aGlzLmhlYWQ7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICB3aGlsZSAocCkge1xuICAgICAgICBjb3B5QnVmZmVyKHAuZGF0YSwgcmV0LCBpKTtcbiAgICAgICAgaSArPSBwLmRhdGEubGVuZ3RoO1xuICAgICAgICBwID0gcC5uZXh0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvLyBDb25zdW1lcyBhIHNwZWNpZmllZCBhbW91bnQgb2YgYnl0ZXMgb3IgY2hhcmFjdGVycyBmcm9tIHRoZSBidWZmZXJlZCBkYXRhLlxuICB9LCB7XG4gICAga2V5OiBcImNvbnN1bWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29uc3VtZShuLCBoYXNTdHJpbmdzKSB7XG4gICAgICB2YXIgcmV0O1xuICAgICAgaWYgKG4gPCB0aGlzLmhlYWQuZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgLy8gYHNsaWNlYCBpcyB0aGUgc2FtZSBmb3IgYnVmZmVycyBhbmQgc3RyaW5ncy5cbiAgICAgICAgcmV0ID0gdGhpcy5oZWFkLmRhdGEuc2xpY2UoMCwgbik7XG4gICAgICAgIHRoaXMuaGVhZC5kYXRhID0gdGhpcy5oZWFkLmRhdGEuc2xpY2Uobik7XG4gICAgICB9IGVsc2UgaWYgKG4gPT09IHRoaXMuaGVhZC5kYXRhLmxlbmd0aCkge1xuICAgICAgICAvLyBGaXJzdCBjaHVuayBpcyBhIHBlcmZlY3QgbWF0Y2guXG4gICAgICAgIHJldCA9IHRoaXMuc2hpZnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFJlc3VsdCBzcGFucyBtb3JlIHRoYW4gb25lIGJ1ZmZlci5cbiAgICAgICAgcmV0ID0gaGFzU3RyaW5ncyA/IHRoaXMuX2dldFN0cmluZyhuKSA6IHRoaXMuX2dldEJ1ZmZlcihuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZpcnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpcnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGVhZC5kYXRhO1xuICAgIH1cblxuICAgIC8vIENvbnN1bWVzIGEgc3BlY2lmaWVkIGFtb3VudCBvZiBjaGFyYWN0ZXJzIGZyb20gdGhlIGJ1ZmZlcmVkIGRhdGEuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2dldFN0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0U3RyaW5nKG4pIHtcbiAgICAgIHZhciBwID0gdGhpcy5oZWFkO1xuICAgICAgdmFyIGMgPSAxO1xuICAgICAgdmFyIHJldCA9IHAuZGF0YTtcbiAgICAgIG4gLT0gcmV0Lmxlbmd0aDtcbiAgICAgIHdoaWxlIChwID0gcC5uZXh0KSB7XG4gICAgICAgIHZhciBzdHIgPSBwLmRhdGE7XG4gICAgICAgIHZhciBuYiA9IG4gPiBzdHIubGVuZ3RoID8gc3RyLmxlbmd0aCA6IG47XG4gICAgICAgIGlmIChuYiA9PT0gc3RyLmxlbmd0aCkgcmV0ICs9IHN0cjtlbHNlIHJldCArPSBzdHIuc2xpY2UoMCwgbik7XG4gICAgICAgIG4gLT0gbmI7XG4gICAgICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgICAgaWYgKG5iID09PSBzdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICArK2M7XG4gICAgICAgICAgICBpZiAocC5uZXh0KSB0aGlzLmhlYWQgPSBwLm5leHQ7ZWxzZSB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBudWxsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhlYWQgPSBwO1xuICAgICAgICAgICAgcC5kYXRhID0gc3RyLnNsaWNlKG5iKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgKytjO1xuICAgICAgfVxuICAgICAgdGhpcy5sZW5ndGggLT0gYztcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLy8gQ29uc3VtZXMgYSBzcGVjaWZpZWQgYW1vdW50IG9mIGJ5dGVzIGZyb20gdGhlIGJ1ZmZlcmVkIGRhdGEuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2dldEJ1ZmZlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfZ2V0QnVmZmVyKG4pIHtcbiAgICAgIHZhciByZXQgPSBCdWZmZXIuYWxsb2NVbnNhZmUobik7XG4gICAgICB2YXIgcCA9IHRoaXMuaGVhZDtcbiAgICAgIHZhciBjID0gMTtcbiAgICAgIHAuZGF0YS5jb3B5KHJldCk7XG4gICAgICBuIC09IHAuZGF0YS5sZW5ndGg7XG4gICAgICB3aGlsZSAocCA9IHAubmV4dCkge1xuICAgICAgICB2YXIgYnVmID0gcC5kYXRhO1xuICAgICAgICB2YXIgbmIgPSBuID4gYnVmLmxlbmd0aCA/IGJ1Zi5sZW5ndGggOiBuO1xuICAgICAgICBidWYuY29weShyZXQsIHJldC5sZW5ndGggLSBuLCAwLCBuYik7XG4gICAgICAgIG4gLT0gbmI7XG4gICAgICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgICAgaWYgKG5iID09PSBidWYubGVuZ3RoKSB7XG4gICAgICAgICAgICArK2M7XG4gICAgICAgICAgICBpZiAocC5uZXh0KSB0aGlzLmhlYWQgPSBwLm5leHQ7ZWxzZSB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBudWxsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhlYWQgPSBwO1xuICAgICAgICAgICAgcC5kYXRhID0gYnVmLnNsaWNlKG5iKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgKytjO1xuICAgICAgfVxuICAgICAgdGhpcy5sZW5ndGggLT0gYztcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBsaW5rZWQgbGlzdCBvbmx5IHNob3dzIHRoZSBtaW5pbWFsIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbi5cbiAgfSwge1xuICAgIGtleTogY3VzdG9tLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShfLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gaW5zcGVjdCh0aGlzLCBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIG9wdGlvbnMpLCB7fSwge1xuICAgICAgICAvLyBPbmx5IGluc3BlY3Qgb25lIGxldmVsLlxuICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgLy8gSXQgc2hvdWxkIG5vdCByZWN1cnNlLlxuICAgICAgICBjdXN0b21JbnNwZWN0OiBmYWxzZVxuICAgICAgfSkpO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gQnVmZmVyTGlzdDtcbn0oKTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIHVuZG9jdW1lbnRlZCBjYigpIEFQSSwgbmVlZGVkIGZvciBjb3JlLCBub3QgZm9yIHB1YmxpYyBBUElcbmZ1bmN0aW9uIGRlc3Ryb3koZXJyLCBjYikge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB2YXIgcmVhZGFibGVEZXN0cm95ZWQgPSB0aGlzLl9yZWFkYWJsZVN0YXRlICYmIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkO1xuICB2YXIgd3JpdGFibGVEZXN0cm95ZWQgPSB0aGlzLl93cml0YWJsZVN0YXRlICYmIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkO1xuICBpZiAocmVhZGFibGVEZXN0cm95ZWQgfHwgd3JpdGFibGVEZXN0cm95ZWQpIHtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGNiKGVycik7XG4gICAgfSBlbHNlIGlmIChlcnIpIHtcbiAgICAgIGlmICghdGhpcy5fd3JpdGFibGVTdGF0ZSkge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXRFcnJvck5ULCB0aGlzLCBlcnIpO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQpIHtcbiAgICAgICAgdGhpcy5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQgPSB0cnVlO1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXRFcnJvck5ULCB0aGlzLCBlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHdlIHNldCBkZXN0cm95ZWQgdG8gdHJ1ZSBiZWZvcmUgZmlyaW5nIGVycm9yIGNhbGxiYWNrcyBpbiBvcmRlclxuICAvLyB0byBtYWtlIGl0IHJlLWVudHJhbmNlIHNhZmUgaW4gY2FzZSBkZXN0cm95KCkgaXMgY2FsbGVkIHdpdGhpbiBjYWxsYmFja3NcblxuICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSkge1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIGlmIHRoaXMgaXMgYSBkdXBsZXggc3RyZWFtIG1hcmsgdGhlIHdyaXRhYmxlIHBhcnQgYXMgZGVzdHJveWVkIGFzIHdlbGxcbiAgaWYgKHRoaXMuX3dyaXRhYmxlU3RhdGUpIHtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZCA9IHRydWU7XG4gIH1cbiAgdGhpcy5fZGVzdHJveShlcnIgfHwgbnVsbCwgZnVuY3Rpb24gKGVycikge1xuICAgIGlmICghY2IgJiYgZXJyKSB7XG4gICAgICBpZiAoIV90aGlzLl93cml0YWJsZVN0YXRlKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZW1pdEVycm9yQW5kQ2xvc2VOVCwgX3RoaXMsIGVycik7XG4gICAgICB9IGVsc2UgaWYgKCFfdGhpcy5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQpIHtcbiAgICAgICAgX3RoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhlbWl0RXJyb3JBbmRDbG9zZU5ULCBfdGhpcywgZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZW1pdENsb3NlTlQsIF90aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNiKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXRDbG9zZU5ULCBfdGhpcyk7XG4gICAgICBjYihlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXRDbG9zZU5ULCBfdGhpcyk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBlbWl0RXJyb3JBbmRDbG9zZU5UKHNlbGYsIGVycikge1xuICBlbWl0RXJyb3JOVChzZWxmLCBlcnIpO1xuICBlbWl0Q2xvc2VOVChzZWxmKTtcbn1cbmZ1bmN0aW9uIGVtaXRDbG9zZU5UKHNlbGYpIHtcbiAgaWYgKHNlbGYuX3dyaXRhYmxlU3RhdGUgJiYgIXNlbGYuX3dyaXRhYmxlU3RhdGUuZW1pdENsb3NlKSByZXR1cm47XG4gIGlmIChzZWxmLl9yZWFkYWJsZVN0YXRlICYmICFzZWxmLl9yZWFkYWJsZVN0YXRlLmVtaXRDbG9zZSkgcmV0dXJuO1xuICBzZWxmLmVtaXQoJ2Nsb3NlJyk7XG59XG5mdW5jdGlvbiB1bmRlc3Ryb3koKSB7XG4gIGlmICh0aGlzLl9yZWFkYWJsZVN0YXRlKSB7XG4gICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLmVuZGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmRFbWl0dGVkID0gZmFsc2U7XG4gIH1cbiAgaWYgKHRoaXMuX3dyaXRhYmxlU3RhdGUpIHtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQgPSBmYWxzZTtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmVuZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZmluYWxDYWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLnByZWZpbmlzaGVkID0gZmFsc2U7XG4gICAgdGhpcy5fd3JpdGFibGVTdGF0ZS5maW5pc2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkID0gZmFsc2U7XG4gIH1cbn1cbmZ1bmN0aW9uIGVtaXRFcnJvck5UKHNlbGYsIGVycikge1xuICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbn1cbmZ1bmN0aW9uIGVycm9yT3JEZXN0cm95KHN0cmVhbSwgZXJyKSB7XG4gIC8vIFdlIGhhdmUgdGVzdHMgdGhhdCByZWx5IG9uIGVycm9ycyBiZWluZyBlbWl0dGVkXG4gIC8vIGluIHRoZSBzYW1lIHRpY2ssIHNvIGNoYW5naW5nIHRoaXMgaXMgc2VtdmVyIG1ham9yLlxuICAvLyBGb3Igbm93IHdoZW4geW91IG9wdC1pbiB0byBhdXRvRGVzdHJveSB3ZSBhbGxvd1xuICAvLyB0aGUgZXJyb3IgdG8gYmUgZW1pdHRlZCBuZXh0VGljay4gSW4gYSBmdXR1cmVcbiAgLy8gc2VtdmVyIG1ham9yIHVwZGF0ZSB3ZSBzaG91bGQgY2hhbmdlIHRoZSBkZWZhdWx0IHRvIHRoaXMuXG5cbiAgdmFyIHJTdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgdmFyIHdTdGF0ZSA9IHN0cmVhbS5fd3JpdGFibGVTdGF0ZTtcbiAgaWYgKHJTdGF0ZSAmJiByU3RhdGUuYXV0b0Rlc3Ryb3kgfHwgd1N0YXRlICYmIHdTdGF0ZS5hdXRvRGVzdHJveSkgc3RyZWFtLmRlc3Ryb3koZXJyKTtlbHNlIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVzdHJveTogZGVzdHJveSxcbiAgdW5kZXN0cm95OiB1bmRlc3Ryb3ksXG4gIGVycm9yT3JEZXN0cm95OiBlcnJvck9yRGVzdHJveVxufTsiLCIvLyBQb3J0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWFmaW50b3NoL2VuZC1vZi1zdHJlYW0gd2l0aFxuLy8gcGVybWlzc2lvbiBmcm9tIHRoZSBhdXRob3IsIE1hdGhpYXMgQnV1cyAoQG1hZmludG9zaCkuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEVSUl9TVFJFQU1fUFJFTUFUVVJFX0NMT1NFID0gcmVxdWlyZSgnLi4vLi4vLi4vZXJyb3JzJykuY29kZXMuRVJSX1NUUkVBTV9QUkVNQVRVUkVfQ0xPU0U7XG5mdW5jdGlvbiBvbmNlKGNhbGxiYWNrKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FsbGVkKSByZXR1cm47XG4gICAgY2FsbGVkID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xufVxuZnVuY3Rpb24gbm9vcCgpIHt9XG5mdW5jdGlvbiBpc1JlcXVlc3Qoc3RyZWFtKSB7XG4gIHJldHVybiBzdHJlYW0uc2V0SGVhZGVyICYmIHR5cGVvZiBzdHJlYW0uYWJvcnQgPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBlb3Moc3RyZWFtLCBvcHRzLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHJldHVybiBlb3Moc3RyZWFtLCBudWxsLCBvcHRzKTtcbiAgaWYgKCFvcHRzKSBvcHRzID0ge307XG4gIGNhbGxiYWNrID0gb25jZShjYWxsYmFjayB8fCBub29wKTtcbiAgdmFyIHJlYWRhYmxlID0gb3B0cy5yZWFkYWJsZSB8fCBvcHRzLnJlYWRhYmxlICE9PSBmYWxzZSAmJiBzdHJlYW0ucmVhZGFibGU7XG4gIHZhciB3cml0YWJsZSA9IG9wdHMud3JpdGFibGUgfHwgb3B0cy53cml0YWJsZSAhPT0gZmFsc2UgJiYgc3RyZWFtLndyaXRhYmxlO1xuICB2YXIgb25sZWdhY3lmaW5pc2ggPSBmdW5jdGlvbiBvbmxlZ2FjeWZpbmlzaCgpIHtcbiAgICBpZiAoIXN0cmVhbS53cml0YWJsZSkgb25maW5pc2goKTtcbiAgfTtcbiAgdmFyIHdyaXRhYmxlRW5kZWQgPSBzdHJlYW0uX3dyaXRhYmxlU3RhdGUgJiYgc3RyZWFtLl93cml0YWJsZVN0YXRlLmZpbmlzaGVkO1xuICB2YXIgb25maW5pc2ggPSBmdW5jdGlvbiBvbmZpbmlzaCgpIHtcbiAgICB3cml0YWJsZSA9IGZhbHNlO1xuICAgIHdyaXRhYmxlRW5kZWQgPSB0cnVlO1xuICAgIGlmICghcmVhZGFibGUpIGNhbGxiYWNrLmNhbGwoc3RyZWFtKTtcbiAgfTtcbiAgdmFyIHJlYWRhYmxlRW5kZWQgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGUgJiYgc3RyZWFtLl9yZWFkYWJsZVN0YXRlLmVuZEVtaXR0ZWQ7XG4gIHZhciBvbmVuZCA9IGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIHJlYWRhYmxlID0gZmFsc2U7XG4gICAgcmVhZGFibGVFbmRlZCA9IHRydWU7XG4gICAgaWYgKCF3cml0YWJsZSkgY2FsbGJhY2suY2FsbChzdHJlYW0pO1xuICB9O1xuICB2YXIgb25lcnJvciA9IGZ1bmN0aW9uIG9uZXJyb3IoZXJyKSB7XG4gICAgY2FsbGJhY2suY2FsbChzdHJlYW0sIGVycik7XG4gIH07XG4gIHZhciBvbmNsb3NlID0gZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICB2YXIgZXJyO1xuICAgIGlmIChyZWFkYWJsZSAmJiAhcmVhZGFibGVFbmRlZCkge1xuICAgICAgaWYgKCFzdHJlYW0uX3JlYWRhYmxlU3RhdGUgfHwgIXN0cmVhbS5fcmVhZGFibGVTdGF0ZS5lbmRlZCkgZXJyID0gbmV3IEVSUl9TVFJFQU1fUFJFTUFUVVJFX0NMT1NFKCk7XG4gICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChzdHJlYW0sIGVycik7XG4gICAgfVxuICAgIGlmICh3cml0YWJsZSAmJiAhd3JpdGFibGVFbmRlZCkge1xuICAgICAgaWYgKCFzdHJlYW0uX3dyaXRhYmxlU3RhdGUgfHwgIXN0cmVhbS5fd3JpdGFibGVTdGF0ZS5lbmRlZCkgZXJyID0gbmV3IEVSUl9TVFJFQU1fUFJFTUFUVVJFX0NMT1NFKCk7XG4gICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChzdHJlYW0sIGVycik7XG4gICAgfVxuICB9O1xuICB2YXIgb25yZXF1ZXN0ID0gZnVuY3Rpb24gb25yZXF1ZXN0KCkge1xuICAgIHN0cmVhbS5yZXEub24oJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgfTtcbiAgaWYgKGlzUmVxdWVzdChzdHJlYW0pKSB7XG4gICAgc3RyZWFtLm9uKCdjb21wbGV0ZScsIG9uZmluaXNoKTtcbiAgICBzdHJlYW0ub24oJ2Fib3J0Jywgb25jbG9zZSk7XG4gICAgaWYgKHN0cmVhbS5yZXEpIG9ucmVxdWVzdCgpO2Vsc2Ugc3RyZWFtLm9uKCdyZXF1ZXN0Jywgb25yZXF1ZXN0KTtcbiAgfSBlbHNlIGlmICh3cml0YWJsZSAmJiAhc3RyZWFtLl93cml0YWJsZVN0YXRlKSB7XG4gICAgLy8gbGVnYWN5IHN0cmVhbXNcbiAgICBzdHJlYW0ub24oJ2VuZCcsIG9ubGVnYWN5ZmluaXNoKTtcbiAgICBzdHJlYW0ub24oJ2Nsb3NlJywgb25sZWdhY3lmaW5pc2gpO1xuICB9XG4gIHN0cmVhbS5vbignZW5kJywgb25lbmQpO1xuICBzdHJlYW0ub24oJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgaWYgKG9wdHMuZXJyb3IgIT09IGZhbHNlKSBzdHJlYW0ub24oJ2Vycm9yJywgb25lcnJvcik7XG4gIHN0cmVhbS5vbignY2xvc2UnLCBvbmNsb3NlKTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2NvbXBsZXRlJywgb25maW5pc2gpO1xuICAgIHN0cmVhbS5yZW1vdmVMaXN0ZW5lcignYWJvcnQnLCBvbmNsb3NlKTtcbiAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ3JlcXVlc3QnLCBvbnJlcXVlc3QpO1xuICAgIGlmIChzdHJlYW0ucmVxKSBzdHJlYW0ucmVxLnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBvbmxlZ2FjeWZpbmlzaCk7XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9ubGVnYWN5ZmluaXNoKTtcbiAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uZW5kKTtcbiAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBlb3M7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHRocm93IG5ldyBFcnJvcignUmVhZGFibGUuZnJvbSBpcyBub3QgYXZhaWxhYmxlIGluIHRoZSBicm93c2VyJylcbn07XG4iLCIvLyBQb3J0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWFmaW50b3NoL3B1bXAgd2l0aFxuLy8gcGVybWlzc2lvbiBmcm9tIHRoZSBhdXRob3IsIE1hdGhpYXMgQnV1cyAoQG1hZmludG9zaCkuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVvcztcbmZ1bmN0aW9uIG9uY2UoY2FsbGJhY2spIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjYWxsZWQpIHJldHVybjtcbiAgICBjYWxsZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cbnZhciBfcmVxdWlyZSRjb2RlcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2Vycm9ycycpLmNvZGVzLFxuICBFUlJfTUlTU0lOR19BUkdTID0gX3JlcXVpcmUkY29kZXMuRVJSX01JU1NJTkdfQVJHUyxcbiAgRVJSX1NUUkVBTV9ERVNUUk9ZRUQgPSBfcmVxdWlyZSRjb2Rlcy5FUlJfU1RSRUFNX0RFU1RST1lFRDtcbmZ1bmN0aW9uIG5vb3AoZXJyKSB7XG4gIC8vIFJldGhyb3cgdGhlIGVycm9yIGlmIGl0IGV4aXN0cyB0byBhdm9pZCBzd2FsbG93aW5nIGl0XG4gIGlmIChlcnIpIHRocm93IGVycjtcbn1cbmZ1bmN0aW9uIGlzUmVxdWVzdChzdHJlYW0pIHtcbiAgcmV0dXJuIHN0cmVhbS5zZXRIZWFkZXIgJiYgdHlwZW9mIHN0cmVhbS5hYm9ydCA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGRlc3Ryb3llcihzdHJlYW0sIHJlYWRpbmcsIHdyaXRpbmcsIGNhbGxiYWNrKSB7XG4gIGNhbGxiYWNrID0gb25jZShjYWxsYmFjayk7XG4gIHZhciBjbG9zZWQgPSBmYWxzZTtcbiAgc3RyZWFtLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICBjbG9zZWQgPSB0cnVlO1xuICB9KTtcbiAgaWYgKGVvcyA9PT0gdW5kZWZpbmVkKSBlb3MgPSByZXF1aXJlKCcuL2VuZC1vZi1zdHJlYW0nKTtcbiAgZW9zKHN0cmVhbSwge1xuICAgIHJlYWRhYmxlOiByZWFkaW5nLFxuICAgIHdyaXRhYmxlOiB3cml0aW5nXG4gIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICBjbG9zZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0pO1xuICB2YXIgZGVzdHJveWVkID0gZmFsc2U7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGNsb3NlZCkgcmV0dXJuO1xuICAgIGlmIChkZXN0cm95ZWQpIHJldHVybjtcbiAgICBkZXN0cm95ZWQgPSB0cnVlO1xuXG4gICAgLy8gcmVxdWVzdC5kZXN0cm95IGp1c3QgZG8gLmVuZCAtIC5hYm9ydCBpcyB3aGF0IHdlIHdhbnRcbiAgICBpZiAoaXNSZXF1ZXN0KHN0cmVhbSkpIHJldHVybiBzdHJlYW0uYWJvcnQoKTtcbiAgICBpZiAodHlwZW9mIHN0cmVhbS5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSByZXR1cm4gc3RyZWFtLmRlc3Ryb3koKTtcbiAgICBjYWxsYmFjayhlcnIgfHwgbmV3IEVSUl9TVFJFQU1fREVTVFJPWUVEKCdwaXBlJykpO1xuICB9O1xufVxuZnVuY3Rpb24gY2FsbChmbikge1xuICBmbigpO1xufVxuZnVuY3Rpb24gcGlwZShmcm9tLCB0bykge1xuICByZXR1cm4gZnJvbS5waXBlKHRvKTtcbn1cbmZ1bmN0aW9uIHBvcENhbGxiYWNrKHN0cmVhbXMpIHtcbiAgaWYgKCFzdHJlYW1zLmxlbmd0aCkgcmV0dXJuIG5vb3A7XG4gIGlmICh0eXBlb2Ygc3RyZWFtc1tzdHJlYW1zLmxlbmd0aCAtIDFdICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gbm9vcDtcbiAgcmV0dXJuIHN0cmVhbXMucG9wKCk7XG59XG5mdW5jdGlvbiBwaXBlbGluZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHN0cmVhbXMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgc3RyZWFtc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuICB2YXIgY2FsbGJhY2sgPSBwb3BDYWxsYmFjayhzdHJlYW1zKTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RyZWFtc1swXSkpIHN0cmVhbXMgPSBzdHJlYW1zWzBdO1xuICBpZiAoc3RyZWFtcy5sZW5ndGggPCAyKSB7XG4gICAgdGhyb3cgbmV3IEVSUl9NSVNTSU5HX0FSR1MoJ3N0cmVhbXMnKTtcbiAgfVxuICB2YXIgZXJyb3I7XG4gIHZhciBkZXN0cm95cyA9IHN0cmVhbXMubWFwKGZ1bmN0aW9uIChzdHJlYW0sIGkpIHtcbiAgICB2YXIgcmVhZGluZyA9IGkgPCBzdHJlYW1zLmxlbmd0aCAtIDE7XG4gICAgdmFyIHdyaXRpbmcgPSBpID4gMDtcbiAgICByZXR1cm4gZGVzdHJveWVyKHN0cmVhbSwgcmVhZGluZywgd3JpdGluZywgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gICAgICBpZiAoZXJyKSBkZXN0cm95cy5mb3JFYWNoKGNhbGwpO1xuICAgICAgaWYgKHJlYWRpbmcpIHJldHVybjtcbiAgICAgIGRlc3Ryb3lzLmZvckVhY2goY2FsbCk7XG4gICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gc3RyZWFtcy5yZWR1Y2UocGlwZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHBpcGVsaW5lOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIEVSUl9JTlZBTElEX09QVF9WQUxVRSA9IHJlcXVpcmUoJy4uLy4uLy4uL2Vycm9ycycpLmNvZGVzLkVSUl9JTlZBTElEX09QVF9WQUxVRTtcbmZ1bmN0aW9uIGhpZ2hXYXRlck1hcmtGcm9tKG9wdGlvbnMsIGlzRHVwbGV4LCBkdXBsZXhLZXkpIHtcbiAgcmV0dXJuIG9wdGlvbnMuaGlnaFdhdGVyTWFyayAhPSBudWxsID8gb3B0aW9ucy5oaWdoV2F0ZXJNYXJrIDogaXNEdXBsZXggPyBvcHRpb25zW2R1cGxleEtleV0gOiBudWxsO1xufVxuZnVuY3Rpb24gZ2V0SGlnaFdhdGVyTWFyayhzdGF0ZSwgb3B0aW9ucywgZHVwbGV4S2V5LCBpc0R1cGxleCkge1xuICB2YXIgaHdtID0gaGlnaFdhdGVyTWFya0Zyb20ob3B0aW9ucywgaXNEdXBsZXgsIGR1cGxleEtleSk7XG4gIGlmIChod20gIT0gbnVsbCkge1xuICAgIGlmICghKGlzRmluaXRlKGh3bSkgJiYgTWF0aC5mbG9vcihod20pID09PSBod20pIHx8IGh3bSA8IDApIHtcbiAgICAgIHZhciBuYW1lID0gaXNEdXBsZXggPyBkdXBsZXhLZXkgOiAnaGlnaFdhdGVyTWFyayc7XG4gICAgICB0aHJvdyBuZXcgRVJSX0lOVkFMSURfT1BUX1ZBTFVFKG5hbWUsIGh3bSk7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKGh3bSk7XG4gIH1cblxuICAvLyBEZWZhdWx0IHZhbHVlXG4gIHJldHVybiBzdGF0ZS5vYmplY3RNb2RlID8gMTYgOiAxNiAqIDEwMjQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0SGlnaFdhdGVyTWFyazogZ2V0SGlnaFdhdGVyTWFya1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbiIsIi8qISBzYWZlLWJ1ZmZlci4gTUlUIExpY2Vuc2UuIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZy9vcGVuc291cmNlPiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby1kZXByZWNhdGVkLWFwaSAqL1xudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpXG52YXIgQnVmZmVyID0gYnVmZmVyLkJ1ZmZlclxuXG4vLyBhbHRlcm5hdGl2ZSB0byB1c2luZyBPYmplY3Qua2V5cyBmb3Igb2xkIGJyb3dzZXJzXG5mdW5jdGlvbiBjb3B5UHJvcHMgKHNyYywgZHN0KSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICBkc3Rba2V5XSA9IHNyY1trZXldXG4gIH1cbn1cbmlmIChCdWZmZXIuZnJvbSAmJiBCdWZmZXIuYWxsb2MgJiYgQnVmZmVyLmFsbG9jVW5zYWZlICYmIEJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBidWZmZXJcbn0gZWxzZSB7XG4gIC8vIENvcHkgcHJvcGVydGllcyBmcm9tIHJlcXVpcmUoJ2J1ZmZlcicpXG4gIGNvcHlQcm9wcyhidWZmZXIsIGV4cG9ydHMpXG4gIGV4cG9ydHMuQnVmZmVyID0gU2FmZUJ1ZmZlclxufVxuXG5mdW5jdGlvbiBTYWZlQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5TYWZlQnVmZmVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQnVmZmVyLnByb3RvdHlwZSlcblxuLy8gQ29weSBzdGF0aWMgbWV0aG9kcyBmcm9tIEJ1ZmZlclxuY29weVByb3BzKEJ1ZmZlciwgU2FmZUJ1ZmZlcilcblxuU2FmZUJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuICByZXR1cm4gQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5TYWZlQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuICB2YXIgYnVmID0gQnVmZmVyKHNpemUpXG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgYnVmLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5maWxsKGZpbGwpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGJ1Zi5maWxsKDApXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG5TYWZlQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHJldHVybiBCdWZmZXIoc2l6ZSlcbn1cblxuU2FmZUJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlci5TbG93QnVmZmVyKHNpemUpXG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW07XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmluaGVyaXRzKFN0cmVhbSwgRUUpO1xuU3RyZWFtLlJlYWRhYmxlID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzJyk7XG5TdHJlYW0uV3JpdGFibGUgPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fd3JpdGFibGUuanMnKTtcblN0cmVhbS5EdXBsZXggPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fZHVwbGV4LmpzJyk7XG5TdHJlYW0uVHJhbnNmb3JtID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcycpO1xuU3RyZWFtLlBhc3NUaHJvdWdoID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzJyk7XG5TdHJlYW0uZmluaXNoZWQgPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvZW5kLW9mLXN0cmVhbS5qcycpXG5TdHJlYW0ucGlwZWxpbmUgPSByZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvcGlwZWxpbmUuanMnKVxuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjQueFxuU3RyZWFtLlN0cmVhbSA9IFN0cmVhbTtcblxuXG5cbi8vIG9sZC1zdHlsZSBzdHJlYW1zLiAgTm90ZSB0aGF0IHRoZSBwaXBlIG1ldGhvZCAodGhlIG9ubHkgcmVsZXZhbnRcbi8vIHBhcnQgb2YgdGhpcyBjbGFzcykgaXMgb3ZlcnJpZGRlbiBpbiB0aGUgUmVhZGFibGUgY2xhc3MuXG5cbmZ1bmN0aW9uIFN0cmVhbSgpIHtcbiAgRUUuY2FsbCh0aGlzKTtcbn1cblxuU3RyZWFtLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oZGVzdCwgb3B0aW9ucykge1xuICB2YXIgc291cmNlID0gdGhpcztcblxuICBmdW5jdGlvbiBvbmRhdGEoY2h1bmspIHtcbiAgICBpZiAoZGVzdC53cml0YWJsZSkge1xuICAgICAgaWYgKGZhbHNlID09PSBkZXN0LndyaXRlKGNodW5rKSAmJiBzb3VyY2UucGF1c2UpIHtcbiAgICAgICAgc291cmNlLnBhdXNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc291cmNlLm9uKCdkYXRhJywgb25kYXRhKTtcblxuICBmdW5jdGlvbiBvbmRyYWluKCkge1xuICAgIGlmIChzb3VyY2UucmVhZGFibGUgJiYgc291cmNlLnJlc3VtZSkge1xuICAgICAgc291cmNlLnJlc3VtZSgpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Qub24oJ2RyYWluJywgb25kcmFpbik7XG5cbiAgLy8gSWYgdGhlICdlbmQnIG9wdGlvbiBpcyBub3Qgc3VwcGxpZWQsIGRlc3QuZW5kKCkgd2lsbCBiZSBjYWxsZWQgd2hlblxuICAvLyBzb3VyY2UgZ2V0cyB0aGUgJ2VuZCcgb3IgJ2Nsb3NlJyBldmVudHMuICBPbmx5IGRlc3QuZW5kKCkgb25jZS5cbiAgaWYgKCFkZXN0Ll9pc1N0ZGlvICYmICghb3B0aW9ucyB8fCBvcHRpb25zLmVuZCAhPT0gZmFsc2UpKSB7XG4gICAgc291cmNlLm9uKCdlbmQnLCBvbmVuZCk7XG4gICAgc291cmNlLm9uKCdjbG9zZScsIG9uY2xvc2UpO1xuICB9XG5cbiAgdmFyIGRpZE9uRW5kID0gZmFsc2U7XG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGlmIChkaWRPbkVuZCkgcmV0dXJuO1xuICAgIGRpZE9uRW5kID0gdHJ1ZTtcblxuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG9uY2xvc2UoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBkZXN0LmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIGRlc3QuZGVzdHJveSgpO1xuICB9XG5cbiAgLy8gZG9uJ3QgbGVhdmUgZGFuZ2xpbmcgcGlwZXMgd2hlbiB0aGVyZSBhcmUgZXJyb3JzLlxuICBmdW5jdGlvbiBvbmVycm9yKGVyKSB7XG4gICAgY2xlYW51cCgpO1xuICAgIGlmIChFRS5saXN0ZW5lckNvdW50KHRoaXMsICdlcnJvcicpID09PSAwKSB7XG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkIHN0cmVhbSBlcnJvciBpbiBwaXBlLlxuICAgIH1cbiAgfVxuXG4gIHNvdXJjZS5vbignZXJyb3InLCBvbmVycm9yKTtcbiAgZGVzdC5vbignZXJyb3InLCBvbmVycm9yKTtcblxuICAvLyByZW1vdmUgYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgdGhhdCB3ZXJlIGFkZGVkLlxuICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZGF0YScsIG9uZGF0YSk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZHJhaW4nLCBvbmRyYWluKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpO1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmNsb3NlKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBjbGVhbnVwKTtcbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsZWFudXApO1xuICB9XG5cbiAgc291cmNlLm9uKCdlbmQnLCBjbGVhbnVwKTtcbiAgc291cmNlLm9uKCdjbG9zZScsIGNsZWFudXApO1xuXG4gIGRlc3Qub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5lbWl0KCdwaXBlJywgc291cmNlKTtcblxuICAvLyBBbGxvdyBmb3IgdW5peC1saWtlIHVzYWdlOiBBLnBpcGUoQikucGlwZShDKVxuICByZXR1cm4gZGVzdDtcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXI7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudmFyIGlzRW5jb2RpbmcgPSBCdWZmZXIuaXNFbmNvZGluZyB8fCBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgZW5jb2RpbmcgPSAnJyArIGVuY29kaW5nO1xuICBzd2l0Y2ggKGVuY29kaW5nICYmIGVuY29kaW5nLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOmNhc2UgJ3V0ZjgnOmNhc2UgJ3V0Zi04JzpjYXNlICdhc2NpaSc6Y2FzZSAnYmluYXJ5JzpjYXNlICdiYXNlNjQnOmNhc2UgJ3VjczInOmNhc2UgJ3Vjcy0yJzpjYXNlICd1dGYxNmxlJzpjYXNlICd1dGYtMTZsZSc6Y2FzZSAncmF3JzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9ub3JtYWxpemVFbmNvZGluZyhlbmMpIHtcbiAgaWYgKCFlbmMpIHJldHVybiAndXRmOCc7XG4gIHZhciByZXRyaWVkO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jKSB7XG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuICd1dGY4JztcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiAndXRmMTZsZSc7XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuICdsYXRpbjEnO1xuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBlbmM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAocmV0cmllZCkgcmV0dXJuOyAvLyB1bmRlZmluZWRcbiAgICAgICAgZW5jID0gKCcnICsgZW5jKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICByZXRyaWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIERvIG5vdCBjYWNoZSBgQnVmZmVyLmlzRW5jb2RpbmdgIHdoZW4gY2hlY2tpbmcgZW5jb2RpbmcgbmFtZXMgYXMgc29tZVxuLy8gbW9kdWxlcyBtb25rZXktcGF0Y2ggaXQgdG8gc3VwcG9ydCBhZGRpdGlvbmFsIGVuY29kaW5nc1xuZnVuY3Rpb24gbm9ybWFsaXplRW5jb2RpbmcoZW5jKSB7XG4gIHZhciBuZW5jID0gX25vcm1hbGl6ZUVuY29kaW5nKGVuYyk7XG4gIGlmICh0eXBlb2YgbmVuYyAhPT0gJ3N0cmluZycgJiYgKEJ1ZmZlci5pc0VuY29kaW5nID09PSBpc0VuY29kaW5nIHx8ICFpc0VuY29kaW5nKGVuYykpKSB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmMpO1xuICByZXR1cm4gbmVuYyB8fCBlbmM7XG59XG5cbi8vIFN0cmluZ0RlY29kZXIgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBlZmZpY2llbnRseSBzcGxpdHRpbmcgYSBzZXJpZXMgb2Zcbi8vIGJ1ZmZlcnMgaW50byBhIHNlcmllcyBvZiBKUyBzdHJpbmdzIHdpdGhvdXQgYnJlYWtpbmcgYXBhcnQgbXVsdGktYnl0ZVxuLy8gY2hhcmFjdGVycy5cbmV4cG9ydHMuU3RyaW5nRGVjb2RlciA9IFN0cmluZ0RlY29kZXI7XG5mdW5jdGlvbiBTdHJpbmdEZWNvZGVyKGVuY29kaW5nKSB7XG4gIHRoaXMuZW5jb2RpbmcgPSBub3JtYWxpemVFbmNvZGluZyhlbmNvZGluZyk7XG4gIHZhciBuYjtcbiAgc3dpdGNoICh0aGlzLmVuY29kaW5nKSB7XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICB0aGlzLnRleHQgPSB1dGYxNlRleHQ7XG4gICAgICB0aGlzLmVuZCA9IHV0ZjE2RW5kO1xuICAgICAgbmIgPSA0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndXRmOCc6XG4gICAgICB0aGlzLmZpbGxMYXN0ID0gdXRmOEZpbGxMYXN0O1xuICAgICAgbmIgPSA0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHRoaXMudGV4dCA9IGJhc2U2NFRleHQ7XG4gICAgICB0aGlzLmVuZCA9IGJhc2U2NEVuZDtcbiAgICAgIG5iID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gc2ltcGxlV3JpdGU7XG4gICAgICB0aGlzLmVuZCA9IHNpbXBsZUVuZDtcbiAgICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmxhc3ROZWVkID0gMDtcbiAgdGhpcy5sYXN0VG90YWwgPSAwO1xuICB0aGlzLmxhc3RDaGFyID0gQnVmZmVyLmFsbG9jVW5zYWZlKG5iKTtcbn1cblxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoYnVmKSB7XG4gIGlmIChidWYubGVuZ3RoID09PSAwKSByZXR1cm4gJyc7XG4gIHZhciByO1xuICB2YXIgaTtcbiAgaWYgKHRoaXMubGFzdE5lZWQpIHtcbiAgICByID0gdGhpcy5maWxsTGFzdChidWYpO1xuICAgIGlmIChyID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcbiAgICBpID0gdGhpcy5sYXN0TmVlZDtcbiAgICB0aGlzLmxhc3ROZWVkID0gMDtcbiAgfSBlbHNlIHtcbiAgICBpID0gMDtcbiAgfVxuICBpZiAoaSA8IGJ1Zi5sZW5ndGgpIHJldHVybiByID8gciArIHRoaXMudGV4dChidWYsIGkpIDogdGhpcy50ZXh0KGJ1ZiwgaSk7XG4gIHJldHVybiByIHx8ICcnO1xufTtcblxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gdXRmOEVuZDtcblxuLy8gUmV0dXJucyBvbmx5IGNvbXBsZXRlIGNoYXJhY3RlcnMgaW4gYSBCdWZmZXJcblN0cmluZ0RlY29kZXIucHJvdG90eXBlLnRleHQgPSB1dGY4VGV4dDtcblxuLy8gQXR0ZW1wdHMgdG8gY29tcGxldGUgYSBwYXJ0aWFsIG5vbi1VVEYtOCBjaGFyYWN0ZXIgdXNpbmcgYnl0ZXMgZnJvbSBhIEJ1ZmZlclxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZmlsbExhc3QgPSBmdW5jdGlvbiAoYnVmKSB7XG4gIGlmICh0aGlzLmxhc3ROZWVkIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBidWYuY29weSh0aGlzLmxhc3RDaGFyLCB0aGlzLmxhc3RUb3RhbCAtIHRoaXMubGFzdE5lZWQsIDAsIHRoaXMubGFzdE5lZWQpO1xuICAgIHJldHVybiB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsIDAsIHRoaXMubGFzdFRvdGFsKTtcbiAgfVxuICBidWYuY29weSh0aGlzLmxhc3RDaGFyLCB0aGlzLmxhc3RUb3RhbCAtIHRoaXMubGFzdE5lZWQsIDAsIGJ1Zi5sZW5ndGgpO1xuICB0aGlzLmxhc3ROZWVkIC09IGJ1Zi5sZW5ndGg7XG59O1xuXG4vLyBDaGVja3MgdGhlIHR5cGUgb2YgYSBVVEYtOCBieXRlLCB3aGV0aGVyIGl0J3MgQVNDSUksIGEgbGVhZGluZyBieXRlLCBvciBhXG4vLyBjb250aW51YXRpb24gYnl0ZS4gSWYgYW4gaW52YWxpZCBieXRlIGlzIGRldGVjdGVkLCAtMiBpcyByZXR1cm5lZC5cbmZ1bmN0aW9uIHV0ZjhDaGVja0J5dGUoYnl0ZSkge1xuICBpZiAoYnl0ZSA8PSAweDdGKSByZXR1cm4gMDtlbHNlIGlmIChieXRlID4+IDUgPT09IDB4MDYpIHJldHVybiAyO2Vsc2UgaWYgKGJ5dGUgPj4gNCA9PT0gMHgwRSkgcmV0dXJuIDM7ZWxzZSBpZiAoYnl0ZSA+PiAzID09PSAweDFFKSByZXR1cm4gNDtcbiAgcmV0dXJuIGJ5dGUgPj4gNiA9PT0gMHgwMiA/IC0xIDogLTI7XG59XG5cbi8vIENoZWNrcyBhdCBtb3N0IDMgYnl0ZXMgYXQgdGhlIGVuZCBvZiBhIEJ1ZmZlciBpbiBvcmRlciB0byBkZXRlY3QgYW5cbi8vIGluY29tcGxldGUgbXVsdGktYnl0ZSBVVEYtOCBjaGFyYWN0ZXIuIFRoZSB0b3RhbCBudW1iZXIgb2YgYnl0ZXMgKDIsIDMsIG9yIDQpXG4vLyBuZWVkZWQgdG8gY29tcGxldGUgdGhlIFVURi04IGNoYXJhY3RlciAoaWYgYXBwbGljYWJsZSkgYXJlIHJldHVybmVkLlxuZnVuY3Rpb24gdXRmOENoZWNrSW5jb21wbGV0ZShzZWxmLCBidWYsIGkpIHtcbiAgdmFyIGogPSBidWYubGVuZ3RoIC0gMTtcbiAgaWYgKGogPCBpKSByZXR1cm4gMDtcbiAgdmFyIG5iID0gdXRmOENoZWNrQnl0ZShidWZbal0pO1xuICBpZiAobmIgPj0gMCkge1xuICAgIGlmIChuYiA+IDApIHNlbGYubGFzdE5lZWQgPSBuYiAtIDE7XG4gICAgcmV0dXJuIG5iO1xuICB9XG4gIGlmICgtLWogPCBpIHx8IG5iID09PSAtMikgcmV0dXJuIDA7XG4gIG5iID0gdXRmOENoZWNrQnl0ZShidWZbal0pO1xuICBpZiAobmIgPj0gMCkge1xuICAgIGlmIChuYiA+IDApIHNlbGYubGFzdE5lZWQgPSBuYiAtIDI7XG4gICAgcmV0dXJuIG5iO1xuICB9XG4gIGlmICgtLWogPCBpIHx8IG5iID09PSAtMikgcmV0dXJuIDA7XG4gIG5iID0gdXRmOENoZWNrQnl0ZShidWZbal0pO1xuICBpZiAobmIgPj0gMCkge1xuICAgIGlmIChuYiA+IDApIHtcbiAgICAgIGlmIChuYiA9PT0gMikgbmIgPSAwO2Vsc2Ugc2VsZi5sYXN0TmVlZCA9IG5iIC0gMztcbiAgICB9XG4gICAgcmV0dXJuIG5iO1xuICB9XG4gIHJldHVybiAwO1xufVxuXG4vLyBWYWxpZGF0ZXMgYXMgbWFueSBjb250aW51YXRpb24gYnl0ZXMgZm9yIGEgbXVsdGktYnl0ZSBVVEYtOCBjaGFyYWN0ZXIgYXNcbi8vIG5lZWRlZCBvciBhcmUgYXZhaWxhYmxlLiBJZiB3ZSBzZWUgYSBub24tY29udGludWF0aW9uIGJ5dGUgd2hlcmUgd2UgZXhwZWN0XG4vLyBvbmUsIHdlIFwicmVwbGFjZVwiIHRoZSB2YWxpZGF0ZWQgY29udGludWF0aW9uIGJ5dGVzIHdlJ3ZlIHNlZW4gc28gZmFyIHdpdGhcbi8vIGEgc2luZ2xlIFVURi04IHJlcGxhY2VtZW50IGNoYXJhY3RlciAoJ1xcdWZmZmQnKSwgdG8gbWF0Y2ggdjgncyBVVEYtOCBkZWNvZGluZ1xuLy8gYmVoYXZpb3IuIFRoZSBjb250aW51YXRpb24gYnl0ZSBjaGVjayBpcyBpbmNsdWRlZCB0aHJlZSB0aW1lcyBpbiB0aGUgY2FzZVxuLy8gd2hlcmUgYWxsIG9mIHRoZSBjb250aW51YXRpb24gYnl0ZXMgZm9yIGEgY2hhcmFjdGVyIGV4aXN0IGluIHRoZSBzYW1lIGJ1ZmZlci5cbi8vIEl0IGlzIGFsc28gZG9uZSB0aGlzIHdheSBhcyBhIHNsaWdodCBwZXJmb3JtYW5jZSBpbmNyZWFzZSBpbnN0ZWFkIG9mIHVzaW5nIGFcbi8vIGxvb3AuXG5mdW5jdGlvbiB1dGY4Q2hlY2tFeHRyYUJ5dGVzKHNlbGYsIGJ1ZiwgcCkge1xuICBpZiAoKGJ1ZlswXSAmIDB4QzApICE9PSAweDgwKSB7XG4gICAgc2VsZi5sYXN0TmVlZCA9IDA7XG4gICAgcmV0dXJuICdcXHVmZmZkJztcbiAgfVxuICBpZiAoc2VsZi5sYXN0TmVlZCA+IDEgJiYgYnVmLmxlbmd0aCA+IDEpIHtcbiAgICBpZiAoKGJ1ZlsxXSAmIDB4QzApICE9PSAweDgwKSB7XG4gICAgICBzZWxmLmxhc3ROZWVkID0gMTtcbiAgICAgIHJldHVybiAnXFx1ZmZmZCc7XG4gICAgfVxuICAgIGlmIChzZWxmLmxhc3ROZWVkID4gMiAmJiBidWYubGVuZ3RoID4gMikge1xuICAgICAgaWYgKChidWZbMl0gJiAweEMwKSAhPT0gMHg4MCkge1xuICAgICAgICBzZWxmLmxhc3ROZWVkID0gMjtcbiAgICAgICAgcmV0dXJuICdcXHVmZmZkJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gQXR0ZW1wdHMgdG8gY29tcGxldGUgYSBtdWx0aS1ieXRlIFVURi04IGNoYXJhY3RlciB1c2luZyBieXRlcyBmcm9tIGEgQnVmZmVyLlxuZnVuY3Rpb24gdXRmOEZpbGxMYXN0KGJ1Zikge1xuICB2YXIgcCA9IHRoaXMubGFzdFRvdGFsIC0gdGhpcy5sYXN0TmVlZDtcbiAgdmFyIHIgPSB1dGY4Q2hlY2tFeHRyYUJ5dGVzKHRoaXMsIGJ1ZiwgcCk7XG4gIGlmIChyICE9PSB1bmRlZmluZWQpIHJldHVybiByO1xuICBpZiAodGhpcy5sYXN0TmVlZCA8PSBidWYubGVuZ3RoKSB7XG4gICAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgcCwgMCwgdGhpcy5sYXN0TmVlZCk7XG4gICAgcmV0dXJuIHRoaXMubGFzdENoYXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywgMCwgdGhpcy5sYXN0VG90YWwpO1xuICB9XG4gIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIHAsIDAsIGJ1Zi5sZW5ndGgpO1xuICB0aGlzLmxhc3ROZWVkIC09IGJ1Zi5sZW5ndGg7XG59XG5cbi8vIFJldHVybnMgYWxsIGNvbXBsZXRlIFVURi04IGNoYXJhY3RlcnMgaW4gYSBCdWZmZXIuIElmIHRoZSBCdWZmZXIgZW5kZWQgb24gYVxuLy8gcGFydGlhbCBjaGFyYWN0ZXIsIHRoZSBjaGFyYWN0ZXIncyBieXRlcyBhcmUgYnVmZmVyZWQgdW50aWwgdGhlIHJlcXVpcmVkXG4vLyBudW1iZXIgb2YgYnl0ZXMgYXJlIGF2YWlsYWJsZS5cbmZ1bmN0aW9uIHV0ZjhUZXh0KGJ1ZiwgaSkge1xuICB2YXIgdG90YWwgPSB1dGY4Q2hlY2tJbmNvbXBsZXRlKHRoaXMsIGJ1ZiwgaSk7XG4gIGlmICghdGhpcy5sYXN0TmVlZCkgcmV0dXJuIGJ1Zi50b1N0cmluZygndXRmOCcsIGkpO1xuICB0aGlzLmxhc3RUb3RhbCA9IHRvdGFsO1xuICB2YXIgZW5kID0gYnVmLmxlbmd0aCAtICh0b3RhbCAtIHRoaXMubGFzdE5lZWQpO1xuICBidWYuY29weSh0aGlzLmxhc3RDaGFyLCAwLCBlbmQpO1xuICByZXR1cm4gYnVmLnRvU3RyaW5nKCd1dGY4JywgaSwgZW5kKTtcbn1cblxuLy8gRm9yIFVURi04LCBhIHJlcGxhY2VtZW50IGNoYXJhY3RlciBpcyBhZGRlZCB3aGVuIGVuZGluZyBvbiBhIHBhcnRpYWxcbi8vIGNoYXJhY3Rlci5cbmZ1bmN0aW9uIHV0ZjhFbmQoYnVmKSB7XG4gIHZhciByID0gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiAnJztcbiAgaWYgKHRoaXMubGFzdE5lZWQpIHJldHVybiByICsgJ1xcdWZmZmQnO1xuICByZXR1cm4gcjtcbn1cblxuLy8gVVRGLTE2TEUgdHlwaWNhbGx5IG5lZWRzIHR3byBieXRlcyBwZXIgY2hhcmFjdGVyLCBidXQgZXZlbiBpZiB3ZSBoYXZlIGFuIGV2ZW5cbi8vIG51bWJlciBvZiBieXRlcyBhdmFpbGFibGUsIHdlIG5lZWQgdG8gY2hlY2sgaWYgd2UgZW5kIG9uIGEgbGVhZGluZy9oaWdoXG4vLyBzdXJyb2dhdGUuIEluIHRoYXQgY2FzZSwgd2UgbmVlZCB0byB3YWl0IGZvciB0aGUgbmV4dCB0d28gYnl0ZXMgaW4gb3JkZXIgdG9cbi8vIGRlY29kZSB0aGUgbGFzdCBjaGFyYWN0ZXIgcHJvcGVybHkuXG5mdW5jdGlvbiB1dGYxNlRleHQoYnVmLCBpKSB7XG4gIGlmICgoYnVmLmxlbmd0aCAtIGkpICUgMiA9PT0gMCkge1xuICAgIHZhciByID0gYnVmLnRvU3RyaW5nKCd1dGYxNmxlJywgaSk7XG4gICAgaWYgKHIpIHtcbiAgICAgIHZhciBjID0gci5jaGFyQ29kZUF0KHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAoYyA+PSAweEQ4MDAgJiYgYyA8PSAweERCRkYpIHtcbiAgICAgICAgdGhpcy5sYXN0TmVlZCA9IDI7XG4gICAgICAgIHRoaXMubGFzdFRvdGFsID0gNDtcbiAgICAgICAgdGhpcy5sYXN0Q2hhclswXSA9IGJ1ZltidWYubGVuZ3RoIC0gMl07XG4gICAgICAgIHRoaXMubGFzdENoYXJbMV0gPSBidWZbYnVmLmxlbmd0aCAtIDFdO1xuICAgICAgICByZXR1cm4gci5zbGljZSgwLCAtMSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByO1xuICB9XG4gIHRoaXMubGFzdE5lZWQgPSAxO1xuICB0aGlzLmxhc3RUb3RhbCA9IDI7XG4gIHRoaXMubGFzdENoYXJbMF0gPSBidWZbYnVmLmxlbmd0aCAtIDFdO1xuICByZXR1cm4gYnVmLnRvU3RyaW5nKCd1dGYxNmxlJywgaSwgYnVmLmxlbmd0aCAtIDEpO1xufVxuXG4vLyBGb3IgVVRGLTE2TEUgd2UgZG8gbm90IGV4cGxpY2l0bHkgYXBwZW5kIHNwZWNpYWwgcmVwbGFjZW1lbnQgY2hhcmFjdGVycyBpZiB3ZVxuLy8gZW5kIG9uIGEgcGFydGlhbCBjaGFyYWN0ZXIsIHdlIHNpbXBseSBsZXQgdjggaGFuZGxlIHRoYXQuXG5mdW5jdGlvbiB1dGYxNkVuZChidWYpIHtcbiAgdmFyIHIgPSBidWYgJiYgYnVmLmxlbmd0aCA/IHRoaXMud3JpdGUoYnVmKSA6ICcnO1xuICBpZiAodGhpcy5sYXN0TmVlZCkge1xuICAgIHZhciBlbmQgPSB0aGlzLmxhc3RUb3RhbCAtIHRoaXMubGFzdE5lZWQ7XG4gICAgcmV0dXJuIHIgKyB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKCd1dGYxNmxlJywgMCwgZW5kKTtcbiAgfVxuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gYmFzZTY0VGV4dChidWYsIGkpIHtcbiAgdmFyIG4gPSAoYnVmLmxlbmd0aCAtIGkpICUgMztcbiAgaWYgKG4gPT09IDApIHJldHVybiBidWYudG9TdHJpbmcoJ2Jhc2U2NCcsIGkpO1xuICB0aGlzLmxhc3ROZWVkID0gMyAtIG47XG4gIHRoaXMubGFzdFRvdGFsID0gMztcbiAgaWYgKG4gPT09IDEpIHtcbiAgICB0aGlzLmxhc3RDaGFyWzBdID0gYnVmW2J1Zi5sZW5ndGggLSAxXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmxhc3RDaGFyWzBdID0gYnVmW2J1Zi5sZW5ndGggLSAyXTtcbiAgICB0aGlzLmxhc3RDaGFyWzFdID0gYnVmW2J1Zi5sZW5ndGggLSAxXTtcbiAgfVxuICByZXR1cm4gYnVmLnRvU3RyaW5nKCdiYXNlNjQnLCBpLCBidWYubGVuZ3RoIC0gbik7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NEVuZChidWYpIHtcbiAgdmFyIHIgPSBidWYgJiYgYnVmLmxlbmd0aCA/IHRoaXMud3JpdGUoYnVmKSA6ICcnO1xuICBpZiAodGhpcy5sYXN0TmVlZCkgcmV0dXJuIHIgKyB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKCdiYXNlNjQnLCAwLCAzIC0gdGhpcy5sYXN0TmVlZCk7XG4gIHJldHVybiByO1xufVxuXG4vLyBQYXNzIGJ5dGVzIG9uIHRocm91Z2ggZm9yIHNpbmdsZS1ieXRlIGVuY29kaW5ncyAoZS5nLiBhc2NpaSwgbGF0aW4xLCBoZXgpXG5mdW5jdGlvbiBzaW1wbGVXcml0ZShidWYpIHtcbiAgcmV0dXJuIGJ1Zi50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcbn1cblxuZnVuY3Rpb24gc2ltcGxlRW5kKGJ1Zikge1xuICByZXR1cm4gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiAnJztcbn0iLCJ2YXIgc2NvcGUgPSAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwpIHx8XG4gICAgICAgICAgICAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZikgfHxcbiAgICAgICAgICAgIHdpbmRvdztcbnZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHNjb3BlLCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHNjb3BlLCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZW91dC5jbG9zZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHNjb3BlLCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbi8vIE9uIHNvbWUgZXhvdGljIGVudmlyb25tZW50cywgaXQncyBub3QgY2xlYXIgd2hpY2ggb2JqZWN0IGBzZXRpbW1lZGlhdGVgIHdhc1xuLy8gYWJsZSB0byBpbnN0YWxsIG9udG8uICBTZWFyY2ggZWFjaCBwb3NzaWJpbGl0eSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGVcbi8vIGBzZXRpbW1lZGlhdGVgIGxpYnJhcnkuXG5leHBvcnRzLnNldEltbWVkaWF0ZSA9ICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmLnNldEltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLnNldEltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgJiYgdGhpcy5zZXRJbW1lZGlhdGUpO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9ICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5jbGVhckltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLmNsZWFySW1tZWRpYXRlKTtcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlcHJlY2F0ZTtcblxuLyoqXG4gKiBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuICogUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbiAqXG4gKiBJZiBgbG9jYWxTdG9yYWdlLm5vRGVwcmVjYXRpb24gPSB0cnVlYCBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbiAqXG4gKiBJZiBgbG9jYWxTdG9yYWdlLnRocm93RGVwcmVjYXRpb24gPSB0cnVlYCBpcyBzZXQsIHRoZW4gZGVwcmVjYXRlZCBmdW5jdGlvbnNcbiAqIHdpbGwgdGhyb3cgYW4gRXJyb3Igd2hlbiBpbnZva2VkLlxuICpcbiAqIElmIGBsb2NhbFN0b3JhZ2UudHJhY2VEZXByZWNhdGlvbiA9IHRydWVgIGlzIHNldCwgdGhlbiBkZXByZWNhdGVkIGZ1bmN0aW9uc1xuICogd2lsbCBpbnZva2UgYGNvbnNvbGUudHJhY2UoKWAgaW5zdGVhZCBvZiBgY29uc29sZS5lcnJvcigpYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiAtIHRoZSBmdW5jdGlvbiB0byBkZXByZWNhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgLSB0aGUgc3RyaW5nIHRvIHByaW50IHRvIHRoZSBjb25zb2xlIHdoZW4gYGZuYCBpcyBpbnZva2VkXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IGEgbmV3IFwiZGVwcmVjYXRlZFwiIHZlcnNpb24gb2YgYGZuYFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZXByZWNhdGUgKGZuLCBtc2cpIHtcbiAgaWYgKGNvbmZpZygnbm9EZXByZWNhdGlvbicpKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAoY29uZmlnKCd0aHJvd0RlcHJlY2F0aW9uJykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKGNvbmZpZygndHJhY2VEZXByZWNhdGlvbicpKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2Fybihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgYGxvY2FsU3RvcmFnZWAgZm9yIGJvb2xlYW4gdmFsdWVzIGZvciB0aGUgZ2l2ZW4gYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNvbmZpZyAobmFtZSkge1xuICAvLyBhY2Nlc3NpbmcgZ2xvYmFsLmxvY2FsU3RvcmFnZSBjYW4gdHJpZ2dlciBhIERPTUV4Y2VwdGlvbiBpbiBzYW5kYm94ZWQgaWZyYW1lc1xuICB0cnkge1xuICAgIGlmICghZ2xvYmFsLmxvY2FsU3RvcmFnZSkgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB2YWwgPSBnbG9iYWwubG9jYWxTdG9yYWdlW25hbWVdO1xuICBpZiAobnVsbCA9PSB2YWwpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIFN0cmluZyh2YWwpLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJztcbn1cbiIsIlxuY29uc3QgU1RBUiA9IGA7IFVuaW50ZW50aW9uYWxseSB1cHNpZGUtZG93biBzdGFyLlxuRzIxXG5HOTA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjcGF0aDlcbkcwIFg5Ny4yODg0NDEgWTI3MS44NjcxNTFcbkcxIFg3MC44MDQzNjggWTE5Mi4xNDQ2OSBGMzAwXG5HMSBYMTM5LjQ0Njc2IFkyNDEuMzI5Mzk2IEYzMDBcbkcxIFg1NC44NTk4NzMgWTI0MS4zMjkzOTYgRjMwMFxuRzEgWDEyNC4wNDI3NTk5OTk5OTk5OSBZMTkyLjE0NDY5IEYzMDBcbkcxIFg5Ny4yODg0NDEgWTI3MS44NjcxNTEgRjMwMFxuTTJcbmBcblxuY29uc3QgQ0lSQ0xFUyA9IGA7IENpcmNsZSBwYXR0ZXJuXG5HMjFcbkc5MDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNwYXRoMVxuRzAgWDM2LjU4MTc0NCBZMjc3LjY3MDU2NFxuRzEgWDM2LjE4MzIwNzI0NTY0MjIxNSBZMjc0LjM5NDI4OTcwNTA5OTUgRjMwMFxuRzEgWDM1LjAxMDg0MjIxMjQxOTIzNCBZMjcxLjMwOTEwNDk0MDk2MDQgRjMwMFxuRzEgWDMzLjEzMzAyNzM2NzkyNDUzNCBZMjY4LjU5NDk1MzgzNzk4MjY0IEYzMDBcbkcxIFgzMC42NTkyODY3MDY2OTIzNyBZMjY2LjQxMDEzOTkwMDYwMzQ0IEYzMDBcbkcxIFgyNy43MzM5MDE3MzczMzU4ODQgWTI2NC44ODIwOTI5MTc5OTM1MyBGMzAwXG5HMSBYMjQuNTI3NDk2MjI5NDYzNTE2IFkyNjQuMDk5OTM2NTkxNDkyNCBGMzAwXG5HMSBYMjIuOTE1NzM5MDAwMDAwMDAyIFkyNjQuMDA0NTU5IEYzMDBcbkcxIFgxOS42Mzk0NjQ2MzUxMDkxOTIgWTI2NC40MDMwOTUxNzg5ODQyNCBGMzAwXG5HMSBYMTYuNTU0Mjc5NjY1MDgxNDQgWTI2NS41NzU0NTk2NzAzOTI1IEYzMDBcbkcxIFgxMy44NDAxMjgyMzIzMjUxODcgWTI2Ny40NTMyNzQwMzgyMzI3IEYzMDBcbkcxIFgxMS42NTUzMTM4NjA1MTIwMDYgWTI2OS45MjcwMTQzMTU3NzE2NiBGMzAwXG5HMSBYMTAuMTI3MjY2MzY0MTUxMTc0IFkyNzIuODUyMzk5MDE2Nzc1MTcgRjMwMFxuRzEgWDkuMzQ1MTA5NDc0NTQ2NzQ4IFkyNzYuMDU4ODA0Mzg3Mjg2NTYgRjMwMFxuRzEgWDkuMjQ5NzMxNiBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYOS42NDgyNjg1MjIxNzUwNzUgWTI4MC45NDY4MzgyNzQ0ODY2NSBGMzAwXG5HMSBYMTAuODIwNjMzNzEzNDI3MzYyIFkyODQuMDMyMDIyOTc4NTc0OSBGMzAwXG5HMSBYMTIuNjk4NDQ4Njk2OTQ2MjY3IFkyODYuNzQ2MTczOTg1MzY3MiBGMzAwXG5HMSBYMTUuMTcyMTg5NDcwMDg4OTYgWTI4OC45MzA5ODc3OTYwMzY1IEYzMDBcbkcxIFgxOC4wOTc1NzQ1MTc3MTUwNSBZMjkwLjQ1OTAzNDYyODgwMjQgRjMwMFxuRzEgWDIxLjMwMzk4MDA2NTY1MDk5MyBZMjkxLjI0MTE5MDc5MTA2NTA0IEYzMDBcbkcxIFgyMi45MTU3Mzg5OTk5OTk5OSBZMjkxLjMzNjU2ODI5OTk5OTk1IEYzMDBcbkcxIFgyNi4xOTIwMTMyOTQ5MDA1MTIgWTI5MC45MzgwMzE1NDU2NDIyIEYzMDBcbkcxIFgyOS4yNzcxOTgwNTkwMzk2MjcgWTI4OS43NjU2NjY1MTI0MTkyIEYzMDBcbkcxIFgzMS45OTEzNDkxNjIwMTczOSBZMjg3Ljg4Nzg1MTY2NzkyNDU2IEYzMDBcbkcxIFgzNC4xNzYxNjMwOTkzOTY2MyBZMjg1LjQxNDExMTAwNjY5MjQgRjMwMFxuRzEgWDM1LjcwNDIxMDA4MjAwNjUyIFkyODIuNDg4NzI2MDM3MzM1OTQgRjMwMFxuRzEgWDM2LjQ4NjM2NjQwODUwNzY3IFkyNzkuMjgyMzIwNTI5NDYzNTYgRjMwMFxuRzEgWDM2LjU4MTc0NCBZMjc3LjY3MDU2NCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTFcbkcwIFg2MC4xOTI5MjIgWTI3Ny42NzA1NjRcbkcxIFg1OS43OTQzODUyNDU2NDIyMiBZMjc0LjM5NDI4OTcwNTA5OTU0IEYzMDBcbkcxIFg1OC42MjIwMjAyMTI0MTkyNCBZMjcxLjMwOTEwNDk0MDk2MDQgRjMwMFxuRzEgWDU2Ljc0NDIwNTM2NzkyNDUzNiBZMjY4LjU5NDk1MzgzNzk4MjY0IEYzMDBcbkcxIFg1NC4yNzA0NjQ3MDY2OTIzNyBZMjY2LjQxMDEzOTkwMDYwMzQ0IEYzMDBcbkcxIFg1MS4zNDUwNzk3MzczMzU4OSBZMjY0Ljg4MjA5MjkxNzk5MzUzIEYzMDBcbkcxIFg0OC4xMzg2NzQyMjk0NjM1MiBZMjY0LjA5OTkzNjU5MTQ5MjQgRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMjY0LjAwNDU1OSBGMzAwXG5HMSBYNDMuMjUwNjQyNjE3NjExNjYgWTI2NC40MDMwOTUwMzUxNDA4NCBGMzAwXG5HMSBYNDAuMTY1NDU3NTk2MTExNzYgWTI2NS41NzU0NTkzOTEwOTUzNiBGMzAwXG5HMSBYMzcuNDUxMzA2MDgwOTEwOSBZMjY3LjQ1MzI3MzYzOTc3MTk2IEYzMDBcbkcxIFgzNS4yNjY0OTE2MDA0ODkyMiBZMjY5LjkyNzAxMzgyMTM4NzYgRjMwMFxuRzEgWDMzLjczODQ0Mzk3NTY5MDY2IFkyNzIuODUyMzk4NDU1MzAyOSBGMzAwXG5HMSBYMzIuOTU2Mjg2OTQ1MzEwNCBZMjc2LjA1ODgwMzc5MTQ3NCBGMzAwXG5HMSBYMzIuODYwOTA4OTk5OTk5OTkgWTI3Ny42NzA1NjQgRjMwMFxuRzEgWDMzLjI1OTQ0NTkyMjE3NTA1NCBZMjgwLjk0NjgzODI3NDQ4NjcgRjMwMFxuRzEgWDM0LjQzMTgxMTExMzQyNzMyIFkyODQuMDMyMDIyOTc4NTc0OTYgRjMwMFxuRzEgWDM2LjMwOTYyNjA5Njk0NjIyIFkyODYuNzQ2MTczOTg1MzY3MjUgRjMwMFxuRzEgWDM4Ljc4MzM2Njg3MDA4ODkgWTI4OC45MzA5ODc3OTYwMzY2IEYzMDBcbkcxIFg0MS43MDg3NTE5MTc3MTQ5NTYgWTI5MC40NTkwMzQ2Mjg4MDI0NCBGMzAwXG5HMSBYNDQuOTE1MTU3NDY1NjUwOTE0IFkyOTEuMjQxMTkwNzkxMDY1MTUgRjMwMFxuRzEgWDQ2LjUyNjkxNjk5OTk5OTk4IFkyOTEuMzM2NTY4MyBGMzAwXG5HMSBYNDkuODAzMTkxMjk0OTAwNTE1IFkyOTAuOTM4MDMxNTQ1NjQyMiBGMzAwXG5HMSBYNTIuODg4Mzc2MDU5MDM5NjM2IFkyODkuNzY1NjY2NTEyNDE5MiBGMzAwXG5HMSBYNTUuNjAyNTI3MTYyMDE3Mzk1IFkyODcuODg3ODUxNjY3OTI0NTYgRjMwMFxuRzEgWDU3Ljc4NzM0MTA5OTM5NjYzNSBZMjg1LjQxNDExMTAwNjY5MjQgRjMwMFxuRzEgWDU5LjMxNTM4ODA4MjAwNjUyIFkyODIuNDg4NzI2MDM3MzM1OTQgRjMwMFxuRzEgWDYwLjA5NzU0NDQwODUwNzY4IFkyNzkuMjgyMzIwNTI5NDYzNTYgRjMwMFxuRzEgWDYwLjE5MjkyMjAwMDAwMDAxIFkyNzcuNjcwNTY0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMlxuRzAgWDgzLjgwNDA5IFkyNzcuNjcwNTY0XG5HMSBYODMuNDA1NTUzMjQ1NjQyMjQgWTI3NC4zOTQyODk3MDUwOTk1NCBGMzAwXG5HMSBYODIuMjMzMTg4MjEyNDE5MjggWTI3MS4zMDkxMDQ5NDA5NjAzNyBGMzAwXG5HMSBYODAuMzU1MzczMzY3OTI0NjEgWTI2OC41OTQ5NTM4Mzc5ODI2NCBGMzAwXG5HMSBYNzcuODgxNjMyNzA2NjkyNDYgWTI2Ni40MTAxMzk5MDA2MDM0IEYzMDBcbkcxIFg3NC45NTYyNDc3MzczMzU5OSBZMjY0Ljg4MjA5MjkxNzk5MzUgRjMwMFxuRzEgWDcxLjc0OTg0MjIyOTQ2MzYyIFkyNjQuMDk5OTM2NTkxNDkyMyBGMzAwXG5HMSBYNzAuMTM4MDgyIFkyNjQuMDA0NTU5IEYzMDBcbkcxIFg2Ni44NjE4MDc3MDUwOTk1IFkyNjQuNDAzMDk1NzU0MzU3NzYgRjMwMFxuRzEgWDYzLjc3NjYyMjk0MDk2MDQxIFkyNjUuNTc1NDYwNzg3NTgwNzcgRjMwMFxuRzEgWDYxLjA2MjQ3MTgzNzk4MjY1IFkyNjcuNDUzMjc1NjMyMDc1NSBGMzAwXG5HMSBYNTguODc3NjU3OTAwNjAzNDEgWTI2OS45MjcwMTYyOTMzMDc2NCBGMzAwXG5HMSBYNTcuMzQ5NjEwOTE3OTkzNTMgWTI3Mi44NTI0MDEyNjI2NjQxIEYzMDBcbkcxIFg1Ni41Njc0NTQ1OTE0OTIzOSBZMjc2LjA1ODgwNjc3MDUzNjUgRjMwMFxuRzEgWDU2LjQ3MjA3NyBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYNTYuODcwNjEzOTIyMTc1MDggWTI4MC45NDY4MzgyNzQ0ODY3IEYzMDBcbkcxIFg1OC4wNDI5NzkxMTM0MjczNyBZMjg0LjAzMjAyMjk3ODU3NDkgRjMwMFxuRzEgWDU5LjkyMDc5NDA5Njk0NjI5NSBZMjg2Ljc0NjE3Mzk4NTM2NzI1IEYzMDBcbkcxIFg2Mi4zOTQ1MzQ4NzAwODg5NzUgWTI4OC45MzA5ODc3OTYwMzY1NiBGMzAwXG5HMSBYNjUuMzE5OTE5OTE3NzE1MDQgWTI5MC40NTkwMzQ2Mjg4MDI0IEYzMDBcbkcxIFg2OC41MjYzMjU0NjU2NTA5OCBZMjkxLjI0MTE5MDc5MTA2NTA0IEYzMDBcbkcxIFg3MC4xMzgwODIgWTI5MS4zMzY1NjgzIEYzMDBcbkcxIFg3My40MTQzNTYzODIzODgzMyBZMjkwLjkzODAzMjI2NDg1OTE1IEYzMDBcbkcxIFg3Ni40OTk1NDE0MDM4ODgyNCBZMjg5Ljc2NTY2NzkwODkwNDYgRjMwMFxuRzEgWDc5LjIxMzY5MjkxOTA4OTEzIFkyODcuODg3ODUzNjYwMjI4MSBGMzAwXG5HMSBYODEuMzk4NTA3Mzk5NTEwOCBZMjg1LjQxNDExMzQ3ODYxMjQgRjMwMFxuRzEgWDgyLjkyNjU1NTAyNDMwOTM4IFkyODIuNDg4NzI4ODQ0Njk3MTYgRjMwMFxuRzEgWDgzLjcwODcxMjA1NDY4OTY2IFkyNzkuMjgyMzIzNTA4NTI2MSBGMzAwXG5HMSBYODMuODA0MDkgWTI3Ny42NzA1NjQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUzXG5HMCBYMTA3LjQxNTI1IFkyNzcuNjcwNTY0XG5HMSBYMTA3LjAxNjcxMzI0NTY0MjYzIFkyNzQuMzk0Mjg5NzA1MDk5NSBGMzAwXG5HMSBYMTA1Ljg0NDM0ODIxMjQyMDA0IFkyNzEuMzA5MTA0OTQwOTYwMiBGMzAwXG5HMSBYMTAzLjk2NjUzMzM2NzkyNTY5IFkyNjguNTk0OTUzODM3OTgyMiBGMzAwXG5HMSBYMTAxLjQ5Mjc5MjcwNjY5MzggWTI2Ni40MTAxMzk5MDA2MDI2NCBGMzAwXG5HMSBYOTguNTY3NDA3NzM3MzM3NTIgWTI2NC44ODIwOTI5MTc5OTI0IEYzMDBcbkcxIFg5NS4zNjEwMDIyMjk0NjUyNiBZMjY0LjA5OTkzNjU5MTQ5MDggRjMwMFxuRzEgWDkzLjc0OTI1MSBZMjY0LjAwNDU1OSBGMzAwXG5HMSBYOTAuNDcyOTc2NjE3NjExNjYgWTI2NC40MDMwOTUwMzUxNDA4NCBGMzAwXG5HMSBYODcuMzg3NzkxNTk2MTExNzcgWTI2NS41NzU0NTkzOTEwOTUzNiBGMzAwXG5HMSBYODQuNjczNjQwMDgwOTEwOTEgWTI2Ny40NTMyNzM2Mzk3NzE5NiBGMzAwXG5HMSBYODIuNDg4ODI1NjAwNDg5MjIgWTI2OS45MjcwMTM4MjEzODc2IEYzMDBcbkcxIFg4MC45NjA3Nzc5NzU2OTA2NiBZMjcyLjg1MjM5ODQ1NTMwMjkgRjMwMFxuRzEgWDgwLjE3ODYyMDk0NTMxMDQgWTI3Ni4wNTg4MDM3OTE0NzQgRjMwMFxuRzEgWDgwLjA4MzI0MyBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYODAuNDgxNzc5OTIyMTc1MDUgWTI4MC45NDY4MzgyNzQ0ODY3IEYzMDBcbkcxIFg4MS42NTQxNDUxMTM0MjczMiBZMjg0LjAzMjAyMjk3ODU3NDkgRjMwMFxuRzEgWDgzLjUzMTk2MDA5Njk0NjIyIFkyODYuNzQ2MTczOTg1MzY3MjUgRjMwMFxuRzEgWDg2LjAwNTcwMDg3MDA4ODkgWTI4OC45MzA5ODc3OTYwMzY2IEYzMDBcbkcxIFg4OC45MzEwODU5MTc3MTQ5NSBZMjkwLjQ1OTAzNDYyODgwMjQ0IEYzMDBcbkcxIFg5Mi4xMzc0OTE0NjU2NTA5MiBZMjkxLjI0MTE5MDc5MTA2NTE1IEYzMDBcbkcxIFg5My43NDkyNTEgWTI5MS4zMzY1NjgzIEYzMDBcbkcxIFg5Ny4wMjU1MjUxMTk5MjQzOCBZMjkwLjkzODAzMDEwNzIwODQgRjMwMFxuRzEgWDEwMC4xMTA3MDkzNjkzNDE0NSBZMjg5Ljc2NTY2MzcxOTQ0ODcgRjMwMFxuRzEgWDEwMi44MjQ4NTk2NDc4NzI1OSBZMjg3Ljg4Nzg0NzY4MzMxODA2IEYzMDBcbkcxIFgxMDUuMDA5NjcyNDk5MTY2NjMgWTI4NS40MTQxMDYwNjI4NTMxNCBGMzAwXG5HMSBYMTA2LjUzNzcxODE5NzM5ODk1IFkyODIuNDg4NzIwNDIyNjE0NiBGMzAwXG5HMSBYMTA3LjMxOTg3MzExNjE0MTc1IFkyNzkuMjgyMzE0NTcxMzQwMyBGMzAwXG5HMSBYMTA3LjQxNTI1IFkyNzcuNjcwNTY0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNFxuRzAgWDEzMS4wMjY0MSBZMjc3LjY3MDU2NFxuRzEgWDEzMC42Mjc4NzMyNDU2NDI1IFkyNzQuMzk0Mjg5NzA1MDk5NSBGMzAwXG5HMSBYMTI5LjQ1NTUwODIxMjQxOTggWTI3MS4zMDkxMDQ5NDA5NjAyNSBGMzAwXG5HMSBYMTI3LjU3NzY5MzM2NzkyNTMzIFkyNjguNTk0OTUzODM3OTgyMyBGMzAwXG5HMSBYMTI1LjEwMzk1MjcwNjY5MzM4IFkyNjYuNDEwMTM5OTAwNjAyODcgRjMwMFxuRzEgWDEyMi4xNzg1Njc3MzczMzcwMiBZMjY0Ljg4MjA5MjkxNzk5MjcgRjMwMFxuRzEgWDExOC45NzIxNjIyMjk0NjQ3NCBZMjY0LjA5OTkzNjU5MTQ5MTI2IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTI2NC4wMDQ1NTkwMDAwMDAwMyBGMzAwXG5HMSBYMTE0LjA4NDEzNTg1MDkxMjg3IFkyNjQuNDAzMDk2OTUzMDUyNyBGMzAwXG5HMSBYMTEwLjk5ODk1MTUxNTcwODc0IFkyNjUuNTc1NDYzMTE1MDU2MyBGMzAwXG5HMSBYMTA4LjI4NDgwMTA5OTc2OTgyIFkyNjcuNDUzMjc4OTUyNTgxIEYzMDBcbkcxIFgxMDYuMDk5OTg4MDY3NDYxNTUgWTI2OS45MjcwMjA0MTMxNzM4NiBGMzAwXG5HMSBYMTA0LjU3MTk0MjE1NTE2NjMzIFkyNzIuODUyNDA1OTQxNTk4NzYgRjMwMFxuRzEgWDEwMy43ODk3ODcwMDE3OTcxNSBZMjc2LjA1ODgxMTczNTYzOTUgRjMwMFxuRzEgWDEwMy42OTQ0MSBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYMTA0LjA5Mjk0NjkyMjE3NDc5IFkyODAuOTQ2ODM4Mjc0NDg2NyBGMzAwXG5HMSBYMTA1LjI2NTMxMjExMzQyNjc5IFkyODQuMDMyMDIyOTc4NTc1IEYzMDBcbkcxIFgxMDcuMTQzMTI3MDk2OTQ1NDYgWTI4Ni43NDYxNzM5ODUzNjc1MyBGMzAwXG5HMSBYMTA5LjYxNjg2Nzg3MDA4Nzk2IFkyODguOTMwOTg3Nzk2MDM3MSBGMzAwXG5HMSBYMTEyLjU0MjI1MjkxNzcxMzkyIFkyOTAuNDU5MDM0NjI4ODAzMiBGMzAwXG5HMSBYMTE1Ljc0ODY1ODQ2NTY0OTgzIFkyOTEuMjQxMTkwNzkxMDY2MiBGMzAwXG5HMSBYMTE3LjM2MDQxIFkyOTEuMzM2NTY4Mjk5OTk5OTUgRjMwMFxuRzEgWDEyMC42MzY2ODQxNDkwODcxNSBZMjkwLjkzODAzMDM0Njk0NzMgRjMwMFxuRzEgWDEyMy43MjE4Njg0ODQyOTEyOCBZMjg5Ljc2NTY2NDE4NDk0MzcgRjMwMFxuRzEgWDEyNi40MzYwMTg5MDAyMzAxOCBZMjg3Ljg4Nzg0ODM0NzQxOTA0IEYzMDBcbkcxIFgxMjguNjIwODMxOTMyNTM4NDcgWTI4NS40MTQxMDY4ODY4MjYyMyBGMzAwXG5HMSBYMTMwLjE0ODg3Nzg0NDgzMzcyIFkyODIuNDg4NzIxMzU4NDAxMzQgRjMwMFxuRzEgWDEzMC45MzEwMzI5OTgyMDI5IFkyNzkuMjgyMzE1NTY0MzYwNiBGMzAwXG5HMSBYMTMxLjAyNjQxIFkyNzcuNjcwNTYzOTk5OTk5OTYgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU1XG5HMCBYMTU0LjYzNzYgWTI3Ny42NzA1NjRcbkcxIFgxNTQuMjM5MDYzMjQ1NjQyNSBZMjc0LjM5NDI4OTcwNTA5OTQgRjMwMFxuRzEgWDE1My4wNjY2OTgyMTI0MTk4MiBZMjcxLjMwOTEwNDk0MDk2MDIgRjMwMFxuRzEgWDE1MS4xODg4ODMzNjc5MjUzNyBZMjY4LjU5NDk1MzgzNzk4MjMgRjMwMFxuRzEgWDE0OC43MTUxNDI3MDY2OTM0IFkyNjYuNDEwMTM5OTAwNjAyOCBGMzAwXG5HMSBYMTQ1Ljc4OTc1NzczNzMzNzA2IFkyNjQuODgyMDkyOTE3OTkyNyBGMzAwXG5HMSBYMTQyLjU4MzM1MjIyOTQ2NDc3IFkyNjQuMDk5OTM2NTkxNDkxMiBGMzAwXG5HMSBYMTQwLjk3MTYgWTI2NC4wMDQ1NTkgRjMwMFxuRzEgWDEzNy42OTUzMjU1NTkyODY1MiBZMjY0LjQwMzA5NDU1NTY2Mjg1IEYzMDBcbkcxIFgxMzQuNjEwMTQwMzY2MjEyODcgWTI2NS41NzU0NTg0NjAxMDUxIEYzMDBcbkcxIFgxMzEuODk1OTg4NTc2MTk2NjYgWTI2Ny40NTMyNzIzMTE1Njk1NSBGMzAwXG5HMSBYMTI5LjcxMTE3MzczMzc0NjczIFkyNjkuOTI3MDEyMTczNDQwNzQgRjMwMFxuRzEgWDEyOC4xODMxMjU2ODA4MjI0MyBZMjcyLjg1MjM5NjU4MzcyODQgRjMwMFxuRzEgWDEyNy40MDA5NjgxODExODk0NyBZMjc2LjA1ODgwMTgwNTQzMiBGMzAwXG5HMSBYMTI3LjMwNTU5MDAwMDAwMDAxIFkyNzcuNjcwNTY0IEYzMDBcbkcxIFgxMjcuNzA0MTI2OTIyMTc0OTUgWTI4MC45NDY4MzgyNzQ0ODY2NSBGMzAwXG5HMSBYMTI4Ljg3NjQ5MjExMzQyNzEzIFkyODQuMDMyMDIyOTc4NTc0OTYgRjMwMFxuRzEgWDEzMC43NTQzMDcwOTY5NDU5NSBZMjg2Ljc0NjE3Mzk4NTM2NzM2IEYzMDBcbkcxIFgxMzMuMjI4MDQ3ODcwMDg4NTUgWTI4OC45MzA5ODc3OTYwMzY4IEYzMDBcbkcxIFgxMzYuMTUzNDMyOTE3NzE0NTUgWTI5MC40NTkwMzQ2Mjg4MDI3IEYzMDBcbkcxIFgxMzkuMzU5ODM4NDY1NjUwNDggWTI5MS4yNDExOTA3OTEwNjU1IEYzMDBcbkcxIFgxNDAuOTcxNiBZMjkxLjMzNjU2ODI5OTk5OTk1IEYzMDBcbkcxIFgxNDQuMjQ3ODc0MTQ5MDg3MTIgWTI5MC45MzgwMzAzNDY5NDczIEYzMDBcbkcxIFgxNDcuMzMzMDU4NDg0MjkxMjYgWTI4OS43NjU2NjQxODQ5NDM3IEYzMDBcbkcxIFgxNTAuMDQ3MjA4OTAwMjMwMiBZMjg3Ljg4Nzg0ODM0NzQxOTA0IEYzMDBcbkcxIFgxNTIuMjMyMDIxOTMyNTM4NDYgWTI4NS40MTQxMDY4ODY4MjYyMyBGMzAwXG5HMSBYMTUzLjc2MDA2Nzg0NDgzMzcgWTI4Mi40ODg3MjEzNTg0MDEzNCBGMzAwXG5HMSBYMTU0LjU0MjIyMjk5ODIwMjkgWTI3OS4yODIzMTU1NjQzNjA2IEYzMDBcbkcxIFgxNTQuNjM3NiBZMjc3LjY3MDU2Mzk5OTk5OTk2IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNlxuRzAgWDE3OC4yNDg4MSBZMjc3LjY3MDU2NFxuRzEgWDE3Ny44NTAyNzMyNDU2NDM5MyBZMjc0LjM5NDI4OTcwNTA5OTI1IEYzMDBcbkcxIFgxNzYuNjc3OTA4MjEyNDIyNTUgWTI3MS4zMDkxMDQ5NDA5NTk1NyBGMzAwXG5HMSBYMTc0LjgwMDA5MzM2NzkyOTI2IFkyNjguNTk0OTUzODM3OTgwOCBGMzAwXG5HMSBYMTcyLjMyNjM1MjcwNjY5ODIzIFkyNjYuNDEwMTM5OTAwNjAwMjYgRjMwMFxuRzEgWDE2OS40MDA5Njc3MzczNDI1NyBZMjY0Ljg4MjA5MjkxNzk4ODg3IEYzMDBcbkcxIFgxNjYuMTk0NTYyMjI5NDcwNjIgWTI2NC4wOTk5MzY1OTE0ODYxIEYzMDBcbkcxIFgxNjQuNTgyNzkgWTI2NC4wMDQ1NTkgRjMwMFxuRzEgWDE2MS4zMDY1MTYxNDI1NDEgWTI2NC40MDMwOTkzNTA0NDIyIEYzMDBcbkcxIFgxNTguMjIxMzMyNjY1MjA4MDggWTI2NS41NzU0Njc3NzAwMDY2IEYzMDBcbkcxIFgxNTUuNTA3MTgzNjIzMzQ3OSBZMjY3LjQ1MzI4NTU5MzU5MDQ2IEYzMDBcbkcxIFgxNTMuMzIyMzcyNDAxMTgyNSBZMjY5LjkyNzAyODY1MjkwMzYgRjMwMFxuRzEgWDE1MS43OTQzMjg2Mjk1MTcxIFkyNzIuODUyNDE1Mjk5NDY0MSBGMzAwXG5HMSBYMTUxLjAxMjE3NTgyMjQxMjEzIFkyNzYuMDU4ODIxNjY1ODQwMyBGMzAwXG5HMSBYMTUwLjkxNjgwMDAwMDAwMDAyIFkyNzcuNjcwNTY0MDAwMDAwMDcgRjMwMFxuRzEgWDE1MS4zMTUzMzY5MjIxNzI4MyBZMjgwLjk0NjgzODI3NDQ4Njk0IEYzMDBcbkcxIFgxNTIuNDg3NzAyMTEzNDIzIFkyODQuMDMyMDIyOTc4NTc2IEYzMDBcbkcxIFgxNTQuMzY1NTE3MDk2OTQwMDcgWTI4Ni43NDYxNzM5ODUzNjk2IEYzMDBcbkcxIFgxNTYuODM5MjU3ODcwMDgxMjcgWTI4OC45MzA5ODc3OTYwNDA1NCBGMzAwXG5HMSBYMTU5Ljc2NDY0MjkxNzcwNjMgWTI5MC40NTkwMzQ2Mjg4MDg0IEYzMDBcbkcxIFgxNjIuOTcxMDQ4NDY1NjQxNzMgWTI5MS4yNDExOTA3OTEwNzMzIEYzMDBcbkcxIFgxNjQuNTgyNzkgWTI5MS4zMzY1NjgzIEYzMDBcbkcxIFgxNjcuODU5MDY0NzMyMzM4MDggWTI5MC45MzgwMzUxNDE3MjcxIEYzMDBcbkcxIFgxNzAuOTQ0MjUwNzgzMjc5NjQgWTI4OS43NjU2NzM0OTQ4NDY5IEYzMDBcbkcxIFgxNzMuNjU4NDAzOTQ3MzcxNjggWTI4Ny44ODc4NjE2Mjk0NDM3IEYzMDBcbkcxIFgxNzUuODQzMjIwNTk5OTYyMDggWTI4NS40MTQxMjMzNjYyOTU1IEYzMDBcbkcxIFgxNzcuMzcxMjcwNzkzNTE0NjQgWTI4Mi40ODg3NDAwNzQxNDY2IEYzMDBcbkcxIFgxNzguMTUzNDMwNjM5NDExMDMgWTI3OS4yODIzMzU0MjQ3ODE5MyBGMzAwXG5HMSBYMTc4LjI0ODgxIFkyNzcuNjcwNTYzOTk5OTk5OTYgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU3XG5HMCBYMjAxLjg2IFkyNzcuNjcwNTY0XG5HMSBYMjAxLjQ2MTQ2MzI0NTY0NDQ3IFkyNzQuMzk0Mjg5NzA1MDk5MjUgRjMwMFxuRzEgWDIwMC4yODkwOTgyMTI0MjM2IFkyNzEuMzA5MTA0OTQwOTU5MzQgRjMwMFxuRzEgWDE5OC40MTEyODMzNjc5MzA3NCBZMjY4LjU5NDk1MzgzNzk4MDI2IEYzMDBcbkcxIFgxOTUuOTM3NTQyNzA2NzAwMDcgWTI2Ni40MTAxMzk5MDA1OTkzNSBGMzAwXG5HMSBYMTkzLjAxMjE1NzczNzM0NDY0IFkyNjQuODgyMDkyOTE3OTg3NSBGMzAwXG5HMSBYMTg5LjgwNTc1MjIyOTQ3MjggWTI2NC4wOTk5MzY1OTE0ODQxNSBGMzAwXG5HMSBYMTg4LjE5NDAxIFkyNjQuMDA0NTU5IEYzMDBcbkcxIFgxODQuOTE3NzM1NTU5Mjg2NDggWTI2NC40MDMwOTQ1NTU2NjI4NSBGMzAwXG5HMSBYMTgxLjgzMjU1MDM2NjIxMjg0IFkyNjUuNTc1NDU4NDYwMTA1MSBGMzAwXG5HMSBYMTc5LjExODM5ODU3NjE5NjYzIFkyNjcuNDUzMjcyMzExNTY5NTUgRjMwMFxuRzEgWDE3Ni45MzM1ODM3MzM3NDY3IFkyNjkuOTI3MDEyMTczNDQwNzQgRjMwMFxuRzEgWDE3NS40MDU1MzU2ODA4MjI0IFkyNzIuODUyMzk2NTgzNzI4NCBGMzAwXG5HMSBYMTc0LjYyMzM3ODE4MTE4OTQyIFkyNzYuMDU4ODAxODA1NDMyIEYzMDBcbkcxIFgxNzQuNTI4IFkyNzcuNjcwNTY0IEYzMDBcbkcxIFgxNzQuOTI2NTM2OTIyMTc0OSBZMjgwLjk0NjgzODI3NDQ4NjY1IEYzMDBcbkcxIFgxNzYuMDk4OTAyMTEzNDI3MDcgWTI4NC4wMzIwMjI5Nzg1NzQ5IEYzMDBcbkcxIFgxNzcuOTc2NzE3MDk2OTQ1OSBZMjg2Ljc0NjE3Mzk4NTM2NzMgRjMwMFxuRzEgWDE4MC40NTA0NTc4NzAwODg1IFkyODguOTMwOTg3Nzk2MDM2NzMgRjMwMFxuRzEgWDE4My4zNzU4NDI5MTc3MTQ1MiBZMjkwLjQ1OTAzNDYyODgwMjcgRjMwMFxuRzEgWDE4Ni41ODIyNDg0NjU2NTA0NSBZMjkxLjI0MTE5MDc5MTA2NTUgRjMwMFxuRzEgWDE4OC4xOTQwMDk5OTk5OTk5NiBZMjkxLjMzNjU2ODI5OTk5OTk1IEYzMDBcbkcxIFgxOTEuNDcwMjgzODU3NDU4OTggWTI5MC45MzgwMjc5NDk1NTc4IEYzMDBcbkcxIFgxOTQuNTU1NDY3MzM0NzkxOTMgWTI4OS43NjU2NTk1Mjk5OTM0NiBGMzAwXG5HMSBYMTk3LjI2OTYxNjM3NjY1MjEyIFkyODcuODg3ODQxNzA2NDA5NSBGMzAwXG5HMSBYMTk5LjQ1NDQyNzU5ODgxNzYgWTI4NS40MTQwOTg2NDcwOTY0IEYzMDBcbkcxIFgyMDAuOTgyNDcxMzcwNDgyOTUgWTI4Mi40ODg3MTIwMDA1MzU5IEYzMDBcbkcxIFgyMDEuNzY0NjI0MTc3NTg3OTYgWTI3OS4yODIzMDU2MzQxNTk3NCBGMzAwXG5HMSBYMjAxLjg2IFkyNzcuNjcwNTY0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOFxuRzAgWDM2LjU4MTc0NCBZMjU0LjA1OTM4MlxuRzEgWDM2LjE4MzIwNzcyNTEyMDE2IFkyNTAuNzgzMTA3NjQ2Nzc0MjUgRjMwMFxuRzEgWDM1LjAxMDg0MzE0MzQwOTQ2IFkyNDcuNjk3OTIyNzExMDYxMjcgRjMwMFxuRzEgWDMzLjEzMzAyODY5NjEyNjgxNCBZMjQ0Ljk4Mzc3MTMzMzI2ODEgRjMwMFxuRzEgWDMwLjY1OTI4ODM1NDYzODk3IFkyNDIuNzk4OTU3MDMzODYwNTUgRjMwMFxuRzEgWDI3LjczMzkwMzYwODkwOTk1IFkyNDEuMjcwOTA5NjIzMTI0ODggRjMwMFxuRzEgWDI0LjUyNzQ5ODIxNTUwNTA0IFkyNDAuNDg4NzUyODI3MzcxIEYzMDBcbkcxIFgyMi45MTU3MzkwMDAwMDAwMDIgWTI0MC4zOTMzNzUwMDAwMDAwMiBGMzAwXG5HMSBYMTkuNjM5NDY0NjM1MTA5MTkyIFkyNDAuNzkxOTExMTc4OTg0MjYgRjMwMFxuRzEgWDE2LjU1NDI3OTY2NTA4MTQ0IFkyNDEuOTY0Mjc1NjcwMzkyNSBGMzAwXG5HMSBYMTMuODQwMTI4MjMyMzI1MTg3IFkyNDMuODQyMDkwMDM4MjMyNzUgRjMwMFxuRzEgWDExLjY1NTMxMzg2MDUxMTk5MiBZMjQ2LjMxNTgzMDMxNTc3MTcgRjMwMFxuRzEgWDEwLjEyNzI2NjM2NDE1MTE2NSBZMjQ5LjI0MTIxNTAxNjc3NTIxIEYzMDBcbkcxIFg5LjM0NTEwOTQ3NDU0Njc0NCBZMjUyLjQ0NzYyMDM4NzI4NjYzIEYzMDBcbkcxIFg5LjI0OTczMTYgWTI1NC4wNTkzODIwMDAwMDAwMyBGMzAwXG5HMSBYOS42NDgyNjgzNTQzNTc3OSBZMjU3LjMzNTY1NjI5NDkwMDUgRjMwMFxuRzEgWDEwLjgyMDYzMzM4NzU4MDc3OSBZMjYwLjQyMDg0MTA1OTAzOTYgRjMwMFxuRzEgWDEyLjY5ODQ0ODIzMjA3NTQ4MyBZMjYzLjEzNDk5MjE2MjAxNzQgRjMwMFxuRzEgWDE1LjE3MjE4ODg5MzMwNzY0OSBZMjY1LjMxOTgwNjA5OTM5NjYgRjMwMFxuRzEgWDE4LjA5NzU3Mzg2MjY2NDEzNCBZMjY2Ljg0Nzg1MzA4MjAwNjUgRjMwMFxuRzEgWDIxLjMwMzk3OTM3MDUzNjQ4IFkyNjcuNjMwMDA5NDA4NTA3NjUgRjMwMFxuRzEgWDIyLjkxNTczODk5OTk5OTk5NSBZMjY3LjcyNTM4NyBGMzAwXG5HMSBYMjYuMTkyMDEzMjk0OTAwNTEgWTI2Ny4zMjY4NTAyNDU2NDIyIEYzMDBcbkcxIFgyOS4yNzcxOTgwNTkwMzk1OTUgWTI2Ni4xNTQ0ODUyMTI0MTkyIEYzMDBcbkcxIFgzMS45OTEzNDkxNjIwMTczNSBZMjY0LjI3NjY3MDM2NzkyNDUgRjMwMFxuRzEgWDM0LjE3NjE2MzA5OTM5NjYgWTI2MS44MDI5Mjk3MDY2OTIzNCBGMzAwXG5HMSBYMzUuNzA0MjEwMDgyMDA2NDcgWTI1OC44Nzc1NDQ3MzczMzU5IEYzMDBcbkcxIFgzNi40ODYzNjY0MDg1MDc2MTQgWTI1NS42NzExMzkyMjk0NjM1IEYzMDBcbkcxIFgzNi41ODE3NDQgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTlcbkcwIFg2MC4xOTI5MjIgWTI1NC4wNTkzODJcbkcxIFg1OS43OTQzODU3MjUxMjAxNyBZMjUwLjc4MzEwNzY0Njc3NDI4IEYzMDBcbkcxIFg1OC42MjIwMjExNDM0MDk0NyBZMjQ3LjY5NzkyMjcxMTA2MTMgRjMwMFxuRzEgWDU2Ljc0NDIwNjY5NjEyNjgzIFkyNDQuOTgzNzcxMzMzMjY4MSBGMzAwXG5HMSBYNTQuMjcwNDY2MzU0NjM5MDIgWTI0Mi43OTg5NTcwMzM4NjA1NyBGMzAwXG5HMSBYNTEuMzQ1MDgxNjA4OTEgWTI0MS4yNzA5MDk2MjMxMjQ4OCBGMzAwXG5HMSBYNDguMTM4Njc2MjE1NTA1MTIgWTI0MC40ODg3NTI4MjczNzEgRjMwMFxuRzEgWDQ2LjUyNjkxNzAwMDAwMDAwNSBZMjQwLjM5MzM3NTAwMDAwMDAyIEYzMDBcbkcxIFg0My4yNTA2NDI2MTc2MTE2NiBZMjQwLjc5MTkxMTAzNTE0MDg2IEYzMDBcbkcxIFg0MC4xNjU0NTc1OTYxMTE3NiBZMjQxLjk2NDI3NTM5MTA5NTQgRjMwMFxuRzEgWDM3LjQ1MTMwNjA4MDkxMDg5IFkyNDMuODQyMDg5NjM5NzcyIEYzMDBcbkcxIFgzNS4yNjY0OTE2MDA0ODkyIFkyNDYuMzE1ODI5ODIxMzg3NjQgRjMwMFxuRzEgWDMzLjczODQ0Mzk3NTY5MDY2IFkyNDkuMjQxMjE0NDU1MzAyODcgRjMwMFxuRzEgWDMyLjk1NjI4Njk0NTMxMDQgWTI1Mi40NDc2MTk3OTE0NzQgRjMwMFxuRzEgWDMyLjg2MDkwODk5OTk5OTk5IFkyNTQuMDU5MzgyIEYzMDBcbkcxIFgzMy4yNTk0NDU3NTQzNTc3NTYgWTI1Ny4zMzU2NTYyOTQ5MDA1IEYzMDBcbkcxIFgzNC40MzE4MTA3ODc1ODA3MTYgWTI2MC40MjA4NDEwNTkwMzk2IEYzMDBcbkcxIFgzNi4zMDk2MjU2MzIwNzUzOCBZMjYzLjEzNDk5MjE2MjAxNzM0IEYzMDBcbkcxIFgzOC43ODMzNjYyOTMzMDc1NCBZMjY1LjMxOTgwNjA5OTM5NjYgRjMwMFxuRzEgWDQxLjcwODc1MTI2MjY2NDAxIFkyNjYuODQ3ODUzMDgyMDA2NSBGMzAwXG5HMSBYNDQuOTE1MTU2NzcwNTM2MzcgWTI2Ny42MzAwMDk0MDg1MDc3IEYzMDBcbkcxIFg0Ni41MjY5MTY5OTk5OTk5OSBZMjY3LjcyNTM4NyBGMzAwXG5HMSBYNDkuODAzMTkxMjk0OTAwNTEgWTI2Ny4zMjY4NTAyNDU2NDIyIEYzMDBcbkcxIFg1Mi44ODgzNzYwNTkwMzk2IFkyNjYuMTU0NDg1MjEyNDE5MiBGMzAwXG5HMSBYNTUuNjAyNTI3MTYyMDE3MzUgWTI2NC4yNzY2NzAzNjc5MjQ1IEYzMDBcbkcxIFg1Ny43ODczNDEwOTkzOTY2IFkyNjEuODAyOTI5NzA2NjkyMzQgRjMwMFxuRzEgWDU5LjMxNTM4ODA4MjAwNjQ4IFkyNTguODc3NTQ0NzM3MzM1OSBGMzAwXG5HMSBYNjAuMDk3NTQ0NDA4NTA3NjEgWTI1NS42NzExMzkyMjk0NjM1MyBGMzAwXG5HMSBYNjAuMTkyOTIyMDAwMDAwMDEgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTEwXG5HMCBYODMuODA0MDkgWTI1NC4wNTkzODJcbkcxIFg4My40MDU1NTM3MjUxMjAxOSBZMjUwLjc4MzEwNzY0Njc3NDI1IEYzMDBcbkcxIFg4Mi4yMzMxODkxNDM0MDk1MiBZMjQ3LjY5NzkyMjcxMTA2MTI3IEYzMDBcbkcxIFg4MC4zNTUzNzQ2OTYxMjY5MiBZMjQ0Ljk4Mzc3MTMzMzI2ODEgRjMwMFxuRzEgWDc3Ljg4MTYzNDM1NDYzOTEgWTI0Mi43OTg5NTcwMzM4NjA1MiBGMzAwXG5HMSBYNzQuOTU2MjQ5NjA4OTEwMTEgWTI0MS4yNzA5MDk2MjMxMjQ4MiBGMzAwXG5HMSBYNzEuNzQ5ODQ0MjE1NTA1MjIgWTI0MC40ODg3NTI4MjczNzA5MiBGMzAwXG5HMSBYNzAuMTM4MDgyIFkyNDAuMzkzMzc1IEYzMDBcbkcxIFg2Ni44NjE4MDc3MDUwOTk0NyBZMjQwLjc5MTkxMTc1NDM1NzggRjMwMFxuRzEgWDYzLjc3NjYyMjk0MDk2MDM2NSBZMjQxLjk2NDI3Njc4NzU4MDgxIEYzMDBcbkcxIFg2MS4wNjI0NzE4Mzc5ODI2MSBZMjQzLjg0MjA5MTYzMjA3NTUyIEYzMDBcbkcxIFg1OC44Nzc2NTc5MDA2MDMzOCBZMjQ2LjMxNTgzMjI5MzMwNzcyIEYzMDBcbkcxIFg1Ny4zNDk2MTA5MTc5OTM1IFkyNDkuMjQxMjE3MjYyNjY0MiBGMzAwXG5HMSBYNTYuNTY3NDU0NTkxNDkyMzg1IFkyNTIuNDQ3NjIyNzcwNTM2NTUgRjMwMFxuRzEgWDU2LjQ3MjA3NyBZMjU0LjA1OTM4MjAwMDAwMDAzIEYzMDBcbkcxIFg1Ni44NzA2MTM3NTQzNTc3OSBZMjU3LjMzNTY1NjI5NDkwMDUgRjMwMFxuRzEgWDU4LjA0Mjk3ODc4NzU4MDc3IFkyNjAuNDIwODQxMDU5MDM5NTYgRjMwMFxuRzEgWDU5LjkyMDc5MzYzMjA3NTQ3IFkyNjMuMTM0OTkyMTYyMDE3MzQgRjMwMFxuRzEgWDYyLjM5NDUzNDI5MzMwNzYzNiBZMjY1LjMxOTgwNjA5OTM5NjU0IEYzMDBcbkcxIFg2NS4zMTk5MTkyNjI2NjQxMSBZMjY2Ljg0Nzg1MzA4MjAwNjQ1IEYzMDBcbkcxIFg2OC41MjYzMjQ3NzA1MzY0OSBZMjY3LjYzMDAwOTQwODUwNzYgRjMwMFxuRzEgWDcwLjEzODA4MiBZMjY3LjcyNTM4NyBGMzAwXG5HMSBYNzMuNDE0MzU2MzgyMzg4MzMgWTI2Ny4zMjY4NTA5NjQ4NTkxNSBGMzAwXG5HMSBYNzYuNDk5NTQxNDAzODg4MjMgWTI2Ni4xNTQ0ODY2MDg5MDQ2IEYzMDBcbkcxIFg3OS4yMTM2OTI5MTkwODkwOCBZMjY0LjI3NjY3MjM2MDIyOCBGMzAwXG5HMSBYODEuMzk4NTA3Mzk5NTEwNzggWTI2MS44MDI5MzIxNzg2MTIzNyBGMzAwXG5HMSBYODIuOTI2NTU1MDI0MzA5MzQgWTI1OC44Nzc1NDc1NDQ2OTcxIEYzMDBcbkcxIFg4My43MDg3MTIwNTQ2ODk1OCBZMjU1LjY3MTE0MjIwODUyNiBGMzAwXG5HMSBYODMuODA0MDkgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTExXG5HMCBYMTA3LjQxNTI1IFkyNTQuMDU5MzgyXG5HMSBYMTA3LjAxNjcxMzcyNTEyMDU4IFkyNTAuNzgzMTA3NjQ2Nzc0MjMgRjMwMFxuRzEgWDEwNS44NDQzNDkxNDM0MTAyOCBZMjQ3LjY5NzkyMjcxMTA2MTA3IEYzMDBcbkcxIFgxMDMuOTY2NTM0Njk2MTI4MDEgWTI0NC45ODM3NzEzMzMyNjc2NyBGMzAwXG5HMSBYMTAxLjQ5Mjc5NDM1NDY0MDQ4IFkyNDIuNzk4OTU3MDMzODU5OCBGMzAwXG5HMSBYOTguNTY3NDA5NjA4OTExNjcgWTI0MS4yNzA5MDk2MjMxMjM3NyBGMzAwXG5HMSBYOTUuMzYxMDA0MjE1NTA2ODggWTI0MC40ODg3NTI4MjczNjk0NyBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkyNDAuMzkzMzc1IEYzMDBcbkcxIFg5MC40NzI5NzY2MTc2MTE2NiBZMjQwLjc5MTkxMTAzNTE0MDg2IEYzMDBcbkcxIFg4Ny4zODc3OTE1OTYxMTE3NyBZMjQxLjk2NDI3NTM5MTA5NTQgRjMwMFxuRzEgWDg0LjY3MzY0MDA4MDkxMDkgWTI0My44NDIwODk2Mzk3NzE5OCBGMzAwXG5HMSBYODIuNDg4ODI1NjAwNDg5MjIgWTI0Ni4zMTU4Mjk4MjEzODc2IEYzMDBcbkcxIFg4MC45NjA3Nzc5NzU2OTA2NiBZMjQ5LjI0MTIxNDQ1NTMwMjg0IEYzMDBcbkcxIFg4MC4xNzg2MjA5NDUzMTA0MSBZMjUyLjQ0NzYxOTc5MTQ3Mzk1IEYzMDBcbkcxIFg4MC4wODMyNDMgWTI1NC4wNTkzODIgRjMwMFxuRzEgWDgwLjQ4MTc3OTc1NDM1Nzc2IFkyNTcuMzM1NjU2Mjk0OTAwNSBGMzAwXG5HMSBYODEuNjU0MTQ0Nzg3NTgwNzIgWTI2MC40MjA4NDEwNTkwMzk2IEYzMDBcbkcxIFg4My41MzE5NTk2MzIwNzUzOCBZMjYzLjEzNDk5MjE2MjAxNzM0IEYzMDBcbkcxIFg4Ni4wMDU3MDAyOTMzMDc1NCBZMjY1LjMxOTgwNjA5OTM5NjYgRjMwMFxuRzEgWDg4LjkzMTA4NTI2MjY2NDAxIFkyNjYuODQ3ODUzMDgyMDA2NSBGMzAwXG5HMSBYOTIuMTM3NDkwNzcwNTM2MzcgWTI2Ny42MzAwMDk0MDg1MDc3IEYzMDBcbkcxIFg5My43NDkyNTEgWTI2Ny43MjUzODcgRjMwMFxuRzEgWDk3LjAyNTUyNTExOTkyNDM4IFkyNjcuMzI2ODQ4ODA3MjA4MzYgRjMwMFxuRzEgWDEwMC4xMTA3MDkzNjkzNDE0NiBZMjY2LjE1NDQ4MjQxOTQ0ODY0IEYzMDBcbkcxIFgxMDIuODI0ODU5NjQ3ODcyNTkgWTI2NC4yNzY2NjYzODMzMTggRjMwMFxuRzEgWDEwNS4wMDk2NzI0OTkxNjY2MSBZMjYxLjgwMjkyNDc2Mjg1MzEgRjMwMFxuRzEgWDEwNi41Mzc3MTgxOTczOTg5IFkyNTguODc3NTM5MTIyNjE0NTYgRjMwMFxuRzEgWDEwNy4zMTk4NzMxMTYxNDE2OCBZMjU1LjY3MTEzMzI3MTM0MDIgRjMwMFxuRzEgWDEwNy40MTUyNSBZMjU0LjA1OTM4MiBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTEyXG5HMCBYMTMxLjAyNjQxIFkyNTQuMDU5MzgyXG5HMSBYMTMwLjYyNzg3MzcyNTEyMDQ4IFkyNTAuNzgzMTA3NjQ2Nzc0MjMgRjMwMFxuRzEgWDEyOS40NTU1MDkxNDM0MTAwNyBZMjQ3LjY5NzkyMjcxMTA2MTE1IEYzMDBcbkcxIFgxMjcuNTc3Njk0Njk2MTI3NzEgWTI0NC45ODM3NzEzMzMyNjc4IEYzMDBcbkcxIFgxMjUuMTAzOTU0MzU0NjQwMTEgWTI0Mi43OTg5NTcwMzM4NjAwNiBGMzAwXG5HMSBYMTIyLjE3ODU2OTYwODkxMTIzIFkyNDEuMjcwOTA5NjIzMTI0MDggRjMwMFxuRzEgWDExOC45NzIxNjQyMTU1MDY0MSBZMjQwLjQ4ODc1MjgyNzM2OTkgRjMwMFxuRzEgWDExNy4zNjA0MSBZMjQwLjM5MzM3NTAwMDAwMDAyIEYzMDBcbkcxIFgxMTQuMDg0MTM1ODUwOTEyODcgWTI0MC43OTE5MTI5NTMwNTI2NyBGMzAwXG5HMSBYMTEwLjk5ODk1MTUxNTcwODc0IFkyNDEuOTY0Mjc5MTE1MDU2MjkgRjMwMFxuRzEgWDEwOC4yODQ4MDEwOTk3Njk4NCBZMjQzLjg0MjA5NDk1MjU4MDk2IEYzMDBcbkcxIFgxMDYuMDk5OTg4MDY3NDYxNTggWTI0Ni4zMTU4MzY0MTMxNzM4IEYzMDBcbkcxIFgxMDQuNTcxOTQyMTU1MTY2MzQgWTI0OS4yNDEyMjE5NDE1OTg3IEYzMDBcbkcxIFgxMDMuNzg5Nzg3MDAxNzk3MTUgWTI1Mi40NDc2Mjc3MzU2Mzk0MyBGMzAwXG5HMSBYMTAzLjY5NDQxIFkyNTQuMDU5MzgyIEYzMDBcbkcxIFgxMDQuMDkyOTQ2NzU0MzU3NDggWTI1Ny4zMzU2NTYyOTQ5MDA1IEYzMDBcbkcxIFgxMDUuMjY1MzExNzg3NTgwMTkgWTI2MC40MjA4NDEwNTkwMzk3MyBGMzAwXG5HMSBYMTA3LjE0MzEyNjYzMjA3NDY0IFkyNjMuMTM0OTkyMTYyMDE3NyBGMzAwXG5HMSBYMTA5LjYxNjg2NzI5MzMwNjYgWTI2NS4zMTk4MDYwOTkzOTcxIEYzMDBcbkcxIFgxMTIuNTQyMjUyMjYyNjYyOTQgWTI2Ni44NDc4NTMwODIwMDczIEYzMDBcbkcxIFgxMTUuNzQ4NjU3NzcwNTM1MjIgWTI2Ny42MzAwMDk0MDg1MDg3IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTI2Ny43MjUzODcgRjMwMFxuRzEgWDEyMC42MzY2ODQxNDkwODcxIFkyNjcuMzI2ODQ5MDQ2OTQ3NCBGMzAwXG5HMSBYMTIzLjcyMTg2ODQ4NDI5MTIyIFkyNjYuMTU0NDgyODg0OTQzOCBGMzAwXG5HMSBYMTI2LjQzNjAxODkwMDIzMDE1IFkyNjQuMjc2NjY3MDQ3NDE5MSBGMzAwXG5HMSBYMTI4LjYyMDgzMTkzMjUzODQgWTI2MS44MDI5MjU1ODY4MjYzIEYzMDBcbkcxIFgxMzAuMTQ4ODc3ODQ0ODMzNjYgWTI1OC44Nzc1NDAwNTg0MDE0IEYzMDBcbkcxIFgxMzAuOTMxMDMyOTk4MjAyODUgWTI1NS42NzExMzQyNjQzNjA2NiBGMzAwXG5HMSBYMTMxLjAyNjQxIFkyNTQuMDU5MzgyMDAwMDAwMDYgRjMwMFxuRzEgWDEzMS4wMjY0MSBZMjU0LjA1OTM4MiBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTEzXG5HMCBYMTU0LjYzNzYgWTI1NC4wNTkzODJcbkcxIFgxNTQuMjM5MDYzNzI1MTIwNDcgWTI1MC43ODMxMDc2NDY3NzQyMyBGMzAwXG5HMSBYMTUzLjA2NjY5OTE0MzQxMDA2IFkyNDcuNjk3OTIyNzExMDYxMTIgRjMwMFxuRzEgWDE1MS4xODg4ODQ2OTYxMjc2NyBZMjQ0Ljk4Mzc3MTMzMzI2Nzc4IEYzMDBcbkcxIFgxNDguNzE1MTQ0MzU0NjQwMDUgWTI0Mi43OTg5NTcwMzM4NiBGMzAwXG5HMSBYMTQ1Ljc4OTc1OTYwODkxMTE3IFkyNDEuMjcwOTA5NjIzMTI0MDYgRjMwMFxuRzEgWDE0Mi41ODMzNTQyMTU1MDYzNSBZMjQwLjQ4ODc1MjgyNzM2OTg2IEYzMDBcbkcxIFgxNDAuOTcxNiBZMjQwLjM5MzM3NTAwMDAwMDAyIEYzMDBcbkcxIFgxMzcuNjk1MzI1NTU5Mjg2NTIgWTI0MC43OTE5MTA1NTU2NjI5IEYzMDBcbkcxIFgxMzQuNjEwMTQwMzY2MjEyODcgWTI0MS45NjQyNzQ0NjAxMDUxMiBGMzAwXG5HMSBYMTMxLjg5NTk4ODU3NjE5NjY2IFkyNDMuODQyMDg4MzExNTY5NiBGMzAwXG5HMSBYMTI5LjcxMTE3MzczMzc0NjczIFkyNDYuMzE1ODI4MTczNDQwOCBGMzAwXG5HMSBYMTI4LjE4MzEyNTY4MDgyMjQzIFkyNDkuMjQxMjEyNTgzNzI4NDcgRjMwMFxuRzEgWDEyNy40MDA5NjgxODExODk0NyBZMjUyLjQ0NzYxNzgwNTQzMiBGMzAwXG5HMSBYMTI3LjMwNTU5MDAwMDAwMDAxIFkyNTQuMDU5MzgyMDAwMDAwMDMgRjMwMFxuRzEgWDEyNy43MDQxMjY3NTQzNTc2NyBZMjU3LjMzNTY1NjI5NDkwMDUgRjMwMFxuRzEgWDEyOC44NzY0OTE3ODc1ODA1MyBZMjYwLjQyMDg0MTA1OTAzOTcgRjMwMFxuRzEgWDEzMC43NTQzMDY2MzIwNzUxMyBZMjYzLjEzNDk5MjE2MjAxNzQ1IEYzMDBcbkcxIFgxMzMuMjI4MDQ3MjkzMzA3MiBZMjY1LjMxOTgwNjA5OTM5NjggRjMwMFxuRzEgWDEzNi4xNTM0MzIyNjI2NjM2IFkyNjYuODQ3ODUzMDgyMDA2OCBGMzAwXG5HMSBYMTM5LjM1OTgzNzc3MDUzNTk2IFkyNjcuNjMwMDA5NDA4NTA4MSBGMzAwXG5HMSBYMTQwLjk3MTYgWTI2Ny43MjUzODY5OTk5OTk5NiBGMzAwXG5HMSBYMTQ0LjI0Nzg3NDE0OTA4NzEyIFkyNjcuMzI2ODQ5MDQ2OTQ3NCBGMzAwXG5HMSBYMTQ3LjMzMzA1ODQ4NDI5MTIzIFkyNjYuMTU0NDgyODg0OTQzOCBGMzAwXG5HMSBYMTUwLjA0NzIwODkwMDIzMDE1IFkyNjQuMjc2NjY3MDQ3NDE5MSBGMzAwXG5HMSBYMTUyLjIzMjAyMTkzMjUzODQzIFkyNjEuODAyOTI1NTg2ODI2MyBGMzAwXG5HMSBYMTUzLjc2MDA2Nzg0NDgzMzY2IFkyNTguODc3NTQwMDU4NDAxNCBGMzAwXG5HMSBYMTU0LjU0MjIyMjk5ODIwMjg1IFkyNTUuNjcxMTM0MjY0MzYwNjMgRjMwMFxuRzEgWDE1NC42Mzc2IFkyNTQuMDU5MzgyMDAwMDAwMDYgRjMwMFxuRzEgWDE1NC42Mzc2IFkyNTQuMDU5MzgyIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMTRcbkcwIFgxNzguMjQ4ODEgWTI1NC4wNTkzODJcbkcxIFgxNzcuODUwMjczNzI1MTIxODcgWTI1MC43ODMxMDc2NDY3NzQwMyBGMzAwXG5HMSBYMTc2LjY3NzkwOTE0MzQxMjggWTI0Ny42OTc5MjI3MTEwNjA0NCBGMzAwXG5HMSBYMTc0LjgwMDA5NDY5NjEzMTU3IFkyNDQuOTgzNzcxMzMzMjY2MyBGMzAwXG5HMSBYMTcyLjMyNjM1NDM1NDY0NDg4IFkyNDIuNzk4OTU3MDMzODU3NDggRjMwMFxuRzEgWDE2OS40MDA5Njk2MDg5MTY2NSBZMjQxLjI3MDkwOTYyMzEyMDI1IEYzMDBcbkcxIFgxNjYuMTk0NTY0MjE1NTEyMTcgWTI0MC40ODg3NTI4MjczNjQ3MiBGMzAwXG5HMSBYMTY0LjU4Mjc5IFkyNDAuMzkzMzc1MDAwMDAwMDIgRjMwMFxuRzEgWDE2MS4zMDY1MTYxNDI1NDA5NyBZMjQwLjc5MTkxNTM1MDQ0MjIyIEYzMDBcbkcxIFgxNTguMjIxMzMyNjY1MjA4MDggWTI0MS45NjQyODM3NzAwMDY2IEYzMDBcbkcxIFgxNTUuNTA3MTgzNjIzMzQ3OSBZMjQzLjg0MjEwMTU5MzU5MDUgRjMwMFxuRzEgWDE1My4zMjIzNzI0MDExODI0NiBZMjQ2LjMxNTg0NDY1MjkwMzY1IEYzMDBcbkcxIFgxNTEuNzk0MzI4NjI5NTE3MDggWTI0OS4yNDEyMzEyOTk0NjQyIEYzMDBcbkcxIFgxNTEuMDEyMTc1ODIyNDEyMTMgWTI1Mi40NDc2Mzc2NjU4NDAzOCBGMzAwXG5HMSBYMTUwLjkxNjgwMDAwMDAwMDAyIFkyNTQuMDU5MzgyMDAwMDAwMDMgRjMwMFxuRzEgWDE1MS4zMTUzMzY3NTQzNTU1NyBZMjU3LjMzNTY1NjI5NDkwMDggRjMwMFxuRzEgWDE1Mi40ODc3MDE3ODc1NzY0NCBZMjYwLjQyMDg0MTA1OTA0MDY0IEYzMDBcbkcxIFgxNTQuMzY1NTE2NjMyMDY5MyBZMjYzLjEzNDk5MjE2MjAxOTcgRjMwMFxuRzEgWDE1Ni44MzkyNTcyOTMyOTk5NyBZMjY1LjMxOTgwNjA5OTQwMDY0IEYzMDBcbkcxIFgxNTkuNzY0NjQyMjYyNjU1NCBZMjY2Ljg0Nzg1MzA4MjAxMjUgRjMwMFxuRzEgWDE2Mi45NzEwNDc3NzA1MjcyNCBZMjY3LjYzMDAwOTQwODUxNTgzIEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDIgWTI2Ny43MjUzODcgRjMwMFxuRzEgWDE2Ny44NTkwNjQ3MzIzMzgwOCBZMjY3LjMyNjg1Mzg0MTcyNzEgRjMwMFxuRzEgWDE3MC45NDQyNTA3ODMyNzk2NCBZMjY2LjE1NDQ5MjE5NDg0NjkgRjMwMFxuRzEgWDE3My42NTg0MDM5NDczNzE2NSBZMjY0LjI3NjY4MDMyOTQ0MzcgRjMwMFxuRzEgWDE3NS44NDMyMjA1OTk5NjIwNSBZMjYxLjgwMjk0MjA2NjI5NTUgRjMwMFxuRzEgWDE3Ny4zNzEyNzA3OTM1MTQ2IFkyNTguODc3NTU4Nzc0MTQ2NTYgRjMwMFxuRzEgWDE3OC4xNTM0MzA2Mzk0MTA5NyBZMjU1LjY3MTE1NDEyNDc4MTkgRjMwMFxuRzEgWDE3OC4yNDg4MSBZMjU0LjA1OTM4MTk5OTk5OTk3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMTVcbkcwIFgyMDEuODYgWTI1NC4wNTkzODJcbkcxIFgyMDEuNDYxNDYzNzI1MTIyNDMgWTI1MC43ODMxMDc2NDY3NzM5NyBGMzAwXG5HMSBYMjAwLjI4OTA5OTE0MzQxMzg0IFkyNDcuNjk3OTIyNzExMDYwMjIgRjMwMFxuRzEgWDE5OC40MTEyODQ2OTYxMzMwNyBZMjQ0Ljk4Mzc3MTMzMzI2NTc2IEYzMDBcbkcxIFgxOTUuOTM3NTQ0MzU0NjQ2NzUgWTI0Mi43OTg5NTcwMzM4NTY1NCBGMzAwXG5HMSBYMTkzLjAxMjE1OTYwODkxODggWTI0MS4yNzA5MDk2MjMxMTg4OCBGMzAwXG5HMSBYMTg5LjgwNTc1NDIxNTUxNDQ0IFkyNDAuNDg4NzUyODI3MzYyOCBGMzAwXG5HMSBYMTg4LjE5NDAxIFkyNDAuMzkzMzc1MDAwMDAwMDIgRjMwMFxuRzEgWDE4NC45MTc3MzU1NTkyODY0OCBZMjQwLjc5MTkxMDU1NTY2MjkgRjMwMFxuRzEgWDE4MS44MzI1NTAzNjYyMTI4NCBZMjQxLjk2NDI3NDQ2MDEwNTEyIEYzMDBcbkcxIFgxNzkuMTE4Mzk4NTc2MTk2NjMgWTI0My44NDIwODgzMTE1Njk2IEYzMDBcbkcxIFgxNzYuOTMzNTgzNzMzNzQ2NyBZMjQ2LjMxNTgyODE3MzQ0MDggRjMwMFxuRzEgWDE3NS40MDU1MzU2ODA4MjI0IFkyNDkuMjQxMjEyNTgzNzI4NDcgRjMwMFxuRzEgWDE3NC42MjMzNzgxODExODk0MiBZMjUyLjQ0NzYxNzgwNTQzMiBGMzAwXG5HMSBYMTc0LjUyOCBZMjU0LjA1OTM4MjAwMDAwMDAzIEYzMDBcbkcxIFgxNzQuOTI2NTM2NzU0MzU3NjQgWTI1Ny4zMzU2NTYyOTQ5MDA1IEYzMDBcbkcxIFgxNzYuMDk4OTAxNzg3NTgwNTMgWTI2MC40MjA4NDEwNTkwMzk3IEYzMDBcbkcxIFgxNzcuOTc2NzE2NjMyMDc1MTIgWTI2My4xMzQ5OTIxNjIwMTc1IEYzMDBcbkcxIFgxODAuNDUwNDU3MjkzMzA3MiBZMjY1LjMxOTgwNjA5OTM5NjggRjMwMFxuRzEgWDE4My4zNzU4NDIyNjI2NjM2NCBZMjY2Ljg0Nzg1MzA4MjAwNjg1IEYzMDBcbkcxIFgxODYuNTgyMjQ3NzcwNTM2IFkyNjcuNjMwMDA5NDA4NTA4MSBGMzAwXG5HMSBYMTg4LjE5NDAwOTk5OTk5OTk2IFkyNjcuNzI1Mzg2OTk5OTk5OTYgRjMwMFxuRzEgWDE5MS40NzAyODM4NTc0NTkgWTI2Ny4zMjY4NDY2NDk1NTc4IEYzMDBcbkcxIFgxOTQuNTU1NDY3MzM0NzkxOTMgWTI2Ni4xNTQ0NzgyMjk5OTM0IEYzMDBcbkcxIFgxOTcuMjY5NjE2Mzc2NjUyMSBZMjY0LjI3NjY2MDQwNjQwOTUgRjMwMFxuRzEgWDE5OS40NTQ0Mjc1OTg4MTc1NSBZMjYxLjgwMjkxNzM0NzA5NjQgRjMwMFxuRzEgWDIwMC45ODI0NzEzNzA0ODI5MyBZMjU4Ljg3NzUzMDcwMDUzNTkgRjMwMFxuRzEgWDIwMS43NjQ2MjQxNzc1ODc5IFkyNTUuNjcxMTI0MzM0MTU5NjkgRjMwMFxuRzEgWDIwMS44NiBZMjU0LjA1OTM4MTk5OTk5OTk3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMTZcbkcwIFgzNi41ODE3NDQgWTIzMC40NDgyMTRcbkcxIFgzNi4xODMxOTExODMxMzU1NSBZMjI3LjE3MTk0MTY1OTAzNTQ3IEYzMDBcbkcxIFgzNS4wMTA4MTEwMjQyNjUyNjYgWTIyNC4wODY3NjI2NDI2NTkzOCBGMzAwXG5HMSBYMzMuMTMyOTgyODczMTg5NTc2IFkyMjEuMzcyNjIwNzQ2MDMyMDYgRjMwMFxuRzEgWDMwLjY1OTIzMTUwMDU1MjIxNyBZMjE5LjE4NzgxODkzNjYyODEzIEYzMDBcbkcxIFgyNy43MzM4MzkwMzk3MTE1NzYgWTIxNy42NTk3ODYyOTYyNTEzOCBGMzAwXG5HMSBYMjQuNTI3NDI5Njk3MjE4NjYgWTIxNi44Nzc2NDU2ODk3MjcwNSBGMzAwXG5HMSBYMjIuOTE1NzM5MDAwMDAwMDAyIFkyMTYuNzgyMjc2MDAwMDAwMDIgRjMwMFxuRzEgWDE5LjYzOTQ2NDYzNTEwNDI1NCBZMjE3LjE4MDgxMjE3ODk0MzcgRjMwMFxuRzEgWDE2LjU1NDI3OTY2NTA2MjAxNSBZMjE4LjM1MzE3NjY3MDMxMzc2IEYzMDBcbkcxIFgxMy44NDAxMjgyMzIyODI1MzYgWTIyMC4yMzA5OTEwMzgxMjAzOCBGMzAwXG5HMSBYMTEuNjU1MzEzODYwNDM4NzI4IFkyMjIuNzA0NzMxMzE1NjMyMjcgRjMwMFxuRzEgWDEwLjEyNzI2NjM2NDA0MTY4OCBZMjI1LjYzMDExNjAxNjYxNjg1IEYzMDBcbkcxIFg5LjM0NTEwOTQ3NDM5NzU2IFkyMjguODM2NTIxMzg3MTE4NTggRjMwMFxuRzEgWDkuMjQ5NzMxNTk5OTk5OTk5IFkyMzAuNDQ4MjE0MDAwMDAwMDQgRjMwMFxuRzEgWDkuNjQ4MjY3NjM1MTQwODU2IFkyMzMuNzI0NDg4MzgyMzg4MzYgRjMwMFxuRzEgWDEwLjgyMDYzMTk5MTA5NTQwNCBZMjM2LjgwOTY3MzQwMzg4ODI3IEYzMDBcbkcxIFgxMi42OTg0NDYyMzk3NzE5OTggWTIzOS41MjM4MjQ5MTkwODkxMiBGMzAwXG5HMSBYMTUuMTcyMTg2NDIxMzg3NjQzIFkyNDEuNzA4NjM5Mzk5NTEwODIgRjMwMFxuRzEgWDE4LjA5NzU3MTA1NTMwMjkwNyBZMjQzLjIzNjY4NzAyNDMwOTQgRjMwMFxuRzEgWDIxLjMwMzk3NjM5MTQ3NDAzOCBZMjQ0LjAxODg0NDA1NDY4OTYyIEYzMDBcbkcxIFgyMi45MTU3MzkgWTI0NC4xMTQyMjE5OTk5OTk5OCBGMzAwXG5HMSBYMjYuMTkyMDEzMjk0OTAwNTM0IFkyNDMuNzE1Njg1MjQ1NjQyMjIgRjMwMFxuRzEgWDI5LjI3NzE5ODA1OTAzOTY1IFkyNDIuNTQzMzIwMjEyNDE5MjUgRjMwMFxuRzEgWDMxLjk5MTM0OTE2MjAxNzQxNCBZMjQwLjY2NTUwNTM2NzkyNDU3IEYzMDBcbkcxIFgzNC4xNzYxNjMwOTkzOTY2NSBZMjM4LjE5MTc2NDcwNjY5MjQgRjMwMFxuRzEgWDM1LjcwNDIxMDA4MjAwNjU1NCBZMjM1LjI2NjM3OTczNzMzNTkgRjMwMFxuRzEgWDM2LjQ4NjM2NjQwODUwNzcxIFkyMzIuMDU5OTc0MjI5NDYzNTYgRjMwMFxuRzEgWDM2LjU4MTc0NCBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTE3XG5HMCBYNjAuMTkyOTIyIFkyMzAuNDQ4MjE0XG5HMSBYNTkuNzk0MzY5MTgzMTM1NTUgWTIyNy4xNzE5NDE2NTkwMzU0NyBGMzAwXG5HMSBYNTguNjIxOTg5MDI0MjY1MjYgWTIyNC4wODY3NjI2NDI2NTkzOCBGMzAwXG5HMSBYNTYuNzQ0MTYwODczMTg5NTcgWTIyMS4zNzI2MjA3NDYwMzIwNiBGMzAwXG5HMSBYNTQuMjcwNDA5NTAwNTUyMjIgWTIxOS4xODc4MTg5MzY2MjgxMyBGMzAwXG5HMSBYNTEuMzQ1MDE3MDM5NzExNTcgWTIxNy42NTk3ODYyOTYyNTEzOCBGMzAwXG5HMSBYNDguMTM4NjA3Njk3MjE4NjYgWTIxNi44Nzc2NDU2ODk3MjcwNSBGMzAwXG5HMSBYNDYuNTI2OTE3IFkyMTYuNzgyMjc2MDAwMDAwMDIgRjMwMFxuRzEgWDQzLjI1MDY0MjYxNzYwNjcgWTIxNy4xODA4MTIwMzUxMDAzMyBGMzAwXG5HMSBYNDAuMTY1NDU3NTk2MDkyMjk1IFkyMTguMzUzMTc2MzkxMDE2NyBGMzAwXG5HMSBYMzcuNDUxMzA2MDgwODY4MTg2IFkyMjAuMjMwOTkwNjM5NjU5NyBGMzAwXG5HMSBYMzUuMjY2NDkxNjAwNDE1ODkgWTIyMi43MDQ3MzA4MjEyNDgzIEYzMDBcbkcxIFgzMy43Mzg0NDM5NzU1ODExMyBZMjI1LjYzMDExNTQ1NTE0NDY1IEYzMDBcbkcxIFgzMi45NTYyODY5NDUxNjEyIFkyMjguODM2NTIwNzkxMzA2MSBGMzAwXG5HMSBYMzIuODYwOTA4OTk5OTk5OTkgWTIzMC40NDgyMTQgRjMwMFxuRzEgWDMzLjI1OTQ0NTAzNTE0MDgzIFkyMzMuNzI0NDg4MzgyMzg4MzYgRjMwMFxuRzEgWDM0LjQzMTgwOTM5MTA5NTM2IFkyMzYuODA5NjczNDAzODg4MjcgRjMwMFxuRzEgWDM2LjMwOTYyMzYzOTc3MTkzIFkyMzkuNTIzODI0OTE5MDg5MTIgRjMwMFxuRzEgWDM4Ljc4MzM2MzgyMTM4NzU1IFkyNDEuNzA4NjM5Mzk5NTEwODIgRjMwMFxuRzEgWDQxLjcwODc0ODQ1NTMwMjgxIFkyNDMuMjM2Njg3MDI0MzA5NCBGMzAwXG5HMSBYNDQuOTE1MTUzNzkxNDczOTU1IFkyNDQuMDE4ODQ0MDU0Njg5NjggRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMjQ0LjExNDIyMTk5OTk5OTk4IEYzMDBcbkcxIFg0OS44MDMxOTEyOTQ5MDA1NCBZMjQzLjcxNTY4NTI0NTY0MjIyIEYzMDBcbkcxIFg1Mi44ODgzNzYwNTkwMzk2NiBZMjQyLjU0MzMyMDIxMjQxOTI1IEYzMDBcbkcxIFg1NS42MDI1MjcxNjIwMTc0MjQgWTI0MC42NjU1MDUzNjc5MjQ1NyBGMzAwXG5HMSBYNTcuNzg3MzQxMDk5Mzk2NjYgWTIzOC4xOTE3NjQ3MDY2OTI0IEYzMDBcbkcxIFg1OS4zMTUzODgwODIwMDY1NjQgWTIzNS4yNjYzNzk3MzczMzU5IEYzMDBcbkcxIFg2MC4wOTc1NDQ0MDg1MDc3MiBZMjMyLjA1OTk3NDIyOTQ2MzU2IEYzMDBcbkcxIFg2MC4xOTI5MjIwMDAwMDAwMSBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTE4XG5HMCBYODMuODA0MDkgWTIzMC40NDgyMTRcbkcxIFg4My40MDU1MzcxODMxMzU1OCBZMjI3LjE3MTk0MTY1OTAzNTQ0IEYzMDBcbkcxIFg4Mi4yMzMxNTcwMjQyNjUzMiBZMjI0LjA4Njc2MjY0MjY1OTM1IEYzMDBcbkcxIFg4MC4zNTUzMjg4NzMxODk2NiBZMjIxLjM3MjYyMDc0NjAzMjA2IEYzMDBcbkcxIFg3Ny44ODE1Nzc1MDA1NTIzMSBZMjE5LjE4NzgxODkzNjYyODA4IEYzMDBcbkcxIFg3NC45NTYxODUwMzk3MTE2OCBZMjE3LjY1OTc4NjI5NjI1MTMgRjMwMFxuRzEgWDcxLjc0OTc3NTY5NzIxODc4IFkyMTYuODc3NjQ1Njg5NzI2OTYgRjMwMFxuRzEgWDcwLjEzODA4MiBZMjE2Ljc4MjI3NjAwMDAwMDAyIEYzMDBcbkcxIFg2Ni44NjE4MDc3MDUwOTQ1MiBZMjE3LjE4MDgxMjc1NDMxNzI2IEYzMDBcbkcxIFg2My43NzY2MjI5NDA5NDA5MyBZMjE4LjM1MzE3Nzc4NzUwMjA2IEYzMDBcbkcxIFg2MS4wNjI0NzE4Mzc5Mzk5NSBZMjIwLjIzMDk5MjYzMTk2MzE4IEYzMDBcbkcxIFg1OC44Nzc2NTc5MDA1MzAwOTYgWTIyMi43MDQ3MzMyOTMxNjgzMiBGMzAwXG5HMSBYNTcuMzQ5NjEwOTE3ODg0MDEgWTIyNS42MzAxMTgyNjI1MDU4NyBGMzAwXG5HMSBYNTYuNTY3NDU0NTkxMzQzMTg2IFkyMjguODM2NTIzNzcwMzY4NiBGMzAwXG5HMSBYNTYuNDcyMDc2OTk5OTk5OTkgWTIzMC40NDgyMTQgRjMwMFxuRzEgWDU2Ljg3MDYxMzAzNTE0MDg2IFkyMzMuNzI0NDg4MzgyMzg4NCBGMzAwXG5HMSBYNTguMDQyOTc3MzkxMDk1NDA1IFkyMzYuODA5NjczNDAzODg4MjQgRjMwMFxuRzEgWDU5LjkyMDc5MTYzOTc3MjAwNiBZMjM5LjUyMzgyNDkxOTA4OTEyIEYzMDBcbkcxIFg2Mi4zOTQ1MzE4MjEzODc2MyBZMjQxLjcwODYzOTM5OTUxMDggRjMwMFxuRzEgWDY1LjMxOTkxNjQ1NTMwMjg3IFkyNDMuMjM2Njg3MDI0MzA5MzMgRjMwMFxuRzEgWDY4LjUyNjMyMTc5MTQ3NDAyIFkyNDQuMDE4ODQ0MDU0Njg5NiBGMzAwXG5HMSBYNzAuMTM4MDgyMDAwMDAwMDEgWTI0NC4xMTQyMjE5OTk5OTk5OCBGMzAwXG5HMSBYNzMuNDE0MzU2MzgyMzg4MzMgWTI0My43MTU2ODU5NjQ4NTkxNSBGMzAwXG5HMSBYNzYuNDk5NTQxNDAzODg4MjIgWTI0Mi41NDMzMjE2MDg5MDQ2NSBGMzAwXG5HMSBYNzkuMjEzNjkyOTE5MDg5MSBZMjQwLjY2NTUwNzM2MDIyODA4IEYzMDBcbkcxIFg4MS4zOTg1MDczOTk1MTA4IFkyMzguMTkxNzY3MTc4NjEyNDggRjMwMFxuRzEgWDgyLjkyNjU1NTAyNDMwOTQgWTIzNS4yNjYzODI1NDQ2OTcyNSBGMzAwXG5HMSBYODMuNzA4NzEyMDU0Njg5NjggWTIzMi4wNTk5NzcyMDg1MjYxMyBGMzAwXG5HMSBYODMuODA0MDkgWTIzMC40NDgyMTQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUxOVxuRzAgWDEwNy40MTUyNSBZMjMwLjQ0ODIxNFxuRzEgWDEwNy4wMTY2OTcxODMxMzU5NyBZMjI3LjE3MTk0MTY1OTAzNTQgRjMwMFxuRzEgWDEwNS44NDQzMTcwMjQyNjYwOCBZMjI0LjA4Njc2MjY0MjY1OTE1IEYzMDBcbkcxIFgxMDMuOTY2NDg4ODczMTkwNzQgWTIyMS4zNzI2MjA3NDYwMzE2IEYzMDBcbkcxIFgxMDEuNDkyNzM3NTAwNTUzNjcgWTIxOS4xODc4MTg5MzY2MjczNyBGMzAwXG5HMSBYOTguNTY3MzQ1MDM5NzEzMjIgWTIxNy42NTk3ODYyOTYyNTAyMiBGMzAwXG5HMSBYOTUuMzYwOTM1Njk3MjIwNDQgWTIxNi44Nzc2NDU2ODk3MjU1IEYzMDBcbkcxIFg5My43NDkyNTEgWTIxNi43ODIyNzYwMDAwMDAwMiBGMzAwXG5HMSBYOTAuNDcyOTc2NjE3NjA2NyBZMjE3LjE4MDgxMjAzNTEwMDMzIEYzMDBcbkcxIFg4Ny4zODc3OTE1OTYwOTIzIFkyMTguMzUzMTc2MzkxMDE2NyBGMzAwXG5HMSBYODQuNjczNjQwMDgwODY4MTggWTIyMC4yMzA5OTA2Mzk2NTk3IEYzMDBcbkcxIFg4Mi40ODg4MjU2MDA0MTU5IFkyMjIuNzA0NzMwODIxMjQ4MyBGMzAwXG5HMSBYODAuOTYwNzc3OTc1NTgxMTIgWTIyNS42MzAxMTU0NTUxNDQ2NSBGMzAwXG5HMSBYODAuMTc4NjIwOTQ1MTYxMiBZMjI4LjgzNjUyMDc5MTMwNjEgRjMwMFxuRzEgWDgwLjA4MzI0MyBZMjMwLjQ0ODIxNCBGMzAwXG5HMSBYODAuNDgxNzc5MDM1MTQwODMgWTIzMy43MjQ0ODgzODIzODgzNiBGMzAwXG5HMSBYODEuNjU0MTQzMzkxMDk1MzYgWTIzNi44MDk2NzM0MDM4ODgyNyBGMzAwXG5HMSBYODMuNTMxOTU3NjM5NzcxOTMgWTIzOS41MjM4MjQ5MTkwODkxMiBGMzAwXG5HMSBYODYuMDA1Njk3ODIxMzg3NTYgWTI0MS43MDg2MzkzOTk1MTA4MiBGMzAwXG5HMSBYODguOTMxMDgyNDU1MzAyODEgWTI0My4yMzY2ODcwMjQzMDk0IEYzMDBcbkcxIFg5Mi4xMzc0ODc3OTE0NzM5NiBZMjQ0LjAxODg0NDA1NDY4OTY4IEYzMDBcbkcxIFg5My43NDkyNTEwMDAwMDAwMyBZMjQ0LjExNDIyMTk5OTk5OTk4IEYzMDBcbkcxIFg5Ny4wMjU1MjUxMTk5MjQzOCBZMjQzLjcxNTY4MzgwNzIwODQgRjMwMFxuRzEgWDEwMC4xMTA3MDkzNjkzNDE0NSBZMjQyLjU0MzMxNzQxOTQ0ODcgRjMwMFxuRzEgWDEwMi44MjQ4NTk2NDc4NzI1OSBZMjQwLjY2NTUwMTM4MzMxODA2IEYzMDBcbkcxIFgxMDUuMDA5NjcyNDk5MTY2NjUgWTIzOC4xOTE3NTk3NjI4NTMxNCBGMzAwXG5HMSBYMTA2LjUzNzcxODE5NzM5ODk3IFkyMzUuMjY2Mzc0MTIyNjE0NjIgRjMwMFxuRzEgWDEwNy4zMTk4NzMxMTYxNDE3OCBZMjMyLjA1OTk2ODI3MTM0MDI3IEYzMDBcbkcxIFgxMDcuNDE1MjUgWTIzMC40NDgyMTQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUyMFxuRzAgWDEzMS4wMjY0MSBZMjMwLjQ0ODIxNFxuRzEgWDEzMC42Mjc4NTcxODMxMzU4NiBZMjI3LjE3MTk0MTY1OTAzNTM4IEYzMDBcbkcxIFgxMjkuNDU1NDc3MDI0MjY1ODYgWTIyNC4wODY3NjI2NDI2NTkyIEYzMDBcbkcxIFgxMjcuNTc3NjQ4ODczMTkwNDQgWTIyMS4zNzI2MjA3NDYwMzE3NCBGMzAwXG5HMSBYMTI1LjEwMzg5NzUwMDU1MzI5IFkyMTkuMTg3ODE4OTM2NjI3NiBGMzAwXG5HMSBYMTIyLjE3ODUwNTAzOTcxMjggWTIxNy42NTk3ODYyOTYyNTA1NiBGMzAwXG5HMSBYMTE4Ljk3MjA5NTY5NzIxOTk2IFkyMTYuODc3NjQ1Njg5NzI1OTQgRjMwMFxuRzEgWDExNy4zNjA0MSBZMjE2Ljc4MjI3NjAwMDAwMDAyIEYzMDBcbkcxIFgxMTQuMDg0MTM1ODUwOTA3OTMgWTIxNy4xODA4MTM5NTMwMTIxMiBGMzAwXG5HMSBYMTEwLjk5ODk1MTUxNTY4OTMxIFkyMTguMzUzMTgwMTE0OTc3NTMgRjMwMFxuRzEgWDEwOC4yODQ4MDEwOTk3MjcxNiBZMjIwLjIzMDk5NTk1MjQ2ODY1IEYzMDBcbkcxIFgxMDYuMDk5OTg4MDY3Mzg4MjcgWTIyMi43MDQ3Mzc0MTMwMzQ0MiBGMzAwXG5HMSBYMTA0LjU3MTk0MjE1NTA1NjgzIFkyMjUuNjMwMTIyOTQxNDQwNCBGMzAwXG5HMSBYMTAzLjc4OTc4NzAwMTY0Nzk1IFkyMjguODM2NTI4NzM1NDcxNDYgRjMwMFxuRzEgWDEwMy42OTQ0MSBZMjMwLjQ0ODIxMzk5OTk5OTk4IEYzMDBcbkcxIFgxMDQuMDkyOTQ2MDM1MTQwNTYgWTIzMy43MjQ0ODgzODIzODg0MiBGMzAwXG5HMSBYMTA1LjI2NTMxMDM5MTA5NDgxIFkyMzYuODA5NjczNDAzODg4NCBGMzAwXG5HMSBYMTA3LjE0MzEyNDYzOTc3MTE2IFkyMzkuNTIzODI0OTE5MDg5NDYgRjMwMFxuRzEgWDEwOS42MTY4NjQ4MjEzODY2IFkyNDEuNzA4NjM5Mzk5NTExMzggRjMwMFxuRzEgWDExMi41NDIyNDk0NTUzMDE3IFkyNDMuMjM2Njg3MDI0MzEwMiBGMzAwXG5HMSBYMTE1Ljc0ODY1NDc5MTQ3Mjc1IFkyNDQuMDE4ODQ0MDU0NjkwNzYgRjMwMFxuRzEgWDExNy4zNjA0MTAwMDAwMDAwMiBZMjQ0LjExNDIyMiBGMzAwXG5HMSBYMTIwLjYzNjY4NDE0OTA4NzE1IFkyNDMuNzE1Njg0MDQ2OTQ3NCBGMzAwXG5HMSBYMTIzLjcyMTg2ODQ4NDI5MTI4IFkyNDIuNTQzMzE3ODg0OTQzOCBGMzAwXG5HMSBYMTI2LjQzNjAxODkwMDIzMDIgWTI0MC42NjU1MDIwNDc0MTkxMiBGMzAwXG5HMSBYMTI4LjYyMDgzMTkzMjUzODUgWTIzOC4xOTE3NjA1ODY4MjYzMiBGMzAwXG5HMSBYMTMwLjE0ODg3Nzg0NDgzMzc1IFkyMzUuMjY2Mzc1MDU4NDAxNDUgRjMwMFxuRzEgWDEzMC45MzEwMzI5OTgyMDI5NCBZMjMyLjA1OTk2OTI2NDM2MDcyIEYzMDBcbkcxIFgxMzEuMDI2NDEgWTIzMC40NDgyMTQgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUyMVxuRzAgWDE1NC42Mzc2IFkyMzAuNDQ4MjE0XG5HMSBYMTU0LjIzOTA0NzE4MzEzNTg1IFkyMjcuMTcxOTQxNjU5MDM1MzggRjMwMFxuRzEgWDE1My4wNjY2NjcwMjQyNjU4NSBZMjI0LjA4Njc2MjY0MjY1OTIgRjMwMFxuRzEgWDE1MS4xODg4Mzg4NzMxOTA0MyBZMjIxLjM3MjYyMDc0NjAzMTc0IEYzMDBcbkcxIFgxNDguNzE1MDg3NTAwNTUzMyBZMjE5LjE4NzgxODkzNjYyNzYgRjMwMFxuRzEgWDE0NS43ODk2OTUwMzk3MTI4MyBZMjE3LjY1OTc4NjI5NjI1MDU2IEYzMDBcbkcxIFgxNDIuNTgzMjg1Njk3MjIgWTIxNi44Nzc2NDU2ODk3MjU5NCBGMzAwXG5HMSBYMTQwLjk3MTYgWTIxNi43ODIyNzYwMDAwMDAwMiBGMzAwXG5HMSBYMTM3LjY5NTMyNTU1OTI4MTYgWTIxNy4xODA4MTE1NTU2MjIzNyBGMzAwXG5HMSBYMTM0LjYxMDE0MDM2NjE5MzQgWTIxOC4zNTMxNzU0NjAwMjY0IEYzMDBcbkcxIFgxMzEuODk1OTg4NTc2MTUzOTcgWTIyMC4yMzA5ODkzMTE0NTcyNSBGMzAwXG5HMSBYMTI5LjcxMTE3MzczMzY3MzQ2IFkyMjIuNzA0NzI5MTczMzAxNDIgRjMwMFxuRzEgWDEyOC4xODMxMjU2ODA3MTI5NSBZMjI1LjYzMDExMzU4MzU3MDIgRjMwMFxuRzEgWDEyNy40MDA5NjgxODEwNDAyNyBZMjI4LjgzNjUxODgwNTI2NDA2IEYzMDBcbkcxIFgxMjcuMzA1NTkwMDAwMDAwMDIgWTIzMC40NDgyMTQgRjMwMFxuRzEgWDEyNy43MDQxMjYwMzUxNDA3MyBZMjMzLjcyNDQ4ODM4MjM4ODQgRjMwMFxuRzEgWDEyOC44NzY0OTAzOTEwOTUxNiBZMjM2LjgwOTY3MzQwMzg4ODMgRjMwMFxuRzEgWDEzMC43NTQzMDQ2Mzk3NzE2NSBZMjM5LjUyMzgyNDkxOTA4OTI2IEYzMDBcbkcxIFgxMzMuMjI4MDQ0ODIxMzg3MiBZMjQxLjcwODYzOTM5OTUxMTA0IEYzMDBcbkcxIFgxMzYuMTUzNDI5NDU1MzAyMzYgWTI0My4yMzY2ODcwMjQzMDk3IEYzMDBcbkcxIFgxMzkuMzU5ODM0NzkxNDczNDcgWTI0NC4wMTg4NDQwNTQ2OTAwOCBGMzAwXG5HMSBYMTQwLjk3MTYwMDAwMDAwMDAyIFkyNDQuMTE0MjIyIEYzMDBcbkcxIFgxNDQuMjQ3ODc0MTQ5MDg3MTUgWTI0My43MTU2ODQwNDY5NDc0IEYzMDBcbkcxIFgxNDcuMzMzMDU4NDg0MjkxMjkgWTI0Mi41NDMzMTc4ODQ5NDM4IEYzMDBcbkcxIFgxNTAuMDQ3MjA4OTAwMjMwMiBZMjQwLjY2NTUwMjA0NzQxOTEyIEYzMDBcbkcxIFgxNTIuMjMyMDIxOTMyNTM4NSBZMjM4LjE5MTc2MDU4NjgyNjMyIEYzMDBcbkcxIFgxNTMuNzYwMDY3ODQ0ODMzNzcgWTIzNS4yNjYzNzUwNTg0MDE0MiBGMzAwXG5HMSBYMTU0LjU0MjIyMjk5ODIwMjk2IFkyMzIuMDU5OTY5MjY0MzYwNyBGMzAwXG5HMSBYMTU0LjYzNzYwMDAwMDAwMDAyIFkyMzAuNDQ4MjE0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMjJcbkcwIFgxNzguMjQ4ODEgWTIzMC40NDgyMTRcbkcxIFgxNzcuODUwMjU3MTgzMTM3MjQgWTIyNy4xNzE5NDE2NTkwMzUyNCBGMzAwXG5HMSBYMTc2LjY3Nzg3NzAyNDI2ODU4IFkyMjQuMDg2NzYyNjQyNjU4NTYgRjMwMFxuRzEgWDE3NC44MDAwNDg4NzMxOTQzIFkyMjEuMzcyNjIwNzQ2MDMwMjYgRjMwMFxuRzEgWDE3Mi4zMjYyOTc1MDA1NTgwNyBZMjE5LjE4NzgxODkzNjYyNTA0IEYzMDBcbkcxIFgxNjkuNDAwOTA1MDM5NzE4MjIgWTIxNy42NTk3ODYyOTYyNDY3NSBGMzAwXG5HMSBYMTY2LjE5NDQ5NTY5NzIyNTcgWTIxNi44Nzc2NDU2ODk3MjA3NyBGMzAwXG5HMSBYMTY0LjU4Mjc5IFkyMTYuNzgyMjc2MDAwMDAwMDIgRjMwMFxuRzEgWDE2MS4zMDY1MTYxNDI1MzYwNSBZMjE3LjE4MDgxNjM1MDQwMTcgRjMwMFxuRzEgWDE1OC4yMjEzMzI2NjUxODg2IFkyMTguMzUzMTg0NzY5OTI3OSBGMzAwXG5HMSBYMTU1LjUwNzE4MzYyMzMwNTIgWTIyMC4yMzEwMDI1OTM0NzgyMiBGMzAwXG5HMSBYMTUzLjMyMjM3MjQwMTEwOTEzIFkyMjIuNzA0NzQ1NjUyNzY0MzMgRjMwMFxuRzEgWDE1MS43OTQzMjg2Mjk0MDc1NyBZMjI1LjYzMDEzMjI5OTMwNTk2IEYzMDBcbkcxIFgxNTEuMDEyMTc1ODIyMjYyOTIgWTIyOC44MzY1Mzg2NjU2NzI1IEYzMDBcbkcxIFgxNTAuOTE2ODAwMDAwMDAwMDIgWTIzMC40NDgyMTQwMDAwMDAwNCBGMzAwXG5HMSBYMTUxLjMxNTMzNjAzNTEzODY0IFkyMzMuNzI0NDg4MzgyMzg4NjQgRjMwMFxuRzEgWDE1Mi40ODc3MDAzOTEwOTExIFkyMzYuODA5NjczNDAzODg5MzUgRjMwMFxuRzEgWDE1NC4zNjU1MTQ2Mzk3NjU4NSBZMjM5LjUyMzgyNDkxOTA5MTQ4IEYzMDBcbkcxIFgxNTYuODM5MjU0ODIxMzggWTI0MS43MDg2MzkzOTk1MTQ4NSBGMzAwXG5HMSBYMTU5Ljc2NDYzOTQ1NTI5NDIgWTI0My4yMzY2ODcwMjQzMTU0IEYzMDBcbkcxIFgxNjIuOTcxMDQ0NzkxNDY0OCBZMjQ0LjAxODg0NDA1NDY5NzggRjMwMFxuRzEgWDE2NC41ODI3OSBZMjQ0LjExNDIyMTk5OTk5OTk4IEYzMDBcbkcxIFgxNjcuODU5MDY0NzMyMzM4MDggWTI0My43MTU2ODg4NDE3MjcxMSBGMzAwXG5HMSBYMTcwLjk0NDI1MDc4MzI3OTY0IFkyNDIuNTQzMzI3MTk0ODQ2OTcgRjMwMFxuRzEgWDE3My42NTg0MDM5NDczNzE2OCBZMjQwLjY2NTUxNTMyOTQ0Mzc2IEYzMDBcbkcxIFgxNzUuODQzMjIwNTk5OTYyMDggWTIzOC4xOTE3NzcwNjYyOTU1NCBGMzAwXG5HMSBYMTc3LjM3MTI3MDc5MzUxNDY3IFkyMzUuMjY2MzkzNzc0MTQ2NjUgRjMwMFxuRzEgWDE3OC4xNTM0MzA2Mzk0MTEwNiBZMjMyLjA1OTk4OTEyNDc4MiBGMzAwXG5HMSBYMTc4LjI0ODgxIFkyMzAuNDQ4MjE0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMjNcbkcwIFgyMDEuODYgWTIzMC40NDgyMTRcbkcxIFgyMDEuNDYxNDQ3MTgzMTM3OCBZMjI3LjE3MTk0MTY1OTAzNTE4IEYzMDBcbkcxIFgyMDAuMjg5MDY3MDI0MjY5NjMgWTIyNC4wODY3NjI2NDI2NTgzMyBGMzAwXG5HMSBYMTk4LjQxMTIzODg3MzE5NTggWTIyMS4zNzI2MjA3NDYwMjk3MiBGMzAwXG5HMSBYMTk1LjkzNzQ4NzUwMDU1OTkgWTIxOS4xODc4MTg5MzY2MjQxIEYzMDBcbkcxIFgxOTMuMDEyMDk1MDM5NzIwMzIgWTIxNy42NTk3ODYyOTYyNDUzMyBGMzAwXG5HMSBYMTg5LjgwNTY4NTY5NzIyNzk3IFkyMTYuODc3NjQ1Njg5NzE4ODMgRjMwMFxuRzEgWDE4OC4xOTQwMSBZMjE2Ljc4MjI3NjAwMDAwMDAyIEYzMDBcbkcxIFgxODQuOTE3NzM1NTU5MjgxNTcgWTIxNy4xODA4MTE1NTU2MjIzNyBGMzAwXG5HMSBYMTgxLjgzMjU1MDM2NjE5MzM3IFkyMTguMzUzMTc1NDYwMDI2NCBGMzAwXG5HMSBYMTc5LjExODM5ODU3NjE1Mzk0IFkyMjAuMjMwOTg5MzExNDU3MjUgRjMwMFxuRzEgWDE3Ni45MzM1ODM3MzM2NzM0MyBZMjIyLjcwNDcyOTE3MzMwMTQyIEYzMDBcbkcxIFgxNzUuNDA1NTM1NjgwNzEyOTIgWTIyNS42MzAxMTM1ODM1NzAyIEYzMDBcbkcxIFgxNzQuNjIzMzc4MTgxMDQwMjQgWTIyOC44MzY1MTg4MDUyNjQwNiBGMzAwXG5HMSBYMTc0LjUyOCBZMjMwLjQ0ODIxNDAwMDAwMDA0IEYzMDBcbkcxIFgxNzQuOTI2NTM2MDM1MTQwNyBZMjMzLjcyNDQ4ODM4MjM4ODM2IEYzMDBcbkcxIFgxNzYuMDk4OTAwMzkxMDk1MTMgWTIzNi44MDk2NzM0MDM4ODgzIEYzMDBcbkcxIFgxNzcuOTc2NzE0NjM5NzcxNjEgWTIzOS41MjM4MjQ5MTkwODkyNCBGMzAwXG5HMSBYMTgwLjQ1MDQ1NDgyMTM4NzE4IFkyNDEuNzA4NjM5Mzk5NTExMDEgRjMwMFxuRzEgWDE4My4zNzU4Mzk0NTUzMDIzOCBZMjQzLjIzNjY4NzAyNDMwOTcgRjMwMFxuRzEgWDE4Ni41ODIyNDQ3OTE0NzM1IFkyNDQuMDE4ODQ0MDU0NjkwMDggRjMwMFxuRzEgWDE4OC4xOTQwMDk5OTk5OTk5NiBZMjQ0LjExNDIyMTk5OTk5OTk4IEYzMDBcbkcxIFgxOTEuNDcwMjgzODU3NDU5IFkyNDMuNzE1NjgxNjQ5NTU3OCBGMzAwXG5HMSBYMTk0LjU1NTQ2NzMzNDc5MTk2IFkyNDIuNTQzMzEzMjI5OTkzNDMgRjMwMFxuRzEgWDE5Ny4yNjk2MTYzNzY2NTIxNSBZMjQwLjY2NTQ5NTQwNjQwOTU1IEYzMDBcbkcxIFgxOTkuNDU0NDI3NTk4ODE3NiBZMjM4LjE5MTc1MjM0NzA5NjQ0IEYzMDBcbkcxIFgyMDAuOTgyNDcxMzcwNDgyOTggWTIzNS4yNjYzNjU3MDA1MzU5IEYzMDBcbkcxIFgyMDEuNzY0NjI0MTc3NTg4IFkyMzIuMDU5OTU5MzM0MTU5NzEgRjMwMFxuRzEgWDIwMS44NiBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTI0XG5HMCBYMzYuNTgxNzQ0IFkyMDYuODM3MTczXG5HMSBYMzYuMTgzMTkyMzgxODI5NzU1IFkyMDMuNTYwOTAwNTEzMjE2NTggRjMwMFxuRzEgWDM1LjAxMDgxMzM1MTczODE1IFkyMDAuNDc1NzIxMDY3OTAwNDIgRjMwMFxuRzEgWDMzLjEzMjk4NjE5MzY4OTM1IFkxOTcuNzYxNTc4NDg0MjI5NzcgRjMwMFxuRzEgWDMwLjY1OTIzNTYyMDQwODU0IFkxOTUuNTc2Nzc1NzY5NzUxMjQgRjMwMFxuRzEgWDI3LjczMzg0MzcxODYzMTQ3NiBZMTk0LjA0ODc0MjA1OTA1NzMgRjMwMFxuRzEgWDI0LjUyNzQzNDY2MjMwMTY0OCBZMTkzLjI2NjYwMDI3OTM5OTc0IEYzMDBcbkcxIFgyMi45MTU3MzkgWTE5My4xNzEyMjk5OTk5OTk5OCBGMzAwXG5HMSBYMTkuNjM5NDY0NjM1MTA0OTU3IFkxOTMuNTY5NzY2MTc4OTQ5NCBGMzAwXG5HMSBYMTYuNTU0Mjc5NjY1MDY0Nzc2IFkxOTQuNzQyMTMwNjcwMzI0ODggRjMwMFxuRzEgWDEzLjg0MDEyODIzMjI4ODU3IFkxOTYuNjE5OTQ1MDM4MTM2MjggRjMwMFxuRzEgWDExLjY1NTMxMzg2MDQ0OTA5IFkxOTkuMDkzNjg1MzE1NjUyIEYzMDBcbkcxIFgxMC4xMjcyNjYzNjQwNTcxOSBZMjAyLjAxOTA3MDAxNjYzOTMgRjMwMFxuRzEgWDkuMzQ1MTA5NDc0NDE4Njk1IFkyMDUuMjI1NDc1Mzg3MTQyMzggRjMwMFxuRzEgWDkuMjQ5NzMxNiBZMjA2LjgzNzE3MyBGMzAwXG5HMSBYOS42NDgyODU4NTUyOTc0MSBZMjEwLjExMzQ0NTE2NTk4MTQgRjMwMFxuRzEgWDEwLjgyMDY2NzM2ODcwMTg5OCBZMjEzLjE5ODYyMzY2NzYyODgyIEYzMDBcbkcxIFgxMi42OTg0OTY3MTE0MDk0OTkgWTIxNS45MTI3NjQ3Mzk4MDM2NiBGMzAwXG5HMSBYMTUuMTcyMjQ5MDQzMjc0Mjg0IFkyMTguMDk3NTY1NDYzMTE3NyBGMzAwXG5HMSBYMTguMDk3NjQyMTc0OTkwNjc1IFkyMTkuNjI1NTk2ODE5MTEzNTggRjMwMFxuRzEgWDIxLjMwNDA1MTg2MDg3ODY3NiBZMjIwLjQwNzczNjAxNzg3Nzg1IEYzMDBcbkcxIFgyMi45MTU3Mzg5OTk5OTk5ODggWTIyMC41MDMxMDUgRjMwMFxuRzEgWDI2LjE5MjAxMzI5NDkwNjM3OCBZMjIwLjEwNDU2ODI0NTY5MDI1IEYzMDBcbkcxIFgyOS4yNzcxOTgwNTkwNjI2NSBZMjE4LjkzMjIwMzIxMjUxMjQ2IEYzMDBcbkcxIFgzMS45OTEzNDkxNjIwNjc5MjMgWTIxNy4wNTQzODgzNjgwNTc1NCBGMzAwXG5HMSBYMzQuMTc2MTYzMDk5NDgzNDI1IFkyMTQuNTgwNjQ3NzA2ODU3MzggRjMwMFxuRzEgWDM1LjcwNDIxMDA4MjEzNjE4IFkyMTEuNjU1MjYyNzM3NTIzMyBGMzAwXG5HMSBYMzYuNDg2MzY2NDA4Njg0MzA0IFkyMDguNDQ4ODU3MjI5NjYyMzcgRjMwMFxuRzEgWDM2LjU4MTc0NCBZMjA2LjgzNzE3MyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTI1XG5HMCBYNjAuMTkyOTIyIFkyMDYuODM3MTczXG5HMSBYNTkuNzk0MzcwMzgxODI5NzY1IFkyMDMuNTYwOTAwNTEzMjE2NiBGMzAwXG5HMSBYNTguNjIxOTkxMzUxNzM4MTcgWTIwMC40NzU3MjEwNjc5MDA0NSBGMzAwXG5HMSBYNTYuNzQ0MTY0MTkzNjg5MzY1IFkxOTcuNzYxNTc4NDg0MjI5OCBGMzAwXG5HMSBYNTQuMjcwNDEzNjIwNDA4NTQgWTE5NS41NzY3NzU3Njk3NTEyNCBGMzAwXG5HMSBYNTEuMzQ1MDIxNzE4NjMxNDggWTE5NC4wNDg3NDIwNTkwNTczIEYzMDBcbkcxIFg0OC4xMzg2MTI2NjIzMDE2NSBZMTkzLjI2NjYwMDI3OTM5OTc0IEYzMDBcbkcxIFg0Ni41MjY5MTcgWTE5My4xNzEyMjk5OTk5OTk5OCBGMzAwXG5HMSBYNDMuMjUwNjQyNjE3NjA3NDI2IFkxOTMuNTY5NzY2MDM1MTA2MDYgRjMwMFxuRzEgWDQwLjE2NTQ1NzU5NjA5NTA3NCBZMTk0Ljc0MjEzMDM5MTAyNzggRjMwMFxuRzEgWDM3LjQ1MTMwNjA4MDg3NDI1NCBZMTk2LjYxOTk0NDYzOTY3NTU3IEYzMDBcbkcxIFgzNS4yNjY0OTE2MDA0MjYzMDYgWTE5OS4wOTM2ODQ4MjEyNjc5NyBGMzAwXG5HMSBYMzMuNzM4NDQzOTc1NTk2NjcgWTIwMi4wMTkwNjk0NTUxNjY5NyBGMzAwXG5HMSBYMzIuOTU2Mjg2OTQ1MTgyMzUgWTIwNS4yMjU0NzQ3OTEzMjk4IEYzMDBcbkcxIFgzMi44NjA5MDg5OTk5OTk5OSBZMjA2LjgzNzE3MyBGMzAwXG5HMSBYMzMuMjU5NDYzMjU1Mjk3MzggWTIxMC4xMTM0NDUxNjU5ODEzNyBGMzAwXG5HMSBYMzQuNDMxODQ0NzY4NzAxODQgWTIxMy4xOTg2MjM2Njc2Mjg4MiBGMzAwXG5HMSBYMzYuMzA5Njc0MTExNDA5NDEgWTIxNS45MTI3NjQ3Mzk4MDM2NiBGMzAwXG5HMSBYMzguNzgzNDI2NDQzMjc0MTUgWTIxOC4wOTc1NjU0NjMxMTc3IEYzMDBcbkcxIFg0MS43MDg4MTk1NzQ5OTA1MyBZMjE5LjYyNTU5NjgxOTExMzYgRjMwMFxuRzEgWDQ0LjkxNTIyOTI2MDg3ODUyIFkyMjAuNDA3NzM2MDE3ODc3OTQgRjMwMFxuRzEgWDQ2LjUyNjkxNjk5OTk5OTk5IFkyMjAuNTAzMTA1IEYzMDBcbkcxIFg0OS44MDMxOTEyOTQ5MDYzOCBZMjIwLjEwNDU2ODI0NTY5MDI1IEYzMDBcbkcxIFg1Mi44ODgzNzYwNTkwNjI2NSBZMjE4LjkzMjIwMzIxMjUxMjUgRjMwMFxuRzEgWDU1LjYwMjUyNzE2MjA2NzkxIFkyMTcuMDU0Mzg4MzY4MDU3NTcgRjMwMFxuRzEgWDU3Ljc4NzM0MTA5OTQ4MzQgWTIxNC41ODA2NDc3MDY4NTc0MyBGMzAwXG5HMSBYNTkuMzE1Mzg4MDgyMTM2MTYgWTIxMS42NTUyNjI3Mzc1MjMzNyBGMzAwXG5HMSBYNjAuMDk3NTQ0NDA4Njg0MyBZMjA4LjQ0ODg1NzIyOTY2MjQ4IEYzMDBcbkcxIFg2MC4xOTI5MjIwMDAwMDAwMSBZMjA2LjgzNzE3MyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTI2XG5HMCBYODMuODA0MDkgWTIwNi44MzcxNzNcbkcxIFg4My40MDU1MzgzODE4Mjk3OSBZMjAzLjU2MDkwMDUxMzIxNjY0IEYzMDBcbkcxIFg4Mi4yMzMxNTkzNTE3MzgyMSBZMjAwLjQ3NTcyMTA2NzkwMDQ1IEYzMDBcbkcxIFg4MC4zNTUzMzIxOTM2ODk0MyBZMTk3Ljc2MTU3ODQ4NDIyOTggRjMwMFxuRzEgWDc3Ljg4MTU4MTYyMDQwODYyIFkxOTUuNTc2Nzc1NzY5NzUxMjQgRjMwMFxuRzEgWDc0Ljk1NjE4OTcxODYzMTU1IFkxOTQuMDQ4NzQyMDU5MDU3MjUgRjMwMFxuRzEgWDcxLjc0OTc4MDY2MjMwMTcyIFkxOTMuMjY2NjAwMjc5Mzk5NjUgRjMwMFxuRzEgWDcwLjEzODA4MiBZMTkzLjE3MTIyOTk5OTk5OTk4IEYzMDBcbkcxIFg2Ni44NjE4MDc3MDUwOTUyMyBZMTkzLjU2OTc2Njc1NDMyMjk2IEYzMDBcbkcxIFg2My43NzY2MjI5NDA5NDM2OTYgWTE5NC43NDIxMzE3ODc1MTMyIEYzMDBcbkcxIFg2MS4wNjI0NzE4Mzc5NDYgWTE5Ni42MTk5NDY2MzE5NzkwNSBGMzAwXG5HMSBYNTguODc3NjU3OTAwNTQwNDggWTE5OS4wOTM2ODcyOTMxODgwMyBGMzAwXG5HMSBYNTcuMzQ5NjEwOTE3ODk5NTMgWTIwMi4wMTkwNzIyNjI1MjgyNSBGMzAwXG5HMSBYNTYuNTY3NDU0NTkxMzY0MzQgWTIwNS4yMjU0Nzc3NzAzOTIzMyBGMzAwXG5HMSBYNTYuNDcyMDc3IFkyMDYuODM3MTcyOTk5OTk5OTggRjMwMFxuRzEgWDU2Ljg3MDYzMTI1NTI5NzQxIFkyMTAuMTEzNDQ1MTY1OTgxMzcgRjMwMFxuRzEgWDU4LjA0MzAxMjc2ODcwMTkxIFkyMTMuMTk4NjIzNjY3NjI4OCBGMzAwXG5HMSBYNTkuOTIwODQyMTExNDA5NTEgWTIxNS45MTI3NjQ3Mzk4MDM2MyBGMzAwXG5HMSBYNjIuMzk0NTk0NDQzMjc0MjkgWTIxOC4wOTc1NjU0NjMxMTc3IEYzMDBcbkcxIFg2NS4zMTk5ODc1NzQ5OTA2NiBZMjE5LjYyNTU5NjgxOTExMzU1IEYzMDBcbkcxIFg2OC41MjYzOTcyNjA4Nzg2NCBZMjIwLjQwNzczNjAxNzg3NzgyIEYzMDBcbkcxIFg3MC4xMzgwODIgWTIyMC41MDMxMDUgRjMwMFxuRzEgWDczLjQxNDM1NjM4MjM5NDIgWTIyMC4xMDQ1Njg5NjQ5MDcxNyBGMzAwXG5HMSBYNzYuNDk5NTQxNDAzOTExMjggWTIxOC45MzIyMDQ2MDg5OTc4NiBGMzAwXG5HMSBYNzkuMjEzNjkyOTE5MTM5NjYgWTIxNy4wNTQzOTAzNjAzNjEwNSBGMzAwXG5HMSBYODEuMzk4NTA3Mzk5NTk3NTkgWTIxNC41ODA2NTAxNzg3Nzc0MyBGMzAwXG5HMSBYODIuOTI2NTU1MDI0NDM5MDQgWTIxMS42NTUyNjU1NDQ4ODQ1NyBGMzAwXG5HMSBYODMuNzA4NzEyMDU0ODY2MjggWTIwOC40NDg4NjAyMDg3MjQ5IEYzMDBcbkcxIFg4My44MDQwOSBZMjA2LjgzNzE3MyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTI3XG5HMCBYMTA3LjQxNTI1IFkyMDYuODM3MTczXG5HMSBYMTA3LjAxNjY5ODM4MTgzMDE3IFkyMDMuNTYwOTAwNTEzMjE2NTggRjMwMFxuRzEgWDEwNS44NDQzMTkzNTE3Mzg5NiBZMjAwLjQ3NTcyMTA2NzkwMDI1IEYzMDBcbkcxIFgxMDMuOTY2NDkyMTkzNjkwNSBZMTk3Ljc2MTU3ODQ4NDIyOTM1IEYzMDBcbkcxIFgxMDEuNDkyNzQxNjIwNDA5OTkgWTE5NS41NzY3NzU3Njk3NTA1IEYzMDBcbkcxIFg5OC41NjczNDk3MTg2MzMxMSBZMTk0LjA0ODc0MjA1OTA1NjIgRjMwMFxuRzEgWDk1LjM2MDk0MDY2MjMwMzM5IFkxOTMuMjY2NjAwMjc5Mzk4MjMgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMTkzLjE3MTIyOTk5OTk5OTk4IEYzMDBcbkcxIFg5MC40NzI5NzY2MTc2MDc0MyBZMTkzLjU2OTc2NjAzNTEwNjA2IEYzMDBcbkcxIFg4Ny4zODc3OTE1OTYwOTUwOCBZMTk0Ljc0MjEzMDM5MTAyNzggRjMwMFxuRzEgWDg0LjY3MzY0MDA4MDg3NDI2IFkxOTYuNjE5OTQ0NjM5Njc1NTcgRjMwMFxuRzEgWDgyLjQ4ODgyNTYwMDQyNjMgWTE5OS4wOTM2ODQ4MjEyNjggRjMwMFxuRzEgWDgwLjk2MDc3Nzk3NTU5NjY3IFkyMDIuMDE5MDY5NDU1MTY3IEYzMDBcbkcxIFg4MC4xNzg2MjA5NDUxODIzNSBZMjA1LjIyNTQ3NDc5MTMyOTg0IEYzMDBcbkcxIFg4MC4wODMyNDMgWTIwNi44MzcxNzMgRjMwMFxuRzEgWDgwLjQ4MTc5NzI1NTI5NzM4IFkyMTAuMTEzNDQ1MTY1OTgxMzcgRjMwMFxuRzEgWDgxLjY1NDE3ODc2ODcwMTg1IFkyMTMuMTk4NjIzNjY3NjI4ODIgRjMwMFxuRzEgWDgzLjUzMjAwODExMTQwOTQzIFkyMTUuOTEyNzY0NzM5ODAzNjYgRjMwMFxuRzEgWDg2LjAwNTc2MDQ0MzI3NDIgWTIxOC4wOTc1NjU0NjMxMTc3MiBGMzAwXG5HMSBYODguOTMxMTUzNTc0OTkwNTcgWTIxOS42MjU1OTY4MTkxMTM2NCBGMzAwXG5HMSBYOTIuMTM3NTYzMjYwODc4NTUgWTIyMC40MDc3MzYwMTc4Nzc5NCBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkyMjAuNTAzMTA1IEYzMDBcbkcxIFg5Ny4wMjU1MjUxMTk5MzAyMiBZMjIwLjEwNDU2NjgwNzI1NjQgRjMwMFxuRzEgWDEwMC4xMTA3MDkzNjkzNjQ0OSBZMjE4LjkzMjIwMDQxOTU0MTkgRjMwMFxuRzEgWDEwMi44MjQ4NTk2NDc5MjMxMiBZMjE3LjA1NDM4NDM4MzQ1MTA0IEYzMDBcbkcxIFgxMDUuMDA5NjcyNDk5MjUzNDEgWTIxNC41ODA2NDI3NjMwMTgxNSBGMzAwXG5HMSBYMTA2LjUzNzcxODE5NzUyODU5IFkyMTEuNjU1MjU3MTIyODAyMDMgRjMwMFxuRzEgWDEwNy4zMTk4NzMxMTYzMTgzOCBZMjA4LjQ0ODg1MTI3MTUzOTE2IEYzMDBcbkcxIFgxMDcuNDE1MjUgWTIwNi44MzcxNzMgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUyOFxuRzAgWDEzMS4wMjY0MSBZMjA2LjgzNzE3M1xuRzEgWDEzMC42Mjc4NTgzODE4MzAwNCBZMjAzLjU2MDkwMDUxMzIxNjYgRjMwMFxuRzEgWDEyOS40NTU0NzkzNTE3Mzg3MiBZMjAwLjQ3NTcyMTA2NzkwMDMgRjMwMFxuRzEgWDEyNy41Nzc2NTIxOTM2OTAxNyBZMTk3Ljc2MTU3ODQ4NDIyOTUgRjMwMFxuRzEgWDEyNS4xMDM5MDE2MjA0MDk1NiBZMTk1LjU3Njc3NTc2OTc1MDcyIEYzMDBcbkcxIFgxMjIuMTc4NTA5NzE4NjMyNjQgWTE5NC4wNDg3NDIwNTkwNTY1NCBGMzAwXG5HMSBYMTE4Ljk3MjEwMDY2MjMwMjg2IFkxOTMuMjY2NjAwMjc5Mzk4NjYgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTkzLjE3MTIzMDAwMDAwMDA0IEYzMDBcbkcxIFgxMTQuMDg0MTM1ODUwOTA4NjQgWTE5My41Njk3Njc5NTMwMTc4NyBGMzAwXG5HMSBYMTEwLjk5ODk1MTUxNTY5MjA3IFkxOTQuNzQyMTM0MTE0OTg4NzIgRjMwMFxuRzEgWDEwOC4yODQ4MDEwOTk3MzMyIFkxOTYuNjE5OTQ5OTUyNDg0NTcgRjMwMFxuRzEgWDEwNi4wOTk5ODgwNjczOTg2NyBZMTk5LjA5MzY5MTQxMzA1NDIgRjMwMFxuRzEgWDEwNC41NzE5NDIxNTUwNzIzNSBZMjAyLjAxOTA3Njk0MTQ2Mjg2IEYzMDBcbkcxIFgxMDMuNzg5Nzg3MDAxNjY5MSBZMjA1LjIyNTQ4MjczNTQ5NTMgRjMwMFxuRzEgWDEwMy42OTQ0MSBZMjA2LjgzNzE3MyBGMzAwXG5HMSBYMTA0LjA5Mjk2NDI1NTI5NzEyIFkyMTAuMTEzNDQ1MTY1OTgxNCBGMzAwXG5HMSBYMTA1LjI2NTM0NTc2ODcwMTMxIFkyMTMuMTk4NjIzNjY3NjI4OTQgRjMwMFxuRzEgWDEwNy4xNDMxNzUxMTE0MDg2NSBZMjE1LjkxMjc2NDczOTgwMzk1IEYzMDBcbkcxIFgxMDkuNjE2OTI3NDQzMjczMjQgWTIxOC4wOTc1NjU0NjMxMTgyMyBGMzAwXG5HMSBYMTEyLjU0MjMyMDU3NDk4OTQ5IFkyMTkuNjI1NTk2ODE5MTE0MzggRjMwMFxuRzEgWDExNS43NDg3MzAyNjA4Nzc0MiBZMjIwLjQwNzczNjAxNzg3ODk2IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTIyMC41MDMxMDUgRjMwMFxuRzEgWDEyMC42MzY2ODQxNDkwOTI5OSBZMjIwLjEwNDU2NzA0Njk5NTM4IEYzMDBcbkcxIFgxMjMuNzIxODY4NDg0MzE0MjcgWTIxOC45MzIyMDA4ODUwMzcgRjMwMFxuRzEgWDEyNi40MzYwMTg5MDAyODA3MSBZMjE3LjA1NDM4NTA0NzU1MjA3IEYzMDBcbkcxIFgxMjguNjIwODMxOTMyNjI1MjQgWTIxNC41ODA2NDM1ODY5OTEyNyBGMzAwXG5HMSBYMTMwLjE0ODg3Nzg0NDk2MzM4IFkyMTEuNjU1MjU4MDU4NTg4NzQgRjMwMFxuRzEgWDEzMC45MzEwMzI5OTgzNzk1NSBZMjA4LjQ0ODg1MjI2NDU1OTUgRjMwMFxuRzEgWDEzMS4wMjY0MSBZMjA2LjgzNzE3MyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTI5XG5HMCBYMTU0LjYzNzYgWTIwNi44MzcxNzNcbkcxIFgxNTQuMjM5MDQ4MzgxODMwMDYgWTIwMy41NjA5MDA1MTMyMTY1OCBGMzAwXG5HMSBYMTUzLjA2NjY2OTM1MTczODc0IFkyMDAuNDc1NzIxMDY3OTAwMyBGMzAwXG5HMSBYMTUxLjE4ODg0MjE5MzY5MDIgWTE5Ny43NjE1Nzg0ODQyMjk1MiBGMzAwXG5HMSBYMTQ4LjcxNTA5MTYyMDQwOTU3IFkxOTUuNTc2Nzc1NzY5NzUwNzIgRjMwMFxuRzEgWDE0NS43ODk2OTk3MTg2MzI2NSBZMTk0LjA0ODc0MjA1OTA1NjU0IEYzMDBcbkcxIFgxNDIuNTgzMjkwNjYyMzAyODYgWTE5My4yNjY2MDAyNzkzOTg2NiBGMzAwXG5HMSBYMTQwLjk3MTYwMDAwMDAwMDAyIFkxOTMuMTcxMjMwMDAwMDAwMDQgRjMwMFxuRzEgWDEzNy42OTUzMjU1NTkyODIyOCBZMTkzLjU2OTc2NTU1NTYyODEyIEYzMDBcbkcxIFgxMzQuNjEwMTQwMzY2MTk2MTYgWTE5NC43NDIxMjk0NjAwMzc1NyBGMzAwXG5HMSBYMTMxLjg5NTk4ODU3NjE2IFkxOTYuNjE5OTQzMzExNDczMiBGMzAwXG5HMSBYMTI5LjcxMTE3MzczMzY4Mzg0IFkxOTkuMDkzNjgzMTczMzIxMTggRjMwMFxuRzEgWDEyOC4xODMxMjU2ODA3Mjg0NCBZMjAyLjAxOTA2NzU4MzU5MjYzIEYzMDBcbkcxIFgxMjcuNDAwOTY4MTgxMDYxNCBZMjA1LjIyNTQ3MjgwNTI4NzkgRjMwMFxuRzEgWDEyNy4zMDU1OTAwMDAwMDAwMSBZMjA2LjgzNzE3MzAwMDAwMDA0IEYzMDBcbkcxIFgxMjcuNzA0MTQ0MjU1Mjk3MyBZMjEwLjExMzQ0NTE2NTk4MTM3IEYzMDBcbkcxIFgxMjguODc2NTI1NzY4NzAxNjcgWTIxMy4xOTg2MjM2Njc2Mjg4NSBGMzAwXG5HMSBYMTMwLjc1NDM1NTExMTQwOTE1IFkyMTUuOTEyNzY0NzM5ODAzNzggRjMwMFxuRzEgWDEzMy4yMjgxMDc0NDMyNzM4NCBZMjE4LjA5NzU2NTQ2MzExNzkgRjMwMFxuRzEgWDEzNi4xNTM1MDA1NzQ5OTAxNSBZMjE5LjYyNTU5NjgxOTExMzkgRjMwMFxuRzEgWDEzOS4zNTk5MTAyNjA4NzgxIFkyMjAuNDA3NzM2MDE3ODc4MyBGMzAwXG5HMSBYMTQwLjk3MTYgWTIyMC41MDMxMDUgRjMwMFxuRzEgWDE0NC4yNDc4NzQxNDkwOTI5OCBZMjIwLjEwNDU2NzA0Njk5NTM4IEYzMDBcbkcxIFgxNDcuMzMzMDU4NDg0MzE0MjggWTIxOC45MzIyMDA4ODUwMzcgRjMwMFxuRzEgWDE1MC4wNDcyMDg5MDAyODA3NCBZMjE3LjA1NDM4NTA0NzU1MjA3IEYzMDBcbkcxIFgxNTIuMjMyMDIxOTMyNjI1MjMgWTIxNC41ODA2NDM1ODY5OTEyNyBGMzAwXG5HMSBYMTUzLjc2MDA2Nzg0NDk2MzM3IFkyMTEuNjU1MjU4MDU4NTg4NzcgRjMwMFxuRzEgWDE1NC41NDIyMjI5OTgzNzk1NCBZMjA4LjQ0ODg1MjI2NDU1OTUgRjMwMFxuRzEgWDE1NC42Mzc2IFkyMDYuODM3MTczIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMzBcbkcwIFgxNzguMjQ4ODEgWTIwNi44MzcxNzNcbkcxIFgxNzcuODUwMjU4MzgxODMxNDUgWTIwMy41NjA5MDA1MTMyMTYzOCBGMzAwXG5HMSBYMTc2LjY3Nzg3OTM1MTc0MTQ3IFkyMDAuNDc1NzIxMDY3ODk5NTcgRjMwMFxuRzEgWDE3NC44MDAwNTIxOTM2OTQwOSBZMTk3Ljc2MTU3ODQ4NDIyNzk4IEYzMDBcbkcxIFgxNzIuMzI2MzAxNjIwNDE0NCBZMTk1LjU3Njc3NTc2OTc0ODE0IEYzMDBcbkcxIFgxNjkuNDAwOTA5NzE4NjM4MTMgWTE5NC4wNDg3NDIwNTkwNTI3IEYzMDBcbkcxIFgxNjYuMTk0NTAwNjYyMzA4NjggWTE5My4yNjY2MDAyNzkzOTM0NiBGMzAwXG5HMSBYMTY0LjU4Mjc5IFkxOTMuMTcxMjI5OTk5OTk5OTggRjMwMFxuRzEgWDE2MS4zMDY1MTYxNDI1MzY3NCBZMTkzLjU2OTc3MDM1MDQwNzQgRjMwMFxuRzEgWDE1OC4yMjEzMzI2NjUxOTEzNyBZMTk0Ljc0MjEzODc2OTkzOSBGMzAwXG5HMSBYMTU1LjUwNzE4MzYyMzMxMTIyIFkxOTYuNjE5OTU2NTkzNDk0MSBGMzAwXG5HMSBYMTUzLjMyMjM3MjQwMTExOTUgWTE5OS4wOTM2OTk2NTI3ODQgRjMwMFxuRzEgWDE1MS43OTQzMjg2Mjk0MjMxIFkyMDIuMDE5MDg2Mjk5MzI4MyBGMzAwXG5HMSBYMTUxLjAxMjE3NTgyMjI4NDA2IFkyMDUuMjI1NDkyNjY1Njk2MTggRjMwMFxuRzEgWDE1MC45MTY4MDAwMDAwMDAwMiBZMjA2LjgzNzE3MyBGMzAwXG5HMSBYMTUxLjMxNTM1NDI1NTI5NTIgWTIxMC4xMTM0NDUxNjU5ODE2NiBGMzAwXG5HMSBYMTUyLjQ4NzczNTc2ODY5NzU4IFkyMTMuMTk4NjIzNjY3NjI5ODcgRjMwMFxuRzEgWDE1NC4zNjU1NjUxMTE0MDMzMyBZMjE1LjkxMjc2NDczOTgwNiBGMzAwXG5HMSBYMTU2LjgzOTMxNzQ0MzI2NjYyIFkyMTguMDk3NTY1NDYzMTIxNzMgRjMwMFxuRzEgWDE1OS43NjQ3MTA1NzQ5ODE5NiBZMjE5LjYyNTU5NjgxOTExOTU4IEYzMDBcbkcxIFgxNjIuOTcxMTIwMjYwODY5NDQgWTIyMC40MDc3MzYwMTc4ODYwNyBGMzAwXG5HMSBYMTY0LjU4Mjc5IFkyMjAuNTAzMTA1IEYzMDBcbkcxIFgxNjcuODU5MDY0NzMyMzQzOTQgWTIyMC4xMDQ1NzE4NDE3NzUxNCBGMzAwXG5HMSBYMTcwLjk0NDI1MDc4MzMwMjY2IFkyMTguOTMyMjEwMTk0OTQwMTggRjMwMFxuRzEgWDE3My42NTg0MDM5NDc0MjIyMiBZMjE3LjA1NDM5ODMyOTU3Njc0IEYzMDBcbkcxIFgxNzUuODQzMjIwNjAwMDQ4ODggWTIxNC41ODA2NjAwNjY0NjA1MiBGMzAwXG5HMSBYMTc3LjM3MTI3MDc5MzY0NDMzIFkyMTEuNjU1Mjc2Nzc0MzM0MDMgRjMwMFxuRzEgWDE3OC4xNTM0MzA2Mzk1ODc2NyBZMjA4LjQ0ODg3MjEyNDk4MDgyIEYzMDBcbkcxIFgxNzguMjQ4ODEgWTIwNi44MzcxNzMgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUzMVxuRzAgWDIwMS44NiBZMjA2LjgzNzE3M1xuRzEgWDIwMS40NjE0NDgzODE4MzIgWTIwMy41NjA5MDA1MTMyMTYzMiBGMzAwXG5HMSBYMjAwLjI4OTA2OTM1MTc0MjUgWTIwMC40NzU3MjEwNjc4OTkzNyBGMzAwXG5HMSBYMTk4LjQxMTI0MjE5MzY5NTU2IFkxOTcuNzYxNTc4NDg0MjI3NDQgRjMwMFxuRzEgWDE5NS45Mzc0OTE2MjA0MTYyNCBZMTk1LjU3Njc3NTc2OTc0NzIgRjMwMFxuRzEgWDE5My4wMTIwOTk3MTg2NDAyIFkxOTQuMDQ4NzQyMDU5MDUxMjggRjMwMFxuRzEgWDE4OS44MDU2OTA2NjIzMTA4NyBZMTkzLjI2NjYwMDI3OTM5MTUzIEYzMDBcbkcxIFgxODguMTk0MDEgWTE5My4xNzEyMjk5OTk5OTk5OCBGMzAwXG5HMSBYMTg0LjkxNzczNTU1OTI4MjI1IFkxOTMuNTY5NzY1NTU1NjI4MDcgRjMwMFxuRzEgWDE4MS44MzI1NTAzNjYxOTYxMyBZMTk0Ljc0MjEyOTQ2MDAzNzUyIEYzMDBcbkcxIFgxNzkuMTE4Mzk4NTc2MTU5OTYgWTE5Ni42MTk5NDMzMTE0NzMxNSBGMzAwXG5HMSBYMTc2LjkzMzU4MzczMzY4MzggWTE5OS4wOTM2ODMxNzMzMjExMiBGMzAwXG5HMSBYMTc1LjQwNTUzNTY4MDcyODQgWTIwMi4wMTkwNjc1ODM1OTI1NyBGMzAwXG5HMSBYMTc0LjYyMzM3ODE4MTA2MTM4IFkyMDUuMjI1NDcyODA1Mjg3ODQgRjMwMFxuRzEgWDE3NC41MjggWTIwNi44MzcxNzMgRjMwMFxuRzEgWDE3NC45MjY1NTQyNTUyOTcyOCBZMjEwLjExMzQ0NTE2NTk4MTQgRjMwMFxuRzEgWDE3Ni4wOTg5MzU3Njg3MDE2NCBZMjEzLjE5ODYyMzY2NzYyODg4IEYzMDBcbkcxIFgxNzcuOTc2NzY1MTExNDA5MTIgWTIxNS45MTI3NjQ3Mzk4MDM3OCBGMzAwXG5HMSBYMTgwLjQ1MDUxNzQ0MzI3MzggWTIxOC4wOTc1NjU0NjMxMTc5MiBGMzAwXG5HMSBYMTgzLjM3NTkxMDU3NDk5MDEyIFkyMTkuNjI1NTk2ODE5MTEzOSBGMzAwXG5HMSBYMTg2LjU4MjMyMDI2MDg3ODA4IFkyMjAuNDA3NzM2MDE3ODc4MyBGMzAwXG5HMSBYMTg4LjE5NDAwOTk5OTk5OTk2IFkyMjAuNTAzMTA1IEYzMDBcbkcxIFgxOTEuNDcwMjgzODU3NDY0ODYgWTIyMC4xMDQ1NjQ2NDk2MDU4MyBGMzAwXG5HMSBYMTk0LjU1NTQ2NzMzNDgxNDk4IFkyMTguOTMyMTk2MjMwMDg2NjcgRjMwMFxuRzEgWDE5Ny4yNjk2MTYzNzY3MDI2NiBZMjE3LjA1NDM3ODQwNjU0MjU1IEYzMDBcbkcxIFgxOTkuNDU0NDI3NTk4OTA0MzcgWTIxNC41ODA2MzUzNDcyNjE0NSBGMzAwXG5HMSBYMjAwLjk4MjQ3MTM3MDYxMjY0IFkyMTEuNjU1MjQ4NzAwNzIzMyBGMzAwXG5HMSBYMjAxLjc2NDYyNDE3Nzc2NDYgWTIwOC40NDg4NDIzMzQzNTg1NyBGMzAwXG5HMSBYMjAxLjg2IFkyMDYuODM3MTczIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMzJcbkcwIFgzNi41ODE3NDQgWTE4My4yMjYwN1xuRzEgWDM2LjE4MzIxMDg0MTcyNzA5IFkxNzkuOTQ5Nzk1MjY3NjYxOSBGMzAwXG5HMSBYMzUuMDEwODQ5MTk0ODQ2OSBZMTc2Ljg2NDYwOTIxNjcyMDMgRjMwMFxuRzEgWDMzLjEzMzAzNzMyOTQ0MzY4IFkxNzQuMTUwNDU2MDUyNjI4MyBGMzAwXG5HMSBYMzAuNjU5Mjk5MDY2Mjk1NDI1IFkxNzEuOTY1NjM5NDAwMDM3OSBGMzAwXG5HMSBYMjcuNzMzOTE1Nzc0MTQ2NTEgWTE3MC40Mzc1ODkyMDY0ODUzNCBGMzAwXG5HMSBYMjQuNTI3NTExMTI0NzgxODI4IFkxNjkuNjU1NDI5MzYwNTg4OTggRjMwMFxuRzEgWDIyLjkxNTczOTAwMDAwMDAwMiBZMTY5LjU2MDA1IEYzMDBcbkcxIFgxOS42Mzk0NjQ2MzUxMDg5ODYgWTE2OS45NTg1ODYxNzg5ODI1MyBGMzAwXG5HMSBYMTYuNTU0Mjc5NjY1MDgwNjI1IFkxNzEuMTMwOTUwNjcwMzg5MTUgRjMwMFxuRzEgWDEzLjg0MDEyODIzMjMyMzQwNyBZMTczLjAwODc2NTAzODIyNzk1IEYzMDBcbkcxIFgxMS42NTUzMTM4NjA1MDg5MyBZMTc1LjQ4MjUwNTMxNTc2NTc2IEYzMDBcbkcxIFgxMC4xMjcyNjYzNjQxNDY1NjYgWTE3OC40MDc4OTAwMTY3Njg0OCBGMzAwXG5HMSBYOS4zNDUxMDk0NzQ1NDA0NiBZMTgxLjYxNDI5NTM4NzI3OTQ3IEYzMDBcbkcxIFg5LjI0OTczMTYwMDAwMDAwMiBZMTgzLjIyNjA3IEYzMDBcbkcxIFg5LjY0ODI2OTU1MzA1MjY1MiBZMTg2LjUwMjM0NDE0OTA4NzEyIEYzMDBcbkcxIFgxMC44MjA2MzU3MTUwNTYyNjQgWTE4OS41ODc1Mjg0ODQyOTEyNSBGMzAwXG5HMSBYMTIuNjk4NDUxNTUyNTgwOTYgWTE5Mi4zMDE2Nzg5MDAyMzAyIEYzMDBcbkcxIFgxNS4xNzIxOTMwMTMxNzM3NzUgWTE5NC40ODY0OTE5MzI1Mzg0NiBGMzAwXG5HMSBYMTguMDk3NTc4NTQxNTk4NjUgWTE5Ni4wMTQ1Mzc4NDQ4MzM2OCBGMzAwXG5HMSBYMjEuMzAzOTg0MzM1NjM5MzkgWTE5Ni43OTY2OTI5OTgyMDI4NyBGMzAwXG5HMSBYMjIuOTE1NzM4OTk5OTk5OTk1IFkxOTYuODkyMDcgRjMwMFxuRzEgWDI2LjE5MjAxMzI5NDkwMDU3MyBZMTk2LjQ5MzUzMzI0NTY0MjUgRjMwMFxuRzEgWDI5LjI3NzE5ODA1OTAzOTc5IFkxOTUuMzIxMTY4MjEyNDE5OCBGMzAwXG5HMSBYMzEuOTkxMzQ5MTYyMDE3NzE2IFkxOTMuNDQzMzUzMzY3OTI1MzQgRjMwMFxuRzEgWDM0LjE3NjE2MzA5OTM5NzE2NSBZMTkwLjk2OTYxMjcwNjY5MzM3IEYzMDBcbkcxIFgzNS43MDQyMTAwODIwMDczMiBZMTg4LjA0NDIyNzczNzMzNzAyIEYzMDBcbkcxIFgzNi40ODYzNjY0MDg1MDg3NDQgWTE4NC44Mzc4MjIyMjk0NjQ3MyBGMzAwXG5HMSBYMzYuNTgxNzQ0IFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUzM1xuRzAgWDYwLjE5MjkyMiBZMTgzLjIyNjA3XG5HMSBYNTkuNzk0Mzg4ODQxNzI3MSBZMTc5Ljk0OTc5NTI2NzY2MTkgRjMwMFxuRzEgWDU4LjYyMjAyNzE5NDg0NjkxIFkxNzYuODY0NjA5MjE2NzIwMyBGMzAwXG5HMSBYNTYuNzQ0MjE1MzI5NDQzNjggWTE3NC4xNTA0NTYwNTI2MjgzIEYzMDBcbkcxIFg1NC4yNzA0NzcwNjYyOTU0MyBZMTcxLjk2NTYzOTQwMDAzNzkgRjMwMFxuRzEgWDUxLjM0NTA5Mzc3NDE0NjUyIFkxNzAuNDM3NTg5MjA2NDg1MzQgRjMwMFxuRzEgWDQ4LjEzODY4OTEyNDc4MTgzNCBZMTY5LjY1NTQyOTM2MDU4ODk4IEYzMDBcbkcxIFg0Ni41MjY5MTcwMDAwMDAwMDUgWTE2OS41NjAwNSBGMzAwXG5HMSBYNDMuMjUwNjQyNjE3NjExNDQgWTE2OS45NTg1ODYwMzUxMzkxMiBGMzAwXG5HMSBYNDAuMTY1NDU3NTk2MTEwOTU0IFkxNzEuMTMwOTUwMzkxMDkyMDYgRjMwMFxuRzEgWDM3LjQ1MTMwNjA4MDkwOTEwNiBZMTczLjAwODc2NDYzOTc2NzI0IEYzMDBcbkcxIFgzNS4yNjY0OTE2MDA0ODYxMzQgWTE3NS40ODI1MDQ4MjEzODE3MiBGMzAwXG5HMSBYMzMuNzM4NDQzOTc1Njg2MDQgWTE3OC40MDc4ODk0NTUyOTYxOSBGMzAwXG5HMSBYMzIuOTU2Mjg2OTQ1MzA0MTIgWTE4MS42MTQyOTQ3OTE0NjY5IEYzMDBcbkcxIFgzMi44NjA5MDkwMDAwMDAwMTQgWTE4My4yMjYwNyBGMzAwXG5HMSBYMzMuMjU5NDQ2OTUzMDUyNjQ1IFkxODYuNTAyMzQ0MTQ5MDg3MTUgRjMwMFxuRzEgWDM0LjQzMTgxMzExNTA1NjI0NCBZMTg5LjU4NzUyODQ4NDI5MTI4IEYzMDBcbkcxIFgzNi4zMDk2Mjg5NTI1ODA5MiBZMTkyLjMwMTY3ODkwMDIzMDIzIEYzMDBcbkcxIFgzOC43ODMzNzA0MTMxNzM3MyBZMTk0LjQ4NjQ5MTkzMjUzODQ4IEYzMDBcbkcxIFg0MS43MDg3NTU5NDE1OTg2MSBZMTk2LjAxNDUzNzg0NDgzMzc3IEYzMDBcbkcxIFg0NC45MTUxNjE3MzU2MzkzMyBZMTk2Ljc5NjY5Mjk5ODIwMjk2IEYzMDBcbkcxIFg0Ni41MjY5MTcwMDAwMDAwMSBZMTk2Ljg5MjA3IEYzMDBcbkcxIFg0OS44MDMxOTEyOTQ5MDA1OCBZMTk2LjQ5MzUzMzI0NTY0MjUgRjMwMFxuRzEgWDUyLjg4ODM3NjA1OTAzOTc3IFkxOTUuMzIxMTY4MjEyNDE5ODIgRjMwMFxuRzEgWDU1LjYwMjUyNzE2MjAxNzY4IFkxOTMuNDQzMzUzMzY3OTI1MzcgRjMwMFxuRzEgWDU3Ljc4NzM0MTA5OTM5NzE1IFkxOTAuOTY5NjEyNzA2NjkzNCBGMzAwXG5HMSBYNTkuMzE1Mzg4MDgyMDA3MzIgWTE4OC4wNDQyMjc3MzczMzcwNSBGMzAwXG5HMSBYNjAuMDk3NTQ0NDA4NTA4NzQ2IFkxODQuODM3ODIyMjI5NDY0NzYgRjMwMFxuRzEgWDYwLjE5MjkyMiBZMTgzLjIyNjA3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMzRcbkcwIFg4My44MDQwOSBZMTgzLjIyNjA3XG5HMSBYODMuNDA1NTU2ODQxNzI3MTIgWTE3OS45NDk3OTUyNjc2NjE5MyBGMzAwXG5HMSBYODIuMjMzMTk1MTk0ODQ2OTYgWTE3Ni44NjQ2MDkyMTY3MjAzNyBGMzAwXG5HMSBYODAuMzU1MzgzMzI5NDQzNzUgWTE3NC4xNTA0NTYwNTI2MjgzIEYzMDBcbkcxIFg3Ny44ODE2NDUwNjYyOTU1MiBZMTcxLjk2NTYzOTQwMDAzNzg3IEYzMDBcbkcxIFg3NC45NTYyNjE3NzQxNDY2NCBZMTcwLjQzNzU4OTIwNjQ4NTMgRjMwMFxuRzEgWDcxLjc0OTg1NzEyNDc4MTk1IFkxNjkuNjU1NDI5MzYwNTg4OTMgRjMwMFxuRzEgWDcwLjEzODA4MiBZMTY5LjU2MDA1IEYzMDBcbkcxIFg2Ni44NjE4MDc3MDUwOTkyNyBZMTY5Ljk1ODU4Njc1NDM1NjA4IEYzMDBcbkcxIFg2My43NzY2MjI5NDA5NTk1NCBZMTcxLjEzMDk1MTc4NzU3NzQ2IEYzMDBcbkcxIFg2MS4wNjI0NzE4Mzc5ODA4MTYgWTE3My4wMDg3NjY2MzIwNzA3NSBGMzAwXG5HMSBYNTguODc3NjU3OTAwNjAwMzA1IFkxNzUuNDgyNTA3MjkzMzAxNzggRjMwMFxuRzEgWDU3LjM0OTYxMDkxNzk4ODkgWTE3OC40MDc4OTIyNjI2NTc0NyBGMzAwXG5HMSBYNTYuNTY3NDU0NTkxNDg2MSBZMTgxLjYxNDI5Nzc3MDUyOTQ1IEYzMDBcbkcxIFg1Ni40NzIwNzcwMDAwMDAwMDYgWTE4My4yMjYwNyBGMzAwXG5HMSBYNTYuODcwNjE0OTUzMDUyNjY2IFkxODYuNTAyMzQ0MTQ5MDg3MTUgRjMwMFxuRzEgWDU4LjA0Mjk4MTExNTA1NjI4IFkxODkuNTg3NTI4NDg0MjkxMjUgRjMwMFxuRzEgWDU5LjkyMDc5Njk1MjU4MDk4NiBZMTkyLjMwMTY3ODkwMDIzMDIgRjMwMFxuRzEgWDYyLjM5NDUzODQxMzE3MzgwNSBZMTk0LjQ4NjQ5MTkzMjUzODQzIEYzMDBcbkcxIFg2NS4zMTk5MjM5NDE1OTg3IFkxOTYuMDE0NTM3ODQ0ODMzNjggRjMwMFxuRzEgWDY4LjUyNjMyOTczNTYzOTQ0IFkxOTYuNzk2NjkyOTk4MjAyODQgRjMwMFxuRzEgWDcwLjEzODA4MiBZMTk2Ljg5MjA3IEYzMDBcbkcxIFg3My40MTQzNTYzODIzODgzOSBZMTk2LjQ5MzUzMzk2NDg1OTQ3IEYzMDBcbkcxIFg3Ni40OTk1NDE0MDM4ODgzNyBZMTk1LjMyMTE2OTYwODkwNTIgRjMwMFxuRzEgWDc5LjIxMzY5MjkxOTA4OTQzIFkxOTMuNDQzMzU1MzYwMjI4ODggRjMwMFxuRzEgWDgxLjM5ODUwNzM5OTUxMTMyIFkxOTAuOTY5NjE1MTc4NjEzNDUgRjMwMFxuRzEgWDgyLjkyNjU1NTAyNDMxMDE2IFkxODguMDQ0MjMwNTQ0Njk4MzQgRjMwMFxuRzEgWDgzLjcwODcxMjA1NDY5MDcyIFkxODQuODM3ODI1MjA4NTI3MjggRjMwMFxuRzEgWDgzLjgwNDA5IFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGUzNVxuRzAgWDEwNy40MTUyNSBZMTgzLjIyNjA3XG5HMSBYMTA3LjAxNjcxNjg0MTcyNzUxIFkxNzkuOTQ5Nzk1MjY3NjYxODcgRjMwMFxuRzEgWDEwNS44NDQzNTUxOTQ4NDc3NCBZMTc2Ljg2NDYwOTIxNjcyMDIgRjMwMFxuRzEgWDEwMy45NjY1NDMzMjk0NDQ4NiBZMTc0LjE1MDQ1NjA1MjYyNzkgRjMwMFxuRzEgWDEwMS40OTI4MDUwNjYyOTY4OCBZMTcxLjk2NTYzOTQwMDAzNzIgRjMwMFxuRzEgWDk4LjU2NzQyMTc3NDE0ODE3IFkxNzAuNDM3NTg5MjA2NDg0MjMgRjMwMFxuRzEgWDk1LjM2MTAxNzEyNDc4MzYgWTE2OS42NTU0MjkzNjA1ODc0OCBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkxNjkuNTYwMDUgRjMwMFxuRzEgWDkwLjQ3Mjk3NjYxNzYxMTQ3IFkxNjkuOTU4NTg2MDM1MTM5MTUgRjMwMFxuRzEgWDg3LjM4Nzc5MTU5NjExMDk0IFkxNzEuMTMwOTUwMzkxMDkyMDkgRjMwMFxuRzEgWDg0LjY3MzY0MDA4MDkwOTEgWTE3My4wMDg3NjQ2Mzk3NjcyNiBGMzAwXG5HMSBYODIuNDg4ODI1NjAwNDg2MTIgWTE3NS40ODI1MDQ4MjEzODE3NSBGMzAwXG5HMSBYODAuOTYwNzc3OTc1Njg2MDMgWTE3OC40MDc4ODk0NTUyOTYyIEYzMDBcbkcxIFg4MC4xNzg2MjA5NDUzMDQxMiBZMTgxLjYxNDI5NDc5MTQ2NjkzIEYzMDBcbkcxIFg4MC4wODMyNDMgWTE4My4yMjYwNyBGMzAwXG5HMSBYODAuNDgxNzgwOTUzMDUyNjMgWTE4Ni41MDIzNDQxNDkwODcxMiBGMzAwXG5HMSBYODEuNjU0MTQ3MTE1MDU2MjIgWTE4OS41ODc1Mjg0ODQyOTEyNSBGMzAwXG5HMSBYODMuNTMxOTYyOTUyNTgwOSBZMTkyLjMwMTY3ODkwMDIzMDIgRjMwMFxuRzEgWDg2LjAwNTcwNDQxMzE3MzcyIFkxOTQuNDg2NDkxOTMyNTM4NDggRjMwMFxuRzEgWDg4LjkzMTA4OTk0MTU5ODYgWTE5Ni4wMTQ1Mzc4NDQ4MzM3NyBGMzAwXG5HMSBYOTIuMTM3NDk1NzM1NjM5MzIgWTE5Ni43OTY2OTI5OTgyMDI5NiBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkxOTYuODkyMDcgRjMwMFxuRzEgWDk3LjAyNTUyNTExOTkyNDQxIFkxOTYuNDkzNTMxODA3MjA4NjggRjMwMFxuRzEgWDEwMC4xMTA3MDkzNjkzNDE1OCBZMTk1LjMyMTE2NTQxOTQ0OTI0IEYzMDBcbkcxIFgxMDIuODI0ODU5NjQ3ODcyODggWTE5My40NDMzNDkzODMzMTg4MyBGMzAwXG5HMSBYMTA1LjAwOTY3MjQ5OTE2NzE3IFkxOTAuOTY5NjA3NzYyODU0MSBGMzAwXG5HMSBYMTA2LjUzNzcxODE5NzM5OTczIFkxODguMDQ0MjIyMTIyNjE1NzQgRjMwMFxuRzEgWDEwNy4zMTk4NzMxMTYxNDI4MiBZMTg0LjgzNzgxNjI3MTM0MTQ0IEYzMDBcbkcxIFgxMDcuNDE1MjUgWTE4My4yMjYwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTM2XG5HMCBYMTMxLjAyNjQxIFkxODMuMjI2MDdcbkcxIFgxMzAuNjI3ODc2ODQxNzI3NCBZMTc5Ljk0OTc5NTI2NzY2MTg3IEYzMDBcbkcxIFgxMjkuNDU1NTE1MTk0ODQ3NTIgWTE3Ni44NjQ2MDkyMTY3MjAyMyBGMzAwXG5HMSBYMTI3LjU3NzcwMzMyOTQ0NDU2IFkxNzQuMTUwNDU2MDUyNjI4MDIgRjMwMFxuRzEgWDEyNS4xMDM5NjUwNjYyOTY1MSBZMTcxLjk2NTYzOTQwMDAzNzQgRjMwMFxuRzEgWDEyMi4xNzg1ODE3NzQxNDc3NCBZMTcwLjQzNzU4OTIwNjQ4NDUyIEYzMDBcbkcxIFgxMTguOTcyMTc3MTI0NzgzMTcgWTE2OS42NTU0MjkzNjA1ODc4NyBGMzAwXG5HMSBYMTE3LjM2MDQxIFkxNjkuNTYwMDUgRjMwMFxuRzEgWDExNC4wODQxMzU4NTA5MTI2NiBZMTY5Ljk1ODU4Nzk1MzA1MDk0IEYzMDBcbkcxIFgxMTAuOTk4OTUxNTE1NzA3OTIgWTE3MS4xMzA5NTQxMTUwNTI5MyBGMzAwXG5HMSBYMTA4LjI4NDgwMTA5OTc2ODAzIFkxNzMuMDA4NzY5OTUyNTc2MjIgRjMwMFxuRzEgWDEwNi4wOTk5ODgwNjc0NTg0OCBZMTc1LjQ4MjUxMTQxMzE2NzkgRjMwMFxuRzEgWDEwNC41NzE5NDIxNTUxNjE3MSBZMTc4LjQwNzg5Njk0MTU5MiBGMzAwXG5HMSBYMTAzLjc4OTc4NzAwMTc5MDg2IFkxODEuNjE0MzAyNzM1NjMyMzUgRjMwMFxuRzEgWDEwMy42OTQ0MSBZMTgzLjIyNjA2OTk5OTk5OTk2IEYzMDBcbkcxIFgxMDQuMDkyOTQ3OTUzMDUyMzUgWTE4Ni41MDIzNDQxNDkwODcxNSBGMzAwXG5HMSBYMTA1LjI2NTMxNDExNTA1NTY3IFkxODkuNTg3NTI4NDg0MjkxNCBGMzAwXG5HMSBYMTA3LjE0MzEyOTk1MjU4MDExIFkxOTIuMzAxNjc4OTAwMjMwNDggRjMwMFxuRzEgWDEwOS42MTY4NzE0MTMxNzI3NSBZMTk0LjQ4NjQ5MTkzMjUzOSBGMzAwXG5HMSBYMTEyLjU0MjI1Njk0MTU5NzUgWTE5Ni4wMTQ1Mzc4NDQ4MzQ1IEYzMDBcbkcxIFgxMTUuNzQ4NjYyNzM1NjM4MTggWTE5Ni43OTY2OTI5OTgyMDM5OCBGMzAwXG5HMSBYMTE3LjM2MDQwOTk5OTk5OTk5IFkxOTYuODkyMDcgRjMwMFxuRzEgWDEyMC42MzY2ODQxNDkwODcxOSBZMTk2LjQ5MzUzMjA0Njk0NzY1IEYzMDBcbkcxIFgxMjMuNzIxODY4NDg0MjkxNDIgWTE5NS4zMjExNjU4ODQ5NDQzMiBGMzAwXG5HMSBYMTI2LjQzNjAxODkwMDIzMDUgWTE5My40NDMzNTAwNDc0MTk4NyBGMzAwXG5HMSBYMTI4LjYyMDgzMTkzMjUzOSBZMTkwLjk2OTYwODU4NjgyNzI2IEYzMDBcbkcxIFgxMzAuMTQ4ODc3ODQ0ODM0NTIgWTE4OC4wNDQyMjMwNTg0MDI1IEYzMDBcbkcxIFgxMzAuOTMxMDMyOTk4MjA0IFkxODQuODM3ODE3MjY0MzYxODYgRjMwMFxuRzEgWDEzMS4wMjY0MSBZMTgzLjIyNjA3IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlMzdcbkcwIFgxNTQuNjM3NiBZMTgzLjIyNjA3XG5HMSBYMTU0LjIzOTA2Njg0MTcyNzQgWTE3OS45NDk3OTUyNjc2NjE4NCBGMzAwXG5HMSBYMTUzLjA2NjcwNTE5NDg0NzUxIFkxNzYuODY0NjA5MjE2NzIwMiBGMzAwXG5HMSBYMTUxLjE4ODg5MzMyOTQ0NDU0IFkxNzQuMTUwNDU2MDUyNjI4IEYzMDBcbkcxIFgxNDguNzE1MTU1MDY2Mjk2NSBZMTcxLjk2NTYzOTQwMDAzNzM2IEYzMDBcbkcxIFgxNDUuNzg5NzcxNzc0MTQ3NzQgWTE3MC40Mzc1ODkyMDY0ODQ1MiBGMzAwXG5HMSBYMTQyLjU4MzM2NzEyNDc4MzE3IFkxNjkuNjU1NDI5MzYwNTg3ODcgRjMwMFxuRzEgWDE0MC45NzE2IFkxNjkuNTYwMDUgRjMwMFxuRzEgWDEzNy42OTUzMjU1NTkyODYzMiBZMTY5Ljk1ODU4NTU1NTY2MTE2IEYzMDBcbkcxIFgxMzQuNjEwMTQwMzY2MjEyMDUgWTE3MS4xMzA5NDk0NjAxMDE3NiBGMzAwXG5HMSBYMTMxLjg5NTk4ODU3NjE5NDg3IFkxNzMuMDA4NzYzMzExNTY0OCBGMzAwXG5HMSBYMTI5LjcxMTE3MzczMzc0MzcgWTE3NS40ODI1MDMxNzM0MzQ4NSBGMzAwXG5HMSBYMTI4LjE4MzEyNTY4MDgxNzgyIFkxNzguNDA3ODg3NTgzNzIxNzMgRjMwMFxuRzEgWDEyNy40MDA5NjgxODExODMxNyBZMTgxLjYxNDI5MjgwNTQyNDg3IEYzMDBcbkcxIFgxMjcuMzA1NTkwMDAwMDAwMDEgWTE4My4yMjYwNyBGMzAwXG5HMSBYMTI3LjcwNDEyNzk1MzA1MjUzIFkxODYuNTAyMzQ0MTQ5MDg3MTIgRjMwMFxuRzEgWDEyOC44NzY0OTQxMTUwNTYwMyBZMTg5LjU4NzUyODQ4NDI5MTMgRjMwMFxuRzEgWDEzMC43NTQzMDk5NTI1ODA2MyBZMTkyLjMwMTY3ODkwMDIzMDMgRjMwMFxuRzEgWDEzMy4yMjgwNTE0MTMxNzMzOCBZMTk0LjQ4NjQ5MTkzMjUzODY4IEYzMDBcbkcxIFgxMzYuMTUzNDM2OTQxNTk4MiBZMTk2LjAxNDUzNzg0NDgzNDAyIEYzMDBcbkcxIFgxMzkuMzU5ODQyNzM1NjM4OSBZMTk2Ljc5NjY5Mjk5ODIwMzMzIEYzMDBcbkcxIFgxNDAuOTcxNiBZMTk2Ljg5MjA3IEYzMDBcbkcxIFgxNDQuMjQ3ODc0MTQ5MDg3MTggWTE5Ni40OTM1MzIwNDY5NDc2NSBGMzAwXG5HMSBYMTQ3LjMzMzA1ODQ4NDI5MTQzIFkxOTUuMzIxMTY1ODg0OTQ0MzIgRjMwMFxuRzEgWDE1MC4wNDcyMDg5MDAyMzA1IFkxOTMuNDQzMzUwMDQ3NDE5ODcgRjMwMFxuRzEgWDE1Mi4yMzIwMjE5MzI1MzkgWTE5MC45Njk2MDg1ODY4MjcyNiBGMzAwXG5HMSBYMTUzLjc2MDA2Nzg0NDgzNDUgWTE4OC4wNDQyMjMwNTg0MDI1IEYzMDBcbkcxIFgxNTQuNTQyMjIyOTk4MjAzOTggWTE4NC44Mzc4MTcyNjQzNjE4NiBGMzAwXG5HMSBYMTU0LjYzNzYgWTE4My4yMjYwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTM4XG5HMCBYMTc4LjI0ODgxIFkxODMuMjI2MDdcbkcxIFgxNzcuODUwMjc2ODQxNzI4OCBZMTc5Ljk0OTc5NTI2NzY2MTY3IEYzMDBcbkcxIFgxNzYuNjc3OTE1MTk0ODUwMjEgWTE3Ni44NjQ2MDkyMTY3MTk1MSBGMzAwXG5HMSBYMTc0LjgwMDEwMzMyOTQ0ODQgWTE3NC4xNTA0NTYwNTI2MjY0OCBGMzAwXG5HMSBYMTcyLjMyNjM2NTA2NjMwMTMgWTE3MS45NjU2Mzk0MDAwMzQ4IEYzMDBcbkcxIFgxNjkuNDAwOTgxNzc0MTUzMTcgWTE3MC40Mzc1ODkyMDY0ODA3IEYzMDBcbkcxIFgxNjYuMTk0NTc3MTI0Nzg4OSBZMTY5LjY1NTQyOTM2MDU4MjcgRjMwMFxuRzEgWDE2NC41ODI3OSBZMTY5LjU2MDA1IEYzMDBcbkcxIFgxNjEuMzA2NTE2MTQyNTQwNzcgWTE2OS45NTg1OTAzNTA0NDA1IEYzMDBcbkcxIFgxNTguMjIxMzMyNjY1MjA3MjMgWTE3MS4xMzA5NTg3NzAwMDMyOCBGMzAwXG5HMSBYMTU1LjUwNzE4MzYyMzM0NjA3IFkxNzMuMDA4Nzc2NTkzNTg1OCBGMzAwXG5HMSBYMTUzLjMyMjM3MjQwMTE3OTM0IFkxNzUuNDgyNTE5NjUyODk3OCBGMzAwXG5HMSBYMTUxLjc5NDMyODYyOTUxMjQ1IFkxNzguNDA3OTA2Mjk5NDU3NTUgRjMwMFxuRzEgWDE1MS4wMTIxNzU4MjI0MDU4MiBZMTgxLjYxNDMxMjY2NTgzMzM1IEYzMDBcbkcxIFgxNTAuOTE2ODAwMDAwMDAwMDIgWTE4My4yMjYwNyBGMzAwXG5HMSBYMTUxLjMxNTMzNzk1MzA1MDQzIFkxODYuNTAyMzQ0MTQ5MDg3NCBGMzAwXG5HMSBYMTUyLjQ4NzcwNDExNTA1MTk0IFkxODkuNTg3NTI4NDg0MjkyMyBGMzAwXG5HMSBYMTU0LjM2NTUxOTk1MjU3NDggWTE5Mi4zMDE2Nzg5MDAyMzI1MyBGMzAwXG5HMSBYMTU2LjgzOTI2MTQxMzE2NjEzIFkxOTQuNDg2NDkxOTMyNTQyNDYgRjMwMFxuRzEgWDE1OS43NjQ2NDY5NDE1OSBZMTk2LjAxNDUzNzg0NDgzOTcgRjMwMFxuRzEgWDE2Mi45NzEwNTI3MzU2MzAyIFkxOTYuNzk2NjkyOTk4MjExMDkgRjMwMFxuRzEgWDE2NC41ODI3OTAwMDAwMDAwMiBZMTk2Ljg5MjA3IEYzMDBcbkcxIFgxNjcuODU5MDY0NzMyMzM4MTQgWTE5Ni40OTM1MzY4NDE3Mjc0IEYzMDBcbkcxIFgxNzAuOTQ0MjUwNzgzMjc5NzggWTE5NS4zMjExNzUxOTQ4NDc1IEYzMDBcbkcxIFgxNzMuNjU4NDAzOTQ3MzcyIFkxOTMuNDQzMzYzMzI5NDQ0NTQgRjMwMFxuRzEgWDE3NS44NDMyMjA1OTk5NjI2MiBZMTkwLjk2OTYyNTA2NjI5NjUgRjMwMFxuRzEgWDE3Ny4zNzEyNzA3OTM1MTU0NiBZMTg4LjA0NDI0MTc3NDE0Nzc0IEYzMDBcbkcxIFgxNzguMTUzNDMwNjM5NDEyMSBZMTg0LjgzNzgzNzEyNDc4MzE0IEYzMDBcbkcxIFgxNzguMjQ4ODEgWTE4My4yMjYwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTM5XG5HMCBYMjAxLjg2IFkxODMuMjI2MDdcbkcxIFgyMDEuNDYxNDY2ODQxNzI5MzYgWTE3OS45NDk3OTUyNjc2NjE2IEYzMDBcbkcxIFgyMDAuMjg5MTA1MTk0ODUxMyBZMTc2Ljg2NDYwOTIxNjcxOTMgRjMwMFxuRzEgWDE5OC40MTEyOTMzMjk0NDk5IFkxNzQuMTUwNDU2MDUyNjI1OTcgRjMwMFxuRzEgWDE5NS45Mzc1NTUwNjYzMDMxNiBZMTcxLjk2NTYzOTQwMDAzMzg3IEYzMDBcbkcxIFgxOTMuMDEyMTcxNzc0MTU1MzIgWTE3MC40Mzc1ODkyMDY0NzkzMiBGMzAwXG5HMSBYMTg5LjgwNTc2NzEyNDc5MTIgWTE2OS42NTU0MjkzNjA1ODA3NyBGMzAwXG5HMSBYMTg4LjE5NDAxMDAwMDAwMDAyIFkxNjkuNTYwMDUgRjMwMFxuRzEgWDE4NC45MTc3MzU1NTkyODYzNCBZMTY5Ljk1ODU4NTU1NTY2MTE2IEYzMDBcbkcxIFgxODEuODMyNTUwMzY2MjEyMDggWTE3MS4xMzA5NDk0NjAxMDE3NiBGMzAwXG5HMSBYMTc5LjExODM5ODU3NjE5NDkgWTE3My4wMDg3NjMzMTE1NjQ4IEYzMDBcbkcxIFgxNzYuOTMzNTgzNzMzNzQzNzIgWTE3NS40ODI1MDMxNzM0MzQ4NSBGMzAwXG5HMSBYMTc1LjQwNTUzNTY4MDgxNzg1IFkxNzguNDA3ODg3NTgzNzIxNzMgRjMwMFxuRzEgWDE3NC42MjMzNzgxODExODMyIFkxODEuNjE0MjkyODA1NDI0ODcgRjMwMFxuRzEgWDE3NC41MjgwMDAwMDAwMDAwNSBZMTgzLjIyNjA3IEYzMDBcbkcxIFgxNzQuOTI2NTM3OTUzMDUyNTYgWTE4Ni41MDIzNDQxNDkwODcxNSBGMzAwXG5HMSBYMTc2LjA5ODkwNDExNTA1NjA2IFkxODkuNTg3NTI4NDg0MjkxMyBGMzAwXG5HMSBYMTc3Ljk3NjcxOTk1MjU4MDY1IFkxOTIuMzAxNjc4OTAwMjMwMyBGMzAwXG5HMSBYMTgwLjQ1MDQ2MTQxMzE3MzQgWTE5NC40ODY0OTE5MzI1Mzg2OCBGMzAwXG5HMSBYMTgzLjM3NTg0Njk0MTU5ODIgWTE5Ni4wMTQ1Mzc4NDQ4MzQwMiBGMzAwXG5HMSBYMTg2LjU4MjI1MjczNTYzODkyIFkxOTYuNzk2NjkyOTk4MjAzMzMgRjMwMFxuRzEgWDE4OC4xOTQwMTAwMDAwMDAwMiBZMTk2Ljg5MjA3IEYzMDBcbkcxIFgxOTEuNDcwMjgzODU3NDU5MSBZMTk2LjQ5MzUyOTY0OTU1ODEgRjMwMFxuRzEgWDE5NC41NTU0NjczMzQ3OTIxIFkxOTUuMzIxMTYxMjI5OTk0IEYzMDBcbkcxIFgxOTcuMjY5NjE2Mzc2NjUyNDYgWTE5My40NDMzNDM0MDY0MTAzNSBGMzAwXG5HMSBYMTk5LjQ1NDQyNzU5ODgxODEgWTE5MC45Njk2MDAzNDcwOTc0IEYzMDBcbkcxIFgyMDAuOTgyNDcxMzcwNDgzNzggWTE4OC4wNDQyMTM3MDA1MzcwMyBGMzAwXG5HMSBYMjAxLjc2NDYyNDE3NzU4OTA0IFkxODQuODM3ODA3MzM0MTYwOSBGMzAwXG5HMSBYMjAxLjg2IFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU0MFxuRzAgWDM2LjU4MTc0NCBZMTU5LjYxNDlcbkcxIFgzNi4xODMyMDM2NDk1NTc3OSBZMTU2LjMzODYyNjE0MjU0MDk2IEYzMDBcbkcxIFgzNS4wMTA4MzUyMjk5OTM0IFkxNTMuMjUzNDQyNjY1MjA4MDQgRjMwMFxuRzEgWDMzLjEzMzAxNzQwNjQwOTQ2NSBZMTUwLjUzOTI5MzYyMzM0Nzg1IEYzMDBcbkcxIFgzMC42NTkyNzQzNDcwOTYzMzYgWTE0OC4zNTQ0ODI0MDExODI0MiBGMzAwXG5HMSBYMjcuNzMzODg3NzAwNTM1NzkyIFkxNDYuODI2NDM4NjI5NTE3MDcgRjMwMFxuRzEgWDI0LjUyNzQ4MTMzNDE1OTU4NSBZMTQ2LjA0NDI4NTgyMjQxMjEgRjMwMFxuRzEgWDIyLjkxNTczOTAwMDAwMDAwNiBZMTQ1Ljk0ODkxIEYzMDBcbkcxIFgxOS42Mzk0NjQ2MzUxMDg5MTUgWTE0Ni4zNDc0NDYxNzg5ODIgRjMwMFxuRzEgWDE2LjU1NDI3OTY2NTA4MDM5IFkxNDcuNTE5ODEwNjcwMzg4MTUgRjMwMFxuRzEgWDEzLjg0MDEyODIzMjMyMjg0OSBZMTQ5LjM5NzYyNTAzODIyNjUyIEYzMDBcbkcxIFgxMS42NTUzMTM4NjA1MDc5NjEgWTE1MS44NzEzNjUzMTU3NjQgRjMwMFxuRzEgWDEwLjEyNzI2NjM2NDE0NTEzMiBZMTU0Ljc5Njc1MDAxNjc2NjQ1IEYzMDBcbkcxIFg5LjM0NTEwOTQ3NDUzODUyMSBZMTU4LjAwMzE1NTM4NzI3NzMgRjMwMFxuRzEgWDkuMjQ5NzMxNjAwMDAwMDAyIFkxNTkuNjE0OSBGMzAwXG5HMSBYOS42NDgyNjQ3NTgyNzI5MDcgWTE2Mi44OTExNzQ3MzIzMzgwNyBGMzAwXG5HMSBYMTAuODIwNjI2NDA1MTUzMDk0IFkxNjUuOTc2MzYwNzgzMjc5NjMgRjMwMFxuRzEgWDEyLjY5ODQzODI3MDU1NjMyNyBZMTY4LjY5MDUxMzk0NzM3MTY3IEYzMDBcbkcxIFgxNS4xNzIxNzY1MzM3MDQ1ODMgWTE3MC44NzUzMzA1OTk5NjIwNyBGMzAwXG5HMSBYMTguMDk3NTU5ODI1ODUzNSBZMTcyLjQwMzM4MDc5MzUxNDYzIEYzMDBcbkcxIFgyMS4zMDM5NjQ0NzUyMTgxOSBZMTczLjE4NTU0MDYzOTQxMSBGMzAwXG5HMSBYMjIuOTE1NzM4OTk5OTk5OTkgWTE3My4yODA5MTk5OTk5OTk5NSBGMzAwXG5HMSBYMjYuMTkyMDEzMjk0OTAwNzQ3IFkxNzIuODgyMzgzMjQ1NjQzODcgRjMwMFxuRzEgWDI5LjI3NzE5ODA1OTA0MDQ2NSBZMTcxLjcxMDAxODIxMjQyMjQ4IEYzMDBcbkcxIFgzMS45OTEzNDkxNjIwMTkxOSBZMTY5LjgzMjIwMzM2NzkyOTIgRjMwMFxuRzEgWDM0LjE3NjE2MzA5OTM5OTcgWTE2Ny4zNTg0NjI3MDY2OTgxNiBGMzAwXG5HMSBYMzUuNzA0MjEwMDgyMDExMTEgWTE2NC40MzMwNzc3MzczNDI0NyBGMzAwXG5HMSBYMzYuNDg2MzY2NDA4NTEzOTEgWTE2MS4yMjY2NzIyMjk0NzA1IEYzMDBcbkcxIFgzNi41ODE3NDQgWTE1OS42MTQ4OTk5OTk5OTk5OCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTQxXG5HMCBYNjAuMTkyOTIyIFkxNTkuNjE0OVxuRzEgWDU5Ljc5NDM4MTY0OTU1Nzc5IFkxNTYuMzM4NjI2MTQyNTQwOTYgRjMwMFxuRzEgWDU4LjYyMjAxMzIyOTk5MzQgWTE1My4yNTM0NDI2NjUyMDgwNCBGMzAwXG5HMSBYNTYuNzQ0MTk1NDA2NDA5NDcgWTE1MC41MzkyOTM2MjMzNDc4NSBGMzAwXG5HMSBYNTQuMjcwNDUyMzQ3MDk2MzQgWTE0OC4zNTQ0ODI0MDExODI0MiBGMzAwXG5HMSBYNTEuMzQ1MDY1NzAwNTM1NzkgWTE0Ni44MjY0Mzg2Mjk1MTcwNyBGMzAwXG5HMSBYNDguMTM4NjU5MzM0MTU5NTkgWTE0Ni4wNDQyODU4MjI0MTIxIEYzMDBcbkcxIFg0Ni41MjY5MTcwMDAwMDAwMDUgWTE0NS45NDg5MSBGMzAwXG5HMSBYNDMuMjUwNjQyNjE3NjExMzU1IFkxNDYuMzQ3NDQ2MDM1MTM4NjMgRjMwMFxuRzEgWDQwLjE2NTQ1NzU5NjExMDY2IFkxNDcuNTE5ODEwMzkxMDkxMDYgRjMwMFxuRzEgWDM3LjQ1MTMwNjA4MDkwODUzIFkxNDkuMzk3NjI0NjM5NzY1OCBGMzAwXG5HMSBYMzUuMjY2NDkxNjAwNDg1MTcgWTE1MS44NzEzNjQ4MjEzNzk5NiBGMzAwXG5HMSBYMzMuNzM4NDQzOTc1Njg0NiBZMTU0Ljc5Njc0OTQ1NTI5NDE2IEYzMDBcbkcxIFgzMi45NTYyODY5NDUzMDIxNyBZMTU4LjAwMzE1NDc5MTQ2NDc3IEYzMDBcbkcxIFgzMi44NjA5MDkgWTE1OS42MTQ4OTk5OTk5OTk5OCBGMzAwXG5HMSBYMzMuMjU5NDQyMTU4MjcyODggWTE2Mi44OTExNzQ3MzIzMzgxIEYzMDBcbkcxIFgzNC40MzE4MDM4MDUxNTMwNDUgWTE2NS45NzYzNjA3ODMyNzk2MyBGMzAwXG5HMSBYMzYuMzA5NjE1NjcwNTU2MjYgWTE2OC42OTA1MTM5NDczNzE3IEYzMDBcbkcxIFgzOC43ODMzNTM5MzM3MDQ1IFkxNzAuODc1MzMwNTk5OTYyMSBGMzAwXG5HMSBYNDEuNzA4NzM3MjI1ODUzNDEgWTE3Mi40MDMzODA3OTM1MTQ2OSBGMzAwXG5HMSBYNDQuOTE1MTQxODc1MjE4MDkgWTE3My4xODU1NDA2Mzk0MTEwNCBGMzAwXG5HMSBYNDYuNTI2OTE2OTk5OTk5OTkgWTE3My4yODA5MTk5OTk5OTk5OCBGMzAwXG5HMSBYNDkuODAzMTkxMjk0OTAwNzUgWTE3Mi44ODIzODMyNDU2NDM4NyBGMzAwXG5HMSBYNTIuODg4Mzc2MDU5MDQwNDcgWTE3MS43MTAwMTgyMTI0MjI0OCBGMzAwXG5HMSBYNTUuNjAyNTI3MTYyMDE5MTkgWTE2OS44MzIyMDMzNjc5MjkyIEYzMDBcbkcxIFg1Ny43ODczNDEwOTkzOTk3MSBZMTY3LjM1ODQ2MjcwNjY5ODE2IEYzMDBcbkcxIFg1OS4zMTUzODgwODIwMTExMDQgWTE2NC40MzMwNzc3MzczNDI0NyBGMzAwXG5HMSBYNjAuMDk3NTQ0NDA4NTEzOTEgWTE2MS4yMjY2NzIyMjk0NzA1MiBGMzAwXG5HMSBYNjAuMTkyOTIyIFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU0MlxuRzAgWDgzLjgwNDA5IFkxNTkuNjE0OVxuRzEgWDgzLjQwNTU0OTY0OTU1NzgxIFkxNTYuMzM4NjI2MTQyNTQwOTYgRjMwMFxuRzEgWDgyLjIzMzE4MTIyOTk5MzQ1IFkxNTMuMjUzNDQyNjY1MjA4IEYzMDBcbkcxIFg4MC4zNTUzNjM0MDY0MDk1NSBZMTUwLjUzOTI5MzYyMzM0Nzg1IEYzMDBcbkcxIFg3Ny44ODE2MjAzNDcwOTY0MyBZMTQ4LjM1NDQ4MjQwMTE4MjM3IEYzMDBcbkcxIFg3NC45NTYyMzM3MDA1MzU5MiBZMTQ2LjgyNjQzODYyOTUxNyBGMzAwXG5HMSBYNzEuNzQ5ODI3MzM0MTU5NzIgWTE0Ni4wNDQyODU4MjI0MTIgRjMwMFxuRzEgWDcwLjEzODA4MiBZMTQ1Ljk0ODkxIEYzMDBcbkcxIFg2Ni44NjE4MDc3MDUwOTkxOCBZMTQ2LjM0NzQ0Njc1NDM1NTU2IEYzMDBcbkcxIFg2My43NzY2MjI5NDA5NTkzIFkxNDcuNTE5ODExNzg3NTc2NDYgRjMwMFxuRzEgWDYxLjA2MjQ3MTgzNzk4MDI3IFkxNDkuMzk3NjI2NjMyMDY5MzIgRjMwMFxuRzEgWDU4Ljg3NzY1NzkwMDU5OTM0NSBZMTUxLjg3MTM2NzI5MzMgRjMwMFxuRzEgWDU3LjM0OTYxMDkxNzk4NzQ3IFkxNTQuNzk2NzUyMjYyNjU1NDUgRjMwMFxuRzEgWDU2LjU2NzQ1NDU5MTQ4NDE1IFkxNTguMDAzMTU3NzcwNTI3MjggRjMwMFxuRzEgWDU2LjQ3MjA3NyBZMTU5LjYxNDg5OTk5OTk5OTk4IEYzMDBcbkcxIFg1Ni44NzA2MTAxNTgyNzI5MiBZMTYyLjg5MTE3NDczMjMzODA3IEYzMDBcbkcxIFg1OC4wNDI5NzE4MDUxNTMxMTUgWTE2NS45NzYzNjA3ODMyNzk2MyBGMzAwXG5HMSBYNTkuOTIwNzgzNjcwNTU2MzU0IFkxNjguNjkwNTEzOTQ3MzcxNjcgRjMwMFxuRzEgWDYyLjM5NDUyMTkzMzcwNDYyIFkxNzAuODc1MzMwNTk5OTYyMDcgRjMwMFxuRzEgWDY1LjMxOTkwNTIyNTg1MzU1IFkxNzIuNDAzMzgwNzkzNTE0NjMgRjMwMFxuRzEgWDY4LjUyNjMwOTg3NTIxODIgWTE3My4xODU1NDA2Mzk0MTA5NiBGMzAwXG5HMSBYNzAuMTM4MDgyMDAwMDAwMDEgWTE3My4yODA5MTk5OTk5OTk5NSBGMzAwXG5HMSBYNzMuNDE0MzU2MzgyMzg4NTMgWTE3Mi44ODIzODM5NjQ4NjA4MiBGMzAwXG5HMSBYNzYuNDk5NTQxNDAzODg5MDUgWTE3MS43MTAwMTk2MDg5MDc4OCBGMzAwXG5HMSBYNzkuMjEzNjkyOTE5MDkwOSBZMTY5LjgzMjIwNTM2MDIzMjcgRjMwMFxuRzEgWDgxLjM5ODUwNzM5OTUxMzg3IFkxNjcuMzU4NDY1MTc4NjE4MjIgRjMwMFxuRzEgWDgyLjkyNjU1NTAyNDMxMzk3IFkxNjQuNDMzMDgwNTQ0NzAzNzYgRjMwMFxuRzEgWDgzLjcwODcxMjA1NDY5NTg4IFkxNjEuMjI2Njc1MjA4NTMzMDQgRjMwMFxuRzEgWDgzLjgwNDA5IFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU0M1xuRzAgWDEwNy40MTUyNSBZMTU5LjYxNDlcbkcxIFgxMDcuMDE2NzA5NjQ5NTU4MjEgWTE1Ni4zMzg2MjYxNDI1NDA5IEYzMDBcbkcxIFgxMDUuODQ0MzQxMjI5OTk0MjEgWTE1My4yNTM0NDI2NjUyMDc4NCBGMzAwXG5HMSBYMTAzLjk2NjUyMzQwNjQxMDYzIFkxNTAuNTM5MjkzNjIzMzQ3NDIgRjMwMFxuRzEgWDEwMS40OTI3ODAzNDcwOTc3NiBZMTQ4LjM1NDQ4MjQwMTE4MTY2IEYzMDBcbkcxIFg5OC41NjczOTM3MDA1Mzc0MSBZMTQ2LjgyNjQzODYyOTUxNTkgRjMwMFxuRzEgWDk1LjM2MDk4NzMzNDE2MTMyIFkxNDYuMDQ0Mjg1ODIyNDEwNTYgRjMwMFxuRzEgWDkzLjc0OTI1MTAwMDAwMDAyIFkxNDUuOTQ4OTEgRjMwMFxuRzEgWDkwLjQ3Mjk3NjYxNzYxMTM3IFkxNDYuMzQ3NDQ2MDM1MTM4NjMgRjMwMFxuRzEgWDg3LjM4Nzc5MTU5NjExMDY3IFkxNDcuNTE5ODEwMzkxMDkxMDYgRjMwMFxuRzEgWDg0LjY3MzY0MDA4MDkwODU0IFkxNDkuMzk3NjI0NjM5NzY1NzggRjMwMFxuRzEgWDgyLjQ4ODgyNTYwMDQ4NTE5IFkxNTEuODcxMzY0ODIxMzc5OTMgRjMwMFxuRzEgWDgwLjk2MDc3Nzk3NTY4NDYgWTE1NC43OTY3NDk0NTUyOTQxMyBGMzAwXG5HMSBYODAuMTc4NjIwOTQ1MzAyMTcgWTE1OC4wMDMxNTQ3OTE0NjQ3IEYzMDBcbkcxIFg4MC4wODMyNDMgWTE1OS42MTQ4OTk5OTk5OTk5OCBGMzAwXG5HMSBYODAuNDgxNzc2MTU4MjcyODggWTE2Mi44OTExNzQ3MzIzMzgwNyBGMzAwXG5HMSBYODEuNjU0MTM3ODA1MTUzMDQgWTE2NS45NzYzNjA3ODMyNzk2IEYzMDBcbkcxIFg4My41MzE5NDk2NzA1NTYyNCBZMTY4LjY5MDUxMzk0NzM3MTY3IEYzMDBcbkcxIFg4Ni4wMDU2ODc5MzM3MDQ0OCBZMTcwLjg3NTMzMDU5OTk2MjEgRjMwMFxuRzEgWDg4LjkzMTA3MTIyNTg1MzM3IFkxNzIuNDAzMzgwNzkzNTE0NjYgRjMwMFxuRzEgWDkyLjEzNzQ3NTg3NTIxODA0IFkxNzMuMTg1NTQwNjM5NDExMDQgRjMwMFxuRzEgWDkzLjc0OTI1MTAwMDAwMDAyIFkxNzMuMjgwOTE5OTk5OTk5OTggRjMwMFxuRzEgWDk3LjAyNTUyNTExOTkyNDU4IFkxNzIuODgyMzgxODA3MjEwMDcgRjMwMFxuRzEgWDEwMC4xMTA3MDkzNjkzNDIyOSBZMTcxLjcxMDAxNTQxOTQ1MTk2IEYzMDBcbkcxIFgxMDIuODI0ODU5NjQ3ODc0MzYgWTE2OS44MzIxOTkzODMzMjI3MiBGMzAwXG5HMSBYMTA1LjAwOTY3MjQ5OTE2OTcgWTE2Ny4zNTg0NTc3NjI4NTg5MyBGMzAwXG5HMSBYMTA2LjUzNzcxODE5NzQwMzUyIFkxNjQuNDMzMDcyMTIyNjIxMTggRjMwMFxuRzEgWDEwNy4zMTk4NzMxMTYxNDc5NyBZMTYxLjIyNjY2NjI3MTM0NzIzIEYzMDBcbkcxIFgxMDcuNDE1MjUgWTE1OS42MTQ5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNDRcbkcwIFgxMzEuMDI2NDEgWTE1OS42MTQ5XG5HMSBYMTMwLjYyNzg2OTY0OTU1ODEgWTE1Ni4zMzg2MjYxNDI1NDA5MyBGMzAwXG5HMSBYMTI5LjQ1NTUwMTIyOTk5NCBZMTUzLjI1MzQ0MjY2NTIwNzkzIEYzMDBcbkcxIFgxMjcuNTc3NjgzNDA2NDEwMzQgWTE1MC41MzkyOTM2MjMzNDc1NiBGMzAwXG5HMSBYMTI1LjEwMzk0MDM0NzA5NzQzIFkxNDguMzU0NDgyNDAxMTgxODggRjMwMFxuRzEgWDEyMi4xNzg1NTM3MDA1MzcwNyBZMTQ2LjgyNjQzODYyOTUxNjI4IEYzMDBcbkcxIFgxMTguOTcyMTQ3MzM0MTYwOTIgWTE0Ni4wNDQyODU4MjI0MTA5OCBGMzAwXG5HMSBYMTE3LjM2MDQxIFkxNDUuOTQ4OTEgRjMwMFxuRzEgWDExNC4wODQxMzU4NTA5MTI1OSBZMTQ2LjM0NzQ0Nzk1MzA1MDQyIEYzMDBcbkcxIFgxMTAuOTk4OTUxNTE1NzA3NjkgWTE0Ny41MTk4MTQxMTUwNTE5MyBGMzAwXG5HMSBYMTA4LjI4NDgwMTA5OTc2NzQ4IFkxNDkuMzk3NjI5OTUyNTc0NzYgRjMwMFxuRzEgWDEwNi4wOTk5ODgwNjc0NTc1MyBZMTUxLjg3MTM3MTQxMzE2NjEgRjMwMFxuRzEgWDEwNC41NzE5NDIxNTUxNjAzIFkxNTQuNzk2NzU2OTQxNTg5OTMgRjMwMFxuRzEgWDEwMy43ODk3ODcwMDE3ODg5MiBZMTU4LjAwMzE2MjczNTYzMDEzIEYzMDBcbkcxIFgxMDMuNjk0NDEgWTE1OS42MTQ4OTk5OTk5OTk5OCBGMzAwXG5HMSBYMTA0LjA5Mjk0MzE1ODI3MjYgWTE2Mi44OTExNzQ3MzIzMzgxMyBGMzAwXG5HMSBYMTA1LjI2NTMwNDgwNTE1MjUgWTE2NS45NzYzNjA3ODMyNzk4IEYzMDBcbkcxIFgxMDcuMTQzMTE2NjcwNTU1NDYgWTE2OC42OTA1MTM5NDczNzIgRjMwMFxuRzEgWDEwOS42MTY4NTQ5MzM3MDM0OCBZMTcwLjg3NTMzMDU5OTk2MjYgRjMwMFxuRzEgWDExMi41NDIyMzgyMjU4NTIyNCBZMTcyLjQwMzM4MDc5MzUxNTQ1IEYzMDBcbkcxIFgxMTUuNzQ4NjQyODc1MjE2ODYgWTE3My4xODU1NDA2Mzk0MTIxMiBGMzAwXG5HMSBYMTE3LjM2MDQxMDAwMDAwMDAyIFkxNzMuMjgwOTIgRjMwMFxuRzEgWDEyMC42MzY2ODQxNDkwODczNCBZMTcyLjg4MjM4MjA0Njk0OTA2IEYzMDBcbkcxIFgxMjMuNzIxODY4NDg0MjkyMDkgWTE3MS43MTAwMTU4ODQ5NDcwNyBGMzAwXG5HMSBYMTI2LjQzNjAxODkwMDIzMTk3IFkxNjkuODMyMjAwMDQ3NDIzNzggRjMwMFxuRzEgWDEyOC42MjA4MzE5MzI1NDE1MyBZMTY3LjM1ODQ1ODU4NjgzMjA5IEYzMDBcbkcxIFgxMzAuMTQ4ODc3ODQ0ODM4MyBZMTY0LjQzMzA3MzA1ODQwOCBGMzAwXG5HMSBYMTMwLjkzMTAzMjk5ODIwOTEzIFkxNjEuMjI2NjY3MjY0MzY3NyBGMzAwXG5HMSBYMTMxLjAyNjQxIFkxNTkuNjE0OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTQ1XG5HMCBYMTU0LjYzNzYgWTE1OS42MTQ5XG5HMSBYMTU0LjIzOTA1OTY0OTU1ODEgWTE1Ni4zMzg2MjYxNDI1NDA5MyBGMzAwXG5HMSBYMTUzLjA2NjY5MTIyOTk5NCBZMTUzLjI1MzQ0MjY2NTIwNzkzIEYzMDBcbkcxIFgxNTEuMTg4ODczNDA2NDEwMzUgWTE1MC41MzkyOTM2MjMzNDc1NiBGMzAwXG5HMSBYMTQ4LjcxNTEzMDM0NzA5NzQgWTE0OC4zNTQ0ODI0MDExODE4OCBGMzAwXG5HMSBYMTQ1Ljc4OTc0MzcwMDUzNzA2IFkxNDYuODI2NDM4NjI5NTE2MjggRjMwMFxuRzEgWDE0Mi41ODMzMzczMzQxNjA5MiBZMTQ2LjA0NDI4NTgyMjQxMDk4IEYzMDBcbkcxIFgxNDAuOTcxNiBZMTQ1Ljk0ODkxIEYzMDBcbkcxIFgxMzcuNjk1MzI1NTU5Mjg2MjYgWTE0Ni4zNDc0NDU1NTU2NjA2NyBGMzAwXG5HMSBYMTM0LjYxMDE0MDM2NjIxMTggWTE0Ny41MTk4MDk0NjAxMDA4IEYzMDBcbkcxIFgxMzEuODk1OTg4NTc2MTk0MyBZMTQ5LjM5NzYyMzMxMTU2MzQgRjMwMFxuRzEgWDEyOS43MTExNzM3MzM3NDI3IFkxNTEuODcxMzYzMTczNDMzMSBGMzAwXG5HMSBYMTI4LjE4MzEyNTY4MDgxNjQgWTE1NC43OTY3NDc1ODM3MTk3NiBGMzAwXG5HMSBYMTI3LjQwMDk2ODE4MTE4MTI0IFkxNTguMDAzMTUyODA1NDIyODEgRjMwMFxuRzEgWDEyNy4zMDU1OTAwMDAwMDAwMiBZMTU5LjYxNDkgRjMwMFxuRzEgWDEyNy43MDQxMjMxNTgyNzI3OCBZMTYyLjg5MTE3NDczMjMzODEgRjMwMFxuRzEgWDEyOC44NzY0ODQ4MDUxNTI4NCBZMTY1Ljk3NjM2MDc4MzI3OTcgRjMwMFxuRzEgWDEzMC43NTQyOTY2NzA1NTU5NiBZMTY4LjY5MDUxMzk0NzM3MTggRjMwMFxuRzEgWDEzMy4yMjgwMzQ5MzM3MDQxMiBZMTcwLjg3NTMzMDU5OTk2MjMzIEYzMDBcbkcxIFgxMzYuMTUzNDE4MjI1ODUyOTYgWTE3Mi40MDMzODA3OTM1MTUgRjMwMFxuRzEgWDEzOS4zNTk4MjI4NzUyMTc2IFkxNzMuMTg1NTQwNjM5NDExNDcgRjMwMFxuRzEgWDE0MC45NzE2MDAwMDAwMDAwMiBZMTczLjI4MDkyIEYzMDBcbkcxIFgxNDQuMjQ3ODc0MTQ5MDg3MzUgWTE3Mi44ODIzODIwNDY5NDkwNiBGMzAwXG5HMSBYMTQ3LjMzMzA1ODQ4NDI5MjA4IFkxNzEuNzEwMDE1ODg0OTQ3MDcgRjMwMFxuRzEgWDE1MC4wNDcyMDg5MDAyMzE5NiBZMTY5LjgzMjIwMDA0NzQyMzc4IEYzMDBcbkcxIFgxNTIuMjMyMDIxOTMyNTQxNTMgWTE2Ny4zNTg0NTg1ODY4MzIwOSBGMzAwXG5HMSBYMTUzLjc2MDA2Nzg0NDgzODMyIFkxNjQuNDMzMDczMDU4NDA3OTggRjMwMFxuRzEgWDE1NC41NDIyMjI5OTgyMDkxNiBZMTYxLjIyNjY2NzI2NDM2NzY4IEYzMDBcbkcxIFgxNTQuNjM3NiBZMTU5LjYxNDkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU0NlxuRzAgWDE3OC4yNDg4MSBZMTU5LjYxNDlcbkcxIFgxNzcuODUwMjY5NjQ5NTU5NSBZMTU2LjMzODYyNjE0MjU0MDc2IEYzMDBcbkcxIFgxNzYuNjc3OTAxMjI5OTk2NyBZMTUzLjI1MzQ0MjY2NTIwNzIyIEYzMDBcbkcxIFgxNzQuODAwMDgzNDA2NDE0MiBZMTUwLjUzOTI5MzYyMzM0NjA1IEYzMDBcbkcxIFgxNzIuMzI2MzQwMzQ3MTAyMiBZMTQ4LjM1NDQ4MjQwMTE3OTMzIEYzMDBcbkcxIFgxNjkuNDAwOTUzNzAwNTQyNDMgWTE0Ni44MjY0Mzg2Mjk1MTI0NCBGMzAwXG5HMSBYMTY2LjE5NDU0NzMzNDE2NjYzIFkxNDYuMDQ0Mjg1ODIyNDA1OCBGMzAwXG5HMSBYMTY0LjU4Mjc5IFkxNDUuOTQ4OTEgRjMwMFxuRzEgWDE2MS4zMDY1MTYxNDI1NDA3MiBZMTQ2LjM0NzQ1MDM1MDQzOTk3IEYzMDBcbkcxIFgxNTguMjIxMzMyNjY1MjA3IFkxNDcuNTE5ODE4NzcwMDAyMjcgRjMwMFxuRzEgWDE1NS41MDcxODM2MjMzNDU1NSBZMTQ5LjM5NzYzNjU5MzU4NDM0IEYzMDBcbkcxIFgxNTMuMzIyMzcyNDAxMTc4NCBZMTUxLjg3MTM3OTY1Mjg5NiBGMzAwXG5HMSBYMTUxLjc5NDMyODYyOTUxMTA2IFkxNTQuNzk2NzY2Mjk5NDU1NSBGMzAwXG5HMSBYMTUxLjAxMjE3NTgyMjQwMzkgWTE1OC4wMDMxNzI2NjU4MzExNiBGMzAwXG5HMSBYMTUwLjkxNjgwMDAwMDAwMDAyIFkxNTkuNjE0OSBGMzAwXG5HMSBYMTUxLjMxNTMzMzE1ODI3MDY4IFkxNjIuODkxMTc0NzMyMzM4MzggRjMwMFxuRzEgWDE1Mi40ODc2OTQ4MDUxNDg3NSBZMTY1Ljk3NjM2MDc4MzI4MDcgRjMwMFxuRzEgWDE1NC4zNjU1MDY2NzA1NTAxMyBZMTY4LjY5MDUxMzk0NzM3NDAzIEYzMDBcbkcxIFgxNTYuODM5MjQ0OTMzNjk2ODggWTE3MC44NzUzMzA1OTk5NjYxIEYzMDBcbkcxIFgxNTkuNzY0NjI4MjI1ODQ0NzUgWTE3Mi40MDMzODA3OTM1MjA2OCBGMzAwXG5HMSBYMTYyLjk3MTAzMjg3NTIwODkgWTE3My4xODU1NDA2Mzk0MTkyMyBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkxNzMuMjgwOTIgRjMwMFxuRzEgWDE2Ny44NTkwNjQ3MzIzMzgzIFkxNzIuODgyMzg2ODQxNzI4ODIgRjMwMFxuRzEgWDE3MC45NDQyNTA3ODMyODA0NyBZMTcxLjcxMDAyNTE5NDg1MDIzIEYzMDBcbkcxIFgxNzMuNjU4NDAzOTQ3MzczNSBZMTY5LjgzMjIxMzMyOTQ0ODQyIEYzMDBcbkcxIFgxNzUuODQzMjIwNTk5OTY1MTggWTE2Ny4zNTg0NzUwNjYzMDEzIEYzMDBcbkcxIFgxNzcuMzcxMjcwNzkzNTE5MjcgWTE2NC40MzMwOTE3NzQxNTMxOCBGMzAwXG5HMSBYMTc4LjE1MzQzMDYzOTQxNzI4IFkxNjEuMjI2Njg3MTI0Nzg4OTIgRjMwMFxuRzEgWDE3OC4yNDg4MSBZMTU5LjYxNDkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU0N1xuRzAgWDIwMS44NiBZMTU5LjYxNDlcbkcxIFgyMDEuNDYxNDU5NjQ5NTYwMDMgWTE1Ni4zMzg2MjYxNDI1NDA3IEYzMDBcbkcxIFgyMDAuMjg5MDkxMjI5OTk3NzUgWTE1My4yNTM0NDI2NjUyMDY5NiBGMzAwXG5HMSBYMTk4LjQxMTI3MzQwNjQxNTcgWTE1MC41MzkyOTM2MjMzNDU1MSBGMzAwXG5HMSBYMTk1LjkzNzUzMDM0NzEwNDA2IFkxNDguMzU0NDgyNDAxMTc4NDIgRjMwMFxuRzEgWDE5My4wMTIxNDM3MDA1NDQ1NiBZMTQ2LjgyNjQzODYyOTUxMTA1IEYzMDBcbkcxIFgxODkuODA1NzM3MzM0MTY4OSBZMTQ2LjA0NDI4NTgyMjQwMzg4IEYzMDBcbkcxIFgxODguMTk0MDEgWTE0NS45NDg5MSBGMzAwXG5HMSBYMTg0LjkxNzczNTU1OTI4NjIzIFkxNDYuMzQ3NDQ1NTU1NjYwNjcgRjMwMFxuRzEgWDE4MS44MzI1NTAzNjYyMTE3NiBZMTQ3LjUxOTgwOTQ2MDEwMDggRjMwMFxuRzEgWDE3OS4xMTgzOTg1NzYxOTQyNyBZMTQ5LjM5NzYyMzMxMTU2MzQgRjMwMFxuRzEgWDE3Ni45MzM1ODM3MzM3NDI2NyBZMTUxLjg3MTM2MzE3MzQzMzEgRjMwMFxuRzEgWDE3NS40MDU1MzU2ODA4MTYzNyBZMTU0Ljc5Njc0NzU4MzcxOTc2IEYzMDBcbkcxIFgxNzQuNjIzMzc4MTgxMTgxMiBZMTU4LjAwMzE1MjgwNTQyMjgxIEYzMDBcbkcxIFgxNzQuNTI4IFkxNTkuNjE0OSBGMzAwXG5HMSBYMTc0LjkyNjUzMzE1ODI3Mjc4IFkxNjIuODkxMTc0NzMyMzM4MSBGMzAwXG5HMSBYMTc2LjA5ODg5NDgwNTE1Mjg0IFkxNjUuOTc2MzYwNzgzMjc5NyBGMzAwXG5HMSBYMTc3Ljk3NjcwNjY3MDU1NTk4IFkxNjguNjkwNTEzOTQ3MzcxOCBGMzAwXG5HMSBYMTgwLjQ1MDQ0NDkzMzcwNDE1IFkxNzAuODc1MzMwNTk5OTYyMyBGMzAwXG5HMSBYMTgzLjM3NTgyODIyNTg1MyBZMTcyLjQwMzM4MDc5MzUxNDk3IEYzMDBcbkcxIFgxODYuNTgyMjMyODc1MjE3NjcgWTE3My4xODU1NDA2Mzk0MTE0NCBGMzAwXG5HMSBYMTg4LjE5NDAxIFkxNzMuMjgwOTE5OTk5OTk5OTUgRjMwMFxuRzEgWDE5MS40NzAyODM4NTc0NTkyNCBZMTcyLjg4MjM3OTY0OTU1OTQ1IEYzMDBcbkcxIFgxOTQuNTU1NDY3MzM0NzkyNzggWTE3MS43MTAwMTEyMjk5OTY2NyBGMzAwXG5HMSBYMTk3LjI2OTYxNjM3NjY1Mzk0IFkxNjkuODMyMTkzNDA2NDE0MTggRjMwMFxuRzEgWDE5OS40NTQ0Mjc1OTg4MjA3IFkxNjcuMzU4NDUwMzQ3MTAyMTggRjMwMFxuRzEgWDIwMC45ODI0NzEzNzA0ODc1NiBZMTY0LjQzMzA2MzcwMDU0MjQ1IEYzMDBcbkcxIFgyMDEuNzY0NjI0MTc3NTk0MjEgWTE2MS4yMjY2NTczMzQxNjY2NSBGMzAwXG5HMSBYMjAxLjg2IFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU0OFxuRzAgWDM2LjU4MTc0NCBZMTM2LjAwMzcxXG5HMSBYMzYuMTgzMjEwODQxNzI3MDk2IFkxMzIuNzI3NDM1MjY3NjYxOTIgRjMwMFxuRzEgWDM1LjAxMDg0OTE5NDg0NjkwNSBZMTI5LjY0MjI0OTIxNjcyMDMzIEYzMDBcbkcxIFgzMy4xMzMwMzczMjk0NDM2OCBZMTI2LjkyODA5NjA1MjYyODMyIEYzMDBcbkcxIFgzMC42NTkyOTkwNjYyOTU0MzIgWTEyNC43NDMyNzk0MDAwMzc5MiBGMzAwXG5HMSBYMjcuNzMzOTE1Nzc0MTQ2NTE3IFkxMjMuMjE1MjI5MjA2NDg1MzYgRjMwMFxuRzEgWDI0LjUyNzUxMTEyNDc4MTg0IFkxMjIuNDMzMDY5MzYwNTg5MDIgRjMwMFxuRzEgWDIyLjkxNTczOTAwMDAwMDAwNiBZMTIyLjMzNzY5IEYzMDBcbkcxIFgxOS42Mzk0NjQ2MzUxMDg5ODYgWTEyMi43MzYyMjYxNzg5ODI1NSBGMzAwXG5HMSBYMTYuNTU0Mjc5NjY1MDgwNjI1IFkxMjMuOTA4NTkwNjcwMzg5MTcgRjMwMFxuRzEgWDEzLjg0MDEyODIzMjMyMzQwNyBZMTI1Ljc4NjQwNTAzODIyNzk3IEYzMDBcbkcxIFgxMS42NTUzMTM4NjA1MDg5MyBZMTI4LjI2MDE0NTMxNTc2NTc4IEYzMDBcbkcxIFgxMC4xMjcyNjYzNjQxNDY1NjYgWTEzMS4xODU1MzAwMTY3Njg1IEYzMDBcbkcxIFg5LjM0NTEwOTQ3NDU0MDQ2IFkxMzQuMzkxOTM1Mzg3Mjc5NSBGMzAwXG5HMSBYOS4yNDk3MzE2MDAwMDAwMDIgWTEzNi4wMDM3MSBGMzAwXG5HMSBYOS42NDgyNjcxNTU2NjI4ODIgWTEzOS4yNzk5ODQ0NDA3MTM1IEYzMDBcbkcxIFgxMC44MjA2MzEwNjAxMDUwOTMgWTE0Mi4zNjUxNjk2MzM3ODcyIEYzMDBcbkcxIFgxMi42OTg0NDQ5MTE1Njk1NCBZMTQ1LjA3OTMyMTQyMzgwMzM4IEYzMDBcbkcxIFgxNS4xNzIxODQ3NzM0NDA3NCBZMTQ3LjI2NDEzNjI2NjI1MzMgRjMwMFxuRzEgWDE4LjA5NzU2OTE4MzcyODQzIFkxNDguNzkyMTg0MzE5MTc3NjQgRjMwMFxuRzEgWDIxLjMwMzk3NDQwNTQzMTk4MyBZMTQ5LjU3NDM0MTgxODgxMDYgRjMwMFxuRzEgWDIyLjkxNTczOSBZMTQ5LjY2OTcyIEYzMDBcbkcxIFgyNi4xOTIwMTMyOTQ5MDA1NSBZMTQ5LjI3MTE4MzI0NTY0MjM2IEYzMDBcbkcxIFgyOS4yNzcxOTgwNTkwMzk2ODQgWTE0OC4wOTg4MTgyMTI0MTk1IEYzMDBcbkcxIFgzMS45OTEzNDkxNjIwMTc0OTIgWTE0Ni4yMjEwMDMzNjc5MjQ5IEYzMDBcbkcxIFgzNC4xNzYxNjMwOTkzOTY4MyBZMTQzLjc0NzI2MjcwNjY5MjgyIEYzMDBcbkcxIFgzNS43MDQyMTAwODIwMDY4MjQgWTE0MC44MjE4Nzc3MzczMzY0IEYzMDBcbkcxIFgzNi40ODYzNjY0MDg1MDgxIFkxMzcuNjE1NDcyMjI5NDY0MDcgRjMwMFxuRzEgWDM2LjU4MTc0NCBZMTM2LjAwMzcxIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNDlcbkcwIFg2MC4xOTI5MjIgWTEzNi4wMDM3MVxuRzEgWDU5Ljc5NDM4ODg0MTcyNzEgWTEzMi43Mjc0MzUyNjc2NjE5MiBGMzAwXG5HMSBYNTguNjIyMDI3MTk0ODQ2OTEgWTEyOS42NDIyNDkyMTY3MjAzMyBGMzAwXG5HMSBYNTYuNzQ0MjE1MzI5NDQzNjggWTEyNi45MjgwOTYwNTI2MjgzMiBGMzAwXG5HMSBYNTQuMjcwNDc3MDY2Mjk1NDMgWTEyNC43NDMyNzk0MDAwMzc5MiBGMzAwXG5HMSBYNTEuMzQ1MDkzNzc0MTQ2NTIgWTEyMy4yMTUyMjkyMDY0ODUzNiBGMzAwXG5HMSBYNDguMTM4Njg5MTI0NzgxODM0IFkxMjIuNDMzMDY5MzYwNTg5MDIgRjMwMFxuRzEgWDQ2LjUyNjkxNzAwMDAwMDAwNSBZMTIyLjMzNzY5IEYzMDBcbkcxIFg0My4yNTA2NDI2MTc2MTE0MjYgWTEyMi43MzYyMjYwMzUxMzkxNCBGMzAwXG5HMSBYNDAuMTY1NDU3NTk2MTEwOTQgWTEyMy45MDg1OTAzOTEwOTIwOCBGMzAwXG5HMSBYMzcuNDUxMzA2MDgwOTA5MDkgWTEyNS43ODY0MDQ2Mzk3NjcyNiBGMzAwXG5HMSBYMzUuMjY2NDkxNjAwNDg2MTIgWTEyOC4yNjAxNDQ4MjEzODE3NCBGMzAwXG5HMSBYMzMuNzM4NDQzOTc1Njg2MDI1IFkxMzEuMTg1NTI5NDU1Mjk2MiBGMzAwXG5HMSBYMzIuOTU2Mjg2OTQ1MzA0MTEgWTEzNC4zOTE5MzQ3OTE0NjY5MiBGMzAwXG5HMSBYMzIuODYwOTA5IFkxMzYuMDAzNzEgRjMwMFxuRzEgWDMzLjI1OTQ0NDU1NTY2Mjg2IFkxMzkuMjc5OTg0NDQwNzEzNTIgRjMwMFxuRzEgWDM0LjQzMTgwODQ2MDEwNTA1IFkxNDIuMzY1MTY5NjMzNzg3MiBGMzAwXG5HMSBYMzYuMzA5NjIyMzExNTY5NTA1IFkxNDUuMDc5MzIxNDIzODAzNDQgRjMwMFxuRzEgWDM4Ljc4MzM2MjE3MzQ0MDY4IFkxNDcuMjY0MTM2MjY2MjUzMzMgRjMwMFxuRzEgWDQxLjcwODc0NjU4MzcyODM1NiBZMTQ4Ljc5MjE4NDMxOTE3NzcgRjMwMFxuRzEgWDQ0LjkxNTE1MTgwNTQzMTkwNCBZMTQ5LjU3NDM0MTgxODgxMDY3IEYzMDBcbkcxIFg0Ni41MjY5MTcgWTE0OS42Njk3MjAwMDAwMDAwNCBGMzAwXG5HMSBYNDkuODAzMTkxMjk0OTAwNTUgWTE0OS4yNzExODMyNDU2NDIzNiBGMzAwXG5HMSBYNTIuODg4Mzc2MDU5MDM5NjggWTE0OC4wOTg4MTgyMTI0MTk1IEYzMDBcbkcxIFg1NS42MDI1MjcxNjIwMTc0OSBZMTQ2LjIyMTAwMzM2NzkyNDkgRjMwMFxuRzEgWDU3Ljc4NzM0MTA5OTM5NjgzIFkxNDMuNzQ3MjYyNzA2NjkyODIgRjMwMFxuRzEgWDU5LjMxNTM4ODA4MjAwNjgzIFkxNDAuODIxODc3NzM3MzM2NDIgRjMwMFxuRzEgWDYwLjA5NzU0NDQwODUwODEgWTEzNy42MTU0NzIyMjk0NjQwNyBGMzAwXG5HMSBYNjAuMTkyOTIyIFkxMzYuMDAzNzEgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU1MFxuRzAgWDgzLjgwNDA5IFkxMzYuMDAzNzFcbkcxIFg4My40MDU1NTY4NDE3MjcxMiBZMTMyLjcyNzQzNTI2NzY2MTk1IEYzMDBcbkcxIFg4Mi4yMzMxOTUxOTQ4NDY5NiBZMTI5LjY0MjI0OTIxNjcyMDQgRjMwMFxuRzEgWDgwLjM1NTM4MzMyOTQ0Mzc1IFkxMjYuOTI4MDk2MDUyNjI4MzIgRjMwMFxuRzEgWDc3Ljg4MTY0NTA2NjI5NTUyIFkxMjQuNzQzMjc5NDAwMDM3ODkgRjMwMFxuRzEgWDc0Ljk1NjI2MTc3NDE0NjY0IFkxMjMuMjE1MjI5MjA2NDg1MzIgRjMwMFxuRzEgWDcxLjc0OTg1NzEyNDc4MTk4IFkxMjIuNDMzMDY5MzYwNTg4OTUgRjMwMFxuRzEgWDcwLjEzODA4MTk5OTk5OTk4IFkxMjIuMzM3NjkwMDAwMDAwMDIgRjMwMFxuRzEgWDY2Ljg2MTgwNzcwNTA5OTI4IFkxMjIuNzM2MjI2NzU0MzU2MDggRjMwMFxuRzEgWDYzLjc3NjYyMjk0MDk1OTU3IFkxMjMuOTA4NTkxNzg3NTc3NDYgRjMwMFxuRzEgWDYxLjA2MjQ3MTgzNzk4MDg0IFkxMjUuNzg2NDA2NjMyMDcwNzUgRjMwMFxuRzEgWDU4Ljg3NzY1NzkwMDYwMDMwNSBZMTI4LjI2MDE0NzI5MzMwMTggRjMwMFxuRzEgWDU3LjM0OTYxMDkxNzk4ODkgWTEzMS4xODU1MzIyNjI2NTc1IEYzMDBcbkcxIFg1Ni41Njc0NTQ1OTE0ODYxIFkxMzQuMzkxOTM3NzcwNTI5NDcgRjMwMFxuRzEgWDU2LjQ3MjA3NzAwMDAwMDAwNiBZMTM2LjAwMzcxIEYzMDBcbkcxIFg1Ni44NzA2MTI1NTU2NjI4OSBZMTM5LjI3OTk4NDQ0MDcxMzUyIEYzMDBcbkcxIFg1OC4wNDI5NzY0NjAxMDUxIFkxNDIuMzY1MTY5NjMzNzg3MiBGMzAwXG5HMSBYNTkuOTIwNzkwMzExNTY5NTYgWTE0NS4wNzkzMjE0MjM4MDMzOCBGMzAwXG5HMSBYNjIuMzk0NTMwMTczNDQwNzcgWTE0Ny4yNjQxMzYyNjYyNTMzIEYzMDBcbkcxIFg2NS4zMTk5MTQ1ODM3Mjg0MyBZMTQ4Ljc5MjE4NDMxOTE3NzYgRjMwMFxuRzEgWDY4LjUyNjMxOTgwNTQzMiBZMTQ5LjU3NDM0MTgxODgxMDU4IEYzMDBcbkcxIFg3MC4xMzgwODIwMDAwMDAwMSBZMTQ5LjY2OTcyIEYzMDBcbkcxIFg3My40MTQzNTYzODIzODgzNSBZMTQ5LjI3MTE4Mzk2NDg1OTMyIEYzMDBcbkcxIFg3Ni40OTk1NDE0MDM4ODgyNyBZMTQ4LjA5ODgxOTYwODkwNDkgRjMwMFxuRzEgWDc5LjIxMzY5MjkxOTA4OTIxIFkxNDYuMjIxMDA1MzYwMjI4NDUgRjMwMFxuRzEgWDgxLjM5ODUwNzM5OTUxMDk5IFkxNDMuNzQ3MjY1MTc4NjEyOSBGMzAwXG5HMSBYODIuOTI2NTU1MDI0MzA5NjggWTE0MC44MjE4ODA1NDQ2OTc3MyBGMzAwXG5HMSBYODMuNzA4NzEyMDU0NjkwMDggWTEzNy42MTU0NzUyMDg1MjY2MiBGMzAwXG5HMSBYODMuODA0MDkgWTEzNi4wMDM3MSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTUxXG5HMCBYMTA3LjQxNTI1IFkxMzYuMDAzNzFcbkcxIFgxMDcuMDE2NzE2ODQxNzI3NTEgWTEzMi43Mjc0MzUyNjc2NjE5IEYzMDBcbkcxIFgxMDUuODQ0MzU1MTk0ODQ3NzQgWTEyOS42NDIyNDkyMTY3MjAyMiBGMzAwXG5HMSBYMTAzLjk2NjU0MzMyOTQ0NDg2IFkxMjYuOTI4MDk2MDUyNjI3OTEgRjMwMFxuRzEgWDEwMS40OTI4MDUwNjYyOTY5MSBZMTI0Ljc0MzI3OTQwMDAzNzIxIEYzMDBcbkcxIFg5OC41Njc0MjE3NzQxNDgyIFkxMjMuMjE1MjI5MjA2NDg0MjcgRjMwMFxuRzEgWDk1LjM2MTAxNzEyNDc4MzYxIFkxMjIuNDMzMDY5MzYwNTg3NSBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkxMjIuMzM3NjkwMDAwMDAwMDIgRjMwMFxuRzEgWDkwLjQ3Mjk3NjYxNzYxMTQ0IFkxMjIuNzM2MjI2MDM1MTM5MTcgRjMwMFxuRzEgWDg3LjM4Nzc5MTU5NjExMDkzIFkxMjMuOTA4NTkwMzkxMDkyMSBGMzAwXG5HMSBYODQuNjczNjQwMDgwOTA5MSBZMTI1Ljc4NjQwNDYzOTc2NzI3IEYzMDBcbkcxIFg4Mi40ODg4MjU2MDA0ODYxNCBZMTI4LjI2MDE0NDgyMTM4MTc0IEYzMDBcbkcxIFg4MC45NjA3Nzc5NzU2ODYwNiBZMTMxLjE4NTUyOTQ1NTI5NjE4IEYzMDBcbkcxIFg4MC4xNzg2MjA5NDUzMDQxMiBZMTM0LjM5MTkzNDc5MTQ2NjkyIEYzMDBcbkcxIFg4MC4wODMyNDMgWTEzNi4wMDM3MSBGMzAwXG5HMSBYODAuNDgxNzc4NTU1NjYyODYgWTEzOS4yNzk5ODQ0NDA3MTM1MiBGMzAwXG5HMSBYODEuNjU0MTQyNDYwMTA1MDUgWTE0Mi4zNjUxNjk2MzM3ODcyIEYzMDBcbkcxIFg4My41MzE5NTYzMTE1Njk1IFkxNDUuMDc5MzIxNDIzODAzNDQgRjMwMFxuRzEgWDg2LjAwNTY5NjE3MzQ0MDY3IFkxNDcuMjY0MTM2MjY2MjUzMzMgRjMwMFxuRzEgWDg4LjkzMTA4MDU4MzcyODM2IFkxNDguNzkyMTg0MzE5MTc3NyBGMzAwXG5HMSBYOTIuMTM3NDg1ODA1NDMxOTEgWTE0OS41NzQzNDE4MTg4MTA2NyBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkxNDkuNjY5NzIwMDAwMDAwMDQgRjMwMFxuRzEgWDk3LjAyNTUyNTExOTkyNDQgWTE0OS4yNzExODE4MDcyMDg1NCBGMzAwXG5HMSBYMTAwLjExMDcwOTM2OTM0MTU0IFkxNDguMDk4ODE1NDE5NDQ4OTUgRjMwMFxuRzEgWDEwMi44MjQ4NTk2NDc4NzI3IFkxNDYuMjIwOTk5MzgzMzE4NCBGMzAwXG5HMSBYMTA1LjAwOTY3MjQ5OTE2Njg1IFkxNDMuNzQ3MjU3NzYyODUzNTYgRjMwMFxuRzEgWDEwNi41Mzc3MTgxOTczOTkyNiBZMTQwLjgyMTg3MjEyMjYxNTEgRjMwMFxuRzEgWDEwNy4zMTk4NzMxMTYxNDIxOCBZMTM3LjYxNTQ2NjI3MTM0MDc1IEYzMDBcbkcxIFgxMDcuNDE1MjUgWTEzNi4wMDM3MTAwMDAwMDAwNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTUyXG5HMCBYMTMxLjAyNjQxIFkxMzYuMDAzNzFcbkcxIFgxMzAuNjI3ODc2ODQxNzI3NCBZMTMyLjcyNzQzNTI2NzY2MTkgRjMwMFxuRzEgWDEyOS40NTU1MTUxOTQ4NDc1MiBZMTI5LjY0MjI0OTIxNjcyMDI0IEYzMDBcbkcxIFgxMjcuNTc3NzAzMzI5NDQ0NTYgWTEyNi45MjgwOTYwNTI2MjgwNCBGMzAwXG5HMSBYMTI1LjEwMzk2NTA2NjI5NjUxIFkxMjQuNzQzMjc5NDAwMDM3NCBGMzAwXG5HMSBYMTIyLjE3ODU4MTc3NDE0Nzc0IFkxMjMuMjE1MjI5MjA2NDg0NTUgRjMwMFxuRzEgWDExOC45NzIxNzcxMjQ3ODMxNCBZMTIyLjQzMzA2OTM2MDU4NzkgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTIyLjMzNzY5IEYzMDBcbkcxIFgxMTQuMDg0MTM1ODUwOTEyNjkgWTEyMi43MzYyMjc5NTMwNTA5NCBGMzAwXG5HMSBYMTEwLjk5ODk1MTUxNTcwNzk0IFkxMjMuOTA4NTk0MTE1MDUyOTUgRjMwMFxuRzEgWDEwOC4yODQ4MDEwOTk3NjgwMyBZMTI1Ljc4NjQwOTk1MjU3NjI0IEYzMDBcbkcxIFgxMDYuMDk5OTg4MDY3NDU4NDggWTEyOC4yNjAxNTE0MTMxNjc5MyBGMzAwXG5HMSBYMTA0LjU3MTk0MjE1NTE2MTcxIFkxMzEuMTg1NTM2OTQxNTkyMDMgRjMwMFxuRzEgWDEwMy43ODk3ODcwMDE3OTA4NiBZMTM0LjM5MTk0MjczNTYzMjM3IEYzMDBcbkcxIFgxMDMuNjk0NDEgWTEzNi4wMDM3MSBGMzAwXG5HMSBYMTA0LjA5Mjk0NTU1NTY2MjU4IFkxMzkuMjc5OTg0NDQwNzEzNTUgRjMwMFxuRzEgWDEwNS4yNjUzMDk0NjAxMDQ1IFkxNDIuMzY1MTY5NjMzNzg3MyBGMzAwXG5HMSBYMTA3LjE0MzEyMzMxMTU2ODcxIFkxNDUuMDc5MzIxNDIzODAzNyBGMzAwXG5HMSBYMTA5LjYxNjg2MzE3MzQzOTczIFkxNDcuMjY0MTM2MjY2MjUzODQgRjMwMFxuRzEgWDExMi41NDIyNDc1ODM3MjcyNyBZMTQ4Ljc5MjE4NDMxOTE3ODQzIEYzMDBcbkcxIFgxMTUuNzQ4NjUyODA1NDMwNzggWTE0OS41NzQzNDE4MTg4MTE3MiBGMzAwXG5HMSBYMTE3LjM2MDQxIFkxNDkuNjY5NzIgRjMwMFxuRzEgWDEyMC42MzY2ODQxNDkwODcxNiBZMTQ5LjI3MTE4MjA0Njk0NzUgRjMwMFxuRzEgWDEyMy43MjE4Njg0ODQyOTEzIFkxNDguMDk4ODE1ODg0OTQ0IEYzMDBcbkcxIFgxMjYuNDM2MDE4OTAwMjMwMzEgWTE0Ni4yMjEwMDAwNDc0MTk0IEYzMDBcbkcxIFgxMjguNjIwODMxOTMyNTM4NyBZMTQzLjc0NzI1ODU4NjgyNjY2IEYzMDBcbkcxIFgxMzAuMTQ4ODc3ODQ0ODM0MDMgWTE0MC44MjE4NzMwNTg0MDE4NSBGMzAwXG5HMSBYMTMwLjkzMTAzMjk5ODIwMzM0IFkxMzcuNjE1NDY3MjY0MzYxMTQgRjMwMFxuRzEgWDEzMS4wMjY0MSBZMTM2LjAwMzcxIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNTNcbkcwIFgxNTQuNjM3NiBZMTM2LjAwMzcxXG5HMSBYMTU0LjIzOTA2Njg0MTcyNzQgWTEzMi43Mjc0MzUyNjc2NjE4NiBGMzAwXG5HMSBYMTUzLjA2NjcwNTE5NDg0NzUxIFkxMjkuNjQyMjQ5MjE2NzIwMjIgRjMwMFxuRzEgWDE1MS4xODg4OTMzMjk0NDQ1NCBZMTI2LjkyODA5NjA1MjYyOCBGMzAwXG5HMSBYMTQ4LjcxNTE1NTA2NjI5NjUgWTEyNC43NDMyNzk0MDAwMzczOCBGMzAwXG5HMSBYMTQ1Ljc4OTc3MTc3NDE0Nzc0IFkxMjMuMjE1MjI5MjA2NDg0NTQgRjMwMFxuRzEgWDE0Mi41ODMzNjcxMjQ3ODMxNyBZMTIyLjQzMzA2OTM2MDU4NzkgRjMwMFxuRzEgWDE0MC45NzE2IFkxMjIuMzM3NjkgRjMwMFxuRzEgWDEzNy42OTUzMjU1NTkyODYzMiBZMTIyLjczNjIyNTU1NTY2MTE4IEYzMDBcbkcxIFgxMzQuNjEwMTQwMzY2MjEyMDUgWTEyMy45MDg1ODk0NjAxMDE3OCBGMzAwXG5HMSBYMTMxLjg5NTk4ODU3NjE5NDg3IFkxMjUuNzg2NDAzMzExNTY0ODEgRjMwMFxuRzEgWDEyOS43MTExNzM3MzM3NDM3IFkxMjguMjYwMTQzMTczNDM0ODcgRjMwMFxuRzEgWDEyOC4xODMxMjU2ODA4MTc4MiBZMTMxLjE4NTUyNzU4MzcyMTc1IEYzMDBcbkcxIFgxMjcuNDAwOTY4MTgxMTgzMTcgWTEzNC4zOTE5MzI4MDU0MjQ5IEYzMDBcbkcxIFgxMjcuMzA1NTkwMDAwMDAwMDEgWTEzNi4wMDM3MSBGMzAwXG5HMSBYMTI3LjcwNDEyNTU1NTY2Mjc4IFkxMzkuMjc5OTg0NDQwNzEzNTIgRjMwMFxuRzEgWDEyOC44NzY0ODk0NjAxMDQ4NiBZMTQyLjM2NTE2OTYzMzc4NzI1IEYzMDBcbkcxIFgxMzAuNzU0MzAzMzExNTY5MjMgWTE0NS4wNzkzMjE0MjM4MDM1IEYzMDBcbkcxIFgxMzMuMjI4MDQzMTczNDQwMzQgWTE0Ny4yNjQxMzYyNjYyNTM1MyBGMzAwXG5HMSBYMTM2LjE1MzQyNzU4MzcyNzk2IFkxNDguNzkyMTg0MzE5MTc3OTUgRjMwMFxuRzEgWDEzOS4zNTk4MzI4MDU0MzE1IFkxNDkuNTc0MzQxODE4ODExMDYgRjMwMFxuRzEgWDE0MC45NzE2MDAwMDAwMDAwMiBZMTQ5LjY2OTcyIEYzMDBcbkcxIFgxNDQuMjQ3ODc0MTQ5MDg3MTUgWTE0OS4yNzExODIwNDY5NDc1IEYzMDBcbkcxIFgxNDcuMzMzMDU4NDg0MjkxMyBZMTQ4LjA5ODgxNTg4NDk0NCBGMzAwXG5HMSBYMTUwLjA0NzIwODkwMDIzMDMyIFkxNDYuMjIxMDAwMDQ3NDE5NCBGMzAwXG5HMSBYMTUyLjIzMjAyMTkzMjUzODcgWTE0My43NDcyNTg1ODY4MjY2NiBGMzAwXG5HMSBYMTUzLjc2MDA2Nzg0NDgzNDAzIFkxNDAuODIxODczMDU4NDAxODUgRjMwMFxuRzEgWDE1NC41NDIyMjI5OTgyMDMzMyBZMTM3LjYxNTQ2NzI2NDM2MTE0IEYzMDBcbkcxIFgxNTQuNjM3NiBZMTM2LjAwMzcxIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNTRcbkcwIFgxNzguMjQ4ODEgWTEzNi4wMDM3MVxuRzEgWDE3Ny44NTAyNzY4NDE3Mjg4IFkxMzIuNzI3NDM1MjY3NjYxNyBGMzAwXG5HMSBYMTc2LjY3NzkxNTE5NDg1MDIxIFkxMjkuNjQyMjQ5MjE2NzE5NTMgRjMwMFxuRzEgWDE3NC44MDAxMDMzMjk0NDg0IFkxMjYuOTI4MDk2MDUyNjI2NSBGMzAwXG5HMSBYMTcyLjMyNjM2NTA2NjMwMTMgWTEyNC43NDMyNzk0MDAwMzQ4MSBGMzAwXG5HMSBYMTY5LjQwMDk4MTc3NDE1MzIgWTEyMy4yMTUyMjkyMDY0ODA3NCBGMzAwXG5HMSBYMTY2LjE5NDU3NzEyNDc4ODkgWTEyMi40MzMwNjkzNjA1ODI3MiBGMzAwXG5HMSBYMTY0LjU4Mjc5IFkxMjIuMzM3NjkgRjMwMFxuRzEgWDE2MS4zMDY1MTYxNDI1NDA3NyBZMTIyLjczNjIzMDM1MDQ0MDUxIEYzMDBcbkcxIFgxNTguMjIxMzMyNjY1MjA3MjMgWTEyMy45MDg1OTg3NzAwMDMzIEYzMDBcbkcxIFgxNTUuNTA3MTgzNjIzMzQ2MDcgWTEyNS43ODY0MTY1OTM1ODU4MSBGMzAwXG5HMSBYMTUzLjMyMjM3MjQwMTE3OTM0IFkxMjguMjYwMTU5NjUyODk3OCBGMzAwXG5HMSBYMTUxLjc5NDMyODYyOTUxMjQ1IFkxMzEuMTg1NTQ2Mjk5NDU3NTcgRjMwMFxuRzEgWDE1MS4wMTIxNzU4MjI0MDU4MiBZMTM0LjM5MTk1MjY2NTgzMzM3IEYzMDBcbkcxIFgxNTAuOTE2ODAwMDAwMDAwMDIgWTEzNi4wMDM3MSBGMzAwXG5HMSBYMTUxLjMxNTMzNTU1NTY2MDY4IFkxMzkuMjc5OTg0NDQwNzEzNzggRjMwMFxuRzEgWDE1Mi40ODc2OTk0NjAxMDA4IFkxNDIuMzY1MTY5NjMzNzg4MjQgRjMwMFxuRzEgWDE1NC4zNjU1MTMzMTE1NjM0IFkxNDUuMDc5MzIxNDIzODA1NzQgRjMwMFxuRzEgWDE1Ni44MzkyNTMxNzM0MzMxMiBZMTQ3LjI2NDEzNjI2NjI1NzM0IEYzMDBcbkcxIFgxNTkuNzY0NjM3NTgzNzE5NzggWTE0OC43OTIxODQzMTkxODM2NiBGMzAwXG5HMSBYMTYyLjk3MTA0MjgwNTQyMjggWTE0OS41NzQzNDE4MTg4MTg4IEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDUgWTE0OS42Njk3MiBGMzAwXG5HMSBYMTY3Ljg1OTA2NDczMjMzODEgWTE0OS4yNzExODY4NDE3MjcyNiBGMzAwXG5HMSBYMTcwLjk0NDI1MDc4MzI3OTcgWTE0OC4wOTg4MjUxOTQ4NDcyIEYzMDBcbkcxIFgxNzMuNjU4NDAzOTQ3MzcxOCBZMTQ2LjIyMTAxMzMyOTQ0NDA4IEYzMDBcbkcxIFgxNzUuODQzMjIwNTk5OTYyMyBZMTQzLjc0NzI3NTA2NjI5NTkgRjMwMFxuRzEgWDE3Ny4zNzEyNzA3OTM1MTQ5OCBZMTQwLjgyMTg5MTc3NDE0NzEgRjMwMFxuRzEgWDE3OC4xNTM0MzA2Mzk0MTE0NSBZMTM3LjYxNTQ4NzEyNDc4MjQ4IEYzMDBcbkcxIFgxNzguMjQ4ODEgWTEzNi4wMDM3MSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTU1XG5HMCBYMjAxLjg2IFkxMzYuMDAzNzFcbkcxIFgyMDEuNDYxNDY2ODQxNzI5MzYgWTEzMi43Mjc0MzUyNjc2NjE2MyBGMzAwXG5HMSBYMjAwLjI4OTEwNTE5NDg1MTMgWTEyOS42NDIyNDkyMTY3MTkzIEYzMDBcbkcxIFgxOTguNDExMjkzMzI5NDQ5OSBZMTI2LjkyODA5NjA1MjYyNTk5IEYzMDBcbkcxIFgxOTUuOTM3NTU1MDY2MzAzMTYgWTEyNC43NDMyNzk0MDAwMzM5IEYzMDBcbkcxIFgxOTMuMDEyMTcxNzc0MTU1MzIgWTEyMy4yMTUyMjkyMDY0NzkzNSBGMzAwXG5HMSBYMTg5LjgwNTc2NzEyNDc5MTE3IFkxMjIuNDMzMDY5MzYwNTgwOCBGMzAwXG5HMSBYMTg4LjE5NDAxIFkxMjIuMzM3NjkwMDAwMDAwMDEgRjMwMFxuRzEgWDE4NC45MTc3MzU1NTkyODYyOSBZMTIyLjczNjIyNTU1NTY2MTE4IEYzMDBcbkcxIFgxODEuODMyNTUwMzY2MjEyMDIgWTEyMy45MDg1ODk0NjAxMDE3OCBGMzAwXG5HMSBYMTc5LjExODM5ODU3NjE5NDgzIFkxMjUuNzg2NDAzMzExNTY0ODEgRjMwMFxuRzEgWDE3Ni45MzM1ODM3MzM3NDM2NiBZMTI4LjI2MDE0MzE3MzQzNDg3IEYzMDBcbkcxIFgxNzUuNDA1NTM1NjgwODE3OCBZMTMxLjE4NTUyNzU4MzcyMTc1IEYzMDBcbkcxIFgxNzQuNjIzMzc4MTgxMTgzMTQgWTEzNC4zOTE5MzI4MDU0MjQ5IEYzMDBcbkcxIFgxNzQuNTI4IFkxMzYuMDAzNzEgRjMwMFxuRzEgWDE3NC45MjY1MzU1NTU2NjI3NSBZMTM5LjI3OTk4NDQ0MDcxMzUyIEYzMDBcbkcxIFgxNzYuMDk4ODk5NDYwMTA0ODMgWTE0Mi4zNjUxNjk2MzM3ODcyNSBGMzAwXG5HMSBYMTc3Ljk3NjcxMzMxMTU2OTIgWTE0NS4wNzkzMjE0MjM4MDM1IEYzMDBcbkcxIFgxODAuNDUwNDUzMTczNDQwMyBZMTQ3LjI2NDEzNjI2NjI1MzUzIEYzMDBcbkcxIFgxODMuMzc1ODM3NTgzNzI3OTMgWTE0OC43OTIxODQzMTkxNzc5NSBGMzAwXG5HMSBYMTg2LjU4MjI0MjgwNTQzMTQ2IFkxNDkuNTc0MzQxODE4ODExMDYgRjMwMFxuRzEgWDE4OC4xOTQwMSBZMTQ5LjY2OTcyIEYzMDBcbkcxIFgxOTEuNDcwMjgzODU3NDU5MDQgWTE0OS4yNzExNzk2NDk1NTc5NSBGMzAwXG5HMSBYMTk0LjU1NTQ2NzMzNDc5MTk4IFkxNDguMDk4ODExMjI5OTkzNyBGMzAwXG5HMSBYMTk3LjI2OTYxNjM3NjY1MjI3IFkxNDYuMjIwOTkzNDA2NDA5OSBGMzAwXG5HMSBYMTk5LjQ1NDQyNzU5ODgxNzggWTE0My43NDcyNTAzNDcwOTY4NCBGMzAwXG5HMSBYMjAwLjk4MjQ3MTM3MDQ4MzMgWTE0MC44MjE4NjM3MDA1MzYzNyBGMzAwXG5HMSBYMjAxLjc2NDYyNDE3NzU4ODQgWTEzNy42MTU0NTczMzQxNjAyMyBGMzAwXG5HMSBYMjAxLjg2IFkxMzYuMDAzNzEgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU1NlxuRzAgWDM2LjU4MTc0NCBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYMzYuMTgzMjA4NDQ0MzM3MTEgWTEwOS4xMTYyMzU1NTkyODY1IEYzMDBcbkcxIFgzNS4wMTA4NDQ1Mzk4OTQ4OSBZMTA2LjAzMTA1MDM2NjIxMjgyIEYzMDBcbkcxIFgzMy4xMzMwMzA2ODg0MzA0MTYgWTEwMy4zMTY4OTg1NzYxOTY2MiBGMzAwXG5HMSBYMzAuNjU5MjkwODI2NTU5MjA3IFkxMDEuMTMyMDgzNzMzNzQ2NyBGMzAwXG5HMSBYMjcuNzMzOTA2NDE2MjcxNTM0IFk5OS42MDQwMzU2ODA4MjI0IEYzMDBcbkcxIFgyNC41Mjc1MDExOTQ1Njc5NiBZOTguODIxODc4MTgxMTg5NDMgRjMwMFxuRzEgWDIyLjkxNTczOSBZOTguNzI2NDk5OTk5OTk5OTkgRjMwMFxuRzEgWDE5LjYzOTQ2NDYzNTEwOTE3NCBZOTkuMTI1MDM2MTc4OTg0MSBGMzAwXG5HMSBYMTYuNTU0Mjc5NjY1MDgxMzc4IFkxMDAuMjk3NDAwNjcwMzkyMjIgRjMwMFxuRzEgWDEzLjg0MDEyODIzMjMyNTA0OCBZMTAyLjE3NTIxNTAzODIzMjM1IEYzMDBcbkcxIFgxMS42NTUzMTM4NjA1MTE3NTQgWTEwNC42NDg5NTUzMTU3NzEyMiBGMzAwXG5HMSBYMTAuMTI3MjY2MzY0MTUwODExIFkxMDcuNTc0MzQwMDE2Nzc0NjcgRjMwMFxuRzEgWDkuMzQ1MTA5NDc0NTQ2MjYzIFkxMTAuNzgwNzQ1Mzg3Mjg2MDUgRjMwMFxuRzEgWDkuMjQ5NzMxNjAwMDAwMDA0IFkxMTIuMzkyNTA5OTk5OTk5OTcgRjMwMFxuRzEgWDkuNjQ4MjY3MTU1NjYyODgyIFkxMTUuNjY4Nzg0NDQwNzEzNDggRjMwMFxuRzEgWDEwLjgyMDYzMTA2MDEwNTA5MyBZMTE4Ljc1Mzk2OTYzMzc4NzE1IEYzMDBcbkcxIFgxMi42OTg0NDQ5MTE1Njk1NTggWTEyMS40NjgxMjE0MjM4MDMzNyBGMzAwXG5HMSBYMTUuMTcyMTg0NzczNDQwNzYyIFkxMjMuNjUyOTM2MjY2MjUzMjkgRjMwMFxuRzEgWDE4LjA5NzU2OTE4MzcyODQ1NiBZMTI1LjE4MDk4NDMxOTE3NzYxIEYzMDBcbkcxIFgyMS4zMDM5NzQ0MDU0MzE5OTcgWTEyNS45NjMxNDE4MTg4MTA1OCBGMzAwXG5HMSBYMjIuOTE1NzM4OTk5OTk5OTg4IFkxMjYuMDU4NTE5OTk5OTk5OTkgRjMwMFxuRzEgWDI2LjE5MjAxMzI5NDkwMDUyNiBZMTI1LjY1OTk4MzI0NTY0MjMyIEYzMDBcbkcxIFgyOS4yNzcxOTgwNTkwMzk2ODQgWTEyNC40ODc2MTgyMTI0MTk0NSBGMzAwXG5HMSBYMzEuOTkxMzQ5MTYyMDE3NTEgWTEyMi42MDk4MDMzNjc5MjQ4NSBGMzAwXG5HMSBYMzQuMTc2MTYzMDk5Mzk2ODUgWTEyMC4xMzYwNjI3MDY2OTI3NSBGMzAwXG5HMSBYMzUuNzA0MjEwMDgyMDA2ODQgWTExNy4yMTA2Nzc3MzczMzYzNCBGMzAwXG5HMSBYMzYuNDg2MzY2NDA4NTA4MSBZMTE0LjAwNDI3MjIyOTQ2NDAxIEYzMDBcbkcxIFgzNi41ODE3NDQgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTU3XG5HMCBYNjAuMTkyOTIyIFkxMTIuMzkyNTA5OTk5OTk5OTlcbkcxIFg1OS43OTQzODY0NDQzMzcxMTQgWTEwOS4xMTYyMzU1NTkyODY1IEYzMDBcbkcxIFg1OC42MjIwMjI1Mzk4OTQ4OSBZMTA2LjAzMTA1MDM2NjIxMjgyIEYzMDBcbkcxIFg1Ni43NDQyMDg2ODg0MzA0MiBZMTAzLjMxNjg5ODU3NjE5NjYyIEYzMDBcbkcxIFg1NC4yNzA0Njg4MjY1NTkyMSBZMTAxLjEzMjA4MzczMzc0NjcgRjMwMFxuRzEgWDUxLjM0NTA4NDQxNjI3MTUzIFk5OS42MDQwMzU2ODA4MjI0IEYzMDBcbkcxIFg0OC4xMzg2NzkxOTQ1Njc5NiBZOTguODIxODc4MTgxMTg5NDMgRjMwMFxuRzEgWDQ2LjUyNjkxNjk5OTk5OTk5IFk5OC43MjY0OTk5OTk5OTk5OSBGMzAwXG5HMSBYNDMuMjUwNjQyNjE3NjExNjIgWTk5LjEyNTAzNjAzNTE0MDcxIEYzMDBcbkcxIFg0MC4xNjU0NTc1OTYxMTE3IFkxMDAuMjk3NDAwMzkxMDk1MTIgRjMwMFxuRzEgWDM3LjQ1MTMwNjA4MDkxMDc3IFkxMDIuMTc1MjE0NjM5NzcxNiBGMzAwXG5HMSBYMzUuMjY2NDkxNjAwNDg5IFkxMDQuNjQ4OTU0ODIxMzg3MTIgRjMwMFxuRzEgWDMzLjczODQ0Mzk3NTY5MDMxNiBZMTA3LjU3NDMzOTQ1NTMwMjMgRjMwMFxuRzEgWDMyLjk1NjI4Njk0NTMwOTkzIFkxMTAuNzgwNzQ0NzkxNDczNDEgRjMwMFxuRzEgWDMyLjg2MDkwOSBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDBcbkcxIFgzMy4yNTk0NDQ1NTU2NjI4NiBZMTE1LjY2ODc4NDQ0MDcxMzQ4IEYzMDBcbkcxIFgzNC40MzE4MDg0NjAxMDUwNSBZMTE4Ljc1Mzk2OTYzMzc4NzE2IEYzMDBcbkcxIFgzNi4zMDk2MjIzMTE1Njk0ODQgWTEyMS40NjgxMjE0MjM4MDMzNyBGMzAwXG5HMSBYMzguNzgzMzYyMTczNDQwNjggWTEyMy42NTI5MzYyNjYyNTMzIEYzMDBcbkcxIFg0MS43MDg3NDY1ODM3MjgzNTYgWTEyNS4xODA5ODQzMTkxNzc2NCBGMzAwXG5HMSBYNDQuOTE1MTUxODA1NDMxOTMgWTEyNS45NjMxNDE4MTg4MTA2NCBGMzAwXG5HMSBYNDYuNTI2OTE3IFkxMjYuMDU4NTE5OTk5OTk5OTkgRjMwMFxuRzEgWDQ5LjgwMzE5MTI5NDkwMDUyIFkxMjUuNjU5OTgzMjQ1NjQyMzIgRjMwMFxuRzEgWDUyLjg4ODM3NjA1OTAzOTY4IFkxMjQuNDg3NjE4MjEyNDE5NDUgRjMwMFxuRzEgWDU1LjYwMjUyNzE2MjAxNzUxIFkxMjIuNjA5ODAzMzY3OTI0ODUgRjMwMFxuRzEgWDU3Ljc4NzM0MTA5OTM5Njg1IFkxMjAuMTM2MDYyNzA2NjkyNzUgRjMwMFxuRzEgWDU5LjMxNTM4ODA4MjAwNjg1IFkxMTcuMjEwNjc3NzM3MzM2MzMgRjMwMFxuRzEgWDYwLjA5NzU0NDQwODUwODExIFkxMTQuMDA0MjcyMjI5NDYzOTggRjMwMFxuRzEgWDYwLjE5MjkyMiBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNThcbkcwIFg4My44MDQwOSBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYODMuNDA1NTU0NDQ0MzM3MTQgWTEwOS4xMTYyMzU1NTkyODY1IEYzMDBcbkcxIFg4Mi4yMzMxOTA1Mzk4OTQ5NSBZMTA2LjAzMTA1MDM2NjIxMjgxIEYzMDBcbkcxIFg4MC4zNTUzNzY2ODg0MzA1MSBZMTAzLjMxNjg5ODU3NjE5NjYgRjMwMFxuRzEgWDc3Ljg4MTYzNjgyNjU1OTMyIFkxMDEuMTMyMDgzNzMzNzQ2NjcgRjMwMFxuRzEgWDc0Ljk1NjI1MjQxNjI3MTY0IFk5OS42MDQwMzU2ODA4MjIzNCBGMzAwXG5HMSBYNzEuNzQ5ODQ3MTk0NTY4MDggWTk4LjgyMTg3ODE4MTE4OTMzIEYzMDBcbkcxIFg3MC4xMzgwODIgWTk4LjcyNjQ5OTk5OTk5OTk5IEYzMDBcbkcxIFg2Ni44NjE4MDc3MDUwOTk0NyBZOTkuMTI1MDM2NzU0MzU3NjUgRjMwMFxuRzEgWDYzLjc3NjYyMjk0MDk2MDM0IFkxMDAuMjk3NDAxNzg3NTgwNTEgRjMwMFxuRzEgWDYxLjA2MjQ3MTgzNzk4MjUxIFkxMDIuMTc1MjE2NjMyMDc1MSBGMzAwXG5HMSBYNTguODc3NjU3OTAwNjAzMTcgWTEwNC42NDg5NTcyOTMzMDcyIEYzMDBcbkcxIFg1Ny4zNDk2MTA5MTc5OTMxNiBZMTA3LjU3NDM0MjI2MjY2MzYyIEYzMDBcbkcxIFg1Ni41Njc0NTQ1OTE0OTE5IFkxMTAuNzgwNzQ3NzcwNTM1OTQgRjMwMFxuRzEgWDU2LjQ3MjA3NyBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDBcbkcxIFg1Ni44NzA2MTI1NTU2NjI4OSBZMTE1LjY2ODc4NDQ0MDcxMzQ3IEYzMDBcbkcxIFg1OC4wNDI5NzY0NjAxMDUxIFkxMTguNzUzOTY5NjMzNzg3MTUgRjMwMFxuRzEgWDU5LjkyMDc5MDMxMTU2OTU2IFkxMjEuNDY4MTIxNDIzODAzMzQgRjMwMFxuRzEgWDYyLjM5NDUzMDE3MzQ0MDc3IFkxMjMuNjUyOTM2MjY2MjUzMjUgRjMwMFxuRzEgWDY1LjMxOTkxNDU4MzcyODQ2IFkxMjUuMTgwOTg0MzE5MTc3NTcgRjMwMFxuRzEgWDY4LjUyNjMxOTgwNTQzMjA0IFkxMjUuOTYzMTQxODE4ODEwNTQgRjMwMFxuRzEgWDcwLjEzODA4MjAwMDAwMDAxIFkxMjYuMDU4NTE5OTk5OTk5OTkgRjMwMFxuRzEgWDczLjQxNDM1NjM4MjM4ODM4IFkxMjUuNjU5OTgzOTY0ODU5MjYgRjMwMFxuRzEgWDc2LjQ5OTU0MTQwMzg4ODMgWTEyNC40ODc2MTk2MDg5MDQ4NSBGMzAwXG5HMSBYNzkuMjEzNjkyOTE5MDg5MjMgWTEyMi42MDk4MDUzNjAyMjgzOCBGMzAwXG5HMSBYODEuMzk4NTA3Mzk5NTExMDIgWTEyMC4xMzYwNjUxNzg2MTI4MiBGMzAwXG5HMSBYODIuOTI2NTU1MDI0MzA5NjkgWTExNy4yMTA2ODA1NDQ2OTc2NCBGMzAwXG5HMSBYODMuNzA4NzEyMDU0NjkwMDggWTExNC4wMDQyNzUyMDg1MjY1MiBGMzAwXG5HMSBYODMuODA0MDkgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTU5XG5HMCBYMTA3LjQxNTI1IFkxMTIuMzkyNTA5OTk5OTk5OTlcbkcxIFgxMDcuMDE2NzE0NDQ0MzM3NTQgWTEwOS4xMTYyMzU1NTkyODY0NCBGMzAwXG5HMSBYMTA1Ljg0NDM1MDUzOTg5NTcxIFkxMDYuMDMxMDUwMzY2MjEyNjQgRjMwMFxuRzEgWDEwMy45NjY1MzY2ODg0MzE2IFkxMDMuMzE2ODk4NTc2MTk2MTggRjMwMFxuRzEgWDEwMS40OTI3OTY4MjY1NjA2OSBZMTAxLjEzMjA4MzczMzc0NTk2IEYzMDBcbkcxIFg5OC41Njc0MTI0MTYyNzMyMyBZOTkuNjA0MDM1NjgwODIxMjggRjMwMFxuRzEgWDk1LjM2MTAwNzE5NDU2OTc1IFk5OC44MjE4NzgxODExODc4OCBGMzAwXG5HMSBYOTMuNzQ5MjUxIFk5OC43MjY0OTk5OTk5OTk5OSBGMzAwXG5HMSBYOTAuNDcyOTc2NjE3NjExNjIgWTk5LjEyNTAzNjAzNTE0MDcxIEYzMDBcbkcxIFg4Ny4zODc3OTE1OTYxMTE3IFkxMDAuMjk3NDAwMzkxMDk1MTIgRjMwMFxuRzEgWDg0LjY3MzY0MDA4MDkxMDc3IFkxMDIuMTc1MjE0NjM5NzcxNiBGMzAwXG5HMSBYODIuNDg4ODI1NjAwNDg4OTggWTEwNC42NDg5NTQ4MjEzODcxNCBGMzAwXG5HMSBYODAuOTYwNzc3OTc1NjkwMyBZMTA3LjU3NDMzOTQ1NTMwMjMxIEYzMDBcbkcxIFg4MC4xNzg2MjA5NDUzMDk5MiBZMTEwLjc4MDc0NDc5MTQ3MzQgRjMwMFxuRzEgWDgwLjA4MzI0MyBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDBcbkcxIFg4MC40ODE3Nzg1NTU2NjI4NiBZMTE1LjY2ODc4NDQ0MDcxMzQ4IEYzMDBcbkcxIFg4MS42NTQxNDI0NjAxMDUwNSBZMTE4Ljc1Mzk2OTYzMzc4NzE2IEYzMDBcbkcxIFg4My41MzE5NTYzMTE1Njk0OSBZMTIxLjQ2ODEyMTQyMzgwMzM3IEYzMDBcbkcxIFg4Ni4wMDU2OTYxNzM0NDA2NyBZMTIzLjY1MjkzNjI2NjI1MzMgRjMwMFxuRzEgWDg4LjkzMTA4MDU4MzcyODMzIFkxMjUuMTgwOTg0MzE5MTc3NjQgRjMwMFxuRzEgWDkyLjEzNzQ4NTgwNTQzMTg4IFkxMjUuOTYzMTQxODE4ODEwNjQgRjMwMFxuRzEgWDkzLjc0OTI1MTAwMDAwMDAyIFkxMjYuMDU4NTE5OTk5OTk5OTkgRjMwMFxuRzEgWDk3LjAyNTUyNTExOTkyNDQyIFkxMjUuNjU5OTgxODA3MjA4NSBGMzAwXG5HMSBYMTAwLjExMDcwOTM2OTM0MTU1IFkxMjQuNDg3NjE1NDE5NDQ4OSBGMzAwXG5HMSBYMTAyLjgyNDg1OTY0Nzg3Mjc0IFkxMjIuNjA5Nzk5MzgzMzE4MzMgRjMwMFxuRzEgWDEwNS4wMDk2NzI0OTkxNjY4OCBZMTIwLjEzNjA1Nzc2Mjg1MzQ4IEYzMDBcbkcxIFgxMDYuNTM3NzE4MTk3Mzk5MjkgWTExNy4yMTA2NzIxMjI2MTUwMSBGMzAwXG5HMSBYMTA3LjMxOTg3MzExNjE0MjE4IFkxMTQuMDA0MjY2MjcxMzQwNyBGMzAwXG5HMSBYMTA3LjQxNTI1IFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU2MFxuRzAgWDEzMS4wMjY0MSBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYMTMwLjYyNzg3NDQ0NDMzNzQgWTEwOS4xMTYyMzU1NTkyODY0NyBGMzAwXG5HMSBYMTI5LjQ1NTUxMDUzOTg5NTUgWTEwNi4wMzEwNTAzNjYyMTI2OCBGMzAwXG5HMSBYMTI3LjU3NzY5NjY4ODQzMTI5IFkxMDMuMzE2ODk4NTc2MTk2MzEgRjMwMFxuRzEgWDEyNS4xMDM5NTY4MjY1NjAzIFkxMDEuMTMyMDgzNzMzNzQ2MTkgRjMwMFxuRzEgWDEyMi4xNzg1NzI0MTYyNzI3NiBZOTkuNjA0MDM1NjgwODIxNiBGMzAwXG5HMSBYMTE4Ljk3MjE2NzE5NDU2OTI1IFk5OC44MjE4NzgxODExODgzMSBGMzAwXG5HMSBYMTE3LjM2MDQxMDAwMDAwMDAyIFk5OC43MjY0OTk5OTk5OTk5OSBGMzAwXG5HMSBYMTE0LjA4NDEzNTg1MDkxMjg3IFk5OS4xMjUwMzc5NTMwNTI1MSBGMzAwXG5HMSBYMTEwLjk5ODk1MTUxNTcwODcgWTEwMC4yOTc0MDQxMTUwNTYgRjMwMFxuRzEgWDEwOC4yODQ4MDEwOTk3Njk3MSBZMTAyLjE3NTIxOTk1MjU4MDU4IEYzMDBcbkcxIFgxMDYuMDk5OTg4MDY3NDYxMzUgWTEwNC42NDg5NjE0MTMxNzMzMSBGMzAwXG5HMSBYMTA0LjU3MTk0MjE1NTE2NTk4IFkxMDcuNTc0MzQ2OTQxNTk4MTQgRjMwMFxuRzEgWDEwMy43ODk3ODcwMDE3OTY2NyBZMTEwLjc4MDc1MjczNTYzODg2IEYzMDBcbkcxIFgxMDMuNjk0NDEgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwXG5HMSBYMTA0LjA5Mjk0NTU1NTY2MjU4IFkxMTUuNjY4Nzg0NDQwNzEzNTEgRjMwMFxuRzEgWDEwNS4yNjUzMDk0NjAxMDQ1IFkxMTguNzUzOTY5NjMzNzg3MjYgRjMwMFxuRzEgWDEwNy4xNDMxMjMzMTE1Njg3MSBZMTIxLjQ2ODEyMTQyMzgwMzY3IEYzMDBcbkcxIFgxMDkuNjE2ODYzMTczNDM5NyBZMTIzLjY1MjkzNjI2NjI1Mzc5IEYzMDBcbkcxIFgxMTIuNTQyMjQ3NTgzNzI3MjUgWTEyNS4xODA5ODQzMTkxNzgzOCBGMzAwXG5HMSBYMTE1Ljc0ODY1MjgwNTQzMDc0IFkxMjUuOTYzMTQxODE4ODExNjYgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTI2LjA1ODUxOTk5OTk5OTk5IEYzMDBcbkcxIFgxMjAuNjM2Njg0MTQ5MDg3MTMgWTEyNS42NTk5ODIwNDY5NDc0NiBGMzAwXG5HMSBYMTIzLjcyMTg2ODQ4NDI5MTMgWTEyNC40ODc2MTU4ODQ5NDM5NiBGMzAwXG5HMSBYMTI2LjQzNjAxODkwMDIzMDMxIFkxMjIuNjA5ODAwMDQ3NDE5MzggRjMwMFxuRzEgWDEyOC42MjA4MzE5MzI1Mzg3IFkxMjAuMTM2MDU4NTg2ODI2NjIgRjMwMFxuRzEgWDEzMC4xNDg4Nzc4NDQ4MzQwMyBZMTE3LjIxMDY3MzA1ODQwMTgxIEYzMDBcbkcxIFgxMzAuOTMxMDMyOTk4MjAzMzQgWTExNC4wMDQyNjcyNjQzNjEwOSBGMzAwXG5HMSBYMTMxLjAyNjQxIFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU2MVxuRzAgWDE1NC42Mzc2IFkxMTIuMzkyNTA5OTk5OTk5OTlcbkcxIFgxNTQuMjM5MDY0NDQ0MzM3NCBZMTA5LjExNjIzNTU1OTI4NjQ3IEYzMDBcbkcxIFgxNTMuMDY2NzAwNTM5ODk1NDYgWTEwNi4wMzEwNTAzNjYyMTI2OCBGMzAwXG5HMSBYMTUxLjE4ODg4NjY4ODQzMTI3IFkxMDMuMzE2ODk4NTc2MTk2MyBGMzAwXG5HMSBYMTQ4LjcxNTE0NjgyNjU2MDI3IFkxMDEuMTMyMDgzNzMzNzQ2MTYgRjMwMFxuRzEgWDE0NS43ODk3NjI0MTYyNzI3NCBZOTkuNjA0MDM1NjgwODIxNiBGMzAwXG5HMSBYMTQyLjU4MzM1NzE5NDU2OTI2IFk5OC44MjE4NzgxODExODgzMSBGMzAwXG5HMSBYMTQwLjk3MTYgWTk4LjcyNjQ5OTk5OTk5OTk5IEYzMDBcbkcxIFgxMzcuNjk1MzI1NTU5Mjg2NTIgWTk5LjEyNTAzNTU1NTY2Mjc1IEYzMDBcbkcxIFgxMzQuNjEwMTQwMzY2MjEyOCBZMTAwLjI5NzM5OTQ2MDEwNDg0IEYzMDBcbkcxIFgxMzEuODk1OTg4NTc2MTk2NTIgWTEwMi4xNzUyMTMzMTE1NjkyIEYzMDBcbkcxIFgxMjkuNzExMTczNzMzNzQ2NSBZMTA0LjY0ODk1MzE3MzQ0MDMzIEYzMDBcbkcxIFgxMjguMTgzMTI1NjgwODIyMSBZMTA3LjU3NDMzNzU4MzcyNzk1IEYzMDBcbkcxIFgxMjcuNDAwOTY4MTgxMTg4OTkgWTExMC43ODA3NDI4MDU0MzE1IEYzMDBcbkcxIFgxMjcuMzA1NTkwMDAwMDAwMDIgWTExMi4zOTI1MDk5OTk5OTk5NyBGMzAwXG5HMSBYMTI3LjcwNDEyNTU1NTY2Mjc4IFkxMTUuNjY4Nzg0NDQwNzEzNSBGMzAwXG5HMSBYMTI4Ljg3NjQ4OTQ2MDEwNDg2IFkxMTguNzUzOTY5NjMzNzg3MjIgRjMwMFxuRzEgWDEzMC43NTQzMDMzMTE1NjkyMyBZMTIxLjQ2ODEyMTQyMzgwMzQ4IEYzMDBcbkcxIFgxMzMuMjI4MDQzMTczNDQwMzQgWTEyMy42NTI5MzYyNjYyNTM1IEYzMDBcbkcxIFgxMzYuMTUzNDI3NTgzNzI3OTYgWTEyNS4xODA5ODQzMTkxNzc5MiBGMzAwXG5HMSBYMTM5LjM1OTgzMjgwNTQzMTUgWTEyNS45NjMxNDE4MTg4MTEwMiBGMzAwXG5HMSBYMTQwLjk3MTYwMDAwMDAwMDAyIFkxMjYuMDU4NTE5OTk5OTk5OTkgRjMwMFxuRzEgWDE0NC4yNDc4NzQxNDkwODcxMiBZMTI1LjY1OTk4MjA0Njk0NzQ2IEYzMDBcbkcxIFgxNDcuMzMzMDU4NDg0MjkxMyBZMTI0LjQ4NzYxNTg4NDk0Mzk2IEYzMDBcbkcxIFgxNTAuMDQ3MjA4OTAwMjMwMzIgWTEyMi42MDk4MDAwNDc0MTkzOCBGMzAwXG5HMSBYMTUyLjIzMjAyMTkzMjUzODY2IFkxMjAuMTM2MDU4NTg2ODI2NjUgRjMwMFxuRzEgWDE1My43NjAwNjc4NDQ4MzQwMyBZMTE3LjIxMDY3MzA1ODQwMTgxIEYzMDBcbkcxIFgxNTQuNTQyMjIyOTk4MjAzMzMgWTExNC4wMDQyNjcyNjQzNjEwOSBGMzAwXG5HMSBYMTU0LjYzNzYgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTYyXG5HMCBYMTc4LjI0ODgxIFkxMTIuMzkyNTA5OTk5OTk5OTlcbkcxIFgxNzcuODUwMjc0NDQ0MzM4ODIgWTEwOS4xMTYyMzU1NTkyODYzIEYzMDBcbkcxIFgxNzYuNjc3OTEwNTM5ODk4MjIgWTEwNi4wMzEwNTAzNjYyMTIwMyBGMzAwXG5HMSBYMTc0LjgwMDA5NjY4ODQzNTIgWTEwMy4zMTY4OTg1NzYxOTQ4NiBGMzAwXG5HMSBYMTcyLjMyNjM1NjgyNjU2NTEgWTEwMS4xMzIwODM3MzM3NDM2NCBGMzAwXG5HMSBYMTY5LjQwMDk3MjQxNjI3ODIyIFk5OS42MDQwMzU2ODA4MTc4IEYzMDBcbkcxIFgxNjYuMTk0NTY3MTk0NTc1MDYgWTk4LjgyMTg3ODE4MTE4MzE0IEYzMDBcbkcxIFgxNjQuNTgyNzkgWTk4LjcyNjQ5OTk5OTk5OTk5IEYzMDBcbkcxIFgxNjEuMzA2NTE2MTQyNTQwOTcgWTk5LjEyNTA0MDM1MDQ0MjA2IEYzMDBcbkcxIFgxNTguMjIxMzMyNjY1MjA4MDIgWTEwMC4yOTc0MDg3NzAwMDYzMyBGMzAwXG5HMSBYMTU1LjUwNzE4MzYyMzM0Nzc0IFkxMDIuMTc1MjI2NTkzNTkwMTQgRjMwMFxuRzEgWDE1My4zMjIzNzI0MDExODIyIFkxMDQuNjQ4OTY5NjUyOTAzMTggRjMwMFxuRzEgWDE1MS43OTQzMjg2Mjk1MTY3NCBZMTA3LjU3NDM1NjI5OTQ2MzYzIEYzMDBcbkcxIFgxNTEuMDEyMTc1ODIyNDExNjUgWTExMC43ODA3NjI2NjU4Mzk3NyBGMzAwXG5HMSBYMTUwLjkxNjgwMDAwMDAwMDAyIFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMFxuRzEgWDE1MS4zMTUzMzU1NTU2NjA2OCBZMTE1LjY2ODc4NDQ0MDcxMzc1IEYzMDBcbkcxIFgxNTIuNDg3Njk5NDYwMTAwOCBZMTE4Ljc1Mzk2OTYzMzc4ODIzIEYzMDBcbkcxIFgxNTQuMzY1NTEzMzExNTYzNCBZMTIxLjQ2ODEyMTQyMzgwNTcxIEYzMDBcbkcxIFgxNTYuODM5MjUzMTczNDMzMTIgWTEyMy42NTI5MzYyNjYyNTczMSBGMzAwXG5HMSBYMTU5Ljc2NDYzNzU4MzcxOTc4IFkxMjUuMTgwOTg0MzE5MTgzNjIgRjMwMFxuRzEgWDE2Mi45NzEwNDI4MDU0MjI4MyBZMTI1Ljk2MzE0MTgxODgxODc4IEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDUgWTEyNi4wNTg1MTk5OTk5OTk5OSBGMzAwXG5HMSBYMTY3Ljg1OTA2NDczMjMzODA4IFkxMjUuNjU5OTg2ODQxNzI3MjIgRjMwMFxuRzEgWDE3MC45NDQyNTA3ODMyNzk2NyBZMTI0LjQ4NzYyNTE5NDg0NzE3IEYzMDBcbkcxIFgxNzMuNjU4NDAzOTQ3MzcxNzcgWTEyMi42MDk4MTMzMjk0NDQwNyBGMzAwXG5HMSBYMTc1Ljg0MzIyMDU5OTk2MjI4IFkxMjAuMTM2MDc1MDY2Mjk1OSBGMzAwXG5HMSBYMTc3LjM3MTI3MDc5MzUxNDk4IFkxMTcuMjEwNjkxNzc0MTQ3MDUgRjMwMFxuRzEgWDE3OC4xNTM0MzA2Mzk0MTE0NSBZMTE0LjAwNDI4NzEyNDc4MjQ0IEYzMDBcbkcxIFgxNzguMjQ4ODEgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTYzXG5HMCBYMjAxLjg2IFkxMTIuMzkyNTA5OTk5OTk5OTlcbkcxIFgyMDEuNDYxNDY0NDQ0MzM5MzYgWTEwOS4xMTYyMzU1NTkyODYyMiBGMzAwXG5HMSBYMjAwLjI4OTEwMDUzOTg5OTI0IFkxMDYuMDMxMDUwMzY2MjExNzQgRjMwMFxuRzEgWDE5OC40MTEyODY2ODg0MzY2MyBZMTAzLjMxNjg5ODU3NjE5NDI1IEYzMDBcbkcxIFgxOTUuOTM3NTQ2ODI2NTY2OTIgWTEwMS4xMzIwODM3MzM3NDI2NiBGMzAwXG5HMSBYMTkzLjAxMjE2MjQxNjI4MDMgWTk5LjYwNDAzNTY4MDgxNjM3IEYzMDBcbkcxIFgxODkuODA1NzU3MTk0NTc3MjQgWTk4LjgyMTg3ODE4MTE4MTIgRjMwMFxuRzEgWDE4OC4xOTQwMSBZOTguNzI2NDk5OTk5OTk5OTkgRjMwMFxuRzEgWDE4NC45MTc3MzU1NTkyODY0OCBZOTkuMTI1MDM1NTU1NjYyNzUgRjMwMFxuRzEgWDE4MS44MzI1NTAzNjYyMTI3NiBZMTAwLjI5NzM5OTQ2MDEwNDg0IEYzMDBcbkcxIFgxNzkuMTE4Mzk4NTc2MTk2NDggWTEwMi4xNzUyMTMzMTE1NjkyIEYzMDBcbkcxIFgxNzYuOTMzNTgzNzMzNzQ2NDcgWTEwNC42NDg5NTMxNzM0NDAzMyBGMzAwXG5HMSBYMTc1LjQwNTUzNTY4MDgyMjA2IFkxMDcuNTc0MzM3NTgzNzI3OTUgRjMwMFxuRzEgWDE3NC42MjMzNzgxODExODg5NCBZMTEwLjc4MDc0MjgwNTQzMTUgRjMwMFxuRzEgWDE3NC41MjggWTExMi4zOTI1MDk5OTk5OTk5NyBGMzAwXG5HMSBYMTc0LjkyNjUzNTU1NTY2Mjc1IFkxMTUuNjY4Nzg0NDQwNzEzNSBGMzAwXG5HMSBYMTc2LjA5ODg5OTQ2MDEwNDgzIFkxMTguNzUzOTY5NjMzNzg3MjIgRjMwMFxuRzEgWDE3Ny45NzY3MTMzMTE1NjkyIFkxMjEuNDY4MTIxNDIzODAzNDggRjMwMFxuRzEgWDE4MC40NTA0NTMxNzM0NDAzIFkxMjMuNjUyOTM2MjY2MjUzNSBGMzAwXG5HMSBYMTgzLjM3NTgzNzU4MzcyNzkzIFkxMjUuMTgwOTg0MzE5MTc3OTIgRjMwMFxuRzEgWDE4Ni41ODIyNDI4MDU0MzE0NiBZMTI1Ljk2MzE0MTgxODgxMTAyIEYzMDBcbkcxIFgxODguMTk0MDEgWTEyNi4wNTg1MTk5OTk5OTk5OSBGMzAwXG5HMSBYMTkxLjQ3MDI4Mzg1NzQ1OTA0IFkxMjUuNjU5OTc5NjQ5NTU3OTEgRjMwMFxuRzEgWDE5NC41NTU0NjczMzQ3OTIgWTEyNC40ODc2MTEyMjk5OTM2NSBGMzAwXG5HMSBYMTk3LjI2OTYxNjM3NjY1MjMgWTEyMi42MDk3OTM0MDY0MDk4NCBGMzAwXG5HMSBYMTk5LjQ1NDQyNzU5ODgxNzgzIFkxMjAuMTM2MDUwMzQ3MDk2OCBGMzAwXG5HMSBYMjAwLjk4MjQ3MTM3MDQ4MzMgWTExNy4yMTA2NjM3MDA1MzYzNCBGMzAwXG5HMSBYMjAxLjc2NDYyNDE3NzU4ODQgWTExNC4wMDQyNTczMzQxNjAxOSBGMzAwXG5HMSBYMjAxLjg2IFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU2NFxuRzAgWDI2LjI3OTU5NyBZMjc3LjY3MDU2NFxuRzEgWDI1Ljg4NTU0MTk4ODQ4OTcyNCBZMjc2LjA5MDc1MTM1MDM3ODcgRjMwMFxuRzEgWDI0Ljc5NTcwMDA5NjI1NTI1IFkyNzQuODgxMDY4NzQzMjc0MzQgRjMwMFxuRzEgWDIzLjI2NTQwNzI0NTMxNDQwMyBZMjc0LjMyNDkyOTIzNzA3MTcgRjMwMFxuRzEgWDIyLjkxNTczOSBZMjc0LjMwNjcwNiBGMzAwXG5HMSBYMjEuMzM1OTI2MTE2MDkxNDcgWTI3NC43MDA3NjAwNzIyMjQ0IEYzMDBcbkcxIFgyMC4xMjYyNDI4NjEwMTYxNTYgWTI3NS43OTA2MDEyNDUyMzU1NiBGMzAwXG5HMSBYMTkuNTcwMTAyNDQ0OTY5OTk3IFkyNzcuMzIwODkzNzY1NTIwNSBGMzAwXG5HMSBYMTkuNTUxODc5IFkyNzcuNjcwNTY0IEYzMDBcbkcxIFgxOS45NDU5MzI2MDI1ODE0MjYgWTI3OS4yNTAzNzcwMDEwNTE5NiBGMzAwXG5HMSBYMjEuMDM1NzczNDE1OTgwODc0IFkyODAuNDYwMDYwNTgwMTEyNTUgRjMwMFxuRzEgWDIyLjU2NjA2NTc3MDkzNzY2NiBZMjgxLjAxNjIwMTQ1MTA4MDMgRjMwMFxuRzEgWDIyLjkxNTczOSBZMjgxLjAzNDQyNTAwMDAwMDA2IEYzMDBcbkcxIFgyNC40OTU1NTE2NDk2MjEzOCBZMjgwLjY0MDM2OTk4ODQ4OTkgRjMwMFxuRzEgWDI1LjcwNTIzNDI1NjcyNTgyNCBZMjc5LjU1MDUyODA5NjI1NTUgRjMwMFxuRzEgWDI2LjI2MTM3Mzc2MjkyODYyIFkyNzguMDIwMjM1MjQ1MzE0NyBGMzAwXG5HMSBYMjYuMjc5NTk3IFkyNzcuNjcwNTY0MDAwMDAwMDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU2NVxuRzAgWDczLjUwMTk0MiBZMjc3LjY3MDU2NFxuRzEgWDczLjEwNzg4Njk4ODQ4OTY3IFkyNzYuMDkwNzUxMzUwMzc4NyBGMzAwXG5HMSBYNzIuMDE4MDQ1MDk2MjU1MTUgWTI3NC44ODEwNjg3NDMyNzQ0IEYzMDBcbkcxIFg3MC40ODc3NTIyNDUzMTQyOCBZMjc0LjMyNDkyOTIzNzA3MTggRjMwMFxuRzEgWDcwLjEzODA4MTk5OTk5OTk4IFkyNzQuMzA2NzA2IEYzMDBcbkcxIFg2OC41NTgyNjkzNTAzNzg2NCBZMjc0LjcwMDc2MTAxMTUxMDM0IEYzMDBcbkcxIFg2Ny4zNDg1ODY3NDMyNzQyOCBZMjc1Ljc5MDYwMjkwMzc0NDggRjMwMFxuRzEgWDY2Ljc5MjQ0NzIzNzA3MTYxIFkyNzcuMzIwODk1NzU0Njg1NjQgRjMwMFxuRzEgWDY2Ljc3NDIyNCBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYNjcuMTY4Mjc3NjAyNTgxMzcgWTI3OS4yNTAzNzcwMDEwNTE5NiBGMzAwXG5HMSBYNjguMjU4MTE4NDE1OTgwNzcgWTI4MC40NjAwNjA1ODAxMTI2IEYzMDBcbkcxIFg2OS43ODg0MTA3NzA5Mzc1NSBZMjgxLjAxNjIwMTQ1MTA4MDQgRjMwMFxuRzEgWDcwLjEzODA4MjAwMDAwMDAxIFkyODEuMDM0NDI1MDAwMDAwMDYgRjMwMFxuRzEgWDcxLjcxNzg5NDg4MzkwODU2IFkyODAuNjQwMzcwOTI3Nzc1OCBGMzAwXG5HMSBYNzIuOTI3NTc4MTM4OTgzOTYgWTI3OS41NTA1Mjk3NTQ3NjQ3NCBGMzAwXG5HMSBYNzMuNDgzNzE4NTU1MDMwMjQgWTI3OC4wMjAyMzcyMzQ0Nzk4NSBGMzAwXG5HMSBYNzMuNTAxOTQyIFkyNzcuNjcwNTY0MDAwMDAwMDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU2NlxuRzAgWDEyMC43MjQyNyBZMjc3LjY3MDU2NFxuRzEgWDEyMC4zMzAyMTQ5ODg0ODk2NyBZMjc2LjA5MDc1MTM1MDM3ODcgRjMwMFxuRzEgWDExOS4yNDAzNzMwOTYyNTUxNSBZMjc0Ljg4MTA2ODc0MzI3NDQgRjMwMFxuRzEgWDExNy43MTAwODAyNDUzMTQyOSBZMjc0LjMyNDkyOTIzNzA3MTggRjMwMFxuRzEgWDExNy4zNjA0MDk5OTk5OTk5OSBZMjc0LjMwNjcwNiBGMzAwXG5HMSBYMTE1Ljc4MDU5NzExNjA5MTQ5IFkyNzQuNzAwNzYwMDcyMjI0NCBGMzAwXG5HMSBYMTE0LjU3MDkxMzg2MTAxNjE3IFkyNzUuNzkwNjAxMjQ1MjM1NTYgRjMwMFxuRzEgWDExNC4wMTQ3NzM0NDQ5NyBZMjc3LjMyMDg5Mzc2NTUyMDUgRjMwMFxuRzEgWDExMy45OTY1NTAwMDAwMDAwMSBZMjc3LjY3MDU2NCBGMzAwXG5HMSBYMTE0LjM5MDYwMzYwMjU4MTQyIFkyNzkuMjUwMzc3MDAxMDUxOTYgRjMwMFxuRzEgWDExNS40ODA0NDQ0MTU5ODA4NyBZMjgwLjQ2MDA2MDU4MDExMjU1IEYzMDBcbkcxIFgxMTcuMDEwNzM2NzcwOTM3NjcgWTI4MS4wMTYyMDE0NTEwODAzIEYzMDBcbkcxIFgxMTcuMzYwNDEgWTI4MS4wMzQ0MjUwMDAwMDAwNiBGMzAwXG5HMSBYMTE4Ljk0MDIyMjg4MzkwODU2IFkyODAuNjQwMzcwOTI3Nzc1OCBGMzAwXG5HMSBYMTIwLjE0OTkwNjEzODk4Mzk3IFkyNzkuNTUwNTI5NzU0NzY0NzQgRjMwMFxuRzEgWDEyMC43MDYwNDY1NTUwMzAyNCBZMjc4LjAyMDIzNzIzNDQ3OTg1IEYzMDBcbkcxIFgxMjAuNzI0MjcgWTI3Ny42NzA1NjQwMDAwMDAwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTY3XG5HMCBYMTY3Ljk0NjY3IFkyNzcuNjcwNTY0XG5HMSBYMTY3LjU1MjYxNDk4ODUxOTg1IFkyNzYuMDkwNzUxMzUwMzcxMiBGMzAwXG5HMSBYMTY2LjQ2Mjc3MzA5NjMwODQgWTI3NC44ODEwNjg3NDMyNDYxIEYzMDBcbkcxIFgxNjQuOTMyNDgwMjQ1Mzc4MTcgWTI3NC4zMjQ5MjkyMzcwMTQyNiBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkyNzQuMzA2NzA2MDAwMDAwMSBGMzAwXG5HMSBYMTYzLjAwMjk3ODI4NzUzMjk1IFkyNzQuNzAwNzY0NzY4NjUyNTYgRjMwMFxuRzEgWDE2MS43OTMyOTgyNzIzMTY3IFkyNzUuNzkwNjA5NTM3Nzc2MzMgRjMwMFxuRzEgWDE2MS4yMzcxNjI0MDU0ODk5MyBZMjc3LjMyMDkwMzcxMTMzNTQgRjMwMFxuRzEgWDE2MS4yMTg5NCBZMjc3LjY3MDU2NDAwMDAwMDA3IEYzMDBcbkcxIFgxNjEuNjEyOTkzNjAyNTc1NTYgWTI3OS4yNTAzNzcwMDEwNTM0IEYzMDBcbkcxIFgxNjIuNzAyODM0NDE1OTcwNTMgWTI4MC40NjAwNjA1ODAxMTggRjMwMFxuRzEgWDE2NC4yMzMxMjY3NzA5MjUyNSBZMjgxLjAxNjIwMTQ1MTA5MTQzIEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDIgWTI4MS4wMzQ0MjUgRjMwMFxuRzEgWDE2Ni4xNjI2MDUyMjY3NDk2NiBZMjgwLjY0MDM4MDMyMDY0MjQ2IEYzMDBcbkcxIFgxNjcuMzcyMjk0OTYxNTExMSBZMjc5LjU1MDU0NjMzOTg4NTQgRjMwMFxuRzEgWDE2Ny45Mjg0NDQ0NzU5ODE0IFkyNzguMDIwMjU3MTI2MTg5NCBGMzAwXG5HMSBYMTY3Ljk0NjY3IFkyNzcuNjcwNTY0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNzJcbkcwIFg0OS44OTA3NzUgWTI1NC4wNTkzODJcbkcxIFg0OS40OTY3MjA5Mjc3NzU2NCBZMjUyLjQ3OTU2OTExNjA5MTQ4IEYzMDBcbkcxIFg0OC40MDY4Nzk3NTQ3NjQ0NiBZMjUxLjI2OTg4NTg2MTAxNjE4IEYzMDBcbkcxIFg0Ni44NzY1ODcyMzQ0Nzk1MyBZMjUwLjcxMzc0NTQ0NDk3MDAyIEYzMDBcbkcxIFg0Ni41MjY5MTcgWTI1MC42OTU1MjIgRjMwMFxuRzEgWDQ0Ljk0NzEwNDExNjA5MTQ4IFkyNTEuMDg5NTc2MDcyMjI0NCBGMzAwXG5HMSBYNDMuNzM3NDIwODYxMDE2MjA0IFkyNTIuMTc5NDE3MjQ1MjM1NiBGMzAwXG5HMSBYNDMuMTgxMjgwNDQ0OTcwMSBZMjUzLjcwOTcwOTc2NTUyMDU5IEYzMDBcbkcxIFg0My4xNjMwNTY5OTk5OTk5OTUgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwXG5HMSBYNDMuNTU3MTExNTQxODY3Mzg2IFkyNTUuNjM5MTk0NzY2NzY0OTcgRjMwMFxuRzEgWDQ0LjY0Njk1MzA3NDQ5MDMxIFkyNTYuODQ4ODc3Njk3ODU0ODUgRjMwMFxuRzEgWDQ2LjE3NzI0NTc2MDEwMzI5IFkyNTcuNDA1MDE3NjU4OTc5MiBGMzAwXG5HMSBYNDYuNTI2OTE3IFkyNTcuNDIzMjQwOTk5OTk5OTYgRjMwMFxuRzEgWDQ4LjEwNjcyOTY0OTYyMTMyIFkyNTcuMDI5MTg1OTg4NDg5NiBGMzAwXG5HMSBYNDkuMzE2NDEyMjU2NzI1NjEgWTI1NS45MzkzNDQwOTYyNTUwNCBGMzAwXG5HMSBYNDkuODcyNTUxNzYyOTI4MTkgWTI1NC40MDkwNTEyNDUzMTQxNyBGMzAwXG5HMSBYNDkuODkwNzc0OTk5OTk5OTkgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwXG5HMSBYNDkuODkwNzc1IFkyNTQuMDU5MzgyIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNzNcbkcwIFg5Ny4xMTMxMDUgWTI1NC4wNTkzODJcbkcxIFg5Ni43MTkwNTA5Mjc3Nzc0MyBZMjUyLjQ3OTU2OTExNjA5MTAzIEYzMDBcbkcxIFg5NS42MjkyMDk3NTQ3Njc2MSBZMjUxLjI2OTg4NTg2MTAxNDUgRjMwMFxuRzEgWDk0LjA5ODkxNzIzNDQ4MzMyIFkyNTAuNzEzNzQ1NDQ0OTY2NiBGMzAwXG5HMSBYOTMuNzQ5MjUxIFkyNTAuNjk1NTIyIEYzMDBcbkcxIFg5Mi4xNjk0MzcxNzg5NDgzNiBZMjUxLjA4OTU3MjMxNTA3OTQgRjMwMFxuRzEgWDkwLjk1OTc1MTMzMTk5MzUzIFkyNTIuMTc5NDEwNjExMTkzNjUgRjMwMFxuRzEgWDkwLjQwMzYwNzI3NjU3NTQ2IFkyNTMuNzA5NzAxODA4ODQ5NTYgRjMwMFxuRzEgWDkwLjM4NTM4MyBZMjU0LjA1OTM4MTk5OTk5OTk3IEYzMDBcbkcxIFg5MC43Nzk0Mzc1NDE4NjIwNCBZMjU1LjYzOTE5NDc2Njc2NjMgRjMwMFxuRzEgWDkxLjg2OTI3OTA3NDQ4MDg2IFkyNTYuODQ4ODc3Njk3ODU5ODUgRjMwMFxuRzEgWDkzLjM5OTU3MTc2MDA5MTk0IFkyNTcuNDA1MDE3NjU4OTg5NDQgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMjU3LjQyMzI0MDk5OTk5OTk2IEYzMDBcbkcxIFg5NS4zMjkwNjMxODEwNDUzIFkyNTcuMDI5MTg0MTA5OTE4MiBGMzAwXG5HMSBYOTYuNTM4NzQ0NDkyMjA2MzkgWTI1NS45MzkzNDA3NzkyMzgyNSBGMzAwXG5HMSBYOTcuMDk0ODgyMTc4NzIxNDIgWTI1NC40MDkwNDcyNjY5ODcyIEYzMDBcbkcxIFg5Ny4xMTMxMDUgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwXG5HMSBYOTcuMTEzMTA1IFkyNTQuMDU5MzgyIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNzRcbkcwIFgxNDQuMzM1NDUgWTI1NC4wNTkzODJcbkcxIFgxNDMuOTQxMzk1OTI3NzgxNDYgWTI1Mi40Nzk1NjkxMTYwOTAwMyBGMzAwXG5HMSBYMTQyLjg1MTU1NDc1NDc3NDcyIFkyNTEuMjY5ODg1ODYxMDEwNzIgRjMwMFxuRzEgWDE0MS4zMjEyNjIyMzQ0OTE4NSBZMjUwLjcxMzc0NTQ0NDk1ODkzIEYzMDBcbkcxIFgxNDAuOTcxNiBZMjUwLjY5NTUyMiBGMzAwXG5HMSBYMTM5LjM5MTc4NTk0NDY2Mzk4IFkyNTEuMDg5NTcxMzc1NzkyOCBGMzAwXG5HMSBYMTM4LjE4MjA5OTQ0OTc0MDMyIFkyNTIuMTc5NDA4OTUyNjgxODMgRjMwMFxuRzEgWDEzNy42MjU5NTQ0ODQ0Nzk3NiBZMjUzLjcwOTY5OTgxOTY3OTEyIEYzMDBcbkcxIFgxMzcuNjA3NzMwMDAwMDAwMDMgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwXG5HMSBYMTM4LjAwMTc4NDU0MTg1OTMgWTI1NS42MzkxOTQ3NjY3NjcgRjMwMFxuRzEgWDEzOS4wOTE2MjYwNzQ0NzYwNCBZMjU2Ljg0ODg3NzY5Nzg2MjQgRjMwMFxuRzEgWDE0MC42MjE5MTg3NjAwODYxNSBZMjU3LjQwNTAxNzY1ODk5NDY3IEYzMDBcbkcxIFgxNDAuOTcxNjAwMDAwMDAwMDIgWTI1Ny40MjMyNDA5OTk5OTk5NiBGMzAwXG5HMSBYMTQyLjU1MTQxMTcxMjQ2NyBZMjU3LjAyOTE4MjIzMTM0NzM2IEYzMDBcbkcxIFgxNDMuNzYxMDkxNzI3NjgzMiBZMjU1LjkzOTMzNzQ2MjIyMzUzIEYzMDBcbkcxIFgxNDQuMzE3MjI3NTk0NTA5OSBZMjU0LjQwOTA0MzI4ODY2NDQ0IEYzMDBcbkcxIFgxNDQuMzM1NDUgWTI1NC4wNTkzODE5OTk5OTk5NyBGMzAwXG5HMSBYMTQ0LjMzNTQ1IFkyNTQuMDU5MzgyIEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNzVcbkcwIFgxOTEuNTU3ODUgWTI1NC4wNTkzODJcbkcxIFgxOTEuMTYzNzk1OTI3ODAxMjYgWTI1Mi40Nzk1NjkxMTYwODUwNiBGMzAwXG5HMSBYMTkwLjA3Mzk1NDc1NDgwOTcgWTI1MS4yNjk4ODU4NjA5OTIwOCBGMzAwXG5HMSBYMTg4LjU0MzY2MjIzNDUzMzggWTI1MC43MTM3NDU0NDQ5MjEwNyBGMzAwXG5HMSBYMTg4LjE5NDAwOTk5OTk5OTk2IFkyNTAuNjk1NTIxOTk5OTk5OTggRjMwMFxuRzEgWDE4Ni42MTQxOTQ3NzMyNTAzOCBZMjUxLjA4OTU2NjY3OTM1NzcgRjMwMFxuRzEgWDE4NS40MDQ1MDUwMzg0ODkwNSBZMjUyLjE3OTQwMDY2MDExNDg4IEYzMDBcbkcxIFgxODQuODQ4MzU1NTI0MDE4OTMgWTI1My43MDk2ODk4NzM4MTEgRjMwMFxuRzEgWDE4NC44MzAxMyBZMjU0LjA1OTM4MTk5OTk5OTk3IEYzMDBcbkcxIFgxODUuMjI0MTg0NTQxODM3MjUgWTI1NS42MzkxOTQ3NjY3NzI1IEYzMDBcbkcxIFgxODYuMzE0MDI2MDc0NDM3MDcgWTI1Ni44NDg4Nzc2OTc4ODMxNSBGMzAwXG5HMSBYMTg3Ljg0NDMxODc2MDAzOTQ0IFkyNTcuNDA1MDE3NjU5MDM2NzMgRjMwMFxuRzEgWDE4OC4xOTQwMTAwMDAwMDAwMiBZMjU3LjQyMzI0MDk5OTk5OTk2IEYzMDBcbkcxIFgxODkuNzczODIwNTQxMDExNTYgWTI1Ny4wMjkxNzc1MzQ5MjI3IEYzMDBcbkcxIFgxOTAuOTgzNDk3MzE2MzU3OTggWTI1NS45MzkzMjkxNjk2OTU5NSBGMzAwXG5HMSBYMTkxLjUzOTYyODYzMzk2MDM4IFkyNTQuNDA5MDMzMzQyODc2MjMgRjMwMFxuRzEgWDE5MS41NTc4NSBZMjU0LjA1OTM4MTk5OTk5OTk3IEYzMDBcbkcxIFgxOTEuNTU3ODUgWTI1NC4wNTkzODIgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU3NlxuRzAgWDI2LjI3OTU5NyBZMjMwLjQ0ODIxNFxuRzEgWDI1Ljg4NTUzNTg4MzEzNDc0IFkyMjguODY4NDAyODczMjU4OTYgRjMwMFxuRzEgWDI0Ljc5NTY4OTMxNTk1ODMxIFkyMjcuNjU4NzI0NDc3OTc2MjUgRjMwMFxuRzEgWDIzLjI2NTM5NDMxNTc2NzI0MiBZMjI3LjEwMjU5MDg4NTc2MSBGMzAwXG5HMSBYMjIuOTE1NzM5IFkyMjcuMDg0MzY5MDAwMDAwMDQgRjMwMFxuRzEgWDIxLjMzNTkyNjExNjA4Nzk4IFkyMjcuNDc4NDIzMDcyMjEwNCBGMzAwXG5HMSBYMjAuMTI2MjQyODYxMDAzMDMgWTIyOC41NjgyNjQyNDUyMTA5IEYzMDBcbkcxIFgxOS41NzAxMDI0NDQ5NDMzMzQgWTIzMC4wOTg1NTY3NjU0OTA5IEYzMDBcbkcxIFgxOS41NTE4NzkgWTIzMC40NDgyMTQwMDAwMDAwNCBGMzAwXG5HMSBYMTkuOTQ1OTMzMDcyMjI0NDI3IFkyMzIuMDI4MDI2ODgzOTA4NTIgRjMwMFxuRzEgWDIxLjAzNTc3NDI0NTIzNTY2IFkyMzMuMjM3NzEwMTM4OTgzOCBGMzAwXG5HMSBYMjIuNTY2MDY2NzY1NTIwNjEzIFkyMzMuNzkzODUwNTU1MDI5OSBGMzAwXG5HMSBYMjIuOTE1NzM5IFkyMzMuODEyMDc0IEYzMDBcbkcxIFgyNC40OTU1NTE2NDk2MjEzNCBZMjMzLjQxODAxODk4ODQ4OTY4IEYzMDBcbkcxIFgyNS43MDUyMzQyNTY3MjU2NTcgWTIzMi4zMjgxNzcwOTYyNTUxNiBGMzAwXG5HMSBYMjYuMjYxMzczNzYyOTI4Mjc2IFkyMzAuNzk3ODg0MjQ1MzE0MyBGMzAwXG5HMSBYMjYuMjc5NTk3IFkyMzAuNDQ4MjE0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNzdcbkcwIFg3My41MDE5NDIgWTIzMC40NDgyMTRcbkcxIFg3My4xMDc4ODA4ODMxMzQ2NyBZMjI4Ljg2ODQwMjg3MzI1ODk2IEYzMDBcbkcxIFg3Mi4wMTgwMzQzMTU5NTgyIFkyMjcuNjU4NzI0NDc3OTc2MjggRjMwMFxuRzEgWDcwLjQ4NzczOTMxNTc2NzEyIFkyMjcuMTAyNTkwODg1NzYxMTIgRjMwMFxuRzEgWDcwLjEzODA4MTk5OTk5OTk4IFkyMjcuMDg0MzY5MDAwMDAwMDQgRjMwMFxuRzEgWDY4LjU1ODI2OTM1MDM3NTE2IFkyMjcuNDc4NDI0MDExNDk2MzIgRjMwMFxuRzEgWDY3LjM0ODU4Njc0MzI2MTE3IFkyMjguNTY4MjY1OTAzNzIwMSBGMzAwXG5HMSBYNjYuNzkyNDQ3MjM3MDQ0OTUgWTIzMC4wOTg1NTg3NTQ2NTYgRjMwMFxuRzEgWDY2Ljc3NDIyNCBZMjMwLjQ0ODIxNDAwMDAwMDA0IEYzMDBcbkcxIFg2Ny4xNjgyNzgwNzIyMjQzOCBZMjMyLjAyODAyNjg4MzkwODU1IEYzMDBcbkcxIFg2OC4yNTgxMTkyNDUyMzU1NiBZMjMzLjIzNzcxMDEzODk4Mzg2IEYzMDBcbkcxIFg2OS43ODg0MTE3NjU1MjA1IFkyMzMuNzkzODUwNTU1MDMwMDIgRjMwMFxuRzEgWDcwLjEzODA4MiBZMjMzLjgxMjA3NCBGMzAwXG5HMSBYNzEuNzE3ODk0ODgzOTA4NTEgWTIzMy40MTgwMTk5Mjc3NzU2IEYzMDBcbkcxIFg3Mi45Mjc1NzgxMzg5ODM3OSBZMjMyLjMyODE3ODc1NDc2NDM3IEYzMDBcbkcxIFg3My40ODM3MTg1NTUwMjk5IFkyMzAuNzk3ODg2MjM0NDc5NCBGMzAwXG5HMSBYNzMuNTAxOTQyIFkyMzAuNDQ4MjE0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNzhcbkcwIFgxMjAuNzI0MjcgWTIzMC40NDgyMTRcbkcxIFgxMjAuMzMwMjA4ODgzMTM0NjcgWTIyOC44Njg0MDI4NzMyNTg5NiBGMzAwXG5HMSBYMTE5LjI0MDM2MjMxNTk1ODIxIFkyMjcuNjU4NzI0NDc3OTc2MjggRjMwMFxuRzEgWDExNy43MTAwNjczMTU3NjcxMiBZMjI3LjEwMjU5MDg4NTc2MTEyIEYzMDBcbkcxIFgxMTcuMzYwNDA5OTk5OTk5OTkgWTIyNy4wODQzNjkwMDAwMDAwNCBGMzAwXG5HMSBYMTE1Ljc4MDU5NzExNjA4Nzk5IFkyMjcuNDc4NDIzMDcyMjEwNCBGMzAwXG5HMSBYMTE0LjU3MDkxMzg2MTAwMzA0IFkyMjguNTY4MjY0MjQ1MjEwOSBGMzAwXG5HMSBYMTE0LjAxNDc3MzQ0NDk0MzM0IFkyMzAuMDk4NTU2NzY1NDkwOSBGMzAwXG5HMSBYMTEzLjk5NjU1MDAwMDAwMDAxIFkyMzAuNDQ4MjE0MDAwMDAwMDQgRjMwMFxuRzEgWDExNC4zOTA2MDQwNzIyMjQ0MyBZMjMyLjAyODAyNjg4MzkwODUyIEYzMDBcbkcxIFgxMTUuNDgwNDQ1MjQ1MjM1NjYgWTIzMy4yMzc3MTAxMzg5ODM4IEYzMDBcbkcxIFgxMTcuMDEwNzM3NzY1NTIwNjIgWTIzMy43OTM4NTA1NTUwMjk5IEYzMDBcbkcxIFgxMTcuMzYwNDEgWTIzMy44MTIwNzQgRjMwMFxuRzEgWDExOC45NDAyMjI4ODM5MDg1MiBZMjMzLjQxODAxOTkyNzc3NTYgRjMwMFxuRzEgWDEyMC4xNDk5MDYxMzg5ODM4IFkyMzIuMzI4MTc4NzU0NzY0MzcgRjMwMFxuRzEgWDEyMC43MDYwNDY1NTUwMjk5IFkyMzAuNzk3ODg2MjM0NDc5NCBGMzAwXG5HMSBYMTIwLjcyNDI3IFkyMzAuNDQ4MjE0IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlNzlcbkcwIFgxNjcuOTQ2NjcgWTIzMC40NDgyMTRcbkcxIFgxNjcuNTUyNjA4ODgzMTY0ODUgWTIyOC44Njg0MDI4NzMyNTE0NSBGMzAwXG5HMSBYMTY2LjQ2Mjc2MjMxNjAxMTQ2IFkyMjcuNjU4NzI0NDc3OTQ3OTcgRjMwMFxuRzEgWDE2NC45MzI0NjczMTU4MzEgWTIyNy4xMDI1OTA4ODU3MDM1NiBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkyMjcuMDg0MzY5MDAwMDAwMDQgRjMwMFxuRzEgWDE2My4wMDI5NzgyODc1Mjk0NiBZMjI3LjQ3ODQyNzc2ODYzODU0IEYzMDBcbkcxIFgxNjEuNzkzMjk4MjcyMzAzNiBZMjI4LjU2ODI3MjUzNzc1MTYgRjMwMFxuRzEgWDE2MS4yMzcxNjI0MDU0NjMyNyBZMjMwLjA5ODU2NjcxMTMwNTc1IEYzMDBcbkcxIFgxNjEuMjE4OTQgWTIzMC40NDgyMTQwMDAwMDAwNCBGMzAwXG5HMSBYMTYxLjYxMjk5NDA3MjIxODU2IFkyMzIuMDI4MDI2ODgzOTEgRjMwMFxuRzEgWDE2Mi43MDI4MzUyNDUyMjUzIFkyMzMuMjM3NzEwMTM4OTg5MyBGMzAwXG5HMSBYMTY0LjIzMzEyNzc2NTUwODIgWTIzMy43OTM4NTA1NTUwNDEwOCBGMzAwXG5HMSBYMTY0LjU4Mjc5MDAwMDAwMDAyIFkyMzMuODEyMDc0IEYzMDBcbkcxIFgxNjYuMTYyNjA1MjI2NzQ5NjMgWTIzMy40MTgwMjkzMjA2NDIzIEYzMDBcbkcxIFgxNjcuMzcyMjk0OTYxNTEwOTYgWTIzMi4zMjgxOTUzMzk4ODUxIEYzMDBcbkcxIFgxNjcuOTI4NDQ0NDc1OTgxMDggWTIzMC43OTc5MDYxMjYxODkgRjMwMFxuRzEgWDE2Ny45NDY2NyBZMjMwLjQ0ODIxNCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTgwXG5HMCBYNDkuODkwNzc1IFkyMDYuODM3MTczXG5HMSBYNDkuNDk2NzEyNDc0MjA3NSBZMjA1LjI1NzM2MjIyNDY5NjIgRjMwMFxuRzEgWDQ4LjQwNjg2NDgyODIwMDYyNSBZMjA0LjA0NzY4NDgwMTM3NDkgRjMwMFxuRzEgWDQ2Ljg3NjU2OTMzMjAzMTk4NCBZMjAzLjQ5MTU1MjU3MzkyNzE4IEYzMDBcbkcxIFg0Ni41MjY5MTY5OTk5OTk5OSBZMjAzLjQ3MzMzMTAwMDAwMDAzIEYzMDBcbkcxIFg0NC45NDcxMDQxMTYwODYzMyBZMjAzLjg2NzM4NTA3MjIwMzgzIEYzMDBcbkcxIFg0My43Mzc0MjA4NjA5OTY4NCBZMjA0Ljk1NzIyNjI0NTE5OTI4IEYzMDBcbkcxIFg0My4xODEyODA0NDQ5MzA3OCBZMjA2LjQ4NzUxODc2NTQ3Njk4IEYzMDBcbkcxIFg0My4xNjMwNTY5OTk5OTk5OTUgWTIwNi44MzcxNzMwMDAwMDAwNCBGMzAwXG5HMSBYNDMuNTU3MTE5NTI1NzkyNTQ0IFkyMDguNDE2OTgzNzc1MzAzOCBGMzAwXG5HMSBYNDQuNjQ2OTY3MTcxNzk5NDYgWTIwOS42MjY2NjExOTg2MjUwNyBGMzAwXG5HMSBYNDYuMTc3MjYyNjY3OTY4MTE1IFkyMTAuMTgyNzkzNDI2MDcyNzUgRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMjEwLjIwMTAxNDk5OTk5OTk4IEYzMDBcbkcxIFg0OC4xMDY3Mjk2NDk2MjY0NyBZMjA5LjgwNjk1OTk4ODUxMDI3IEYzMDBcbkcxIFg0OS4zMTY0MTIyNTY3NDUwMDQgWTIwOC43MTcxMTgwOTYyOTE1MyBGMzAwXG5HMSBYNDkuODcyNTUxNzYyOTY3NTkgWTIwNy4xODY4MjUyNDUzNTc5NCBGMzAwXG5HMSBYNDkuODkwNzc0OTk5OTk5OTkgWTIwNi44MzcxNzI5OTk5OTk5OCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTgxXG5HMCBYOTcuMTEzMTA1IFkyMDYuODM3MTczXG5HMSBYOTYuNzE5MDQyNDc0MjA5MyBZMjA1LjI1NzM2MjIyNDY5NTc1IEYzMDBcbkcxIFg5NS42MjkxOTQ4MjgyMDM4IFkyMDQuMDQ3Njg0ODAxMzczMjQgRjMwMFxuRzEgWDk0LjA5ODg5OTMzMjAzNTc4IFkyMDMuNDkxNTUyNTczOTIzNzcgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMjAzLjQ3MzMzMTAwMDAwMDAzIEYzMDBcbkcxIFg5Mi4xNjk0MzcxNzg5NDMyMSBZMjAzLjg2NzM4MTMxNTA1ODgyIEYzMDBcbkcxIFg5MC45NTk3NTEzMzE5NzQxNiBZMjA0Ljk1NzIxOTYxMTE1NzI5IEYzMDBcbkcxIFg5MC40MDM2MDcyNzY1MzYxNCBZMjA2LjQ4NzUxMDgwODgwNTkyIEYzMDBcbkcxIFg5MC4zODUzODMgWTIwNi44MzcxNzMgRjMwMFxuRzEgWDkwLjc3OTQ0NTUyNTc4NzIgWTIwOC40MTY5ODM3NzUzMDUxNCBGMzAwXG5HMSBYOTEuODY5MjkzMTcxNzkgWTIwOS42MjY2NjExOTg2MzAxIEYzMDBcbkcxIFg5My4zOTk1ODg2Njc5NTY3OCBZMjEwLjE4Mjc5MzQyNjA4Mjk4IEYzMDBcbkcxIFg5My43NDkyNTEgWTIxMC4yMDEwMTUgRjMwMFxuRzEgWDk1LjMyOTA2MzE4MTA1MDQ2IFkyMDkuODA2OTU4MTA5OTM4ODggRjMwMFxuRzEgWDk2LjUzODc0NDQ5MjIyNTc5IFkyMDguNzE3MTE0Nzc5Mjc0NzQgRjMwMFxuRzEgWDk3LjA5NDg4MjE3ODc2MDgxIFkyMDcuMTg2ODIxMjY3MDMwOTIgRjMwMFxuRzEgWDk3LjExMzEwNSBZMjA2LjgzNzE3Mjk5OTk5OTk4IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlODJcbkcwIFgxNDQuMzM1NDUgWTIwNi44MzcxNzNcbkcxIFgxNDMuOTQxMzg3NDc0MjEzMzEgWTIwNS4yNTczNjIyMjQ2OTQ3NiBGMzAwXG5HMSBYMTQyLjg1MTUzOTgyODIxMDkgWTIwNC4wNDc2ODQ4MDEzNjk0NiBGMzAwXG5HMSBYMTQxLjMyMTI0NDMzMjA0NDMgWTIwMy40OTE1NTI1NzM5MTYxIEYzMDBcbkcxIFgxNDAuOTcxNiBZMjAzLjQ3MzMzMTAwMDAwMDAzIEYzMDBcbkcxIFgxMzkuMzkxNzg1OTQ0NjU4ODQgWTIwMy44NjczODAzNzU3NzIyIEYzMDBcbkcxIFgxMzguMTgyMDk5NDQ5NzIwOTcgWTIwNC45NTcyMTc5NTI2NDU0NiBGMzAwXG5HMSBYMTM3LjYyNTk1NDQ4NDQ0MDQ2IFkyMDYuNDg3NTA4ODE5NjM1NSBGMzAwXG5HMSBYMTM3LjYwNzczIFkyMDYuODM3MTczIEYzMDBcbkcxIFgxMzguMDAxNzkyNTI1Nzg0NDggWTIwOC40MTY5ODM3NzUzMDU4MiBGMzAwXG5HMSBYMTM5LjA5MTY0MDE3MTc4NTIgWTIwOS42MjY2NjExOTg2MzI3IEYzMDBcbkcxIFgxNDAuNjIxOTM1NjY3OTUxIFkyMTAuMTgyNzkzNDI2MDg4MiBGMzAwXG5HMSBYMTQwLjk3MTYgWTIxMC4yMDEwMTUgRjMwMFxuRzEgWDE0Mi41NTE0MTE3MTI0NzIxNyBZMjA5LjgwNjk1NjIzMTM2ODA1IEYzMDBcbkcxIFgxNDMuNzYxMDkxNzI3NzAyNiBZMjA4LjcxNzExMTQ2MjI2MDAyIEYzMDBcbkcxIFgxNDQuMzE3MjI3NTk0NTQ5MjggWTIwNy4xODY4MTcyODg3MDgyIEYzMDBcbkcxIFgxNDQuMzM1NDUgWTIwNi44MzcxNzI5OTk5OTk5OCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTgzXG5HMCBYMTkxLjU1Nzg1IFkyMDYuODM3MTczXG5HMSBYMTkxLjE2Mzc4NzQ3NDIzMzEyIFkyMDUuMjU3MzYyMjI0Njg5OCBGMzAwXG5HMSBYMTkwLjA3MzkzOTgyODI0NTg3IFkyMDQuMDQ3Njg0ODAxMzUwOCBGMzAwXG5HMSBYMTg4LjU0MzY0NDMzMjA4NjI3IFkyMDMuNDkxNTUyNTczODc4MjQgRjMwMFxuRzEgWDE4OC4xOTQwMSBZMjAzLjQ3MzMzMSBGMzAwXG5HMSBYMTg2LjYxNDE5NDc3MzI0NTI2IFkyMDMuODY3Mzc1Njc5MzM3MTMgRjMwMFxuRzEgWDE4NS40MDQ1MDUwMzg0Njk3MiBZMjA0Ljk1NzIwOTY2MDA3ODU1IEYzMDBcbkcxIFgxODQuODQ4MzU1NTIzOTc5NjUgWTIwNi40ODc0OTg4NzM3Njc0IEYzMDBcbkcxIFgxODQuODMwMTMgWTIwNi44MzcxNzMwMDAwMDAwNCBGMzAwXG5HMSBYMTg1LjIyNDE5MjUyNTc2MjQgWTIwOC40MTY5ODM3NzUzMTEzIEYzMDBcbkcxIFgxODYuMzE0MDQwMTcxNzQ2MjMgWTIwOS42MjY2NjExOTg2NTMzOCBGMzAwXG5HMSBYMTg3Ljg0NDMzNTY2NzkwNDI2IFkyMTAuMTgyNzkzNDI2MTMwMjcgRjMwMFxuRzEgWDE4OC4xOTQwMSBZMjEwLjIwMTAxNDk5OTk5OTk4IEYzMDBcbkcxIFgxODkuNzczODIwNTQxMDE2NyBZMjA5LjgwNjk1MTUzNDk0MzQgRjMwMFxuRzEgWDE5MC45ODM0OTczMTYzNzc0IFkyMDguNzE3MTAzMTY5NzMyNDcgRjMwMFxuRzEgWDE5MS41Mzk2Mjg2MzM5OTk4IFkyMDcuMTg2ODA3MzQyOTIwMDIgRjMwMFxuRzEgWDE5MS41NTc4NSBZMjA2LjgzNzE3MyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTg0XG5HMCBYMjYuMjc5NTk3IFkxODMuMjI2MDdcbkcxIFgyNS44ODU1NDI5Mjc3NzU2MjggWTE4MS42NDYyNTcxMTYwOTE0NSBGMzAwXG5HMSBYMjQuNzk1NzAxNzU0NzY0NDM3IFkxODAuNDM2NTczODYxMDE2MTQgRjMwMFxuRzEgWDIzLjI2NTQwOTIzNDQ3OTUwMiBZMTc5Ljg4MDQzMzQ0NDk2OTk4IEYzMDBcbkcxIFgyMi45MTU3MzkgWTE3OS44NjIyMSBGMzAwXG5HMSBYMjEuMzM1OTI2MTE2MDkxNDggWTE4MC4yNTYyNjQwNzIyMjQ0IEYzMDBcbkcxIFgyMC4xMjYyNDI4NjEwMTYyMSBZMTgxLjM0NjEwNTI0NTIzNTYzIEYzMDBcbkcxIFgxOS41NzAxMDI0NDQ5NzAxMDcgWTE4Mi44NzYzOTc3NjU1MjA2IEYzMDBcbkcxIFgxOS41NTE4NzkwMDAwMDAwMDMgWTE4My4yMjYwNyBGMzAwXG5HMSBYMTkuOTQ1OTMzMDcyMjI0NDI3IFkxODQuODA1ODgyODgzOTA4NSBGMzAwXG5HMSBYMjEuMDM1Nzc0MjQ1MjM1NjYgWTE4Ni4wMTU1NjYxMzg5ODM4IEYzMDBcbkcxIFgyMi41NjYwNjY3NjU1MjA2MTMgWTE4Ni41NzE3MDY1NTUwMjk5IEYzMDBcbkcxIFgyMi45MTU3MzkgWTE4Ni41ODk5Mjk5OTk5OTk5OCBGMzAwXG5HMSBYMjQuNDk1NTUxNjQ5NjIxMzQgWTE4Ni4xOTU4NzQ5ODg0ODk2NiBGMzAwXG5HMSBYMjUuNzA1MjM0MjU2NzI1NjU3IFkxODUuMTA2MDMzMDk2MjU1MTUgRjMwMFxuRzEgWDI2LjI2MTM3Mzc2MjkyODI3NiBZMTgzLjU3NTc0MDI0NTMxNDI4IEYzMDBcbkcxIFgyNi4yNzk1OTcgWTE4My4yMjYwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTg1XG5HMCBYNzMuNTAxOTQyIFkxODMuMjI2MDdcbkcxIFg3My4xMDc4ODc5Mjc3NzU1NiBZMTgxLjY0NjI1NzExNjA5MTQ4IEYzMDBcbkcxIFg3Mi4wMTgwNDY3NTQ3NjQzMyBZMTgwLjQzNjU3Mzg2MTAxNjIgRjMwMFxuRzEgWDcwLjQ4Nzc1NDIzNDQ3OTM4IFkxNzkuODgwNDMzNDQ0OTcwMSBGMzAwXG5HMSBYNzAuMTM4MDgyIFkxNzkuODYyMjEgRjMwMFxuRzEgWDY4LjU1ODI2OTM1MDM3ODY3IFkxODAuMjU2MjY1MDExNTEwMzIgRjMwMFxuRzEgWDY3LjM0ODU4Njc0MzI3NDM0IFkxODEuMzQ2MTA2OTAzNzQ0ODQgRjMwMFxuRzEgWDY2Ljc5MjQ0NzIzNzA3MTczIFkxODIuODc2Mzk5NzU0Njg1NyBGMzAwXG5HMSBYNjYuNzc0MjI0IFkxODMuMjI2MDcgRjMwMFxuRzEgWDY3LjE2ODI3ODA3MjIyNDM4IFkxODQuODA1ODgyODgzOTA4NTQgRjMwMFxuRzEgWDY4LjI1ODExOTI0NTIzNTU2IFkxODYuMDE1NTY2MTM4OTgzODQgRjMwMFxuRzEgWDY5Ljc4ODQxMTc2NTUyMDUgWTE4Ni41NzE3MDY1NTUwMyBGMzAwXG5HMSBYNzAuMTM4MDgyIFkxODYuNTg5OTI5OTk5OTk5OTggRjMwMFxuRzEgWDcxLjcxNzg5NDg4MzkwODUxIFkxODYuMTk1ODc1OTI3Nzc1NTcgRjMwMFxuRzEgWDcyLjkyNzU3ODEzODk4Mzc5IFkxODUuMTA2MDM0NzU0NzY0MzUgRjMwMFxuRzEgWDczLjQ4MzcxODU1NTAyOTkgWTE4My41NzU3NDIyMzQ0NzkzOCBGMzAwXG5HMSBYNzMuNTAxOTQyIFkxODMuMjI2MDcgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU4NlxuRzAgWDEyMC43MjQyNyBZMTgzLjIyNjA3XG5HMSBYMTIwLjMzMDIxNTkyNzc3NTU3IFkxODEuNjQ2MjU3MTE2MDkxNDggRjMwMFxuRzEgWDExOS4yNDAzNzQ3NTQ3NjQzMyBZMTgwLjQzNjU3Mzg2MTAxNjIgRjMwMFxuRzEgWDExNy43MTAwODIyMzQ0NzkzOSBZMTc5Ljg4MDQzMzQ0NDk3MDEgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTc5Ljg2MjIxIEYzMDBcbkcxIFgxMTUuNzgwNTk3MTE2MDkxNDkgWTE4MC4yNTYyNjQwNzIyMjQ0IEYzMDBcbkcxIFgxMTQuNTcwOTEzODYxMDE2MjEgWTE4MS4zNDYxMDUyNDUyMzU2MyBGMzAwXG5HMSBYMTE0LjAxNDc3MzQ0NDk3MDEgWTE4Mi44NzYzOTc3NjU1MjA2IEYzMDBcbkcxIFgxMTMuOTk2NTUgWTE4My4yMjYwNyBGMzAwXG5HMSBYMTE0LjM5MDYwNDA3MjIyNDQzIFkxODQuODA1ODgyODgzOTA4NSBGMzAwXG5HMSBYMTE1LjQ4MDQ0NTI0NTIzNTY2IFkxODYuMDE1NTY2MTM4OTgzOCBGMzAwXG5HMSBYMTE3LjAxMDczNzc2NTUyMDYyIFkxODYuNTcxNzA2NTU1MDI5OSBGMzAwXG5HMSBYMTE3LjM2MDQxIFkxODYuNTg5OTI5OTk5OTk5OTggRjMwMFxuRzEgWDExOC45NDAyMjI4ODM5MDg1MiBZMTg2LjE5NTg3NTkyNzc3NTU3IEYzMDBcbkcxIFgxMjAuMTQ5OTA2MTM4OTgzOCBZMTg1LjEwNjAzNDc1NDc2NDM1IEYzMDBcbkcxIFgxMjAuNzA2MDQ2NTU1MDI5OSBZMTgzLjU3NTc0MjIzNDQ3OTM4IEYzMDBcbkcxIFgxMjAuNzI0MjcgWTE4My4yMjYwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTg3XG5HMCBYMTY3Ljk0NjY3IFkxODMuMjI2MDdcbkcxIFgxNjcuNTUyNjE1OTI3ODA1NzYgWTE4MS42NDYyNTcxMTYwODM5NCBGMzAwXG5HMSBYMTY2LjQ2Mjc3NDc1NDgxNzYyIFkxODAuNDM2NTczODYwOTg3ODYgRjMwMFxuRzEgWDE2NC45MzI0ODIyMzQ1NDMyNyBZMTc5Ljg4MDQzMzQ0NDkxMjU3IEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDIgWTE3OS44NjIyMSBGMzAwXG5HMSBYMTYzLjAwMjk3ODI4NzUzMjk1IFkxODAuMjU2MjY4NzY4NjUyNTUgRjMwMFxuRzEgWDE2MS43OTMyOTgyNzIzMTY3NSBZMTgxLjM0NjExMzUzNzc3NjM1IEYzMDBcbkcxIFgxNjEuMjM3MTYyNDA1NDkgWTE4Mi44NzY0MDc3MTEzMzU0MiBGMzAwXG5HMSBYMTYxLjIxODk0IFkxODMuMjI2MDcgRjMwMFxuRzEgWDE2MS42MTI5OTQwNzIyMTg1NiBZMTg0LjgwNTg4Mjg4MzkxIEYzMDBcbkcxIFgxNjIuNzAyODM1MjQ1MjI1MyBZMTg2LjAxNTU2NjEzODk4OTMgRjMwMFxuRzEgWDE2NC4yMzMxMjc3NjU1MDgyIFkxODYuNTcxNzA2NTU1MDQxMDYgRjMwMFxuRzEgWDE2NC41ODI3OTAwMDAwMDAwMiBZMTg2LjU4OTkyOTk5OTk5OTk4IEYzMDBcbkcxIFgxNjYuMTYyNjA1MjI2NzQ5NjMgWTE4Ni4xOTU4ODUzMjA2NDIyOCBGMzAwXG5HMSBYMTY3LjM3MjI5NDk2MTUxMDk2IFkxODUuMTA2MDUxMzM5ODg1MDggRjMwMFxuRzEgWDE2Ny45Mjg0NDQ0NzU5ODEwOCBZMTgzLjU3NTc2MjEyNjE4ODk4IEYzMDBcbkcxIFgxNjcuOTQ2NjcgWTE4My4yMjYwNyBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTg4XG5HMCBYNDkuODkwNzc1IFkxNTkuNjE0OVxuRzEgWDQ5LjQ5NjcxNjIzMTM0NzUwNiBZMTU4LjAzNTA4ODI4NzUzMjk0IEYzMDBcbkcxIFg0OC40MDY4NzE0NjIyMjM3NTUgWTE1Ni44MjU0MDgyNzIzMTY2OCBGMzAwXG5HMSBYNDYuODc2NTc3Mjg4NjY0NjkgWTE1Ni4yNjkyNzI0MDU0ODk5MSBGMzAwXG5HMSBYNDYuNTI2OTE2OTk5OTk5OTkgWTE1Ni4yNTEwNSBGMzAwXG5HMSBYNDQuOTQ3MTA0MTE2MDkwMDEgWTE1Ni42NDUxMDQwNzIyMTg1NCBGMzAwXG5HMSBYNDMuNzM3NDIwODYxMDEwNjkgWTE1Ny43MzQ5NDUyNDUyMjUyOCBGMzAwXG5HMSBYNDMuMTgxMjgwNDQ0OTU4OTEgWTE1OS4yNjUyMzc3NjU1MDgxOCBGMzAwXG5HMSBYNDMuMTYzMDU2OTk5OTk5OTk1IFkxNTkuNjE0OSBGMzAwXG5HMSBYNDMuNTU3MTA2Mzc1NzkyODA2IFkxNjEuMTk0NzE0MDU1MzM2MDIgRjMwMFxuRzEgWDQ0LjY0Njk0Mzk1MjY4MTg0IFkxNjIuNDA0NDAwNTUwMjU5NjggRjMwMFxuRzEgWDQ2LjE3NzIzNDgxOTY3OTEyIFkxNjIuOTYwNTQ1NTE1NTIwMjQgRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMTYyLjk3ODc2OTk5OTk5OTk3IEYzMDBcbkcxIFg0OC4xMDY3Mjk2NDk2MjMzNiBZMTYyLjU4NDcxNDk4ODQ5Nzc1IEYzMDBcbkcxIFg0OS4zMTY0MTIyNTY3MzMyNiBZMTYxLjQ5NDg3MzA5NjI2OTQzIEYzMDBcbkcxIFg0OS44NzI1NTE3NjI5NDM3MiBZMTU5Ljk2NDU4MDI0NTMzMTQzIEYzMDBcbkcxIFg0OS44OTA3NzUgWTE1OS42MTQ4OTk5OTk5OTk5OCBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTg5XG5HMCBYOTcuMTEzMTA1IFkxNTkuNjE0OVxuRzEgWDk2LjcxOTA0NjIzMTM0OTMgWTE1OC4wMzUwODgyODc1MzI1IEYzMDBcbkcxIFg5NS42MjkyMDE0NjIyMjY5MiBZMTU2LjgyNTQwODI3MjMxNSBGMzAwXG5HMSBYOTQuMDk4OTA3Mjg4NjY4NDkgWTE1Ni4yNjkyNzI0MDU0ODY1IEYzMDBcbkcxIFg5My43NDkyNTEgWTE1Ni4yNTEwNSBGMzAwXG5HMSBYOTIuMTY5NDM3MTc4OTQ2OSBZMTU2LjY0NTEwMDMxNTA3MzUzIEYzMDBcbkcxIFg5MC45NTk3NTEzMzE5ODgwMiBZMTU3LjczNDkzODYxMTE4MzI4IEYzMDBcbkcxIFg5MC40MDM2MDcyNzY1NjQyNyBZMTU5LjI2NTIyOTgwODgzNzEyIEYzMDBcbkcxIFg5MC4zODUzODMgWTE1OS42MTQ5IEYzMDBcbkcxIFg5MC43Nzk0MzIzNzU3ODc0NSBZMTYxLjE5NDcxNDA1NTMzNzM5IEYzMDBcbkcxIFg5MS44NjkyNjk5NTI2NzIzNyBZMTYyLjQwNDQwMDU1MDI2NDcgRjMwMFxuRzEgWDkzLjM5OTU2MDgxOTY2Nzc3IFkxNjIuOTYwNTQ1NTE1NTMwNDcgRjMwMFxuRzEgWDkzLjc0OTI1MDk5OTk5OTk5IFkxNjIuOTc4NzcgRjMwMFxuRzEgWDk1LjMyOTA2MzE4MTA0NzMzIFkxNjIuNTg0NzEzMTA5OTI2MzUgRjMwMFxuRzEgWDk2LjUzODc0NDQ5MjIxNDA1IFkxNjEuNDk0ODY5Nzc5MjUyNjQgRjMwMFxuRzEgWDk3LjA5NDg4MjE3ODczNjk1IFkxNTkuOTY0NTc2MjY3MDA0NDIgRjMwMFxuRzEgWDk3LjExMzEwNSBZMTU5LjYxNDg5OTk5OTk5OTk4IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOTBcbkcwIFgxNDQuMzM1NDUgWTE1OS42MTQ5XG5HMSBYMTQzLjk0MTM5MTIzMTM1MzMyIFkxNTguMDM1MDg4Mjg3NTMxNSBGMzAwXG5HMSBYMTQyLjg1MTU0NjQ2MjIzNCBZMTU2LjgyNTQwODI3MjMxMTI1IEYzMDBcbkcxIFgxNDEuMzIxMjUyMjg4Njc3IFkxNTYuMjY5MjcyNDA1NDc4ODMgRjMwMFxuRzEgWDE0MC45NzE2IFkxNTYuMjUxMDUgRjMwMFxuRzEgWDEzOS4zOTE3ODU5NDQ2NjI1MyBZMTU2LjY0NTA5OTM3NTc4Njk0IEYzMDBcbkcxIFgxMzguMTgyMDk5NDQ5NzM0ODQgWTE1Ny43MzQ5MzY5NTI2NzE1IEYzMDBcbkcxIFgxMzcuNjI1OTU0NDg0NDY4NiBZMTU5LjI2NTIyNzgxOTY2NjcgRjMwMFxuRzEgWDEzNy42MDc3MzAwMDAwMDAwMyBZMTU5LjYxNDkgRjMwMFxuRzEgWDEzOC4wMDE3NzkzNzU3ODQ3NCBZMTYxLjE5NDcxNDA1NTMzODA3IEYzMDBcbkcxIFgxMzkuMDkxNjE2OTUyNjY3NTUgWTE2Mi40MDQ0MDA1NTAyNjcyNyBGMzAwXG5HMSBYMTQwLjYyMTkwNzgxOTY2MiBZMTYyLjk2MDU0NTUxNTUzNTcgRjMwMFxuRzEgWDE0MC45NzE2IFkxNjIuOTc4NzcgRjMwMFxuRzEgWDE0Mi41NTE0MTE3MTI0NjkwNSBZMTYyLjU4NDcxMTIzMTM1NTUzIEYzMDBcbkcxIFgxNDMuNzYxMDkxNzI3NjkwODUgWTE2MS40OTQ4NjY0NjIyMzc5MiBGMzAwXG5HMSBYMTQ0LjMxNzIyNzU5NDUyNTQzIFkxNTkuOTY0NTcyMjg4NjgxNyBGMzAwXG5HMSBYMTQ0LjMzNTQ1IFkxNTkuNjE0ODk5OTk5OTk5OTggRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU5MVxuRzAgWDE5MS41NTc4NSBZMTU5LjYxNDlcbkcxIFgxOTEuMTYzNzkxMjMxMzczMTIgWTE1OC4wMzUwODgyODc1MjY1NSBGMzAwXG5HMSBYMTkwLjA3Mzk0NjQ2MjI2OSBZMTU2LjgyNTQwODI3MjI5MjYzIEYzMDBcbkcxIFgxODguNTQzNjUyMjg4NzE4OTYgWTE1Ni4yNjkyNzI0MDU0NDEgRjMwMFxuRzEgWDE4OC4xOTQwMDk5OTk5OTk5NiBZMTU2LjI1MTA1IEYzMDBcbkcxIFgxODYuNjE0MTk0NzczMjQ4OTMgWTE1Ni42NDUwOTQ2NzkzNTE4NCBGMzAwXG5HMSBYMTg1LjQwNDUwNTAzODQ4MzU2IFkxNTcuNzM0OTI4NjYwMTA0NTQgRjMwMFxuRzEgWDE4NC44NDgzNTU1MjQwMDc3NiBZMTU5LjI2NTIxNzg3Mzc5ODU4IEYzMDBcbkcxIFgxODQuODMwMTMgWTE1OS42MTQ5IEYzMDBcbkcxIFgxODUuMjI0MTc5Mzc1NzYyNjUgWTE2MS4xOTQ3MTQwNTUzNDM1NSBGMzAwXG5HMSBYMTg2LjMxNDAxNjk1MjYyODU4IFkxNjIuNDA0NDAwNTUwMjg4IEYzMDBcbkcxIFgxODcuODQ0MzA3ODE5NjE1MjcgWTE2Mi45NjA1NDU1MTU1Nzc3NiBGMzAwXG5HMSBYMTg4LjE5NDAxIFkxNjIuOTc4NzY5OTk5OTk5OTcgRjMwMFxuRzEgWDE4OS43NzM4MjA1NDEwMTM2IFkxNjIuNTg0NzA2NTM0OTMwOSBGMzAwXG5HMSBYMTkwLjk4MzQ5NzMxNjM2NTY2IFkxNjEuNDk0ODU4MTY5NzEwMzcgRjMwMFxuRzEgWDE5MS41Mzk2Mjg2MzM5NzU5MiBZMTU5Ljk2NDU2MjM0Mjg5MzUyIEYzMDBcbkcxIFgxOTEuNTU3ODUgWTE1OS42MTQ5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOTJcbkcwIFgyNi4yNzk1OTcgWTEzNi4wMDM3MVxuRzEgWDI1Ljg4NTU0MjkyNzc3NTYyOCBZMTM0LjQyMzg5NzExNjA5MTQ3IEYzMDBcbkcxIFgyNC43OTU3MDE3NTQ3NjQ0MzcgWTEzMy4yMTQyMTM4NjEwMTYxNiBGMzAwXG5HMSBYMjMuMjY1NDA5MjM0NDc5NTAyIFkxMzIuNjU4MDczNDQ0OTcgRjMwMFxuRzEgWDIyLjkxNTczOSBZMTMyLjYzOTg1MDAwMDAwMDAyIEYzMDBcbkcxIFgyMS4zMzU5MjYxMTYwOTE0OCBZMTMzLjAzMzkwNDA3MjIyNDQzIEYzMDBcbkcxIFgyMC4xMjYyNDI4NjEwMTYyMSBZMTM0LjEyMzc0NTI0NTIzNTY1IEYzMDBcbkcxIFgxOS41NzAxMDI0NDQ5NzAxMDcgWTEzNS42NTQwMzc3NjU1MjA2MyBGMzAwXG5HMSBYMTkuNTUxODc5MDAwMDAwMDAzIFkxMzYuMDAzNzEgRjMwMFxuRzEgWDE5Ljk0NTkzMzA3MjIyNDQyNyBZMTM3LjU4MzUyMjg4MzkwODUzIEYzMDBcbkcxIFgyMS4wMzU3NzQyNDUyMzU2NiBZMTM4Ljc5MzIwNjEzODk4MzggRjMwMFxuRzEgWDIyLjU2NjA2Njc2NTUyMDYxMyBZMTM5LjM0OTM0NjU1NTAyOTkgRjMwMFxuRzEgWDIyLjkxNTczOSBZMTM5LjM2NzU3IEYzMDBcbkcxIFgyNC40OTU1NTE2NDk2MjEzNCBZMTM4Ljk3MzUxNDk4ODQ4OTY4IEYzMDBcbkcxIFgyNS43MDUyMzQyNTY3MjU2NTcgWTEzNy44ODM2NzMwOTYyNTUxNyBGMzAwXG5HMSBYMjYuMjYxMzczNzYyOTI4Mjc2IFkxMzYuMzUzMzgwMjQ1MzE0MyBGMzAwXG5HMSBYMjYuMjc5NTk3IFkxMzYuMDAzNzEgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU5M1xuRzAgWDczLjUwMTk0MiBZMTM2LjAwMzcxXG5HMSBYNzMuMTA3ODg3OTI3Nzc1NTYgWTEzNC40MjM4OTcxMTYwOTE1IEYzMDBcbkcxIFg3Mi4wMTgwNDY3NTQ3NjQzMyBZMTMzLjIxNDIxMzg2MTAxNjIyIEYzMDBcbkcxIFg3MC40ODc3NTQyMzQ0NzkzOCBZMTMyLjY1ODA3MzQ0NDk3MDEgRjMwMFxuRzEgWDcwLjEzODA4MiBZMTMyLjYzOTg1MDAwMDAwMDAyIEYzMDBcbkcxIFg2OC41NTgyNjkzNTAzNzg2NyBZMTMzLjAzMzkwNTAxMTUxMDM0IEYzMDBcbkcxIFg2Ny4zNDg1ODY3NDMyNzQzNCBZMTM0LjEyMzc0NjkwMzc0NDg2IEYzMDBcbkcxIFg2Ni43OTI0NDcyMzcwNzE3MyBZMTM1LjY1NDAzOTc1NDY4NTczIEYzMDBcbkcxIFg2Ni43NzQyMjQgWTEzNi4wMDM3MSBGMzAwXG5HMSBYNjcuMTY4Mjc4MDcyMjI0MzggWTEzNy41ODM1MjI4ODM5MDg1NiBGMzAwXG5HMSBYNjguMjU4MTE5MjQ1MjM1NTYgWTEzOC43OTMyMDYxMzg5ODM4NiBGMzAwXG5HMSBYNjkuNzg4NDExNzY1NTIwNSBZMTM5LjM0OTM0NjU1NTAzMDAyIEYzMDBcbkcxIFg3MC4xMzgwODIgWTEzOS4zNjc1NyBGMzAwXG5HMSBYNzEuNzE3ODk0ODgzOTA4NTEgWTEzOC45NzM1MTU5Mjc3NzU2IEYzMDBcbkcxIFg3Mi45Mjc1NzgxMzg5ODM3OSBZMTM3Ljg4MzY3NDc1NDc2NDM3IEYzMDBcbkcxIFg3My40ODM3MTg1NTUwMjk5IFkxMzYuMzUzMzgyMjM0NDc5NCBGMzAwXG5HMSBYNzMuNTAxOTQyIFkxMzYuMDAzNzEgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU5NFxuRzAgWDEyMC43MjQyNyBZMTM2LjAwMzcxXG5HMSBYMTIwLjMzMDIxNTkyNzc3NTU3IFkxMzQuNDIzODk3MTE2MDkxNSBGMzAwXG5HMSBYMTE5LjI0MDM3NDc1NDc2NDMzIFkxMzMuMjE0MjEzODYxMDE2MjIgRjMwMFxuRzEgWDExNy43MTAwODIyMzQ0NzkzOSBZMTMyLjY1ODA3MzQ0NDk3MDEgRjMwMFxuRzEgWDExNy4zNjA0MSBZMTMyLjYzOTg1MDAwMDAwMDAyIEYzMDBcbkcxIFgxMTUuNzgwNTk3MTE2MDkxNDkgWTEzMy4wMzM5MDQwNzIyMjQ0MyBGMzAwXG5HMSBYMTE0LjU3MDkxMzg2MTAxNjIxIFkxMzQuMTIzNzQ1MjQ1MjM1NjUgRjMwMFxuRzEgWDExNC4wMTQ3NzM0NDQ5NzAxIFkxMzUuNjU0MDM3NzY1NTIwNjMgRjMwMFxuRzEgWDExMy45OTY1NSBZMTM2LjAwMzcxIEYzMDBcbkcxIFgxMTQuMzkwNjA0MDcyMjI0NDMgWTEzNy41ODM1MjI4ODM5MDg1MyBGMzAwXG5HMSBYMTE1LjQ4MDQ0NTI0NTIzNTY2IFkxMzguNzkzMjA2MTM4OTgzOCBGMzAwXG5HMSBYMTE3LjAxMDczNzc2NTUyMDYyIFkxMzkuMzQ5MzQ2NTU1MDI5OSBGMzAwXG5HMSBYMTE3LjM2MDQxIFkxMzkuMzY3NTcgRjMwMFxuRzEgWDExOC45NDAyMjI4ODM5MDg1MiBZMTM4Ljk3MzUxNTkyNzc3NTYgRjMwMFxuRzEgWDEyMC4xNDk5MDYxMzg5ODM4IFkxMzcuODgzNjc0NzU0NzY0MzcgRjMwMFxuRzEgWDEyMC43MDYwNDY1NTUwMjk5IFkxMzYuMzUzMzgyMjM0NDc5NCBGMzAwXG5HMSBYMTIwLjcyNDI3IFkxMzYuMDAzNzEgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU5NVxuRzAgWDE2Ny45NDY2NyBZMTM2LjAwMzcxXG5HMSBYMTY3LjU1MjYxNTkyNzgwNTc2IFkxMzQuNDIzODk3MTE2MDgzOTYgRjMwMFxuRzEgWDE2Ni40NjI3NzQ3NTQ4MTc2MiBZMTMzLjIxNDIxMzg2MDk4Nzg4IEYzMDBcbkcxIFgxNjQuOTMyNDgyMjM0NTQzMjcgWTEzMi42NTgwNzM0NDQ5MTI2IEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDIgWTEzMi42Mzk4NTAwMDAwMDAwMiBGMzAwXG5HMSBYMTYzLjAwMjk3ODI4NzUzMjk1IFkxMzMuMDMzOTA4NzY4NjUyNTcgRjMwMFxuRzEgWDE2MS43OTMyOTgyNzIzMTY3NSBZMTM0LjEyMzc1MzUzNzc3NjM3IEYzMDBcbkcxIFgxNjEuMjM3MTYyNDA1NDkgWTEzNS42NTQwNDc3MTEzMzU0NCBGMzAwXG5HMSBYMTYxLjIxODk0IFkxMzYuMDAzNzEgRjMwMFxuRzEgWDE2MS42MTI5OTQwNzIyMTg1NiBZMTM3LjU4MzUyMjg4MzkxIEYzMDBcbkcxIFgxNjIuNzAyODM1MjQ1MjI1MyBZMTM4Ljc5MzIwNjEzODk4OTMyIEYzMDBcbkcxIFgxNjQuMjMzMTI3NzY1NTA4MiBZMTM5LjM0OTM0NjU1NTA0MTA4IEYzMDBcbkcxIFgxNjQuNTgyNzkwMDAwMDAwMDIgWTEzOS4zNjc1NyBGMzAwXG5HMSBYMTY2LjE2MjYwNTIyNjc0OTYzIFkxMzguOTczNTI1MzIwNjQyMyBGMzAwXG5HMSBYMTY3LjM3MjI5NDk2MTUxMDk2IFkxMzcuODgzNjkxMzM5ODg1MSBGMzAwXG5HMSBYMTY3LjkyODQ0NDQ3NTk4MTA4IFkxMzYuMzUzNDAyMTI2MTg5IEYzMDBcbkcxIFgxNjcuOTQ2NjcgWTEzNi4wMDM3MSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTk2XG5HMCBYNDkuODkwNzc1IFkxMTIuMzkyNTA5OTk5OTk5OTlcbkcxIFg0OS40OTY3MjA5Mjc3NzU2MyBZMTEwLjgxMjY5NzExNjA5MTQ0IEYzMDBcbkcxIFg0OC40MDY4Nzk3NTQ3NjQ0MyBZMTA5LjYwMzAxMzg2MTAxNjE0IEYzMDBcbkcxIFg0Ni44NzY1ODcyMzQ0Nzk1IFkxMDkuMDQ2ODczNDQ0OTY5OTkgRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMTA5LjAyODY1IEYzMDBcbkcxIFg0NC45NDcxMDQxMTYwOTE0OCBZMTA5LjQyMjcwNDA3MjIyNDQyIEYzMDBcbkcxIFg0My43Mzc0MjA4NjEwMTYyMDQgWTExMC41MTI1NDUyNDUyMzU2NCBGMzAwXG5HMSBYNDMuMTgxMjgwNDQ0OTcwMSBZMTEyLjA0MjgzNzc2NTUyMDYgRjMwMFxuRzEgWDQzLjE2MzA1Njk5OTk5OTk5NSBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDBcbkcxIFg0My41NTcxMTEwNzIyMjQ0MiBZMTEzLjk3MjMyMjg4MzkwODUgRjMwMFxuRzEgWDQ0LjY0Njk1MjI0NTIzNTY1IFkxMTUuMTgyMDA2MTM4OTgzNzcgRjMwMFxuRzEgWDQ2LjE3NzI0NDc2NTUyMDYxIFkxMTUuNzM4MTQ2NTU1MDI5ODcgRjMwMFxuRzEgWDQ2LjUyNjkxNyBZMTE1Ljc1NjM2OTk5OTk5OTk4IEYzMDBcbkcxIFg0OC4xMDY3Mjk2NDk2MjEzMzYgWTExNS4zNjIzMTQ5ODg0ODk2NiBGMzAwXG5HMSBYNDkuMzE2NDEyMjU2NzI1NjU2IFkxMTQuMjcyNDczMDk2MjU1MTQgRjMwMFxuRzEgWDQ5Ljg3MjU1MTc2MjkyODI3IFkxMTIuNzQyMTgwMjQ1MzE0MjcgRjMwMFxuRzEgWDQ5Ljg5MDc3NSBZMTEyLjM5MjUwOTk5OTk5OTk5IEYzMDA7c3ZnI3N2ZzEgPiBnI2xheWVyMSA+IHBhdGgjY2lyY2xlOTdcbkcwIFg5Ny4xMTMxMDUgWTExMi4zOTI1MDk5OTk5OTk5OVxuRzEgWDk2LjcxOTA1MDkyNzc3NzQyIFkxMTAuODEyNjk3MTE2MDkxMDIgRjMwMFxuRzEgWDk1LjYyOTIwOTc1NDc2NzYgWTEwOS42MDMwMTM4NjEwMTQ0NyBGMzAwXG5HMSBYOTQuMDk4OTE3MjM0NDgzMyBZMTA5LjA0Njg3MzQ0NDk2NjYgRjMwMFxuRzEgWDkzLjc0OTI1MSBZMTA5LjAyODY1IEYzMDBcbkcxIFg5Mi4xNjk0MzcxNzg5NDgzNiBZMTA5LjQyMjcwMDMxNTA3OTQxIEYzMDBcbkcxIFg5MC45NTk3NTEzMzE5OTM1MyBZMTEwLjUxMjUzODYxMTE5MzY1IEYzMDBcbkcxIFg5MC40MDM2MDcyNzY1NzU0NiBZMTEyLjA0MjgyOTgwODg0OTU2IEYzMDBcbkcxIFg5MC4zODUzODMgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwXG5HMSBYOTAuNzc5NDM3MDcyMjE5MDcgWTExMy45NzIzMjI4ODM5MDk4NCBGMzAwXG5HMSBYOTEuODY5Mjc4MjQ1MjI2MiBZMTE1LjE4MjAwNjEzODk4ODgxIEYzMDBcbkcxIFg5My4zOTk1NzA3NjU1MDkyNyBZMTE1LjczODE0NjU1NTA0MDA5IEYzMDBcbkcxIFg5My43NDkyNTEgWTExNS43NTYzNjk5OTk5OTk5OCBGMzAwXG5HMSBYOTUuMzI5MDYzMTgxMDQ1MyBZMTE1LjM2MjMxMzEwOTkxODI2IEYzMDBcbkcxIFg5Ni41Mzg3NDQ0OTIyMDY0MiBZMTE0LjI3MjQ2OTc3OTIzODM0IEYzMDBcbkcxIFg5Ny4wOTQ4ODIxNzg3MjE0OSBZMTEyLjc0MjE3NjI2Njk4NzI3IEYzMDBcbkcxIFg5Ny4xMTMxMDUgWTExMi4zOTI1MDk5OTk5OTk5OSBGMzAwO3N2ZyNzdmcxID4gZyNsYXllcjEgPiBwYXRoI2NpcmNsZTk4XG5HMCBYMTQ0LjMzNTQ1IFkxMTIuMzkyNTA5OTk5OTk5OTlcbkcxIFgxNDMuOTQxMzk1OTI3NzgxNDYgWTExMC44MTI2OTcxMTYwOSBGMzAwXG5HMSBYMTQyLjg1MTU1NDc1NDc3NDcyIFkxMDkuNjAzMDEzODYxMDEwNjggRjMwMFxuRzEgWDE0MS4zMjEyNjIyMzQ0OTE4MyBZMTA5LjA0Njg3MzQ0NDk1ODkgRjMwMFxuRzEgWDE0MC45NzE2IFkxMDkuMDI4NjUgRjMwMFxuRzEgWDEzOS4zOTE3ODU5NDQ2NjM5OCBZMTA5LjQyMjY5OTM3NTc5MjggRjMwMFxuRzEgWDEzOC4xODIwOTk0NDk3NDAzMiBZMTEwLjUxMjUzNjk1MjY4MTgzIEYzMDBcbkcxIFgxMzcuNjI1OTU0NDg0NDc5NzYgWTExMi4wNDI4Mjc4MTk2NzkxMiBGMzAwXG5HMSBYMTM3LjYwNzczMDAwMDAwMDAzIFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMFxuRzEgWDEzOC4wMDE3ODQwNzIyMTYzNCBZMTEzLjk3MjMyMjg4MzkxMDU0IEYzMDBcbkcxIFgxMzkuMDkxNjI1MjQ1MjIxNCBZMTE1LjE4MjAwNjEzODk5MTM4IEYzMDBcbkcxIFgxNDAuNjIxOTE3NzY1NTAzNSBZMTE1LjczODE0NjU1NTA0NTMzIEYzMDBcbkcxIFgxNDAuOTcxNjAwMDAwMDAwMDIgWTExNS43NTYzNjk5OTk5OTk5OCBGMzAwXG5HMSBYMTQyLjU1MTQxMTcxMjQ2NzA2IFkxMTUuMzYyMzExMjMxMzQ3NDMgRjMwMFxuRzEgWDE0My43NjEwOTE3Mjc2ODMyNyBZMTE0LjI3MjQ2NjQ2MjIyMzYzIEYzMDBcbkcxIFgxNDQuMzE3MjI3NTk0NTEgWTExMi43NDIxNzIyODg2NjQ1NSBGMzAwXG5HMSBYMTQ0LjMzNTQ1IFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMDtzdmcjc3ZnMSA+IGcjbGF5ZXIxID4gcGF0aCNjaXJjbGU5OVxuRzAgWDE5MS41NTc4NSBZMTEyLjM5MjUwOTk5OTk5OTk5XG5HMSBYMTkxLjE2Mzc5NTkyNzgwMTIzIFkxMTAuODEyNjk3MTE2MDg1MDYgRjMwMFxuRzEgWDE5MC4wNzM5NTQ3NTQ4MDk2OCBZMTA5LjYwMzAxMzg2MDk5MjA2IEYzMDBcbkcxIFgxODguNTQzNjYyMjM0NTMzNzcgWTEwOS4wNDY4NzM0NDQ5MjEwOSBGMzAwXG5HMSBYMTg4LjE5NDAwOTk5OTk5OTk2IFkxMDkuMDI4NjUgRjMwMFxuRzEgWDE4Ni42MTQxOTQ3NzMyNTAzOCBZMTA5LjQyMjY5NDY3OTM1NzcgRjMwMFxuRzEgWDE4NS40MDQ1MDUwMzg0ODkwNSBZMTEwLjUxMjUyODY2MDExNDkgRjMwMFxuRzEgWDE4NC44NDgzNTU1MjQwMTg5MyBZMTEyLjA0MjgxNzg3MzgxMSBGMzAwXG5HMSBYMTg0LjgzMDEzIFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMFxuRzEgWDE4NS4yMjQxODQwNzIxOTQyNSBZMTEzLjk3MjMyMjg4MzkxNjA0IEYzMDBcbkcxIFgxODYuMzE0MDI1MjQ1MTgyNCBZMTE1LjE4MjAwNjEzOTAxMjEgRjMwMFxuRzEgWDE4Ny44NDQzMTc3NjU0NTY3NCBZMTE1LjczODE0NjU1NTA4NzQxIEYzMDBcbkcxIFgxODguMTk0MDEgWTExNS43NTYzNjk5OTk5OTk5OCBGMzAwXG5HMSBYMTg5Ljc3MzgyMDU0MTAxMTU2IFkxMTUuMzYyMzA2NTM0OTIyNzggRjMwMFxuRzEgWDE5MC45ODM0OTczMTYzNTgwNCBZMTE0LjI3MjQ1ODE2OTY5NjA0IEYzMDBcbkcxIFgxOTEuNTM5NjI4NjMzOTYwNDYgWTExMi43NDIxNjIzNDI4NzYzNCBGMzAwXG5HMSBYMTkxLjU1Nzg0OTk5OTk5OTk3IFkxMTIuMzkyNTA5OTk5OTk5OTkgRjMwMFxuTTJcbmBcblxudmFyIGV4YW1wbGVzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ3N0YXInLFxuICAgICAgICBnY29kZTogU1RBUixcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NpcmNsZXMnLFxuICAgICAgICBnY29kZTogQ0lSQ0xFUyxcbiAgICB9LFxuXVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldikgPT4ge1xuICAgIHZhciBzcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4YW1wbGVzLWhvbGRlcicpXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZVxuICAgIGV4YW1wbGVzLmZvckVhY2goKGV4YW1wbGUpID0+IHtcbiAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcblxuICAgICAgICBhLmlubmVyVGV4dCA9IGV4YW1wbGUubmFtZVxuICAgICAgICBhLmhyZWYgPSBcIiNcIlxuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2NvZGUnKS52YWx1ZSA9IGV4YW1wbGUuZ2NvZGVcbiAgICAgICAgfSlcbiAgICAgICAgY29uc29sZS5sb2coZXhhbXBsZS5uYW1lLCBhKVxuICAgICAgICBpZiAoIWZpcnN0KSB7XG4gICAgICAgICAgICBzcGFuLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgfCAnKSlcbiAgICAgICAgfVxuICAgICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICAgIHNwYW4uYXBwZW5kQ2hpbGQoYSlcbiAgICB9KVxufSkiLCJpbXBvcnQgSW50ZXJwcmV0ZXIgZnJvbSAnZ2NvZGUtaW50ZXJwcmV0ZXInXHJcblxyXG5jbGFzcyBQbG90dGVyIHtcclxuICAgIC8qKiBAdHlwZXtIVE1MQ2FudmFzRWxlbWVudH0gKi9cclxuICAgIGNhbnZhcztcclxuICAgIC8qKiBAdHlwZXtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9ICovXHJcbiAgICBjdHg7XHJcblxyXG4gICAgeDtcclxuICAgIHk7XHJcblxyXG4gICAgdXZlbCA9IDA7XHJcbiAgICB2dmVsID0gMDtcclxuXHJcbiAgICBtYWNoaW5lV2lkdGggPSAxMDA7XHJcbiAgICB1ID0gNzU7XHJcbiAgICB2ID0gNzU7XHJcblxyXG4gICAgeG9mZnNldCA9IDA7XHJcbiAgICB5b2Zmc2V0ID0gMDtcclxuXHJcbiAgICBwZW5Eb3duID0gdHJ1ZTtcclxuICAgIHBlbkNvbG9yID0gJyMwMDAwMDAnO1xyXG5cclxuICAgIGNvbW1hbmRRdWV1ZSA9IFtdO1xyXG5cclxuICAgIHJ1bm5pbmcgPSBmYWxzZTtcclxuXHJcbiAgICBwcGkgPSAxO1xyXG4gICAgZmVlZFJhdGVTY2FsZSA9IDEuMDtcclxuXHJcbiAgICAvLyBtYXggbXMgYmV0d2VlbiB1cGRhdGVzXHJcbiAgICBtYXhQcm9jZXNzRGVsdGEgPSA3NTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNJZCwgbWFjaGluZVdpZHRoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZClcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHJcbiAgICAgICAgdGhpcy5wbG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5wbG90LndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgdGhpcy5wbG90LmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuICAgICAgICB0aGlzLnBsb3RDdHggPSB0aGlzLnBsb3QuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYWNoaW5lV2lkdGggPSBtYWNoaW5lV2lkdGg7XHJcbiAgICAgICAgdGhpcy5waHlzZHQgPSAxMDAwLjAgLyAyNDAuMDtcclxuICAgICAgICB0aGlzLmxhc3RUID0gcGVyZm9ybWFuY2Uubm93KClcclxuXHJcbiAgICAgICAgdGhpcy5yZXNldCgpXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5wbG90LCAwLCAwKTtcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbygwLDApO1xyXG4gICAgICAgIGN0eC5saW5lVG8odGhpcy54LHRoaXMueSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh0aGlzLm1hY2hpbmVXaWR0aCwgMCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICBjdHguZmlsbFJlY3QodGhpcy54LTIsIHRoaXMueS0yLCA0LCA0KTtcclxuXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiKHUsIHYpID0gKFwiICsgTWF0aC5yb3VuZCh0aGlzLnUpICsgXCIsIFwiICsgTWF0aC5yb3VuZCh0aGlzLnYpICsgXCIpXCIsIDE3MCwgMjApXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwiKHgsIHkpID0gKFwiICsgTWF0aC5yb3VuZCh0aGlzLngpICsgXCIsIFwiICsgTWF0aC5yb3VuZCh0aGlzLnkpICsgXCIpXCIsIDE3MCwgNDApXHJcbiAgICB9XHJcblxyXG4gICAgcHJvY2Vzcyh0KSB7XHJcbiAgICAgICAgdmFyIGR0ID0gdCAtIHRoaXMubGFzdFQ7XHJcblxyXG4gICAgICAgIGlmIChkdCA+IHRoaXMubWF4UHJvY2Vzc0RlbHRhKSB7XHJcbiAgICAgICAgICAgIC8vIEFzc3VtZSB0aGUgcGFnZSB3YXMgb2ZmLXNjcmVlbi5cclxuICAgICAgICAgICAgLy8gU2tpcCBhbmQgc3RhcnQgYWdhaW4gb24gbmV4dCBmcmFtZS5cclxuICAgICAgICAgICAgdGhpcy5sYXN0VCA9IHQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbG90Q3R4LnN0cm9rZVN0eWxlID0gdGhpcy5wZW5Db2xvclxyXG4gICAgICAgIHRoaXMucGxvdEN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLnBsb3RDdHgubW92ZVRvKHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICB3aGlsZSAoZHQgPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBzdGVwID0gTWF0aC5taW4oZHQsIHRoaXMucGh5c2R0KTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUGh5c2ljcyhzdGVwKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ29tbWFuZCh0KTtcclxuICAgICAgICAgICAgZHQgLT0gc3RlcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbG90Q3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0VCA9IHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgICAgICAgIHhcclxuICAgICAgICArLS0tLXwtLS0tLS0tLS0rXHJcbiAgICAgICAgfFxcICAgICAgICAgICBfL1xyXG4gICAgICAgIHwgXFwgdSAgICAgIF8vXHJcbiAgICAgIHkgfCAgXFwgICAgIF8vICAgdlxyXG4gICAgICAgIHwgICBcXCAgXy9cclxuICAgICAgICB8ICAgIFxcL1xyXG4gICAgICAgICBcclxuICAgICAgICB1XjIgPSB4XjIgKyB5XjJcclxuICAgICAgICB2XjIgPSAoVyAtIHgpXjIgKyB5XjIgPSB4XjIgKyB5XjIgKyBXXjIgLSAyV3hcclxuXHJcbiAgICAgICAgdl4yIC0gdV4yID0gV14yIC0gMld4XHJcbiAgICAgICAgeCA9IChXXjIgLSB2XjIgKyB1XjIpLzJXXHJcbiAgICAgICAgeSA9IHNxcnQodV4yIC0geF4yKVxyXG4gICAgICAgICovXHJcbiAgICB1djJ4eSh1LCB2KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1hY2hpbmVXaWR0aDtcclxuICAgICAgICB2YXIgeCA9IChtKm0gKyB1KnUgLSB2KnYpIC8gKDIqbSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogTWF0aC5zcXJ0KHUqdSAtIHgqeCksXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHh5MnV2KHgseSkge1xyXG4gICAgICAgIHZhciBtID0gdGhpcy5tYWNoaW5lV2lkdGg7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdTogTWF0aC5zcXJ0KHgqeCArIHkqeSksXHJcbiAgICAgICAgICAgIHY6IE1hdGguc3FydCgobS14KSoobS14KSArIHkqeSksXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm9jZXNzUGh5c2ljcyhkdCkge1xyXG4gICAgICAgIHRoaXMudSArPSB0aGlzLnV2ZWwgKiBkdDtcclxuICAgICAgICB0aGlzLnYgKz0gdGhpcy52dmVsICogZHQ7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IENoZWNrIGNvbnN0cmFpbnRzIGZvciBwaHlzaWNhbGl0eS5cclxuXHJcbiAgICAgICAgdGhpcy54ID0gKHRoaXMubWFjaGluZVdpZHRoICogdGhpcy5tYWNoaW5lV2lkdGggKyB0aGlzLnUqdGhpcy51IC0gdGhpcy52KnRoaXMudikgLyAoMiAqIHRoaXMubWFjaGluZVdpZHRoKTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLnNxcnQodGhpcy51ICogdGhpcy51IC0gdGhpcy54ICogdGhpcy54KVxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5tYWNoaW5lV2lkdGgsIHRoaXMueCwgdGhpcy55KVxyXG4gICAgICAgIGlmICh0aGlzLnBlbkRvd24pIHtcclxuICAgICAgICAgICAgdGhpcy5wbG90Q3R4LmxpbmVUbyh0aGlzLngsIHRoaXMueSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBsb3RDdHgubW92ZVRvKHRoaXMueCwgdGhpcy55KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm9jZXNzQ29tbWFuZCh0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZFF1ZXVlLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNtZCA9IHRoaXMuY29tbWFuZFF1ZXVlLnNoaWZ0KClcclxuICAgICAgICB2YXIgY21kcyA9IGNtZC5wcm9jZXNzKHRoaXMsIHQpO1xyXG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlID0gY21kcy5jb25jYXQodGhpcy5jb21tYW5kUXVldWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIGZyYW1lKHQpIHtcclxuICAgICAgICAgICAgc2VsZi5wcm9jZXNzKHQpXHJcbiAgICAgICAgICAgIGlmIChzZWxmLnJ1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbnF1ZXVlQ29tbWFuZChjbWQpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZS5wdXNoKGNtZClcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmRRdWV1ZSA9IFtdXHJcbiAgICAgICAgdGhpcy51ID0gdGhpcy52ID0gdGhpcy5tYWNoaW5lV2lkdGggLyAyLjAgKyAxMDtcclxuICAgICAgICB0aGlzLnV2ZWwgPSB0aGlzLnZ2ZWwgPSAwO1xyXG4gICAgICAgIHRoaXMucGVuRG93biA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGxvdEN0eC5maWxsU3R5bGUgPSAnI2ZmZidcclxuICAgICAgICB0aGlzLnBsb3RDdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5wbG90LndpZHRoLCB0aGlzLnBsb3QuaGVpZ2h0KVxyXG4gICAgfVxyXG5cclxuICAgIGRvd25sb2FkKCkge1xyXG4gICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcbiAgICAgICAgYS5ocmVmID0gdGhpcy5wbG90LnRvRGF0YVVSTCgpXHJcbiAgICAgICAgYS5kb3dubG9hZCA9ICdwbG90LnBuZydcclxuICAgICAgICBhLmNsaWNrKClcclxuICAgIH1cclxufVxyXG5cclxuLy8gTW92ZSBmcm9tIGN1cnJlbnQgcG9zaXRpb24gdG8gcHJvdmlkZWQgcG9sYXIgY29vcmRpbmF0ZXMgb3ZlciBzb21lIGR1cmF0aW9uLlxyXG4vLyBDb250cm9scyB0aGUgcGxvdHRlcnMgJ21vdG9ycycgKHV2ZWwsIHZ2ZWwpIGFuZCB3YWl0cyBmb3IgdGhlIGR1cmF0aW9uLlxyXG5jbGFzcyBNb3ZlQ29tbWFuZCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1LCB2LCBkdXJhdGlvbikge1xyXG4gICAgICAgIHRoaXMudSA9IHVcclxuICAgICAgICB0aGlzLnYgPSB2XHJcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uXHJcbiAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICAvLyBQcm9jZXNzIGhhbmRsZXMgdGhlIGNvbW1hbmQgYW5kIHJldHVybnMgYSBsaXN0IG9mIGNvbW1hbmRzIHRoYXQgcmVwbGFjZSBpdC5cclxuICAgIHByb2Nlc3MocGxvdHRlciwgdCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVhZGxpbmUgPSB0ICsgdGhpcy5kdXJhdGlvblxyXG4gICAgICAgICAgICBwbG90dGVyLnV2ZWwgPSAodGhpcy51IC0gcGxvdHRlci51KSAvIHRoaXMuZHVyYXRpb25cclxuICAgICAgICAgICAgcGxvdHRlci52dmVsID0gKHRoaXMudiAtIHBsb3R0ZXIudikgLyB0aGlzLmR1cmF0aW9uXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWVcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodCA+PSB0aGlzLmRlYWRsaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBwbG90dGVyLnV2ZWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgcGxvdHRlci52dmVsID0gMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEFkanVzdCBmb3IgZHJpZnRcclxuICAgICAgICAgICAgICAgIHBsb3R0ZXIudXZlbCA9ICh0aGlzLnUgLSBwbG90dGVyLnUpIC8gKHRoaXMuZGVhZGxpbmUgLSB0KVxyXG4gICAgICAgICAgICAgICAgcGxvdHRlci52dmVsID0gKHRoaXMudiAtIHBsb3R0ZXIudikgLyAodGhpcy5kZWFkbGluZSAtIHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzXTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gTWF4aW11bSBkaXN0YW5jZSB0byBtb3ZlIGluIG9uZSBhcmNcclxudmFyIG1heE1vdmUgPSA1O1xyXG5cclxuLy8gTW92ZSBmcm9tIGN1cnJlbnQgcG9zaXRpb24gdG8gcHJvdmlkZWQgY2FydGVzaWFuIHBvc2l0aW9uIGF0IHNvbWUgc3BlZWQuXHJcbi8vIFRoaXMgc2ltcGx5IHJlcGxhY2VzIGl0c2VsZiBieSBhIHNlcmllcyBvZiBwb2xhciBtb3ZlcyBzbWFsbCBlbm91Z2ggdG8gaGF2ZSBuZWdsaWdpYmxlIGFyY3MuXHJcbi8vIFNlZSBDTW92ZUNvbW1hbmQgaW5zdGVhZC5cclxuY2xhc3MgQ01vdmVDb21tYW5kUGllY2VXaXNlIHtcclxuICAgIGRlZmF1bHRTcGVlZCA9IDAuMiAvLyBwaXhlbHMgcGVyIG1zXHJcblxyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgc3BlZWQpIHtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZCB8fCB0aGlzLmRlZmF1bHRTcGVlZFxyXG4gICAgfVxyXG5cclxuICAgIHByb2Nlc3MocGxvdHRlciwgdCkge1xyXG4gICAgICAgIHZhciBkeCA9IHRoaXMueCAtIHBsb3R0ZXIueDtcclxuICAgICAgICB2YXIgZHkgPSB0aGlzLnkgLSBwbG90dGVyLnk7XHJcblxyXG4gICAgICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KGR4KmR4K2R5KmR5KVxyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGRpc3QgLyB0aGlzLnNwZWVkXHJcbiAgICAgICAgdmFyIGRlbHRhID0gTWF0aC5zcXJ0KGR4KmR4K2R5KmR5KTtcclxuICAgICAgICB2YXIgc3RlcHMgPSBNYXRoLmNlaWwoZGVsdGEgLyBtYXhNb3ZlKTtcclxuICAgICAgICB2YXIgY21kcyA9IFtdXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gc3RlcHM7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBsb3R0ZXIueCArIGkgKiBkeCAvIHN0ZXBzXHJcbiAgICAgICAgICAgIHZhciB5ID0gcGxvdHRlci55ICsgaSAqIGR5IC8gc3RlcHNcclxuICAgICAgICAgICAgdmFyIHV2ID0gcGxvdHRlci54eTJ1dih4LCB5KTtcclxuICAgICAgICAgICAgY21kcy5wdXNoKG5ldyBNb3ZlQ29tbWFuZCh1di51LCB1di52LCBkdXJhdGlvbiAvIHN0ZXBzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjbWRzO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBBIGNhcnRlc2lhbiBtb3ZlIGNvbW1hbmQuXHJcbi8vIENhbGN1bGF0ZXMgY2FydGVzaWFuIHZlbG9jaXR5IGFuZCB0cmFuc2Zvcm1zIHRvICdwb2xhcicgY29vcmRzLlxyXG5jbGFzcyBDTW92ZUNvbW1hbmQge1xyXG4gICAgZGVmYXVsdFNwZWVkID0gMC4yXHJcblxyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgc3BlZWQsIGFic29sdXRlKSB7XHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQgfHwgdGhpcy5kZWZhdWx0U3BlZWRcclxuICAgICAgICB0aGlzLmFic29sdXRlID0gYWJzb2x1dGVcclxuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHByb2Nlc3MocGxvdHRlciwgdCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XHJcbiAgICAgICAgICAgIC8vIENvbnZlcnQgdG8gYWJzb2x1dGUgY29vcmRzIGFuZCBoYW5kbGUgc2NhbGluZy5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYWJzb2x1dGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsb3R0ZXIueG9mZnNldCwgdGhpcy54LCBwbG90dGVyLnBwaSlcclxuICAgICAgICAgICAgICAgIHRoaXMueCA9ICh0aGlzLnggKiBwbG90dGVyLnBwaSArIHBsb3R0ZXIueG9mZnNldCkgfHwgcGxvdHRlci54XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSAodGhpcy55ICogcGxvdHRlci5wcGkgKyBwbG90dGVyLnlvZmZzZXQpIHx8IHBsb3R0ZXIueVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy54LCBwbG90dGVyLnhvZmZzZXQsIHRoaXMueCArIHBsb3R0ZXIueG9mZnNldCxcclxuICAgICAgICAgICAgICAgICAgICAgKHRoaXMueCAqIHBsb3R0ZXIucHBpICsgcGxvdHRlci54b2Zmc2V0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICh0aGlzLnggKiBwbG90dGVyLnBwaSArIHBsb3R0ZXIueG9mZnNldCkgfHwgcGxvdHRlci54KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gcGxvdHRlci54ICsgKCh0aGlzLnggKiBwbG90dGVyLnBwaSkgfHwgMClcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IHBsb3R0ZXIueSArICgodGhpcy55ICogcGxvdHRlci5wcGkpIHx8IDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkeCA9IHRoaXMueCAtIHBsb3R0ZXIueFxyXG4gICAgICAgIHZhciBkeSA9IHRoaXMueSAtIHBsb3R0ZXIueVxyXG4gICAgICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5kZWFkbGluZSA9IHQgKyAoZGlzdCAvIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0ID49IHRoaXMuZGVhZGxpbmUpIHtcclxuICAgICAgICAgICAgcGxvdHRlci51dmVsID0gMFxyXG4gICAgICAgICAgICBwbG90dGVyLnZ2ZWwgPSAwXHJcbiAgICAgICAgICAgIC8vIHZhciBlcnJ4ID0gIHBsb3R0ZXIueCAtIHRoaXMueFxyXG4gICAgICAgICAgICAvLyB2YXIgZXJyeSA9IHBsb3R0ZXIueSAtIHRoaXMueSBcclxuICAgICAgICAgICAgLy8gdmFyIGVyciA9IE1hdGguc3FydChlcnJ4KmVycnggKyBlcnJ5KmVycnkpXHJcbiAgICAgICAgICAgIHJldHVybiBbXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgQ29vcmQgdHJhbnNmb3JtIChKYWNvYmlhbiBtYXRyaXgpOlxyXG5cclxuICAgICAgICAgICAgdV4yID0geF4yICsgeV4yXHJcbiAgICAgICAgICAgIHZeMiA9IChXIC0geCleMiArIHleMiA9IHheMiArIHleMiArIFdeMiAtIDJXeFxyXG5cclxuICAgICAgICAgICAgMiB1IGR1ID0gMnggZHggKyAyIHkgZHlcclxuICAgICAgICAgICAgZHUgPSAoeC91KWR4ICsgKHkvdSlkeVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgMiB2IGR2ID0gMih4LVcpIGR4ICsgMnkgZHlcclxuICAgICAgICAgICAgZHYgPSAoKHgtVykvdilkeCArICh5L3YpZHlcclxuICAgICAgICAqL1xyXG4gICAgICAgIHZhciBkdSA9IGR4ICogcGxvdHRlci54IC8gcGxvdHRlci51ICsgZHkgKiBwbG90dGVyLnkgLyBwbG90dGVyLnVcclxuICAgICAgICB2YXIgZHYgPSBkeCAqIChwbG90dGVyLnggLSBwbG90dGVyLm1hY2hpbmVXaWR0aCkvcGxvdHRlci52ICsgZHkgKiBwbG90dGVyLnkgLyBwbG90dGVyLnZcclxuICAgICAgICBcclxuICAgICAgICBwbG90dGVyLnV2ZWwgPSB0aGlzLnNwZWVkICogZHUgLyBkaXN0XHJcbiAgICAgICAgcGxvdHRlci52dmVsID0gdGhpcy5zcGVlZCAqIGR2IC8gZGlzdFxyXG4gICAgICAgIHJldHVybiBbdGhpc11cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUGVuQ29tbWFuZCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwZW5Eb3duKSB7XHJcbiAgICAgICAgdGhpcy5wZW5Eb3duID0gcGVuRG93blxyXG4gICAgfVxyXG5cclxuICAgIHByb2Nlc3MocGxvdHRlciwgdCkge1xyXG4gICAgICAgIHBsb3R0ZXIucGVuRG93biA9IHRoaXMucGVuRG93blxyXG4gICAgICAgIHJldHVybiBbXVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlSW50ZXJwcmV0ZXIocGxvdHRlcikge1xyXG4gICAgdmFyIGFic29sdXRlID0gdHJ1ZVxyXG5cclxuICAgIGNvbnN0IGhhbmRsZXJzID0ge1xyXG4gICAgICAgICdHMCc6IChwYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgcGxvdHRlci5lbnF1ZXVlQ29tbWFuZChuZXcgUGVuQ29tbWFuZChmYWxzZSkpXHJcbiAgICAgICAgICAgIHBsb3R0ZXIuZW5xdWV1ZUNvbW1hbmQobmV3IENNb3ZlQ29tbWFuZChwYXJhbXMuWCwgcGFyYW1zLlksIDAsIGFic29sdXRlKSlcclxuICAgICAgICB9LFxyXG4gICAgICAgICdHMSc6IChwYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgcGxvdHRlci5lbnF1ZXVlQ29tbWFuZChuZXcgUGVuQ29tbWFuZCh0cnVlKSlcclxuICAgICAgICAgICAgcGxvdHRlci5lbnF1ZXVlQ29tbWFuZChuZXcgQ01vdmVDb21tYW5kKHBhcmFtcy5YLCBwYXJhbXMuWSwgcGFyYW1zLkYvNjAwMDAuMCpwbG90dGVyLmZlZWRSYXRlU2NhbGUsIGFic29sdXRlKSlcclxuICAgICAgICB9LFxyXG4gICAgICAgICdHOTAnOiAocGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIGFic29sdXRlID0gdHJ1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgICdHOTEnOiAocGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIGFic29sdXRlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIGdpID0gbmV3IEludGVycHJldGVyKHtcclxuICAgICAgICBoYW5kbGVyczogaGFuZGxlcnMsXHJcbiAgICAgICAgZGVmYXVsdEhhbmRsZXI6IChjbWQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuaGFuZGxlZCBjb21tYW5kXCIsIGNtZCwgcGFyYW1zKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gZ2k7XHJcbn1cclxuXHJcbi8vIE1haW4gZW50cnkgcG9pbnQuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcCA9IG5ldyBQbG90dGVyKCdjYW52YXMnLCA0MDApO1xyXG4gICAgdmFyIGludGVycCA9IG1ha2VJbnRlcnByZXRlcihwKVxyXG4gICAgcC5ydW4oKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0LWdjb2RlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHtcclxuICAgICAgICB2YXIgZ2NvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2NvZGUnKS52YWx1ZVxyXG5cclxuICAgICAgICBwbG90dGVyLmZlZWRSYXRlU2NhbGUgPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmZWVkLXJhdGUtc2NhbGUnKS52YWx1ZSkgfHwgMjBcclxuICAgICAgICBwbG90dGVyLnBwaSA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BpeGVscy1wZXItaW5jaCcpLnZhbHVlKSB8fCAxXHJcbiAgICAgICAgcGxvdHRlci5wZW5Db2xvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZW4tY29sb3InKS52YWx1ZSB8fCAnIzAwMDAwMCc7XHJcbiAgICAgICAgcGxvdHRlci54b2Zmc2V0ID0gcGFyc2VGbG9hdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneC1vZmZzZXQnKS52YWx1ZSkgfHwgMFxyXG4gICAgICAgIHBsb3R0ZXIueW9mZnNldCA9IHBhcnNlRmxvYXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ktb2Zmc2V0JykudmFsdWUpIHx8IDBcclxuICAgICAgICBcclxuICAgICAgICBpbnRlcnAubG9hZEZyb21TdHJpbmcoZ2NvZGUsIChlcnIsIHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdlbmQnLCAocmVzdWx0cykgPT4ge1xyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xyXG4gICAgICAgIHAucmVzZXQoKVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG93bmxvYWQtbGluaycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7XHJcbiAgICAgICAgcC5kb3dubG9hZCgpO1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBmb3IgZGVidWdnaW5nIC8gaW50ZXJhY3Rpdml0eVxyXG4gICAgd2luZG93LnBsb3R0ZXIgPSBwXHJcbn0pIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHByb2Nlc3MgZnJvbSAncHJvY2Vzcy9icm93c2VyJ1xud2luZG93LnByb2Nlc3MgPSBwcm9jZXNzXG5cbmltcG9ydCBidWZmZXIgZnJvbSAnYnVmZmVyJ1xud2luZG93LkJ1ZmZlciA9IGJ1ZmZlci5CdWZmZXJcblxuaW1wb3J0ICcuL3BvbGFyLmpzJ1xuaW1wb3J0ICcuL2V4YW1wbGVzLmpzJyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
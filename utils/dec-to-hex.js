'use strict'

exports.decToHex = (number) => {
    let hexString = number.toString(16)
    return '0x' + hexString
}
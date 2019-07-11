# ARCHIVING FOR NOW DUE TO ARKPAY RELEASE.

<img src="https://i.imgur.com/0ZlJHfL.png" width="100%">

# ARK QR Code React Component

> This is an unofficial spin-off of [the official Ark web component to generate QR codes for ARK payments](https://github.com/ArkEcosystem/ark-qrcode).

I wanted to be able to create Ark QR codes inside of my React app, which doesn't use TypeScript or Stencil.

## Install

### Node Modules
- Run `npm install ark-qrcode-react --save`
- Import the component `import ArkQrCode from 'ark-qrcode-react';`

## Usage

Insert the element in your code and enter your custom properties:

```html
<ArkQrCode
  address="AG2QPHeZhbaYvEhB2Sbng7HNDX2Sai1on1"
  amount={1}
  label="ArkMoon%20Donations"
  showLogo={true}
  size={200}
  vendorField="QR%20Code%20donation" />
```

Generates this QR code:

<img src="https://i.imgur.com/vlAsocL.png" width="15%">

## Properties

This package complies with the specifications described in [AIP-13](https://github.com/ArkEcosystem/AIPs/blob/master/AIPS/aip-13.md).

| Attribute | Description | Type | Required |
| --- | --- | --- | --- |
| address | Ark recipient address encoded in Base58. | String | Yes |
| amount | Amount in ARK (Ѧ) or DARK (DѦ). | Number | No |
| label | Recipient label string. | String | No |
| size | Size of the QR code (pixels) | Number | No |
| show-logo | Display the ARK logo in QR code | Boolean | No |
| vendor-field | Vendor field string (encoded URI). | String | No |


## Authors

- ArkMoon <arkmoon.delegate@gmail.com>

based off of the work of:
 - Lúcio Rubens <lucio@ark.io>

## License

ARK QRCode React is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

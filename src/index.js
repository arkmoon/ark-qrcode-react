import React from 'react';
import PropTypes from 'prop-types';
const QRious = require('qrious/dist/QRious');

class ArkQrCode extends React.Component {
  componentDidMount = () => {
    const scheme = this.generateSchema();

    // Validate props input.
    this.validateProps();

    this.generateQRCode(scheme);
  }

  componentDidUpdate = () => {
    const scheme = this.generateSchema();

    this.generateQRCode(scheme);
  }

  validateAddress = address => {
    const pattern = /^[AaDd]{1}[0-9a-zA-Z]{33}$/g;

    if (!address) {
      throw new Error('address: required');
    }

    if (address && !address.match(pattern)) {
      throw new Error('address: not valid ark recipient');
    }
  }

  validateAmount = amount => {
    if (typeof Number(amount) !== 'number') {
      throw new Error('amount: invalid amount');
    }
  }

  validateVendorField = vendorField => {
    if (typeof vendorField === 'string' && decodeURIComponent(vendorField) === vendorField) {
      throw new Error('vendorField: must be a UTF-8 encoded string');
    }

    if (decodeURIComponent(vendorField).length > 64) {
      throw new Error('vendorField: enter no more than 64 characters');
    }
  }

  validateLabel = label => {
    if (typeof label === 'string' && decodeURIComponent(label) === label) {
      throw new Error('label: must be a UTF-8 encoded string');
    }

    if (decodeURIComponent(label).length > 64) {
      throw new Error('label: enter no more than 64 characters');
    }
  }

  validateSize = size => {
    if (typeof size !== 'number'){
      throw new Error('size: must be a number');
    }
  }

  validateShowLogo = showLogo => {
    if (typeof showLogo !== 'boolean') {
      throw new Error('show-logo: must be a boolean');
    }

    if (showLogo && this.props.size < 150) {
      throw new Error('show-logo: to display the logo the size must be greater than 150');
    }
  }

  validateURI = uri => {
    const regex = new RegExp(/^(?:ark:)([AaDd]{1}[0-9a-zA-Z]{33})([-a-zA-Z0-9+&@#/%=~_|$?!:,.]*)$/);

    if (regex.test(uri)) {
      return regex.exec(uri);
    }
  }

  generateSchema = () => {
    const params = this.formatParams();
    const uri = `ark:${this.props.address}${params}`;
    const scheme = JSON.parse(JSON.stringify(uri));

    // Validate this schema is ok.
    this.validateURI(scheme);

    return scheme;
  }

  generateQRCode = scheme => {
    const level = this.props.showLogo ? 'M' : 'L';
    const qr = new QRious({
      level,
      size: this.props.size,
      element: this.qrCanvas,
      value: scheme,
    });

    return this.drawLogo(qr);
  }

  drawLogo = qr => {
    const ctx = this.qrCanvas.getContext('2d');
    const img = new Image();

    if (!this.props.showLogo) {
      return;
    }

    img.onload = () => {
      const logoWidth = img.width;
      const logoHeight = img.height;
      const width = qr.size / 3.5;
      const height = logoHeight / logoWidth * width;
      let x = (qr.size / 2) - (width / 2);
      let y = (qr.size / 2) - (height / 2);
      let maskPadding = qr.size / 50;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(img, 0, 0, logoWidth, logoHeight, x - maskPadding, y - maskPadding, width + (maskPadding * 2), height + (maskPadding * 2));
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, 0, logoWidth, logoHeight, x, y, width, height);
    };

    img.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iNTEyIgogICBoZWlnaHQ9IjUxMiIKICAgdmlld0JveD0iMCAwIDEzNS40NjY2NiAxMzUuNDY2NjYiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzAiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTIuMiA1YzNlODBkLCAyMDE3LTA4LTA2IgogICBzb2RpcG9kaTpkb2NuYW1lPSJhcmtjbGllbnQuc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMCIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6em9vbT0iMC43MDcxMDY3OCIKICAgICBpbmtzY2FwZTpjeD0iLTI5LjQ1Njg1MiIKICAgICBpbmtzY2FwZTpjeT0iMzgxLjIwNTI4IgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJtbSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjAiCiAgICAgc2hvd2dyaWQ9InRydWUiCiAgICAgdW5pdHM9InB4IgogICAgIHNob3dndWlkZXM9InRydWUiCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE2NTciCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iOTU3IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIyMjgiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjQ1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiPgogICAgPGlua3NjYXBlOmdyaWQKICAgICAgIHR5cGU9Inh5Z3JpZCIKICAgICAgIGlkPSJncmlkNDUxNyIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjY3LjczMzMzLDAiCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIgogICAgICAgaWQ9Imd1aWRlNDUyMiIKICAgICAgIGlua3NjYXBlOmxvY2tlZD0iZmFsc2UiCiAgICAgICBpbmtzY2FwZTpsYWJlbD0iIgogICAgICAgaW5rc2NhcGU6Y29sb3I9InJnYigwLDAsMjU1KSIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjAsNjcuNzMzMzMiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDUyNCIKICAgICAgIGlua3NjYXBlOmxvY2tlZD0iZmFsc2UiCiAgICAgICBpbmtzY2FwZTpsYWJlbD0iIgogICAgICAgaW5rc2NhcGU6Y29sb3I9InJnYigwLDAsMjU1KSIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjEwOC40NzkxNiwzOS42ODc0OTgiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDUzMiIKICAgICAgIGlua3NjYXBlOmxvY2tlZD0iZmFsc2UiIC8+CiAgPC9zb2RpcG9kaTpuYW1lZHZpZXc+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGUgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpbmtzY2FwZTpsYWJlbD0iRWJlbmUgMCIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjAiPgogICAgPGcKICAgICAgIGlkPSJhcmtjbGllbnQiPgogICAgICA8Y2lyY2xlCiAgICAgICAgIHI9IjY3LjczMzMzIgogICAgICAgICBjeT0iNjcuNzMzMzMiCiAgICAgICAgIGlkPSJwYXRoNDUxOSIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmMjMzZjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6Mi43Mzc5NTc3MiIKICAgICAgICAgY3g9IjY3LjczMzMzIiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icmVjdDQ1MTUiCiAgICAgICAgIGQ9Ik0gNjcuNzMzMzMyLDM0LjM5NTg1NiAyNi4xOTM3NSwxMDAuNTQxNjkgNjcuNzMzMzMyLDU4LjIwODM1NiAxMDkuMjcyOTIsMTAwLjU0MTY5IFogbSAxMGUtNywzMy4zMzc0NyAtNi44NzkxNjYsNy40MDgzNCBIIDc0LjYxMjUgWiBtIC0xMS42NDE2NjcsMTIuMTcwODYgLTYuODc5MTY2LDcuMTQzNzUgaCAzNy4wNDE2NjUgbCAtNi44NzkxNjYsLTcuMTQzNzUgeiIKICAgICAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMTMyMjkxNjY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjAuMiIKICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2NjY2NjYyIgLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=';
  }

  formatParams = () => {
    let params = [];
    let stringify = '';

    if (this.props.amount)
      params.push(`amount=${this.props.amount}`);

    if (this.props.label)
      params.push(`label=${this.props.label}`);

    if (this.props.vendorField)
      params.push(`vendorField=${this.props.vendorField}`);

    stringify = (params.length > 0) ? `?${params.join('&')}` : '';

    return stringify;
  }

  validateProps = () => {
    const {address, amount, label, showLogo, size, vendorField} = this.props;

    this.validateAddress(address);
    this.validateAmount(amount);
    this.validateLabel(label);
    this.validateShowLogo(showLogo);
    this.validateSize(size);
    this.validateVendorField(vendorField);
  }

  render() {
    return <canvas ref={(el) => { this.qrCanvas = el; }} />;
  }
}

ArkQrCode.propTypes = {
  address: PropTypes.string.isRequired,
  amount: PropTypes.number,
  label: PropTypes.string,
  showLogo: PropTypes.bool,
  size: PropTypes.number,
  vendorField: PropTypes.string
};

export default ArkQrCode;

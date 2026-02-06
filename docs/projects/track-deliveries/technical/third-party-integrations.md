# Technical: Third-Party Integrations

## Carrier APIs

### USPS
- **API**: Web Tools
- **Auth**: API key
- **Endpoint**: `https://secure.shippingapis.com/ShippingAPI.dll`
- **Notes**: XML responses

### UPS
- **API**: UPS Tracking API
- **Auth**: OAuth 2.0 client credentials
- **Endpoint**: `https://onlinetools.ups.com/rest/Track`

### FedEx
- **API**: FedEx Track API
- **Auth**: OAuth 2.0 client credentials
- **Endpoint**: `https://apis.fedex.com/track/v1/trackingnumbers`

### DHL
- **API**: DHL Express Track API
- **Auth**: API key

### Amazon Logistics
- **API**: Limited public access
- **Strategy**: Regex detection + public tracking URL fallback

## Email Provider
- **Primary**: SendGrid
- **Fallback**: AWS SES
- **Templates**: HTML + plain text

## Future Integrations
- Push notifications (FCM)
- SMS alerts (Twilio)

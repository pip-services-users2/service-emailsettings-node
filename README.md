# Email Settings Microservice

This is a email settings microservice from Pip.Services library. 
This microservice keeps settings of email recipients.

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca

This microservice has optional dependencies on the following microservices:
- [service-activities-nodex](https://github.com/pip-services-users2/service-activities-node) - to log user activities
- [service-msgtemplates-nodex](https://github.com/pip-services-content2/service-msgtemplates-node) - to get message templates
- [service-email-nodex](https://github.com/pip-services-infrastructure2/service-email-node) - to send email messages

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-users2/client-emailsettings-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
  - [Seneca Version 1](doc/SenecaProtocolV1.md)

##  Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class EmailSettingsV1 implements IStringIdentifiable {
    /* Recipient information */
    public id: string;
    public name: string;
    public email: string;
    public language: string;

    /* EmailSettings management */
    public subscriptions: any;
    public verified: boolean;
    public ver_code: string;
    public ver_expire_time: Date;

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;
}

interface IEmailSettingsV1 {
    getSettingsById(correlationId: string, recipientId: string): Promise<EmailSettingsV1>;
    getSettingsByEmail(correlationId: string, email: string): Promise<EmailSettingsV1>;
    setSettings(correlationId: string, settings: EmailSettingsV1): Promise<EmailSettingsV1>;
    setRecipient(correlationId: string, recipientId: string,
        name: string, email: string, language: string): Promise<EmailSettingsV1>;
    setSubscriptions(correlationId: string, recipientId: string, subscriptions: any): Promise<EmailSettingsV1>;
    deleteSettingsById(correlationId: string, recipientId: string): Promise<void>;
    resendVerification(correlationId: string, recipientId: string): Promise<void>;
    verifyEmailSettings(correlationId: string, recipientId: string, code: string): Promise<void>;
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-users2/service-emailsettings-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 
Example of microservice configuration
```yaml
---
- descriptor: "service-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "service-emailsettings:persistence:file:default:1.0"
  path: "./data/email_settings.json"

- descriptor: "service-emailsettings:controller:default:default:1.0"
  
- descriptor: "service-emailsettings:service:commandable-http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-emailsettings-node": "^1.0.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
var sdk = new require('client-emailsettings-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
var config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.EmailSettingsHttpClientV1(config);

// Connect to the microservice
try {
    await client.open(null);
    
    // Work with the microservice
    ...
}
catch (err) {
    console.error('Connection to the microservice failed');
    console.error(err);
}
```

Now the client is ready to perform operations
```javascript
// Send email message to address
await client.sendMessage(
    null,
    { 
        to: 'somebody@somewhere.com',
        subject: 'Test',
        text: 'This is a test message. Please, ignore it'
    },
);
```

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.


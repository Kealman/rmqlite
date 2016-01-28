<a name="module_RabbitMQ"></a>
## RabbitMQ

* [RabbitMQ](#module_RabbitMQ)
    * [~Message](#module_RabbitMQ..Message)
        * [.toString()](#module_RabbitMQ..Message+toString) ⇒ <code>String</code>
        * [.toJSON()](#module_RabbitMQ..Message+toJSON) ⇒ <code>Object</code>
        * [.ack()](#module_RabbitMQ..Message+ack) ⇒ <code>deliveryTag</code>
    * [~RabbitMQ](#module_RabbitMQ..RabbitMQ)
        * [new RabbitMQ(exchanger, queue, [queueOptions], [exchangerOptions])](#new_module_RabbitMQ..RabbitMQ_new)
        * _instance_
            * [.subscribe(callback, [ack], [options])](#module_RabbitMQ..RabbitMQ+subscribe) ⇒ <code>Promise</code>
            * [.unsubscribe()](#module_RabbitMQ..RabbitMQ+unsubscribe) ⇒ <code>Promise</code>
            * [.publish(message, [routingKey])](#module_RabbitMQ..RabbitMQ+publish) ⇒ <code>Promise</code>
            * [.bind(routingKeys)](#module_RabbitMQ..RabbitMQ+bind) ⇒ <code>\*</code>
            * [.unbind(routingKeys)](#module_RabbitMQ..RabbitMQ+unbind) ⇒ <code>\*</code>
            * [.destroy()](#module_RabbitMQ..RabbitMQ+destroy)
        * _static_
            * [.on(event, cb)](#module_RabbitMQ..RabbitMQ.on)
            * [.reconnect()](#module_RabbitMQ..RabbitMQ.reconnect)
    * [~MessageHandler](#module_RabbitMQ..MessageHandler) : <code>function</code>

<a name="module_RabbitMQ..Message"></a>
### RabbitMQ~Message
Message

**Kind**: inner class of <code>[RabbitMQ](#module_RabbitMQ)</code>  

* [~Message](#module_RabbitMQ..Message)
    * [.toString()](#module_RabbitMQ..Message+toString) ⇒ <code>String</code>
    * [.toJSON()](#module_RabbitMQ..Message+toJSON) ⇒ <code>Object</code>
    * [.ack()](#module_RabbitMQ..Message+ack) ⇒ <code>deliveryTag</code>

<a name="module_RabbitMQ..Message+toString"></a>
#### message.toString() ⇒ <code>String</code>
Return data as string

**Kind**: instance method of <code>[Message](#module_RabbitMQ..Message)</code>  
**Returns**: <code>String</code> - - message data  
<a name="module_RabbitMQ..Message+toJSON"></a>
#### message.toJSON() ⇒ <code>Object</code>
Return data as object
(Using JSON.parse)

**Kind**: instance method of <code>[Message](#module_RabbitMQ..Message)</code>  
**Returns**: <code>Object</code> - - message data  
<a name="module_RabbitMQ..Message+ack"></a>
#### message.ack() ⇒ <code>deliveryTag</code>
Ack message

**Kind**: instance method of <code>[Message](#module_RabbitMQ..Message)</code>  
**Returns**: <code>deliveryTag</code> - - Delivery tag  
<a name="module_RabbitMQ..RabbitMQ"></a>
### RabbitMQ~RabbitMQ
**Kind**: inner class of <code>[RabbitMQ](#module_RabbitMQ)</code>  

* [~RabbitMQ](#module_RabbitMQ..RabbitMQ)
    * [new RabbitMQ(exchanger, queue, [queueOptions], [exchangerOptions])](#new_module_RabbitMQ..RabbitMQ_new)
    * _instance_
        * [.subscribe(callback, [ack], [options])](#module_RabbitMQ..RabbitMQ+subscribe) ⇒ <code>Promise</code>
        * [.unsubscribe()](#module_RabbitMQ..RabbitMQ+unsubscribe) ⇒ <code>Promise</code>
        * [.publish(message, [routingKey])](#module_RabbitMQ..RabbitMQ+publish) ⇒ <code>Promise</code>
        * [.bind(routingKeys)](#module_RabbitMQ..RabbitMQ+bind) ⇒ <code>\*</code>
        * [.unbind(routingKeys)](#module_RabbitMQ..RabbitMQ+unbind) ⇒ <code>\*</code>
        * [.destroy()](#module_RabbitMQ..RabbitMQ+destroy)
    * _static_
        * [.on(event, cb)](#module_RabbitMQ..RabbitMQ.on)
        * [.reconnect()](#module_RabbitMQ..RabbitMQ.reconnect)

<a name="new_module_RabbitMQ..RabbitMQ_new"></a>
#### new RabbitMQ(exchanger, queue, [queueOptions], [exchangerOptions])

| Param | Type | Description |
| --- | --- | --- |
| exchanger | <code>string</code> | exchanger name |
| queue | <code>string</code> | queue name |
| [queueOptions] | <code>object</code> | queue options [| see this](http://www.squaremobius.net/amqp.node/channel_api.html#channel-assertqueue) |
| [exchangerOptions] | <code>object</code> | exchange options [| see this](http://www.squaremobius.net/amqp.node/channel_api.html#channel-assertexchange) |

<a name="module_RabbitMQ..RabbitMQ+subscribe"></a>
#### rabbitMQ.subscribe(callback, [ack], [options]) ⇒ <code>Promise</code>
Subscribe to queue

**Kind**: instance method of <code>[RabbitMQ](#module_RabbitMQ..RabbitMQ)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>MessageHandler</code> |  | message handler |
| [ack] | <code>boolean</code> | <code>false</code> | Acknowledge the given message |
| [options] | <code>object</code> |  | [| See this](http://www.squaremobius.net/amqp.node/channel_api.html#channel_consume) |

<a name="module_RabbitMQ..RabbitMQ+unsubscribe"></a>
#### rabbitMQ.unsubscribe() ⇒ <code>Promise</code>
Unsubscribe from queue

**Kind**: instance method of <code>[RabbitMQ](#module_RabbitMQ..RabbitMQ)</code>  
<a name="module_RabbitMQ..RabbitMQ+publish"></a>
#### rabbitMQ.publish(message, [routingKey]) ⇒ <code>Promise</code>
Publish message

**Kind**: instance method of <code>[RabbitMQ](#module_RabbitMQ..RabbitMQ)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | message for publish |
| [routingKey] | <code>string</code> | publish with routingKey |

<a name="module_RabbitMQ..RabbitMQ+bind"></a>
#### rabbitMQ.bind(routingKeys) ⇒ <code>\*</code>
Bind queue to exchanger with routing key

**Kind**: instance method of <code>[RabbitMQ](#module_RabbitMQ..RabbitMQ)</code>  

| Param | Type | Description |
| --- | --- | --- |
| routingKeys | <code>string</code> &#124; <code>Array</code> | Routing keys |

<a name="module_RabbitMQ..RabbitMQ+unbind"></a>
#### rabbitMQ.unbind(routingKeys) ⇒ <code>\*</code>
Unbind queue to exchanger with routing key

**Kind**: instance method of <code>[RabbitMQ](#module_RabbitMQ..RabbitMQ)</code>  

| Param | Type | Description |
| --- | --- | --- |
| routingKeys | <code>string</code> &#124; <code>Array</code> | Routing keys |

<a name="module_RabbitMQ..RabbitMQ+destroy"></a>
#### rabbitMQ.destroy()
Remove this object from EventEmmiter
WARNING: This function must be called if you not used this object.

**Kind**: instance method of <code>[RabbitMQ](#module_RabbitMQ..RabbitMQ)</code>  
<a name="module_RabbitMQ..RabbitMQ.on"></a>
#### RabbitMQ.on(event, cb)
**Kind**: static method of <code>[RabbitMQ](#module_RabbitMQ..RabbitMQ)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | event [| See this](http://www.squaremobius.net/amqp.node/channel_api.html#model_events) and 'connect' event |
| cb | <code>function</code> | callback function |

<a name="module_RabbitMQ..RabbitMQ.reconnect"></a>
#### RabbitMQ.reconnect()
Reconnect to RabbitMQ server and resubscribe and bind all queue

**Kind**: static method of <code>[RabbitMQ](#module_RabbitMQ..RabbitMQ)</code>  
<a name="module_RabbitMQ..MessageHandler"></a>
### RabbitMQ~MessageHandler : <code>function</code>
**Kind**: inner typedef of <code>[RabbitMQ](#module_RabbitMQ)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | incoming message |


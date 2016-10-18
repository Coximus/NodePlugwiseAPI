# NodePlugwiseAPI

A service which exposees a REST API to allow communication with Plugwise Equipment

## Installation

via [npm (node package manager)](http://github.com/isaacs/npm)

    $ npm install NodePlugwiseAPI

## Usage

    node index path-to-your-usb-port
    e.g.
    node index /dev/ttyUSB0

This will listen on port 3000.

To switch a plug on, make a GET request to:
/switch/plug-address/1
e.g. http://localhost:3000/switch/000D5F0000123456/1

To switch a plug off, make a GET request to:
/switch/plug-address/0
e.g. http://localhost:3000/switch/000D5F0000123456/0

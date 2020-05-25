/********************************************************************************
 *	this sketch lets an Arduino to work as a simple web server on a LAN and	to	*
 *	be controlled wirelessly via WiFi											*
 ********************************************************************************/

#include <SPI.h> // what is used to communicate with the WiFi chip
#include <WiFiNINA.h> // wifi library
#include "arduino_secrets.h" // sensitive data
#include "SmartHomeServer.h"

// DECLARATIONS

// WiFi
char ssid[] = SECRET_SSID;		// network SSID
char pass[] = SECRET_PASS;		// network password
int keyIndex = 0;				// network key Index number (only for WEP)
int status = WL_IDLE_STATUS;	// status of wifi
WiFiServer server(80);			// server object

// resources
SmartHomeServer SHServer;

void setup()
{
	Serial.begin(9600);
	while (!Serial)
	{
		// wait for serial port to connect (needed for native USB port only)
	}

	// check for the presence of the shield
	if (WiFi.status() == WL_NO_SHIELD)
	{
		Serial.println("WiFi shield not present");
		// don't continue
		while (true);
	}

	String fv = WiFi.firmwareVersion();
	if (fv < WIFI_FIRMWARE_LATEST_VERSION)
	{
		Serial.println("Please upgrade the WiFi firmware");
	}
	
	// attempt to connect to Wifi network
	while ( status != WL_CONNECTED)
	{
		Serial.print("Attempting to connect to SSID: ");
		Serial.println(ssid);
		status = WiFi.begin(ssid, pass);	// connect to WPA/WPA2 network
		delay(2000);						// wait 5 seconds for connection
	}
	
	server.begin();			// the connection has been established
	printWifiStatus();		// print out the status

	SHServer.initialize();
	SHServer.initializeNTP();
}


void loop()
{
	WiFiClient client = server.available();		// listen for incoming clients
	
	if (client)		// if there is a client
	{
		Serial.println("==================================================");
		Serial.println();
		Serial.println("*** new client");
		
		//Serial.println("*** request:");

		bool headerEnded = false;		// flag for incoming header
		bool dataEnded = false;			// flag for incoming data
		String currentLine = "";		// string to hold incoming request
		// flags for request handling
		bool methodListening = true;
		bool pathListening = false;
		bool queryListening = false;
		bool dataListening = false;
		// actual request data
		String method = "";
		String path = "";
		String query = "";
		String data = "";

		// loop while the client's connected and there is still incoming data
		while (client.connected() and !dataEnded)
		{
			if (client.available())		// if there's bytes to read
			{
				char c = client.read();		// read a byte, then
				//Serial.write(c);			// print it out
				
				if (c == '\n')		// if the byte is a newline character
				{
					// if the current line is blank, that's the end of the
					// client HTTP request, so send a response
					if (currentLine.length() == 0)
					{
						if (method == "POST" and !headerEnded)
						{
							headerEnded = true;
							dataListening = true;
						}
						else
						{
							dataListening = false;
							dataEnded = true;
	
							// prints the request method
							Serial.print("*** method: ");
							Serial.println(method);
	
							// TODO: solve initial space bug
							// prints the request path
							Serial.print("*** path: ");
							Serial.println(path);
	
							// prints the request query
							Serial.print("*** query: ");
							Serial.println(query);
	
							// prints the request query
							Serial.println("*** data: ");
							Serial.println(data);
							
							Serial.println();
	
							bool success = SHServer.handleRequest(method, path, query, data);
							
							if (success)
							{
								client.println("HTTP/1.1 200 OK");
								client.println(SHServer.getResponseInfo());
								client.println();
								
								// the content of the HTTP response follows the header
								String responseText = SHServer.getResponseText();
								client.print(responseText);
								
								// DEBUG
								
								Serial.println("*** response:");
								if (responseText != "")
								{
									Serial.println(responseText);
								}
								else
								{
									Serial.println("<< none >>");
								}
							}
							else
							{
								client.println("HTTP/1.1 404 Not Found");
								client.println(SHServer.getResponseInfo());
								client.println("Connection: Closed");
								client.println();
							}
						}
					}
					
					// clear currentLine every time the line ends
					currentLine = "";
				}
				// if the last byte is anything else but a carriage return
				else if (c != '\r')
				{
					currentLine += c;		// append it to currentLine
				}

				if (c == ' ')
				{
					if (methodListening)
					{
						// the next data will be the request path
						methodListening = false;
						pathListening = true;
					}
					else
					{
						// the request data is ended
						methodListening = false;	// TODO: check this line
						pathListening = false;
						queryListening = false;
					}
				}

				if (c == '?' && pathListening) {
					// the next data will be the request query
					pathListening = false;
					queryListening = true;
				}

				if (methodListening && c != ' ') {
					method += c;	// append the last byte to method
				}

				if (pathListening && c != ' ') {
					path += c;		// append the last byte to path
				}

				if (queryListening && c != '?') {
					query += c;		// append the last byte to query
				}

				if (dataListening && c != '\n')
				{
					data += c;
				}
			}
		}
		
		// close the connection:
		client.stop();
		Serial.println("*** client disconnected");
		Serial.println();

		SHServer.postResponseHandling();
	}
}

void printWifiStatus()
{
	// print the SSID of the network you're attached to:
	Serial.print("SSID: ");
	Serial.println(WiFi.SSID());
	
	// print your WiFi shield's IP address:
	IPAddress ip = WiFi.localIP();
	Serial.print("IP Address: ");
	Serial.println(ip);
	
	// print the received signal strength:
	long rssi = WiFi.RSSI();
	Serial.print("signal strength (RSSI):");
	Serial.print(rssi);
	Serial.println(" dBm");
	Serial.println();
}

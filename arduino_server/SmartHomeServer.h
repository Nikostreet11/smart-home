#ifndef SMART_HOME_SERVER_H_
#define SMART_HOME_SERVER_H_

#include <SPI.h>
#include <WiFiNINA.h> // wifi library
#include <WiFiUdp.h> // wifi udp library
#include <TimeLib.h>
#include <ArduinoJson.h> // json library
#include "Database.h"

class SmartHomeServer
{
public:
	// constructor
	SmartHomeServer();
	
	// destructor
	virtual ~SmartHomeServer();

	// handle
	bool handleRequest(String method, String path, String query, String data);
	void postResponseHandling();

	// NTP
	void initializeNTP();

	// getters
	const String& getResponseText() const;
	String getResponseInfo();
	
private:
	// internal
	bool handleGET(String path, String query);
	bool handlePOST(String path, String query, String data);
	unsigned long sendNTPpacket(IPAddress& address);
	unsigned long readNTPpacket();
	unsigned long toUnixTime(unsigned long secsSince1900);
	String getIndexHTML();
	String toWeekdayString(int weekday);
	String toMonthString(int month);
	String toTimeString(int time);
	String getParameter(String name, String query);
	void resetFlags();

	// variables
	Database database;
	String responseText;
	
	// NTP
	static const uint UDP_LOCAL_PORT = 2390;	// local port to listen for UDP packets
	static const int NTP_PACKET_SIZE = 48;		// size of the timestamp
	static const int GMT = 1;					// rome GMT
	IPAddress timeServer;						// ip address of the NTP server
	byte packetBuffer[NTP_PACKET_SIZE];			// buffer to hold data
	WiFiUDP Udp;								// UDP instance
	
	// I/O
	static const int lControl = LED_BUILTIN;	// digital pin that a LED is connected to

	// info
	const String deviceName = "smart_arduino_1.0";

	// flags
	bool led_on;
	bool led_off;
	bool led_toggle;
	bool led_blink;
};

#endif /* SMART_HOME_SERVER_H_ */

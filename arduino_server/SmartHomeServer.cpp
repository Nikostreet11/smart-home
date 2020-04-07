#include "SmartHomeServer.h"

/********** CONSTRUCTOR *********************************************************/

SmartHomeServer::SmartHomeServer() :
		responseText(""),
		timeServer(216, 239, 35, 0)		//time.google.com
{
	pinMode(lControl, OUTPUT);
	resetFlags();
}

/********** DESTRUCTOR **********************************************************/

SmartHomeServer::~SmartHomeServer()
{
}

/********** HANDLE **************************************************************/

bool SmartHomeServer::handleRequest(String method, String path, String query, String data)
{
	responseText = "";
	database.clearJsonDocuments();
	
	if (method == "GET")
	{
		return handleGET(path, query);
	}
	else if (method == "POST")
	{
		return handlePOST(path, query, data);
	}

	return false;
}

void SmartHomeServer::postResponseHandling()
{
	//Serial.println("*** post response handling...");
	
	// post response behaviours
	if (led_on == true)
	{
		digitalWrite(lControl, HIGH);
	}
	if (led_off == true)
	{
		digitalWrite(lControl, LOW);
	}
	if (led_toggle == true)
	{
		digitalWrite(lControl, !digitalRead(lControl));
	}
	if (led_blink == true)
	{
		for (int index = 0; index < 80; index++) {
			digitalWrite(lControl, !digitalRead(lControl));
			delay(50);
		}
	}

	resetFlags();
	
	//Serial.println("*** done!");
	//Serial.println();
}


/********** NTP *****************************************************************/

void SmartHomeServer::initializeNTP()
{
	Udp.begin(UDP_LOCAL_PORT);
	sendNTPpacket(timeServer); // send an NTP packet to a time server
	
	// wait to see if a reply is available
	while (!Udp.parsePacket())
	{
		Serial.println("Waiting for the NTP server...");
		delay(2000);
	}
	
	Serial.println("Response received.");
	unsigned long secsSince1900 = readNTPpacket();
	unsigned long epoch = toUnixTime(secsSince1900);
	setTime(epoch);
	adjustTime(3600 * GMT);
	
	Serial.println();
	Serial.println(deviceName + " is now ready!");
	Serial.println();

	database.debugInit();
}

/********** GETTERS *************************************************************/

const String& SmartHomeServer::getResponseText() const
{
	return responseText;
}

String SmartHomeServer::getResponseInfo()
{
	// version
	String arduinoVersion = "";
	char c;
	for (int count = 0;
			count < sizeof(__VERSION__) - 1 and c != ' ';
			count++)
	{
		c = __VERSION__[count];
		arduinoVersion += c;
	}
	String versionString = "Server: Arduino/" + arduinoVersion;

	// date and time
	time_t currentTime = now();
	String dateAndTimeString =
			"Date: " +
			String(toWeekdayString(weekday(currentTime))) + ", " +
			String(toMonthString(month(currentTime))) + " " +
			String(day(currentTime)) + " " +
			String(year(currentTime)) + " " +
			String(toTimeString(hour(currentTime))) + ":" +
			String(toTimeString(minute(currentTime))) + ":" +
			String(toTimeString(second(currentTime))) + " " +
			"GMT" + (GMT >= 0 ? "+" : "-") + String(GMT);
			
	// last compilation date and time
	String lastModifiedString =
			"Last-Modified: " + String(__DATE__) + " " + String(__TIME__) +
			" GMT" + (GMT >= 0 ? "+" : "-") + String(GMT);

	// content length
	String contentLenghtString = "Content-Length: WIP";

	// content type
	String contentTypeString = "Content-Type: text/html";

	// ACAO
	String ACAOString = "Access-Control-Allow-Origin: *";

	// caching
	String cacheString = "Cache-Control: no-store";
	
	String responseInfo =
			versionString + '\n' +
			dateAndTimeString + '\n' +
			lastModifiedString + '\n' +
			contentLenghtString + '\n' +
			contentTypeString + '\n' +
			ACAOString + '\n' +
			cacheString;
	
	// DEBUG
	
	Serial.println("*** response info:");
	Serial.println(responseInfo);
	

	return responseInfo;
}

/********** INTERNAL ************************************************************/

bool SmartHomeServer::handleGET(String path, String query)
{
	if (path == "/")
	{
		responseText = getIndexHTML();
		return true;
	}
	else if (path.startsWith("/profiles/"))
	{
		// get the id
		int profileIdStart = String("/profiles/").length();
		String profileId = path.substring(profileIdStart);

		if (profileId == "")
		{
			// get all profiles
			responseText = database.getProfiles();
			return true;
		}
		else
		{
			// get the profile
			responseText = database.getProfile(profileId);
			return true;
		}
	}
	else if (path.startsWith("/rooms/"))
	{
		// get the room name
		String remainingPath = path.substring(String("/rooms/").length());
		int roomIdEnd = remainingPath.indexOf("/");
		String roomId;
		String profileId = getParameter("profile-id", query);
		if (roomIdEnd != -1)
		{
			roomId = remainingPath.substring(0, roomIdEnd);
			remainingPath = remainingPath.substring(roomIdEnd);

			// TODO
		}
		else
		{
			roomId = remainingPath;
			if (roomId == "")
			{			
				// get all rooms
				responseText = database.getRooms(profileId);
				return true;
			}
			else
			{
				// get the room
				responseText = database.getRoom(roomId, profileId);
				return true;
			}
		}
	}
	else if (path.startsWith("/items/"))
	{
		// get the item name
		String remainingPath = path.substring(String("/items/").length());
		int itemIdEnd = remainingPath.indexOf("/");
		String itemId;
		String roomId = getParameter("room-id", query);
		String profileId = getParameter("profile-id", query);
		if (itemIdEnd != -1)
		{
			roomId = remainingPath.substring(0, itemIdEnd);
			remainingPath = remainingPath.substring(itemIdEnd);

			// TODO
		}
		else
		{
			itemId = remainingPath;
			if (itemId == "")
			{
				// get all items
				responseText = database.getItems(roomId, profileId);
				return true;
			}
			else
			{
				// get the room
				responseText = database.getItem(itemId, roomId, profileId);
				return true;
			}
		}
	}
	else if (path.startsWith("/smartsets/"))
	{
		// get the item name
		String remainingPath = path.substring(String("/smartsets/").length());
		int smartsetIdEnd = remainingPath.indexOf("/");
		String smartsetId;
		String profileId = getParameter("profile_id", query);
		String roomId = getParameter("room_id", query);
		String itemId = getParameter("item_id", query);
		
		if (smartsetIdEnd != -1)
		{
			smartsetId = remainingPath.substring(0, smartsetIdEnd);
			remainingPath = remainingPath.substring(smartsetIdEnd);

			// TODO
		}
		else
		{
			smartsetId = remainingPath;
			if (smartsetId == "")
			{
				// get all the selected smartsets
				responseText = database.getSmartsets(profileId, roomId, itemId);
				return true;
			}
			else
			{
				// get the smartset
				responseText = database.getSmartset(smartsetId, profileId, roomId);
				return true;
			}
		}
	}
	else if (path.startsWith("/ports/"))
	{
		// get the item name
		String remainingPath = path.substring(String("/ports/").length());
		int portNameEnd = remainingPath.indexOf("/");
		String portName;
		if (portNameEnd != -1)
		{
			// TODO
		}
		else
		{
			portName = remainingPath;
			if (portName == "")
			{			
				// get all ports
				responseText = database.getAvailablePorts();
				return true;
			}
			else
			{
				// get the port
				// TODO: responseText = database.getPort(data);
				// return true;
			}
		}
	}
	else if (path.startsWith("/debug/"))
	{
		if (path.startsWith("/debug/led-on"))
		{
			led_on = true;
			return true;
		}
		else if (path.startsWith("/debug/led-off"))
		{
			led_off = true;
			return true;
		}
		else if (path.startsWith("/debug/led-toggle"))
		{
			led_toggle = true;
			return true;
		}
		else if (path.startsWith("/debug/led-blink"))
		{
			led_blink = true;
			return true;
		}
		/*else if (path.startsWith("/debug/ports"))
		{
			database.portManager.debug();
			return true;
		}
		else if (path.startsWith("/debug/lock"))
		{
			database.portManager.lock("port_10");
			return true;
		}
		else if (path.startsWith("/debug/unlock"))
		{
			database.portManager.unlock("port_10");
			return true;
		}*/
	}
	
	return false;
}

bool SmartHomeServer::handlePOST(String path, String query, String data)
{	
	if (path == "/")
	{
		// TODO
	}
	else if (path.startsWith("/profiles/"))
	{
		// get the id
		int profileIdStart = String("/profiles/").length();
		String profileId = path.substring(profileIdStart);
		if (profileId == "")
		{
			if (getParameter("action", query) == "add")
			{
				responseText = database.addProfile(data);
				return true;
			}
		}
		else
		{
			if (getParameter("action", query) == "edit")
			{
				responseText = database.editProfile(profileId, data);
				return true;
			}
			else if (getParameter("action", query) == "remove")
			{
				responseText = database.removeProfile(profileId);
				return true;
			}
		}
	}
	else if (path.startsWith("/rooms/"))
	{
		// get the room name
		int roomIdStart = String("/rooms/").length();
		String roomId = path.substring(roomIdStart);
		
		if (roomId == "")
		{
			if (getParameter("action", query) == "add")
			{
				responseText = database.addRoom(data);
				return true;
			}
		}
		else
		{
			if (getParameter("action", query) == "edit")
			{
				responseText = database.editRoom(roomId, data);
				return true;
			}
			else if (getParameter("action", query) == "remove")
			{
				responseText = database.removeRoom(roomId);
				return true;
			}
			/*else if (getParameter("action", query) == "set-smart")
			{
				responseText = database.setRoomSmart(roomId, data);
				return true;
			}*/
		}
	}
	else if (path.startsWith("/items/"))
	{
		// get the item name
		String remainingPath = path.substring(String("/items/").length());
		int itemIdEnd = remainingPath.indexOf("/");
		String itemId;
		String action = getParameter("action", query);
		
		if (itemIdEnd != -1)
		{
			// TODO
		}
		else
		{
			itemId = remainingPath;
			
			StaticJsonDocument<1024> requestJson;
			deserializeJson(requestJson, data);
			
			if (itemId == "")
			{
				if (action == "add")
				{
					responseText = database.addItem(data);
					return true;
				}
			}
			else
			{
				if (action == "edit")
				{
					responseText = database.editItem(itemId, data);
					return true;
				}
				else if (action == "remove")
				{
					responseText = database.removeItem(itemId, data);
					return true;
				}
				else if (action == "set-status")
				{
					responseText = database.setItemActive(itemId, data);
					return true;
				}
				/*else if (action == "set-smart")
				{
					responseText = database.setItemSmart(itemId, data);
					return true;
				}*/
			}
		}
	}
	else if (path.startsWith("/smartsets/"))
	{
		// get the item name
		String remainingPath = path.substring(String("/smartsets/").length());
		int smartsetIdEnd = remainingPath.indexOf("/");
		String smartsetId;
		String action = getParameter("action", query);
		
		if (smartsetIdEnd != -1)
		{
			// TODO
		}
		else
		{
			smartsetId = remainingPath;
			
			if (smartsetId == "")
			{
				if (action == "add")
				{
					// add the smartset
					responseText = database.addSmartset(data);
					return true;
				}
			}
			else
			{
				if (action == "edit")
				{
					// edit the smartset
					responseText = database.editSmartset(smartsetId, data);
					return true;
				}
				else if (action == "remove")
				{
					// remove the smartset
					responseText = database.removeSmartset(smartsetId, data);
					return true;
				}
				else if (action == "add_item")
				{
					// add the item to the smartset
					responseText = database.addItemToSmartset(smartsetId, data);
					return true;
				}
				else if (action == "remove_item")
				{
					// remove the item from the smartset
					responseText = database.removeItemFromSmartset(smartsetId, data);
					return true;
				}
			}
		}
	}

	return false;
}

unsigned long SmartHomeServer::sendNTPpacket(IPAddress& address)
{
	//Serial.println("1");
	// set all bytes in the buffer to 0
	memset(packetBuffer, 0, NTP_PACKET_SIZE);
	// Initialize values needed to form NTP request
	// (see URL above for details on the packets)
	//Serial.println("2");
	packetBuffer[0] = 0b11100011;   // LI, Version, Mode
	packetBuffer[1] = 0;     // Stratum, or type of clock
	packetBuffer[2] = 6;     // Polling Interval
	packetBuffer[3] = 0xEC;  // Peer Clock Precision
	// 8 bytes of zero for Root Delay & Root Dispersion
	packetBuffer[12]  = 49;
	packetBuffer[13]  = 0x4E;
	packetBuffer[14]  = 49;
	packetBuffer[15]  = 52;
	
	//Serial.println("3");
	
	// all NTP fields have been given values, now
	// you can send a packet requesting a timestamp:
	Udp.beginPacket(address, 123); //NTP requests are to port 123
	//Serial.println("4");
	Udp.write(packetBuffer, NTP_PACKET_SIZE);
	//Serial.println("5");
	Udp.endPacket();
	//Serial.println("6");
}

unsigned long SmartHomeServer::readNTPpacket()
{
	Udp.read(packetBuffer, NTP_PACKET_SIZE); // read the packet into the buffer
	
	// the timestamp starts at byte 40 of the received packet and is four bytes,
	// or two words, long. First, extract the two words:
	unsigned long highWord = word(packetBuffer[40], packetBuffer[41]);
	unsigned long lowWord = word(packetBuffer[42], packetBuffer[43]);
	
	// combine the four bytes (two words) into a long integer
	// this is NTP time (seconds since Jan 1 1900):
	unsigned long secsSince1900 = highWord << 16 | lowWord;
	
	/* DEBUG */
	// Serial.print("Seconds since Jan 1 1900 = ");
	// Serial.println(secsSince1900);
	
	return secsSince1900;
}

unsigned long SmartHomeServer::toUnixTime(unsigned long secsSince1900)
{
	// Unix time starts on Jan 1 1970. In seconds, that's 2208988800:
	const unsigned long seventyYears = 2208988800UL;
	// subtract seventy years:
	unsigned long epoch = secsSince1900 - seventyYears;
	
	/* DEBUG */
	//Serial.print("Unix time = ");
	//Serial.println(epoch);
	
	return epoch;
}

String SmartHomeServer::getIndexHTML()
{
	IPAddress IP = WiFi.localIP();
	String deviceIP =
			String(IP[0]) + "." + String(IP[1]) + "." +
			String(IP[2]) + "." + String(IP[3]);
			
	String html = "";
	html += "<html><head>";
	html += "<title>Smart Home</title>";
	html += "</head><body>";
	html += "<h1>Device interface</h1>";
	html += "<div><h2>Info:</h2><ul><li>ID: ";
	html += deviceName;
	html += "</li><li>IP address: ";
	html += deviceIP;
	html += "</li></ul></div></body></html>";

	return html;
}

String SmartHomeServer::toWeekdayString(int weekday)
{
	String weekdayString;
	
	switch (weekday)
	{
		case 1:
			weekdayString = "Sun";
			break;
		
		case 2:
			weekdayString = "Mon";
			break;
		
		case 3:
			weekdayString = "Tue";
			break;
		
		case 4:
			weekdayString = "Wed";
			break;
		
		case 5:
			weekdayString = "Tue";
			break;
		
		case 6:
			weekdayString = "Fri";
			break;
		
		case 7:
			weekdayString = "Sat";
			break;
			
		default:
			weekdayString = "???";
			break;
		
	}

	return weekdayString;
}

String SmartHomeServer::toMonthString(int month)
{
	String monthString;
	
	switch (month)
	{
		case 1:
			monthString = "Jan";
			break;
		
		case 2:
			monthString = "Feb";
			break;
		
		case 3:
			monthString = "Mar";
			break;
		
		case 4:
			monthString = "Apr";
			break;
		
		case 5:
			monthString = "May";
			break;
		
		case 6:
			monthString = "Jun";
			break;
		
		case 7:
			monthString = "Jul";
			break;
			
		case 8:
			monthString = "Aug";
			break;
		
		case 9:
			monthString = "Sep";
			break;
		
		case 10:
			monthString = "Oct";
			break;
		
		case 11:
			monthString = "Nov";
			break;
		
		case 12:
			monthString = "Dec";
			break;
			
		default:
			monthString = "???";
			break;
		
	}

	return monthString;
}

String SmartHomeServer::toTimeString(int time)
{
	String timeString = String(time);
	
	if (time < 10)
	{
		timeString = "0" + timeString;
	}

	return timeString;
}

String SmartHomeServer::getParameter(String name, String query)
{
	int paramStart = 0;
	while (query.length() - paramStart > 0)
	{
		int paramEnd = query.indexOf("&", paramStart);
		if (paramEnd == -1)
		{
			paramEnd = query.length();
		}
		
		int paramNameEnd = query.indexOf("=", paramStart);
		String paramName = query.substring(paramStart, paramNameEnd);
		
		if (paramName == name)
		{
			String paramValue = query.substring(paramNameEnd + 1, paramEnd);
			return paramValue;
		}
		
		paramStart = paramEnd;
		if (paramEnd != query.length())
		{
			paramStart++;
		}
	}

	return "null";
}

void SmartHomeServer::resetFlags()
{
	led_on = false;
	led_off = false;
	led_toggle = false;
	led_blink = false;
}

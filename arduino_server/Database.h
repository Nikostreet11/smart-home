#ifndef DATABASE_H_
#define DATABASE_H_

#include <SPI.h>
#include <ArduinoJson.h> 			// json library
#include <LinkedPointerList.h>		// linked list library
#include "Profile.h"				// profile class
#include "Room.h"					// room class
#include "Item.h"					// item class
#include "Smartset.h"
#include "PortManager.h"

class Database
{
public:
	// constructor
	Database();
	
	// destructor
	virtual ~Database();

	// debug
	void debugInit();
	void debugProfiles();
	void debugRooms();

	// search
	Profile* searchProfile(String profileId);
	Room* searchRoom(String roomId);
	Item* searchItem(String itemId);
	int searchProfileIndex(String profileId);
	int searchRoomIndex(String roomId);

	// check
	bool isProfileNameTaken(String profileName);
	bool isRoomNameTaken(String roomName);

	// get
	String getProfiles();
	String getProfile(String profileId);
	String getRooms(String profileId);
	String getRoom(String roomId, String profileId);
	String getItems(String roomId, String profileId);
	String getItem(String itemId, String roomId, String profileId);
	String getSmartsets(String profileId, String roomId, String itemId);
	String getSmartset(String smartsetId, String profileId, String roomId);
	String getSmartsetByName(String smartsetName, String roomId, String profileId);
	String getSmartItems(String smartsetId, String roomId, String profileId);
	String getSmartItem(String smartItemId, String smartsetId, String roomId, String profileId);
	String getAvailablePorts();

	// add
	String addProfile(String data);
	String addRoom(String data);
	String addItem(String data);
	String addSmartset(String data);

	// edit
	String editProfile(String id, String data);
	String editRoom(String id, String data);
	String editItem(String id, String data);
	String editSmartset(String smartsetId, String data);

	// remove
	String removeProfile(String id);
	String removeRoom(String id);
	String removeItem(String id, String data);
	String removeSmartset(String smartsetId, String data);

	// status
	String setItemActive(String id, String data);

	// smart
	String addItemToSmartset(String smartsetId, String data);
	String removeItemFromSmartset(String smartsetId, String data);
	String activateSmartset(String roomId, String data);
	String deactivateSmartset(String roomId, String data);

	// json
	void clearJsonDocuments();
	void profileToJson(Profile* profile, JsonObject& json);
	void roomToJson(Room* room, JsonObject& json);
	void itemToJson(Item* item, JsonObject& json);
	void smartsetToJson(Smartset* smartset, JsonObject& json);
	void smartItemToJson(SmartItem* smartItem, JsonObject& json);
	void portToJson(ArduinoPort* port, JsonObject& json);
	void jsonToProfile(JsonObject& json, Profile* profile);
	void jsonToRoom(JsonObject& json, Room* room);
	void jsonToItem(JsonObject& json, Item* item);
	void jsonToSmartset(JsonObject& json, Smartset* smartset);
	//void jsonToItem(JsonObject& json, Smartset* smartset);
	//void jsonToPort(JsonObject& json, ArduinoPort* port);
	
	// getters
	const String& getLog() const;
	int getProfilesSize();
	int getRoomsSize();
	Profile* getProfile(int index);
	Room* getRoom(int index);

	// static constants
	static const int MAX_PROFILES = 32;
	static const int MAX_ROOMS = 32;

private:
	// internal
	void log(JsonDocument& json);
	String toStr(bool value);
	bool toBool(String value);
	
	// resources
	StaticJsonDocument<1024> requestJson;
	StaticJsonDocument<4096> responseJson;
	LinkedPointerList<Profile> profiles;
	LinkedPointerList<Room> rooms;
	PortManager portManager;

	// variables
	String logBuffer;
};

#endif /* DATABASE_H_ */

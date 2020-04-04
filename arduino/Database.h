#ifndef DATABASE_H_
#define DATABASE_H_

#include <SPI.h>
#include <ArduinoJson.h> 			// json library
#include <LinkedPointerList.h>		// linked list library
#include "Profile.h"				// profile class
#include "Room.h"					// room class
#include "Item.h"					// item class
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
	//String getItems(String data);
	String getItems(String roomId, String profileId);
	String getItem(String itemId, String roomId, String profileId);
	String getAvailablePorts();

	// add
	String addProfile(String data);
	String addRoom(String data);
	String addItem(String data);

	// edit
	// TODO: data already contains all the information, so send just "data"
	String editProfile(String id, String data);
	String editRoom(String id, String data);
	String editItem(String id, String data);

	// delete
	// TODO: data already contains all the information, so send just "data"
	String deleteProfile(String id);
	String deleteRoom(String id);
	String deleteItem(String id, String data);

	// status
	// TODO: data already contains all the information, so send just "data"
	String setItemActive(String id, String data);

	// smart
	String setRoomSmart(String roomId, String data);
	String setItemSmart(String id, String data);

	// json
	void clearJsonDocuments();
	void profileToJson(Profile* profile, JsonObject& json);
	void roomToJson(Room* room, JsonObject& json);
	void itemToJson(Item* item, JsonObject& json);
	void portToJson(ArduinoPort* port, JsonObject& json);
	void jsonToProfile(JsonObject& json, Profile* profile);
	void jsonToRoom(JsonObject& json, Room* room);
	void jsonToItem(JsonObject& json, Item* item);
	//void jsonToPort(JsonObject& json, ArduinoPort* port);
	
	// getters
	const String& getLog() const;
	int getProfilesSize();
	int getRoomsSize();
	Profile* getProfile(int index);
	Room* getRoom(int index);

	// static constants
	static const int MAX_PROFILES = 8;
	static const int MAX_ROOMS = 32;
	//static const int MAX_ITEMS_PER_ROOM = 8;

	// public resources
	PortManager portManager;
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

	// variables
	String logBuffer;
};

#endif /* DATABASE_H_ */

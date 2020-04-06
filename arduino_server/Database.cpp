#include "Database.h"

/********** CONSTRUCTOR *********************************************************/

Database::Database()
{
}

/********** DESTRUCTOR **********************************************************/

Database::~Database()
{
	for (int index = 0; index < profiles.size(); index++)
	{
		delete profiles.get(index);
	}

	for (int index = 0; index < rooms.size(); index++)
	{
		delete rooms.get(index);
	}
}

/********** DEBUG ***************************************************************/

void Database::debugInit()
{
	// test profile entries
	String testJson;
	testJson = "{\"task\":\"add\",\"new-profile\":{\"name\":\"John\",\"avatar\":\"avatar-1\"}}";
	addProfile(testJson);
	testJson = "{\"task\":\"add\",\"new-profile\":{\"name\":\"Marie\",\"avatar\":\"avatar-4\"}}";
	addProfile(testJson);

	// test room entries
	testJson = "{\"task\":\"add\",\"new-room\":{\"name\":\"Living_room\",\"icon\":\"034-television\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new-room\":{\"name\":\"Bedroom\",\"icon\":\"002-bed\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new-room\":{\"name\":\"Kitchen\",\"icon\":\"020-kitchen-set\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new-room\":{\"name\":\"Kids'_bedroom\",\"icon\":\"035-bunk\"}}";
	addRoom(testJson);

	// test item entries
	testJson = "{\"task\":\"add\",\"new-item\":{\"name\":\"Light\",\"icon\":\"011-light-bulb\",\"port\":\"none\"},\"room-id\":\"room_0000\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new-item\":{\"name\":\"TV\",\"icon\":\"008-smart-home\",\"port\":\"none\"},\"room-id\":\"room_0000\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new-item\":{\"name\":\"Stereo\",\"icon\":\"032-speakers\",\"port\":\"none\"},\"room-id\":\"room_0000\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new-item\":{\"name\":\"PC\",\"icon\":\"006-real-estate\",\"port\":\"none\"},\"room-id\":\"room_0000\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new-item\":{\"name\":\"Light\",\"icon\":\"011-light-bulb\",\"port\":\"none\"},\"room-id\":\"room_0001\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new-item\":{\"name\":\"Light\",\"icon\":\"011-light-bulb\",\"port\":\"none\"},\"room-id\":\"room_0002\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new-item\":{\"name\":\"Light\",\"icon\":\"011-light-bulb\",\"port\":\"none\"},\"room-id\":\"room_0003\"}";
	addItem(testJson);

	// test late profile entries
	testJson = "{\"task\":\"add\",\"new-profile\":{\"name\":\"Andrew\",\"avatar\":\"avatar-7\"}}";
	addProfile(testJson);
	testJson = "{\"task\":\"add\",\"new-profile\":{\"name\":\"Lisa\",\"avatar\":\"avatar-11\"}}";
	addProfile(testJson);
}

/********** SEARCH **************************************************************/

Profile* Database::searchProfile(String profileId)
{
	for (int index = 0; index < profiles.size(); index++)
	{
		if (profiles.get(index)->getId() == profileId)
		{
			return profiles.get(index);
		}
	}
	return nullptr;
}

Room* Database::searchRoom(String roomId)
{
	for (int index = 0; index < rooms.size(); index++)
	{
		if (rooms.get(index)->getId() == roomId)
		{
			return rooms.get(index);
		}
	}
	return nullptr;
}

Item* Database::searchItem(String id)
{
	for (int index = 0; index < rooms.size(); index++)
	{
		Item* item = rooms.get(index)->searchItem(id);
		
		if (item)
		{
			return item;
		}
	}
	return nullptr;
}

int Database::searchProfileIndex(String profileId)
{
	for (int index = 0; index < profiles.size(); index++)
	{
		if (profiles.get(index)->getId() == profileId)
		{
			return index;
		}
	}
	return -1;
}

int Database::searchRoomIndex(String roomId)
{
	for (int index = 0; index < rooms.size(); index++)
	{
		if (rooms.get(index)->getId() == roomId)
		{
			return index;
		}
	}
	return -1;
}

/********** CHECK ***************************************************************/

bool Database::isProfileNameTaken(String profileName)
{
	for (int index = 0; index < profiles.size(); index++)
	{
		if (profileName == profiles.get(index)->getName())
		{
			return true;
		}
	}
	return false;
}

bool Database::isRoomNameTaken(String roomName)
{
	for (int index = 0; index < rooms.size(); index++)
	{
		if (roomName == rooms.get(index)->getName())
		{
			return true;
		}
	}
	return false;
}

/********** GET *****************************************************************/

String Database::getProfiles()
{
	responseJson["outcome"] = "success";
	
	JsonArray jsonProfiles = responseJson.createNestedArray("profiles");
	for (int index = 0; index < profiles.size(); index++)
	{
		JsonObject jsonProfile = jsonProfiles.createNestedObject();
		profileToJson(getProfile(index), jsonProfile);
	}
	log(responseJson);

	return getLog();
}

String Database::getProfile(String profileId)
{	
	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "user not found";
	}
	else
	{
		// send the profile
		responseJson["outcome"] = "success";
		
		JsonObject jsonProfile = responseJson.createNestedObject("profile");
		profileToJson(profile, jsonProfile);
	}
	log(responseJson);
	
	return getLog();
}

String Database::getRooms(String profileId)
{
	responseJson["outcome"] = "success";
	
	JsonArray jsonRooms = responseJson.createNestedArray("rooms");
	for (int index = 0; index < rooms.size(); index++)
	{
		JsonObject jsonRoom = jsonRooms.createNestedObject();
		roomToJson(getRoom(index), jsonRoom);
	}
	log(responseJson);
	
	return getLog();
}
	
String Database::getRoom(String roomId, String profileId)
{
	Room* room = searchRoom(roomId);
	if (!room)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "room not found";
	}
	else
	{
		// send the room
		responseJson["outcome"] = "success";
		
		JsonObject jsonRoom = responseJson.createNestedObject("room");
		roomToJson(room, jsonRoom);
	}
	log(responseJson);

	return getLog();
}

/*String Database::getItems(String data)
{
	responseJson["outcome"] = "success";
	JsonArray jsonItems = responseJson.createNestedArray("items");

	for (int index1 = 0; index1 < rooms.size(); index1++)
	{
		Room* room = rooms.get(index1);
		for (int index2 = 0; index2 < room->getItemsSize(); index2++)
		{
			JsonObject jsonItem = jsonItems.createNestedObject();
			itemToJson(room->getItem(index2), jsonItem);
		}
	}
	log(responseJson);
	
	return getLog();
}*/

String Database::getItems(String roomId, String profileId)
{
	if (roomId == "")
	{
		responseJson["outcome"] = "success";
		
		JsonArray jsonItems = responseJson.createNestedArray("items");
		for (int index1 = 0; index1 < rooms.size(); index1++)
		{
			Room* room = rooms.get(index1);
			for (int index2 = 0; index2 < room->getItemsSize(); index2++)
			{
				JsonObject jsonItem = jsonItems.createNestedObject();
				itemToJson(room->getItem(index2), jsonItem);
			}
		}
	}
	else
	{
		Profile* profile = searchProfile(profileId);
		if (!profile)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "profile not found";
		}
		else
		{
			Room* room = searchRoom(roomId);
			if (!room)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "room not found";
			}
			else
			{
				responseJson["outcome"] = "success";
				
				JsonArray jsonItems = responseJson.createNestedArray("items");
				for (int index = 0; index < room->getItemsSize(); index++)
				{
					Item* item = room->getItem(index);
					JsonObject jsonItem = jsonItems.createNestedObject();
					itemToJson(item, jsonItem);
					//jsonItem["smart"] = profile->isItemSmart(item, roomName);
				}
			}
		}
	}
	log(responseJson);
	
	return getLog();
}

String Database::getItem(String itemId, String roomId, String profileId)
{
	Item* item = searchItem(itemId);
	if (!item)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "item not found";
	}
	else
	{
		// send the item
		responseJson["outcome"] = "success";
		
		JsonObject jsonItem = responseJson.createNestedObject("item");
		itemToJson(item, jsonItem);
	}
	log(responseJson);

	return getLog();
}

String Database::getAvailablePorts()
{
	responseJson["outcome"] = "success";
	
	JsonArray jsonPorts = responseJson.createNestedArray("ports");
	LinkedPointerList<ArduinoPort>& ports = portManager.getAvailablePorts();
	
	for (int index = 0; index < ports.size(); index++)
	{
		JsonObject jsonPort = jsonPorts.createNestedObject();
		portToJson(ports.get(index), jsonPort);
	}
	log(responseJson);
	
	return getLog();
}

/********** ADD *****************************************************************/

String Database::addProfile(String data)
{
	//Serial.println("*** DEBUG adding profile...");
	//Serial.println(data);
	
	deserializeJson(requestJson, data);
	JsonObject profileJson = requestJson["new-profile"];
	
	if (profiles.size() == Database::MAX_PROFILES)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "max number of profiles reached";
	}
	else
	{
		//Serial.print("*** DEBUG chosen name: ");
		//String tmp = profileJson["name"];
		//Serial.println(tmp);
		
		if (isProfileNameTaken(profileJson["name"]))
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "name unavailable";
		}
		else
		{
			Profile* newProfile = Profile::create(rooms);
			jsonToProfile(profileJson, newProfile);
			profiles.add(newProfile);
			responseJson["outcome"] = "success";
		}
	}
	log(responseJson);
	
	return getLog();
}

String Database::addRoom(String data)
{
	//Serial.println("*** DEBUG adding room...");
	//Serial.println(data);
	
	deserializeJson(requestJson, data);
	JsonObject roomJson = requestJson["new-room"];

	if (rooms.size() == MAX_ROOMS)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "max number of rooms reached";
	}
	else if (isRoomNameTaken(roomJson["name"]))
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "name unavailable";
	}
	else
	{
		Room* newRoom = Room::create();
		jsonToRoom(roomJson, newRoom);
		rooms.add(newRoom);
		for (int index = 0; index < profiles.size(); index++)
		{
			profiles.get(index)->addSmartRoom(newRoom->getId());
		}
		responseJson["outcome"] = "success";
	}
	log(responseJson);
	
	return getLog();
}

String Database::addItem(String data)
{
	//Serial.println("*** DEBUG adding item...");
	//Serial.println(data);
	
	deserializeJson(requestJson, data);
	JsonObject itemJson = requestJson["new-item"];

	String roomId = requestJson["room-id"];

	Room* room = searchRoom(roomId);
	if (room == nullptr)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "room not found";
	}
	else if (room->getItemsSize() == Room::MAX_ITEMS)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "max number of items in the room reached";
	}
	else if (!portManager.isAvailable(itemJson["port"]))
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "port unavailable";
	}
	else
	{
		Item* newItem = Item::create(portManager);
		portManager.lock(itemJson["port"]);
		jsonToItem(itemJson, newItem);
		room->addItem(newItem);
		responseJson["outcome"] = "success";
	}
	log(responseJson);
	
	return getLog();
}

/********** EDIT ****************************************************************/

String Database::editProfile(String id, String data)
{
	deserializeJson(requestJson, data);
	
	Profile* profile = searchProfile(id);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "user not found";
	}
	else
	{
		JsonObject newProfileJson = requestJson["new-profile"];
	
		if (newProfileJson["name"] != profile->getName() &&
				isProfileNameTaken(newProfileJson["name"]))
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "name unavailable";
		}
		else
		{
			jsonToProfile(newProfileJson, profile);
			responseJson["outcome"] = "success";
		}
	}
	log(responseJson);
	
	return getLog();
}

String Database::editRoom(String id, String data)
{
	deserializeJson(requestJson, data);
	
	Room* room = searchRoom(id);
	if (!room)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "room not found";
	}
	else
	{
		JsonObject newRoomJson = requestJson["new-room"];
		
		if (newRoomJson["name"] != room->getName() &&
				isRoomNameTaken(newRoomJson["name"]))
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "name unavailable";
		}
		else
		{
			jsonToRoom(newRoomJson, room);
			/*for (int index = 0; index < profiles.size(); index++)
			{
				profiles.get(index)->editSmartRoom(id, room);
			}*/
			responseJson["outcome"] = "success";
		}
	}
	log(responseJson);
	
	return getLog();
}

String Database::editItem(String id, String data)
{	
	deserializeJson(requestJson, data);
	JsonObject newItemJson = requestJson["new-item"];
	
	Item* item = searchItem(id);
	if (!item)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "item not found";
	}
	else if (newItemJson["port"] != item->getPort() &&
			!portManager.isAvailable(newItemJson["port"]))
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "port unavailable";
	}
	else
	{
		portManager.unlock(item->getPort());
		portManager.lock(newItemJson["port"]);
		jsonToItem(newItemJson, item);
		responseJson["outcome"] = "success";
	}
	log(responseJson);
	
	return getLog();
}

/********** DELETE **************************************************************/

String Database::deleteProfile(String id)
{	
	int index = searchProfileIndex(id);
	if (index == -1)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		delete profiles.get(index);
		profiles.remove(index);
		responseJson["outcome"] = "success";
	}
	log(responseJson);

	return getLog();
}

String Database::deleteRoom(String id)
{
	int index = searchRoomIndex(id);
	if (index == -1)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "room not found";
	}
	else
	{
		delete rooms.get(index);
		rooms.remove(index);
		for (int index = 0; index < profiles.size(); index++)
		{
			profiles.get(index)->deleteSmartRoom(id);
		}
		responseJson["outcome"] = "success";
	}
	log(responseJson);

	return getLog();
}

String Database::deleteItem(String id, String data)
{
	deserializeJson(requestJson, data);
	String roomId = requestJson["room-id"];
	
	Room* room = searchRoom(roomId);
	if (room == nullptr)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "room not found";
	}
	else
	{
		int index = room->searchItemIndex(id);
		if (index == -1)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "item not found";
		}
		else
		{
			portManager.unlock(room->getItem(index)->getPort());
			room->deleteItem(index);
			for (int index = 0; index < profiles.size(); index++)
			{
				profiles.get(index)->deleteSmartItem(id, roomId);
			}
			responseJson["outcome"] = "success";
		}
	}
	log(responseJson);

	return getLog();
}

/********** STATUS **************************************************************/

String Database::setItemActive(String id, String data)
{
	deserializeJson(requestJson, data);
	//String itemId = requestJson["item-id"];
	//JsonObject statusJson = requestJson["item-status"];
	bool active = toBool(requestJson["item-active"]);
	String roomId = requestJson["room-id"];
	
	Room* room = searchRoom(roomId);
	if (!room)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "room not found";
	}
	else
	{
		Item* item = room->getItem(id);
		if (!item)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "item not found";
		}
		else if (item->getPort() == "none")
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "port not set";
		}
		else
		{
			item->setActive(active);
			responseJson["outcome"] = "success";
			responseJson["active"] = toStr(item->isActive());
		}
	}
	log(responseJson);

	return getLog();
}

// smart
String Database::setRoomSmart(String roomId, String data)
{
	deserializeJson(requestJson, data);	
	bool roomSmart = toBool(requestJson["room-smart"]);
	String profileId = requestJson["profile-id"];

	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else {
		Room* room = searchRoom(roomId);
		if (!room)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "room not found";
		}
		else
		{
			SmartRoom* smartRoom = profile->getSmartRoom(roomId);
			if (!smartRoom)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smart room not found";
			}
			/*else if (smartRoom->getSize() == 0)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "no smart items set";
			}*/
			else
			{
				room->setSmart(roomSmart);
				
				for (int index = 0; index < smartRoom->getSize(); index++)
				{
					SmartItem* smartItem = smartRoom->get(index);
					Item* item = room->getItem(smartItem->getId());

					if (roomSmart)
					{
						item->setActive(smartItem->isActive());
					}
					else
					{
						item->setActive(false);
					}
				}
				
				responseJson["outcome"] = "success";
				responseJson["room-smart"] = toStr(roomSmart);
			}
		}
	}
	log(responseJson);

	return getLog();
}

String Database::setItemSmart(String id, String data)
{
	deserializeJson(requestJson, data);
	//String itemId = requestJson["item-id"];
	bool smart = toBool(requestJson["item-smart"]);
	//JsonObject statusJson = requestJson["item-status"];
	bool active = toBool(requestJson["item-active"]);
	String roomId = requestJson["room-id"];
	String profileId = requestJson["profile-id"];

	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		Room* room = searchRoom(roomId);
		if (!room)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "room not found";
		}
		else
		{
			Item* item = room->getItem(id);
			if (!item)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "item not found";
			}
			else
			{
				profile->setItemSmart(id, smart, active, roomId);
				
				responseJson["outcome"] = "success";
			}
		}
	}
	log(responseJson);

	return getLog();
}

/********** JSON ****************************************************************/

void Database::clearJsonDocuments()
{
	requestJson.clear();
	responseJson.clear();
}
	
void Database::profileToJson(Profile* profile, JsonObject& json)
{
	json["id"] = profile->getId();
	json["name"] = profile->getName();
	json["avatar"] = profile->getAvatar();
}

void Database::roomToJson(Room* room, JsonObject& json)
{
	json["id"] = room->getId();
	json["name"] = room->getName();
	json["icon"] = room->getIcon();
	json["smart"] = toStr(room->isSmart());
}

void Database::itemToJson(Item* item, JsonObject& json)
{
	json["id"] = item->getId();
	json["name"] = item->getName();
	json["icon"] = item->getIcon();
	json["port"] = item->getPort();
	
	if (item->isActive())
	{
		json["active"] = "true";
	}
	else
	{
		json["active"] = "false";
	}
}

void Database::portToJson(ArduinoPort* port, JsonObject& json)
{
	json["name"] = port->getName();
	json["number"] = port->getNumber();
}

void Database::jsonToProfile(JsonObject& json, Profile* profile)
{
	profile->setName(json["name"]);
	profile->setAvatar(json["avatar"]);
}

void Database::jsonToRoom(JsonObject& json, Room* room)
{
	room->setName(json["name"]);
	room->setIcon(json["icon"]);
}

void Database::jsonToItem(JsonObject& json, Item* item)
{
	item->setName(json["name"]);
	item->setIcon(json["icon"]);
	item->setPort(json["port"]);
}

/********** GETTERS *************************************************************/

const String& Database::getLog() const
{
	return logBuffer;
}

int Database::getProfilesSize()
{
	return profiles.size();
}

int Database::getRoomsSize()
{
	return rooms.size();
}

Profile* Database::getProfile(int index)
{
	return profiles.get(index);
}

Room* Database::getRoom(int index)
{
	return rooms.get(index);
}

/********** INTERNAL ************************************************************/
void Database::log(JsonDocument& json)
{
	logBuffer = "";
	serializeJson(json, logBuffer);
}

String Database::toStr(bool value)
{
	if (value)
	{
		return "true";
	}
	else
	{
		return "false";
	}
}

bool Database::toBool(String value)
{
	if (value == "true")
	{
		return true;
	}
	else
	{
		return false;
	}
}

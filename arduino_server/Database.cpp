#include "Database.h"

/********** CONSTRUCTOR *********************************************************/

Database::Database()
{
}

/********** DESTRUCTOR **********************************************************/

Database::~Database()
{
	for (int i = 0; i < profiles.size(); i++)
	{
		delete profiles.get(i);
	}

	for (int i = 0; i < rooms.size(); i++)
	{
		delete rooms.get(i);
	}
}

/********** DEBUG ***************************************************************/

void Database::debugInit()
{
	// test profile entries
	String testJson;
	testJson = "{\"task\":\"add\",\"new_profile\":{\"name\":\"John\",\"avatar\":\"avatar-9\"}}";
	addProfile(testJson);
	testJson = "{\"task\":\"add\",\"new_profile\":{\"name\":\"Marie\",\"avatar\":\"avatar-2\"}}";
	addProfile(testJson);

	// test room entries
	testJson = "{\"task\":\"add\",\"new_room\":{\"name\":\"Living_room\",\"icon\":\"034-television\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new_room\":{\"name\":\"Bedroom\",\"icon\":\"002-bed\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new_room\":{\"name\":\"Kitchen\",\"icon\":\"020-kitchen-set\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new_room\":{\"name\":\"Kids'_bedroom\",\"icon\":\"035-bunk\"}}";
	addRoom(testJson);
	/*testJson = "{\"task\":\"add\",\"new_room\":{\"name\":\"Bau1\",\"icon\":\"020-kitchen-set\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new_room\":{\"name\":\"Bau2\",\"icon\":\"035-bunk\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new_room\":{\"name\":\"Bau3\",\"icon\":\"020-kitchen-set\"}}";
	addRoom(testJson);
	testJson = "{\"task\":\"add\",\"new_room\":{\"name\":\"Bau4\",\"icon\":\"035-bunk\"}}";
	addRoom(testJson);*/

	// test item entries
	testJson = "{\"task\":\"add\",\"new_item\":{\"name\":\"Light\",\"icon\":\"011-light-bulb\",\"port\":\"none\"},\"room_id\":\"room_0000\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new_item\":{\"name\":\"TV\",\"icon\":\"008-smart-home\",\"port\":\"none\"},\"room_id\":\"room_0000\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new_item\":{\"name\":\"Stereo\",\"icon\":\"032-speakers\",\"port\":\"none\"},\"room_id\":\"room_0000\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new_item\":{\"name\":\"PC\",\"icon\":\"006-real-estate\",\"port\":\"none\"},\"room_id\":\"room_0000\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new_item\":{\"name\":\"Light\",\"icon\":\"011-light-bulb\",\"port\":\"none\"},\"room_id\":\"room_0001\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new_item\":{\"name\":\"Light\",\"icon\":\"011-light-bulb\",\"port\":\"none\"},\"room_id\":\"room_0002\"}";
	addItem(testJson);
	testJson = "{\"task\":\"add\",\"new_item\":{\"name\":\"Light\",\"icon\":\"011-light-bulb\",\"port\":\"none\"},\"room_id\":\"room_0003\"}";
	addItem(testJson);

	// test late profile entries
	testJson = "{\"task\":\"add\",\"new_profile\":{\"name\":\"Andrew\",\"avatar\":\"avatar-5\"}}";
	addProfile(testJson);
	testJson = "{\"task\":\"add\",\"new_profile\":{\"name\":\"Lisa\",\"avatar\":\"avatar-10\"}}";
	addProfile(testJson);
	/*testJson = "{\"task\":\"add\",\"new_profile\":{\"name\":\"Nico\",\"avatar\":\"avatar-3\"}}";
	addProfile(testJson);
	testJson = "{\"task\":\"add\",\"new_profile\":{\"name\":\"Uba\",\"avatar\":\"avatar-6\"}}";
	addProfile(testJson);
	testJson = "{\"task\":\"add\",\"new_profile\":{\"name\":\"Fede\",\"avatar\":\"avatar-1\"}}";
	addProfile(testJson);
	testJson = "{\"task\":\"add\",\"new_profile\":{\"name\":\"Civi\",\"avatar\":\"avatar-8\"}}";
	addProfile(testJson);*/

	// test smartset entries
	testJson = "{\"task\":\"add\",\"new_smartset\":{\"name\":\"work\"}, \"profile_id\":\"profile_0000\", \"room_id\":\"room_0000\"}";
	addSmartset(testJson);
	testJson = "{\"task\":\"add\",\"new_smartset\":{\"name\":\"study\"}, \"profile_id\":\"profile_0001\", \"room_id\":\"room_0000\"}";
	addSmartset(testJson);

	// test smart item entries
	testJson = "{\"task\":\"add_item\",\"item\":{\"id\":\"item_0000\", \"active\":\"true\"}, \"profile_id\":\"profile_0000\", \"room_id\":\"room_0000\"}";
	addItemToSmartset(String("smartset_0000"), testJson);
	testJson = "{\"task\":\"add_item\",\"item\":{\"id\":\"item_0001\", \"active\":\"false\"}, \"profile_id\":\"profile_0000\", \"room_id\":\"room_0000\"}";
	addItemToSmartset(String("smartset_0000"), testJson);
	testJson = "{\"task\":\"add_item\",\"item\":{\"id\":\"item_0002\", \"active\":\"true\"}, \"profile_id\":\"profile_0000\", \"room_id\":\"room_0000\"}";
	addItemToSmartset(String("smartset_0000"), testJson);
	
	testJson = "{\"task\":\"add_item\",\"item\":{\"id\":\"item_0001\", \"active\":\"false\"}, \"profile_id\":\"profile_0001\", \"room_id\":\"room_0000\"}";
	addItemToSmartset(String("smartset_0001"), testJson);
	testJson = "{\"task\":\"add_item\",\"item\":{\"id\":\"item_0002\", \"active\":\"true\"}, \"profile_id\":\"profile_0001\", \"room_id\":\"room_0000\"}";
	addItemToSmartset(String("smartset_0001"), testJson);
	testJson = "{\"task\":\"add_item\",\"item\":{\"id\":\"item_0003\", \"active\":\"false\"}, \"profile_id\":\"profile_0001\", \"room_id\":\"room_0000\"}";
	addItemToSmartset(String("smartset_0001"), testJson);
}

void Database::debugProfiles()
{
	Serial.println("*** DEBUG profiles");
	for (int i = 0; i < profiles.size(); i++)
	{
		Profile* profile = profiles.get(i);
		Serial.println();
		Serial.print("    ");
		Serial.println(profile->getId());
		Serial.println("    - smart rooms:");
		for (int j = 0; j < profile->getSmartRoomsSize(); j++)
		{
			SmartRoom* smartRoom = profile->getSmartRoom(j);
			Serial.print("        ");
			Serial.println(smartRoom->getId());
			Serial.println("        - smartsets:");
			for (int k = 0; k < smartRoom->getSmartsetsSize(); k++)
			{
				Smartset* smartset = smartRoom->getSmartset(k);
				Serial.print("            ");
				Serial.println(smartset->getId());
				Serial.println("            - smart items:");
				for (int l = 0; l < smartset->getSmartItemsSize(); l++)
				{
					SmartItem* smartItem = smartset->getSmartItem(l);
					Serial.print("                ");
					Serial.println(smartItem->getId());
					Serial.print("                - active:");
					Serial.println(smartItem->isActive());
				}
			}
		}
	}
	Serial.println();
}

void Database::debugRooms()
{
	Serial.println("*** DEBUG rooms");
	for (int i = 0; i < profiles.size(); i++)
	{
		Room* room = rooms.get(i);
		Serial.println();
		Serial.print("    ");
		Serial.println(room->getId());
		
		Serial.println("    - items:");
		for (int j = 0; j < room->getItemsSize(); j++)
		{
			Item* item = room->getItem(j);
			Serial.print("        ");
			Serial.println(item->getId());
			Serial.print("        - active:");
			Serial.println(item->isActive());
		}
		
		Serial.println("    - smartsets:");
		for (int j = 0; j < room->getSmartsetsSize(); j++)
		{
			Smartset* smartset = room->getSmartset(j);
			Serial.print("        ");
			Serial.println(smartset->getId());
			Serial.println("        - smart items:");
			for (int k = 0; k < smartset->getSmartItemsSize(); k++)
			{
				SmartItem* smartItem = smartset->getSmartItem(k);
				Serial.print("            ");
				Serial.println(smartItem->getId());
				Serial.print("            - active:");
				Serial.println(smartItem->isActive());
			}
		}
	}
	Serial.println();
}

/********** SEARCH **************************************************************/

Profile* Database::searchProfile(String profileId)
{
	for (int i = 0; i < profiles.size(); i++)
	{
		Profile* profile = profiles.get(i);
		if (profile->getId() == profileId)
		{
			return profile;
		}
	}
	return nullptr;
}

Room* Database::searchRoom(String roomId)
{
	for (int i = 0; i < rooms.size(); i++)
	{
		Room* room = rooms.get(i);
		if (room->getId() == roomId)
		{
			return room;
		}
	}
	return nullptr;
}

Item* Database::searchItem(String id)
{
	for (int i = 0; i < rooms.size(); i++)
	{
		Room* room = rooms.get(i);
		for (int j = 0; j < room->getItemsSize(); j++)
		{
			Item* item = room->getItem(j);
			if (item->getId() == id)
			{
				return item;
			}
		}
	}
	return nullptr;
}

int Database::searchProfileIndex(String profileId)
{
	for (int i = 0; i < profiles.size(); i++)
	{
		if (profiles.get(i)->getId() == profileId)
		{
			return i;
		}
	}
	return -1;
}

int Database::searchRoomIndex(String roomId)
{
	for (int i = 0; i < rooms.size(); i++)
	{
		if (rooms.get(i)->getId() == roomId)
		{
			return i;
		}
	}
	return -1;
}

/********** CHECK ***************************************************************/

bool Database::isProfileNameTaken(String profileName)
{
	for (int i = 0; i < profiles.size(); i++)
	{
		if (profileName == profiles.get(i)->getName())
		{
			return true;
		}
	}
	return false;
}

bool Database::isRoomNameTaken(String roomName)
{
	for (int i = 0; i < rooms.size(); i++)
	{
		if (rooms.get(i)->getName() == roomName)
		{
			return true;
		}
	}
	return false;
}

/********** GET *****************************************************************/

String Database::getDeviceInfo()
{
	responseJson["outcome"] = "success";
	JsonObject jsonDeviceInfo = responseJson.createNestedObject("device_info");
	jsonDeviceInfo["ip_address"] = deviceIpAddress;
	jsonDeviceInfo["name"] = deviceName;
	log(responseJson);
	return getLog();
}

String Database::getProfiles()
{
	responseJson["outcome"] = "success";
	
	JsonArray jsonProfiles = responseJson.createNestedArray("profiles");
	for (int i = 0; i < profiles.size(); i++)
	{
		JsonObject jsonProfile = jsonProfiles.createNestedObject();
		profileToJson(getProfile(i), jsonProfile);
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
	JsonObject jsonDevice = responseJson.createNestedObject("device");
	jsonDevice["ip_address"] = deviceIpAddress;
	jsonDevice["name"] = deviceName;
	
	JsonArray jsonRooms = responseJson.createNestedArray("rooms");
	for (int i = 0; i < rooms.size(); i++)
	{
		JsonObject jsonRoom = jsonRooms.createNestedObject();
		roomToJson(getRoom(i), jsonRoom);
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
		JsonObject jsonDevice = jsonRoom.createNestedObject("device");
		jsonDevice["ip_address"] = deviceIpAddress;
		jsonDevice["name"] = deviceName;
	}
	log(responseJson);

	return getLog();
}

String Database::getItems(String roomId, String profileId)
{
	if (roomId == "")
	{
		responseJson["outcome"] = "success";
		
		JsonArray jsonItems = responseJson.createNestedArray("items");
		for (int i = 0; i < rooms.size(); i++)
		{
			Room* room = rooms.get(i);
			for (int j = 0; j < room->getItemsSize(); j++)
			{
				JsonObject jsonItem = jsonItems.createNestedObject();
				itemToJson(room->getItem(j), jsonItem);
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
				for (int i = 0; i < room->getItemsSize(); i++)
				{
					Item* item = room->getItem(i);
					JsonObject jsonItem = jsonItems.createNestedObject();
					itemToJson(item, jsonItem);
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

String Database::getSmartsets(String profileId, String roomId, String itemId)
{
	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			// send the smartsets
			responseJson["outcome"] = "success";

			JsonArray jsonSmartsets = responseJson.createNestedArray("smartsets");
			for (int i = 0; i < smartRoom->getSmartsetsSize(); i++)
			{
				Smartset* smartset = smartRoom->getSmartset(i);
				if (itemId == "null" || smartset->getSmartItem(itemId) != nullptr)
				{
					JsonObject jsonSmartset = jsonSmartsets.createNestedObject();
					smartsetToJson(smartset, jsonSmartset);
				}
			}
		}
	}
	log(responseJson);

	return getLog();
}

String Database::getActiveSmartsets(String roomId) {
	Room* room = searchRoom(roomId);
	if (!room)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "room not found";
	}
	else
	{
		// send the active smartsets
		responseJson["outcome"] = "success";

		JsonArray jsonSmartsets = responseJson.createNestedArray("active_smartsets");
		for (int i = 0; i < room->getSmartsetsSize(); i++)
		{
			Smartset* smartset = room->getSmartset(i);
			JsonObject jsonSmartset = jsonSmartsets.createNestedObject();
			smartsetToJson(smartset, jsonSmartset);
		}
	}
	log(responseJson);

	return getLog();
}

String Database::getSmartset(String smartsetId, String profileId, String roomId)
{
	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			Smartset* smartset = smartRoom->getSmartset(smartsetId);
			if (!smartset)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
				// send the smartset
				responseJson["outcome"] = "success";
				
				JsonObject jsonSmartset = responseJson.createNestedObject("smartset");
				smartsetToJson(smartset, jsonSmartset);
			}
		}
	}
	log(responseJson);

	return getLog();
}

String Database::getSmartsetByName(String smartsetName, String roomId, String profileId)
{
	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			Smartset* smartset = smartRoom->getSmartsetByName(smartsetName);
			if (!smartset)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
				// send the smartset
				responseJson["outcome"] = "success";
				
				JsonObject jsonSmartset = responseJson.createNestedObject("smartset");
				smartsetToJson(smartset, jsonSmartset);
			}
		}
	}
	log(responseJson);

	return getLog();
}

String Database::getSmartItems(String smartsetId, String roomId, String profileId)
{
	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			Smartset* smartset = smartRoom->getSmartset(smartsetId);
			if (!smartset)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
				// send the smart items
				responseJson["outcome"] = "success";
	
				JsonArray jsonSmartItems = responseJson.createNestedArray("smart_items");
				for (int i = 0; i < smartset->getSmartItemsSize(); i++)
				{
					SmartItem* smartItem = smartset->getSmartItem(i);
					JsonObject jsonSmartItem = jsonSmartItems.createNestedObject();
					smartItemToJson(smartItem, jsonSmartItem);
				}
			}
		}
	}
	log(responseJson);
	
	return getLog();
}

String Database::getSmartItem(
		String smartItemId, String smartsetId, String roomId, String profileId)
{
	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			Smartset* smartset = smartRoom->getSmartset(smartsetId);
			if (!smartset)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
				SmartItem* smartItem = smartset->getSmartItem(smartItemId);
				if (!smartItem)
				{
					responseJson["outcome"] = "failure";
					responseJson["error"] = "smart item not found";
				}
				else
				{
					// send the smart item
					responseJson["outcome"] = "success";
					
					JsonObject jsonSmartItem = responseJson.createNestedObject("smart_item");
					smartItemToJson(smartItem, jsonSmartItem);
				}
			}
		}
	}
	log(responseJson);
	
	return getLog();
}

String Database::getAvailablePorts()
{
	responseJson["outcome"] = "success";
	
	JsonArray jsonPorts = responseJson.createNestedArray("ports");
	LinkedPointerList<ArduinoPort>& ports = portManager.getAvailablePorts();
	
	for (int i = 0; i < ports.size(); i++)
	{
		JsonObject jsonPort = jsonPorts.createNestedObject();
		portToJson(ports.get(i), jsonPort);
	}
	log(responseJson);
	
	return getLog();
}

/********** UPDATE **************************************************************/

String Database::updateProfiles(String data)
{
	deserializeJson(requestJson, data);
	JsonArray profilesJson = requestJson["profiles"];
	LinkedPointerList<String> errors;
	for (int i = 0; i < profilesJson.size(); i++)
	{
		JsonObject profileJson = profilesJson[i];
		String profileId = profileJson["id"];
		Profile* profile = searchProfile(profileId);
		if (!profile)
		{
			// add profile
			if (profiles.size() == Profile::MAX_PROFILES)
			{
				String error = profileId + ": max number of profiles reached";
				errors.add(new String(error));
			}
			else
			{
				if (isProfileNameTaken(profileJson["name"]))
				{
					String error = profileId + ": name unavailable";
					errors.add(new String(error));
				}
				else
				{
					Profile* newProfile = Profile::create(rooms, profileId);
					if (!newProfile)
					{
						String error = profileId + ": unable to create a profile";
						errors.add(new String(error));
					}
					else
					{
						jsonToProfile(profileJson, newProfile);
						profiles.add(newProfile);
					}
				}
			}
		}
		else
		{
			if (profileJson["last_modified"] > profile->getLastEdit()) {
				jsonToProfile(profileJson, profile);
			}
		}
	}
	if (errors.size() == 0)
	{
		responseJson["outcome"] = "success";
	}
	else
	{
		responseJson["outcome"] = "failure";
		String errorsString = "";
		for (int i = 0; i < errors.size(); i++)
		{
			if (i > 0)
			{
				errorsString += ", ";
			}
			errorsString += *(errors.get(i));
		}
		responseJson["error"] = errorsString;
		while (errors.size() > 0)
		{
			delete errors.pop();
		}
	}
	
	log(responseJson);
	return getLog();
}

/********** ADD *****************************************************************/

String Database::addProfile(String data)
{
	deserializeJson(requestJson, data);
	JsonObject profileJson = requestJson["new_profile"];
	
	if (profiles.size() == Profile::MAX_PROFILES)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "max number of profiles reached";
	}
	else
	{
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
			responseJson["profile_id"] = newProfile->getId();
		}
	}
	log(responseJson);
	
	return getLog();
}

String Database::addRoom(String data)
{
	deserializeJson(requestJson, data);
	JsonObject roomJson = requestJson["new_room"];

	if (rooms.size() == Room::MAX_ROOMS)
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

		// adds the related smart rooms
		for (int i = 0; i < profiles.size(); i++)
		{
			Profile* profile = profiles.get(i);
			profile->addSmartRoom(newRoom->getId());
		}
		
		responseJson["outcome"] = "success";
	}
	log(responseJson);
	
	return getLog();
}

String Database::addItem(String data)
{
	deserializeJson(requestJson, data);
	JsonObject itemJson = requestJson["new_item"];

	String roomId = requestJson["room_id"];

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

String Database::addSmartset(String data)
{	
	deserializeJson(requestJson, data);
	
	JsonObject smartsetJson = requestJson["new_smartset"];
	String profileId = requestJson["profile_id"];
	String roomId = requestJson["room_id"];

	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else if (smartRoom->getSmartsetsSize() == Room::MAX_ITEMS)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "max number of saved smartsets in the room reached";
		}
		else
		{
			Smartset* smartset = Smartset::create(profile);
			jsonToSmartset(smartsetJson, smartset);
			smartRoom->addSmartset(smartset);
			
			responseJson["outcome"] = "success";
			responseJson["smartset_id"] = smartset->getId();
		}
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
		JsonObject newProfileJson = requestJson["new_profile"];
	
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
		JsonObject newRoomJson = requestJson["new_room"];
		
		if (newRoomJson["name"] != room->getName() &&
				isRoomNameTaken(newRoomJson["name"]))
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "name unavailable";
		}
		else
		{
			jsonToRoom(newRoomJson, room);
			
			responseJson["outcome"] = "success";
		}
	}
	log(responseJson);
	
	return getLog();
}

String Database::editItem(String id, String data)
{
	deserializeJson(requestJson, data);
	JsonObject newItemJson = requestJson["new_item"];
	
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

String Database::editSmartset(String smartsetId, String data)
{
	deserializeJson(requestJson, data);
	JsonObject smartsetJson = requestJson["new_smartset"];
	String profileId = requestJson["profile_id"];
	String roomId = requestJson["room_id"];

	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			Smartset* smartset = smartRoom->getSmartset(smartsetId);
			if (!smartset)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
				jsonToSmartset(smartsetJson, smartset);

				// updates all the related active smartsets
				Room* room = searchRoom(roomId);
				Smartset* activeSmartset = room->getSmartset(smartsetId);
				if (activeSmartset)
				{
					jsonToSmartset(smartsetJson, activeSmartset);
				}
				
				responseJson["outcome"] = "success";
			}
		}
	}
	log(responseJson);
	
	return getLog();
}

/********** REMOVE **************************************************************/

String Database::removeProfile(String id)
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

String Database::removeRoom(String id)
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

		// removes the related smart rooms
		for (int i = 0; i < profiles.size(); i++)
		{
			Profile* profile = profiles.get(i);
			int index = profile->getSmartRoomIndex(id);
			profile->removeSmartRoom(index);
		}
		
		responseJson["outcome"] = "success";
	}
	log(responseJson);

	return getLog();
}

String Database::removeItem(String id, String data)
{
	deserializeJson(requestJson, data);
	String roomId = requestJson["room_id"];
	
	Room* room = searchRoom(roomId);
	if (room == nullptr)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "room not found";
	}
	else
	{
		int index = room->getItemIndex(id);
		if (index == -1)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "item not found";
		}
		else
		{
			portManager.unlock(room->getItem(index)->getPort());
			room->removeItem(index);

			// deletes every related smart item
			for (int i = 0; i < profiles.size(); i++)
			{
				SmartRoom* smartRoom = profiles.get(i)->getSmartRoom(roomId);
				for (int j = 0; j < smartRoom->getSmartsetsSize(); j++)
				{
					Smartset* smartset = smartRoom->getSmartset(j);
					int index = smartset->getSmartItemIndex(id);
					if (index != -1)
					{
						smartset->removeSmartItem(index);
					}
				}
			}
			
			responseJson["outcome"] = "success";
		}
	}
	log(responseJson);

	return getLog();
}

String Database::removeSmartset(String smartsetId, String data)
{
	deserializeJson(requestJson, data);
	String profileId = requestJson["profile_id"];
	String roomId = requestJson["room_id"];

	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			int index = smartRoom->getSmartsetIndex(smartsetId);
			if (index == -1)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
				smartRoom->removeSmartset(index);

				// removes all the related active smartsets
				Room* room = searchRoom(roomId);
				int index = room->getSmartsetIndex(smartsetId);
				if (index != -1)
				{
					room->removeSmartset(index);
				}
				
				responseJson["outcome"] = "success";
			}
		}
	}
	log(responseJson);
	
	return getLog();
}

/********** STATUS **************************************************************/

String Database::setItemActive(String id, String data)
{
	deserializeJson(requestJson, data);
	bool active = toBool(requestJson["item_active"]);
	String roomId = requestJson["room_id"];
	
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
			bool found = false;
			for (int i = 0; i < room->getSmartsetsSize(); i++)
			{
				Smartset* controlset = room->getSmartset(i);
				int index = controlset->getSmartItemIndex(item->getId());
				if (index != -1)
				{
					found = true;
					controlset->removeSmartItem(index);
				}
			}
			item->setActive(active);
			
			if (found)
			{
				responseJson["outcome"] = "partial_success";
				responseJson["message"] = "item removed from some smartsets";
			}
			else
			{
				responseJson["outcome"] = "success";
			}
			responseJson["active"] = toStr(item->isActive());
		}
	}
	log(responseJson);

	return getLog();
}

/********** SMART ***************************************************************/

String Database::addItemToSmartset(String smartsetId, String data)
{
	deserializeJson(requestJson, data);
	JsonObject itemJson = requestJson["item"];
	String itemId = itemJson["id"];
	String itemActive = itemJson["active"];
	String profileId = requestJson["profile_id"];
	String roomId = requestJson["room_id"];
	
	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			Smartset* smartset = smartRoom->getSmartset(smartsetId);
			if (!smartset)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
				responseJson["outcome"] = "success";

				SmartItem* smartItem = smartset->getSmartItem(itemId);
				if (!smartItem)
				{
					smartItem = SmartItem::create();
					smartItem->setId(itemId);
					smartset->addSmartItem(smartItem);
				}
				
				smartItem->setActive(toBool(itemActive));
			}
		}
	}
	log(responseJson);

	return getLog();
}

String Database::removeItemFromSmartset(String smartsetId, String data)
{
	deserializeJson(requestJson, data);
	String itemId = requestJson["item_id"];
	String roomId = requestJson["room_id"];
	String profileId = requestJson["profile_id"];
	
	Profile* profile = searchProfile(profileId);
	if (!profile)
	{
		responseJson["outcome"] = "failure";
		responseJson["error"] = "profile not found";
	}
	else
	{
		SmartRoom* smartRoom = profile->getSmartRoom(roomId);
		if (!smartRoom)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "smart room not found";
		}
		else
		{
			Smartset* smartset = smartRoom->getSmartset(smartsetId);
			if (!smartset)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
				int index = smartset->getSmartItemIndex(itemId);
				if (index == -1)
				{
					responseJson["outcome"] = "failure";
					responseJson["error"] = "smartItem not found";
				}
				else
				{
					smartset->removeSmartItem(index);
					
					responseJson["outcome"] = "success";
				}
			}
		}
	}
	log(responseJson);

	return getLog();
}
	
String Database::activateSmartset(String roomId, String data)
{
	deserializeJson(requestJson, data);
	String smartsetId = requestJson["smartset_id"];
	String profileId = requestJson["profile_id"];

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
			SmartRoom* smartRoom = profile->getSmartRoom(roomId);
			if (!smartRoom)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smart room not found";
			}
			else
			{
				Smartset* targetset = smartRoom->getSmartset(smartsetId);
				if (!targetset)
				{
					responseJson["outcome"] = "failure";
					responseJson["error"] = "smartset not found";
				}
				else
				{
					Smartset* insertset = Smartset::copy(targetset);
					
					bool conflict = false; // just for debug
					bool modified = false;
					
					for (int i = 0; i < targetset->getSmartItemsSize(); i++)
					{
						SmartItem* target = targetset->getSmartItem(i);

						bool found = false;
						bool active = false;
						for (int j = 0; j < room->getSmartsetsSize(); j++)
						{
							Smartset* controlset = room->getSmartset(j);
							SmartItem* control = controlset->getSmartItem(target->getId());
							if (control)
							{
								// debug
								if (found)
								{
									if (active != control->isActive())
									{
										conflict = true;
									}
								}
								// end debug
								found = true;
								active = control->isActive();
							}
						}

						if (found && target->isActive() != active)
						{
							int index = insertset->getSmartItemIndex(target->getId());
							insertset->removeSmartItem(index);
							modified = true;
						}
					}

					if (conflict)
					{
						responseJson["outcome"] = "failure";
						responseJson["error"] = "conflict found on previous smartsets";
					}
					else if (insertset->getSmartItemsSize() == 0)
					{
						responseJson["outcome"] = "failure";
						responseJson["error"] = "all the items are currently unavailable";
					}
					else if (modified)
					{
						room->addSmartset(insertset);
						
						responseJson["outcome"] = "partial_success";
						responseJson["reason"] = "some items are currently unavailable";
					}
					else
					{
						room->addSmartset(insertset);
						
						responseJson["outcome"] = "success";
					}
				}
			}
		}
	}
	log(responseJson);

	return getLog();
}

String Database::deactivateSmartset(String roomId, String data)
{
	deserializeJson(requestJson, data);
	String smartsetId = requestJson["smartset_id"];
	String profileId = requestJson["profile_id"];

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
			bool found = false;
			for (int i = 0; i < room->getSmartsetsSize(); i++)
			{
				Smartset* smartset = room->getSmartset(i);
				if (smartset->getOwner() == profile &&
						smartset->getId() == smartsetId)
				{
					found = true;
					room->removeSmartset(i);
				}
			}
			
			if (!found)
			{
				responseJson["outcome"] = "failure";
				responseJson["error"] = "smartset not found";
			}
			else
			{
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
	json["last_edit"] = profile->getLastEdit();
}

void Database::roomToJson(Room* room, JsonObject& json)
{
	json["id"] = room->getId();
	json["name"] = room->getName();
	json["icon"] = room->getIcon();
	
	/*JsonArray smartsetsJson = json.createNestedArray("smartsets");
	for (int i = 0; i < room->getSmartsetsSize(); i++)
	{
		JsonObject smartsetJson = smartsetsJson.createNestedObject();
		smartsetToJson(room->getSmartset(i), smartsetJson);
	}*/
}

void Database::itemToJson(Item* item, JsonObject& json)
{
	json["id"] = item->getId();
	json["name"] = item->getName();
	json["icon"] = item->getIcon();
	//json["port"] = item->getPort();
	json["active"] = toStr(item->isActive());
}

void Database::controlToJson(Control* control, JsonObject& json)
{
	json["name"] = control->getName();
	json["port"] = control->getPort();
	json["type"] = control->getStringType();
	
	switch (control->getType())
	{
	case Control::Type::Binary:
		{
			Binary* binary = (Binary*) control;
			json["value"] = toStr(binary->getValue());
		}
		break;
		
	case Control::Type::Linear:
		{
			Linear* linear = (Linear*) control;
			json["min"] = linear->getMin();
			json["max"] = linear->getMax();
			json["value"] = linear->getValue();
		}
		break;
	}
}

void Database::smartsetToJson(Smartset* smartset, JsonObject& json)
{
	json["id"] = smartset->getId();
	json["name"] = smartset->getName();
	json["owner_id"] = smartset->getOwner()->getId();
}

void Database::smartItemToJson(SmartItem* smartItem, JsonObject& json)
{
	json["id"] = smartItem->getId();
	json["active"] = toStr(smartItem->isActive());
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
	if (json.containsKey("last_edit"))
	{
		profile->setLastEdit(json["last_edit"]);
	}
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

void Database::jsonToControl(JsonObject& json, Control* control)
{
	control->setPort(json["port"]);
	control->setActive(toBool(json["active"]));
	if (control->getType() == Control::Type::Linear)
	{
		/*Linear* linear = dynamic_cast<Linear*>(control);
		if (linear)
		{
			linear->setMin(json["min"]);
			linear->setMax(json["max"]);
			linear->setValue(json["value"]);
		}*/
	}
}

void Database::jsonToSmartset(JsonObject& json, Smartset* smartset)
{
	smartset->setName(json["name"]);
}

/********** GETTERS *************************************************************/

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

const String& Database::getLog() const
{
	return logBuffer;
}

const String& Database::getDeviceIpAddress() const
{
	return deviceIpAddress;
}

void Database::setDeviceIpAddress(const String& deviceIpAddress)
{
	this->deviceIpAddress = deviceIpAddress;
}

const String& Database::getDeviceName() const
{
	return deviceName;
}

void Database::setDeviceName(const String& deviceName)
{
	this->deviceName = deviceName;
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

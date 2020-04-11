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
	for (int index1 = 0; index1 < rooms.size(); index1++)
	{
		Room* room = rooms.get(index1);
		for (int index2 = 0; index2 < room->getSize(); index2++)
		{
			Item* item = room->get(index2);
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
			for (int index2 = 0; index2 < room->getSize(); index2++)
			{
				JsonObject jsonItem = jsonItems.createNestedObject();
				itemToJson(room->get(index2), jsonItem);
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
				for (int index = 0; index < room->getSize(); index++)
				{
					Item* item = room->get(index);
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
			for (int index = 0; index < smartRoom->getSmartsetsSize(); index++)
			{
				Smartset* smartset = smartRoom->getSmartset(index);
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
	else if (room->getSize() == Room::MAX_ITEMS)
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
		room->add(newItem);
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
				// TODO: update the active smartsets of the rooms
				
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
		for (int index = 0; index < profiles.size(); index++)
		{
			profiles.get(index)->removeSmartRoom(id);
		}
		responseJson["outcome"] = "success";
	}
	log(responseJson);

	return getLog();
}

String Database::removeItem(String id, String data)
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
		int index = room->getIndex(id);
		if (index == -1)
		{
			responseJson["outcome"] = "failure";
			responseJson["error"] = "item not found";
		}
		else
		{
			portManager.unlock(room->get(index)->getPort());
			room->remove(index);
			for (int index = 0; index < profiles.size(); index++)
			{
				profiles.get(index)->removeSmartItem(id, roomId);
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
				// TODO: update the active smartsets of the rooms
				
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
		Item* item = room->get(id);
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
	String itemId = requestJson["id"];
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
					
					for (int index1 = 0; index1 < targetset->getSmartItemsSize(); index1++)
					{
						SmartItem* target = targetset->getSmartItem(index1);

						bool found = false;
						bool active = false;
						for (int index2 = 0; index2 < room->getSmartsetsSize(); index2++)
						{
							Smartset* controlset = room->getSmartset(index2);
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
						}
					}

					if (conflict)
					{
						responseJson["failure"] = "success";
						responseJson["error"] = "conflict found on previous smartsets";
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
			for (int index = 0; index < room->getSmartsetsSize(); index++)
			{
				Smartset* smartset = room->getSmartset(index);
				if (smartset->getOwner() == profile && smartset->getId() == smartsetId)
				{
					found = true;
					room->removeSmartset(index);
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
}

void Database::roomToJson(Room* room, JsonObject& json)
{
	json["id"] = room->getId();
	json["name"] = room->getName();
	json["icon"] = room->getIcon();
	
	JsonArray smartsetsJson = json.createNestedArray("smartsets");
	for (int index = 0; index < room->getSmartsetsSize(); index++)
	{
		JsonObject smartsetJson = smartsetsJson.createNestedObject();
		smartsetToJson(room->getSmartset(index), smartsetJson);
	}
}

void Database::itemToJson(Item* item, JsonObject& json)
{
	json["id"] = item->getId();
	json["name"] = item->getName();
	json["icon"] = item->getIcon();
	json["port"] = item->getPort();
	json["active"] = toStr(item->isActive());
}

void Database::smartsetToJson(Smartset* smartset, JsonObject& json)
{
	json["id"] = smartset->getId();
	json["name"] = smartset->getName();
	
	JsonObject ownerJson = json.createNestedObject("owner");
	profileToJson(smartset->getOwner(), ownerJson);
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

void Database::jsonToSmartset(JsonObject& json, Smartset* smartset)
{
	smartset->setName(json["name"]);
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

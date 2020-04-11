#include "Profile.h"

int Profile::currentId = 0;

// static constructors
Profile* Profile::create(LinkedPointerList<Room>& rooms)
{
	if (Profile::currentId < Profile::MAX_PROFILES)
	{
		return new Profile(rooms);
	}
	else
	{
		return nullptr;
	}
}

// destructor
Profile::~Profile()
{
}

// update
void Profile::updateSmartRooms(LinkedPointerList<Room>& rooms)
{
	for (int index1 = 0; index1 < rooms.size(); index1++)
	{
		Room* room = rooms.get(index1);
		bool found = false;
		for (int index2 = 0; index2 < smartRooms.size(); index2++)
		{
			SmartRoom* smartRoom = smartRooms.get(index2);
			if (smartRoom->getId() == room->getId())
			{
				found = true;
			}
		}

		if (!found)
		{
			smartRooms.add(SmartRoom::create(room->getId()));
		}
	}

	for (int index1 = 0; index1 < smartRooms.size(); index1++)
	{
		SmartRoom* smartRoom = smartRooms.get(index1);
		bool found = false;
		for (int index2 = 0; index2 < rooms.size(); index2++)
		{
			Room* room = rooms.get(index2);
			if (room->getId() == smartRoom->getId())
			{
				found = true;
			}
		}

		if (!found)
		{
			int index = getSmartRoomIndex(smartRoom->getId());
			smartRooms.remove(index);
		}
	}
}

// smart add
bool Profile::addSmartRoom(String roomId)
{
	return smartRooms.add(SmartRoom::create(roomId));
}

bool Profile::addSmartItem(String itemId, bool active, String roomId, String smartsetId)
{
	for (int index = 0; index < smartRooms.size(); index++)
	{
		SmartRoom* smartRoom = smartRooms.get(index);
		if (smartRoom->getId() == roomId)
		{
			for (int index2 = 0; index2 < smartRoom->getSmartsetsSize(); index2++)
			{
				Smartset* smartset = smartRoom->getSmartset(index);
				if (smartset->getId() == smartsetId)
				{
					smartset->addSmartItem(SmartItem::create(itemId, active));
					return true;
				}
			}
			return false;
		}
	}
	return false;
}

// smart edit
/*bool Profile::editSmartRoom(String roomName, Room* newRoom)
{
	for (int index = 0; index < smartRooms.size(); index++)
	{
		SmartRoom* smartRoom = smartRooms.get(index);
		if (smartRoom->getName() == roomName)
		{
			smartRoom->updateFrom(newRoom);
			return true;
		}
	}
	return false;
}*/

/*
bool Profile::editSmartItem(String itemId, Item* newItem)
{
	for (int index1 = 0; index1 < smartRooms.size(); index1++)
	{
		SmartRoom* smartRoom = smartRooms.get(index1);
		for (int index2 = 0; index2 < smartRoom->getSmartItemsSize(); index2++)
		{
			SmartItem* smartItem = room->getSmartItem(index2);
			if (smartItem->getId() == itemId)
			{
				smartItem->updateFrom(newItem);
				return true;
			}
		}
	}
	return false;
}
*/

// smart remove
bool Profile::removeSmartRoom(String roomId)
{
	for (int index = 0; index < smartRooms.size(); index++)
	{
		if (smartRooms.get(index)->getId() == roomId)
		{
			SmartRoom* smartRoom = smartRooms.remove(index);
			if (smartRoom)
			{
				delete smartRoom;
				return true;
			}
		}
	}
	return false;
}

bool Profile::removeSmartItem(String itemId, String roomId)
{
	/*
	for (int index1 = 0; index1 < smartRooms.size(); index1++)
	{
		SmartRoom* smartRoom = smartRooms.get(index1);
		if (smartRoom->getId() == roomId)
		{
			for (int index2 = 0; index2 < smartRoom->getSize(); index2++)
			{
				SmartItem* smartItem = smartRoom->get(index2);
				if (smartItem->getId() == itemId)
				{
					return smartRoom->remove(index2);
				}
			}
			return false;
		}
	}
	*/
	return false;
}

// smart
bool Profile::isItemSmart(String itemId, String roomId)
{
	/* TODO
	for (int index1 = 0; index1 < smartRooms.size(); index1++)
	{
		SmartRoom* smartRoom = smartRooms.get(index1);
		if (smartRoom->getId() == roomId)
		{
			for (int index2 = 0; index2 < smartRoom->getSize(); index2++)
			{
				SmartItem* smartItem = smartRoom->get(index2);
				if (smartItem->getId() == itemId)
				{
					return true;
				}
			}
			return false;
		}
	}
	*/
	return false;
}

bool Profile::setItemSmart(String itemId, bool smart, bool active, String roomId)
{
	/* TODO
	for (int index1 = 0; index1 < smartRooms.size(); index1++)
	{
		SmartRoom* smartRoom = smartRooms.get(index1);
		if (smartRoom->getId() == roomId)
		{
			for (int index2 = 0; index2 < smartRoom->getSize(); index2++)
			{
				SmartItem* smartItem = smartRoom->get(index2);
				if (smartItem->getId() == itemId)
				{
					if (smart)
					{
						smartItem->setActive(active);
						return true;
					}
					else
					{
						smartRoom->remove(index2);
						return true;
					}
				}
			}

			if (smart)
			{
				addSmartItem(itemId, active, roomId);
				return true;
			}
			else
			{
				return true;
			}
		}
	}
	*/
	return false;
}

// getters / setters
int Profile::getTrueId() const
{
	return id;
}

String Profile::getId() const
{
	String returnId = "profile_";
	String stringId = String(id);
	
	for (int count = 0; count < (4 - stringId.length()); count++)
	{
		returnId += '0';
	}

	returnId += stringId;
	
	return returnId;
}

const String& Profile::getName() const
{
	return name;
}

void Profile::setName(const String& name)
{
	this->name = name;
}

const String& Profile::getAvatar() const
{
	return avatar;
}

void Profile::setAvatar(const String& avatar)
{
	this->avatar = avatar;
}

SmartRoom* Profile::getSmartRoom(int index)
{
	return smartRooms.get(index);
}

SmartRoom* Profile::getSmartRoom(const String& roomId)
{
	for (int index = 0; index < smartRooms.size(); index++)
	{
		SmartRoom* smartRoom = smartRooms.get(index);
		if (smartRoom->getId() == roomId)
		{
			return smartRoom;
		}
	}
	return nullptr;
}

int Profile::getSmartRoomIndex(const String& roomId)
{
	for (int index = 0; index < smartRooms.size(); index++)
	{
		SmartRoom* smartRoom = smartRooms.get(index);
		if (smartRoom->getId() == roomId)
		{
			return index;
		}
	}
	return -1;
}

// constructor
Profile::Profile(LinkedPointerList<Room>& rooms) :
		id(Profile::currentId),
		name("default"),
		avatar("default")
{
	for (int index = 0; index < rooms.size(); index++)
	{
		smartRooms.add(SmartRoom::create(rooms.get(index)->getId()));
	}
	
	Profile::currentId++;
}

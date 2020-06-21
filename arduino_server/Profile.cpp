#include "Profile.h"

IdManager Profile::idManager(Profile::MAX_PROFILES);

// static constructors
Profile* Profile::create(LinkedPointerList<Room>& rooms)
{
	if (idManager.isIdAvailable())
	{
		return new Profile(rooms);
	}
	else
	{
		return nullptr;
	}
}

Profile* Profile::create(LinkedPointerList<Room>& rooms, String id)
{
	int trueId = toTrueId(id);
	if (idManager.isIdAvailable(trueId))
	{
		return new Profile(rooms, trueId);
	}
	else
	{
		return nullptr;
	}
}

// destructor
Profile::~Profile()
{
	for (int i = 0; i < smartRooms.size(); i++)
	{
		delete smartRooms.get(i);
	}
	
	idManager.releaseId(id);
}

// smart add
bool Profile::addSmartRoom(String roomId)
{
	return smartRooms.add(SmartRoom::create(roomId));
}

bool Profile::removeSmartRoom(int index)
{
	if (0 <= index && index <= smartRooms.size())
	{
		delete smartRooms.remove(index);
		return true;
	}

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
	lastEdit = now();
}

const String& Profile::getAvatar() const
{
	return avatar;
}

void Profile::setAvatar(const String& avatar)
{
	this->avatar = avatar;
	lastEdit = now();
}

unsigned long Profile::getLastEdit()
{
	return lastEdit;
}

void Profile::setLastEdit(unsigned long lastEdit)
{
	this->lastEdit = lastEdit;
}

SmartRoom* Profile::getSmartRoom(int index)
{
	return smartRooms.get(index);
}

SmartRoom* Profile::getSmartRoom(const String& roomId)
{
	for (int i = 0; i < smartRooms.size(); i++)
	{
		SmartRoom* smartRoom = smartRooms.get(i);
		if (smartRoom->getId() == roomId)
		{
			return smartRoom;
		}
	}
	return nullptr;
}

int Profile::getSmartRoomIndex(const String& roomId)
{
	for (int i = 0; i < smartRooms.size(); i++)
	{
		SmartRoom* smartRoom = smartRooms.get(i);
		if (smartRoom->getId() == roomId)
		{
			return i;
		}
	}
	return -1;
}

int Profile::getSmartRoomsSize()
{
	return smartRooms.size();
}

// internal
int Profile::toTrueId(String id)
{
	String trueId = id.substring(String("profile_").length());
	
	while (trueId.charAt(0) == '0')
	{
		trueId.remove(0, 1);
	};
	
	return trueId.toInt();
}

// constructors
Profile::Profile(LinkedPointerList<Room>& rooms) :
		id(idManager.acquireId()),
		name("default"),
		avatar("default"),
		lastEdit(now())
{
	for (int i = 0; i < rooms.size(); i++)
	{
		smartRooms.add(SmartRoom::create(rooms.get(i)->getId()));
	}
}

Profile::Profile(LinkedPointerList<Room>& rooms, int id) :
		id(idManager.acquireId(id)),
		name("default"),
		avatar("default"),
		lastEdit(now())
{
	for (int i = 0; i < rooms.size(); i++)
	{
		smartRooms.add(SmartRoom::create(rooms.get(i)->getId()));
	}
}

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

int Profile::getSmartRoomsSize()
{
	return smartRooms.size();
}

// constructor
Profile::Profile(LinkedPointerList<Room>& rooms) :
		id(idManager.acquireId()),
		name("default"),
		avatar("default")
{
	for (int index = 0; index < rooms.size(); index++)
	{
		smartRooms.add(SmartRoom::create(rooms.get(index)->getId()));
	}
}

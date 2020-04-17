#include "SmartRoom.h"
#include "Room.h"

// static constructor
SmartRoom* SmartRoom::create(String id)
{
	SmartRoom* smartRoom = new SmartRoom();
	
	// TODO: maybe use an updateFrom() method?
	smartRoom->setId(id);
	
	return smartRoom;
}

// destructor
SmartRoom::~SmartRoom()
{
	for (int index = 0; index < smartsets.size(); index++)
	{
		delete smartsets.get(index);
	}
}

// operations
bool SmartRoom::addSmartset(Smartset* smartset)
{
	return smartsets.add(smartset);
}

bool SmartRoom::removeSmartset(int index)
{
	Smartset* smartset = smartsets.remove(index);
	if (smartset)
	{
		delete smartset;
		return true;
	}
	return false;
}

// update
/*void SmartRoom::updateFrom(Room* room)
{
	name = room->getName();
}*/

// getters / setters
const String& SmartRoom::getId() const
{
	return id;
}

void SmartRoom::setId(const String& id)
{
	this->id = id;
}

Smartset* SmartRoom::getSmartset(int index)
{
	return smartsets.get(index);
}

Smartset* SmartRoom::getSmartset(const String& id)
{
	for (int index = 0; index < smartsets.size(); index++)
	{
		Smartset* smartset = smartsets.get(index);
		if (smartset->getId() == id)
		{
			return smartset;
		}
	}
	return nullptr;
}

Smartset* SmartRoom::getSmartsetByName(const String& name)
{
	for (int index = 0; index < smartsets.size(); index++)
	{
		Smartset* smartset = smartsets.get(index);
		if (smartset->getName() == name)
		{
			return smartset;
		}
	}
	return nullptr;
}

int SmartRoom::getSmartsetIndex(const String& id)
{
	for (int index = 0; index < smartsets.size(); index++)
	{
		if (smartsets.get(index)->getId() == id)
		{
			return index;
		}
	}
	return -1;
}

int SmartRoom::getSmartsetsSize()
{
	return smartsets.size();
}


// constructor
SmartRoom::SmartRoom() :
		id("unset")
{
}

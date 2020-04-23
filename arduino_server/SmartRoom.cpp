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
	for (int i = 0; i < smartsets.size(); i++)
	{
		delete smartsets.get(i);
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
	for (int i = 0; i < smartsets.size(); i++)
	{
		Smartset* smartset = smartsets.get(i);
		if (smartset->getId() == id)
		{
			return smartset;
		}
	}
	return nullptr;
}

Smartset* SmartRoom::getSmartsetByName(const String& name)
{
	for (int i = 0; i < smartsets.size(); i++)
	{
		Smartset* smartset = smartsets.get(i);
		if (smartset->getName() == name)
		{
			return smartset;
		}
	}
	return nullptr;
}

int SmartRoom::getSmartsetIndex(const String& id)
{
	for (int i = 0; i < smartsets.size(); i++)
	{
		if (smartsets.get(i)->getId() == id)
		{
			return i;
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

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
	for (int index = 0; index < smartItems.size(); index++)
	{
		delete smartItems.get(index);
	}
}

// operations
bool SmartRoom::add(SmartItem* smartItem)
{
	return smartItems.add(smartItem);
}

bool SmartRoom::remove(int index)
{
	SmartItem* smartItem = smartItems.remove(index);
	if (smartItem)
	{
		delete smartItem;
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

SmartItem* SmartRoom::get(int index)
{
	return smartItems.get(index);
}

SmartItem* SmartRoom::get(const String& id)
{
	for (int index = 0; index < smartItems.size(); index++)
	{
		SmartItem* smartItem = smartItems.get(index);
		if (smartItem->getId() == id)
		{
			return smartItem;
		}
	}
	return nullptr;
}

int SmartRoom::getIndex(const String& id)
{
	for (int index = 0; index < smartItems.size(); index++)
	{
		if (smartItems.get(index)->getId() == id)
		{
			return index;
		}
	}
	return -1;
}

int SmartRoom::getSize()
{
	return smartItems.size();
}


// constructor
SmartRoom::SmartRoom() :
		id("unset")
{
}

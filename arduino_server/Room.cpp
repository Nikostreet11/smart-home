#include "Room.h"

int Room::currentId = 0;

// static constructors
Room* Room::create()
{
	if (Room::currentId < Room::MAX_ROOMS)
	{
		return new Room();
	}
	else
	{
		return nullptr;
	}
}
		
/*Room::Room(String name, String icon) :
		name(name),
		icon(icon)
		{}*/

// destructor
Room::~Room()
{
	for (int index = 0; index < items.size(); index++)
	{
		delete items.get(index);
	}
}

// search
/*Item* Room::searchItem(const String& id)
{
	for (int index = 0; index < items.size(); index++)
	{
		if (items.get(index)->getId() == id)
		{
			return items.get(index);
		}
	}
	return nullptr;
}

int Room::searchItemIndex(const String& id)
{
	for (int index = 0; index < items.size(); index++)
	{
		if (items.get(index)->getId() == id)
		{
			return index;
		}
	}
	return -1;
}*/

// getters / setters
int Room::getTrueId() const
{
	return id;
}

String Room::getId() const
{
	String returnId = "room_";
	String stringId = String(id);
	
	for (int count = 0; count < (4 - stringId.length()); count++)
	{
		returnId += '0';
	}

	returnId += stringId;
	
	return returnId;
}
const String& Room::getName() const
{
	return name;
}

void Room::setName(const String& name)
{
	this->name = name;
}

const String& Room::getIcon() const
{
	return icon;
}

void Room::setIcon(const String& icon)
{
	this->icon = icon;
}

bool Room::isSmart() const
{
	return smart;
}

void Room::setSmart(bool smart)
{
	this->smart = smart;
}

Item* Room::get(int index)
{
	return items.get(index);
}

Item* Room::get(const String& id)
{
	for (int index = 0; index < items.size(); index++)
	{
		Item* currentItem = items.get(index);
		if (id == currentItem->getId())
		{
			return currentItem;
		}
	}
	return nullptr;
}

int Room::getIndex(const String& id)
{
	for (int index = 0; index < items.size(); index++)
	{
		if (items.get(index)->getId() == id)
		{
			return index;
		}
	}
	return -1;
}

bool Room::add(Item* item)
{
	if (items.size() < Room::MAX_ITEMS && item != nullptr)
	{
		items.add(item);
		return true;
	}
	else
	{
		return false;
	}
}

bool Room::remove(int index)
{
	if (index < items.size())
	{
		delete items.get(index);
		items.remove(index);
		return true;
	}
	else
	{
		return false;
	}
}

int Room::getSize()
{
	return items.size();
}

/*bool Room::turnOnItem(int index)
{
	if (0 <= index && index < items.size())
	{
		items.get(index)->turnOn();
		return true;
	}
	else
	{
		return false;
	}
}*/

/*bool Room::turnOffItem(int index)
{
	if (0 <= index && index < items.size())
	{
		items.get(index)->turnOff();
		return true;
	}
	else
	{
		return false;
	}
}*/

// constructors
Room::Room() :
		id(Room::currentId),
		name("default"),
		icon("default"),
		smart(false)
{
	Room::currentId++;
}

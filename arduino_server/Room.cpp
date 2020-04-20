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

/*bool Room::isSmart() const
{
	return smart;
}*/

/*void Room::setSmart(bool smart)
{
	this->smart = smart;
}*/

Item* Room::get(int index)
{
	return items.get(index);
}

Smartset* Room::getSmartset(int index)
{
	return smartsets.get(index);
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

Smartset* Room::getSmartset(const String& id)
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

int Room::getSmartsetIndex(const String& id)
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

bool Room::addSmartset(Smartset* smartset)
{
	if (smartsets.size() < Smartset::MAX_SMARTSETS)
	{
		for (int index = 0; index < smartset->getSmartItemsSize(); index++)
		{
			SmartItem* smartItem = smartset->getSmartItem(index);
			get(smartItem->getId())->setActive(smartItem->isActive());
		}
		smartsets.add(smartset);
		return true;
	}
	else
	{
		return false;
	}
}

bool Room::remove(int index)
{
	if (0 <= index && index < items.size())
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

bool Room::removeSmartset(int index)
{
	Serial.println(index);
	if (0 <= index && index < smartsets.size())
	{
		Smartset* targetset = smartsets.get(index);
		for (int index1 = 0; index1 < targetset->getSmartItemsSize(); index1++)
		{
			SmartItem* target = targetset->getSmartItem(index1);
			bool found = false;
			for (int index2 = 0; index2 < smartsets.size(); index2++)
			{
				Smartset* controlset = smartsets.get(index2);
				if (controlset != targetset)
				{
					SmartItem* control = controlset->getSmartItem(target->getId());
					if (control)
					{
						found = true;
					}
				}
			}

			if (!found)
			{
				get(target->getId())->setActive(false);
			}
		}
		
		delete targetset;
		smartsets.remove(index);
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

int Room::getSmartsetsSize()
{
	return smartsets.size();
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
		icon("default")
		//smart(false)
{
	Room::currentId++;
}

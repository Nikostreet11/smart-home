#include "Room.h"

IdManager Room::idManager(Room::MAX_ROOMS);

// static constructors
Room* Room::create()
{
	if (idManager.isIdAvailable())
	{
		return new Room();
	}
	else
	{
		return nullptr;
	}
}

// destructor
Room::~Room()
{
	for (int index = 0; index < items.size(); index++)
	{
		delete items.get(index);
	}
	
	idManager.releaseId(id);
}

// operations
bool Room::addItem(Item* item)
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
			getItem(smartItem->getId())->setActive(smartItem->isActive());
		}
		smartsets.add(smartset);
		return true;
	}
	else
	{
		return false;
	}
}

bool Room::removeItem(int index)
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
				getItem(target->getId())->setActive(false);
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

// getters / setters
Item* Room::getItem(int index)
{
	return items.get(index);
}

Smartset* Room::getSmartset(int index)
{
	return smartsets.get(index);
}

Item* Room::getItem(const String& id)
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

int Room::getItemIndex(const String& id)
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

int Room::getItemsSize()
{
	return items.size();
}

int Room::getSmartsetsSize()
{
	return smartsets.size();
}

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

// constructors
Room::Room() :
		id(idManager.acquireId()),
		name("default"),
		icon("default")
{
}

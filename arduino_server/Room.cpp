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
	for (int i = 0; i < items.size(); i++)
	{
		delete items.get(i);
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
		for (int i = 0; i < smartset->getSmartItemsSize(); i++)
		{
			SmartItem* smartItem = smartset->getSmartItem(i);
			Item* item = getItem(smartItem->getId());
			if (item)
			{
				item->updateFrom(smartItem);
			}
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
	if (0 <= index && index < smartsets.size())
	{
		Smartset* smartset = smartsets.get(index);
		for (int i = 0; i < smartset->getSmartItemsSize(); i++)
		{
			SmartItem* smartItem = smartset->getSmartItem(i);
			Item* item = getItem(smartItem->getId());
			if (item)
			{
				item->setDefault();
			}
			/*SmartItem* target = targetset->getSmartItem(i);
			bool found = false;
			for (int j = 0; j < smartsets.size(); j++)
			{
				Smartset* controlset = smartsets.get(j);
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
			}*/
		}
		
		delete smartset;
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
	for (int i = 0; i < items.size(); i++)
	{
		Item* currentItem = items.get(i);
		if (id == currentItem->getId())
		{
			return currentItem;
		}
	}
	return nullptr;
}

Smartset* Room::getSmartset(const String& id)
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

int Room::getItemIndex(const String& id)
{
	for (int i = 0; i < items.size(); i++)
	{
		if (items.get(i)->getId() == id)
		{
			return i;
		}
	}
	return -1;
}

int Room::getSmartsetIndex(const String& id)
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
